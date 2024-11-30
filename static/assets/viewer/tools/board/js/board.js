var drawing_canvas = undefined;
var board_playlist_id = null;
var board_playing_id = null;
var board_user_id = null;
var board_thumbnail = null;
var board_info_title = null;
var board_playlist_title = null;
var board_page = null;
var board_mode = null;
var board_type = null;

$(document).ready(function () {
    if (window.location !== window.parent.location) {
        // The page is in an iframe	
        // $('#drawing').css('left', '10%');
        $('#drawing').css('left', '5%');
    } else {
        // The page is not in an iframe	
        // if (!window.opener) {
        $('#board_wrap').width(1920);
        $('#board_wrap').height(937);
        $('#board_wrap').css({'transform' : 'scale(' +board_scale().scaleX+', '+board_scale().scaleY+')'})

        $('#drawing').css('left', '20%');
        $('.close').hide();
        // $('#drawing').css('bottom','-10%');
        // }
    };

    drawing_canvas = new DrawingCanvas({ container_id: 'board_container', 'id': 'board_stage' });
    drawing_canvas.type = 'BOARD';
    drawing_canvas.stage.attrs.width = $('#board_container').width();
    drawing_canvas.stage.attrs.height = $('#board_container').height();

    // 시작하자마자 입력창 열기 - 너무 빨리 열리면 textarea 생성이 늦음
    setTimeout(function () {
        drawing_canvas.board_start();

        if (window.location !== window.parent.location) {
            drawing_canvas.save_on = true;
        } else {
            drawing_canvas.save_on = false;
        };

    }, 500);


    // viewer에서 사용중인 canvas정보 보내기
    canvas_save_load.get_canvas_data(drawing_canvas);

    var iframe_data = parent.document.iframe_board_send_data;

    if (iframe_data) {
        board_playlist_id = parent.document.getElementById('ibsd_playlist').value;
        board_playing_id = parent.document.getElementById('ibsd_plying_id').value;
        board_user_id = parent.document.getElementById('ibsd_user_id').value;
        board_thumbnail = parent.document.getElementById('ibsd_thumbnail').value;
        board_info_title = parent.document.getElementById('ibsd_info_title').value;
        board_playlist_title = parent.document.getElementById('ibsd_playlist_title').value;
        board_page = parent.document.getElementById('ibsd_page').value;
        board_mode = parent.document.getElementById('ibsd_mode').value;
        board_type = drawing_canvas.type;

        // viewer의 playing_id 보내기
        canvas_save_load.get_page_data(board_playlist_id, board_playing_id, board_user_id, board_thumbnail, board_info_title, board_playlist_title, board_page, board_type);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "canvas_save_load.get_page_data('" + board_playlist_id + "', '" + board_playing_id + "', '" + board_user_id + "', '" + board_thumbnail + "', '" + board_info_title + "', '" + board_playlist_title + "', '" + board_page + "', '" + board_type + "');"
        }));

        // // 저장된 그림이 있으면 표시
        canvas_save_load.canvas_load(board_playlist_id, board_playing_id, board_user_id, board_type, board_mode);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "canvas_save_load.canvas_load('" + board_playlist_id + "', '" + board_playing_id + "', '" + board_user_id + "', '" + board_type + "', '" + board_mode + "');"
        }));

    }

    // 영역 밖으로 나갔을 때 그리기 멈춤
    var mouseTarget = document.getElementById('board_container');
    mouseTarget.addEventListener('mouseleave', function (e) {
        if (drawing_canvas)
            drawing_canvas.stop_drawline();
    });
});

$(window).on('beforeunload', function () {
    if (drawing_canvas)
        drawing_canvas.destroy();
        drawing_canvas = undefined;
});

$(window).on('resize', function () {
    if(window.location === window.parent.location) {
        $('#board_wrap').css({'transform' : 'scale(' +board_scale().scaleX+', '+board_scale().scaleY+')'})
    } else {
        containerResize();
    };
});

// 닫기 클릭
$(document).on('click', '.close', function () {
    if (window.opener) {
        window.close();
    } else {
        window.dispatchEvent(new CustomEvent('close_window', {
        }));
        $('.drawing-canvas-wrapper').removeClass('hidden');
    }
});

