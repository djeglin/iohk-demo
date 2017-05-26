
var io_zotero_setup = false;
var io_zotero_group = 478201;
var io_zotero_pubkey = 'Qcjdk4erSuUZ8jvAah59Asef';
var io_zotero_selection = '';
var io_zotero_layout = '';
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


var io_zotero_loaded_full = false;
var io_zotero_search_step = 50;
var io_zotero_search_loaded = 0;

var io_zotero_lib_list_tag = ' ';
var io_zotero_lib_list_step = 50;
var io_zotero_lib_list_loaded = 0;



var library_tools = '<div class="btn-group" role="group" aria-label="View controls">\
                            <button type="button" class="view_control btn btn-default active" data-ref="icons-s" onclick="io_zotero_view_control(this)"><em class="fa fa-th"></em></button>\
                            <button type="button" class="view_control btn btn-default" data-ref="icons-b" onclick="io_zotero_view_control(this)"><em class="fa fa-th-large"></em></button>\
                            <button type="button" class="view_control btn btn-default" data-ref="icons-list" onclick="io_zotero_view_control(this)"><em class="fa fa-th-list"></em></button>\
                        </div>';

var library_item_tools = function(){
	var title = io_zotero_arr_obj[io_zotero_selection].data.title;
	var url = homeurl+'/research/library/#'+io_zotero_arr_obj[io_zotero_selection].key;
	var out = '\
	<div class="btn-group" role="group" aria-label="View controls">\
	    <button type="button" class="btn btn-default btn-print" onclick="window.print()"><em class="fa fa-print"></em></button>\
	    <button type="button" class="btn btn-default" data-title="'+title+'" data-link="'+url+'" onclick="io_send_mail(this)"><em class="fa fa-envelope"></em></button>\
	    <div class="btn-group" role="group">\
		    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
			    <em class="fa fa-share-alt"></em>\
		    </button>\
		    <ul class="dropdown-menu">\
		        <li><a href="http://twitter.com/share?url='+url+'&text='+title+'&via=InputOutput" target="_blank">Share on Twitter</a></li>\
			    <li><a href="http://www.facebook.com/sharer.php?u='+url+'&t='+title+'" target="_blank">Share on Facebook</a></li>\
			    <li><a href="http://www.linkedin.com/shareArticle?mini=true&url='+url+'" target="_blank">Share on LinkedIn</a></li>\
			    <li><a href="https://plusone.google.com/_/+1/confirm?hl=en&url='+url+'" target="_blank">Share on Google Plus</a></li>\
			    <li><a href="http://reddit.com/submit?url='+url+'&title='+title+'" target="_blank">Share on Reddit</a></li>\
		    </ul>\
		</div>\
	</div>\
	';
	return out;
}

var io_zotero_itemtype_icon = new Object();
io_zotero_itemtype_icon['book'] = '<em class="fa fa-book rounded" title="Book"></em>';
io_zotero_itemtype_icon['document'] = '<em class="fa fa-file-o rounded" title="Document"></em>';
io_zotero_itemtype_icon['conferencePaper'] = '<em class="fa fa-file-text-o rounded" title="Conference Paper"></em>';
io_zotero_itemtype_icon['journalArticle'] = '<em class="fa fa-newspaper-o rounded" title="Journal Article"></em>';
io_zotero_itemtype_icon['report'] = '<em class="fa fa-file-text-o rounded" title="Report"></em>';
io_zotero_itemtype_icon['webpage'] = '<em class="fa fa-file-text-o rounded" title="Report"></em>';


