// id 부여
/*
$('.choice').each(function(i){
    $(this).find('input').attr('name','radio-'+i).each(function(i2){
        $(this).attr('id','radio-'+i+'-'+i2);
    });
});
*/
$('a,button,[role=button],input,.video-js').each(function(i){
	var t = $(this);
	if(!t.attr('id')){
		t.attr('id','mteacher-'+i);
	}
});

/*---------- 보내는 쪽 ----------*/
var mirroringId = Math.floor(Math.random()*1000000);

// 이벤트 발생
$('a,button,input,[role=button],.vjs-control-text').click(function(){
	if(!data.token || data.token===mirroringId){
		data.token = mirroringId;
		data.click = $(this).attr('id');
		dataWrite();
	} else {
		data.token = '';
	}
});

// refreshPage
if($('.drag-obj').length){
	
}
var htmlObj = $('h2').next();
function refreshPage(){
	if(!data.token || data.token===mirroringId){
		data.token = mirroringId;
		data.html = htmlObj.html();
		dataWrite();
	}
}

// 마우스
// $('#wrap').mousemove(function(e){
// 	var t = $(this),
// 		x = e.clientX-t.offset().left,
// 		y = e.clientY;
// 	data.x=x;
// 	data.y=y;
// 	dataWrite();
// });


var dataUri,dataJson;
function dataWrite(mirroringToken){
	dataJson = JSON.stringify(data,null,"\t"),
	//부모창에 데이터 전달
	window.postMessage(dataJson, "*");
}


/*
// 배열 중복 제거
function arrDuplicate(arr){
	var uniq = arr.reduce(function(a,b){
		if (a.indexOf(b) < 0 ) a.push(b);
		return a;
	},[]);
	return uniq;
}
*/