/*---------- 미러링 - 받는 쪽 ----------*/
window.addEventListener('message',recv_mirroring)

function recv_mirroring(e) {
	var json = JSON.parse(e.data);

	//현재 데이터와 sync 받은 데이터 동기화
	data = json;
	if(data.token!==mirroringId){
		// click
		if(data.click){
			if(data.click==='player-bar'){
				$('#player-obj')[0].play();
			} else {
				$('#'+json.click).click();
			}
			data.click = '';
		}
		// scroll
		if(json.scroll){
			json.scroll.forEach(function(e,i){
				$('.content').eq(i).mCustomScrollbar('scrollTo',json.scroll[i]);
			});
		}
		if(json.scrollV){
			json.scrollV.forEach(function(e,i){
				$('.vertical-section').eq(i).mCustomScrollbar("scrollTo",json.scrollV[i]);
			});
		}
		// html
		if(data.html){
			htmlObj.html(data.html)
		}
		// video
		if(json.video){
			json.video.forEach(function(e,i){
				var v = $('video')[i];
				v.currentTime=e;
				//v.play();
			});
		}
	}
}

    window.addEventListener('message', recv_mirroring_wrapper);

    function recv_mirroring_wrapper(e) {
        try {
            recv_mirroring(e);
        } catch (error) {
            console.error("데이터가 올바로지 않거나 없습니다. : ", error);
        }
    };