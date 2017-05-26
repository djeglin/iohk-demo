var FSSS = FSSS || {};

FSSS.Bg = function(container) {

//var container = document.getElementById('container');
var renderer = new FSS.WebGLRenderer();
var scene = new FSS.Scene();
var light = new FSS.Light('#ff0000', '#ff0000');
var geometry = new FSS.Plane(screen.availWidth, screen.availHeight, 15, 16);
var material = new FSS.Material('#3e3a3a', '#FFFFFF');
var mesh = new FSS.Mesh(geometry, material);
var now, start = Date.now();
var MESH = {
  width: 1.2,
  height: 1.2,
  depth: 15,
  segments: 16,
  slices: 8,
  xRange: 0.1,
  yRange: 0.1,
  zRange: 1.0,
  ambient: '#555555',
  diffuse: '#FFFFFF',
  speed: 0.005
};

function initialise() {
  scene.add(mesh);
  scene.add(light);
  container.appendChild(renderer.element);
  window.addEventListener('resize', resize);
}

function resize() {
  renderer.setSize(screen.availWidth, screen.availHeight);
}

function animate() {
  now = Date.now() - start;
  update();
  light.setPosition(300 * Math.sin(now * 0.001), 200 * Math.cos(now * 0.0005), 60);
  renderer.render(scene);
  requestAnimationFrame(animate);
}

var v, vertex;
for (v = geometry.vertices.length - 1; v >= 0; v--) {
  vertex = geometry.vertices[v];
  vertex.anchor = FSS.Vector3.clone(vertex.position);
  vertex.step = FSS.Vector3.create(
    Math.randomInRange(0.2, 1.0),
    Math.randomInRange(0.2, 1.0),
    Math.randomInRange(0.2, 1.0)
  );
  vertex.time = Math.randomInRange(0, Math.PIM2);
}

function update() {
  var ox, oy, oz, v, vertex, offset = MESH.depth / 2;

  // Animate Vertices
  for (v = geometry.vertices.length - 1; v >= 0; v--) {
    vertex = geometry.vertices[v];
    ox = Math.sin(vertex.time + vertex.step[0] * now * MESH.speed);
    oy = Math.cos(vertex.time + vertex.step[1] * now * MESH.speed);
    oz = Math.sin(vertex.time + vertex.step[2] * now * MESH.speed);
    FSS.Vector3.set(vertex.position,
      MESH.xRange * geometry.segmentWidth * ox,
      MESH.yRange * geometry.sliceHeight * oy,
      MESH.zRange * offset * oz - offset);
    FSS.Vector3.add(vertex.position, vertex.anchor);
  }

  // Set the Geometry to dirty
  geometry.dirty = true;
}

initialise();
resize();
update();
animate();


};