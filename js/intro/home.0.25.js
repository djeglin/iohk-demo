var io_intro_animation = null;
var io_intro_num = 0;

var use_shader = 0;

var intro_label = new Array();
intro_label[0] = 'Decentralisation';
intro_label[1] = 'Complexity is beautiful';

var io_intro_swatches = new Array();
io_intro_swatches[0] = new Array();
io_intro_swatches[1] = new Array('#ffffff','#00FFFF','#ff0000','#FFFA00','#00EE76','#FFFF00','#EE7600','#EE7AE9','#00EE76');



function io_intro() {

	$('#in0').mouseParallax({ moveFactor: -5 });
	$('#in1').mouseParallax({ moveFactor: 10 });
	$('#in2').mouseParallax({ moveFactor: -15 });
	$('#in3').mouseParallax({ moveFactor: 20 });
	$('#in4').mouseParallax({ moveFactor: 10 });
				
	//$("#entry h1 span").typewriter();

	setTimeout(function(){

		$("#entry .desc").removeClass('none');
		//$("#entry .desc").scrambledWriter();

		setTimeout(function(){

			jQuery("#io_intro_ignit,#io_intro_start").addClass('in');
			
		},150);

	},200);

	//io_intro_init();

    $("#io_intro_ignit,#io_intro_start-0").click(function(){
	    io_intro_init();
    });
    $("#io_intro_start-1").click(function(){
    	io_intro_num = 1;
	    io_intro_init();
    });




}

function io_intro_pauseplay() {
    if (io_intro_animation.isRunning()){
    	if(io_intro_num == 0){
	        io_intro_animation.stop();
	    }else{
	        io_intro_animation.pause();
	    }
    }else{
        io_intro_animation.run();
    }
}

function io_intro_init(){

	$("#entry").addClass('off');
	$("#intro_parallax").addClass('off');
	$("#io_intro").removeClass('waiting');

	var ww = jQuery(window).width();
	var wh = jQuery(window).height();

	if(webglIE){

		if(ww > 320){

			if(webglAvailable){
				
				io_intro_gui();
				io_intro_render();
				/*
				jQuery("#io_intro_nav").show(0);
				jQuery(".intro_gui-"+io_intro_num).addClass('opened');
				jQuery("#io_intro_label strong").text(intro_label[io_intro_num]);
				*/
			}else{
				jQuery("#intro_loading").addClass('in');
				jQuery("#entry").show(0);
				jQuery("#entry .btn").hide(0);
				jQuery("#entry").append('<h2>No WebGL support. Real shame.</h2>');
				jQuery("#io_intro").removeClass('in');
			}

		}else{
			jQuery("#intro_loading").addClass('in');
			jQuery("#entry").show(0);
			jQuery("#entry .btn").hide(0);
			jQuery("#io_intro").removeClass('in');
		}

	
	}else{
		jQuery("#intro_loading").addClass('in');
		jQuery("#entry").show(0);
		jQuery("#entry .btn").hide(0);
		jQuery("#io_intro").removeClass('in');
	}

}


function io_intro_kill(){
	if(io_intro_animation != null){
		io_intro_animation.stop();
		io_intro_animation = null;
		jQuery("#io_intro").empty();
	}
	jQuery("#io_intro_nav").hide(0);
}



