var previewer_loading_overlay_setup = {
    //background: "rgba(255,255,255,0.8)",
    background: "white",
    image: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'><circle r='80' cx='500' cy='90'/><circle r='80' cx='500' cy='910'/><circle r='80' cx='90' cy='500'/><circle r='80' cx='910' cy='500'/><circle r='80' cx='212' cy='212'/><circle r='80' cx='788' cy='212'/><circle r='80' cx='212' cy='788'/><circle r='80' cx='788' cy='788'/></svg>",
    imageAnimation: "2000ms rotate_right",
    imageAutoResize: true,
    imageResizeFactor: 0.4,
    imageColor: "#00cbb4",
    fade: [10, 200]
};

var IS_USING_PDF_MODULE = false;

var preview_viewer = {

    file_id: undefined,
    file_info: undefined,
    index: -1,
    total: 0,
    file_type: undefined,
    user: undefined,

    source: undefined,
    textbookSeq: undefined,
    contentsTextbookPeriodSeq: undefined,

    update_window_history: false,
    update_document_title: false,
    use_thumbnail: false,
    //drawing_canvas: undefined,

    load_preview: function (params, _cb) {
        console.log("start v.preview.js ");
        Module.video_viewer.clearPlaylist();
        this.index = -1;
        this.total = 0;
        this.file_id = 'file' in params ? params.file : undefined;

        this.source = 'source' in params ? params.source : undefined;
        this.textbookSeq = 'textbookseq' in params ? params.textbookseq : undefined;
        this.contentsTextbookPeriodSeq = 'contentstextbookperiodseq' in params ? params.contentstextbookperiodseq : undefined;
        this.contentsTextbookPeriodScrapYn = 'contentstextbookperiodscrapyn' in params ? params.contentstextbookperiodscrapyn : undefined;
        this.with_header = 'header' in params ? params.header : true;

        var type = 'type' in params ? params.type : undefined;
        var url = 'url' in params ? params.url : undefined;
        var div = 'div' in params ? params.div : undefined;
        var title = 'title' in params ? params.title : undefined;

        if ('link' == type) {
            if ($("#module-modal").hasClass('show')) {
                console.log("show module-modal");
                $("#module-modal").modal('hide');
            }

            setTimeout(function () {
                Module.external_link_viewer.window_open(url);
            }, 200);
            return;
        }

        if (this.with_header) {
            $("#module-modal").addClass("with-header");
        }

        this.user = 'user' in params ? params.user : undefined;
        var self = this;

        //$("#module-body").LoadingOverlay("show", previewer_loading_overlay_setup);
        console.log("load_preview >> "+type + " // "+div);
        // if ('video' == type && ('youtube' == div || 'external' == div)) {
        if ( 'video' === type ) {
            this.file_type = type;

            if ($("#module-modal").hasClass('show')) {
                $("#module-modal").modal('hide');
            }
            $.LoadingOverlay("hide");

            // !! title
            // if (title) {
            //     $('#module-title').html(title);
            //     $('#wrap .wrap-inner #hd .title').html(title);
            // } else {
            //     $('#module-title').html('');
            //     $('#wrap .wrap-inner #hd .title').html('');
            // };

            $("#module-modal").modal('show');

            console.log("setTimeout 전에 >> "+type + " // "+ self.file_type);
            setTimeout(function () {
                Module.video_viewer.drow_video('module-body', self.file_type);

                setTimeout(function () {
                    drawing_canvas = Module.video_viewer.drawing();
                    // if ('youtube' == div) {
                    //     Module.video_viewer.playlist(url, 'video/youtube', '');
                    //
                    //     YOUTUBEVIDEOPLAYERCHECK = true;
                    // } else {
                    //     // Module.video_viewer.playlist(url, 'video/mp4', '');
                    //     var uu = "https://api-cms.mirae-n.com/view_content?service=mteacher&params="+ url;
                    //     Module.video_viewer.playlist(uu, 'application/x-mpegURL', '');
                    // }

                    let video = document.getElementById('video');
                    // let mvideo01 = document.getElementById('mvideo01');
                    // console.log("----------------------");
                    // // console.log(video);
                    // console.log(url);
                    // console.log("----------------------");
                    // console.log(mvideo01);

                    var uu = "/Ebook/ViewVideo.mrn?type=hls";
                    var uu2 = "/Ebook/ViewVideo.mrn?type=hls&src=https://api-cms.mirae-n.com/view_content?service=mteacher&params="
                                + 'Y9jBACH59hXaPzFWXycD9chLNdq5a20qp0OqWteOk2B0BzIPWXyvU7gXZqdA3h7pUqJQ%2B6yQTnuSNRLL9mNo7xWbux7RRD2KIK46c70A4C2EMvRM4xeHkb7PCxAJoPGvJPv6Jn1VnNlNJegGa3CxQAn4iCjI0ZBStZsSpSAlkEc%3D';

                    var playlistUrl = '/Ebook/ViewVideo.mrn';

                    // if(Hls.isSupported()) {
                    //     let hls = new Hls();
                    //     Module.video_viewer.playlist(uu2, 'application/x-mpegURL')
                    //     console.log('application/x-mpegURL')
                    //     hls.loadSource(uu2);
                    //     hls.attachMedia(video);
                    //     hls.on(Hls.Events.MANIFEST_PARSED,function() {
                    //         video.play();
                    //     });
                    //     $("#file-info .badge").text("동영상");
                    // }
                    // else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    //     Module.video_viewer.playlist(uu, 'application/vnd.apple.mpegurl')
                    //     console.log('application/vnd.apple.mpegurl')
                    //     video.src = uu;
                    //     video.addEventListener('loadedmetadata',function() {
                    //         video.play();
                    //     });
                    //     $("#file-info .badge").text("동영상");
                    // }

                    if ('youtube' == div) {
                        Module.video_viewer.playlist(url, 'video/youtube', '');

                        YOUTUBEVIDEOPLAYERCHECK = true;
                    } else {
                        // Module.video_viewer.playlist(url, 'video/mp4', '');
                        var uu = "/Ebook/ViewVideo.mrn?type=hls&src="+ url;
                        Module.video_viewer.playlist(uu, 'application/x-mpegURL', '');
                    }

                    console.log("----------------------");
                    console.log(video);
                    self.total = 1;
                    self.select_index(0);
                    $("#module-body").LoadingOverlay("hide", true);

                    $("#download").hide();

                    _cb && _cb();
                }, 500);
            }, 200);
        } else {
            console.log(this.file_id);
            tms.get_file_info(this.file_id)
                .then(function (data) {
                    console.log(data);
                    $.LoadingOverlay("hide");

                    // !! title
                    if (title) {
                        $('#module-title').html(title);
                        $('#wrap .wrap-inner #hd .title').html(title)
                    } else {
                        $('#module-title').html('');
                        $('#wrap .wrap-inner #hd .title').html('')
                    }

                    //
                    if (data && data.type && (data.type == 'zip' || data.type == 'ZIP')) {
                        $("#module-body").LoadingOverlay("hide", true);

                        if ('Y' != data.download_yn) {
                            throw "다운로드 할 수 없는 파일 입니다.";
                        }

                        if (!data.download_url) {
                            throw "잘못된 데이터이거나 아직 처리 중인 데이터입니다.\n잠시 후에 다시 시도해주세요.";
                        }

                        // try {
                        //     if (viewer.is_mirroring_window()) {
                        //         if (_cb) {
                        //             _cb("close");
                        //         } else {
                        //             $("#module-modal").modal('hide');
                        //         }
                        //         return;
                        //     }
                        // } catch (error) {
                        // }

                        vex.dialog.confirm({
                            message: "압축파일입니다. 다운로드 버튼을 누르면 다운로드합니다.",
                            buttons: [
                                $.extend({}, vex.dialog.buttons.YES, { text: '다운로드' }),
                                $.extend({}, vex.dialog.buttons.NO, { text: '취소' })
                            ],
                            callback: function (value) {
                                if (value) {
                                    download_file(data.download_url, data.title);
                                }
                                if (_cb) {
                                    _cb("close");
                                } else {
                                    $("#module-modal").modal('hide');
                                }
                            }
                        });

                        // show_alert("압축파일입니다. 확인 버튼을 누르면 다운로드합니다.", function() {
                        //     download_file(data.download_url, data.title);
                        //     if(_cb) {
                        //         _cb("close");
                        //     } else {
                        //         $("#module-modal").modal('hide');
                        //     }
                        // });

                        return;
                    } else {
                        throw_tms_get_file_info(data, _cb);
                    }

                    setTimeout(function () {
                        self.set_info(data, function () {
                            self.select_index(0);

                            // modalDiv가 custom일 때 좌우이동 버튼 노출, 다운로드 버튼 숨기기
                            if (viewer._playlist_data.info.modalDiv != "CUSTOM") {
                                // [엠티처/474] 요청사항으로 좌우 이동버튼 노출되도록 수정
                                // $(".icon-prev-content").hide();
                                // $(".icon-next-content").hide();
                            } else {
                                if ($("#module-modal .close").css('display') == 'none') {
                                    $('#module-modal #download').hide();
                                }
                            }

                            _cb && _cb();
                        });
                    }, 200);

                    _v_preview_scale_flag = false;
                })
                .catch(function (err) {
                    $("#module-body").LoadingOverlay("hide", true);
                    $.LoadingOverlay("hide");
                    $("#module-modal").modal('hide');

                    try {
                        if (viewer.is_mirroring_window()) {
                            _cb && _cb();
                            return;
                        }
                    } catch (error) {
                    }

                    if (self.update_window_history) {
                        window.history.replaceState({}, null, UPDATE_WINDOW_URL);
                    }
                    var err_msg = get_error_message(err);
                    show_alert(err_msg);

                });
        }
    },

    set_info: function (data, _cb) {
        console.log(data)
        var self = this;
        this.file_info = data;
        this.file_type = data.type;
        console.log("set_info :: " );
        console.log(data);


        // try {
        //     if (viewer.is_mirroring_window()) {
        //         $("#download").hide();
        //     } else {
        //         $("#download").show();
        //     }
        //
        // } catch (error) {
        // }

        $("#course-info").html(this.file_info.course_title);
        $("#file-info").html(this.file_info.title);

        $("#course-info").attr('title', this.file_info.course_title);
        $("#file-info").attr('title', this.file_info.title);

        if (this.update_document_title) {
            top.document.title = this.file_info.title;
        }

        console.log("show data");
        console.log(data);

        this.total = data.pages.length;

        // if (!$("#module-modal").hasClass('show')) {
        //     console.log("show module-modal");
        //     $("#module-modal").modal('show');
        // }

        // if (self.file_type === 'video' || self.file_type === 'audio') {
        //
        //     Module.video_viewer.drow_video('module-body', self.file_type);
        //     var mime_type = 'video/mp4';
        //     if (self.file_type == 'audio') {
        //         mime_type = 'audio/mpeg';
        //         //mime_type = 'audio/mp3';
        //     }
        // } else {
        //     var imgList = [];
        //     for (var index = 0; index < data.pages.length; index++) {
        //         var page = data.pages[index];
        //         // var page_num = index + 1;
        //         imgList.push(page.file);
        //     }
        //     //Module.image_viewer.drow_image('module-body', imgList);
        // }

        let imgList = [];
        for (let index = 0; index < data.pages.length; index++) {
            let page = data.pages[index];

            console.log("page // " +index);
            console.log(page);

            imgList.push(page.file);
        }

        console.log(self);

        let mime_type = 'video/mp4';
        if (self.file_type === 'audio') {
            mime_type = 'audio/mp3';
        }

        if (self.file_type === 'video' || self.file_type === 'audio' || self.file_type === 'youtube') {
            Module.video_viewer.drow_video('module-body', self.file_type);
        }

        setTimeout(function () {

            console.log("playlist 실행 : " + self.file_type +"//");
            if (self.file_type === 'audio') { // self.source === 'CMS' &&
                console.log("playlist 실행")
                console.log(data.pages[0].file)
                console.log(mime_type)
                Module.video_viewer.playlist(data.pages[0].file, mime_type);
                $("#file-info .badge").text("음원");
            } else if (self.file_type === 'video') {
                // $("#module-modal .modal-header").css("display", "none");

                let video = document.getElementById('video');

                if(Hls.isSupported()) { // HLS를 지원하지 않는다면 hls.js 사용
                    let hls = new Hls();
                    Module.video_viewer.playlist(data.pages[0].file, 'application/x-mpegURL')
                    console.log('application/x-mpegURL')
                    hls.loadSource(data.pages[0].file);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED,function() {
                        video.play();
                    });
                    $("#file-info .badge").text("동영상");
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) { // HLS를 지원하는지 체크
                    Module.video_viewer.playlist(data.pages[0].file, 'application/vnd.apple.mpegurl')
                    console.log('application/vnd.apple.mpegurl')
                    video.src = data.pages[0].file;
                    video.addEventListener('loadedmetadata',function() {
                        video.play();
                    });
                    $("#file-info .badge").text("동영상");
                }
            } else {
                // $("#module-modal .modal-header").css("display", "flex");
                // var pdf_url = './../../pdf/web/c.pdf';
                console.log('####' + data.pdf_url);
                // if (data.pdf_url) {
                //     IS_USING_PDF_MODULE = true;
                // } else {
                //     IS_USING_PDF_MODULE = false;
                // }
                console.log("pdf start ~~~");
                console.log("data.upload_method : "+ data.upload_method +"//" +data.pdf_url);
                console.log(data.pdf_url);
                console.log(data.download_url);
                console.log(data.type);
                console.log(data.upload_method);

                if (data.pdf_url && (data.type === 'document' || data.type === 'pdf' || data.type === 'hwp')) {
                    IS_USING_PDF_MODULE = true;
                    $("#file-info .badge").text("문서");
                } else {
                    IS_USING_PDF_MODULE = false;
                }

                console.log("IS_USING_PDF_MODULE : ", IS_USING_PDF_MODULE)
                if (IS_USING_PDF_MODULE) {
                    if( data.upload_method == "CMS"){
                        Module.pdf_viewer.drow_pdf('module-body', data.pdf_url, 1, imgList);
                    } else {
                        Module.pdf_viewer.drow_pdf('module-body', get_url(data.pdf_url), 1, imgList);
                    }
                    // var pdf_url = data.pdf_url;
                    // Module.pdf_viewer.drow_pdf('module-body', get_url(pdf_url), 1, imgList);
                    drawing_canvas = Module.pdf_viewer.drawing();
                } else {
                    Module.image_viewer.drow_image('module-body', imgList);
                    // Module.common.zoom('content-scale', 3, '#dddddd');
                    $('#carousel-control').on('slid.bs.carousel', function (e) { });
                    // $("#module-modal").modal('show');
                    drawing_canvas = Module.image_viewer.drawing();
                }
            }

            _cb && _cb();
            $("#module-modal").modal('show');
            $("#module-body").LoadingOverlay("hide", previewer_loading_overlay_setup);
        }, 500);
    },

    select_index: function (index) {
        var self = this;
        $("#module-body").LoadingOverlay("show", previewer_loading_overlay_setup);

        setTimeout(function () {
            self.select_index_func(index);

            setTimeout(function () {
                $("#module-body").LoadingOverlay("hide", true);
            }, 100);

        }, 100);
    },
    select_index_func: function (index) {
        // console.error("select_index_func", index);
        if (typeof (index) == 'string') {
            index = parseInt(index);
        }

        if (index > 0) {
            $(".carousel-control-prev").removeClass("hidden");
        } else {
            $(".carousel-control-prev").addClass("hidden");
        }
        if (index + 1 >= this.total) {
            $(".carousel-control-next").addClass("hidden");
        } else {
            $(".carousel-control-next").removeClass("hidden");
        }

        var current_index = index + 1;
        if (viewer._device_type == 'mobile' && $("#module-modal").hasClass('show')) {
            $("#current_page").html(current_index);
            $("#current_page").attr("title", "현재 " + current_index + "페이지");
            $("#total_page").html(this.total);
            $("#total_page").attr("title", "총" + this.total + "페이지");

            $("#quick .page .current").html(current_index);
            $("#quick .page .current").attr("title", "현재 " + current_index + "페이지");
            $("#quick .page .total").html(this.total);
            $("#quick .page .total").attr("title", "총" + this.total + "페이지");
        } else {
            $("#module-page").html(current_index + " / " + this.total);
        }

        if (IS_USING_PDF_MODULE && this.file_type != 'video' && this.file_type != 'audio') {
            try {
                $('#pdf-iframe')[0].contentWindow.pdfPage(current_page);
            } catch (error) {
            }

        }

        var self = this;
        this.index = index;

        Module.common.destroy();
        Module.common.fit($("#content-scale"));
        if (this.file_type == 'video' || this.file_type == 'audio') {
            Module.common.zoom('content-scale', 3, 'white');
        } else {
            if (!IS_USING_PDF_MODULE) {
                Module.common.zoom('content-scale', 3, '#dddddd');
            }
        }

        setTimeout(function () {
            var smartData = $("#content-scale").data('smartZoomData');
            if (!smartData) return;
            var scale = smartData.adjustedPosInfos.scale;
            if (typeof (scale) == 'string') {
                scale = parseFloat(scale);
            }
            scale = scale * 100;
            $("#zoom-level").html(scale.toFixed(0) + "%");
            // $("#zoom-level").html("X "+scale.toFixed(1));
        }, 500);

    },

    select_prev: function () {
        if (this.index == 0) {
            return;
        }
        this.select_index(this.index - 1);
    },
    select_next: function () {
        if (this.index + 1 >= this.total) {
            return;
        }
        this.select_index(this.index + 1);
    },

    // 
    select_stroke_color: function (target) {
        $('#palette').children('.palette').children('i').removeClass('active');
        $('#palette button[data-color="' + target + '"] i').addClass('active');
        drawing_canvas.stroke = target;
    },

    select_stroke_width: function (target) {
        $('.stroke_width_wrap').children('.drawing_stroke_width').children('i').removeClass('active');
        $('.stroke_width_wrap button[data-strokewidth="' + target + '"] i').addClass('active');
        drawing_canvas.strokeWidth = target;
    },

    // 그리기 모드, 지우개 모드 변경
    drawing_mode_change: function (mode) {
        if (drawing_canvas.drawingLayer.attrs.visible == false) {
            $('.icon-drawing6').addClass('active');
        } else if (drawing_canvas.drawingLayer.attrs.visible == true || drawing_canvas.drawingLayer.attrs.visible == undefined) {
            $('.icon-drawing6').removeClass('active');
        };

        if (drawing_canvas.drawingLayer.attrs.visible != undefined)
            drawing_canvas.transformer_destroy();
        if (mode == 'brush') {
            drawing_canvas.activateBrush();
            drawing_canvas.transformer_destroy();
        } else if (mode == 'eraser') {
            drawing_canvas.activateEraser();
        }
    },

    delete_drawing: function (target_layer) {
        if (target_layer == 'drawing') {
            drawing_canvas.clear();
        } else if (target_layer == 'text') {
            drawing_canvas.text_clear();
        } else if (target_layer == 'image') {
            drawing_canvas.image_clear();
        }
    },

    hide_drawing: function (targer_layer) {
        drawing_canvas.hide(targer_layer);
    },

    show_drawing: function (targer_layer) {
        drawing_canvas.show(targer_layer);
    },

    mode_change: function (target) {
        drawing_canvas.transformer_destroy();
        drawing_canvas.setMode(target);
    },

    text_write: function () {
        drawing_canvas.textwrite();
        drawing_canvas.last_textNode_dblclick();
    },

    text_fontFamily_change: function (fontFamily) {
        drawing_canvas.text_fontFamily_change(fontFamily);
    },

    text_font_size_change: function (size) {
        drawing_canvas.text_fontSize_change(size);
    },

    text_font_size_lg: function (fontSizeChange) {
        $('#font_size').val(fontSizeChange).attr("selected", "selected");
        drawing_canvas.text_font_size_lg(fontSizeChange);
    },

    text_font_size_sm: function (fontSizeChange) {
        $('#font_size').val(fontSizeChange).attr("selected", "selected");
        drawing_canvas.text_font_size_sm(fontSizeChange);
    },

    text_font_fill: function (color) {
        $('.font_color_wrap').children('.font_palette').children('i').removeClass('active');
        $('.font_color_wrap button[data-fontcolor="' + color + '"] i').addClass('active');
        // 하단 색상 변경하기
        $('.fc_change').css('background-color', color);
        if (color == '#ffffff') {
            $('.fc_change').css('border', '1px solid #666');
        } else {
            $('.fc_change').css('border', 'none');
        };
        drawing_canvas.text_font_fill(color);
    },

    select_arrow_color: function (color) {
        $('.arrow_color_wrap').children('.arrow_palette').children('i').removeClass('active');
        $('.arrow_color_wrap button[data-arrowcolor="' + color + '"] i').addClass('active');
        // 아이콘 색상 변경하기
        $('.icon-arrow-color').css('background-color', color);
        if (color == '#ffffff') {
            $('.icon-arrow-color').css('border', '2px solid #d5d5d5');
        } else {
            $('.icon-arrow-color').css('border', 'none');
        };
        drawing_canvas.setMode('arrow');
        drawing_canvas.arrow_color_change(color);
    },

    select_arrow_width: function (width) {
        drawing_canvas.setMode('arrow');
        drawing_canvas.arrow_width_change(width);
    },

    select_arrow_dash: function (dash) {
        drawing_canvas.setMode('arrow');
        drawing_canvas.arrow_dash_change(dash);
    },

    select_arrow_direction: function (direction) {
        drawing_canvas.setMode('arrow');
        drawing_canvas.arrow_direction_change(direction);
    },

    select_line_color: function (color) {
        $('.line_color_wrap').children('.line_palette').children('i').removeClass('active');
        $('.line_color_wrap button[data-linecolor="' + color + '"] i').addClass('active');
        // 아이콘 색상 변경하기
        $('.icon-line-color').css('background-color', color);

        if (color == '#ffffff') {
            $('.icon-line-color').css('border', '2px solid #d5d5d5');
        } else {
            $('.icon-line-color').css('border', 'none');
        };
        drawing_canvas.setMode('straight');
        drawing_canvas.line_color_change(color);
    },

    select_line_width: function (width) {
        drawing_canvas.setMode('straight');
        drawing_canvas.line_width_change(width);
    },

    select_line_dash: function (dash) {
        drawing_canvas.setMode('straight');
        drawing_canvas.line_dash_change(dash);
    },

    // 형광펜 그리기 모드, 형광펜 지우개 모드 변경
    drawing_hlighter_mode_change: function (mode) {
        drawing_canvas.transformer_destroy();
        drawing_canvas.setMode(mode);;
    },

    select_hlighter_color: function (target) {
        $('#image_select').children('.hlighter_wrap').children('.select_hlighter_color_wrap').children('button').children('i').removeClass('active');
        $('#image_select button[data-hlightercolor="' + target + '"] i').addClass('active');
        drawing_canvas.select_change_hlighter_color(target);
    },

    select_hlighter_width: function (width) {
        drawing_canvas.select_change_hlighter_width(width);
    },

    stop_drawHlighter: function () {
        drawing_canvas.setMode('image');
        drawing_canvas.stop_drawHlighter();
    },

    make_sticker: function (url) {
        drawing_canvas.setMode('image');
        drawing_canvas.stop_drawHlighter();
        drawing_canvas.make_sticker(url);
    },
};


