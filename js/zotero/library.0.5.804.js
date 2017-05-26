
var io_zotero_setup = false;
var io_zotero_group = 478201;
var io_zotero_pubkey = 'Qcjdk4erSuUZ8jvAah59Asef';
var io_zotero_selection = '';
var io_zotero_layout = '';
var io_zotero_default_tag = 'anonymity';
var io_zotero_arr_obj = new Object();
var io_zotero_search_arr_obj = new Object();

var io_zotero_loaded = 0;
var io_zotero_load_reach = 100;

var io_zotero_valid = 0;


var io_zotero_IOHK = false;
if($("#library").hasClass('Papers')){
	io_zotero_IOHK = true;

}


/*
var io_zotero_tags_arr = new Array();
io_zotero_tags_arr['anonymity'] = new Object();
io_zotero_tags_arr['anonymity'].loaded = false;
io_zotero_tags_arr['attack'] = new Object();
io_zotero_tags_arr['attack'].loaded = false;
*/
var io_lib_item_selected = '';


var io_zotero_loaded_full = false;
var io_zotero_search_step = 50;
var io_zotero_search_loaded = 0;

var io_zotero_lib_list_tag = ' ';
var io_zotero_lib_list_step = 100;
var io_zotero_lib_list_loaded = 0;

var zotero_current_order = 'desc';
var zotero_current_sort = 'date';

var zotero_order = new Object();
zotero_order.asc = 'Ascending';
zotero_order.desc = 'Descending';


var zotero_sorting = new Object();
zotero_sorting.dateAdded = 'Date Added';
zotero_sorting.date = 'Date';
zotero_sorting.title = 'Title';
zotero_sorting.publisher = 'Publisher';

var library_tools = function(){
	var out = '\
	<div class="btn-group inline-block sort_view" role="group" aria-label="View controls">\
	    <button type="button" class="view_control btn btn-default btn-lg active" data-ref="icons-s" onclick="io_zotero_view_control(this)"><em class="fa fa-th"></em></button>\
	    <button type="button" class="view_control btn btn-default btn-lg" data-ref="icons-b" onclick="io_zotero_view_control(this)"><em class="fa fa-th-large"></em></button>\
	    <button type="button" class="view_control btn btn-default btn-lg" data-ref="icons-list" onclick="io_zotero_view_control(this)"><em class="fa fa-th-list"></em></button>\
	</div> &nbsp; \
	<div class="dropdown inline-block sort_by">\
	  <button class="btn btn-default dropdown-toggle btn-lg" type="button" id="lib_sort_by" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" title="Sort items by ...">\
	    <span class="extra">Sort by </span><span class="lab">'+zotero_sorting[zotero_current_sort]+'</span>\
	    <span class="caret extra"></span>\
	  </button>\
	  <ul class="dropdown-menu date_sorter" aria-labelledby="lib_sort_by">\
	    <li><a href="javascript:;" onclick="io_zotero_reorder(this)" rel="sort" val="date">Date</a></li>\
	    <li><a href="javascript:;" onclick="io_zotero_reorder(this)" rel="sort" val="title">Title</a></li>\
	  </ul>\
	</div> &nbsp; \
	<div class="dropdown inline-block">\
	  <button class="btn btn-default dropdown-toggle btn-lg" type="button" id="lib_order" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" title="Order of items">\
	    <span class="lab">'+zotero_order[zotero_current_order]+'</span>\
	    <span class="caret extra"></span>\
	  </button>\
	  <ul class="dropdown-menu" aria-labelledby="lib_order">\
	    <li><a href="javascript:;" onclick="io_zotero_reorder(this)" rel="order" val="asc">Ascending</a></li>\
	    <li><a href="javascript:;" onclick="io_zotero_reorder(this)" rel="order" val="desc">Descending</a></li>\
	  </ul>\
	</div>\
';
	return out;
}

var lisec = "/library/";
if(io_zotero_IOHK){
lisec = "/pepers/";
}