// common - resize
function containerResize() {
    $('.konvajs-content').width($('#board_container').width());
    $('.konvajs-content').height($('#board_container').height());
    $('canvas').width($('#board_container').width());
    $('canvas').height($('#board_container').height());

    if (drawing_canvas) {
        drawing_canvas.fitStage();
    }
};

function board_scale() {
    var b_w = window.innerWidth || document.body.clientWidth;
    var b_h = window.innerHeight || document.body.clientHeight;
    var per = 0;
    var perWidth = b_w / 1920;
    var perHeight = b_h / 937;

    if (perWidth > perHeight) {
        per = perWidth;
    } else {
        per = perHeight;
    }
    return { 'scale': per, 'scaleX': perWidth, 'scaleY': perHeight };
};

// drawing mode change
// 그리기
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

    if (drawing_canvas.drawingLayer.attrs.visible == false) {
        $('.icon-drawing6').addClass('active');
        drawing_layer_hide = false;
    } else if (drawing_canvas.drawingLayer.attrs.visible == true || drawing_canvas.drawingLayer.attrs.visible == undefined) {
        $('.icon-drawing6').removeClass('active');
        drawing_layer_hide = true;
    };

    drawing_canvas.activateBrush();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.activateBrush();"
    }));

    drawing_canvas.transformer_destroy();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.transformer_destroy();"
    }));
});
// 텍스트
$(document).on('click', '.icon-drawing2', function () {
    $('#font_select').css('display', 'inline-block');
    $('#palette').css('display', 'none');
    $('#image_select').css('display', 'none');
    $('.icon-drawing4').css('display', 'none');

    $('.icon-drawing').removeClass('active');
    $('.icon-drawing2').addClass('active');
    $('.icon-drawing3').removeClass('active');
    $('.icon-drawing6').removeClass('active');

    if (drawing_canvas.textLayer.attrs.visible == false) {
        $('.icon-drawing6').addClass('active');
        text_layer_hide = true;
    } else if (drawing_canvas.textLayer.attrs.visible == true || drawing_canvas.textLayer.attrs.visible == undefined) {
        $('.icon-drawing6').removeClass('active');
        text_layer_hide = false;
    }

    drawing_canvas.transformer_destroy();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.transformer_destroy();"
    }));

    drawing_canvas.setMode('text');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('text');"
    }));
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

    if ($('.icon-hlighter').hasClass('active')) {
        $('.icon-drawing4').css('display', 'inline-block');
    } else {
        $('.icon-drawing4').css('display', 'none');
    }

    if (drawing_canvas.imageLayer.attrs.visible == false) {
        $('.icon-drawing6').addClass('active');
        image_layer_hide = true;
    } else if (drawing_canvas.imageLayer.attrs.visible == true || drawing_canvas.imageLayer.attrs.visible == undefined) {
        $('.icon-drawing6').removeClass('active');
        image_layer_hide = false;
    };

    drawing_canvas.transformer_destroy();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.transformer_destroy();"
    }));

    drawing_canvas.setMode('image');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('image');"
    }));

});
// 도형 - 화살표
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

    drawing_canvas.stop_drawHlighter();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.stop_drawHlighter();"
    }));

    drawing_canvas.transformer_destroy();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.transformer_destroy();"
    }));

    drawing_canvas.setMode('arrow');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('arrow');"
    }));

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
    $('.icon-arrow-color').css('background-color', arrow_color);
    $('.arrow_color_wrap').children('.arrow_palette').removeClass('active');
    $('.arrow_color_wrap button[data-arrowcolor="' + arrow_color + '"]').addClass('active');

    if (arrow_color == '#ffffff') {
        $('.icon-arrow-color').css('border', '2px solid #d5d5d5');
    } else {
        $('.icon-arrow-color').css('border', 'none');
    };

    drawing_canvas.setMode('arrow');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('arrow');"
    }));

    drawing_canvas.arrow_color_change(arrow_color);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.arrow_color_change('" + arrow_color + "');"
    }));
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
        $('.select_arrow_direction_1').css('background-image', 'url("./../../img/viewer/icon-figure5-1-active.png")');
        $('.select_arrow_direction_2').css('background-image', 'url("./../../img/viewer/icon-figure5-2.png")');
        $('.select_arrow_direction_3').css('background-image', 'url("./../../img/viewer/icon-figure5-3.png")');
    } else if (direction == 'reverse') {
        $('.select_arrow_direction_1').css('background-image', 'url("./../../img/viewer/icon-figure5-1.png")');
        $('.select_arrow_direction_2').css('background-image', 'url("./../../img/viewer/icon-figure5-2-active.png")');
        $('.select_arrow_direction_3').css('background-image', 'url("./../../img/viewer/icon-figure5-3.png")');
    } else if (direction == 'bidirectional') {
        $('.select_arrow_direction_1').css('background-image', 'url("./../../img/viewer/icon-figure5-1.png")');
        $('.select_arrow_direction_2').css('background-image', 'url("./../../img/viewer/icon-figure5-2.png")');
        $('.select_arrow_direction_3').css('background-image', 'url("./../../img/viewer/icon-figure5-3-active.png")');
    };

    drawing_canvas.setMode('arrow');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('arrow');"
    }));

    drawing_canvas.arrow_direction_change(direction);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.arrow_direction_change('" + direction + "');"
    }));
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
        $('.select_arrow_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1-active.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5.png")');
    } else if (width == 4) {
        $('.select_arrow_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2-active.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5.png")');
    } else if (width == 6) {
        $('.select_arrow_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3-active.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5.png")');
    } else if (width == 8) {
        $('.select_arrow_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4-active.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5.png")');
    } else if (width == 10) {
        $('.select_arrow_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5-active.png")');
    }
    drawing_canvas.setMode('arrow');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('arrow');"
    }));

    drawing_canvas.arrow_width_change(width);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.arrow_width_change('" + width + "');"
    }));
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
        $('.select_arrow_dash_1').css('background-image', 'url("./../../img/viewer/icon-figure7-1-active.png")');
        $('.select_arrow_dash_2').css('background-image', 'url("./../../img/viewer/icon-figure7-2.png")');
        $('.select_arrow_dash_3').css('background-image', 'url("./../../img/viewer/icon-figure7-3.png")');
    } else if (dash == 'dash_2') {
        $('.select_arrow_dash_1').css('background-image', 'url("./../../img/viewer/icon-figure7-1.png")');
        $('.select_arrow_dash_2').css('background-image', 'url("./../../img/viewer/icon-figure7-2-active.png")');
        $('.select_arrow_dash_3').css('background-image', 'url("./../../img/viewer/icon-figure7-3.png")');
    } else if (dash == 'dash_3') {
        $('.select_arrow_dash_1').css('background-image', 'url("./../../img/viewer/icon-figure7-1.png")');
        $('.select_arrow_dash_2').css('background-image', 'url("./../../img/viewer/icon-figure7-2.png")');
        $('.select_arrow_dash_3').css('background-image', 'url("./../../img/viewer/icon-figure7-3-active.png")');
    };

    drawing_canvas.setMode('arrow');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('arrow');"
    }));

    drawing_canvas.arrow_dash_change(dash);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.arrow_dash_change('" + dash + "');"
    }));
});
// 도형 - 직선
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

    drawing_canvas.setMode('image');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('image');"
    }));

    drawing_canvas.stop_drawHlighter();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.stop_drawHlighter();"
    }));

    drawing_canvas.transformer_destroy();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.transformer_destroy();"
    }));

    drawing_canvas.setMode('straight');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('straight');"
    }));
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
    $('.icon-line-color').css('background-color', line_color);
    $('.line_color_wrap').children('.line_palette').removeClass('active');
    $('.line_color_wrap button[data-linecolor="' + line_color + '"]').addClass('active');

    if (line_color == '#ffffff') {
        $('.icon-line-color').css('border', '2px solid #d5d5d5');
    } else {
        $('.icon-line-color').css('border', 'none');
    };
    drawing_canvas.setMode('straight');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('straight');"
    }));

    drawing_canvas.line_color_change(line_color);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.line_color_change('" + line_color + "');"
    }));
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
        $('.select_line_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1-active.png")');
        $('.select_line_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5.png")');
    } else if (width == 4) {
        $('.select_line_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2-active.png")');
        $('.select_line_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5.png")');
    } else if (width == 6) {
        $('.select_line_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3-active.png")');
        $('.select_line_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5.png")');
    } else if (width == 8) {
        $('.select_line_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4-active.png")');
        $('.select_line_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5.png")');
    } else if (width == 10) {
        $('.select_line_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./../../img/viewer/icon-figure6-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./../../img/viewer/icon-figure6-5-active.png")');
    }
    drawing_canvas.setMode('straight');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('straight');"
    }));

    drawing_canvas.line_width_change(width);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.line_width_change('" + width + "');"
    }));
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
        $('.select_line_dash_1').css('background-image', 'url("./../../img/viewer/icon-figure7-1-active.png")');
        $('.select_line_dash_2').css('background-image', 'url("./../../img/viewer/icon-figure7-2.png")');
        $('.select_line_dash_3').css('background-image', 'url("./../../img/viewer/icon-figure7-3.png")');
    } else if (dash == 'dash_2') {
        $('.select_line_dash_1').css('background-image', 'url("./../../img/viewer/icon-figure7-1.png")');
        $('.select_line_dash_2').css('background-image', 'url("./../../img/viewer/icon-figure7-2-active.png")');
        $('.select_line_dash_3').css('background-image', 'url("./../../img/viewer/icon-figure7-3.png")');
    } else if (dash == 'dash_3') {
        $('.select_line_dash_1').css('background-image', 'url("./../../img/viewer/icon-figure7-1.png")');
        $('.select_line_dash_2').css('background-image', 'url("./../../img/viewer/icon-figure7-2.png")');
        $('.select_line_dash_3').css('background-image', 'url("./../../img/viewer/icon-figure7-3-active.png")');
    };
    drawing_canvas.setMode('straight');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('straight');"
    }));

    drawing_canvas.line_dash_change(dash);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.line_dash_change('" + dash + "');"
    }));
});
// 도형 - 형광펜
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

    drawing_canvas.opacity = 0.5;

    drawing_canvas.setMode('hlighter');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('hlighter');"
    }));

    drawing_canvas.transformer_destroy();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.transformer_destroy();"
    }));
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
    $('.icon-hlighter-color').css('background-color', hlighter_color);
    $('#image_select').children('.hlighter_wrap').children('.select_hlighter_color_wrap').children('button').removeClass('active');
    $('#image_select button[data-hlightercolor="' + hlighter_color + '"]').addClass('active');

    if (hlighter_color == '#ffffff') {
        $('.icon-hlighter-color').css('border', '2px solid #d5d5d5');
    } else {
        $('.icon-hlighter-color').css('border', 'none');
    };

    drawing_canvas.opacity = 0.5;

    drawing_canvas.setMode('hlighter');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('hlighter');"
    }));

    drawing_canvas.transformer_destroy();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.transformer_destroy();"
    }));

    drawing_canvas.select_change_hlighter_color(hlighter_color);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.select_change_hlighter_color('" + hlighter_color + "');"
    }));
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
        $('.select_hlighter_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1-active.png")');
        $('.select_hlighter_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_hlighter_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
    } else if (hlighter_width == '18') {
        $('.select_hlighter_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_hlighter_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2-active.png")');
        $('.select_hlighter_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3.png")');
    } else if (hlighter_width == '24') {
        $('.select_hlighter_width_1').css('background-image', 'url("./../../img/viewer/icon-figure6-1.png")');
        $('.select_hlighter_width_2').css('background-image', 'url("./../../img/viewer/icon-figure6-2.png")');
        $('.select_hlighter_width_3').css('background-image', 'url("./../../img/viewer/icon-figure6-3-active.png")');
    };
    drawing_canvas.opacity = 0.5;

    drawing_canvas.setMode('hlighter');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('hlighter');"
    }));

    drawing_canvas.transformer_destroy();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.transformer_destroy();"
    }));

    drawing_canvas.select_change_hlighter_width(hlighter_width);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.select_change_hlighter_width('" + hlighter_width + "');"
    }));
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

    drawing_canvas.setMode('image');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('image');"
    }));

    drawing_canvas.stop_drawHlighter();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.stop_drawHlighter();"
    }));
});
// 도형 - 스티커 선택
$(document).on('click', '.sticker_select', function () {
    var select_sticker = $(this).attr('data-sticker');
    var _url = "./../../img/viewer/" + select_sticker + ".png";

    drawing_canvas.setMode('image');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.setMode('image');"
    }));

    drawing_canvas.stop_drawHlighter();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.stop_drawHlighter();"
    }));

    drawing_canvas.make_sticker(_url);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.make_sticker('" + _url + "');"
    }));
});
// 그리기 색상 변경
$(document).on('click', '.palette', function () {
    if ($(this).hasClass('stroke_width')) {
        return;
    };
    $('.icon-drawing').addClass('active');
    $('.icon-drawing4').removeClass('active');
    var stroke_color = $(this).attr('data-color');
    $('#palette').children('.palette').removeClass('active');
    $('#palette button[data-color="' + stroke_color + '"]').addClass('active');

    drawing_canvas.activateBrush();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.activateBrush();"
    }));

    drawing_canvas.transformer_destroy();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.transformer_destroy();"
    }));

    drawing_canvas.drawLineStroke_change(stroke_color);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.drawLineStroke_change('" + stroke_color + "');"
    }));
});
// 선 굵기
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

