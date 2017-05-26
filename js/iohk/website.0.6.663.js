var teamgrid = '';

var io_globe_var = null;

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

function io_loadmodal(obj,tit){
	jQuery("#morecontent-modal-header").text(tit);
	jQuery("#morecontent-modal-body").html(jQuery(obj).html());
}

var io_current_team_filter = 'show-all';
function io_team_filter(filt,obj){
	jQuery(".filters .active").removeClass('active');
	jQuery(".filters ."+obj).addClass('active');

	jQuery("#teamgrid").removeClass(io_current_team_filter);
	io_current_team_filter = obj;
	jQuery("#teamgrid").addClass(io_current_team_filter);

	jQuery("#teamgrid .griditem").not('.'+filt).hide(500);
	if(filt == 'all'){
		jQuery("#teamgrid .griditem").show(500);
	}else{
		filt = '.'+filt;
		jQuery("#teamgrid "+filt).show(500);
	}
}



/*

if(jQuery("#page").hasClass('intropage')){
	jQuery("#page").removeClass('intropage');
}

if(jQuery("#page").hasClass('transin')){
	jQuery("#page").removeClass('transin');
}

*/




;(function($) {

	var $allVideos = $("iframe[src^='//www.youtube.com']"),$fluidEl = $("body");
	function io_fluid_videos(){
		$allVideos = $("iframe[src^='//www.youtube.com']"),
		$fluidEl = $("body");
		$allVideos.each(function() {
			$(this).data('aspectRatio', this.height / this.width).removeAttr('height').removeAttr('width');
		});
	}


	$(".navbar a,.navbar-brand").click(function(e){
		e.preventDefault();
		io_intro_kill();

		io_zotero_setup = false;
		$(".navbar .active").removeClass('active');
		$(this).parent().addClass('active');
		var urlchoice = $(this).attr('href');
		if(!lowie){
			//window.history.pushState(io_hist, "IOHK", urlchoice);
			History.pushState(io_hist, "IOHK",urlchoice);
			//io_load_page(urlchoice);
		}else{
			document.location.href = urlchoice;
		}
		if($("#navhider").hasClass('in')){
		 	$("#navhider").removeClass('in');
		}
	});

	function io_retitle() {
		//var h1 = $(".entry").attr('title');
		//if(chosen == 'team'){
		//	h1_arr = h1.split('/');
		//}
		//$("h1").html(h1);
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
		io_altnav();
	}

	function io_altnav() {
		$("a.fadehref").unbind('click');
		$("a.fadehref").click(function(e){
			e.preventDefault();
			$("a.fadehref").removeClass('active');
			$(this).parent().addClass('active');
			var urlchoice = $(this).attr('href');
			choice = urlchoice;
			if(!lowie){
				History.pushState(io_hist, "IOHK",urlchoice);
				io_goto_page(urlchoice);
			}else{
				document.location.href = urlchoice;
			}
		});
	}

	function io_subajax_loader(){
		var lowievar = false;
		$("#main a.io_ajax_load").click(function(e){
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

	function io_goto_page(url){
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
			document.location.href = url;
		},500);
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
		if(url.match('team')){
			chosen = 'team';
		}
		if(url.match('blog')){
			chosen = 'blog';
		}
		setTimeout(function(){

			$("#middle").load(url+' #main',function(){
				io_nav();
				var bodyvar = chosen;
				if(bodyvar == ''){
					bodyvar = 'home';
				}
				$("#page").attr('class',bodyvar);
				//$("title").text($("h1 .title").text()+' - '+sitename);

				setTimeout(function(){
				if(!$("body").hasClass('transin')){
				 	$("body").addClass('transin');
				}
				},100);
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

	function io_title_typing(){
		var txt = $("h1").text();
		//$("h1").typewriter();
		if(txt.match('IOHK |')){
			setTimeout(function(){
				txt = txt.replace('IOHK |','<span class="c_f00">IOHK |</span>');
				$("h1").html(txt);
			},3500);
		}
	}



	function io_which_way_alter(){
		$("title").text($("h1 .title").text()+' - '+sitename);
		io_translate_update();
		if(!webglAvailable){
	        $(".io_webgl").remove();
	    }

		io_zotero_setup = false;

	    if($("#subheader").hasClass('particles')){
	    	$("#subheader-particles").height($("#subheader").height());
			particlesJS.load('subheader-particles', '/js/particles/particles-115.json');
		}


		if(chosen == jobspage){
			//io_subajax_loader();
		 	//$(".sidecol li a:first").trigger('click');
		 	io_job_list();

		}
		if($("#main").hasClass('container-fluid')){
			$("#main").attr('class','container');
		}
		if($("#page").hasClass('intropage')){
			$("#page").removeClass('intropage');
		}
		if($("#io_intro").hasClass('ready')){
			$("#main").attr('class','container-fluid');
			$("#page").addClass('intropage home');
			io_intro();
		}else{
			io_intro_kill();
			//io_title_typing();
			//$("h1").typewriter();
		}
		if($(".entry").data('type') == 'blog-post'){
			io_disqus();
			io_fluid_videos();
		}
		if($("#page").hasClass('blog') || $("#page").hasClass('video')){
			io_disqus();
			io_fluid_videos();
		}
		if($("#page").hasClass('team')){
			/*
			teamgrid = $('#teamgrid').isotope({
				itemSelector: '.team-member',

			});
*/

		}


		if(chosen == 'research' || chosen == 'scorex' || chosen == 'veritas' || chosen == 'serokell'){
			io_hash_tabs();
		}
		if($("#io_data_globe").hasClass('single') || $("#io_data_globe").hasClass('multi')){
			io_globe();
		}
		if($("#io_project_commits").hasClass('ready')){
			$("#io_project_commits").empty();
			io_load_commits();
		}
		if($("#zotero_load").hasClass('ready')){
			io_zotero_setup = false;
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
		//io_nav();
		io_retitle();
		io_which_way_alter();
		if(!$("body").hasClass('introin')){
		 	$("body").addClass('introin');
		}
	}

	function io_resize(){

	}


	function io_globe(){
		templurl = '';
		temppath = '/images/';
		if(webglAvailable){
			var container = document.getElementById('io_data_globe');
			io_globe_var = null;
			io_globe_var = new DAT.Globe(container);
			io_globe_var.animate();
		}
	}

	//<li><a id="io-mail" href="javascript:window.open('mailto:test@example.com?subject=subject&body=body');">


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
		$parseRSS = null;
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
	        	var out = '';
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
	                out += '<li class="'+cls+'"><a href="'+post.link+'" title="Check this commit on Github" target="_blank">'+tit.trim()+' <small class="block small">'+post.publishedDate.substr(0, (post.publishedDate.length - 5))+' <em>by <b>'+post.author+'</b></em></small></a></li>';
	            }
	            $(target).html(out);
	        }
	    });
	}


	$(window).resize(function(){
		if(io_intro_animation != null){
			io_intro_animation.updateCanvas();
		}

		var newWidth = $fluidEl.width();
		$allVideos.each(function() {
			var $el = $(this);
			$el.width(newWidth).height(newWidth * $el.data('aspectRatio'));
		});

	    if($("#subheader").hasClass('particles')){
	    	$("#subheader-particles").height($("#subheader").height());
		}

	});

	$(window).load(function(){
		io_which_way();
	});

	$(window).on('hashchange', function() {
		//io_zotero();
	});

	$(document).ready(function() {
		History.Adapter.bind(window, 'statechange', function() {
			var State = History.getState();
			io_load_page(State.url);
		});
	});



})(jQuery);
