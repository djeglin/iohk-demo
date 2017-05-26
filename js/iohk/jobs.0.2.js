
var job_type = new Object();
job_type['full_time'] = 'Full time';
job_type['contract'] = 'Contract';







function io_job_single(ide) {
//var rel = $(this).attr();
$("#io_job_form").empty();
$.ajax({
  url: 'https://jsapi.recruiterbox.com/v1/openings/'+ide+'?client_name=iohk',
  contentType: 'application/json',
  success: function(response) { //hosted_url
      //console.log(response);
      var ide = "'"+response.id+"'";
      /*
      $("#io_job_view").html('\
      	<h1 class="roboto margin0">'+response.title+'</h1>\
      	<div class="uppercase c_aaa"><em class="fa fa-globe"></em> '+response.location.city+' &nbsp; <em class="fa fa-clock-o"></em> '+job_type[response.position_type]+'</div>\
      	<br>\
      	'+response.description+'\
      	<br>\
      	<a href="javascript:io_job_form('+ide+')" class="btn btn-lg btn-primary apply_button">Apply for '+response.title+' &nbsp;<em class="fa fa-flash"></em></a>\
      	');
*/
      $("#io_job_view").html('<h1 class="roboto margin0"><a href="'+response.hosted_url+'" target="_blank">'+response.title+'</a></h1><div class="small uppercase c_999 meta">'+response.location.city+', '+job_type[response.position_type]+'</div><br>'+response.description+'<br><a href="'+response.hosted_url+'" target="_blank" class="btn btn-lg btn-primary apply_button">Apply</a>');
    }
  });


}

function io_job_form(id) {
//var rel = $(this).attr();

$.ajax({
  url: 'https://jsapi.recruiterbox.com/v1/openings/'+id+'/application_form?client_name=iohk',
  contentType: 'application/json',
  success: function(response) {
      //console.log(response);
      var out = '';
      var arr = response.objects;
      for(var i=0;i<arr.length;i++){

      	var ide = "'"+arr[i].id+"'";
      	var typ = arr[i].type;
      	if(arr[i].type == "small_text"){
      		typ = 'text';
      	}



      	var req = '';
      	if(arr[i].is_required){
      		req = 'required';
      	}
      	var item = '';
      	if(arr[i].type == "small_text" || arr[i].type == "email" || arr[i].type == "number" || arr[i].type == "url"){
	      	item = '\
	      	<div class="col-lg-12">\
		        <div class="form-group">\
		            <label class="">'+arr[i].label+'</label>\
		            <input type="'+typ+'" name="'+arr[i].key+'" value="" class="'+req+' form-control rb_field" id="rb-'+arr[i].key+'" '+req+' />\
		        </div>\
		    </div>';
		}

		if(arr[i].type == "file"){
	      	item = '\
	      	<div class="col-lg-24">\
		        <div class="form-group">\
		            <label class="">'+arr[i].label+'</label>\
		            <input type="'+typ+'" name="'+arr[i].key+'" value="" class="'+req+' form-control hauto rb_field" id="rb-'+arr[i].key+'" '+req+' />\
		        </div>\
		    </div>';
		}

		if(arr[i].type == "select_one"){
	      	item = '\
	      	<div class="col-lg-12">\
		        <div class="form-group">\
		            <label class="">'+arr[i].label+'</label><br>\
					<select name="'+arr[i].key+'" class="'+req+' form-control rb_field" id="rb-'+arr[i].key+'">\
			            <option>Yes</option>\
			            <option>No</option>\
		            </select>\
		        </div>\
		    </div>';
		}

	    if(arr[i].type == "large_text"){
      		item = '\
	      	<div class="col-lg-24">\
		        <div class="form-group">\
		            <label class="">'+arr[i].label+'</label>\
		            <textarea type="'+typ+'" id="rb-'+arr[i].key+'" name="'+arr[i].key+'" value="" placeholder="'+arr[i].label+'" class="'+req+' form-control rb_field" '+req+'></textarea>\
		        </div>\
		    </div>';
      	}
      	out += item;
      	//console.log(arr[i]);
      	$("#io_job_form").html('\
      	<form action="javascript:io_job_apply()" method="POST" enctype="multipart/form-data" class="row" rel="'+id+'">\
	        '+out+'\
	        <div class="col-lg-24">\
	            <button type="submit" class="btn btn-primary btn-success btn-lg">Send Application &nbsp;<em class="fa fa-paper-plane"></em></button>\
		    </div>\
	    </form>');
	    $(".apply_button").hide(0);
      }
    }
  });


}

//payload

function io_job_apply() {


var payload = {
  "fields": []
};

  $(".rb_field").each(function(){
    var key = $(this).attr('name');
    var val = $(this).val();
    if($(this).attr('type') == 'file'){
    //console.log($(this));
    var file = document.getElementById($(this).attr('id')).files[0];
        if (file) {
            //console.log(file);
            //console.log($(this).val());
            val = { "encoded_data" : file, "file_name" :$(this).val()};
        }
    }
    var field = { "key" : key, "value" :val};
    payload.fields.push(field);

  });
  //console.log(payload);

  $.ajax({
    url: 'https://jsapi.recruiterbox.com/v1/openings/'+$("#io_job_form form").attr('rel')+'/apply?client_name=iohk',
    data: JSON.stringify(payload),
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    success: function(response) {
      console.log("success");
    }
  });

}

/*var payload = {
  "fields": [
    { "key" : "candidate_first_name", "value" : "John"},
    { "key" : "candidate_last_name", "value" : "Doe"},
    { "key" : "candidate_email", "value" : "john.doe@gmail.com"},
    { "key" : "candidate_phone", "value" : "123"},
    { "key" : "resume", "value": {
      "encoded_data" : "aGVsbG8gd29ybGQ=",
      "file_name" : "resume.txt"
      }
    }
  ]
// };

$.ajax({
  url: 'https://jsapi.recruiterbox.com/v1/openings/a42f3/apply?client_name=iohk',
  data: JSON.stringify(payload),
  dataType: 'json',
  contentType: 'application/json',
  type: 'POST',
  success: function(response) {
    console.log("success");
  }
});
*/




function io_job_list() {



$.ajax({
  url: 'https://jsapi.recruiterbox.com/v1/openings?client_name=iohk',
  contentType: 'application/json',
  success: function(response) {
      var out = '';
      var arr = response.objects.reverse();
      for(var i=0;i<arr.length;i++){
      	var ide = "'"+arr[i].id+"'";
      	var item = '<li><a href="#'+arr[i].id+'" id="job-'+arr[i].id+'" rel="" class="job">'+arr[i].title+' <small class="block small uppercase">'+arr[i].location.city+', '+job_type[arr[i].position_type]+'</small></a></li>';
      	out += item;
      	//console.log(arr[i]);
      }

      $(".job_loader").remove();
      $("#io_job_list").html(out);
      if(!io_hash()){
        io_job_single(arr[0].id);
      }

    }
 });


}


$(window).on('hashchange', function() {
  if($("#page").hasClass('careers')){
    if(io_hash()){
      io_job_single(io_hash());
    }
  }
});