// 선 굵기 -> 2022.01.03 클릭 선택 형태에서 range형태로 변경
$(document).on('input change','#board_wrap .lineRange', function(e) {
    var _width = Math.round($(this).val());  

    $('#board_wrap #palette .palette.stroke_width i').css({
        width :  _width,
        height : _width
    });

    drawing_canvas.drawLineStrokeWidth_change(_width);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.drawLineStrokeWidth_change('" + _width + "');"
    }));

    // app.select_stroke_width(_width);
});

// 선 굵기 변경
// $(document).on('click', '.drawing_stroke_width', function () {
//     if ($(this).hasClass('palette')) {
//         return;
//     };

//     var stroke_width = $(this).attr('data-strokewidth');

//     $('.stroke_width i').css({ 'width': stroke_width, 'height': stroke_width });

//     $('.stroke_width_wrap').children('.drawing_stroke_width').children('i').removeClass('active');
//     $('.stroke_width_wrap button[data-strokewidth="' + stroke_width + '"] i').addClass('active');
//     $('.stroke_width').click();

//     drawing_canvas.drawLineStrokeWidth_change(stroke_width);

//     window.dispatchEvent(new CustomEvent('send_to_mirror', {
//         type: "script",
//         detail: "drawing_canvas.drawLineStrokeWidth_change('" + stroke_width + "');"
//     }));
// });

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
    drawing_canvas.text_fontFamily_change(_fontFamily);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.text_fontFamily_change('" + _fontFamily + "');"
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

    drawing_canvas.text_fontSize_change(fs);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.text_fontSize_change('" + fs + "');"
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
        alert("가장 큰 폰트 사이즈는 100pt입니다.");
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

        drawing_canvas.text_font_size_lg(fs);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "drawing_canvas.text_font_size_lg('" + fs + "');"
        }));
    }
});

