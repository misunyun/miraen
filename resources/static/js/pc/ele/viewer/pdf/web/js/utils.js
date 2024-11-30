var IS_DEV_SERVER_8001 = false;
if(window.location.origin == 'http://ele.m-teacher.co.kr:8001') {
    IS_DEV_SERVER_8001 = true;
}

(function () {
    if (typeof window.CustomEvent === "function") return false; //If not IE

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

var IS_IE = undefined;
function detect_is_msie() {
    if(IS_IE != undefined) {
        return IS_IE;
    }
    var agent = navigator.userAgent.toLowerCase();
    if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
        // ie일 경우
        IS_IE = true;
    }else{
        // ie가 아닐 경우
        IS_IE = false;
    }
    return IS_IE;
}
function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
}

function document_cancelFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      //requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
}

var DEVICE_TYPE = null;
function detect_mobile_device_type() {
    try {
        var md = new MobileDetect(window.navigator.userAgent);
        if (md.tablet()) {
            DEVICE_TYPE = 'tablet';
        } else if (md.mobile()) {
            DEVICE_TYPE = 'mobile';
        }    
    } catch (error) {
    }
    
    return DEVICE_TYPE;
}
function get_device_type() {
	if(typeof(DEVICE_TYPE) === 'undefined' || window.DEVICE_TYPE == undefined) {
		try {
			window.DEVICE_TYPE = viewer._device_type;
		} catch (error) {	
            window.DEVICE_TYPE = detect_mobile_device_type();
		}
	}
	return window.DEVICE_TYPE;
}
function custom_prevent_event(e) {
	try {
		if(get_device_type() == '') {
			e.preventDefault();	
		}
	} catch (error) {
		e.preventDefault();
	}
}
function convert_touch_event(e) {
    var touches = undefined;
    if(e.touches) {
        touches = e.touches;
    } else if(e.originalEvent && e.originalEvent.touches) {
        touches = e.originalEvent.touches;
    }
	if(touches && touches.length > 0) {
        var touch = touches[0];
        try {
            e.pageX = touch.pageX;
            e.pageY = touch.pageY;
            e.clientX = touch.clientX;
            e.clientY = touch.clientY;
        } catch (error) {
        }		
	}
	return e;
}

