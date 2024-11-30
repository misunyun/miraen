let screen;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			data: null
			, beforeWidth: null
			, eventCodeSeq: '418'         // 공통코드(NEW) PK  +   tbl_event_application 들어갈 때 key
			, isMobile: $(window).width()>=750? false:true
			, imgItem: null
			, timeCheck: false
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 정보 가져오기
			getList: function() {

				$.getJSON('/assets/js/biz/ExtraBlended/CulturalHeritageTreasureHunt.json?d=1', function(data) {
					screen.v.data = data;
				});
			},

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

			// 기지원여부 확인
			bookApply: function() {

				if ($text.isEmpty($('body').data('useridx'))) return;
				if (screen.v.timeCheck) return;


				const options = {
					url: '/ExtraBlended/GetCulturalHeritageTreasureHuntJson.mrn',
					data: {

						loginUserSeq: $('body').data('useridx'),
						eventCodeSeq: screen.v.eventCodeSeq,

					},
					success: function(res) {

						// applied 1 : 신청내역 존재
						if(res.resultData[0].applied == 0) {
							$('#book-request').bPopup({
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

			// 최종지원처리
			applyPost: function() {

				const options = {
					url: '/ExtraBlended/SaveCulturalHeritageTreasureHuntJson.mrn',
					data: {

						loginUserSeq: $('body').data('useridx'),
						eventCodeSeq: screen.v.eventCodeSeq,
						memo: '문화유산 보물찾기',

					},
					success: function(res) {

						// 모달닫기
						$('#book-request .btn-block .b-close').trigger('click');

						// res 정상시
						$msg.alert('이벤트 신청이 완료되었습니다.');
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

			// 지역 슬라이드
			sliderArea: function() {

				var $areaSlider = $('.area-slider');
				$areaSlider.slick({
					dots: false,
					arrows: false,
					infinite: false,
					slidesToShow: 2,
					slidesToScroll: 2,
					responsive: [
						{
							breakpoint: 540,
							settings: {
								dots: true,
								slidesToShow: 1,
								slidesToScroll: 1,
							}
						}
					]
				});
			},

			// 시대별 슬라이드
			sliderTime: function() {

				var $timeSlider = $('.time-slider');
				$timeSlider.slick({
					dots: true,
					arrows: true,
					infinite: false,
					slidesToShow: 2,
					slidesToScroll: 2,
					responsive: [
						{
							breakpoint: 540,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
								arrows: false
							}
						}
					],
				});

				// 모바일때 멘 마지막 빈 페이지삭제
				if($('.time-slider').slick('getSlick').options.slidesToShow == 1)
										$('.time-slider').slick('slickRemove',false);
			},

			// size 변경시
			resize: function() {

				let w = $(window).width();
				// PC
				if (w > 750 && screen.v.beforeWidth <= 750) {
					// __w('모바일에서 PC로 변경');
					$('.tabs li:first').trigger('click');
					screen.v.isMobile = false;
				}
				// Mobile
				if (screen.v.beforeWidth > 750 && w <= 750) {
					// __w('PC에서 모바일로 변경');
					$('.tabs li:first').trigger('click');
					screen.v.isMobile = true;
				}

				screen.v.beforeWidth = w;
			},

			// 지역별 다운로드
			areaDown: function() {

				// 각 탭 항목 선택 pc/mobile
				let filter = screen.v.isMobile ? $('#tab2').find('.sel-menu .select2').val() : $('#tab2').find('.dep-menu li.on a').data('no');
				let text = screen.v.isMobile ? $('#tab2').find('.sel-menu .select2 option:selected').text() : $('#tab2').find('.dep-menu li.on a').text();

				// url data 세팅
				let data = screen.v.data.area.data;
				let rows = $objData.getListFilter(data, 'code', filter)[0];

				screen.f.down(rows.download);
			},

			// 시대별 다운로드
			timeDown: function() {

				// 각 탭 항목 선택 pc/mobile
				let filter = screen.v.isMobile ? $('#tab3').find('.sel-menu .select2').val() : $('#tab3').find('.dep-menu li.on a').data('no');
				let text = screen.v.isMobile ? $('#tab3').find('.sel-menu .select2 option:selected').text() : $('#tab3').find('.dep-menu li.on a').text();

				// url data 세팅
				let data = screen.v.data.time.data;
				let rows = $objData.getListFilter(data, 'code', filter)[0];

				screen.f.down(rows.download);
			},

			// 지역별 전체 다운로드
			areaDownAll: function() {
				screen.f.down(screen.v.data.area.downloadAll);
			},

			// 시대별 전체 다운로드
			timeDownAll: function() {
				screen.f.down(screen.v.data.time.downloadAll);
			},

            //  다운로드
            down: function(e) {

                let url = e;

                // 다운로드
                downloadMessage();

                var paramBuf = "<input type='hidden' name='fileId' value='"+url+"' >";
                $("#idDownload").html(paramBuf);
                document.downloadForm.action = "https://ele.m-teacher.co.kr/File/FileDown.mrn";
                document.downloadForm.submit();
            },


			// 클릭된 tab-content settting
			setTabContent: function(e) {

				// 선택된 탭
				let tabNo = $('.nav-tab.tabs').find('li.on a').attr('href');

				// 각 탭 항목 선택 pc/mobile
				let filter = screen.v.isMobile ? $(tabNo).find('.sel-menu .select2').val() : $(tabNo).find('.dep-menu li.on a').data('no');
				let text = screen.v.isMobile ? $(tabNo).find('.sel-menu .select2 option:selected').text() : $(tabNo).find('.dep-menu li.on a').text();

				// sub title 세팅
				$(e).parents('.tab-cont').find('.sub-header h3').text(text);

				// url data 세팅
				let data = tabNo == '#tab2'? screen.v.data.area.data : screen.v.data.time.data
				let rows = $objData.getListFilter(data, 'code', filter)[0];

				// 탭별 슬라이드에 slick 삭제
				$areaSlider = tabNo == '#tab2'? $('#tab2.tab-cont').find('.area-slider') : $('#tab3.tab-cont').find('.time-slider');
				$areaSlider.slick('unslick');
				$areaSlider.find('li').remove();

				// 탭별 슬라이드에 img items 추가
				$.each(rows.card, function(idx, url) {

					let $areaSliderItem = screen.v.imgItem.clone();
					$areaSliderItem.find('img').attr('src', url);
					$areaSlider.append($areaSliderItem);

				});

				if(rows.card.length%2==1) {

					let $areaSliderItem = screen.v.imgItem.clone();
					$areaSliderItem.find('img').attr('src', "/assets/images/culture/time_0_0.png");
					$areaSlider.append($areaSliderItem);
				}

				// 각 탭별 slider 초기화
				tabNo == '#tab2' ? screen.f.sliderArea() : screen.f.sliderTime() ;
			},

			// 신청하기 클릭
			apply: function() {

				// 폼 체크
				let inputs = $('#book-request .request-input ul').find('input[type=text]');
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
					screen.c.applyPost();

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

			// 시간 체크해서 신청 제외
			timeChecker: function() {
				let serverTime = $('body').data('serverdate');
				if(serverTime > "2022/07/04 00:00:00") {
					screen.v.timeCheck = true;
					$('.bookApplyButtonClass').attr('style', "display:none;");
					$('#bookApplyButtonTimeOver').attr('style', "display:block;");
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

			//tab
			var $tabsNav = $('.tabs'),
				$tabsNavLis = $tabsNav.children('li'),
				$tabContent = $('.tab-cont');

			$tabsNav.each(function() {
				var $this = $(this);
				$this.next().children('.tab-cont').stop(true, true).hide().first().show();
				$this.children('li').first().addClass('on').stop(true, true).show();
			});

			$tabsNavLis.on('click', function(e) {

				// tab id
				let id = $(this).find('a').attr('href');
				$(this).siblings().removeClass('on').end().addClass('on');
				$(this).parent().next().children('.tab-cont').stop(true, true).hide().siblings($(this).find('a').attr('href')).fadeIn();
				e.preventDefault();

				// 각 탭 첫번째 항목 선택
				// pc
				$(id).find('.dep-menu li').removeClass('on').first().addClass('on').end().trigger('click');

				// mobile
				$(id).find('select.select2').val('01').trigger('change');

			});

			// pc에서 탭 선택시
			$tabContent.find('.pc-only a').on('click', function(e) {

				$(e.target).parents('.dep-menu').find('li').removeClass('on');
				$(e.target).parents('li').addClass('on');

				screen.f.setTabContent(e.target);

			});

			// 모바일에서 select box 선택시
			$tabContent.find('.select2.cardSelect').on('change', function(e) {screen.f.setTabContent(e.target);});

			// tab 1 에서 선택시
			$tabContent.find('.select2.subTabSelect').on('change', function(e) {

				let v = $(this).val();
				if (v == '01') $('.use-tab.tabs li:eq(0)').find('a').trigger('click');
				if (v == '02') $('.use-tab.tabs li:eq(1)').find('a').trigger('click');
				if (v == '03') $('.use-tab.tabs li:eq(2)').find('a').trigger('click');

			});

			// 지역 탭 다운로드 버튼
			$('#tab2 .btn-area-down').on('click', screen.f.areaDown);

			// 시대 탭 다운로드 버튼
			$('#tab3 .btn-time-down').on('click', screen.f.timeDown);

			// 전체 다운로드 버튼 처리 진행중
			$('#tab2 .btn-down-all').on('click', screen.f.areaDownAll);
			$('#tab3 .btn-down-all').on('click', screen.f.timeDownAll);

			// 신청하기 버튼 누를 시 기지원여부 확인
			$('#bookApplyButton').on('click', screen.c.bookApply);

			// 팝업 전체 동의 버튼 누를 시 처리
			$('#agree1').on('change', function() {
				if($('#agree1').prop('checked')) {
					$('#agree2, #agree3').prop('checked', true);
				} else {
					$('#agree2, #agree3').prop('checked', false);
				}
			});

			// 팝업 전체 동의 확인 버튼 누를 시
			$('#pInfoAgree').on('click', function() {
				if($('#agree2').prop('checked') && $('#agree3').prop('checked') ) {
					$('.check-wrap input[type=checkbox]').prop('checked', true);

					// 창 닫기
					$('#personal-agree .b-close').trigger('click');

				} else {
					$('.check-wrap input[type=checkbox]').prop('checked', false);
					$msg.alert('개인정보 수집 및 활용 동의 항목에 체크해주세요.');
				}

			});

			// 신청하기 버튼 누를 시
			$('#applyButton').on('click', screen.f.apply);

			// 동의 모달 팝업
			$('.open-personal-agree').on('click', screen.f.openModalPersonalAgree);

			// 개인정보 수정 버튼
			$('#modifyLink').on('click', function() {$('#book-request .btn-block .b-close').trigger('click');});
			$('#modifyLink2').on('click', function() {$('#book-request .btn-block .b-close').trigger('click');});
		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			screen.v.imgItem = $('#tab2.tab-cont').find('.area-slider li:first').clone();

			// Event 정의 실행
			screen.event();

			// 목록 가져오기
			screen.c.getList();

			// 슬라이드 초기화
			screen.f.sliderArea();
			screen.f.sliderTime();

			screen.f.timeChecker();
		}
	};

	screen.init();
	window.screen = screen;
});
