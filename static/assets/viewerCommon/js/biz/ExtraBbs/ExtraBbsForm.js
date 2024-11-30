$(function() {

	const screen = {
		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			isBbsThumnailType: false,
			pagingRowCount: 16,
			totalCnt: 0,
			tagNmList: ['extraGradeNm', 'extraTermNm', 'extraCourseNm', 'typeCSeq1Nm', 'typeCSeq2Nm', 'typeCSeq3Nm', 'typeCSeq4Nm'],
			delContentsExtraSeq: [],
			ckEditor: null,
			// valid1: $form.check('#bbsForm', {}),
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
						extraSeq: $('#extraSeq').val(),
						isOnlyBbs: 'Y',
						kk: '한글',
						isMyPost: 1
					},
					success: function(res) {

						if(!!res.resultData && !!res.resultData.bbsCmmDtpt) {

							for(let key in res.resultData.bbsCmmDtpt) {

								$(`[name=${key}]`).val(res.resultData.bbsCmmDtpt[key]);
							}

							screen.v.ckEditor.setData(res.resultData.bbsCmmDtpt.extraContent);
						} else {

							$msg.alert('삭제 되었거든 잘못된 주소 입니다.', () => {

								location.href = location.pathname.substring(0, location.pathname.indexOf('.mrn') + 4) + location.search;
							});
						}

						if(!!res.resultData && !!res.resultData.contentList) {

							res.resultData.contentList.forEach(item => {

								if(item.contentsExtraType === 'SUB') {

									const $li = $(document.createElement('li'));

									$li.data('contentsExtraSeq', item.contentsExtraSeq);
									$li.append(`<a href="javascript:;" class="cmmFiledownloadId" data-file-id="${item.fileId}">${item.contentsExtraShowFileName}</a><span>(${$file.getFileSize(item.fileSize)})</span><button type="button" class="del"></button>`);

									$('.file-list').append($li);
								}
							});
						}
					}
				}

				$cmm.ajax(options);
			},

			/**
			 * 게시판 공통 저장
			 *
			 * @memberOf screen.c
			 */
			saveCmmBbs: function() {

				const formData = new FormData($('#bbsForm')[0]);

				if(screen.v.delContentsExtraSeq.length > 0) {

					formData.append('delContentsExtraSeq', screen.v.delContentsExtraSeq.join(','));
				}
				// 내용
				formData.append('extraContent', screen.v.ckEditor.getData().replace(/&nbsp;/g, '†'));

				if(!!$cmm.getUrlParams('ecmTabCSeq')) {

					formData.append('ecmTabCSeq', $cmm.getUrlParams('ecmTabCSeq'));
				}

				const options = {
					url: '/bbs/saveCmmBbs.ax',
					contentType : false,
					processData : false,
					data: formData,
					success: function(res) {

						location.href = location.pathname.substring(0, location.pathname.indexOf('.mrn') + 4) + location.search;
					}
				}

				$cmm.ajax(options);
			},

			/**
			 * 게시판 공통 삭제
			 *
			 * @memberOf screen.c
			 */
			delCmmBbs: function() {

				const options = {
					url: '/bbs/delCmmBbs.ax',
					data: {
						extraSeq: $('#extraSeq').val(),
					},
					success: function(res) {

						$msg.alert('게시물이 삭제되었습니다.', () => {

							location.href = location.pathname.substring(0, location.pathname.indexOf('.mrn') + 4) + location.search;
						});
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


		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// 파일 선택
			$('#inpFile').on('change', function() {

				if(this.files.length > 0) {

					$.each(this.files, (idx, file) => {

						if(file.size > 1000 * 1000 * 50) {

							$msg.alert('50MB까지만 업로드 가능합니다.');

							return false;
						} else if($('.file-list').find('li').length > 9) {

							$msg.alert('최대 10개까지 등록 가능합니다.');

							return false;
						} else {
							const $li = $(document.createElement('li'));
							$li.attr('data-value', 'ins');
							$li.append($(this).clone().removeAttr('id').attr('name', 'inpFile'));
							$li.append(`${file.name}<button type="button" class="del"></button>`);
							$('.file-list').append($li);

							$(this).val('');
						}
					});
				}
			});

			// 파일 삭제
			$('.file-list').on('click', 'button', function() {

				const $li = $(this).closest('li');
				if(!!$li.data('contentsExtraSeq')) {

					screen.v.delContentsExtraSeq.push($li.data('contentsExtraSeq'));
				}

				$li.remove();
			});

			// 취소
			$('#btnCancel').on('click', () => {

				$msg.confirm('입력한 내용이 모두 삭제됩니다.<br>취소 하시겠습니까?', () => {

					history.back();
				});

			});

			// 저장
			$('#btnSave').on('click', () => {

				// select validation 처리
				let tf = false;

				const formCheck  = $form.check('#bbsForm', {});
				if (!formCheck.form()) {
					$msg.alert('필수 항목을 체크해 주세요.', null);

					$.each($('#bbsForm select'), function(idx, val)  {

						if ($($(val)).val()=='선택') {
							tf = true;
							$($(val)).addClass('error');

						}
					});

					return;
				} else {
					$.each($('#bbsForm select'), function(idx, val)  {

						if ($($(val)).val()=='선택') {
							tf = true;
							$($(val)).addClass('error');

						}
					});
				}

				if(tf) {
					$msg.alert('필수 항목을 체크해 주세요.', null);
					return;
				}

				if(!$('#chkAuth').is(':checked')) {

					$msg.alert('저작권 및 자료 공유 동의를 선택해 주세요.');
				} else if(!screen.v.ckEditor.getData()) {

					$msg.alert('내용을 입력해 주세요.');
				} else {

					$msg.confirm('저장 하시겠습니까?', () => {

						screen.c.saveCmmBbs();
					});
				}
			});

			// 삭제
			$('#btnDel').on('click', () => {

				$msg.confirm('삭제 하시겠습니까?', () => {

					screen.c.delCmmBbs();
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

			/*ClassicEditor.create( document.querySelector( '#extraContent' ), {
				simpleUpload: {
					uploadUrl: '/ckEditUpload.ax',
				},
				fontSize: {
					options: [10, 12, 15, 18, 20, 30, 40, 50]
				},
				toolbar: [
					"heading",
					"|",
					"fontSize",
					"bold",
					"italic",
					"link",
					"bulletedList",
					"numberedList",
					"|",
					"outdent",
					"indent",
					"|",
					"uploadImage",
					"blockQuote",
					"insertTable",
					"mediaEmbed",
					"undo",
					"redo"
				]
			}).then( editor => {
				screen.v.ckEditor = editor;
			}).catch( error => {
			});*/

			ClassicEditor
				.create(document.querySelector('#extraContent'), {
					simpleUpload: {
						uploadUrl: '/ckEditUpload.ax',
					},
					licenseKey: '',
					toolbar: {
						viewportTopOffset : 80,    // height of fixed header
					},
				})
				.then(editor => {
					window.editor = editor;
					screen.v.ckEditor = editor;
				})
				.catch(error => {
					console.error( 'Oops, something went wrong!' );
					console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
					console.warn( 'Build id: z4zjgjr2ic2x-ray9wy5v60lh' );
					console.error( error );
				});

			// 회원 아닐시
			if (!$('body').data('scGrade')) {

				screenUI.f.loginConfirm(() => {

					history.back();
				});
			// 정회원 아닐시
			} else if($('body').data('scGrade') != '002') {

				screenUI.f.loginTeacherOnlyAlert(() => {

					history.back();
				});
			}

			// 수정
			if(!!$('#extraSeq').val()) {

				$('#btnDel').removeClass('d-none');

				// 게시판 공통 상세 조회
				screen.c.getBbsCmmDtpt();
			}
		}
	};

	screen.init();
	window.mrnScreen = screen;
});