var library_item_tools = function(){
	var title = io_zotero_arr_obj[io_zotero_selection].data.title;
	var url = homeurl+'/research'+lisec+'#'+io_zotero_arr_obj[io_zotero_selection].key;
	var out = '\
	<div class="btn-group" role="group" aria-label="View controls">\
	    <button type="button" class="btn btn-default btn-lg btn-print" onclick="window.print()"><em class="fa fa-print"></em></button>\
	    <button type="button" class="btn btn-default btn-lg" data-title="'+title+'" data-link="'+url+'" onclick="io_send_mail(this)"><em class="fa fa-envelope"></em></button>\
	    <a href="http://twitter.com/share?url='+url+'&text='+title+'&via=InputOutput" class="btn btn-default btn-lg" target="_blank"><em class="fa fa-twitter"></em></a>\
	    <a href="http://www.facebook.com/sharer.php?u='+url+'&t='+title+'" class="btn btn-default btn-lg" target="_blank"><em class="fa fa-facebook"></em></a>\
	    <a href="http://www.linkedin.com/shareArticle?mini=true&url='+url+'" class="btn btn-default btn-lg" target="_blank"><em class="fa fa-linkedin"></em></a>\
	    <a href="https://plusone.google.com/_/+1/confirm?hl=en&url='+url+'" class="btn btn-default btn-lg" target="_blank"><em class="fa fa-google-plus"></em></a>\
	    <a href="http://reddit.com/submit?url='+url+'&title='+title+'" class="btn btn-default btn-lg" target="_blank"><em class="fa fa-reddit"></em></a>\
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

function io_zotero_date(date,pre,d1,d2,end) {
	//2016-09-15T13:13:51Z
	var out = '';
	var arr = date.split('T');
	var date_arr = arr[0].split('-');
	out = pre+date_arr[2]+d1+io_months[date_arr[1]-1]+d2+date_arr[0]+end;
	return out;
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
    			//console.log(io_zotero_arr_obj[key]);
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
		url = '<div class="url"><a class="btn btn-primary rounded bg_f00 c_fff" href="'+dataload.data.url+'" target="_blank">Link &nbsp;<em class="fa fa-external-link"></em></a></div>';
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
			tags += '<span class="label '+doDashes(dataload.data.tags[i].tag)+'"><a href="#tag-'+doDashes(tag_title)+'"><em class="fa fa-tag"></em> '+tag_title.toUpperCase()+'</a></span> ';
		}
	}
	var out = '';
	if(io_zotero_layout == 'item'){
		out += '<a href="javascript:io_zotero_item_back_button()" class="back rounded"><em class="fa fa-chevron-left"></em><span>'+iolab_back+'</span></a> <h1 class="margint0 roboto"> <a href="'+dataload.data.url+'" target="_blank">'+dataload.data.title+'&nbsp;<sup><small><em class="fa fa-external-link"></em></small></sup></a></h1>';
	}else{
		out += '<button class="close" onclick="io_zotero_item_deselect()"><em class="fa fa-times-circle"></em></button><h2 class="margint0"><a href="#'+dataload.key+'">'+dataload.data.title+'</a></h2>';
	}

	out += '\
    <h4 class="margint0 authors"><em class="fa fa-graduation-cap"></em>&nbsp;'+io_zotero_item_creators(dataload)+'</h4>\
    <div class="url uppercase pull-right">'+url+'</div>\
    <div class="date">'+date+''+io_nohttp(publisher)+'</div>\
    '+conferenceName+'\
    '+libraryCatalog+'\
    '+extra+'\
    <div class="tags">'+tags+'</div>\
    '+place+'\
    '+ISBN+'\
    '+abstractNote+'\
    <div class="row buttons uppercase"><div class="col-sm-12 col-xs-12"><a class="btn btn-primary" href="#'+dataload.key+'">'+iolab_read_more+' &nbsp;<em class="fa fa-chevron-right"></em></a></div><div class="col-sm-12 col-xs-12 text-right"><a class="btn btn-default" href="javascript:io_zotero_item_deselect()">Close</a></div></div>\
	';
	if(io_zotero_layout == 'item'){
		out = '\
		<div class="col-lg-19 col-lg-offset-1 col-md-18 col-md-offset-1 col-sm-17 col-sm-offset-2">\
		'+out+'\
		</div>';
	}
	return out;
}

