
var io_zotero_group = 478201;
var io_zotero_pubkey = 'Qcjdk4erSuUZ8jvAah59Asef';
var io_zotero_selection = '';
var io_zotero_default_tag = 'anonymity';
var io_zotero_search_arr = new Array();
var io_zotero_arr_obj = new Object();

var io_zotero_loaded = 0;
var io_zotero_load_reach = 100;

var io_zotero_tags_arr = new Array();
io_zotero_tags_arr['anonymity'] = new Object();
io_zotero_tags_arr['anonymity'].loaded = false;
io_zotero_tags_arr['attack'] = new Object();
io_zotero_tags_arr['attack'].loaded = false;

var io_lib_item_selected = '';

var library_tools = '<div class="btn-group" role="group" aria-label="View controls">\
                            <button type="button" class="view_control btn btn-default" data-ref="icons-s" onclick="io_zotero_view_control(this)"><em class="fa fa-th"></em></button>\
                            <button type="button" class="view_control btn btn-default" data-ref="icons-b" onclick="io_zotero_view_control(this)"><em class="fa fa-th-large"></em></button>\
                            <button type="button" class="view_control btn btn-default" data-ref="icons-list" onclick="io_zotero_view_control(this)"><em class="fa fa-th-list"></em></button>\
                        </div>';
var library_item_tools = '<a href="#" class="btn btn-default">Submit a paper</a>';



function io_zotero_get_attachment(key) {
	var showData = $(target);
    $.getJSON(feed, function (data) {
    	if(data){
    		showData.empty();
			for(var i=0;i<data.length;i++){
				//console.log(data[i].data.title);
				var item = '<div>'+data[i].data.title+'</div>';
				showData.append(item);
			}
    	}
	});
}

function io_zotero_get_tag() {
	var tag = io_hash();
    if(tag){
    	if (tag.match('tag-')) {
	    	tag = tag.replace('tag-','');
	    	return tag;
	    }else{
	    	return false;
	    }
	}else{
    	return false;
    }
}

function io_zotero_get_id() {
	var hash = document.location.hash;
    if (hash.match('#')) {
    	hash = hash.replace('#','');
    	return hash;
    }else{
    	return false;
    }
}

function io_zotero_tag_ok(tags) {
	var valid = false;
	var has_current_tag = 0;
	if(tags != undefined){
		var tag_filter = io_zotero_get_tag();
		for(var i=0;i<tags.length;i++){
			if (tags[i].tag.match('website-')) {
				//alert(tag_filter);
				if(tag_filter != false){
					valid = false;
					if (tags[i].tag == 'website-'+tag_filter+'') {
						valid = true;
						has_current_tag++;
					}
				}else{
					valid = true;
				}
			}
		}
		if(has_current_tag != 0){
			valid = true;
		}
	}
	return valid;
}

function io_zotero_tag_in_tags(tag,tags) {
	var valid = false;
	var has_current_tag = 0;
	if(tags != undefined){
		var tag_filter = io_zotero_get_tag();
		for(var i=0;i<tags.length;i++){
			if(tag_filter != false){
				if ('website-'+tag_filter == tags[i].tag) {
					valid = true;
				}
			}
		}
	}
	return valid;
}

function io_zotero_item_creators(dataload) {
	var creators = '';
	if(dataload.data.creators != undefined){
		for(var c=0;c<dataload.data.creators.length;c++){
			if(c != 0){
				creators += ', ';
			}
			if(dataload.data.creators[c].firstName != undefined){
				creators += dataload.data.creators[c].firstName+'&nbsp;'+dataload.data.creators[c].lastName;
			}else{
				creators += dataload.data.creators[c].name;
			}
		}
	}
	return creators;
}

function io_zotero_library() { // if(io_zotero_tag_ok(data[i].data.tags)){
	var out = '';
	for (var key in io_zotero_arr_obj) {
		var ok = true;
		router = io_zotero_get_tag();
    	if(router != false){
    		if(io_zotero_tag_in_tags(router,io_zotero_arr_obj[key].data.tags)){
				out += io_zotero_library_item(io_zotero_arr_obj[key]);
    		}
    	}else{
			out += io_zotero_library_item(io_zotero_arr_obj[key]);
    	}
	}
	return out;
}

