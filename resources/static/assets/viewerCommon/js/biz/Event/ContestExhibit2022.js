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
			, event1CommentHtml: null
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// Comment 리스트 조회
			getCommentList: function(page) {

				let pageLength = 5; // 화면에 한번에 보여줄 댓글 수

				// 댓글 시작 번호. 값이 없으면 1 로 세팅(1페이지)
				page = !!page ? page : 1;

				const options = {
					url: '/Event/GetContestExhibit2022Event1ListJson.mrn',
					data: {
						eventCodeSeq: screen.v.eventCodeSeq,
						pageS: (page-1)*pageLength,
						pageLength: pageLength,
					},
					success: function(res) {

						let rows = res.rows;
						//res.totalCnt = null;

						// 기존 목록 삭제
						$('.comment-body li').remove();

						// 데이터 0일 경우
						if(res.totalCnt == null || res.totalCnt == '') {
							$('.comment-body').text('조회된 데이터가 없습니다.');
							$('.total-num span').text('0');
							$('.paging a').addClass('hidden')
							return;
						}

						$('.total-num span').text(res.totalCnt);

						// 행 생성
						$.each(rows, function(i,v) {
							let $comment = screen.v.event1CommentHtml.clone();
							$comment.find('.name').text(screen.f.markingName(v.userId));
							$comment.find('.date').text(v.createDate);
							$comment.find('p').text(v.memo);

							$('.comment-body').append($comment);
						})

						// 페이징
						res.page = page;

						// 한화면에 표시할 행 수
						cjs.val.PAGING_ROW_COUNT = pageLength;

						$cmm.setPaging($('.paging'), res, screen.c.getCommentList);

					}
				}
				$cmm.ajax(options);
			},


			// 사용자 정보 가져오기
			getUserData: function() {

				if ($text.isEmpty($('body').data('useridx'))) return;

				const options = {
					url: '/member/getEventInfoJson.mrn',
					data: {

						loginUserSeq: $('body').data('useridx'),
						eventCodeSeq: screen.v.eventCodeSeq,

					},
					success: function(res) {
						if(res.resultCode == '0000') {

							// 모달 내 데이터 세팅
							$('#userName').val(res.userName);
							$('#userHp').val(res.userMobile);

							// loginCheck 항목에서 cmmLoginConfirm 제거
							$('.loginCheck').removeClass('cmmLoginConfirm');
						}
					}
				}
				$cmm.ajax(options);
			},

			// event 1,2 apply
			eventApply: function() {

				if ($text.isEmpty($('body').data('useridx'))) return;

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

				if(exit) return; // 빈칸 있을시 종료

				// 수집동의 확인
				if ($('#agreeMaterCheck').is(':checked') ) {

					// event 1 save
					if($('#event-request').data('bPopup').loadData.type == 'event1') {

						const options = {
							url: '/Event/SaveContestExhibit2022Event1.mrn',
							data: {

								loginUserSeq: $('body').data('useridx'),
								eventCodeSeq: screen.v.eventCodeSeq,
								userName: $('#userName').val(),
								userTel: $('#userHp').val(),
								memo: $('#event1Text').val(),

							},
							success: function(res) {

								// 모달닫기
								$('#event-request .btn-block .b-close').trigger('click');

								// 텍스트 입력창 초기화
								$('#event1Text').val('');

								// 댓글 리스트 재조회
								screen.c.getCommentList();
								$msg.alert('정상적으로 응모되셨습니다.\n참여해 주셔서 감사합니다.');
								$('input[type=checkbox]').prop('checked', false);
							}
						}
						$cmm.ajax(options);

					// event 2 save
					} else if($('#event-request').data('bPopup').loadData.type == 'event2') {

                    const formData = new FormData();
                    formData.append('dirCd','ETC');
                    formData.append('tagName', 'formFileImage');
                    formData.append('formFileImage', $('input[name=formFileImage]')[0].files[0]);

					// 이미지 업로드
                    $cmm.ajaxUpload({

						url: '/imgUpload.mrn',
                        contentType : false,
                        processData : false,
                        data: formData,


                        success: function(res) {

								if(res.resultCode == '0000') {

									// 데이터 저장 ajax
									const dataSave = {
										url: '/Event/SaveContestExhibit2022Event2.mrn',
										data: {
											loginUserSeq: $('body').data('useridx'),
											eventCodeSeq: screen.v.eventCodeSeq,
											fileId: res.fileId,
											regNumber: $('#event2Text').val(),

										},
										success: function(res) {

											// 칸 초기화
											$('#event2Text').val('');
											$('input[name=formFileImage]').val('');

											// 모달닫기
											$('#event-request .btn-block .b-close').trigger('click');
											$('input[type=checkbox]').prop('checked', false);
											$('.form-file').val('');
											$('input[class=input-file]').val('');
											$msg.alert('정상적으로 응모되셨습니다.\n참여해 주셔서 감사합니다.');

										}
									}
									$cmm.ajax(dataSave);
								}
	                        }
	                    });

					}
				} else {
					$msg.alert('개인정보 수집 및 활용에 동의해주세요.');
					return;
				}
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

				const options = {
					url: '/Event/GetContestExhibit2022IsEvent2TfJson.mrn',
					data: {

						loginUserSeq: $('body').data('useridx'),
						eventCodeSeq: screen.v.eventCodeSeq,

					},
					success: function(res) {

						// applied 1 => 신청내역 존재
						if(res.resultData[0].applied == 0) {

							// 레이어 명칭 변경 2
							$('.eventModalTitle').text('미래엔 공모전 인증 이벤트');

							$('#event-request').bPopup({
								opacity: 0.5,
								follow: [true, false],
								escClose: false,
								modalClose: true,
								loadData: { 'type' : 'event2' }
							});
							screen.c.getUserData();
						} else {
							$msg.alert('이미 이벤트에 참여하셨습니다.');
							return;
						}
					}

				}
				$cmm.ajax(options);
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
					if(!$('#agree2').prop('checked')) $msg.alert($('#agree2').siblings('label').text() + '항목을 체크해 주세요.');
					if(!$('#agree3').prop('checked')) $msg.alert($('#agree3').siblings('label').text() + '항목을 체크해 주세요.');
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


			// eventModal up
			eventModal: function(e) {

				// 로그인 체크
				if($(e.target).hasClass('cmmLoginConfirm')) return;
				if($(e.target).hasClass('cmmTeacherConfirm')) return;

				if($text.isEmpty($('#event1Text').val())) {
					$msg.alert('내용을 입력해 주세요.');
					return;
				}

				// 레이어 명칭 변경 event1
				$('.eventModalTitle').text('미래엔 공모전 소문내기 이벤트');

				// 모달을 띄운다.
				$('#event-request').bPopup(
					{
						loadData: { 'type' : $(e.target).data('event') }
					}
				);
			},

			// event2Modal up
			event2Apply: function() {
				// 로그인 체크
				if($('#btn-register').hasClass('cmmLoginConfirm')) return;
				if($('#btn-register').hasClass('cmmTeacherConfirm')) return;

				// 두가지 모두 미입력시
				if(
					(
						$('input[name=formFileImage]').val() == null ||
					 	$('input[name=formFileImage]').val() == ''
				 	)
				 	&&
					 	$text.isEmpty($('#event2Text').val())
				 ) {

					$msg.alert('공모전 인증 이벤트 참여를 위해\n인증샷과 접수번호 중 하나는 반드시 입력해 주세요.');
					return;
				}

				// 기지원 체크
				screen.f.isApplied();
			},


			// 이름 마스킹
			markingName: function(nm) {

				if (nm.length > 6) {

					return nm.substring(0, 3) + '***' + nm.substring(6);
				} else if (nm.length < 4) {

					return nm.substring(0, 1) + '**';
				} else {

					return nm.substring(0, 3) + '***';
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

			// event1 모달
			$('.btn-event-popup').on('click', function(e) {screen.f.eventModal(e)});

			// event2 기지원여부 체크 + 모달 업
			$('#btn-register').on('click', screen.f.event2Apply);

			// event 저장
			$('#eventApplyButton').on('click', screen.c.eventApply);

			// 동의 모달 팝업
			$('.open-personal-agree').on('click', screen.f.openModalPersonalAgree);

			// 팝업 전체 동의 버튼 누를 시 처리
			$('#agree1').on('change', screen.f.agreeAll);

			// 팝업 전체 동의 확인 버튼 누를 시
			$('#pInfoAgree').on('click', screen.f.agreeModal);

			// 개인정보 수정 버튼
			$('#modifyLink').on('click', function() {$('#event-request .btn-block .b-close').trigger('click');});
			$('#modifyLink2').on('click', function() {$('#event-request .btn-block .b-close').trigger('click');});

			//tab
			var $tabsNav = $('.tabs'),
				$tabsNavLis = $tabsNav.children('li'),
				$tabContent = $('.tab-cont');

			$tabsNav.each(function() {
		        var $this = $(this);
		        $this.next().children('.tab-cont').stop(true,true).hide().first().show();
		        $this.children('li').first().addClass('on').stop(true,true).show();
		    });
			$tabsNavLis.on('click', function(e) {
				var $this = $(this);
				$this.siblings().removeClass('on').end().addClass('on');
				$this.parent().next().children('.tab-cont').stop(true, true).hide().siblings($this.find('a').attr('href')).fadeIn();
				e.preventDefault();
			});

			//floating menu
		    $(window).scroll(function() {
		        if ($(this).scrollTop() > 200) {
		        $('.floating-menu').fadeIn();
		            } else {
		        $('.floating-menu').fadeOut();
		            }
		    });

		    $(document).on('click', '.file-attach .btn-file', function() {

				// 로그인 체크
				if($(this).hasClass('cmmLoginConfirm')) return;

		      	$(this).closest('.file-attach').find('.form-file').click();
		    });

		    // 파일 변경 체크
		    $(document).on('change', '.form-file', function() {

				let maxSize = 20 * 1024 * 1024;
				// let fileForm = /(.*?)\.(jpg|jpeg|png)$/;
				let fileForm = /(.*?)\.(jpg|jpeg|png|gif)$/;

				let file = $(this)[0].files[0];

				if(file.size > maxSize) {

					$msg.alert('20MB 이하 파일만 등록 가능합니다.');
					$('.form-file').val('');
					return;

				}

				if(file.type.indexOf('image') == -1) {
					$msg.alert('jpg, jpeg, png 파일만 등록 가능합니다.');
					$('.form-file').val('');
					return;
				}

				$('input[class=input-file]').val($(this)[0].files[0].name);
			});

		    $('.section-nav .navGo').on('click', function (e) {
			    e.preventDefault();
			    $('html, body').animate({
			        //scrollTop: $($(this).attr('href')).offset().top  }, 300, 'linear');
			        scrollTop: $($(this).data('nav')).offset().top  }, 300, 'linear');
			});


			// 링크복사
			new ClipboardJS('.btn-url-copy', {
				text: function(trigger) {
					return $(trigger).siblings('input').val();
				}
			}).on('success', function() {

				$msg.alert('URL이 복사되었습니다.');

				// 모달닫기
				//$('.common-pop-share .pop-close').trigger('click');

			});

			// event 종료 팝업
			$('.event-end').on('click', () => {

				$msg.alert('이벤트가 종료되었습니다.');

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

			screen.v.beforeWidth = $(window).width();

			// 시간 체크해서 신청 제외
			screen.f.timeChecker();

			screen.v.event1CommentHtml = $('.page-contest .event1 .part-wrap .comment li');
										 $('.page-contest .event1 .part-wrap .comment li').remove();

			screen.c.getUserData();
			screen.c.getCommentList();

		}
	};

	screen.init();
	window.screen = screen;
});