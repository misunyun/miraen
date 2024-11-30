let screen;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			item : null
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 정보 가져오기
			getList: function() {

				const options = {
					url: 'url',
					data: null,
					success: function(res) {
						if (!!res.resultData) {
							screen.v.item = res.resultData;
						}
					}
				};

				$cmm.ajax(options);

			},

		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {


		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {


		    // level2 클릭
            $(document).on('click', '.aside .block-level2 .item a', screen.f.clickLevel2);

			// 링크복사
            new ClipboardJS('.btnCopyLink', {

                text: function() {
                    return $('#'+screen.v.tab).find('.video-wrap .video video').not('d-none').attr('src');
                }
            }).on('success', function () {
                $msg.alert(lng.msg.copyLink);
            });

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			// Event 정의 실행
			screen.event();

			// 목록 가져오기
			// screen.c.getList();
		}
	};

	screen.init();
	window.screen = screen;
});
