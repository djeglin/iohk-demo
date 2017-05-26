var moved_papers = false;


function io_papers(){
	if($("#main").hasClass("redirect")){
		window.location.href = $("#main").attr('rel');
	}
	io_papers_move_update();
}
var io_paper_move = 0;

function io_papers_moved_update(){
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
	var moved = io_papers_moved_update();
	if(!moved_papers){
		if(moved != 0){
			io_paper_move = -moved;
		}
	}
	io_papers_moved_update();
	var bw = $("body").width();
	var row = $("#papers .papers").width();
	var papers = document.getElementsByClassName('paper_book');
	var paper = $("#papers .papers .paper").width();
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

	var move = io_paper_move * (paper + 20);
	$(".papers .papers_row").css({marginLeft:move});


	//alert(papers.length);
	/*
	if(bw > 767){
		if(papers.length > 3){
			if(io_paper_move != 0){
				//if(io_paper_move < -2){
					$("#papers .papers .papers_row").css({marginLeft:(io_paper_move+3) * (paper + 20)});
				//}
			}
		}
	}else{
		$("#papers .papers .papers_row").css({marginLeft:0});

	}
	*/
}


function io_papers_move(next){
	moved_papers = true;
	var bookw = $(".papers .paper").width();
	if(next){
		io_paper_move--;
		//if(io_paper_move == 0){io_paper_move= -1;}
		var move = io_paper_move * (bookw + 20);
		//$(".papers .papers_row").css({marginLeft:move});

	}else{
		io_paper_move++;
		//if(io_paper_move == 0){io_paper_move=1;}
		var move = io_paper_move * (bookw + 20);
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
