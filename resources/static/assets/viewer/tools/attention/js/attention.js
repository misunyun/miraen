$(document).ready(function () {
    if (window.location !== window.parent.location) {
        // The page is in an iframe	
    } else {
        // The page is not in an iframe	
        // if (!window.opener) {
            $('.close').hide();
        // }
    }
});

$(document).on('click', '.close', function () {
    if (window.opener) {
        window.close();
    } else {
        window.dispatchEvent(new CustomEvent('close_window', {
        }));
    }
});

$('.btn_1').on('click', function () {
    btn_1_on_click();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "btn_1_on_click();"
    }));
});

$('.btn_2').on('click', function () {
    btn_2_on_click();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "btn_2_on_click();"
    }));
});

$('.btn_3').on('click', function () {
    btn_3_on_click();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "btn_3_on_click();"
    }));
});
$('.c_1').on('click', function () {
    btn_1_on_click();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "btn_1_on_click();"
    }));
});
$('.c_2').on('click', function () {
    btn_2_on_click();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "btn_2_on_click();"
    }));
});
$('.c_3').on('click', function () {
    btn_3_on_click();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "btn_3_on_click();"
    }));
});


var audio = undefined;
var c_1_setInterval;
var c_2_setInterval;
var c_3_setInterval;

function btn_1_on_click() {
    // 재생 중인 악기 끄기
    if (audio != undefined) {
        audio.pause();
    };
    // stop interval
    clearInterval(c_2_setInterval);
    clearInterval(c_3_setInterval);

    // 다른 악기 숨기고 해금 확대
    $('.c_1').css({
        'animation': 'scale_1 1s linear 0s 1 forwards'
        , 'visibility': ''
    });
    $('.instrument').removeClass('active');
    $('.attention_text').css('display', 'block');
    $('.c_1').addClass('active');

    $('.c_2').css({
        'visibility': 'hidden',
        'animation': ''
    });
    $('.c_3').css({
        'visibility': 'hidden',
        'animation': ''
    });
    $('.bg').css({ 'opacity': 0, 'display': 'block' }).animate({ 'opacity': 1 }, 500);

    // 이미지 움직이기
    var bomb_roll = 1;
    c_1_setInterval = setInterval(function () {
        bomb_roll++;
        if (bomb_roll > 2) {
            bomb_roll = 1;
        }
        $('.c_1').css('background-image', 'url("./images/Haegeum_motion_' + bomb_roll + '.png")')
    }, 300);

    // 음악 재생
    audio = new Audio('./mp3/Haegeum.mp3');
    // 종료되면 처음부터 다시 재생
    audio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    audio.play();
}

function btn_2_on_click() {
    // 재생 중인 악기 끄기
    if (audio != undefined) {
        audio.pause();
    }
    // stop interval
    clearInterval(c_1_setInterval);
    clearInterval(c_3_setInterval);

    // 다른 악기 숨기고 장구 확대
    $('.c_2').css({ 'animation': 'scale_2 1s linear 0s 1 forwards', 'visibility': '' });
    $('.instrument').removeClass('active');
    $('.attention_text').css('display', 'block');
    $('.c_2').addClass('active');

    $('.c_1').css({
        'visibility': 'hidden',
        'animation': ''
    });
    $('.c_3').css({
        'visibility': 'hidden',
        'animation': ''
    });
    $('.bg').css({ 'opacity': 0, 'display': 'block' }).animate({ 'opacity': 1 }, 500);

    // 이미지 움직이기
    var bomb_roll = 1;
    c_2_setInterval = setInterval(function () {
        bomb_roll++;
        if (bomb_roll > 2) {
            bomb_roll = 1;
        }
        $('.c_2').css('background-image', 'url("./images/janggu_motion_' + bomb_roll + '.png")')
    }, 300);

    // 음악 재생
    audio = new Audio('./mp3/janggu.mp3');
    // 종료되면 처음부터 다시 재생
    audio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    audio.play();
}

function btn_3_on_click() {
    // 재생 중인 악기 끄기
    if (audio != undefined) {
        audio.pause();
    }
    // stop interval
    clearInterval(c_1_setInterval);
    clearInterval(c_2_setInterval);

    // 다른 악기 숨기고 장구 확대
    $('.c_3').css({ 'animation': 'scale_3 1s linear 0s 1 forwards', 'visibility': '' });
    $('.instrument').removeClass('active');
    $('.attention_text').css('display', 'block');
    $('.c_3').addClass('active');

    $('.c_1').css({
        'visibility': 'hidden',
        'animation': ''
    });
    $('.c_2').css({
        'visibility': 'hidden',
        'animation': ''
    });
    $('.bg').css({ 'opacity': 0, 'display': 'block' }).animate({ 'opacity': 1 }, 500);

    // 이미지 움직이기
    var bomb_roll = 1;
    c_3_setInterval = setInterval(function () {
        bomb_roll++;
        if (bomb_roll > 2) {
            bomb_roll = 1;
        }
        $('.c_3').css('background-image', 'url("./images/kkwaenggwari_motion_' + bomb_roll + '.png")')
    }, 300);

    // 음악 재생
    audio = new Audio('./mp3/Kkwaenggwari.mp3');
    // 종료되면 처음부터 다시 재생
    audio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    audio.play();
}