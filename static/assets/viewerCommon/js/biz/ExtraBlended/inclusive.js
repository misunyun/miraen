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
			, level1Info: null			// 자료안내
			, level3AllDownload: null

			, level1Seq: 2				// 기본값 초등
			, level2Seq: null
			, level2Data: null
			, level3Seq: null
			, level3Data: null
			, level4Seq: null
			, level4Data: null

			, level5Seq: null
			, level2Html: null
			, level2HtmlMobile: null
			, level3Html: null
			, level4Html: null
			, level5Html: null
			, level5HtmlMobile: null

			, level4Link1: null			// 학생용 활동지 pdf
			, level4Link2: null			// 학생용 할동지 hwp
			, level4Link3: null			// 듣기자료 zip
			, level4Link4: null			// 교사용 자료 pdf
			, beforeWidth: 0
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
					url: '/ExtraBlended/getInclusiveJson.mrn',
					data: null,
					success: function(res) {
						if (!!res.resultData) {
							screen.v.item = res.resultData;

							// 파라메터에 따른 학교급 선택
							const schoolLevel= ($text.isEmpty($('body').data('sl'))) ? 'ele' : $('body').data('sl');
							$('.tabs .'+schoolLevel).trigger('click');
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

			// aside 초기화
			initAside: function() {

				// 영역 초기화
				$('.aside .block-level2 .item').remove();

			},

			// 영역(level2) 변경
			setLevel2: function() {

				// 영역 초기화
				$('.aside .block-level2 .item').remove();
				$('.aside-mobile .block-level2 .item').remove();

				let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level1Seq);

				// PC LMB 리스트 넣기
				$.each(rows, function(idx, item) {
					let $li = screen.v.level2Html.clone();
					$li.find('a').data('iseq', item.iSeq);			// data id
					$li.find('a').addClass('iseq_' + item.iSeq);	// class
					$li.find('a').data('nm', item.nm);				// data nm
					$li.find('a').data('memo', item.memo);			// data memo
					$li.find('a').data('dd', item);					// data
					$li.find('a').text(item.nm);					// name
					$('.aside .block-level2').append($li);

					let $liMobile = screen.v.level2HtmlMobile.clone();
					$liMobile.addClass('iseq_' + item.iSeq);		// class
					$liMobile.data('iseq', item.iSeq);				// data id
					$liMobile.text(item.nm);						// name
					$('.aside-mobile .block-level2').append($liMobile);

				});

				// 첫번째 클릭
				$('.aside .block-level2 li:first a').trigger('click');

			},

			// 주제(level3) 변경
			setLevel3: function() {

				// 주제 초기화
				$('.aside .block-level3 .item').remove();
				let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level2Seq);

				// PC LMB 리스트 넣기
				$.each(rows, function(idx, item) {
					let $li = screen.v.level3Html.clone();
					$li.find('a').data('iseq', item.iSeq);			// data id
					$li.find('a').addClass('iseq_' + item.iSeq);	// class
					$li.find('a').data('nm', item.nm);				// data nm
					$li.find('a').data('dd', item);					// data
					$li.find('a').text(item.nm);					// name
					$('.aside .block-level3').append($li);

				});

				// 콤보 셋팅
				$combo.bind(rows, '#selLevel3', '', '', 'nm', 'iSeq');

				// 첫번째 클릭
				$('.aside .block-level3 li:first a').trigger('click');

			},

			// 단원(level4) 변경
			setLevel4: function() {

				// 단원 초기화
				$('.aside .block-level4 .item').remove();

				let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level3Seq);

				// PC LMB 리스트 넣기
				$.each(rows, function(idx, item) {
					let $li = screen.v.level4Html.clone();
					$li.find('a').data('iseq', item.iSeq);			// data id
					$li.find('a').addClass('iseq_' + item.iSeq);	// class
					$li.find('a').data('nm', item.nm);				// data nm
					$li.find('a').data('dd', item);					// data
					$li.find('a').text(item.nm);					// name
					$('.aside .block-level4').append($li);
				});

				// 콤보 셋팅
				$combo.bind(rows, '#selLevel4', '', '', 'nm', 'iSeq');

				// 첫번째 클릭
				$('.aside .block-level4 li:first a').trigger('click');

			},

			// 목록(level5) 변경
			setLevel5: function() {

				// 목록 초기화
				$('.pc-only .block-level5 .item').remove();
				$('.mobile-only .block-level5 .item').remove();

				let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level4Seq);

				// PC 목록 리스트 넣기
				$.each(rows, function(idx, item) {
					let $tr = screen.v.level5Html.clone();
					let $mobileItem = screen.v.level5HtmlMobile.clone();

					if (idx == 0) {
						$tr.find('.file01').attr("rowspan", rows.length);
						$tr.find('.file02').attr("rowspan", rows.length);
						$tr.find('.file03').attr("rowspan", rows.length);

						if (!$text.isEmpty(screen.v.level4Data.url1)) {
							$tr.find('.btn_link1').addClass('on');
						}
						if (!$text.isEmpty(screen.v.level4Data.url2)) {
							$tr.find('.btn_link2').addClass('on');
						}
						if (!$text.isEmpty(screen.v.level4Data.url3)) {
							$tr.find('.btn_link3').addClass('on');
						}
						if (!$text.isEmpty(screen.v.level4Data.url4)) {
							$tr.find('.btn_link4').addClass('on');
						}

					} else {
						$tr.find('.file01').remove();
						$tr.find('.file02').remove();
						$tr.find('.file03').remove();
					}

					$tr.find('.txtTitle1').text(item.nm);
					$tr.find('.txtTitle2').text(item.txt1);

					// pc 추가
					$('.pc-only .block-level5').append($tr);

					// 모바일 추가
					$mobileItem.find('.txtTitle1').text(item.nm);
					$mobileItem.find('.txtTitle2').text(item.txt1);
					if (!$text.isEmpty(screen.v.level4Data.url1)) {
						$mobileItem.find('.btn_link1').addClass('on');
					}
					if (!$text.isEmpty(screen.v.level4Data.url2)) {
						$mobileItem.find('.btn_link2').addClass('on');
					}
					if (!$text.isEmpty(screen.v.level4Data.url3)) {
						$mobileItem.find('.btn_link3').addClass('on');
					}
					if (!$text.isEmpty(screen.v.level4Data.url4)) {
						$mobileItem.find('.btn_link4').addClass('on');
					}

					$('.mobile-only .block-level5').append($mobileItem);

				});

			},

			// 영역 클릭
			clickLevel2: function() {

				// level2 선택값 넣기
				screen.v.level2Seq = $(this).data('iseq');
				screen.v.level2Data = $(this).data('dd');

				$('.txtTitleLevel2').text($(this).data('nm'));
				$('.txtMemoLevel2').html($(this).data('memo'));

				$(this).parents('.block-level2').find('.item').removeClass('on');
				$(this).parent().addClass('on');

				$('.aside-mobile .block-level2').find('.iseq_' + screen.v.level2Seq).addClass('on');

				// 체크
				screen.f.setLevel3();
			},

			// 영역 클릭(모바일)
			clickMobileLevel2: function() {

				$(this).parents().find('a').removeClass('on');
				$(this).addClass('on');

				let iseq = $(this).data('iseq');

				// pc 클릭
				$('.aside .block-level2').find('.iseq_' + iseq).trigger('click');

			},

			// 주제 클릭
			clickLevel3: function() {

				// level3 선택값 넣기
				screen.v.level3Seq = $(this).data('iseq');
				screen.v.level3Data = $(this).data('dd');

				$('.txtTitleLevel3').text($(this).data('nm'));

				$(this).parents('.block-level3').find('.item').removeClass('on');
				$(this).parent().addClass('on');

				// 체크
				screen.f.setLevel4();
			},

			// 주제 변경(모바일)
			clickMobileLevel3: function() {

				let iseq = $('#selLevel3').val();
				// pc 클릭
				$('.aside .block-level3').find('.iseq_' + iseq).trigger('click');

			},

			// 단원 클릭
			clickLevel4: function() {

				// level4 선택값 넣기
				screen.v.level4Seq = $(this).data('iseq');
				screen.v.level4Data = $(this).data('dd');

				$('.txtTitleLevel4').text($(this).data('nm'));

				$(this).parents('.block-level4').find('.item').removeClass('on');
				$(this).parent().addClass('on');

				// 체크
				screen.f.setLevel5();
			},

			// 단원 클릭(모바일)
			clickMobileLevel4: function() {

				let iseq = $('#selLevel4').val();
				// pc 클릭
				$('.aside .block-level4').find('.iseq_' + iseq).trigger('click');

			},

			// 자료 안내
			viewPdf: function() {

				let url = '';
				url = screen.v.level2Data.url1;
				if (!$text.isEmpty(url)) {

					// 다운로드 내역 저장
   					page_play("EXTRA","INCLUSIVE", screen.v.level2Data.iSeq, $('body').data('useridx'),"DOWNLOAD");//로그

					screenUI.f.pdfWindowOpen(url);
				} else {
					$msg.alert('파일 없음');
				}

			},

			// 주제별 전체 다운로드
			downloadAll: function() {

				let url = '';
				url = screen.v.level3Data.url1;
				if (!$text.isEmpty(url)) {
					// 다운로드 내역 저장
   					page_play("EXTRA","INCLUSIVE", screen.v.level3Data.iSeq, $('body').data('useridx'),"DOWNLOAD");//로그
					screenUI.f.download(url);

				} else {
					$msg.alert('파일 없음');
				}

			},

			//  다운로드
			link: function() {

				let no = $(this).data('type');
				let url = '';
				if (no == 1) {
					url = screen.v.level4Data.url1;
				} else if (no == 2) {
					url = screen.v.level4Data.url2;
				} else if (no == 3) {
					url = screen.v.level4Data.url3;
				} else if (no == 4) {
					url = screen.v.level4Data.url4;
				}

				if (url == '-') {

					// 로그인
					screenUI.f.loginConfirm();

				} else if (url == '--') {

					// 선생님 회원만
					screenUI.f.loginTeacherOnlyAlert();

				} else if (!$text.isEmpty(url)) {

					// 다운로드 내역 저장
   					page_play("EXTRA","INCLUSIVE", screen.v.level4Data.iSeq, $('body').data('useridx'),"DOWNLOAD");//로그

					let ext = url.substr(-3);
					if (ext == 'pdf') {
						screenUI.f.pdfWindowOpen(url);
					} else {
						screenUI.f.download(url);
					}
				} else {
					// $msg.alert('파일 없음');
				}

			},

			// size 변경시
			resize: function() {

				let w = $(window).width();
				// PC
				if (w > 750 && screen.v.beforeWidth <= 750) {
					// __w('모바일에서 PC로 변경');
					$('.tabs .ele').trigger('click');
				}
				// Mobile
				if (screen.v.beforeWidth > 750 && w <= 750) {
					// __w('PC에서 모바일로 변경');
					$('.tabs .ele').trigger('click');
				}

				screen.v.beforeWidth = w;
			},

		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			//tab
			var $tabsNav = $('.tabs'),
				$tabsNavLis = $tabsNav.children('li'),
				$tabContent = $('.tab-cont');

			$tabsNavLis.on('click', function(e) {
				var $this = $(this);
				$this.siblings().removeClass('on').end().addClass('on');
				$this.parent().next().children('.tab-cont').stop(true, true).hide().siblings($this.find('a').attr('href')).fadeIn();
				e.preventDefault();
			});

			$('.tabs .ele').on('click', function() {
				$(this).parent().removeClass('mid high').addClass('ele');
				$('body, .page-inclusive #contents').removeClass('mid').removeClass('high').addClass('ele');
				screen.v.level1Seq = 2;

				screen.f.setLevel2();
			});

			$('.tabs .mid').on('click', function() {
				$(this).parent().removeClass('ele high').addClass('mid');
				$('body, .page-inclusive #contents').removeClass('ele').removeClass('high').addClass('mid');
				screen.v.level1Seq = 3;

				screen.f.setLevel2();
			});

			$('.tabs .high').on('click', function() {
				$(this).parent().removeClass('ele mid').addClass('high');
				$('body, .page-inclusive #contents').removeClass('ele').removeClass('mid').addClass('high');
				screen.v.level1Seq = 4;

				screen.f.setLevel2();
			});

			// 영역 클릭
			$(document).on('click', '.aside .block-level2 .item a', screen.f.clickLevel2);

			// 주제 클릭
			$(document).on('click', '.aside .block-level3 .item a', screen.f.clickLevel3);

			// 단원 클릭
			$(document).on('click', '.aside .block-level4 .item a', screen.f.clickLevel4);

			// 영역 클릭(모바일)
			$(document).on('click', '.aside-mobile .block-level2 a.item', screen.f.clickMobileLevel2);

			// 주제 클릭(모바일)
			$(document).on('change', '#selLevel3', screen.f.clickMobileLevel3);

			// 영역 클릭(모바일)
			$(document).on('change', '#selLevel4', screen.f.clickMobileLevel4);

			// 자료 안내
			$('#btnPdf').on('click', screen.f.viewPdf);

			// 주제별 전체 다운로드
			$('#btnDownloadAll').on('click', screen.f.downloadAll);

			// url1 다운로드
			$(document).on('click', '.btn_link1.on', screen.f.link);
			$(document).on('click', '.btn_link2.on', screen.f.link);
			$(document).on('click', '.btn_link3.on', screen.f.link);
			$(document).on('click', '.btn_link4.on', screen.f.link);

			// resize 호출
			$(window).resize(screen.f.resize);

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			// html level2 복제
			screen.v.level2Html = $('.aside .block-level2 li.item').clone();
			$('.aside .block-level2 li.item').remove();

			// html level2 복제 - mobile
			screen.v.level2HtmlMobile = $('.aside-mobile .block-level2 .item').clone();
			$('.aside-mobile .block-level2 .item').remove();

			// html level3 복제
			screen.v.level3Html = $('.aside .block-level3 li.item').clone();
			$('.aside .block-level3 li.item').remove();

			// html level4 복제
			screen.v.level4Html = $('.aside .block-level4 li.item').clone();
			$('.aside .block-level4 li.item').remove();

			// html level5 복제
			screen.v.level5Html = $('.pc-only .block-level5 tr.item').clone();
			$('.pc-only .block-level5 tr.item').remove();

			// html level5 복제- mobile
			screen.v.level5HtmlMobile = $('.mobile-only .block-level5 .item').clone();
			$('.mobile-only .block-level5 .item').remove();

			// Event 정의 실행
			screen.event();

			// 목록 가져오기
			screen.c.getList();

			screen.v.beforeWidth = $(window).width();

		}
	};

	screen.init();
	window.screen = screen;
});