function io_zotero_get_attachment(key) {
	var showData = jQuery(target);
    jQuery.getJSON(feed, function (data) {
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
				creators += dataload.data.creators[c].firstName.split(' ').join('&nbsp;')+'&nbsp;'+dataload.data.creators[c].lastName.split(' ').join('&nbsp;');
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
		var router = io_zotero_get_tag();
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

function io_zotero_item_details(dataload) {
	var date = '';
	if(dataload.data.date != undefined && dataload.data.date != ''){
		date = '<em class="fa fa-clock-o"></em> <b>'+dataload.data.date+'</b>';
	}
	var abstractNote = '';
	if(dataload.data.abstractNote != undefined && dataload.data.abstractNote != ''){
		abstractNote += '<div class="abstractNote"><div class="text">'+dataload.data.abstractNote+'</div><div class="grad"></div><a href="javascript:io_class_toggle(';
		abstractNote += "'.abstractNote','showing'";
		abstractNote += ')" class="block button_posts" title="Show all"><em class="fa fa-angle-double-down shower"></em><em class="fa fa-angle-double-up hider"></em></a></div>';
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
		url = '<div class="url"><a class="btn btn-primary rounded" href="'+dataload.data.url+'" target="_blank">Link &nbsp;<em class="fa fa-external-link"></em></a></div>';
	}
	var publisher = '';
	if(dataload.data.publisher != undefined && dataload.data.publisher != ''){
		if(date != ''){
			publisher += ', ';
		}
		publisher += dataload.data.publisher;
	}
	var conferenceName = '';
	if(dataload.data.conferenceName != undefined && dataload.data.conferenceName != ''){
		if(dataload.data.conferenceName != dataload.data.publisher){
			if(date != '' || publisher != ''){
				publisher = ', ';
			}
			publisher += dataload.data.conferenceName;
		}
		conferenceName = '<span class="block conferenceName">'+conferenceName+'</span>';
	}
	var libraryCatalog = '';
	if(dataload.data.libraryCatalog != undefined && dataload.data.libraryCatalog != ''){
		if(dataload.data.libraryCatalog != dataload.data.publisher){
			if(dataload.data.libraryCatalog != dataload.data.conferenceName){
				if(date != '' || publisher != ''){
					publisher = ', ';
				}
				publisher += dataload.data.libraryCatalog;
			}
		}
		libraryCatalog = '<span class="block libraryCatalog">'+libraryCatalog+'</span>';
	}
	var extra = '';
	if(dataload.data.extra != undefined && dataload.data.extra != ''){
		if(date != '' || publisher != ''){
			publisher = ', ';
		}
		publisher += dataload.data.extra;
		extra = '<span class="block extra">'+extra+'</span>';
	}

	if(publisher != ''){
		publisher = '<span class="publisher">'+publisher+'</span>';
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
	var out = '';
	if(io_zotero_layout == 'item'){
		out += '<a href="javascript:io_zotero_item_back_button()" class="back rounded" title="Back to library"><em class="fa fa-chevron-left"></em><span>Back</span></a> <h1 class="margint0"> <a href="'+dataload.data.url+'" target="_blank">'+dataload.data.title+' <sup><em class="fa fa-external-link"></em></sup></a></h1>';
	}else{
		out += '<hr /><button class="close" onclick="io_zotero_item_deselect()"><em class="fa fa-times-circle"></em></button><h2 class="margint0">'+dataload.data.title+'</h2>';
	}
	out += '\
    <div id="zotero_detail_attachments" class="icons">'+icons+'</div>\
    <h4 class="margint0 authors"><em class="fa fa-graduation-cap"></em>&nbsp;'+io_zotero_item_creators(dataload)+'</h4>\
    <div class="date">'+date+''+publisher+'</div>\
    '+conferenceName+'\
    '+libraryCatalog+'\
    '+extra+'\
    <div class="tags">'+tags+'</div>\
    '+place+'\
    '+ISBN+'\
    '+abstractNote+'\
    <div class="row buttons"><div class="col-sm-14 col-xs-14"><a class="btn btn-default btn-block rounded" href="#'+dataload.key+'">Read more &nbsp;<em class="fa fa-chevron-right"></em></a></div><div class="col-sm-10 col-xs-10 pdl0">'+url+'</div></div>\
	';
	return out;
}

function io_zotero_item_back_button() {
	if(window.history == 1){
		document.location.href = '/library/';
	}else{
		window.history.back();
	}
}

function io_zotero_item_html(dataload) {
	jQuery("#zotero_details").empty();
	jQuery("#zotero_load_details").html(io_zotero_item_details(dataload));
	jQuery("#io-lib-tools").html(library_item_tools);
	io_zotero_item_attachments();
	//jQuery('[data-toggle="tooltip"]').tooltip();
}

function io_zotero_item_attachments() {
	if(io_zotero_arr_obj[io_zotero_selection].icons == undefined){
		if(!jQuery("#zotero_loading").hasClass('loading')){
			jQuery("#zotero_loading").addClass('loading');
		}
		jQuery.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items/'+io_zotero_selection+'/children?key='+io_zotero_pubkey+'&format=json&include=data', function (data) {
	    	if(data){
	    		//jQuery("#zotero_load").empty();
	    		//jQuery("#zotero_load_details").empty();
	    		var iframes = '';
	    		var icons = '';

				for(var i=0;i<data.length;i++){
					if(data[i].data.filename != undefined){
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
						icons += '<a class="icon" href="https://api.zotero.org/groups/'+io_zotero_group+'/items/'+attach_id+'/file/view?key='+io_zotero_pubkey+'" title="'+data[i].data.filename+'" dataType="'+data[i].data.contentType+'" target="_blank" data-toggle="tooltip"><span class="ico">'+icon+'</span> <b class="block">'+data[i].data.filename+'</b> <small class="block">'+data[i].data.dateModified.substr(0,10)+'</small></a>';
						iframes += '<iframe id="'+cls+'" src="https://api.zotero.org/groups/'+io_zotero_group+'/items/'+attach_id+'/file/view?key='+io_zotero_pubkey+'" width="100%" height="1000" style="border:0">Loading document ...</iframe>';

					}

				}
		    	io_zotero_arr_obj[io_zotero_selection].icons = icons;
		    	io_zotero_arr_obj[io_zotero_selection].iframes = iframes;
    			jQuery("#zotero_detail_attachments").html(icons);
    			jQuery("#zotero_load").html(iframes);
				jQuery("#zotero_loading").removeClass('loading');

	    	}
		});
	}
	return false;
}

function io_zotero_item_deselect() {
	jQuery(".open_book.selected").removeClass('selected');
	jQuery("#zotero_details").html(' ');
	jQuery("#rightcol").attr('class','');
}

function io_zotero_item_click(obj) {
	var hash = window.location.hash;
	jQuery(".open_book.selected").removeClass('selected');
	io_lib_item_selected = obj.getAttribute('rel');
	setTimeout(function(){
		if(hash == window.location.hash){
			jQuery(obj).addClass('selected');
			if(io_zotero_layout != 'item'){
				jQuery("#zotero_details").html('<div class="wrap">'+io_zotero_item_details(io_zotero_arr_obj[io_lib_item_selected])+'</div>');
				jQuery("#rightcol").attr('class','library_item_selected');
			}
		}
		
	},100);
}

function io_zotero_item() {
	jQuery(".io_autocomplete").empty();	
	jQuery("#zotero_loading").addClass('loading');
	jQuery("#zotero_details").empty();
	var which = io_zotero_get_id();
	io_zotero_selection = which;
	io_zotero_layout = 'item';
	if(io_zotero_arr_obj[which] == undefined){
		jQuery.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items/'+which+'/?key='+io_zotero_pubkey+'&format=json&include=data', function (data) {
	    	if(data){
			    io_zotero_arr_obj[which] = data;
			    io_zotero_item_html(io_zotero_arr_obj[which]);
	    	}else{
				jQuery("#zotero_loading").removeClass('loading');
	    	}
		});
	}else{
    	io_zotero_item_html(io_zotero_arr_obj[which]);
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
		publisher += dataload.data.publisher;
	}
	if(dataload.data.conferenceName != undefined && dataload.data.conferenceName != ''){
		if(dataload.data.conferenceName != dataload.data.publisher){
			if(date != '' || publisher != ''){
				publisher = ', ';
			}
			publisher += dataload.data.conferenceName;
		}

	}
	if(dataload.data.libraryCatalog != undefined && dataload.data.libraryCatalog != ''){
		if(dataload.data.libraryCatalog != dataload.data.publisher){
			if(dataload.data.libraryCatalog != dataload.data.conferenceName){
				if(date != '' || publisher != ''){
					publisher = ', ';
				}
				publisher += dataload.data.libraryCatalog;
			}
		}
	}
	
	if(dataload.data.extra != undefined && dataload.data.extra != ''){
		if(date != '' || publisher != ''){
			publisher = ', ';
		}
		publisher += dataload.data.extra;
	}
	
	if(publisher != ''){
		publisher = '<span class="publisher">'+publisher+'</span>';
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
    <div class="book">\
        <div class="text">\
            <div class="open_book" id="book-'+dataload.key+'" rel="'+dataload.key+'" onclick="io_zotero_item_click(this)">\
            	<div class="tags side">'+tags+'</div>\
            	<div class="bg">\
                    <div class="opener text-center"><a href="#'+dataload.key+'" class="rounded">OPEN</a></div>\
                    <div class="typeicon"><button class="close"><em class="fa fa-times"></em></button>'+io_zotero_itemtype_icon[dataload.data.itemType]+'</div>\
                    <h2 class="margin0">'+dataload.data.title+'</h2>\
					<hr class="red short opa100" />\
                    <h3 class="margint0 authors">'+io_zotero_item_creators(dataload)+'</h3>\
                    <p class="date">'+dataload.data.date+''+publisher+'</p>\
                    <div class="tags">'+cover_tags+'</div>\
                    <div class="footopener"><a href="#'+dataload.key+'" class="btn btn-default rounded">Read more &nbsp;<em class="fa fa-chevron-right"></em></a></div>\
                </div>\
            </div>\
        </div>\
    </div>\
	';
	return item;
}

function io_zotero_tag_select(tag) {
	jQuery("#zotero_tags .btn.selected").removeClass('selected');
	jQuery("#zotero_tags .btn").each(function(){
		var url = jQuery(this).attr('href');
		if(url == '#tag-'+tag){
			jQuery(this).addClass('selected');
		}
	});
}


function io_zotero_search_load() {
	if(!io_zotero_loaded_full){
		jQuery.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items?start='+io_zotero_search_loaded+'&limit='+(io_zotero_search_loaded+io_zotero_search_step)+'&format=json&search=website-&v=1&key='+io_zotero_pubkey, function (data) {
	    	if(data.length > 0){
	    		console.log(data);
				for(var i=0;i<data.length;i++){
					if(io_zotero_tag_ok(data[i].data.tags)){
						io_zotero_arr_obj[data[i].key] = new Object();
						io_zotero_arr_obj[data[i].key] = data[i];
						io_zotero_arr_obj[data[i].key].loaded = false;
					}
				}
				io_zotero_search_loaded += io_zotero_search_step;
				io_zotero_searching();
			    io_zotero_search_load();
	    	}else{
				jQuery('#library-search-button').removeClass('loading');
	    		io_zotero_loaded_full = true;
	    		return false;
	    	}
		});
	}
}

