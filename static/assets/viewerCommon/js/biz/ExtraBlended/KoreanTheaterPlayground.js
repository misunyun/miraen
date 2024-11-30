let screen;

let player1;
let player2;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			item : null
			, tab : 'tab1'
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
			, level5Data: null

			, level2Html: null
			, level2HtmlMobile: null
            , level3Html: null
            , level3HtmlMobile: null
			, level4Html: null
			, level4HtmlMobile: null
			, level5Html: null
			, level5HtmlMobile: null
			, level5Html: null
            , level5HtmlMobile: null
            , fileName: null
            , video: null
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
					url: '/ExtraBlended/GetKoreanTheaterPlaygroundJson.mrn',
					data: null,
					success: function(res) {
						if (!!res.resultData) {
							screen.v.item = res.resultData;

							// 첫번째 탭 선택
							$('.tabs .tab1').trigger('click');
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

            // level2(학년) 변경
			setLevel2: function() {

				// level2(학년) 초기화
				$('.aside .block-level2 .item').remove();
				$('.aside-mobile .block-level2 li').remove();

				let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level1Seq);

				// PC LMB 리스트 넣기
				$.each(rows, function(idx, item) {
					let $li = screen.v.level2Html.clone();
					$li.find('a').data('tktpSeq', item.tktpSeq);			// data id
					$li.find('a').addClass('tktpSeq_' + item.tktpSeq);	// class
					$li.find('a').data('nm', (screen.v.tab!='tab2')? item.nm+'학년' : item.nm);				// data nm
					$li.find('a').data('dd', item);					// data
					$li.find('a').text( (screen.v.tab!='tab2')? item.nm+'학년' : item.nm);					// name
					$('#'+screen.v.tab).find('.aside .block-level2').append($li);

					let $liMobile = screen.v.level2HtmlMobile.clone();
					$liMobile.addClass('tktpSeq_' + item.tktpSeq);	// class
					$liMobile.find('a').data('tktpSeq', item.tktpSeq);				// data id
					$liMobile.find('a').text((screen.v.tab!='tab2')? item.nm+'학년' : item.nm);						// name
					$('#'+screen.v.tab).find('.aside-mobile .block-level2').append($liMobile);

				});

                // 콤보 셋팅
                $combo.bind(rows, '#selTab2Level2', '', '', 'nm', 'tktpSeq');

				// 첫번째 클릭
				$('.aside .block-level2 li:first a').trigger('click');

			},

			// level3(학기) 변경
            setLevel3: function() {

                // tab1 level3(학기) 초기화
                $('.aside .block-level3 .item').remove();
                $('.aside-mobile .block-level3 li').remove();

                let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level2Seq);

                // PC LMB 리스트 넣기
                $.each(rows, function(idx, item) {
                    let $li = screen.v.level3Html.clone();
                    $li.find('a').data('tktpSeq', item.tktpSeq);			// data id
                    $li.find('a').addClass('tktpSeq_' + item.tktpSeq);	// class
                    $li.find('a').data('nm', item.nm);				// data nm
                    $li.find('a').data('dd', item);					// data
                    $li.find('a').text(item.nm+'학기');					// name
                    $('.aside .block-level3').append($li);

                    let $liMobile = screen.v.level3HtmlMobile.clone();
                    $liMobile.addClass('tktpSeq_' + item.tktpSeq);	// class
                    $liMobile.find('a').data('tktpSeq', item.tktpSeq);				// data id
                    $liMobile.find('a').text(item.nm+'학기');						// name
                    $('.aside-mobile .block-level3').append($liMobile);

                });

                // 첫번째 클릭
                $('.aside .block-level3 li:first a').trigger('click');

                if(screen.v.tab != 'tab1'){
                    // tab2 내용 초기화
                    $('.block-level5 ul li').remove();

                    // 내용 세팅
                    screen.f.setContents();
                }

            },

            // level4(차시) 변경
            setLevel4: function() {

                // level4(차시) 초기화
                $('.aside .block-level4 .item').remove();

                let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level3Seq);

                // PC LMB 리스트 넣기
                $.each(rows, function(idx, item) {
                    let $li = screen.v.level4Html.clone();
                    $li.find('a').data('tktpSeq', item.tktpSeq);			// data id
                    $li.find('a').addClass('tktpSeq_' + item.tktpSeq);	// class
                    $li.find('a').data('nm', item.nm);				// data nm
                    $li.find('a').data('dd', item);					// data
                    $li.find('a').text( '['+item.nm+'] ' + item.txt1);					// name
                    $('.aside .block-level4').append($li);
                });

                // 콤보 셋팅
                $combo.bind(rows, '#selLevel4', '', '', 'nm', 'tktpSeq');

                // 콤보 text변경  추가
                $.each(rows, function(i, item){
                    $( 'select[id="selLevel4"] option[value="'+item.tktpSeq+'"]').text('['+item.nm+'차시] '+item.txt1);
                });

                // 첫번째 클릭
                $('.aside .block-level4 li:first a').trigger('click');

            },

            // 컨텐츠 내용 변경
            setContents: function() {

                // 목록 초기화
                $('.block-level5 ul li').remove();

                let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level4Seq);
                if(screen.v.tab === 'tab2'){
                    rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level2Seq);
                } else if(screen.v.tab === 'tab3'){
                   rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level2Seq);
                   $('.pc-only .block-level5 tr.item').remove();
                   $('.mobile-only .block-level5 .item').remove();
               }

                // PC 목록 리스트 넣기
                $.each(rows, function(idx, item) {

                    if(screen.v.tab != 'tab3'){

                        let $li = screen.v.level5Html.clone();

                        if(item.nm==='동영상'){
                            screen.v.video = item;

                            if(screen.v.tab == 'tab1'){

                                if(player1 == null){
                                    $('#'+screen.v.tab).find('.video.empty').css('background-image', 'url("'+item.url2+'")');
                                } else {
                                    player1.src(item.url1);
                                    player1.poster(item.url2);
                                }

                                if( item.url3 != undefined && item.url4 != undefined ){

                                    $('#'+screen.v.tab).find('.video-foot .btn-pages a').removeClass('d-none');
                                } else {
                                    $('#'+screen.v.tab).find('.video-foot .btn-pages a').addClass('d-none');
                                }

                            } else if(screen.v.tab == 'tab2'){

                                if(player2 == null){
                                    $('#'+screen.v.tab).find('.video.empty').css('background-image', 'url("'+item.url2+'")');
                                } else {
                                    player2.src(item.url1);
                                    player2.poster(item.url2);
                                }

                            }
                        } else {
                            $li.find('.txtTitle1').text(item.nm);

                            $li.find('.btn-group .btn').addClass('btn-'+item.txt2.split('.').pop());

                            $li.find('.btn-group').data('url',item.url1);
                            $li.find('.btn-group').data('tktpSeq', item.tktpSeq);

                            // 추가
                            $('#'+screen.v.tab).find('.block-level5').find('ul').append($li);
                        }
                    } else {

                        let $tr = screen.v.level5Html2.clone();
                        let $mobileItem = screen.v.level5Html2Mobile.clone();

						if (!$text.isEmpty(item.url1)) {
							$tr.find('.btn-hwp').addClass('on');
							$tr.find('.btn-down').addClass('on');

							$mobileItem.find('.btn-hwp').addClass('on');
							$mobileItem.find('.btn-hwp').addClass('on');
						}

                        if (!$text.isEmpty(item.url2)) {
							$tr.find('.btn-zip').addClass('on');

							$mobileItem.find('.btn-zip').addClass('on');
						}

                        $tr.find('.txtNum').text(idx+1);
                        $tr.find('.txtTitle1').text(item.nm);
                        $tr.find('.btn-group:eq(0)').data('url',item.url1);
                        $tr.find('.btn-group:eq(1)').data('url',item.url2);

                        $mobileItem.find('.txtNum').text(idx+1);
                        $mobileItem.find('.txtTitle1').text(item.nm);
                        $mobileItem.find('.btn-group:eq(0)').data('url',item.url1);
                        $mobileItem.find('.btn-group:eq(1)').data('url',item.url2);

                        // pc 추가
                        $('.pc-only .block-level5').append($tr);

                        // 모바일 추가
                        $('.mobile-only .block-level5').append($mobileItem);
                    }

                });

            },

            // level2 클릭
			clickLevel2: function() {

				// level2 선택값 넣기
				screen.v.level2Seq = $(this).data('tktpSeq');
				screen.v.level2Data = $(this).data('dd');

				$('.txtTitleLevel2').text($(this).data('nm'));

                if(screen.v.level2Data.txt2){
                    screen.v.fileName = screen.v.level2Data.txt2.replace('.zip','');
                }

				$(this).parents('.block-level2').find('.item').removeClass('on');
				$(this).parent().addClass('on');

				$('.aside-mobile .block-level2').find('.tktpSeq_' + screen.v.level2Seq).addClass('on');

				// 체크
				screen.f.setLevel3();
			},

            // level2 클릭(모바일)
            clickMobileLevel2: function() {

                $('.mobile-only .block-level2').find('li').removeClass('on');
                $(this).parents().addClass('on');

                let tktpSeq = $(this).data('tktpSeq');
                if( screen.v.tab === 'tab2'){
                    tktpSeq = $('#selTab2Level2').val();
                }

                // pc 클릭
                $('.aside .block-level2').find('.tktpSeq_' + tktpSeq).trigger('click');

            },

            // level3 클릭
            clickLevel3: function() {

                // level3 선택값 넣기
                screen.v.level3Seq = $(this).data('tktpSeq');
                screen.v.level3Data = $(this).data('dd');

                $('.txtTitleLevel3').text(screen.v.level2Data.nm + '학년 '+ screen.v.level3Data.nm +'학기');

                $(this).parents('.block-level3').find('.item').removeClass('on');
                $(this).parent().addClass('on');

                $('.aside-mobile .block-level3').find('.tktpSeq_' + screen.v.level3Seq).addClass('on');

                // 체크
                screen.f.setLevel4();
            },

            // level3 변경(모바일)
            clickMobileLevel3: function() {

                $('.mobile-only .block-level3').find('li').removeClass('on');
                $(this).parents().addClass('on');

                let tktpSeq = $(this).data('tktpSeq');

                // pc 클릭
                $('.aside .block-level3').find('.tktpSeq_' + tktpSeq).trigger('click');

            },

            // level4 클릭
            clickLevel4: function() {

                // level4 선택값 넣기
                screen.v.level4Seq = $(this).data('tktpSeq');
                screen.v.level4Data = $(this).data('dd');

                $('.txtTitleLevel4').text('[' + screen.v.level4Data.nm + '차시] ' + screen.v.level4Data.txt1 );
                screen.v.fileName = screen.v.level4Data.txt2.replace('.zip','');

                $(this).parents('.block-level4').find('.item').removeClass('on');
                $(this).parent().addClass('on');

                // 컨텐츠
                screen.f.setContents();
            },

            // level4 클릭(모바일)
            clickMobileLevel4: function() {

                let tktpSeq = $('#selLevel4').val();
                // pc 클릭
                $('.aside .block-level4').find('.tktpSeq_' + tktpSeq).trigger('click');

            },

            //  미리보기
			preview: function() {

				let url = $(this).parent().data('url');
				let tktpSeq = $(this).parent().data('tktpSeq');

				if (url == '-') {

					// 로그인
					screenUI.f.loginConfirm();

				} else if (url == '--') {

					// 선생님 회원만
					screenUI.f.loginTeacherOnlyAlert();

				} else if (!$text.isEmpty(url)) {

                    // 미리보기
                    if(isMobile()) {
                        location.href = "/Ebook/preview.mrn?source=EXTRA&file=" + url;
                    }else {
                        var popup = window.open("/Ebook/preview.mrn?source=EXTRA&file=" + url, 'preview', 'height=1024,width=768');
                    }
                    page_play("EXTRA","THEATER",tktpSeq,$('body').data('useridx'),"DOWNLOAD");//로그

				}
            },

            //  다운로드
            down: function() {

                let url = $(this).parent().data('url');

                if (url == '-') {

                    // 로그인
                    screenUI.f.loginConfirm();

                } else if (url == '--') {

                    // 선생님 회원만
                    screenUI.f.loginTeacherOnlyAlert();

                } else if (!$text.isEmpty(url)) {

                    // 다운로드
                    downloadMessage();

                    var paramBuf = "<input type='hidden' name='fileId' value='"+url+"' >";
                    $("#idDownload").html(paramBuf);
                    document.downloadForm.action = "https://ele.m-teacher.co.kr/File/FileDown.mrn";
                    document.downloadForm.submit();

                }
            },

			// 자료 전체 다운로드
			downloadAll: function() {

                // 다운로드
                downloadMessage();

                let paramBuf = "";

				$('#'+screen.v.tab).find('.block-level5 .btn-group').each(function(i, item){
				    paramBuf += "<input type='hidden' name='fileId' value='" + $(item).data('url') + "' >";
                    page_play("EXTRA","THEATER", $(item).data('tktpSeq'), $('body').data('useridx'),"DOWNLOAD");//로그
				});

                $("#idDownload").html(paramBuf);
                $("#filename").val(screen.v.fileName);// 파일명

                document.downloadForm.action = "https://ele.m-teacher.co.kr/File/FileDownMulti.mrn";
                document.downloadForm.submit();

			},

			// 비디오 탭 이동
			videoTabChange: function() {

			    $('#'+screen.v.tab).find('.btn-video-tab-change').removeClass('on');
			    $(this).addClass('on');

                if($(this).text() === '1'){

                    player1.src(screen.v.video.url1);
                    player1.poster(screen.v.video.url2);
                } else {

                    player1.src(screen.v.video.url3);
                    player1.poster(screen.v.video.url4);
                }

			},

		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// 주제별 전체 다운로드
			$('.btnDownloadAll').on('click', screen.f.downloadAll);


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
		        $this.parent().next().children('.tab-cont').stop(true,true).hide().siblings( $this.find('a').attr('href') ).fadeIn();
		        e.preventDefault();
		    });

		    $('.tabs .tab1').on('click', function() {
		       screen.v.level1Seq = 2;
		       screen.v.tab = 'tab1';

		        screen.f.setLevel2();
		    });
		    $('.tabs .tab2').on('click', function() {
		        screen.v.level1Seq = 3;
		        screen.v.tab = 'tab2';

		        screen.f.setLevel2();
		    });
		    $('.tabs .tab3').on('click', function() {
		        screen.v.level1Seq = 4;
		        screen.v.tab = 'tab3';

		        screen.f.setLevel2();
		    });

		    // level2 클릭
            $(document).on('click', '.aside .block-level2 .item a', screen.f.clickLevel2);

            // level3 클릭
            $(document).on('click', '.aside .block-level3 .item a', screen.f.clickLevel3);

            // level4 클릭
            $(document).on('click', '.aside .block-level4 .item a', screen.f.clickLevel4);

            // level2 클릭(모바일)
            $(document).on('click', '.aside-mobile .block-level2 li a', screen.f.clickMobileLevel2);

            // tab2 level2 클릭(모바일)
            $(document).on('change', '#selTab2Level2', screen.f.clickMobileLevel2);

            // level3 클릭(모바일)
            $(document).on('click', '.aside-mobile .block-level3 li a', screen.f.clickMobileLevel3);

            // level4 클릭(모바일)
            $(document).on('change', '#selLevel4', screen.f.clickMobileLevel4);

			// 미리보기
			$(document).on('click', '.btn-preview.on', screen.f.preview);

			// 다운로드
            $(document).on('click', '.btn-down.on, .btn-down.on', screen.f.down);

			// 비디오 시간 이동
            $(document).on('click', '.btn-video-tab-change', screen.f.videoTabChange);

			// 링크복사
            new ClipboardJS('.btnCopyLink', {

                text: function() {
                    return $('#'+screen.v.tab).find('.video-wrap .video video').not('d-none').attr('src');
                }
            }).on('success', function () {
                $msg.alert(lng.msg.copyLink);
            });

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			// html level2 복제
			screen.v.level2Html = $('.aside .block-level2 li.item').clone();

            // html level2 복제 - mobile
            screen.v.level2HtmlMobile = $('.aside-mobile .block-level2 li').clone();

            // html level3 복제
			screen.v.level3Html = $('.aside .block-level3 li').clone();

            // html level3 복제 - mobile
            screen.v.level3HtmlMobile = $('.aside-mobile .block-level3 li').clone();

			// html level4 복제
			screen.v.level4Html = $('.aside .block-level4 li.item').clone();

			// html level5 복제 (tab1, tab2)
			screen.v.level5Html = $('.block-level5 ul li').clone();

            // html level5 type2복제 (tab3)
            screen.v.level5Html2 = $('.pc-only .block-level5 tr.item').clone();

            // html level5 type2복제 - mobile (tab3)
            screen.v.level5Html2Mobile = $('.mobile-only .block-level5 .item').clone();

			// Event 정의 실행
			screen.event();

			// 목록 가져오기
			screen.c.getList();


            if($('#mvideo01').length){
                player1 = videojs('mvideo01', {});
            }
            if($('#mvideo02').length){
                player2 = videojs('mvideo02', {});
            }

		}
	};

	screen.init();
	window.screen = screen;
});
