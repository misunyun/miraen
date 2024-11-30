/*commonShare js*/
let screenShare;
$(function() {

	screenShare = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screenShare
		 */
		v: {
			screenWidth: 0
			, screenHeight: 0
			, screenShareBaseUrl: null
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screenShare
		 */
		c: {


		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screenShare
		 */
		f: {


			// 공유 모달 show
			shareModal: function(e) {

				//screenShare.v.test = e.target;
				let se = $(e.target).closest('li').find('.btn-blank a');
				screenShare.v.screenShareBaseUrl = se.attr('href');

				$('#shareUrl').val(screenShare.v.screenShareBaseUrl);
				$("#og_description").prop("content", se.data('title'));
				$("#og_image").prop("content",se.data('imgurl'));

				$('.common-pop-share').show();

			},

			// sns 공유하기
			snsShare: function(e) {

				// data-url 로 링크
				let urlStr = screenShare.v.screenShareBaseUrl;
				let type = $(e.target).data('type');

				var titleStr = encodeURIComponent($("#og_description").prop("content"));
				var titleStrOrg = $("#og_description").prop("content");
				var image = $("#og_image").prop("content");

				__w(urlStr);
				__w(image);

				if (type=='FACEBOOK') {
					window.open("https://www.facebook.com/sharer/sharer.php?u="+urlStr);
				} else if (type =='TWITTER') {
					window.open("https://twitter.com/intent/tweet?text="+urlStr);
				} else if (type=='KAKAO') {
					screenShare.f.kakaoSend($('#shareUrl').val(), titleStrOrg, image);
				} else if (type=='BLOG') {
					window.open("http://blog.naver.com/openapi/share?url=" + urlStr +"&title=" + titleStr);
				} else if (type=='BAND') {
					var openLink = "https://band.us/plugin/share?body=" + titleStr + encodeURIComponent("\n") + urlStr + "&route=" + urlStr;
					window.open(openLink);
				}

			},

			kakaoSend: function(_url, _title, imageUrl) {

				var tmpStr = $("#shareMessage").html();

				if (imageUrl == undefined || imageUrl == null || imageUrl == '') {
					Kakao.Link.sendDefault({
						objectType: 'text',
						text: _title.replaceAll("&apos;", "'"),
						link: {
							mobileWebUrl: _url,
							webUrl: _url
						}
					});
				} else {
					Kakao.Link.sendDefault({
						objectType: 'feed',
						content: {
							title: _title.replaceAll("&apos;", "'"),
							description: _title.replaceAll("&apos;", "'"),
							imageUrl: imageUrl,
							link: {
								mobileWebUrl: _url,
								webUrl: _url
							},
							imageWidth: 800,
							imageHeight: 400
						},
						buttons: [{
							title: "보러 가기",
							link: {
								mobileWebUrl: _url,
								webUrl: _url
							}
						}]
					});
				}
			}

		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screenShare
		 */
		event: function() {

			// 공유하기 클릭
			$('.btn-snsshare').on('click', function(e) {screenShare.f.shareModal(e)});

			// 공유 sns 클릭
			$('.common-pop-share .list-sns .share').on('click', function(e) {screenShare.f.snsShare(e)});
		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screenShare
		 */
		init: function() {

			// Event 정의 실행
			screenShare.event();

			// 크기 넣기
			screenShare.v.screenWidth = window.screen.width;
			screenShare.v.screenHeight = window.screen.height;

		}
	};

	screenShare.init();
	window.screenShare = screenShare;

});