function io_zotero_item_back_button() {
	if(io_zotero_arr_obj.length > 1){
		window.history.back();
	}else{
		document.location.href = '/research'+lisec;
	}
}

function io_zotero_item_html(dataload) {
	$("#zotero_load_preview").empty();
	$("#zotero_load_details").html(io_zotero_item_details(dataload));
	$("#io-lib-tools").html(library_item_tools);
	io_zotero_item_attachments();
	var th = $('.abstractNote .text').height();
	if(th > 200){
		$('.abstractNote').addClass('hiding');
		$('.abstractNote .grad,.abstractNote .button_posts').show();
	}else{
		$('.abstractNote .grad,.abstractNote .button_posts').hide();
	}
}

function io_zotero_item_attachments() {
	if(io_zotero_arr_obj[io_zotero_selection].icons == undefined){
		if(!$("#zotero_loading").hasClass('loading')){
			$("#zotero_loading").addClass('loading');
		}
		$.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items/'+io_zotero_selection+'/children?key='+io_zotero_pubkey+'&format=json&include=data', function (data) {
	    	if(data){
	    		//$("#zotero_load").empty();
	    		//$("#zotero_load_details").empty();
	    		var iframes = '<div class="row filerow">';
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

						icons = '<a class="icon" href="https://api.zotero.org/groups/'+io_zotero_group+'/items/'+attach_id+'/file/view?key='+io_zotero_pubkey+'" title="'+data[i].data.filename+'" dataType="'+data[i].data.contentType+'" target="_blank" data-toggle="tooltip"><span class="ico">'+icon+'</span> <b class="block">'+data[i].data.filename+'</b> <small class="block">'+data[i].data.dateModified.substr(0,10)+'</small></a>';

						iframes += '\
							<div class="col-lg-19 col-lg-offset-1 col-md-18 col-md-offset-1 col-sm-17 col-sm-offset-1">\
							<iframe id="'+cls+'" src="https://api.zotero.org/groups/'+io_zotero_group+'/items/'+attach_id+'/file/view?key='+io_zotero_pubkey+'" width="100%" height="1200" style="border:0;border-bottom:1px solid #555">Loading ...</iframe>\
							</div>\
							<div class="col-lg-4 col-md-5 col-sm-6">\
							<div class="icons">'+icons+'</div>\
							</div>\
							';

					}

				}
				iframes += '</div>';

		    	io_zotero_arr_obj[io_zotero_selection].icons = icons;
		    	io_zotero_arr_obj[io_zotero_selection].iframes = iframes;
    			//$("#zotero_detail_attachments").html(icons);
    			$("#zotero_load").html(iframes);
				$("#zotero_loading").removeClass('loading');

	    	}
		});
	}
	return false;
}

function io_zotero_item_deselect() {
	$('.is-expanded').removeClass('is-expanded').addClass('is-collapsed');
	$("#zotero_load_preview").empty();
}


function io_zotero_item_preview_note() {
	var th = $('.is-expanded .abstractNote .text').height();
	if(th > 200){
		$('.is-expanded .abstractNote').addClass('hiding');
		$('.is-expanded .abstractNote .grad,.is-expanded .abstractNote .button_posts').show();
	}else{
		$('.is-expanded .abstractNote .grad,.is-expanded .abstractNote .button_posts').hide();
	}
}