function parseQueryString(query) {
    var parts = query.split('&');
    var params = {};
    for (var i = 0, ii = parts.length; i < ii; ++i) {
        var param = parts[i].split('=');
        var key = param[0].toLowerCase();
        var value = param.length > 1 ? param[1] : null;
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return params;
}

function get_version_of_IE() {
    var word;
    var agent = navigator.userAgent.toLowerCase();
    // IE old version ( IE 10 or Lower ) 
    if (navigator.appName == "Microsoft Internet Explorer") word = "msie ";
    // IE 11 
    else if (agent.search("trident") > -1) word = "trident/.*rv:";
    // Microsoft Edge  
    else if (agent.search("edge/") > -1) word = "edge/";
    // 그외, IE가 아니라면 ( If it's not IE or Edge )  
    else return -1;

    var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
    if (reg.exec(agent) != null) return parseFloat(RegExp.$1 + RegExp.$2);
    return -1;
}
var setCookie = function (name, value, day) {
    var date = new Date();
    date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};
var getCookie = function (name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
};
var deleteCookie = function (name) {
    var date = new Date();
    document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
}


function is_mobile() {
    var filter = "win16/win32/win64/mac/macintel";
    if (navigator.platform) {
        return filter.indexOf(navigator.platform.toLowerCase()) < 0;
    }
    return false;
}

// 작동되는 진동 메소드가 다르므로 통합
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

function vibrate(ms) {
    if (navigator.vibrate) {
        if (!ms) {
            ms = 100;
        }
        navigator.vibrate(ms); // 진동을 울리게 한다. 1000ms = 1초
    } else {
        // alert("진동을 지원하지 않는 기종 입니다.");
    }
}

function mute_all_media($iframeele, muted) {
    try {
        var avs = $iframeele.contents().find("audio, video");
        for (var index = 0; index < avs.length; index++) {
            avs[index].muted = muted;
        }
    } catch (error) {
        console.log(error);
    }
}

function stop_all_media($iframeele) {
    try {
        var avs = $iframeele.contents().find("audio, video");
        for (var index = 0; index < avs.length; index++) {
            avs[index].pause();
        }
    } catch (error) {
        console.log(error);
    }
}

function download_file(url, file_title) {
    url = get_download_url(url);

    // saveAs(url, file_title);
    /*
    var form = $("<form style='display:none'></form>");
    form.attr('method', 'POST');
    form.attr('action', url);
    var target = '_blank';
    try {
        var device_type = $('body').attr('device');
        if(device_type == 'mobile' || device_type == 'tablet') {
            target = '_self';
        }
    } catch (error) {
    }
    var input = $("<input type='submit'></input>");
    form.append(input);

    $('body').append(form);
    form.submit();
    form.remove();
    */

    var link = document.createElement('a');
    link.href= url;
    link.click();
    link.remove();
}

function get_download_url(url) {
    try {
        if (url.startsWith("http://dev.ddoobear.site:18081/cms/")) {
            url = url.replace("http://dev.ddoobear.site:18081/cms/", "/cms/");
        }
        if (TEST_LOCALHOST) {
            url = url.replace("http://ele.m-teacher.co.kr:8001/testfiles/", "/dummy/testfiles/");
        }
        if ((TEST_LOCALHOST || IS_DEV_SERVER_8001) && url.startsWith("/cms/")) {
            url = "http://dev.ddoobear.site:18081" + url;
        }
        
        if(url.startsWith("/cms/")){
        	url = url.replace("/cms/", "https://ele.m-teacher.co.kr/cms/");
        }
    } catch (error) {

    }

    return url;
}

function get_url(url) {
    try {
        if (TEST_LOCALHOST) {
            url = url.replace("http://ele.m-teacher.co.kr:8001/testfiles/", "/dummy/testfiles/");
            // if (url.startsWith("http://dev.ddoobear.site:18081/cms/smartppt/html")) {
            //    url = url.replace("http://dev.ddoobear.site:18081/cms/smartppt/html", "/dummy/testfiles/mteacher/html");
            // }

            // if (url.startsWith("/cms/smartppt/html")) {
            //    url = url.replace("/cms/smartppt/html", "/dummy/testfiles/mteacher/html");
            // }
        }

        if (url.startsWith("/cms/smartppt/")) {
           url = url.replace("/cms/smartppt/", "https://contents.m-teacher.co.kr/cms/smartppt/");
        }
        if(url.startsWith("/cms/")){
            // if (window.location.origin("http://localhost:9990/")) {
            //     // url = url.replace("http://dev.ddoobear.site:18081/cms/", "/cms/");
            // }
            //     console.log("이거다!!! "+url);
            // url = url.replace("/cms/", "https://localele.m-teacher.co.kr/cms/");
            url = url.replace("/cms/", "https://ele.m-teacher.co.kr/cms/");
        }

        if (url.startsWith("http://dev.ddoobear.site:18081/cms/")) {
            url = url.replace("http://dev.ddoobear.site:18081/cms/", "/cms/");
        }
    } catch (error) {

    }

    return url;
}

function throw_tms_get_file_info(data, _cb) {
    if (!data || data.code && data.code == "fail") {
        if (data.message) {
            throw data.message;
        }
        throw "파일이 없습니다.";
    }

    if (data && data.type && (data.type == 'zip' || data.type == 'ZIP')) {
        if (!data.download_url) {
            throw "잘못된 데이터이거나 아직 처리 중인 데이터입니다.\n잠시 후에 다시 시도해주세요.";
        }
        download_file(data.download_url, data.title);
        _cb && _cb();
        return true;
    }

    if (!data.pages || data.pages.length <= 0) {
        throw "잘못된 데이터이거나 아직 처리 중인 데이터입니다.\n잠시 후에 다시 시도해주세요.";
    }
    return true;
}


function get_error_message(err) {
    console.error(err);
    var err_msg = err;
    if (typeof (err) === 'string') {
        err_msg = err;
    } else {
        if (typeof (err) === 'object') {
            if (err["message"]) {
                err_msg = err["message"];
            } else if(err["errorMessage"]) {
                err_msg = '에러가 발생했습니다.';
            } else if (err["statusText"]) {
                err_msg = err["statusText"];
                if (err_msg == 'timeout') {
                    err_msg = '서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.';
                } else if (err_msg == 'error') {
                    err_msg = '서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.';
                }
            } else {
                err_msg = err.toString();
            }
        } else {
            err_msg = err.toString();
        }
    }
    return err_msg;
}

function show_error_message(err, _cb) {
    var err_msg = get_error_message(err);
    // console.log(err_msg);
    show_alert(err_msg, _cb);
}

function show_alert(message, _cb) {
    if (!vex) {
        alert(message);
        _cb && _cb();
        return;
    }

    vex.dialog.alert({
        message: message,
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: '확인' })
        ],
        callback: function () {
            _cb && _cb();
        }
    });
}

function guid() {
    function s4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};