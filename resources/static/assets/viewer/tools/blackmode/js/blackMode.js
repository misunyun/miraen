$(document).ready(function () {
    showShadow();
    if ( window.location !== window.parent.location ) {	  
        // The page is in an iframe	
    } else {	  
        // The page is not in an iframe	
        // if(!window.opener) {
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

// 이미지 랜덤 변경
function showShadow() {
    var num = 1;
    setInterval(function () {
        if (num == 3) {
            num = 0;
        } else {
            $('.shadows').css('display', 'none');
            $('#shadows_' + num).css({'opacity': 0 ,'display': 'block'}).animate({ 'opacity': 1 }, 500);
            num++;
        }
    }, 5000)

};

