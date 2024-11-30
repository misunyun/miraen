let screen;
let player1;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			itemList: null
			, data: null
		},

		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			getList: function() {

				$.getJSON('/assets/js/biz/References/ScienceLabImageMap.json?d=2', function(data) {
					screen.v.data = data;
				});
			},


		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {

			// 모달 업
			modalUp: function(e) {

				let text = e.target.title;
				$('#modal_media .modal-head h2').text(text);

				let url = $(e.target).data('media_url');
				player1.src(url);

				let image = $(e.target).data('image');
				player1.poster(image);


				// 팝업 열기
				$('#modal_media').bPopup({
					modalClose: true,
					opacity: 0.5,
					speed: 450,
					transition: 'slideDown',
					onOpen: function() {
					},
					onClose: function() {
						// 닫히면 멈춤
						player1.pause();
					}
				});


			},


		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// 제목 클릭
			$(".item-group .item-tit").hover(function () {

				// 선택 상태
		        if ($(this).hasClass('on')) {
					//$(this).removeClass('on');
				} else {

					// 선택 된 상태 초기화
					$('.science-imagemap .category-wrap .category .item-tit').removeClass('on');

					// html list 복제
					let itemList = screen.v.itemList.clone();


					let isNotLoginTf = itemList.hasClass('isNotLogin');
					let isNotTeacher = itemList.hasClass('isNotTeacher');

					// li 목록 삭제(초기화)
					itemList.find('li').remove();

					// 가져올 seq
					let code = $(this).data('code');

					// json 가져온 값을 해당 부분에 바인드하기
					let rows = $objData.getListFilter(screen.v.data.data, 'code', code);

					$.each(rows, function(idx, val) {  //hover

						// 로그인 안되었으면
						if (isNotLoginTf) {

							itemList.find('ul').append('<li><a href="javascript:;" title="['+ val.lesson_no + '] '+val.title+'" class="cmmLoginConfirm">' +'[' + val.lesson_no + '] ' + val.title +'</a></li>');
						}
						// 선생님이 아니면
						else if (isNotTeacher) {

							itemList.find('ul').append('<li><a href="javascript:;" title="['+ val.lesson_no + '] ' + val.title+'" class="cmmTeacherConfirm">' +'[' + val.lesson_no + '] ' + val.title +'</a></li>');
						}
						// 선생님 회원이면
						else {

							itemList.find('ul').append('<li><a href="javascript:;" title="['+ val.lesson_no + '] '+val.title+'" class="aLiClick" data-image="' + val.image + '" data-media_url="'+val.media_720p + '">' +'[' + val.lesson_no + '] ' + val.title +'</a></li>');
						}

					});

					// 선택 상태
			        $(this).addClass('on');

			        // link 목록 바인드
			        $(this).after(itemList);

				}
		    });

			// 리스트 클릭
			$(document).on('click', '.aLiClick', function (e) {	screen.f.modalUp(e)});
			//모달 닫기
			//$('#modal_media .btn-block .b-close').trigger('click');

		    $(window).scroll(function(){
			    if ($(window).scrollTop() >= 525) {
			        $('.science-imagemap .grade').addClass('menu-fixed');
			    }
			    else {
			        $('.science-imagemap .grade').removeClass('menu-fixed');
			    }
			});

			$(".item-group").bind("mouseleave", function(){
				$(".item-group .item-tit").removeClass("on");
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

			// 첨부 리스트 복사
			screen.v.itemList = $('.page-sciencemap .item-list.temp').clone();
			$('.page-sciencemap .item-list.temp').remove();

			// json 데이타 호출
			screen.c.getList();

			// 비디오 초기화
            if($('#mvideo01').length){
                player1 = videojs('mvideo01', {});
            }

		}
	};

	screen.init();
	window.screen = screen;
});