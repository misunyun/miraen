let screen;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			item: null
			, beforeWidth: 0
			, eventCodeSeq: '426'         // 공통코드(NEW) PK  +   tbl_event_application 들어갈 때 key
			, isMobile: $(window).width()>=750? false:true
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 사용자 정보 가져오기
			getUserData: function() {
				const options = {
					url: '/member/getEventInfoJson.mrn',
					data: {

						loginUserSeq: $('body').data('useridx'),
						eventCodeSeq: screen.v.eventCodeSeq,

					},
					success: function(res) {

						$('#userName').val(res.userName);
						$('#userHp').val(res.userMobile);
						$('#userEmail').val(res.userEmail);
						$('#userScName').val(res.userScName);
					}
				}
				$cmm.ajax(options);
			},
		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {

			// 기지원여부 확인
			isApplied: function() {


				if ($text.isEmpty($('body').data('useridx'))) return;
				//if (screen.v.timeCheck) return;

				const options = {
					url: '/Event/GetTourMapAppliedJson.mrn',
					data: {

						loginUserSeq: $('body').data('useridx'),
						eventCodeSeq: screen.v.eventCodeSeq,

					},
					success: function(res) {

						// applied 1 : 신청내역 존재
						if(res.resultData[0].applied == 0) {
							$('#event-request').bPopup({
								opacity: 0.5,
								follow: [true, false],
								escClose: false,
								modalClose: true,
							});
							screen.c.getUserData();
						} else {
							$msg.alert('이미 이벤트에 참여하셨습니다.');
						}
					}

				}
				$cmm.ajax(options);
			},

			// 신청
			apply: function() {

				// 폼 체크
				let inputs = $('#event-request .request-input ul').find('input[type=text]');
				let text = '[엠티처 사이트 > 회원정보수정]에서 ';
				let exit = false;
				$.each(inputs, function(idx, item) {

					let val = $(item).val();
					if ($text.isEmpty(val)) {
						$msg.alert(text + $(item).data('msg'));
						exit = true;
						return false;
					}
				});

				if(exit) return;

				// 수집동의 확인
				if ($('#agreeMaterCheck').is(':checked') ) {

					// 응시 저장 처리
					const options = {
						url: '/Event/SaveTourMapAppliedJson.mrn',
						data: {

							loginUserSeq: $('body').data('useridx'),
							eventCodeSeq: screen.v.eventCodeSeq,
							memo: '여행 지도 세트 이벤트',

						},
						success: function(res) {

							// 모달닫기
							$('#event-request .btn-block .b-close').trigger('click');
							$msg.alert('이벤트 신청이 완료되었습니다.');
						}
					}
					$cmm.ajax(options);
				} else {
					$msg.alert('개인정보 수집 및 활용에 동의해주세요.');
					return;
				}
			},

			// 모달 열기
			openModalPersonalAgree: function() {

				$('#agreeMaterCheck').prop("checked", false);

				// 열기
				$('#personal-agree').bPopup();
			},


			// size 변경시
			resize: function() {

				let w = $(window).width();
				screen.v.beforeWidth = w;
			},

			// 팝업 전체 동의 체크
			agreeAll: function() {

				if($('#agree1').prop('checked')) {
					$('#agree2, #agree3').prop('checked', true);
				} else {
					$('#agree2, #agree3').prop('checked', false);
				}
			},

			// 팝업 전체 동의 확인
			agreeModal: function() {

				if($('#agree2').prop('checked') && $('#agree3').prop('checked') ) {
					$('.check-wrap input[type=checkbox]').prop('checked', true);

					// 창 닫기
					$('#personal-agree .b-close').trigger('click');

				} else {
					$('.check-wrap input[type=checkbox]').prop('checked', false);
					$msg.alert('개인정보 수집 및 활용 동의 항목에 체크해주세요.');
				}
			},

			// 시간 체크해서 신청 제외
			timeChecker: function() {
				let serverTime = $('body').data('serverdate');
				if(serverTime >= "2022/07/15 00:00:00") {
					screen.v.timeCheck = true;
					$('.tourMapApply').attr('style', "display:none;");
					$('#tourMapApplyButtonTimeOver').attr('style', "display:block;");
					return;
				}
			},

		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// resize 호출
			$(window).resize(screen.f.resize);

			// 모달 오픈
			$('#tourMapApply').on('click', screen.f.isApplied);

			// 신청하기(저장)
			$('#applyButton').on('click', screen.f.apply);

			// 동의 모달 팝업
			$('.open-personal-agree').on('click', screen.f.openModalPersonalAgree);

			// 팝업 전체 동의 버튼 누를 시 처리
			$('#agree1').on('change', screen.f.agreeAll);

			// 팝업 전체 동의 확인 버튼 누를 시
			$('#pInfoAgree').on('click', screen.f.agreeModal);

			// 개인정보 수정 버튼
			$('#modifyLink').on('click', function() {$('#event-request .btn-block .b-close').trigger('click');});
			$('#modifyLink2').on('click', function() {$('#event-request .btn-block .b-close').trigger('click');});
		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			// Event 정의 실행
			screen.event();

			screen.v.beforeWidth = $(window).width();

			// 시간 체크해서 신청 제외
			screen.f.timeChecker();

		}
	};

	screen.init();
	window.screen = screen;
});