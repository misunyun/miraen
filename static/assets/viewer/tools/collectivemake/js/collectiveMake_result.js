// data 가져오기
var getParameters = function (paramName) {
    var returnValue;
    var url = location.href;
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == paramName.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }
};
var modum_num = getParameters('modum');

$(document).ready(function () {
    if (window.location !== window.parent.location) {
        // The page is in an iframe	
    } else {
        // The page is not in an iframe	
        if (!window.opener) {
            $('#close_btn').hide();
        }
    }

    // margin-top
    switch (modum_num) {
        case '2':
            $('#cr_bg_wrap').css('margin-top', '14%');
            break;
        case '3':
            $('#cr_bg_wrap').css('margin-top', '11%')
            break;
        case '4':
            $('#cr_bg_wrap').css('margin-top', '7%')
            break;
        case '5':
            $('#cr_bg_wrap').css('margin-top', '4%')
            break;
        case '6':
            $('#cr_bg_wrap').css('margin-top', '0')
            break;
        default:
            $('#cr_bg_wrap').css('margin-top', '0');
    }

    // bean_pod 생성
    var _html = '';
    var beans_html = "<div class='beans beans_hide'></div>";
    var beans_htmls = '';
    for (var index = 1; index <= 10; index++) {
        beans_htmls += "<div class='beans beans_hide' index='"+index+"'></div>";
        
    }
    for (var i = 1; i <= modum_num; i++) {
        // _html += "<div id='pod_" + i + "' class='bean_pod'><input type='text' id='modum_" + i + "' class='inp_tx_st' value='" + i + " 모둠' maxlength='5'><div id='beans_wrap'>" + beans_html.repeat(10) + "</div></div>"
        _html += "<div id='pod_" + i + "' class='bean_pod'><input type='text' id='modum_" + i + "' class='inp_tx_st' value='" + i + " 모둠' maxlength='5'><div id='beans_wrap'>" + beans_htmls + "</div></div>"
    }
    $('#cr_bg_wrap').append(_html);
});

$('#close_btn').on('click', function () {
    window.close();
});



function on_click_beans(pod_id, bean_index) {
    var $bean = $("#"+pod_id+" .beans[index='"+bean_index+"']");
    if ($bean.hasClass('beans_hide')) {
        $bean.addClass('beans_show');
        $bean.removeClass('beans_hide');
    } else {
        $bean.addClass('beans_hide');
        $bean.removeClass('beans_show');
    }
}
// 완두콩 토글
$(document).on('click', '.beans', function () {
    var pod_id = $(this).parent().parent().attr('id');
    var bean_index = $(this).attr('index');
    // console.log($("#"+pod_id+" .beans[index='"+bean_index+"']"));
    // console.log($(this));
    on_click_beans(pod_id, bean_index);
    // if ($(this)[0].classList[1] == 'beans_hide') {
    //     $(this).addClass('beans_show');
    //     $(this).removeClass('beans_hide');
    // } else {
    //     $(this).addClass('beans_hide');
    //     $(this).removeClass('beans_show');
    // }

    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "on_click_beans('"+pod_id+"', '"+bean_index+"');"
    }));
});


function on_click_result_view() {
    // 초기화
    $('#best_modum').html('');
    console.clear();
    // 완두콩이 아무것도 없으면 취소
    if ($('.bean_pod').children('div').children('.beans_show').length == 0) {
        return;
    }

    var num_arr = [];
    // 완두콩이 가장 많은 모둠 구하기
    for (var n = 1; n <= modum_num; n++) {
        // 완두콩 개수 뽑아서 array 저장
        num_arr.push($('#pod_' + n).children('div').children('.beans_show').length);
    }
    // 가장 높은 숫자 뽑기
    var best_num = Math.max.apply(null, num_arr);

    // 가장 많은 완두콩을 뽑고 있는 모둠 찾기
    var best_text = new Array();
    for (var b = 1; b <= modum_num; b++) {
        if ($('#pod_' + b).children('div').children('.beans_show').length == best_num) {
            best_text.push($('#pod_' + b).children('input').val());
        }
    }
    // 모둠 이름 화면에 추가
    var _html = '';
    for (var k = 0; k <= best_text.length - 1; k++) {
        _html += '<span class="modum_text">' + best_text[k] + '</span>'
    }
    $('#best_modum').append(_html);

    // 모둠 개수마다 위치 변경
    switch (best_text.length) {
        case 1:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '34%');
            $('#best_modum').css('top', '45%');
            $('.modum_text').width('30%');
            break;
        case 2:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '14%');
            $('.modum_text').width('30%');
            $('.modum_text').css('margin', '0 3%');
            break;
        case 3:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '2%');
            $('.modum_text').width('30%');
            $('#best_modum').css('top', '45%');
            $('.modum_text').css('margin', '0 0.8%');
            break;
        case 4:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '14%');
            $('#best_modum').css('top', '35%');
            $('.modum_text').width('30%');
            $('.modum_text').css('margin', '1% 3%');
            break;
        case 5:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '2%');
            $('#best_modum').css('top', '35%');
            $('.modum_text').width('30%');
            $('.modum_text').css('margin', '1% 0.8%');
            $('.modum_text').eq(3).css('left', '16%');
            $('.modum_text').eq(4).css('left', '17%');
            break;
        case 6:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '2%');
            $('#best_modum').css('top', '35%');
            $('.modum_text').width('30%');
            $('.modum_text').css('margin', '1% 0.8%');
            break;
        default:
    }
    // 모달 띄우기
    $('#cm_modal').css('display', 'block');
    pop();
    window.setTimeout(render, 500);
}
// 결과 확인
$('#result_view').on('click', function () {
    on_click_result_view();

    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "on_click_result_view();"
    }));
});

function on_click_reset() {
    // window.open('collectiveMake.html', '_self');
    var urls = location.href.split('/');
    urls[urls.length-1] = 'index.html';
    var open_url = urls.join("/");
    window.location.href = open_url;
}
// 처음으로
$('#reset').on('click', function () {
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "on_click_reset();"
    }));
    on_click_reset();
});

function on_click_popup_close() {
    $('#cm_modal').css('display', 'none');
}
// 모달 닫기
$('.popup_close').on('click', function () {
    on_click_popup_close();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "on_click_popup_close();"
    }));
});

// 축하 pop
var colors = ["#eb6383", "#fa9191", "#ffe9c5", "#b4f2e1"];
var particles = [];
function pop() {
    for (var i = 0; i < 150; i++) {
        var p = document.createElement('particule');
        p.x = window.innerWidth * 0.5;
        p.y = window.innerHeight + (Math.random() * window.innerHeight * 0.3);
        p.vel = {
            x: (Math.random() - 0.5) * 10,
            y: Math.random() * -20 - 15
        };
        p.mass = Math.random() * 0.2 + 0.8;
        particles.push(p);
        p.style.transform = 'translate(${p.x}px, ${p.y}px)';
        var size = Math.random() * 15 + 5;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.zIndex = '12';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(p);
    }
};
function render() {
    for (var i = particles.length - 1; i--; i > -1) {
        var p = particles[i];
        p.style.transform = 'translate3d(${p.x}px, ${p.y}px, 1px)';

        p.x += p.vel.x;
        p.y += p.vel.y;

        p.vel.y += (0.5 * p.mass);
        if (p.y > (window.innerHeight * 2)) {
            p.remove();
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(render);
};
