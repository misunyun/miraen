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

			, level1Seq: 3 				// 기본값

			, level2Html: null
			, level4Html: null
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
					url: '/ExtraBlended/getScienceLabDataJson.mrn',
					data: null,
					//data: param,
					success: function(res) {
						if (!!res.resultData) {
							screen.v.item = res.resultData;

							let month = new Date().getMonth()+1;
							term = 0; //Number(window.localStorage.getItem('pageTextbookEbookTerm'));  // 기존에 누른 학기 저장 여부 (AS-IS에서는 미사용으로 주석처리)
							if(term == 0){
								if(month >= 2 && month <= 7){ // 자동 학기 전환
									term = '1';
								} else {
									term = '2';
								}
							}
							$('.aside .dep-menu.block-level3').find('a[data-id='+term+']').trigger('click');
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

			// 학년(level2) 학기(level3) 선택 시
			setGrade: function(e) {
				// 학년/학기 클릭
				$(e.target).parents('.dep-menu').find('li').removeClass('on');
				$(e.target).parents('li').addClass('on');

				// 선택된 학년/학기
				let grade = $('.aside .dep-menu.block-level2 li.on a').data('id');
				let term = $('.aside .dep-menu.block-level3 li.on a').data('id');

				//학년/학기 선택된거 없으면 리턴
				if ($text.isEmpty(grade) || $text.isEmpty(term)) return;

				//getList 중에 선택된 학년/학기 데이터
				let param = $objData.getListFilter(screen.v.item, 'grade', grade);
				param = $objData.getListFilter(param, 'term', term);

				screen.v.level2Html = param;

				screen.f.setLevel4Html();

			},

			//학기 자료 테이블
			setLevel4Html: function() {

				let rows = screen.v.level2Html;

				// 목록 초기화
				$('.tblTopicList tbody .item').remove();

				let unitHighNum = 0;
				let rowCnt = 0;
				let periodNum = unitHighNum + 0;
				let periodName = null;

				// PC 목록 리스트 넣기
				$.each(rows, function(idx, item) {
					let $tr = screen.v.level4Html.clone();

					let gradeTerm = item.grade + "학년 " + item.term + "학기";

					$('.txtTitleLevel3').text(gradeTerm);

					// 단원번호 변경 된지 확인
					if (unitHighNum == 0 || unitHighNum != item.unitHighNum) {
						$tr.find('.txtTitle1').text(item.unitHighName);
						// 2행 이상일때 - 대단원
						if (item.rowSpanCnt > 1) {
							$tr.find('.txtTitle1').attr("rowspan", item.rowSpanCnt);
						}
					} else {
						$tr.find('.txtTitle1').remove();
					}
					// 단원 번호 기존 값 넣기
					unitHighNum = item.unitHighNum;

					// 차시명으로 비교
					if (periodName != item.periodName) {
						$tr.find('.txtTitle2').text(item.periodName);
						// 2행 이상일때 - 차시
						if (item.rowSpanCntSec > 1) {
							$tr.find('.txtTitle2').attr("rowspan", item.rowSpanCntSec);
						}
					} else {
						$tr.find('.txtTitle2').remove();
					}
					//차시 명 기존 값 넣기
					periodName = item.periodName;

					$tr.find('.txtTitle3').text(item.topicName);
					$tr.find('.preview01 a').data('fileid', item.fileId);
					/*$tr.find('.file01 a').data('fileid', item.fileId);*/
					$tr.find('.txtTitleLevel3 a').data('fileid', item.fileId);

					// pc 추가
					$('.tblTopicList tbody').append($tr);

				});
			},

			//  미리보기
			preview: function(e) {

				//선택한 row의 자료 file ID
				let fileId = $(e.target).data('fileid');
				let previewUrl = "/Ebook/preview.mrn?source=EXTRA&file=" + fileId; //수정 대상?

				//미리보기
				if ($(this).hasClass('cmmLoginConfirm')) return;
				else {
					screenUI.f.winOpen(previewUrl);
				}

			},

			//다운로드
			download: function(e) {

				if ($(this).hasClass('cmmLoginConfirm')) return;
				else {

					let fileId = $(e.target).data('fileid');

					//다운로드
					let downloadUrl = "https://ele.m-teacher.co.kr/cms/files/download/" + fileId;

					// 다운로드 내역 저장
					page_play("EXTRA", "E_SCIENCE_MAP", screen.v.level2Html.slSeq, $('body').data('useridx'), "DOWNLOAD");//로그


					screenUI.f.download(downloadUrl);
				}

			},

			// 학기 자료 전체 다운로드
			downloadAll: function() {
				// 다운로드
				downloadMessage();

				let grade = $objData.getListFilter(screen.v.item, 'grade', $('.aside .dep-menu.block-level2 li.on a').data('id'))
				let term = $objData.getListFilter(grade, 'term', $('.aside .dep-menu.block-level3 li.on a').data('id'))
				let paramBuf = "";

				$.each(term, function(i, item) {
					paramBuf += "<input type='hidden' name='fileId' value='" + item.fileId + "' >";
					// 다운로드 내역 저장
					page_play("EXTRA", "E_SCIENCE_MAP", screen.v.level2Html.slSeq, $('body').data('useridx'), "DOWNLOAD");//로그
				});

				let title = $('.aside .dep-menu.block-level2 li.on a').data('id') + '-' + $('.aside .dep-menu.block-level3 li.on a').data('id') + ' 다른탐구 활동지 전체';

				if ($(this).hasClass('cmmLoginConfirm')) return;

				else {
					$("#idDownload").html(paramBuf);
					$("#filename").val(title);// 파일명

					document.downloadForm.action = "https://ele.m-teacher.co.kr/File/FileDownMulti.mrn";
					document.downloadForm.submit();
				}
			},

			// size 변경시
			resize: function() {

				let w = $(window).width();
				// PC
				if (w > 750 && screen.v.beforeWidth <= 750) {
					// __w('모바일에서 PC로 변경');
					$('.tabs .ele').trigger('click');
				}
				// Mobile
				if (screen.v.beforeWidth > 750 && w <= 750) {
					// __w('PC에서 모바일로 변경');
					$('.tabs .ele').trigger('click');
				}

				screen.v.beforeWidth = w;
			},

		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// 학년/학기 클릭시
			$(document).on('click', '.aside .dep-menu li a', function(e) {
				screen.f.setGrade(e);
			});

			// 미리보기
			$(document).on('click', '.preview01 .btnPreview', function(e) {
				screen.f.preview(e);
			});

			/*// 다운로드
			$(document).on('click', '.btnDownload',  function(e) {
				screen.f.download(e);
			});*/


			// 학기 자료 전체 다운로드
			$('#btnDownloadAll').on('click', function() {
				screen.f.downloadAll();
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

			//학년 선택
			$('.aside .initDataSet').find('li:first').addClass('on');

			// html level4 복제(학년/학기 선택 이후)
			screen.v.level4Html = $('.tblTopicList tbody tr.item').clone();
			$('.tblTopicList tbody tr.item').remove();

			// 목록 가져오기
			screen.c.getList();

			screen.v.beforeWidth = $(window).width();
		}
	};

	screen.init();
	window.screen = screen;
});