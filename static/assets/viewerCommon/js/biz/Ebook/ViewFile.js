let screen;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			parentFileId: $('body').data('fileid')
			, viewerHost: $('body').data('viewerhost') + '/cms/files/view/'
			, downloadHost: $('body').data('viewerhost') + '/cms/files/download/'
			, page: $text.isEmpty($('body').data('page')) ? 1 : $('body').data('page')
			, maxPage: null
			, fileList: null
			, imgCnt: null
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 파일 정보 조회
			getFileInfo: function() {

				const options = {
					url: '/Ebook/GetEbookViewFileInfoJson.mrn',
					data: {
							parentFileId: screen.v.parentFileId
					},
					success: function(res) {
						screen.v.imgCnt = res.fileCnt.imgCnt;
						screen.v.fileList = res.resultData;
						screen.f.dataSet();
						screen.f.imgSet();
					}
				};
				$cmm.ajax(options);
			}
		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {

			// 데이터 정보 세팅
			dataSet: function() {

				let oriFile = $objData.getRowFilter(screen.v.fileList, 'sortNo', 0);
				screen.v.maxPage = screen.v.imgCnt;

				// 제목
				$('.txtTitle').text(oriFile.originFileName);

				// 다운로드 hidden
				if(oriFile.downloadYn == 'Y') $('#download').removeClass('d-none');

			},

			// 이미지 set
			imgSet: function() {

				let page = $text.isEmpty(screen.v.page)? 1 : screen.v.page;
				let row = $objData.getRowFilter(screen.v.fileList, 'sortNo', page);

				// 로컬 테스트의 경우 ele로 연결
				if($('body').data('viewerhost').indexOf('local') > 0) screen.v.viewerHost = 'https://ele.m-teacher.co.kr/cms/files/view/'

				if(screen.v.imgCnt == 0) {
					$('#imgViewer').attr('src', screen.v.viewerHost + screen.v.parentFileId);
					$('#pageText').text(`1 / 1`);
				} else {
					$('#imgViewer').attr('src', screen.v.viewerHost + row.fileId);
					$('#pageText').text(`${row.sortNo} / ${screen.v.maxPage}`);
				}

				let txt = '';
				txt += 'fileId='+screen.v.parentFileId;
				txt += '&page='+page;

				$cmm.changeBrowserAddressBarUrl('/Ebook/ViewFile.mrn?'+txt);

			},

			// 이전 이미지
			prev: function() {
				if(screen.v.page <= 1) return;
				screen.v.page --;
				screen.f.imgSet();
			},

			// 다음 이미지
			next: function() {

				if(screen.v.page >= screen.v.maxPage) return;
				screen.v.page ++;
				screen.f.imgSet();
			},

			// 파일 다운로드
			download: function() {
				let oriFile = $objData.getRowFilter(screen.v.fileList, 'sortNo', 0); // page = 0 : originalFile

				// 로컬 테스트의 경우 ele로 연결
				if($('body').data('viewerhost').indexOf('local') > 0) screen.v.downloadHost = 'https://ele.m-teacher.co.kr/cms/files/download/'

                $.fileDownload(screen.v.downloadHost + oriFile.fileId);
			},
		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// 다운로드 버튼
			$('#download').click(screen.f.download);

			// 좌 우 버튼
			$('.control-prev').click(screen.f.prev);
			$('.control-next').click(screen.f.next);

			// 좌우 화살표 키 누를때
			$(document).on('keyup', function(e) {
				if (e.keyCode == 37) { 			// 왼쪽 화살표
					screen.f.prev();
				} else if (e.keyCode == 39) {	// 오른쪽 화살표
					screen.f.next();
				} else return;
			});

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			screen.event();

			screen.c.getFileInfo();

			// 로그인 체크
			if ($text.isEmpty($('body').data('userid'))) {
				screenUI.f.loginConfirm();
				return;
			}
		}
	};

	screen.init();
});
