/*header 부분 스크립트*/
	function goLogin() {
		var path = window.location.pathname;
		//location.href = "/User/Login.mrn?redirect="+escape(path);
		location.href = "/User/Login.mrn?redirect="+escape(document.URL);
	}



function goSite(obj) {
	if (obj.value == '') {
		alert('준비중입니다.');
		return ;
	} else {
		location.href = obj.value;
	}

}

function fn_goMember(url) {
	if (ckLogin() == false)
		return ;
	if (ckMember('001', '교사인증을 하시면 이용이 가능합니다.') == false)
		return ;
	location.href = url;

}

function fn_goMember002(url) {
	if (ckLogin() == false)
		return ;
	if (ckMember('002', '교사인증을 하시면 이용이 가능합니다.') == false)
		return ;
	location.href = url;

}


function goPopDirectConnect() {
	$("#popDirectConnect").show();
}

	$(document).ready(function () {
		var paramthumb = "${param.textbookSeq}";
		if(!paramthumb) paramthumb = "10";

	});

	$(document).on("click",".box-gnb > ul li > h3 a ",function () {

	});
