let screen;

$(function() {

  screen = {

    /**
     * 내부  전역변수
     *
     * @memberOf screen
     */
    v: {
      item : null
      , rows : null
      , htmlItemHeader: null	// html 년도 해드
      , htmlItemBlock: null		// html 년도 해드
      , htmlItem: null			// html 년도 해드
      , linkEbook: null			// 이북 링크
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
          url: '/ExtraLab/GetWebZineJson.mrn',
          data: null,
          success: function(res) {

            screen.v.rows = res.resultData;

            // 상단 셋팅
            screen.f.setHeader();

            // 목록 셋팅
            screen.f.setList();
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

		// cmmClickHistory data- 추가
		setAData: function(e, targetkey1, targetcontent1) {
			$(e).data('usertf',0);
			$(e).data('logdiv','EXTRA');
			$(e).data('targetmodule','WEBZINE');
			$(e).data('targetaction','CLICK');
			$(e).data('targetkey1',targetkey1);
			$(e).data('targetkey2','');
			$(e).data('targetcontent1',targetcontent1);
			$(e).data('targetcontent2','');
		},

      // 헤더 세팅
      setHeader: function() {

        // 상단 해더 바인드
        let topRow = $objData.getListFilter(screen.v.rows, 'mainTf', 1)[0];
        $.each(topRow, function(id, val) {
          $('.block-head').find('[data-bind="'+id+'"]').text(val);
        });

        $('.block-head').find('[data-bind="year"]').text(topRow.yyyy + ' ' +  topRow.seasonCodeNm);
        $('.block-head').find('[data-bind="vol"]').text('Vol. ' +  topRow.vol);

		// 해더 이미지 넣기
		$('.block-head .thumb img').attr('src', imgRootUrl + topRow.imageUrl2);

        // 헤더 링크 세팅
        $(' .inner .sv-webzine .info .interview').find('a').attr('href', topRow.interviewUrl);
        //$(' .inner .sv-webzine .info .ebook').find('a').attr('href', topRow.eventUrl);
        screen.v.linkEbook = topRow.eventUrl;

		// 텍스트, 링크 지정
        $('article .info').find('a span.eventName').text(topRow.subTitle);
        $('.block-head').find('.aside a').attr('href',topRow.subUrl);

		// cmmClickHistory param 세팅
		screen.f.setAData($('.block-head').find('.txt4.interview a'),topRow.icmSeq,'인터뷰 영상');
		screen.f.setAData($('.block-head').find('.txt4.ebook a'),topRow.icmSeq,'이벤트');
		screen.f.setAData($('.block-head').find('.aside a'),topRow.icmSeq,'자세히 보기');

		// 필수 로그인 체크 이전 data 세팅
		// $('.block-head').find('.txt4.ebook a').data('loginFlg', topRow.loginFlg);

		// 이벤트 버튼 클릭 링크시 로그인 필수 체크
		if(!topRow.loginFlg) {
			$('.goEbook_noClick').removeClass('cmmLoginConfirm').addClass('cmmClickHistory').addClass('goEbook');
		}
      },

      // 하단 갤러리 세팅
      setList: function() {

		// 하단 셋팅
		let beforeYyyy = '' ; //screen.v.rows[0].yyyy;
		$.each(screen.v.rows, function(idx, item) {

			let $header = screen.v.htmlItemHeader.clone();
			let $block  = screen.v.htmlItemBlock.clone();
			let $li 	= screen.v.htmlItem.clone();

			// 해당 년도가 없으면
			if(beforeYyyy != item.yyyy) {

				$header.find('[data-bind=yyyy]').text(item.yyyy + '년');

				// 상단 넣기
				$('.bd-wrap.item-container').append($header);

				// 블럭 넣기
				$('.bd-wrap.item-container').append($block);
			}

			// 텍스트 세팅
			// itemData: "2020 가을 | Vol. 03 | 가을입니다"
			// yyyy seasonCodeNm    | Vol.  vol |  title
			$li.find('[data-bind="itemData1"]').text(item.yyyy + ' ' + item.seasonCodeNm);
			$li.find('[data-bind="itemData2"]').text('Vol. ' + item.vol); // lpad 필요
			$li.find('[data-bind="itemData3"]').text(item.title);

			// 하단 list cmmClickHistory param set
			screen.f.setAData($li.find('a'),item.icmSeq,'자세히보기');

			// 연결 링크 세팅
			$li.find('a').attr('href', item.subUrl);

			// 이미지 표시
			if ($text.isEmpty(item.imageUrl1) || item.imageUrl1 == '') {
				$li.find('a img').attr('src', '/images/noimage_280_160.png');
			} else {
				$li.find('a img').attr('src', imgRootUrl + item.imageUrl1);
			}

			// 목록 넣기
			$('.bd-wrap.item-container .sv-webzine-list').last().append($li);

			// 년도 초기화
			beforeYyyy = item.yyyy;
        });
      },
    },

    /**
     * Event 정의 객체.
     *
     * @memberOf screen
     */
    event: function() {

		// 이북 클릭
		$(document).on('click', '.goEbook', function(e) {

			screenUI.f.WinOpenBlank(screen.v.linkEbook);
		});
    },

    /**
     * Init 최초 실행.
     *
     * @memberOf screen
     */
    init: function() {

      // html 년도 해드
      screen.v.htmlItemHeader = $('.bd-wrap.item-container .item-header').clone().removeClass('hidden');
      $('.bd-wrap.item-container .item-header').remove();

      // html 목록
      screen.v.htmlItem = $('.bd-wrap.item-container .item').clone().removeClass('hidden');
      $('.bd-wrap.item-container .item').remove();

      // html 목록을 감싸는 블럭
      screen.v.htmlItemBlock = $('.bd-wrap.item-container .item-block').clone().removeClass('hidden');
      $('.bd-wrap.item-container .item-block').remove();

      // Event 정의 실행
      screen.event();

      // 목록 가져오기
      screen.c.getList();

    }
  };

  screen.init();
  window.screen = screen;
});