function io_zotero_item_click(obj) {
	var hash = window.location.hash;
	$(".open_book.selected").removeClass('selected');
	io_lib_item_selected = obj.getAttribute('rel');


	var thisCell = $(obj).closest('.book');
	if (thisCell.hasClass('is-collapsed')) {
		$("#library .is-expanded").removeClass('is-expanded').addClass('is-collapsed');
		thisCell.removeClass('is-collapsed').addClass('is-expanded');
	} else {
		thisCell.removeClass('is-expanded').addClass('is-collapsed');
	}

	$(obj).addClass('selected');
	if(io_zotero_layout != 'item'){
		$("#zotero_load_preview").html('<div class="wrap"><div class="inner">\
			<div class="logo"><img class="" src="/images/iohk-logo.png" width="214" height="50" alt="IOHK" /> <strong class="electrolize"><span class="extra">Research </span>Library</strong> <button class="close" onclick="io_zotero_item_deselect()"><em class="fa fa-times-circle"></em></button></div> '+io_zotero_item_details(io_zotero_arr_obj[io_lib_item_selected])+'</div></div>');
		$(".is-expanded .zotero_details_wrap").html(io_zotero_item_details(io_zotero_arr_obj[io_lib_item_selected]));
		io_zotero_item_preview_note();
	}

}

function io_zotero_item() {
	$(".library_autocomplete").empty();
	$("#zotero_loading").addClass('loading');
	$("#zotero_load_preview").empty();
	var which = io_zotero_get_id();
	io_zotero_selection = which;
	io_zotero_layout = 'item';
	if(io_zotero_arr_obj[which] == undefined){
		$.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items/'+which+'/?key='+io_zotero_pubkey+'&format=json&include=data', function (data) {
	    	if(data){
			    io_zotero_arr_obj[which] = data;
			    io_zotero_item_html(io_zotero_arr_obj[which]);
	    	}else{
				$("#zotero_loading").removeClass('loading');
	    	}
		});
	}else{
    	io_zotero_item_html(io_zotero_arr_obj[which]);
	}
	io_zotero_lib_list_tag = which;
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
    <div class="book is-collapsed">\
        <div class="text">\
            <div class="open_book" id="book-'+dataload.key+'" rel="'+dataload.key+'" onclick="io_zotero_item_click(this)">\
            	<div class="tags side">'+tags+'</div>\
            	<div class="bg">\
                    <div class="typeicon none"><button class="close"><em class="fa fa-times"></em></button>'+io_zotero_itemtype_icon[dataload.data.itemType]+'</div>\
                    <h2 class="margin0">'+dataload.data.title+'</h2>\
					<hr class="red short opa100" />\
                    <h3 class="margint0 authors">'+io_zotero_item_creators(dataload)+'</h3>\
                    <p class="date">'+dataload.data.date+''+io_nohttp(publisher)+'</p>\
                    <div class="tags">'+cover_tags+'</div>\
                    <div class="footopener"><a href="#'+dataload.key+'" class="btn btn-default rounded">'+iolab_read_more+' &nbsp;<em class="fa fa-chevron-right"></em></a></div>\
                </div>\
            </div>\
			<div class="arrow--up"></div>\
        </div>\
        <div class="book--expand">\
	        <div class="zotero_details_wrap zotero_details"></div>\
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


function io_zotero_search_load(autocom,widget) {
	if(io_zotero_search_init){
	if(!io_zotero_loaded_full){
		$.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items?start='+io_zotero_search_loaded+'&limit='+io_zotero_search_step+'&format=json&search=website-&v=1&key='+io_zotero_pubkey, function (data) {
	    	if(data.length > 0){
					for(var i=0;i<data.length;i++){
						if(io_zotero_tag_ok(data[i].data.tags)){
							io_zotero_search_arr_obj[data[i].key] = new Object();
							io_zotero_search_arr_obj[data[i].key] = data[i];
							io_zotero_search_arr_obj[data[i].key].loaded = false;
						}
					}
					io_zotero_search_loaded += io_zotero_search_step;
					io_zotero_searching(autocom);
				  io_zotero_search_load(autocom,widget);
	    	}else{
					if(widget){
						$(autocom).removeClass('loading');
					}else{
						$('#library-search-button').removeClass('loading');
					}
	    		io_zotero_loaded_full = true;
	    		return false;
	    	}
			});
		}
	}
}

