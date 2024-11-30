var iframe_canvas = undefined;
var drawing_canvas = undefined;
$(window).on('beforeunload', function () {
    if (iframe_canvas) {
        iframe_canvas.destroy();
        iframe_canvas = undefined;
    }
});

var current_content_type = undefined;

function get_current_content_type() {
    if ($('#iframe_tools').is(":visible")) {
        current_content_type = 'tools';
    } else if ($('#module-modal').is(":visible")) {
        current_content_type = 'preview';
    } else if ($('#iframe_content_pairbook').is(":visible")) {
        current_content_type = 'popup';
    } else if ($('#iframe_content').is(":visible")) {
        current_content_type = 'smartppt';
    }
    return current_content_type;
}

$(document).on("click", "#drawing-button", function (e) {
    if ($('#iframe_tools').is(":visible")) {
        show_alert("수업도구 사용중에는 사용할 수 없습니다.");
        return;
    }

    var subj = $("#page_list .subject.active");
    if(!subj.attr('id')){
        show_alert("그리기는 기본 목차에 대해서만 지원합니다.");
        return false;
    }

    // 현재 떠있는게 뭐지??
    current_content_type = get_current_content_type();
    // console.log("current_content_type:",current_content_type);

    if ($("#drawing-button").hasClass('active')) {

        $("#drawing-button").removeClass('active');
        $("#drawing").removeClass('active');
        if (drawing_canvas) {
            drawing_canvas.deactivate();
        }
        Module.common.zoom_setting('bind_mouse_event');
        drawing_canvas = undefined;

    } else {
        $("#drawing-button").addClass('active');
        $("#drawing").addClass('active');

        current_content_type = get_current_content_type();

        if (current_content_type == 'smartppt') {
            drawing_canvas = iframe_canvas;

        } else if (current_content_type == 'popup') {
            drawing_canvas = iframe_canvas;
        } else if (current_content_type == 'preview') {

            if (preview_viewer.file_type != 'video' && preview_viewer.file_type != 'audio') {

                if (IS_USING_PDF_MODULE) {
                    drawing_canvas = Module.pdf_viewer.drawing();
                } else {
                    drawing_canvas = Module.image_viewer.drawing();
                }
            } else {
                drawing_canvas = Module.video_viewer.drawing();
            }
        }

        Module.common.zoom_setting('unbind_mouse_event');
        // 그리기 바로 적용
        $('.icon-drawing').click();
    }
});

$(document).on("click", '#math_tool_btn', function (e) {
    if ($('#iframe_tools').is(":visible")) {
        show_alert("수업도구 사용중에는 사용할 수 없습니다.");
        return;
    }

    current_content_type = get_current_content_type();

    if ($("#math_tool_btn").hasClass('active')) {
        $("#math_tool_btn").removeClass('active');
        $("#math-tool").removeClass('active');

        if (drawing_canvas) {
            drawing_canvas.deactivate();
        }
        Module.common.zoom_setting('bind_mouse_event');
        drawing_canvas = undefined;

    } else {
        $("#math_tool_btn").addClass('active');
        $("#math-tool").addClass('active');

        current_content_type = get_current_content_type();

        if (current_content_type == 'smartppt') {
            drawing_canvas = iframe_canvas;

        } else if (current_content_type == 'popup') {

            drawing_canvas = iframe_canvas;

        } else if (current_content_type == 'preview') {

            if (preview_viewer.file_type != 'video' && preview_viewer.file_type != 'audio') {

                if (IS_USING_PDF_MODULE) {
                    drawing_canvas = Module.pdf_viewer.drawing();
                } else {
                    drawing_canvas = Module.image_viewer.drawing();
                }
            } else {
                drawing_canvas = Module.video_viewer.drawing();
            }
        }

        Module.common.zoom_setting('unbind_mouse_event');
        app.mode_change('mathTool');
    }
});

$(document).on("click", ".icon-drawing7", function (e) {
    $("#drawing-button").removeClass('active');
    $("#math_tool_btn").removeClass('active');

    if (iframe_canvas) {
        iframe_canvas.deactivate();
        // !! priview
        drawing_canvas.deactivate();
    }
    drawing_canvas = undefined;
    Module.common.zoom_setting('bind_mouse_event');
});