function io_zotero_lib_list_setup() {
	var tag = io_zotero_get_tag();
	jQuery("#zotero_details").empty();
	jQuery("#zotero_load").empty();
	jQuery("#io-lib-tools").html(library_tools);
	if(!tag){
    	jQuery("#zotero_load").html(io_zotero_library());
	}else{
    	jQuery("#zotero_load").html('<div class="library-title"><h2 class="margint0"><em class="icon fa fa-tag website-'+tag+' rounded"></em> '+tag+'</h2></div>'+io_zotero_library());
    	io_zotero_tag_select(tag);
	}
	jQuery('[data-toggle="tooltip"]').tooltip();
}

function io_zotero_load(tag,callback) {
	jQuery(".io_autocomplete").empty();
	jQuery("#zotero_loading").addClass('loading');
	if(io_zotero_lib_list_tag != tag){
		jQuery("#zotero_load,#zotero_load_detail").html('');
	}
	//alert(io_zotero_loaded_full);
	jQuery("#rightcol").attr('class','');
	io_zotero_layout = 'list';
	if(!io_zotero_loaded_full){
		if(io_zotero_lib_list_tag != tag){
			io_zotero_lib_list_loaded = 0;
		}
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
		jQuery.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items?start='+io_zotero_lib_list_loaded+'&limit='+(io_zotero_lib_list_loaded+io_zotero_lib_list_step)+'&format=json'+tag_val+'&v=1&key='+io_zotero_pubkey, function (data) {
	    	if(data){
				for(var i=0;i<data.length;i++){
					if(io_zotero_tag_ok(data[i].data.tags)){
						io_zotero_arr_obj[data[i].key] = new Object();
						io_zotero_arr_obj[data[i].key] = data[i];
						io_zotero_arr_obj[data[i].key].loaded = false;
						if(io_zotero_lib_list_tag == tag){
					    	jQuery("#zotero_load").append(io_zotero_library_item(data[i]));
						}
					}
				}
				if(io_zotero_lib_list_tag != tag){
					io_zotero_lib_list_setup();
				}

				io_zotero_lib_list_tag = tag;

				if(lib_list){
					
			    }

			    io_zotero_lib_list_loaded += io_zotero_lib_list_step;
		    	io_zotero_selection = tag;
		    	jQuery("#zotero_loading").removeClass('loading');
		    	if(typeof callback == 'function'){
			    	callback();
		    	}
	    	}
		});
	}else{
		io_zotero_lib_list_setup();
	}
}

