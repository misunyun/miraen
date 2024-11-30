let screen;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 정보 가져오기
			getAiClassInfo: function() {

				$.post("/Ebook/GetAiClassUuidInfoJson.mrn", { uuid: $('body').data('uuid') }, function(res) {

					// 자료가 있으면
					if (res.resultData.length > 0) {
						const data = res.resultData[0];
						// $('.txtTitle').html('<span style="background:' + data.bgColor + '">' + data.type1 + '</span> ' + data.ccNm);
						$('.txtTitle').html(data.ccNm);
						$('.btn-go').attr("href", 'https://aiclass.m-teacher.co.kr/worksheet.mrn?uuid=' + $('body').data('uuid'));
					}

				}, "json");
			}
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

			screen.event();

			// 정보 추출
			screen.c.getAiClassInfo();

			// 로그인 체크
			if ($text.isEmpty($('body').data('userid'))) {
				screenUI.f.loginConfirm();
				return;
			}

		}
	};

	screen.init();
});
