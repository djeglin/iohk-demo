var io_intro_animation = null;
var io_intro_section = 0;

function io_intro() {


	//$("#entry h1 span").typewriter();

	setTimeout(function(){

		$("#entry .desc").removeClass('none');
		//$("#entry .desc").scrambledWriter();

		setTimeout(function(){

			jQuery("#io_intro_ignit,#io_intro_start").addClass('in');
			
		},1500);

	},2000);
	io_intro_init();
    $("#io_intro_ignit,#io_intro_start").click(function(){
    	$("#entry").addClass('off');
    	$("#io_intro").removeClass('waiting');
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

function io_intro_pauseplay() {
    if (io_intro_animation.isRunning()){
        io_intro_animation.stop();
    }else{
        io_intro_animation.run();
    }
}

function io_intro_init(){

	var ww = jQuery(window).width();
	var wh = jQuery(window).height();

	if(webglIE){

		if(ww > 320){

			if(webglAvailable){


				io_intro_gui(io_intro_section);
				/*
				setTimeout(function(){
			        var parameters = {}

			        var use_shader = 0;
			        if(is_safari){
			        	use_shader = 1;
			        }

			        parameters = { 
			            'particle_path' : "/js/intro/textures/particle3.png",
			            'container_id' : "io_intro",
			            'renderer_id' : "io_intro_renderer",
			            'stats_id' : "io_intro_stats",
			            "gui_id" : "io_intro_gui",
			            "electrolized_path" : '/js/intro/libs/electrolized.js',
			            "spec_path1"  : '/js/intro/textures/spec_body_squared.jpg',
			            "spec_path2"  : '/js/intro/textures/spec_body5.jpg',
			            "spec_path3"  : '/js/intro/textures/spec_line2.jpg',
			            "spec_path4"  : '/js/intro/textures/spec_body11.jpg',
			            //here : 0 new version with transparencies, 1 first version with black background.
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
				        "background_stars_count" : 100
			        }

			        function onDocumentKeyDown( event ) {
			            if (event.keyCode == 32){
			                io_intro_pauseplay();
			            }
			        }
		  
			        if(io_intro_animation == null){
				        io_intro_animation = new Animation01();

			        }

			        
					io_intro_animation.setup(parameters,function(){

						io_intro_animation.updateCanvas();

				        document.addEventListener('keydown',onDocumentKeyDown,false);

				        document.getElementById("io_intro_gui-play").addEventListener("click", function(){io_intro_pauseplay();}); 
				        document.getElementById("io_intro_gui-refresh").addEventListener("click", function(){io_intro_animation.reset();}); 
				        //document.getElementById("io_intro_gui-forward").addEventListener("click", function(){io_intro_animation.forward();});*Graphics* Make theme 2 "Red" default. Title them "Red" - "Grey" - "Blue"

				        document.getElementById("intro_quality-1").addEventListener("click", function(){jQuery("#pop-quality").addClass('none');jQuery("#poper-quality .val").text('Default');io_intro_animation.updateQuality(0);}); 
				        document.getElementById("intro_quality-2").addEventListener("click", function(){jQuery("#pop-quality").addClass('none');jQuery("#poper-quality .val").text('Low');io_intro_animation.updateQuality(1);}); 
				        document.getElementById("intro_quality-3").addEventListener("click", function(){jQuery("#pop-quality").addClass('none');jQuery("#poper-quality .val").text('Medium');io_intro_animation.updateQuality(2);}); 
				        document.getElementById("intro_quality-4").addEventListener("click", function(){jQuery("#pop-quality").addClass('none');jQuery("#poper-quality .val").text('High');io_intro_animation.updateQuality(3);}); 

				        document.getElementById("intro_theme-1").addEventListener("click", function(){jQuery("#pop-theme").addClass('none');jQuery("#poper-theme .val").text('Red');io_intro_animation.updateColorMain('#ff0000');io_intro_animation.updateTheme(1);}); 
				        document.getElementById("intro_theme-2").addEventListener("click", function(){jQuery("#pop-theme").addClass('none');jQuery("#poper-theme .val").text('Grey');io_intro_animation.updateColorMain('#999999');io_intro_animation.updateTheme(0);}); 
				        document.getElementById("intro_theme-3").addEventListener("click", function(){jQuery("#pop-theme").addClass('none');jQuery("#poper-theme .val").text('Blue');io_intro_animation.updateColorMain('#00AEFF');io_intro_animation.updateTheme(2);}); 
				      	
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

			        },function(){

			        	jQuery("#io_intro_nav").hide(0);
			        	jQuery("#entry").show(0);
						jQuery("#io_intro").removeClass('in');

					},
		            function(){
		                console.log("animation has ended")
		            });
					

				},1300);*/
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
	//if(io_intro_animation != null){
	//	io_intro_animation.stop();
	//	io_intro_animation = null;
	//	jQuery("#io_intro").empty();
	//}
}

var io_intro_gui_setup = false;
function io_intro_gui(sec){
	jQuery("#intro_gui_loader").html(intro_gui_set[sec]);
	if(sec == 0){
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
			jQuery(this).append(io_color_swatches(index));
		});

		jQuery("#io_intro_nav-opener").click(function(){
			setTimeout(function(){
				io_class_toggle('#io_intro_nav','ok');
			},1200);
		});
		jQuery("#io_intro_gui-play").attr('class','play pause');
	}


}




function io_color_swatches(sec){
	var fun = 'updateColorMain';
	if(sec == 1){
		fun = 'updateColorSecondary';
	}
	if(sec == 2){
		fun = 'updateColorSphere';
	}
	var out = '';
	for(var i=0;i<8;i++){
		var clr = io_intro_colors.random();
		out += '<button type="button" class="swatch rounded" style="background:'+clr+'" onclick="io_intro_animation.'+fun+'(';
		out += "'"+clr+"'";
		out += ')"></button>';
	}
	return out;
}


var intro_gui_set = new Array();

intro_gui_set[0] =  '<div class="col col-lg-11">\
						<div class="palette zoom">\
							<b>Zoom</b>\
							<div id="io_intro_zoom"></div>\
						</div>\
						<div class="palette quality">\
							<div class="btn-group dropup">\
								<a href="javascript:;" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
									Quality <span class="caret"></span>\
								</a>\
								<ul class="dropdown-menu">\
									<li><a id="intro_quality-1" type="button" class="btn btn-default btn-sm rounded" href="javascript:;">Default</a></li>\
									<li><a id="intro_quality-2" type="button" class="btn btn-default btn-sm rounded" href="javascript:;">Low</a></li>\
									<li><a id="intro_quality-3" type="button" class="btn btn-default btn-sm rounded" href="javascript:;">Medium</a></li>\
									<li><a id="intro_quality-4" type="button" class="btn btn-default btn-sm rounded" href="javascript:;">High</a></li>\
								</ul>\
							</div>\
						</div>\
						<div class="palette theme">\
							\
						</div>\
					</div>\
					<div class="col col-lg-13 nomobile">\
						<div class="colors">\
							<div class="palette primary">\
								<b>Primary</b>\
								<span class="swatches"></span>\
							</div>\
							<div class="palette secondary">\
								<b>Secondary</b>\
								<span class="swatches"></span>\
							</div>\
							<div class="palette node">\
								<b>Node</b>\
								<span class="swatches"></span>\
							</div>\
						</div>\
					</div>\
					';

intro_gui_set[1] =  '<div class="col col-lg-11">\
						<div class="palette zoom">\
							<b>Zoom</b>\
							<div id="io_intro_zoom"></div>\
						</div>\
						<div class="palette quality">\
							<div class="btn-group dropup">\
								<a href="javascript:;" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
									<span class="caret"></span>\
									<span class="sr-only">quality</span>\
								</a>\
								<ul class="dropdown-menu">\
									<li><a id="intro_quality-1" type="button" class="btn btn-default btn-sm rounded" href="javascript:;">Default</a></li>\
									<li><a id="intro_quality-2" type="button" class="btn btn-default btn-sm rounded" href="javascript:;">Low</a></li>\
									<li><a id="intro_quality-3" type="button" class="btn btn-default btn-sm rounded" href="javascript:;">Medium</a></li>\
									<li><a id="intro_quality-4" type="button" class="btn btn-default btn-sm rounded" href="javascript:;">High</a></li>\
								</ul>\
							</div>\
						</div>\
						<div class="palette theme">\
							\
						</div>\
					</div>\
					<div class="col col-lg-13 nomobile">\
						<div class="colors">\
							<div class="palette primary">\
								<b>Primary</b>\
								<span class="swatches"></span>\
							</div>\
							<div class="palette secondary">\
								<b>Secondary</b>\
								<span class="swatches"></span>\
							</div>\
							<div class="palette node">\
								<b>Node</b>\
								<span class="swatches"></span>\
							</div>\
						</div>\
					</div>\
					';















