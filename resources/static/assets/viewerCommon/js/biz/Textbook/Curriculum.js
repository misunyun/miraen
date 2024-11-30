let pg;

$(function() {

	pg = {

		/**
		 * 내부  전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			item: null
			, rows: null
			, grade: null
			, term: null
			, textbookList: null
			, textbook:null
			, page: 1
			, pageRowCnt: 20
			, unitSeq: null
			, adminTextbookTypeUseCd: null
			, changeTerm: false
            , textbookRecmmdCntMap: null
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

		    //교과서 기본 정보
		    getTextbookBase: function(){

				const options = {
					url: '/textbook/base.ax',
					data: null,
					success: function(res) {
					    pg.v.textbookList = res.rows;
                        pg.f.getTextbookInfo();
					}
				};

				$cmm.ajax(options);
		    },

		    //교과서 자료
		    getTextbookDetail: function(){
                let textbookSeq = window.location.href.split('/').pop().split('?')[0];

				const options = {
					url: '/textbook/detail.ax',
					data: {textbookSeq: textbookSeq},
					success: function(res) {

                        let specialList = $objData.getListFilter(res.rows, 'contentsTextbookDiv', 'SPECIAL');
                        specialList = $objData.getListFilter(res.rows, 'contentsTextbookUseType', '004');
                        let filelist = $objData.getListFilter(res.rows,'contentsTextbookDiv', 'MENU');
                        // 공통자료에서 FILE자료만 필터
                        let num = $objData.getListFilter(filelist, 'contentsTextbookType', 'FILE',).length;
                        // 공통자료에서 LINK자료만 필터
                        let num2 = $objData.getListFilter(filelist, 'contentsTextbookType', 'LINK',).length;
                        //console.log('num>>>>>>>>>>>>>>>>>>', num);
                        //console.log('num>>>>>>>>>>>>>>>>>>', num2);

                        $('.detailCheckNum').text(`(총 ${num+num2}개)`);


                        $('.link-group li').remove();
                        $.each(specialList, function(idx, item) {
                            let $li = pg.v.contentsHtmlSpecial.clone();
                            $li.find('a').text(item.contentsTextbookTitle);
                            $li.find('a').data('info', item);
                            $li.find('a').addClass(item.contentsTextbookType.toLowerCase());
                            $('.link-group').append($li);
                            /* 최대 5개 노출 */
                            if(idx == 4) return false;
                        });
                        $('.link-group li').removeClass('d-none');
					}
				};

				$cmm.ajax(options);
		    },

		    //교과서 상세  - 단원 , 차시
		    getTextbookEduList: function(){
                let textbookSeq = window.location.href.split('/').pop().split('?')[0];

				const options = {
					url: '/textbook/eduList.ax',
					data: {textbookSeq: textbookSeq},
					success: function(res) {

					    let unitHighName = null;
					    $('#info-tab1 .list-toggle li.liUnit').remove();

					    // 자료 모아보기 단원 설정 초기화
					    $('#info-tab2 .selUnitList').empty();
					    $('#info-tab2 .selUnitList').append(pg.v.contentsHtmlTab2Unit.clone());
					    $('#info-tab2 .mid-unit .sel-check').empty();

					    $.each(res.rows, function(idx, item) {
					        /* 대단원 */
					        if(unitHighName != item.textbookLessonUnitHighName){
					            unitHighName = item.textbookLessonUnitHighName;
					            let $liUnit = pg.v.contentsHtmlUnit.clone();
					            let unitHighTit = '';
					            if ( !$text.isEmpty(item.textbookLessonUnitHighNum)) {
					                unitHighTit = item.textbookLessonUnitHighNum + '. ';
					            }
					            unitHighTit += item.textbookLessonUnitHighName;
					            $liUnit.find('.tit-wrap .tit').text(unitHighTit);

                                /* 단원공통자료 버튼 */
                                if(item.highContentsCnt == 'N'){
                                    $liUnit.find('.tit-wrap .common-data').addClass('d-none');
                                }else {
                                    $liUnit.find('.tit-wrap .common-data').removeClass('d-none');
                                    $liUnit.find('.tit-wrap .common-data .btn-data').data('unit-seq',item.textbookLessonSeqHigh);
                                }

                                // 자료 모아보기 단원 설정
                                let $liContentsType = pg.v.contentsHtmlTab2Unit.clone();
                                $($liContentsType[0]).data('seq', item.textbookLessonSeqHigh);
                                $($liContentsType[0]).prop('checked',false);
                                $($liContentsType[0]).attr('id', 'unit'+item.textbookLessonSeqHigh);
                                $($liContentsType[1]).text(unitHighTit);
                                $($liContentsType[1]).attr('for', 'unit'+item.textbookLessonSeqHigh);
                                $('#info-tab2 .selUnitList').append($liContentsType);

                                let unitMidName = null;
                                let periodList = $objData.getListFilter(res.rows, 'textbookLessonUnitHighName', unitHighName);
                                $liUnit.find('.p-cont').empty();

                                /* 중단원, 차시 */
                                $.each(periodList, function(pIdx, pItem) {

                                    if ( $text.isEmpty(pItem.textbookLessonUnitMidName) ) {
                                        if(pIdx == 0){
                                            $liUnit.find('.p-cont').append('<ul class="list-inner-toggle"></ul>');
                                        }

                                    } else {
                                        if(unitMidName != pItem.textbookLessonUnitMidName){
                                            unitMidName = pItem.textbookLessonUnitMidName;

                                            let $liMidUnit = pg.v.contentsHtmlUnit.find('.p-cont .sub-tit').clone();
                                            let midTit = '';
                                            if ( !$text.isEmpty(pItem.textbookLessonUnitMidNum) ) {
                                                midTit = '('+pItem.textbookLessonUnitMidNum+') ';
                                            }
                                            midTit += pItem.textbookLessonUnitMidName;
                                            $liMidUnit.find('.m-tit').text(midTit);

                                            /* 단원공통자료 버튼 */
                                            if(pItem.midContentsCnt == 'N'){
                                                $liMidUnit.find('.common-data').addClass('d-none');
                                            }else {
                                                $liMidUnit.find('.common-data').removeClass('d-none');
                                                $liMidUnit.find('.common-data .btn-data').data('unit-seq',pItem.textbookLessonSeqMid);
                                            }

                                            $liUnit.find('.p-cont').append($liMidUnit);
                                            $liUnit.find('.p-cont').append('<ul class="list-inner-toggle"></ul>');

                                            // 자료 모아보기 중단원 설정
                                            let $liContentsMid = pg.v.contentsHtmlTab2MidUnit.clone();
                                            $($liContentsMid[0]).attr('id', 'mid'+pItem.textbookLessonSeqMid);
                                            $($liContentsMid[0]).attr('data-seq', pItem.textbookLessonSeqMid);
                                            $($liContentsMid[0]).attr('data-high', pItem.textbookLessonSeqHigh);
                                            $($liContentsMid[1]).text(midTit);
                                            $($liContentsMid[1]).attr('for', 'mid'+pItem.textbookLessonSeqMid);
                                            $($liContentsMid[1]).attr('data-high', pItem.textbookLessonSeqHigh);
                                            $('#info-tab2 .mid-unit .sel-check').append($liContentsMid);

                                        }
                                    }

                                    let $liPeriod = pg.v.contentsHtmlUnit.find('.p-cont .list-inner-toggle li.p-item').clone();
                                    let periodTit = '';
                                    if(!$text.isEmpty(pItem.textbookLessonPeriodNum) ){
                                        periodTit += '['+pItem.textbookLessonPeriodNum+'차시] ';
                                    }
                                    periodTit += pItem.textbookLessonPeriodName;

                                    if(!$text.isEmpty(pItem.textbookLessonPageMainInfo) ){
                                        periodTit += ' (' + pItem.textbookLessonPageMainInfo.replace('|',' ');
                                        if ( !$text.isEmpty(pItem.textbookLessonPageSubInfo) && !$text.isEmpty(pItem.textbookLessonPageSubInfo.replace('|',''))) {
                                            periodTit += ' | ' + pItem.textbookLessonPageSubInfo.replace('|',' ');
                                        }
                                        periodTit += ')';
                                    }

                                    $liPeriod.find('.tit-wrap .tit a').text(periodTit);
                                    $liPeriod.find('.tit-wrap .tit').addClass('lesson'+pItem.textbookLessonSeq);
                                    // 추천자료 COUNT
                                    hasRecmmdContents = pg.v.textbookRecmmdCntMap[pItem.textbookLessonSeq] || 0;
                                    if(hasRecmmdContents != 0){ // 추천자료가 있는 경우만 펼치기 가능
                                        $liPeriod.find('.tit-wrap .tit').addClass("recommend");
                                    }
                                    $liPeriod.data('item',pItem);

                                    /* 짝꿍 교과서 */

                                    if(pg.v.textbook.subjectCd == 'MA'){
                                        $liPeriod.find('.math-study').text('수학 익힘').data('file-role','m');
                                         if ( $text.isEmpty(pItem.textbookLessonSubjectSeq)) {
                                            $liPeriod.find('.math-study').addClass('d-none');
                                         }
                                    } else if(pg.v.textbook.subjectCd == 'SC'){
                                        $liPeriod.find('.math-study').text('실험 관찰').data('file-role','s');
                                         if ( $text.isEmpty(pItem.textbookLessonSubjectSeq)) {
                                            $liPeriod.find('.math-study').addClass('d-none');
                                         }
                                    } else if(pg.v.textbook.subjectCd == 'KOA' || pg.v.textbook.subjectCd == 'KOB'){
                                        $liPeriod.find('.math-study').text('국어 활동').data('file-role','k');
                                         if ( $text.isEmpty(pItem.textbookLessonSubjectSeq)) {
                                            $liPeriod.find('.math-study').addClass('d-none');
                                         }
                                    } else {
                                        $liPeriod.find('.math-study').addClass('d-none');
                                    }

                                     /* 수업 열기 */
                                     $liPeriod.find('.lesson-open').data('seq', pItem.textbookLessonSeq);

                                     /* smart PPT 버튼 숨김 Y인 경우 수업열기 버튼 안보이도록 */
                                     if(pItem.smartpptButtonHiddenYn == 'Y'){
                                        $liPeriod.find('.lesson-open').addClass('d-none');
                                     }

                                    $liUnit.find('.p-cont .list-inner-toggle:last-child').append($liPeriod);
                                });

                                $('#info-tab1 .list-toggle').append($liUnit);
					        }

					    });

                        // 모든 단원 펼침 on/off
                        let curriculumSwitchFold = window.localStorage.getItem('curriculumSwitchFold');
                        if(curriculumSwitchFold == 'on'){
                            $('.switch-fold').addClass('on')
                            $('.switch-fold').parent().next('.list-toggle').children('li').addClass('on').children('.cont').slideDown(0);
                        }

                       // 교사가 마지막으로 사용한 차시 하이라이트
                       let textbookLessonSeq = window.localStorage.getItem('curriculum'+textbookSeq);

                       if(!!textbookLessonSeq){
                            if( !$('.lesson'+textbookLessonSeq).parents('.liUnit').hasClass('on') ){
                                $('.lesson'+textbookLessonSeq).parents('.liUnit').addClass('on').children('.cont').slideDown(0);
                            }
                            // 교사가 마지막으로 사용한 차시 하이라이트
                            $('.lesson'+textbookLessonSeq).click();
                       }else {

                            // 펼침 단원이 하나도 없는 경우 맨 앞 단원을 펼침
                            if($('.list-toggle li.liUnit.on').length ==0){
                                $('.list-toggle li.liUnit:eq(0)').addClass('on').children('.cont').slideDown(0);
                            }
                       }
					}
				};
                pg.c.getRecommendContentCount(textbookSeq).then(function(){ // promise then
                    $cmm.ajax(options);
                });
		    },

			// 내 교과서 등록,해제
			saveMyTextbook: function(){
                let textbookSeq = window.location.href.split('/').pop().split('?')[0];

			    $.ajax({
            		url : "/Textbook/TextbookChoseJson.mrn",
            		type : "post",
            		cache : false,
            		data : { textbookSeq : textbookSeq },
            		dataType : "json",
            		success:function(jsonObj){
            			if (jsonObj.dispMessage) {
            				$msg.alert(jsonObj.dispMessage);
            				return;
            			}
            			if (jsonObj.result == 'OK') {
                            let obj = $('.book-register');

            				if (jsonObj.isOn != null && jsonObj.isOn == 'create') {
            					$(obj).html('교과서 해제');
            					$(obj).removeClass('off');
            					$msg.alert('교과서 등록이 완료되었습니다.');
            				} else {
            					$(obj).html('교과서 등록');
            					$(obj).addClass('off');
            					$msg.alert('교과서 등록이 해제되었습니다');
            				}

            			}
            		},
            		error:function(json){
                        $msg.alert("실패하였습니다.");
            		}
            	});

			},

			// 즐겨찾기 등록
			insFavorites: function(){
                let textbookSeq = window.location.href.split('/').pop().split('?')[0];

                const options = {
					url: '/main/favoritesList.ax',
					data: {
                        grade: $('#tab1Grade').val(),
                        term: $('#tab1Term').val()
                    },
					success: function(res) {

						if (!!res.rows) {

						    if(res.rows.length == 24){
						        $msg.alert('즐겨찾기는 24개까지만 등록 가능합니다.');
						        return;
						    }

                            const options2 = {
                                url: '/main/insFavorites.ax',
                                data: {
                                    typeCSeq: 647
                                    , fkSeq: textbookSeq
                                },
                                success: function(res) {
                                    let obj = $('.book-register');
                                    $(obj).html('즐겨찾기 해제');
                                    $(obj).removeClass('off');
                                    $msg.alert('즐겨찾기 등록이 완료되었습니다.');
                                    let textbook =  $objData.getRowFilter(pg.v.textbookList, 'textbookSeq', textbookSeq);
                                    textbook.myFavorites = 'Y';
                                }
                            };

                            $cmm.ajax(options2);
						}
					}
				};

				$cmm.ajax(options);

			},

            // 즐겨찾기 해제
			delFavorites: function(){
                let textbookSeq = window.location.href.split('/').pop().split('?')[0];

                    const options2 = {
                        url: '/main/delFavorites.ax',
                        data: {
                            typeCSeq: 647
                            , fkSeq: textbookSeq
                        },
                        success: function(res) {
                            let obj = $('.book-register');
                            $(obj).html('즐겨찾기 등록');
                            $(obj).addClass('off');
                            $msg.alert('즐겨찾기 해제가 완료되었습니다.');
                            let textbook =  $objData.getRowFilter(pg.v.textbookList, 'textbookSeq', textbookSeq);
                            textbook.myFavorites = 'N';
                        }
                    };

                    $cmm.ajax(options2);

			},

		    //교과서  공통자료
		    getTextbookContents: function(){

				const options = {
					url: '/contents/textbook/cmmContents.ax',
					data: {textbookSeq : pg.v.textbook.textbookSeq},
					success: function(res) {

					    $('ul.textbook-contents').empty();
                        $.each(res.rows, function(idx, item) {

                            let $li = pg.v.contentsHtmlTextbookContents.clone();

                            $li.find('.text-wrap .file').addClass(item.fileExtension?item.fileExtension.toLowerCase():'');
                            $li.find('.text-wrap a').text(item.contentsTextbookTitle);
                            $li.find('a').data('item',item);
                            $li.find('button').data('item',item);
                            $li.find('button.down').data('file-id',item.fileId);
                            if(item.scrapYn == 'Y'){
                                $li.find('button.scrap').addClass('on');
                            }
                            if(item.downloadYn == 'Y'){
                                $li.find('button.down').addClass('on');
                                $li.find('button.down').addClass('cmmFiledownloadId');  // 파일 다운로드
                                $li.find('input[name=checkCmmContents]').removeAttr('disabled');
                            }
                            $('ul.textbook-contents').append($li);
                        });

                        pg.f.initAllContentsType();
					}
				};

				$cmm.ajax(options);
		    },

		    //교과서 단원 공통자료
		    getUnitContents: function($bItem){
		        if(!$bItem.data('unit-seq')){
		            return false;
		        }

				const options = {
					url: '/contents/textbook/unitContents.ax',
					data: {textbookLessonSeq : $bItem.data('unit-seq')},
					success: function(res) {

					    $bItem.parent().find('.common-list').empty();
                        $.each(res.rows, function(idx, item) {
                            let $li = pg.v.contentsHtmlCmmContents.clone();
                            let liHtml = '<i class="ico"></i>' + item.contentsTextbookUnitTitle;
                            $li.find('a').html(liHtml);
                            $li.find('a').data('item',item);
                            $li.find('i').data('item',item);
                            $li.find('i').addClass(item.fileExtension?item.fileExtension.toLowerCase():'');
                            $bItem.parent().find('.common-list').append($li);
                        });

                        $bItem.next('.common-wrap').fadeIn(300);
                        $bItem.parent().addClass('on');
					}
				};

				$cmm.ajax(options);
		    },

		    //교과서 자료 모아보기
		    getAllContents: function(){
		        let category = $('.tabs-all-contents li.on a').data('category');
		        let url = '/contents/textbook/allContents.ax';
		        if(category == '000') {
		            /* 선생님 공유자료 */
		            url = '/contents/textbook/getSharedUserContents.ax'
		        }
				const options = {
					url: url,
					data: {
					    textbookSeq : pg.v.textbook.textbookSeq
					    , length: pg.v.pageRowCnt
					    , start: (pg.v.page-1) * pg.v.pageRowCnt
					    , adminTextbookTypeCategoryCd: $('.tabs-all-contents li.on a').data('category')
					    , unitSeq: pg.v.unitSeq
					    , adminTextbookTypeUseCd: pg.v.adminTextbookTypeUseCd
                    },
					success: function(res) {

                        if(pg.v.page == 1){
                            $('ul.all-contents li').remove();
                        }
                        if(res.rows.length == 0){
                            $('#data-tab1').addClass('d-none');
                            $('.nodata-tab').removeClass('d-none');
                        } else {
                            $('#data-tab1').removeClass('d-none');
                            $('.nodata-tab').addClass('d-none');
                        }

                        $.each(res.rows, function(idx, item) {

                            $li = pg.v.contentsHtmlTextbookAllContents.clone();
                            $li.find('.high_num').text(item.textbookLessonUnitHighNum);
                            // 관리자에서 노출단원명 설정한 경우 노출단원명 보여줌
                            if(!$text.isEmpty(item.webUnitName)){
                                $li.find('.high_num').text(item.webUnitName);
                            }
                            if(!$text.isEmpty(item.textbookLessonUnitMidNum)){
                                $li.find('.high_num').append('-('+item.textbookLessonUnitMidNum+')')
                            }
                            $li.find('.period_num').text(item.periodName);

                            if (item.contentsTextbookCategoryCd == "039" || item.contentsTextbookCategoryCd == "009") {
								$li.find('.text-wrap .file').addClass('type'+item.contentsTextbookCategoryCd);
							} else if(item.contentsTextbookCategoryCd == "014") {
								$li.find('.text-wrap .file').addClass('type'+item.contentsTextbookCategoryCd);
							} else if(item.contentsTextbookCategoryCd == "007") {
								$li.find('.text-wrap .file').addClass('type'+item.contentsTextbookCategoryCd);
							} else if(item.contentsTextbookCategoryCd == "008") {
								$li.find('.text-wrap .file').addClass('type009');
							} else if(item.contentsTextbookCategoryCd == "066") {
								$li.find('.text-wrap .file').addClass('type009');
							} else {
								$li.find('.text-wrap .file').addClass(item.fileExtension?item.fileExtension.toLowerCase():'link');
							}

                            $li.find('.text-wrap a').text(item.contentsTextbookTitle);
                            $li.find('a').data('item',item);
                            $li.find('button').data('item',item);
                            $li.find('button.down').data('file-id',item.fileId);
                            if(item.scrapYn == 'Y'){
                                $li.find('button.scrap').addClass('on');
                            }
                            if(item.contentsType == 'MYDATA'){
                                $li.find('button.scrap').addClass('off');
                                if(item.contentsTextbookType == 'LINK'){// 선생님 공유자료 중 링크는 링크아이콘 표시
                                    $li.find('button.preview').addClass("link");
                                }
                            }
                            if(item.contentsTextbookType == 'LINK_PAGE'){// 선생님 공유자료 중 링크는 링크아이콘 표시
                                $li.find('.text-wrap .file').addClass('link');
                                $li.find('button.scrap').addClass('off');
                                $li.find('button.preview').addClass("link");
                            }
                            if(item.downloadYn == 'Y'){
                                $li.find('button.down').addClass('on');
                                $li.find('button.down').addClass('cmmFiledownloadId');  // 파일 다운로드
                                $li.find('input[name=checkAllContents]').removeAttr('disabled');
                            }

                            $('ul.all-contents').append($li);
                        });

                        $('.c_page').text(pg.v.page);
                        $('.m_page').text(Math.ceil(res.totalCnt / pg.v.pageRowCnt));

                        if($('.c_page').text() === $('.m_page').text() ){
                            $('.list-more').addClass('d-none');
                        } else {
                            $('.list-more').removeClass('d-none');
                        }
					}
				};

				$cmm.ajax(options);
		    },


		    //교과서 자료 모아보기 유형
		    getAllContentsType: function(){

				const options = {
					url: '/contents/textbook/allContentsType.ax',
					data: {
					    textbookSeq : pg.v.textbook.textbookSeq
					    , adminTextbookTypeCategoryCd: $('.tabs-all-contents li.on a').data('category')
					    , unitSeq: pg.v.unitSeq
                    },
					success: function(res) {
					    $('#info-tab2 .selTypeList').empty();
					    $('#info-tab2 .selTypeList').append(pg.v.contentsHtmlTab2Type.clone());

					    $.each(res.rows, function(idx, item) {
					        let $liContentsType = pg.v.contentsHtmlTab2Type.clone();

                            $($liContentsType[0]).data('type', item.adminTextbookTypeUseCd);
                            $($liContentsType[0]).prop('checked',false);
                            $($liContentsType[0]).attr('id', 'type'+item.adminTextbookTypeUseCd);
                            $($liContentsType[1]).text(item.contentsTextbookCategoryTitle);
                            $($liContentsType[1]).attr('for', 'type'+item.adminTextbookTypeUseCd);
                            $('#info-tab2 .selTypeList').append($liContentsType);
					    });
					}
				};

				$cmm.ajax(options);
		    },

		    //스크랩
		    scrap: function($item, type){
                $.ajax({
					url : "/Textbook/TextbookScrapJson.mrn",
					type : "get",
					cache : false,
					data : {
						"textbookSeq" : pg.v.textbook.textbookSeq,
						"contentsSeq" : $item.data('item').contentsTextbookSeq,
						"contentsTextbookCategoryCd" : $item.data('item').contentsTextbookCategoryCd,
						"contentsTextbookCategoryDiv" : type,
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
					},
					error : function() {
						alert("실패하였습니다.");
					}
				});
		    },

            // 교과서 차시별 추천자료 개수 (펼치기/접기 가능여부 조회)
            getRecommendContentCount :function(textbookSeq){
                return new Promise(function(resolve, reject){
                    $cmm.ajax({
                        url: '/contents/textbook/getViewerRecommendCount.ax',
                        data: {
                            textbookSeq: textbookSeq
                        },
                        success: function (res) {
                            let rows = res['rows'] || [];
                            let rcmdCntMap = {};
                            rows.map(function(item){
                                rcmdCntMap[item['textbookLessonSeq']] = item['recommendCount'];
                            });
                            pg.v.textbookRecmmdCntMap = rcmdCntMap;
                            // console.log(rcmdCntMap);
                            resolve();
                        }
                    });
                });
            },

		    //교과서 차시별 추천자료
		    getRecommendContents: function(textbookLessonSeq){

				const options = {
					url: '/contents/textbook/getRecommendContentList.ax',
					data: {
					    textbookLessonSeq :textbookLessonSeq
                    },
					success: function(res) {

                        $('ul.data-list li').remove();
                        $('ul.data-list').removeClass('d-none');

                        if(res.rows.length == 0){
                            $('.data-tit').addClass('d-none');
                        } else {
                            $('.data-tit').removeClass('d-none');
                        }

                        $.each(res.rows, function(idx, item) {
                            let $li = pg.v.contentsHtmlRecommendContents.clone();

                            $li.find('p.txt').text(item.title);
                            $li.data('item',item);
                            $li.find('.thumb img').attr('src', (item.thumbnail.indexOf('http')==0) ? item.thumbnail : $('#apiHostCms').val() + item.thumbnail);

                            $li.find('a.openPreview').data('data',item);

                            $('ul.data-list').append($li);

                            /* 최대 4개 노출 */
                            if(idx == 3) return false;
                        });

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
		    // 학년, 학기 변경시 보여질 교과서 선택
		    setDefaultTextbook: function(){

                let subjectList = $objData.getListFilter(pg.v.textbookList, 'grade', pg.v.grade);
                subjectList = $objData.getListFilter(subjectList, 'term', pg.v.term).concat($objData.getListFilter(subjectList, 'term', '00'));
                let subject =  $objData.getRowFilter(subjectList, 'subjectCd', pg.v.textbook.subjectCd);

				// 사회 5-1 => 5-2
                if(pg.v.changeTerm && pg.v.textbook.textbookSeq == 107){
                    subject = $objData.getRowFilter(pg.v.textbookList, 'textbookSeq', 108); // 사회 5-2
                    subject.grade = pg.v.grade;
                }
                // 사회 5-2 => 5-1
                else if(pg.v.changeTerm && pg.v.textbook.textbookSeq == 108){
                    subject = $objData.getRowFilter(pg.v.textbookList, 'textbookSeq', 107); // 사회 5-1
                    subject.grade = pg.v.grade;
                }
                // 사회 6-1 => 6-2
                else if(pg.v.changeTerm && pg.v.textbook.textbookSeq == 109){
                    subject = $objData.getRowFilter(pg.v.textbookList, 'textbookSeq', 110); // 사회 6-2
                    subject.grade = pg.v.grade;
                }
				// 사회 6-2 => 6-1
                else if(pg.v.changeTerm && pg.v.textbook.textbookSeq == 110){
                    subject = $objData.getRowFilter(pg.v.textbookList, 'textbookSeq', 109); // 사회 6-1
                    subject.grade = pg.v.grade;
                }

				// 사회과 부도
                if(pg.v.textbook.textbookSeq == 111 && (pg.v.grade == '05' || pg.v.grade == '06')){
                    subject = $objData.getRowFilter(pg.v.textbookList, 'textbookSeq', 111); // 사회과부도
                    subject.grade = pg.v.grade;
                }

				// 학기 변경일경우 초기화
				pg.v.changeTerm = false;

                if(!!subject){
                    pg.v.textbook = subject;
                } else {
                    pg.v.textbook = subjectList[0];
                }

                $cmm.changeBrowserAddressBarUrl('/Textbook/Curriculum.mrn/'+pg.v.textbook.textbookSeq);
		    },

            // 교과서 기본 정보
		    getTextbookInfo: function(){
		        let textbookSeq = window.location.href.split('/').pop().split('?')[0];
                let textbook = $objData.getRowFilter(pg.v.textbookList, 'textbookSeq', textbookSeq);

                if(window.localStorage.getItem('curriculum6GradeSo') == 'on' && textbookSeq == 111 ){
                    textbook.grade = '06';
                    window.localStorage.removeItem('curriculum6GradeSo');
                }

                if(!textbook){
                    location.href = '/Main/Main.mrn';
                    return false;
                }

                pg.v.textbook = textbook;
                pg.v.grade = textbook.grade;
                if(textbook.term != '00'){
                    pg.v.term = textbook.term;
                }

                $('.grade-select').text(Number(pg.v.grade)+'학년');
                $('.grade-select').data('gradeName', Number(pg.v.grade)+'학년');
                $('.semester a').removeClass('on');
                $('.semester [data-term='+pg.v.term+']').addClass('on');

                $('.curriculum-info .thumb img').attr('src', $('#apiHostCms').val() + '/cms/files/view/' + textbook.textbookThumbnailFileId);
                $('.curriculum-info .cont .year').text(textbook.textbookCurriculumRevCd+' 개정');
                $('.curriculum-info .cont .tit').text(textbook.textbookTitle);
                if(!$text.isEmpty(textbook.textbookMainAuth) && textbook.textbookSeq != 111){
                    $('.curriculum-info .cont .tit').append(' ('+textbook.textbookMainAuth+')');
                }
                if(textbook.myFavorites == 'Y'){
                    $('.book-register').text('즐겨찾기 해제');
                    $('.book-register').removeClass('off');
                } else {
                    $('.book-register').text('즐겨찾기 등록');
                    $('.book-register').addClass('off');
                }

                if(textbook.ebookUseYn == 'Y'){
                    $('.curriculum-info .cont .textbook-link a.book-go,a.book-copy').removeClass('d-none');
                } else {
                    $('.curriculum-info .cont .textbook-link a.book-go,a.book-copy').addClass('d-none');
                }

                /* E-book 수업 열기 */
                if(textbook.smartPptUseYn == 'Y' && !$text.isEmpty(textbook.smartPptUrl)){
                    $('.ebook-open').removeClass('d-none');
                } else {
                    $('.ebook-open').addClass('d-none');
                }

                /* E-book 수업 다운로드 */
                if(textbook.dvdUseYn == 'Y'){
                    $('.ebook-down').removeClass('d-none');
                } else {
                    $('.ebook-down').addClass('d-none');
                }

                /* 전체 파일 다운로드 */
                if(textbook.allUseYn == 'Y'){
                    $('.all-file-down').removeClass('d-none');
                } else {
                    $('.all-file-down').addClass('d-none');
                }

                pg.f.getTextbookList();
                pg.c.getTextbookDetail();
                pg.c.getTextbookEduList();
                pg.c.getTextbookContents();


                /* 수업하기 사용 여부 & url tab 체크 */
                let tab = $cmm.getUrlParams('tab');
                if(textbook.curriculumUseYn == 'Y'){

                    $('.tabs a[href="#info-tab1"]').parent().removeClass('d-none');

                    if(!!tab){
                        $('.tabs a[href="#info-tab'+tab+'"]').click();
                    } else {
                        $('.tabs a[href="#info-tab1"]').click();
                    }

                } else {

                    $('.tabs a[href="#info-tab1"]').parent().addClass('d-none');

                    $('.tabs a[href="#info-tab2"]').click();

                }



		    },

            // 학년 학기에 따른 교과서 목록
		    getTextbookList: function(){

                if(pg.v.grade == '05' || pg.v.grade == '06'){
                    /* 사회과 부도 학년 변경 */
                    let soSubject = $objData.getRowFilter(pg.v.textbookList, 'textbookSeq', 111); // 사회과부도
                    soSubject.grade = pg.v.grade;
                }

                let subjectList = $objData.getListFilter(pg.v.textbookList, 'grade', pg.v.grade);
                $('ul.subject li').remove();

                $.each(subjectList, function(idx, item) {

                    if(item.term == '00' || item.term == pg.v.term){

                        $li = pg.v.contentsHtmlSubject.clone();
                        let subjectNm = item.subjectNm;
                        if ( !$text.isEmpty(item.textbookMainAuth) ) {
                            subjectNm = subjectNm.concat(' ('+item.textbookMainAuth+')');
                        }
                        /* 사회과 부도 */
                        if(item.textbookSeq == 111 ){
                            subjectNm = '사회과 부도';
                        }
                        $li.find('a').text(subjectNm);
                        $li.find('a').data('seq',item.textbookSeq);
                        if(item.textbookSeq == pg.v.textbook.textbookSeq){
                            $li.find('a').addClass('on');
                        }
                        $('ul.subject').append($li);

                    }
                });
		    },

            // 학년 선택 닫기
            closeGradeList: function(){
                $('.grade-list').slideUp(150);
                $('.textbook-menu .grade-select').removeClass('on');
            },

            // 기본 학기 설정
            setDefaultTerm: function(){
                let month = new Date().getMonth()+1;
                if(month >= 2 && month <= 7){
                    pg.v.term = '01';
                } else {
                    pg.v.term = '02';
                }
            },

            // 자료 뷰어
            openViewer: function(type, item){
                if((type == 'MYDATA' && item['contentsTextbookType'] == 'LINK' )|| item['contentsTextbookType'] == 'LINK_PAGE'){
                    let url = item.fileId;
                    if(url.indexOf("http") < 0){
                        url = "https://"+url;
                    }
                    window.open(url, "_black");
                    return;
                }

                let previewUrl = '/Ebook/preview.mrn';
                let previewYoutube = '/Ebook/extraYou.mrn';
                let previewMediaLink = '/cms/smartppt/mpreview/mpreview.html';
                // 기존 뷰어
                // let previewUrl = '/viewer/preview.html';
                let w = 800;
                let h = 1000;
                switch (type) {
                  case 'TEXTBOOK':

                     // 동영상이면
                     if (item.contentsTextbookUseType == '002') {

                        if (item.contentsTextbookType == 'LINK') {
							previewUrl = '/Ebook/mpreview.mrn' + '?source=' + type + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&user='+ $('body').data('useridx') + '&contentsTextbookTextbookSeq=' + item.contentsTextbookSeq;
                        }
                        else if (item.contentsTextbookType == 'HLS') {
                            w = 900;
                            previewUrl = item.url;
                        }
						else if (item.contentsTextbookType == 'YOUTUBE') {
							previewUrl = previewYoutube + '?source=' + type + '&file=' + item.url + '&contentsTextbookSeq=' + item.contentsTextbookSeq + '&indexclose=N';
						}
                        else if (item.contentsTextbookType == 'FILE') {
							previewUrl = previewUrl + '?source=' + type + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookTextbookSeq=' + item.contentsTextbookSeq;
                        }
                     }
                     // 일반 파일이면
                     else {
                        previewUrl = previewUrl + '?source=' + type + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookTextbookSeq=' + item.contentsTextbookSeq;
                     }

                     break;
                  case 'UNIT':

                     // 동영상이면
                     if (item.contentsTextbookUseType == '002') {

                        if (item.contentsTextbookType == 'LINK') {
							previewUrl = '/Ebook/mpreview.mrn' + '?source=' + type + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&user='+ $('body').data('useridx') + '&contentsTextbookUnitSeq=' + item.contentsTextbookSeq;
                        }
						else if (item.contentsTextbookType == 'HLS') {
							w = 900;
							previewUrl = item.url;
						}
						else if (item.contentsTextbookType == 'YOUTUBE') {
							previewUrl = previewYoutube + '?source=' + type + '&file=' + item.url + '&contentsTextbookSeq=' + item.contentsTextbookSeq + '&indexclose=N';
						}
                        else if (item.contentsTextbookType == 'FILE') {
							previewUrl = previewUrl + '?source=' + type + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookUnitSeq=' + item.contentsTextbookSeq;
                        }

                     }
                     // 일반 파일이면
                     else {
                        previewUrl = previewUrl + '?source=' + type + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookUnitSeq=' + item.contentsTextbookSeq;
                     }

                     break;

                  case 'PERIOD':

                     // 동영상이면
                     if (item.contentsTextbookUseType == '002') {

						previewUrl = item.url;
                     }
                     // 일반 파일이면
                     else {
                        previewUrl = previewUrl + '?source=' + type + '&file=' + item.fileId + '&contentsTextbookUnitScrapYn='+item.scrapYn+'&contentsTextbookPeriodSeq=' + item.contentsTextbookSeq;
                     }

                     break;
                  case 'EXTRA':

                     previewUrl = previewUrl + '?source=' + type + '&file=' + item.fileId + '&indexclose=Y';

                     break;
                  default:
                     previewUrl = previewUrl + '?source=' + type + '&file=' + item.fileId + '&indexclose=Y';
                }

                // 미리보기
                   screenUI.f.winOpen(previewUrl, w, h, null, 'preview');

                // preview log 저장
                page_preview("TEXTBOOK", type, item.contentsTextbookSeq, null);

           },

            // 자료 모아보기 - 공통자료 선택 갯수
            setCmmContentsCheckNum: function(){
                let num = $('input[name=checkCmmContents]:checked').length;
                let size = 0;
                $.each($('input[name=checkCmmContents]:checked'), function(idx, item) {
                    let data = $(item).parent().parent().find("a").data("item");
                    size += data.fileSize;
                });

                $('.cmmCheckNum').text(`총 ${num}개 선택 (${$file.getFileSize(size)})`);
            },

            // 자료 모아보기 - 모든자료 선택 갯수
            setAllContentsCheckNum: function(){
                let num = $('input[name=checkAllContents]:checked').length;
                let size = 0;
                $.each($('input[name=checkAllContents]:checked'), function(idx, item) {
                    let data = $(item).parent().parent().find("a").data("item");
                    size += data.fileSize;
                });
                $('.cmmCheckAllNum').text(`총 ${num}개 선택 (${$file.getFileSize(size)})`);
            },

            // 자료 종류 탭 클릭
            getContentsTab: function($item){
                if($('#all-check-tab1').prop('checked')){
                    $('#all-check-tab1').click();
                }

                $('#unit-all').click();

            },

            // 자료 모아보기 유형 초기화
            initAllContentsType: function(){

                /* 자료 타입 URL로 지정 */
                let category = $cmm.getUrlParams('category');
                if( !!category && category < 5 ){
                    $(`.tabs-all-contents li:eq(${category}) a`).click();
                    $('html').scrollTop($('.tabs-all-contents').offset().top);
                } else {
                    $('.tabs-all-contents li:eq(0) a').click();

                }
                let url ='/Textbook/Curriculum.mrn/'+pg.v.textbook.textbookSeq+'?tab='+$cmm.getUrlParams('tab');
                $cmm.changeBrowserAddressBarUrl(url);
            },
            getZipFilelist: function(item, btnName){
                let useridx = $('body').data('useridx');
                var url = "/tms/viewer/preview";
                var params = { "fileId": item.fileId, userSeq: useridx };
                if (!item.fileId) {
                    alert("파일 정보가 없습니다. 다시 확인해주세요.");
                    return;
                }
                if (useridx == null || useridx == "") {
                    alert("로그인되지 않은 사용자에게 허가되지 않은 콘텐츠입니다. 로그인 후 이용해주세요.");
                    return;
                }
                $cmm.ui.loadingShow();
                let promise = common_promise(url, params);
                promise.then(function(data){
                    $cmm.ui.loadingHide();
                    // console.log(data);
                    if (data && data.type && (data.type == 'zip' || data.type == 'ZIP')) {
                        let zipList = data['zipList'] || [];
                        $("#pop_file_down .file-list").empty()
                        $("#pop_file_down .modal-head h2").html(btnName); // 모당창 타이틀 변경
                        zipList.map(function(item){
                            let temp = "<li><span>"+(item.file_name)+"</span>."+(item.extension)+"</li>";
                            $("#pop_file_down .file-list").append(temp);
                        });

                        if ('Y' != data.download_yn) {
                            alert("다운로드 할 수 없는 파일 입니다.");
                            return;
                        }

                        if (!data.download_url) {
                            alert("잘못된 데이터이거나 아직 처리 중인 데이터입니다.\n잠시 후에 다시 시도해주세요.");
                            return;
                        }
                        if(zipList.length > -1){
                            $("#zipFileDown").off();
                            $("#zipFileDown").on('click', function(){
                                downloadMessage();
                                download_file(data.download_url, data.title);
                                $('#pop_file_down .b-close').trigger('click');
                            });

                            $('#pop_file_down').bPopup({
                                opacity: 0.5,
                                follow: [true, false],
                                escClose: false,
                                modalClose: true,
                            });
                        }
                    }else{
                        alert("잘못된 데이터이거나 아직 처리 중인 데이터입니다.\n잠시 후에 다시 시도해주세요.");
                        return;
                    }
                }, function(){alert("잘못된 데이터이거나 아직 처리 중인 데이터입니다.\n잠시 후에 다시 시도해주세요."); $cmm.ui.loadingHide();});
            }
		},

		/**
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
		        $this.parent().find('.tab-container').children('.tab-cont').stop(true,true).hide().first().show();
		        $this.children('li').first().addClass('on').stop(true,true).show();
		    });
		    $tabsNavLis.on('click', function(e) {
		        var $this = $(this);
		        $this.siblings().removeClass('on').end().addClass('on');
		        $this.parent().siblings('.tab-container').children('.tab-cont').stop(true,true).hide().siblings( $this.find('a').attr('href') ).fadeIn(300);
		        e.preventDefault();

		        if($this.parent().parent().hasClass('textbook-info')){
		            let url = '/Textbook/Curriculum.mrn/'+pg.v.textbook.textbookSeq+'?tab='+$this.find('a').attr('href').replace('#info-tab','');
		            let category = $cmm.getUrlParams('category');
		            if(!!category){
		                url += '&category='+category;
		            }

		            $cmm.changeBrowserAddressBarUrl(url);
		        }

                // 자료 종류 탭
		        if($this.parent().hasClass('tabs-all-contents')){
                    pg.f.getContentsTab($(e.target));
		        }

		    });

			$('.textbook-menu .grade-select').on('click', function(e){
				e.preventDefault();
				$(this).addClass('on').next('.grade-list').slideDown(150);
		    });
		    $('.textbook-menu .grade-close').on('click', function(){
		        pg.f.closeGradeList();
		    });

		    $('html').click(function(e) { if( !$('.grade').has(e.target).length ) {
		        $('.grade-list').slideUp(150);
				$('.textbook-menu .grade-select').removeClass('on');
		    }});

            let month = new Date().getMonth()+1;
            if(month == 2 || month == 3 || month == 8 || month == 9){ // 자료모아보기_공통자료 : 학기 초만 펼치기 활성화 (엠티처-운영/458)
                $('.list-toggle > li.active').addClass('on').children('.cont').show();
            }
			$(document).on("click",".list-toggle > li > .tit-wrap > .tit",function (e) {
				var ele = $(this).parent().parent('li');
				if (ele.hasClass('on')) {
					ele.removeClass('on');
					ele.children('.cont').slideUp(200);
				}
				else {
					ele.addClass('on');
					ele.children('.cont').slideDown(200);
					ele.siblings('li').children('.cont').slideUp(200);
					ele.siblings('li').removeClass('on');
				}
			});

			// 모든 단원 펼침 on/off
			$('.switch-fold').click(function(){
		        if (!$(this).hasClass('on')) {
					$(this).parent().next('.list-toggle').children('li').addClass('on').children('.cont').slideDown(200);
		            $(this).addClass('on');
		            window.localStorage.setItem('curriculumSwitchFold', 'on');
		        }else{
					$(this).parent().next('.list-toggle').children('li').removeClass('on').children('.cont').slideUp(200);
		            $(this).removeClass('on');
		            window.localStorage.removeItem('curriculumSwitchFold');
		        }
		    });

			$('.list-inner-toggle li.active').addClass('on').children('.cont').show();

			// 차시 텍스트 클릭
			$(document).on("click",".list-inner-toggle li .tit-wrap .tit a",function (e) {
                e.stopPropagation();
				var iele = $(this).parent().parent().parent('li');
                /* 수업 열기 */
                iele.find('.lesson-open').click();
			});

			// 차시 클릭
			$(document).on("click",".list-inner-toggle li .tit-wrap .tit.recommend",function (e) {
                var iele = $(this).parent().parent('li');
				if (iele.hasClass('on')) {
					iele.removeClass('on');
					iele.children('.cont').slideUp(200);
				}
				else {
					iele.addClass('on');
					iele.children('.cont').slideDown(200);
					iele.siblings('li').children('.cont').slideUp(200);
					iele.siblings('li').removeClass('on');
			    }

                pg.c.getRecommendContents($(iele).data('item').textbookLessonSeq);
			});

			// 단원 공통 자료
            $(document).on("click",".textbook-info .common-data .btn-data",function (e) {
                $('.common-wrap').fadeOut(300);
                pg.c.getUnitContents($(this));
		    });

		    // 단원 공통 자료 닫기
		    $(document).on("click",".textbook-info .common-data .data-close",function (e) {
		        $(this).removeClass('on').parent('.common-wrap').fadeOut(300);
				$(this).parent().parent().removeClass('on');
		    });

		    $('html').click(function(e) { if( !$('.common-data').has(e.target).length ) {
		        $('.common-wrap').fadeOut(300);
				$('.common-data').removeClass('on');
		    }});

            // 특화자료
            $(document).on("click",".link-group a ",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                let info = $(this).data("info");
                let previewUrl = '/Ebook/preview.mrn';
                let w = 800;
                let h = 1000;

                if (info.contentsTextbookType == 'FILE') {
                    let filename = (info.contentsTextbookShowFileName).toLowerCase();
                    if(filename.indexOf(".zip") > -1){ // 압축파일인 경우
                        pg.f.getZipFilelist(info, $(this).html());
                        return;
                    }

                    previewUrl = previewUrl + '?source=TEXTBOOK&file=' + info.fileId + '&contentsTextbookTextbookSeq=' + info.contentsTextbookUrl;
                       screenUI.f.winOpen(previewUrl, w, h, null, 'preview');
                       history_save({logDiv:"TEXTBOOK",targetModule:"TEXTBOOK",targetAction:"PREVIEW",targetKey1:info.contentsTextbookSeq},'','');
                } else {
                   var win = window.open(info.contentsTextbookUrl, '_blank');
                   win.focus();
                }
            });

            // 학년 변경
            $(document).on("click",".grade-list ul li a ",function (e) {

                pg.v.grade = $(this).data("grade");

                // 변경된 학년의 첫번째 교과서 정보 세팅
                pg.f.setDefaultTextbook();

                // 교과서 기본 정보 세팅
                pg.f.getTextbookInfo();

                // 학년 선택창 닫기
                pg.f.closeGradeList();
            });

            // 학기 변경
            $(document).on("click",".semester a ",function (e) {

                pg.v.term = $(this).data("term");

                // 학기 변경일경우 true
				pg.v.changeTerm = true;

                // 변경된 학기의 첫번째 교과서 정보 세팅
                pg.f.setDefaultTextbook();

                // 교과서 기본 정보 세팅
                pg.f.getTextbookInfo();

            });

            // 교과서 선택
            $(document).on("click",".subject a ",function (e) {

                let textbookSeq = $(this).data("seq");
                let url = '/Textbook/Curriculum.mrn/'+textbookSeq+'?tab='+$cmm.getUrlParams('tab');
                let category = $cmm.getUrlParams('category');
                if(!!category){
                    url += '&category='+category;
                }
                $cmm.changeBrowserAddressBarUrl(url);

                // 교과서 기본 정보 세팅
                pg.f.getTextbookInfo();

            });

            // 교과서 등록,해제
            $(document).on("click",".book-register",function (e) {

                if($(this).hasClass('cmmLoginConfirm')) return;

                if($(this).hasClass('off')){
                    pg.c.insFavorites();
                } else {
                    pg.c.delFavorites();
                }

            });

            // 교과서 바로보기
            $(document).on("click",".book-go",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                window.open(pg.v.textbook.ebookUrl);
            });

			// 교과서 링크 복사
            new ClipboardJS('.book-copy', {
                text: function(trigger) {
					if($(trigger).hasClass('cmmLoginConfirm')) return;
                    return pg.v.textbook.ebookUrl;
                }
            }).on('success', function () {
				$msg.alert(lng.msg.copyLink);
            });

            // E-book 수업 열기
            $(document).on("click",".ebook-open",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                window.open(pg.v.textbook.smartPptUrl);
            });

            // E-book 수업 다운로드
            $(document).on("click",".ebook-down",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                if(pg.v.textbook.dvdContentsTextbookType == 'FILE'){
                    var paramBuf = "<input type='hidden' name='fileId' value='"+ pg.v.textbook.dvdFileId +"' >";
                    $("#idDownload").html(paramBuf);
                    document.downloadForm.action = "/File/FileDown.mrn";
                    document.downloadForm.submit();
                } else {
                    downloadMessage();
                	location.href = pg.v.textbook.dvdContentsTextbookUrl;
                }
            });

            // 전체 파일 다운로드
            $(document).on("click",".all-file-down",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                if(pg.v.textbook.allContentsTextbookType == 'FILE'){
                    var paramBuf = "<input type='hidden' name='fileId' value='"+ pg.v.textbook.allFileId +"' >";
                    downloadMessage();
                    $("#idDownload").html(paramBuf);
                    document.downloadForm.action = "/File/FileDown.mrn";
                    document.downloadForm.submit();
                } else {
                    downloadMessage();
                	location.href = pg.v.textbook.allContentsTextbookUrl;
                }
            });

            // 짝꿍교과서 열기 (수학익힘)
            $(document).on("click",".math-study",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                let item = $(e.target).closest('li').data('item');
                let filerole = $(e.target).data('file-role');
                let previewUrl = '/Ebook/v.mrn?playlist=' + item.textbookLessonSeq + '&filerole='+filerole+'&start=' + item.textbookLessonSubjectSeq;
                screenUI.f.winOpen(previewUrl, window.screen.width-10, window.screen.height-10, null, 'popCurriculumPageTypeM');
            });

            // 수업 열기
            $(document).on("click",".lesson-open",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;
                if($(this).hasClass('d-none')) return;

                let item = $(e.target).closest('li').data('item');

                // 교사가 마지막으로 사용한 차시 하이라이트 하기 위해 localStorage 이용
                let textbookSeq = window.location.href.split('/').pop().split('?')[0];
                window.localStorage.setItem('curriculum'+textbookSeq, item.textbookLessonSeq);

				// 차시창
                let previewUrl = '';
                // 수업하기 다른 페이지
				if(item.smartpptOtherUrlYn=='Y'){
                    previewUrl = item.smartpptOtherUrl;
				}
				// 차시창
				else {
					previewUrl = '/Textbook/PopPeriod.mrn?playlist=' + item.textbookLessonSeq;
				}

				// as-is
				// let previewUrl = $('#viewerHost').val() + '/viewer/v.html?playlist=' + item.textbookLessonSeq + '&user=' + $('body').data('useridx');

				// 새탭
				window.open(previewUrl, '_blank');

				// as-is
                // screenUI.f.winOpen(previewUrl, window.screen.width-10, window.screen.height-10, null, 'popCurriculumPage');

            });

            // 단원 공통 자료
            $(document).on("click",".common-list a",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;

                pg.f.openViewer("UNIT", $(e.target).data('item'));
            });

            // 자료 모아보기 - 공통자료 전체 선택
            $(document).on('change', '#all-check1', function (e) {
                let checked = $('#all-check1').prop('checked');
                $('input[name=checkCmmContents]:not(:disabled)').prop('checked', checked);
                pg.f.setCmmContentsCheckNum();
            });

            // 자료 모아보기 - 모든자료 전체 선택
            $(document).on('change', '#all-check-tab1', function (e) {
                let checked = $('#all-check-tab1').prop('checked');
                $('input[name=checkAllContents]:not(:disabled)').prop('checked', checked);
                pg.f.setAllContentsCheckNum();
            });

            // 자료 모아보기 - 공통자료 선택
            $(document).on('change', 'input[name=checkCmmContents]', function (e) {
                pg.f.setCmmContentsCheckNum();
            });

            // 자료 모아보기 - 모든자료 선택
            $(document).on('change', 'input[name=checkAllContents]', function (e) {
                pg.f.setAllContentsCheckNum();
            });

            // 자료 모아보기 - 선택한 공통자료 다운로드
            $(document).on('click', '.cmmMultiDownload', function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                let num = $('input[name=checkCmmContents]:checked').length;

                if(num <=1){
                    $msg.alert(num == 0 ? '선택할 항목을 먼저 체크해 주세요.' : '2개 이상의 자료를 선택해 주세요.');
                    return;
                }

	            downloadMessage();

	            var paramBuf = "";

	            $.each($('input[name=checkCmmContents]:checked'), function(idx, item) {
                    let data = $(item).parent().parent().find("a").data("item");
                    paramBuf += "<input type='hidden' name='fileId' value='"+ data.fileId +"' >";

                    page_download("TEXTBOOK", "TEXTBOOK", data.contentsTextbookSeq, null);
	            });

            	$("#idDownload").html(paramBuf);

	            $("#filename").val(pg.v.textbook.textbookTitle);

	            document.downloadForm.action = "/File/FileDownMulti.mrn";
	            document.downloadForm.submit();

            });

            // 자료 모아보기 - 선택한 전체자료 다운로드
            $(document).on('click', '.allMultiDownload', function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                let num = $('input[name=checkAllContents]:checked').length;

                if(num <=1){
                    $msg.alert(num == 0 ? '선택할 항목을 먼저 체크해 주세요.' : '2개 이상의 자료를 선택해 주세요.');
                    return;
                }

	            downloadMessage();

	            var paramBuf = "";

	            $.each($('input[name=checkAllContents]:checked'), function(idx, item) {
                    let data = $(item).parent().parent().find("a").data("item");
                    paramBuf += "<input type='hidden' name='fileId' value='"+ data.fileId +"' >";

                    page_download("TEXTBOOK", data.contentsType, data.contentsTextbookSeq, null);
	            });

            	$("#idDownload").html(paramBuf);

                let filename = pg.v.textbook.textbookTitle + ' ' + $('.tabs-all-contents li.on a').text() + ' ' + $('.selUnitList [name=selContentsUnit]:checked').next().text();

                if($('.selTypeList [name=selContentsType]:checked').index() > 0){
                    filename += ' ' + $('.selTypeList [name=selContentsType]:checked').next().text();
                }

	            $("#filename").val(filename);

	            document.downloadForm.action = "/File/FileDownMulti.mrn";
	            document.downloadForm.submit();

            });

            // 자료 모아보기 - 선택한 공통자료 스크랩
            $(document).on('click', '.cmmMultiScrap', function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                let num = $('input[name=checkCmmContents]:checked').length;

                if(num <= 0){
                    $msg.alert('선택할 항목을 먼저 체크해 주세요.');
                    return;
                }

	            $.each($('input[name=checkCmmContents]:checked'), function(idx, item) {
                   $(item).parent().parent().parent().find(".scrap").click();
	            });
            });

            // 자료 모아보기 - 선택한 전체자료 스크랩
            $(document).on('click', '.allMultiScrap', function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                let num = $('input[name=checkAllContents]:checked').length;

                if(num <= 0){
                    $msg.alert('선택할 항목을 먼저 체크해 주세요.');
                    return;
                }

	            $.each($('input[name=checkAllContents]:checked'), function(idx, item) {
                   $(item).parent().parent().parent().find(".scrap").click();
	            });
            });

            // 자료 모아보기 - 공통자료 미리보기
            $(document).on("click",".textbook-contents .text-wrap a, .textbook-contents button.preview",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;

                pg.f.openViewer("TEXTBOOK", $(e.target).data('item'));
            });

            // 자료 모아보기 - 전체자료 미리보기
            $(document).on("click",".all-contents .text-wrap a, .all-contents button.preview",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;

                pg.f.openViewer($(e.target).data('item').contentsType, $(e.target).data('item'));
            });

            // 자료 모아보기 - 공통자료 스크랩
            $(document).on("click",".textbook-contents button.scrap",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                pg.c.scrap($(e.target), 'TEXTBOOK');
            });

            // 자료 모아보기 - 모든자료 스크랩
            $(document).on("click",".all-contents button.scrap:not(.off)",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                pg.c.scrap($(e.target), $(e.target).data('item').contentsType);
            });

            // 자료 모아보기 - 더보기
            $(document).on('click', '.list-more .more', function (e) {
                pg.v.page += 1;
                pg.c.getAllContents();
            });

            // 자료 모아보기 - 단원 선택
            $(document).on('click', '.selUnitList input[name=selContentsUnit]', function (e) {
                if($('#all-check-tab1').prop('checked')){
                    $('#all-check-tab1').click();
                }

                //중단원 있으면 보여주기
                let $midList = $('[data-high='+ $(e.target).data('seq')+']');
                $('.selMidUnitList').children().addClass('d-none');
                if($midList.length>0){
                    $('.mid-unit').removeClass('d-none');
                    $midList.removeClass('d-none');
                    $midList.eq(0).click();
                } else {
                    $('.mid-unit').addClass('d-none');
                    if(!!$(e.target).data('seq')){
                        pg.v.unitSeq = $(e.target).data('seq');
                    } else {
                        pg.v.unitSeq = null;
                    }

                    pg.c.getAllContentsType();
                    $('#type-all').click();
                }

            });

            // 자료 모아보기 - 중단원 선택
            $(document).on('click', '.selMidUnitList input[name=selContentsMidUnit]', function (e) {
                if($('#all-check-tab1').prop('checked')){
                    $('#all-check-tab1').click();
                }

                if(!!$(e.target).data('seq')){
                    pg.v.unitSeq = $(e.target).data('seq');
                } else {
                    pg.v.unitSeq = null;
                }

                pg.c.getAllContentsType();
                $('#type-all').click();
            });

            // 자료 모아보기 - 유형 선택
            $(document).on('click', '.selTypeList input[name=selContentsType]', function (e) {
                if($('#all-check-tab1').prop('checked')){
                    $('#all-check-tab1').click();
                }

                if(!!$(e.target).data('type')){
                    pg.v.adminTextbookTypeUseCd = $(e.target).data('type');
                } else {
                    pg.v.adminTextbookTypeUseCd = null;
                }

                pg.v.page =1;
                pg.c.getAllContents();
            });

            // 추천 자료
            $(document).on('click', 'a.openPreview .thumb img, a.openPreview p.txt', function (e) {

                if($(e.target).closest('li').hasClass('cmmLoginConfirm')) return;
                if($(e.target).closest('li').hasClass('cmmTeacherConfirm')) return;

                const item = $(this).parents('a.openPreview').data('data');

				// 신규
				let previewUrl = '/Ebook/preview.mrn';
				let previewYoutube = '/Ebook/extraYou.mrn';
				let previewMediaLink = '/cms/smartppt/mpreview/mpreview.html';

				let w = 800;
				let h = 1000;

				if (item.dataType == 'AICLASS') {
                    var winAiclass = window.open(item.url, '_blank');
                    winAiclass.focus();
                    return false;
				}
				else if (item.dataType == 'TEXTBOOK') {

					previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookSeq=' + item.contentsTextbookSeq + '&indexclose=N';

					if (item.contentsUseType == '002') {

						if (item.contentsType == 'LINK') {
							previewUrl = previewMediaLink + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookSeq=' + item.contentsTextbookSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'HLS') {
							w = 900;
							previewUrl = item.url;
						}
						else if (item.contentsType == 'YOUTUBE') {
							previewUrl = previewYoutube + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookSeq=' + item.contentsTextbookSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'FILE') {
							previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookSeq=' + item.contentsTextbookSeq + '&indexclose=N';
						}

					} else {
						previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookSeq=' + item.contentsTextbookSeq + '&indexclose=N';
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
							previewUrl = previewMediaLink + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookPeriodScrapYn='+item.scrapYn+'&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'HLS') {
							w = 900;
							previewUrl = item.url;
						}
						else if (item.contentsType == 'YOUTUBE') {
							previewUrl = previewYoutube + '?source=' + item.dataType + '&file=' + item.url + '&contentsTextbookPeriodScrapYn='+item.scrapYn+'&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=N';
						}
						else if (item.contentsType == 'FILE') {
							previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&contentsTextbookPeriodScrapYn='+item.scrapYn+'&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=N';
						}
					} else {
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
					previewUrl = '/cms/smartppt/html/social/special/main.html?tc_addr='+$('#tcAddr').val()+'&sc_name='+$('#scName').val()+'&referer=web&subjectCode='+ item.url;
					w = window.screen.width-10;
					h = window.screen.height-10;
				} else if (item.dataType == 'EXTRA') {

					if (item.contentsUseType == '002') {

						if (item.contentsType == 'LINK') {
							previewUrl = previewMediaLink + '?source=' + item.dataType + '&file=' + item.url + '&indexclose=N';
						}
						else if (item.contentsType == 'HLS') {
							w = 900;
							previewUrl = item.url;
						}
						else if (item.contentsType == 'YOUTUBE') {

							previewUrl = previewYoutube + '?source=' + item.dataType + '&file=' + item.url + '&indexclose=N';
						}
						else if (item.contentsType == 'FILE') {
							previewUrl = previewUrl + '?source=' + item.dataType + '&file=' + item.fileId + '&indexclose=N';
						}

					} else {
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

		    // 학기 설정
		    pg.f.setDefaultTerm();

            // html contents 복제 - 학년
            pg.v.contentsHtmlGrade =  $('.grade-list ul li').clone();

            // html contents 복제 - 과목
            pg.v.contentsHtmlSubject =  $('ul.subject li').clone();

            // html contents 복제 - 단원
            pg.v.contentsHtmlUnit =  $('#info-tab1 .list-toggle li.liUnit').clone();

            // html contents 복제 - 특화자료
            pg.v.contentsHtmlSpecial =  $('.link-group li').clone();

            // html contents 복제 - 단원공통자료
            pg.v.contentsHtmlCmmContents = $('li.liUnit .common-list li:eq(0)').clone();

            // html contents 복제 - 추천 자료
            pg.v.contentsHtmlRecommendContents = $('ul.data-list li:eq(0)').clone();

            // html contents 복제 - 자료 모아보기 - 공통자료
            pg.v.contentsHtmlTextbookContents = $('ul.textbook-contents li:eq(0)').clone();

            // html contents 복제 - 자료 모아보기 - (단원)
            pg.v.contentsHtmlTab2Unit = $('#info-tab2 .selUnitList').children().clone();

            // html contents 복제 - 자료 모아보기 - (중단원)
            pg.v.contentsHtmlTab2MidUnit = $('#info-tab2 .selMidUnitList').children().clone();

            // html contents 복제 - 자료 모아보기 - (유형)
            pg.v.contentsHtmlTab2Type = $('#info-tab2 .selTypeList').children().clone();

            // html contents 복제 - 자료 모아보기 - 전체자료
            pg.v.contentsHtmlTextbookAllContents = $('ul.all-contents li:eq(0)').clone();

			// Event 정의 실행
			pg.event();

            //교과서 기본 정보
            pg.c.getTextbookBase();

		}
	};

	pg.init();
	window.screen = screen;
});
