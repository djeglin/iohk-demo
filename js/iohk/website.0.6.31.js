var io_intro_animation = null;

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


	if(ww > 400){
	
		io_intro_gui();

		setTimeout(function(){
	        var parameters = {}

	        parameters = { 
	            'particle_path' : "js/intro.0.4.2/textures/particle3.png",
	            'container_id' : "io_intro",
	            'renderer_id' : "io_intro_renderer",
	            'stats_id' : "io_intro_stats",
	            "gui_id" : "io_intro_gui",
	            "electrolized_path" : 'js/intro.0.4.2/libs/electrolized.js',
	            "spec_path1"  : 'js/intro.0.4.2/textures/spec_body_squared.jpg',
	            "spec_path2"  : 'js/intro.0.4.2/textures/spec_body5.jpg',
	            "spec_path3"  : 'js/intro.0.4.2/textures/spec_line2.jpg',
	            "spec_path4"  : 'js/intro.0.4.2/textures/spec_body11.jpg',
	            //here : 0 new version with transparencies, 1 first version with black background.
	            "shader_to_use" : 1,
	            "header_text" :"X",
	            "focal_length_name" :"pepi",
	            "quality_name" :'rudolf asd ',
	            "color_theme_name" : ' colores ',
	            "main_color_name" : 'main colsdfor',
	            "secondary_color_name" : 'secondsdary color',
	            "spheres_color_name" : 'spheresdfs color',
	            "next_name" : 'next 123',
	            "play_name" : 'play q213',
	            "pause_name" : 'pause 1237',
	            "reset_name" : 'reset 352',
	            "next_animation_name" : '#!asd',
	            //VERSION 4.5"
	            "focal_length_init_val" : 10
	        }

	        function onDocumentKeyDown( event ) {
	            if (event.keyCode == 32){
	                io_intro_pauseplay();
	            }
	        }
	        document.addEventListener('keydown',onDocumentKeyDown,false);

	        document.getElementById("io_intro_gui-play").addEventListener("click", function(){io_intro_pauseplay();}); 
	        document.getElementById("io_intro_gui-refresh").addEventListener("click", function(){io_intro_animation.reset();}); 
	        //document.getElementById("io_intro_gui-forward").addEventListener("click", function(){io_intro_animation.forward();}); 

	        document.getElementById("intro_quality-1").addEventListener("click", function(){jQuery("#pop-quality").addClass('none');jQuery("#poper-quality .val").text('Default');io_intro_animation.updateQuality(0);}); 
	        document.getElementById("intro_quality-2").addEventListener("click", function(){jQuery("#pop-quality").addClass('none');jQuery("#poper-quality .val").text('Nice');io_intro_animation.updateQuality(1);}); 
	        document.getElementById("intro_quality-3").addEventListener("click", function(){jQuery("#pop-quality").addClass('none');jQuery("#poper-quality .val").text('Cool');io_intro_animation.updateQuality(2);}); 
	        document.getElementById("intro_quality-4").addEventListener("click", function(){jQuery("#pop-quality").addClass('none');jQuery("#poper-quality .val").text('Wow');io_intro_animation.updateQuality(3);}); 

	        document.getElementById("intro_theme-1").addEventListener("click", function(){jQuery("#pop-theme").addClass('none');jQuery("#poper-theme .val").text('1');io_intro_animation.updateTheme(0);}); 
	        document.getElementById("intro_theme-2").addEventListener("click", function(){jQuery("#pop-theme").addClass('none');jQuery("#poper-theme .val").text('2');io_intro_animation.updateTheme(1);}); 
	        document.getElementById("intro_theme-3").addEventListener("click", function(){jQuery("#pop-theme").addClass('none');jQuery("#poper-theme .val").text('3');io_intro_animation.updateTheme(2);}); 
	        

	        io_intro_animation = new Animation01();
			io_intro_animation.setup(parameters,function(){

				jQuery("#entry").hide(0);
				//jQuery("#io_intro_renderer").height(wh);
				//jQuery("#io_intro_renderer").attr('height',wh);
				jQuery("#io_intro_renderer").css({height:wh+'px'});
				jQuery("#io_intro").addClass('in');

				if(ww < wh){
					io_intro_animation.updateZoom(25);
				}
				io_intro_animation.updateColorMain('#ff0000');
				io_intro_animation.updateTheme(1);
		    	io_intro_animation.run();


	        },function(){

	        	jQuery("#entry").show(0);
				jQuery("#io_intro").removeClass('in');

			});

		},100);


	}

}

function io_intro_kill(){
	if(io_intro_animation != null){
		io_intro_animation.stop();
		io_intro_animation = null;
		jQuery("#io_intro").empty();
	}
}

