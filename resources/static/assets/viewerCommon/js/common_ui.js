/*UI js*/
let screenUI;
$(function() {

	screenUI = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screenUI
		 */
		v: {
			screenWidth: 0
			, screenHeight: 0
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screenUI
		 */
		c: {

			/**
				사용자 여부		: 회원만 : 1, 전체 : 1아니면
				logDiv			: "TEXTBOOK", EXTRA"		=> common_gnb_mteacher의 TYPE
				targetModule	: "PERIOD", "WEBZINE"		=> common_gnb_mteacher의 KEY1
				targetKey1		: 자료나 정보의 일련번호
				targetKey2		: 자료나 정보의 일련번호
				targetAction	: PREVIEW, DOWNLOAD, CLICK, SUBSCRIBE
			 */
			pageLink: function(userTf, logDiv, targetModule, targetKey1, targetKey2, targetAction, targetContent1, targetContent2) {

				if (userTf) {
					// __w('회원이 아니면 예외');
					return;
				}

				targetKey2 = $text.isEmpty(targetKey2) ? '' : targetKey2;
				targetContent1 = $text.isEmpty(targetContent1) ? '' : targetContent1;
				targetContent2 = $text.isEmpty(targetContent2) ? '' : targetContent2;

				let today = new Date();
				let today_day = ('0' + today.getDate()).slice(-2)		 // 현재 일자

				var params = {
					logDiv: logDiv
					, targetModule: targetModule
					, targetKey1: targetKey1
					, targetKey2: targetKey2
					, targetContent1 : targetContent1
					, targetContent2 : targetContent2
					, targetAction: targetAction
					, time_day: today_day		 // 현재 일
				};
				/*

				// 1. history 가져옴
				let loadHistoryList = window.localStorage.getItem('history');
				let parseHistoryList = [];
				if(!$text.isEmpty(loadHistoryList) && loadHistoryList.length != 0) {

					parseHistoryList = JSON.parse(loadHistoryList);

					if(typeof(parseHistoryList) != 'object') parseHistoryList = [];

					// 2. 객체 foreach 로 훑으면서 날짜 다르면 out
					let temp = parseHistoryList.slice();
					$.each(temp, function(i,v){
						if(v.time_day != today_day) {
							parseHistoryList.splice(i,1);
						}
					})

					// 3. 객체 훑으면서 값이 완전 같을 경우 return
					let fg = false;
					$.each(temp, function(i,v){
						$.each(params, function(j,k){
							if(temp[i][j] == null) temp[i][j] = '';
							else temp[i][j] = temp[i][j].toString();
							if(params[j] == null) params[j] = '';
							else params[j] = params[j].toString();
						})

						if(JSON.stringify(temp[i])===JSON.stringify(params)) {
							fg = true;
						}
					})
					if(fg) return ;
					parseHistoryList = temp;
				}

				$.each(params, function(j,k){
					if(params[j] == null) params[j] = '';
					else params[j] = params[j].toString();
				})

				// 4. 없으면 push, 하고 history in
				parseHistoryList.push(params);
				window.localStorage.setItem('history', JSON.stringify( parseHistoryList ));
				*/

				history_save(params, '', '');

			},

		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screenUI
		 */
		f: {

			// 통계 업데이트
			clickHistory: function() {
				let item = $(this).data();
				screenUI.c.pageLink(item.usertf, item.logdiv, item.targetmodule, item.targetkey1, item.targetkey2, item.targetaction, item.targetcontent1, item.targetcontent2);
			},
			// 통계 업데이트 el
			clickHistoryEl: function(el) {
				let item = $(el).data();
				screenUI.c.pageLink(item.usertf, item.logdiv, item.targetmodule, item.targetkey1, item.targetkey2, item.targetaction, item.targetcontent1, item.targetcontent2);
			},

			// 통계 업데이트를 위해 객체에 data 추가 처리
			setHistoryData: function(el, userTf, logdiv, targetmodule, targetaction, targetkey1, targetkey2, targetcontent1, targetcontent2) {

				$(el).data('usertf',userTf);
				$(el).data('logdiv',logdiv);
				$(el).data('targetmodule',targetmodule);
				$(el).data('targetaction',targetaction);
				$(el).data('targetkey1',targetkey1);
				$(el).data('targetkey2',targetkey2);
				$(el).data('targetcontent1',targetcontent1);
				$(el).data('targetcontent2',targetcontent2);

				$(el).addClass('cmmClickHistory');

			},

			// 공통 로그인 컴폼
			loginConfirm: function(callback) {
				$msg.confirm('로그인이 필요합니다.<br>로그인 페이지로 이동하겠습니까?', function() {
					let url = encodeURIComponent(window.location.href);
					document.location.replace('/User/Login.mrn?redirect=' + url);
					localStorage.setItem("mteacherhistorybacklogincheck", window.location.href);
				}, callback, '', '', '로그인', '');
			},


			// 공통 얼랏
			loginTeacherOnlyAlert: function(callback) {
				$msg.alert('교사인증을 하시면 이용이 가능합니다.', callback);
				return;
			},

			// 공통 로그인 페이지 이동
			loginGo: function() {
				let url = encodeURIComponent(window.location.href);
				$(location).attr('href', '/User/Login.mrn?redirect=' + url);
			},

			// 공통 얼랏
			msgAlert: function() {
				let d = $(this).data();
				$msg.alert(d.content);
			},

			// 공통 IE 경고 얼랏
			msgIEWarningAlert: function() {
				let url = $(this).data('url');
				let msg = $(this).data('msg');

				// IE!!
				if (window.navigator.userAgent.match(/MSIE|Internet Explorer|Trident/i)) {

					$msg.alert(msg);
					return;
				}

				screenUI.f.WinOpenBlank(url)
			},

			// 공통 IE 경고 얼랏 후 이동
			msgIEWarningAlertGo: function() {
				let url = $(this).data('url');
				let msg = $(this).data('msg');

				// IE!!
				if (window.navigator.userAgent.match(/MSIE|Internet Explorer|Trident/i)) {
					// $msg.alert(msg);
					alert(msg);
					screenUI.f.WinOpenBlank(url)
					return;
				} else {
					screenUI.f.WinOpenBlank(url)
				}
			},

			// 공통 IE 경고 컴폼
			msgIEWarningConfirm: function() {
				let url = $(this).data('url');
				let msg = $(this).data('msg');
				// IE!!
				if (window.navigator.userAgent.match(/MSIE|Internet Explorer|Trident/i)) {

					$msg.confirm(msg, function() {
						screenUI.f.WinOpenBlank(url);
					}, null, '', '', '이동', '');
				} else {
					screenUI.f.WinOpenBlank(url);
				}
			},

			// BPopup 팝업
			openBPopup: function(event) {
				event.stopPropagation();
				event.preventDefault();
				var popup = $(this).attr('href');

				$(popup).bPopup({
					opacity: 0.5,
					follow: [true, false],
					escClose: false,
					modalClose: true,
				});
			},

			// link Download
			openBPopup: function(event) {
				event.stopPropagation();
				event.preventDefault();
				var popup = $(this).attr('href');

				$(popup).bPopup({
					opacity: 0.5,
					follow: [true, false],
					escClose: false,
					modalClose: true,
				});
			},

			// file download url
			download: function(url) {
				$.fileDownload(url);
			},

			// file download


			/**
				file download
				data('fileid', item.fileId);
			 */
			downloadFileId: function() {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

				const fileId = $(this).data('file-id');
				const ecmTabCSeq = $text.isEmpty($(this).data('ecm-tab-c-seq')) ? '':$(this).data('ecm-tab-c-seq');

				if ($text.isEmpty(fileId)) {
					alert('다운로드 파일이 없습니다.');
					return ;
				}

		 		downloadMessage();

//		 		const hostname = window.location.hostname;
				var paramBuf = "<input type='hidden' name='fileId' value='"+fileId+"' >";
				$("#idDownload").html(paramBuf);

				if (ecmTabCSeq == '1096'){  // 운영 : 1096, 개발 : 992
					document.downloadForm.action = "/TempFileDown.mrn?fileId="+fileId;
				}else {
					document.downloadForm.action = "/File/FileDown.mrn";
				}
				document.downloadForm.submit();
			},

			/**
			 */
			popPreview: function() {

				const type = $(this).data('type');
				const fileId = $(this).data('file-id');
				const userIdx = $('body').data('userIdx');
				const extraSeq = $(this).data('extra-seq');
				const ecmTabCSeq = $text.isEmpty($(this).data('ecm-tab-c-seq')) ? '':$(this).data('ecm-tab-c-seq');

				if ($text.isEmpty(fileId)) {
					alert('다운로드 파일이 없습니다.');
					return;
				}

				console.log(ecmTabCSeq);
				if (ecmTabCSeq == '1096'){  // 운영 : 1096, 개발 : 992
					//모바일까지 처리
					if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/Android/i)) {
						location.href = "/Ebook/preview.mrn?source="+type+"&file=" + fileId +"&user=2600434";
					}else {
						var popup = window.open("/Ebook/preview.mrn?source="+type+"&file=" + fileId+"&user=2600434", 'preview', 'height=1024,width=768');
					}

				} else {
					// 팝업 열기
					if(isMobile()) {
						location.href = "/Ebook/preview.mrn?source="+type+"&file=" + fileId;
					}else {
						var popup = window.open("/Ebook/preview.mrn?source="+type+"&file=" + fileId, 'preview', 'height=1024,width=768');
					}
				}

				// 팝업 열기
//				if(isMobile()) {
//					location.href = "/Ebook/preview.mrn?source="+type+"&file=" + fileId;
//				}else {
//					var popup = window.open("/Ebook/preview.mrn?source="+type+"&file=" + fileId, 'preview', 'height=1024,width=768');
//				}
				/******************************************************************************/
				page_play("EXTRA", "cmm_bbs", extraSeq, userIdx, "PLAY");//로그
				/******************************************************************************/

				return;

			},

			// file download
			pdfWindowOpen: function(url) {
				window.open(url);
				return false;
			},

			// 윈도우 오픈
			WinOpenBlank: function(url) {
				window.open(url);
				return false;
			},

			// 윈도우 오픈
			winOpen: function(url, w, h, param, nm) {
				var curX = window.screenLeft;
				var curY = window.screenTop;
				var curWidth = document.body.clientWidth;
				var curHeight = document.body.clientHeight;
				var xPos = curX + (curWidth / 2) - (w / 2);
				var yPos = curY + (curHeight / 2) - (h / 2);
				url = ($text.isEmpty(param)) ? url : url + '?' + param;
				nm = ($text.isEmpty(nm)) ? $text.getUUID() : nm;
				let win = top.window.open(url, nm, 'width=' + w + ', height=' + h + ', left=' + xPos + ', top=' + yPos + ', menubar=no, status=no, titlebar=no, resizable=no');
			},

			/**
				북마크 처리

				el : id, class 또는 null(버튼 객체 호출됨)
				extraSeq : extraSeq 값


				호출
				screenUI.f.saveBookmark(null, 100)

				html
				<button type="button" class="bookmark cmmBookmark" data-extra_seq="100">북마크</button>
			 */
			saveBookmark: function(el, extraSeq) {

				if ($text.isEmpty(el)) {
					el = $(el);
				} else {
					el = $(this);
				}

				// data 에 값이 있는 경우
				if ($text.isEmpty(extraSeq)) {
					extraSeq = $(this).data('extra_seq');
				}

				// 회원 체크
				let isUser = false;
				let isTeacher = false;

				if (!$text.isEmpty($('body').data('scGrade'))) {

					isUser = true;

					if ($('body').data('scGrade') == '002') {
						isTeacher = true;
					}
				}

				// 회원 아닐시
				if (!isUser) {
					screenUI.f.loginConfirm();
					return;
				}

				// 정회원 아닐시
				if (!isTeacher) {
					screenUI.f.loginTeacherOnlyAlert();
					return;
				}

				$.ajax({
					url : "/ExtraBreak/ExtraBreakBookmarkJson.mrn",
					type : "post",
					cache : false,
					data : { extraSeq : extraSeq },
					dataType : "json",
					success:function(jsonObj){

						if (jsonObj.dispMessage) {
							alert(jsonObj.dispMessage);
							return;
						}

						if (jsonObj.result == 'OK') {

							if (jsonObj.isOn != null && jsonObj.isOn == 'create') {
								el.addClass("on");
							} else {
								el.removeClass("on");
							}

							/******************************************************************************/
							var targetKey2 = (jsonObj.isOn == 'create' )  ? "Y" : "N" ;
							page_subscribe("EXTRA","cmmBoard",extraSeq,targetKey2,"BOOKMARK");//로그
							/******************************************************************************/

						}
					},
					error:function(json){
							alert("실패하였습니다.");
					}
				});
				return;

			},

			/**
				공유 열기
			 */
			openShare: function() {

				// 회원 체크
				let isUser = false;
				let isTeacher = false;

				if (!$text.isEmpty($('body').data('scGrade'))) {

					isUser = true;

					if ($('body').data('scGrade') == '002') {
						isTeacher = true;
					}
				}

				// 회원 아닐시
				if (!isUser) {
					screenUI.f.loginConfirm();
					return;
				}

				// 정회원 아닐시
				if (!isTeacher) {
					screenUI.f.loginTeacherOnlyAlert();
					return;
				}

			    $(".pop-share").show();


			},


			Player: function() {

			}

		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screenUI
		 */
		event: function() {

			// 페이지 로그인 이동
			$(document).on('click', '.cmmLoginGo', screenUI.f.loginGo);

			// 로그인 컴폼
			$(document).on('click', '.cmmLoginConfirm', function() {
				screenUI.f.loginConfirm();
			});

			// 얼랏 교사인증을 하시면 이용이 가능합니다.
			$(document).on('click', '.cmmTeacherConfirm', function() {
				screenUI.f.loginTeacherOnlyAlert();
			});

			// 얼랏
			$(document).on('click', '.cmmMsgAlert', screenUI.f.msgAlert);

			//layer popup
			$(document).on('click', '.modal-popup', screenUI.f.openBPopup);

			//ie 경고 얼랏
			$(document).on('click', '.cmmIeWarningAlert', screenUI.f.msgIEWarningAlert);

			//ie 경고 얼랏 후 이동
			$(document).on('click', '.cmmIeWarningAlertGo', screenUI.f.msgIEWarningAlertGo);

			//ie 경고 컴폼
			$(document).on('click', '.cmmIeWarningConfirm', screenUI.f.msgIEWarningConfirm);

			// 통계 업데이트
			$(document).on('click', '.cmmClickHistory', screenUI.f.clickHistory);

			// 북마크
			$(document).on('click', '.cmmBookmark', screenUI.f.saveBookmark);

			// 공유
			$(document).on('click', '.cmmShare', screenUI.f.openShare);

			// 파일 다운로드(ID)
			$(document).on('click', '.cmmFiledownloadId', screenUI.f.downloadFileId);

			// 파일 미리보기
			$(document).on('click', '.cmmFilePopPreview', screenUI.f.popPreview);

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screenUI
		 */
		init: function() {

			// Event 정의 실행
			screenUI.event();

			// 크기 넣기
			screenUI.v.screenWidth = window.screen.width;
			screenUI.v.screenHeight = window.screen.height;

		}
	};

	screenUI.init();
	window.screenUI = screenUI;

});