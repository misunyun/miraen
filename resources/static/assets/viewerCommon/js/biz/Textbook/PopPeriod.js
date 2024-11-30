let pg;

$(function() {

	pg = {

		/**
		 * 내부  전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			textbook: null
			, textbookList: null
			, originalList : null               /* 기본 학습 목차 */
			, eduList: null                     /* 단원 차시 정보 */
			, myDataEduList: null         /* 내 자료 단원 차시 정보 */
			, recommendList: null
			, tab1List: null        /* 멀티미디어 */
			, tab2List: null         /* 수업 자료 */
			, tab3List: null         /* 평가 자료 */
			, tab4List: null         /* 5분 놀이 */
			, tab5List: null         /* 연구 자료 */
			, tab6List: null         /* 내 자료 */
			, originalYn : null       /* 원본 여부 */
			, tab_all_page: 4
			, tab_page: 12
			, draggable_options: null
			, draggable_data: null
			, saveItems: null
			, startSeq: null
			, endSeq: null
			, editing : false        /* 학습목차 편집중 */
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

            //교과서 차시별 추천자료
		    getRecommendContents: function(){

				const options = {
					url: '/contents/textbook/getRecommendContentList.ax',
					data: {
					    textbookLessonSeq :$cmm.getUrlParams('playlist')
                    },
					success: function(res) {
                        pg.v.recommendList = res.rows;
                        $('ul.thumb-type li').remove();

                        $('.recommend-more .tot').text(res.rows.length);

                        // 추천 자료 목록 추가
                        pg.f.appendRecommendList();

                        if(res.rows.length>0){
                            $('ul.thumb-type').removeClass('d-none');
                            $('ul.thumb-type').prev('h4').removeClass('d-none');
                        } else {
                            $('ul.thumb-type').addClass('d-none');
                            $('ul.thumb-type').prev('h4').addClass('d-none');
                        }

					}
				};

				$cmm.ajax(options);
		    },

            // tab1 멀티미디어
		    getRecommendContentsTab1: function(tab){

				const options = {
					url: '/contents/textbook/recommendContentTab1.ax',
					data: {
					    unitHighSeq : pg.v.textbook.textbookLessonUnitHighSeq,
					    unitMidSeq: pg.v.textbook.textbookLessonUnitMidSeq,
					    textbookLessonSeq: pg.v.textbook.textbookLessonSeq
                    },
					success: function(res) {
                        pg.v.tab1List = res.rows;

                        if(tab=='all'){
                            // 자료 없으면 전체 탭 목록에서 숨기고, 해당 탭도 숨기기
                            if(res.rows.length == 0){
                                $('.type1').addClass('d-none');
                                return;
                            }

                            $('.type1').removeClass('d-none');

                            $('ul.type1 li').remove();

                            $('.type1-more .tot').text(res.rows.length);

                            // 전체 탭 - 멀티미디어 자료 추가
                            pg.f.appendTab0Type1List();

                            // 멀티미디어 탭 2depth 버튼 만들기
                            pg.f.make2depthBtn($('#study-tab1'), pg.v.tab1List);
                        } else {
                            $('#study-tab1 .mydata-tab a:eq(0)').click();
                        }

					}
				};

				$cmm.ajax(options);
		    },

            // tab2 수업 자료
		    getRecommendContentsTab2: function(tab){

				const options = {
					url: '/contents/textbook/recommendContentTab2.ax',
					data: {
					    unitHighSeq : pg.v.textbook.textbookLessonUnitHighSeq,
					    unitMidSeq: pg.v.textbook.textbookLessonUnitMidSeq,
					    textbookLessonSeq: pg.v.textbook.textbookLessonSeq
                    },
					success: function(res) {
                        pg.v.tab2List = res.rows;

                        if(tab=='all'){
                            // 자료 없으면 전체 탭 목록에서 숨기고, 해당 탭도 숨기기
                            if(res.rows.length == 0){
                                $('.type2').addClass('d-none');
                                return;
                            }

                            $('.type2').removeClass('d-none');

                            $('ul.type2 li').remove();

                            $('.type2-more .tot').text(res.rows.length);

                            // 전체 탭 - 수업 자료 추가
                            pg.f.appendTab0Type2List();

                            // 수업 자료 탭 2depth 버튼 만들기
                            pg.f.make2depthBtn($('#study-tab2'), pg.v.tab2List);
                        } else {
                            $('#study-tab2 .mydata-tab a:eq(0)').click();
                        }

					}
				};

				$cmm.ajax(options);
		    },

            // tab3 평가 자료
		    getRecommendContentsTab3: function(tab){

				const options = {
					url: '/contents/textbook/recommendContentTab3.ax',
					data: {
					    unitHighSeq : pg.v.textbook.textbookLessonUnitHighSeq,
					    unitMidSeq: pg.v.textbook.textbookLessonUnitMidSeq,
					    textbookLessonSeq: pg.v.textbook.textbookLessonSeq
                    },
					success: function(res) {
                        pg.v.tab3List = res.rows;

                        if(tab=='all'){
                            // 자료 없으면 전체 탭 목록에서 숨기고, 해당 탭도 숨기기
                            if(res.rows.length == 0){
                                $('.type3').addClass('d-none');
                                return;
                            }

                            $('.type3').removeClass('d-none');

                            $('ul.type3 li').remove();

                            $('.type3-more .tot').text(res.rows.length);

                            // 전체 탭 - 평가 자료 추가
                            pg.f.appendTab0Type3List();

                            // 평가 자료 탭 2depth 버튼 만들기
                            pg.f.make2depthBtn($('#study-tab3'), pg.v.tab3List);

                        } else {
                            $('#study-tab3 .mydata-tab a:eq(0)').click();
                        }

					}
				};

				$cmm.ajax(options);
		    },

            // tab4 5분 놀이
		    getRecommendContentsTab4: function(tab){

				const options = {
					url: '/contents/textbook/recommendContentTab4.ax',
					data: {
					    unitHighSeq : pg.v.textbook.textbookLessonUnitHighSeq,
					    unitMidSeq: pg.v.textbook.textbookLessonUnitMidSeq,
					    textbookLessonSeq: pg.v.textbook.textbookLessonSeq
                    },
					success: function(res) {
                        pg.v.tab4List = res.rows;

                        if(tab=='all'){
                            // 자료 없으면 전체 탭 목록에서 숨기고, 해당 탭도 숨기기
                            if(res.rows.length == 0){
                                $('.type4').addClass('d-none');
                                return;
                            }

                            $('.type4').removeClass('d-none');

                            $('ul.type4 li').remove();

                            $('.type4-more .tot').text(res.rows.length);

                            // 전체 탭 - 5분 놀이 추가
                            pg.f.appendTab0Type4List();

                            // 5분 놀이 탭 2depth 버튼 만들기
                            pg.f.make2depthBtn($('#study-tab4'), pg.v.tab4List);

                        } else {
                            $('#study-tab4 .mydata-tab a:eq(0)').click();
                        }
					}
				};

				$cmm.ajax(options);
		    },

            // tab5 연구 자료
		    getRecommendContentsTab5: function(tab){

				const options = {
					url: '/contents/textbook/recommendContentTab5.ax',
					data: {
					    unitHighSeq : pg.v.textbook.textbookLessonUnitHighSeq,
					    unitMidSeq: pg.v.textbook.textbookLessonUnitMidSeq,
					    textbookLessonSeq: pg.v.textbook.textbookLessonSeq
                    },
					success: function(res) {
                        pg.v.tab5List = res.rows;

                        if(tab=='all'){
                            // 자료 없으면 전체 탭 목록에서 숨기고, 해당 탭도 숨기기
                            if(res.rows.length == 0){
                                $('.type5').addClass('d-none');
                                return;
                            }

                            $('.type5').removeClass('d-none');

                            $('ul.type5 li').remove();

                            $('.type5-more .tot').text(res.rows.length);

                            // 전체 탭 - 연구 자료 추가
                            pg.f.appendTab0Type5List();

                            // 연구 자료 탭 2depth 버튼 만들기
                            pg.f.make2depthBtn($('#study-tab5'), pg.v.tab5List);

                        } else {
                            $('#study-tab5 .mydata-tab a:eq(0)').click();
                        }
					}
				};

				$cmm.ajax(options);
		    },

            // tab6 내 자료 - 업로드 자료
		    getLessonRecommendContentTabMyData: function(){

				const options = {
					url: '/contents/textbook/recommendContentTabMyData.ax',
					data: {
					    textbookSeq: pg.v.textbook.textbookSeq,
					    unitHighSeq : pg.v.textbook.textbookLessonUnitHighSeq,
					    unitMidSeq: pg.v.textbook.textbookLessonUnitMidSeq,
					    textbookLessonSeq: pg.v.textbook.textbookLessonSeq
                    },
					success: function(res) {

                        pg.v.tab6List = res.rows;

                        $('.type6-more .tot').text(res.rows.length);

                        // tab6 내 자료 탭 목록
                        pg.f.appendTab6List();

					}
				};

				$cmm.ajax(options);
		    },

            // tab6 내 자료 - 스크랩 자료
		    getLessonRecommendContentTabMyScrap: function(){

				const options = {
					url: '/contents/textbook/recommendContentTabMyScrap.ax',
					data: {
					    textbookSeq: pg.v.textbook.textbookSeq,
					    unitHighSeq : pg.v.textbook.textbookLessonUnitHighSeq,
					    unitMidSeq: pg.v.textbook.textbookLessonUnitMidSeq,
					    textbookLessonSeq: pg.v.textbook.textbookLessonSeq
                    },
					success: function(res) {

                        pg.v.tab6List = res.rows;

                        $('.type6-more .tot').text(res.rows.length);

                        // tab6 내 자료 탭 목록
                        pg.f.appendTab6List();

					}
				};

				$cmm.ajax(options);
		    },

		    //학습 목차
		    getViewerContentIndexList: function(){

				const options = {
					url: '/contents/textbook/getViewerContentIndexList.ax',
					data: {
					    textbookLessonSeq : $cmm.getUrlParams('playlist')
                    },
					success: function(res) {
						$("ul.cont-list li.temp_li").remove();
                        if(res.rows.length == 0){
                            $('ul.cont-list ul.stepList').empty();
                            return false;
                        }

					    pg.v.originalYn = res.rows[0].originalYn;

                        // 기본 목차 보기 버튼
                        if(pg.v.originalYn=='N'){
                            $('.btn-default-view').removeClass('d-none');
                            $('.btn-saved').addClass('d-none');
                        } else {
                            $('.btn-default-view').addClass('d-none');
                            $('.btn-saved').addClass('d-none');
                        }

                        // 학습 목차 세팅
                        pg.f.makeStepList(res.rows);

					}
				};

				$cmm.ajax(options);
		    },

		    //기본 학습 목차
		    getViewerSmartpptIndexDefaultList: function(){

				const options = {
					url: '/contents/textbook/getViewerSmartpptIndexDefaultList.ax',
					data: {
					    textbookLessonSeq : $cmm.getUrlParams('playlist')
                    },
					success: function(res) {

					    pg.v.originalList = res.rows;

                        // 저장된 학습 목차
                        pg.c.getViewerContentIndexList();
					}
				};

				$cmm.ajax(options);
		    },

		    //학습 목차 저장
		    saveViewerContentIndexList: function(){
                pg.v.saveItems = [];
                $.each($('ul.cont-list ul.stepList li:not(.nodata)'), function(idx, item) {

                    let data = {};
                    data.sortNo = idx+1;
                    data.stepBlockCSeq =$(item).parent().data('seq');
                    data.typeCSeq = $(item).data('item').typeCSeq;
                    data.textbookLessonSubjectSeq = $(item).data('item').textbookLessonSubjectSeq;
                    data.extraSeq = $(item).data('item').extraSeq;
                    data.contentsTextbookUnitSeq = $(item).data('item').contentsTextbookUnitSeq;
                    data.contentsTextbookPeriodSeq = $(item).data('item').contentsTextbookPeriodSeq;
                    data.curriculumSeq = $(item).data('item').curriculumSeq;
                    data.soSeq = $(item).data('item').soSeq;
                    data.myDataSeq = $(item).data('item').myDataSeq;
                    pg.v.saveItems.push(data);
                });

				const options = {
					url: '/contents/textbook/saveViewerContentIndexList.ax',
					data: {
					    textbookLessonSeq : $cmm.getUrlParams('playlist'),
					    items:  JSON.stringify(pg.v.saveItems)
                    },
					success: function(res) {

                        $msg.alert('저장이 완료되었습니다.');

                        // 편집 저장 버튼 가리기
                         pg.v.editing = false;
                        $('.edit-block').addClass('d-none');
                        $('.cont-list').css('padding-bottom', '15px');

                        // 기본 목차 보기 버튼
                        $('.btn-default-view').removeClass('d-none');
                        $('.btn-saved').addClass('d-none');

                        // 저장 학습 목차
                        pg.c.getViewerContentIndexList();
					}
				};

				$cmm.ajax(options);

		    },

		    //교과서 기본 정보
		    getTextbookBase: function(){

				const options = {
					url: '/textbook/base.ax',
					data: null,
					success: function(res) {
					    pg.v.textbookList = res.rows;

                        //교과서 차시 기본 정보
                        pg.c.getTextbookInfoByPeriod();

					}
				};

				$cmm.ajax(options);
		    },

		    //교과서 차시 기본 정보
		    getTextbookInfoByPeriod: function(){

				const options = {
					url: '/textbook/textbookInfoByPeriod.ax',
					data: {
					    periodSeq: $cmm.getUrlParams('playlist')
                    },
					success: function(res) {

					    pg.v.textbook = res.row;

                        // 저장,취소 버튼 가리기
                        pg.v.editing = false;
                        $('.edit-block').addClass('d-none');
                        $('.cont-list').css('padding-bottom', '15px');

                        // smart PPT 숨김 체크
                        if(pg.v.textbook.smartpptButtonHiddenYn == 'Y'){
                            $('.study-cont .list-wrap').addClass('d-none');
                            $('.btn-start').addClass('d-none');
                            $msg.alert('수업자료 준비중입니다.');
                        } else {
                            $('.study-cont .list-wrap').removeClass('d-none');
                            $('.btn-start').removeClass('d-none');
                        }

                        // 기본 학습 목차
                        pg.c.getViewerSmartpptIndexDefaultList();

					    // 다른 차시 정보 세팅
					    pg.f.setLessonInfo();

                        // 과목별 바로가기 링크 세팅
                        pg.f.setLinkGroup();

                        // 수업 보충 자료 전체
                        $('.tabs li:eq(0)').click();

					}
				};

				$cmm.ajax(options);
		    },

		    //교과서별  단원 , 차시
		    getTextbookEduList: function(){
                let textbookSeq = $('ul.subject li.selected').data('seq');

				const options = {
					url: '/textbook/eduList.ax',
					data: {textbookSeq: textbookSeq},
					success: function(res) {

                        pg.v.eduList = res.rows;
                        let unitHighSeq = null;
                        $('ul.unit li').remove();
                        $.each(res.rows, function(idx, item) {
                            /* 대단원 */
                            if(unitHighSeq != item.textbookLessonSeqHigh){
                                unitHighSeq = item.textbookLessonSeqHigh;
                                let $liUnit = pg.v.contentsHtmlSubject.clone();
                                let unitHighTit = '';
                                if ( !$text.isEmpty(item.textbookLessonUnitHighNum)) {
                                    unitHighTit = item.textbookLessonUnitHighNum + '. ';
                                }
                                unitHighTit += item.textbookLessonUnitHighName;
                                $liUnit.find('a').text(unitHighTit);
                                $liUnit.data('seq',item.textbookLessonSeqHigh);
                                if(item.textbookLessonSeqHigh == pg.v.textbook.textbookLessonUnitHighSeq){
                                    $liUnit.addClass('selected');
                                }
                                $('ul.unit').append($liUnit);
                            }
                        });

                        if( $('ul.unit li.selected').length == 0 ){
                            $('ul.unit li:eq(0)').addClass('selected');
                        }

                        /* 중단원  */
                        pg.f.getMidUnitList();

					}
				};

				$cmm.ajax(options);
		    },

            // 내 자료 업로드 - 교과서별  단원 , 차시
		    getMyDataTextbookEduList: function(){
                let textbookSeq = $('select[name=myDataTextbook]').val();

				const options = {
					url: '/textbook/eduList.ax',
					data: {textbookSeq: textbookSeq},
					success: function(res) {

					    pg.v.myDataEduList = res.rows;

                        let unitHighSeq = null;
                        $('select[name=myDataUnitHigh]').empty();
                        let selected = '';

                        $.each(res.rows, function(idx, item) {
                            /* 대단원 */
                            if(unitHighSeq != item.textbookLessonSeqHigh){
                                unitHighSeq = item.textbookLessonSeqHigh;

                               let unitHighTit = '';
                                if ( !$text.isEmpty(item.textbookLessonUnitHighNum)) {
                                    unitHighTit = item.textbookLessonUnitHighNum + '. ';
                                }
                                unitHighTit += item.textbookLessonUnitHighName;
                                if(item.textbookLessonSeqHigh == $('input[name=inputMyDataUnitHigh]').val()){
                                    selected = 'selected';
                                } else {
                                    selected = '';
                                }
                                let option = `<option value="${item.textbookLessonSeqHigh}" ${selected}>${unitHighTit}</option>`;

                                $('select[name=myDataUnitHigh]').append(option);
                            }
                        });

                        /* 내 자료 업로드 - 중단원  */
                        pg.f.getMyDataMidUnitList();

					}
				};

				$cmm.ajax(options);
		    },

		    //스크랩
		    scrap: function($item){
		        let data = $item.closest('li').data('item');

		        if(data.dataType == 'TEXTBOOK'){
                    data.contentsSeq = data.contentsTextbookSeq;
                    data.contentsTextbookCategoryDiv = 'TEXTBOOK';
		        } else if(data.dataType == 'UNIT'){
                    data.contentsSeq = data.contentsTextbookUnitSeq;
                    data.contentsTextbookCategoryDiv = 'UNIT';
		        } else if(data.dataType == 'PERIOD'){
		            data.contentsSeq = data.contentsTextbookPeriodSeq;
                    data.contentsTextbookCategoryDiv = 'PERIOD';
		        }

                $.ajax({
					url : "/Textbook/TextbookScrapJson.mrn",
					type : "get",
					cache : false,
					data : {
						"contentsSeq" : data.contentsSeq,
						"contentsTextbookCategoryDiv" : data.contentsTextbookCategoryDiv,
					},
					dataType : "json",
					success : function(jsonObj) {
						if (jsonObj.dispMessage) {
							alert(jsonObj.dispMessage);
							return;
						}
						if (jsonObj.result == 'OK') {
							if (jsonObj.isOn != null && jsonObj.isOn == 'create') {
								$item.addClass("on");
							} else {
								$item.removeClass("on");
							}
						}

					    /* 내 자료 - 스크랩 자료 인 경우에는 스크랩 해제 하면 목록에서 사라짐  */
					    if( $('ul.study-tab li.on').hasClass('typeMy') && $('#study-tab6 .mydata-tab a.on').hasClass('b_scrap')){
					        $item.closest('li').remove();
					    }

					},
					error : function() {
						alert("실패하였습니다.");
					}

				});

		    },
		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {

			/**
			 * 로그인 여부
			 *
			 * @memberOf pg.f
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
			},

            /**
             * 기본 학습 목차 세팅
             *
             * @memberOf pg.f
             */
             setDefaultList: function(){

                    if(pg.v.originalYn=='Y'){
                        // 저장 목차 보기 버튼
                        $('.btn-saved').removeClass('d-none');
                    }
                    $('.btn-default-view').addClass('d-none');


                    // 학습 목차 세팅
                    pg.f.makeStepList(pg.v.originalList );
             },

            /**
             * 교과서 목록
             *
             * @memberOf pg.f
             */
            getTextbookList: function(){

                let grade = $('ul.grade li.selected').data('grade');
                let term = $('ul.term li.selected').data('term');
                let subjectList = $objData.getListFilter(pg.v.textbookList, 'grade', grade);

                $('ul.subject li').remove();
                $.each(subjectList, function(idx, item) {

                    if(item.term == '00' || item.term == term){
                        // 사회과 부도, 도덕, 미술, 체육 안나오도록
                        if( item.textbookSeq == 111 || item.subjectCd == 'EI' || item.subjectCd == 'AT' || item.subjectCd == 'PE'){
                            return;
                        }
                        $li = pg.v.contentsHtmlSubject.clone();
                        let subjectNm = item.subjectNm;
                        if ( !$text.isEmpty(item.textbookMainAuth) ) {
                            subjectNm = subjectNm.concat(' ('+item.textbookMainAuth+')');
                        }
                        $li.find('a').text(subjectNm);
                        $li.data('seq',item.textbookSeq);
                        if(item.textbookSeq == pg.v.textbook.textbookSeq){
                            $li.addClass('selected');
                        }
                        $('ul.subject').append($li);
                    }
                });

                if( $('ul.subject li.selected').length == 0 ){
                    $('ul.subject li:eq(0)').addClass('selected');
                }

                //교과서별  단원 , 차시
                pg.c.getTextbookEduList();
            },

            // 다른 차시 - 중단원
            getMidUnitList: function(){
                let unitMidSeq = null;
                let periodList = $objData.getListFilter(pg.v.eduList, 'textbookLessonSeqHigh', $('ul.unit li.selected').data('seq'));
                $('ul.midUnit li').remove();

                $.each(periodList, function(pIdx, pItem) {
                    if ( $text.isEmpty(pItem.textbookLessonSeqMid) ) {
                        $('ul.midUnit').parent().addClass('d-none');
                    } else {
                        $('ul.midUnit').parent().removeClass('d-none');
                        if(unitMidSeq != pItem.textbookLessonSeqMid){
                            unitMidSeq =pItem.textbookLessonSeqMid;
                            let $liMidUnit = pg.v.contentsHtmlSubject.clone();
                            let midTit = '';
                            if ( !$text.isEmpty(pItem.textbookLessonUnitMidNum) ) {
                                midTit = '('+pItem.textbookLessonUnitMidNum+') ';
                            }
                            midTit += pItem.textbookLessonUnitMidName;
                            $liMidUnit.find('a').text(midTit);
                            $liMidUnit.data('seq',pItem.textbookLessonSeqMid);
                            if(pItem.textbookLessonSeqMid == pg.v.textbook.textbookLessonUnitMidSeq){
                                $liMidUnit.addClass('selected');
                            }
                            $('ul.midUnit').append($liMidUnit);
                        }
                    }
                });

                if($('ul.midUnit').parent().hasClass('d-none')){

                    // 중단원 없는 경우
                    let periodList = $objData.getListFilter(pg.v.eduList, 'textbookLessonSeqHigh', $('ul.unit li.selected').data('seq'));
                    pg.f.getPeriodList(periodList);

                    // css 변경
                    $('.lesson-header .another-lesson .col:eq(3)').css('width','30.4%');
                    $('.lesson-header .another-lesson .col:eq(4)').css('width','0%');
                    $('.lesson-header .another-lesson .col:eq(5)').css('width','43.6%');

                } else {

                    // 중단원 있는 경우
                    if( $('ul.midUnit li.selected').length == 0 ){
                        $('ul.midUnit li:eq(0)').addClass('selected');
                    }
                    let periodList = $objData.getListFilter(pg.v.eduList, 'textbookLessonSeqMid', $('ul.midUnit li.selected').data('seq'));
                    pg.f.getPeriodList(periodList);

                    // css 변경
                    $('.lesson-header .another-lesson .col:eq(3)').css('width','20%');
                    $('.lesson-header .another-lesson .col:eq(4)').css('width','20%');
                    $('.lesson-header .another-lesson .col:eq(5)').css('width','34%');
                }
            },

            // 다른 차시 - 차시 목록
            getPeriodList: function(periodList){
                $('ul.period li').remove();
                let currentPeriod = false;
                $.each(periodList, function(pIdx, pItem) {
                    let $liPeriod = pg.v.contentsHtmlSubject.clone();
                    let periodTit = '';
                    if ( !$text.isEmpty(pItem.textbookLessonPeriodNum) ) {
                        periodTit = '['+pItem.textbookLessonPeriodNum+'차시] ';
                    }
                    periodTit += pItem.textbookLessonPeriodName;
                    $liPeriod.find('a').text(periodTit);
                    $liPeriod.data('seq',pItem.textbookLessonSeq);
                    $liPeriod.data('data',pItem);
                    if(pItem.textbookLessonSeq == pg.v.textbook.textbookLessonSeq){
                        $liPeriod.addClass('selected');
                        currentPeriod = true;
                    }
                    $('ul.period').append($liPeriod);
                });

                if( $('ul.period li.selected').length == 0 ){
                    $('ul.period li:eq(0)').addClass('selected');
                }

                // 다른 차시 이동 버튼 설정
                let idx = $objData.getRowIdxFilter(pg.v.eduList, 'textbookLessonSeq', $('ul.period li.selected').data('seq'));

                // 이전 버튼
                if(pg.v.eduList[idx-1]){
                    $('.lesson-header .prev').data('seq', pg.v.eduList[idx-1].textbookLessonSeq);
                } else {
                    $('.lesson-header .prev').data('seq', null);
                }

                // 다음 버튼
                if(pg.v.eduList[idx+1]){
                    $('.lesson-header .next').data('seq', pg.v.eduList[idx+1].textbookLessonSeq);
                } else {
                    $('.lesson-header .next').data('seq', null);
                }

            },

            // 다른 차시 정보 세팅
            setLessonInfo: function(){
                // subjectCode 세팅
                let subjectCode = $text.lpad(pg.v.textbook.grade, 3, "0");
                if ( !$text.isEmpty(pg.v.textbook.textbookLessonUnitHighNum)) {
                    subjectCode += $text.lpad(pg.v.textbook.textbookLessonUnitHighNum, 3, "0")
                }
                if ( !$text.isEmpty(pg.v.textbook.textbookLessonUnitMidNum)) {
                    subjectCode += $text.lpad(pg.v.textbook.textbookLessonUnitMidNum, 3, "0")
                }
                $('#subjectCode').val(subjectCode);

                // 다른 차시 상단 - 대단원
                let unitHighTit = '';
                if ( !$text.isEmpty(pg.v.textbook.textbookLessonUnitHighNum)) {
                    unitHighTit = pg.v.textbook.textbookLessonUnitHighNum + '. ';
                }
                unitHighTit += pg.v.textbook.textbookLessonUnitHighName;
                $('.lesson-header .titUnit').text(unitHighTit);

                // 다른 차시 상단 - 중단원
                let midTit = '';
                if ( !$text.isEmpty(pg.v.textbook.textbookLessonUnitMidNum) ) {
                    midTit = ' ('+pg.v.textbook.textbookLessonUnitMidNum+') ';
                }
                if ( !$text.isEmpty(pg.v.textbook.textbookLessonUnitMidName) ) {
                    midTit += pg.v.textbook.textbookLessonUnitMidName;
                }
                $('.lesson-header .titMidUnit').text(midTit);

                if( $text.isEmpty(midTit) ){
                    $('.lesson-header .titMidUnit').addClass('d-none');
                } else {
                    $('.lesson-header .titMidUnit').removeClass('d-none');
                }

                // 다른 차시 상단 - 차시
                let periodTit = '['+pg.v.textbook.textbookLessonPeriodNum+'차시] '+ pg.v.textbook.textbookLessonPeriodName;
                $('.lesson-header .titLesson').text(periodTit);

                // 다른 차시 상단 - 페이지 정보
                let pageInfo = '';
                if( !$text.isEmpty(pg.v.textbook.textbookLessonPageMainInfo?.replace('|',''))
                     || !$text.isEmpty(pg.v.textbook.textbookLessonPageSubInfo?.replace('|',''))  ){
                    pageInfo += '(';
                    if( !$text.isEmpty(pg.v.textbook.textbookLessonPageMainInfo?.replace('|','')) ){
                        pageInfo += pg.v.textbook.textbookLessonPageMainInfo?.replace('|',' ').replace('p','쪽');
                    }
                    if( !$text.isEmpty(pg.v.textbook.textbookLessonPageSubInfo)
                        && !$text.isEmpty(pg.v.textbook.textbookLessonPageSubInfo?.replace('|',''))  ){
                        pageInfo += ', '+pg.v.textbook.textbookLessonPageSubInfo?.replace('|',' ').replace('p','쪽');
                    }
                    pageInfo += ')';
                }
                $('.lesson-header .titPageInfo').text(pageInfo);

                // 다른 차시 - 학년 선택
                $('ul.grade li.selected').removeClass('selected');
                $('[data-grade='+pg.v.textbook.grade+']').addClass('selected');

                // 다른 차시 - 학기 선택
                if(pg.v.textbook.term=='00'){
                    if( $('ul.term li.selected').length == 0 ){
                        /* 학기 00 이고 처음 진입 시 */
                        pg.v.textbook.term = $('#defaultTerm').val();
                        $('[data-term='+pg.v.textbook.term+']').addClass('selected');
                    } else {
                        /* 학기 00 이고 이전 선택된 학기가 있는 경우 */
                        pg.v.textbook.term = $('ul.term li.selected').data('term');
                    }
                } else {
                    $('ul.term li.selected').removeClass('selected');
                    $('[data-term='+pg.v.textbook.term+']').addClass('selected');
                }

                // 다른 차시 상단 - 학년,학기,과목
                $('.lesson-header .titGrade').text(Number(pg.v.textbook.grade)+'학년');
                $('.lesson-header .titTerm').text(Number(pg.v.textbook.term)+'학기');
                $('.lesson-header .titCourse').text(pg.v.textbook.subjectNm);

                // 다른 차시 - 과목 목록
                pg.f.getTextbookList();
            },

            // 과목별 바로가기 링크 세팅
            setLinkGroup: function(){

                $('.link-group').empty();
                let link = [];

                if(pg.v.textbook.subjectCd == 'KOA' || pg.v.textbook.subjectCd == 'KOB'){
					if(pg.v.textbook.grade == '01' || pg.v.textbook.grade == '02'){ // 순서 유지
						link.push({
							url: 'https://hg.mirae-n.com',
							linkName: '웰리미 한글 진단 검사'
						});
					}
                    link.push({
                        url: '/ExtraBlended/ExtraBlendedList.mrn?extraCategoryCd=KO',
                        linkName: '국어 작품 감상실'
                    });
                    link.push({
                        url: '/ExtraLab/bbs/KoreanTheaterPlayground.mrn',
                        linkName: '연극놀이터'
                    });
                    if( !(pg.v.textbook.grade == '01' || pg.v.textbook.grade == '02') ){
                        link.push({
                            url: '/ExtraTen/bbs/mindmap.mrn',
                            linkName: '개념영상&마인드맵'
                        });
                        link.push({
                            url: '/ExtraTen/bbs/Voca.mrn?extraGrade=10'+pg.v.textbook.grade,
                            linkName: '기초학습지 - 어휘'
                        });
                    }
                    link.push({
                        url: 'https://aiclass.m-teacher.co.kr/quizon/main.mrn',
                        linkName: '퀴즈온'
                    });

                } else if(pg.v.textbook.subjectCd == 'MA'){

                    link.push({
                        url: '/ExtraBlended/ExtraBlendedList.mrn?extraCategoryCd=MT',
                        linkName: '수학 스마트교구'
                    });
                    if( !(pg.v.textbook.grade == '01' || pg.v.textbook.grade == '02') ){
                        link.push({
                            url: '/ExtraTen/bbs/mindmap.mrn',
                            linkName: '개념영상&마인드맵'
                        });
                    }
                    if( pg.v.textbook.grade == '01' ){
                        link.push({
                            url: '/ExtraTen/bbs/Calcu.mrn?extraGrade=1008',
                            linkName: '기초학습지 - 연산'
                        });
                        link.push({
                            url: '/Creative/bbs/BreakMathSongList.mrn?ecmTabCSeq=781',
                            linkName: '기초탄탄 수학송'
                        });
                    }
					if( pg.v.textbook.grade == '02' ){
						link.push({
							url: '/ExtraTen/bbs/Calcu.mrn?extraGrade=1009',
							linkName: '기초학습지 - 연산'
						});
						link.push({
							url: '/Creative/bbs/BreakMathSongList.mrn?ecmTabCSeq=782',
							linkName: '기초탄탄 수학송'
						});
					}
                    if( !(pg.v.textbook.grade == '01' || pg.v.textbook.grade == '02') ){
                        link.push({
                            url: 'https://aiclass.m-teacher.co.kr/worksheet.mrn?grade='+Number(pg.v.textbook.grade)+'&term='+Number(pg.v.textbook.term)+'&course='+pg.v.textbook.subjectCd,
                            linkName: 'AI학습지'
                        });
                    }
                    link.push({
                        url: 'https://aiclass.m-teacher.co.kr/quizon/main.mrn',
                        linkName: '퀴즈온'
                    });

                } else if(pg.v.textbook.subjectCd == 'SO'){

                    link.push({
                        url: '/ExtraBlended/ExtraBlendedInfo.mrn?extraCategoryCd=SO',
                        linkName: '사회 디지털 지역 교과서'
                    });
                    link.push({
                        url: '/ExtraBlended/CulturalHeritageTreasureHunt.mrn',
                        linkName: '문화유산 보물찾기'
                    });
                    link.push({
                        url: '/ExtraTen/bbs/mindmap.mrn',
                        linkName: '개념영상&마인드맵'
                    });
                    link.push({
                        url: 'https://aiclass.m-teacher.co.kr/worksheet.mrn?grade='+Number(pg.v.textbook.grade)+'&term='+Number(pg.v.textbook.term)+'&course='+pg.v.textbook.subjectCd,
                        linkName: 'AI학습지'
                    });
                    link.push({
                        url: 'https://aiclass.m-teacher.co.kr/quizon/main.mrn',
                        linkName: '퀴즈온'
                    });

                } else if(pg.v.textbook.subjectCd == 'SC'){

                    link.push({
                        url: '/ExtraBlended/ExtraBlendedList.mrn?extraCategoryCd=SI',
                        linkName: '과학 디지털 실험실'
                    });
                    link.push({
                        url: 'https://aiclass.m-teacher.co.kr/quizon/main.mrn',
                        linkName: '퀴즈온'
                    });

                }
                $.each(link, function(idx, item) {
                    $(".link-group").append(`<a href="${item.url}" target="_blank">${item.linkName}</a>`);
                });

            },

            // 추천 자료 목록
            appendRecommendList: function(){
                let currentSize = $('ul.thumb-type li').size();
                $.each(pg.v.recommendList, function(idx, item) {
                    if(idx >= currentSize && idx< currentSize + pg.v.tab_all_page ){

                        let $li = pg.v.contentsHtmlRecommend.clone();
                        $li.data('item',item);
                        $li.find('p.tit').text(item.title);
                        $li.find('p.txt').text(item.title);
                        $li.find('.label').text(item.typeNm);

                        // $li.find('a').attr('href',item.url);
                        // 링크 수정 xx

                 		$li.find('a.openPreview').data('data',item);

	                 	if (!$text.isEmpty(item.thumbnail)) {
							$li.find('.thumb img.full').attr('src', (item.thumbnail.indexOf('http')==0) ? item.thumbnail : $('#apiHostCms').val() + item.thumbnail);
						}

                         if(item.extension != 'ZIP'){
                            $li.addClass('handle');
                         } else {
                            $li.addClass('zipAlert');
                         }

                        // 스크랩 아이콘 표시
                        if( !$text.isEmpty(item.scrapYn) ){
                            $li.find('.btn-scrap').removeClass('d-none');
                            if(item.scrapYn == 'Y'){
                                $li.find('.btn-scrap').addClass('on');
                            }
                        }
                        // 다운로드 아이콘 표시
                        if(item.downloadYn == 'Y'){
                            $li.find('.btn-download').removeClass('d-none');
                            $li.find('.btn-download').data('file-id',item.fileId);
                            $li.find('.btn-download').addClass('cmmFiledownloadId');  // 파일 다운로드
                        }
                        // NEW 아이콘 표시
                        if(item.newYn == 'Y'){
                            $li.find('span.label').append('<span class="ico-new">N</span>');
                           //  $li.find('p.tit').append('<span class="ico-new">N</span>');
                        }
                        // MEDIA_PLAY_TIME
                        if( !$text.isEmpty(item.mediaPlayTime) ){
                            $li.find('span.time').text(item.mediaPlayTime.replace(/^00:/g, ''));
                            $li.find('span.time').removeClass('d-none');
                        }

                        $('ul.thumb-type').append($li);
                    }
                });

                // draggable
                $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.recommend-more .cnt').text($('ul.thumb-type li').size());
                if(pg.v.recommendList.length > $('ul.thumb-type li').size()){
                    $('.recommend-more').removeClass('d-none');
                } else {
                    $('.recommend-more').addClass('d-none');
                }
            },

            // 전체탭(type1) - 멀티미디어 자료  목록
            appendTab0Type1List: function(){
                let currentSize = $('ul.type1 li').size();

                $.each(pg.v.tab1List, function(idx, item) {

                    if(idx >= currentSize && idx< currentSize + pg.v.tab_all_page ){

                        let $li = pg.v.contentsHtmlTabContents.clone();

                        $li = pg.f.makeLiItem($li, item);

                        $('ul.type1').append($li);
                    }

                });

                // draggable
               $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.type1-more .cnt').text($('ul.type1 li').size());
                if(pg.v.tab1List.length > $('ul.type1 li').size()){
                    $('.type1-more').removeClass('d-none');
                } else {
                    $('.type1-more').addClass('d-none');
                }
            },

            // 전체탭(type2) - 수업 자료  목록
            appendTab0Type2List: function(){
                let currentSize = $('ul.type2 li').size();

                $.each(pg.v.tab2List, function(idx, item) {

                    if(idx >= currentSize && idx< currentSize + pg.v.tab_all_page ){

                        let $li = pg.v.contentsHtmlTabContents.clone();

                        $li = pg.f.makeLiItem($li, item);

                        $('ul.type2').append($li);
                    }
                });
                // draggable
                $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                //더보기
                $('.type2-more .cnt').text($('ul.type2 li').size());
                if(pg.v.tab2List.length > $('ul.type2 li').size()){
                    $('.type2-more').removeClass('d-none');
                } else {
                    $('.type2-more').addClass('d-none');
                }
            },

            // 전체탭(type3) - 평가 자료  목록
            appendTab0Type3List: function(){
                let currentSize = $('ul.type3 li').size();

                $.each(pg.v.tab3List, function(idx, item) {

                    if(idx >= currentSize && idx< currentSize + pg.v.tab_all_page ){

                        let $li = pg.v.contentsHtmlTabContents.clone();

                        $li = pg.f.makeLiItem($li, item);

                        $('ul.type3').append($li);
                    }
                });

                // draggable
                $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.type3-more .cnt').text($('ul.type3 li').size());
                if(pg.v.tab3List.length > $('ul.type3 li').size()){
                    $('.type3-more').removeClass('d-none');
                } else {
                    $('.type3-more').addClass('d-none');
                }
            },

            // 전체탭(type4)- 5분 놀이 목록
            appendTab0Type4List: function(){
                let currentSize = $('ul.type4 li').size();

                $.each(pg.v.tab4List, function(idx, item) {

                    if(idx >= currentSize && idx< currentSize + pg.v.tab_all_page ){

                        let $li = pg.v.contentsHtmlTabContents.clone();

                        $li = pg.f.makeLiItem($li, item);

                        $('ul.type4').append($li);
                    }
                });

                // draggable
                $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.type4-more .cnt').text($('ul.type4 li').size());
                if(pg.v.tab4List.length > $('ul.type4 li').size()){
                    $('.type4-more').removeClass('d-none');
                } else {
                    $('.type4-more').addClass('d-none');
                }
            },

            // 전체탭(type5)- 연구 자료 목록
            appendTab0Type5List: function(){
                let currentSize = $('ul.type5 li').size();

                $.each(pg.v.tab5List, function(idx, item) {

                    if(idx >= currentSize && idx< currentSize + pg.v.tab_all_page ){

                        let $li = pg.v.contentsHtmlTabContents.clone();

                        $li = pg.f.makeLiItem($li, item);

                        $('ul.type5').append($li);
                    }

                });

                // draggable
                $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.type5-more .cnt').text($('ul.type5 li').size());
                if(pg.v.tab5List.length > $('ul.type5 li').size()){
                    $('.type5-more').removeClass('d-none');
                } else {
                    $('.type5-more').addClass('d-none');
                }
            },

            // tab1 멀티미디어탭 자료  목록
            appendTab1List: function(){
                let badgeSeq = $('#study-tab1 .mydata-tab a.on').attr('data-badge');
                let list = pg.v.tab1List;
                if(badgeSeq){
                    list = $objData.getListFilter(list, 'badgeSeq', badgeSeq);
                }

                let currentSize = $('ul.data-list.tab1 li').size();

                $.each(list, function(idx, item) {
                    if(idx >= currentSize && idx< currentSize + pg.v.tab_page ){
                        let $li = pg.v.contentsHtmlTabContents.clone();

                        pg.f.makeLiItem($li, item);

                        $('ul.data-list.tab1').append($li);
                    }
                });

                // draggable
                $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                //더보기
                $('.tab1-more .cnt').text($('ul.data-list.tab1 li').size());
                $('.tab1-more .tot').text(list.length);
                if(list.length > $('ul.data-list.tab1 li').size()){
                    $('.tab1-more').removeClass('d-none');
                } else {
                    $('.tab1-more').addClass('d-none');
                }
            },

            // tab2 수업 자료 탭  목록
            appendTab2List: function(){
                let badgeSeq = $('#study-tab2 .mydata-tab a.on').attr('data-badge');
                let list = pg.v.tab2List;
                if(badgeSeq){
                    list = $objData.getListFilter(list, 'badgeSeq', badgeSeq);
                }

                let currentSize = $('ul.data-list.tab2 li').size();

                $.each(list, function(idx, item) {
                    if(idx >= currentSize && idx< currentSize + pg.v.tab_page ){
                        let $li = pg.v.contentsHtmlTabContents.clone();

                        pg.f.makeLiItem($li, item);

                        $('ul.data-list.tab2').append($li);
                    }
                });

                // draggable
                $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.tab2-more .cnt').text($('ul.data-list.tab2 li').size());
                $('.tab2-more .tot').text(list.length);
                if(list.length > $('ul.data-list.tab2 li').size()){
                    $('.tab2-more').removeClass('d-none');
                } else {
                    $('.tab2-more').addClass('d-none');
                }

            },

            // tab3 평가 자료탭  목록
            appendTab3List: function(){
                let badgeSeq = $('#study-tab3 .mydata-tab a.on').attr('data-badge');
                let list = pg.v.tab3List;
                if(badgeSeq){
                    list = $objData.getListFilter(list, 'badgeSeq', badgeSeq);
                }

                let currentSize = $('ul.data-list.tab3 li').size();

                $.each(list, function(idx, item) {
                    if(idx >= currentSize && idx< currentSize + pg.v.tab_page ){
                        let $li = pg.v.contentsHtmlTabContents.clone();

                        pg.f.makeLiItem($li, item);

                        $('ul.data-list.tab3').append($li);
                    }
                });

                // draggable
                $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.tab3-more .cnt').text($('ul.data-list.tab3 li').size());
                $('.tab3-more .tot').text(list.length);
                if(list.length > $('ul.data-list.tab3 li').size()){
                    $('.tab3-more').removeClass('d-none');
                } else {
                    $('.tab3-more').addClass('d-none');
                }

            },

            // tab4 5분 놀이탭  목록
            appendTab4List: function(){
                let badgeSeq = $('#study-tab4 .mydata-tab a.on').attr('data-badge');
                let list = pg.v.tab4List;
                if(badgeSeq){
                    list = $objData.getListFilter(list, 'badgeSeq', badgeSeq);
                }

                let currentSize = $('ul.data-list.tab4 li').size();

                $.each(list, function(idx, item) {
                    if(idx >= currentSize && idx< currentSize + pg.v.tab_page ){
                        let $li = pg.v.contentsHtmlTabContents.clone();

                        pg.f.makeLiItem($li, item);

                        $('ul.data-list.tab4').append($li);
                    }
                });

                // draggable
               $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.tab4-more .cnt').text($('ul.data-list.tab4 li').size());
                $('.tab4-more .tot').text(list.length);
                if(list.length > $('ul.data-list.tab4 li').size()){
                    $('.tab4-more').removeClass('d-none');
                } else {
                    $('.tab4-more').addClass('d-none');
                }

            },

            // tab5 연구 자료 탭  목록
            appendTab5List: function(){
                let badgeSeq = $('#study-tab5 .mydata-tab a.on').attr('data-badge');
                let list = pg.v.tab5List;
                if(badgeSeq){
                    list = $objData.getListFilter(list, 'badgeSeq', badgeSeq);
                }

                let currentSize = $('ul.data-list.tab5 li').size();

                $.each(list, function(idx, item) {
                    if(idx >= currentSize && idx< currentSize + pg.v.tab_page ){
                        let $li = pg.v.contentsHtmlTabContents.clone();

                        pg.f.makeLiItem($li, item);

                        $('ul.data-list.tab5').append($li);
                    }
                });

                // draggable
                $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.tab5-more .cnt').text($('ul.data-list.tab5 li').size());
                $('.tab5-more .tot').text(list.length);
                if(list.length > $('ul.data-list.tab5 li').size()){
                    $('.tab5-more').removeClass('d-none');
                } else {
                    $('.tab5-more').addClass('d-none');
                }

            },

            // tab6 내 자료 탭 목록
            appendTab6List: function(){
                let badgeSeq = $('#study-tab6 .mydata-tab a.on').text();
                let list = pg.v.tab6List;

                let currentSize = $('ul.data-list.tab6 li').size();

                let $noData = pg.v.contentsHtmlTabContentsNoData.clone();
                if(list.length==0){
                    if($('#study-tab6 .mydata-tab a.on').hasClass('b_scrap') ){
                        $noData.find('.nodata-txt').text('자료를 스크랩 해주세요.');
                    }
                    $('ul.data-list.tab6').append($noData);
                }else {
                    $.each(list, function(idx, item) {
                        if(idx >= currentSize && idx< currentSize + pg.v.tab_page ){
                            let $li = pg.v.contentsHtmlTabContents.clone();
							item['newYn'] = 'N';
                            pg.f.makeLiItem($li, item);

							$li.find(".label").append("<span>"+item.curriPath+"</span>");

                            $('ul.data-list.tab6').append($li);
                        }
                    });
                }

                // draggable
               $('ul.data-list li.handle').draggable(pg.v.draggable_options);

                // 더보기
                $('.tab6-more .cnt').text($('ul.data-list.tab6 li').size());
                $('.tab6-more .tot').text(list.length);
                if(list.length > $('ul.data-list.tab6 li').size()){
                    $('.tab6-more').removeClass('d-none');
                } else {
                    $('.tab6-more').addClass('d-none');
                }

            },

            // 자료 아이템 생성
            makeLiItem: function($li, item){

                $li.data('item',item);
                let str = item.title;
                let title = str.substr(0, 65);
                $li.find('p.tit').text(title);

                $li.find('p.txt').text(title);
				$li.find('span.label').text(item.badge);

                // $li.find('a').attr('href',item.url);
                $li.find('a.openPreview').data('data',item);
                if (!$text.isEmpty(item.thumbnail)) {
					$li.find('.thumb img.full').attr('src', (item.thumbnail.indexOf('http')==0) ? item.thumbnail : $('#apiHostCms').val() + item.thumbnail);
				}

                 if(item.extension != 'ZIP'){
                    $li.addClass('handle');
                 } else {
                    $li.addClass('zipAlert');
                 }

                // 추천 배지 표시
                if(item.recommendYn == 'Y'){
                    $li.find('.badge').removeClass('d-none');
                }

                // 공유 배지 표시
                if(item.myDataShareYn == 'Y'){
                    $li.find('.badge').text('공유')
                    $li.find('.badge').removeClass('green').addClass('gray');
                    $li.find('.badge').removeClass('d-none');
                }

                // 스크랩 아이콘 표시
                if(!$text.isEmpty(item.scrapYn)){
                    $li.find('.btn-scrap').removeClass('d-none');
                    if(item.scrapYn == 'Y'){
                        $li.find('.btn-scrap').addClass('on');
                    }
                }
                // 다운로드 아이콘 표시
                if(item.downloadYn == 'Y'){
                    $li.find('.btn-download').removeClass('d-none');
                    $li.find('.btn-download').data('file-id',item.fileId);
                    $li.find('.btn-download').addClass('cmmFiledownloadId');  // 파일 다운로드
                }
                // NEW 아이콘 표시
                if(item.newYn == 'Y'){
                    $li.find('span.label').append('<span class="ico-new">N</span>');
                }
                // MEDIA_PLAY_TIME
                if( !$text.isEmpty(item.mediaPlayTime) ){
                    $li.find('span.time').text(item.mediaPlayTime.replace(/^00:/g, ''));
                    $li.find('span.time').removeClass('d-none');
                }

                return $li;
            },

            // 2depth 버튼 만들기
            make2depthBtn: function($tab, list){
                $tab.find('.mydata-tab a:gt(0)').remove();
                $.each(list, function(idx, item) {
                    if($tab.find(`[data-badge=${item.badgeSeq}]`).length==0){
                        let $btn = pg.v.contentsHtml2depth.clone();
                        $btn.attr('data-badge', item.badgeSeq);
                        $btn.text(item.badge);
                        $tab.find('.mydata-tab').append($btn);
                    }
                });
            },

            // 학습 목차 자료 갯수 체크
            checkStepList: function(){
                    $.each($('ul.cont-list ul.stepList'), function(idx, item) {
                        $noData = pg.v.contentsHtmlViewerNoData.clone();
                        if($(item).find('li:not(.nodata)').length == 0){
                            if($(item).find('li.nodata').length == 0){
                                $(item).append($noData);
                            }
                        } else {
                            $(item).find('li.nodata').remove();
                        }
                    });
            },

            // 학습 목차 세팅
            makeStepList: function(items){

                $('ul.cont-list ul.stepList').empty();

                /* 원본에 있는 학습 단계만 노출 */
                if(($objData.getListFilter(pg.v.originalList, 'stepBlockCSeq', 43)).length == 0){
                    $('ul.cont-list li:eq(0)').addClass('d-none');
                } else {
                    $('ul.cont-list li:eq(0)').removeClass('d-none');
                }
                if(($objData.getListFilter(pg.v.originalList, 'stepBlockCSeq', 29)).length == 0){
                    $('ul.cont-list li:eq(1)').addClass('d-none');
                } else {
                    $('ul.cont-list li:eq(1)').removeClass('d-none');
                }
                if(($objData.getListFilter(pg.v.originalList, 'stepBlockCSeq', 30)).length == 0){
                    $('ul.cont-list li:eq(2)').addClass('d-none');
                } else {
                    $('ul.cont-list li:eq(2)').removeClass('d-none');
                }
                if(($objData.getListFilter(pg.v.originalList, 'stepBlockCSeq', 31)).length == 0){
                    $('ul.cont-list li:eq(3)').addClass('d-none');
                } else {
                    $('ul.cont-list li:eq(3)').removeClass('d-none');
                }
                if(($objData.getListFilter(pg.v.originalList, 'stepBlockCSeq', 44)).length == 0){
                    $('ul.cont-list li:eq(4)').addClass('d-none');
                } else {
                    $('ul.cont-list li:eq(4)').removeClass('d-none');
                }

                $.each(items, function(idx, item) {

                    let $li = pg.v.contentsHtmlViewerIdx.clone();
                    $li.data('item',item);
                    let tit;

                    /* 짝꿍 교과서는 회색 박스 주황색 텍스트 */
                    if($.inArray(item.cornerType, ['k', 'm', 's']) >= 0 ) {

                       tit = `<span class="label">${item.corner}</span>${item.title}`;

                    }
                    /* 특화 콘텐츠는 수업뷰어와 동일한 색상 적용 */
                    else if($.inArray(item.cornerType, ['ma', 'sc', 'so', 're', 'mu', 'ss1', 'ss2', 'ss3', 'ss4', 'ko']) >= 0 ) {

                        tit = `<span class="badge bg-${item.badgeColor}">${item.corner}</span>${item.title}`;

                    }
                    /* 그 외에는 텍스트 표기 */
                    else {

                        if(!$text.isEmpty(item.corner) && !$text.isEmpty(item.title) ){
                            tit = `[${item.corner}] ${item.title}`;
                        } else {
                            tit = $text.isEmpty(item.title)? item.corner : item.title;
                        }

                    }

                    let pageInfo = '';
                    if( !$text.isEmpty(item.pageMainInfo) || !$text.isEmpty(item.pageSubInfo)){
                        pageInfo += '(';
                         if( !$text.isEmpty(item.pageMainInfo) ){
                            pageInfo += $('.titCourse').text() + ' ' + item.pageMainInfo+'쪽';
                         }
                         if( !$text.isEmpty(item.pageMainInfo) && !$text.isEmpty(item.pageSubInfo) ){
                            pageInfo += ', ';
                         }
                         if( !$text.isEmpty(item.pageSubInfo) ){
                            pageInfo += item.corner + ' ' + item.pageSubInfo+'쪽';
                         }
                        pageInfo += ')';
                    }

                    tit += '<span>'+pageInfo+ '</span>';

                    $li.find('.txt').html(tit);

	                if (!$text.isEmpty(item.thumbnail)) {
						$li.find('.thumb img').attr('src', (item.thumbnail.indexOf('http')==0) ? item.thumbnail : $('#apiHostCms').val() + item.thumbnail);
					}

                    if(item.stepBlockCSeq == 43){ /* 단원 도입 */
                        $('ul.cont-list ul.stepList:eq(0)').append($li);
                    } else if(item.stepBlockCSeq == 29){ /* 도입 */
                        $('ul.cont-list ul.stepList:eq(1)').append($li);
                    } else if(item.stepBlockCSeq == 30){ /* 전개 */
                        $('ul.cont-list ul.stepList:eq(2)').append($li);
                    } else if(item.stepBlockCSeq == 31){ /* 정리 */
                        $('ul.cont-list ul.stepList:eq(3)').append($li);
                    } else if(item.stepBlockCSeq == 44){ /* 단원 정리 */
                        $('ul.cont-list ul.stepList:eq(4)').append($li);
                    }

                });

				// 학습목차 하단 공간남을 경우 왼쪽 주황색 라인 길이 조정
				let liList = $(".cont-list").children();
				for(let i=1; i<liList.length; i++){
					if(liList[i].className == 'd-none'){
						if(i%2 == 1){ // 홀수인 경우
							// #FC93014D
							let $tmp_li_none = pg.v.contentsHtmlViewerIdx.clone();
							$tmp_li_none.addClass('d-none temp_li');
							$('ul.cont-list').append($tmp_li_none);
						}
						break;
					}
				}
                $('ul.cont-list ul.stepList').removeClass('d-none');
				let div_high = $(".study-cont .list-wrap").innerHeight();
				let ul_hgt_out = $(".list-wrap .cont-list").outerHeight();
				let li_size = div_high - ul_hgt_out -15;
				if(li_size > 0){
					let $tmp_li = pg.v.contentsHtmlViewerIdx.clone();
					$tmp_li.css('height', li_size+'px');
					$tmp_li.html('');
					$tmp_li.addClass('non_back temp_li');
					$('ul.cont-list').append($tmp_li);
				}

                // 학습 목차 자료 갯수 체크
                pg.f.checkStepList();
            },

            //내 자료 업로드 - 교과 정보 변경 콤보 세팅
            makeMyDataCombo: function(){

                // 학년 선택
                $('select[name=myDataGrade]').val($('input[name=inputMyDataGrade]').val());

                // 학기 선택
                $('select[name=myDataTerm]').val($('input[name=inputMyDataTerm]').val());

                // 과목 선택
                pg.f.makeComboTextbook();

            },

            //내 자료 업로드 - 과목 콤보 세팅
            makeComboTextbook: function(){

                let myDataTextbookList = $objData.getListFilter(pg.v.textbookList, 'grade', $('select[name=myDataGrade]').val());
                $('select[name=myDataTextbook]').empty();
                let selected = '';

                $.each(myDataTextbookList, function(idx, item) {
                    if(item.term == '00' || item.term == $('select[name=myDataTerm]').val()){
                        if(item.textbookSeq == $('input[name=inputMyDataTextbook]').val() ){
                            selected = 'selected';
                        } else {
                            selected = '';
                        }
                        let option = `<option value="${item.textbookSeq}" ${selected}>${item.subjectNm}</option>`;
                        $('select[name=myDataTextbook]').append(option);
                    }
                });

                // 내 자료 업로드 - 교과서별  단원 , 차시
                pg.c.getMyDataTextbookEduList();
            },

            // 내 자료 업로드 - 중단원
            getMyDataMidUnitList: function(){

                let unitMidSeq = null;
                let periodList = $objData.getListFilter(pg.v.myDataEduList, 'textbookLessonSeqHigh', $('select[name=myDataUnitHigh]').val());

                $('select[name=myDataUnitMid]').empty();
                $('select[name=myDataUnitMid]').append(`<option value=''>공통자료</option>`);
                let selected = '';

                $.each(periodList, function(pIdx, pItem) {

                    if ( $text.isEmpty(pItem.textbookLessonSeqMid) ) {

                        /* 중단원 없으면 */
                        $('select[name=myDataUnitMid]').addClass('readonly');
                        $('select[name=myDataUnitMid]').attr('disabled',true);

                    } else {

                        /* 중단원 있으면 */
                        $('select[name=myDataUnitMid]').removeClass('readonly');
                        $('select[name=myDataUnitMid]').removeAttr('disabled');

                        if(unitMidSeq != pItem.textbookLessonSeqMid){
                            unitMidSeq =pItem.textbookLessonSeqMid;
                            let midTit = '';
                            if ( !$text.isEmpty(pItem.textbookLessonUnitMidNum) ) {
                                midTit = '('+pItem.textbookLessonUnitMidNum+') ';
                            }
                            midTit += pItem.textbookLessonUnitMidName;

                            if(pItem.textbookLessonSeqMid == $('input[name=inputMyDataUnitMid]').val()){
                                selected = 'selected';
                            } else {
                                selected = '';
                            }
                            let option = `<option value="${pItem.textbookLessonSeqMid}" ${selected}>${midTit}</option>`;
                            $('select[name=myDataUnitMid]').append(option);

                        }

                    }

                });

                if($('select[name=myDataUnitMid]').hasClass('readonly')){
                    // 중단원 없는 경우
                    let periodList = $objData.getListFilter(pg.v.myDataEduList, 'textbookLessonSeqHigh', $('select[name=myDataUnitHigh]').val());
                    pg.f.getMyDataPeriodList(periodList);
                } else {
                    // 중단원 있는 경우
                    let periodList = $objData.getListFilter(pg.v.myDataEduList, 'textbookLessonSeqMid', $('select[name=myDataUnitMid]').val());
                    pg.f.getMyDataPeriodList(periodList);
                }

            },

            // 내 자료 업로드 - 차시
            getMyDataPeriodList: function(periodList){

                $('select[name=myDataPeriod]').empty();
                $('select[name=myDataPeriod]').append(`<option value=''>공통자료</option>`);
                let selected = '';

                $.each(periodList, function(pIdx, pItem) {
                    let periodTit = '';
                    if ( !$text.isEmpty(pItem.textbookLessonPeriodNum) ) {
                        periodTit = '['+pItem.textbookLessonPeriodNum+'차시] ';
                    }
                    periodTit += pItem.textbookLessonPeriodName;

                    // 페이지 정보
                    let pageInfo = '';
                    if( !$text.isEmpty(pItem.textbookLessonPageMainInfo.replace('|',''))
                         || !$text.isEmpty(pItem.textbookLessonPageSubInfo.replace('|',''))  ){
                        pageInfo += '(';
                        if( !$text.isEmpty(pItem.textbookLessonPageMainInfo.replace('|','')) ){
                            pageInfo += pItem.textbookLessonPageMainInfo.replace('|',' ').replace('p','쪽');
                        }
                        if( !$text.isEmpty(pItem.textbookLessonPageSubInfo)
                            && !$text.isEmpty(pItem.textbookLessonPageSubInfo.replace('|',''))  ){
                            pageInfo += ', '+pItem.textbookLessonPageSubInfo.replace('|',' ').replace('p','쪽');
                        }
                        pageInfo += ')';
                    }


                    if(pItem.textbookLessonSeq == $('input[name=inputMyDataPeriod]').val() ){
                        selected = 'selected';
                    } else {
                        selected = '';
                    }

                    let option = `<option value="${pItem.textbookLessonSeq}" ${selected}>${periodTit} ${pageInfo}</option>`;
                    $('select[name=myDataPeriod]').append(option);

                });

                // 교과 정보 변경 모달 - 타이틀
                $('.myDataChangeTit').html(pg.f.getMyDataPeriodTitle());

            },

            // 내 자료 업로드 - 교과 정보 변경 - 타이틀 (모달 선택 기준)
            getMyDataPeriodTitle: function(){

                let tit = $('select[name=myDataGrade] option:selected').text();
                tit += ' > ' + $('select[name=myDataTerm] option:selected').text();
                tit += ' > ' + $('select[name=myDataTextbook] option:selected').text();

                if($('select[name=myDataUnitHigh] option:selected').val() != ''){
                    tit += ' > ' + $('select[name=myDataUnitHigh] option:selected').text();
                }
                if($('select[name=myDataUnitMid] option:selected').val() != ''){
                    tit += ' > ' + $('select[name=myDataUnitMid] option:selected').text();
                }
                if($('select[name=myDataPeriod] option:selected').val() != ''){
                    tit += '<br>' + $('select[name=myDataPeriod] option:selected').text();
                }
                return tit;
            },

            // 내 자료 업로드 - 교과 정보 타이틀 ( 차시창 기준)
            getMyDataTextbookTitle: function(){

                let tit = $('.titGrade').text();
                tit += ' > ' + $('.titTerm').text();
                tit += ' > ' + $('.titCourse').text();
                tit += ' > ' + $('.titUnit').text();
                tit += '<br>' + $('.titLesson').text();
                tit += ' ' + $('.titPageInfo').text();
                return tit;
            },

            // 이용안내 오픈
            openGuide: function(){
	            // 현재 날짜 생성
	            const dateFormat		= 'YYYYMMDD';
	            const nowDate 			= moment().format(dateFormat);

	            // localStorage 값 가져오기
	            const popPeriodGuideDate		= localStorage.getItem('popPeriodGuideDate');
	            const popPeriodGuideYn		    = localStorage.getItem('popPeriodGuideYn');

	            // 다시보지않기 체크한 경우
	            if (!$text.isEmpty(popPeriodGuideYn) && popPeriodGuideYn=='N') {
	                return false;
	            }

	            // 스토리지에 날짜가 있으면
	            if (!$text.isEmpty(popPeriodGuideDate)) {
                    if (nowDate == popPeriodGuideDate) {
                        return false;
                    }
	            } else {
	                localStorage.setItem('popPeriodGuideDate', nowDate);
	            }

	            $('.lesson-wrap .guide').click();

            }
		},

		/*
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			//tab
		    var $tabsNav    = $('.tabs'),
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
		        $this.parent().next().children('.tab-cont').stop(true,true).hide().siblings( $this.find('a').attr('href') ).fadeIn(300);
		        e.preventDefault();

		        $('.list-wrap').scrollTop(0);

		        if( $this.index() == 0){
		            /* 전체 탭 */
		            pg.c.getRecommendContents();
		            pg.c.getRecommendContentsTab1('all');
		            pg.c.getRecommendContentsTab2('all');
		            pg.c.getRecommendContentsTab3('all');
		            pg.c.getRecommendContentsTab4('all');
		            pg.c.getRecommendContentsTab5('all');

		        } else if( $this.index() == 1){
		            /* 멀티미디어 탭 */
		            pg.c.getRecommendContentsTab1('tab');

		        } else if( $this.index() == 2){
		            /* 수업 자료 탭 */
		            pg.c.getRecommendContentsTab2('tab');

                } else if( $this.index() == 3){
		            /* 평가 자료 탭 */
		            pg.c.getRecommendContentsTab3('tab');

		        } else if( $this.index() == 4){
		            /* 5분 놀이 탭 */
		            pg.c.getRecommendContentsTab4('tab');

		        } else if( $this.index() == 5){
		            /* 연구 자료 탭 */
		            pg.c.getRecommendContentsTab5('tab');

                } else if( $this.index() == 6){
                    /* 내 자료 탭 */
                    $('#study-tab6 .mydata-tab a:eq(0)').click();
                }

		    });

            //다른차시
			$('.lesson-wrap .another').click(function(e){
				e.preventDefault();
		        if (!$(this).hasClass('on'))
		        {
					$(".another-lesson").animate({height: "toggle"},150);
					$(".another-dim").fadeIn(100);
		            $(this).addClass('on');

                    // 다른 차시 정보 세팅
                    pg.f.setLessonInfo();
		        }else{
					$(".another-lesson").animate({height: "toggle"},150);
					$(".another-dim").fadeOut(100);
		            $(this).removeClass('on');
		        }
		    });
			$('.lesson-wrap .another-close .close').on('click', function(){
		        $(".another-lesson").animate({height: "toggle"},150);
				$(".another-dim").fadeOut(100);
		        $('.lesson-wrap .another').removeClass('on');
		    });
			$('.lesson-wrap .another-dim').on('click', function(){
				$(this).fadeOut(100);
		        $(".another-lesson").animate({height: "toggle"},150);
		        $('.lesson-wrap .another').removeClass('on');
		    });

		    // 다른 차시 항목 클릭
            $(document).on('click', '.lesson-header .another-lesson .col .list li a', function (e) {
				$(this).parent().addClass('selected').siblings('li').removeClass("selected");

				if($(this).parent().parent().hasClass('grade') || $(this).parent().parent().hasClass('term')){
				    // 학년,학기
                    pg.f.getTextbookList();
				} else if($(this).parent().parent().hasClass('subject')){
				    // 과목
				    pg.c.getTextbookEduList();
				} else if($(this).parent().parent().hasClass('unit')){
				    // 단원
				    pg.f.getMidUnitList();
				} else if($(this).parent().parent().hasClass('midUnit')){
                    // 중단원
                    let periodList = $objData.getListFilter(pg.v.eduList, 'textbookLessonSeqMid', $('ul.midUnit li.selected').data('seq'));
                    pg.f.getPeriodList(periodList);
				} else if($(this).parent().parent().hasClass('period')){
				    let data = $(this).parent().data('data');

				    if(data.smartpptButtonHiddenYn=='Y'){
				        $msg.alert('수업자료 준비중입니다.');
				        return false;
				    }

				    // 차시
				    // 주소 변경
                    $cmm.changeBrowserAddressBarUrl('/Textbook/PopPeriod.mrn?playlist='+$(this).parent().data('seq'));
                    // 교과서 차시 기본 정보
                    pg.c.getTextbookInfoByPeriod();
                    $('.lesson-wrap .another-close .close').click();
				}

			});

            // 다른 차시 - 이전,다음 버튼 클릭
            $(document).on('click', '.lesson-header a.prev, .lesson-header a.next', function (e) {

                if($(this).data('seq')!=null){
                    // 주소 변경
                    $cmm.changeBrowserAddressBarUrl('/Textbook/PopPeriod.mrn?playlist='+$(this).data('seq'));
                    // 교과서 차시 기본 정보
                    pg.c.getTextbookInfoByPeriod();
                } else {
                    if($(this).hasClass('prev')){
                        $msg.alert('첫번째 차시입니다.');
                    } else {
                        $msg.alert('마지막 차시입니다.');
                    }
                }
            });

            // 내 자료 업로드 - 자료 구분 툴팁
			$('.data-input li .help').on('mouseenter', function(){
		        $(".data-input li .help-txt").animate({height: "toggle"},150);
		    });
			$('.data-input li .help').on('mouseleave', function(){
		        $(".data-input li .help-txt").animate({height: "toggle"},150);
		    });

		    //이용안내
			$('.lesson-wrap .guide').click(function(e){
				e.preventDefault();
		        if (!$(this).hasClass('on'))
		        {
					$(".user-guide").animate({height: "toggle"},150);
					$(".guide-dim").animate({height: "toggle"},150);
		            $(this).addClass('on');
		        }else{
					$(".user-guide").animate({height: "toggle"},150);
					$(".guide-dim").animate({height: "toggle"},150);
		            $(this).removeClass('on');
		        }
		    });

		    // 이용안내 닫기
			$('.lesson-wrap .user-guide .close').on('click', function(){
		        $(".user-guide").animate({height: "toggle"},150);
				$(".guide-dim").animate({height: "toggle"},150);
		        $('.lesson-wrap .guide').removeClass('on');

		        if($('#show-done').val() == 'on'){
                    localStorage.setItem('popPeriodGuideYn', 'N');
		        }
		    });
			$('.lesson-wrap .guide-dim').on('click', function(){
				$(this).fadeOut(150);
		        $(".user-guide").animate({height: "toggle"},150);
		        $('.lesson-wrap .guide').removeClass('on');
		    });

		    //modal
			$(document).on('click', '.modal', function (event) {
		        event.stopPropagation();
		        event.preventDefault();
		        var popup = $(this).attr('href');
		        $(popup).bPopup({
		            follow: [true, false],
					escClose: false,
					modalClose: false,
					opacity: 0.5,
		        });
		    });

            // 수업 시작하기 클릭
            $(document).on('click', '.btn-start', function (e) {

                if( pg.v.editing ){
                    $msg.alert('먼저 편집중인 목차를 저장해주세요.');
                } else {

					let addParam = '';
					// 사회일때
                    if (pg.v.textbook.subjectCd == 'SO') {
                        addParam = '&subjectCode='+$('#subjectCode').val();
                    }

                    let previewUrl = '/Ebook/v.mrn?playlist=' + $cmm.getUrlParams('playlist') + '&start=1&indexclose=Y'+addParam;
					// 기본 차시 뷰어
					if ($('.btn-save-view.btn-default-view').hasClass('d-none')) {
						previewUrl = previewUrl + '&filerole=original'+addParam;
					}

                    screenUI.f.winOpen(previewUrl, window.screen.width-10, window.screen.height-10, null, 'popCurriculumPage');
                }

            });

            // 학습 목차 클릭
            $(document).on('click', '.stepList .thumb img, .stepList p.txt, .stepList span.label', function (e) {
                let item = $(e.target).closest('.step').data('item');

                if( pg.v.editing ){
                    $msg.alert('먼저 편집중인 목차를 저장해주세요.');
                } else {
                    let previewUrl = '/Ebook/v.mrn?playlist=' + $cmm.getUrlParams('playlist') + '&start=' + item.num;
					// 기본 차시 뷰어
					if ($('.btn-save-view.btn-default-view').hasClass('d-none')) {
						previewUrl = previewUrl + '&filerole=original';
					}
                    screenUI.f.winOpen(previewUrl, window.screen.width-10, window.screen.height-10, null, 'popCurriculumPage');
                }
            });

			// 링크 공유
            new ClipboardJS('.link-share .share', {
                text: function(trigger) {
                    return $('#serviceDomainHttps').val() + '/Ebook/v.mrn?playlist=' + $cmm.getUrlParams('playlist') + '&indexclose=N&filerole=original&start=1';
                }
            }).on('success', function () {
				$msg.alert(lng.msg.copyLink);
            });

            // 추천 자료 더보기 클릭
            $(document).on('click', '.recommend-more button', function (e) {
                pg.f.appendRecommendList();
            });

            // 전체 탭 type1 멀티미디어 자료 더보기 클릭
            $(document).on('click', '.type1-more button', function (e) {
                pg.f.appendTab0Type1List();
            });

            // 전체 탭 type2 수업 자료 더보기 클릭
            $(document).on('click', '.type2-more button', function (e) {
                pg.f.appendTab0Type2List();
            });

            // 전체 탭 type3 평가 자료 더보기 클릭
            $(document).on('click', '.type3-more button', function (e) {
                pg.f.appendTab0Type3List();
            });

            // 전체 탭 type4 5분 놀이 더보기 클릭
            $(document).on('click', '.type4-more button', function (e) {
                pg.f.appendTab0Type4List();
            });

            // 전체 탭 type5 연구 자료 더보기 클릭
            $(document).on('click', '.type5-more button', function (e) {
                pg.f.appendTab0Type5List();
            });

            // tab1 멀티미디어 탭 자료 더보기 클릭
            $(document).on('click', '.tab1-more button', function (e) {
                pg.f.appendTab1List();
            });

            // tab2 수업 자료 탭 자료 더보기 클릭
            $(document).on('click', '.tab2-more button', function (e) {
                pg.f.appendTab2List();
            });

            // tab3 평가 자료 탭 자료 더보기 클릭
            $(document).on('click', '.tab3-more button', function (e) {
                pg.f.appendTab3List();
            });

            // tab4 5분 놀이 탭 자료 더보기 클릭
            $(document).on('click', '.tab4-more button', function (e) {
                pg.f.appendTab4List();
            });

            // tab5 연구 자료 탭 자료 더보기 클릭
            $(document).on('click', '.tab5-more button', function (e) {
                pg.f.appendTab5List();
            });

            // tab6 내 자료 탭 자료 더보기 클릭
            $(document).on('click', '.tab6-more button', function (e) {
                pg.f.appendTab6List();
            });

            // tab1 멀티미디어탭 2depth 클릭
            $(document).on('click', '#study-tab1 .mydata-tab a', function (e) {
                $( '#study-tab1 ul.tab1').empty();
                $( '#study-tab1 .mydata-tab a').removeClass('on');
                $(this).addClass('on');
                pg.f.appendTab1List();
            });

            // tab2 수업 자료 탭 2depth 클릭
            $(document).on('click', '#study-tab2 .mydata-tab a', function (e) {
                $( '#study-tab2 ul.tab2').empty();
                $( '#study-tab2 .mydata-tab a').removeClass('on');
                $(this).addClass('on');
                pg.f.appendTab2List();
            });

            // tab3 평가 자료 탭 2depth 클릭
            $(document).on('click', '#study-tab3 .mydata-tab a', function (e) {
                $( '#study-tab3 ul.tab3').empty();
                $( '#study-tab3 .mydata-tab a').removeClass('on');
                $(this).addClass('on');
                pg.f.appendTab3List();
            });

            // tab4 5분 놀이 탭 2depth 클릭
            $(document).on('click', '#study-tab4 .mydata-tab a', function (e) {
                $( '#study-tab4 ul.tab4').empty();
                $( '#study-tab4 .mydata-tab a').removeClass('on');
                $(this).addClass('on');
                pg.f.appendTab4List();
            });

            // tab5 연구 자료 탭 2depth 클릭
            $(document).on('click', '#study-tab5 .mydata-tab a', function (e) {
                $( '#study-tab5 ul.tab5').empty();
                $( '#study-tab5 .mydata-tab a').removeClass('on');
                $(this).addClass('on');
                pg.f.appendTab5List();
            });

            // tab6 내 자료 탭 2depth 클릭
            $(document).on('click', '#study-tab6 .mydata-tab a', function (e) {
                $( '#study-tab6 ul.tab6').empty();
                $( '#study-tab6 .mydata-tab a').removeClass('on');
                $(this).addClass('on');

                if( $(this).hasClass('b_upload') ){
                    // 업로드 자료
                    pg.c.getLessonRecommendContentTabMyData();
                } else if( $(this).hasClass('b_scrap') ){
                    // 스크랩 자료
                    pg.c.getLessonRecommendContentTabMyScrap();
                }

            });

            // 스크랩
            $(document).on('click', '.btn-scrap', function (e) {

                /* 내 자료 - 스크랩 자료 인 경우에는 스크랩 해제 하면 목록에서 사라짐  */
                if( $('ul.study-tab li.on').hasClass('typeMy') && $('#study-tab6 .mydata-tab a.on').hasClass('b_scrap')  ){
                    $msg.confirm('스크랩을 해제하면 목록에서 사라집니다. 해제 하시겠습니까?', () => {
                        pg.c.scrap($(e.target));
                    }, null, null, null, null, '취소');
                } else {
                    pg.c.scrap($(e.target));
                }

            });

            // 삭제
            $(document).on('click', '.stepList .btn-del', function (e) {
                e.stopPropagation();
				$msg.confirm('삭제 하시겠습니까?', () => {

				    $(e.target).parent().remove();

                     // 저장,취소 버튼
                     pg.v.editing = true;
                    $('.edit-block').removeClass('d-none');
                    $('.cont-list').css('padding-bottom', '71px');

                    // 학습 목차 자료 갯수 체크
                    pg.f.checkStepList();
				}, null, null, null, null, '취소');

            });

            // 저장
            $(document).on('click', '.btn-save', function (e) {

                if(pg.v.originalYn=='N'){
                    $msg.confirm('이미 저장된 목차가 있습니다. 새로 저장하시겠습니까? 새로 저장하면 기존 목차는 삭제됩니다.', () => {
                        //학습 목차 저장
                        pg.c.saveViewerContentIndexList();
                    }, null, null, null, null, '취소');
                } else {
                    //학습 목차 저장
                    pg.c.saveViewerContentIndexList();
                }

            });

            // 취소
            $(document).on('click', '.btn-cancel', function (e) {

                $msg.confirm('목차 편집을 취소하시겠습니까?'
                    , () => {
                        // 초기화
                        pg.c.getViewerContentIndexList();

                        // 저장,취소 버튼 가리기
                        pg.v.editing = false;
                        $('.edit-block').addClass('d-none');
                        $('.cont-list').css('padding-bottom', '15px');
                    }, null, null, null, null, '취소');

            });

            // 기본 목차 보기 버튼 클릭
            $(document).on('click', '.btn-default-view', function (e) {

                pg.v.editing = false;
                $('.btn-saved').removeClass('d-none');
                $('.btn-default-view').addClass('d-none');

                // 기본 학습 목차
                pg.f.setDefaultList();

            });

            // 저장 목차 보기 버튼 클릭
            $(document).on('click', '.btn-saved', function (e) {

                $('.btn-default-view').removeClass('d-none');
                $('.btn-saved').addClass('d-none');

                // 저장 학습 목차
                pg.c.getViewerContentIndexList();

            });

            // 검색
            $(document).on('click', '.btn-search', function (e) {
                let url = '/Search/Search.mrn?searchTxt='+$('input[name=searchPop]').val();
                window.open(url);
            });

            // 문의하기
            $(document).on('click', '.inquiry', function (e) {
                let url = '/SvcLogin/Qna.mrn';
                window.open(url);
            });

            // 내 자료 업로드
            $(document).on('click', '.mydata-upload', function (e) {

                // 내 자료 업로드 모달 - 초기화
                $('input[name=myDataTitle]').val('');
                $('input[name=myDataUrl]').val('');
                $('input[name=myDataFile]').val('');
                $('input[name=myDataFileName]').val('');
                $('.file-attach .btn-del').addClass('d-none');

                $('#myDataType1').click();
                $('#myDataShareYn1').click();
                $('#agree').attr('checked', false);

                // 내 자료 업로드 모달 - 교과정보
                $('.myDataTextbookTit p').html(pg.f.getMyDataTextbookTitle());
                $('input[name=inputMyDataGrade]').val(pg.v.textbook.grade);
                $('input[name=inputMyDataTerm]').val(pg.v.textbook.term);
                $('input[name=inputMyDataTextbook]').val(pg.v.textbook.textbookSeq);
                $('input[name=inputMyDataUnitHigh]').val(pg.v.textbook.textbookLessonUnitHighSeq);
                $('input[name=inputMyDataUnitMid]').val(pg.v.textbook.textbookLessonUnitMidSeq);
                $('input[name=inputMyDataPeriod]').val(pg.v.textbook.textbookLessonSeq);

            });

            // 내 자료 업로드 - 자료 타입 선택
            $(document).on('click', 'input[name=myDataType]', function (e) {

                if($(this).val()=='FILE'){
                    $('.file-child').removeClass('d-none');
                    $('.link-child').addClass('d-none');
                } else {
                    $('.link-child').removeClass('d-none');
                    $('.file-child').addClass('d-none');
                }

            });

            // 내 자료 업로드 - 파일 찾기 클릭
            $(document).on('click', '.btn-file', function (e) {

                $('input[name=myDataFile]').click();

            });

            // 내 자료 업로드 - 파일 선택
            $(document).on('change', 'input[name=myDataFile]', function (e) {

                let fileNm = $('input[name=myDataFile]')[0].files[0].name;
                fileNm += ` (${$file.getFileSize($('input[name=myDataFile]')[0].files[0].size)})`;
                $('input[name=myDataFileName]').val(fileNm);
                $('.file-attach .btn-del').removeClass('d-none');

            });

            // 내 자료 업로드 - 파일 삭제
            $(document).on('click', '.file-attach .btn-del', function (e) {

                $('input[name=myDataFile]').val('');
                $('input[name=myDataFileName]').val('');
                $('.file-attach .btn-del').addClass('d-none');

            });

            // 내 자료 업로드 - 교과 정보 변경 클릭
            $(document).on('click', '.btn-change', function (e) {

                //내 자료 업로드 - 교과 정보 변경 콤보 세팅
                pg.f.makeMyDataCombo();

            });

            // 내 자료 업로드 - 교과 정보 변경 - 학년 변경
            $(document).on('change', 'select[name=myDataGrade]', function (e) {

                //내 자료 업로드 - 과목 콤보 세팅
                pg.f.makeComboTextbook();

            });

            // 내 자료 업로드 - 교과 정보 변경 - 학기 변경
            $(document).on('change', 'select[name=myDataTerm]', function (e) {

                //내 자료 업로드 - 과목 콤보 세팅
                pg.f.makeComboTextbook();

            });

            // 내 자료 업로드 - 교과 정보 변경 - 과목 변경
            $(document).on('change', 'select[name=myDataTextbook]', function (e) {

                // 내 자료 업로드 - 교과서별  단원 , 차시
                pg.c.getMyDataTextbookEduList();

            });

            // 내 자료 업로드 - 교과 정보 변경 - 단원 변경
            $(document).on('change', 'select[name=myDataUnitHigh]', function (e) {

                /* 내 자료 업로드 - 중단원  */
                pg.f.getMyDataMidUnitList();

            });

            // 내 자료 업로드 - 교과 정보 변경 - 중단원 변경
            $(document).on('change', 'select[name=myDataUnitMid]', function (e) {

                // 내 자료 업로드 - 차시 세팅
                let periodList = $objData.getListFilter(pg.v.myDataEduList, 'textbookLessonSeqMid', $('select[name=myDataUnitMid]').val());
                pg.f.getMyDataPeriodList(periodList);

            });

            // 내 자료 업로드 - 교과 정보 변경 - 차시 변경
            $(document).on('change', 'select[name=myDataPeriod]', function (e) {

                // 교과 정보 변경 모달 - 타이틀
                $('.myDataChangeTit').html(pg.f.getMyDataPeriodTitle());
            });

            // 내 자료 업로드 - 교과 정보 변경 - 저장
            $(document).on('click', '.btnSavePeriod', function (e) {

                // 내 자료 업로드 모달 - 교과정보
                $('.myDataTextbookTit p').html(pg.f.getMyDataPeriodTitle());
                $('input[name=inputMyDataGrade]').val($('select[name=myDataGrade]').val());
                $('input[name=inputMyDataTerm]').val($('select[name=myDataTerm]').val());
                $('input[name=inputMyDataTextbook]').val($('select[name=myDataTextbook]').val());
                $('input[name=inputMyDataUnitHigh]').val($('select[name=myDataUnitHigh]').val());
                $('input[name=inputMyDataUnitMid]').val($('select[name=myDataUnitMid]').val());
                $('input[name=inputMyDataPeriod]').val($('select[name=myDataPeriod]').val());

                $('#curriculum-change .modal-close').trigger('click');
            });

            // 내 자료 업로드 - 자료 구분 클릭
            $(document).on('click', 'input[name=myDataShareYn]', function (e) {
                if($(this).val()=='Y'){
                    $('#mydata-upload .myDataShareY').removeClass('d-none');
                }else {
                    $('#mydata-upload .myDataShareY').addClass('d-none');
                }
            });

            // 내 자료 업로드 - 자료 등록
            $(document).on('click', '#mydata-upload .modal-close', function (e) {
                $msg.confirm('입력한 내용이 모두 삭제됩니다. 자료 업로드 화면을 닫으시겠습니까?', () => {
                    $('#mydata-upload').bPopup().close();
                }, null, null, null, null, '취소');
            });

            // 내 자료 업로드 - 자료 등록
            $(document).on('click', '.saveMyData', function (e) {

                if($("input[name=myDataTitle]").val().trim() == '') {
                    $msg.alert('자료명을 입력해 주세요');
                    return false;
                }

                if($("input[name=myDataTitle]").val().length < 3 || $("input[name=myDataTitle]").val().length > 30) {
                    $msg.alert('자료명은 최소 3글자 이상 최대 30자까지 입력 가능합니다.');
                    return false;
                }

                if($("input[name=myDataType]:checked").val() == 'FILE') {
                    if($('input[name=myDataFile]').val()==''){
                        $msg.alert('자료를 등록해 주세요.');
                         return false;
                    }

                    if($('input[name=myDataFile]')[0].files[0].size > 10 *1024 * 1024) {
                        $msg.alert('파일당 최대 10MB까지 업로드 가능합니다.');
                        return false;
                    }

                    let extension = $('input[name=myDataFile]')[0].files[0].name.split('.').pop().toLowerCase();
                    if($.inArray(extension, ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'mp4', 'mp3', 'hwp', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'zip']) == -1) {
                        $msg.alert('jpg, jpeg, png, bmp, gif, mp4, mp3, hwp, doc(docx), ppt(pptx), xls(xlsx), pdf, zip 파일만 업로드 가능합니다.');
                        return false;
                    }

                } else {
                    if($('input[name=myDataUrl]').val()==''){
                        $msg.alert('링크를 입력해 주세요.');
                         return false;
                    }

                    if( !$cmm.isValidUrl($('input[name=myDataUrl]').val()) ){
                        $('input[name=myDataUrl]').val('https://'+$('input[name=myDataUrl]').val());
                    }
                }

                if($("input[name=myDataShareYn]:checked").val() == 'Y') {
                    if($("input[id=agree]:checked").val() != 'Y'){
                        $msg.alert('저작권 및 활용 동의를 확인해 주세요.');
                         return false;
                    }
                }

                $msg.confirm('자료를 등록 하시겠습니까?', () => {
                    if($('input[name=myDataType]:checked').val()=='FILE'){
                        $('input[name=myDataUrl]').val('');
                    } else {
                        $('input[name=myDataFile]').val('');
                        $('input[name=myDataFileName]').val('');
                    }

                    $cmm.ajaxUpload({
                        url: '/Textbook/saveMyData.ax',
                        form: $('#myDataForm'),
                        success: function(res) {
                            $msg.alert('등록 되었습니다.');
                            $('#mydata-upload').bPopup().close();
                            $('ul.study-tab li.typeMy a').click();
                        }
                    });

                }, null, null, null, null, '취소');

            });

            //  압축파일 드래그
            $(document).on('dragstart', 'li.zipAlert', function (e) {
                $msg.alert('압축파일(zip)은 자료 이동이 불가능합니다. <br/>파일을 다운로드 하여 이용해 주세요.');
            });

            // 드래그 가능하도록
            $('ul.stepList').sortable({
				// placeholder: 'itemBoxHighlight',
                appendTo: '.lesson-content',
                scroll: false,
                connectWith: 'ul.stepList',
                axis: 'y',
                items: 'li:not(.nodata)',
                delay: 0,
                scrollSpeed: 10,
                start:  function(e, ui) {
					// $(ui.item).addClass('draggable_item');
					// 시작 위치
					pg.v.startSeq = $(ui.item).index('li');

                    // 학습 목차 자료 갯수 체크
                    pg.f.checkStepList();
                },
                update:  function(e, ui) {
                },
                over:  function(e, ui) {
                },
                stop:  function(e, ui) {
                    $(ui.item).removeClass('draggable_item');
                    $(ui.item).removeClass('handle');
					$(ui.item).removeAttr("style");

					// 종료 후 위치
					pg.v.endSeq = $(ui.item).index('li');

					// 위치가 변경 되었으면
					if (pg.v.startSeq != pg.v.endSeq) {

						// 저장,취소 버튼
						pg.v.editing = true;
	                    $('.edit-block').removeClass('d-none');
	                    $('.cont-list').css('padding-bottom', '71px');

						$(e.target).find('li.nodata').remove();
	                    // 학습 목차 자료 갯수 체크
	                    pg.f.checkStepList();
					}
                },
                receive:  function(e, ui) {
                    $(this).find('.ui-draggable').data('item',pg.v.draggable_data);
                    $(this).find('.ui-draggable').removeClass('ui-draggable').removeClass('ui-draggable-handle').addClass('step');

                    // 저장,취소 버튼
                    pg.v.editing = true;
                    $('.edit-block').removeClass('d-none');
                    $('.cont-list').css('padding-bottom', '71px');
                },
            });
            $( "ul, li" ).disableSelection();

            // 드래그 옵션
            pg.v.draggable_options = {
				appendTo: '.lesson-content',
                connectToSortable: 'ul.stepList',
                containment: '.lesson-content',
                cursorAt: { top: 50 },
                helper: function(e, ui) {
                    pg.v.draggable_data = $(this).data('item');

                    let $clone = $(this).clone();
                    $clone.removeAttr("style");
                    $clone.find('.subInfo').remove();
                    $clone.find('.placeholder').removeClass('d-none');
                    $clone.css("width", $('ul.stepList .step:eq(0)').width());
                    $clone.css("height", "120px");
                    $clone.find('a').css("padding", "5px");
                    $clone.find('.thumb').css("padding-top", "0%");
                    $clone.find('.thumb').css("width", $('ul.stepList .step:eq(0) .thumb').width());
                    $clone.find('.thumb').css("height", $('ul.stepList .step:eq(0) .thumb').height());
                    $clone.find('.thumb img').css("position","relative");
                    $clone.find('.thumb img').css("width", $('ul.stepList .step:eq(0) .thumb img').width());
                    $clone.find('.thumb img').css("height", $('ul.stepList .step:eq(0) .thumb img').height());
                    $clone.append('<span class="handler"></span>');
                    $clone.addClass('draggable_item');
                    return $clone;
                },
            };

            // 미리보기 클릭

            // 추천자료, 멀티미디어 자료 미리보기 클릭
            $(document).on('click', 'a.openPreview .thumb img, a.openPreview p.tit, a.openPreview span.label', function (e) {
				const item = $(this).parents('a.openPreview').data('data');

				// 신규
				let previewUrl 			= '/Ebook/preview.mrn';
				let previewYoutube 		= '/Ebook/extraYou.mrn';
				let previewMediaLink	= '/cms/smartppt/mpreview/mpreview.html';
				// let previewMediaLink	= '/Ebook/mpreview.mrn';
				// let previewExtra 		= '/viewer/extra.html?extraSeq=';
				let previewExtra 		= '/Ebook/extra.mrn?extraSeq=';
				let previewHls 			= '/Ebook/ViewVideo.mrn?type=hls&src=';

				let w = 800;
				let h = 1000;

				if (item.dataType == 'AICLASS') {
                    var winAiclass = window.open(item.url, '_blank');
                    winAiclass.focus();
                    return false;
				}
				else if (item.dataType == 'TEXTBOOK') {

					previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookTextbookSeq=' + item.contentsTextbookTextbookSeq + '&indexclose=N';

					if (item.contentsUseType == '002') {

						if (item.contentsType == 'LINK') {
							previewUrl = previewMediaLink + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookTextbookSeq=' + item.contentsTextbookTextbookSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'HLS') {
							w = 900;
							previewUrl = item.url;
						}
						else if (item.contentsType == 'YOUTUBE') {
							previewUrl = previewYoutube + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookTextbookSeq=' + item.contentsTextbookTextbookSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'FILE') {
							previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookTextbookSeq=' + item.contentsTextbookTextbookSeq + '&indexclose=N';
						}

					} else {
						previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookTextbookSeq=' + item.contentsTextbookTextbookSeq + '&indexclose=N';
					}

				} else if (item.dataType == 'UNIT') {

					previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookUnitSeq=' + item.contentsTextbookUnitSeq + '&indexclose=N';

					if (item.contentsUseType == '002') {

						if (item.contentsType == 'LINK') {
							previewUrl = previewMediaLink + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookUnitSeq=' + item.contentsTextbookUnitSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'HLS') {
							w = 900;
							previewUrl = item.url;
						}
						else if (item.contentsType == 'YOUTUBE') {
							previewUrl = previewYoutube + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookUnitSeq=' + item.contentsTextbookUnitSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'FILE') {
							previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookUnitSeq=' + item.contentsTextbookUnitSeq + '&indexclose=N';
						}

					} else {
						previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookUnitSeq=' + item.contentsTextbookUnitSeq + '&indexclose=N';
					}

				} else if (item.dataType == 'PERIOD') {

					if (item.contentsUseType == '002') {

						if (item.contentsType == 'LINK') {
							previewUrl = '/Ebook/ViewVideo.mrn?type=link&src=' + item.url;
							// previewUrl = previewMediaLink + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookPeriodScrapYn='+item.scrapYn+'&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'HLS') {
							w = 900;
							previewUrl = item.url;
						}
						else if (item.contentsType == 'YOUTUBE') {
							previewUrl = '/Ebook/ViewVideo.mrn?type=youtube&src=' + item.url;
							// previewUrl = previewYoutube + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookPeriodScrapYn='+item.scrapYn+'&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'FILE') {
							previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookPeriodScrapYn='+item.scrapYn+'&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=N';
						}
					} else {
						if(item.contentsType == "LINK_PAGE"){
							window.open(item.url, '_blank');
							return;
						}
						previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookPeriodScrapYn='+item.scrapYn+'&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=N';
					}

				} else if (item.dataType == 'EXTRAKO') {
					previewUrl = '/ExtraBlended/ExtraBlendedDetail.mrn?extraCategoryCd=KO&extraSeq=' + item.extraSeq;
					w = window.screen.width-10;
					h = window.screen.height-10;
				} else if (item.dataType == 'EXTRAMT') {
					previewUrl = '/ExtraBlended/ExtraBlendedDetail.mrn?extraCategoryCd=MT&extraSeq=' + item.extraSeq;
					w = window.screen.width-10;
					h = window.screen.height-10;
				} else if (item.dataType == 'EXTRASI') {
					previewUrl = '/ExtraBlended/ExtraBlendedDetail.mrn?extraCategoryCd=SI&extraSeq=' + item.extraSeq;
					w = window.screen.width-10;
					h = window.screen.height-10;
				} else if (item.dataType == 'EXTRASO') {
					previewUrl = '/cms/smartppt/html/social/special/main.html?tc_addr='+$('#tcAddr').val()+'&sc_name='+$('#scName').val()+'&referer=web&subjectCode=' + item.url;
					w = window.screen.width-10;
					h = window.screen.height-10;
				} else if (item.dataType == 'EXTRA') {

					if (item.contentsUseType == '002') {

						if (item.contentsType == 'HTMLLINK') {
							// 링크 새탭 열기
							screenUI.f.winOpen(item.url, w, h, null, 'popPreviewPage');
		                    return false;
						}
						else if (item.contentsType == 'VIDEO') {
							previewUrl = '/Ebook/ViewVideo.mrn?type=link&src=' + item.url;
						}
						else if (item.contentsType == 'HLS') {
							previewUrl = item.url;
						}
						else if (item.contentsType == 'YOUTUBE') {

							previewUrl = previewYoutube + '?source=' + item.dataType + '&file=' + item.url + '&indexclose=N';
						}
						else if (item.contentsType == 'FILE') {
							previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&indexclose=N';
						}

					} else {

						// 창의적체험활동이면 수업뷰어
						if (item.badgeSeq == 880 || item.typeCSeq == 880) {
							previewUrl = previewExtra + item.extraSeq;
						} else {
							previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&indexclose=N';
						}

					}

				} else if (item.dataType == 'MY') {

					if (item.contentsType == 'LINK') {

						// 링크 새탭 열기
						var winAiclass = window.open(item.url, '_blank');
	                    winAiclass.focus();
	                    return false;

					} else if (item.contentsType == 'FILE') {
						previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&indexclose=N';
					}
				}

				// 미리보기
                screenUI.f.winOpen(previewUrl, w, h, null, 'popPreviewPage');

            });

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

            // html contents 복제 - 과목
            pg.v.contentsHtmlSubject =  $('ul.subject li:eq(0)').clone();

            // html contents 복제 - 학습 목차
            pg.v.contentsHtmlViewerIdx =  $('ul.cont-list ul.stepList:eq(0) li:eq(0)').clone();

            // html contents 복제 - 학습 목차 자료 없음
            pg.v.contentsHtmlViewerNoData =  $('li.nodata').clone();

            // html contents 복제 - 추천 자료
            pg.v.contentsHtmlRecommend =  $('ul.thumb-type li:eq(0)').clone();

            // html contents 복제 - 수업 보충 자료
            pg.v.contentsHtmlTabContents =  $('ul.type1 li:eq(0)').clone();

            // html contents 복제 - 수업 보충 자료 없음
            pg.v.contentsHtmlTabContentsNoData =  $('ul.type1 li.noMyData').clone();

            // html contents 복제 - 2depth 버튼
            pg.v.contentsHtml2depth =  $('#study-tab1 .mydata-tab a').clone();

			// Event 정의 실행
			pg.event();

            //교과서 기본 정보
            pg.c.getTextbookBase();

            // 내자료 업로드 버튼
            $('.mydata-upload.modal').removeClass('d-none');

            // 이용안내
            pg.f.openGuide();

            //initiate as false
		    var isMobile = false;
		    // device detection
		    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
		        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {

				// 모바일만 사용 가능
				$msg.alert('차시창은 PC에서 이용하실 수 있습니다.', function() {
					location.href = '/';
					return;
				});
		    };
		}
	};

    if(pg.f.isLogin()) {
        pg.init();
    } else {
        $('.lesson-wrap').empty();
    }

	window.screen = screen;
});
