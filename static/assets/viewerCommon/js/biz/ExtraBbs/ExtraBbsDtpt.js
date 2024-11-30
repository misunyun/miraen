$(function() {

	const screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			isBbsThumnailType: false,
			pagingRowCount: 5,
			tagNmList: ['extraGradeNm', 'extraTermNm', 'extraCourseNm', 'typeCSeq1Nm', 'typeCSeq2Nm', 'typeCSeq3Nm', 'typeCSeq4Nm'],
			isFirst: false,
//			exceptEcmTabCSeq: '1089', // 로그인 예외처리 (수업활동자료 - 교육연극 수업 게시판)
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			/**
			 * 게시판 공통 상세 조회
			 *
			 * @memberOf screen.c
			 */
			getBbsCmmDtpt: function() {

				const options = {
					url: '/bbs/bbsCmmDtpt.ax',
					data: {
						pageRowLength: screen.v.pagingRowCount,
						page: 1,
						extraSeq: $('#wrap').data('extraSeq'),
					},
					success: function(res) {
						if(!!res.resultData) {
							if(!!res.resultData.bbsCmmDtpt) {
//								if(res.resultData.bbsCmmDtpt['ecmTabCSeq'] != screenUI.v.exceptEcmTabCSeq){ // 로그인 예외처리 아닌경우 (수업활동자료 - 교육연극 수업 게시판)
//									if (!$('body').data('scGrade')) {
//										screenUI.f.loginConfirm( location.href);
//									} else if($('body').data('scGrade') != '002') {
//										screenUI.f.loginTeacherOnlyAlert( location.href);
//									}
//									return;
//								}
								// 게시판 상세 설정
								screen.f.setBbsCmmDtpt(res.resultData.bbsCmmDtpt);
							} else {

								$msg.alert('삭제 되었거든 잘못된 주소 입니다.', () => {

									location.href = location.pathname.substring(0, location.pathname.indexOf('.mrn') + 4);
								});
							}

							if(screen.v.isBbsThumnailType && !!res.resultData.lessonList) {

								// 연계교과 설정
								screen.f.setLesson(res.resultData.lessonList);
							}

							if(!!res.resultData.contentList) {

								// 플레이리스트 존재 여부로 수업하기 버튼 플래그 설정
								if (!!res.resultData.bbsPlayList && res.resultData.bbsPlayList.length > 0) {
									screen.v.isFirst = true;
								}

								// 참고자료 설정
								screen.f.setRefDatm(res.resultData.contentList);
							}

							if(screen.v.isBbsThumnailType && !!res.resultData.cardNewsList) {

								// 카드리스트 설정
								screen.f.setCardList(res.resultData.cardNewsList);
							}

							if(screen.v.isBbsThumnailType && !!res.resultData.bbsRandomList && res.resultData.bbsRandomList.length > 0) {

								// 연계교과 썸네일 게시판 생성
								screen.f.createBbsThumnail(res.resultData.bbsRandomList);
							} else {

								$('.list-board.thumb-type ').prev().remove();
								$('.list-board.thumb-type ').remove();
							}

							// 댓글 설정
							screen.f.setReply(res.resultData.replyList, 1, res.resultData.replyTotalCnt);
						}

						screen.f.setHistory(res.resultData.bbsCmmDtpt);

						// 에디터 표 입력 시 width 고정되는 현상 수정(모바일에서 스크롤생김)
						$("figure").css("width", "auto");

					}
				}

				$cmm.ajax(options);
			},

			/**
			 * 댓글 리스트 조회
			 *
			 * @memberOf screen.c
			 */
			getReplyList: function(page) {

				const options = {
					url: '/bbs/replyList.ax',
					data: {
						pageRowLength: screen.v.pagingRowCount,
						page: page,
						extraSeq: $('#wrap').data('extraSeq'),
						isMyCrea: $('#my-comment').is(':checked') ? 'Y' : '',
					},
					success: function(res) {

						if(!!res.resultData) {

							// 댓글 설정
							screen.f.setReply(res.resultData.list, page, res.resultData.totalCnt);
						}
					}
				}

				$cmm.ajax(options);
			},

			/**
			 * 댓글 등록
			 *
			 * @memberOf screen.c
			 */
			insReply: function() {

				const options = {
					url: '/bbs/insReply.ax',
					data: {
						extraSeq: $('#wrap').data('extraSeq'),
						extraReplyContent: $('#txtReply').val(),
					},
					success: function(res) {

						$('#txtReply').val('');
						$('.comment-write').find('.byte em').text('0');
						// 댓글 리스트 조회
						screen.c.getReplyList(1);
					}
				}

				$cmm.ajax(options);
			},

			/**
			 * 댓글 수정
			 *
			 * @memberOf screen.c
			 */
			modReply: function($li) {

				const options = {
					url: '/bbs/modReply.ax',
					data: {
						extraSeq: $('#wrap').data('extraSeq'),
						extraReplySeq: $li.data('extraReplySeq'),
						extraReplyContent: $li.find('[data-id=txtModReply]').val(),
					},
					success: function(res) {

						$li.find('.comment').html($li.find('[data-id=txtModReply]').val().replace(/</g, '&lt;').replace(/\n/g, '<br>'));
						$li.find('.comment').removeClass('d-none');
						$li.find('.comment-modify').addClass('d-none');
					}
				}

				$cmm.ajax(options);
			},

			/**
			 * 댓글 삭제
			 *
			 * @memberOf screen.c
			 */
			delReply: function(extraReplySeq) {

				const options = {
					url: '/bbs/delReply.ax',
					data: {
						extraSeq: $('#wrap').data('extraSeq'),
						extraReplySeq: extraReplySeq,
					},
					success: function(res) {

						$msg.alert('댓글이 삭제되었습니다.');
						// 댓글 리스트 조회
						screen.c.getReplyList(1);
					}
				}

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
			 * 게시판 상세 설정
			 *
			 * @memberOf screen.f
			 */
			setBbsCmmDtpt: item => {

				// 수정 버튼
				if(item.createUser === $('body').data('userId')) {
					$('#btnMod').removeClass('d-none');
				}

				// 제목
				$('.detail-title').find('.tit').text(item.extraTitle);

				const menuNm = $('#lnb .swiper-slide.active').text().trim();
				$("meta[property='og\\:description']").attr("content", menuNm + ' | ' + item.extraTitle);

				// 북마크
				$('.detail-title').find('.cmmBookmark').data('extra_seq', item.extraSeq);
				$('.detail-title').find('.cmmBookmark').addClass(!!item.isBookmark ? 'on' : '');

				// 게시판 타입 : 썸네일
				if(screen.v.isBbsThumnailType) {

					// 썸네일
					$('.detail-cont').find('.thumb img').attr('src', item.extraThumbnailUrl).removeClass('d-none');

					// 썸네일 크기 계산하여 css 변경 적용
					$("<img/>").attr('src', item.extraThumbnailUrl).on('load', function() {

						const w = this.width;
						const h = this.height;

						$('body.cmm-bss').removeClass('crop-width').removeClass('crop-height').removeClass('crop-sqare');

						if (w > h ) {
							$('body.cmm-bss').addClass('crop-width');
						} else if (w < h ) {
							$('body.cmm-bss').addClass('crop-height');
						} else {
							$('body.cmm-bss').addClass('crop-square');
						}

					});

					// 출처
					if(!!item.extraSource) {

						$('.detail-cont').find('.dlist').removeClass('d-none');
						$('.detail-cont').find('.dlist dt').eq(1).removeClass('d-none');
						$('.detail-cont').find('.dlist dd').eq(1).removeClass('d-none');

						if (!!item.extraSourceUrl) {

							$('.detail-cont').find('.extraSourceUrl').append(`<a href="${item.extraSourceUrl}" class="new-win" target="_blank">${item.extraSource}</a>`);
						} else {

							$('.detail-cont').find('.extraSourceUrl').text(item.extraSource);
						}
					}

					// 요약
					$('.detail-cont').find('.info .txt').html(item.extraSubtitle1.replace(/\n/g, '<br>'));

					// 해시태그
					if(!!item.extraTag) {

						item.extraTag.replaceAll(',', '').split(' ').forEach(tag => {

							$('.detail-cont').find('.tag').append(`<span>#${tag}</span>`);
						});
					}

					// 태그생성
					screen.v.tagNmList.forEach(key => {

						if(!!item[key]) {

							$('.detail-tag').append(`<span>${item[key]}</span>`);
						}
					});

					// 자료가 없으면 숨김
					if ($text.isEmpty(item.extraContent)) {
						$('.detail-cont').find('.info-txt').addClass('d-none');
					}

					// 내용
					$('.detail-cont').find('.info-txt').html(item.extraContent);

					// ck-editor 안의 href는 새창으로 처리
					$('.detail-cont').find('.info-txt').find("a[href^='http']").attr('target','_blank');

					// 유튜브
					$('.detail-cont').find('.info-txt').find('oembed').each(function() {

						oembedUrl = $(this).attr('url');
						oembedUrl = oembedUrl.substring(oembedUrl.lastIndexOf('/'));

						$(this).append('<div style="position: relative;padding-bottom: 56%;"><iframe src="https://www.youtube.com/embed' + oembedUrl + '" allowfullscreen="" scrolling="no" style="border: 0px;width: 100%;height: 100%;position: absolute;"></iframe></div>');
					});
				} else {

					// 작성자
					// 자료나눔 - 지역화 자료실의 경우 사용자이름 '엠티처'로 표시
					if($('#wrap').data('boardTypeCSeq') == '435' && (`${item.ecmTabCSeq}` == '1027' || `${item.ecmTabCSeq}` == '956')){ // 운영 || 개발
						$('.detail-title').find('.name-wrap .name').html(`엠티처`);
					}else{
						$('.detail-title').find('.name-wrap .name').html(`${item.createUserMasking}`);
					}

					// 작성일
					$('.detail-title').find('.name-wrap .date').text(item.createDate);

					// 태그생성
					screen.v.tagNmList.forEach(key => {

						if(!!item[key]) {

							$('.detail-tag').append(`<span>${item[key]}</span>`);
						}
					});

					// 내용
					$('.detail-cont').find('.detail-txt').html(item.extraContent);

					// 유튜브
					$('.detail-cont').find('.detail-txt').find('oembed').each(function() {

						oembedUrl = $(this).attr('url');
						oembedUrl = oembedUrl.substring(oembedUrl.lastIndexOf('/'));

						$(this).append('<div style="position: relative;padding-bottom: 56%;"><iframe src="https://www.youtube.com/embed' + oembedUrl + '" allowfullscreen="" scrolling="no" style="border: 0px;width: 100%;height: 100%;position: absolute;"></iframe></div>');
					});

					// 연관추천 타이틀 숨김
					$('.tit-detail.recommend').addClass('d-none');

				}
			},

			/**
			 * 연계교과 설정
			 *
			 * @memberOf screen.f
			 */
			setLesson: list => {

				let lessonTxt;
				if(list.length > 0) {

					list.forEach(item => {

//						lessonTxt = `${item.textbookCurriculumLevelNm} ${item.textbookNm}`;
						lessonTxt = `${item.textbookNm}`;
						if(!!item.textbookLessonUnitHighNm) {

							lessonTxt += ` 〉${item.textbookLessonUnitHighNm}`;
						}
						if(!!item.textbookLessonUnitMidNm) {

							lessonTxt += ` 〉${item.textbookLessonUnitMidNm}`;
						}
						if(!!item.textbookLessonUnitLowNm) {

							lessonTxt += ` 〉${item.textbookLessonUnitLowNm}`;
						}
						if(!!item.textbookLessonPeriodNm) {

							lessonTxt += ` 〉${item.textbookLessonPeriodNm}`;
						}

						$('.detail-cont').find('.txt-list').append(`<li>${lessonTxt}</li>`);
					});

					$('.detail-cont').find('.dlist').removeClass('d-none');
					$('.detail-cont').find('.dlist dt').eq(0).removeClass('d-none');
					$('.detail-cont').find('.dlist dd').eq(0).removeClass('d-none');
				}
			},

			/**
			 * 참고자료 설정
			 *
			 * @memberOf screen.f
			 */
			setRefDatm: list => {

				let $li;
				list.forEach(item => {

					// 게시판 타입 : 썸네일
					if(screen.v.isBbsThumnailType) {

						// 미디어 일 경우
						if(item.contentsExtraType === 'MAIN') {

							// 링크 복사 버튼 처리
							if(item.contentsExtraLinkCopyYn === 'Y') {

								$('.link-copy a').data('url', item.contentsExtraUrl);
								$('.link-copy').removeClass('d-none');
							}

							// 유뷰트일 경우
							if(item.contentsExtraDiv === 'YOUTUBE' && !!item.contentsExtraUrl) {

								// TODO : CSS 수정
								$('.detail-cont').find('.vod-container').css('padding-bottom', '0px');
								$('.detail-cont').find('.video-wrap').removeClass('d-none');
								$('.detail-cont').find('.vod-container').append(`<iframe width="700" height="393" src="${item.contentsExtraUrl.replace('https://youtu.be', 'https://www.youtube.com/embed')}?loop=1" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
							} else if(item.contentsExtraDiv === 'VIDEO' && item.contentsExtraUrl) {

								$('.detail-cont').find('.video-wrap').removeClass('d-none');
								$('.detail-cont').find('.vod-container').append(`<video src="${item.contentsExtraUrl}" controls="" controlslist="nodownload"></video>`);
							} else if(item.contentsExtraDiv === 'FILE' && item.fileUrl) {

								$('.detail-cont').find('.video-wrap').removeClass('d-none');
								$('.detail-cont').find('.vod-container').append(`<video src="${item.fileUrl}" controls="" controlslist="nodownload"></video>`);

								if(item.contentsExtraDownloadYn === 'Y') {
									$('.detail-cont').find('.video-btn').removeClass('d-none');

									// 동영상 다운로드 fileId 부여
									$('.detail-cont .video-btn').find('.cmmFiledownloadId').data('file-id', item.fileId);
								}

							} else if(item.contentsExtraDiv === 'HLS') {

								$('.detail-cont').find('.vod-container').attr('style', '');
								$('.detail-cont').find('.video-wrap').removeClass('d-none');
								$('.detail-cont').find('.vod-container #hls_player').removeClass('d-none');

								// hls link 적용
								$.post("/getHlsUrl.mrn",{contentSeq:item.contentsExtraUrl.trim()},function (res) {
									if(res.resultCode == "0000") {
										$("#hls_player").find('source').attr("src", res.row.videoUrl);
										$("#hls_player").attr('poster', res.urlHost+item.contentsExtraUrl.trim());
										$('#hls_player').mediaelementplayer();
										$('.detail-cont-header .thumb img').attr('src', res.urlHost+item.contentsExtraUrl.trim());
										$('.link-copy a').data('url', res.row.videoUrl);
									}
								},"json");
							}

						} else {

							$li = $(document.createElement('li'));

							const extraSeq = $('.main-wrap').data('extra-seq');
							// 파일정보
							$li.append(`<div class="txt-group"><span>${item.textbookCurriculumNm}</span><a href="javascript:;" class="cmmFiledownloadId" data-type="EXTRA" data-extra-seq="${extraSeq}" data-file-id="${item.fileId}">${item.contentsExtraShowFileName}</a></div>`)

							// 다운로드 허용
							if (item.contentsExtraDownloadYn === 'Y') {
								$li.append(`<div class="btn-group">
											<button type="button" class="preview cmmFilePopPreview" data-type="EXTRA" data-extra-seq="${extraSeq}" data-file-id="${item.fileId}" data-ecm-tab-c-seq="${item.ecmTabCSeq}">미리보기</button>
											<button type="button" class="down cmmFiledownloadId" data-file-id="${item.fileId}" data-ecm-tab-c-seq="${item.ecmTabCSeq}">다운로드</button>
										</div>`);
							}
							// 다운로드 미허용
							else {
								/*<button type="button" class="preview" disabled>미리보기</button>*/
								$li.append(`<div class="btn-group">
											<button type="button" class="preview cmmFilePopPreview" data-type="EXTRA" data-extra-seq="${extraSeq}" data-file-id="${item.fileId}" data-ecm-tab-c-seq="${item.ecmTabCSeq}">미리보기</button>
											<button type="button" class="down" disabled>다운로드</button>
										</div>`);
							}

							// 플레이 리스트가 존재할 때, 첫번째 항목에다가 수업하기 버튼 추가
							if( screen.v.isFirst ) {
								$li.find('.btn-group').prepend(`<a href="javascript:;" class="btn-learn" data-extra-seq="${extraSeq}"><span>수업하기</span></a>`);
								screen.v.isFirst = false;
							}

							$('.detail-cont').find('.refer-list').append($li);
							$('.detail-cont').find('.refer-list').removeClass('d-none');
						}
					} else {

						if(item.contentsExtraType !== 'MAIN') {
							$('.detail-cont').find('.attach-list').append(`<li><a href="javascript:;" class="cmmFiledownloadId" data-file-id="${item.fileId}">${item.contentsExtraShowFileName} <span>(${$file.getFileSize(item.fileSize)})</span></a></li>`);
							$('.detail-cont').find('.attach-box').removeClass('d-none');
						}
					}
				});
			},

			/**
			 * 카드 리스트 설정
			 *
			 * @memberOf screen.f
			 */
			setCardList: list => {

				// 자료가 없으면 숨김
				if (list.length == 0) $('.detail-cont').find('.card-list').addClass('d-none');

				list.forEach(item => {

					$('.detail-cont').find('.card-list').append(`<li><a href="${item.fileUrl}" data-fancybox="gallery"><img src="${item.fileUrl}" alt=""></a></li>`);
				});
			},

			/**
			 * 댓글 설정
			 *
			 * @memberOf screen.f
			 */
			setReply: (list, page, totalCnt) => {

				$('.comment-list').find('li').not(':eq(0)').remove();

				if(totalCnt > 0) {

					$('.comment-list').find('li').eq(0).addClass('d-none');
					$('.comment-header').find('.num em').text($num.comma(totalCnt));
					let $li;
					list.forEach(item => {

						$li = screen.f.$liReply.clone();

						$li.data(item);
						// 작성자 ID
						$li.find('.id').text(item.userId);
						// 작성일자
						$li.find('.date').text(item.writeDate);
						// 관리자 삭제
						if(item.adminDelYn === 'Y') {

							$li.find('.btn-group,.comment-modify').remove();
							$li.find('.comment').addClass('hide-comment')
						} else {

							// 댓글 내용
							$li.find('.comment').html(item.extraReplyContent.replace(/</g, '&lt;').replace(/\n/g, '<br>'));
							$li.find('[data-id=txtModReply]').val(item.extraReplyContent);
						}
						// 수정 권한
						if(item.isModify === 'N') {
							$li.find('.btn-group,.comment-modify').remove();
						}

						$('.comment-list').append($li);
					});

					// 페이징
					$cmm.setPaging($('.box-paging02'), {
						page: page,
						pagingRowCount: screen.v.pagingRowCount,
						totalCnt: totalCnt
					}, screen.c.getReplyList);
				} else {

					$('.comment-header').find('.num em').text(0);
					$('.comment-list').find('li').eq(0).removeClass('d-none');
				}
			},

			/**
			 * 연관 게시판 생성
			 *
			 * @memberOf screen.f
			 */
			createBbsThumnail: data => {

				// row 생성 함수
				const createRow = ($elet, item) => {

					// 링크
					$elet.find('a').attr('href', 'javascript:;');
					$elet.find('a').attr('href', `${location.pathname.substring(0, location.pathname.lastIndexOf('/'))}/${item.extraSeq}`);

					// 썸네일
					$elet.find('img').attr('src', item.extraThumbnailUrl);

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

				$('.list-board.thumb-type').empty();

				// 연관추천 타이틀 숨김
				$('.tit-detail.recommend').addClass('d-none');

				data.forEach(item => {
					// 연관추천 타이틀 표시
					$('.tit-detail.recommend').removeClass('d-none');
					// 이미지형
					$('.list-board.thumb-type').append(createRow(screen.f.$liThumb.clone(), item));
				});

				setTimeout(() => {
					var $itemSlider = $('.list-slider');
					$('.list-slider').slick({
						dots: false,
						slidesToShow: 4,
						responsive: [

							{
								breakpoint: 900,
								settings: {
									slidesToShow: 2,
									arrows : true,
								}
							},
							{
								breakpoint: 640,
								settings: {
									slidesToShow: 1
								}
							}
						]
					});
				}, "1000")

			},

			/**
			 * 로그인 여부
			 *
			 * @memberOf screen.f
			 */
			isLogin: (callback) => {
//				if($('#wrap').data('ecmTabCSeq') == screenUI.v.exceptEcmTabCSeq ){
//					return true;
//				}


				// 회원 아닐시
				if (!$('body').data('scGrade')) {

					screenUI.f.loginConfirm(callback);
				// 정회원 아닐시
				} else if($('body').data('scGrade') != '002') {

					screenUI.f.loginTeacherOnlyAlert(callback);
				} else {

					return true;
				}

				return false;
			},

			/**
			 * 접속 History 처리
			 *
			 * @memberOf screen.f
			 */
			setHistory: (resData) => {

				let cont = '';
				let fg = false;
				// url로 인한 재검색
				var query = window.location.search.substring(1).split('&');
				$.each(query, function(i,v){

					let vars = v.split('=')[0];
					let vals = v.split('=')[1];

					if(vars == 'from') {
						cont = vals;
						if(vals == 'SEARCH') {
							fg = true;
						}
					}
				})

				if(fg) return;

				screenUI.c.pageLink(
					$text.isEmpty($('body').data('scGrade'))? true : false	// userTf 로그인여부 (1:스킵 0:저장)
					, 'EXTRA'												// logDiv (TEXTBOOK / MAIN / EXTRA)
					, !!resData.emcSeq? 'cmm_bbs' : 'EXTRA'					// targetModule
					, resData.extraSeq										// targetKey1
					, $text.isEmpty(resData.emcSeq)? null : resData.emcSeq	// targetKey2
					, 'CLICK'												// targetAction
					, ''													// target_content1
					, cont													// target_content2
				)
			}
		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// 목록
			$('#btnList').on('click', () => {

				location.href = location.pathname.substring(0, location.pathname.indexOf('.mrn') + 4) + location.search;
			});

			// 수정
			$('#btnMod').on('click', () => {

				location.href = location.pathname.substring(0, location.pathname.indexOf('.mrn') + 4) + '/form/' + $('#wrap').data('extraSeq') + location.search;
			});

			// 내가 작성한 댓글
			$('#my-comment').on('change', () => {

				// 댓글 리스트 조회
				screen.c.getReplyList(1);
			});

			// 댓글 작성
			$('#txtReply').on('keyup', () => {

				$('.comment-write').find('.byte em').text($('#txtReply').val().length);
			});

			// 수업하기
			$(document).on('click', '.btn-learn', (e) => {
				let extraseq = !!$(e.target).data('extra-seq') ? $(e.target).data('extra-seq') : $(e.target).parent('a').data('extra-seq');
				var popup = window.open("/Ebook/extra.mrn?extraSeq=" + extraseq
										, 'smartppt'
										, 'height=' + screen.height + ',width=' + screen.width + ',fullscreen=yes');
				popup.moveTo(0,0);
			});

			// 댓글 등록
			$('#btnAddReply').on('click', () => {

				if(screen.f.isLogin()) {

					if($('#txtReply').val().length === 0) {

						$msg.alert('댓글 내용을 입력해주세요.', () => {

							$('#txtReply').focus();
						});
					} else if($('#txtReply').val().length < 3) {

						$msg.alert('내용을 3글자 이상 등록해 주세요.', () => {

							$('#txtReply').focus();
						});
					} else if($('#txtReply').val().length > 200) {

						$msg.alert('200자를 초과하여 입력할 수 없습니다.', () => {

							$('#txtReply').focus();
						});
					} else {

						$msg.confirm('댓글을 등록 하시겠습니까?', () => {

							// 댓글 등록
							screen.c.insReply();
						});
					}
				}
			});

			// 댓글 버튼(수정,삭제,저장,취소)
			$('.comment-list').on('click', 'button', function() {

				let $li = $(this).closest('li');
				// 수정
				if($(this).hasClass('modify')) {

					$li.find('.comment').addClass('d-none');
					$li.find('.comment-modify').removeClass('d-none');
				// 취소
				} else if($(this).hasClass('cancel')) {

					$li.find('.comment').removeClass('d-none');
					$li.find('.comment-modify').addClass('d-none');
				// 삭제
				} else if($(this).hasClass('del')) {

					$msg.confirm('댓글을 삭제 하시겠습니까?', () => {

						// 댓글 삭제
						screen.c.delReply($li.data('extraReplySeq'));
					});
				// 저장
				} else if($(this).hasClass('save')) {

					if($li.find('[data-id=txtModReply]').val().length === 0) {

						$msg.alert('댓글 내용을 입력해주세요.', () => {

							$li.find('[data-id=txtModReply]').focus();
						});
					} else if($li.find('[data-id=txtModReply]').val().length < 3) {

						$msg.alert('내용을 3글자 이상 등록해 주세요.', () => {

							$li.find('[data-id=txtModReply]').focus();
						});
					} else if($li.find('[data-id=txtModReply]').val().length > 200) {

						$msg.alert('200자를 초과하여 입력할 수 없습니다.', () => {

							$li.find('[data-id=txtModReply]').focus();
						});
					} else {

						$msg.confirm('댓글을 수정 하시겠습니까?', () => {

							// 댓글 수정
							screen.c.modReply($li);
						});
					}
				}
			});

			// 링크복사
            new ClipboardJS('.btnCopyLink', {

                text: function(e) {
					let url = $(e).data('url');
					if(url.indexOf('youtube.com/embed/')>0) url = url.replaceAll('embed/','watch?v=');
                    return url;
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
			if((location.href).indexOf("dev") > -1 || (location.href).indexOf("local") >-1){
				screenUI.v.exceptEcmTabCSeq = '980';
			}
			// template
			screen.f.$liReply = $('[data-template=liReply]').clone().removeClass('d-none');
			$('[data-template=liReply]').remove();
			screen.f.$liThumb = $('[data-template=liThumb]').clone().removeClass('d-none');
			$('[data-template=liThumb]').remove();

			// Event 정의 실행
			screen.event();

			// 게시판 타입
			screen.v.isBbsThumnailType = $('#wrap').data('boardTypeCSeq') === 434;

			// 상시 오픈체크
			if(!!$('#wrap').data('viewOpen')) {

				// 게시판 공통 상세 조회
				screen.c.getBbsCmmDtpt();
			} else {

				if(screen.f.isLogin(() => history.back())) {

					// 게시판 공통 상세 조회
					screen.c.getBbsCmmDtpt();
				}
			}


		}
	};

	screen.init();
	window.mrnScreen = screen;
});