// event
// scale change event 처리해야 함.

// 맨 처음 들어올 때 기준이 되는 값 거르기 용도
var _v_preview_scale_flag = false;
// 맨처음에 들어온 스케일값. 얘가 100%로 기준이 됨
var _V_PREVIEW_SCALE = null;
// 얘는 넘겨줄 값. 이 값에서 가감해서 스케일에 사용
var _v_previewreturn_scale = 1;
// 가감해 줄 값
var calc_number = 0;
// 음수면 들어온 값을 계산해서 양수가 되도록 더하고, 아니면 뺀다.
var _v_previewe_operator = null;

function _v_preview_reset() {
    _v_preview_scale_flag = false;
    _V_PREVIEW_SCALE = null;
    _v_previewreturn_scale = 1;
    calc_number = 0;
    _v_previewe_operator = null;
};

function scaleDefinded(e) {
    var _e_scale = e.scale;

    // 맨 처음에 들어온 스케일 값이랑 e.scale값이랑 같으면 1 보내줘야함 (100%로 보여줘야되니까)
    if (!_v_preview_scale_flag || _e_scale == _V_PREVIEW_SCALE) {
        // console.log(_e_scale)
        _V_PREVIEW_SCALE = _e_scale;
        _v_previewreturn_scale = 1;
        _v_preview_scale_flag = true;

        // 원본보다 큰지 작은지 구분. 원본보다 작으면 격차만큼 더해줘야 하고, 원본보다 크면 격차만큼 빼줘야 함
        if (_e_scale < 1) {
            // console.log('원본보다 작음')
            calc_number = 1 - parseFloat(_e_scale.toFixed(5));

            _v_previewe_operator = 'plus'
            // console.log(calc_number + '만큼 ' + _v_previewe_operator + ' 해줘야 함')
        } else if (_e_scale > 1) {
            // console.log('원본보다 큼')
            calc_number = parseFloat(_e_scale.toFixed(5)) - 1;
            _v_previewe_operator = 'minus'
            // console.log(calc_number + '만큼 ' + _v_previewe_operator + ' 해줘야 함')
        }

        return 1;
    }

    // 지금 들어온 값 - 기준값 
    var return_scale = _e_scale - parseFloat(_v_previewreturn_scale.toFixed(5));

    _v_previewreturn_scale = _v_previewreturn_scale + return_scale;

    if (_v_previewe_operator == 'plus') {
        _v_previewreturn_scale = parseFloat(_v_previewreturn_scale.toFixed(5)) + parseFloat(calc_number.toFixed(5));
        // console.log(_v_previewreturn_scale + ' =' + _v_previewreturn_scale + '+' + calc_number)
    } else if (_v_previewe_operator == 'minus') {
        _v_previewreturn_scale = parseFloat(_v_previewreturn_scale.toFixed(5)) - parseFloat(calc_number.toFixed(5));
        // console.log(_v_previewreturn_scale + ' =' + _v_previewreturn_scale + '-' + calc_number)
    }

    // console.log('return scale : ', _v_previewreturn_scale);
    return _v_previewreturn_scale;
};

