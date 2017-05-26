
var io_zotero_group = 478201;
var io_zotero_pubkey = 'Qcjdk4erSuUZ8jvAah59Asef';
var io_zotero_selection = '';
var io_zotero_default_tag = 'anonymity';
var io_zotero_arr = new Array();
var io_zotero_arr_obj = new Object();

var io_zotero_tags_arr = new Array();
io_zotero_tags_arr['anonymity'] = new Object();
io_zotero_tags_arr['anonymity'].loaded = false;
io_zotero_tags_arr['attack'] = new Object();
io_zotero_tags_arr['attack'].loaded = false;

var io_lib_item_selected = '';

var library_tools = '<div class="btn-group" role="group" aria-label="View controls">\
                            <button type="button" class="btn btn-default"><em class="fa fa-th"></em></button>\
                            <button type="button" class="btn btn-default"><em class="fa fa-th-large"></em></button>\
                            <button type="button" class="btn btn-default"><em class="fa fa-th-list"></em></button>\
                        </div>';
var library_item_tools = '<a href="#" class="btn btn-default">Submit a paper</a>';



function io_zotero_get_attachment(key) {
	var showData = jQuery(target);
    jQuery.getJSON(feed, function (data) {
    	if(data){
    		showData.empty();
			for(var i=0;i<data.length;i++){
				console.log(data[i].data.title);
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

function io_zotero_library() {
	var out = '';
	for (var key in io_zotero_arr_obj) {
		out += io_zotero_library_item(io_zotero_arr_obj[key]);
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
		publisher = ', <span class="publisher">'+dataload.data.publisher+'</span>';
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
	jQuery("#io-lib-tools").html(library_item_tools);
	jQuery("#zotero_details").html(out);
	jQuery('[data-toggle="tooltip"]').tooltip();
}


function io_zotero_item() {
	var which = io_zotero_get_id();

	//if(!io_zotero_arr[which].loaded){
		jQuery.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items/'+which+'/children?key='+io_zotero_pubkey+'&format=json&include=data', function (data) {
	    	if(data){
	    		jQuery("#zotero_load").empty();
	    		jQuery("#zotero_load_detail").empty();
	    		var iframes = '';
	    		var icons = '';
				for(var i=0;i<data.length;i++){
					var attach_id = data[i].key;
					var icon = '<span class="bigbig"><em class="fa fa-file-o"></em></span>';
					if(data[i].data.contentType == "text/html"){
						icon = '<span class="bigbig"><em class="fa fa-file-text-o"></em></span>';
					}
					if(data[i].data.contentType == "application/pdf"){
						icon = '<span class="bigbig"><em class="fa fa-file-pdf-o"></em></span>';
					}
					//console.log(data[i]);
					//out += 'https://api.zotero.org/groups/'+io_zotero_group+'/items/'+attach_id+'/file/view?key='+io_zotero_pubkey+'';
					icons += '<a class="block" href="https://api.zotero.org/groups/'+io_zotero_group+'/items/'+attach_id+'/file/view?key='+io_zotero_pubkey+'" title="'+data[i].data.filename+'" dataType="'+data[i].data.contentType+'" target="_blank" data-toggle="tooltip">'+icon+'&nbsp; '+data[i].data.dateModified.substr(0,10)+' <small class="pull-right"><em class="fa fa-external-link"></em></small></a>';
					iframes += '<iframe src="https://api.zotero.org/groups/'+io_zotero_group+'/items/'+attach_id+'/file/view?key='+io_zotero_pubkey+'" width="100%" height="1000" style="border:0">Loading document ...</iframe>';
					//iframes += '<iframe src="'+data[i].data.url+'" width="100%" height="1000" style="border:0">Loading document ...</iframe>';
				} // 
		    	io_zotero_arr_obj[which].icons = icons;
		    	io_zotero_arr_obj[which].iframes = iframes;
		    	io_zotero_item_selected(io_zotero_arr_obj[which]);
    			jQuery("#zotero_detail_attachments").html(icons).removeClass('none');
    			jQuery("#zotero_load_detail").html(iframes).removeClass('none');

	    	}
		});
	//}else{

    //}
	
	return false;
}

function io_zotero_item_click(obj) {
	//alert(obj.getAttribute('rel'));
	jQuery(".open_book.selected").removeClass('selected');
	io_lib_item_selected = obj.getAttribute('rel');
	setTimeout(function(){
		jQuery(obj).addClass('selected');

	},50);


	//console.log(io_zotero_arr_obj[io_lib_item_selected]);
	io_zotero_item_selected(io_zotero_arr_obj[io_lib_item_selected]);
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
		publisher = ', <span class="publisher">'+dataload.data.publisher+'</span>';
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
	//console.log(dataload.data.tags);    return str.replace(re2, '').toLowerCase(); // ..aaand the second + return lowercased result

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
	jQuery("#zotero_tags .btn.selected").removeClass('selected');
	jQuery("#zotero_tags .btn").each(function(){
		var url = jQuery(this).attr('href');
		console.log(url);
		if(url == '#tag-'+tag){
			jQuery(this).addClass('selected');
		}
	});
}



function io_zotero_tag_click(obj) {
	
}




function io_zotero_tag(tag,callback) {
	var lib_list = true;
	var tag_val = '';
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
		tag_val = '';
	}
	//alert(tag);
	jQuery.getJSON('https://api.zotero.org/groups/'+io_zotero_group+'/items?start=0&limit=100&format=json'+tag_val+'&v=1&key='+io_zotero_pubkey, function (data) {
    	if(data){
    		io_zotero_arr = [];
			for(var i=0;i<data.length;i++){
				if(io_zotero_tag_ok(data[i].data.tags)){
					io_zotero_obj = new Object();
					io_zotero_obj = data[i];
					io_zotero_obj.tag = tag;
					io_zotero_obj.loaded = false;
					io_zotero_arr.push(io_zotero_obj);

					io_zotero_arr_obj[data[i].key] = new Object();
					io_zotero_arr_obj[data[i].key] = data[i];
					io_zotero_arr_obj[data[i].key].tag = tag;
					io_zotero_arr_obj[data[i].key].loaded = false;
				}
			}
			if(lib_list){
				jQuery("#zotero_details").empty();
				jQuery("#zotero_load").empty();
				jQuery("#io-lib-tools").html(library_tools);
				if(tag == ''){
			    	jQuery("#zotero_load").html(io_zotero_library());
				}else{
			    	jQuery("#zotero_load").html('<div class="col-lg-offset-3"><h2 class="margint0"><em class="fa fa-tag website-'+tag+' rounded"></em> '+tag+'</h2></div>'+io_zotero_library());
			    	io_zotero_tag_select(tag);
				}
		    	jQuery('[data-toggle="tooltip"]').tooltip();
		    }

			//io_zotero_tags_arr[tag].loaded = true;
	    	io_zotero_selection = tag;
	    	if(typeof callback == 'function'){
		    	callback();
	    	}
    	}
	});
}


function io_zotero() {
	jQuery("#zotero_load").removeClass('none').html(svgloader);
	jQuery("#zotero_load_detail").addClass('none');
	var router = io_hash();
	if(!router){ // default library
		io_zotero_tag('',null);
	}else{
		router = io_zotero_get_tag();
    	if(router){ // tag library
			io_zotero_tag(router,null);
		}else{ // library detail
	    	//
	    	if(io_zotero_selection != ''){
	    		io_zotero_item();
	    	}else{
	    		io_zotero_tag('',function(){
					io_zotero_item();
					return false;
				});
	    	}
	    }
    }
}




;(function(jQuery) {


	jQuery(window).resize(function(){

	});

	jQuery(window).load(function(){

	});

	jQuery(window).on('hashchange', function() {
		io_zotero();
	});

	jQuery(document).ready(function() {
		

	});



})(jQuery);
	