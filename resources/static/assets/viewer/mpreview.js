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

var queryString = document.location.search.substring(1);
var queryParams = parseQueryString(queryString);

var UPDATE_WINDOW_HISTORY = false;
var UPDATE_WINDOW_URL = '/';// window.location.pathname;
var UPDATE_DOCUMENT_TITLE = true;
var TEST_LOCALHOST = false;
if (window.location.hostname == 'localhost') {
    TEST_LOCALHOST = true;
}

var IS_USING_PDF_MODULE = false;

var viewer = {
    file_id: undefined,
    file_info: undefined,
    index: -1,
    total: 0,
    file_type: undefined,
    user: undefined,

    source: undefined,
    textbookSeq: undefined,
    contentsTextbookPeriodSeq: undefined,

    update_window_history: UPDATE_WINDOW_HISTORY,
    update_document_title: UPDATE_DOCUMENT_TITLE,

    check_parameters: function () {
        var self = this;

        this.file_id = 'file' in queryParams ? queryParams.file : undefined;
        this.source = 'source' in queryParams ? queryParams.source : undefined;
        this.textbookSeq = 'textbookseq' in queryParams ? queryParams.textbookseq : undefined;
        this.contentsTextbookPeriodSeq = 'contentstextbookperiodseq' in queryParams ? queryParams.contentstextbookperiodseq : undefined;
        this.contentsTextbookPeriodScrapYn = 'contentstextbookperiodscrapyn' in queryParams ? queryParams.contentstextbookperiodscrapyn : undefined;

        /*this.user = 'user' in queryParams ? queryParams.user : undefined;
        if (this.user) {
            tms._user = this.user;
        }*/

        this.user = $('body').data('userIdx');
        if (this.user) {
            tms._user = this.user;
        }

        return new Promise(function (resolve, reject) {
            if (!self.source || !self.file_id) {
                reject(new Error("파라미터가 잘못되었습니다.")); // reject(new Error("잘못된 접근입니다."));
                return;
            }
            if (self.source == 'PERIOD') {
                if (!self.contentsTextbookPeriodSeq) {
                    reject(new Error("파라미터가 잘못되었습니다.")); // reject(new Error("잘못된 접근입니다."));
                    return;
                }
            }
            resolve();
        });
    },

    ready: function (_cb) {
        console.log("viewer.ready");

        var self = this;

        $("#module-body").LoadingOverlay("show", previewer_loading_overlay_setup);

        this.check_parameters()
            .then(function () {
                return tms.get_user_info(true);
            })
            .then(function () {
                if (self.update_window_history) {
                    window.history.replaceState({}, null, UPDATE_WINDOW_URL);
                }
                return tms.get_file_info_seq(viewer.contentsTextbookPeriodSeq);
            })
            .then(function (data) {
            	/*data = {
            		    "code": "success",
            		    "message": null,
            		    "id": "1cd4e2561d134d09a3fc817af37de602",
            		    "type": "video",
            		    "course_title": "도덕3 > 1.나와 너 우리 함께",
            		    "title": "[동영상] 배로 늘어나는 문방구",
            		    "download_yn": "N",
            		    "download_url": "/cms/files/download/1cd4e2561d134d09a3fc817af37de602",
            		    "pdf_url": null,
            		    "url": "",
            		    "poster_thumbnail": null,
            		    "pages": [
            		        {
            		        	"file": queryParams.file,
            		            //"file": "https://media.mirae-n.com/wenmedia/Repository/OUTPUT/8c19d6c0-cce7-4591-a4e9-f06a6d70dfcc/2022/07/07/e77543fa-19a3-4e33-958f-ca6ed8d50c6a/25f89637-8732-45fd-8df1-587b00c0d7be.mp4",
            		            "thumbnail": "http://devele.m-teacher.co.kr/viewer/img/viewer/video-default-thumbnail.png"
            		        }
            		    ]
            		};*/
                console.log(data);
                $.LoadingOverlay("hide");

                if (tms._user) {
                    $("#download").removeClass("hidden");
                }

                if (data && data.type && (data.type == 'zip' || data.type == 'ZIP')) {
                    $("#module-body").LoadingOverlay("hide", true);
                    if (!tms._user) {
                        throw "로그인되지 않은 사용자에게 허가되지 않은 콘텐츠입니다. 로그인 후 이용해주세요.";
                    }
                    if (self.update_document_title) {
                        top.document.title = data.title;
                    }
                    $("#course-info").html(data.course_title);
                    $("#file-info").html(data.title);
                    $("#course-info").attr('title', data.course_title);
                    $("#file-info").attr('title', data.title);

                    if ('Y' != data.download_yn) {
                        throw "다운로드 할 수 없는 파일 입니다.";
                    }

                    if (!data.download_url) {
                        throw "잘못된 데이터이거나 아직 처리 중인 데이터입니다.\n잠시 후에 다시 시도해주세요.";
                    }

                    // show_alert("압축파일입니다. 확인 버튼을 누르면 다운로드합니다.", function() {
                    //     download_file(data.download_url, data.title);
                    //     if(_cb) {
                    //         _cb("close");
                    //     } else {
                    //         window.close();
                    //     }
                    // });

                    vex.dialog.confirm({
                        message: "압축파일입니다. 다운로드 버튼을 누르면 다운로드합니다.",
                        buttons: [
                            $.extend({}, vex.dialog.buttons.YES, { text: '다운로드' }),
                            // $.extend({}, vex.dialog.buttons.NO, { text: '스크랩',
                            //     click: function(e) {
                            //         this.value = "scrap";
                            //     }
                            // }),
                            $.extend({}, vex.dialog.buttons.NO, { text: '닫기' })
                        ],
                        callback: function (value) {
                            console.log(value);
                            if (value) {
                                download_file(data.download_url, data.title);
                            }

                            setTimeout(function () {
                                if (_cb) {
                                    _cb("close");
                                } else {
                                    window.close();
                                }
                            }, 500);
                        }
                    });

                    return;
                } else {
                    throw_tms_get_file_info(data);
                }

                // if(!data.pages || data.pages.length <= 0) {
                //     throw "잘못된 데이터이거나 아직 처리 중인 데이터입니다.\n잠시 후에 다시 시도해주세요.";
                // }

                setTimeout(function () {
                    self.set_info(data, function () {
                        self.select_index(0);

                        if (self.source == 'PERIOD' && tms._user) {
                            // check scrap
                            if (self.contentsTextbookPeriodScrapYn == "Y") {
                                $("#scrap").addClass("scrapped");
                            } else {
                                tms.confirm_period_contents_scrap(self.contentsTextbookPeriodSeq)
                                    .then(function (res) {
                                        if (res && res.resultCode == "success" && res.resultData == "Y") {
                                            $("#scrap").addClass("scrapped");
                                        } else {
                                            $("#scrap").removeClass("scrapped");
                                        }
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });
                            }

                        }
                        _cb && _cb();
                    });

                }, 200);
            })
            .catch(function (err) {
                $("#module-body").LoadingOverlay("hide", true);
                $.LoadingOverlay("hide");
                if (self.update_window_history) {
                    window.history.replaceState({}, null, UPDATE_WINDOW_URL);
                }
                var err_msg = get_error_message(err);
                // $('body').hide();
                $('body').empty();


                setTimeout(function () {
                    show_alert(err_msg, function () {
                        window.close();
                    });
                }, 100);
            });
    },

    set_info: function (data, _cb) {
        var self = this;
        this.file_info = data;
        this.file_type = data.type;

        $("#course-info").html(this.file_info.course_title);
        $("#file-info").html(this.file_info.title);

        $("#course-info").attr('title', this.file_info.course_title);
        $("#file-info").attr('title', this.file_info.title);

        if (this.update_document_title) {
            top.document.title = this.file_info.title;
        }
        if (this.source == 'PERIOD' && tms._user) {
            $("#scrap").removeClass('hidden');
        }

        $("#page_list").empty();

        this.total = data.pages.length;

        var imgList = [];
        for (var index = 0; index < data.pages.length; index++) {
            var page = data.pages[index];
            var page_num = index + 1;

            var page_span = $('<li class="span4"></li>');
            $("#page_list").append(page_span);
            var page_a = $('<a class="thumbnail"></a>');
            page_span.append(page_a);
            var page_img = $('<img></img>');
            page_a.append(page_img);
            var page_cap = $('<p></p>');
            page_a.append(page_cap);

            page_span.attr('index', index);
            page_a.data(page);
            page_cap.html("" + page_num);
            var thumbnail = page.thumbnail;
            //if (page.type == 'video' || page.type == 'youtube') {
                //if (!thumbnail) {
                    thumbnail = '/assets/viewer/img/viewer/video-default-thumbnail.png';
                //}
            //}
            page_img.attr('src', thumbnail);

            imgList.push(page.file);
        }

        if (!$("#module-modal").hasClass('show')) {
            console.log("show module-modal");
            $("#module-modal").modal('show');
        }
        if (self.file_type == 'video' || self.file_type == 'audio') {

            Module.video_viewer.drow_video('module-body', self.file_type);
            var mime_type = 'video/mp4';
            if (self.file_type == 'audio') {
                mime_type = 'audio/mp3';
            }
        }

        setTimeout(function () {
            if (self.file_type == 'video' || self.file_type == 'audio') {
                // Module.video_viewer.drow_video('module-body', this.file_type);
                // var mime_type = 'video/mp4';
                // if(this.file_type == 'audio') {
                //     mime_type = 'audio/mp3';
                // }
                // Module.common.zoom('content-scale', 3, 'white');
                Module.video_viewer.playlist(data.pages[0].file, mime_type, data.pages[0].thumbnail);
                // $("#module-modal").modal('show');

            } else {
                if (data.pdf_url) {
                    IS_USING_PDF_MODULE = true;
                } else {
                    IS_USING_PDF_MODULE = false;
                }

                console.log("IS_USING_PDF_MODULE : ", IS_USING_PDF_MODULE)
                if (IS_USING_PDF_MODULE) {
                    Module.pdf_viewer.drow_pdf('module-body', get_url(data.pdf_url), 1, imgList);
                } else {
                    Module.image_viewer.drow_image('module-body', imgList);
                    // Module.common.zoom('content-scale', 3, '#dddddd');
                    $('#carousel-control').on('slid.bs.carousel', function (e) { });
                    // $("#module-modal").modal('show');
                }
            }
            _cb && _cb();
        }, 500);
    },
    select_index: function (index) {
        if (this.index != -1) {
            this.select_index_func(index);
            setTimeout(function () {
                $("#module-body").LoadingOverlay("hide", true);
            }, 100);
            return;
        }

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

        $("#page_list .span4.active").removeClass('active');
        $("#page_list .span4[index=" + index + "]").addClass('active');

        if (index > 0) {
            $(".icon-prev-content").removeClass("hidden");
        } else {
            $(".icon-prev-content").addClass("hidden");
        }
        if (index + 1 >= this.total) {
            $(".icon-next-content").addClass("hidden");
        } else {
            $(".icon-next-content").removeClass("hidden");
        }

        var current_page = index + 1;
        $("#current_page").html(1);
        $("#total_page").html(1);

        IS_USING_PDF_MODULE = false;

        setTimeout(function () {
        	Module.common.zoom('content-scale', 3, 'white');
        }, 300);

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
        $('#palette').children('.palette').removeClass('active');
        $('#palette button[data-color="' + target + '"]').addClass('active');

        drawing_canvas.drawLineStroke_change(target);
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
        $('.arrow_color_wrap').children('.arrow_palette').removeClass('active');
        $('.arrow_color_wrap button[data-arrowcolor="' + color + '"]').addClass('active');
        // 아이콘 색상 변경하기
        $('.icon-arrow-color').css('background-color', color);
        if (color == '#ffffff') {
            $('.icon-arrow-color').css('border', '2px solid #d5d5d5');
        } else {
            $('.icon-arrow-color').css('border', 'none');
        };

        drawing_canvas.arrow_color_change(color);
    },

    select_arrow_width: function (width) {
        drawing_canvas.arrow_width_change(width);
    },

    select_arrow_dash: function (dash) {
        drawing_canvas.arrow_dash_change(dash);
    },

    select_arrow_direction: function (direction) {
        drawing_canvas.arrow_direction_change(direction);
    },

    select_line_color: function (color) {
        $('.line_color_wrap').children('.line_palette').removeClass('active');
        $('.line_color_wrap button[data-linecolor="' + color + '"]').addClass('active');
        // 아이콘 색상 변경하기
        $('.icon-line-color').css('background-color', color);

        if (color == '#ffffff') {
            $('.icon-line-color').css('border', '2px solid #d5d5d5');
        } else {
            $('.icon-line-color').css('border', 'none');
        };
        drawing_canvas.line_color_change(color);
    },

    select_line_width: function (width) {
        drawing_canvas.line_width_change(width);
    },

    select_line_dash: function (dash) {
        drawing_canvas.line_dash_change(dash);
    },

    // 형광펜 그리기 모드, 형광펜 지우개 모드 변경
    drawing_hlighter_mode_change: function (mode) {
        drawing_canvas.transformer_destroy();
        drawing_canvas.setMode(mode);;
    },

    select_hlighter_color: function (target) {
        $('#image_select').children('.hlighter_wrap').children('.select_hlighter_color_wrap').children('button').removeClass('active');
        $('#image_select button[data-hlightercolor="' + target + '"]').addClass('active');
        $('.icon-hlighter-color').css('background-color', target);

        if (target == '#ffffff') {
            $('.icon-hlighter-color').css('border', '2px solid #d5d5d5');
        } else {
            $('.icon-hlighter-color').css('border', 'none');
        };

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
//
function pdfScaleChangeEvent(e) {
    // console.log(e);
    //e.scale
    var scale = e.scale;
    if (typeof (scale) == 'string') {
        scale = parseFloat(scale);
    }
    scale = scale * 100;
    $("#zoom-level").html(scale.toFixed(0) + "%");
    // $("#zoom-level").html("X "+scale.toFixed(1));
}
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
    viewer.total = numPages;

    $("#page_list .span4.active").removeClass('active');
    $("#page_list .span4[index=" + index + "]").addClass('active');

    if (index > 0) {
        $(".icon-prev-content").removeClass("hidden");
    } else {
        $(".icon-prev-content").addClass("hidden");
    }
    if (index + 1 >= viewer.total) {
        $(".icon-next-content").addClass("hidden");
    } else {
        $(".icon-next-content").removeClass("hidden");
    }

    var current_page = index + 1;
    $("#current_page").html(current_page);
    $("#total_page").html(viewer.total);

    // Module.common.fit($("#content-scale"));
    viewer.index = index;
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

    // 가운데 정렬을 위해 추가 테스트
    // if (DEVICE_TYPE == 'mobile') {
    //     var _target = $('#pdf-iframe').contents().find('#viewerContainer #viewer .page');

    //     _target.css('top', 'calc(50% - (' + height + 'px / 2))');

    //     // 확대 시 top이 음수가 되면 상단 부분 잘려보이기 때문에, 음수라면 top을 0으로 재변경
    //     if (pdfview.div.offsetTop < 0) {
    //         _target.css('padding-top', (pdfview.div.offsetTop) * -1);
    //     } else {
    //         _target.css('padding-top', '0px');
    //     }
    // }

    var canvas_left = - left * scale;
    var canvas_top = top * scale - height;
    $("#drawing-control").css({
        left: canvas_left, top: canvas_top,
        width: width, height: height
    });

    var pageW = pdfview.width;
    var pageH = pdfview.height;
    var pdfScale = pdfview.viewport.scale;
    drawing_canvas.scale = pdfScale;
    drawing_canvas.stage.width(pageW);
    drawing_canvas.stage.height(pageH);
    drawing_canvas.stage.scale({ x: pdfScale, y: pdfScale });

    drawing_canvas.stage.draw();
}

function pdfLink(title, link) {
    window.open(link, "_blank");
}