var io_intro_gui_setup = false;
function io_intro_gui(){
	//alert(sec);
	//jQuery("#intro_gui_loader").html(intro_gui_set_var[sec]); io_intro_num
	//<div id="intro_gui-0" class="row intro_gui_row">

	jQuery(".io_intro_zoom").slider({
		max: 16,
		max: 80,
		value: 16,
		change: function( event, ui ) {
			if(io_intro_animation != null){
				io_intro_animation.updateZoom(ui.value);
			}
			jQuery("#io_intro_zoom_val").val(ui.value);
		}
	});

	jQuery(".intro_gui-0 .colors .swatches").each(function(index){
		jQuery(this).append(io_color_swatches(0,index,8));
	});
	jQuery(".intro_gui-1 .colors .swatches").each(function(index){
		jQuery(this).append(io_color_swatches(1,index,9));
	});

	jQuery("#io_intro_nav .dropdown-menu a").click(function(e){
		var txt = jQuery(this).text();
		jQuery(this).parent().parent().prev().find('.lab').text(txt);
	});

	jQuery("#io_intro2_distance").slider({
		max: 0,
		max: 300,
		value: 0,
		change: function( event, ui ) {
			if(io_intro_animation != null){
				io_intro_animation.changeSampleDistance(ui.value/200);
			}
		}
	});
	jQuery("#io_intro2_wave").slider({
		max: 0,
		max: 60,
		value: 0,
		change: function( event, ui ) {
			if(io_intro_animation != null){
				io_intro_animation.changeWaveFactor(ui.value/500);
			}
		}
	});
	jQuery("#io_intro2_expand").slider({
		max: 0,
		max: 300,
		value: 165,
		change: function( event, ui ) {
			if(io_intro_animation != null){
				io_intro_animation.expandTo(ui.value/100);
			}
		}
	});
	jQuery("#io_intro2_size").slider({
		max: 0,
		max: 200,
		value: 120,
		change: function( event, ui ) {
			if(io_intro_animation != null){
				io_intro_animation.resizeTo(ui.value/100);
			}
		}
	});

	jQuery("#io_intro_nav-opener").click(function(){

		if(!jQuery('#io_intro_nav').hasClass('ok')){
			setTimeout(function(){
				jQuery('#io_intro_nav').addClass('ok');
			},500);
		}else{
			jQuery('#io_intro_nav').removeClass('ok');
		}

	});

	jQuery("#io_intro_gui-play").attr('class','play pause');

}



function io_intro_render(){
	var parameters = {};
	io_intro_animation = null;


	var ww = jQuery(window).width();
	var wh = jQuery(window).height();

	setTimeout(function(){
		if(is_safari){
			use_shader = 1;
		}
		
        parameters = { 
            'particle_path' : "/js/intro/textures/particle3.png",
            'container_id' : "io_intro",
            'renderer_id' : "io_intro_renderer",
            'stats_id' : "io_intro_stats",
            "gui_id" : "io_intro_gui",
            "background_color" : "#ff0000",
            "electrolized_path" : '/js/intro/libs/electrolized.js',
            "spec_path1"  : '/js/intro/textures/spec_body_squared.jpg',
            "spec_path2"  : '/js/intro/textures/spec_body5.jpg',
            "spec_path3"  : '/js/intro/textures/spec_line2.jpg',
            "spec_path4"  : '/js/intro/textures/spec_body11.jpg',
            "shader_to_use" : use_shader,
            "header_text" :" ",
            "focal_length_name" :" ",
            "quality_name" :'  ',
            "color_theme_name" : '  ',
            "main_color_name" : ' ',
            "secondary_color_name" : ' ',
            "spheres_color_name" : ' ',
            "next_name" : 'next ',
            "play_name" : 'play ',
            "pause_name" : 'pause ',
            "reset_name" : 'reset ',
            "next_animation_name" : ' ',
            //VERSION 4.5"
            "focal_length_init_val" : 20,
            //VERSION 4.6
            "spec_path"  : '/js/intro/textures/spec_body56B.jpg',
	        "background_stars_count" : 100,
	        "now_playing" : io_intro_num,

	        //params for anim 2
            "initial_rule" : undefined, //
            "initial_theme" : "sky", //
            "initial_primary_color" : undefined,
            "initial_secondary_color" : undefined,
            "initial_background_color" : "#0A0001"
        }

        function onDocumentKeyDown( event ) {
            if (event.keyCode == 32){
                io_intro_pauseplay();
            }
        }

        if(io_intro_animation == null){
	        io_intro_animation = new Animation01(function(){
	        	alert("nogl");
	        	jQuery("#io_intro_nav").hide(0);
	        	jQuery("#entry").show(0);
				jQuery("#io_intro").removeClass('in');

			});
        }

        
		io_intro_animation.setup(parameters,function(){

			jQuery(".intro_gui-"+io_intro_num).addClass('opened');

			jQuery("#io_intro_label strong").text(intro_label[io_intro_num]);


			

	        document.addEventListener('keydown',onDocumentKeyDown,false);

	        document.getElementById("io_intro_gui-play").addEventListener("click", function(){io_intro_pauseplay();}); 
	        document.getElementById("io_intro_gui-refresh").addEventListener("click", function(){
	        	io_intro_animation.reset();
	        	io_intro_default_gui();
	        }); 
	        document.getElementById("io_intro_gui-forward").addEventListener("click", function(){

				jQuery("#io_intro").addClass('switch');

	        	setTimeout(function(){

	        	  	io_intro_animation.next();
	        	  	io_intro_animation.reset();
	        	  	if (!io_intro_animation.isRunning()){
				        io_intro_animation.run();
				    }
	        	  	io_intro_default_gui();
		        	io_intro_num++;
					if(io_intro_num > 1){
						io_intro_num = 0;
					}
					jQuery("#io_intro_label strong").text(intro_label[io_intro_num]);

					jQuery(".intro_gui_row.opened").removeClass('opened');
					jQuery(".intro_gui-"+io_intro_num).addClass('opened');
					jQuery("#io_intro").removeClass('switch');
				
				},1000);
	        });




	      	io_intro_animation.reset();

			//jQuery("#io_intro_renderer").css({height:wh+'px'});
			jQuery("#io_intro").addClass('in');
			if(io_intro_num == 0){
				if(ww < wh){
					io_intro_animation.updateZoom(32);
				}else{
					io_intro_animation.updateZoom(16);

				}
				io_intro_animation.updateTheme(1);
				io_intro_animation.updateColorMain('#ff0000');
			}
	    	io_intro_animation.run();
	    	jQuery("#entry").hide(0);
	    	jQuery("#io_intro_nav").show(0);
	    	jQuery("#intro_loading").addClass('in');

        },
        function(){
            console.log("animation has ended")
        });
		

	},500);
}