function iframe_zoom_event_handler(e, type) {
    // console.log(e.detail)
    if (iframe_canvas) {
        var _pos = e.detail.pos;
        var _scale = e.detail.scale;
        var _container = $("#viewer-content .drawing-canvas");
        _container.css('-webkit-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
        _container.css('-webkit-transform-origin', '0 0');
        _container.css('-moz-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
        _container.css('-moz-transform-origin', '0 0');
        _container.css('-o-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
        _container.css('-o-transform-origin', '0 0');
        _container.css('-ms-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
        _container.css('-ms-transform-origin', '0 0');
        iframe_canvas.fitStage();
    }
    var scale = e.detail.scale * 100;
    $("#zoom-level").html(scale.toFixed(0) + "%");
    //$("#zoom-level").html("X "+e.detail.scale.toFixed(1));

    try {
        if (MIRRORING_WINDOW && !MIRRORING_WINDOW.closed && MIRRORING_WINDOW.viewer.is_mirroring_started) {
            var container = MIRRORING_WINDOW.viewer.get_element('#' + e.detail.iframe_id);
            var _container = container.contents().find('body');
            var _pos = e.detail.pos;
            var _scale = e.detail.scale;
            _container.css('-webkit-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
            _container.css('-webkit-transform-origin', '0 0');
            _container.css('-moz-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
            _container.css('-moz-transform-origin', '0 0');
            _container.css('-o-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
            _container.css('-o-transform-origin', '0 0');
            _container.css('-ms-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
            _container.css('-ms-transform-origin', '0 0');

            var eventTypeToDispatch = "iframe-zoom-event-" + type;
            MIRRORING_WINDOW.dispatchEvent(new CustomEvent(eventTypeToDispatch, {
                detail: {
                    "iframe_id": e.detail.iframe_id,
                    "scale": _scale,
                    "pos": _pos
                }
            }));
        }
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('iframe-zoom-event-zoom', function (e) {
    // console.log('iframe-zoom-event-zoom',e.detail);
    iframe_zoom_event_handler(e, 'zoom');
});
window.addEventListener('iframe-zoom-event-move', function (e) {
    // console.log('iframe-zoom-event-move', e.detail);
    iframe_zoom_event_handler(e, 'move');
});
window.addEventListener('smart-zoom-event', function (e) {
    smart_zoom_event_handler_for_mirroring(e);
});
window.addEventListener('smart-zoom-event-stop', function (e) {
    smart_zoom_event_handler_for_mirroring(e);
});

function smart_zoom_event_handler_for_mirroring(e) {
    try {
        var _pos = e.detail.pos;
        var _scale = e.detail.scale;

        if (MIRRORING_WINDOW && !MIRRORING_WINDOW.closed && MIRRORING_WINDOW.viewer.is_mirroring_started) {

            // if(IS_REMOTE_TRIGGER) {
            //     IS_REMOTE_TRIGGER = false;
            //     return;
            // }

            var org_content_body = $("#content-body");
            var container = MIRRORING_WINDOW.viewer.get_element('#content-scale');
            var content_body = MIRRORING_WINDOW.viewer.get_element('#content-body');

            var ratio_x = content_body.width() / org_content_body.width();
            var ratio_y = content_body.height() / org_content_body.height();
            var ratio = Math.min(ratio_x, ratio_y);

            var gap_x = (content_body.width() - org_content_body.width() * ratio) / 2;
            var gap_y = (content_body.height() - org_content_body.height() * ratio) / 2;

            // MIRRORING_WINDOW.IS_REMOTE_TRIGGER = true;

            //container.css(e.detail.css);
            container.css('transform-origin', '0 0');
            // container.css('transition','all 0.7s ease-out');
            container.css('transform', 'translate3d(' + (_pos.x * ratio + gap_x) + 'px, ' + (_pos.y * ratio + gap_y) + 'px, 0) scale3d(' + _scale * ratio + ', ' + _scale * ratio + ', 1)');

        } else if (IS_MIRRORING_WINDOW && parent.opener) {
            // if(IS_REMOTE_TRIGGER) {
            //     IS_REMOTE_TRIGGER = false;
            //     return;
            // }
            // // console.log(e);
            // var org_content_body = $("#content-body");
            // var container = parent.opener.viewer.get_element('#content-scale');
            // var content_body = parent.opener.viewer.get_element('#content-body');

            // var ratio_x = content_body.width() / org_content_body.width();
            // var ratio_y = content_body.height() / org_content_body.height();
            // var ratio = Math.min(ratio_x, ratio_y);

            // var gap_x = (content_body.width() - org_content_body.width()*ratio)/2;
            // var gap_y = (content_body.height() - org_content_body.height()*ratio)/2;

            // console.log(container);

            // parent.opener.IS_REMOTE_TRIGGER = true;
            // //container.css(e.detail.css);
            // container.css('transform-origin','0 0');
            // // container.css('transition','all 0.7s ease-out');
            // container.css('transform','translate3d(' + (_pos.x*ratio + gap_x) + 'px, ' + (_pos.y*ratio  + gap_y) + 'px, 0) scale3d(' + _scale*ratio + ', ' + _scale*ratio +', 1)');
        }
    } catch (error) {
        console.log(error);
    }
}

$(document).on("SmartZoom_ZOOM_END", "#content-scale", function (e) {
    var scale = e.scale;
    scale = scale * 100;
    $("#zoom-level").html(scale.toFixed(0) + "%");
    //$("#zoom-level").html("X "+scale.toFixed(1));

    // console.log("SmartZoom_ZOOM_END", e);
    //smart_zoom_event_handler_for_mirroring(e);
});

$(document).on("SmartZoom_PAN_END", "#content-scale", function (e) {
    // var scale = e.scale;
    // scale = scale * 100;
    // $("#zoom-level").html(scale.toFixed(0)+"%");
    // //$("#zoom-level").html("X "+scale.toFixed(1));

    // console.log("SmartZoom_PAN_END", e);
    //smart_zoom_event_handler_for_mirroring(e);
});


// 그리기
// var first_drawing_check = false;
$(document).on('click', '.icon-drawing', function () {
    $('#palette').css('display', 'inline-block');
    $('#font_select').css('display', 'none');
    $('#image_select').css('display', 'none');
    $('.icon-drawing4').css('display', 'inline-block');

    $('.icon-drawing').addClass('active');
    $('.icon-drawing2').removeClass('active');
    $('.icon-drawing3').removeClass('active');
    $('.icon-drawing4').removeClass('active');
    $('.icon-drawing5').removeClass('active');
    $('.icon-drawing6').removeClass('active');
    $('.drawing-canvas').css('cursor', 'default');

    if (drawing_canvas.drawingLayer.attrs.visible == false) {
        $('.icon-drawing6').addClass('active');
        // drawing_layer_hide = false;
    } else if (drawing_canvas.drawingLayer.attrs.visible == true || drawing_canvas.drawingLayer.attrs.visible == undefined) {
        $('.icon-drawing6').removeClass('active');
        // drawing_layer_hide = true;
    };

    app.drawing_mode_change('brush');

    // 처음에 붉은색으로 색상 변경
    // if(!first_drawing_check) {
    //     app.select_stroke_color('#f24545');
    //     first_drawing_check = true;
    // }

    // 처음에 붉은색 변경에서 모듈 분리로 현재 선택되어 있는 색상 적용
    var brush_color = $('#palette .active').attr('data-color');
    app.select_stroke_color(brush_color);
});
// 텍스트
// var first_text_check = false;
$(document).on('click', '.icon-drawing2', function () {
    $('#font_select').css('display', 'inline-block');
    $('#palette').css('display', 'none');
    $('#image_select').css('display', 'none');
    $('.icon-drawing4').css('display', 'none');
    $('.drawing-canvas').css('cursor', 'default');

    $('.icon-drawing2').addClass('active');
    $('.icon-drawing').removeClass('active');
    $('.icon-drawing3').removeClass('active');
    $('.icon-drawing6').removeClass('active');

    if (drawing_canvas.textLayer.attrs.visible == false) {
        $('.icon-drawing6').addClass('active');
        text_layer_hide = true;
    } else if (drawing_canvas.textLayer.attrs.visible == true || drawing_canvas.textLayer.attrs.visible == undefined) {
        $('.icon-drawing6').removeClass('active');
        text_layer_hide = false;
    };

    // 그리기 모드 해제
    app.mode_change('text');

    // // 처음에 검은색으로 색상 변경
    // if (!first_text_check) {
    //     app.text_font_fill('#000000');
    //     first_text_check = true;
    // }
    var text_color = $('#font_select .font_color_wrap .font_palette.active').attr('data-fontcolor');
    app.text_font_fill(text_color);
});
// 도형
$(document).on('click', '.icon-drawing3', function () {
    $('#image_select').css('display', 'inline-block');
    $('#palette').css('display', 'none');
    $('#font_select').css('display', 'none');
    $('.icon-drawing4').css('display', 'none');
    $('.icon-drawing4').removeClass('active');
    $('.icon-drawing3').addClass('active');
    $('.icon-drawing2').removeClass('active');
    $('.icon-drawing').removeClass('active');
    $('.icon-drawing6').removeClass('active');
    $('.drawing-canvas').css('cursor', 'default');

    // 그리기 모드 해제
    if ($('.icon-arrow').hasClass('active')) {
        app.mode_change('arrow');
    } else if ($('.icon-line').hasClass('active')) {
        app.mode_change('straight');
    } else if ($('.icon-hlighter').hasClass('active')) {
        app.mode_change('hlighter');
    } else if ($('.icon-sticker').hasClass('active')) {
        app.mode_change('image');
    } else {
        app.mode_change('image');
    }

    if (drawing_canvas.imageLayer.attrs.visible == false) {
        $('.icon-drawing6').addClass('active');
        image_layer_hide = true;
    } else if (drawing_canvas.imageLayer.attrs.visible == true || drawing_canvas.imageLayer.attrs.visible == undefined) {
        $('.icon-drawing6').removeClass('active');
        image_layer_hide = false;
    };

    var arrow_color = $('#image_select .arrow_wrap .arrow_color_wrap .arrow_palette.active').attr('data-arrowcolor');
    app.select_arrow_color(arrow_color);
    var straight_color = $('#image_select .line_wrap .line_color_wrap .line_palette.active').attr('data-linecolor');
    app.select_line_color(straight_color);
    var hlighter_color = $('#image_select .hlighter_wrap .select_hlighter_color_wrap .hlighter_palette.active').attr('data-hlightercolor');
    app.select_hlighter_color(hlighter_color);
});
// 도형 - 화살표
// var first_arrow_check = false;
$(document).on('click', '.icon-arrow', function () {
    $('.icon-drawing4').css('display', 'none');

    $('.icon-arrow').addClass('active');
    $('.icon-line').removeClass('active');
    $('.icon-hlighter').removeClass('active');
    $('.icon-sticker').removeClass('active');

    $('.arrow_wrap').css('display', 'inline-block');
    $('.line_wrap').css('display', 'none');
    $('.hlighter_wrap').css('display', 'none');
    $('.sticker_wrap').css('display', 'none');

    app.stop_drawHlighter();
    app.mode_change('arrow');

    // 처음에 붉은색으로 색상 변경
    // if (!first_arrow_check) {
    //     app.select_arrow_color('#f24545');
    //     first_arrow_check = true;
    // }

    var arrow_color = $('#image_select .arrow_wrap .arrow_color_wrap .arrow_palette.active').attr('data-arrowcolor');
    app.select_arrow_color(arrow_color);
});
// 도형 - 화살표 컬러
var select_arrow_color_off = true;
$(document).on('click', '.icon-arrow-color', function () {
    if (select_arrow_color_off) {
        $('.arrow_color_wrap').css('display', 'inline-block');
        $('.icon-arrow-color .caret').addClass('caret_change');
        $('.icon-arrow-color .caret_change').removeClass('caret');
        select_arrow_color_off = false;

        $('.select_arrow_direction_wrap').css('display', 'none');
        $('.icon-arrow-direction .caret_change').addClass('caret');
        $('.icon-arrow-direction .caret').removeClass('caret_change');
        select_arrow_direction_off = true;

        $('.select_arrow_width_wrap').css('display', 'none');
        $('.icon-arrow-width .caret_change').addClass('caret');
        $('.icon-arrow-width .caret').removeClass('caret_change');
        select_arrow_width_off = true;

        $('.select_arrow_dash_wrap').css('display', 'none');
        $('.icon-arrow-dash .caret_change').addClass('caret');
        $('.icon-arrow-dash .caret').removeClass('caret_change');
        select_arrow_dash_off = true;
    } else {
        $('.arrow_color_wrap').css('display', 'none');
        $('.icon-arrow-color .caret_change').addClass('caret');
        $('.icon-arrow-color .caret').removeClass('caret_change');
        select_arrow_color_off = true;
    }
});
// 화살표 색상 클릭
$(document).on('click', '.arrow_palette', function () {
    var arrow_color = $(this).attr('data-arrowcolor');
    $('.icon-arrow-color').click();

    app.select_arrow_color(arrow_color);
});
// 도형 - 화살표 방향
var select_arrow_direction_off = true;
$(document).on('click', '.icon-arrow-direction', function () {
    if (select_arrow_direction_off) {
        $('.select_arrow_direction_wrap').css('display', 'inline-block');
        $('.icon-arrow-direction .caret').addClass('caret_change');
        $('.icon-arrow-direction .caret_change').removeClass('caret');
        select_arrow_direction_off = false;

        $('.arrow_color_wrap').css('display', 'none');
        $('.icon-arrow-color .caret_change').addClass('caret');
        $('.icon-arrow-color .caret').removeClass('caret_change');
        select_arrow_color_off = true;

        $('.select_arrow_width_wrap').css('display', 'none');
        $('.icon-arrow-width .caret_change').addClass('caret');
        $('.icon-arrow-width .caret').removeClass('caret_change');
        select_arrow_width_off = true;

        $('.select_arrow_dash_wrap').css('display', 'none');
        $('.icon-arrow-dash .caret_change').addClass('caret');
        $('.icon-arrow-dash .caret').removeClass('caret_change');
        select_arrow_dash_off = true;
    } else {
        $('.select_arrow_direction_wrap').css('display', 'none');
        $('.icon-arrow-direction .caret_change').addClass('caret');
        $('.icon-arrow-direction .caret').removeClass('caret_change');
        select_arrow_direction_off = true;
    }
});
// 화살표 방향 클릭
$(document).on('click', '.select_a_d', function () {
    $('.icon-arrow-direction').click();
    var direction = $(this).attr('data-direction');

    //  background img change
    if (direction == 'forward') {
        $('.select_arrow_direction_1').css('background-image', 'url("./img/viewer/icon-figure5-1-active.png")');
        $('.select_arrow_direction_2').css('background-image', 'url("./img/viewer/icon-figure5-2.png")');
        $('.select_arrow_direction_3').css('background-image', 'url("./img/viewer/icon-figure5-3.png")');
    } else if (direction == 'reverse') {
        $('.select_arrow_direction_1').css('background-image', 'url("./img/viewer/icon-figure5-1.png")');
        $('.select_arrow_direction_2').css('background-image', 'url("./img/viewer/icon-figure5-2-active.png")');
        $('.select_arrow_direction_3').css('background-image', 'url("./img/viewer/icon-figure5-3.png")');
    } else if (direction == 'bidirectional') {
        $('.select_arrow_direction_1').css('background-image', 'url("./img/viewer/icon-figure5-1.png")');
        $('.select_arrow_direction_2').css('background-image', 'url("./img/viewer/icon-figure5-2.png")');
        $('.select_arrow_direction_3').css('background-image', 'url("./img/viewer/icon-figure5-3-active.png")');
    };

    app.select_arrow_direction(direction);
});
// 도형 - 화살표 선두께 선택
var select_arrow_width_off = true;
$(document).on('click', '.icon-arrow-width', function () {
    if (select_arrow_width_off) {
        $('.select_arrow_width_wrap').css('display', 'inline-block');
        $('.icon-arrow-width .caret').addClass('caret_change');
        $('.icon-arrow-width .caret_change').removeClass('caret');
        select_arrow_width_off = false;

        $('.arrow_color_wrap').css('display', 'none');
        $('.icon-arrow-color .caret_change').addClass('caret');
        $('.icon-arrow-color .caret').removeClass('caret_change');
        select_arrow_color_off = true;

        $('.select_arrow_direction_wrap').css('display', 'none');
        $('.icon-arrow-direction .caret_change').addClass('caret');
        $('.icon-arrow-direction .caret').removeClass('caret_change');
        select_arrow_direction_off = true;

        $('.select_arrow_dash_wrap').css('display', 'none');
        $('.icon-arrow-dash .caret_change').addClass('caret');
        $('.icon-arrow-dash .caret').removeClass('caret_change');
        select_arrow_dash_off = true;
    } else {
        $('.select_arrow_width_wrap').css('display', 'none');
        $('.icon-arrow-width .caret_change').addClass('caret');
        $('.icon-arrow-width .caret').removeClass('caret_change');
        select_arrow_width_off = true;
    }
});
// 화살표 선두께 클릭
$(document).on('click', '.select_a_w', function () {
    $('.icon-arrow-width').click();
    var width = $(this).attr('data-arrow_width');

    //  background img change
    if (width == 2) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1-active.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5.png")');
    } else if (width == 4) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2-active.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5.png")');
    } else if (width == 6) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3-active.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5.png")');
    } else if (width == 8) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4-active.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5.png")');
    } else if (width == 10) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5-active.png")');
    }

    app.select_arrow_width(width);
});
// 도형 - 화살표 대시 선택
var select_arrow_dash_off = true;
$(document).on('click', '.icon-arrow-dash', function () {
    if (select_arrow_dash_off) {
        $('.select_arrow_dash_wrap').css('display', 'inline-block');
        $('.icon-arrow-dash .caret').addClass('caret_change');
        $('.icon-arrow-dash .caret_change').removeClass('caret');
        select_arrow_dash_off = false;

        $('.arrow_color_wrap').css('display', 'none');
        $('.icon-arrow-color .caret_change').addClass('caret');
        $('.icon-arrow-color .caret').removeClass('caret_change');
        select_arrow_color_off = true;

        $('.select_arrow_direction_wrap').css('display', 'none');
        $('.icon-arrow-direction .caret_change').addClass('caret');
        $('.icon-arrow-direction .caret').removeClass('caret_change');
        select_arrow_direction_off = true;

        $('.select_arrow_width_wrap').css('display', 'none');
        $('.icon-arrow-width .caret_change').addClass('caret');
        $('.icon-arrow-width .caret').removeClass('caret_change');
        select_arrow_width_off = true;
    } else {
        $('.select_arrow_dash_wrap').css('display', 'none');
        $('.icon-arrow-dash .caret_change').addClass('caret');
        $('.icon-arrow-dash .caret').removeClass('caret_change');
        select_arrow_dash_off = true;
    }
});
// 화살표 대시 클릭
$(document).on('click', '.select_a_ds', function () {
    $('.icon-arrow-dash').click();
    var dash = $(this).attr('data-arrow_dash');

    //  background img change
    if (dash == 'dash_1') {
        $('.select_arrow_dash_1').css('background-image', 'url("./img/viewer/icon-figure7-1-active.png")');
        $('.select_arrow_dash_2').css('background-image', 'url("./img/viewer/icon-figure7-2.png")');
        $('.select_arrow_dash_3').css('background-image', 'url("./img/viewer/icon-figure7-3.png")');
    } else if (dash == 'dash_2') {
        $('.select_arrow_dash_1').css('background-image', 'url("./img/viewer/icon-figure7-1.png")');
        $('.select_arrow_dash_2').css('background-image', 'url("./img/viewer/icon-figure7-2-active.png")');
        $('.select_arrow_dash_3').css('background-image', 'url("./img/viewer/icon-figure7-3.png")');
    } else if (dash == 'dash_3') {
        $('.select_arrow_dash_1').css('background-image', 'url("./img/viewer/icon-figure7-1.png")');
        $('.select_arrow_dash_2').css('background-image', 'url("./img/viewer/icon-figure7-2.png")');
        $('.select_arrow_dash_3').css('background-image', 'url("./img/viewer/icon-figure7-3-active.png")');
    };

    app.select_arrow_dash(dash);
});
// 도형 - 직선
// var first_line_check = false;
$(document).on('click', '.icon-line', function () {
    $('.icon-drawing4').css('display', 'none');

    $('.icon-line').addClass('active');
    $('.icon-arrow').removeClass('active');
    $('.icon-hlighter').removeClass('active');
    $('.icon-sticker').removeClass('active');

    $('.line_wrap').css('display', 'inline-block');
    $('.arrow_wrap').css('display', 'none');
    $('.hlighter_wrap').css('display', 'none');
    $('.sticker_wrap').css('display', 'none');

    app.stop_drawHlighter();
    app.mode_change('straight');

    // 처음에 붉은색으로 색상 변경
    // if (!first_line_check) {
    //     app.select_line_color('#f24545');;
    //     first_line_check = true;
    // };

    var straight_color = $('#image_select .line_wrap .line_color_wrap .line_palette.active').attr('data-linecolor');
    app.select_line_color(straight_color);

});
// 도형 - 직선 컬러
var select_line_color_off = true;
$(document).on('click', '.icon-line-color', function () {
    if (select_line_color_off) {
        $('.line_color_wrap').css('display', 'inline-block');
        $('.icon-line-color .caret').addClass('caret_change');
        $('.icon-line-color .caret_change').removeClass('caret');
        select_line_color_off = false;

        $('.select_line_width_wrap').css('display', 'none');
        $('.icon-line-width .caret_change').addClass('caret');
        $('.icon-line-width .caret').removeClass('caret_change');
        select_line_width_off = true;

        $('.select_line_dash_wrap').css('display', 'none');
        $('.icon-line-dash .caret_change').addClass('caret');
        $('.icon-line-dash .caret').removeClass('caret_change');
        select_line_dash_off = true;
    } else {
        $('.line_color_wrap').css('display', 'none');
        $('.icon-line-color .caret_change').addClass('caret');
        $('.icon-line-color .caret').removeClass('caret_change');
        select_line_color_off = true;
    }
});
// 직선 색상 클릭
$(document).on('click', '.line_palette', function () {
    var line_color = $(this).attr('data-linecolor');
    $('.icon-line-color').click();

    app.select_line_color(line_color);
});
// 도형 - 직선 선두께 선택
var select_line_width_off = true;
$(document).on('click', '.icon-line-width', function () {
    if (select_line_width_off) {
        $('.select_line_width_wrap').css('display', 'inline-block');
        $('.icon-line-width .caret').addClass('caret_change');
        $('.icon-line-width .caret_change').removeClass('caret');
        select_line_width_off = false;

        $('.line_color_wrap').css('display', 'none');
        $('.icon-line-color .caret_change').addClass('caret');
        $('.icon-line-color .caret').removeClass('caret_change');
        select_line_color_off = true;

        $('.select_line_dash_wrap').css('display', 'none');
        $('.icon-line-dash .caret_change').addClass('caret');
        $('.icon-line-dash .caret').removeClass('caret_change');
        select_line_dash_off = true;
    } else {
        $('.select_line_width_wrap').css('display', 'none');
        $('.icon-line-width .caret_change').addClass('caret');
        $('.icon-line-width .caret').removeClass('caret_change');
        select_line_width_off = true;
    }
});
// 직선 선두께 클릭
$(document).on('click', '.select_l_w', function () {
    $('.icon-line-width').click();
    var width = $(this).attr('data-line_width');

    //  background img change
    if (width == 2) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1-active.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5.png")');
    } else if (width == 4) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2-active.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5.png")');
    } else if (width == 6) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3-active.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5.png")');
    } else if (width == 8) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4-active.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5.png")');
    } else if (width == 10) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer/icon-figure6-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer/icon-figure6-5-active.png")');
    }

    app.select_line_width(width);
});
// 도형 - 직선 대시 선택
var select_line_dash_off = true;
$(document).on('click', '.icon-line-dash', function () {
    if (select_line_dash_off) {
        $('.select_line_dash_wrap').css('display', 'inline-block');
        $('.icon-line-dash .caret').addClass('caret_change');
        $('.icon-line-dash .caret_change').removeClass('caret');
        select_line_dash_off = false;

        $('.line_color_wrap').css('display', 'none');
        $('.icon-line-color .caret_change').addClass('caret');
        $('.icon-line-color .caret').removeClass('caret_change');
        select_line_color_off = true;

        $('.select_line_width_wrap').css('display', 'none');
        $('.icon-line-width .caret_change').addClass('caret');
        $('.icon-line-width .caret').removeClass('caret_change');
        select_line_width_off = true;
    } else {
        $('.select_line_dash_wrap').css('display', 'none');
        $('.icon-line-dash .caret_change').addClass('caret');
        $('.icon-line-dash .caret').removeClass('caret_change');
        select_line_dash_off = true;
    }
});
// 직선 대시 클릭
$(document).on('click', '.select_l_ds', function () {
    $('.icon-line-dash').click();
    var dash = $(this).attr('data-line_dash');

    //  background img change
    if (dash == 'dash_1') {
        $('.select_line_dash_1').css('background-image', 'url("./img/viewer/icon-figure7-1-active.png")');
        $('.select_line_dash_2').css('background-image', 'url("./img/viewer/icon-figure7-2.png")');
        $('.select_line_dash_3').css('background-image', 'url("./img/viewer/icon-figure7-3.png")');
    } else if (dash == 'dash_2') {
        $('.select_line_dash_1').css('background-image', 'url("./img/viewer/icon-figure7-1.png")');
        $('.select_line_dash_2').css('background-image', 'url("./img/viewer/icon-figure7-2-active.png")');
        $('.select_line_dash_3').css('background-image', 'url("./img/viewer/icon-figure7-3.png")');
    } else if (dash == 'dash_3') {
        $('.select_line_dash_1').css('background-image', 'url("./img/viewer/icon-figure7-1.png")');
        $('.select_line_dash_2').css('background-image', 'url("./img/viewer/icon-figure7-2.png")');
        $('.select_line_dash_3').css('background-image', 'url("./img/viewer/icon-figure7-3-active.png")');
    };

    app.select_line_dash(dash);
});
// 도형 - 형광펜
// var first_hlighter_check = false;
$(document).on('click', '.icon-hlighter', function () {
    $('.icon-drawing4').css('display', 'none');

    $('.icon-hlighter').addClass('active');
    $('.icon-arrow').removeClass('active');
    $('.icon-line').removeClass('active');
    $('.icon-sticker').removeClass('active');
    $('.icon-drawing4').removeClass('active');

    $('.hlighter_wrap').css('display', 'inline-block');
    $('.arrow_wrap').css('display', 'none');
    $('.line_wrap').css('display', 'none');
    $('.sticker_wrap').css('display', 'none');

    app.drawing_hlighter_mode_change('hlighter');
    // 처음에 붉은색으로 색상 변경
    // if (!first_hlighter_check) {
    //     app.select_hlighter_color('#f24545');
    //     first_hlighter_check = true;
    // };

    var hlighter_color = $('#image_select .hlighter_wrap .select_hlighter_color_wrap .hlighter_palette.active').attr('data-hlightercolor');
    app.select_hlighter_color(hlighter_color);
});
// 도형 - 형광펜 색상 선택창 클릭
var select_hlighter_color_off = true;
$(document).on('click', '.icon-hlighter-color', function () {
    $('.icon-drawing4').removeClass('active');

    if (select_hlighter_color_off) {
        $('.select_hlighter_color_wrap').css('display', 'inline-block');
        $('.icon-hlighter-color .caret').addClass('caret_change');
        $('.icon-hlighter-color .caret_change').removeClass('caret');
        select_hlighter_color_off = false;

        $('.select_hlighter_width_wrap').css('display', 'none');
        $('.icon-hlighter-width .caret_change').addClass('caret');
        $('.icon-hlighter-width .caret').removeClass('caret_change');
        select_hlighter_width_off = true;
    } else {
        $('.select_hlighter_color_wrap').css('display', 'none');
        $('.icon-hlighter-color .caret_change').addClass('caret');
        $('.icon-hlighter-color .caret').removeClass('caret_change');
        select_hlighter_color_off = true;
    };
});
// 도형 - 형광펜 색상 클릭
$(document).on('click', '.hlighter_palette', function () {
    var hlighter_color = $(this).attr('data-hlightercolor');
    $('.icon-hlighter-color').click();

    app.select_hlighter_color(hlighter_color);
});
// 도형 - 형광펜 두께 선택
var select_hlighter_width_off = true;
$(document).on('click', '.icon-hlighter-width', function () {
    $('.icon-drawing4').removeClass('active');

    if (select_hlighter_width_off) {
        $('.select_hlighter_width_wrap').css('display', 'inline-block');
        $('.icon-hlighter-width .caret').addClass('caret_change');
        $('.icon-hlighter-width .caret_change').removeClass('caret');
        select_hlighter_width_off = false;

        $('.select_hlighter_color_wrap').css('display', 'none');
        $('.icon-hlighter-color .caret_change').addClass('caret');
        $('.icon-hlighter-color .caret').removeClass('caret_change');
        select_hlighter_color_off = true;

    } else {
        $('.select_hlighter_width_wrap').css('display', 'none');
        $('.icon-hlighter-width .caret_change').addClass('caret');
        $('.icon-hlighter-width .caret').removeClass('caret_change');
        select_hlighter_width_off = true;
    };
});
// 도형 - 형광펜 두께 선택
$(document).on('click', '.select_h_w', function () {
    var hlighter_width = $(this).attr('data-hlighterWidth');
    $('.icon-hlighter-width').click();

    //  background img change
    if (hlighter_width == '12') {
        $('.select_hlighter_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1-active.png")');
        $('.select_hlighter_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_hlighter_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
    } else if (hlighter_width == '18') {
        $('.select_hlighter_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_hlighter_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2-active.png")');
        $('.select_hlighter_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3.png")');
    } else if (hlighter_width == '24') {
        $('.select_hlighter_width_1').css('background-image', 'url("./img/viewer/icon-figure6-1.png")');
        $('.select_hlighter_width_2').css('background-image', 'url("./img/viewer/icon-figure6-2.png")');
        $('.select_hlighter_width_3').css('background-image', 'url("./img/viewer/icon-figure6-3-active.png")');
    };

    app.select_hlighter_width(hlighter_width);
});
// 도형 - 스티커
$(document).on('click', '.icon-sticker', function () {
    $('.icon-drawing4').css('display', 'none');

    $('.icon-sticker').addClass('active');
    $('.icon-arrow').removeClass('active');
    $('.icon-line').removeClass('active');
    $('.icon-hlighter').removeClass('active');

    $('.sticker_wrap').css('display', 'inline-block');
    $('.hlighter_wrap').css('display', 'none');
    $('.arrow_wrap').css('display', 'none');
    $('.line_wrap').css('display', 'none');

    app.stop_drawHlighter();
    // app.mode_change('image');
});
// 도형 - 스티커 선택
$(document).on('click', '.sticker_select', function () {
    var select_sticker = $(this).attr('data-sticker');
    var _url = "/assets/viewer/img/viewer/" + select_sticker + ".png";
    //var _url = "img/viewer/" + select_sticker + ".png"; // 기존 소스

    // app.mode_change('image');
    app.make_sticker(_url);
});
// 선 굵기 -> 2022.01.03 클릭 선택 형태에서 range형태로 변경
$(document).on('input change', '.lineRange', function (e) {
    var _width = Math.round($(this).val());

    $('#palette .palette.stroke_width i').css({
        width: _width,
        height: _width
    });

    app.select_stroke_width(_width);
});
// var stroke_width_select_open = false;
// $(document).on('click', '.stroke_width', function () {
//     if (!stroke_width_select_open) {
//         $('.stroke_width_wrap').css('display', 'block');
//         $('.palette .caret').addClass('caret_change');
//         $('.palette .caret_change').removeClass('caret');
//         stroke_width_select_open = true;
//     } else {
//         $('.stroke_width_wrap').css('display', 'none');
//         $('.palette .caret_change').addClass('caret');
//         $('.palette .caret').removeClass('caret_change');
//         stroke_width_select_open = false;
//     }
// });

// 폰트 색상
var font_color_select_open = false;
$(document).on('click', '.icon-font-color', function () {
    if (!font_color_select_open) {
        $('.font_color_wrap').css('display', 'block');
        $('.icon-font-color .caret').addClass('caret_change');
        $('.icon-font-color .caret_change').removeClass('caret');
        font_color_select_open = true;
    } else {
        $('.font_color_wrap').css('display', 'none');
        $('.icon-font-color .caret_change').addClass('caret');
        $('.icon-font-color .caret').removeClass('caret_change');
        font_color_select_open = false;
    }
});
// 지우개
$(document).on('click', '.icon-drawing4', function () {
    $('.icon-drawing4').addClass('active');
    $('.drawing-canvas').css('cursor', 'url("./img/viewer/eraser.png"), auto');
    app.drawing_mode_change('eraser');
});

// 초기화
$(document).on('click', '.icon-drawing5', function () {
    if ($('.icon-drawing4').hasClass('active')) {
        $('.icon-drawing4').removeClass('active');
        $('.icon-drawing5').addClass('active');
    }

    var _target;
    var target_layer;

    $('.drawing-canvas').css('cursor', 'default');

    if ($('.icon-drawing').hasClass('active')) {
        _target = '그리기';
        target_layer = 'drawing'
    } else if ($('.icon-drawing2').hasClass('active')) {
        _target = '텍스트';
        target_layer = 'text'
    } else if ($('.icon-drawing3').hasClass('active')) {
        _target = '이미지';
        target_layer = 'image'
    }

    vex.dialog.confirm({
        message: _target + '를 모두 삭제하시겠습니까?',
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: '삭제' }),
            $.extend({}, vex.dialog.buttons.NO, { text: '취소' })
        ],
        callback: function (value) {
            if (value == false && target_layer == 'drawing' && drawing_canvas.mode == 'eraser') {
                $('.drawing-canvas').css('cursor', 'url("./img/viewer/eraser.png"), auto');
                $('.icon-drawing4').addClass('active');
                $('.icon-drawing5').removeClass('active');
            }

            if (value) {
                app.delete_drawing(target_layer);
                $('.icon-drawing5').removeClass('active');

                // drawing일 때 지우개/그리기 선택 상태에 따라 다르게 진행해줘야 함
                if (target_layer == 'drawing') {
                    var _status = drawing_canvas.mode;

                    if (_status == 'eraser') {
                        $('#drawing .icon-drawing4').removeClass('active');
                        app.drawing_mode_change('brush');
                    }
                }
            }
        }
    });

    // var _result = confirm(_target + '를 모두 삭제하시겠습니까?');
    // if (_result) {
    //     app.delete_drawing(target_layer);
    // }
});

