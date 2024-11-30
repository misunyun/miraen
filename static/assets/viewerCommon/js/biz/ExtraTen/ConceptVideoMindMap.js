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
			, htmlCont: null	// 전체 콘텐츠
			, htmlContTitle: null	// 과목
			, htmlContTab: null	// 단원
			, htmlContTabIdx: null	// 단원 탭
			, htmlContTable: null	// 테이블
			, htmlContTableItem: null	// 테이블 내 항목

			, mobileItemBox: null
			, mobileItemHeader: null

			, rows: null	// 데이타
			, arrLesson: null	// 데이타
			, isMobile: null	// 모바일 여부
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 데이터 가져오기
			getList: function() {

				let param = {
					textbookGrade: $('.aside .pc-side-grade li.on a').data('textbookgrade')
					, textbookTerm: $('.aside .pc-side-term li.on a').data('textbookterm')
					, textbookCourseCd: $('.aside .pc-side-subject li.on a').data('textbookcoursecd')
					, textbookCurriculumCd: $('.aside .pc-side-subject li.on a').data('textbookcurriculumcd')
				};

				if (screen.v.isMobile) {
					param.textbookGrade = $('.mobile-only .aside-mobile .mobile-grade   li.on a').data('textbookgrade');
					param.textbookTerm = $('.mobile-only .aside-mobile .mobile-term    li.on a').data('textbookterm');
					param.textbookCourseCd = $('.mobile-only .aside-mobile .mobile-subject li.on a').data('textbookcoursecd');
					param.textbookCurriculumCd = $('.mobile-only .aside-mobile .mobile-subject li.on a').data('textbookcurriculumcd');
				}

				const options = {
					url: '/ExtraTen/GetConceptVideoMindMapJson.mrn',
					data: param,
					success: function(res) {

						screen.v.rows = res.resultData;

						screen.f.resize();

						// 단원 추출
						screen.f.getLesson();

						// 단원 탭 생성
						screen.f.setLessonTab();

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

				let grade = window.localStorage.getItem('pageConceptVideoMindMapGrade');
				let term = window.localStorage.getItem('pageConceptVideoMindMapTerm');

				// 로컬 스토리지 확인해서 학년 셀렉트
				if($text.isEmpty(grade)) {
					$('.aside ul li .pc-side-grade').find('[data-textbookgrade=03]').parent().addClass('on');
					$('.cont-wrap .mobile-only .aside-mobile .sel-menu .mobile-grade').find('[data-textbookgrade=03]').parent().addClass('on');
				} else {
					$('.aside ul li .pc-side-grade').find('[data-textbookgrade='+grade+']').parent().addClass('on');
					$('.cont-wrap .mobile-only .aside-mobile .sel-menu .mobile-grade').find('[data-textbookgrade='+grade+']').parent().addClass('on');
				}

				// 로컬 스토리지 확인해서 학년 셀렉트
				if($text.isEmpty(term)) {
					$('.aside ul li .pc-side-term').find('[data-textbookterm=02]').parent().addClass('on');
					$('.cont-wrap .mobile-only .aside-mobile .sel-menu .mobile-term').find('[data-textbookterm=02]').parent().addClass('on');
				} else {
					$('.aside ul li .pc-side-term').find('[data-textbookterm='+term+']').parent().addClass('on');
					$('.cont-wrap .mobile-only .aside-mobile .sel-menu .mobile-term').find('[data-textbookterm='+term+']').parent().addClass('on');
				}

				// 5학년, 6학년이면 과목 국어만
				if (grade == '05' || grade == '06') {
					$('.mobile-only .subject-select li:not(.subjectKo)').addClass('hidden');

					// 국어가 선택 안되어 있으면 선택 처리
					if (!$('.mobile-only .subject-select li.subjectKo').hasClass('on')) {
						$('.mobile-only .subject-select li').removeClass('on');
						$('.mobile-only .subject-select li.subjectKo').addClass('on');
					}

					$('.pc-only .subject-select li:not(.subjectKo)').addClass('hidden');

					// 국어가 선택 안되어 있으면 선택 처리
					if (!$('.pc-only .subject-select li.subjectKo').hasClass('on')) {
						$('.pc-only .subject-select li').removeClass('on');
						$('.pc-only .subject-select li.subjectKo').addClass('on');
					}

				} else {
					$('.mobile-only .subject-select li').removeClass('hidden');
					$('.pc-only .subject-select li').removeClass('hidden');
				}

				// 과목 첫번째 클릭
				$('.aside ul li .pc-side-subject li:first a').trigger('click');
				$('.aside-mobile ul li .mobile-subject li:first a').trigger('click');

			},

			// 단원 추출
			getLesson: function() {
				let beforeNum = '0';
				var array = [];
				$.each(screen.v.rows, function() {
					if (this['textbookLessonUnitHighNum'] != beforeNum) {
						array.push(this['textbookLessonUnitHighNum']);
						beforeNum = this['textbookLessonUnitHighNum'];
					}
				});

				screen.v.arrLesson = (array.length > 0) ? array : [];

			},

			// 단원 탭 생성
			setLessonTab: function() {

				$('.cont-wrap .sub-tab').remove();
				let $tab = screen.v.htmlContTab.clone();
				let $item = screen.v.htmlContTabIdx.clone().removeClass('on');

				// items 삭제
				$tab.find('li').remove();

				// 과목
				let subject = $('.aside .pc-side-subject li.on a').data('textbookcoursecd');
				if (subject == 'KO') {
					$tab.addClass('hidden');
				} else {
					$tab.removeClass('hidden');
				}

				// 단원 번호 세팅해서 append
				$.each(screen.v.arrLesson, function(idx, row) {
					let $addItem = $item.clone();
					$addItem.find('a').text(row + '단원');				// 단원 숫자 매핑
					$addItem.find('a').attr('href', 'javascript:;');		// 단원 href 링크
					$addItem.find('a').attr('data-bind', row);			// 단원 a 태그 내 row data bind
					$tab.find('ul').append($addItem);

				});

				// 단원 탭 items 화면 추가
				$tab.find('ul li:first').addClass('on');

				$('.cont-wrap .sub-header').after($tab);

				// 첫번째 행 클릭
				$(document).find('.cont-wrap .sub-tab li:first a').trigger('click');
			},

			// 단원 탭 이하 테이블 생성 / 바인드
			setLessonList: function() {

				let tabNum = $('.cont-wrap .sub-tab').find('.on a').data('bind');
				let rows = $objData.getListFilter(screen.v.rows, 'textbookLessonUnitHighNum', tabNum.toString());
				let subject = null;
				let grade = null;
				let doubleHead = false;

				if (screen.v.isMobile) subject = $('.aside-mobile').find('.mobile-subject li.on a').data('textbookcoursecd');
				else subject = $('.aside .pc-side-subject li.on a').data('textbookcoursecd');

				if (subject == 'KO') {
					$('.mobile-only.mobile-header h4').text('국어');
				} else {
					$('.common-tab-header').removeClass('hidden');
				}

				if (subject == 'KO') rows = screen.v.rows;
				if (subject == 'MA') {

					// mobile grade
					if(screen.v.isMobile) grade = $('.mobile-only .aside-mobile .mobile-grade   li.on a').data('textbookgrade');
					// pc grade
					else 				  grade = $('.aside .pc-side-grade li.on a').data('textbookgrade');

					// 수학 3-4학년일 경우 이중헤더 준비
					if(grade == '03' || grade == '04') doubleHead = true;

				}

				// 사회면 table Head 변경 + 이중헤더일 경우 hidden 제거
				if (subject == 'SO' || doubleHead == true) {
					$('.sub-tab-table .tbl-list thead .typeSO').removeClass('hidden');
					$('.sub-tab-table .tbl-list thead .typeSOColSpan').attr("colspan", 2);

					$('.sub-tab-table .tbl-list colgroup').find('col:eq(4)').removeClass('hidden');
					$('.sub-tab-table .tbl-list colgroup').find('col:eq(5)').removeClass('hidden');

				} else {
					$('.sub-tab-table .tbl-list thead .typeSO').addClass('hidden');
					$('.sub-tab-table .tbl-list thead .typeSOColSpan').attr("colspan", 1);

					$('.sub-tab-table .tbl-list colgroup').find('col:eq(4)').addClass('hidden');
					$('.sub-tab-table .tbl-list colgroup').find('col:eq(5)').addClass('hidden');

				}

				if (subject == 'KO') $('.sub-tab-table .tbl-list thead').find('.subTitleRename').text('마인드맵 주제');
				if (subject == 'SO') $('.sub-tab-table .tbl-list thead').find('.subTitleRename').text('주제');
				if (subject == 'MA') {

					// header title 수정
					if(doubleHead) {
						$('.sub-tab-table .tbl-list thead').find('.subTitleRename').text('주제');
					} else {
						$('.sub-tab-table .tbl-list thead').find('.subTitleRename').text('개념 영상 주제');
					}
				}

				$('.sub-tab-table .tbl-list tbody tr').remove();
				$('.mobile-header .data-list .data-box').remove();
				//$('.mobile-header').append(screen.v.mobileHeaderTab.clone());
				$('.mobile-only.mobile-header h4').text(rows[0].textbookLessonUnitHighNum + '. ' + rows[0].textbookLessonUnitHighName);


				$.each(rows, function(idx, row) {

					// tr 복사
					let $tr = screen.v.htmlContTableItem.clone();
					let $mBox = screen.v.mobileItemBox.clone();

					// pc 사회가 아닐 때 처리
					if (subject != 'SO' && doubleHead != true) {
						$tr.find('.link2').remove();
						$mBox.find('.removeSO').remove();

						$('.sub-tab-table .tbl-list thead .typeSOColSpan:first').text('바로보기');
						$('.sub-tab-table .tbl-list thead .typeSOColSpan:last').text('링크복사');

					} else {
						if(subject == 'MA') {
							$('.sub-tab-table .tbl-list thead .typeSOColSpan:first').text('개념 영상');
							$('.sub-tab-table .tbl-list thead .typeSOColSpan:last').text('연산 집중 학습');
							$mBox.find('.link1 .tit2').text('개념 영상');
							$mBox.find('.link2 .tit2').text('연산 집중 학습');
						}
						else {
							$('.sub-tab-table .tbl-list thead .typeSOColSpan:first').text('마인드맵');
							$('.sub-tab-table .tbl-list thead .typeSOColSpan:last').text('확인문제');
							$mBox.find('.link1 .tit2').text('마인드맵');
							$mBox.find('.link2 .tit2').text('확인문제');
						}

					}

					if (idx == 0) {
						if (subject != 'KO') $tr.find('.txtUnit').attr("rowspan", rows.length);
						else $tr.find('.txtUnit').removeAttr("rowspan");
					} else {
						if (subject != 'KO') $tr.find('.txtUnit').remove();
					}

					// 단원
					$tr.find('.txtUnit').text(row.textbookLessonUnitHighNum + '. ' + row.textbookLessonUnitHighName);

					// mobile
					if (subject == 'KO') {
						$mBox.find('.data-title').text(row.textbookLessonUnitHighNum + '. ' + row.textbookLessonUnitHighName); // 주제
						$mBox.find('.box-title').text('단원');
						$mBox.find('.data-mindmap').text(row.title); // 마인드맵주제
					}
					else {
						$mBox.find('.removeOtherKO').remove();
						$mBox.find('.data-title').text(row.title); // 주제
					}

					// 제목
					$tr.find('.txtTitle').text(row.title);
					if (subject == 'MA') $mBox.find('.box-title').text('개념 영상 주제');


					// 미리보기
					$tr.find('.link1 a.btn-view').data('url', row.url1);
					$tr.find('.link2 a.btn-view').data('url', row.url2);
					$mBox.find('.link1 a.btn-view').data('url', row.url1);
					$mBox.find('.link2 a.btn-view').data('url', row.url2);

					// 링크복사
					$tr.find('.link1 a.btn-copy').data('url', row.url1);
					$tr.find('.link2 a.btn-copy').data('url', row.url2);
					$mBox.find('.link1 a.btn-copy').data('url', row.url1);
					$mBox.find('.link2 a.btn-copy').data('url', row.url2);

					// row.url1,2 이 없을 경우 on 클래스 제거
					if ($text.isEmpty(row.url1)) {
						$tr.find('.link1 a').removeClass('on').addClass('noClick');
						$mBox.find('.link1 a').removeClass('on').addClass('noClick');
					}
					else {
						$tr.find('.link1 a').addClass('on').removeClass('noClick');
						$mBox.find('.link1 a').addClass('on').removeClass('noClick');
					}

					if ($text.isEmpty(row.url2)) {
						$tr.find('.link2 a').removeClass('on').addClass('noClick');
						$mBox.find('.link2 a').removeClass('on').addClass('noClick');
					}
					else {
						$tr.find('.link2 a').addClass('on').removeClass('noClick');
						$mBox.find('.link2 a').addClass('on').removeClass('noClick');
					}

					$('.sub-tab-table .tbl-list tbody').append($tr);
					$('.mobile-header .data-list').append($mBox);

				});

			},

			// 학년 메뉴 세팅
			setGrade: function(e) {

				// 학년
				let grade = $(e.target).data('textbookgrade');

				// 학년 자동화
				window.localStorage.setItem('pageConceptVideoMindMapGrade', grade);

				// 선택 처리
				$(e.target).parents('.dep-menu').find('li').removeClass('on');
				$(e.target).parents('li').addClass('on');

				// 모바일 이면
				if (screen.v.isMobile) {

					// 5학년, 6학년이면 과목 국어만
					if (grade == '05' || grade == '06') {
						$('.mobile-only .subject-select li:not(.subjectKo)').addClass('hidden');

						// 국어가 선택 안되어 있으면 선택 처리
						if (!$('.mobile-only .subject-select li.subjectKo').hasClass('on')) {
							$('.mobile-only .subject-select li').removeClass('on');
							$('.mobile-only .subject-select li.subjectKo').addClass('on');
						}

					} else {
						$('.mobile-only .subject-select li').removeClass('hidden');
					}

				}
				// PC이면
				else {

					// 5학년, 6학년이면 과목 국어만
					if (grade == '05' || grade == '06') {
						$('.pc-only .subject-select li:not(.subjectKo)').addClass('hidden');

						// 국어가 선택 안되어 있으면 선택 처리
						if (!$('.pc-only .subject-select li.subjectKo').hasClass('on')) {
							$('.pc-only .subject-select li').removeClass('on');
							$('.pc-only .subject-select li.subjectKo').addClass('on');
						}

					} else {
						$('.pc-only .subject-select li').removeClass('hidden');
					}

				}

				// 과목 선택 호출
				if (screen.v.isMobile) {
					$('.mobile-only .aside-mobile .mobile-subject li.on a').trigger('click');
				}
				else {
					$('.aside .dep-menu.pc-side-subject li.on a').trigger('click');
				}

			},

			// 학기 셋팅
			setTerm: function(e) {
				// 버튼 초기화
				$('.aside .dep-menu.pc-side-term li').removeClass('on');
				$('.mobile-only .aside-mobile .mobile-term li').removeClass('on');

				// 버튼 클릭 효과
				$(e.target).parents('.dep-menu').find('li').removeClass('on');
				$(e.target).parents('li').addClass('on');

				// 클릭/자동선택 여부에 따른 처리 추가
				if($text.isEmpty($(e).selector))
					window.localStorage.setItem('pageConceptVideoMindMapTerm', $(e.target).data('textbookterm'));
				else
					window.localStorage.setItem('pageConceptVideoMindMapTerm', $(e).find('a').data('textbookterm'));

				// 과목 선택 호출
				if (screen.v.isMobile) {
					$('.mobile-only .aside-mobile .mobile-subject li.on a').trigger('click');
				}
				else {
					$('.aside .dep-menu.pc-side-subject li.on a').trigger('click');
				}
			},

			setSubject: function(e) {
				e = e.target == null ? e : e.target;

				$(e).parents('.dep-menu').find('li').removeClass('on');
				$(e).parents('li').addClass('on');
				$('.cont-wrap .sub-header h3').text($(e).text());

				screen.c.getList();

			},

			// size 변경시
			resize: function() {

				let w = $(window).width();
				// PC
				if (w > 750 && screen.v.beforeWidth <= 750) {
					// __w('모바일에서 PC로 변경');
					$('.pc-side-subject li:first').trigger('click');
					screen.v.isMobile = false;

					// 학년 학기 과목 초기값 세팅
					screen.f.initAside();
				}
				// Mobile
				if (screen.v.beforeWidth > 750 && w <= 750) {
					// __w('PC에서 모바일로 변경');
					$('.mobile-subject li:first').trigger('click');
					screen.v.isMobile = true;

					// 학년 학기 과목 초기값 세팅
					screen.f.initAside();
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

			// 학년 선택시
			$(document).on('click', '.aside .dep-menu.pc-side-grade li a', function(e) {
				screen.v.isMobile = false;
				screen.f.setGrade(e)
			});

			$(document).on('click', '.mobile-only .aside-mobile .mobile-grade li a', function(e) {
				screen.v.isMobile = true;
				screen.f.setGrade(e)
			});

			// 학기 선택시
			$(document).on('click', '.aside .dep-menu.pc-side-term li a', function(e) {
				screen.v.isMobile = false
				screen.f.setTerm(e)
			});
			$(document).on('click', '.mobile-only .aside-mobile .mobile-term li a', function(e) {
				screen.v.isMobile = true;
				screen.f.setTerm(e)
			});

			// 과목 선택시
			$(document).on('click', '.aside .dep-menu.pc-side-subject li a', function(e) {
				screen.v.isMobile = false
				screen.f.setSubject(e);
			});

			$(document).on('click', '.mobile-only .aside-mobile .mobile-subject li a', function(e) {
				screen.v.isMobile = true;
				screen.f.setSubject(e);
			});

			// 단원 탭 선택시 하단 바인드 트리거
			$(document).on('click', '.cont-wrap .common-tab-header li a', function(e) {
				$(this).parents('ul').find('li').removeClass('on');
				$(this).parents('li').addClass('on');
				screen.f.setLessonList($(this));

			});

			// 바로보기
			$(document).on('click', 'a.btn-view.on', function(e) {

				if ($(this).hasClass('cmmLoginConfirm')) return
				else screenUI.f.winOpen($(this).data('url'));

			});

			// 링크복사
            new ClipboardJS('.btn-copy.on', {
                text: function(trigger) {
					if($(trigger).hasClass('cmmLoginConfirm')) return;
                    return $(trigger).data('url');
                }
            }).on('success', function () {
				if (screen.v.isMobile) {
					$msg.alert(lng.msg.copyLinkMobile);
				} else {
					$msg.alert(lng.msg.copyLink);
				}
            });

			// resize 호출
			$(window).resize(screen.f.resize);

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			// pc
			screen.v.htmlContTitle = $('article .sub-header').clone();
			screen.v.htmlCont = $('article .cont').clone();
			screen.v.htmlContTableItem = $('article .sub-tab-table tbody tr.item').clone();
			screen.v.htmlContTable = $('article .sub-tab-table tbody').clone();
			screen.v.htmlContTabIdx = $('article .sub-tab li:first').clone();
			screen.v.htmlContTab =  $('article .sub-tab').clone();
									$('article .sub-tab').not('.mobile-header-tab').remove();
			// mobile
			screen.v.mobileItemBox = $('article .cont .mobile-only .data-list .mobile-item-box').clone();
			$('article .cont .mobile-only .data-list .mobile-item-box').remove();

			// Event 정의 실행
			screen.event();

			// 학년 학기 과목 초기값 세팅
			screen.f.initAside();

		}
	};

	screen.init();
	window.screen = screen;
});