var io_intro_gui_setup = false;
function io_intro_gui(){
	if(!io_intro_gui_setup){
		io_intro_gui_setup = true;
		$("#io_intro_zoom").slider({
			max: 16,
			max: 32,
			value: 10,
			change: function( event, ui ) {
				io_intro_animation.updateZoom(ui.value);
			}
		});

		$(".intro_nav .colors .swatches").each(function(index){
			$(this).append(io_color_swatches(index));
		});
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

function io_disqus(){
	var disqus_config = function () {
	    this.page.url = document.location.href;
	    this.page.identifier = $('.entry').data('slug');
	};
	(function() {
	    var d = document, s = d.createElement('script');
	    s.src = '//iohk.disqus.com/embed.js';
	    s.setAttribute('data-timestamp', +new Date());
	    (d.head || d.body).appendChild(s);
	})();
}


;(function($) {

	$(".navbar a,.navbar-brand").click(function(e){
		e.preventDefault();
		io_intro_kill();
		$(".navbar .active").removeClass('active');
		$(this).parent().addClass('active');
		var urlchoice = $(this).attr('href');
		if(!lowie){
			//window.history.pushState(io_hist, "IOHK", urlchoice);
			History.pushState(io_hist, "IOHK",urlchoice);
			io_load_page(urlchoice);
		}else{
			document.location.href = urlchoice;
		}
		if($("#navhider").hasClass('in')){
		 	$("#navhider").removeClass('in');
		}
	});


	function io_retitle() {
		var h1 = $(".entry").attr('title');
		if(chosen == 'team'){
			h1_arr = h1.split('/');
		}
		$("h1").html(h1);
	}

	function io_translate_update() {
		if(choice != ''){
			$("#lang-chooser a").each(function(){
				var lang = $(this).attr('class');
				if(lang == 'en'){
					lang = '';
				}
				var lang_choice = choice;
				if(lang_choice == '/'){
					lang_choice = '';
				}
				if(iolang == 'en'){
					$(this).attr('href',lang_choice+''+lang+'');
				}else{
					$(this).attr('href',lang_choice.substr(0,choice.length-4)+'/'+lang+'');
				}
			});
		}
	}

	function io_nav() {
		$(".subpages a,a.ajaxhref").unbind('click');
		$(".subpages a,a.ajaxhref").click(function(e){
			e.preventDefault();
			$(".subpages .active,a.ajaxhref").removeClass('active');
			$(this).parent().addClass('active');
			var urlchoice = $(this).attr('href');
			choice = urlchoice;
			if(!lowie){
				History.pushState(io_hist, "IOHK",urlchoice);
				io_load_page(urlchoice);
			}else{
				document.location.href = urlchoice;
			}
		});
	}

	function io_subajax_loader(){
		var lowievar = false;
		$("#io_loader a.io_ajax_load").click(function(e){
			e.preventDefault();
			var urlchoice = $(this).attr('href');
			var target = $(this).attr('data-target');
			var rel = $(this).attr('data-load');
			choice = urlchoice;
			$(".sidecol .active").removeClass('active');
			$(this).parent().addClass('active');
			if(lowie){
				if(lowievar){
					document.location.href = urlchoice;
				}
			}
			io_load_subpage(target,urlchoice,rel);
		});
	}

	function io_load_subpage(target,url,rel){
		if(!$("body").hasClass('transsub')){
		 	$("body").addClass('transsub');
		}
		setTimeout(function(){
			$(target).load(url+' '+rel,function(){
				lowievar = true;

				$("title").text($("h1").text()+' - '+homename);
				if($("body").hasClass('transsub')){
				 	$("body").removeClass('transsub');
				}
			}).delay(500);
		},300);
	}

	function io_load_page(url){
		choice = url;
		if($("body").hasClass('transin')){
		 	$("body").removeClass('transin');
		}
		var url_a = url.split('/');
		if(iolang == 'en'){
			chosen = url_a[url_a.length-2];
		}else{
			chosen = url_a[url_a.length-3];
		}
		setTimeout(function(){

			$("#io_loader").load(url+' #io_load',function(){
				io_nav();
				var bodyvar = chosen;
				if(bodyvar == ''){
					bodyvar = 'home';
				}
				$("#page").attr('class',bodyvar);
				$("title").text($("h1").text()+' - '+sitename);
				io_retitle();
				
				if(!$("body").hasClass('transin')){
				 	$("body").addClass('transin');
				}
				io_which_way_alter();

			});
		},500);
	}

	var team_sec = 0;
	var team_car = true;
	function io_alter_title(){
		$("h1 .active").removeClass('active');
		$("h1 a").each(function(i,v){
			if(i == team_sec){
				$(this).addClass('active');
			}
		});
	}

	function io_which_way_alter(){
		$("title").text($("h1").text()+' - '+sitename);
		io_translate_update();
		if(chosen == projectspage){
			//io_globe();
		}		
		if(chosen == jobspage){
			io_subajax_loader();
		}
		if($("#mainrow").hasClass('container-fluid')){
			$("#mainrow").attr('class','container');
		}
		if($("#page").hasClass('intropage')){
			$("#hasClass").removeClass('intropage');
		}
		if($("#io_intro").hasClass('ready')){
			$("#mainrow").attr('class','container-fluid');
			$("#page").addClass('intropage');
			io_intro_init();
		}else{
			io_intro_kill();
		}
		if($(".entry").data('type') == 'blog-post'){
			io_disqus();
		}
		if(chosen == 'research' || chosen == 'scorex' || chosen == 'veritas' || chosen == 'serokell'){
			io_hash_tabs();
		}
		if($("#io_data_globe").hasClass('single') || $("#io_data_globe").hasClass('multi')){
			io_globe();
		}
		if($("#io_project_commits").hasClass('ready')){
			io_load_commits();
		}
		if($("#zotero_load").hasClass('ready')){
			io_zotero();
		}
		if(!$("body").hasClass('transin')){
		 	$("body").addClass('transin');
		}
		$('[data-toggle="tooltip"]').tooltip();
	}	

	function io_which_way(){
		var ww = $(window).width();
		var wh = $(window).height();
		var row = wh/20;
		chosen = pageslug;
		io_nav();
		io_retitle();
		io_which_way_alter();
		if(!$("body").hasClass('introin')){
		 	$("body").addClass('introin');
		}
	}

	function io_resize(){

	}

	function io_globe_draw(){
		$("#io_load .fader").append('<div id="info"></div><div id="io_globe"></div>');
		//$("body").animate({backgroundPosition:'center -140px'},500);
		$("body").addClass('io_globe_in');

		if(!Detector.webgl){
			Detector.addGetWebGLMessage();
		} else {
			var container = document.getElementById('io_globe');
			var globe = new DAT.Globe(container);
			globe.animate();
		}
	}

	function io_project_globe_draw(){
		//if(!Detector.webgl){
			//Detector.addGetWebGLMessage();
		//} else {
			var container = document.getElementById('io_data_globe');
			var globe = new DAT.Globe(container);
			globe.animate();
		//}
	}	

	function io_globe(){
		//THREE = {};
		var scripts_loaded = false;
		templurl = '';
		temppath = '/images/';
		io_project_globe_draw();


	}


	//	    <li><a id="io-mail" href="javascript:window.open('mailto:test@example.com?subject=subject&body=body');">


	function io_hash_tabs() {
	    var url = document.location.hash;
	    if (url.match('#')) {
	        $('.nav-tabs a[href=#'+url.split('#')[1]+']').tab('show') ;
	    } 
	    $('.nav-tabs a').on('shown.bs.tab', function (e) {
	        window.location.hash = e.target.hash;
	    });
	}
	
	function io_load_commits() {
		var url = $("#io_project_commits").data('url');
		if(url.length > 0){
			io_load_rss(url,"#io_project_commits",$("#io_project_commits").data('count'),$("#io_project_commits").data('show'));
		}

	}

	function io_load_rss(feed,target,items,itemshidden) {
	    var $parseRSS = function (paramsObj) {
	        var base = "https://ajax.googleapis.com/ajax/services/feed/load",params = "?v=1.0&num=" + paramsObj.count + "&callback=?&q=" + paramsObj.url,url = base + params;
	        $.ajax({url: url,dataType: "json",
	            success: function (data) {
	            	if(data.responseData != null){
		                paramsObj.callback(data.responseData.feed.entries);
	            	}
	            }
	        });
	    };
	    $parseRSS({
	        url: feed,
	        count: items,
	        callback: function (posts) {
	            for(var i=0;i<posts.length;i++){
	                var post = posts[i];
	                //console.log(posts[i]);
	                var cls = '';
	                var cut = '<span class="cut"></span>';
	                var tit = post.title;
	                tit = tit.split('/').join('/'+cut);
	                tit = tit.split('_').join('_'+cut);
	                tit = tit.split('.').join('.'+cut);
	                if(i > itemshidden){
	                	cls = 'none';
	                }
	                $(target).append('<li class="'+cls+'"><a href="http://github.com/'+post.author+'" title="Author: '+post.author+'" class="author" target="_blank"><em class="fa fa-user pull-right user"></em></a> <a href="'+post.link+'" title="Check this commit on Github" target="_blank">'+tit.trim()+'<em class="fa fa-arrow-right small">&nbsp;</em> <small class="block small">'+post.publishedDate+'</small></a></li>');
	            }
	        }
	    });
	}


	$(window).resize(function(){
		//io_resize();
	});

	$(window).load(function(){
		io_which_way();
	});

	$(window).on('hashchange', function() {
		//io_zotero();
	});

	$(document).ready(function() {
		

	});



})(jQuery);
	