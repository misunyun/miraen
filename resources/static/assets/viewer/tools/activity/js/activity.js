$(document).ready(function () {
    if (window.location !== window.parent.location) {
        // The page is in an iframe	
    } else {
        // The page is not in an iframe	
        // if (!window.opener) {
            $('.close').hide();
        // }
    };
    // 입력값 모두 초기화
    $('#inputUser').val('');
    $('#allUser').val('');
    $('#allUser').focus();

    // 병아리 움직이기
    var bg_num = 1;
    setInterval(function () {
        bg_num++;
        if (bg_num > 2) {
            bg_num = 1;
        }
        $('.chick').css('background-image', 'url("./images/chick_' + bg_num + '.png")')
    }, 500);
});

// 닫기
$(document).on('click', '.close', function () {
    if (window.opener) {
        window.close();
    } else {
        window.dispatchEvent(new CustomEvent('close_window', {
        }));

    }
});

// 
function maxLengthCheck(object) {
    if (object.value.length > object.maxLength) {
        object.value = object.value.slice(0, object.maxLength);
    }
};

// 활동시킴이 수 10명 제한
$(document).on("keyup", "input[name^=inputUser]", function () {
    var val = $(this).val();
    if (val.replace(/[0-9]/g, "").length > 0) {
        $(this).val('');
    };

    if (val == '') {
        return
    };

    if (val < 1 || val > 10) {
        alert("1 ~ 10까지 입력 가능합니다.");
        $(this).val('');
        return;
    };

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "$('input[name^=inputUser]').val(" + val + ");"
    }));
});

// 총 학생 수 40명 제한
$(document).on("keyup", "input[name^=allUser]", function () {
    var val = $(this).val();
    if (val.replace(/[0-9]/g, "").length > 0) {
        $(this).val('');
    };

    if (val == '') {
        return
    };

    if (val < 1 || val > 40) {
        alert("40 이상 입력할 수 없습니다.");
        $(this).val('');
        return;
    };

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "$('input[name^=allUser]').val(" + val + ");"
    }));
});

// 엔터키 이벤트 (시작 버튼 클릭과 동일 기능)
$('#inputUser').on('keydown', function (e) {
    if (e.which == 13 || e.keyCode == 13) {
        output_result();
    }
});

$('.activity_bg_body_right').on('click', function () {
    output_result();
});

// 시작 뽑기
function output_result() {
    var all = $('#allUser').val();
    var setNum = $('#inputUser').val();

    if ((setNum == null || setNum == '') || (all == null || all == '')) {
        if (all == '') {
            alert("학급 학생 수를 입력해 주세요.");
            $('#allUser').focus();
        } else if (setNum == '') {
            alert("발표자 수를 입력해 주세요.");
            $('#inputUser').focus();
        };
        return;
    } else if (setNum == '0') {
        alert("한 명 이상 입력해 주세요.");
        // alert("한 명 이상 입력해주세요.");
        $('#inputUser').val('')
        $('#inputUser').focus();
        return;
    } else if (parseInt(all) < parseInt(setNum)) {
        alert("학급 학생 수보다 발표자 수가 큽니다.");
        // alert("학생 수보다 활동시킴이 수가 큽니다.");
        $('#inputUser').val('');
        $('#inputUser').focus();
        return;
    } else {
        make_egg(all);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "make_egg(" + all + ");"
        }));
    };
};

// 달걀 만들기
function make_egg(all) {
    // 입력 화면 가리고 결과 화면 보이기
    $('#activity_wrap').css('display', 'none');
    $('#activity_result_wrap').css('display', 'block');

    var _html = '';
    for (var i = 1; i <= all; i++) {
        _html += '<div class="egg_straw"><div class="result_egg egg_' + i + '"></div><div class="result_straw"></div></div>'
    }
    $('#egg_wrap').append(_html);
};

// 처음으로
$('#reset_btn').on('click', function () {
    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "do_reset_btn();"
    }));
    do_reset_btn();
});

// 처음으로 버튼
function do_reset_btn() {
    $('#egg_wrap').empty();
    $('#result_egg_wrap').empty();
    $('#allUser').val('');
    $('#inputUser').val('');
    $('#activity_wrap').css('display', 'block');
    $('#activity_result_wrap').css('display', 'none');
    $('#activity_result_btn').css('display', 'block');
    $('#reset_btn').css('margin', '0 5%');
};

function activity_result_action(result) {
    var setNum = $('#inputUser').val();
    // 결과물 html 생성
    var _html = '';
    for (var r = 0; r < setNum; r++) {
        // 하단에 결과 출력
        var num = Math.floor(Math.random() * 4) + 1;
        _html += '<div class="result_eggs result_eggs_' + num + '"><span class="re_num">' + result[r] + '</span></div>';

        // 상단에 빈 자리 만들어주기
        $('.egg_' + result[r]).stop(true).css({ 'opacity': 1 }).animate({ 'opacity': 0 }, 800);
    }

    $('#result_egg_wrap').append(_html);
    // $('.result_eggs').addClass('result_egg_wrap_motion');

    $('.result_eggs').stop(true).css({ 'opacity': 0 }).animate({ 'opacity': 1 }, 1000);
};

// 버튼들 가리기
function hide_buttons() {
    $('#activity_result_btn').css('display', 'none');
    $('#reset_btn').css('margin', '0 30%');
};

// 알깨기 시작
$('#activity_result_btn').on('click', function () {
    // 여러번 클릭 방지를 위해 버튼 숨기기
    hide_buttons();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "hide_buttons();"
    }));

    var all = $('#allUser').val();
    var setNum = $('#inputUser').val();
    // 랜덤 번호 생성
    var result = [];
    var n = 0;
    while (n < setNum) {
        var num = Math.floor(Math.random() * all) + 1;
        if (!sameNum(num)) {
            result.push(num);
            n++;
        }
    };
    // 중복 제거
    function sameNum(num) {
        for (var i = 0; i < setNum; i++) {
            if (num === result[i]) {
                return true;
            }
        }
        return false;
    };

    var result_str = '[' + result.join(',') + ']';

    // 선택된 번호 알에 금가기 motion
    egg_motion(result);
    
    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "egg_motion("+result_str+");"
    }));
    // 금 가고 2초 뒤 결과 보이기
    setTimeout_active(result);

    // $('.alert_wrap').stop(true).css({ 'opacity': 0, 'display':'block' }).animate({ 'opacity': 1}, '2000');
    // $('.alert_wrap').fadeOut(2000, 'swing');

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "setTimeout_active(" + result_str + ");"
    }));
});

function egg_motion(result) {
    var setNum = $('#inputUser').val();
    for (var v = 0; v < setNum; v++) {
        $('.egg_' + result[v]).css({ 'background-image': "url('./images/eggleak.png')" });
        $('.egg_' + result[v]).addClass('eggleak_motion');
    };
};

function setTimeout_active(result) {
    setTimeout(function () {
        activity_result_action(result);
    }, 2000);
};