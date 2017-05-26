var choice = '';
var choiceurl = '';
var chosen = '';
var io_hist = new Object();
var svgloader = '<div class="text-center" style="padding:50px 0"><?xml version="1.0" encoding="utf-8"?><svg width="120px" height="120px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring-alt"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><circle cx="50" cy="50" r="40" stroke="#333333" fill="none" stroke-width="10" stroke-linecap="round"></circle><circle cx="50" cy="50" r="40" stroke="#ff0000" fill="none" stroke-width="6" stroke-linecap="round"><animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="502"></animate><animate attributeName="stroke-dasharray" dur="2s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4"></animate></circle></svg></div>';

if(lowerie){
	document.documentElement.innerHTML = 'Update your browser please!<br><a href="http://outdatedbrowser.com" target="_blank">Check available browsers</a>';
}

function doDashes(str) {
    var re = /[^a-z0-9]+/gi; // global and case insensitive matching of non-char/non-numeric
    var re2 = /^-*|-*$/g;     // get rid of any leading/trailing dashes
    str = str.replace(re, '-');  // perform the 1st regexp
    return str.replace(re2, '').toLowerCase(); // ..aaand the second + return lowercased result
}

function io_class_toggle(cls,tgl) {
    jQuery(cls).toggleClass(tgl);
}

function io_hash() {
	var hash = document.location.hash;
    if (hash.match('#')) {
    	hash = hash.replace('#','');
    	return hash;
    }else{
    	return false;
    }
}

function io_send_mail(obj) {
    var title = jQuery(obj).data('title');
    var link = jQuery(obj).data('link');
    window.open('mailto:yourfiendsmail?subject='+title+'&body='+encodeURI('Take a look at this link\n'+title+'\n'+'http://iohk.io'+link));
}

var textzoomed = 2,
textzoom_arr = new Array();
textzoom_arr[0] = 'font-smaller',
textzoom_arr[1] = 'font-small',
textzoom_arr[2] = '',
textzoom_arr[3] = 'font-big',
textzoom_arr[4] = 'font-bigger';

function textzoom(num) {

    if(num == 0){
        jQuery(".entry").removeClass(textzoom_arr[textzoomed]);
        textzoomed = 2;
    }else{
        jQuery(".entry").removeClass(textzoom_arr[textzoomed]);
        textzoomed += num;
        if(textzoomed > 4){
            textzoomed = 4;
        }
        if(textzoomed < 0){
            textzoomed = 0;
        }
        jQuery(".entry").addClass(textzoom_arr[textzoomed]);
        
    }
    console.log(textzoomed);
}


