$(function() {

	const screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			item : null
			, scGrade: $('body').data('scGrade')
			, divHtml: new Array()
			, tab1ItemHtml : null
			, tab2ItemHtml : null
			, tab3ItemHtml : null
			, tab4ItemHtml : null
			, myListItem : null
			, typeCSeq : [647, 648, 649, 650]   //  공통코드(TBL_CODE) SEQ 미래엔 교과서(647), 엠티처 서비스(648), 모든 교과서(649), 나만의 즐겨찾기(650)
			, availableCnt : 22
			, addedCnt : 0
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// TextbookList - 미래엔 교과서 목록 가져오기
			getTextbookList: function() {

				const options = {
					url: '/myClass/getTextbookList.ax',
					data: {
                        grade: $('#tab1Grade').val(),
                    },
					success: function(res) {

						$('#setup-tab1 .bookmark-select a').remove();
						//screen.v.addedCnt = screen.v.availableCnt;
						screen.c.getMyTextbookCnt();
						if (!!res.rows) {

							// myTextbook 미래엔 교과서
							$.each(res.rows, function(idx, item) {
								let $textbook = screen.v.tab1ItemHtml.clone(); // #setup-tab1 a
								$textbook.addClass(item.onClass);
								$textbook.find('i.ico').attr('class', '');
								if (item.textbookTitle.indexOf('국어') != -1) {	$textbook.find('i').addClass('ico ico1-1');	}
								else if (item.textbookTitle.indexOf('수학') != -1) {$textbook.find('i').addClass('ico ico1-2');	}
								else if (item.textbookTitle.indexOf('사회') != -1) {$textbook.find('i').addClass('ico ico1-3');	}
								else if (item.textbookTitle.indexOf('과학') != -1) {$textbook.find('i').addClass('ico ico1-4');	}
								else if (item.textbookTitle.indexOf('도덕') != -1) {$textbook.find('i').addClass('ico ico1-5');	}
								else if (item.textbookTitle.indexOf('음악') != -1) {$textbook.find('i').addClass('ico ico1-6');	}
								else if (item.textbookTitle.indexOf('미술') != -1) {$textbook.find('i').addClass('ico ico1-7');	}
								else if (item.textbookTitle.indexOf('체육') != -1) {$textbook.find('i').addClass('ico ico1-8');	}
								else {$textbook.find('i').addClass('ico ico1-1');	}
								$textbook.find('.tit').text(item.textbookTitle);
								$textbook.data('fkSeq', item.textbookSeq);
								$textbook.data('typeCSeq', screen.v.typeCSeq[0]);
								if (item.textbookChooseYn === 'Y') $textbook.addClass('on');
								if (!!item.textbookMainAuth && !$text.isEmpty(item.textbookMainAuth)) $textbook.find('.txt').text('(' + item.textbookMainAuth + ')');
								else $textbook.find('.txt').remove();
								$('#setup-tab1 .bookmark-select').append($textbook);
							});
						}

					}
				};

				$cmm.ajax(options);

			},

			// myTextbookcnt - 미래엔 교과서 목록 cnt
			getMyTextbookCnt: function() {

				//if($text.isEmpty(screen.v.scGrade)) return;

				const options = {
					//url: '/myClass/getMyTextbookCnt.ax',
					url: '/myClass/getMyFavoriteCnt.ax',
					data: {},
					success: function(res) {
						screen.v.addedCnt = res.row.cnt;
						let addableCnt = screen.v.availableCnt - screen.v.addedCnt;
						$('#textbook-register .modal-cont .setup-header .txt').text('등록 가능 교과서 '+addableCnt+'개');
					}
				};

				$cmm.ajax(options);

			},

			// myTextbookList - 내 교과서 목록
			getMyTextbookList: function() {

				//if($text.isEmpty(screen.v.scGrade)) return;

				const options = {
					url: '/myClass/getMyTextbookList.ax',
					data: {},
					success: function(res) {

						$('.myBook-li').find('li').remove();

						if(res.rows.length > 0) {

							$('.myBook-li').find('.empty-result03').remove();

							let cmshost = $('body').data('apihostcms');

							// myTextbook 미래엔 교과서
							$.each(res.rows, function(idx, item) {
								let $myItem = screen.v.myListItem.clone();
								if ($text.isEmpty(item.textbookThumbnailFileId)) {
									$myItem.find('.thumb img').attr('src','/images/mobile/txtBook_noImage.png');
									$myItem.find('.thumb').append('<span>'+item.textbookTitle+'</span>').attr('src','/images/mobile/txtBook_noImage.png');
								} else {
									$myItem.find('.thumb img').attr('src', cmshost + item.textbookThumbnailFileId);
								}

								$myItem.find('.txt-info span.cate').text(item.textbookCurriculumRevCd+' 개정');
								$myItem.find('.book-tit .tit').text(item.textbookTitle);
								if (!$text.isEmpty(item.textbookMainAuth)) {
									$myItem.find('.book-tit .author').text('('+item.textbookMainAuth+')');
								} else {
									$myItem.find('.book-tit .author').remove();
								}

								if(item.textbookUseYn === 'Y') {
									$myItem.find('.box-btns a:eq(0)').attr('href', '/Textbook/Curriculum.mrn/' + item.textbookSeq);
									$myItem.find('.box-btns a:eq(1)').attr('href', '/Textbook/Curriculum.mrn/' + item.textbookSeq+'?tab=2&category=1');
								} else {
									$myItem.find('.box-btns a:eq(0)').attr('href', '/');
									$myItem.find('.box-btns a:eq(1)').attr('href', '/');
								}

								if (!$text.isEmpty(item.textbookBlendedUrl)) {
									$myItem.find('.box-btns a:eq(2)').attr('href', item.textbookBlendedUrl);
								} else {
									$myItem.find('.box-btns a:eq(2)').remove();
								}
								$myItem.find('.myBook-li-close').data('fkSeq', item.textbookSeq);

								$('.myBook-li').append($myItem);
							});
						} else {
							let $noItem = `
								<div class="empty-result03">
									등록된 내 교과서가 없습니다.
									<p>내 교과서 등록 시 빠르게 이동하실 수 있습니다.</p>
								</div>
								`
							$('.myBook-li').append($noItem);
						}
						screen.c.getMyTextbookCnt();
					}
				};
				$cmm.ajax(options);
			},

			// myTextbook 추가
			insMyTextbook: function($item) {

				const options = {
					url: '/myClass/insMyTextbook.ax',
					data: {
					    fkSeq: $item.data('fkSeq')
					},
					success: function(res) {

						const options2 = {
							url: '/main/insFavorites.ax',
							data: {
							    typeCSeq: '647'
							    , fkSeq: $item.data('fkSeq')
							},
							success: function(res) {

		                        screen.c.getMyTextbookList();

							}

						}
						$cmm.ajax(options2);
					}
				};
				$cmm.ajax(options);
			},

			// myTextbook 삭제
			delMyTextbook: function($item) {

				const options = {
					url: '/myClass/delMyTextbook.ax',
					data: {
				    	fkSeq: $item.data('fkSeq')
					},
					success: function(res) {


						const options2 = {
							url: '/main/delFavorites.ax',
							data: {
							    typeCSeq: '647'
							    , fkSeq: $item.data('fkSeq')
							},
							success: function(res) {

		                        screen.c.getMyTextbookList();

							}
						}
						$cmm.ajax(options2);
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


		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

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
					onOpen: function(){
						screen.c.getTextbookList();
					},
		        });
		    });

            // MyTextbook - 미래엔교과서 학년 변경
            $('#tab1Grade').on('change', () => {

                // MyTextbook - 미래엔 교과서 목록 가져오기
                screen.c.getTextbookList();
            });

            // MyTextbook - 미래엔교과서 학기 변경
            $('#tab1Term').on('change', () => {

                // MyTextbook - 미래엔 교과서 목록 가져오기
                screen.c.getTextbookList();
            });

			//toggle
			$(document).on('click', '.bookmark-select a', function(e) {
		        e.preventDefault();
		        if($(this).hasClass('on')){
                    screen.c.delMyTextbook($(this));
		        } else {
                    if(screen.v.addedCnt >= screen.v.availableCnt){
                        $msg.alert('즐겨찾기는 최대 '+(screen.v.availableCnt+2)+'개 까지 등록 가능합니다.');
                        return false;
                    }
                    screen.c.insMyTextbook($(this));
		        }
		        $(this).toggleClass('on');
		    });

            // MyTextbook - 미래엔교과서 학기 변경
            $(document).on('click','.myBook-li-close',function (e){

				$msg.confirm('내 교과서를 해제하겠습니까?', () => {

	                // MyTextbook - 삭제처리
	                screen.c.delMyTextbook($(e.target));
				});

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

            // html 즐겨찾기 modal - 미래엔교과서  아이템 복제
            screen.v.tab1ItemHtml = $('#setup-tab1 .bookmark-select a').clone();

            // html 내 교과서 목록 아이템 복제
            screen.v.myListItem = $('.myBook-li .myListItem').clone();
            $('.myBook-li .myListItem').remove();

            screen.c.getMyTextbookList();
            screen.c.getTextbookList();

		}
	};

	screen.init();
	window.mrnScreen = screen;
});