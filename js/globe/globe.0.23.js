var DAT = DAT || {};

DAT.Globe = function(container, opts) {


  var AUTOROTATE_DELAY = 10000;
  var AUTOROTATE_RESUME_DELAY = 10000;
  var animDuration = 8000; // carousel anim duration


  opts = opts || {};
  
  var colorFn = opts.colorFn || function(x) {
    var c = new THREE.Color();
    c.setHSL( ( 0.6 - ( x * 0.5 ) ), 1.0, 0.5 );
    return c;
  };
  var imgDir = opts.imgDir || '/globe/';

  var Shaders = {
    'earth' : {
      uniforms: {
        'texture': { type: 't', value: null }
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          'vNormal = normalize( normalMatrix * normal );',
          'vUv = uv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D texture;',
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'vec3 diffuse = texture2D( texture, vUv ).xyz;',
          'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
          'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
          'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
        '}'
      ].join('\n')
    },
    'atmosphere' : {
      uniforms: {},
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
          'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
        '}'
      ].join('\n')
    }
  };

  var camera, scene, renderer, w, h;
  var mesh, atmosphere, point;

  var currentLocation = 1;
  var locations,locIndex,projector;

  var overRenderer;

  var curZoomSpeed = 0;
  var zoomSpeed = 50;

  var mouse = { x: 0, y: 0 }, mouseOnDown = { x: 0, y: 0 };
  

  var rotation = { x: 0, y: 0 }, startPoint = { x:0, y:0 },
      target = { x: Math.PI*3/2, y: Math.PI / 6.0 },
      targetOnDown = { x: 0, y: 0 };


  var distance = 100000, distanceTarget = 100000;
  var padding = 40;
  var PI_HALF = Math.PI / 2;

  function init() {

    var shader, uniforms, material;
    w = container.offsetWidth || window.innerWidth;
    h = container.offsetHeight || window.innerHeight;

    camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);

    
    camera.position.z = distance;

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry(200, 40, 30);

    shader = Shaders['earth'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);


    var my_TextureLoader = new THREE.TextureLoader();
    uniforms['texture'].value = my_TextureLoader.load(temppath+'globe.jpg');

    material = new THREE.ShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader

        });

    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI;
    scene.add(mesh);

    shader = Shaders['atmosphere'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    material = new THREE.ShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true

        });

    mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set( 1.1, 1.1, 1.1 );
    scene.add(mesh);

    geometry = new THREE.BoxGeometry(0.75, 0.75, 1);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-0.5));


    var inverse = new THREE.Matrix4();

    /* Add markers to the globe */
    //setTimeout(function() {
    locations = clusterLocations(Coords);
    //console.log(locations);
    //var transform = THREE.Matrix4.makeInvert(scene.matrix);
    var transform = inverse.getInverse( scene.matrix );
    

    for (var i=0; i<locations.length; i++) {
      var loc = locations[i];
      if (loc.coords[1] == null || isNaN(loc.coords[1]) 
          || loc.coords[0] == null || isNaN(loc.coords[0])) {
        locations.splice(i,1);
        i--;
        continue;
      }
      //console.log(loc);

      loc.x = -Math.PI/2+loc.coords[1] * Math.PI/180;
      loc.y = loc.coords[0] * Math.PI/180;
      loc.point = createPoint(transform, loc.coords[0], loc.coords[1]);
      loc.marker = createMarker(loc.name, loc.locations);
      loc.marker.location = loc;
      loc.marker.onclick = function(ev) {
        gotoLocation(this.location);
        ev.preventDefault();
      };
      loc.point.location = loc;
      loc.point.updateMatrix();
      scene.add(loc.point);
    }
    locIndex = 1;
    currentLocation = locations[locIndex];
    /* Start the location carousel */
    startAutoRotate = function() {
      locIndex = (locIndex+1) % locations.length;
      currentLocation = locations[locIndex];
      gotoLocation(currentLocation);
      autoRotate = true;
      autoRotateTimeout = setTimeout(startAutoRotate, AUTOROTATE_DELAY);
    };
    //startAutoRotate();




    point = new THREE.Mesh(geometry);

    renderer = new THREE.WebGLRenderer({antialias: true,alpha: true});
    renderer.setSize(w, h);

    renderer.domElement.style.position = 'absolute';

    container.appendChild(renderer.domElement);

    //container.addEventListener('mousedown', onMouseDown, false);

    window.addEventListener('resize', onWindowResize, false);

    container.addEventListener('mouseover', function() {
      overRenderer = true;
    }, false);

    container.addEventListener('mouseout', function() {
      overRenderer = false;
    }, false);
  }








  createMarker = function(title, list) {
    var marker = document.createElement('div');
    marker.className = 'marker-container';
    var markerIn = document.createElement('div');
    markerIn.className = 'marker';

    marker.appendChild(markerIn);
   
    var d = document.createElement('div');
    d.textContent = title;
    //d.textContent = title;
    //markerIn.appendChild(d);
    return marker;
  };


  /* Carousel to the given location */  
  function gotoLocation(location) {
    currentLocation = location;
    startTime = new Date().getTime();
    startPoint.x = rotation.x;
    startPoint.y = rotation.y;
    target.y = location.y;
    target.x = location.x;
  }

  /* Stop carousel advance */
  function stopAutoRotate() {
    autoRotate = false;
  }



  /* Create point at given lat-lon coords */
  function createPoint(transform, latDeg, lonDeg) {
    var lat = latDeg * Math.PI/180;
    var lon = lonDeg * Math.PI/180;
    var r = 200;
    var p = new THREE.Vector3(
      -r * Math.cos(lat) * Math.cos(lon),
      r * Math.sin(lat),
      r * Math.cos(lat) * Math.sin(lon)
    );
    var m = transform;
    //p = m.multiplyVector3(p);
    p = p.applyMatrix4( m );
    //vector.applyMatrix4( matrix )

    var geometry = new THREE.BoxGeometry(0.1,0.1,0.01,4,4,4);
    var point = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xff0000
    }));
    point.lookAt(p);
    point.position = p;
    point.is_a_point = true;
    return point;
  }

  /* Cluster locations by binning them */
  function clusterLocations(locations) {
    var coords = {};
    for (var i=0; i<locations.length; i++) {
      var loc = locations[i];
      var lat = Math.round(loc.coords[0]/5);
      var lon = Math.round(loc.coords[1]/5);
      var k = lat + ':' + lon;

      if (k != undefined) {
        if (coords[k] == null) {
          coords[k] = [];
        }
        coords[k].push(loc);
      }
    }
    var locs = [];
    for (var k in coords) {
      var c = coords[k];
      var lat = 0;
      var lon = 0;
      for (var i=0; i<c.length; i++) {
        lat += c[i].coords[0];
        lon += c[i].coords[1];
      }
      lat /= c.length;
      lon /= c.length;
      var cluster = {
        coords: [lat, lon],
        //name: c.length,
        name: c[0].name,
        locations: c
      };

      //console.log(c[0].name);
      locs.push(cluster);
    }
    return locs;
  } // end clusterLocations




  function resetMarkers() {
    for (var i=0; i<locations.length; i++) {
      locations[i].marker.setAttribute('current', 'false');
    }
  }

  function updateMarkers() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var aspect = w/h;
    var w2 = w/2;
    var h2 = h/2;
    var current = null;

    renderer.domElement.style.zIndex = 1000000;

    var mat = new THREE.Matrix4();
    var v = new THREE.Vector3();
    var zeroZ = null;
    var visible = 0;
    for (var i=0; i<locations.length; i++) {
      mat.copy(scene.matrix);
      if (zeroZ == null) {
        v.set(0,0,0);
        //mat.multiplyVector3(v);
        v.applyMatrix4(mat);
        projector.projectVector(v, camera);
        zeroZ = v.z;
      }
      mat.multiplySelf(locations[i].point.matrix);
      v.set(0,0,0);
      //mat.multiplyVector3(v);
      v.applyMatrix4(mat);

      projector.projectVector(v, camera);
      var x = w*(v.x+1)/2;
      var y = h-h*(v.y+1)/2;
      var z = v.z - zeroZ;
      var m = locations[i].marker;
      if (y > h+50) {
        if (m.visible) {
          m.style.display = 'none';
          m.visible = false;
        }
      } else  {
        if (!m.visible) {
          m.style.display = 'block';
          m.visible = true;
        }
        m.style.left = x+'px';
        m.style.top = y+'px';
        if (currentLocation == locations[i] && currentLocation.marker.getAttribute('current') == 'true') {
          m.style.zIndex = 10000000;
        } else {
          m.style.zIndex = Math.round(1000000 - 1000000*z);
        }
        if (distance < 270 && m.style.opacity != 1) {
          m.style.opacity = 1;
          m.style.webkitTransform = 'translateZ(0) rotateY(0deg)';
        }
        m.firstChild.style.opacity = (1 - (Math.abs(x-(w/2)) / (w/2)));
        if (m.parentNode == null) {
          container.appendChild(m);
        }
        if (m.style.zIndex < renderer.domElement.style.zIndex) {
          m.firstChild.style.pointerEvents = 'none';
        } else {
          m.firstChild.style.pointerEvents = 'auto';
        }
      }
    }
  }

  function onMouseDown(event) {
    event.preventDefault();

    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('mouseout', onMouseOut, false);

    mouseOnDown.x = - event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;

    container.style.cursor = 'move';
  }

  function onMouseMove(event) {
    mouse.x = - event.clientX;
    mouse.y = event.clientY;

    var zoomDamp = distance/1000;

    target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
    target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

    target.y = target.y > PI_HALF ? PI_HALF : target.y;
    target.y = target.y < - PI_HALF ? - PI_HALF : target.y;
  }

  function onMouseUp(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
    container.style.cursor = 'auto';
  }

  function onMouseOut(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
  }

  function onWindowResize( event ) {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
  }

  function zoom(delta) {
    distanceTarget -= delta;
    distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
    distanceTarget = distanceTarget < 350 ? 350 : distanceTarget;
  }




  function arr_deselect(cls) {
    var nav_items = document.getElementsByClassName(cls);
      if(nav_items.length != undefined){
      for(var i=0;i<nav_items.length;i++){
        nav_items[i].className = cls;
      }
    }
  }

  function arr_select(which,cls) {
    var nav_items = document.getElementsByClassName(cls);
    if(nav_items[which] != undefined){
      nav_items[which].className = cls+' open';
    }
  }


  function getLocationId(loc) {
    var it = 0;
    for(var i=0;i<locations.length;i++){
      if(locations[i].x == loc.x){
        it = i;
      }
    }
    return it;
  }


  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    zoom(curZoomSpeed);

    rotation.x += (target.x - rotation.x) * 0.1;
    rotation.y += (target.y - rotation.y) * 0.1;
    distance += (distanceTarget - distance) * 0.3;

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = distance * Math.sin(rotation.y);
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    camera.lookAt(mesh.position);

    renderer.render(scene, camera);
  }

  init();
  this.animate = animate;





  autoRotate = false;
  
  var place_cycled = 0;
  var io_loc_arr = new Array();
  var wheretogo = document.getElementById('io_data_globe');
  var newCoords = new Array();
  locIndex = 0;


  var new_coords = new Array();
  locIndex = 0;


  function io_town_coords(town) {    
    var it = 0;
    for(var i=0;i<locations.length;i++){
      if(locations[i].name.toLowerCase() == town.toLowerCase()){
        it = i;
      }
    }
    return it;
  }

  function io_load_data() {
    jQuery(".io_data_globe_profile").each(function(){
      new_coords.push(io_town_coords(jQuery(this).data('coords')));
    });
  }

  function io_startAutoRotate() {
    //console.log(locIndex);
    jQuery("#io_data_globe-box").removeClass('loaded');
    arr_deselect('io_data_globe_profile');
    locIndex = (locIndex) % new_coords.length;
    currentLocation = locations[new_coords[locIndex]];
    gotoLocation(currentLocation);
    setTimeout(function(){
      jQuery("#io_data_globe-box").addClass('loaded');
    },1300);
    //autoRotate = true;
    arr_select(locIndex,'io_data_globe_profile');

    locIndex++;
    if(locIndex == new_coords.length){
      locIndex = 0;
    }

    setTimeout(io_startAutoRotate, 7000);
  }

  var wheretogo = document.getElementById('io_data_globe');
  var io_globe_type = wheretogo.getAttribute('class');

  if(io_globe_type == 'multi'){
    io_load_data();
    io_startAutoRotate();
    setTimeout(function(){
      jQuery("#io_data_globe-box").addClass('loaded');
      setTimeout(function(){
        jQuery("#io_data_globe_desc").fadeIn(500);
      },1000);
    },500);

  }else{

    //setTimeout(function(){
      io_coords = wheretogo.getAttribute('data-coords');
      gotoLocation(locations[io_town_coords(io_coords)]);
      setTimeout(function(){
        jQuery("#io_data_globe-box").addClass('loaded');
      },3600);
    //},300);

  }








  this.__defineGetter__('time', function() {
    return this._time || 0;
  });

  this.__defineSetter__('time', function(t) {
    var validMorphs = [];
    var morphDict = this.points.morphTargetDictionary;
    for(var k in morphDict) {
      if(k.indexOf('morphPadding') < 0) {
        validMorphs.push(morphDict[k]);
      }
    }
    validMorphs.sort();
    var l = validMorphs.length-1;
    var scaledt = t*l+1;
    var index = Math.floor(scaledt);
    for (i=0;i<validMorphs.length;i++) {
      this.points.morphTargetInfluences[validMorphs[i]] = 0;
    }
    var lastIndex = index - 1;
    var leftover = scaledt - index;
    if (lastIndex >= 0) {
      this.points.morphTargetInfluences[lastIndex] = 1 - leftover;
    }
    this.points.morphTargetInfluences[index] = leftover;
    this._time = t;
  });

  this.renderer = renderer;
  this.scene = scene;

  return this;

};

