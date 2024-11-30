let screen;

$(function() {

	screen = {

		/**
		 * 내부  전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			item: null
			, rows: null
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 정보 가져오기
			getList: function() {

				return;

				const options = {
					url: '/ExtraLab/GetWebZineJson.mrn',
					data: null,
					success: function(res) {

						screen.v.rows = res.resultData;

						// 상단 셋팅
						screen.f.setHeader();

						// 목록 셋팅
						screen.f.setList();
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
			screen.c.getList();

		}
	};

	screen.init();
	window.screen = screen;
});