function pdfScaleChangeEvent(e) {
    $(window).on('resize', function () {
        _v_preview_reset();
    })
    var scale = scaleDefinded(e);

    if (typeof (scale) == 'string') {
        scale = parseFloat(scale);
    }

    console.log('scale : ', scale);

    scale = scale * 100;
    $("#zoom-level").html(scale.toFixed(0) + "%");
    pdfUpdateViewAreaEvent(e)
};

// function pdfScaleChangeEvent(e) {
//     // console.log(e);
//     //e.scale
//     var scale = e.scale;
//     if (typeof (scale) == 'string') {
//         scale = parseFloat(scale);
//     }
//     scale = scale * 100;
//     $("#zoom-level").html(scale.toFixed(0) + "%");
//     // $("#zoom-level").html("X "+scale.toFixed(1));
// }

// 페이지 렌더링 이벤트
function pdfPageRenderedEvent(e) {
    // console.log(e);
}

function pdfPageChangeEvent(e) {
    // console.error("pdfPageChangeEvent", e);
    var page = e.pageNumber;
    if (e.previousPageNumber == page) {
        return;
    }
    var numPages = $('#pdf-iframe')[0].contentWindow.PDFViewerApplication.pagesCount;

    var index = page - 1;
    preview_viewer.total = numPages;
    preview_viewer.index = index;
    Module.pdf_viewer.update_index(page);
}

