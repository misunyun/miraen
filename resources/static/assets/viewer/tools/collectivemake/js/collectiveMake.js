$(document).ready(function () {
    if (window.location !== window.parent.location) {
        // The page is in an iframe	
    } else {
        // The page is not in an iframe	
        // if (!window.opener) {
            $('.close').hide();
        // }
    }
    $('#modum').focus();
});

$(document).on('click', '.close', function () {
    if (window.opener) {
        window.close();
    } else {
        window.dispatchEvent(new CustomEvent('close_window', {
        }));
    }
});

$('.alert_close').on('click', function () {
    alert_close();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "alert_close();"
    }));
});

function alert_close() {
    $('.alert_wrap').css('display', 'none');
}
function maxLengthCheck(object) {
    if (object.value.length > object.maxLength) {
        object.value = object.value.slice(0, object.maxLength);
    }
};

// 모둠만들기 수 6명 제한
$(document).on("keyup", "input[name^=modum]", function () {
    var val = $(this).val();
    if (val.replace(/[0-9]/g, "").length > 0) {
        $(this).val('');
    }
    if (val == '') {
        return
    }
    if (val < 2 || val > 6) {
        alert("2 ~ 6 사이의 숫자를 입력해주세요.");
        $(this).val('');
        return;
    }

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "$('input[name^=modum]').val(" + val + ");"
    }));
});
// 엔터키 이벤트 (시작 버튼 클릭과 동일 기능)
$('#modum').on('keydown', function (e) {
    if (e.which == 13 || e.keyCode == 13) {
        output_result();

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: 'output_result();'
        }));
    }
});
// result 클릭 시 
$('#reset_btn').on('click', function () {
    output_result();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: 'output_result();'
    }));
});

function output_result() {
    var setNum = $('#modum').val();
    if (setNum == null || setNum == '') {
        alert("2 ~ 6 사이의 숫자를 입력해주세요.");
        $('#modum').focus();
        return false;
    } else {
        // window.dispatchEvent(new CustomEvent('send_to_mirror', {
        //     type: "script",
        //     detail: '$("#inputData").submit();'
        // }));
        $('#cm_wrap').css('display', 'none');
        $('#cm_result_wrap').css('display', 'block');

        // margin-top
        switch (setNum) {
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
        };

        // branch 생성
        var _html = '';
        var beans_htmls = '';
        for (var index = 1; index <= 10; index++) {
            beans_htmls += "<div class='acorns acorns_hide' index='" + index + "'></div>";

        };
        for (var i = 1; i <= setNum; i++) {
            var branchs;
            if(i % 2 == 1) {
                branchs = 'branch_odd'
            } else {
                branchs = 'branch_even'
            };
            _html += "<div id='branch_" + i + "' class='branch "+branchs+"'><input type='text' id='modum_" + i + "' class='inp_tx_st' name ='name' value='" + i + " 모둠' maxlength='3'><div id='branch_wrap'>" + beans_htmls + "</div></div>"
        }
        $('#cr_bg_wrap').append(_html);
    }
};

// 모둠명 변경
$(document).on("keyup", "input[name^=name]", function () {
    var val = $(this).val();
    var get_id = $(this).attr('id');

    if( $('#'+get_id).val().length > $('#'+get_id).attr('maxlength')) {
        alert('세 글자 이상 입력하실 수 없습니다.');
        $('#'+get_id).val( $('#'+get_id).val().substr(0, $('#'+get_id).attr('maxlength')));
    };

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "$('#"+get_id+"').val('" + val + "');"
    }));
});

// 도토리 토글 function
function on_click_acorns(pod_id, bean_index) {
    var $bean = $("#"+pod_id+" .acorns[index='"+bean_index+"']");
    if ($bean.hasClass('acorns_hide')) {
        $bean.addClass('acorns_show');
        $bean.removeClass('acorns_hide');
    } else {
        $bean.addClass('acorns_hide');
        $bean.removeClass('acorns_show');
    }
};

// 도토리 클릭
$(document).on('click', '.acorns', function () {
    var pod_id = $(this).parent().parent().attr('id');
    var bean_index = $(this).attr('index');
    on_click_acorns(pod_id, bean_index);

    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "on_click_acorns('"+pod_id+"', '"+bean_index+"');"
    }));
});

// 결과 보기
function on_click_result_view() {
    var modum_num = $('#modum').val();
    // 초기화
    $('#best_modum').html('');

    // 도토리가 아무것도 없으면 취소
    if ($('.branch').children('div').children('.acorns_show').length == 0) {
        alert('점수를 획득한 모둠이 없습니다.')
        return;
    };

    var num_arr = [];
    // 도토리가 가장 많은 모둠 구하기
    for (var n = 1; n <= modum_num; n++) {
        // 도토리 개수 뽑아서 array 저장
        num_arr.push($('#branch_' + n).children('div').children('.acorns_show').length);
    };
    // 가장 높은 숫자 뽑기
    var best_num = Math.max.apply(null, num_arr);

    // 가장 많은 도토리를 갖고 있는 모둠 찾기
    var best_text = new Array();
    for (var b = 1; b <= modum_num; b++) {
        if ($('#branch_' + b).children('div').children('.acorns_show').length == best_num) {
            best_text.push($('#branch_' + b).children('input').val());
        }
    };
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
            $('#best_modum').css('top', '50%');
            $('.modum_text').width('30%');
            break;
        case 2:
            $('#best_modum').width('100%');
            $('#best_modum').css({'left': '14%', 'top':'50%'});
            $('.modum_text').width('30%');
            $('.modum_text').css('margin', '0 3%');
            break;
        case 3:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '2%');
            $('.modum_text').width('30%');
            $('#best_modum').css('top', '50%');
            $('.modum_text').css('margin', '0 0.8%');
            break;
        case 4:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '14%');
            $('#best_modum').css('top', '41%');
            $('.modum_text').width('30%');
            $('.modum_text').css('margin', '1% 3%');
            break;
        case 5:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '2%');
            $('#best_modum').css('top', '35%');
            $('.modum_text').width('30%');
            $('.modum_text').css({'margin': '1% 0.8%', 'top':'20%'});
            $('.modum_text').eq(3).css('left', '16%');
            $('.modum_text').eq(4).css('left', '17%');
            break;
        case 6:
            $('#best_modum').width('100%');
            $('#best_modum').css('left', '2%');
            $('#best_modum').css('top', '35%');
            $('.modum_text').width('30%');
            $('.modum_text').css({'margin': '1% 0.8%', 'top':'20%'});
            break;
        default:
    }
    // 모달 띄우기
    $('#cm_modal').css('display', 'block');
};

// 결과 확인
$(document).on('click', '#result_view', function () { 
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
};

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
};

// 모달 닫기
$('.popup_close').on('click', function () {
    on_click_popup_close();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "on_click_popup_close();"
    }));
});
