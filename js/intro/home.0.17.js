var io_intro_animation = null;
var io_intro_num = 0;

var use_shader = 0;

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

    $("#io_intro_ignit,#io_intro_start").click(function(){
    	
    	//setTimeout(function(){
	    	io_intro_init();
		//},200);

    });
}

function io_intro_pauseplay() {
    if (io_intro_animation.isRunning()){
        io_intro_animation.stop();
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
				jQuery("#io_intro_nav").show(0);

			}else{
				jQuery("#intro_loading").addClass('in');
				jQuery("#entry").show(0);
				jQuery("#entry").append('<h2>No WebGL support. Real shame.</h2>');
				jQuery("#io_intro").removeClass('in');
			}

		}else{
			jQuery("#intro_loading").addClass('in');
			jQuery("#entry").show(0);
			jQuery("#io_intro").removeClass('in');
		}

	
	}else{
		jQuery("#intro_loading").addClass('in');
		jQuery("#entry").show(0);
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

	//if(sec == 0){
		//io_intro_gui_setup = true;
		jQuery(".io_intro_zoom").slider({
			max: 16,
			max: 80,
			value: 20,
			change: function( event, ui ) {
				io_intro_animation.updateZoom(ui.value);
			}
		});

		jQuery(".intro_gui-0 .colors .swatches").each(function(index){
			jQuery(this).append(io_color_swatches(index,9));
		});
		jQuery(".intro_gui-1 .colors .swatches").each(function(index){
			jQuery(this).append(io_color_swatches(index,4));
		});



	//}

	/*
	if(sec == 1){
		//io_intro_gui_setup = true;
		jQuery("#io_intro_zoom").slider({
			max: 16,
			max: 32,
			value: 20,
			change: function( event, ui ) {
				io_intro_animation.updateZoom(ui.value);
			}
		});

		jQuery(".intro_nav .colors .swatches").each(function(index){
			jQuery(this).append(io_color_swatches(index,4));
		});
	}
*/
	jQuery("#io_intro_nav-opener").click(function(){
		setTimeout(function(){
			io_class_toggle('#io_intro_nav','ok');
		},1200);
	});

	jQuery("#io_intro_gui-play").attr('class','play pause');

}



function io_intro_render(){
	var parameters = {};
	io_intro_animation = null;


	var ww = jQuery(window).width();
	var wh = jQuery(window).height();

	//setTimeout(function(){
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
	        "now_playing" : 0,

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

	        	jQuery("#io_intro_nav").hide(0);
	        	jQuery("#entry").show(0);
				jQuery("#io_intro").removeClass('in');

			});
        }

        
		io_intro_animation.setup(parameters,function(){

			//io_intro_animation.updateCanvas();
			jQuery(".intro_gui-"+io_intro_num).show(0);

	        document.addEventListener('keydown',onDocumentKeyDown,false);

	        document.getElementById("io_intro_gui-play").addEventListener("click", function(){io_intro_pauseplay();}); 
	        document.getElementById("io_intro_gui-refresh").addEventListener("click", function(){io_intro_animation.reset();}); 
	        document.getElementById("io_intro_gui-forward").addEventListener("click", function(){
	        	io_intro_animation.next();
	        	io_intro_num++;
				if(io_intro_num > 1){
					io_intro_num = 0;
				}
				jQuery(".intro_gui_row").hide(0);
				jQuery(".intro_gui-"+io_intro_num).show(0);
	        });

	      	io_intro_animation.reset();

			//jQuery("#io_intro_renderer").css({height:wh+'px'});
			jQuery("#io_intro").addClass('in');

			if(ww < wh){
				io_intro_animation.updateZoom(32);
			}
			io_intro_animation.updateTheme(1);
			io_intro_animation.updateColorMain('#ff0000');
	    	io_intro_animation.run();
	    	jQuery("#io_intro_nav").show(0);
	    	jQuery("#intro_loading").addClass('in');

        },
        function(){
            console.log("animation has ended")
        });
		

	//},1300);
}



function io_color_swatches(sec, num){
	var fun = 'updateColorMain';
	if(sec == 1){
		fun = 'updateColorSecondary';
	}
	if(sec == 2){
		fun = 'updateColorSphere';
	}
	var out = '';
	for(var i=0;i<num;i++){
		var clr = io_intro_colors.random();
		out += '<button type="button" class="swatch rounded" style="background:'+clr+'" onclick="io_intro_animation.'+fun+'(';
		out += "'"+clr+"'";
		out += ')"></button>';
	}
	return out;
}










