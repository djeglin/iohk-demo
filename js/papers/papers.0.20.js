var moved_papers = false;


function io_papers(){
	if($("#main").hasClass("redirect")){
		var url = $("#main").attr('rel');
		if(!lowie){
			History.pushState(io_hist, "IOHK",url);
			io_load_page(url,'#paper','#paper_load',null);
		}else{
			document.location.href = url;
		}
	}
	io_papers_update();
	$("#paper_authors").html(io_papers_authors());
	io_pop();
}

function io_papers_update(){
	/*
	$('html, body').animate({
			scrollTop: $("#papers").offset().top
	}, 1000);
	if($("#paper_timeline").hasClass('ready')){
		var dates = [];
		$("#subpaper .paper_book").each(function(i,v){
			var date = $(this).data('date').split('-');
			dates.push(date);
		});

		var timeline = '';
		var thedate = new Date(dates[0][0],dates[0][1]-1,dates[0][2]);
		thedate.setDate(thedate.getDate()-40);
		for(var i=0;i<200;i++){
			var theday = new Date(thedate);
			theday.setDate(theday.getDate()+i);
			var pref = '';
			var active = '';
			if (theday.getDate() == 1) {
				pref += '<div class="month month-'+theday.getMonth()+'">'+dayname[theday.getMonth()]+'</div>';
			}
			for(var j=0;j<dates.length;j++){
				if(dates[j][0]+'-'+(dates[j][1]-1)+'-'+dates[j][2] == theday.getFullYear()+'-'+theday.getMonth()+'-'+theday.getDate()){
					active = 'active';
				}
			}

			timeline += '<div class="'+active+' day day-'+theday.getDay()+' date-'+theday.getDate()+'" data-date="'+theday.getDate()+'">'+pref+' <span>'+theday.getDate()+'</span></div>';
		}
		$("#paper_timeline").html('<div class="timeline">'+timeline+'</div>');
		*/

	}



	setTimeout(function(){
	io_fluid_videos();
	if($("#library_search-widget").hasClass('library_searcher')){
		io_zotero_search_arr_obj = {};
		io_zotero_search_init = false;
		io_zotero_search('.library_searcher',true);
	}
	},500);
	io_papers_move_update();
}



var io_paper_move = 0;

function io_papers_active(){
	var out = 0;
	$("#papers_row .main_paper_book").each(function(index,val){
		if($(this).hasClass('active')){
			//io_paper_move = -index;
			out = index;
		}
	});
	return out;
}

function io_papers_move_update(){
	var bw = $("body").width();
	var row = $("#papers .papers").width();
	var papers = document.getElementsByClassName('main_paper_book');
	var paper = $("#papers .papers .main_paper_book").width();
	var active = io_papers_active();
	//alert(paper+' '+papers.length);
	$("#papers_row").css({width:(paper+20)*(papers.length)+15});

	if(!moved_papers){
		if(active != 0){
			if(bw > 767){
				if(bw > 991){
					if(papers.length > 4){
						if(active > 3){
							io_paper_move = -active + 3;
						}
					}
				}else{
					if(papers.length > 3){
						if(active > 2){
							io_paper_move = -active + 2;
						}
					}
				}


			}

		}
	}

	if(io_paper_move == 0){
		$(".paper_nav .prev").attr('disabled','disabled');
	}else{
		$(".paper_nav .prev").removeAttr('disabled');
	}
	console.log(io_paper_move+' - '+row+' - '+paper+'*'+papers.length+'*'+io_paper_move+ ' # '+((paper+20)*(papers.length+io_paper_move)));
	if(row >= ((paper+20)*(papers.length+io_paper_move))){
		$(".paper_nav .next").attr('disabled','disabled');
	}else{
		$(".paper_nav .next").removeAttr('disabled');
	}

	if(moved_papers){
		$(".papers .papers_row").css({marginLeft:io_paper_move * (paper + 20)});
	}else{
		if(bw > 767){
						$(".papers .papers_row").css({marginLeft:io_paper_move * (paper + 20)});
		}else{
			$("#papers .papers .papers_row").css({marginLeft:0});
			$("#papers .papers").scrollLeft(active * (paper + 20) - ((bw-(paper+20))/2)-20);

		}
	}
}

function io_papers_authors(){
	var out = '';
	var auth_arr = $("#paper_authors").text().split(", ");
	for(var i=0;i<auth_arr.length;i++){
		if(i != 0){out += ', ';}
		out += io_get_member_link(auth_arr[i]);


		var member = io_get_member(auth_arr[i]);
		if(member){

			if($("#iohk_authors").hasClass('ready')){
				if(!$("#iohk_authors").hasClass(io_team_arr[member]['key'])){
					$("#iohk_authors").addClass(io_team_arr[member]['key']);
					$("#iohk_authors").append('<a href="/team/'+io_team_arr[member]['key']+'/" rel="'+member+'" class="ajaxhref profile-link" title="IOHK profile of '+io_team_arr[member]['tit']+'"><img src="/'+io_team_arr[member]['pic']+'" alt="'+io_team_arr[member]['tit']+'" class="img-circle" width="60" height="60" /> <h3>'+io_team_arr[member]['tit']+'</h3> <p class="uppercase">'+io_team_arr[member]['role']+'<br /><span class="loc">'+io_team_arr[member]['loc']+'</span></p></a>');

				}
			}




		}



	}
	return out;
}


function io_papers_move(next){
	moved_papers = true;
	var bookw = $(".papers .paper").width();
	if(next){
		io_paper_move--;
		//if(io_paper_move == 0){io_paper_move= -1;}
		//var move = io_paper_move * (bookw + 20);
		//$(".papers .papers_row").css({marginLeft:move});

	}else{
		io_paper_move++;
		//if(io_paper_move == 0){io_paper_move=1;}
		//var move = io_paper_move * (bookw + 20);
		//$(".papers .papers_row").css({marginLeft:move});
	}
	io_papers_move_update();
}



/*

	$(window).resize(function(){

	});

	$(window).load(function(){
		io_papers();
	});

	$(window).on('hashchange', function() {
		//io_zotero();
	});

	$(document).ready(function() {

	});

*/