function pdfUpdateViewAreaEvent(e) {
    var location = e.location;
    var scale = location.scale;
    var width = undefined;
    var height = undefined;

    var viewer = $("#pdf-iframe").get(0).contentWindow.pdfGetViewer();

    var pdfview = viewer.getPageView(viewer.currentPageNumber - 1);
    scale = pdfview.scale;
    width = pdfview.width;
    height = pdfview.height;

    var left = location.left;
    var top = location.top;

    var canvas_left = - left * scale;
    var canvas_top = top * scale - height;

    $("#drawing-control").css({
        left: canvas_left,
        top: canvas_top,
        width: width,
        height: height
    });

    var pageW = pdfview.width;
    var pageH = pdfview.height;
    // console.log(pageW, pageH);
    var pdfScale = pdfview.viewport.scale;

    //initiate as false
    var isMobile = false;
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    };

    if (isMobile == false) {

        drawing_canvas = Module.pdf_viewer.drawing();
        drawing_canvas.scale = pdfScale;
        drawing_canvas.stage.width(pageW);
        drawing_canvas.stage.height(pageH);
        drawing_canvas.stage.scale({ x: pdfScale, y: pdfScale });
        drawing_canvas.stage.draw();
    } else {

        var _scale = 1;
        var _scaleX = pageW / drawing_canvas.stage.width();
        var _scaleY = pageH / drawing_canvas.stage.height();

        if (_scaleX > _scaleY) {
            _scale = _scaleX;
        } else {
            _scale = _scaleY;
        };

        drawing_canvas = Module.pdf_viewer.drawing();
        drawing_canvas.stage.width(pageW);
        drawing_canvas.stage.height(pageH);

        if (_scaleX > _scaleY) {
            drawing_canvas.scale = _scale;
            drawing_canvas.stage.scale({ x: pdfScale * _scaleY, y: pdfScale * _scaleY });
        } else {
            drawing_canvas.scale = _scale;
            drawing_canvas.stage.scale({ x: pdfScale, y: pdfScale });
        };

        drawing_canvas.stage.draw();
    }

    // console.log(location);

    try {
        if (MIRRORING_WINDOW && !MIRRORING_WINDOW.closed && MIRRORING_WINDOW.viewer.is_mirroring_started) {


            var org_content_body = $("#content-body");
            var org_viewerContainer = $("#pdf-iframe").contents().find('#viewerContainer');

            var content_body = MIRRORING_WINDOW.viewer.get_element('#content-body');
            var target_viewer = MIRRORING_WINDOW.viewer.get_element("#pdf-iframe").get(0).contentWindow.pdfGetViewer();
            var viewerContainer = MIRRORING_WINDOW.viewer.get_element("#pdf-iframe").contents().find('#viewerContainer');

            var ratio_x = content_body.width() / org_content_body.width();
            var ratio_y = content_body.height() / org_content_body.height();
            var ratio = Math.min(ratio_x, ratio_y);

            // var gap_x = (content_body.width() - org_content_body.width()*ratio)/2;
            // var gap_y = (content_body.height() - org_content_body.height()*ratio)/2;

            target_viewer.currentScaleValue = scale * ratio;
            viewerContainer.scrollTop(org_viewerContainer.scrollTop());
            viewerContainer.scrollLeft(org_viewerContainer.scrollLeft());

            drawing_canvas.stage.scale({ x: pdfScale, y: pdfScale });
            drawing_canvas.stage.draw();

        } else if (IS_MIRRORING_WINDOW && parent.opener) {
            var org_content_body = $("#content-body");
            var org_viewerContainer = $("#pdf-iframe").contents().find('#viewerContainer');

            var content_body = $("#content-body", parent.opener.document);

            var ratio_x = org_content_body.width() / content_body.width();
            var ratio_y = org_content_body.height() / content_body.height();
            var ratio = Math.min(ratio_x, ratio_y);

            drawing_canvas.stage.scale({ x: pdfScale * ratio, y: pdfScale * ratio });
            drawing_canvas.stage.draw();
        }
    } catch (error) {
        console.log(error);
    }
}

function pdfLink(title, link) {
    //alert(link);
    window.open(link, "_blank");
}
