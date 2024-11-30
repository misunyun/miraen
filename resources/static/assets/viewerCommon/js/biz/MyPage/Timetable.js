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
			timetable: null,
			level1Seq: 2, // 초등
			level2Seq: null,
			level2Nm: null,
			level3Seq: null,
			level3Nm: null,
			level4Seq: null,
			level4Nm: null,
			tableTh: null,
			tableTd: null,
			tableTdDel: null,
			tableTdAdd: null,
			level2Html: null,
			level3Html: null,
			level4Html: null,
			changed: false,
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 목록 가져오기
			getList: function() {

				const options = {
					url: '/timetableList.mrn',
					data: null,
					success: function(res) {
						if (!!res.resultData) {
                            screen.v.timetable = res.resultData;

                            screen.f.setTimetable();
						}
					}
				};

				$cmm.ajax(options);
			},

			// 코드 목록 가져오기
			getCodeList: function() {

				const options = {
					url: '/timetableCodeList.mrn',
					data: null,
					success: function(res) {
						if (!!res.resultData) {
							screen.v.item = res.resultData;

							screen.f.setLevel2();
						}
					}
				};

				$cmm.ajax(options);
			},

			// 저장
			save: function() {

				$msg.confirm('저장하시겠습니까?', function() {

					let data = '';
					$('.timetable-setting .btn-subject').each(function(i) {

						data += $(this).closest('td').data('period');
						data += '_' + $(this).closest('td').data('dayOfWeek');
						data += '_' + $(this).closest('td').data('ttcSeq');
						data += ',';
					}, null, '', '', '', '취소');

					const options = {
						url: '/saveTimetableList.mrn',
						data: { param: data },
						success: function(res) {
							if (!!res.resultData) {

								$('.timetable-setting').fadeOut();
								$('.timetable-dim').fadeOut();

								// 목록 가져오기
								screen.c.getList();
							}
						}
					};

					$cmm.ajax(options);

				}, null, '', '', '', '취소');

			},

		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {

            // 시간표 세팅
            setTimetable: function(){

                // 시간표 조회
                $('.timetable-block .tbl-timetable tbody tr').remove();
                // 시간표 설정
                $('.timetable-setting .tbl-timetable tbody tr').remove();

                // 교시
                for(let p = 1; p <= 6 ; p++) {
                    // 시간표 조회
                    $('.timetable-block .tbl-timetable tbody').append('<tr></tr>');
                    // 시간표 설정
                    $('.timetable-setting .tbl-timetable tbody').append('<tr></tr>');

                    // 요일
                    for(let d = 0; d <= 5 ; d++) {
                        if(d==0){

                             // 시간표 조회
                            let $th = screen.v.tableTh.clone();
                            $th.text(p+'교시');
                            $('.timetable-block .tbl-timetable tbody tr:eq('+(p-1)+')').append($th);

                             // 시간표 설정
                            let $th2 = screen.v.tableTh.clone();
                            $th2.text(p+'교시');
                             $('.timetable-setting .tbl-timetable tbody tr:eq('+(p-1)+')').append($th2);

                        } else {
                            // 시간표 조회
                            let $td = screen.v.tableTd.clone();
                            $td.html('');
                            $('.timetable-block .tbl-timetable tbody tr:eq('+(p-1)+')').append($td);

                            // 시간표 설정
                            let $tdAdd = screen.v.tableTdAdd.clone();
                            $tdAdd.data('period',p);
                            $tdAdd.data('dayOfWeek',d);
                             $('.timetable-setting .tbl-timetable tbody tr:eq('+(p-1)+')').append($tdAdd);
                        }
                    }
                }

                if(screen.v.timetable.length == 0) {
                    $('.timetable-nodata').removeClass('d-none');
                    $('.timetable-header .btn-setting').addClass('d-none');
                    return false;
                } else {
                    $('.timetable-nodata').addClass('d-none');
                    $('.timetable-header .btn-setting').removeClass('d-none');
                }

                $.each(screen.v.timetable, function(idx, item) {
                    // 시간표 조회
                    let $target = $('.timetable-block .tbl-timetable tbody tr').eq(Number(item.period)-1).find('td').eq(Number(item.dayOfWeek)-1);
                    let $td = screen.v.tableTd.clone();
                    $target.html($td.html());
                    $target.data('url1', item.url1);
                    $target.find('span').text(item.path.split('-')[2]);
                    if ( $text.isEmpty(item.txt1)) {
                        $target.find('.btn-subject').addClass('bg-orange');
                    } else {
                        $target.find('.btn-subject').addClass('bg-blue');
                        $target.find('em').text(item.txt1);
                    }

                    // 시간표 설정
                    let $target2 = $('.timetable-setting .tbl-timetable tbody tr').eq(Number(item.period)-1).find('td').eq(Number(item.dayOfWeek)-1);
                    let $tdDel = screen.v.tableTdDel.clone();
                    $target2.html($tdDel.html());
                    $target2.find('span').text(item.path.split('-')[2]);
                    if ( $text.isEmpty(item.txt1)) {
                        $target2.find('.btn-subject').addClass('bg-orange');
                    } else {
                        $target2.find('.btn-subject').addClass('bg-blue');
                        $target2.find('em').text(item.txt1);
                    }
                    $target2.closest('td').data('ttcSeq',item.ttcSeq);

                });

            },

			// 학년(level2) 변경
			setLevel2: function() {

				// 학년 초기화
				$('.timetable-setting .block-level2 .item').remove();

				let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level1Seq);

				// 학년 리스트 넣기
				$.each(rows, function(idx, item) {

					let $li = screen.v.level2Html.clone();
					$li.data('ttcSeq', item.ttcSeq);
					$li.attr('data-nm', item.nm);
					$li.text(item.nm+'학년');

					$('.timetable-setting .block-level2').append($li);

				});

				// 첫번째 클릭
				if(localStorage.getItem('grade') != null ){
				    $('.timetable-setting .block-level2 button[data-nm='+ localStorage.getItem('grade') +']').trigger('click');
				} else {
				    $('.timetable-setting .block-level2 button:first').trigger('click');
				}

			},

			// 과목(level3) 변경
            setLevel3: function() {

                // 과목 초기화
                $('.timetable-setting .block-level3 .item').remove();
                let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level2Seq);

                // 과목 리스트 넣기
                $.each(rows, function(idx, item) {
                    let $li = screen.v.level3Html.clone();
                    $li.data('ttcSeq', item.ttcSeq);
                    $li.data('nm', item.path.split('-')[2]);
                    $li.text(item.nm);					// name
                    $('.timetable-setting .block-level3').append($li);
                });

                // 첫번째 클릭
                $('.timetable-setting .block-level3 button:first').trigger('click');

            },

			// 교과서(level4) 변경
            setLevel4: function() {

                // 교과서 초기화
                $('.timetable-setting .block-level4 .item').remove();
                let rows = $objData.getListFilter(screen.v.item, 'parentSeq', screen.v.level3Seq);

				// 콤보 셋팅
				$combo.bind(rows, '#selLevel3', '', '', 'nm', 'ttcSeq');

                // 콤보 data  추가
                $.each(rows, function(i, item){
                    let nm =  item.nm;
                    if(!!item.txt1){
                        nm = item.txt1;
                    }
                    $( 'select[id="selLevel3"] option[value="'+item.ttcSeq+'"]').data('nm', nm);
                });

				 // 첫번째 클릭
                 $('.timetable-setting .block-level4').trigger('change');

            },

            // 시간표 클릭
            clickBtn: function(e) {
                window.open($(e.target).closest('td').data('url1'));
            },

            // 학년 클릭
            clickLevel2: function() {

                // level2 선택값 넣기
                screen.v.level2Seq = $(this).data('ttcSeq');
                screen.v.level2Nm = $(this).data('nm');

                localStorage.setItem('grade', $(this).data('nm'));

                $(this).parents('.block-level2').find('.item').removeClass('on');
                $(this).addClass('on');

                // 과목 세팅
                screen.f.setLevel3();
            },

            // 과목 클릭
            clickLevel3: function() {

                // level3 선택값 넣기
                screen.v.level3Seq = $(this).data('ttcSeq');
                screen.v.level3Nm = $(this).data('nm');

                $(this).parents('.block-level3').find('.item').removeClass('on');
                $(this).addClass('on');

                // 교과서 세팅
                screen.f.setLevel4();
            },

            // 교과서 선택
            clickLevel4: function() {

                // level4 선택값 넣기
                screen.v.level4Seq = $(this).val();
                screen.v.level4Nm = $(this).find('option:selected').data('nm');

            },

            // 과목 추가 버튼 클릭
            addBtn: function(e){

                if(screen.v.level2Nm != null && screen.v.level3Nm != null && screen.v.level4Nm != null){
                    screen.v.changed = true;
                    $(this).closest('td').data('ttcSeq',screen.v.level4Seq);
                    let $tdDel = screen.v.tableTdDel.clone();
                    $tdDel.find('span').text(screen.v.level3Nm);

                    if(screen.v.level4Nm==='선택 없음'){
                        $tdDel.find('.btn-subject').addClass('bg-orange');
                    } else {
                        $tdDel.find('.btn-subject').addClass('bg-blue');
                        $tdDel.find('em').text(screen.v.level4Nm);
                    }
                    $(this).parent().html($tdDel.html());

                }
            },

            // 과목 삭제 버튼 클릭
            delBtn: function(){

                     screen.v.changed = true;
                    let $tdAdd = screen.v.tableTdAdd.clone();
                    $(this).parent().html($tdAdd.html());

            },

            // 모두 삭제
            delAll: function(){

               	$msg.confirm('설정한 내역을 모두 삭제하시겠습니까?<br>삭제 후에는 되돌릴 수 없습니다.', function() {
                   screen.v.changed = true;
                    let $tdAdd = screen.v.tableTdAdd.clone();
                    $('.timetable-setting .btn-subject').each(function(i) {
                        $(this).closest('td').html($tdAdd.html());
                    });
				}, null, '', '', '', '취소');
            },
		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {
		    // 시간표 클릭
            $(document).on('click', '.timetable-block .tbl-timetable tbody tr button', screen.f.clickBtn);

			// 학년 클릭
			$(document).on('click', '.timetable-setting .block-level2 .item', screen.f.clickLevel2);

			// 과목 클릭
			$(document).on('click', '.timetable-setting .block-level3 .item', screen.f.clickLevel3);

			// 교과서 선택
			$(document).on('change', '.timetable-setting .block-level4', screen.f.clickLevel4);

			// 과목 추가
            $(document).on('click', '.timetable-setting .btns .add-subject', screen.f.addBtn);

            // 과목 삭제
            $(document).on('click', '.timetable-setting .btns .btn-del', screen.f.delBtn);

            // 저장
            $(document).on('click', '.btn-save', screen.c.save);

            // 삭제
            $(document).on('click', '.btn-delete', screen.f.delAll);

			$('.btn-setting').on('click', function(){
			    screen.v.changed = false;
			    screen.c.getList();

		        $('.timetable-setting').fadeIn();
		        $('.timetable-dim').fadeIn();
		    });
		    $('.timetable-close').on('click', function(){
		        let close = false;
		        if(screen.v.changed){
					$msg.confirm('변경된 내용이 있습니다.<br>저장하지 않고 창을 닫으시겠습니까?', function() {
						$('.timetable-setting').fadeOut();
						$('.timetable-dim').fadeOut();
					}, null, '', '', '', '취소');
		        } else {
		            $('.timetable-setting').fadeOut();
		            $('.timetable-dim').fadeOut();
		        }

		    });


		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

            // html th 복제
            screen.v.tableTh = $('.timetable-block .tbl-timetable tbody tr th').clone();

            // html td 복제
            screen.v.tableTd = $('.timetable-block .tbl-timetable tbody tr td').clone();

            // html td del 복제
            screen.v.tableTdDel = $('.timetable-setting .tbl-timetable tbody tr td:eq(0)').clone();

            // html td add 복제
            screen.v.tableTdAdd = $('.timetable-setting .tbl-timetable tbody tr td:eq(1)').clone();

			// html level2 복제
			screen.v.level2Html = $('.timetable-setting .block-level2 .item').clone();
			$('.timetable-setting .block-level2 .item').remove();

            // html level3 복제
            screen.v.level3Html = $('.timetable-setting .block-level3 .item').clone();
            $('.timetable-setting .block-level3 .item').remove();

            // html level4 복제
            screen.v.level4Html = $('.timetable-setting .block-level4 .item').clone();
            $('.timetable-setting .block-level4 .item').remove();

			// Event 정의 실행
			screen.event();

			// 목록 가져오기
			screen.c.getList();

            // 코드 목록 가져오기
            screen.c.getCodeList();

		}
	};

	screen.init();
	window.screen = screen;
});