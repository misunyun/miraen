let previewer_loading_overlay_setup = {
    //background: "rgba(255,255,255,0.8)",
    background: "white",
    image: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'><circle r='80' cx='500' cy='90'/><circle r='80' cx='500' cy='910'/><circle r='80' cx='90' cy='500'/><circle r='80' cx='910' cy='500'/><circle r='80' cx='212' cy='212'/><circle r='80' cx='788' cy='212'/><circle r='80' cx='212' cy='788'/><circle r='80' cx='788' cy='788'/></svg>",
    imageAnimation: "2000ms rotate_right",
    imageAutoResize: true,
    imageResizeFactor: 0.4,
    imageColor: "#00cbb4",
    fade: [10, 200]
};

let queryString = document.location.search.substring(1);
let queryParams = parseQueryString(queryString);

let UPDATE_WINDOW_HISTORY = false;
let UPDATE_WINDOW_URL = '/';// window.location.pathname;
let UPDATE_DOCUMENT_TITLE = true;

// let TEST_LOCALHOST = false;
// if(window.location.hostname === 'localhost'){
//     TEST_LOCALHOST = true;
// }

let IS_USING_PDF_MODULE = false;
let IS_USING_DIRECT_PDF_MODULE = false;
let IS_USING_MAKEX_MODULE = false;

let YOUTUBEVIDEOPLAYERCHECK = false;
let YOUTUBEPLAYERTRIGGERPLAY = 'send';
let YOUTUBEPLAYERTRIGGERPAUSE = 'send';
let YOUTUBEPLAYERTRIGGERSEEKED = 'send';
let YOUTUBEPLAYERTRIGGERSTOP = false;