function io_zotero_item_selected(dataload) {
	var date = '';
	if(dataload.data.date != undefined && dataload.data.date != ''){
		date = '<em class="fa fa-clock-o"></em> <b>'+dataload.data.date+'</b>';
	}
	var abstractNote = '';
	if(dataload.data.abstractNote != undefined && dataload.data.abstractNote != ''){
		abstractNote = '<div class="abstractNote">'+dataload.data.abstractNote+'</div>';
	}
	var place = '';
	if(dataload.data.place != undefined && dataload.data.place != ''){
		place = '<div class="place"><em class="fa fa-globe"></em> '+dataload.data.place+'</div>';
	}
	var ISBN = '';
	if(dataload.data.ISBN != undefined && dataload.data.ISBN != ''){
		ISBN = '<div class="ISBN"><em class="fa fa-book"></em> '+dataload.data.ISBN+'</div>';
	}
	var url = '';
	if(dataload.data.url != undefined && dataload.data.url != ''){
		url = '<br><div class="url"><a class="btn btn-primary rounded" href="'+dataload.data.url+'" target="_blank">Attached URL <em class="fa fa-external-link"></em></a></div>';
	}
	var publisher = '';
	if(dataload.data.publisher != undefined && dataload.data.publisher != ''){
		if(date != ''){
			publisher += ', ';
		}
		publisher += '<span class="publisher">'+dataload.data.publisher+'</span>';
	}
	var icons = '';
	if(dataload.icons != undefined && dataload.icons != ''){
		icons = dataload.icons;
	}
	var tags = '';
	for(var i=0;i<dataload.data.tags.length;i++){
		if (dataload.data.tags[i].tag.match('website-')) {
			var tag_title = dataload.data.tags[i].tag.replace('website-','');
			tags += '<span class="label '+doDashes(dataload.data.tags[i].tag)+'"><a href="#tag-'+doDashes(tag_title)+'">'+tag_title.toUpperCase()+'</a></span> ';
		}
	}
	
	var out = '<hr />\
	<h2 class="margint0">'+dataload.data.title+'</h2>\
    <h4 class="margint0"><em class="fa fa-graduation-cap"></em> '+io_zotero_item_creators(dataload)+'</h4>\
    <div class="date">'+date+''+publisher+'</div>\
    <div class="tags">'+tags+'</div>\
    <div id="zotero_detail_attachments" class="icons">'+icons+'</div>\
    '+abstractNote+'\
    '+place+'\
    '+ISBN+'\
    '+url+'\
	';
	$("#io-lib-tools").html(library_item_tools);
	$("#zotero_details").html(out);
	$('[data-toggle="tooltip"]').tooltip();
}

function io_zotero_item_attachments() {
	if(io_zotero_arr_obj[io_zotero_selection].icons == undefined){
		$.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items/'+io_zotero_selection+'/children?key='+io_zotero_pubkey+'&format=json&include=data', function (data) {
	    	if(data){
	    		$("#zotero_load").empty();
	    		$("#zotero_load_detail").empty();
	    		var iframes = '';
	    		var icons = '';
				for(var i=0;i<data.length;i++){
					var cls = '';
					var attach_id = data[i].key;
					var icon = '<span class="bigbig"><em class="fa fa-file-o"></em></span>';
					if(data[i].data.contentType == "text/html"){
						icon = '<span class="bigbig"><em class="fa fa-file-text-o"></em></span>';
						cls = 'fdsafads';
					}
					if(data[i].data.contentType == "application/pdf"){
						icon = '<span class="bigbig"><em class="fa fa-file-pdf-o"></em></span>';
					}
					icons += '<a class="block" href="https://api.zotero.org/groups/'+io_zotero_group+'/items/'+attach_id+'/file/view?key='+io_zotero_pubkey+'" title="'+data[i].data.filename+'" dataType="'+data[i].data.contentType+'" target="_blank" data-toggle="tooltip">'+icon+'&nbsp; '+data[i].data.dateModified.substr(0,10)+' <small class="pull-right"><em class="fa fa-external-link"></em></small> <b class="block">'+data[i].data.filename+'</b></a>';
					iframes += '<iframe id="'+cls+'" src="https://api.zotero.org/groups/'+io_zotero_group+'/items/'+attach_id+'/file/view?key='+io_zotero_pubkey+'" width="100%" height="1000" style="border:0">Loading document ...</iframe>';
				}
		    	io_zotero_arr_obj[io_zotero_selection].icons = icons;
		    	io_zotero_arr_obj[io_zotero_selection].iframes = iframes;
    			$("#zotero_detail_attachments").html(icons).removeClass('none');
    			$("#zotero_load_detail").html('<div class="col-lg-offset-3"><h1 class="margint0">'+io_zotero_arr_obj[io_zotero_selection].data.title+'</h1></div>'+iframes).removeClass('none');
    			io_zotero_search();
	    	}
		});
	}
	return false;
}