var io_zotero_search_init = false;
var io_zotero_search_autocomplete = true;

function io_zotero_search_action() {
	io_zotero_layout = 'search';
    io_zotero_search_autocomplete = false;
    jQuery("#io-lib-tools").html(library_item_tools);
	io_zotero_searching();
}

function io_zotero_search() {
	if(!io_zotero_search_init){
		io_zotero_arr_obj = {};
		io_zotero_search_load();
		jQuery('#library-search-button').addClass('loading');
		jQuery('#library-search').on('input', function() { 
		    io_zotero_search_autocomplete = true;
			io_zotero_searching();
		});
		jQuery('#library-search-button').on('click', function() { 
		    io_zotero_search_action();
		});
		jQuery('html').click(function() {
			jQuery(".io_autocomplete").empty();
		});
		jQuery('#library-search,.io_autocomplete').click(function(event){
		    event.stopPropagation();
		});
		io_zotero_search_init = true;
	}
	jQuery(".io_autocomplete.none").removeClass('none');	
}

function io_zotero_searching() {
	var out = '';
	var searched = jQuery("#library-search").val();
	if(searched.length > 0){
		jQuery(".io_autocomplete").empty();
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


				var dataload = io_zotero_arr_obj[key];
				var date = '';
				if(dataload.data.date != undefined && dataload.data.date != ''){
					date = '<em class="fa fa-clock-o"></em> <strong>'+dataload.data.date+'</strong>';
				}
				var abstractNote = '';
				if(dataload.data.abstractNote != undefined && dataload.data.abstractNote != ''){
					abstractNote = '<div class="abstractNote">'+dataload.data.abstractNote+'</div>';
				}
				var place = '';
				if(dataload.data.place != undefined && dataload.data.place != ''){
					place = '<span class="place"><em class="fa fa-globe"></em> '+dataload.data.place+'</span>';
				}
				var ISBN = '';
				if(dataload.data.ISBN != undefined && dataload.data.ISBN != ''){
					ISBN = '<span class="ISBN"><em class="fa fa-book"></em> '+dataload.data.ISBN+'</span>';
				}
				var publisher = '';
				if(dataload.data.publisher != undefined && dataload.data.publisher != ''){
					publisher += '<span class="publisher">'+dataload.data.publisher+'</span>';
				}

/*
				for(var i=0;i<io_zotero_arr_obj[key].data.tags.length;i++){
					searching_tags[i] = io_zotero_arr_obj[key].data.tags[i].tag.toLowerCase().search(searched.toLowerCase());
				}*/
				var tit_tag = 'h2';
				if(searching_title != -1){
					var tit_s = io_zotero_arr_obj[key].data.title;
					if(io_zotero_search_autocomplete){
						tit_tag = 'span';
					}
					tit += '<'+tit_tag+' class="block title">';
					if(!io_zotero_search_autocomplete){
						tit += '<a href="#'+io_zotero_arr_obj[key].key+'">';
					}
					tit += tit_s.substr(0,searching_title)+'<b>'+tit_s.substr(searching_title,searched.length)+'</b>'+tit_s.substr(searching_title+searched.length,tit_s.length);
					if(!io_zotero_search_autocomplete){
						tit += '</a>';
					}
					tit += '</'+tit_tag+'>';
					str = true;
				}
				if(searching_authors != -1){
					var aut_s = io_strip(io_zotero_item_creators(io_zotero_arr_obj[key]));
					aut += '<div class="block authors"><em class="fa fa-graduation-cap"></em> '+aut_s.substr(0,searching_authors)+'<b>'+aut_s.substr(searching_authors,searched.length)+'</b>'+aut_s.substr(searching_authors+searched.length,aut_s.length)+'</div>';
					str = true;
				}
				if(io_zotero_tag_ok(io_zotero_arr_obj[key].data.tags)){
					for(var i=0;i<io_zotero_arr_obj[key].data.tags.length;i++){
						if (io_zotero_arr_obj[key].data.tags[i].tag.match('website-')) {
							searching_tags[i] = io_zotero_arr_obj[key].data.tags[i].tag.toLowerCase().search(searched.toLowerCase());
							var tag_s = io_zotero_arr_obj[key].data.tags[i].tag.replace('website-','');
							if(searching_tags[i] != -1){
								tags += '<span class="tag">'+tag_s.substr(0,searching_tags[i])+'<b>'+tag_s.substr(searching_tags[i],searched.length)+'</b>'+tag_s.substr(searched.length,tag_s.length)+'</span> ';
								if(io_zotero_search_autocomplete){
									tagline += '<span class="tag">'+tag_s.substr(0,searching_tags[i])+'<b>'+tag_s.substr(searching_tags[i],searched.length)+'</b>'+tag_s.substr(searching_tags[i]+searched.length,tag_s.length)+'</span>';
								}else{
									tagline += '<span class="label tag '+doDashes(io_zotero_arr_obj[key].data.tags[i].tag)+'"><a href="#tag-'+doDashes(tag_s)+'">'+tag_s.substr(0,searching_tags[i])+'<b>'+tag_s.substr(searching_tags[i],searched.length)+'</b>'+tag_s.substr(searching_tags[i]+searched.length,tag_s.length)+'</a></span>';
								}
							}else{
								if(io_zotero_search_autocomplete){
									tagline += '<span class="tag">'+tag_s+'</span>';
								}else{
									tagline += '<span class="label tag '+doDashes(io_zotero_arr_obj[key].data.tags[i].tag)+'"><a href="#tag-'+doDashes(tag_s)+'">'+tag_s+'</a></span>';
								}
							}
						}
					}
				}

				if(tags != ''){
					str = true;
				}
				if(str){
					if(tit == ''){
						tit = '<'+tit_tag+' class="block title">'+io_zotero_arr_obj[key].data.title+'</'+tit_tag+'>';
					}
					if(aut == ''){
						aut = '<span class="block authors"><em class="fa fa-graduation-cap"></em> '+io_strip(io_zotero_item_creators(io_zotero_arr_obj[key]))+'</span>';
					}
					tagline = '<span class="block tags uppercase"><em class="fa fa-tag"></em> '+tagline+'</span>';

					out += '<li class="item">';
					if(io_zotero_search_autocomplete){
						out += '<a href="#'+io_zotero_arr_obj[key].key+'">';
					}
					out += tit;

					var dateandpublisher = '';

					if(io_zotero_search_autocomplete){
						if(date != ''){
							dateandpublisher += date;
						}
						if(publisher != ''){
							if(date != ''){
								dateandpublisher += '<br>';
							}
							dateandpublisher += publisher;
						}
						if(dateandpublisher != ''){
							out += '<span class="dateandpublisher">'+dateandpublisher+'</span>';
						}
					}else{

						if(date != ''){
							dateandpublisher += date;
						}
						if(publisher != ''){
							if(date != ''){
								dateandpublisher += ', ';
							}
							dateandpublisher += publisher;
						}
						if(place != ''){
							if(date != ''){
								dateandpublisher += ' &nbsp; ';
							}
							dateandpublisher += place;
						}
						if(ISBN != ''){
							if(date != ''){
								dateandpublisher += ' &nbsp; ';
							}
							dateandpublisher += ISBN;
						}
						if(dateandpublisher != ''){
							out += '<span class="dateandpublisher">'+dateandpublisher+'</span>';
						}
					}


					out += aut;
					out += tagline;

					if(!io_zotero_search_autocomplete){
						out += abstractNote;
						out += '<a class="btn btn-default rounded readmore" href="#'+io_zotero_arr_obj[key].key+'">Read more &nbsp;<em class="fa fa-chevron-right"></em></a>';
					}

					if(io_zotero_search_autocomplete){
						out += '</a>';
					}

					out += '</li>';

				}
			}
		}
	}else{
		jQuery(".io_autocomplete").empty();
	}
	if(out != ''){
		if(io_zotero_search_autocomplete){
			jQuery(".io_autocomplete").html('<ul>'+out+'</ul>');
		}else{
	   		jQuery("#zotero_load_details").empty();
			jQuery(".io_autocomplete").empty();
	    	jQuery("#zotero_load").html('<div class="library-title"><h2 class="margint0"><em class="icon fa fa-search searched rounded"></em> Search results for "'+searched+'"</h2></div> <ul class="results">'+out+'</ul>');
		}
	}
}