let viewer = {
    file_id: undefined,
    file_info: undefined,
    index: -1,
    total: 0,
    file_type: undefined,
    user: undefined,
    source: undefined,
    playlist: undefined,
    scrap_yn: undefined,
    playname: undefined,
    displayname: undefined,

    update_window_history: UPDATE_WINDOW_HISTORY,
    update_document_title: UPDATE_DOCUMENT_TITLE,

    check_parameters: function (){
        let self = this;

        this.source   = 'source'   in queryParams ? queryParams.source               : undefined;
        this.playlist = 'playlist' in queryParams ? queryParams.playlist             : undefined;
        this.file_id  = 'file'     in queryParams ? queryParams.file                 : undefined;
        this.scrap_yn = 'scrap_yn' in queryParams ? queryParams.scrap_yn             : undefined;
        this.playname = 'playname' in queryParams ? escapeHtml(queryParams.playname) : undefined;
        this.content_seq = 'contentseq' in queryParams? queryParams.contentseq       : undefined;
        this.displayname = 'displayname'in queryParams ? escapeHtml(queryParams.displayname) : undefined;

        return new Promise(function (resolve, reject) {
            if ((!self.source || !self.file_id) && !self.playlist && !self.content_seq) {
                $.LoadingOverlay("hide");

                reject(vex.dialog.confirm({
                    message : "파라미터가 잘못되었습니다.",
                    buttons : [
                        $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                    ],
                    callback: function (){
                        window.close();
                    }
                }))
                return;
            }

            resolve();
        });
    },

    call_file_info : function () {
        let self = this;
        if(self.source ==="CMS" && self.content_seq !== undefined){
            return mteacherViewer.get_cms_file_info(self.content_seq); //BO 호출
        }else{
            return mteacherViewer.get_file_info(self.file_id);
        }
    },


    ready: function (_cb) {
        console.log("viewer.ready.preview");

        // 목록 창 닫기
        if($('body').data('indexClose') === 'Y'){
            $('#viewer-wrap').addClass('aside-close');
        }

        let self = this;

        $.LoadingOverlay("show");

        this.check_parameters()
            .then(function (){
                if(self.update_window_history){
                    window.history.replaceState({}, null, UPDATE_WINDOW_URL);
                }

                if(self.source){
                    self.call_file_info()
                    .then(function (data){
                        //다운로드 버튼 활성화 제어
                        if(data.download_use_yn === 'Y'){
                            $("#download").removeClass("display-hide");
                        }else{
                            $('#download').addClass('display-hide');
                        }

                        // 파일 정보 가져오기 실패시
                        return new Promise(function (resolve, reject){
                            if(data.status == false){
                                $.LoadingOverlay("hide");

                                vex.dialog.confirm({
                                    message : "유효하지 않은 자료입니다. 고객센터에 문의해 주세요.",
                                    buttons : [
                                        $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                                    ],
                                    callback: function (value){
                                        if(_cb){
                                            _cb("close");
                                        }else{
                                            window.close();
                                        }
                                    }
                                });

                                return;
                            }

                            if(data){
                                let userId =  $('body').data('userid') || 'TEST';

                                if(!userId){
                                    $.LoadingOverlay("hide");
                                    reject(new Error("로그인되지 않은 사용자에게 허가되지 않은 콘텐츠입니다. 로그인 후 이용해주세요."));
                                    return;
                                }
                            }

                            resolve(data);
                        })
                    })
                    .then(function (data){
                        $.LoadingOverlay("hide");

                        if(!data.view_url && (!data.pages || data.pages.length === 0)){
                            vex.dialog.confirm({
                                message : "미리보기가 제공되지 않는 파일입니다. 다운로드 버튼을 누르면 다운로드합니다.",
                                buttons : [
                                    $.extend({}, vex.dialog.buttons.YES, {text: '다운로드'}),
                                    $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                                ],
                                callback: function (value){
                                    if(value && (data.upload_method === 'DIRECT')){
                                        mteacherViewer.get_file_down_direct(self.file_id);
                                    }else if(value && (data.upload_method === 'CMS' || data.upload_method === 'LINK' || data.upload_method === 'NEWWIN')){
                                        let link = document.createElement('a');

                                        link.href = data.down_url;
                                        link.target = '_blank'
                                        link.click();
                                        link.remove();
                                    }
                                    window.close();
                                }
                            });
                        }else if(data.type === 'link' && data.pages!==undefined && !data.pages[0].link_url){
                            vex.dialog.confirm({
                                message : "미리보기가 지원되지 않는 링크입니다.",
                                buttons : [
                                    $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                                ],
                                callback: function (value){
                                    if(_cb){
                                        _cb("close");
                                    }else{
                                        window.close();
                                    }
                                }
                            })
                        }else{
                            return data;
                        }
                    })
                    .then(function (data){
                        if(data){
                            if(self.update_document_title){
                                top.document.title = data.title || "미리보기";
                            }

                            setTimeout(function (){
                                self.set_info(data, function (){
                                    self.select_index(0);

                                        _cb && _cb();
                                    });

                                }, 200);

                                $.LoadingOverlay("hide");

                        }else{
                            throw "파일 정보가 없습니다. 확인 후 이용해주세요.";
                        }
                    })
                }else if(self.playlist){
                    mteacherViewer.get_play_list_info(self.playlist)
                        .then(function (data){
                            // 플레이리스트 정보 가져오기 실패시
                            return new Promise(function (resolve, reject){
                                if(data.status === false){
                                    $.LoadingOverlay("hide");
                                    vex.dialog.confirm({
                                        message : "플레이리스트 정보가 없습니다. 확인 후 이용해주세요.",
                                        buttons : [
                                            $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                                        ],
                                        callback: function (){
                                            if(_cb){
                                                _cb("close");
                                            }else{
                                                window.close();
                                            }
                                        }
                                    });
                                    return;
                                }

                                if(data){
                                    let userId =  $('body').data('userid') || 'TEST';

                                    if(!userId){
                                        $.LoadingOverlay("hide");
                                        reject(new Error("로그인되지 않은 사용자에게 허가되지 않은 콘텐츠입니다. 로그인 후 이용해주세요."));
                                        return;
                                    }
                                }
                                resolve(data);
                            })
                        })
                        .then(function (data){
                            if(data){
                                if(self.update_document_title){
                                    top.document.title = data.title || "미리보기";
                                }

                                // $("#course-info").html(data.course_title);
                                $("#file-info").html(data.title || "미리보기");
                                // $("#course-info").attr('title', data.course_title);
                                $("#file-info").attr('title', data.title  || "미리보기");

                                setTimeout(function (){
                                    self.playlist_set_info(data, function (){
                                        self.playlist_select_index(0);

                                        _cb && _cb();
                                    });

                                }, 200);

                                $.LoadingOverlay("hide");

                            }else{
                                throw "플레이리스트 정보가 없습니다. 확인 후 이용해주세요.";
                            }
                        })
                }
            })
    },

    set_info: function (data, _cb) {
        console.log(data)
        let self = this;
        this.file_info = data;
        this.file_type = data.type;

        // $("#course-info").html(this.file_info.course_title);
        $("#file-info").append(this.file_info.title || "미리보기");

        // $("#course-info").attr('title', this.file_info.course_title);
        $("#file-info").attr('title', this.file_info.title || "미리보기");

        if(this.update_document_title){
            top.document.title = this.file_info.title || "미리보기";
        }

        $("#page_list").empty();

        console.log(data);

        this.total = data.pages?.length ?? 1;

        let imgList = [];

        for (let index = 0; index < data.pages?.length; index++) {
            let page = data.pages[index];
            let page_num = index + 1;

             let page_span = $('<li class="span4"></li>');
             $("#page_list").append(page_span);

             let page_a = $('<a class="thumbnail"></a>');
             page_span.append(page_a);

             let page_img = $('<img>');
             page_a.append(page_img);

             let page_cap = $('<p></p>');
             page_a.append(page_cap);

             page_span.attr('index', index);
             page_a.data(page);
             page_cap.html("" + page_num);

             let thumbnail = page.thumbnail;

             if(data.type === 'video' || data.type === 'youtube' || data.type === "link"){
                 if(!thumbnail){
                    thumbnail = '/js/pc/ele/viewer/img/viewer/video-default-thumbnail.png';
                 }
             }

             if(data.type === 'audio'){
                 if(!thumbnail){
                    thumbnail = '/js/pc/ele/viewer/img/viewer-skin/audio-default-thumbnail.svg';
                }
            }

            if (data.type === 'makex') {
                if (!thumbnail) {
                    thumbnail = '/assets/image/common/img-no-img.svg';
                }
            }

            page_img.attr('src', thumbnail);

             imgList.push(page.image);
        }

        if(data.type === 'makex' && imgList.length < 1){
            let page_span = $('<li class="span4"></li>');
            $("#page_list").append(page_span);
            let page_a = $('<a class="thumbnail"></a>');
            page_span.append(page_a);
            let page_img = $('<img>');
            page_a.append(page_img);
            let page_cap = $('<p></p>');
            page_a.append(page_cap);
            page_span.attr('index', 0);
            let thumbnail = '/assets/images/common/img-no-img.svg';
            page_img.attr('src', thumbnail);
        }

        console.log(self);

        let mime_type = 'video/mp4';
        if(self.file_type === 'audio'){
            mime_type = 'audio/mp3';
        }

        if(self.file_type === 'video' || self.file_type === 'audio' || self.file_type === 'youtube'){
            Module.video_viewer.drow_video('module-body', self.file_type);
        }

        setTimeout(function (){
            if(self.source === 'CMS' && self.file_type === 'audio'){
                Module.video_viewer.playlist(data.pages[0].file, mime_type);

                $("#file-info .badge").text("음원");
            }else if(self.source === 'CMS' && self.file_type === 'video'){
                // 동영상-쇼츠인 경우 세로형으로 표시
                let videoVerticalClaas = queryParams['vertical'] || '';

                if(videoVerticalClaas != ''){
                    $("#module-body #content-body").addClass("video-vertical");
                }

                let video = document.getElementById('video');

                if(Hls.isSupported()){
                    let hls = new Hls();
                    Module.video_viewer.playlist(data.pages[0].file, 'application/x-mpegURL')

                    hls.loadSource(data.pages[0].file);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED,function(){
                        video.play();
                    });

                    $("#file-info .badge").text("동영상");
                }
                else if(video.canPlayType('application/vnd.apple.mpegurl')){
                    Module.video_viewer.playlist(data.pages[0].file, 'application/vnd.apple.mpegurl');

                    video.src = data.pages[0].file;
                    video.addEventListener('loadedmetadata',function(){
                        video.play();
                    });

                    $("#file-info .badge").text("동영상");
                }
            }else if(self.source === 'LINK' || self.source === 'YOUTUBE'){
                $('#download').addClass('display-hide');

                if(data.type === 'youtube'){
                    Module.video_viewer.playlist(data.pages[0].link_url, 'video/youtube');
                    $("#file-info .badge").text("유튜브");
                }else if(data.type === 'link'){
                    Module.pdf_viewer.drow_pdf('module-body', data.pages[0].link_url, "link", imgList);
                    $("#file-info .badge").text("링크");
                }
            }else if(self.source === 'CMS'){
                if(data.view_url && (data.type === 'document' || data.extension === 'pdf' || data.extension === 'hwp')){
                    IS_USING_PDF_MODULE = true;
                    $("#file-info .badge").text("문서");
                } else if(self.file_type === 'makex'){
                    IS_USING_MAKEX_MODULE = true;
                    $('#download').addClass('display-hide');
                } else {
                    IS_USING_MAKEX_MODULE = false;
                }

                console.log("IS_USING_PDF_MODULE : ", IS_USING_PDF_MODULE)
                if (IS_USING_PDF_MODULE) {
                    console.log(data.view_url);
                    Module.pdf_viewer.drow_pdf('module-body', data.view_url, 1, imgList);
                }  else if(IS_USING_MAKEX_MODULE) {
                    //저작도구
                    Module.makex_viewer.drow_makex('module-body', data);
                } else if (!IS_USING_PDF_MODULE && (self.file_type !== 'video' || self.file_type !== 'audio')) {
                    console.log(imgList);
                    if(self.file_type === 'link'){
                        // window.open(data.view_url,"_blank");
                        // this.close();
                        // Module.pdf_viewer.drow_pdf('module-body',data.view_url, 'link');
                        // IS_USING_PDF_MODULE = true;

                        let body = $('#module-body');
                        body.empty();
                        $viewer_area = $('<div id="viewer-area"></div>');
                        body.append($viewer_area);
                        data.display_name = viewer.displayname;
                        viewerNewOpenURL('viewer-area', data);
                    }else{
                        Module.image_viewer.drow_image('module-body', imgList);
                    }

                    if (self.file_type === 'video') {
                        $("#file-info .badge").text("동영상");
                    } else if (self.file_type === 'audio') {
                        $("#file-info .badge").text("음원");
                    } else {
                        $("#file-info .badge").text("링크");
                    }
                }
            } else if (self.source === 'DIRECT') {
                if (data.view_url && data.extension === 'pdf') {
                    IS_USING_PDF_MODULE = true;
                    IS_USING_DIRECT_PDF_MODULE = true;
                    $("#file-info .badge").text("문서");
                } else {
                    IS_USING_PDF_MODULE = false;
                    IS_USING_DIRECT_PDF_MODULE = false;
                }

                console.log("IS_USING_PDF_MODULE : ", IS_USING_PDF_MODULE)
                if (IS_USING_PDF_MODULE) {
                    console.log(data.view_url);
                    Module.pdf_viewer.drow_direct_pdf('module-body', data.view_url);
                }  else if(!IS_USING_PDF_MODULE && self.file_type === 'makex') {
                    //저작도구
                    Module.makex_viewer.drow_makex('module-body', data);
                } else if (!IS_USING_PDF_MODULE && (self.file_type !== 'video' || self.file_type !== 'audio')) {
                    console.log(imgList);
                    Module.image_viewer.drow_image('module-body', imgList);

                    if(self.file_type === 'video'){
                        $("#file-info .badge").text("동영상");
                    }else if(self.file_type === 'audio'){
                        $("#file-info .badge").text("음원");
                    }
                }
            }

            _cb && _cb();
            $("#module-modal").modal('show');
            $("#module-body").LoadingOverlay("hide", previewer_loading_overlay_setup);
        }, 500);
    },

    select_index: function (index){
        if(this.index !== -1){
            this.select_index_func(index);

            setTimeout(function (){
                $.LoadingOverlay("hide");
            }, 100);
            return;
        }

        let self = this;
        $("#module-body").LoadingOverlay("show", previewer_loading_overlay_setup);

        setTimeout(function (){
            self.select_index_func(index);
        }, 100);
    },

    select_index_func: function (index){
        if(typeof (index) === 'string'){
            index = parseInt(index);
        }

        $("#page_list .span4.active").removeClass('active');
        $("#page_list .span4[index=" + index + "]").addClass('active');

        if(index > 0){
            $(".icon-prev-content").removeClass("display-hide");
        }else{
            $(".icon-prev-content").addClass("display-hide");
        }

        if(index + 1 >= this.total){
            $(".icon-next-content").addClass("display-hide");
        }else{
            $(".icon-next-content").removeClass("display-hide");
        }

        let current_page = index + 1;
        $("#current_page").html(current_page);
        $("#total_page").html(this.total);

        if(IS_USING_PDF_MODULE && this.file_type !== 'video' && this.file_type !== 'audio'){
            try {
                $('#pdf-iframe')[0].contentWindow.pdfPage(current_page);
            } catch (error){
            }

        }else{
            $("#module-modal .carousel-item.active").removeClass("active");
            $("#module-modal .carousel-item:nth-child(" + current_page + ")").addClass('active');
        }

        if(this.index !== -1){
            this.index = index;
            return;
        }

        Module.common.destroy();
        Module.common.fit($("#content-scale"));

        if (this.file_type === 'video' || this.file_type === 'audio' || this.file_type === 'makex') {
            Module.common.zoom('content-scale', 3, 'white');
        }else{
            if(!IS_USING_PDF_MODULE){
                Module.common.zoom('content-scale', 3, '#dddddd');
            }
        }
        this.index = index;
        setTimeout(function (){
            let smartData = $("#content-scale").data('smartZoomData');
            if(!smartData) return;

            let scale = smartData.adjustedPosInfos.scale;
            if(typeof (scale) === 'string'){
                scale = parseFloat(scale);
            }
            scale = scale * 100;

            $("#zoom-level").html(scale.toFixed(0) + "%");
            // $("#zoom-level").html("X "+scale.toFixed(1));
        }, 500);

        $("#module-body").LoadingOverlay("hide", previewer_loading_overlay_setup);

        setTimeout(function () {
            if (IS_USING_DIRECT_PDF_MODULE) {
                drawing_canvas = Module.pdf_viewer.drawing();
                drawing_canvas.fitStage();
            }else if(IS_USING_MAKEX_MODULE) {
                drawing_canvas = Module.makex_viewer.drawing();
                drawing_canvas.fitStage();
            }
        }, 500);

    },

    playlist_set_info: function (data, _cb){
        this.info = data;

        // $("#course-info").html(this.info.course_title);
        $("#file-info").html(this.playname || "미리보기");

        // $("#course-info").attr('title', this.info.course_title);
        $("#file-info").attr('title', this.playname || "미리보기");

        if(this.update_document_title){
            top.document.title = this.playname || "미리보기";
        }

        $("#page_list").empty();

        this.total = data.pages.length;
        // console.log("=================>", this.total, data.pages);

        let imgList = [];

        for (let index = 0; index < data.pages.length; index++){
            let page = data.pages[index];
            let page_num = index + 1;

            let page_span = $('<li class="span4"></li>');
            $("#page_list").append(page_span);

            let page_a = $('<a class="thumbnail"></a>');
            page_span.append(page_a);

            let page_img = $('<img>');
            page_a.append(page_img);

            let page_cap = $('<p></p>');
            page_a.append(page_cap);

            page_span.attr('index', index);
            page_a.data(page);
            page_cap.html("" + page_num);

            let thumbnail = page.thumbnail;
            page_img.attr('src', thumbnail);

            imgList.push(page.file);
        }

        if(!$("#module-modal").hasClass('show')){
            $("#module-modal").modal('show');
        }

        setTimeout(function (){
            _cb && _cb();
        }, 500);

    },

    get_page: function (index){
        return this.info.pages[index];
    },

    playlist_select_index: function (index){
        $("#module-body").LoadingOverlay("show", previewer_loading_overlay_setup);
        this.playlist_select_index_func(index);
    },

    playlist_select_index_func: function (index){
        let self = this;

        if(typeof (index) === 'string'){
            index = parseInt(index);
        }

        $("#page_list .span4.active").removeClass('active');
        $("#page_list .span4[index=" + index + "]").addClass('active');

        if(index > 0){
            $(".icon-prev-content").removeClass("display-hide");
        }else{
            $(".icon-prev-content").addClass("display-hide");
        }

        if(index + 1 >= this.total){
            $(".icon-next-content").addClass("display-hide");
        }else{
            $(".icon-next-content").removeClass("display-hide");
        }

        let current_page = index + 1;
        $("#current_page").html(current_page);
        $("#total_page").html(this.total);

        this.page = this.get_page(index);
        this.index = index;

        IS_USING_PDF_MODULE = false;
        this.file_type = this.page.type;

        if(this.page.type === 'document' || this.page.type === 'link'){
            IS_USING_PDF_MODULE = true;

            if(this.page.type === 'document'){
                Module.pdf_viewer.drow_pdf('module-body', this.page.file, this.page.page);
            }else if(this.page.type === 'link'){
                Module.pdf_viewer.drow_pdf('module-body', this.page.file, 'link');
            }

            try {
                $('#pdf-iframe')[0].contentWindow.pdfPage(this.page.page);
            } catch (error){
            }
        }else{
            if(this.page.type === 'video' || this.page.type === 'audio' || this.page.type === 'youtube'){
                Module.video_viewer.drow_video('module-body', this.page.type);
                Module.video_viewer.clearPlaylist();
            }else{
                let imgList = [];
                imgList.push(this.page.file);

                Module.image_viewer.drow_image('module-body', imgList);
                $('#carousel-control').on('slid.bs.carousel', function (e){ });
            }
        }

        setTimeout(function (){
            if(self.page.type === 'video' || self.page.type === 'audio' || self.page.type === 'youtube'){
                drawing_canvas = Module.video_viewer.drawing();
            }else{
                if(IS_USING_PDF_MODULE){
                    drawing_canvas = Module.pdf_viewer.drawing();
                }else{
                    drawing_canvas = Module.image_viewer.drawing();
                }
            }

            first_drawing_check = false;

            setTimeout(function (){
                Module.common.destroy();
                Module.common.fit($("#content-scale"));

                if(self.page.type === 'video' || self.page.type === 'audio' || self.page.type === 'youtube'){
                    if(self.page.type === 'video'){
                        let video = document.getElementById('video');

                        if(Hls.isSupported()){
                            let hls = new Hls();

                            Module.video_viewer.playlist(self.page.file, 'application/x-mpegURL');

                            hls.loadSource(self.page.file);
                            hls.attachMedia(video);
                            hls.on(Hls.Events.MANIFEST_PARSED, function (){
                                video.play();
                            });
                        }else if(video.canPlayType('application/vnd.apple.mpegurl')){
                            Module.video_viewer.playlist(self.page.file, 'application/vnd.apple.mpegurl');

                            video.src = self.page.file;
                            video.addEventListener('loadedmetadata', function (){
                                video.play();
                            });
                        }
                    }else if(self.page.type === 'youtube'){
                        Module.video_viewer.playlist(self.page.file, 'video/youtube')
                    }else if(self.page.type === 'audio'){
                        Module.video_viewer.playlist(self.page.file, 'audio/mp3');
                    }

                    Module.common.zoom('content-scale', 3, 'white');
                }else{
                    if(!IS_USING_PDF_MODULE){
                        Module.common.zoom('content-scale', 3, '#dddddd');
                    }
                }

                setTimeout(function (){
                    $("#module-body").LoadingOverlay("hide", previewer_loading_overlay_setup);

                    let smartData = $("#content-scale").data('smartZoomData');
                    if(!smartData) return;

                    let scale = smartData.adjustedPosInfos.scale;
                    if(typeof (scale) === 'string'){
                        scale = parseFloat(scale);
                    }
                    scale = scale * 100;

                    $("#zoom-level").html(scale.toFixed(0) + "%");
                }, 500);


            }, 300);

        }, 100);
    },


    select_prev: function (){
        if(this.index === 0){
            return;
        }
        if(viewer.playlist){
            this.playlist_select_index(this.index - 1)
        }else{
            this.select_index(this.index - 1);
        }
    },

    select_next: function (){
        if(this.index + 1 >= this.total){
            return;
        }

        if(viewer.playlist){
            this.playlist_select_index(this.index + 1)
        }else{
            this.select_index(this.index + 1);
        }
    },

    select_stroke_color: function (target){
        $('#palette').children('.palette').removeClass('active');
        $('#palette button[data-color="' + target + '"]').addClass('active');

        drawing_canvas.drawLineStroke_change(target);
    },

    select_stroke_width: function (target){
        $('.stroke_width_wrap').children('.drawing_stroke_width').children('i').removeClass('active');
        $('.stroke_width_wrap button[data-strokewidth="' + target + '"] i').addClass('active');

        drawing_canvas.strokeWidth = target;
    },

    // 그리기 모드, 지우개 모드 변경
    drawing_mode_change: function (mode){
        if(drawing_canvas.drawingLayer.attrs.visible === false){
            $('.icon-drawing6').addClass('active');
        }else if(drawing_canvas.drawingLayer.attrs.visible === true || drawing_canvas.drawingLayer.attrs.visible === undefined){
            $('.icon-drawing6').removeClass('active');
        };

        if(drawing_canvas.drawingLayer.attrs.visible != undefined)
            drawing_canvas.transformer_destroy();
        if(mode === 'brush'){
            drawing_canvas.activateBrush();
            drawing_canvas.transformer_destroy();
        }else if(mode === 'eraser'){
            drawing_canvas.activateEraser();
        }
    },

    delete_drawing: function (target_layer){
        if(target_layer === 'drawing'){
            drawing_canvas.clear();
        }else if(target_layer === 'text'){
            drawing_canvas.text_clear();
        }else if(target_layer === 'image'){
            drawing_canvas.image_clear();
        }
    },

    hide_drawing: function (targer_layer){
        drawing_canvas.hide(targer_layer);
    },

    show_drawing: function (targer_layer){
        drawing_canvas.show(targer_layer);
    },

    mode_change: function (target){
        drawing_canvas.transformer_destroy();
        drawing_canvas.setMode(target);
    },

    text_write: function (){
        drawing_canvas.textwrite();
        drawing_canvas.last_textNode_dblclick();
    },

    text_fontFamily_change: function (fontFamily){
        drawing_canvas.text_fontFamily_change(fontFamily);
    },

    text_font_size_change: function (size){
        drawing_canvas.text_fontSize_change(size);
    },

    text_font_size_lg: function (fontSizeChange){
        $('#font_size').val(fontSizeChange).attr("selected", "selected");
        drawing_canvas.text_font_size_lg(fontSizeChange);
    },

    text_font_size_sm: function (fontSizeChange){
        $('#font_size').val(fontSizeChange).attr("selected", "selected");
        drawing_canvas.text_font_size_sm(fontSizeChange);
    },

    text_font_fill: function (color){
        $('.font_color_wrap').children('.font_palette').children('i').removeClass('active');
        $('.font_color_wrap button[data-fontcolor="' + color + '"] i').addClass('active');

        // 하단 색상 변경하기
        $('.fc_change').css('background-color', color);

        if(color === '#ffffff'){
            $('.fc_change').css('border', '1px solid #666');
        }else{
            $('.fc_change').css('border', 'none');
        };

        drawing_canvas.text_font_fill(color);
    },

    select_arrow_color: function (color){
        $('.arrow_color_wrap').children('.arrow_palette').removeClass('active');
        $('.arrow_color_wrap button[data-arrowcolor="' + color + '"]').addClass('active');

        // 아이콘 색상 변경하기
        $('.icon-arrow-color i').css('background-color', color);

        if(color === '#ffffff'){
            $('.icon-arrow-color').css('border', '1px solid #000');
        }else{
            $('.icon-arrow-color').css('border', 'none');
        };

        drawing_canvas.arrow_color_change(color);
    },

    select_arrow_width: function (width){
        drawing_canvas.arrow_width_change(width);
    },

    select_arrow_dash: function (dash){
        drawing_canvas.arrow_dash_change(dash);
    },

    select_arrow_direction: function (direction){
        drawing_canvas.arrow_direction_change(direction);
    },

    select_line_color: function (color){
        $('.line_color_wrap').children('.line_palette').removeClass('active');
        $('.line_color_wrap button[data-linecolor="' + color + '"]').addClass('active');

        // 아이콘 색상 변경하기
        $('.icon-line-color i').css('background-color', color);

        if(color === '#ffffff'){
            $('.icon-line-color i').css('border', '1px solid #000');
        }else{
            $('.icon-line-color i').css('border', 'none');
        };

        drawing_canvas.line_color_change(color);
    },

    select_line_width: function (width){
        drawing_canvas.line_width_change(width);
    },

    select_line_dash: function (dash){
        drawing_canvas.line_dash_change(dash);
    },

    // 형광펜 그리기 모드, 형광펜 지우개 모드 변경
    drawing_hlighter_mode_change: function (mode){
        drawing_canvas.transformer_destroy();
        drawing_canvas.setMode(mode);;
    },

    select_hlighter_color: function (target){
        $('#image_select').children('.hlighter_wrap').children('.select_hlighter_color_wrap').children('button').removeClass('active');
        $('#image_select button[data-hlightercolor="' + target + '"]').addClass('active');
        $('.icon-hlighter-color i').css('background-color', target);

        if(target === '#ffffff'){
            $('.icon-hlighter-color i').css('border', '1px solid #000');
        }else{
            $('.icon-hlighter-color i').css('border', 'none');
        };

        drawing_canvas.select_change_hlighter_color(target);
    },

    select_hlighter_width: function (width){
        drawing_canvas.select_change_hlighter_width(width);
    },

    stop_drawHlighter: function (){
        drawing_canvas.setMode('image');
        drawing_canvas.stop_drawHlighter();
    },

    make_sticker: function (url){
        drawing_canvas.setMode('image');
        drawing_canvas.stop_drawHlighter();
        drawing_canvas.make_sticker(url);
    },
};

