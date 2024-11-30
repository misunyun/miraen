$(function() {

	const screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			isBbsThumnailType: false,
			pagingRowCount: 16,
			totalCnt: 0,
			tagNmList: ['extraGradeNm', 'extraTermNm', 'extraCourseNm', 'typeCSeq1Nm', 'typeCSeq2Nm', 'typeCSeq3Nm', 'typeCSeq4Nm'],
			inqrCndt: null,
			exceptEcmTabCSeq: '1089', // 로그인 예외처리 (수업활동자료 - 교육연극 수업 게시판)
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			/**
			 * 게시판 공통 리스트 조회
			 *
			 * @memberOf screen.c
			 */
			getBbsCmmList: function(page) {

				const param = screen.f.getParam();

				param.page = !!page ? page : 1;

				const options = {
					url: '/bbs/bbsCmmList.ax',
					data: param,
					success: function(res) {

						// 조회 조건
						screen.v.inqrCndt = param;
						if(!!res.resultData) {

							// 총 개수
							$('.list-num').find('em').text($num.comma(res.resultData.totalCnt));
							screen.v.totalCnt = res.resultData.totalCnt;

							// 페이징
							$cmm.setPaging($('.box-paging02'), {
								page: param.page,
								pagingRowCount: screen.v.pagingRowCount,
								totalCnt: res.resultData.totalCnt
							}, screen.c.getBbsCmmList);

							// 게시판 리스트 생성
							screen.f.createBbsList(res.resultData.list);

							// 로그인 예외처리 (수업활동자료 - 교육연극 수업 게시판)
//							let item = res.resultData.list[0] || null;
//							if(item != null && item['ecmTabCSeq'] == screenUI.v.exceptEcmTabCSeq){
//								$("#wrap").data('viewOpenTf', true);
//							}
						}
					}
				}
				// 스크롤 상단으로 이동
				// $("html, body").animate({ scrollTop: 115 }, "fast");
				$cmm.ajax(options);
			},
		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {

			/**
			 * 조회 파라미터
			 *
			 * @memberOf screen.f
			 */
			getParam: () => {

				const param = $cmm.serializeJson($('#frmSearch'));

				// 조회 조건
				for(let key in param) {

					if(typeof param[key] === 'object') {

						param[key] = param[key].join(',');
					}
				}

				param.pageRowLength = screen.v.pagingRowCount;
				param.boardTypeCSeq = $('#wrap').data('boardTypeCSeq');
				param.emcSeq = $('#wrap').data('emcSeq');
				param.searchTxt = $('#inpSearchTxt').val();
				param.searchUserId = $('#inpSearchUserId').val();
				param.orderByCd = $('.list-header').find('.sort button.on').data('value');
				param.ecmTabCSeq = $('.tab-ty').find('li.active a').data('value');

				return param;
			},

			/**
			 * 게시판 No
			 *
			 * @memberOf screen.f
			 */
			getBbsNum: idx => {

				return $num.comma(screen.v.totalCnt - (((Number($('.box-paging02').find('a.on').text()) - 1)) * screen.v.pagingRowCount) - idx);
			},

			/**
			 * 게시판 리스트 생성
			 *
			 * @memberOf screen.f
			 */
			createBbsList: data => {

				// 썸네일형일 경우
				if(screen.v.isBbsThumnailType) {

					screen.f.createBbsThumnail(data);
				} else {

					screen.f.createBbsCommun(data);
				}
			},

			/**
			 * 썸네일 게시판 생성
			 *
			 * @memberOf screen.f
			 */
			createBbsThumnail: data => {

				$('.list-board.thumb-type').empty();
				$('.list-board.list-type').empty();

				if(data.length === 0) {

					$('.no-data').removeClass('d-none');
					return;
				}

				$('.no-data').addClass('d-none');

				// row 생성 함수
				const createRow = ($elet, item) => {

					// 링크
					$elet.find('a').attr('href', 'javascript:;');
					$elet.find('a').data('href', `${location.pathname}/${item.extraSeq}`);

					// 썸네일 크기 계산하여 css 변경 적용
					$("<img/>").attr('src', item.extraThumbnailUrl).on('load', function() {
						const w = this.width;
						const h = this.height;

						$('body.cmm-bss').removeClass('crop-width').removeClass('crop-height').removeClass('crop-sqare');

						if (w > h ) {
							$elet.find('.thumb').addClass('img-width');
						} else if (w < h ) {
							$elet.find('.thumb').addClass('img-height');
						} else {
							$elet.find('.thumb').addClass('img-square');
						}

						// 썸네일
						$elet.find('img').attr('src', item.extraThumbnailUrl);

					});

					// 제목
					$elet.find('dt').text(item.extraTitle);
					// 요약
					$elet.find('dd.txt').text(item.extraSubtitle1);
					// 북마크 set data
					$elet.find('.cmmBookmark').data('extra_seq', item.extraSeq);
					$elet.find('.cmmBookmark').addClass(!!item.isBookmark ? 'on' : '');

					// 재생시간
					if(!!item.mediaPlayTime) {

						$elet.find('.vod-time').removeClass('d-none').append(item.mediaPlayTime.replace(/^00:/g, ''));
						$elet.find('.add-info').removeClass('d-none');
					}
					// 첨부파일
					if(item.isAtchFile > 0) {

						$elet.find('.attach-file').removeClass('d-none');
						$elet.find('.add-info').removeClass('d-none');
					}
					// 댓글
					if(item.replyCnt > 0) {

						$elet.find('.comment-num').removeClass('d-none').append($num.comma(item.replyCnt));
						$elet.find('.add-info').removeClass('d-none');
					}
					// 태그
					screen.v.tagNmList.forEach(key => {

						if(!!item[key]) {

							$elet.find('dd.tag').append(`<span>${item[key]}</span>`);
						}
					});

					return $elet;
				};

				data.forEach(item => {

					// 이미지형
					$('.list-board.thumb-type').append(createRow(screen.f.$liThumb.clone(), item));

					// 리스트형
					$('.list-board.list-type').append(createRow(screen.f.$liList.clone(), item));
				});
			},

			/**
			 * 커뮤니티 게시판 생성
			 *
			 * @memberOf screen.f
			 */
			createBbsCommun: data => {

				$('#divCommunBbs').find('.tbl-block tbody').empty();
				$('#divCommunBbs').find('ul').empty();

				let extraHeadFixYnCnt = 0;
				// row 생성 함수
				const createRow = ($elet, idx, item) => {

					// No 상단고정
					if(item.extraHeadFixYn === 'Y') {

						$elet.addClass('notify');
						$elet.find('.num span.no').addClass('d-none');
					} else {

						$elet.find('.num span.ico-notify').addClass('d-none');
						$elet.find('.num span.no').text(screen.f.getBbsNum(idx - extraHeadFixYnCnt));
					}

					// 링크
					$elet.find('a').attr('href', 'javascript:;');
					$elet.find('a').data('href', `${location.pathname}/${item.extraSeq}`);

					// 제목
					$elet.find('a').text(item.extraTitle);

					// 작성자
					if($('ul.tab-ty.respon-tab').find('li.active a')[0].innerHTML == '지역화 자료'){ // 지역화 자료실은 이름표기하지 않음
						$elet.find('.writer').html('<span style="color: rgb(51, 51, 51); font-weight: 400;">엠티처</span>');
					}else{
						$elet.find('.writer').html('<a href="javascript:;" class="search_user_id" data-ua-type="'+item.uaType+'" data-userid="'+item.createUserId+'">'+item.createUser+'</a>');
					}

					// 작성일
					$elet.find('.date').html(item.createDate.replace(' ', '<br>'));
					$elet.find('.date.inline').text(item.createDate);

					// 북마크 set data
					$elet.find('.cmmBookmark').data('extra_seq', item.extraSeq);
					$elet.find('.cmmBookmark').addClass(!!item.isBookmark ? 'on' : '');

					// 첨부파일
					if(item.isAtchFile > 0) {

						$elet.find('.attach-file').removeClass('d-none');
					}
					// 댓글
					if(item.replyCnt > 0) {

						$elet.find('.comment-num').removeClass('d-none').append($num.comma(item.replyCnt));
					}
					// 태그
					screen.v.tagNmList.forEach(key => {

						if(!!item[key]) {

							$elet.find('.tag').append(`<span>${item[key]}</span>`);
						}
					});
					// 관리자 삭제
					if(item.adminDelYn === 'Y') {

						$elet.find('a').attr('href', `javascript:;`);
						$elet.find('a').data('href', '');
						$elet.find('.tit').addClass('hide-notice');
						$elet.find('.tit a, .tit .attach-file, .tit .tag, .tit .comment-num').remove();
						$elet.find('.tit').append('<div class="hide-txt"><span>관리자에 의해 숨김 처리 된 게시물입니다.</span></div>');
					}

					return $elet;
				};

				$.each(data, (idx, item) => {

					if(item.extraHeadFixYn === 'Y') {

						extraHeadFixYnCnt++;
					}

					// 이미지형
					$('#divCommunBbs').find('.tbl-block tbody').append(createRow(screen.f.$trCommun.clone(), idx, item));

					// 리스트형
					$('#divCommunBbs').find('ul').append(createRow(screen.f.$liCommun.clone(), idx, item));
				});

				if($('#divCommunBbs').find('.num').length === 0) {

					$('.no-data').removeClass('d-none');
				} else {

					$('.no-data').addClass('d-none');
				}
			},

			/**
			 * 로그인 여부
			 *
			 * @memberOf screen.f
			 */
			isLogin: () => {
				// 회원 아닐시
				if (!$('body').data('scGrade')) {

					screenUI.f.loginConfirm();
				// 정회원 아닐시
				} else if($('body').data('scGrade') != '002') {

					screenUI.f.loginTeacherOnlyAlert();
				} else {

					return true;
				}

				return false;
			}
		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// 탭 클릭
			$('.tab-ty').find('a').on('click', function() {

				$('.tab-ty').find('li').removeClass('active');
				$(this).closest('li').addClass('active');

				// 조회 영역
				$('.search-filter-block').find('li').addClass('d-none');
				$('.search-filter-block').find(`[data-value=${$(this).data('value')}]`).removeClass('d-none');
				if($('.search-filter-block').find('li').not('.d-none').length === 0) {

					$('.search-filter-block').addClass('d-none');
				} else {

					$('.search-filter-block').removeClass('d-none');
				}

				// 배너
				$('.category-banner').addClass('d-none');
				$('.category-banner').find('img').addClass('d-none');

				const $bannerImg = $('.category-banner').find(`[data-value=${$('.tab-ty').find('li.active a').data('value')}]`);

				if(!!$bannerImg.attr('src')) {

					$('.category-banner').removeClass('d-none');
					$bannerImg.removeClass('d-none');
				}

				// 배너 하단 커스텀 페이지 베너 추가
				const tabSeq = $('.tab-ty').find('li.active a').data('value');
				$('.category-banner-add-on').find(`[data-value]`).addClass('d-none');
				$('.category-banner-add-on').find(`[data-value=${tabSeq}]`).removeClass('d-none');

				// 초기화
				$('#inpSearchTxt').val('');
				$('.search-filter-block').find('.check').prop('checked', false);
				$('.search-filter-block').find('.all').prop('checked', true);

				// 게시판 공통 리스트 조회
				screen.c.getBbsCmmList();
			});

			// 검색영역 체크박스
			$('.search-filter-block').on('click', '.check', function() {

				if($(this).hasClass('all')) {

					$(this).parent().find('input').prop('checked', false);
					$(this).prop('checked', true);
				} else {

					if($(this).parent().find('input:checked').length === 0) {

						$(this).parent().find('.all').prop('checked', true);
					} else {

						$(this).parent().find('.all').prop('checked', false);
					}
				}

				// 게시판 공통 리스트 조회
				screen.c.getBbsCmmList();
			});

			// 썸네일, 리스트 보기
			$('.view-type').find('button').on('click', function() {

				$('.view-type').find('button').removeClass('on');
				$(this).addClass('on');

				if($(this).hasClass('ico-thumb')) {

					$('.list-board.thumb-type').removeClass('d-none');
					$('.list-board.list-type').addClass('d-none');
				} else {

					$('.list-board.thumb-type').addClass('d-none');
					$('.list-board.list-type').removeClass('d-none');
				}
			});

			// 최신/조회순
			$('.list-header').find('.sort button').on('click', function() {

				$('.list-header').find('.sort button').removeClass('on');
				$(this).addClass('on');

				// 게시판 공통 리스트 조회
				screen.c.getBbsCmmList();
			});

			// 검색
			$('#btnSearch').on('click', () => {

				// 게시판 공통 리스트 조회
				screen.c.getBbsCmmList();
			});

			// 검색(사용자)
			$(document).on('click', '.search_user_id', (e) =>  {
				userId = $(e.target).data('userid');
				$('#inpSearchUserId').val(userId);
				$('#inpSearchTxt').attr("readonly",true);
				$('#inpSearchTxt').val($(e.target).text());

				$('.list-header .input-group .btn-reset').removeClass('d-none');

				// 게시판 공통 리스트 조회
				screen.c.getBbsCmmList();
			});

			// 검색 취소
			$('.list-header .input-group .btn-reset').on('click', (e) =>  {
				$('#inpSearchUserId').val('');
				$('#inpSearchTxt').attr("readonly",false);
				$('#inpSearchTxt').val('');
				$('.list-header .input-group .btn-reset').addClass('d-none');
				// 게시판 공통 리스트 조회
				screen.c.getBbsCmmList();
			});

			// 로그인 안되어 있는 경우
			$('.list-board').on('click', 'a', function() {
						// 상시 오픈체크이거나 로그인 되었을 경우
				if((!!$('#wrap').data('viewOpenTf') || screen.f.isLogin()) && !!$(this).data('href')) {
					location.href = $(this).data('href') + '?' + new URLSearchParams(screen.v.inqrCndt).toString() +
							'&viewType=' + ($('.view-type').find('button.on').hasClass('ico-thumb') ? '01' : '02');
				}
			});

			// 텍스트 게시판 클릭
			$('.tbl-board,.board-list-type').on('click', 'a', function() {

				// 상시 오픈체크이거나 로그인 되었을 경우
				if((!!$('#wrap').data('viewOpenTf') || screen.f.isLogin()) && !!$(this).data('href')) {
					location.href = $(this).data('href') + '?' + new URLSearchParams(screen.v.inqrCndt).toString() +
							'&viewType=' + ($('.view-type').find('button.on').hasClass('ico-thumb') ? '01' : '02');
				}
			});


			// 게시물 작성 클릭
			$('.btn-register').on('click', () => {

				if(screen.f.isLogin()) {

					if($('.tab-ty').length > 0) {

						location.href = location.pathname + '/form?' + new URLSearchParams(screen.v.inqrCndt).toString()
 					} else {

						location.href = location.pathname + '/form';
					}
				}
			});
		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {
			if((location.href).indexOf("dev") > -1 || (location.href).indexOf("local") >-1){
				screenUI.v.exceptEcmTabCSeq = '980';
			}

			// template
			screen.f.$liThumb = $('[data-template=liThumb]').clone().removeClass('d-none');
			$('[data-template=liThumb]').remove();
			screen.f.$liList = $('[data-template=liList]').clone().removeClass('d-none');
			$('[data-template=liList]').remove();
			screen.f.$trCommun = $('[data-template=trCommun]').clone().removeClass('d-none');
			$('[data-template=trCommun]').remove();
			screen.f.$liCommun = $('[data-template=liCommun]').clone().removeClass('d-none');
			$('[data-template=liCommun]').remove();

			// Event 정의 실행
			screen.event();

			// 게시판 타입
			screen.v.isBbsThumnailType = $('#wrap').data('boardTypeCSeq') === 434;
			screen.v.pagingRowCount = $('#wrap').data('boardTypeCSeq') === 434 ? 16 : 10;

			let page = 1;
			if(!!location.search) {

				const reqParam = decodeURIComponent(location.search).substring(1);

				let key, value;
				// 조회조건
				reqParam.split('&').forEach(param => {

					key = param.split('=')[0];
					value = param.split('=')[1];
					// 조회 영역[checkbox]
					if($(`[name=${key}]`).length > 0 && $(`[name=${key}]`)[0].tagName === 'INPUT' && $(`[name=${key}]`).attr('type') === 'checkbox') {

						value.split(',').forEach(val => {

							$(`[name=${key}][value=${val}]`).prop('checked', true);
						});
					} else if(key === 'page') {

						page = value;
					}
				});
			}

			// 탭 초기 설정
			if($('.tab-ty').length === 0) {

				$('.search-filter-block').find('li').removeClass('d-none');
			} else {

				// 조회영역
				$('.search-filter-block').find(`[data-value=${$('.tab-ty').find('li.active a').data('value')}]`).removeClass('d-none');

				if($('.search-filter-block').find('li').not('.d-none').length === 0) {

					$('.search-filter-block').addClass('d-none');
				}

				// 배너 초기설정
				$('.category-banner').find(`[data-value=${$('.tab-ty').find('li.active a').data('value')}]`).removeClass('d-none');
				if(!!$('.category-banner').find('img').not('.d-none').attr('src')) {
					$('.category-banner').removeClass('d-none');
				}

				// 배너 하단 커스텀 페이지 베너 추가
				const tabSeq = $('.tab-ty').find('li.active a').data('value');
				$('.category-banner-add-on').find(`[data-value]`).addClass('d-none');
				$('.category-banner-add-on').find(`[data-value=${tabSeq}]`).removeClass('d-none');
			}

			// 게시판 공통 리스트 조회
			screen.c.getBbsCmmList(page);
		}
	};

	screen.init();
	window.mrnScreen = screen;
});