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

$(document).on('click', '.btn-timer', function () {
    change_mode_to_timer();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "change_mode_to_timer();"
    }));
});

$(document).on('click', '.btn-stopwatch', function () {
    change_mode_to_stopwatch();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "change_mode_to_stopwatch();"
    }));
});

$(document).on('click', '.timer_btns a.start', function () {
    on_click_timer_start();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "on_click_timer_start();"
    }));
});

$(document).on('click', '.timer_btns a.reset', function () {
    on_click_timer_reset();
    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "on_click_timer_reset();"
    }));
});

$(document).on('change keyup paste', '.time-setting-bg .custom-time', function (e) {
    if(e.keyCode == 9) {
        return;
    };

    on_click_timer_reset();
    var min = $('#custom_min').val();
    var sec = $('#custom_sec').val();

    function fillZero(width, str){
        return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;
    }

    min = fillZero(2, min);
    sec = fillZero(2, sec);

    if ($(this).hasClass('custom_min')) {
        if (!min) {
            return;
        }

        min = parseInt(min.trim());

        if ( (min <= 0 || min > 60) && e.keyCode != 8 && min != '00' )  {
            alert("올바른 시간을 입력해주세요. (1 ~ 60분)");
            $('#custom_min').val('');
            $('#custom_min').focus();
            return;
        }

        set_custom_time(min);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "set_custom_time(" + min + ");"
        }));

    } else if ($(this).hasClass('custom_sec')) {
        if (!sec) {
            return;
        }

        min = parseInt(sec.trim());
        if ( (sec <= 0 || sec > 60) && e.keyCode != 8 && sec != '00' ) {
            alert("올바른 시간을 입력해주세요. (1 ~ 60초)");
            $('#custom_sec').val('');
            $('#custom_sec').focus();
            return;
        }

        set_custom_time_sec(sec);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "set_custom_time_sec(" + sec + ");"
        }));
    }

    $(".time-setting-bg a.time").removeClass("active");

    $(".time-setting-bg a.custom_timer").addClass('active');

    var seconds = $(".time-setting-bg a.custom_timer").attr('time');
    start_with_seconds(seconds);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "$('.time-setting-bg a.time').removeClass('active');$('.time-setting-bg a.custom_timer').addClass('active');"
    }));
    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "start_with_seconds(" + seconds + ");"
    }));
});

$(document).on('click', '.time-setting-bg a.time', function () {
    on_click_timer_reset();

    $('#custom_min').val('');
    $('#custom_sec').val('');
    
    if ($(this).hasClass('active')) {
        return;
    }
    set_custom_time_default();
    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "set_custom_time_default();"
    }));

    $(".time-setting-bg a.time").removeClass("active");
    $(this).addClass('active');
    var seconds = $(this).attr('time');
    start_with_seconds(seconds);
    var event_target_selector = $(this).getSelector();

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "$('.time-setting-bg a.time').removeClass('active'); $('" + event_target_selector + "').addClass('active');"
    }));
    
    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "start_with_seconds(" + seconds + ");"
    }));
});

$(document).on('click', '.stopwatch .start', function () {
    startstoptimer();

    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "startstoptimer();"
    }));
});
$(document).on('click', '.stopwatch .reset', function () {
    resettimer();

    window.dispatchEvent(new CustomEvent('send_to_mirror', { 
        type: "script",
        detail: "resettimer();"
    }));
});

// mode
function change_mode_to_timer() {
    stoptimer();
    $("body").attr('module', 'timer');
}
function change_mode_to_stopwatch() {
    stop_timer();
    $("body").attr('module', 'stopwatch');
}

// timer
var timer_paused = false;
function on_click_timer_start() {
    if (_timer) {
        stop_timer();
        timer_paused = true;
        $(".timer_btns .start").removeClass("pause");
        return;
    }
    var seconds = $(".time-setting-bg a.time.active").attr('time');

    if(seconds == '0' || seconds == null || seconds == undefined) {
        alert('시간을 지정해주세요.');
        return;
    }

    if(timer_paused == false) {
        timer_time = seconds;
        display_time(seconds);
    }
    start_timer();
    timer_paused = false;
    $(".timer_btns .start").addClass("pause");
};

function on_click_timer_reset() {
    stop_timer();
    timer_paused = false;
    var seconds = $(".time-setting-bg a.time.active").attr('time');
    timer_time = seconds;
    display_time(seconds);
    $(".timer_btns a.start").removeClass("pause");
}

function set_custom_time_default() {
    $(".time-setting-bg a.time.custom-time").html("");
};

function set_custom_time(min) {
    var sec = $(".custom_sec").val();

    if(sec == undefined || sec == '00'|| sec == '')  {
        $(".time-setting-bg a.time.custom_timer").attr('time', min * 60);
        return;
    } else {
        sec = sec.replace(/(^0+)/,"");
        var _time = parseInt(min * 60) + parseInt(sec);
        $(".time-setting-bg a.time.custom_timer").attr('time', _time);
    }
};