// 가리기
var drawing_layer_hide = false;
var text_layer_hide = false;
var image_layer_hide = false;
$(document).on('click', '.icon-drawing6', function () {
    $('.icon-drawing4').removeClass('active');
    $('.icon-drawing5').removeClass('active');
    $('.drawing-canvas').css('cursor', 'default');

    var target_layer;
    if ($('.icon-drawing').hasClass('active')) {
        target_layer = 'drawing_layer';

        if (!drawing_layer_hide) {
            $('.icon-drawing6').addClass('active');
            app.hide_drawing(target_layer);
            drawing_layer_hide = true;
        } else {
            $('.icon-drawing6').removeClass('active');
            app.show_drawing(target_layer);
            drawing_layer_hide = false;
        };

    } else if ($('.icon-drawing2').hasClass('active')) {
        target_layer = 'text_layer';

        if (!text_layer_hide) {
            $('.icon-drawing6').addClass('active');
            app.hide_drawing(target_layer);
            text_layer_hide = true;
        } else {
            $('.icon-drawing6').removeClass('active');
            app.show_drawing(target_layer);
            text_layer_hide = false;
        };
    } else if ($('.icon-drawing3').hasClass('active')) {
        target_layer = 'image_layer';

        if (!image_layer_hide) {
            $('.icon-drawing6').addClass('active');
            app.hide_drawing(target_layer);
            image_layer_hide = true;
        } else {
            $('.icon-drawing6').removeClass('active');
            app.show_drawing(target_layer);
            image_layer_hide = false;
        }
    };



    // if (!text_layer_hide) {
    //     $('.icon-drawing6').addClass('active');
    //     app.hide_drawing(target_layer);
    //     text_layer_hide = true;
    // } else {
    //     $('.icon-drawing6').removeClass('active');
    //     app.show_drawing(target_layer);
    //     text_layer_hide = false;
    // };

    // if (!image_layer_hide) {
    //     $('.icon-drawing6').addClass('active');
    //     app.hide_drawing(target_layer);
    //     image_layer_hide = true;
    // } else {
    //     $('.icon-drawing6').removeClass('active');
    //     app.show_drawing(target_layer);
    //     image_layer_hide = false;
    // }
});

