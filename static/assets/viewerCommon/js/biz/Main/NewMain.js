let screen;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			item : null
			, _today: new Date()
			, scGrade: $('body').data('scGrade')
			, divHtml: new Array()
			, tab1ItemHtml : null
			, tab2ItemHtml : null
			, tab3ItemHtml : null
			, tab4ItemHtml : null
			, typeCSeq : [647, 648, 649, 650]   //  공통코드(TBL_CODE) SEQ 미래엔 교과서(647), 엠티처 서비스(648), 모든 교과서(649), 나만의 즐겨찾기(650)
			, curriIconMap: {"과학":"ico ico-fav-si", "국어": "ico ico-fav-ko", "도덕": "ico ico-fav-do", "미술": "ico ico-fav-art"
				, "사회": "ico ico-fav-so", "수학": "ico ico-fav-math", "실과": "ico ico-fav-sl", "음악": "ico ico-fav-mus", "체육": "ico ico-fav-phy"}
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

            // 즐겨찾기  기본 목록 가져오기
			getFavoritesListDefault: function() {

				const options = {
					url: '/main/favoritesListDefault.ax',
					data: {
                        grade: $('#tab1Grade').val(),
                        term: $('#tab1Term').val()
                    },
					success: function(res) {

						if (!!res.rows) {

                            // 즐겨찾기 항목 만들기
                            screen.f.makeFavoriteDiv(res.rows);

						}
					}
				};

				$cmm.ajax(options);

			},

	        // 즐겨찾기 목록 가져오기
			getFavoritesList: function() {

				const options = {
					url: '/main/favoritesList.ax',
					data: {
                        grade: $('#tab1Grade').val(),
                        term: $('#tab1Term').val()
                    },
					success: function(res) {

						if (!!res.rows) {

						    // 사용자가 저장한 목록이 없는 경우 기본 세팅값 보여주기
						    if(res.rows.length == 0){
						        screen.c.getFavoritesListDefault();
						        return;
						    }

                            // 즐겨찾기 항목 만들기
							screen.f.makeFavoriteDiv(res.rows);

						}
					}
				};

				$cmm.ajax(options);

			},

			// 즐겨찾기 - 미래엔 교과서 목록 가져오기
			getFavoritesTextbook: function() {

				const options = {
					url: '/main/favoritesTextbook.ax',
					data: {
                        grade: $('#tab1Grade').val(),
                        term: $('#tab1Term').val()
                    },
					success: function(res) {
						if (!!res.rows) {

							$('#setup-tab1 .bookmark-select a').remove();

							// 즐겨찾기 미래엔 교과서
							$.each(res.rows, function(idx, item) {
                                let $textbook = screen.v.tab1ItemHtml.clone();
                                $textbook.addClass(item.onClass);
                                $textbook.find('.tit').text(item.textbookTitle);
                                $textbook.data('fkSeq', item.textbookSeq);
                                $textbook.data('typeCSeq', screen.v.typeCSeq[0]);
								let curriTxt = (item.textbookTitle).substring(0,2);
								let icon = screen.v.curriIconMap[curriTxt];
								$textbook.find('i').removeClass().addClass(icon);
                                $('#setup-tab1 .bookmark-select').append($textbook);
							});
						}
					},
					beforeSend: function(){} // 모달쪽 데이터 불러오는 동안 로딩바 뜨고있어 화면 느려보여 로딩바 비호출 하도록 빈함수값 전달

				};

				$cmm.ajax(options);

			},

			// 즐겨찾기 - 엠티처 메뉴 그룹 목록 가져오기
			getFavoritesGnbGroup: function() {

				const options = {
					url: '/main/favoritesGnbGroup.ax',
					data: null,
					success: function(res) {
						if (!!res.rows) {

                            // 콤보 셋팅
                            $combo.bind(res.rows, '#tab2Group', '', '', 'name', 'seq');

						}
					},
					beforeSend: function(){} // 모달쪽 데이터 불러오는 동안 로딩바 뜨고있어 화면 느려보여 로딩바 비호출 하도록 빈함수값 전달
				};

				$cmm.ajax(options);

			},

			// 즐겨찾기 - 엠티처 메뉴 목록 가져오기
			getFavoritesGnb: function() {

				const options = {
					url: '/main/favoritesGnb.ax',
					data: {
					    parentSeq: $('#tab2Group').val()
					},
					success: function(res) {
						if (!!res.rows) {

							$('#setup-tab2 .bookmark-select a').remove();

							// 즐겨찾기 - 엠티처 메뉴
							$.each(res.rows, function(idx, item) {
                                let $textbook = screen.v.tab1ItemHtml.clone();
                                $textbook.addClass(item.onClass);
                                $textbook.find('.tit').html(item.webName2);
                                $textbook.data('fkSeq', item.seq);
                                $textbook.data('typeCSeq', screen.v.typeCSeq[1]);
                                $('#setup-tab2 .bookmark-select').append($textbook);
							});

						}
					},
					beforeSend: function(){} // 모달쪽 데이터 불러오는 동안 로딩바 뜨고있어 화면 느려보여 로딩바 비호출 하도록 빈함수값 전달
				};

				$cmm.ajax(options);

			},

			// 즐겨찾기 - 모든 교과서 목록 가져오기
			getFavoritesOrderTextbook: function() {

				const options = {
					url: '/main/favoritesOrderTextbook.ax',
					data: {
                        grade: $('#tab3Grade').val(),
                        subject: $('#tab3Subject').val()
                    },
					success: function(res) {
						if (!!res.rows) {

                            $('#setup-tab3 .bookmark-select a').remove();

                                // 즐겨찾기 모든 교과서
                                $.each(res.rows, function(idx, item) {
                                    let $textbook = screen.v.tab3ItemHtml.clone();
                                    $textbook.addClass(item.onClass);
                                    $textbook.find('.tit').text(item.textbookTitle);
                                    if($text.isEmpty(item.author)){
                                        $textbook.find('.txt').text('미래엔');
                                    }else {
                                        $textbook.find('.txt').text(item.author);
                                    }
                                    $textbook.data('fkSeq', item.tftSeq);
                                    $textbook.data('typeCSeq', screen.v.typeCSeq[2]);
                                    $('#setup-tab3 .bookmark-select').append($textbook);
                                });
						}
					},
					beforeSend: function(){} // 모달쪽 데이터 불러오는 동안 로딩바 뜨고있어 화면 느려보여 로딩바 비호출 하도록 빈함수값 전달
				};

				$cmm.ajax(options);

			},

			// 즐겨찾기 - 나만의 즐겨찾기 목록 가져오기
			getFavoritesMy: function() {

				const options = {
					url: '/main/favoritesMy.ax',
					data: null,
					success: function(res) {
						if (!!res.rows) {

                            $('#setup-tab4 .my-bookmark li.my-item').remove();

                                // 즐겨찾기 모든 교과서
                                $.each(res.rows, function(idx, item) {
                                    let $textbook = screen.v.tab4ItemHtml.clone();
                                    $textbook.find('.tit').text(item.urlNm);
                                    $textbook.data('fmaSeq',item.fmaSeq);
                                    $('#setup-tab4 .my-bookmark li:last-child').before($textbook);
                                });
						}
					},
					beforeSend: function(){} // 모달쪽 데이터 불러오는 동안 로딩바 뜨고있어 화면 느려보여 로딩바 비호출 하도록 빈함수값 전달
				};

				$cmm.ajax(options);

			},

			// 즐겨찾기 추가
			insFavorites: function($item) {

				const options = {
					url: '/main/insFavorites.ax',
					data: {
					    typeCSeq: $item.data('typeCSeq')
					    , fkSeq: $item.data('fkSeq')
					},
					success: function(res) {

                        // 미래엔 교과서인 경우 내 교과서도 등록
                        if($item.data('typeCSeq') == 647){

                            // 내 교과서에도 추가
                            const options3 = {
                                url: '/myClass/insMyTextbook.ax',
                                data: {
                                    fkSeq: $item.data('fkSeq')
                                },
                                success: function(res) {

                                    screen.c.getFavoritesList();
                                }
                            };

                            $cmm.ajax(options3);

                        } else {
                            screen.c.getFavoritesList();
                        }
					}
				};

				$cmm.ajax(options);

			},

			// 즐겨찾기 삭제
			delFavorites: function($item) {
				const options = {
					url: '/main/delFavorites.ax',
					data: {
					    typeCSeq: $item.data('typeCSeq')
					    , fkSeq: $item.data('fkSeq')
					},
					success: function(res) {

                        // 내 교과서도 삭제
                        const options = {
                            url: '/myClass/delMyTextbook.ax',
                            data: {
                                fkSeq: $item.data('fkSeq')
                            },
                            success: function(res) {
                                screen.c.getFavoritesList();
                            }
                        };
                        $cmm.ajax(options);
					}
				};

				$cmm.ajax(options);

			},

			// 나만의 즐겨찾기 추가
			insMyFavorites: function($item) {
                let myUrl = $('#myUrl').val();
                if( !$cmm.isValidUrl($('#myUrl').val()) ){
                    myUrl = 'https://'+ myUrl;
                }

				const options = {
					url: '/main/insMyFavorites.ax',
					data: {
					    urlNm: $('#myUrlNm').val()
					    , url: myUrl
					},
					success: function(res) {

                        let $textbook = screen.v.tab4ItemHtml.clone();
                        $textbook.find('.tit').text($('#myUrlNm').val());
                        $textbook.data('fmaSeq',res.row.fmaSeq);
                        $('#setup-tab4 .my-bookmark li:last-child').before($textbook);

					    $('#myUrlNm').val('');
					    $('#myUrl').val('');
                        screen.c.getFavoritesList();
					}
				};

				$cmm.ajax(options);

			},

			// 나만의 즐겨찾기 삭제
			delMyFavorites: function($item) {
				const options = {
					url: '/main/delMyFavorites.ax',
					data: {
					    fmaSeq: $item.parent('li').data('fmaSeq')
					},
					success: function(res) {

					    $item.parent('li').remove();
                        screen.c.getFavoritesList();
					}
				};

				$cmm.ajax(options);

			},

			// 추천 콘텐츠 - 오늘의 수업 영상
			getMainRecommendContentTab1: function() {

				const options = {
					url: '/main/getMainRecommendContentTab1.ax',
					data: {
					    grade: $('#selGrade').val()
					},
					success: function(res) {
						if (!!res.rows) {

							$('.recommend-list').removeClass('d-none');

                            $('#re-tab1 .recommend-list li').remove();
                            $.each(res.rows, function(idx, item) {
                                $li = screen.v.recommendItemHtml.clone();
                                $li.find('a').data('item', item);
                                $li.find('a').data('viewer', true);
                                $li.find('p.txt').text(item.contentsTextbookPeriodTitle);
                                $li.find('img').attr('src',item.thumbnail);
                                $li.find('span.label').text(item.textbookTitle);

                                $('#re-tab1 .recommend-list').append($li);
                                /* 최대 12개 노출 */
                                if(idx == 11) return false;
                            });
						}
					}
				};

				$cmm.ajax(options);

			},

			// 추천 콘텐츠 - 국어기초학습/음악 제재곡 듣기
			getMainRecommendContentTab2: function() {

				const options = {
					url: '/main/getMainRecommendContentTab2.ax',
					data: {
					    grade: $('#selGrade').val()
					},
					success: function(res) {

						$('.recommend-list').removeClass('d-none');

					    if($('#selGrade').val()=='01' || $('#selGrade').val()=='02'){
					        $('#re-tab2_title').text('국어기초학습');
					    } else {
					        $('#re-tab2_title').text('음악 제재곡 듣기');
					    }
						if (!!res.rows) {

                            $('#re-tab2 .recommend-list li').remove();
                            $.each(res.rows, function(idx, item) {
                                $li = screen.v.recommendItemHtml.clone();
                                $li.find('a').data('item', item);
                                $li.find('a').data('viewer', true);
                                $li.find('p.txt').text(item.contentsTextbookPeriodTitle);
                                $li.find('img').attr('src', item.thumbnail);
                                $li.find('span.label').text(item.textbookTitle);

                                $('#re-tab2 .recommend-list').append($li);
                                /* 최대 12개 노출 */
                                if(idx == 11) return false;
                            });
						}
					}
				};

				$cmm.ajax(options);

			},

			// 추천 콘텐츠 - 5분 쉬는 시간
			getMainRecommendContentTab3: function() {

				const options = {
					url: '/main/getMainRecommendContentTab3.ax',
					data: null,
					success: function(res) {

						$('.recommend-list').removeClass('d-none');

						if (!!res.rows) {

                            $('#re-tab3 .recommend-list li').remove();

                            $.each(res.rows, function(idx, item) {

                                $li = screen.v.recommendItemHtml.clone();
                                $li.find('a').data('item', item);
                                $li.find('p.txt').text(item.extraTitle);
                                $li.find('img').attr('src', item.thumbnail);
                                $li.find('span.label').text(item.label);

                                $('#re-tab3 .recommend-list').append($li);
                                /* 최대 12개 노출 */
                                if(idx == 11) return false;
                            });
						}
					}
				};

				$cmm.ajax(options);

			},

			// 추천 콘텐츠 - N월 학급경영
			getMainRecommendContentTab4: function() {

				const options = {
					url: '/main/getMainRecommendContentTab4.ax',
					data: null,
					success: function(res) {

						if (!!res.rows) {

							$('.recommend-list').removeClass('d-none');

                            $('#re-tab4 .recommend-list li').remove();
                            $.each(res.rows, function(idx, item) {
                                $li = screen.v.recommendItemHtml.clone();
                                $li.find('a').data('item', item);
                                $li.find('p.txt').text(item.extraTitle);
                                $li.find('img').attr('src',item.thumbnail);
                                $li.find('span.label').text((item.tabNm==null)? item.label:item.tabNm);

                                $('#re-tab4 .recommend-list').append($li);
                                /* 최대 12개 노출 */
                                if(idx == 11) return false;
                            });
						}
					}
				};

				$cmm.ajax(options);

			},
			// 추천 콘텐츠 - 쌤 추천 (2학기 준비: 상담의 고수 + 커스텀 링크)
			getMainRecommendContentTab5: function() {
				const options = {
					url: '/main/getMainRecommendContentTab5.ax',
					data: null,
					success: function(res) {
						if (!!res.rows) {
							// console.log(res.rows);
							let apiHostCms = $('#apiHostCms').val() + '/cms/files/view/';
							$('.recommend-list').removeClass('d-none');
							$('#re-tab5 .recommend-list li').remove();
							$.each(res.rows, function(idx, item) {
								$li = screen.v.recommendItemHtml.clone();
								$li.find('a').data('item', item);
								$li.find('p.txt').text(item.title);
								$li.find('img').attr('src', (apiHostCms+item.thumbFileId));
								$li.find('span.label').text(item.label);
								$('#re-tab5 .recommend-list').append($li);
								/* 최대 12개 노출 */
								if(idx == 11) return false;
							});
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
			setDateChangeTab: function(_today){ // 날짜 변경 탭 설정
				let _now = new Date();
				let month  = _now.getMonth() + 1;
				let date = _now.getDate();
				let today =  (_now.getFullYear() +'-'+ String(month).padStart(2, "0") +'-'+ String(date).padStart(2, "0"));
				if(_today != null){
					today = _today;
				}
				let step1 = '2023-12-18'; // 방학시작 : [학급 경영 > 안전한 방학] 명칭 변경
				let step2 = '2024-01-08'; // 신학기준비 : [오늘의 수업 / 쉬는시간 /음악 제제곡] 숨김, [신학기 준비]를 안전한 방학 뒤에 노출
				let step3 = '2024-02-19'; // 신학기준비2 : [신학기 준비] - [안전한 방학] 순서로 변경
				let step4 = '2024-03-03'; // 신학기준비2 : [신학기 준비] - [안전한 방학] 순서로 변경

				$("#reTabBtnList").empty();
				if( today >= step1 && today < step2 ) {
					$("#reTabBtnList").append('<li class="on"><a href="#re-tab1" id="re-tab1_title">오늘의 수업 영상</a></li>');
					$("#reTabBtnList").append('<li><a href="#re-tab3" id="re-tab3_title">쉬는 시간</a></li>');
					$("#reTabBtnList").append('<li><a href="#re-tab2" id="re-tab2_title">음악 제재곡 듣기</a></li>');
					$("#reTabBtnList").append('<li><a href="#re-tab4" id="re-tab4_title">안전한 방학</a></li>');
					screen.c.getMainRecommendContentTab1(); // 추천 콘텐츠 - 오늘의 수업 영상
					screen.c.getMainRecommendContentTab2(); // 추천 콘텐츠 - 국어기초학습/음악 제재곡 듣기
					screen.c.getMainRecommendContentTab3(); // 추천 콘텐츠 - 쉬는시간
					screen.c.getMainRecommendContentTab4(); // 추천 콘텐츠 - 학급경영 > 안전한 방학
				}else if(today >= step2 && today < step3 ){
					$("#reTabBtnList").append('<li class="on"><a href="#re-tab4" id="re-tab4_title">안전한 방학</a></li>');
					$("#reTabBtnList").append('<li><a href="#re-tab5" id="re-tab5_title">신학기 준비</a></li>');
					screen.c.getMainRecommendContentTab4(); // 추천 콘텐츠 - 학급경영 > 안전한 방학
					screen.c.getMainRecommendContentTab5(); // 추천 콘텐츠 - 쌤 추천
				}else if(today >= step3 && today <= step4){
					$("#reTabBtnList").append('<li class="on"><a href="#re-tab5" id="re-tab5_title">신학기 준비</a></li>');
					$("#reTabBtnList").append('<li><a href="#re-tab4" id="re-tab4_title">안전한 방학</a></li>');
					screen.c.getMainRecommendContentTab5(); // 추천 콘텐츠 - 쌤 추천
					screen.c.getMainRecommendContentTab4(); // 추천 콘텐츠 - 학급경영 > 안전한 방학
				}else{
					$("#reTabBtnList").append('<li class="on"><a href="#re-tab1" id="re-tab1_title">오늘의 수업 영상</a></li>');
					$("#reTabBtnList").append('<li><a href="#re-tab3" id="re-tab3_title">쉬는 시간</a></li>');
					$("#reTabBtnList").append('<li><a href="#re-tab2" id="re-tab2_title">음악 제재곡 듣기</a></li>');
					$("#reTabBtnList").append('<li><a href="#re-tab4" id="re-tab4_title">학급 경영</a></li>');
					screen.c.getMainRecommendContentTab1(); // 추천 콘텐츠 - 오늘의 수업 영상
					screen.c.getMainRecommendContentTab2(); // 추천 콘텐츠 - 국어기초학습/음악 제재곡 듣기
					screen.c.getMainRecommendContentTab3(); // 추천 콘텐츠 - 쉬는시간
					screen.c.getMainRecommendContentTab4(); // 추천 콘텐츠 - 학급경영
				}

				var $tabsNav    = $('.tabs'),
					$tabsNavLis = $tabsNav.children('li'),
					$tabContent = $('.tab-cont');
				$tabsNav.each(function() {
					var $this = $(this);
					if($this.attr("id") == 'reTabBtnList'){ // 추천자료
						let eleId = $this.find(".on a").attr("id");
						eleId = "#" + eleId.replace("_title", "");
						$this.next().children('.tab-cont').stop(true,true).hide()
						$(eleId).show();
					}else{
						$this.next().children('.tab-cont').stop(true,true).hide().first().show();
						$this.children('li').first().addClass('on').stop(true,true).show();
					}
				});
				$tabsNavLis.on('click', function(e) {
					var $this = $(this);
					$this.siblings().removeClass('on').end().addClass('on');
					$this.parent().next().children('.tab-cont').stop(true,true).hide().siblings( $this.find('a').attr('href') ).fadeIn(300);
					e.preventDefault();
				});
			},

            // 즐겨찾기 항목 만들기
            makeFavoriteDiv: function(list){

                $('.bookmark-list li div').remove();

                $.each(list, function(idx, item) {
                    let $favoriteDiv = screen.v.divHtml[item.typeNo].clone();
                    $favoriteDiv.find('.tit').html(item.nm);

                    if(item.typeNo==1){
                        /* 미래엔 교과서 */
						let curriTxt = (item.nm).substring(0,2);
						let icon = screen.v.curriIconMap[curriTxt];
						$favoriteDiv.find('i').removeClass().addClass(icon);
                        if(item.curriculumUseYn == 'Y' && item.testUseYn == 'Y'){
                            $favoriteDiv.find('.link a:eq(0)').attr('href', `/Textbook/Curriculum.mrn/${item.fkSeq}?tab=1`);
                            $favoriteDiv.find('.link a:eq(1)').attr('href', `/Textbook/Curriculum.mrn/${item.fkSeq}?tab=2&category=1`);
                        } else if(item.curriculumUseYn == 'Y' && item.testUseYn == 'N'){
                            $favoriteDiv.find('.link a:eq(0)').attr('href', `/Textbook/Curriculum.mrn/${item.fkSeq}?tab=1`);
                            $favoriteDiv.find('.link a:eq(1)').addClass('d-none');
                        } else if(item.curriculumUseYn == 'N' && item.testUseYn == 'Y'){
                            $favoriteDiv.find('.link a:eq(0)').addClass('d-none');
                            $favoriteDiv.find('.link a:eq(1)').attr('href', `/Textbook/Curriculum.mrn/${item.fkSeq}?tab=2&category=1`);
                        } else {
                            $favoriteDiv.find('.link a:eq(0)').addClass('d-none');
                            $favoriteDiv.find('.link a:eq(1)').text('바로가기');
                            $favoriteDiv.find('.link a:eq(1)').attr('href', `/Textbook/Curriculum.mrn/${item.fkSeq}?tab=2&category=1`);
                        }
                    } else if(item.typeNo==2){
                        /* 엠티처 서비스 */
                        $favoriteDiv.find('.link a').attr('href', item.url);
                        if(item.target == 'BLANK'){
                            $favoriteDiv.find('.link a').attr('target', '_BLANK');
                        }
                    } else if(item.typeNo==3){
                         /* 모든 교과서 */
                        if($text.isEmpty(item.author)){
                            $favoriteDiv.find('.txt').html('미래엔');
                        }else {
                            $favoriteDiv.find('.txt').html(item.author);
                        }

                        $favoriteDiv.find('.link a').attr('href', item.url);
                        $favoriteDiv.find('.link a').attr('target', '_BLANK');
                    } else {
                        /* 나만의 즐겨 찾기 */
                        $favoriteDiv.find('.link a').attr('href', item.url);
                        $favoriteDiv.find('.link a').attr('target', '_BLANK');
                    }

                    if(idx<12){
                        $('.bookmark-list li:eq(0)').append($favoriteDiv);
                    } else{
                        $('.bookmark-list li:eq(1)').append($favoriteDiv);
                    }
                });

                // 나머지 추가 버튼으로 채우기
                for(var i=list.length; i< 24; i++){
                    let $favoriteAddDiv = screen.v.divHtml[0].clone();

                    if(i < 12){
                        $('.bookmark-list li:eq(0)').append($favoriteAddDiv);
                    } else{
                        $('.bookmark-list li:eq(1)').append($favoriteAddDiv);
                    }
                }

                $('#favoritesCnt').text(24-$('.subject .add.modal').length);

                if(list.length == 24){
                    $('#btnMyAdd').removeClass('modal').addClass('full');
                }else {
                    $('#btnMyAdd').removeClass('full').addClass('modal');
                }
            },
		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

            var $bookmarkSlider = $('.bookmark-list');
			$bookmarkSlider.slick({
				dots: false,
				infinite: false
			});
			var $status = $('.notice-banner .paging');
			var $noticeBanner = $('.banner-list');
			if($noticeBanner.length > 0){
				$noticeBanner.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide) {
					var index = (currentSlide ? currentSlide : slick.currentSlide) + 1;
					$noticeBanner.next().children('.paging').html('<span>0' + index + '</span> / 0' + (slick.slideCount));
				});
				$noticeBanner.slick({
					dots: false,
					arrows: false,
					autoplay: true,
					speed: 500
				});
				$('.notice-banner .btn-prev').click(function() {
					$noticeBanner.slick('slickPrev');
				});
				$('.notice-banner .btn-next').click(function() {
					$noticeBanner.slick('slickNext');
				});
			}

            let initSlideIdx1 = Math.floor( Math.random() * $('.edu-list.type1-1 li').length );
			var $eduSlider1 = $('.edu-list.type1-1');
			$eduSlider1.slick({
				dots: true,
				autoplay: true,
				speed: 500,
				appendDots: $('.edu-stit.type1-1'),
				customPaging: function(slider, index) {
					var title = $(slider.$slides[index]).data('title');
					return "<span>" + title + "</span>";
                }
			});
			$eduSlider1.slick('slickGoTo', initSlideIdx1);

            let initSlideIdx2 = 0;
            let today = new Date;
            let dd = today.getDate();
			var $eduSlider3 = $('.edu-list.type2-1');
			$eduSlider3.slick({
				dots: true,
				autoplay: true,
				speed: 500,
				appendDots: $('.edu-stit.type2-1'),
				customPaging: function(slider, index) {
					var title = $(slider.$slides[index]).data('title');
					var titleArray = title.split('|');
					if(titleArray.length == 3){
					    title = titleArray[2] + ' ' + titleArray[1];
					    if(Number(titleArray[0].replace('일','')) < Number(dd)){
					        initSlideIdx2 = index;
					    }
					}
					return "<span>" + title + "</span>";
				}
			});
			$eduSlider3.slick('slickGoTo', initSlideIdx2+1);

			let sliderChildCnt = Number($("#middleBannerSize").val());
			var $contentBanner = $('.banner-slider');
			$contentBanner.slick({
				dots: (sliderChildCnt > 1), // 슬라이드배너가 1개 이상인 경우만 dot 노출
				arrows: false,
				autoplay: true,
				speed: 800,
				slidesToShow: 1
			});

			//tab
		    var $tabsNav    = $('.tabs'),
		        $tabsNavLis = $tabsNav.children('li'),
		        $tabContent = $('.tab-cont');
		    $tabsNav.each(function() {
		        var $this = $(this);
				if($this.attr("id") == 'reTabBtnList'){ // 추천자료
					let eleId = $this.find(".on a").attr("id");
					eleId = "#" + eleId.replace("_title", "");
					$this.next().children('.tab-cont').stop(true,true).hide()
					$(eleId).show();
				}else{
					$this.next().children('.tab-cont').stop(true,true).hide().first().show();
					$this.children('li').first().addClass('on').stop(true,true).show();
				}
		    });
		    $tabsNavLis.on('click', function(e) {
		        var $this = $(this);
		        $this.siblings().removeClass('on').end().addClass('on');
		        $this.parent().next().children('.tab-cont').stop(true,true).hide().siblings( $this.find('a').attr('href') ).fadeIn(300);
		        e.preventDefault();
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

			//toggle
			$(document).on('click', '.bookmark-select a', function(e) {
		        e.preventDefault();

		        if($(this).hasClass('on')){

                    screen.c.delFavorites($(this));

		        } else {

                    let blankCnt = $('.subject .add.modal').length;
                    if(blankCnt == 0){
                        $msg.alert('즐겨찾기는 최대 24개 까지 등록 가능합니다.');
                        return false;
                    }

                    screen.c.insFavorites($(this));
		        }

		        $(this).toggleClass('on');

		    });

            // 즐겨찾기 - 미래엔교과서 학년 변경
            $('#tab1Grade').on('change', () => {

                // 즐겨찾기 - 미래엔 교과서 목록 가져오기
                screen.c.getFavoritesTextbook();
            });

            // 즐겨찾기 - 미래엔교과서 학기 변경
            $('#tab1Term').on('change', () => {

                // 즐겨찾기 - 미래엔 교과서 목록 가져오기
                screen.c.getFavoritesTextbook();
            });

            // 즐겨찾기 - 엠티처 메뉴 그룹 변경
            $('#tab2Group').on('change', () => {

                // 즐겨찾기 - 미래엔 교과서 목록 가져오기
                screen.c.getFavoritesGnb();
            });

            // 즐겨찾기 - 모든 교과서 학년 변경
            $('#tab3Grade').on('change', () => {

                if($('#tab3Grade').val()==3 || $('#tab3Grade').val()==4 ){
                    $('#tab3Subject option[value="실과"]').prop('hidden',true);
                } else {
                        $('#tab3Subject option[value="실과"]').prop('hidden',false);
                }
                // 즐겨찾기 - 모든 교과서 목록 가져오기
                screen.c.getFavoritesOrderTextbook();
            });

            // 즐겨찾기 - 모든 교과서 과목 변경
            $('#tab3Subject').on('change', () => {

                // 즐겨찾기 - 모든 교과서 목록 가져오기
                screen.c.getFavoritesOrderTextbook();
            });

            // 즐겨찾기 - 나만의 즐겨찾기 등록
            $('#btnAdd').on('click', (e) => {
                e.preventDefault();
                screen.c.insMyFavorites();
            });

            // 나만의 즐겨찾기 갯수 체크
            $(document).on('click', '.add.full', function(e) {
                e.preventDefault();
                $msg.alert('즐겨찾기는 최대 24개 까지 등록 가능합니다.');
            });

            // 나만의 즐겨찾기 삭제
            $(document).on('click', '.my-item .btn-del', function(e) {
                e.preventDefault();
                screen.c.delMyFavorites($(this));
            });

            // 추천 컨텐츠 클릭
            $(document).on("click",".recommend-list li a",function (e) {
                if($(this).hasClass('cmmLoginConfirm')) return;
                if($(this).hasClass('cmmTeacherConfirm')) return;

                let item = $(this).data("item");
                let viewer = $(this).data("viewer");


				let previewUrl = '/Ebook/preview.mrn';
                // 기존 뷰어
                // let previewUrl = '/viewer/preview.html';
                let w = 800;
                let h = 1000;

                if(viewer){

                     // 동영상이면
                     if (item.contentsTextbookPeriodUseType == '002') {

                        if (item.contentsTextbookPeriodType == 'LINK') {
                           previewUrl = '/cms/smartppt/mpreview/mpreview.html' + '?source=PERIOD&file=' + item.file + '&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=Y';
                        }
                        else if (item.contentsTextbookPeriodType == 'HLS') {
                            w = 900;
                            previewUrl = item.url;
                        }
                        else if (item.contentsTextbookPeriodType == 'YOUTUBE') {
                            previewUrl = previewYoutube + '?source=PERIOD&file=' + item.url + '&contentsTextbookSeq=' + item.contentsTextbookSeq + '&indexclose=N';
                        }
                        else if (item.contentsTextbookPeriodType == 'FILE') {
                           previewUrl = previewUrl + '?source=PERIOD&file=' + item.file + '&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=Y';
                        }
                     }
                     // 일반 파일이면
                     else {
                        previewUrl = previewUrl + '?source=PERIOD&file=' + item.file + '&contentsTextbookPeriodSeq=' + item.contentsTextbookPeriodSeq + '&indexclose=Y';
                     }
                    screenUI.f.winOpen(previewUrl, w, h, null, 'preview');
                    page_download("PERIOD", "PERIOD", item.contentsTextbookPeriodSeq, null);
                } else {
                    var win = window.open(item.url, '_blank');
               		win.focus();
                }
            });

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {
			// html 즐겨찾기 - div 복제
			screen.v.divHtml[0] = $('.bookmark-list li div.tab0').clone().removeClass('d-none');
			screen.v.divHtml[1] = $('.bookmark-list li div.tab1').clone().removeClass('d-none');
			screen.v.divHtml[2] = $('.bookmark-list li div.tab2').clone().removeClass('d-none');
			screen.v.divHtml[3] = $('.bookmark-list li div.tab3').clone().removeClass('d-none');
			screen.v.divHtml[4] = $('.bookmark-list li div.tab4').clone().removeClass('d-none');

			// html 즐겨찾기 modal - 미래엔교과서  아이템 복제
			screen.v.tab1ItemHtml = $('#setup-tab1 .bookmark-select a').clone();

			// html 즐겨찾기 modal - 엠티처 서비스 아이템 복제
			screen.v.tab2ItemHtml = $('#setup-tab2 .bookmark-select a').clone();

			// html 즐겨찾기 modal - 모든 교과서 아이템 복제
			screen.v.tab3ItemHtml = $('#setup-tab3 .bookmark-select a').clone();

			// html 즐겨찾기 modal - 나만의 즐겨찾기 아이템 복제
			screen.v.tab4ItemHtml = $('#setup-tab4 .my-bookmark li.my-item').clone();

			// html 추천콘텐츠
			screen.v.recommendItemHtml = $('#re-tab1 .recommend-list li').clone();

			// $("#reTabBtnList").empty();
			// $("#reTabBtnList").append('<li class="on"><a href="#re-tab1" id="re-tab1_title">오늘의 수업 영상</a></li>');
			// $("#reTabBtnList").append('<li><a href="#re-tab3" id="re-tab3_title">쉬는 시간</a></li>');
			// $("#reTabBtnList").append('<li><a href="#re-tab2" id="re-tab2_title">음악 제재곡 듣기</a></li>');
			// $("#reTabBtnList").append('<li><a href="#re-tab4" id="re-tab4_title">학급 경영</a></li>');
			// screen.c.getMainRecommendContentTab1(); // 추천 콘텐츠 - 오늘의 수업 영상
			// screen.c.getMainRecommendContentTab2(); // 추천 콘텐츠 - 국어기초학습/음악 제재곡 듣기
			// screen.c.getMainRecommendContentTab3(); // 추천 콘텐츠 - 쉬는시간
			// screen.c.getMainRecommendContentTab4(); // 추천 콘텐츠 - N월 학급경영 / 반가운 개학

			// 추천 콘텐츠 탭 생성
			screen.f.setDateChangeTab();

			screen.event();

            // 로그인 체크
            if($text.isEmpty(screen.v.scGrade)) {
                // 즐겨찾기 기본 목록 가져오기
                screen.c.getFavoritesListDefault();
            } else {
                // 사용자가 저장한 즐겨찾기 목록 가져오기
                screen.c.getFavoritesList();

                // 즐겨찾기 모달 - 미래엔 교과서 목록 가져오기
                screen.c.getFavoritesTextbook();

                // 즐겨찾기 모달 - 엠티처 메뉴 그룹 목록 가져오기
                screen.c.getFavoritesGnbGroup();

                // 즐겨찾기 모달 - 모든 교과서 목록 가져오기
                screen.c.getFavoritesOrderTextbook();

                // 즐겨찾기 모달 - 나만의 즐겨찾기 목록 가져오기
                screen.c.getFavoritesMy();
            }
		}
	};

	screen.init();
	window.screen = screen;
});
