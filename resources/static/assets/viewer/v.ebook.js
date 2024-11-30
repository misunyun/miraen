var EBOOK_ORIGIN_PATH = "/assets/viewer/testdata";
var EBOOK_PAGE = null;
var EBOOK_INDEX = null;
var EBOOK_START_PAGE_INDEX = null;
var EBOOK_END_PAGE_INDEX = null;
var SEMESTER = null;
var EBOOK_TYPE = null;
var INFO_TYPE = null;
var EBOOK_THIS_PAGE_INDEX = null;
var ebookSingleWidthFitPos = null;

var ebook = {
    /** ebook을 보여줄 때 목차가 가지고 있는 ebook의 페이지 정보를 보여줍니다. */
    ebook_page_data: function (data) {

        EBOOK_PAGE = data.page;
        EBOOK_TYPE = data.ebook_type;
        EBOOK_THIS_PAGE_INDEX = data.this_page;

        console.log('EBOOK_ORIGIN_PATH : ', EBOOK_ORIGIN_PATH);
        console.log('EBOOK_PAGE : ', EBOOK_PAGE);
        console.log('EBOOK_TYPE : ', EBOOK_TYPE);
        console.log('EBOOK_THIS_PAGE_INDEX : ', EBOOK_THIS_PAGE_INDEX);

        //$('#iframe_content_pairbook').contents().find('#ebook_wrap').attr('data-ebookPage', EBOOK_PAGE);

        // 수업 양옆 이동버튼 숨기기
        // console.log('수업 양옆 이동버튼 숨기기 ==> display : ', $(".popup.tools").css('display') );
        if($(".popup.tools").css('display') == 'none'){
            $(".icon-prev-content").removeClass('d-none');
            $(".icon-next-content").removeClass('d-none');
        }else{
            $(".icon-prev-content").addClass('d-none');
            $(".icon-next-content").addClass('d-none');
        }

        this.get_ebook_page(EBOOK_PAGE);
    },
    get_unit_data: function (data) {
        // 학년/학기
        SEMESTER = (data.info.grade).replace(/(^0+)/, "") + "-" + (data.info.semester).replace(/(^0+)/, "");
        // infotype은 과목. mt로 들어오면 math, so로 들어오면 social , si로 들어오면 science
        if (data.info.type === 'ma' || data.info.type == 'MA') {
            INFO_TYPE = 'math';
        } else if (data.info.type === 'so' || data.info.type == 'SO') {
            INFO_TYPE = 'social';
        } else if (data.info.type === 'sc' || data.info.type == 'SC') {
            INFO_TYPE = 'science';
        }
    },
    /** 받아온 page 번호를 이용하여 단일 페이지인지 여러 페이지인지 확인합니다. */
    get_ebook_page: function (page) {
        var _page = String(page);

        // EBOOK_INDEX는 보여주어야 할 총 페이지 수를 의미합니다.
        if (_page.indexOf('~') != -1) {
            // 여러 페이지
            EBOOK_START_PAGE_INDEX = _page.split('~')[0];
            EBOOK_END_PAGE_INDEX = _page.split('~')[1];

            EBOOK_INDEX = 1 + (parseInt(_page.split('~')[1]) - parseInt(_page.split('~')[0]));
        } else {
            // 단일 페이지
            EBOOK_START_PAGE_INDEX = _page;
            EBOOK_END_PAGE_INDEX = _page;
            EBOOK_INDEX = 1;
        };

        if (EBOOK_THIS_PAGE_INDEX == undefined) {
            EBOOK_THIS_PAGE_INDEX = EBOOK_START_PAGE_INDEX;
        };

        $('#iframe_content_pairbook').contents().find("#ebook_wrap").attr("data-ebookIndex", EBOOK_INDEX);
        $('#iframe_content_pairbook').contents().find('#ebook_wrap').attr('data-ebookStartPage', EBOOK_START_PAGE_INDEX);
        $('#iframe_content_pairbook').contents().find('#ebook_wrap').attr('data-ebookEndPage', EBOOK_END_PAGE_INDEX);

        this.status_double_ebook_load(EBOOK_THIS_PAGE_INDEX);
    },
    /** 현재 페이지의 단면 / 양면 여부를 확인합니다. */
    status_check: function () {
        var status = $('#iframe_content_pairbook').contents().find('#ebook_wrap').attr('data-ebookStatus');
        return status;
    },
    /** ebook을 보여줄 때 viewer에서 가리거나 보여야 하는 부분을 콘트롤합니다. */
    show_ebook: function () {
        // content 가리기
        $('#iframe_content').hide();
        // pairbook 보이기
        $('#iframe_content_pairbook').show();
        // 페이지 이동 버튼 가리기
        $(".icon-prev-content").hide();
        $(".icon-next-content").hide();
        // ebook은 작게보기 사용 안 함
        $('.icon-aside-open-txt').hide();
        // 수학교구 버튼 가리기
        $('#math_tool_btn').hide();
        // 모바일일 때 top 30px 삭제
        if (DEVICE_TYPE == 'mobile') {
            $("#iframe_content_pairbook").css('top', '30px');
        };
        // 상단 타이틀바 보이기
        $(".popup.tools").show();
        $(".popup.tools").css({
            'position': 'relative',
        });
        // 단면 / 양면
        $(".popup.tools .title").unbind("click");
        // 상단 타이틀바 변경
        ebook.changeEbookTitlebar();

        // setting은 무조건 비율 맞추기로 고정(fit)
        viewer.settingRatioFit();

        // mirroring.api_sync_obj({
        //     target: "viewer",
        //     script: 'viewer.settingRatioFit();'
        // });
    },
    /** 교과서 보기의 타이틀 바를 일반에서 eBook용으로 변경합니다 */
    changeEbookTitlebar: function () {
        $(".popup.tools").html('');
        var _html = "<div id='double' class='ebook_change_btn active'>양쪽 보기</div><div id='single' class='ebook_change_btn'>한쪽 보기</div><div class='content_viewType heightFit' alt='세로 맞춤' title='세로 맞춤'></div><a class='close'></a>";
        $(".popup.tools").append(_html);
        $(".popup.tools").css('z-index', '21');
        ebook.move_button_show();
    },
    /** 교과서 보기의 타이틀 바를 eBook용에서 일반으로 변경합니다 */
    changePairBookTitlebar: function () {
        $(".popup.tools").html('');
        var _html = "<span class='title'></span><a class='close'></a>";
        $(".popup.tools").append(_html);
        $(".popup.tools").css('z-index', '0');
        ebook.move_button_hide();
    },
    /** 왼쪽 아이프레임 scale */
    left_iframe_scale: function () {
        var left_iframe = $('#iframe_content_pairbook').contents().find('#ebook_left');

        // var _this_frame = this.contentDocument;
        var _this_frame = $('#iframe_content_pairbook').contents().find('#ebook_left').contents()[0];

        var contents_width = _this_frame.getElementById('ebook').offsetWidth;
        var contents_height = _this_frame.getElementById('ebook').offsetHeight;

        var pairbook_width = $('#iframe_content_pairbook').width();
        pairbook_width = pairbook_width / 2;
        var pairbook_height = $('#iframe_content_pairbook').height();
        var scale_y = pairbook_height / contents_height;

        // left_iframe.css({
        //     'width': contents_width,
        //     'height': contents_height,
        //     'transform': 'scale(' + scale_y + ')',
        //     '-moz-transform': 'scale(' + scale_y + ')',
        //     '-webkit-transform': 'scale(' + scale_y + ')',
        //     '-ms-transform': 'scale(' + scale_y + ')',
        //     '-o-transform': 'scale(' + scale_y + ')',
        //     "-webkit-transform-origin": '0 0',
        //     'transform-origin': '0 0'
        // });

        if (DEVICE_TYPE != 'mobile') {
            left_iframe.css({
                'width': contents_width,
                'height': contents_height,
                'transform': 'scale(' + scale_y + ')',
                '-moz-transform': 'scale(' + scale_y + ')',
                '-webkit-transform': 'scale(' + scale_y + ')',
                '-ms-transform': 'scale(' + scale_y + ')',
                '-o-transform': 'scale(' + scale_y + ')',
                "-webkit-transform-origin": '0 0',
                'transform-origin': '0 0'
            });
        } else {
            left_iframe.css({
                'width': contents_width * scale_y,
                'height': contents_height * scale_y,
                'transform-origin': '0 0'
            });
        }

        // ebook 스크롤 방지
        _this_frame.getElementById('ebook').style.overflow = 'hidden';
    },
    /** 오른쪽 아이프레임 scale */
    right_iframe_scale: function () {
        var right_iframe = $('#iframe_content_pairbook').contents().find('#ebook_right');

        // var _this_frame = this.contentDocument;
        var _this_frame = $('#iframe_content_pairbook').contents().find('#ebook_right').contents()[0];

        var contents_width = _this_frame.getElementById('ebook').offsetWidth;
        var contents_height = _this_frame.getElementById('ebook').offsetHeight;

        var pairbook_width = $('#iframe_content_pairbook').width();
        pairbook_width = pairbook_width / 2;
        var pairbook_height = $('#iframe_content_pairbook').height();
        var scale_y = pairbook_height / contents_height;

        // right_iframe.css({
        //     'width': contents_width,
        //     'height': contents_height,
        //     'transform': 'scale(' + scale_y + ')',
        //     '-moz-transform': 'scale(' + scale_y + ')',
        //     '-webkit-transform': 'scale(' + scale_y + ')',
        //     '-ms-transform': 'scale(' + scale_y + ')',
        //     '-o-transform': 'scale(' + scale_y + ')',
        //     "-webkit-transform-origin": '0 0',
        //     'transform-origin': '0 0'
        // });

        if (DEVICE_TYPE != 'mobile') {
            right_iframe.css({
                'width': contents_width,
                'height': contents_height,
                'transform': 'scale(' + scale_y + ')',
                '-moz-transform': 'scale(' + scale_y + ')',
                '-webkit-transform': 'scale(' + scale_y + ')',
                '-ms-transform': 'scale(' + scale_y + ')',
                '-o-transform': 'scale(' + scale_y + ')',
                "-webkit-transform-origin": '0 0',
                'transform-origin': '0 0'
            });
        } else {
            right_iframe.css({
                'width': contents_width * scale_y,
                'height': contents_height * scale_y,
                'transform-origin': '0 0'
            });
        }

        // ebook 스크롤 방지
        _this_frame.getElementById('ebook').style.overflow = 'hidden';
    },
    /** 양면보기 시 ebook의 스케일을 조정합니다. */
    status_double_scale: function () {
        viewer.resize();

        var self = this;
        var parent_body = $('#iframe_content_pairbook').contents().find('body');
        parent_body.width('100%');
        parent_body.height('100%');

        var left_iframe = $('#iframe_content_pairbook').contents().find('#ebook_left');
        var right_iframe = $('#iframe_content_pairbook').contents().find('#ebook_right');
        // console.log(">>> "+JSON.stringify(left_iframe));
        // console.log(">>> "+JSON.stringify(right_iframe));
        // IE에서 스크롤 생기는 부분 방지
        var parent_iframe = document.getElementById('iframe_content_pairbook');
        parent_iframe.contentWindow.document.body.style.overflow = 'hidden';
        parent_body.css('overflow-y', 'hidden');

        left_iframe.on('load', function () {
            // 모바일에서 css 랜더링 시 브라우저 문제 발생 확률이 높아 iframe과 교과서 image의 크기를 줄여주었습니다.
            // 관련 이슈 : https://stackoverflow.com/questions/52595504/ios-safari-crashing-a-problem-repeatedly-occured

            var _this_frame = $('#iframe_content_pairbook').contents().find('#ebook_left').contents()[0];

            var contents_width = _this_frame.getElementById('ebook').offsetWidth;
            var contents_height = _this_frame.getElementById('ebook').offsetHeight;
            var pairbook_height = $('#iframe_content_pairbook').height();
            var scale_y = pairbook_height / contents_height;

            // ebook 내부 img 흐리게 보이는 부분 수정 및 이미지 사이즈 추가
            if (DEVICE_TYPE != 'mobile') {
                var styleElement = document.createElement('style');
                styleElement.innerHTML = "img {width:100% !important; height:100% !important; transform:translate3d(0,0,0);}";
                this.contentDocument.head.appendChild(styleElement);
            } else {
                var styleElement = document.createElement('style');
                styleElement.innerHTML = "body {overflow:hidden;} img {width:" + (contents_width * scale_y) + "px !important; height:" + (contents_height * scale_y) + "px !important; transform:translate3d(0,0,0);}";
                this.contentDocument.head.appendChild(styleElement);
            }
            // var styleElement = document.createElement('style');
            // styleElement.innerHTML = "img {width:100% !important; height:100% !important; transform:translate3d(0,0,0);}";
            // this.contentDocument.head.appendChild(styleElement);

            // this.contentDocument.getElementsByTagName('img')[0].style.transform = 'translate3d(0,0,0)';
            // this.contentDocument.getElementsByTagName('img')[0].style.height = '100%';

            setTimeout(function () {
                self.left_iframe_scale();
            }, 800);
            left_iframe.off('load');
        });

        right_iframe.on('load', function () {
            // ebook 내부 img 흐리게 보이는 부분 수정 및 이미지 사이즈 추가
            var _this_frame = $('#iframe_content_pairbook').contents().find('#ebook_right').contents()[0];
            var contents_width = _this_frame.getElementById('ebook').offsetWidth;
            var contents_height = _this_frame.getElementById('ebook').offsetHeight;
            var pairbook_height = $('#iframe_content_pairbook').height();
            var scale_y = pairbook_height / contents_height;

            // ebook 내부 img 흐리게 보이는 부분 수정 및 이미지 사이즈 추가
            if (DEVICE_TYPE != 'mobile') {
                var styleElement = document.createElement('style');
                styleElement.innerHTML = "img {width:100% !important; height:100% !important; transform:translate3d(0,0,0);}";
                this.contentDocument.head.appendChild(styleElement);
            } else {
                var styleElement = document.createElement('style');
                styleElement.innerHTML = "body {overflow:hidden;} img {width:" + (contents_width * scale_y) + "px !important; height:" + (contents_height * scale_y) + "px !important; transform:translate3d(0,0,0);}";
                this.contentDocument.head.appendChild(styleElement);
            }
            // var styleElement = document.createElement('style');
            // styleElement.innerHTML = "img {width:100% !important; height:100% !important; transform:translate3d(0,0,0);}";
            // this.contentDocument.head.appendChild(styleElement);

            // this.contentDocument.getElementsByTagName('img')[0].style.transform = 'translate3d(0,0,0)';
            // this.contentDocument.getElementsByTagName('img')[0].style.height = '100%';

            setTimeout(function () {
                self.right_iframe_scale();
            }, 800);
            right_iframe.off('load');
        });

        $("#viewer-content").LoadingOverlay("hide");

        self.status_single_reset();
        self.status_double_show_move_button();
        self.setDrawingCanvas();
    },
    /** 단면보기 시 ebook의 스케일을 조정합니다. */
    status_single_scale: function () {
        viewer.resize();

        var self = this;
        var center_frame = $('#iframe_content_pairbook').contents().find('#ebook_center');

        $(center_frame).on('load', function (e) {
            var _this_frame = this.contentDocument;
            self.singlePageFit()

            // 2022.02.18 한쪽보기 가로폭일 때 스크롤과 드래그 같이 사용할 수 있도록 수정
            $('#iframe_content_pairbook').contents().find('body')[0].addEventListener('mousedown', ebook.singleWidthFitHandle);
            $('#iframe_content_pairbook').contents().find('body')[0].addEventListener('mouseleave', ebook.singleWidthFitMouseUp);

            // !! 한쪽보기 iframe과 drawing이 형제. 스크롤 씽크 맞추기
            self.ebookScrollSync();

            // mirroring.api_sync_obj({
            //     target: "ebook",
            //     script: 'ebook.ebookScrollSync();'
            // });

            // ebook 스크롤 방지
            _this_frame.getElementById('ebook').style.overflow = 'hidden';
            // ebook 내부 img 흐리게 보이는 부분 수정
            // _this_frame.getElementsByTagName('img')[0].style.transform = 'translateZ(0)';
            _this_frame.getElementsByTagName('img')[0].style.transform = 'translate3d(0,0,0)';

            self.status_double_reset();
            self.status_single_show_move_button();

            $(center_frame).off('load');
        });

    },
    /***
     * ebook 한쪽보기 - 가로폭보기 시 드래그로 스크롤 이동
     */
    singleWidthFitHandle: function (e) {
        $('#iframe_content_pairbook').contents().bind('mousedown', function (e) {
            // console.log('mouse down');
            var ele = $('#iframe_content_pairbook').contents().find('body')[0];

            ele.style.userSelect = 'none';

            ebookSingleWidthFitPos = {
                left: $('#iframe_content_pairbook').contents().scrollLeft(),
                top: $('#iframe_content_pairbook').contents().scrollTop(),
                x: e.clientX,
                y: e.clientY,
            };

            ele.addEventListener('mousemove', ebook.singleWidthFitMouseMove);
            ele.addEventListener('mouseup', ebook.singleWidthFitMouseUp);
        });
    },
    singleWidthFitMouseMove: function (e) {
        // console.log('mouse move');

        var dy = e.clientY - ebookSingleWidthFitPos.y;
        var _top = ebookSingleWidthFitPos.top - dy;

        $('#iframe_content_pairbook').contents().scrollTop(_top);
    },
    singleWidthFitMouseUp: function (e) {
        // console.log('mouse up');
        var ele = $('#iframe_content_pairbook').contents().find('body')[0];

        ele.style.removeProperty('user-select');

        ele.removeEventListener('mousemove', ebook.singleWidthFitMouseMove);
        ele.removeEventListener('mouseup', ebook.singleWidthFitMouseUp);
    },
    ebookScrollSync: function () {
        $('#iframe_content_pairbook').contents().off().on('wheel scroll', function () {
            var parent_scroll_top = $('#iframe_content_pairbook').contents().scrollTop();

            $('.drawing-canvas').css('top', -parent_scroll_top);

            // mirroring.api_sync_obj({
            //     target: "ebook",
            //     script: 'ebook.mirroringSinglePageScrollSync(' + parent_scroll_top + ');'
            // });
        });
    },
    mirroringSinglePageScrollSync: function (scrollTop) {
        $('#iframe_content_pairbook').contents().scrollTop(scrollTop);
    },
    /** 양면보기 시 페이지 이동 버튼을 보여주는 이벤트. */
    status_double_show_move_button: function () {
        var _index = parseInt($('#iframe_content_pairbook').contents().find("#ebook_wrap").attr("data-ebookIndex"));
        var _start_index = parseInt($('#iframe_content_pairbook').contents().find("#ebook_wrap").attr("data-ebookStartPage"));
        var _end_index = parseInt($('#iframe_content_pairbook').contents().find("#ebook_wrap").attr("data-ebookEndPage"));
        var _left_page_index = parseInt($('#iframe_content_pairbook').contents().find("#ebook_left").attr("data-pageindex"));
        var _right_page_index = parseInt($('#iframe_content_pairbook').contents().find("#ebook_right").attr("data-pageindex"));

        var _prev_btn = $('#ebook_prev_btn');
        var _next_btn = $('#ebook_next_btn');
        // 모바일일 때 구분해주어야 함
        var _m_prev_btn = $('.quick-mid .prev');
        var _m_next_btn = $('.quick-mid .next');


        if (_index <= 2 && ((_start_index == _left_page_index) && (_end_index == _right_page_index)) || (_start_index == _end_index)) {
            _prev_btn.css('display', 'none');
            _next_btn.css('display', 'none');
            _m_prev_btn.css('pointer-events', 'none');
            _m_next_btn.css('pointer-events', 'none');
            return;
        } else if (_index >= 2 && ((_start_index == _left_page_index) || (_start_index == _right_page_index))) {
            _prev_btn.css('display', 'none');
            _next_btn.css('display', 'block');
            _m_prev_btn.css('pointer-events', 'none');
            _m_next_btn.css('pointer-events', 'all');
            return;
        } else if (_index >= 2 && ((_end_index == _left_page_index) || (_end_index == _right_page_index))) {
            _prev_btn.css('display', 'block');
            _next_btn.css('display', 'none');
            _m_prev_btn.css('pointer-events', 'all');
            _m_next_btn.css('pointer-events', 'none');
            return;
        } else {
            _prev_btn.css('display', 'block');
            _next_btn.css('display', 'block');
            _m_prev_btn.css('pointer-events', 'all');
            _m_next_btn.css('pointer-events', 'all');
            return;
        };
    },
    /** 단면보기 시 페이지 이동 버튼을 보여주는 이벤트. */
    status_single_show_move_button: function () {
        var _index = parseInt($('#iframe_content_pairbook').contents().find("#ebook_wrap").attr("data-ebookIndex"));
        var _start_index = parseInt($('#iframe_content_pairbook').contents().find("#ebook_wrap").attr("data-ebookStartPage"));
        var _end_index = parseInt($('#iframe_content_pairbook').contents().find("#ebook_wrap").attr("data-ebookEndPage"));
        var _center_page_index = parseInt($('#iframe_content_pairbook').contents().find("#ebook_center").attr("data-pageindex"));

        var _prev_btn = $('#ebook_prev_btn');
        var _next_btn = $('#ebook_next_btn');
        // 모바일일 때 구분해주어야 함
        var _m_prev_btn = $('.quick-mid .prev');
        var _m_next_btn = $('.quick-mid .next');

        if (_index <= 1) {
            _prev_btn.css('display', 'none');
            _next_btn.css('display', 'none');
            _m_prev_btn.css('pointer-events', 'none');
            _m_next_btn.css('pointer-events', 'none');
        } else if (_index > 1 && _start_index == _center_page_index) {
            _prev_btn.css('display', 'none');
            _next_btn.css('display', 'block');
            _m_prev_btn.css('pointer-events', 'none');
            _m_next_btn.css('pointer-events', 'all');
        } else if (_index > 1 && _end_index == _center_page_index) {
            _prev_btn.css('display', 'block');
            _next_btn.css('display', 'none');
            _m_prev_btn.css('pointer-events', 'all');
            _m_next_btn.css('pointer-events', 'none');
        } else {
            _prev_btn.css('display', 'block');
            _next_btn.css('display', 'block');
            _m_prev_btn.css('pointer-events', 'all');
            _m_next_btn.css('pointer-events', 'all');
        };
    },
    /** 양면보기 시 다음 페이지 이동 이벤트 */
    status_double_next_page_move: function (page_index) {
        var next_page = parseInt(page_index) + 2;
        this.status_double_ebook_load(next_page);
    },
    /** 양면보기 시 이전 페이지 이동 이벤트 */
    status_double_prev_page_move: function (page_index) {
        var prev_page = parseInt(page_index) - 2;
        this.status_double_ebook_load(prev_page);
    },
    /** 단면보기 시 다음 페이지 이동 이벤트 */
    status_single_next_page_move: function (page_index) {
        var next_page = parseInt(page_index) + 1;
        this.status_single_ebook_load(next_page);
    },
    /** 단면보기 시 이전 페이지 이동 이벤트 */
    status_single_prev_page_move: function (page_index) {
        var prev_page = parseInt(page_index) - 1;
        this.status_single_ebook_load(prev_page);

    },
    /** 양면보기 iframe 정보를 reset합니다. */
    status_double_reset: function () {
        $('#iframe_content_pairbook').contents().find('.ebook_iframe').attr('data-pageindex', '');
        $('#iframe_content_pairbook').contents().find('.ebook_iframe').attr('src', '');
        $('#iframe_content_pairbook').contents().find('.ebook_iframe').css({
            'width': 0,
            'height': 0,
            'transform': 'scale(1)',
            '-webkit-transform': 'scale(1)',
            '-moz-transform': 'scale(1)',
            '-ms-transform': 'scale(1)',
            '-o-transform': 'scale(1)',
            "-webkit-transform-origin": '0, 0',
            'transform-origin': '0, 0',
            'display': 'none'
        });
    },
    /** 단면보기 iframe 정보를 reset합니다. */
    status_single_reset: function () {
        $('#iframe_content_pairbook').contents().find('#ebook_center').attr('data-pageindex', '');
        $('#iframe_content_pairbook').contents().find('#ebook_center').attr('src', '');
        $('#iframe_content_pairbook').contents().find('#ebook_center').css({
            'width': 0,
            'height': 0,
            'transform': 'scale(1)',
            '-webkit-transform': 'scale(1)',
            '-moz-transform': 'scale(1)',
            '-ms-transform': 'scale(1)',
            '-o-transform': 'scale(1)',
            "-webkit-transform-origin": '0, 0',
            'transform-origin': '0, 0',
            'display': 'none'
        });
    },
    /** url이 실제 존재하는지 체크 */
    check_page_url: function (url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        // http.send();
        if (http.status != 404)
            return true;
        else
            return false;
    },
    /** 좌측페이지 무조건 짝수, 오른쪽 페이지 무조건 홀수 / 양면보기 iframe 정보를 불러옵니다. */
    status_double_ebook_load: function (page_index) {
        if ($('#iframe_content_pairbook').attr('src').indexOf('ebookpair.html') == -1) {
            return;
        }

        $("#viewer-content").LoadingOverlay("show", loading_overlay_default);

        /**
         * 모바일일 때 페이지 보기가 보충 자료 페이지로 보일 수 있기 때문에 페이지 정보 초기화
         * 양쪽보기부터 진행하기 때문에 해당 코드는 양쪽보기에만 들어갑니다.
         *
         *  */
        if (DEVICE_TYPE == 'mobile') {
            viewer.update_viewer_current_info();
        }

        var self = this;
        var left, right = null;
        var _index = parseInt(page_index);

        if (EBOOK_START_PAGE_INDEX && (_index % 2 == 0)) {
            // 시작 페이지가 짝수일 때
            if (EBOOK_INDEX == 1 || _index == EBOOK_END_PAGE_INDEX) {
                left = String(_index);
                right = '000';
            } else if (_index == (EBOOK_START_PAGE_INDEX - 1)) {
                left = '000';
                right = String(_index + 1);
            } else {
                left = String(_index);
                right = String(_index + 1);
            }

        } else if (EBOOK_START_PAGE_INDEX && (_index % 2 == 1)) {
            // 시작 페이지가 홀수일 때
            if (EBOOK_INDEX == 1 || _index == EBOOK_START_PAGE_INDEX) {
                left = '000';
                right = String(_index);
            } else {
                if (EBOOK_END_PAGE_INDEX % 2 == 0 && (_index - 1) == EBOOK_END_PAGE_INDEX) {
                    left = String(_index - 1);
                    right = '000';
                } else {
                    left = String(_index - 1);
                    right = String(_index);
                }
            }
        }

        var left_ebook_page_number = this.page_number_fill_zero(3, left);
        var right_ebook_page_number = this.page_number_fill_zero(3, right);

        var left_page_url = null;
        var right_page_url = null;

        // 수학은 xhtml, 사회는 html

        var url_path = EBOOK_ORIGIN_PATH + "/cms/smartppt/auth/ebook/";

        if (INFO_TYPE === 'math') {
            // left_page_url = 'testdata/demo/ebook/' + SEMESTER + '/page' + left_ebook_page_number + '.xhtml';
            // right_page_url = 'testdata/demo/ebook/' + SEMESTER + '/page' + right_ebook_page_number + '.xhtml';
            left_page_url = url_path + EBOOK_TYPE + "/" + INFO_TYPE + "/" + SEMESTER + "/ops/page" + left_ebook_page_number + ".xhtml";
            right_page_url = url_path + EBOOK_TYPE + "/" + INFO_TYPE + "/" + SEMESTER + "/ops/page" + right_ebook_page_number + ".xhtml";
        } else if (INFO_TYPE == 'social') {
            // left_page_url = 'testdata/demo/ebook/' + SEMESTER + '/page' + left_ebook_page_number + '.html';
            // right_page_url = 'testdata/demo/ebook/' + SEMESTER + '/page' + right_ebook_page_number + '.html';
            left_page_url = url_path + EBOOK_TYPE + "/" + INFO_TYPE + "/" + SEMESTER + "/ops/page" + left_ebook_page_number + ".html";
            right_page_url = url_path + EBOOK_TYPE + "/" + INFO_TYPE + "/" + SEMESTER + "/ops/page" + right_ebook_page_number + ".html";
        } else if (INFO_TYPE == 'science') {
            // left_page_url = 'testdata/demo/ebook/' + SEMESTER + '/page' + left_ebook_page_number + '.html';
            // right_page_url = 'testdata/demo/ebook/' + SEMESTER + '/page' + right_ebook_page_number + '.html';
            left_page_url = url_path + EBOOK_TYPE + "/" + INFO_TYPE + "/" + SEMESTER + "/ops/page" + left_ebook_page_number + ".xhtml";
            right_page_url = url_path + EBOOK_TYPE + "/" + INFO_TYPE + "/" + SEMESTER + "/ops/page" + right_ebook_page_number + ".xhtml";
        }

        console.log('left page : ', left_page_url);
        console.log('right page : ', right_page_url);

        // iframe에 들어가는 url에 파일이 없으면??
        if (ebook.check_page_url(left_page_url)) {
            if (ebook.check_page_url(right_page_url)) {
                double_page_seccess();
            } else {
                console.error('ERROR : ebook 오른쪽 페이지가 없음');

                $("#viewer-content").LoadingOverlay("hide");

                show_alert("존재하지 않는 페이지입니다.", function () {
                    app.close_popup_content();
                    return;
                });
            }
        } else {
            console.error('ERROR : ebook 왼쪽 페이지가 없음');

            $("#viewer-content").LoadingOverlay("hide");

            show_alert("존재하지 않는 페이지입니다.", function () {
                app.close_popup_content();
                return;
            });
        }

        //
        function double_page_seccess() {
            var left_iframe = $('#iframe_content_pairbook').contents().find('#ebook_left');
            var right_iframe = $('#iframe_content_pairbook').contents().find('#ebook_right');

            left_iframe.attr('data-pageIndex', left);
            left_iframe.attr('src', left_page_url);

            right_iframe.attr('data-pageIndex', right);
            right_iframe.attr('src', right_page_url);

            // 줌 기능을 위해 사용
            Module.common.iframe_zoom('iframe_content_pairbook', 3);
            left_iframe.css('z-index', '-10000');
            right_iframe.css('z-index', '-10000');

            $('#iframe_content_pairbook').contents().find('.ebook_iframe').css('display', 'block');

            var prev_btn = $('#ebook_prev_btn');
            var next_btn = $('#ebook_next_btn');

            // 모바일일 때 구분해주어야 함
            if (DEVICE_TYPE == 'mobile') {
                prev_btn = $('.quick-mid .prev');
                next_btn = $('.quick-mid .next');
            }

            prev_btn.unbind('click');
            next_btn.unbind('click');

            prev_btn.bind('click', function () {
                self.status_double_prev_page_move(_index);

                // mirroring.api_sync_obj({
                //     target: "ebook",
                //     script: 'ebook.status_double_prev_page_move(' + _index + ');'
                // });
            });

            next_btn.bind('click', function () {
                self.status_double_next_page_move(_index);

                // mirroring.api_sync_obj({
                //     target: "ebook",
                //     script: 'ebook.status_double_next_page_move(' + _index + ');'
                // });
            });

            self.allToolMenuClose();
            self.status_single_reset();
            self.status_double_scale();
        }
    },
    /** 단면보기 iframe 정보를 불러옵니다. */
    status_single_ebook_load: function (page_index) {
        if ($('#iframe_content_pairbook').attr('src').indexOf('ebookpair.html') == -1) {
            return;
        }

        $("#viewer-content").LoadingOverlay("show", loading_overlay_default);

        var self = this;
        var url = null;

        // 수학은 xhtml, 사회는 html, 과학은 xhtml
        var url_path = "/cms/smartppt/auth/ebook/";

        if (INFO_TYPE == 'math') {
            // if (EBOOK_TYPE == 'ebook') {
            url = url_path + EBOOK_TYPE + "/" + INFO_TYPE + "/" + SEMESTER + '/ops/page' + this.page_number_fill_zero(3, String(page_index)) + '.xhtml';
            // url = 'testdata/demo/ebook/' + SEMESTER + '/page' + this.page_number_fill_zero(3, String(page_index)) + '.xhtml';
            // } else if (EBOOK_TYPE == 'studybook') {
            //     url = 'testdata/demo/studybook/' + SEMESTER + '/page' + this.page_number_fill_zero(3, String(page_index)) + '.xhtml';
            // };
        } else if (INFO_TYPE == 'social') {
            // if (EBOOK_TYPE == 'ebook') {
            url = url_path + EBOOK_TYPE + "/" + INFO_TYPE + "/" + SEMESTER + '/ops/page' + this.page_number_fill_zero(3, String(page_index)) + '.html';

            // url = 'testdata/demo/ebook/' + SEMESTER + '/page' + this.page_number_fill_zero(3, String(page_index)) + '.html';
            // } else if (EBOOK_TYPE == 'studybook') {
            //     url = 'testdata/demo/studybook/' + SEMESTER + '/page' + this.page_number_fill_zero(3, String(page_index)) + '.html';
            // };
        } else if (INFO_TYPE == 'science') {
            url = url_path + EBOOK_TYPE + "/" + INFO_TYPE + "/" + SEMESTER + '/ops/page' + this.page_number_fill_zero(3, String(page_index)) + '.xhtml';
        };
        // iframe에 들어가는 url에 파일이 없으면??
        if (ebook.check_page_url(url)) {
            single_page_seccess();
        } else {
            console.error('ERROR : ', url + ' 파일이 존재하지 않습니다.');

            show_alert("존재하지 않는 페이지입니다.", function () {
                app.close_popup_content();
                return;
            });
        }

        $("#viewer-content").LoadingOverlay("hide");

        function single_page_seccess() {
            $('#iframe_content_pairbook').contents().find('#ebook_center').attr('data-pageIndex', page_index);
            $('#iframe_content_pairbook').contents().find('#ebook_center').attr('src', url);
            // 줌 기능을 위해 사용
            Module.common.iframe_zoom('iframe_content_pairbook', 3);
            $('#iframe_content_pairbook').contents().find('#ebook_center').css({ 'display': 'block', 'z-index': '-10000' });

            var prev_btn = $('#ebook_prev_btn');
            var next_btn = $('#ebook_next_btn');

            // 모바일일 때 구분해주어야 함
            if (DEVICE_TYPE == 'mobile') {
                prev_btn = $('.quick-mid .prev');
                next_btn = $('.quick-mid .next');
            }

            prev_btn.unbind('click');
            next_btn.unbind('click');

            prev_btn.bind('click', function () {
                self.status_single_prev_page_move(page_index);

                // mirroring.api_sync_obj({
                //     target: "ebook",
                //     script: 'ebook.status_single_prev_page_move(' + page_index + ');'
                // });
            });

            next_btn.bind('click', function () {
                self.status_single_next_page_move(page_index);

                // mirroring.api_sync_obj({
                //     target: "ebook",
                //     script: 'ebook.status_single_next_page_move(' + page_index + ');'
                // });
            });

            self.allToolMenuClose();
            self.status_double_reset();
            self.status_single_scale();
        };
    },
    /** 양면보기에서 단면보기 전환 이벤트 */
    status_double_to_single: function () {
        var get_index = null;
        // var _start_index = $('#iframe_content_pairbook').contents().find('#ebook_wrap').attr('data-ebookPage');

        if (parseInt(EBOOK_THIS_PAGE_INDEX) % 2 == 0) {
            get_index = $('#iframe_content_pairbook').contents().find('#ebook_left').attr('data-pageIndex');
            if (get_index == '000') {
                get_index = $('#iframe_content_pairbook').contents().find('#ebook_right').attr('data-pageIndex');
            }
        } else {
            get_index = $('#iframe_content_pairbook').contents().find('#ebook_right').attr('data-pageIndex');
            if (get_index == '000') {
                get_index = $('#iframe_content_pairbook').contents().find('#ebook_left').attr('data-pageIndex');
            }
        }

        $('#iframe_content_pairbook').contents().find('#ebook_wrap').attr('data-ebookstatus', 'single');
        $('#iframe_content_pairbook').contents().find('#book_line').css('display', 'none');

        this.status_single_ebook_load(get_index);
        this.status_double_reset();
        this.status_single_scale();
        this.singlePage_viewType_btn_show();
    },
    /** 단면보기에서 양면보기 전환 이벤트 */
    status_single_to_double: function () {
        var center_index = $('#iframe_content_pairbook').contents().find('#ebook_center').attr('data-pageIndex');

        $('#iframe_content_pairbook').contents().find('#ebook_wrap').attr('data-ebookstatus', 'double');
        $('#iframe_content_pairbook').contents().find('#book_line').css('display', 'block');

        // 한쪽보기 - 세로폭인 경우 body에 margin 적용이 되어있음. margin을 0으로 변경해줘야 함.
        $('#iframe_content_pairbook').contents().find('body').css('margin', 0);

        this.status_double_ebook_load(center_index);
        this.status_single_reset();
        this.status_double_scale();
        this.singlePage_viewType_btn_hide();
    },
    /** url 정보를 위해 페이지 숫자를 0으로 채움 (ex: 16 → 016, 8 → 008) */
    page_number_fill_zero: function (width, str) {
        return str.length >= width ? str : new Array(width - str.length + 1).join('0') + str;
    },
    fit_parent: function () {
        var _parent_width = $('#viewer-content').width();
        var _parent_height = parseInt($('#viewer-content').height()) - 30;

        $('#iframe_content_pairbook').width(_parent_width)
        $('#iframe_content_pairbook').height(_parent_height)
    },
    move_button_show: function () {
        $('.ebook_page_move_btn').show();
    },
    move_button_hide: function () {
        $('.ebook_page_move_btn').hide();
    },
    singlePage_viewType_btn_show: function () {
        $('.popup.tools .content_viewType').show();
    },
    singlePage_viewType_btn_hide: function () {
        $('.popup.tools .content_viewType').hide();
    },
    setDrawingCanvas: function () {
        // 양쪽 보기와 한쪽 보기 구분
        var self = this;
        var status = $('.popup.tools .active').attr('id');

        if (status == 'double') {
            self.doublePageFit();
        } else if (status == 'single') {

        }
    },
    doublePageFit: function () {
        viewer.resize();

        var _get_width = $('#iframe_content_pairbook').contents().find('#ebook_wrap').width();
        var _get_height = $('#iframe_content_pairbook').contents().find('#ebook_wrap').height();

        $('.drawing-canvas').css({
            'width': _get_width,
            'height': _get_height,
            'left': 0,
            'top': 0
        });

        $('.konvajs-content').css({
            'width': '100%',
            'height': '100%',
        });

        // TODO : TESTDATA에서는 새로 그리면 기존 그림이 날이감. 연동 시에는 디비에서 데이터 가져와서 불러서 그려줘야 함.
        if (iframe_canvas) {
            var _container = $("#viewer-content .drawing-canvas").get(0);
            iframe_canvas.deactivate();
            iframe_canvas = new DrawingCanvas({
                container: _container,
            });
        };

        drawing_canvas = iframe_canvas;
    },
    singlePageFit: function () {
        viewer.resize();

        var _this_frame = $('#iframe_content_pairbook').contents().find('#ebook_center').contents();
        var pairbook_width = $('#iframe_content_pairbook').width();
        var pairbook_height = $('#iframe_content_pairbook').height();
        var contents_width = _this_frame.find('#ebook').width();
        var contents_height = _this_frame.find('#ebook').height();

        var scale_x = pairbook_width / contents_width;
        var scale_y = pairbook_height / contents_height;

        // 가로폭으로 보는지 세로폭으로 보는지 data 가져오기
        // 콘텐츠 크기에 맞춰 부모 영역 조절
        var _get_width = $('#iframe_content_pairbook').contents().find('#ebook_center').width();
        var _get_height = $('#iframe_content_pairbook').contents().find('#ebook_center').height();

        var user_viewType = $('.popup.tools .content_viewType');

        var __scale = null;
        var viewTypeMargin = null;

        var widthFitMargin = (pairbook_width - (_get_width * scale_y)) / 2;
        var parent_body = $('#iframe_content_pairbook').contents().find('body');

        if (user_viewType.hasClass('widthFit')) {
            __scale = scale_y;
            viewTypeMargin = '0 ' + widthFitMargin + 'px';

            parent_body.css('overflow-y', 'hidden');

        } else if (user_viewType.hasClass('heightFit')) {
            __scale = scale_x;
            viewTypeMargin = '0';

            parent_body.css('overflow-y', 'scroll');
        }

        // iframe크기를 원본 콘텐츠 크기로 맞추기
        $('#iframe_content_pairbook').contents().find('#ebook_center').css({
            'width': contents_width,
            'height': contents_height,
            'transform': 'scale(' + __scale + ')',
            '-moz-transform': 'scale(' + __scale + ')',
            '-webkit-transform': 'scale(' + __scale + ')',
            '-ms-transform': 'scale(' + __scale + ')',
            '-o-transform': 'scale(' + __scale + ')',
            'transform-origin': '0 0'
        });

        $('#iframe_content_pairbook').contents().find('body').css({
            'width': _get_width * __scale,
            'height': _get_height * __scale,
            'margin': viewTypeMargin
        });

        // 가로폭, 세로폭 마진이 변해야 함(drawing wrap에 필요함)
        var _elemnet = $('#iframe_content_pairbook');
        var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/,
            matches = $(_elemnet).css('transform').match(matrixRegex);
        // _get_left = _get_left * matches[1];
        var _get_left = widthFitMargin * matches[1];
        var __left = null;

        if (user_viewType.hasClass('widthFit')) {
            __left = _get_left + $('#iframe_content_pairbook').offset().left;
        } else if (user_viewType.hasClass('heightFit')) {
            __left = $('#iframe_content_pairbook').offset().left;
        }

        $('.drawing-canvas').css({
            'width': _get_width * __scale,
            'height': _get_height * __scale,
        });

        $('.konvajs-content').css({
            'width': '100%',
            'height': '100%',
        });

        // TODO : TESTDATA에서는 새로 그리면 기존 그림이 날이감. 연동 시에는 디비에서 데이터 가져와서 불러서 그려줘야 함.
        if (iframe_canvas) {
            var _container = $("#viewer-content .drawing-canvas").get(0);
            iframe_canvas.deactivate();
            iframe_canvas = new DrawingCanvas({
                container: _container,
            });
        };

        drawing_canvas = iframe_canvas;
    },
    allToolMenuClose: function () {
        var toolbar = $('ul#viewer-tool li .active').length;
        if (toolbar > 0) {
            $('ul#viewer-tool li .active').removeClass('active');
            $('#drawing').removeClass('active');
            $('#list-all').removeClass('active');
        }
    },
    viewTypeIconChange: function () {
        var user_viewType = $('.popup.tools .content_viewType');

        if (user_viewType.hasClass('heightFit')) {
            user_viewType.addClass('widthFit');
            user_viewType.removeClass('heightFit');
            user_viewType.attr('title', '가로 맞춤');
            user_viewType.attr('alt', '가로 맞춤');
        } else if (user_viewType.hasClass('widthFit')) {
            user_viewType.addClass('heightFit');
            user_viewType.removeClass('widthFit');
            user_viewType.attr('title', '세로 맞춤');
            user_viewType.attr('alt', '세로 맞춤');
        }
    }
}