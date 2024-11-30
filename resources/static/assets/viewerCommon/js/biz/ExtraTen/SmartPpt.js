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
			, gradeData: null
			, termData: null
			, courseData: null
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 단원 목록 가져오기
			getLessonList: function() {

				const options = {
					url: '/ExtraTen/GetSmartPptJson.mrn',
					data: { gradeCd: screen.v.gradeData, termCd: screen.v.termData, courseCd: screen.v.courseData},
					success: function(res) {
						if (!!res.resultData) {
							screen.v.item = res.resultData;

							if(screen.v.item == []) {
								$('div.cont, div.mobile-only').addClass('d-none');
								$('div.cont-wrap').html('no data.');
							} else {
								$('div.cont, div.mobile-only').removeClass('d-none');
							}

                            if(screen.v.courseData == 'SO'){
                                // 사회 단원 세팅
                                screen.f.setUnitSo();
                            } else {
                                // 단원 세팅
                                screen.f.setUnit();
                            }

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

            // 학년 변경
            setGrade: function() {

				let grade = window.localStorage.getItem('pageTextbookEbookGrade');

                if($text.isEmpty(grade)) {
					// 첫번째 클릭
					//$('.aside .block-grade li:first a').trigger('click');
					$('.aside .block-grade li:first').addClass('on');
					$('.aside-mobile .block-grade li:first').addClass('on');
				} else {
					// 해당 학년 클릭
					//$('.aside .block-grade').find('.grade_' + grade).trigger('click');
					$('.aside .block-grade').find('a[data-dd='+grade+']').parent().addClass('on');
					$('.aside-mobile .block-grade').find('a[data-dd='+grade+']').parent().addClass('on');
				}

				screen.v.gradeData = $('.aside .block-grade li.on a').data('dd');

            },

            // 학기 변경
            setTerm: function() {

				let term = window.localStorage.getItem('pageTextbookEbookTerm');

				if($text.isEmpty(term)) {
	                // 첫번째 클릭
	                //$('.aside .block-term li:last a').trigger('click');
	                //$('.aside-mobile .block-term li:last a').trigger('click');
	                $('.aside .block-term li:first').addClass('on');
	                $('.aside-mobile .block-term li:first').addClass('on');
				} else {
					// 선택됐던 항목 재선택
	                //$('.aside .block-term li').find('a[data-dd='+term+']').trigger('click');
	                //$('.aside-mobile .block-term li').find('a[data-dd='+term+']').trigger('click');
	                $('.aside .block-term li').find('a[data-dd='+term+']').parent().addClass('on');
	                $('.aside-mobile .block-term li').find('a[data-dd='+term+']').parent().addClass('on');

				}

				screen.v.termData = $('.aside .block-term li.on a').data('dd');

            },

            // 과목 변경
            setCourse: function(){

				let course = '';
				course = window.localStorage.getItem('pageTextbookEbookCourse');

                $('.aside .block-course li').removeClass('on');
                $('.aside-mobile .block-course li').removeClass('on');

				if($text.isEmpty(course)) {
	                // 첫번째 클릭
	                //$('.aside .block-course li:last a').trigger('click');
	                //$('.aside-mobile .block-course li:last a').trigger('click');
	                $('.aside .block-course li:first').addClass('on');
	                $('.aside-mobile .block-course li:first').addClass('on');
				} else {
					// 선택됐던 항목 재선택
	                //$('.aside .block-course li').find('a[data-dd='+course+']').trigger('click');
	                //$('.aside-mobile .block-course li').find('a[data-dd='+course+']').trigger('click');
	                $('.aside .block-course li').find('a[data-dd='+course+']').parent().addClass('on');
	                $('.aside-mobile .block-course li').find('a[data-dd='+course+']').parent().addClass('on');
				}

				screen.v.courseData = $('.aside .block-course li.on a').data('dd');

				/*
                if(screen.v.gradeData=='05' || screen.v.gradeData=='06'){
                    $('.aside .course_SI').parent().removeClass('d-none');
                    $('.aside-mobile .course_SI').removeClass('d-none');
                } else {
                    $('.aside .course_SI').parent().addClass('d-none');
                    $('.aside-mobile .course_SI').addClass('d-none');
                }
                */

                // 첫번째 클릭
                //$('.aside .block-course li:first a').trigger('click');
            },

            // 단원 변경
            setUnit: function(){

                // 단원 초기화
                $('.aside .block-unit .item').remove();

                $('.cont-co').removeClass('d-none');
                $('.cont-so').addClass('d-none');

                let rows = $objData.getListFilter(screen.v.item, 'textbookLessonTypeCd', "UNIT_HIGH");

                // PC LMB 리스트 넣기
                $.each(rows, function(idx, item) {

                    let $li = screen.v.unitHtml.clone();
                    $li.find('a').data('tblSeq', item.textbookLessonSeq);		// data id
                    $li.find('a').addClass('tblSeq_' + item.textbookLessonSeq);	// class
                    $li.find('a').data('dd', item);								// data
                    $li.find('a').text( item.unitNumName);						// name
                    $('.aside .block-unit').append($li);

                });

                // 콤보 셋팅
                $combo.bind(rows, '#selUnit', '', '', 'unitNumName', 'textbookLessonSeq');

                // 첫번째 클릭
                $('.aside .block-unit li:first a').trigger('click');

            },

            // 사회 단원 변경
            setUnitSo: function(){

                // 단원 초기화
                $('.aside .block-unit-so .item').remove();

                $('.cont-co').addClass('d-none');
                $('.cont-so').removeClass('d-none');

                let rows = $objData.getListFilter2(screen.v.item, 'textbookLessonTypeCd', "UNIT_HIGH", 'textbookLessonTypeCd', "UNIT_MID");
				let temp = [];
				$.each(rows, function(i,item){
					if(item.textbookSeq != 12) temp.push(item);
				})
				rows = temp;
                let rows_high = [];

                // PC LMB 리스트 넣기
                $.each(rows, function(idx, item) {

                    if(item.textbookLessonTypeCd=='UNIT_HIGH'){
                        let $li = screen.v.unitSoHtml.clone();
	                    $li.find('a').data('tblSeq', item.textbookLessonSeq);		// data id
	                    $li.find('a').addClass('tblSeq_' + item.textbookLessonSeq);	// class
	                    $li.find('a').data('dd', item);								// data
                        $li.find('a').text( item.unitNumName);						// name
                        $li.find('.dep-menu2').remove();

                        $('.aside .block-unit-so').append($li);
                        rows_high.push(item);
                    }

                    if(item.textbookLessonTypeCd=='UNIT_MID' && !!item.unitNum){

                        let $li = screen.v.unitSoHtml2.clone();
                        $li.find('a').data('tblSeq', item.textbookLessonSeq);			// data id
                        $li.find('a').addClass('tblSeq_' + item.textbookLessonSeq);	// class
                        $li.find('a').text( item.unitNumName);					// name
                        $li.find('a').data('dd', item);					// data

                    }

                });

                // 콤보 셋팅
                $combo.bind(rows_high, '#selUnitHigh', '', '', 'unitNumName', 'textbookLessonUnitHighNum');

                // 첫번째 클릭
                $('.aside .block-unit-so .item:first a:first').trigger('click');

            },

            // 컨텐츠 내용 변경
            setContents: function() {

                // title
                $('.txtTitleUnit').text(screen.v.unitData.unitNumName);

                // 목록 초기화
                $('.pc-only .block-contents tr').remove();
                $('.mobile-only .block-contents .data-box').remove();

                let rows = $objData.getListFilter(screen.v.item, 'textbookLessonUnitHighName', screen.v.unitData.unitName);
                rows = $objData.getListFilter(rows, 'textbookLessonTypeCd', 'PERIOD');


                // PC LMB 리스트 넣기
                $.each(rows, function(idx, item) {

                    let $tr = screen.v.contentsHtml.clone();
                    $tr.data('tlSeq',item.textbookLessonSeq);
                    $tr.find('td:eq(0)').text( '[' + item.textbookLessonPeriodNum + '차시] ' + item.textbookLessonPeriodName);
                    $tr.find('td:eq(1)').text( $text.isEmpty(item.textbookLessonPageMainInfo) ? '-' : item.textbookLessonPageMainInfo.split('|')[1]);
                    $tr.find('td:eq(2)').text( $text.isEmpty(item.textbookLessonPageSubInfo) ? '-' : item.textbookLessonPageSubInfo.split('|')[1]);

                    let $trMobile = screen.v.contentsHtmlMobile.clone();
                    $trMobile.data('tlSeq',item.textbookLessonSeq);
                    $trMobile.find('.row:eq(0) .txt').text( '[' + item.textbookLessonPeriodNum + '차시] ' + item.textbookLessonPeriodName);
                    $trMobile.find('.row:eq(1) .txt').text( $text.isEmpty(item.textbookLessonPageMainInfo) ? '-' : item.textbookLessonPageMainInfo.split('|')[1]);
                    $trMobile.find('.row:eq(2) .txt').text( $text.isEmpty(item.textbookLessonPageSubInfo) ? '-' : item.textbookLessonPageSubInfo.split('|')[1]);

					// 바로보기 링크복사 버튼 제어
					if(item.smartPptCnt>0){
                        $tr.find('.btn-view, .btn-link').addClass('on');
                        $trMobile.find('.btn-view, .btn-link').addClass('on');
                    } else {
                        $tr.find('.btn-view, .btn-link').removeClass('on');
                        $trMobile.find('.btn-view, .btn-link').removeClass('on');
                    }

                    // 추가
                    $('.pc-only .block-contents').append($tr);
                    $('.mobile-only .block-contents').append($trMobile);
                });

                // 테이블 head 변경
                if(screen.v.courseData == 'MA'){
                    $('.txtMain').text('수학 교과서');
                    $('.txtSub').text('수학 익힘');
                } else if(screen.v.courseData == 'SC'){
                    $('.txtMain').text('과학 교과서');
                    $('.txtSub').text('실험 관찰');
                } else {
                    $('.txtMain').text('국어 교과서');
                    $('.txtSub').text('국어 활동');
                }

            },

            // 사회  컨텐츠 내용 변경
            setContentsSo: function() {

				let rows = $objData.getListFilter(screen.v.item, 'textbookLessonUnitHighName', screen.v.unitData.unitName);

				// 목록 초기화
				$('.cont.cont-so .pc-only').remove();
                //$('.mobile-only .block-contents-so .data-box').remove();

				let $divContSo;
/*				let temp = [];
				$.each(rows, function(i,item){
					if(item.textbookSeq != 12) temp.push(item);
				})
				rows = temp;*/

				$.each(rows, function(i,item){

					// high
					if(item.textbookLessonTypeCd == 'UNIT_HIGH') {

						// 최상단 텍스트 변경
						$('.txtTitleUnitHigh').text(screen.v.unitData.textbookLessonUnitHighNum+'. '+screen.v.unitData.textbookLessonUnitHighName);

					// mid
					}else if(item.textbookLessonTypeCd == 'UNIT_MID') {

						// 판 만들기
						$divContSo = screen.v.contSoHtml.clone();
						if(item.textbookLessonUnitMidNum == null || item.textbookLessonUnitMidNum == 'undefined')
							$divContSo.find('.txtTitleUnitMid').text(item.textbookLessonUnitMidName);
						else
							$divContSo.find('.txtTitleUnitMid').text('('+item.textbookLessonUnitMidNum+') '+item.textbookLessonUnitMidName);
						$divContSo.find('.block-contents-so tr').remove();
						$('.cont.cont-so').append($divContSo);

					// period
					} else if(item.textbookLessonTypeCd == 'PERIOD'){

						// 판에 데이터 넣기 / 마지막 판의 맨 뒤에
	                    let $tr = screen.v.contentsHtml.clone();
	                    $tr.data('tlSeq',item.textbookLessonSeq);
	                    $tr.find('td:eq(0)').text( '[' + item.textbookLessonPeriodNum + '차시] ' + item.textbookLessonPeriodName);
	                    $tr.find('td:eq(1)').text( $text.isEmpty(item.textbookLessonPageMainInfo) ? '-' : item.textbookLessonPageMainInfo.split('|')[1]);
	                    $tr.find('td:eq(2)').remove();

	                    if(item.smartPptCnt>0){
	                        $tr.find('.btn-view, .btn-link').addClass('on');
	                    } else {
                            $tr.find('.btn-view, .btn-link').removeClass('on');
	                    }

						// 추가
                    	$('.cont-so .pc-only:last .block-contents-so:last').append($tr);
					}
				})
            },

            // 학년,학기 선택시 과목 세팅
            courseFilter: function(){

				/*
					23.2.22 https://mteacher.dooray.com/project/posts/3477547223561211811

					특정 학년 2학기 중 일부 과목의 단원 콘텐츠 미수급으로 인해 해당 과목 화면상 미노출하도록 추가 처리한 부분임.
					2학기 콘텐츠 수급 및 적용된다면 screen.f.courseFilter() 내의 모든 코드를 주석처리하고
					최하단 screen.c.getLessonList(); 만 활성화 시키면 학년/학기/과목 상관없이 클릭하면 데이터 조회/정리됨.
				*/

				let grade = screen.v.gradeData;
				let term = screen.v.termData;

				$('.aside .block-course li').removeClass('d-none');
                $('.aside-mobile .block-course li').removeClass('d-none');

				//$('.aside .block-course li:first').addClass('on');
				$('.aside-mobile .block-course li:first').addClass('on');
				$('.aside .block-course li:first').find('a').click();

                //screen.c.getLessonList();
            },

            // 학년 클릭
            clickGrade: function(){

                screen.v.gradeData = $(this).data('dd');
                $('.txtTitleGrade').text(Number($(this).data('dd'))+'학년');

				$(this).parents('.block-grade').find('.item').removeClass('on');
				$(this).parent().addClass('on');

				$('.aside-mobile .block-grade').find('.grade_' + $(this).data('dd')).addClass('on');

 				window.localStorage.setItem('pageTextbookEbookGrade', screen.v.gradeData);

                // 학기
                //screen.f.setTerm();
                //screen.c.getLessonList();
                screen.f.courseFilter();
            },

            // 학년 클릭(모바일)
            clickMobileGrade: function() {

                $('.mobile-only .block-grade').find('li').removeClass('on');
                $(this).parent().addClass('on');

                // pc 클릭
                $('.aside .block-grade').find('.grade_' + $(this).data('dd')).trigger('click');
            },

            // 학기 클릭
            clickTerm: function() {

                // 학기 선택값 넣기
                screen.v.termData = $(this).data('dd');

                $(this).parents('.block-term').find('.item').removeClass('on');
                $(this).parent().addClass('on');

                $('.aside-mobile .block-term').find('.term_' + $(this).data('dd')).addClass('on');

                window.localStorage.setItem('pageTextbookEbookTerm', screen.v.termData);

                // 과목
                //screen.f.setCourse();
                //screen.c.getLessonList();
                screen.f.courseFilter();
            },

            // 학기 변경(모바일)
            clickMobileTerm: function() {

                $('.mobile-only .block-term').find('li').removeClass('on');
                $(this).parents().addClass('on');

                // pc 클릭
                $('.aside .block-term').find('.term_' + $(this).data('dd')).trigger('click');

            },

            // 과목 클릭
            clickCourse: function() {

                // 과목 선택값 넣기
                screen.v.courseData = $(this).data('dd');

                $(this).parents('.block-course').find('.item').removeClass('on');
                $(this).parent().addClass('on');

                $('.aside-mobile .block-course').find('.course_' + $(this).data('dd')).addClass('on');

                window.localStorage.setItem('pageTextbookEbookCourse', screen.v.courseData);

                // 단원 목록 가져오기
                screen.c.getLessonList();
            },

            // 과목 변경(모바일)
            clickMobileCourse: function() {

                $('.mobile-only .block-course').find('li').removeClass('on');
                $(this).parents().addClass('on');

                // pc 클릭
                $('.aside .block-course').find('.course_' + $(this).data('dd')).trigger('click');

            },

            // 단원 클릭
            clickUnit: function() {

                // 과목 선택값 넣기
                screen.v.unitData = $(this).data('dd');

                $(this).parents('.block-unit').find('.item').removeClass('on');
                $(this).parent().addClass('on');

                // 컨텐츠
                screen.f.setContents();
            },

            // 단원 클릭 (모바일)
            clickMobileUnit: function(){

                // pc 클릭
                $('.aside .block-unit').find('.tblSeq_' + $(this).val()).trigger('click');

            },

            // 사회 단원 클릭
            clickUnitSo: function() {

                // 과목 선택값 넣기
                screen.v.unitData = $(this).data('dd');

                $(this).parents('.block-unit-so').find('.unit-mid').removeClass('on');
                $(this).parent().addClass('on');

                // 사회 컨텐츠
                screen.f.setContentsSo();
            },

            // 사회 대단원 클릭 (모바일)
            clickMobileUnitHigh: function(){

                let rows = $objData.getListFilter(screen.v.item, 'textbookLessonUnitHighNum', $(this).val());

/*				let temp = [];
				$.each(rows, function(i,item){
					if(item.textbookSeq != 12 && item.textbookSeq != 20 &&
						item.textbookSeq != 27 && item.textbookSeq != 34 ) temp.push(item);
				})
				rows = temp;*/

                // 콤보 셋팅
                //$combo.bind(rows, '#selUnitMid', '', '', 'unitNumName', 'textbookLessonSeq');

                $('.mobile-only .block-contents-so .h4-data').remove();
                $('.mobile-only .block-contents-so .data-box').remove();

				$.each(rows, function(i,item){

					// high
					if(item.textbookLessonTypeCd == 'UNIT_HIGH') {

						// 최상단 텍스트 변경
						$('.txtTitleUnitHigh').text(item.textbookLessonUnitHighNum+'. '+item.textbookLessonUnitHighName);

					// mid
					}else if(item.textbookLessonTypeCd == 'UNIT_MID') {

						// 판 만들기
						$mobileMidTitle = screen.v.mobileMidTitleHtml.clone();
						if(item.textbookLessonUnitMidNum == null || item.textbookLessonUnitMidNum == 'undefined')
							$mobileMidTitle.text(item.textbookLessonUnitMidName);
						else
							$mobileMidTitle.text('('+item.textbookLessonUnitMidNum+') '+item.textbookLessonUnitMidName);
						$('.mobile-only .block-contents-so').append($mobileMidTitle);

					// period
					} else if(item.textbookLessonTypeCd == 'PERIOD'){

						// 판에 데이터 넣기 / 마지막 판의 맨 뒤에
		                let $trMobile = screen.v.contentsSoHtmlMobile.clone();
		                $trMobile.data('tlSeq',item.textbookLessonSeq);
		                $trMobile.find('.row:eq(0) .txt').text( '[' + item.textbookLessonPeriodNum + '차시] ' + item.textbookLessonPeriodName);
		                $trMobile.find('.row:eq(1) .txt').text( $text.isEmpty(item.textbookLessonPageMainInfo) ? '-' : item.textbookLessonPageMainInfo.split('|')[1]);

	                    if(item.smartPptCnt>0){
	                        $trMobile.find('.btn-view, .btn-link').addClass('on');
	                    } else {
                            $trMobile.find('.btn-view, .btn-link').removeClass('on');
	                    }


						// 추가
		                $('.mobile-only .data-list.block-contents-so').append($trMobile);

					}

				})

            },

            // 사회 중단원 클릭 (모바일)
            clickMobileUnitMid: function(){

                // pc 클릭
                $('.aside .block-unit-so').find('.tblSeq_' + $(this).val()).trigger('click');

            },

            // 바로보기
            view: function(){

                let tlSeq = $(this).closest('.tlSeq').data('tlSeq');

                if (tlSeq == '-') {

					// 로그인
					screenUI.f.loginConfirm();

				} else if (tlSeq == '--') {

					// 선생님 회원만
					screenUI.f.loginTeacherOnlyAlert();

				} else if (!$text.isEmpty(tlSeq)) {

                    // 미리보기
                    window.open('/ExtraTen/SmartPptDetail.mrn?seq='+tlSeq);
				}
            },

            // 링크
            link: function(){

                let tlSeq = $(this).closest('.tlSeq').data('tlSeq');

                if (tlSeq == '-') {

					// 로그인
					screenUI.f.loginConfirm();

				} else if (tlSeq == '--') {

					// 선생님 회원만
					screenUI.f.loginTeacherOnlyAlert();

				} else if (!$text.isEmpty(tlSeq)) {

                    // 미리보기
                    // window.open('/ExtraTen/SmartPptDetail.mrn?seq='+tlSeq);
				}
            },

            // 준비중 얼럿
            readyAlert: function(){
                $msg.alert('2학기 수업자료는 준비중입니다.');
            },
		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

		    // 학년 클릭
            $(document).on('click', '.aside .block-grade .item a', screen.f.clickGrade);

            // 학년 클릭(모바일)
            $(document).on('click', '.aside-mobile .block-grade li a', screen.f.clickMobileGrade);

		    // 학기 클릭
            $(document).on('click', '.aside .block-term .item a', screen.f.clickTerm);

            // 학기 클릭(모바일)
            $(document).on('click', '.aside-mobile .block-term li a', screen.f.clickMobileTerm);

		    // 과목 클릭
            $(document).on('click', '.aside .block-course .item a', screen.f.clickCourse);

            // 과목 (모바일)
            $(document).on('click', '.aside-mobile .block-course li a', screen.f.clickMobileCourse);

		    // 단원 클릭
            $(document).on('click', '.aside .block-unit .item a, .aside .block-unit-so .item a', screen.f.clickUnit);

            // 단원 클릭(모바일)
            $(document).on('change', '#selUnit', screen.f.clickMobileUnit);

		    // 사회 단원 클릭
            //$(document).on('click', '.aside .block-unit-so .unit-mid a', screen.f.clickUnitSo);
            $(document).on('click', '.aside .block-unit-so a', screen.f.clickUnitSo);

            // 사회 단원 클릭(모바일)
            $(document).on('change', '#selUnitHigh', screen.f.clickMobileUnitHigh);

            // 사회 중단원 클릭(모바일)
            $(document).on('change', '#selUnitMid', screen.f.clickMobileUnitMid);

            // 바로보기
            $(document).on('click', '.btn-view.on', screen.f.view);

			// 링크
            $(document).on('click', '.btn-link.on', screen.f.link);

            // 준비중 얼럿
            $(document).on('click', '.btn-ready', screen.f.readyAlert);

			// 링크복사
            new ClipboardJS('.btn-link.on', {

                text: function(trigger) {

					if($text.isEmpty($('body').data('useridx'))) return;
                    return  document.location.origin+'/ExtraTen/SmartPptDetail.mrn?seq='+$(trigger).closest('.tlSeq').data('tlSeq');
                }
            }).on('success', function (e) {

				if($(e.trigger).hasClass('btn-link-mobile')) {
	                $msg.alert(lng.msg.copyLinkMobile);
				} else {
	                $msg.alert(lng.msg.copyLink);
				}
            });

/*			// 링크복사(모바일)
            new ClipboardJS('.btn-link-mobile', {

                text: function(trigger) {

                    return  document.location.origin+'/ExtraTen/SmartPptDetail.mrn?seq='+$(trigger).closest('.tlSeq').data('tlSeq');
                }
            }).on('success', function () {
                $msg.alert(lng.msg.copyLinkMobile);
            });*/

			//toggle
            $(document).on('click', '.dep-menu.toggle > li > a',
                function(e) {
                    var atc = $('.dep-menu.toggle > li');
                        atc.addClass('hid');
                    var atcm = $(this).parents('.dep-menu.toggle > li:first');
                    if(atcm.hasClass('hid')) {
                        atc.addClass('hid').removeClass('on').children('.dep-menu2').slideUp(200);
                        atcm.removeClass('hid').addClass('on').children('.dep-menu2').slideDown(200);
                    } else {
                        atcm.removeClass('on').addClass('hid').children('.dep-menu2').slideUp(200);
                    }
                    return false;
		    });

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			// window.localStorage.removeItem('pageTextbookEbookTerm');
			// window.localStorage.removeItem('pageTextbookEbookGrade');

			// html unit 복제
			screen.v.unitHtml = $('.aside .block-unit li.item').clone();

			// html unit so 복제
			screen.v.unitSoHtml = $('.aside .block-unit-so li.item').clone();

			// html unit so2 복제
			screen.v.unitSoHtml2 = $('.aside .block-unit-so li.item .dep-menu2 li').clone();

			// html contents 복제
			screen.v.contentsHtml = $('.pc-only .block-contents tr').clone();

            // html contents 복제 - mobile
            screen.v.contentsHtmlMobile = $('.mobile-only .block-contents .data-box').clone();

			// html contents-so 복제
			screen.v.contentsSoHtml = $('.pc-only .block-contents-so tr').clone();

            // html contents-so 복제 - mobile
            screen.v.contentsSoHtmlMobile = $('.mobile-only .block-contents-so .data-box').clone();

            // html cont-so 복제
            screen.v.contSoHtml = $('.cont-so .pc-only').clone();

            // html mid title 복제 - mobile
            screen.v.mobileMidTitleHtml = $('.mobile-only .h4-data').clone();

			// Event 정의 실행
			screen.event();

            // 학년 세팅
            screen.f.setGrade();
            screen.f.setTerm();
            screen.f.setCourse();
            screen.c.getLessonList();
		}
	};

	screen.init();
	window.screen = screen;
});