function io_zotero_item_click(obj) {
	$(".open_book.selected").removeClass('selected');
	io_lib_item_selected = obj.getAttribute('rel');
	setTimeout(function(){
		$(obj).addClass('selected');
	},40);
	io_zotero_item_selected(io_zotero_arr_obj[io_lib_item_selected]);
}

function io_zotero_item() {
	var which = io_zotero_get_id();
	io_zotero_selection = which;
	if(io_zotero_arr_obj[which] == undefined){
		$.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items/'+which+'/?key='+io_zotero_pubkey+'&format=json&include=data', function (data) {
	    	if(data){
			    io_zotero_arr_obj[which] = data;
		    	io_zotero_item_selected(io_zotero_arr_obj[which]);
		    	io_zotero_item_attachments();
	    	}
		});
	}else{
		io_zotero_item_selected(io_zotero_arr_obj[which]);
    	io_zotero_item_attachments();
	}
	return false;
}


function io_zotero_library_item(dataload) {
	var date = '';
	if(dataload.data.date != undefined && dataload.data.date != ''){
		date = '<b>'+dataload.data.date+'</b>';
	}
	var abstractNote = '';
	if(dataload.data.abstractNote != undefined && dataload.data.abstractNote != ''){
		abstractNote = '<div class="abstractNote"><hr class="red short opa100" />'+dataload.data.abstractNote+'</div>';
	}
	var place = '';
	if(dataload.data.place != undefined && dataload.data.place != ''){
		place = '<div class="place"><em class="fa fa-globe"></em> '+dataload.data.place+'</div>';
	}
	var ISBN = '';
	if(dataload.data.ISBN != undefined && dataload.data.ISBN != ''){
		ISBN = '<div class="ISBN"><em class="fa fa-book"></em> '+dataload.data.ISBN+'</div>';
	}
	var publisher = '';
	if(dataload.data.publisher != undefined && dataload.data.publisher != ''){
		if(date != ''){
			publisher = ', ';
		}
		publisher += '<span class="publisher">'+dataload.data.publisher+'</span>';
	}
	var tags = '';
	var cover_tags = '';
	for(var i=0;i<dataload.data.tags.length;i++){
		if (dataload.data.tags[i].tag.match('website-')) {
			var tag_title = dataload.data.tags[i].tag.replace('website-','');
			cover_tags += '<span class="label '+doDashes(dataload.data.tags[i].tag)+'"><a href="#tag-'+doDashes(tag_title)+'">'+tag_title.toUpperCase()+'</a></span> ';
			tags += '<div class="tag '+doDashes(dataload.data.tags[i].tag)+'" title="'+tag_title+'" data-toggle="tooltip"></div>';
		}
	}
	var item = '\
    <div class="book col-md-6 col-sm-8 col-xs-12">\
        <div class="text">\
            <div class="open_book" id="book-'+dataload.key+'" rel="'+dataload.key+'" onclick="io_zotero_item_click(this)">\
            	<div class="tags side">'+tags+'</div>\
            	<div class="bg">\
                    <div class="opener text-center"><a href="#'+dataload.key+'" class="rounded">OPEN</a></div>\
                    <h2 class="margin0">'+dataload.data.title+'</h2>\
					<hr class="red short opa100" />\
                    <h3 class="margint0">'+io_zotero_item_creators(dataload)+'</h3>\
                    <p class="date">'+dataload.data.date+''+publisher+'</p>\
                    <div class="tags">'+cover_tags+'</div>\
                </div>\
            </div>\
        </div>\
    </div>\
	';
	return item;
}