// event
// scale change event 처리해야 함.
function pdfScaleChangeEvent(e){
    let scale = e.scale;
    if(typeof (scale) === 'string'){
        scale = parseFloat(scale);
    }
    scale = scale * 100;
    $("#zoom-level").html(scale.toFixed(0) + "%");
    // $("#zoom-level").html("X "+scale.toFixed(1));
}
// 페이지 렌더링 이벤트
function pdfPageRenderedEvent(e){

}

function pdfPageChangeEvent(e){
    let page = e.pageNumber;

    if(e.previousPageNumber === page){
        return;
    }
    // let numPages = $('#pdf-iframe')[0].contentWindow.PDFViewerApplication.pagesCount;

    let index = page - 1;
    // viewer.total = numPages;

    // $("#page_list .span4.active").removeClass('active');
    // $("#page_list .span4[index=" + index + "]").addClass('active');

    if(index > 0){
        $(".icon-prev-content").removeClass("display-hide");
    }else{
        $(".icon-prev-content").addClass("display-hide");
    }
    if(index + 1 >= viewer.total){
        $(".icon-next-content").addClass("display-hide");
    }else{
        $(".icon-next-content").removeClass("display-hide");
    }

    // let current_page = index + 1;
    // $("#current_page").html(current_page);
    // $("#total_page").html(viewer.total);

    // Module.common.fit($("#content-scale"));
    // viewer.index = index;
}

