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
			, gradeHtml: null
			, gradeHtmlMobile: null
			, gradeData: null
			, termHtml: null
			, termHtmlMobile: null
			, termData: null
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
					url: '/ExtraTen/GetTextbookEbookJson.mrn',
					data: null,
					success: function(res) {
						if (!!res.resultData) {
							screen.v.item = res.resultData;

							// 학년 세팅
							screen.f.setGrade();

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

            setGrade: function() {

				// level2(학년) 초기화
				$('.aside .block-grade .item').remove();
				$('.aside-mobile .block-grade li').remove();

                let rows = $objData.getSetFilter(screen.v.item, 'textbookCurriculumGradeCd');

                // PC LMB 리스트 넣기
                $.each(rows, function(idx, item) {

					let $li = screen.v.gradeHtml.clone();
					$li.find('a').addClass('grade_' + item);	// class
					$li.find('a').data('dd', item);					// data
					$li.find('a').text( Number(item)+'학년');					// name
					$('.aside .block-grade').append($li);

					let $liMobile = screen.v.gradeHtmlMobile.clone();
					$liMobile.addClass('grade_' + item);	// class
					$liMobile.find('a').data('dd', item);				// data
					$liMobile.find('a').text( Number(item)+'학년');									// name
					$('.aside-mobile .block-grade').append($liMobile);

                });



                let grade = window.localStorage.getItem('pageTextbookEbookGrade');
                if($text.isEmpty(grade)) {
					// 첫번째 클릭
					$('.aside .block-grade li:first a').trigger('click');
				} else {
					// 해당 학년 클릭
					$('.aside .block-grade').find('.grade_' + grade).trigger('click');
				}
            },

            // 학기 변경
            setTerm: function() {
                // 학기 초기화
                $('.aside .block-term .item').remove();
                $('.aside-mobile .block-term li').remove();

                let rows = $objData.getSetFilter(screen.v.item, 'textbookCurriculumTermCd').sort();

                // PC LMB 리스트 넣기
                $.each(rows, function(idx, item) {

                    if( item != '00' ){

                        let $li = screen.v.termHtml.clone();
                        $li.find('a').addClass('term_' + item);	// class
                        $li.find('a').data('dd', item);					// data
                        $li.find('a').text( Number(item)+'학기');					// name
                        $('.aside .block-term').append($li);

                        let $liMobile = screen.v.termHtmlMobile.clone();
                        $liMobile.addClass('term_' + item);	// class
                        $liMobile.find('a').data('dd', item);				// data
                        $liMobile.find('a').text( Number(item)+'학기');									// name
                        $('.aside-mobile .block-term').append($liMobile);
                    }
                });

                let term = window.localStorage.getItem('pageTextbookEbookTerm');
				if($text.isEmpty(term)){
					let month = new Date().getMonth()+1; // 자동 학기 전환
					if(month >= 2 && month <= 7){
						term = '01';
					} else {
						term = '02';
					}
				}
				$('.aside .block-term li').find('a[class=term_'+term+']').trigger('click');

			},

            // 컨텐츠 내용 변경
            setContents: function() {
                // 목록 초기화
                $('.block-contents ul li').remove();
                let rows = $objData.getListFilter(screen.v.item, 'textbookCurriculumGradeCd', screen.v.gradeData);

                 rows = $objData.getListFilter2(rows, 'textbookCurriculumTermCd', '00', 'textbookCurriculumTermCd', screen.v.termData);

                // PC 목록 리스트 넣기
                $.each(rows, function(idx, item) {

                    let $li = screen.v.contentsHtml.clone();
                    $li.find('.subject').text(item.courseNm);
                    $li.find('img').attr('src', $('input[name=apiHostCms]').val() + '/cms/files/view/' +  item.textbookThumbnailFileId);
                    $li.find('img').attr('alt', item.courseNm);
                    $li.find('.btn-group').data('url', item.ebookUrl);

                    // 추가
                    $('.block-contents').find('ul').append($li);
                });

            },

            // 학년 클릭
            clickGrade: function(){

                screen.v.gradeData = $(this).data('dd');
                $('.txtTitleGrade').text(Number($(this).data('dd'))+'학년');

				window.localStorage.setItem('pageTextbookEbookGrade', $(this).data('dd'));

				$(this).parents('.block-grade').find('.item').removeClass('on');
				$(this).parent().addClass('on');

                $('.aside-mobile .block-grade').find('li').removeClass('on');
				$('.aside-mobile .block-grade').find('.grade_' + $(this).data('dd')).addClass('on');

                // 학기
                screen.f.setTerm();
            },

            // 학년 클릭(모바일)
            clickMobileGrade: function() {

                $('.mobile-only .block-grade').find('li').removeClass('on');
                $(this).parents().addClass('on');

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

                // 컨텐츠
                screen.f.setContents();
            },

            // 학기 변경(모바일)
            clickMobileTerm: function() {

                $('.mobile-only .block-term').find('li').removeClass('on');
                $(this).parents().addClass('on');

                // pc 클릭
                $('.aside .block-term').find('.term_' + $(this).data('dd')).trigger('click');

            },

            // 바로보기
            view: function(){
                let url = $(this).parent().data('url');

                if (url == '-') {

					// 로그인
					screenUI.f.loginConfirm();

				} else if (url == '--') {

					// 선생님 회원만
					screenUI.f.loginTeacherOnlyAlert();

				} else if (!$text.isEmpty(url)) {

                    // 미리보기
                    window.open(url);
				}
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

            // 바로보기
            $(document).on('click', '.btn-view', screen.f.view);

			// 링크복사
            new ClipboardJS('.btn-copy.on', {

                text: function(trigger) {

                    return $(trigger).parent().data('url');
                }

            }).on('success', function () {

				let w = $(window).width(); // 모바일 여부 체크(모바일 태그가 없어 화면 너비로 구분)

				// 링크가 복사되었습니다. Ctrl+V를 눌러 붙여 넣어 주세요.
				if(w > 900)
	                $msg.alert(lng.msg.copyLink);

				// 링크가 복사되었습니다.
	            else
	                $msg.alert(lng.msg.copyLinkMobile);
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

			// html grade 복제
			screen.v.gradeHtml = $('.aside .block-grade li.item').clone();

            // html grade 복제 - mobile
            screen.v.gradeHtmlMobile = $('.aside-mobile .block-grade li').clone();

            // html term 복제
			screen.v.termHtml = $('.aside .block-term li').clone();

            // html term 복제 - mobile
            screen.v.termHtmlMobile = $('.aside-mobile .block-term li').clone();

			// html contents 복제
			screen.v.contentsHtml = $('.block-contents ul li').clone();

			// Event 정의 실행
			screen.event();

			// 목록 가져오기
			screen.c.getList();

		}
	};

	screen.init();
	window.screen = screen;
});