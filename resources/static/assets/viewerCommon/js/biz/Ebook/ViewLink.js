let screen;

$(function () {

    screen = {

        /**
         * 내부 전역변수
         *
         * @memberOf screen
         */
        v: {},

        /**
         * 통신 객체- call
         *
         * @memberOf screen
         */
        c: {

            // 링크 가져오기
            getData: function () {

                let type = $('body').data('source');
                let url = '';
                let contSeq = $('body').data('contseq');
                let titleHead = '';
                let user = $('body').data('userid');

                if (type == 'MY') {
                    url = '/Ebook/GetEbookMyLinkInfo.ax';
                    // url = '/viewer/tmscontent/getEbookMyLinkInfo';
                    titleHead = '[선생님 공유자료]';
                } else if (type == 'EXTRA_MAIN_LINK') {
                    url = '/Ebook/GetEbookExtraMainHtmlLinkInfo.ax';
                    titleHead = '[링크 자료]';
                } else if (type == 'EXTRA_CREATE') {
                    url = '/Ebook/GetEbookExtraCreateLinkInfo.ax';
                    titleHead = '[창의적 체험활동]';
                }

                // param validation
                if ($text.isEmpty(url) || $text.isEmpty(contSeq)) {
                    // $msg.alert('param error');
                    alert('param error');
                    return;
                }

                const options = {
                    url: url,
                    data: {
                        contSeq: contSeq
                        , loginUserSeq: user
                    },
                    success: function (res) {
                        __w(res.resultData);
                        // console.log(res.resultData);

                        let linkUrl = res.resultData.url;
                        if (type == 'EXTRA_CREATE') {
                            linkUrl = linkUrl + '&user=' + $('body').data('userid');
                        }

                        // 타이틀, url data 변경
                        $('.content .txtTitle').text(titleHead + ' ' + res.resultData.title);
                        // $('.content .btn-go').data('url', linkUrl);
                        $('.content .button').data('url', linkUrl);

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
        f: {},

        /**
         * Event 정의 객체.
         *
         * @memberOf screen
         */
        event: function () {

            // 링크 클릭
            // $(document).on('click', '.btn-go', function(e){
            $(document).on('click', '.button', function (e) {
                let linkUrl = $(e.target).data('url');

                if ($text.isEmpty(linkUrl)) {
                    $msg.alert('no url');
                    return;
                }

                let w = 800;
                let h = 1000;

                __w(linkUrl);

                // 창의적 체험활동
                if ($('body').data('source') == 'EXTRA_CREATE') {
                    // 세창
                    // 미리보기
                    screenUI.f.winOpen(linkUrl, w, h, null, 'popPreviewPage');
                    return;
                }
                // 내자료, 메인 html 링크
                else {

                    if (linkUrl.indexOf('/Ebook/preview.mrn') > -1) {
                        // 미리보기
                        screenUI.f.winOpen(linkUrl, w, h, null, 'popPreviewPage');
                        return;
                    } else {
                        // 새탭
                        top.window.open(linkUrl);
                        return;
                    }

                }

            })

        },

        /**
         * Init 최초 실행.
         *
         * @memberOf screen
         */
        init: function () {

            screen.event();

            // 로그인 체크
            /*if ($text.isEmpty($('body').data('userid'))) {
                screenUI.f.loginConfirm();
                return;
            }*/

            console.log("viewLink");

            // 링크 조회
            screen.c.getData();
        }
    };

    screen.init();
});