function io_color_swatches(an, sec, num){
	var fun = 'io_intro_animation.updateColorMain';
	if(an == 1){
		fun = 'io_intro_theme2_colors';
	}
	if(sec == 1){
		fun = 'io_intro_animation.updateColorSecondary';
		if(an == 1){
			fun = 'changeColorSecondary';
		}
	}
	if(sec == 2){
		fun = 'io_intro_animation.updateColorSphere';
	}
	var out = '';
	for(var i=0;i<num;i++){
		var clr = io_intro_colors.random();
		if(an == 1){
			clr = io_intro_swatches[1][i];
		}
		out += '<a class="swatch rounded" style="background:'+clr+'" href="javascript:'+fun+'(';
		out += "'"+clr+"'";
		out += ')"></a>';
	}
	return out;
}




function io_intro_theme2_colors(col) {
	io_intro_animation.changeColorMain(col);
	io_intro_animation.changeColorSecondary(col);
}

function io_intro_theme_update(sec,th) {
	if(sec == 1){
    	if(th == 0){
    		io_intro_animation.changeThemeTo('radioactive');
    		//io_intro_animation.changeRuleTo('organic');
    	}
    	if(th == 1){
    		io_intro_animation.changeThemeTo('sky');
    		//io_intro_animation.changeRuleTo('whale');
    	}
    	if(th == 2){
    		io_intro_animation.changeThemeTo('oasis');
    		//io_intro_animation.changeRuleTo('city');
    	}
    	if(th == 3){
    		io_intro_animation.changeThemeTo('hallucination');
    		//io_intro_animation.changeRuleTo('pong');
    	}
	}
}



function io_intro_default_gui() {

	jQuery(".io_intro_zoom").slider({value: 16});
	if(io_intro_num == 1){

		jQuery("#io_intro2_distance").slider({value: 0});
		jQuery("#io_intro2_wave").slider({value: 0});
		jQuery("#io_intro2_expand").slider({value:165});
		jQuery("#io_intro2_size").slider({value:120});

		io_intro_animation.changeColorMain('#bb4773');
		io_intro_animation.changeColorSecondary('#8e669b');
		io_intro_animation.changeThemeTo('berry');
		io_intro_animation.changeRuleTo('variable');

		io_intro_animation.changeSampleDistance(0);
		io_intro_animation.changeWaveFactor(0);
		io_intro_animation.expandTo(1);
		io_intro_animation.resizeTo(1);


	}

}