// drawing stroke color change
$(document).on('click', '.palette', function () {
    if ($(this).hasClass('stroke_width')) {
        return;
    };
    $('.icon-drawing').addClass('active');
    $('.icon-drawing4').removeClass('active');
    var stroke_color = $(this).attr('data-color');
    $('.drawing-canvas').css('cursor', 'default');

    app.drawing_mode_change('brush');
    app.select_stroke_color(stroke_color);
});

// drawing stroke width change
$(document).on('click', '.drawing_stroke_width', function () {
    if ($(this).hasClass('palette')) {
        return;
    };

    var stroke_width = $(this).attr('data-strokewidth');
    $('.stroke_width i').css({ 'width': stroke_width, 'height': stroke_width });
    $('.stroke_width').click();

    app.select_stroke_width(stroke_width);
});

// 폰트 패밀리 선택
var board_font_family_change = false;
$(document).on('click', '#font_family', function () {
    if (!board_font_family_change) {
        $('.font_family_wrap').css('display', "inline-block");
        $('#font_family .caret').addClass('caret_change');
        $('#font_family .caret_change').removeClass('caret');
        board_font_family_change = true;

        $('.font_size_wrap').css('display', "none");
        $('#font_size .caret_change').addClass('caret');
        $('#font_size .caret').removeClass('caret_change');
        board_font_size_change = false;

        $('.font_color_wrap').css('display', 'none');
        $('.icon-font-color .caret_change').addClass('caret');
        $('.icon-font-color .caret').removeClass('caret_change');
        font_color_select_open = false;
    } else {
        $('.font_family_wrap').css('display', "none");
        $('#font_family .caret_change').addClass('caret');
        $('#font_family .caret').removeClass('caret_change');
        board_font_family_change = false;
    }
});
// 폰트 패밀리 변경
$(document).on('click', '.select_f_fm', function () {
    var _fontFamily = $(this).attr('data-font_family');
    app.text_fontFamily_change(_fontFamily);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "app.text_fontFamily_change('" + _fontFamily + "');"
    }));

    var change_text;
    if (_fontFamily == 'NanumGothic') {
        change_text = '나눔고딕';
    } else if (_fontFamily == 'NanumSquare') {
        change_text = '나눔스퀘어';
    } else if (_fontFamily == 'NanumSquare_bold') {
        change_text = '나눔스퀘어 Bold';
    } else if (_fontFamily == 'NanumMyeongjo') {
        change_text = '나눔명조';
    }

    $('.ff_text').text(change_text);
    $('#font_family').css('font-family', _fontFamily);

    // 선택 후 닫기
    $('#font_family').click();
});