// 폰트 사이즈 작게
$(document).on('click', '.icon-font-sm', function () {
    var _fontSize = $('.fs_text').text().split('pt');

    var setFontSize = parseInt(_fontSize[0]) - 10;
    if (setFontSize < 50) {
        alert("가장 작은 폰트 사이즈는 50pt입니다.");
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

        drawing_canvas.text_font_size_sm(fs);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "drawing_canvas.text_font_size_sm('" + fs + "');"
        }));
    }
});

// 폰트 색상
var font_color_select_open = false;
$(document).on('click', '.icon-font-color', function () {
    if (!font_color_select_open) {
        $('.font_color_wrap').css('display', 'block');
        $('.icon-font-color .caret').addClass('caret_change');
        $('.icon-font-color .caret_change').removeClass('caret');
        font_color_select_open = true;

        $('.font_size_wrap').css('display', "none");
        $('#font_size .caret_change').addClass('caret');
        $('#font_size .caret').removeClass('caret_change');
        board_font_size_change = false;

        $('.font_family_wrap').css('display', "none");
        $('#font_family .caret_change').addClass('caret');
        $('#font_family .caret').removeClass('caret_change');
        board_font_family_change = false;
    } else {
        $('.font_color_wrap').css('display', 'none');
        $('.icon-font-color .caret_change').addClass('caret');
        $('.icon-font-color .caret').removeClass('caret_change');
        font_color_select_open = false;
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
    drawing_canvas.text_font_fill(font_color);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "drawing_canvas.text_font_fill('" + font_color + "');"
    }));
});


