let screen;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			viedoType : null
			, viewerHost : $('body').data('viewerhost') + '/cms/files/view/'
			, player1 : null
			, vOptions : {
					sources : [ {
						src :  $('body').data('src'),
						type : $('body').data('type')
					} ],
					poster :   $('body').data('poster'),
					controls : true,
					preload : 'auto',
					width : 760,
					/* height : 320, */
					fluid: true,
					controlBar: {
						children: [
							'playToggle',
							'stopButton',
							'progressControl',
							'currentTimeDisplay',
							'durationDisplay',
							'fullscreenToggle',
							'remainingTimeDisplay'
						]
					},
				}
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {

			// setting
			mediaSet: function(e) {

				// let type = $('body').data('type').toLowerCase();
				// let src  = $('body').data('src');

				//현재 주소를 decoding
				// var url = unescape(location.href);
				console.log("url >> "+ location.href);
				var url = location.href;
				let type = this.getParameter('type');
				let src = this.getParameter('src');
				console.log("type >> "+ type);
				console.log("src >> "+ src);
				// type 분기
				if(type == "hls") {

					// let video = document.getElementById('video');
					let video = document.getElementById('video');
					console.log("---------2232-------------");
					// console.log(video);
					console.log(screen.v.vOptions.sources[0]);
					console.log("----------222------------");
					console.log(video);

					var uu = "https://api-cms.mirae-n.com/view_content?service=mteacher&params="+ src ;

					if(Hls.isSupported()) {
					    let hls = new Hls();
					    // Module.video_viewer.playlist(uu2, 'application/x-mpegURL')
					    console.log('application/x-mpegURL');
						screen.v.vOptions.sources[0].src = "https://api-cms.mirae-n.com/view_content?service=mteacher&params="+src;
						screen.v.vOptions.sources[0].type = 'application/x-mpegURL';
						screen.f.play();
					    // hls.loadSource(uu);
					    // hls.attachMedia(video);
					    // hls.on(Hls.Events.MANIFEST_PARSED,function() {
						// 	console.log("player okokok");
						// 	var player = videojs('video');
						// 	player.play();
							// video.play();
					    // });
					    $("#file-info .badge").text("동영상");
					}
					// else if (video.canPlayType('application/vnd.apple.mpegurl')) {
					//     // Module.video_viewer.playlist(uu, 'application/vnd.apple.mpegurl')
					//     console.log('application/vnd.apple.mpegurl');
					// 	video.src = uu;
					// 	video.addEventListener('loadedmetadata',function() {
					// 		video.play();
					//     });
					//     $("#file-info .badge").text("동영상");
					// }


					// $.post("/getHlsUrl.mrn",{contentSeq:src},function (res) {
					// 	if(res.resultCode == "0000") {
					// 		screen.v.vOptions.sources[0].src = "https://api-cms.mirae-n.com/view_content?service=mteacher&params="+src;
					// 		screen.v.vOptions.sources[0].type = 'application/x-mpegURL';
					// 		// screen.v.vOptions.poster = res.urlHost+src;
					// 		screen.f.play();
					//
					// 	}
					// },"json");

				} else if(type == "youtube") {

					screen.v.vOptions.sources[0].type	= 'video/youtube';
					screen.f.play();

				}
				// else if(type == "file") {
				//
				// 	$.post("/GetFileInfo.ax",{fileId:src},function (res) {
				// 		if(res.resultCode == "0000") {
				//
				// 			if(res.row.extension === 'MP3') {
				// 				screen.v.vOptions.sources[0].type	= 'audio/mp3';
				// 				screen.v.vOptions.sources[0].src	= '/cms/files/view/' + src;
				// 				screen.f.playMp3();
				//
				// 			} else {
				// 				screen.v.vOptions.sources[0].type	= 'video/mp4';
				// 				screen.v.vOptions.sources[0].src	= '/cms/files/view/' + src;
				// 				screen.f.play();
				// 			}
				// 		}
				// 	},"json");
				// }
				else {

					screen.v.vOptions.sources[0].type	= 'video/mp4';
					screen.v.vOptions.sources[0].src	= src;
					screen.f.play();

				}

			},

			// 재생
			play: function(e) {
				$('#video').removeClass('d-none');
				//$('#video').parents('div.video-player').removeClass('d-none');
				screen.v.player1 = videojs('#video', screen.v.vOptions,  function onPlayerReady() {});
			},

			// 음원재생
			playMp3: function(e) {
				$('#maudio01').removeClass('d-none');
				//$('#maudio01').parents('div.video-player').removeClass('d-none');
				screen.v.vOptions.width = 500;
				screen.v.vOptions.bigPlayButton = false;
				screen.v.vOptions.controlBar = {
						children: [
							'playToggle',
							'stopButton',
							'progressControl',
							'currentTimeDisplay',
							'durationDisplay',
							'remainingTimeDisplay'
						]
					};
				screen.v.player1 = videojs('#maudio01', screen.v.vOptions,  function onPlayerReady() {});
			},

			//getParameter 펑션
			getParameter (param){
				var requestParam =""

				//현재 주소를 decoding
				// var url = unescape(location.href);
				var url = location.href;
				//파라미터만 자르고, 다시 &그분자를 잘라서 배열에 넣는다.
				var paramArr = (url.substring(url.indexOf("?")+1,url.length)).split("&");
				for(var i = 0 ; i < paramArr.length ; i++){
					var temp = paramArr[i].split("=");
					//파라미터 변수명을 담음
					if(temp[0].toUpperCase() == param.toUpperCase()){
						// 변수명과 일치할 경우 데이터 삽입
						requestParam = paramArr[i].split("=")[1];
						break;
					}
				}
				return requestParam;
			}

		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			screen.event();

			screen.f.mediaSet();

			// 로그인 체크
			// if ($text.isEmpty($('body').data('userid'))
			// 	&& $('body').data('paramid') != '2600434') // 예외처리 [엠티처-운영 티켓] https://mteacher.dooray.com/project/posts/3543729016882654035
			// {
			// 	screenUI.f.loginConfirm();
			// 	return;
			// }

		}
	};

	screen.init();
});