// 폰트 사이즈 선택
var board_font_size_change = false;
$(document).on('click', '#font_size', function () {
    if (!board_font_size_change) {
        $('.font_size_wrap').css('display', "inline-block");
        $('#font_size .caret').addClass('caret_change');
        $('#font_size .caret_change').removeClass('caret');
        board_font_size_change = true;

        $('.font_family_wrap').css('display', "none");
        $('#font_family .caret_change').addClass('caret');
        $('#font_family .caret').removeClass('caret_change');
        board_font_family_change = false;

        $('.font_color_wrap').css('display', 'none');
        $('.icon-font-color .caret_change').addClass('caret');
        $('.icon-font-color .caret').removeClass('caret_change');
        font_color_select_open = false;
    } else {
        $('.font_size_wrap').css('display', "none");
        $('#font_size .caret_change').addClass('caret');
        $('#font_size .caret').removeClass('caret_change');
        board_font_size_change = false;
    }
});
// 폰트 사이즈 변경
$(document).on('click', '.select_f_fs', function () {
    var _fontSize = $(this).attr('data-font_size');

    var fs;
    if (_fontSize == '50') {
        fs = 67
    } else if (_fontSize == '60') {
        fs = 80
    } else if (_fontSize == '70') {
        fs = 93
    } else if (_fontSize == '80') {
        fs = 107
    } else if (_fontSize == '90') {
        fs = 120
    } else if (_fontSize == '100') {
        fs = 133
    };

    app.text_font_size_change(fs);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "app.text_font_size_change('" + fs + "');"
    }));

    $('.fs_text').text(_fontSize + 'pt');

    // 선택 후 닫기
    $('#font_size').click();
});

