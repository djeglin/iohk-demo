var io_intro_animation = null;
function io_intro_init(){
	//jQuery("#renderer").height(document.height());
    function onDocumentKeyDown( event ) {
        if (event.keyCode == 32){
            if (io_intro_animation.isRunning()){
                io_intro_animation.stop();
            }else{
                io_intro_animation.run();
            }
        }
    }
    document.addEventListener('keydown',onDocumentKeyDown,false);
    //if(io_intro_animation == null){
	    io_intro_animation = new Animation01();
	    io_intro_animation.setup(function(){io_intro_animation.run()});
    //}else{
    //	io_intro_animation.run();
    //}
}

function io_intro_kill(){
	if(io_intro_animation != null){
		io_intro_animation.stop();
		io_intro_animation = null;
		jQuery("#io_intro").empty();
	}
}

function io_disqus(){
	var disqus_config = function () {
	    this.page.url = document.location.href;
	    this.page.identifier = jQuery('.entry').data('slug');
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
		$(".subpages a").unbind('click');
		$(".subpages a").click(function(e){
			e.preventDefault();
			$(".subpages .active").removeClass('active');
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
				io_resize();
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
				io_resize();
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
		if(chosen == 'research' || chosen == 'scorex' || chosen == 'veritas' || chosen == 'toolkit'){
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
		io_resize();
		io_retitle();
		io_which_way_alter();
		if(!$("body").hasClass('introin')){
		 	$("body").addClass('introin');
		}
	}

	function io_resize(){

		var ww = $(window).width();
		var wh = $(window).height();
		var row = wh/20;

		if(!lowie){
			if(ww > 768){
				if(wh > 500){
					$("body").css({height:wh});

					if(wh > 800){
						$("#navbar").css({paddingTop:2*row+'px'});
						//$("#middlerow").css({paddingTop:3*row+'px'});
					}else{
						$("#navbar").css({paddingTop:0.8*row+'px'});
						//$("#middlerow").css({paddingTop:1.5*row+'px'});
					}

					if(!$("body").hasClass('transin')){
					 	$("body").addClass('transin');
					}
					if(!$("body").hasClass('uilocked')){
					 	$("body").addClass('uilocked');
					}

				}else{
					if($("body").hasClass('uilocked')){
					 	$("body").removeClass('uilocked');
					}
					$("#navbar").css('paddingTop',0+'px');
					$("#middlerow").css('marginTop',0+'px');
				}
			}else{
				if($("body").hasClass('uilocked')){
				 	$("body").removeClass('uilocked');
				}
				$("#navbar").css('paddingTop',0+'px');
				$("#middlerow").css('marginTop',0+'px');
			}
		}else{
			$("#navbar").css('paddingTop',0+'px');
			$("#middlerow").css('marginTop',40+'px');
		}
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
		if(!Detector.webgl){
			Detector.addGetWebGLMessage();
		} else {
			var container = document.getElementById('io_data_globe');
			var globe = new DAT.Globe(container);
			globe.animate();
		}
	}	

	function io_globe(){
		var scripts_loaded = false;
		templurl = '';
		temppath = '/images/';

		if(!scripts_loaded){
			$.getScript("/js/globe/third-party/Three/ThreeWebGL.js", function(){
				$.getScript("/js/globe/third-party/Three/ThreeExtras.js", function(){
					$.getScript("/js/globe/third-party/Three/RequestAnimationFrame.js", function(){
						$.getScript("/js/globe/third-party/Three/Detector.js", function(){
							//$.getScript("/js/globe/third-party/Tween.js", function(){
								//$.getScript("/js/globe/marker.js", function(){

									$.getScript("/js/globe/coord.js", function(){
										$.getScript("/js/globe/globe.js", function(){
											scripts_loaded = true;
											io_project_globe_draw();
										});
									});
								//});
							//});
						});
					});
				});
			});

		}else{
			io_project_globe_draw();
		}
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
		io_load_rss(url,"#io_project_commits",$("#io_project_commits").data('count'),$("#io_project_commits").data('show'));
	}

	function io_load_rss(feed,target,items,itemshidden) {
	    var $parseRSS = function (paramsObj) {
	        var base = "https://ajax.googleapis.com/ajax/services/feed/load",params = "?v=1.0&num=" + paramsObj.count + "&callback=?&q=" + paramsObj.url,url = base + params;
	        $.ajax({url: url,dataType: "json",
	            success: function (data) {
	                paramsObj.callback(data.responseData.feed.entries);
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
	                if(i > itemshidden){
	                	cls = 'none';
	                }
	                $(target).append('<li class="'+cls+'"><a href="http://github.com/'+post.author+'" title="Author: '+post.author+'" class="author" target="_blank"><em class="fa fa-user pull-right user"></em></a> <a href="'+post.link+'" title="Check this commit on Github" target="_blank"> '+post.title+' <em class="fa fa-arrow-right small"></em> <small class="block small">'+post.publishedDate+'</small></a></li>');
	            }
	        }
	    });
	}


	$(window).resize(function(){
		io_resize();
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
	