function io_zotero_lib_list_setup() {
	var tag = io_zotero_get_tag();
	$("#zotero_details,#zotero_load_preview,#zotero_load").empty();
	$("#io-lib-tools").html(library_tools);
	if(!tag){
    	$("#zotero_load").html(io_zotero_library());
	}else{
    	$("#zotero_load_details").html('<div class="library-title"><h2 class="margint0"><em class="icon fa fa-tag website-'+tag+' rounded"></em> '+tag+'</h2></div>');
    	$("#zotero_load").html(io_zotero_library());
    	io_zotero_tag_select(tag);
	}
	$('[data-toggle="tooltip"]').tooltip();
}

function io_zotero_reorder(obj) {
	var changing = $(obj).attr('rel');
	var val = $(obj).attr('val');

	if(changing == 'sort'){
		zotero_current_sort = val;
		if(val == 'title'){
			zotero_current_order = 'asc';
		}
		//alert(zotero_sorting[zotero_current_sort]);
		$(obj).parent().parent().prev().find('.lab').text(zotero_sorting[zotero_current_sort]);
	}else{
		zotero_current_order = val;
		$(obj).parent().parent().prev().find('.lab').text(zotero_order[zotero_current_order]);
	}
	//alert(zotero_current_sort);
	io_zotero_arr_obj = {};
	io_zotero_setup = false;
	io_zotero_lib_list_loaded = 0;
	io_zotero_valid = 0;
	io_zotero();
}

function io_zotero_load(tag,callback) {
	$(".library_autocomplete").empty();
	$("#zotero_loading").addClass('loading');
	if(io_zotero_lib_list_tag != tag){
		$("#zotero_load,#zotero_load_detail").html('');
	}
	//alert(io_zotero_loaded_full);
	$("#rightcolwrap").attr('class','');
	io_zotero_layout = 'list';
	//if(io_zotero_loaded_full){
	//	io_zotero_lib_list_setup();
	//}else{
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
		if(io_zotero_IOHK){
			//tag_val = '&tag=website-papers';
		}
		//console.log(zotero_current_sort+' '+zotero_current_order+' '+tag_val+' - '+io_zotero_lib_list_loaded);
		//alert("a");
		$.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items?sort='+zotero_current_sort+'&direction='+zotero_current_order+'&start='+io_zotero_lib_list_loaded+'&limit='+io_zotero_lib_list_step+'&format=json'+tag_val+'&v=3&key='+io_zotero_pubkey, function (data) {
				if(data){
				for(var i=0;i<data.length;i++){
					//console.log(data[i].key);
					if(io_zotero_tag_ok(data[i].data.tags)){
						console.log(data[i].data.title);
						io_zotero_valid++;
						io_zotero_arr_obj[data[i].key] = new Object();
						io_zotero_arr_obj[data[i].key] = data[i];
						io_zotero_arr_obj[data[i].key].loaded = false;
						if(io_zotero_lib_list_tag == tag){
				    	$("#zotero_load").append(io_zotero_library_item(data[i]));
						}
				    //console.log(data[i]);
					}
				}
				//if(io_zotero_lib_list_tag != tag){
					io_zotero_lib_list_setup();
				//}

				io_zotero_lib_list_tag = tag;


		    io_zotero_lib_list_loaded += io_zotero_lib_list_step;
	    	io_zotero_selection = tag;
				//alert(io_zotero_valid);
				if(io_zotero_valid < 8){
					//alert("ass");
					var router = io_hash();
			    if(!router){ // default library
						io_zotero_load('',null);
					}else{
						router = io_zotero_get_tag();
			    	if(router){ // tag library
							io_zotero_load(router,null);
						}
			    }
				}else{
					$("#zotero_loading").removeClass('loading');
					if(typeof callback == 'function'){
			    	callback();
		    	}
				}
    	}
		});
	//}
}

var io_zotero_search_init = false;
var io_zotero_search_autocomplete = true;