// 지우개
$(document).on('click', '.icon-drawing4', function () {
    $('.icon-drawing4').addClass('active');

    // 그리기에서 지우개 선택
    if ($('.icon-drawing').hasClass('active')) {
        drawing_canvas.activateEraser();

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "drawing_canvas.activateEraser();"
        }));
    }
});

// 초기화
$(document).on('click', '.icon-drawing5', function () {
    var _target;
    var target_layer;

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

    var _result = confirm(_target + '를 모두 삭제하시겠습니까?');
    if (_result) {
        if (target_layer == 'drawing') {
            drawing_canvas.clear();

            window.dispatchEvent(new CustomEvent('send_to_mirror', {
                type: "script",
                detail: "drawing_canvas.clear();"
            }));
        } else if (target_layer == 'text') {
            drawing_canvas.text_clear();

            window.dispatchEvent(new CustomEvent('send_to_mirror', {
                type: "script",
                detail: "drawing_canvas.text_clear();"
            }));
        } else if (target_layer == 'image') {
            drawing_canvas.image_clear();

            window.dispatchEvent(new CustomEvent('send_to_mirror', {
                type: "script",
                detail: "drawing_canvas.image_clear();"
            }));
        }
    }
});

// 가리기
var drawing_layer_hide = false;
var text_layer_hide = false;
var image_layer_hide = false;
$(document).on('click', '.icon-drawing6', function () {
    $('.icon-drawing4').removeClass('active');
    $('.icon-drawing5').removeClass('active');

    var target_layer = '';
    if ($('.icon-drawing').hasClass('active')) {
        target_layer = 'drawing_layer'
    } else if ($('.icon-drawing2').hasClass('active')) {
        target_layer = 'text_layer'
    } else if ($('.icon-drawing3').hasClass('active')) {
        target_layer = 'image_layer'
    };

    if (!drawing_layer_hide) {
        $('.icon-drawing6').addClass('active');
        drawing_canvas.hide(target_layer);
        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "drawing_canvas.hide('" + target_layer + "');"
        }));
        drawing_layer_hide = true;
    } else {
        $('.icon-drawing6').removeClass('active');
        drawing_canvas.show(target_layer);
        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "drawing_canvas.show('" + target_layer + "');"
        }));
        drawing_layer_hide = false;
    };

    if (!text_layer_hide) {
        $('.icon-drawing6').addClass('active');
        drawing_canvas.hide(target_layer);
        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "drawing_canvas.hide('" + target_layer + "');"
        }));
        text_layer_hide = true;
    } else {
        $('.icon-drawing6').removeClass('active');
        drawing_canvas.show(target_layer);
        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "drawing_canvas.show('" + target_layer + "');"
        }));
        text_layer_hide = false;
    };

    if (!image_layer_hide) {
        $('.icon-drawing6').addClass('active');
        drawing_canvas.hide(target_layer);
        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "drawing_canvas.hide('" + target_layer + "');"
        }));
        image_layer_hide = true;
    } else {
        $('.icon-drawing6').removeClass('active');
        drawing_canvas.show(target_layer);
        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "drawing_canvas.show('" + target_layer + "');"
        }));
        image_layer_hide = false;
    }
});