function pdfUpdateViewAreaEvent(e){
    let location = e.location;
    let scale = location.scale;
    let width = undefined;
    let height = undefined;

    let viewer = $("#pdf-iframe").get(0).contentWindow.pdfGetViewer();

    let pdfview = viewer.getPageView(viewer.currentPageNumber - 1);
    scale = pdfview.scale;
    width = pdfview.width;
    height = pdfview.height;
    let left = location.left;
    let top = location.top;

    // 가운데 정렬을 위해 추가
    if(DEVICE_TYPE === 'mobile'){
        let _target = $('#pdf-iframe').contents().find('#viewerContainer #viewer .page');

        _target.css('top', 'calc(50% - (' + height + 'px / 2))');

        // 확대 시 top이 음수가 되면 상단 부분 잘려보이기 때문에, 음수라면 top을 0으로 재변경
        if(pdfview.div.offsetTop < 0){
            _target.css('padding-top', (pdfview.div.offsetTop) * -1);
        }else{
            _target.css('padding-top', '0px');
        }
    }

    let canvas_left = - left * scale;
    let canvas_top = top * scale - height;

    $("#drawing-control").css({
        left: canvas_left, top: canvas_top,
        width: width, height: height
    });

    let pageW = pdfview.width;
    let pageH = pdfview.height;
    let pdfScale = pdfview.viewport.scale;

    drawing_canvas.scale = pdfScale;
    drawing_canvas.stage.width(pageW);
    drawing_canvas.stage.height(pageH);
    drawing_canvas.stage.scale({ x: pdfScale, y: pdfScale });

    drawing_canvas.stage.draw();
}