function io_zotero_tag_select(tag) {
	$("#zotero_tags .btn.selected").removeClass('selected');
	$("#zotero_tags .btn").each(function(){
		var url = $(this).attr('href');
		if(url == '#tag-'+tag){
			$(this).addClass('selected');
		}
	});
}

var io_zotero_loaded_full = false;
var io_zotero_search_loaded = 0;
function io_zotero_search_load() {
	if(!io_zotero_loaded_full){
		$.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items?start='+io_zotero_search_loaded+'&limit='+(io_zotero_search_loaded+50)+'&format=json&search=website-&v=1&key='+io_zotero_pubkey, function (data) {
	    	if(data.length > 0){
	    		console.log(data);
				for(var i=0;i<data.length;i++){
					if(io_zotero_tag_ok(data[i].data.tags)){
						io_zotero_arr_obj[data[i].key] = new Object();
						io_zotero_arr_obj[data[i].key] = data[i];
						io_zotero_arr_obj[data[i].key].loaded = false;
					}
				}
				io_zotero_search_loaded += 50;
				io_zotero_autocomplete();
			    io_zotero_search_load();
	    	}else{
				$('#library-search-button').removeClass('loading');
	    		io_zotero_loaded_full = true;
	    		return false;
	    	}
		});
	}
}

function io_zotero_load(tag,callback) {
	//alert(io_zotero_loaded_full);
	if(!io_zotero_loaded_full){
		var lib_list = true;
		var tag_val = '&search=website-';
		if(tag != ''){
			tag_val = '&tag=website-'+tag+'';
		}else{
			if(!io_hash()){
				lib_list = true;
			}else{
				lib_list = false;
			}
		}
		if(tag == 'all'){
			tag_val = '&search=website-';
		}
		$.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items?start=0&limit=50&format=json'+tag_val+'&v=1&key='+io_zotero_pubkey, function (data) {
	    	if(data){
				for(var i=0;i<data.length;i++){
					if(io_zotero_tag_ok(data[i].data.tags)){
						io_zotero_arr_obj[data[i].key] = new Object();
						io_zotero_arr_obj[data[i].key] = data[i];
						io_zotero_arr_obj[data[i].key].loaded = false;
					}
				}
				if(lib_list){
					$("#zotero_details").empty();
					$("#zotero_load").empty();
					$("#io-lib-tools").html(library_tools);
					if(tag == ''){
				    	$("#zotero_load").html(io_zotero_library());
					}else{
				    	$("#zotero_load").html('<div class="col-lg-offset-3"><h2 class="margint0"><em class="fa fa-tag website-'+tag+' rounded"></em> '+tag+'</h2></div>'+io_zotero_library());
				    	io_zotero_tag_select(tag);
					}
			    	$('[data-toggle="tooltip"]').tooltip();
			    }
			    //io_zotero_search();
		    	io_zotero_selection = tag;
		    	if(typeof callback == 'function'){
			    	callback();
		    	}
	    	}
		});
	}else{
		$("#zotero_load").html(io_zotero_library());
	}
}

var io_zotero_search_init = false;
function io_zotero_search() {
	if(!io_zotero_search_init){
		io_zotero_arr_obj = {};
		io_zotero_search_load();
		$('#library-search-button').addClass('loading');
		$('#library-search').on('input', function() { 
			io_zotero_autocomplete();
		});
		$('html').click(function() {
			$(".io_autocomplete").addClass('none');
		});
		$('#library-search,.io_autocomplete').click(function(event){
		    event.stopPropagation();
		});
	}
	$(".io_autocomplete.none").removeClass('none');	
}

