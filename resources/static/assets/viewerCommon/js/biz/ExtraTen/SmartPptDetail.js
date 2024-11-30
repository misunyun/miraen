let screen;
$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			item: null,
			position: 0,
			beforeWidth: 0,
			beforeHeight: 0
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 목록 가져오기
			getList: function() {

				let seq = $cmm.getUrlParams('seq');

				const options = {
					url: '/ExtraTen/GetSmartPptListJson.mrn',
					data: { textbookLessonSeq: seq},
					success: function(res) {
						if (!!res.resultData) {

							screen.v.item = res.resultData;

                             if(screen.v.item.length>0){

                                let url = $('input[name=viewerHost]').val() + '/Ebook/v.mrn?playlist='+seq+'&user='+$('body').data('useridx')+'&start='+ screen.v.item[0].textbookLessonSubjectSeq;
                             // 20230915 | 엠티처-운영/779
//                                let url = $('input[name=viewerHost]').val() + '/viewer/v.html?playlist='+seq+'&user='+$('body').data('useridx')+'&start='+ screen.v.item[0].textbookLessonSubjectSeq;
								// let url2 = $('input[name=viewerHost]').val()+screen.v.item[0].smartpptUrl;

								// 사이즈 재계산
								screen.f.resize();

								// $('#smartppt_iframe').attr('src', $('input[name=viewerHost]').val()+screen.v.item[0].smartpptUrl);
								$('#smartppt_iframe').attr('src', url);

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

		    // 이전 버튼 클릭
		    clickPrev: function(){
                let pos = screen.v.position - 1;

                if(pos >= 0){
                    screen.v.position = pos;
                    $('#smartppt_iframe').attr('src', $('input[name=viewerHost]').val()+screen.v.item[pos].smartpptUrl);
                }
		    },

		    // 다음 버튼 클릭
            clickNext: function(){
                let pos = screen.v.position + 1;

                if(pos < screen.v.item.length){
                    screen.v.position = pos;
                    $('#smartppt_iframe').attr('src', $('input[name=viewerHost]').val()+screen.v.item[pos].smartpptUrl);
                }

            },

			// size 변경시
			resize: function() {

				screen.v.beforeWidth = $(window).width();
				screen.v.beforeHeight = $(window).height();

				$('#wrap').css('min-height', screen.v.beforeHeight);
				$('.viewer_iframe').css('min-height', screen.v.beforeHeight-10);
				$('.viewer_iframe').css('height', screen.v.beforeHeight-10);

				$("#smartppt_iframe").contents().find("#wrap").css('min-height', screen.v.beforeHeight);
				$("#smartppt_iframe").contents().find("#wrap").css('height', screen.v.beforeHeight);

				// 닫힘 아닌 경우
				if (!$("#smartppt_iframe").contents().find("#viewer-wrap").hasClass('aside-close')) {

					setTimeout(function () {

						// iframe 작업 처리

						// pc
						$("#smartppt_iframe").contents().find(".icon-aside-open-txt").trigger('click');
						$("#smartppt_iframe").contents().find(".icon-aside-open-txt").css('display', 'none');
						$("#smartppt_iframe").contents().find("#viewer-hd").css('display', 'none');

						// Moblie
						// $("#smartppt_iframe").contents().find(".wrap-inner .btn-box").css('display', 'none');
						$("#smartppt_iframe").contents().find(".wrap-inner .btn-box .data-line").css('display', 'none');
						$("#smartppt_iframe").contents().find(".wrap-inner .btn-box .btn-box-bottom").css('display', 'none');
						$("#smartppt_iframe").contents().find(".wrap-inner #hd #btnExit").css('display', 'none');
						$("#smartppt_iframe").contents().find(".wrap-inner #hd .title").css('margin-left', '10px');

						$("#smartppt_iframe").contents().find(".wrap-inner #quick").css('display', 'none');

						setTimeout(function () {
							$('.loadingoverlay').remove();
						}, 600);
					}, 2000);
				}

				setTimeout(function () {
					$('.loadingoverlay').remove();
				}, 3000);

			},

		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

		    // 이전 버튼 클릭
            // $(document).on('click', '.btn-prev', screen.f.clickPrev);
            $(document).on('click', '.btn-prev', function() {

				// PC
				$("#smartppt_iframe").contents().find(".icon-prev-content").trigger('click');

				// MOBILE
				$("#smartppt_iframe").contents().find("#btnPrev").trigger('click');

			});

		    // 다음 버튼 클릭
            // $(document).on('click', '.btn-next', screen.f.clickNext);
            $(document).on('click', '.btn-next', function() {

				// PC
				$("#smartppt_iframe").contents().find(".icon-next-content").trigger('click');

				// MOBILE
				$("#smartppt_iframe").contents().find("#btnNext").trigger('click');
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

			// Event 정의 실행
			screen.event();

            // 목록 가져오기
            screen.c.getList();


		}
	};

	screen.init();
	window.screen = screen;
});