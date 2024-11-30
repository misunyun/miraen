$(function() {

	const screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			isBbsThumnailType: false,
			pagingRowCount: 10,
			tagNmList: ['extraGradeNm', 'extraTermNm', 'extraCourseNm', 'typeCSeq1Nm', 'typeCSeq2Nm', 'typeCSeq3Nm', 'typeCSeq4Nm'],
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			/**
			 * 나의 게시판 리스트 조회
			 *
			 * @memberOf screen.c
			 */
			getMyBbsList: function(page) {

				page = !!page ? page : 1;
				const options = {
					url: '/bbs/myBbsList.ax',
					data: {
						page: page,
						searchTxt: $('[data-id=divBbs]').find('.form-keyword').val(),
					},
					success: function(res) {

						$('[data-id=divBbs]').find('.tbl-board tbody').empty();
						$('[data-id=divBbs]').find('.board-list-type').empty();

						if(res.resultData.totalCnt === 0) {

							$('[data-id=divBbs]').find('.no-data').removeClass('d-none');
							$('.box-paging02').addClass('d-none');
						} else {

							$('[data-id=divBbs]').find('.no-data').addClass('d-none');

							screen.v.totalCnt = res.resultData.totalCnt;
							// 페이징
							$cmm.setPaging($('.box-paging02'), {
								page: page,
								pagingRowCount: screen.v.pagingRowCount,
								totalCnt: res.resultData.totalCnt
							}, screen.c.getMyBbsList);

							// row 생성 함수
							const createRow = ($elet, item, idx) => {

								// No
								$elet.find('.num').text(screen.f.getBbsNum(idx));
								// 게시판
								$elet.find('.tleft').text(item.gnbNm);
								// 제목
								$elet.find('a').text(item.extraTitle);
								// 등록일시
								$elet.find('.date').text(item.createDate);

								// 첨부파일
								if(item.isAtchFile > 0) {

									$elet.find('.attach-file').removeClass('d-none');
								}
								// 댓글
								if(item.replyCnt > 0) {

									$elet.find('.comment-num').removeClass('d-none').append($num.comma(item.replyCnt));
								}

								// 관리자 삭제
								if(item.adminDelYn === 'Y') {

									$elet.find('div.tit').removeClass('tit');
								} else {

									$elet.find('.tit').removeClass('hide-notice');
									$elet.find('.hide-txt').remove();
									// 링크
									$elet.find('a').attr('href', `${item.pageUrl}/${item.extraSeq}`);
								}

								return $elet;
							};

							res.resultData.list.forEach((item, idx) => {

								// PC
								$('[data-id=divBbs]').find('.tbl-board tbody').append(createRow(screen.f.$trBbs.clone(), item, idx));

								// Mobile
								$('[data-id=divBbs]').find('.board-list-type').append(createRow(screen.f.$liBbs.clone(), item, idx));
							});
						}
					}
				}

				$cmm.ajax(options);
			},

			/**
			 * 나의 댓글 리스트 조회
			 *
			 * @memberOf screen.c
			 */
			getMyReplyList: function(page) {

				page = !!page ? page : 1;
				const options = {
					url: '/bbs/myReplyList.ax',
					data: {
						page: page,
						searchTxt: $('[data-id=divReply]').find('.form-keyword').val(),
					},
					success: function(res) {

						$('[data-id=divReply]').find('.tbl-board tbody').empty();
						$('[data-id=divReply]').find('.board-list-type').empty();

						if(res.resultData.totalCnt === 0) {

							$('[data-id=divReply]').find('.no-data').removeClass('d-none');
							$('.box-paging02').addClass('d-none');
						} else {

							$('[data-id=divReply]').find('.no-data').addClass('d-none');

							screen.v.totalCnt = res.resultData.totalCnt;
							// 페이징
							$cmm.setPaging($('.box-paging02'), {
								page: page,
								pagingRowCount: screen.v.pagingRowCount,
								totalCnt: res.resultData.totalCnt,
							}, screen.c.getMyReplyList);

							// row 생성 함수
							const createRow = ($elet, item, idx) => {

								// No
								$elet.find('.num').text(screen.f.getBbsNum(idx));
								// 게시판
								$elet.find('.tleft').eq(0).text(item.gnbNm);
								// 댓글
								$elet.find('.tleft').eq(1).text(item.extraReplyContent);
								// 댓글
								$elet.find('.ment').text(item.extraReplyContent);
								// 제목
								$elet.find('a').text(item.extraTitle);
								// 등록일시
								$elet.find('.date').text(item.createDate);

								// 첨부파일
								if(item.isAtchFile > 0) {

									$elet.find('.attach-file').removeClass('d-none');
								}
								// 댓글
								if(item.replyCnt > 0) {

									$elet.find('.comment-num').removeClass('d-none').append($num.comma(item.replyCnt));
								}

								// 관리자 삭제
								if(item.adminDelYn === 'Y') {

									$elet.find('div.tit').removeClass('tit');
								} else {

									$elet.find('.tit').removeClass('hide-notice');
									$elet.find('.tit').find('.hide-txt').remove();
									// 링크
									$elet.find('a').attr('href', `${item.pageUrl}/${item.extraSeq}`);
								}

								// 댓글 관리자 삭제
								if(item.replyAdminDelYn === 'Y') {

									$elet.find('.tleft').eq(1).append('<div class="hide-txt"><span>관리자에 의해 숨김 처리 된 댓글입니다.</span></div>');
									$elet.find('.ment').append('<div class="hide-txt"><span>관리자에 의해 숨김 처리 된 댓글입니다.</span></div>');
									$elet.find('.ment').removeClass('ment');
								} else {

									$elet.find('.tleft').eq(1).removeClass('hide-notice');
								}

								return $elet;
							};

							res.resultData.list.forEach((item, idx) => {

								// PC
								$('[data-id=divReply]').find('.tbl-board tbody').append(createRow(screen.f.$trReply.clone(), item, idx));

								// Mobile
								$('[data-id=divReply]').find('.board-list-type').append(createRow(screen.f.$liReply.clone(), item, idx));
							});
						}
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
			 * 게시판 No
			 *
			 * @memberOf screen.f
			 */
			getBbsNum: idx => {

				return $num.comma(screen.v.totalCnt - (((Number($('.box-paging02').find('a.on').text()) - 1)) * screen.v.pagingRowCount) - idx);
			},
		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// 탭 클릭
			$('.tab-ty').find('a').on('click', function() {

				const $li = $(this).parent();

				if(!$li.hasClass('active')) {

					$('.tab-ty').find('li').removeClass('active');
					$li.addClass('active');

					if($(this).parent().index() === 0) {

						$('[data-id=divBbs]').removeClass('d-none');
						$('[data-id=divReply]').addClass('d-none');
						// 나의 게시판 리스트 조회
						screen.c.getMyBbsList();
					} else {

						$('[data-id=divBbs]').addClass('d-none');
						$('[data-id=divReply]').removeClass('d-none');
						// 나의 댓글 리스트 조회
						screen.c.getMyReplyList();
					}

					$('.form-keyword').val('');
				}
			});

			// 검색
			$('.btn-search').on('click', () => {

				if($('.tab-ty').find('li.active').index() === 0) {

					// 나의 게시판 리스트 조회
					screen.c.getMyBbsList();
				} else {

					// 나의 댓글 리스트 조회
					screen.c.getMyReplyList();
				}
			});
		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			// template
			screen.f.$trBbs = $('[data-template=trBbs]').clone().removeClass('d-none');
			$('[data-template=trBbs]').remove();
			screen.f.$liBbs = $('[data-template=liBbs]').clone().removeClass('d-none');
			$('[data-template=liBbs]').remove();
			screen.f.$trReply = $('[data-template=trReply]').clone().removeClass('d-none');
			$('[data-template=trReply]').remove();
			screen.f.$liReply = $('[data-template=liReply]').clone().removeClass('d-none');
			$('[data-template=liReply]').remove();

			// Event 정의 실행
			screen.event();

			// 나의 게시판 리스트 조회
			screen.c.getMyBbsList();
		}
	};

	screen.init();
	window.mrnScreen = screen;
});