function io_zotero_autocomplete() {
	var res = '';
	var searched = $("#library-search").val().toLowerCase();
	$(".io_autocomplete").empty();
	for (var key in io_zotero_arr_obj) {
		if(io_zotero_arr_obj[key].data.title != undefined){ ///io_zotero_item_creators(dataload)
			var str = false;
			var tit = '';
			var aut = '';
			var tags = '';
			var tagline = '';
			var searching_title = io_zotero_arr_obj[key].data.title.toLowerCase().search(searched.toLowerCase());
			var searching_authors = io_strip(io_zotero_item_creators(io_zotero_arr_obj[key])).toLowerCase().search(searched.toLowerCase());
			var searching_tags = new Array();

			for(var i=0;i<io_zotero_arr_obj[key].data.tags.length;i++){
				searching_tags[i] = io_zotero_arr_obj[key].data.tags[i].tag.toLowerCase().search(searched.toLowerCase());
			}
			

			if(searching_title != -1){

				var tit_s = io_zotero_arr_obj[key].data.title;
				tit += '<div class="block title">'+tit_s.substr(0,searching_title)+'<b>'+tit_s.substr(searching_title,searched.length)+'</b>'+tit_s.substr(searching_title+searched.length,tit_s.length)+'</div>';
				str = true;
			}
			if(searching_authors != -1){
				var aut_s = io_strip(io_zotero_item_creators(io_zotero_arr_obj[key]));
				aut += '<div class="block authors"><em class="fa fa-graduation-cap"></em> '+aut_s.substr(0,searching_authors)+'<b>'+aut_s.substr(searching_authors,searched.length)+'</b>'+aut_s.substr(searching_authors+searched.length,aut_s.length)+'</div>';
				str = true;
			}
			if(io_zotero_tag_ok(io_zotero_arr_obj[key].data.tags)){
				for(var i=0;i<io_zotero_arr_obj[key].data.tags.length;i++){
					searching_tags[i] = io_zotero_arr_obj[key].data.tags[i].tag.toLowerCase().search(searched.toLowerCase());
					var tag_s = io_zotero_arr_obj[key].data.tags[i].tag.replace('website-','');
					if(searching_tags[i] != -1){
						tags += '<span class="tag">'+tag_s.substr(0,searching_tags[i])+'<b>'+tag_s.substr(searching_tags[i],searched.length)+'</b>'+tag_s.substr(searched.length,tag_s.length)+'</span> ';
						tagline += '<span class="tag">'+tag_s.substr(0,searching_tags[i])+'<b>'+tag_s.substr(searching_tags[i],searched.length)+'</b>'+tag_s.substr(searching_tags[i]+searched.length,tag_s.length)+'</span> ';
					}else{
						tagline += '<span class="tag">'+tag_s+'</span> ';
					}
				}
			}

			if(tags != ''){
				str = true;
			}
			if(str){
				res += '<li class="tags" onclick="window.location.href=';
				res += "'#"+io_zotero_arr_obj[key].key+"'";
				res += '">';
				if(tit != ''){
					res += tit;
				}else{
					res += '<div class="block title">'+io_zotero_arr_obj[key].data.title+'</div>';
				}
				if(aut != ''){
					res += aut;
				}else{
					res += '<div class="block authors"><em class="fa fa-graduation-cap"></em> '+io_strip(io_zotero_item_creators(io_zotero_arr_obj[key]))+'</div>';
				}
				res += '<div class="tags uppercase"><em class="fa fa-tag"></em> '+tagline+'</div>';
				res += '</li>';
			}



		}
	}
	if(res != ''){
		$(".io_autocomplete").html('<ul>'+res+'</ul>');
	}
}




function io_zotero() {
	$("#zotero_load").removeClass('none').html(svgloader);
	$("#zotero_load_detail").addClass('none');
	var router = io_hash();
	//console.log(router);
	if(!router){ // default library
		io_zotero_load('',null);
		//io_zotero_tag('',null);
		return false;
	}else{
		router = io_zotero_get_tag();
    	if(router){ // tag library
			io_zotero_load(router,null);
			return false;
		}else{ // library detail
	    	//
	    	if(io_zotero_selection != ''){
	    		io_zotero_item();
	    	}else{
				io_zotero_item();
	    	}
	    }
    }
}

var io_zotero_current_view = 'icons-s';
function io_zotero_view_control(obj) {
	var view = $(obj).data('ref');
   	$(".view_control").removeClass("active");
   	$("#zotero_load").removeClass(io_zotero_current_view);
   	io_zotero_current_view = view;
   	$("#zotero_load").addClass(io_zotero_current_view);
   	$(obj).addClass("active");
}


;(function($) {


	$(window).resize(function(){

	});

	$(window).load(function(){

	});

	$(window).on('hashchange', function() {
		//if(io_zotero_selection != ''){
			io_zotero();

		//}
	});

	$(document).ready(function() {
		

	});



})($);
	