// 폰트 사이즈 크게
$(document).on('click', '.icon-font-lg', function () {
    var _fontSize = $('.fs_text').text().split('pt');

    var setFontSize = parseInt(_fontSize[0]) + 10;
    if (setFontSize > 100) {
        show_alert("가장 큰 폰트 사이즈는 100pt입니다.");
        return;
    } else {
        $('.fs_text').text(parseInt(setFontSize) + 'pt');

        var fs;
        if (setFontSize == '50') {
            fs = 67
        } else if (setFontSize == '60') {
            fs = 80
        } else if (setFontSize == '70') {
            fs = 93
        } else if (setFontSize == '80') {
            fs = 107
        } else if (setFontSize == '90') {
            fs = 120
        } else if (setFontSize == '100') {
            fs = 133
        };

        app.text_font_size_lg(fs);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "app.text_font_size_lg('" + fs + "');"
        }));
    }
});
// 폰트 사이즈 작게
$(document).on('click', '.icon-font-sm', function () {
    var _fontSize = $('.fs_text').text().split('pt');

    var setFontSize = parseInt(_fontSize[0]) - 10;
    if (setFontSize < 50) {
        show_alert("가장 작은 폰트 사이즈는 50pt입니다.");
        return;
    } else {
        $('.fs_text').text(parseInt(setFontSize) + 'pt');

        var fs;
        if (setFontSize == '50') {
            fs = 67
        } else if (setFontSize == '60') {
            fs = 80
        } else if (setFontSize == '70') {
            fs = 93
        } else if (setFontSize == '80') {
            fs = 107
        } else if (setFontSize == '90') {
            fs = 120
        } else if (setFontSize == '100') {
            fs = 133
        };

        app.text_font_size_sm(fs);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "app.text_font_size_sm('" + fs + "');"
        }));
    }
});

