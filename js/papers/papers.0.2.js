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
*/
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
	$(".paper_book").each(function(index,val){
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
	var papers = document.getElementsByClassName('paper_book');
	var paper = $("#papers .papers .paper_book").width();
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