function io_zotero_search_action() {
	io_zotero_layout = 'search';
    io_zotero_search_autocomplete = false;
    $("#io-lib-tools").html(library_tools);
	io_zotero_searching();
}

function io_zotero_search(autocom,widget) {
	//if(!io_zotero_search_init){
		io_zotero_search_loaded = 0;
		io_zotero_search_arr_obj = {};
		io_zotero_search_init = true;
		io_zotero_loaded_full = false;
		io_zotero_search_load(autocom,widget);
		if(!widget){
			$('#library-search-button').addClass('loading');
			$('#library-search').on('input', function() {
			    io_zotero_search_autocomplete = true;
					io_zotero_searching(autocom);
			});
			$('#library-search-button').on('click', function() {
			    io_zotero_search_action();
			});
			$('html').click(function() {
				$(autocom).empty();
			});
			$('#library-search,'+autocom).click(function(event){
			    event.stopPropagation();
			});
		}else{
			io_zotero_search_autocomplete = true;
			io_zotero_searching(autocom);
			$(autocom).addClass('loading');
		}
		//io_zotero_search_init = true;
	//}
	$(".library_autocomplete.none").removeClass('none');
}

function io_zotero_searching(autocom) {
	var out = '';
	if(!$("#library-search").hasClass('form-control')){
		return false;
	}
	var searched = $("#library-search").val();
	if(searched.length > 0){
		$(autocom).empty();
		for (var key in io_zotero_search_arr_obj) {
			if(io_zotero_search_arr_obj[key].data.title != undefined){ ///io_zotero_item_creators(dataload)
				var str = false;
				var tit = '';
				var aut = '';
				var tags = '';
				var tagline = '';
				var searching_title = doDashes(io_zotero_search_arr_obj[key].data.title).search(doDashes(searched));
				var searching_authors = doDashes(io_strip(io_zotero_item_creators(io_zotero_search_arr_obj[key]))).search(doDashes(searched));
				var searching_tags = new Array();


				var dataload = io_zotero_search_arr_obj[key];
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

				var tit_tag = 'h2';
				if(searching_title != -1){
					var tit_s = io_zotero_search_arr_obj[key].data.title;
					if(io_zotero_search_autocomplete){
						tit_tag = 'span';
					}
					tit += '<'+tit_tag+' class="block title">';
					if(!io_zotero_search_autocomplete){
						tit += '<a href="#'+io_zotero_search_arr_obj[key].key+'">';
					}
					tit += tit_s.substr(0,searching_title)+'<b>'+tit_s.substr(searching_title,searched.length)+'</b>'+tit_s.substr(searching_title+searched.length,tit_s.length);
					if(!io_zotero_search_autocomplete){
						tit += '</a>';
					}
					tit += '</'+tit_tag+'>';
					str = true;
				}
				if(searching_authors != -1){
					var aut_s = io_strip(io_zotero_item_creators(io_zotero_search_arr_obj[key]));
					aut += '<div class="block authors"><em class="fa fa-graduation-cap"></em> '+aut_s.substr(0,searching_authors)+'<b>'+aut_s.substr(searching_authors,searched.length)+'</b>'+aut_s.substr(searching_authors+searched.length,aut_s.length)+'</div>';
					str = true;
				}
				if(io_zotero_tag_ok(io_zotero_search_arr_obj[key].data.tags)){
					for(var i=0;i<io_zotero_search_arr_obj[key].data.tags.length;i++){
						if (io_zotero_search_arr_obj[key].data.tags[i].tag.match('website-')) {
							searching_tags[i] = doDashes(io_zotero_search_arr_obj[key].data.tags[i].tag).search(doDashes(searched));
							var tag_s = io_zotero_search_arr_obj[key].data.tags[i].tag.replace('website-','');
							if(searching_tags[i] != -1){
								tags += '<span class="tag">'+tag_s.substr(0,searching_tags[i])+'<b>'+tag_s.substr(searching_tags[i],searched.length)+'</b>'+tag_s.substr(searched.length,tag_s.length)+'</span> ';
								if(io_zotero_search_autocomplete){
									tagline += '<span class="tag">'+tag_s.substr(0,searching_tags[i])+'<b>'+tag_s.substr(searching_tags[i],searched.length)+'</b>'+tag_s.substr(searching_tags[i]+searched.length,tag_s.length)+'</span> ';
								}else{
									tagline += '<span class="label tag '+doDashes(io_zotero_search_arr_obj[key].data.tags[i].tag)+'"><a href="#tag-'+doDashes(tag_s)+'"><em class="fa fa-tag"></em> '+tag_s.substr(0,searching_tags[i])+'<b>'+tag_s.substr(searching_tags[i],searched.length)+'</b>'+tag_s.substr(searching_tags[i]+searched.length,tag_s.length)+'</a></span>';
								}
							}else{
								if(io_zotero_search_autocomplete){
									tagline += '<span class="tag">'+tag_s+'</span> ';
								}else{
									tagline += '<span class="label tag '+doDashes(io_zotero_search_arr_obj[key].data.tags[i].tag)+'"><a href="#tag-'+doDashes(tag_s)+'"><em class="fa fa-tag"></em> '+tag_s+'</a></span>';
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
						tit = '<'+tit_tag+' class="block title">'+io_zotero_search_arr_obj[key].data.title+'</'+tit_tag+'>';
					}
					if(aut == ''){
						aut = '<span class="block authors"><em class="fa fa-graduation-cap"></em> '+io_strip(io_zotero_item_creators(io_zotero_search_arr_obj[key]))+'</span>';
					}
					tagline = '<span class="block tags uppercase">'+tagline+'</span>';

					out += '<li class="item">';
					if(io_zotero_search_autocomplete){
						out += '<a href="/research/library/#'+io_zotero_search_arr_obj[key].key+'">';
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
						out += '<a class="btn btn-default rounded readmore" href="#'+io_zotero_search_arr_obj[key].key+'">'+iolab_read_more+' &nbsp;<em class="fa fa-chevron-right"></em></a>';
					}

					if(io_zotero_search_autocomplete){
						out += '</a>';
					}

					out += '</li>';

				}
			}
		}
	}else{
		$(autocom).empty();
	}
	if(out != ''){
		if(io_zotero_search_autocomplete){
			$(autocom).html('<ul>'+out+'</ul>');
		}else{
	   		$("#zotero_load_details").empty();
				$(autocom).empty();
	    	$("#zotero_load_details").html('<div class="library-title"><h2 class="margint0"><em class="icon fa fa-search searched rounded"></em> Search for "'+searched+'"</h2></div>');
	    	$("#zotero_load").html('<ul class="results">'+out+'</ul>');
		}
	}
}


function io_zotero_init() {
	if(!io_zotero_setup){
		io_zotero_lib_list_loaded = 0;
		io_zotero_arr_obj = {};
		io_zotero_search_arr_obj = {};
		io_zotero_search_init = false;
		io_zotero_setup = true;
	}
}

function io_zotero() {
	io_zotero_init();
	$("#io-lib-tools").html(library_tools);
	$("#zotero_load,#zotero_load_details,#zotero_details").empty();
	var router = io_hash();
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



$(window).scroll(function(){
	if($(window).scrollTop() > 200){
		//$('#rightcol').attr('class','fixtop');
	}else{
		//$('#rightcol').attr('class','');
	}

  if ($(window).scrollTop() == $(document).height()-$(window).height()){
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




$(window).resize(function(){

});

$(window).on('hashchange', function() {
	if(io_zotero_lib_list_tag != ' '){
		io_zotero_search_init = true;
		$("#library-search").val('');
		$('#library-search-button').removeClass('loading');
		$("#zotero_load,#zotero_load_details,#zotero_details").empty();
		$(".library_autocomplete").empty();
		io_zotero();

	}
});

$(document).ready(function() {


});