function io_zotero_init() {
	if(!io_zotero_setup){
		io_zotero_lib_list_loaded = 0;
		$('#rightcol').affix({
			offset: {
				top: 250,
				bottom: function () {
					//return (this.bottom = $('.footer').outerHeight(true))
				}
			}
		});
		io_zotero_setup = true;
	}
}
//                                    <div id="rightcol" class="fix" data-spy="affix" data-offset-top="250">

function io_zotero() {
	io_zotero_init();
	jQuery("#zotero_load,#zotero_load_details,#zotero_details").empty();
	//jQuery("#zotero_load_detail").addClass('none');
	var router = io_hash();
	//console.log(router);
	//jQuery("#zotero_tags").show(0);
	jQuery("#rightcol").attr('class','');
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
	var view = jQuery(obj).data('ref');
   	jQuery(".view_control").removeClass("active");
   	jQuery("#zotero_load").removeClass(io_zotero_current_view);
   	io_zotero_current_view = view;
   	jQuery("#zotero_load").addClass(io_zotero_current_view);
   	jQuery(obj).addClass("active");
}



jQuery(window).scroll(function(){
    if (jQuery(window).scrollTop() == jQuery(document).height()-jQuery(window).height()){
        //console.log("We're at the bottom of the page!!");
        var router = io_hash();
        if(!router){ // default library
			io_zotero_load('',null);
			return false;
		}else{
			router = io_zotero_get_tag();
	    	if(router){ // tag library
				io_zotero_load(router,null);
				return false;
			}
	    }
    }
});




jQuery(window).resize(function(){

});
/*
jQuery(window).load(function(){
	jQuery('#rightcol').affix({
	  offset: 200
	});
});
*/
jQuery(window).on('hashchange', function() {
	//if(io_zotero_selection != ''){
		jQuery("#library-search").val('');
		jQuery("#zotero_load").empty();
		jQuery(".io_autocomplete").empty();
		io_zotero();

	//}
});

jQuery(document).ready(function() {
	

});



	