function pdfLink(title, link){
    window.open(link, "_blank");
}

//escape => html으로 치환
function escapeHtml(str){
    if (str == null) {
   		return '';
   	}

   	return str
   		.replace(/&/g, '&amp;')
   		.replace(/</g, '&lt;')
   		.replace(/>/g, '&gt;')
   		.replace(/""/g, '&quot;')
   		.replace(/'/g, "&#039;")
   		.replace(/'/g, "&#39;");
}


function iframeSrcChangeEvent() {
    let qNote = document.getElementById('make_document_iframe');
    let qNoteFrame = qNote.contentWindow || qNote.contentDocument;

    console.log('qNoteFrame : ' , qNoteFrame);
    // console.log('qNoteFrame.qnoteViewer : ' , qNoteFrame.qnoteViewer);

    if(qNoteFrame.qnoteViewer){
        let data = $(qNote).data();
        let url = data.url;
        let seq = data.seq;

        const Http = new XMLHttpRequest();
        Http.open('GET', url);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let responseUrl = Http.responseURL;
                let param = makeQNoteParam(seq, responseUrl);
                console.log('onMessage param'+JSON.stringify(param));
                qNoteFrame.qnoteViewer?.onMessage(JSON.stringify(param));

                if(data.active === 'Y') {
                    // showAnswerButton();
                }
            }
        };
    }
}

const makeQNoteParam = (seq, url) => {
    return {
        "action": "@sendURL",
        "data": {
            "contentList": [
                {
                    "contentId": seq,
                    "url" : url,
                }
            ],
            "contentTotal": 1
        }
    }
}

/**
 * 새창 열기 공통
 * @param area
 * @param obj
 */
/*const viewerNewOpenURL = (area, obj) => {
    const viewerAreaData = $("#viewer-area");
    viewerAreaData.removeData("data");
    let loadUrl;
    let isFile = (obj.upload_method === 'CMS' && obj.type === 'file');
    if(obj?.mobile_yn === 'Y'){
        loadUrl = isFile ? '/renewal-mo/html/viewer/viewerFile.html' : '/renewal-mo/html/viewer/viewerLink.html';
    } else {
        loadUrl = isFile ? '/renewal/html/viewer/viewerFile.html' : '/renewal/html/viewer/viewerLink.html';
    }
    console.log('obj   >>>>>>>>>>>>>>>>>>>>>>>>  ',obj)
    viewerAreaData.load(loadUrl, (response, status) => {
        if (status === 'success') {
            viewerAreaData.data("obj", obj);
        }
    });

}*/
