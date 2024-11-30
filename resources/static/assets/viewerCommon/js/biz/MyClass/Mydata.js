let pg;

$(function() {

	pg = {

		/**
		 * 내부  전역변수
		 *
		 * @memberOf screen
		 */
		v: {
            pagingRowCount: 15,
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf pg
		 */
		c: {

			/**
			 * 내자료 리스트
			 *
			 * @memberOf pg.c
			 */
			getMyDataList: function(page){
			    page = !!page ? page : 1;
			    let dataType = $('.tab-data a.active').data('tab');
				const options = {
					url: '/MyData/getMyDataList.ax',
					data: {
					    page : page,
					    dataType : dataType,
					    myDataShareYn: $('#myDataShareYn').val(),
					    myDataType: $('#myDataType').val(),
					    grade: $('#grade').val(),
					    term: $('#term').val(),
					    course: $('#course').val(),
					    myDataTitle : $('#srchMydata').val()
					},
					success: function(res) {

                        if(!!res.rows) {

                            $('.table-ty02 tbody').empty();
                            if(res.rows.length==0){
                                $('.empty-result03').removeClass('d-none');
                            }else {
                                $('.empty-result03').addClass('d-none');
                            }


							// 페이징
							$cmm.setPaging($('.box-paging02'), {
								page: page,
								pagingRowCount: pg.v.pagingRowCount,
								totalCnt: res.totalCnt
							}, pg.c.getMyDataList);

                            $.each(res.rows, function(idx, item) {

                                let $tr = pg.v.$trMyData.clone();
                                $tr.data('item',item);
                                $tr.find('input[name=fnIdArr]').val(item.myDataSeq);
                                $tr.find('input[name=fnIdArr]').attr("id","showRatings_"+item.myDataSeq);
                                $tr.find('td:eq(0) label').attr("for","showRatings_"+item.myDataSeq);
                                $tr.find('td:eq(1)').text(item.rn);
                                $tr.find('td:eq(2)').html(item.myDataShareTxt);
                                $tr.find('td:eq(3)').text(item.myDataTypeTxt);
                                $tr.find('td:eq(4)').text(item.grade);
                                $tr.find('td:eq(5)').text(item.term);
                                $tr.find('td:eq(6)').text(item.courseNm);
                                $tr.find('td:eq(7)').text(item.unitHighNum);
                                $tr.find('td:eq(8)').text(item.unitMidNum);
                                $tr.find('td:eq(9)').text(item.periodNum);
                                $tr.find('td:eq(13)').html(item.createDate);

                                if(item.myDataType == 'FILE'){
                                    // 자료명
                                    $tr.find('td:eq(10) .tit').text(item.myDataTitle);

                                    // 다운로드
                                    $tr.find('.ico-down2').removeClass('off');
                                    $tr.find('.ico-down2').data('file-id',item.fileId);
                                    $tr.find('.ico-down2').addClass('cmmFiledownloadId');  // 파일 다운로드
                                } else{
                                    // 자료명
                                    $tr.find('td:eq(10) .tit').html('<a>'+item.myDataTitle+'</a>');

                                }


                                // 미리보기
                                if(item.myDataType == 'FILE' && item.extension != 'ZIP'){
                                    $tr.find('.ico-search2').removeClass('off');
                                }


                                $('.table-ty02 tbody').append($tr);
                            });

                            if(dataType=='TEXTBOOK'){
                                $('[data-type="TEXTBOOK"]').removeClass('d-none');
                                $('[data-type="NORMAL"]').addClass('d-none');
                                $('.bd-util').addClass('pd10_30');
                            } else{
                                $('[data-type="TEXTBOOK"]').addClass('d-none');
                                $('[data-type="NORMAL"]').removeClass('d-none');
                                $('.bd-util').removeClass('pd10_30');
                            }

                        }

					}
				};

				$cmm.ajax(options);
            },

			/**
			 * 내자료 삭제
			 *
			 * @memberOf pg.c
			 */
            delMyData: function(){
                if ($('input[name=fnIdArr]:checked').length <= 0) {
                    $msg.alert('삭제할 항목을 먼저 체크해 주세요.');
                    return;
                }

                if (confirm('정말로 삭제하겠습니까?')) {
                    $.ajax({
                        url : "/MyClass/deleteMyDataJson.mrn",
                        type : "post",
                        cache : false,
                        data : $("#scrapFrm").serialize(),
                        dataType : "json",
                        async : false,
                        success : function(jsonObj) {
                            if (jsonObj.dispMessage) {
                                $msg.alert(jsonObj.dispMessage);
                                return;
                            }
                            if (jsonObj.result == 'OK') {
                                pg.c.getMyDataList();
                            }
                        },
                        error : function(json) {
                            alert("실패하였습니다.");
                        }
                    });
                }
            },
		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {



		},

		/*
		 * Event 정의 객체.
		 *
		 * @memberOf pg
		 */
		event: function() {

            /*
             * 내 자료 타입 클릭
             *
             * @memberOf pg.event
             */
			$('.tab-data a').click(function(e){
                $('.tab-data a').removeClass('active');
                $(this).addClass('active');

                // 필터 초기화
                $('#myDataShareYn').val('');
                $('#myDataType').val('');
                $('#grade').val('');
                $('#term').val('');
                $('#course').val('');
                $('#srchMydata').val('');

                pg.c.getMyDataList();
			});

            /*
             * 미리보기 클릭
             *
             * @memberOf pg.event
             */
            $(document).on('click', 'a.ico-search2:not(.off)', function (e) {
                const item = $(this).parents('tr').data('item');

				// 신규
				let previewUrl = '/Ebook/preview.mrn';
				let previewMediaLink = '/cms/smartppt/mpreview/mpreview.html';

				let w = 800;
				let h = 1000;

                previewUrl = previewUrl + '?source=MY&file=' + item.fileId + '&indexclose=N' + '&user='+$('body').data('userIdx');
                screenUI.f.winOpen(previewUrl, w, h, null, 'popPreviewPage');

            });

            /*
             * 자료명 클릭
             *
             * @memberOf pg.event
             */
             $(document).on('click', 'td.title .tit a', function (e) {
                const item = $(this).parents('tr').data('item');

                window.open(item.myDataUrl)
             });

            /*
             * 삭제 클릭
             *
             * @memberOf pg.event
             */
             $(document).on('click', '#btnDelMyData', function (e) {
                pg.c.delMyData();
             });

             /*
              * 필터 변경
              *
              * @memberOf pg.event
              */
             $(document).on('change', "select[name='myDataShareYn'],select[name='myDataType'],select[name='grade'],select[name='term'],select[name='course']",function(e) {
                pg.c.getMyDataList();
             });

             /*
              * 검색하기
              *
              * @memberOf pg.event
              */
             $(document).on('click', "#btnSearchMydata",function(e) {
                pg.c.getMyDataList();
             });
		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

            // Event 정의 실행
            pg.event();

            // template
            pg.v.$trMyData = $('.table-ty02 tbody tr').clone().removeClass('d-none');
            $('.table-ty02 tbody tr').remove();

            pg.c.getMyDataList();
        }
	};

    pg.init();
	window.screen = screen;
});