function set_custom_time_sec(sec) {
    var min = $(".custom_min").val();

    if(min == undefined || min == '00' || min == '') {
        $(".time-setting-bg a.time.custom_timer").attr('time', sec);
        return;
    } else {
        min = min.replace(/(^0+)/,"");
        var _time = parseInt(min * 60) + parseInt(sec);
        $(".time-setting-bg a.time.custom_timer").attr('time', _time);
    }
};

function start_with_seconds(seconds) {
    stop_timer();
    timer_time = seconds;
    display_time(seconds);
};

var timer_time = 3 * 60;
var _timer = undefined;

function display_time(seconds) {
    var min = padLeadingZeros(Math.floor(seconds / 60), 2);
    var sec = padLeadingZeros(seconds % 60, 2);
    $(".time-body .min").html(min);
    $(".time-body .sec").html(sec);
};

function padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

function stop_timer() {
    if (_timer) {
        clearInterval(_timer);
        _timer = undefined;
    }
}
function start_timer() {
    stop_timer();

    _timer = setInterval(function () {
        timer_time -= 1;
        display_time(timer_time);

        if (timer_time == 0) {
            var audio = new Audio('./mp3/wistle.mp3');
            audio.play();
            stop_timer();
            $(".whistle_effect").show();
            $(".whistle_effect2").show();
        }
    }, 1000);
}


// var millisec = 0;
// var seconds = 0;
var _stopwatch_timer = undefined;
var startTime = undefined;
var updatedTime = undefined;
var difference = undefined;
var tInterval;
var savedTime;
var paused = 0;
var running = 0;

function display() {

    // if (millisec >= 99) {
    //     millisec = 0
    //     seconds += 1
    //     var min = padLeadingZeros(Math.floor(seconds / 60), 2);
    //     var sec = padLeadingZeros(seconds % 60, 2);
    //     $(".stopwatch-body .min").html(min);
    //     $(".stopwatch-body .sec").html(sec);
    //     $(".stopwatch-body .msec").html("00");
    //     // console.log(seconds);
    //     if (seconds >= 6) {
    //         console.log(seconds);
    //         // stoptimer();
    //     }
    // }
    // else {
    //     millisec += 1
    //     var msec = padLeadingZeros(millisec, 2);
    //     $(".stopwatch-body .msec").html(msec);

    // }

    // _stopwatch_timer = setTimeout(display, 10);


    updatedTime = new Date().getTime();
    if (savedTime) {
        difference = (updatedTime - startTime) + savedTime;
    } else {
        difference = updatedTime - startTime;
    }
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    var milliseconds = Math.floor((difference % (1000 * 60)) / 10);
    if (minutes > 99) {
        stoptimer();
        return;
    }
    minutes = padLeadingZeros(minutes, 2);
    seconds = padLeadingZeros(seconds, 2);
    milliseconds = Math.floor(milliseconds % 100);
    milliseconds = padLeadingZeros(milliseconds, 2);
    $(".stopwatch-body .min").html(minutes);
    $(".stopwatch-body .sec").html(seconds);
    $(".stopwatch-body .msec").html(milliseconds);
}


function starttimer() {

    if (_stopwatch_timer) {
        return;
    }

    startTime = new Date().getTime();

    paused = 0;
    running = 1;
    _stopwatch_timer = setInterval(display, 1);

    // display();
}
function stoptimer() {
    if (_stopwatch_timer) {
        clearInterval(_stopwatch_timer);
        _stopwatch_timer = undefined;
    }
    $(".pendulum").removeClass("swing");
    $(".stopwatch .start").removeClass("pause");
}

function startstoptimer() {
    // if(paused) {
    //     pauseTimer();
    //     return;
    // }
    if (_stopwatch_timer) {
        pauseTimer();
        return;
    }

    $(".hand_effect").show();

    $(".pendulum").addClass("swing");
    $(".stopwatch .start").addClass("pause");
    starttimer();
    setTimeout(function () {
        $(".hand_effect").hide();
    }, 1000);
}

function pauseTimer() {
    if (!difference) {
        // if timer never started, don't allow pause button to do anything
    } else if (!paused) {
        clearInterval(_stopwatch_timer);
        _stopwatch_timer = undefined;
        savedTime = difference;
        paused = 1;
        running = 0;
        $(".pendulum").removeClass("swing");
        $(".stopwatch .start").removeClass("pause");
    } else {
        // if the timer was already paused, when they click pause again, start the timer again
        starttimer();
        $(".hand_effect").show();
        $(".stopwatch .start").addClass("pause");
        $(".pendulum").addClass("swing");
        setTimeout(function () {
            $(".hand_effect").hide();
        }, 1000);
    }
}

function resettimer() {
    stoptimer();
    // millisec = 0;
    // seconds = 0;
    savedTime = 0;
    difference = 0;
    paused = 0;
    running = 0;
    $(".stopwatch-body .min").html("00");
    $(".stopwatch-body .sec").html("00");
    $(".stopwatch-body .msec").html("00");
}