// 폰트 컬러 변경
$(document).on('click', '.font_palette', function () {
    var font_color = $(this).attr('data-fontcolor');
    $('.icon-font-color').click();
    $('.font_color_wrap').children('.font_palette').removeClass('active');
    $('.font_color_wrap button[data-fontcolor="' + font_color + '"]').addClass('active');
    $('.fc_change').css('background-color', font_color);
    if (font_color == '#ffffff') {
        $('.fc_change').css('border', '1px solid #666');
    } else {
        $('.fc_change').css('border', 'none');
    };
    app.text_font_fill(font_color);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "app.text_font_fill('" + font_color + "');"
    }));
});

// 수학 교구 - 각도기
$(document).on('click', '#math-tool-1', function () {
    app.create_protractor();
    viewer.resize();
});
// 수학 교구 - 삼각자
$(document).on('click', '#math-tool-2', function () {
    app.create_set_square();
    viewer.resize();
});
// 수학 교구 - 자
$(document).on('click', '#math-tool-4', function (e) {
    app.create_ruler();
    viewer.resize();
});
// 수학 교구 - 계산기
$(document).on('click', '#math-tool-3', function () {
    mirroring.api_sync_obj({
        target: "viewer",
        script: 'viewer.openCalculator();'
    });
    viewer.openCalculator();
});

$(document).on('click', '.calc_history', function () {
    viewer.handleCalculatorHistory();

    mirroring.api_sync_obj({
        target: "viewer",
        script: 'viewer.handleCalculatorHistory();'
    });
});

$(document).on('click', '#calc_close', function () {
    viewer.calculatorClose();

    mirroring.api_sync_obj({
        target: "viewer",
        script: 'viewer.calculatorClose();'
    });
});