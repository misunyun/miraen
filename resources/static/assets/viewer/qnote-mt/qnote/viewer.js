
var player;
var playerJimun;
var start;
var semiResponsiveLayoutChooser;
var userAgent = window.navigator.userAgent;
var viewPort = document.querySelector("meta[name=viewport]");
var questionUrl;
var jimunArr;
var preLayoutID = "";
var notGoodElement;
var goodElement;
var firstLoad = 0;
var isCheckAnswer = false;
var bExistsJimun = false;
var theme = document.querySelector(':root');
var styles = getComputedStyle(theme);
var currentPage = 0;



function getOpener() {
    var parent = null;
    if (window.parent != null && window.parent.postMessage != null) {
        parent = window.parent;
    }
    if (window.opener != null && window.opener.postMessage != null) {
        parent = window.opener;
    }
    return parent;
}

function postResizeMessage(width, height) {
    var parent = getOpener();

//            console.log("postResizeMessage : " + postResizeMessage);

    if (parent != null) {
        var message = "RESIZE:" + width + ";" + height;
        parent.postMessage(message, '*');
    }
}

function postPageLoadedMessage() {
    var parent = getOpener();

    if (parent != null) {
        var message = "PAGE_LOADED";
        parent.postMessage(message, '*');

    }
}


function chooseLayout(layoutChooser, screenConfiguration) {
    var isMobile = screenConfiguration.orientation !== window.mAuthor.ScreenUtils.ORIENTATION_TYPES.NOT_MOBILE;
    var isVertical = screenConfiguration.orientation === window.mAuthor.ScreenUtils.ORIENTATION_TYPES.PORTRAIT;
    var isHorizontal = screenConfiguration.orientation === window.mAuthor.ScreenUtils.ORIENTATION_TYPES.LANDSCAPE;


	// console.log("isMobile", isMobile, "isVertical", isVertical, "isHorizontal", isHorizontal);
	// console.log("isMobile", layoutChooser.chooseLayout(screenConfiguration.width, isMobile, isVertical, isHorizontal));
    return layoutChooser.chooseLayout(screenConfiguration.width, isMobile, isVertical, isHorizontal);
}

// 	    function setViewPortSizesAfterScreenChanges() {

// 			var screenConfiguration = window.mAuthor.ScreenUtils.getScreenSizesDependingOnOrientation(userAgent);
//        	 	var isMobile = screenConfiguration.orientation !== window.mAuthor.ScreenUtils.ORIENTATION_TYPES.NOT_MOBILE;
//         	var isVertical = screenConfiguration.orientation === window.mAuthor.ScreenUtils.ORIENTATION_TYPES.PORTRAIT;
//         	var isHorizontal = screenConfiguration.orientation === window.mAuthor.ScreenUtils.ORIENTATION_TYPES.LANDSCAPE;

//             var screenWidth = window.innerWidth;
//             var screenHeight = window.innerHeight;
//             console.log("screenWidth", screenWidth, "screenHeight", screenHeight);


//             setJiminPosision();
//             if( isMobile ){
//                  if( isVertical ){
//                      screenWidth  = Math.min(screenWidth, screenHeight);
//                  }else{
//                      screenWidth  = Math.max(screenWidth, screenHeight);
//                  }

// 			}

//             setTimeout( function(){
//                 var $icPlayer = $('#_QPlayer');
//                 var width = parseInt($icPlayer.css('width'), 10);
//                 console.log("onResizeHandler width : " + width);
//                 viewPort.setAttribute('content', 'width=' + width + ',maximum-scale=1, user-scalable=no');
//                 console.log("setViewPortSizesAfterScreenChanges : " + width);
// //            getNotGooeAddClass();
//             }, 1)
//        }


function setViewPortSizesAfterScreenChanges() {

    // var $icPlayer = $('#_QPlayer');
    // var width = parseInt($icPlayer.css('width'), 10);
    // console.log("onResizeHandler width : " + width);
    // viewPort.setAttribute('content', 'width=' + width + ',maximum-scale=1');
    // console.log("setViewPortSizesAfterScreenChanges : " + width);
//            getNotGooeAddClass();
}

function getNotGoodAddClass(){
    // console.log( "getNotGooeAddClass" );


    notGoodElement = [];
    goodElement = [];

    var element = document.getElementsByClassName("notgood");
    // console.log( element );
    for (i = 0; i < element.length; i++) {
        notGoodElement.push( element[i].id );
    }

    var element = document.getElementsByClassName("good");
    // console.log( element );
    for (i = 0; i < element.length; i++) {
        goodElement.push( element[i].id );
    }

    // console.log( notGoodElement);
    // console.log( goodElement);
}

function addNotGoodAddClass(){
    // console.log( "addNotGoodAddClass" );
//            console.log( notGoodElement );

    //뷰어 정답 체크
    var ps = player.getPlayerServices();
    var scoreService = ps.getScore();
    var model = ps.getPresentation(currentPage);
    var page = model.getPage(currentPage);
    var command = ps.getCommands();
    command.checkAnswers();

    if(page.isReportable()){
        var score = scoreService.getPageScore(page.getName());
        console.log("maxScore : " + score['maxScore']);
        console.log("score : " + score['score']);
        console.log("mistakeCount : " + score['mistakeCount']);
        console.log("errorCount : " + score['errorCount']);
    }


    if( notGoodElement != null && notGoodElement.length > 0 ) {
        for (i = 0; i < notGoodElement.length; i++) {
            var id = notGoodElement[i];
            console.log("addNotGoodAddClass id : " + id);
            try {
                // console.log(document.getElementById(id));
                //                    document.getElementById(id).className += " " + "notgood";
                $(document.getElementById(id)).addClass("notgood");
            } catch (e) {
                // console.log("addNotGoodAddClass e : " + e);
            }
        }
    }

    if( goodElement != null && goodElement.length > 0 ) {
        for (i = 0; i < goodElement.length; i++) {
            var id = goodElement[i];
            // console.log("addGoodAddClass id : " + id);
            try {
                // console.log(document.getElementById(id));
                //                    document.getElementById(id).className += " " + "notgood";
                $(document.getElementById(id)).addClass("good");
            } catch (e) {
                // console.log("addGoodAddClass e : " + e);
            }
        }
    }
}

function removeNotGoodAddClass(){
    if( notGoodElement != null || notGoodElement.length > 0) {

        for (i = 0; i < notGoodElement.length; i++) {
            var id = notGoodElement[i];
            console.log("removeNotGoodAddClass id : " + id);
            try {
                // console.log(document.getElementById(id));
                //                    document.getElementById(id).className -= " " + "notgood";
                //                    removeClass(document.getElementById(id), "notgood");
                $(document.getElementById(id)).removeClass("notgood");
            } catch (e) {
                // console.log("removeNotGoodAddClass e : " + e);
            }
        }
        notGoodElement = [];
        // console.log(notGoodElement);
    }

    if( goodElement != null || goodElement.length > 0) {

        for (i = 0; i < goodElement.length; i++) {
            var id = goodElement[i];
            // console.log("removeGoodAddClass id : " + id);
            try {
                // console.log(document.getElementById(id));
                //                    document.getElementById(id).className -= " " + "notgood";
                //                    removeClass(document.getElementById(id), "notgood");
                $(document.getElementById(id)).removeClass("good");
            } catch (e) {
                // console.log("removeGoodAddClass e : " + e);
            }
        }
        goodElement = [];
        // console.log(goodElement);
    }
}

//지문 보여주는 문항 인지
function isJimunshowed(){
	try{
		return (document.getElementById("imgJimun").style.display != "none");
	}catch(e){
		return false;
	}
}

// function onResizeHandler() {
//             var screenSizes = window.mAuthor.ScreenUtils.getScreenSizesDependingOnOrientation(userAgent);
//             console.log("onResizeHandler userAgent : " + userAgent);
//             console.log("onResizeHandler screenSizes : " + screenSizes.width + ", " + screenSizes.height + ", " + screenSizes.orientation);
//             // console.log("onResizeHandler document.getElementByIdidth : " + document.getElementById("imgJimun").width);
//
//             // // 지문 싸이즈 반영
// //             if(isJimunshowed()) {
// //                 screenSizes.width = screenSizes.width - document.getElementById("imgJimun").width;
// //             }
//
//             var layoutID = chooseLayout(semiResponsiveLayoutChooser, screenSizes);
//             if( preLayoutID == "" ){
//                 preLayoutID = layoutID;
//             }
//
//             if( layoutID != preLayoutID ){
//                 getNotGoodAddClass();
//             }
//
//             console.log("onResizeHandler layoutID : " + layoutID);
//             var changed = player.changeLayout(layoutID);
//             console.log("onResizeHandler changed : " + changed);
//             if (changed) {
//                 setViewPortSizesAfterScreenChanges();
//             }
//
//             preLayoutID = layoutID;
//
//             $("#curPageSize").text($(".ic_page").css("width"));
//
//         }

function receiveMessage(event) {
    var WINDOW_WIDTH_EVENT = "WINDOW_WIDTH:";
    var WINDOW_PAGE_LOADED_EVENT = "PAGE_LOADED";

    // console.log("event.data", event.data);
    if (!event.data) {
        return;
    }

    try{
        if (event.data.indexOf(WINDOW_WIDTH_EVENT) === 0) {
            if (semiResponsiveLayoutChooser) {
                var screenConfiguration = JSON.parse(event.data.substring(WINDOW_WIDTH_EVENT.length, event.data.length));
                var layoutID = chooseLayout(semiResponsiveLayoutChooser, screenConfiguration);
                //todo remove
                // console.log("layoutID", layoutID);
                layoutID = "default";
                var changed = player.changeLayout(layoutID);
            }
        }else if (event.data.indexOf(WINDOW_PAGE_LOADED_EVENT) === 0) {

    //                semiResponsiveLayoutChooser = new window.semiResponsive.LayoutChooser(player.getSemiResponsiveLayouts());
    //                var screenSizes = window.mAuthor.ScreenUtils.getScreenSizesDependingOnOrientation(userAgent);
    //                // 지문 싸이즈 반영
    //                screenSizes.width = screenSizes.width - document.getElementById("imgJimun").width;
    //                console.log("screenSizes.width : " + screenSizes.width);
    //                var layoutID = chooseLayout(semiResponsiveLayoutChooser, screenSizes);
    //                var changed = player.changeLayout(layoutID);

            // todo 조건 명시 필요 (채점을 했는지..)
            // console.log("isCheckAnswer : " + isCheckAnswer);
            if( isCheckAnswer ) {
                setTimeout(addNotGoodAddClass, 100);
    //                    setTimeout(addNotGoodAddClass, 1000);
            };
        }
    }catch(e){
    }
    
}

function iframeResizeRequest() {
    if (window.parent != null && window.parent.postMessage != null) {
        var $icPlayer = $('#_QPlayer');
        var width = parseInt($icPlayer.css('width'), 10);
        var height = parseInt($icPlayer.css('height'), 10);
        setViewPortSizesAfterScreenChanges();
        postResizeMessage(width, height);
    }
}

function getParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    params = params.split("&");
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");

        if ([temp[0]] == sname) {
            sval = temp[1];
            try{
                if( sval.indexOf("token") > -1 && sname == "file_name"){
                    sval += "=" + temp[2];
                }

                if( sname == "file_name"){
                    console.log("temp", temp);
                    sval = "";
                    for( var j=1; j<temp.length; ++j){
                        if( j == 1) sval = temp[j];
                        else sval += "=" + temp[j];
                    }
                    console.log("svalsvalsval", sval);
                }
            }catch(e){};

        }
        if( [temp[0]] == "file_name" && sname == "file_name" ){
            console.log("sval", sval);
            return sval = sval.split(",")
        };
    }
    return sval;

}


var isAuthor = false;
var isTeacher = false;
var isInited = false;
var token = "";
var fileUrl = "";
function icOnAppLoaded(){
//    var token = getParam("token");
    var fileName = getParam("file_name");
    var service = getParam("service");
    var params = getParam("params");
    isAuthor = ( getParam("isAuthor") == "true" ) ?true:false;
    isTeacher = ( getParam("isTeacher") == "true" ) ?true:false;
    authorTool(isAuthor);

    if(params != undefined && params.length > 1){

        console.log('service : ',service)
        console.log('params : ',params)
        var apiGatewayUrl = fileName+"&params="+params;
//        var apiGatewayUrl = gatewayUrl+"?service="+service+"&params="+params;
        console.log('apiGatewayUrl : ',apiGatewayUrl)
        fetch(apiGatewayUrl)
            .then(response => {
                if (response.redirected) {
                    console.log('최종 URL:', response.url);
                    fileUrl = response.url;
                    try{
                        token = fileUrl.split("token=")[1];
                    }catch(e){};
                } else {
                    console.log('이 응답은 리다이렉트 없음');
                }
                return response.text(); // 또는 다른 응답 데이터 처리
            })
            .then(data => {
                console.log("isTeacher", isTeacher);
                console.log("isAutho2r", isAuthor);
                console.log("fileUrl", fileUrl);
                //fileUrl= fileUrl.split('/pages/')[0]
                isInited = true;

                try{
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, null]);
                }catch(e){};

                if( isReceivedData ){
                    loadProblem(arrQuestion);
                    setJimun(0);
                }

                if( isAuthor ){
                    initJimunLayout(false);
                    loadQuestion([fileUrl]);
                }
            })
            .catch(error => {
                // 오류 처리
                console.error('오류 발생:', error);
            });
    }else{
        console.log("isTeacher", isTeacher);
        console.log("isAutho2r", isAuthor);
        console.log("fileName", fileName);
        isInited = true;

        try{
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, null]);
        }catch(e){};

        if( isReceivedData ){
            loadProblem(arrQuestion);
            setJimun(0);
        }

        if( isAuthor ){
            initJimunLayout(false);
            loadQuestion(fileName);
        }
    }
    // else{
    //      arrQuestion =  [
    //         {
    //             "contentId": "ab-01",
    //             "url": "1/pages/1.xml",
    //             "no": "1",
    //             "stepName": "확인하기",
    //             "tempState": {
    //             },
    //             "mode": "review",
    //             "review": {
    //                 "retryCount": 1,
    //                 "isCorrect": false
    //             }
    //         },
    //         {
    //             "contentId": "ab-02",
    //             "url": "123/pages/123.xml",
    //             "no": "2",
    //             "stepName": "확인하기",
    //             "text": {
    //                 "no": "2~3번",
    //                 "url": "jimun"
    //             },
    //             "tempState": {
    //             },
    //             "mode": "review",
    //             "review": {
    //                 "retryCount": 1,
    //                 "isCorrect": false
    //             }
    //         },{
    //             "contentId": "ab-03",
    //             "url": "3/pages/3.xml",
    //             "no": "2",
    //             "stepName": "확인하기",
    //             "text": {
    //                 "no": "2~3번",
    //                 "url": "jimun"
    //             },
    //             "tempState": {
    //             }
    //         }
    //     ];
    //      initJimunLayout(false);
    //      var urls = getQuestionUrl(arrQuestion);
    //      console.log
    //       loadQuestion(urls.questionUrl);
    // }

     // loadQuestion();
    // loadQuestion("https://down.wjthinkbig.com/TEST/SUKWOONG/MAUTHOR/QUESTIONS/00000004/pages/main.xml", "")
}

//저작도구에서만 UI보여줌
function authorTool(isAuthor){
    var ui = document.getElementById("author_tool");
    var ui2 = document.getElementById("author_tool2");
    ui.style.display = "none";
    ui2.style.display = "none";
}


function javeCallTest(msg){
    alert(msg);
}

function getCurrentNum(){

    if( isAuthor ){
        try{
            if( arrExcelList.length > 0 ){
                document.getElementById("pFileName").innerHTML = arrExcelList[currentNum];
            }else if(arrLabelQuestion.length > 0 ){
                document.getElementById("pFileName").innerHTML = arrLabelQuestion[currentNum];
            }else{
                document.getElementById("pFileName").innerHTML = getParam("file_name")[0];
            }

        }catch(e){
            console.log("getCurrentNum e", e);
        }
    }


    var ps = player.getPlayerServices();
    var model = ps.getPresentation();
    var totalCnt = model.getPageCount();

    currentPage = ps.getCurrentPageIndex(); //get current

	txt = String(currentPage) + "/" + String(totalCnt);
	// console.log(txt, txt);
	document.getElementById("quesCnt").innerHTML = String(parseInt(currentPage)+1) + "/" + String(totalCnt);


    // sendMessageToContainer("@saveTempState");
    sendMessageToContainer("@open");
    // return String(currentPage) + "/" + String(totalCnt);


}



// 문항 번호 넣어주기
function showQuestionNum(location){

//    if( isAuthor == true && isTeacher == false) return;


//      console.log("showQuestionNum", location);
    const container = document.querySelector("#_QPlayer");
    var num = container.querySelectorAll("[isquestionnumber=true]");

    if( num.length == 0) {
        var marking = document.getElementById("marking");
        marking.style.display = "none";
        return;
    }

//     var step = document.getElementById("step");

//     try{
//         if( arrQuestion[parseInt(location)].stepName != null
//             && arrQuestion[parseInt(location)].stepName != "" ){
//             step.style.display = "flex";
//             step.innerText = arrQuestion[parseInt(location)].stepName;
//         }else{
//             step.style.display = "none";
//         }
//     }catch(e){
//          step.style.display = "none";
//     }
    
    

//     try{
//         var numLabel = parseInt(location)+1;

//         //선생님 모드면 문항 번호 00. 으로
// //        if( isTeacher ) numLabel = 0;

//        if( numLabel < 10 ) numLabel = "0" + numLabel;

//         console.log("num[0]", num);
//        num[0].children[0].innerHTML = numLabel + ".";
//        try{
//             if(  num[0].children[0].children.length > 0 ){
//                 num[0].children[0].children[0].innerHTML = numLabel + ".";
//             }
//        }catch(e){}
       
//         console.log("showQuestionNum location2", isTeacher, location, numLabel,  num[0].children[0].children.length);
//        showMarking(num[0]);
//     }catch(e){
//         // if( isTeacher ) num[0].children[0].innerHTML = "■";
//         if( isTeacher ) num[0].children[0].innerHTML = "";
//         else num[0].children[0].innerHTML = "01.";
//         console.log("showQuestionNum e", e);
//     }



}


//문항 채점 정보 보여주기
var markingStartX = -1;
function showMarking(divNum){

    var review = null;

     console.log("divNum", divNum);
    var marking = document.getElementById("marking");
    // marking.style.display = "block";

    try{
        if( !isAuthor ){
            review = arrQuestion[currentPage].review;    
        } else {
            review = {};
            review.isCorrect = getEachScore('false');
        }
    }catch(e){
    }

    // console.log("review", review);
    

    var wrapper = $("#scaleable-wrapper");
    var wrapperOffsets  = $("#scaleable-wrapper")[0].getBoundingClientRect();;
    icPlayer = $("#_QPlayer")[0];
    // marking.left = icPlayer.left;
    // marking.top = icPlayer.top ;

    if( review == null ){
        marking.style.display = "none";
        return;
    };

    marking.style.display = "block";

    // setQuestionEnable( review.isCorrect ? "false" : "true");
    setQuestionEnable( "false" );
    // var numOffsets = divNum.getBoundingClientRect();

    var icPlayerOffsets = icPlayer.getBoundingClientRect();

    // var startX = numOffsets.x - icPlayerOffsets.x;
    if( markingStartX == -1) markingStartX = (1/wrapperScale) * (parseInt(icPlayerOffsets.x - wrapperOffsets.x));
    //var startY = numOffsets.y - icPlayerOffsets.y;
    const container = document.querySelector("#_QPlayer");
    var startY = parseInt(wrapper.css('padding-top'));

    try{
        startY = parseInt(container.querySelectorAll("[isquestionnumber=true]")[0].style.top) + parseInt(wrapper.css('padding-top'));    
    }catch(e){};
    
    // console.log("startY 1", startY);
    // var startY = parseInt(wrapper.css('padding-top'))
    // console.log("startY 2", startY);

    // console.log("showMarking13",  icPlayerOffsets.x,  wrapperOffsets.x , markingStartX, (1/wrapperScale), wrapperScale);


    if( hasJimun(currentPage) ) startY = 0;


    
    marking.style.left = markingStartX + "px";
    marking.style.top = startY + "px";

    var className = "";
    if(review.isCorrect){
        if( review.retryCount == 0 ) className = "marking_correct";
        else className = "marking_triangle";
    }else{
        className = "marking_incorrect";
    }


    if( hasJimun(currentPage) ) className += "_jimun";

    // setTimeout(function(){
    //     marking.style.display = "none";
    // }, 100);

    // console.log("className", className);

    marking.className = className;

    addQuestionScrollEvent();
}

function setCurrentNum(location){
    showSolve("N")
    // console.log("location : " + location);
    showQuestionNum(location);
    showSolveBtn();
    var ps = player.getPlayerServices();
    var commands = ps.getCommands();
    commands.gotoPageIndex(location);
    setJimun(location);
    objCurrentQuesInfo = {};
}

function hasJimun(location){
    // console.log("hasJimun", playerJimun);
    if( playerJimun == null ) return;

    try{
        // console.log("hasJimun asdasdsad", totalJimunUrl, location);
        if( totalJimunUrl[location] == null ) return false;

        // console.log("hasJimun totalJimunUrl", totalJimunUrl, );
        // console.log("hasJimun location", location);
        // console.log("hasJimun totalJimunUrl[location]", totalJimunUrl[location], totalJimunUrl[location].length > 0);
        // console.log("hasJimun loadJimunArray : ",loadJimunArray);
        if(totalJimunUrl[location].length > 0) {
            try{
                // console.log("playerJimun : ",psJimun);
                // console.log("commandsJimun : ",commandsJimun);
                
                // console.log("hasJimun totalJimunUrl : ",totalJimunUrl, totalJimunUrl[location], loadJimunArray.indexOf(totalJimunUrl[location]));
                if(playerJimun != undefined && loadJimunArray.length > 1) {
                    // console.log("hasJimun playerJimun : ",playerJimun);
                    if( playerJimun == null ) return false;

                    var psJimun = null;
                    try{
                        psJimun = playerJimun.getPlayerServicesJimun();
                    }catch(e){
                        return false;
                    }
                    
                    // console.log("loadJimunArray : ",loadJimunArray, loadJimunArray > 1);
                    // console.log("hasJimun psJimun : ",psJimun);
                    // console.log("hasJimun commandsJimun 2", playerJimun, psJimun);
                    // var commandsJimun = psJimun.getCommands();
                    // var idx = parseInt(loadJimunArray.indexOf(totalJimunUrl[location]));
                    // console.log("hasJimun commandsJimun 2", idx);
                    // if( commandsJimun != null ) {


                    //     var currentPage = psJimun.getCurrentPageIndex();
                    //     if( currentPage == -1) return false;
                    //     console.log("hasJimun currentPage", currentPage, "idx : ", idx);
                    //     if( currentPage != idx ) commandsJimun.gotoPageIndex(idx);


                    // }
                    // console.log("hasJimunhasJimun");
                };
            }catch(e){
                console.log("hasJimun eeebe8: ",e, playerJimun);
                return false;
            }
            

            return true;
        }else{
            return false;
        }
    }catch(e){
        // console.log("hasJimun", e);
        return false;
    }

}

var preLocation = -1;
var preJimunURL = "";
function setJimun(location){
  
    // console.log("setJimun", location);
    if(hasJimun(location)) {

        var psJimun = playerJimun.getPlayerServicesJimun();    
        var commandsJimun = psJimun.getCommands();

        // var ps = player.getPlayerServices();
        // var commands = ps.getCommands()

        // console.log("setJimun hasJimun(location)",location,  hasJimun(location));

        var idx = parseInt(loadJimunArray.indexOf(totalJimunUrl[location]));
        // console.log("setJimun idx", idx, location, totalJimunUrl);

        // console.log("setJimun preJimunURL", preJimunURL, totalJimunUrl[location]);
        if( preJimunURL == totalJimunUrl[location]){
            preLocation = location;
            initJimunLayout(true);
            return;
        }

        // console.log("hasJimun commandsJimun 2", idx);
        if( commandsJimun != null ) {
            var currentPage = psJimun.getCurrentPageIndex();
            // if( currentPage != -1 && preLocation != location){
            if( currentPage != -1){
                // console.log("setJimun currentPage", currentPage, "idx : ", idx);
                commandsJimun.gotoPageIndex(idx);
            }
        }
        preLocation = location;
        preJimunURL = totalJimunUrl[location];

        initJimunLayout(true);
    }else{
        initJimunLayout(false);
        preJimunURL = "";
        preLocation = -1;
        
        try{
            if( totalJimunUrl != null && totalJimunUrl.length > 0 ){
                for ( var i=0; i<totalJimunUrl.length ; ++i){
                    if( totalJimunUrl[i].length > 0 ){
                        var psJimun = playerJimun.getPlayerServicesJimun();    
                        var commandsJimun = psJimun.getCommands();
                        if( commandsJimun != null ) {
                            commandsJimun.gotoPageIndex(i);
                        }
                        continue;
                    }
                }
               
            }
        }catch(e){
            
        }
    }
}

function nextPage(){
    var ps = player.getPlayerServices();
    var commands = ps.getCommands();
    // ps.gotoPageIndex(parseInt(location));
    commands.nextPage();

    objCurrentQuesInfo = {};

	getCurrentNum();
}

function prevPage(){
    var ps = player.getPlayerServices();
    var commands = ps.getCommands();
    // ps.gotoPageIndex(parseInt(location));
    commands.prevPage();

    objCurrentQuesInfo = {};

	getCurrentNum();
}

//        function moveQuestion(type){
//            num = "0";
//            if( type == "prev" ){
//                prevPage();
//
//            }else{
//                nextPage();
//            }
//        }

function showJimunImg(){
    try {

        var jiminUrl = jimunArr[currentNum];
        // console.log("jiminUrl : " + jiminUrl + ", jiminUrl.length  : " + jiminUrl.length + " , currentNum : " + currentNum);
        if (jiminUrl.length > 6) {
            // console.log("jiminUrl visible : " + document.getElementById("imgJimun"));
            document.getElementById("imgJimun").src = jiminUrl;
            document.getElementById("imgJimun").style.marginBottom = "50px";
            document.getElementById("imgJimun").style.display = "block";
            // console.log("jimun width : " + document.getElementById("imgJimun").width);
        } else {
            // console.log("jiminUrl hidden");
            document.getElementById("imgJimun").style.marginBottom = 0;
            document.getElementById("imgJimun").style.display = "none";
        }
    }catch(e){
        // console.log("e jiminUrl hidden");
		if( document.getElementById("imgJimun") != null ){
            document.getElementById("imgJimun").style.marginBottom = 0;
            document.getElementById("imgJimun").style.display = "none";
		};
    };
//
}

var currentNum = 0;
function moveQuestion(type){

    // sendMessageToContainer("@saveTempState");

    var ps = player.getPlayerServices();
    var model = ps.getPresentation();
    var totalCnt = model.getPageCount();

    num = "0";
    if( type == "prev" ){
        if( currentNum < 1 ){
            return;
        }

        num = (--currentNum)+"";

    }else if( type == "next"){
        if( currentNum + 1 >= totalCnt){
            return;
        }
        num = (++currentNum)+"";
    }else{
        //content ID가 넘어온 경우
        for (var i=0; i<arrQuestion.length; ++i){
            if( arrQuestion[i].contentId == type ){
                num = i;
                if( num == currentNum ) return;

                currentNum = i;
                break;
            }
        }

    }

    // 문항 이동전 현재 문항 임시 저장
    // sendMessageToContainer("@saveState");
    //문항 y 포지션 0으로
    resetScrollTop();

    // endDateQuestion = getCurrentTime();
    // console.log("num : " + num);
    // console.log("currentNum : " + currentNum);
    isCheckAnswer = false;
    bExistsJimun = false;
    setCurrentNum(num);
    objCurrentQuesInfo = {};
	getCurrentNum();


}

//문항
function resetScrollTop(){
     try{
        var second = document.getElementById('second');
        second.scrollTop = 0;
    }catch(e){}
}

/**
 * 개별 채점
 * @returns {*}
 */
  function getEachScore(isShowAddClss="false") {
    try{
        // console.log("player: " + player);
        // console.log("isShowAddClss: " + isShowAddClss);
        var ps = player.getPlayerServices();;

        // if( !bMultiPages ){
        //     ps = player.getPlayerServices();
        // }else{
        //     ps = player.getPlayerServicesByPageIndex(1);
        // }

        var scoreService = ps.getScore();
        currentPage = ps.getCurrentPageIndex(); //get current

        var model = ps.getPresentation(currentPage);
        var page = model.getPage(currentPage);
        var command = ps.getCommands();

        console.log("currentPage", currentPage);

        isCheckAnswer = true;
        // isCheckAnswer = (isShowAddClss == "true");

        //뷰어 정답 체크
        if (isShowAddClss == "true") {
            // console.log("isShowAddClss!!!");
            command.checkAnswers();
        }
//            command.setWorkMode();
//            command.checkAnswers();
//            command.executeEventCode("enable");


        if (isShowAddClss == "false"){
            getNotGoodAddClass();
        }
        if(page.isReportable()){
            var score = scoreService.getPageScore(page.getName());

            // //채점시 채점 정보 보이는 현상 막기 위해
            // addNotGoodAddClass(false);
            // getNotGoodAddClass();
            // removeNotGoodAddClass();
            // getNotGoodAddClass();

            if (isShowAddClss == "false") {
                //채점시 채점 정보 보이는 현상 막기 위해
                addNotGoodAddClass(false);
                getNotGoodAddClass();
                removeNotGoodAddClass();
                getNotGoodAddClass();
            }



            console.log("maxScore : " + score['maxScore']);
            console.log("new score : " + score['score']);
            console.log("mistakeCount : " + score['mistakeCount']);
            console.log("errorCount : " + score['errorCount']);

//                if (score['maxScore'] != 0 && score['score'] == score['maxScore'] && score['errorCount'] == 0){
            //  정답이 없는 경우를 대비해서
            // 커스텀스코어링인 경우 score['errorCount'] >= 100 체크
            if ((score['score'] == score['maxScore'] && (score['errorCount'] == 0 || score['errorCount'] >= 100 ))||score['errorCount']== 999 ){
//                if (score['score'] == score['maxScore']){
                console.log("정답");
                if( isAuthor ) alert("정답");
                return true;
            }
        }else{
            console.log("오답");
            if( isAuthor ) alert("오답");
            return false;
        }
        console.log("오답");
        if( isAuthor ) alert("오답");
        return false;
    }catch(e){
        console.log("getEachScore",e);
        if( isAuthor ) alert("오답");
        return false;
    }
    
}
//         function getEachScore(){
//             console.log("player: " + player);
//             var ps = player.getPlayerServices();
//             var scoreService = ps.getScore();
//             currentPage = ps.getCurrentPageIndex(); //get current

//             var model = ps.getPresentation(currentPage);
//             var page = model.getPage(currentPage);
//             var command = ps.getCommands();

//             isCheckAnswer = true;

//             //뷰어 정답 체크
//             command.checkAnswers();
// //            command.setWorkMode();
// //            command.checkAnswers();
// //            command.executeEventCode("enable");

//             getNotGoodAddClass();
//             if(page.isReportable()){
//                 var score = scoreService.getPageScore(page.getName());
//                 console.log("maxScore : " + score['maxScore']);
//                 console.log("score : " + score['score']);
//                 console.log("mistakeCount : " + score['mistakeCount']);
//                 console.log("errorCount : " + score['errorCount']);

// //                if (score['maxScore'] != 0 && score['score'] == score['maxScore'] && score['errorCount'] == 0){
//                 //  정답이 없는 경우를 대비해서
//                 // 커스텀스코어링인 경우 score['errorCount'] >= 100 체크
//                 if ((score['score'] == score['maxScore'] && (score['errorCount'] == 0 || score['errorCount'] >= 100 ))||score['errorCount']== 999 ){
// //                if (score['score'] == score['maxScore']){
//                     console.log("정답");
//                     alert("정답");
//                     return "true"
//                 }
//             }else{
//                 console.log("오답");
//                 alert("오답");
//                 return "None";
//             }
//             console.log("오답");
//             alert("오답");
//             return "false"
//         }

/**
 * 문항 enable/disable
 * @param state
 * @returns {*}
 */
var quesEnable = "false";
function setQuestionEnable(isEnable){
    try{
        var ps = player.getPlayerServices();
        var command = ps.getCommands();
//                command.setWorkMode();
        command.uncheckAnswers();

        if( isEnable == "true") {
            command.setWorkMode();
        }else{
            getNotGoodAddClass();
            //채점시 채점 정보 보이는 현상 막기 위해
            addNotGoodAddClass(false);
            getNotGoodAddClass();
            removeNotGoodAddClass();
            getNotGoodAddClass();

            // console.log("문항 비활성화1");
            // command.checkAnswers();

            // var scoreService = ps.getScore();
            // var model = ps.getPresentation(currentPage);
            // var page = model.getPage(currentPage);

            // if(page.isReportable()){
            //     var score = scoreService.getPageScore(page.getName());
            // }
        }
        quesEnable = isEnable;
//                removeNotGoodAddClass();
    }catch(e){
        var key = ps.getModule('EKeyboard1');
    }
}

/**
 * 문항 정답 보여주기
 * @returns {*}
 */
function showAnswer(visible){
    try{
        // console.log("showAnswer");
        var ps = player.getPlayerServices();
        ps.getModule("Show_Answers1")
        var showAnswer = ps.getModule("Show_Answers1");
        var keyboards = document.getElementsByClassName("addon_eKeyboard");
        if( visible == "Y") {
            showAnswer.sendEvent("ShowAnswers");
            for (i = 0; i < keyboards.length; i++) {
                ps.getModule(keyboards[i].id).hideKeyboard();
            }

        }else{
            showAnswer.sendEvent("HideAnswers");
        }
//                console.log(command.getPlayerConfig());
//                command.checkAnswers();
    }catch(e){
        console.log(e);
    }
}

/**
 * 사용자 입력답 가져오기
 * @param state
 * @returns {*}
 */
function getUserAnswer(){
    try{
        // console.log("getUserAnswer");
        var ps = player.getPlayerServices();
        var textArea = ps.getModule("TextArea1");
        return textArea.getGapText(1);
    }catch(e){
        console.log(e);
    }
    return "";
}


function getRegularJson(state){

    state = state.replace(/\\/gi, "");
    state = state.replace(/"{/gi, "{");
    state = state.replace(/}"/gi, "}");

    //mathJax 예외 처리
    state = removeMathjaxFrac(state);

    return state;
}

function removeMathjaxFrac(state){
    try{
        var arrResult = [];
        var arr = state.match(/\[[{0-9}]*frac[{0-9}]*\]/g);
        // console.log("makeMathjaxFrac arr", arr);
        for( var i=0; i<arr.length; ++i){
            state = state.replace(arr[i], "");
            // var s = arr[i].replace(/\[/gi, "\\[");
            // s = s.replace(/frac/gi, "\\frac");
            // s = s.replace(/\]/gi, "\\]");
            // arrResult.push(s);
        }

        // console.log("makeMathjaxFrac", arrResult);
    }catch(e){
        console.log("makeMathjaxFrac e", e);
    }
    return state;
}

// function getState(){

//     var state = player.getState();
//     state = JSON.parse(state);
//     console.log(state);
//     state = JSON.stringify(state);
//     console.log(state);

//     state = getRegularJson(state);
//     console.log("state 1: " + state);

//     return state;
// }

function setState(currentQuestionInfo){
    var state = currentQuestionInfo.tempState;
    state = jsonToStr(JSON.parse(state));
    // console.log("state : " + state);
    player.setState(state)
    $("#_QPlayer").empty();
    // player.load(questionUrl, 0);
}


//      function getLessonScore(){
//          var ps1 = player.getPlayerServices();
////            var model = ps.getPresentation();
//            var models = ps1.getPresentations();
//            var modelCnt = models.length;
////            console.log("models 1 : " +models);
////            console.log("models 2 : " + Array.isArray(models) );
////
////            for(var key in models) {
////                var attr = models[key];
////                console.log("attr : " + key + " => " + attr);
////            }
////
//            var sumOfScore = 0.0;
//            var count = 0;
//            var rightCount = 0;
//            for( var k =0; k<modelCnt; ++k){
//                try {
//                    var ps = player.getPlayerServices(k);
////                    console.log("ps : " + ps.getScore());
//                    var model = ps.getPresentation(k);
////                    var model = models[k];
////                    console.log("model : " + model);
//                    var scoreService = ps.getScore();
//                    console.log("scoreService : " + scoreService);
//                    for (var i = 0; i < model.getPageCount(); i++) {
//                        var page = model.getPage(i);
//                        if (page.isReportable()) {
//                            count += 1;
//                            var score = scoreService.getPageScore(page.getName());
//                            if (score['maxScore'] != 0 && score['score'] == score['maxScore']) {
//                                rightCount += 1;
//                            }
//                        }
//                    }
//                }catch(e){
//                    console.log("e : " + e);
//                    count += 1;
//                }
//
//            }
//
//            var result = rightCount + "/" + count;
//            console.log(result);
//
//            return result;

//          var scoreService = ps.getScore();
//          var sumOfScore = 0.0;
//          var count = 0;
//          var rightCount = 0;
//
//          for(var i = 0; i < model.getPageCount(); i++){
//              var page = model.getPage(i);
//              if(page.isReportable()){
//                  count += 1;
//                  var score = scoreService.getPageScore(page.getName());
//                  if (score['maxScore'] != 0 && score['score'] == score['maxScore']){
//                      rightCount += 1;
//                  }
//              }
//          }
//
//          // return String(lessonScore) + " / " + String(model.getPageCount()) + " / " + String(pages);
//            var result = String(rightCount) + "/" + String(count) + "/" + String(model.getPageCount());
//            console.log(result);
//          return result;
//      }

 function getLessonScore(){
    var ps = player.getPlayerServices();
    var model = ps.getPresentation();
    var scoreService = ps.getScore();
    var sumOfScore = 0.0;
    var count = 0;
    var rightCount = 0;

    for(var i = 0; i < model.getPageCount(); i++){
        var page = model.getPage(i);
        if(page.isReportable()){
            count += 1;
            var score = scoreService.getPageScore(page.getName());
            console.log("count : " + count);
            console.log("score['score']  : " + score['score']);
            console.log("score['maxScore']  : " + score['maxScore']);
            if( score['score'] == score['maxScore'] ){
                rightCount += 1;
            }
//                  var percentageScore = (score['score']*100.0)/score['maxScore']
//                  if( isNaN(percentageScore) ){
//                      percentageScore = 0.0;
//                  }
//                    console.log("percentageScore : " + percentageScore);
//                  sumOfScore += percentageScore;

            // pages += String(percentageScore) + "," + String(score['score']) + "," + String(score['maxScore']) + "===";
        }
    }

    // var page = model.getPage(0);
//            if(page.isReportable()){
//                count += 1;
//                var score = scoreService.getPageScore(page.getName());
//                var percentageScore = (score['score']*100.0)/score['maxScore']
//                sumOfScore += percentageScore;
//
//                return String(score) + " / " + String(score['score']) + " / " + String(score['maxScore'])
//            }

    var lessonScore = sumOfScore/count;
     console.log("lessonScore : " + lessonScore);
     var result = rightCount + "/" + count;
     console.log("result : " + result);
    // return String(lessonScore) + " / " + String(model.getPageCount()) + " / " + String(pages);
    return result;
}

function jsonTest(state){
    // alert(state);
    var data = JSON.parse(state);
    var strData = JSON.stringify(data)
    alert(strData)
}

function getUserState(){
    try{
        var state = app.getState();
        // console.log(state)
        // var data = JSON.parse(state);
        var strData = JSON.stringify(state)
        console.log(strData)
        // var strData = JSON.stringify(data)
        // var objData = JSON.parse(data)
//          var strData = JSON.stringify(objData)
        // alert(strData);
        // return strData;
    }catch(e){};

}

//mp3 재생
function playMP3(){
    var arrAudio = document.getElementsByClassName('addon_MultiAudio');

    if( arrAudio.length > 0 ){
        //문항 시작 delay time (1초)
        var delayTime = 1000 * 1;

        var audioID = arrAudio[0].id;

        var ps = player.getPlayerServices();
        var audio = ps.getModule(audioID);

        if( audio != null ){
            audio.onEventReceived = function(eventName, eventData) {
                // console.log(eventName, "=", eventData);
                if( eventName == "ValueChanged" && eventData.value == "end"){
                    if( !audio.isEndOfIndex() ){
                        setTimeout(function(){
                            audio.next();
                            audio.play();
                        }, 500 );
                    }
                }

            }

            console.log("playmp3");
            //문항 시작시 MP3 재생
            setTimeout(function(){
                audio.muted = true;
                audio.play();
                audio.muted = false;
            }, delayTime );
        }

    }

}

//정답 해설 가지고 오기
function getAnswerSolve(){
    const container = document.querySelector("#_QPlayer");
    var variableStorages = container.querySelectorAll("[class=addon_Variable_Storage]");
    // console.log("variableStorages", variableStorages);
    if( variableStorages.length == 0 ) return {};


    var variableStorage = variableStorages[0];
    var id = variableStorage.id;
    var ps = player.getPlayerServices();
    var variableStorageModule = ps.getModule(id);

    if( variableStorageModule == null ) return {};

    var answerType = variableStorageModule.getVariable("AnswerType");
    var solveType = variableStorageModule.getVariable("SolveType");
    var answerQnote = variableStorageModule.getVariable("AnswerQnote");
    var solveQnote = variableStorageModule.getVariable("SolveQnote");


    var answer = variableStorageModule.getVariable("Answer");
    var solve = variableStorageModule.getVariable("Solve");
    var answerImage = variableStorageModule.getVariable("Answer Image");
    var solveImage = variableStorageModule.getVariable("Solve Image");

    return {"answer": answer, "solve": solve, "answerImage":answerImage, "solveImage": solveImage
            , "answerType":answerType, "solveType": solveType, "answerQnote":answerQnote, "solveQnote": solveQnote};

}

// 페이지 높이 설정

//지문 위치 설정
var paddingTopDefault = parseInt(styles.getPropertyValue('--div-top-padding'));//40;
var scaleablePaddingTop = parseInt(styles.getPropertyValue('--scaleable-padding-top'));//42;
var authtoolHeight = parseInt(styles.getPropertyValue('--authtool-height'));//30;
var paddingTop = paddingTopDefault;
var questionBottom = 30;
function doJimunPosision(){


   
    var screenHeight = $(window).height();//window.innerHeight;
    var viewerContainer = document.getElementById('viewer_container');

    
    // console.log("initJimunLayout", screenHeight, ich);


    questionBottom = (arrQuestion != null && arrQuestion[currentPage].mode == "review") ? 80 : 30;
    var bHasJimun = hasJimun(currentPage);

    var div = document.getElementById('scaleable-wrapper');
    var body = document.getElementById('body');
    var padding = paddingTop  + (isAuthor?authtoolHeight:0);
    // console.log("padding", padding);
    var ich = 0;//$('#_QPlayer').height() + 100;
    // var h = parseInt( (screenHeight - padding) * (1/wrapperScale) );
    var h = parseInt( (screenHeight - padding) * (1/wrapperScale) );
    h = Math.max(h, ich);

    var isMobile = detectMobileDevice(userAgent);
    // if( isMobile) h - 30;
    div.style.height = h + "px";
    // var tempGap = (bHasJimun) ? 0  : scaleablePaddingTop + questionBottom;
    var tempGap = (bHasJimun) ? 0  : scaleablePaddingTop + questionBottom;

    // console.log("tempGap1", bHasJimun, tempGap);
    //모바일에 세로 화면인 경우 bottom gap 을 더 준다.
    var isVertical = window.innerWidth < window.innerHeight;
    if( detectMobileDevice(userAgent, false) &&  isVertical ){
        tempGap += 100;
    }
    // console.log("tempGap2", bHasJimun, tempGap);
    viewerContainer.style.height = (h - tempGap) + "px";
    // viewerContainer.style.height = (h - tempGap - questionBottom) + "px";

    // console.log("doJimunPosision123", isMobile, scaleablePaddingTop, screenHeight, h, (1/wrapperScale) );

    setSecondHeight();
}

var doit;
function setJiminPosision(){
    // if( !bExistsJimun ) return;

    clearTimeout(doit);
    doit = setTimeout(doJimunPosision, 100);

}

// 모바일 기기 인지
function detectMobileDevice(agent, withSize=true) {
    var md = new MobileDetect(agent);



    // console.log("detectMobileDevice1",  md.mobile() );          // 'Samsung'

    // console.log("detectMobileDevice2",  md.phone() );           // 'Samsung'

    // console.log("detectMobileDevice3", md.tablet() );          // null

  const mobileRegex = [
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /SamsungBrowser/i
  ]

  var bMobile = mobileRegex.some(mobile => agent.match(mobile))
                || md.mobile() != null
                || md.phone() != null
                || md.tablet() != null;
  // console.log("detectMobileDevice4", bMobile);         

  return bMobile || ( withSize && window.innerWidth < 1000);
}


// var standardWidth = 1220;//$("#viewer_container").width();
var standardWidth = parseInt(styles.getPropertyValue('--scaleable-width'));//$("#viewer_container").width();
var wrapperScale = 1;
function setScaleViewer(){
    // console.log("setScaleViewer", standardWidth);
    // var standardWidth = 1220;
    // var standardWidth = 1220;
    var standardHeight=  parseInt(styles.getPropertyValue('--scaleable-height'));
    var wrapper = $("#scaleable-wrapper");
    var body = $("#body");


    if( standardWidth == null ){
        //$("#ic_page");ic_page.width();
    }

    var windowWidth = window.innerWidth
    var windowHeight = window.innerHeight;


    // wrapperScale = Math.min( windowWidth/standardWidth, windowHeight/standardHeight);

    var screenSizes = window.mAuthor.ScreenUtils.getScreenSizesDependingOnOrientation(userAgent);
    // var isMobile = screenSizes.orientation !== window.mAuthor.ScreenUtils.ORIENTATION_TYPES.NOT_MOBILE;
    var isMobile = detectMobileDevice(userAgent);
    // var isHorizontal = screenSizes.orientation === window.mAuthor.ScreenUtils.ORIENTATION_TYPES.LANDSCAPE;
    var isHorizontal = window.innerWidth > window.innerHeight;
    // maxScale = ( isMobile && isHorizontal ) ? 0.50 : 1.2;
    maxScale =  1.2;

    wrapperScale = windowWidth/standardWidth;
    // console.log("isMobile 1", isMobile,  isHorizontal,wrapperScale);
    if( isMobile && isHorizontal ) wrapperScale = wrapperScale * 0.7;
    // console.log("isMobile 2", isMobile,  isHorizontal,wrapperScale);
    wrapperScale = Math.min(maxScale, wrapperScale);
    wrapperScale = Number.parseFloat(wrapperScale).toFixed(2);

    standardHeight = standardHeight * wrapperScale;
    // console.log("wrapperScale", wrapperScale);

    var left = parseInt( (body.width() - standardWidth * wrapperScale)/2 );


    paddingTop = ( left < 70 ) ? paddingTopDefault*2 : paddingTopDefault;
    // console.log("paddingTop", paddingTop);
    document.getElementById("div_top_padding").style.paddingTop = paddingTop + "px";

    wrapper.css({
        "transform": "scale(" + wrapperScale + ")",
        "transform-origin": "0% 0%",
        "left": left,
        "display" : "flex"
    });

    var objScale = {};
    objScale.scaleX = wrapperScale + "";
    objScale.scaleY = wrapperScale + "";
    objScale.transform = "scale(" + wrapperScale + ")";
    objScale.transformOrigin = "0% 0%";
    if( player != null ) player.getPlayerServices().setScaleInformation(objScale);

    // wrapper.display = "flex";
    setJiminPosision();


    //모바일에 세로일경우 해설버튼 확대하기
    isMobile = detectMobileDevice(userAgent, false);
    var btnSolve = $("#btnSolve");
    var scale = 1;
    if( isMobile && !isHorizontal ) {
        scale = 2;
    }

    btnSolve.css({
        "transform": "scale(" + scale + ")",
        "transform-origin": "bottom center",
    });
}

function jsonTest(state){
    // alert(state);
    var data = JSON.parse(state);
    var strData = JSON.stringify(data)
    alert(strData)
}

function strToJson(str){
    try{
        var result = "";
        var json = JSON.parse(str);
        if(json.constructor == Object){
            var rsJson = {};
            $.each(json, function(key, value){
                rsJson[key] = strToJson(value);
            });
            result = rsJson;
        }else{
            result = str; //parse한값을 넘기는게 맞으나 player.getState, setState시 최종값들을 스트링으로 주고받고 있어서 최종값은 파싱하지 않음
        }
        return result;
    }catch(e){
        return str;
    }
}

function getState(){
    var state = player.getState();
    // console.log(state);
    state = strToJson(state);
    console.log("state 1: " + JSON.stringify(state));
    return state;
}

function getUUID(url){
    try {
        var ss = url.split("/");
        return ss[ss.length -3];
    }catch(e){}

    return "-1";
}

function getCurrentQuestionState(){
    var currentState = {};
    try {
        var uuid = getUUID(arrQuestion[parseInt(currentNum)].url);
        // console.log("uuid", uuid);
        // var state = getState();
        // var objState = JSON.parse(state);
        var objState = getState();
        var keys = Object.keys(objState["state"]);
        // console.log("keys", keys);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            // var match = key.match(/_\d{2}/g)[0];
            // var key = key.split(match)[0] + match;
            // var key = key.match(/^[_0-9]{3}$/g);
            // var key = key.match(/^[0-9]{2}$/);
            // console.log("getCurrentQuestionState", key, "uuid", uuid);
            // console.log("key", key);
            if (key.indexOf(uuid) > -1) {
            // if (key == uuid) {
                //variable storage 는 입력값에서 제외
                if( objState["state"][key]["Variables"] != null ) continue;

                //visible == false 는 제외
                // if( objState["state"][key]["isVisible"] != null 
                //     && ( objState["state"][key]["isVisible"] == false
                //         || objState["state"][key]["isVisible"] == "false") )  continue;

                currentState[key] = objState["state"][key];
            }
        }
    }catch(e){};

    // console.log("currentState", currentState);
    return currentState;
}

function jsonToStr(paramJson){
    try{
        var json = $.extend({}, paramJson);
        $.each(json, function(key, value){
            if(json[key].constructor == Object){
                json[key] = jsonToStr(value);
            }
        });
        json = JSON.stringify(json);
        return json;
    }catch(e){
        return paramJson;
    }
}
function setState(state){
    state = jsonToStr(JSON.parse(state));
    // console.log("state : " + state);
    player.setState(state)
    $("#_QPlayer").empty();
    player.load(questionUrl, 0);
    return
}

function makeState(strState){
    var sb = "";

    //var depthCount = ["", "\\", "\\\\\\", "\\\\\\\\\\\\\\", "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\", "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"];

    var depthCount = ["", "\\"];

    var gubun = "\\";
    var startCnt = 1;
    for(var i=0; i< 8; i++){
        startCnt = startCnt*2+1;
        depthCount.push(gubun.repeat(startCnt));
    }

    var depth = -1;

    for(var i=0; i<strState.length; ++i){
        currntChar = strState.charAt(i);

        if( currntChar ==  '{' ){
            ++depth;
        }

        if( currntChar ==  '}' ){
            --depth;
        }


        if( currntChar == '"' ){
           sb += depthCount[depth];
        }

        if( currntChar == '{'){
            if( depth-1 > -1 ) {
               sb += depthCount[depth-1];
            };
           sb += '"';
        }else  if( currntChar == '}'){
           sb += currntChar;
            if( depth> -1 ) {
               sb += depthCount[depth];
            };
           sb += '"';
            continue;
        }

        sb += currntChar;
    }
    sb = sb.substr(1, sb.length-2)
    return sb;
}

function addslashes (str) {
    return (str+'').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

// 문항과 지문을 동시에 로드 처리
function loadProblem(arrQuestion){
    var marking = document.getElementById("marking");
    marking.style.display = "none";

    var urls = getQuestionUrl(arrQuestion);
    // console.log('urls : ',urls)
    setScaleViewer();
    if(urls.passageUrl.length > 0) {
        loadJimun(urls.passageUrl,urls.questionUrl);
        initJimunLayout(true);
    }
    else{
        initJimunLayout(false);
        loadQuestion(urls.questionUrl);
    }

}

var totalJimunUrl;
var loadJimunArray = [];
var prejimunPlayer = null;
function loadJimun(jimunUrl, questionUrl){

    // console.log("loadJimun()", jimunUrl);

    loadJimunArray = [];
    bExistsJimun = true;
    totalJimunUrl = jimunUrl;

    var arrFiles = new Array();
    arrFiles.push("core/css/main.xml");

//    var url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/cp/qnote/%s/pages/main.xml"
//    if( window.location.pathname.split('/')[1] == 'dev' ){
//        url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/dev/%s/pages/main.xml"
//    }
//    else if( window.location.pathname.split('/')[1] == 'cp' ){
//        url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/cp/qnote/%s/pages/main.xml"
//    }
//    else if( window.location.pathname.split('/')[1] == 'real' ){
//        url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/real/%s/pages/main.xml"
//    }
//    else if( window.location.host.indexOf("localhost") > -1 ){
//        //cdnUrl = "http://localhost:3001/contents/%s/pages/main.xml"
//        url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/cp/qnote/%s/pages/main.xml"
//    }
    var url = cdnUrl;

    // var url = "contents/%s/pages/main.xml";
    //arrFiles.push(url);
    for(var i=0; i<jimunUrl.length; ++i){
        var path = "";
        if(jimunUrl[i].length > 0) {
            // path = path + url.replace(/%s/gi, jimunUrl[i]);
            if( jimunUrl[i].indexOf("http") > -1) {
                path = jimunUrl[i].split("/pages/")[0] + "/pages/main.xml";
            }else{
                // console.log("a", url.replace(/%s/gi, jimunUrl[i].split("/pages")[0]));
                path = path + url.replace(/%s/gi, jimunUrl[i].split("/pages")[0]);
            }

            // path = path + url.replace(/%s/gi, jimunUrl[i].split("/pages")[0]);
            loadJimunArray.push(jimunUrl[i]);
            // console.log("path : " + path);
            arrFiles.push(path);
        }

    }

    // console.log("loadJimun arrFile", arrFiles);
    if( arrFiles.length == 1 ){
        loadQuestion(questionUrl);
        return;
    }
    /*
    var arrFiles = new Array();
    arrFiles.push("core/css/main.xml");
    var url = "contents/%s/pages/main.xml".replace(/%s/gi, jimunUrl);
    arrFiles.push(url);
    */
    var sJimunUrl = JSON.stringify(arrFiles)

    // playerJimun = icCreatePlayer('_jiplayer');


    // console.log("prejimunPlayer : " + prejimunPlayer);
    if( prejimunPlayer != null ){
        try {
            var p = document.getElementById("_jiplayer");
            var iFrame = p.getElementsByTagName("table")[0];
            if (!iFrame) return;
            p.removeChild(iFrame);
            prejimunPlayer = null;
            // console.log("remove prejimunPlayer");
        }catch(e){
            console.log("e: " + e);
        }
    }

    try{
        playerJimun = icCreatePlayerJimun('_jiplayer');
        console.log("playerJimun: " + playerJimun);
    }catch(e){
        playerJimun = icCreatePlayerJimun("_jiplayer");
    }
    prejimunPlayer = playerJimun;


 

    // console.log("player: " + player);
    var quesNum = getStartQuesNum();
    // playerJimun.load2(sJimunUrl, "MATH", "1", quesNum);
    playerJimun.loadJimun(sJimunUrl, quesNum);
    playerJimun.onStatusChangedJimun(function(type, source, value){
        // console.log("type:" + type + ", source: " + source, ", value:" + value);
    });


    var jimunFirstPageLoaded = false;
    playerJimun.onPageLoadedJimun(function onPageLoadedHandler() {

         console.log("playerJimun.onPageLoaded:", jimunFirstPageLoaded);

        if( !jimunFirstPageLoaded ){
            setTimeout(function(){
                loadQuestion(questionUrl);
            }, 1);
        }
        jimunFirstPageLoaded = true;

        start = start || new Date().getTime();

    });

    playerJimun.onOutstretchHeightJimun(function () {
        iframeResizeRequest();
    });

    playerJimun.onPageScrollToJimun(function (top) {
        var parent = getOpener();
        if (parent) {
            parent.postMessage('SCROLLTOP:' + top, "*");
        }
    });
    window.addEventListener("message", receiveMessage, false);

}

function getAllStates(){
    if( arrQuestion == null ) return;

    objState = '{"state":{';
    for( var i=0; i<arrQuestion.length; ++i){
        var quesState = JSON.stringify(arrQuestion[i].tempState);
        if( quesState != null && quesState.length > 10){
            console.log("quesState", quesState);
            quesState = quesState.substr(1);
            quesState = quesState.slice(0,-1);
            objState += quesState + ",";
        }
    }

    objState = objState.slice(0,-1) + '}}';

   // console.log("objobjState string", objState);
    objState = JSON.parse(objState);
    objState["score"] = {};
    objState["time"] = {"pages_times":{}};
    objState["isReportable"] = {};
    // console.log("objState", JSON.stringify(objState));
    return objState;
}


function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

function getCurrentTime(){

    var nowDate = new Date();

    var yyyy = nowDate.getFullYear().toString();
    var MM = pad(nowDate.getMonth() + 1,2);
    var dd = pad(nowDate.getDate(), 2);
    var hh = pad(nowDate.getHours(), 2);
    var mm = pad(nowDate.getMinutes(), 2)
    var ss = pad(nowDate.getSeconds(), 2)
    var ms = pad(nowDate.getMilliseconds(), 3) + "Z"

    return yyyy + "-" + MM + "-" + dd + "T" + hh + ":" + mm + ":" + ss + "." + ms;

}

function addQuestionScrollEvent(){
    var viewerContainer = $('#viewer_container');
    var marking = document.getElementById("marking");
    var top = parseInt(marking.style.top);
    console.log("addQuestionScrollEvent", top);

    viewerContainer.scroll(function(){
        var position = viewerContainer.scrollTop();

        // var leftGap = 0;
        // try{
        //     leftGap = parseInt( $("#_QPlayer .ic_player").position().left );    
        //     console.log("leftGap", leftGap);
        // }catch(e){
        //     console.log("addQuestionScrollEvent leftGap", e);
        // };
        
        console.log("position", position);

        try{
            if(arrQuestion[currentPage].mode == "review") {
                marking.style.top = (top - position) + "px";

                // if( leftGap > 90 &&  leftGap < 94){
                //     marking.style.left = (markingStartX - 15) + "px";
                // }else if( leftGap > leftGap < 108 ){
                //     marking.style.left = markingStartX + "px";
                // }
            };
        }catch(e){
            marking.style.top = (top - position) + "px";
        }
        
    });
}

//시작 문항 번호 가져오기
function getStartQuesNum(){
    if( selectedContentId == null || selectedContentId == "null" ) return 0;

    try{
        for( var i=0; i<arrQuestion.length; ++i){
            if( arrQuestion[i].contentId == selectedContentId ){
                currentNum = i;
                return i;
            }
        }

        return 0;
    }catch(e){
        return 0;
    }

}

var prePlayer = null;
var quesLoaded = "false";
var objCurrentQuesInfo = {};
var fontLoaded = false;
var isFirstLoadPlayer = true;
var startDateQuestion = "";
var endDateQuestion = "";
var arrLabelQuestion = [];
function loadQuestion(arrQues){
    arrLabelQuestion = [];
    
	// console.log("loadQuestion", arrQues);

	var arrFiles = new Array();
	arrFiles.push("core/css/main.xml");

//    var url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/cp/qnote/%s/pages/main.xml"
//    if( window.location.pathname.split('/')[1] == 'dev' ){
//        url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/dev/%s/pages/main.xml"
//    }
//    else if( window.location.pathname.split('/')[1] == 'cp' ){
//        url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/cp/qnote/%s/pages/main.xml"
//    }
//    else if( window.location.pathname.split('/')[1] == 'real' ){
//        url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/real/%s/pages/main.xml"
//    }
//    else if( window.location.host.indexOf("localhost") > -1 ){
//        //cdnUrl = "http://localhost:3001/contents/%s/pages/main.xml"
//        url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/cp/qnote/%s/pages/main.xml"
//    }
    var url = cdnUrl;

    var arrError = [];
	for(var i=0; i<arrQues.length; ++i){

        var path = "";
        // console.log("arrQues[i].indexOf(): " + arrQues[i].indexOf("http"));
        //url값이 포함된 주소면
        if( arrQues[i].indexOf("http") > -1) {
            path = arrQues[i].split("/pages/")[0] + "/pages/main.xml";
            if(arrQues[i].indexOf("token=") > -1) {
                path += "token=" + arrQues[i].split("token=")[1];
            }
        }else{
            // console.log("a", url.replace(/%s/gi, arrQues[i].split("/pages")[0]));
            path = path + url.replace(/%s/gi, arrQues[i].split("/pages")[0]);
        }

        try{
            if( path.indexOf("qnote/") > -1 ){
                arrLabelQuestion.push(path.split("qnote/")[1]);        
            }else if( path.indexOf("dev/") > -1 ){
                arrLabelQuestion.push(path.split("dev/")[1]);        
            }else if( path.indexOf("real/") > -1 ){
                arrLabelQuestion.push(path.split("real/")[1]);        
            }else{
                arrLabelQuestion.push(path);    
            }
        }catch(e){
            console.log("aaa", e);            
        }
        

        //검수용일때 캐시 사용하지 않게 설정
        // console.log("loadQuestion isAuthor", isAuthor);
        if( isAuthor ){
            path += "?" + new Date().getTime();   

            if( httpGet(path) != 200 ){
                arrError.push(path);
            } 
        }

		console.log("path 2: " + path);
		arrFiles.push(path);
	}

    if( arrError.length > 0){
        alert("파일 로딩 애러\n\n" + arrError.join("\n"));
        return;
    }


    // console.log("loadQuestion arrFile", arrFiles);
	questionUrl = JSON.stringify(arrFiles)
    console.log("questionUrl", questionUrl);

    // console.log("prePlayer : " + prePlayer);
    if( prePlayer != null ){
        try {
            var p = document.getElementById("_QPlayer");
            var iFrame = p.getElementsByTagName("table")[0];
            if (!iFrame) return;
            p.removeChild(iFrame);
            prePlayer = null;
            console.log("remove prePlayer");
        }catch(e){
            console.log("e: " + e);
        }
    }

    try{
        player = icCreatePlayer('_QPlayer');
        // console.log("player: " + player);
    }catch(e){
        player = icCreatePlayer("_QPlayer");
    }
    prePlayer = player;


    // console.log("player: " + player);

    var quesNum = getStartQuesNum();
    try{
        var state = getAllStates();
        // console.log("question state ", JSON.stringify(state));
        var jsonCheck = (typeof state === 'object');
        if( state != null ){

            try {
                console.log("state jsonCheck", jsonCheck);
                if(jsonCheck){
                    console.log("load question ok : " + state);
                    state = jsonToStr(state);
                    player.setState(state);

                }else{
                    var data = JSON.parse(state);
                    var state = JSON.stringify(data);
                    state = makeState(state);
                    player.setState(state);
                }
            }catch(e){
                console.log("state parse e : " + e);
            }
        };

    }catch(e){};

    // 틀린문제 다시 풀기 이면
    if (!isFirstLoadPlayer) {
        currentNum = 0;
    }

    player.load2(questionUrl, "MATH", "1", quesNum, true, true);
//    player.load2(questionUrl, "MATH", "1", quesNum, true, true);
	player.onStatusChanged(function(type, source, value){
	    // console.log("type:" + type + ", source: " + source, ", value:" + value);
    });


    var currentInputID = "";
    function setMaxlength(){
        console.log("setMaxlength");

         $('input, textarea').click( function(ev) {
             try {
                 console.log("input click!!");

                 var maxlength = $(this).attr('maxlength');
                 var ishandwriting = $(this).attr("ishandwritinginput");
                 var keyboardType = $(this).attr("keyboardtype");

                 console.log("maxlength : " + maxlength);
                 console.log("ishandwriting : " + ishandwriting);
                 console.log("keyboardType : " + keyboardType);

                 if(ishandwriting != null && (ishandwriting != "none" && ishandwriting != "None" && ishandwriting != "all"
                     && ishandwriting != "false" && ishandwriting != "true")){
                     try{
                         // textArea = $(this);
                         textArea = ev.target;
                         // textArea = ev.target.parentNode.id;
                         hideKeyboard();
                         textArea.setAttribute("readonly", true);
                         // app.showHandWriting(ishandwriting, maxlength);
                     }catch(e){
                         window.location.href="toapp://showHandWriting?ishandwriting=" + ishandwriting+ "&maxlength=" + maxlength;
                     };
                 }

                 //max가 1이면 입력된 값 지운다.
                 if( maxlength == 1 ){
                     //ev.target.value = "";
                     var ps = player.getPlayerServices();
                     var ta = ps.getModule(ev.target.parentNode.id);
                     ta.reset();
                 }
                 // hideAndroidSWKeyboard(ev.target, keyboardType);

             }catch(e){

             }

         } );

        $('textarea, input').keypress(function(event){
            if (event.keyCode == '10' || event.keyCode == '13') {
                event.preventDefault();
            }
        });

        //가상 키패드 이벤트 chagen
        //물리 키패드 이벤트 keyup
        $('textarea, input').on('change keyup', function(){

            try{
                if (event.keyCode == '9'){
                    console.log("TAb!!!!");
                    var nextEl;
                    if( event.shiftKey && event.keyCode == 9) {
                        nextEl = findNextTabStop(event.target, false);
                    }else{
                        nextEl = findNextTabStop(event.target, true);
                    }
                    nextEl.focus();
                }
            }catch(e){};

            try {
                currentInputID = $(this).attr('id');
            }catch(e){};
            console.log("keyup!!!!!");

            //이모티콘 제거
            var text = $(this).val();
            var btextLen = text.length;
            // console.log("text1", text);
            text = text.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, '');
            var atextLen = text.length;
            // console.log("text2", text);
            // console.log("$(this)", $(this));

            var maxlength = parseInt($(this).attr('maxlength')),
                // text = $(this).val(),
                eol = text.match(/(\r\n|\n|\r)/g),
                count_eol = $.isArray(eol) ? eol.length : 0,//error if eol is null
                count_chars = text.length - count_eol;
            if (maxlength && count_chars > maxlength) {
                $(this).val(text.substring(0, maxlength + count_eol));
            }else if( atextLen != btextLen){
                var position = this.selectionStart;
                $(this).val(text);
                $(this).prop('selectionEnd', position);
            }


            // setAbnormalHangul($(this), false);
            // sendKeyboardEventToAndroidApp();
        });

    }



    var firstPageLoaded = false;
    var mapOverValue = {};
    player.onPageLoaded(function onPageLoadedHandler() {
        start = start || new Date().getTime();

        //  // 틀린문제 다시 풀기 이면
        // console.log("onPageLoaded", isFirstLoadPlayer, firstPageLoaded)
        if (!isFirstLoadPlayer && !firstPageLoaded ) {
            setCurrentNum(currentNum);
        }


        if( !firstPageLoaded ){
            getCurrentNum();    
        }
		
        showQuestionNum(currentPage);
        showSolveBtn();
        // console.log("정답", getAnswerSolve());
        playMP3();
        isFirstLoadPlayer = false;
        // console.log("onPageLoaded");
        startDateQuestion = getCurrentTime();

        // sendMessageToContainer("@saveTempState");
        // sendMessageToContainer("@open");

        //initialize currentScreenSize value
        // window.mAuthor.ScreenUtils.isSoftKeyboardResize();
        setScaleViewer();
        doJimunPosision();
        // setJimun(currentPage);
         // setJiminPosision();
		if (!firstPageLoaded) {
            setJimun(currentPage);
            //initJimunLayout();
            semiResponsiveLayoutChooser = new window.semiResponsive.LayoutChooser(player.getSemiResponsiveLayouts());
            var screenSizes = window.mAuthor.ScreenUtils.getScreenSizesDependingOnOrientation(userAgent);

            //initialize currentScreenSize value
            // window.mAuthor.ScreenUtils.isSoftKeyboardResize();

            var layoutID = chooseLayout(semiResponsiveLayoutChooser, screenSizes);

            //todo remove
            //var changed = player.changeLayout(layoutID);

            firstPageLoaded = true;
            window.onresize = function onResizeHandler() {
                // if (window.mAuthor.ScreenUtils.isSoftKeyboardResize()) {
//                            return;
//                        }
                var screenSizes = window.mAuthor.ScreenUtils.getScreenSizesDependingOnOrientation(userAgent);

                setScaleViewer();
                //todo remove
                // var layoutID = chooseLayout(semiResponsiveLayoutChooser, screenSizes);
                // var changed = player.changeLayout(layoutID);
                // if (changed) {
                //     setViewPortSizesAfterScreenChanges();
                // }

                setViewPortSizesAfterScreenChanges();
                // console.log("resize");
                // setJiminPosision();
                doJimunPosision();
            };

           
		    iframeResizeRequest();
		    postPageLoadedMessage();

            // sendMessageToContainer("@saveTempState");
            // sendMessageToContainer("@open");
        }

        // setMaxlength();
        iframeResizeRequest();
        postPageLoadedMessage();

        // $("#scrollableBody").css({
//                   "overflow": "",
//                   "height": ""
//               });



        $("#scrollableBody").css({
            "overflow": "",
            "height": ""
        });

        (function () {
            var scrollDetectorInterval = null;
            var retries = 0;

            function scrollAddIfBodyBiggerThanWindow () {
                var $window = $(window);
                var $icplayerDiv = $("#_QPlayer");
                var $scrollableContent = $("#scrollableBody");

                var windowHeight = $window.height();
                var windowWidth = $window.width();

                var bodyHeight = $icplayerDiv.height();
                var bodyWidth = $icplayerDiv.width();

                if (windowHeight < bodyHeight || windowWidth < bodyWidth) {
                    $scrollableContent.css("overflow", "auto");
                    $scrollableContent.height(windowHeight);
                } else if (windowHeight >= bodyHeight && windowWidth >=  bodyWidth) {
                    $scrollableContent.css("height", "");
                    $scrollableContent.css("overflow", "");
                } else if (windowHeight >= bodyHeight) {
                    $scrollableContent.css("height", "");
                }

                retries++;
                if (retries > 5) {
                    window.clearInterval(scrollDetectorInterval);
                }
            }

            $(document).ready(function () {
                if (scrollDetectorInterval == null) {
                    scrollDetectorInterval = setInterval(scrollAddIfBodyBiggerThanWindow, 1000);
                }
                $(document).ajaxStart(function () {
                    document.body.style.pointerEvents = 'none'
                    $('#div_load_image').show();
                });

                $(document).ajaxStop(function () {
                    document.body.style.pointerEvents = ''
                    $('#div_load_image').hide();
                });

                function removeSVGLeft(){
                    var svgs = document.getElementsByTagName("svg");
                    // console.log("svgs : " + svgs);
                    try {
                        for (var i=0; i<svgs.length; ++i) {
                            console.log("svg : " + svgs[i]);
                            svgs[i].style.left = "0px";
                        }
                    }catch(e){
                        console.log("removeSVGLeft e : " + e);
                    };
                }

                removeSVGLeft();

                // const mapShapeChar = new Map([
                //     ['O', {btnCharCssClass: 'btn_circle', textCharCssClass: 'text_circle'}],
                //     ['△', {btnCharCssClass: 'btn_triangle', textCharCssClass: 'text_triangle'}],
                //     ['ㅁ', {btnCharCssClass: 'btn_rect', textCharCssClass: 'text_rect'}],
                //     ['X', {btnCharCssClass: 'btn_cross', textCharCssClass: 'text_cross'}],
                //     ['＋', {btnCharCssClass: 'btn_plus', textCharCssClass: 'text_plus'}],
                //     ['－', {btnCharCssClass: 'btn_minus', textCharCssClass: 'text_minus'}],
                //     ['÷', {btnCharCssClass: 'btn_division', textCharCssClass: 'text_division'}],
                //     ['＞', {btnCharCssClass: 'btn_right_bracket', textCharCssClass: 'text_right_bracket'}],
                //     ['＜', {btnCharCssClass: 'btn_left_bracket', textCharCssClass: 'text_left_bracket'}],
                //     ['＝', {btnCharCssClass: 'btn_equal', textCharCssClass: 'text_equal'}]
                // ]);
                const mapShapeChar = new Map([]);

                function initShapeOption($option) {
                    $option.each(function() {
                        // index 0 은 defaultvalue 이기 때문에 무시한다.
                        // 대략 '---' 이런식의 값이 들어있음.
                        if (this.index === 0) {
                            return true;
                        }
                        mapShapeChar.get(this.value).index = this.index;
                    });
                }
                function isShapeOption ($option) {
                    let result = true;
                    $option.each(function() {
                        if (this.index === 0) {
                            return true;
                        }
                        if (isShapeChar(this.value) === false) {
                            result = false;
                            return false;
                        }
                    })
                    return result;
                }
                function isShapeChar(char) {
                    return mapShapeChar.has(char);
                }
                function getBtnCharCssClass(char) {
                    // console.log("getBtnCharCssClass", char, mapShapeChar.get(char).btnCharCssClass);
                    return mapShapeChar.get(char).btnCharCssClass;
                }
                function getTextCharCssClass(char) {
                    return mapShapeChar.get(char).textCharCssClass;
                }
                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type == "attributes") {

                            try{
                                if (mutation.target.selectedOptions.length === 1) {
                                    let value = mutation.target.selectedOptions.item(0).value;
                                    //console.log("attributes changed : " + value);
                                    var $id = $('#'+mutation.target.id),
                                        $class = $id.attr('class'),
                                        $option = $id.find('option');
                                    $id.next('div').attr('class', $class);
                                    if(isShapeOption($option) === true){
                                        $id.next('div').addClass('selectImg');
                                        if(value === '-'){
                                            $id.next('.selectImg').find('p').attr('class','');
                                            $id.next('.selectImg').find('.inlineChoiceList').show();
                                        } else {
                                            $id.next('.selectImg').find('p').attr('class','').addClass(getTextCharCssClass(value));
                                            $id.next('.selectImg').find('.inlineChoiceList').hide();
                                        }

                                        $id.next('.selectImg').find('.inlineChoiceList').hide();

                                        // if(_serverData.courseCode == "MATH"){
                                        //     $id.next('.selectImg').find('.inlineChoiceList').hide();
                                        // }
                                    }else{
                                        $id.next('div').addClass('selectChoice');
                                        if(value === '-'){
                                            $id.next().find('p').text('');
                                        }else{
                                            var p = $id.next().find('p');
                                            if($(mutation.target.selectedOptions.item(0)).find('img').length >0){
                                                if($(p).find('img').length == 0 )$(p).append($(mutation.target.selectedOptions.item(0)).find('img').clone());
                                                return;
                                            }
                                            p.html(value);

                                            //mathjax
                                            var isMathJax = isMathJaxIncludeInOver(value);
                                            console.log("isMathJax", isMathJax);
                                            if( isMathJax ) {
                                                try {
                                                    var id = Math.random().toString(36).substring(7);
                                                    p.attr('id', id);
                                                    var ep = document.getElementById(id);
                                                    p.hide();
                                                    setTimeout(function () {
                                                        MathJax.Hub.Queue(function () {
                                                            p.show();
                                                        }, ["Typeset", MathJax.Hub, ep]);
                                                    }, 200);
                                                    // }, 5000);
                                                } catch (e) {
                                                    console.log("observer e : " + e);
                                                }
                                            };
                                        }
                                    }
                                } else {
                                    console.error("이런 상황이 나올까?");
                                }
                            }catch(e){};
                        }
                    });
                });
                var $select = $('.ic_inlineChoice');
                $select.each(function(){
                    observer.observe(this, {
                        attributes: true //configure it to listen to attribute changes
                    });
                });

                //over형에 mathjax 구문 포함되어 있는지
                var isExistsMathJax = isMathJaxIncludeInOver();
                // console.log("isExistsMathJax", isExistsMathJax);
                // var delayTime = 200;
                var delayTime = 1000;
                // console.log("delayTime", delayTime);
                /* webFont */
                // selectChange();
                // console.log("fontLoaded", fontLoaded);
                if( !fontLoaded ) {
                    /* webFont */
                    WebFont.load({
                        custom: {
                             families: ['NanumSquareRoundB']
                        },
                        active: function () {
                            // console.log("font active");
                            if (!fontLoaded) {
                                if (isExistsMathJax) {
                                    setTimeout(function () {
                                        selectChange();
                                    }, delayTime);
                                }else{
                                    selectChange();
                                    // invisibleCombo();
                                    // setTimeout(function () {
                                    //     selectChange();
                                    // }, 1);
                                }
                            };
                            fontLoaded = true;
                        }
                    });
                    selectChange();
                }else {
                    if (isExistsMathJax) {
                        setTimeout(function () {
                            selectChange();
                        }, delayTime);
                    }else{
                        selectChange();
                        // invisibleCombo();
                        // setTimeout(function () {
                        //     selectChange();
                        // }, 1);
                    }
                }

                // MathJax.Hub.Queue(function () {
                //     var math = document.getElementsByClassName("inlineChoiceList");
                //     MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
                // });

                function uuidv4() {
                  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                  });
                }


                var bMathJaxRenderComplete = false;
                function selectChange(){

                    // var maxHeight = -1;

                    var maxHeight = 50;
                    var heightGap = 20;
                    var isMathJax = isMathJaxIncludeInOver();
                    console.log("isMathJax", isMathJax);

                    if( isMathJax ) {
                        maxHeight = 70;
                    }
                    var bIsMinusX = false;
                    // console.log("selectChange");
                    var $select = $('select.ic_inlineChoice');
                    $select.hide();


                    // $option = $select.find('option');
                    $select.each(function(){
                        $option = $(this).find('option');

                        // var $choice = $thiz.next('div');
                        // var $choice = $thiz.next('div');
                        // var $class = $thiz.attr('class');
                        // var $width = $thiz.parent().outerWidth()


                        $(this).after('<div class="selectChoice"><p></p><div class="inlineChoiceList"></div></div>');

                        var $thiz = $(this),
                            $choice = $thiz.next('div'),
                            $class = $thiz.attr('class'),
                            $width = $thiz.parent().outerWidth();


                        $(this).find('option').each(function(idx){
                            $val = $(this).val();
                            if( idx > 0 ){
                                var id =  Math.random().toString(36).substring(7);
                                // $(this).parent().next().find('.inlineChoiceList').append('<button>'+$val+'</button>');
                                if($(this).find('img').length>0){
                                    $(this).parent().next().find('.inlineChoiceList').append('<button id='+id+'><img src="'+$(this).find('img').attr('src')+'" style="'+
                                        $(this).find('img').attr('style')+'"</img></button>');

                                }
                                else{
                                    $(this).parent().next().find('.inlineChoiceList').append('<button id='+id+'>'+$val+'</button>');
                                }

                                //mathjax
                                var b = document.getElementById(id);
                                // console.log("$val", $val);
                                mapOverValue[id] =  $val;
                                // if( MathJax.Hub.isJax(b) == 1 ) MathJax.Hub.Typeset( b );
                                // console.log("MathJax.Hub.isJax(b)", MathJax.Hub.isJax(b), b);
                                //MathJax.Hub.Typeset( b );
                                MathJax.Hub.Queue(function(){
                                    // console.log("mathjax rendering complete2")
                                    // setTimeout(function(){
                                    //     console.log("mathjax asdsad");
                                    //     try{
                                    //         $choice.find('.inlineChoiceList').css('right',100 );        
                                    //     }catch(e){
                                    //         console.log("mathjax e", e);
                                    //     }
                                        
                                    // }, 4000)
                                    
                                }, ["Typeset",MathJax.Hub,b]);
                            }
                        });
                        // var $thiz = $(this),
                        //  $choice = $thiz.next('div'),
                        //  $class = $thiz.attr('class'),
                        //     $width = $thiz.parent().outerWidth();
                        // console.log("AAAAAA", $option);
                        // console.log("isShapeOption($option)", isShapeOption($option));
                        if(isShapeOption($option) === true){

                            // console.log("AAAAAA1");
                            var $choiceListW = $choice.find('.inlineChoiceList').outerWidth() / 2;
                            $choice.addClass('selectImg');
                            //$choice.find('.inlineChoiceList').css('margin-left','-'+ $choiceListW +'px');
                            $option.each(function(){
                                let index = this.index;
                                let char = this.value;
                                if (this.index === 0) {
                                    return true;
                                }
                                $choice.find('.inlineChoiceList button').eq(index - 1).addClass(getBtnCharCssClass(char));
                            });
                            $('.selectImg >p').on('click', function(){
                                $(this).text('').attr('class','').addClass('hover');
                                $(this).next('.inlineChoiceList').show();
                            });
                        }else{
                            var gap = 17;

                            $choice.width($width).attr('class', $class);
                            $choice.addClass('selectChoice');

                            $pageW = $('.ic_page').outerWidth();
                            $textP = parseInt($thiz.parent('div').position().left);
                            $choW = $choice.outerWidth();
                            $choice.find('.inlineChoiceList').show();
                            $choListW = $choice.find('.inlineChoiceList').outerWidth();
                            // $choListW = $choice.find('.inlineChoiceList').width() + gap;
                            // $choice.find('.inlineChoiceList').hide();
                            $btnlength = $choice.find('.inlineChoiceList >button').length;
                            console.log('$pageW = '+$pageW+' $textP = '+$textP+' $choW = '+$choW+' $choListW = '+$choListW);


                            $choice.find('.inlineChoiceList').attr("uid", uuidv4())
                            console.log("uuidv4()", uuidv4());
                            if($pageW < $choListW){

                                var rowHeight = 0;
                                console.log('줄바꿈', $pageW, $choListW);

                               
                                // var gap = 0;
                                var sumbtnW = 0
                                var btnWidths = 0;
                                for(var i=0; i < $btnlength; ++i){
                                    console.log("$choice.find('.inlineChoiceList >button').eq(i)", $choice.find('.inlineChoiceList >button').eq(i));
                                    var $btnW = $choice.find('.inlineChoiceList >button').eq(i).outerWidth(true);
                                    // var $btnW = $choice.find('.inlineChoiceList >button').eq(i).outerWidth();
                                    // 
                                    sumbtnW += $btnW;

                                    btnWidths += $btnW + gap;

                                    console.log("$btnW", $pageW, $btnW, btnWidths)
                                    if( $pageW > sumbtnW+gap ){
                                        $sumbtnW = sumbtnW
                                    }

                                    if( $pageW < btnWidths){
                                        rowHeight += maxHeight + (heightGap *2);
                                        btnWidths = 0;
                                        console.log('줄바꿈 rowHeight', rowHeight);
                                    }


                                    
                                }

                                // rowHeight = parseInt( $choListW/ $pageW) + 1;
                                // rowHeight *= maxHeight + (heightGap *2);
                                console.log('줄바꿈 rowHeight', rowHeight);
                                rowHeight += gap;
                                $sumbtnWrap = $sumbtnW+gap;
                                $choice.find('.inlineChoiceList').css('width', $sumbtnWrap);
                                choListPosition02 = ($textP + $choW) - $sumbtnWrap;
                                // console.log('$pageW = '+$pageW+' $textP = '+$textP+' $choW = '+$choW+' $sumbtnWrap = '+$sumbtnWrap);
                                // console.log(choListPosition02 +" = ("+ $textP +" + "+ $choW +")-"+ $sumbtnWrap+")");
                                // console.log("choListPosition02", choListPosition02);

                                var sTextP = parseInt($textP * 1/wrapperScale);
                                var sChoListW = parseInt($choListW);//parseInt($choListW * 1/wrapperScale);
                                // var sChoListW = parseInt($choListW * wrapperScale);
                                var sChoW = parseInt($choW); //parseInt($choW * 1/wrapperScale);

                                if( (sTextP + sChoListW) > $pageW){


                                    var leftt = parseInt( (sChoW - sChoListW - 10));

                                    console.log("leftt0", $textP, $choListW, $choW, leftt);
                                    console.log("leftt1", sTextP, sChoListW, sChoW, leftt);

                                    if( sTextP + leftt < 0 ) {
                                        leftt = parseInt( -1 * sTextP );
                                        console.log("leftt2", sTextP, leftt);
                                    }
                                    $choice.find('.inlineChoiceList').css('left', leftt);

                                    bIsMinusX = true;
                                }

                                // if( choListPosition02 < 0 ){
                                //     // $choice.find('.inlineChoiceList').css('right',choListPosition02);
                                //     $choice.find('.inlineChoiceList').css('left', -1 * $textP );
                                // }

                                $choice.find('.inlineChoiceList').attr('rowHeight', rowHeight );
                                console.log("rowHeight", rowHeight,  $choice.find('.inlineChoiceList').attr('rowHeight'));


                            }else{
                                // choListPosition1 = ($textP + $choW * .75) - $choListW;
                                choListPosition01 = ($textP + $choW) - $choListW;
                                // choListPosition01 = ($textP + $choW) - $pageW;
                                
                                console.log(choListPosition01 +" = ("+ $textP +" + "+ $choW +")-"+ $choListW+")");
                                // console.log("choListPosition1", choListPosition1);
                                // console.log("choListPosition01", choListPosition01);
                                console.log($textP);



                                var sTextP = parseInt($textP * 1/wrapperScale);
                                var sChoListW = parseInt($choListW);//parseInt($choListW * 1/wrapperScale);
                                // var sChoListW = parseInt($choListW * wrapperScale);
                                var sChoW = parseInt($choW); //parseInt($choW * 1/wrapperScale);

                                console.log("choListPosition1", $textP,sTextP,  $choW, sChoListW, $pageW, wrapperScale);
                                // console.log("AAAA4", $choice.find('.inlineChoiceList').actual( 'outerWidth' ) );

                                if( (sTextP + sChoListW) > $pageW){


                                    var leftt = parseInt( (sChoW - sChoListW - 10));

                                    console.log("leftt0", $textP, $choListW, $choW, leftt);
                                    console.log("leftt1", sTextP, sChoListW, sChoW, leftt);

                                    if( sTextP + leftt < 0 ) {
                                        leftt = parseInt( -1 * sTextP );
                                        console.log("leftt2", sTextP, leftt);
                                    }
                                    $choice.find('.inlineChoiceList').css('left', leftt);

                                    bIsMinusX = true;
                                }


                                // if(($textP + $choW) > $pageW){
                                //     console.log("right 0");
                                //     $choice.find('.inlineChoiceList').css('right', 0);
                                // }

                                // console.log("$textP", $textP, $choListW, (($textP + $choListW) *  1/wrapperScale), $pageW);
                                // if( (($textP + $choListW) *  1/wrapperScale)  > $pageW){


                                //     var leftt = parseInt( -1 * $textP * 1/wrapperScale);
                                //     console.log("inlineChoiceList asdasdasdsa", leftt, $choice.find('.inlineChoiceList'));
                                //     // $choice.find('.inlineChoiceList').css('left', leftt);
                                //     $choice.find('.inlineChoiceList').css('left', leftt);

                                //     bIsMinusX = true;
                                // }
                            }

                            //옵션 버튼의 높이값을 일치 시켜준다.
                            $('.selectChoice >p').on('click', function(){
                                var $choice = $thiz.next('div').find('.inlineChoiceList');
                                var uid1 = $choice[0].getAttribute("uid");
                                var uid2 = $(this).next('.inlineChoiceList')[0].getAttribute("uid");
                                console.log("uid1", uid1, uid2)
                                if( uid1 != uid2 ){
                                    return;
                                }


                                var rowH = parseInt($choice.attr('rowHeight'));
                                console.log("rowHfff", rowH);
                                if( isNaN(rowH) ) rowH = 0;
                                // $(this).next('.inlineChoiceList').css({'z-index':'100', 'opacity':1}).show();
                                $(this).parent().addClass('hover');

                                // // x좌표값이 0 이하면 위치 조정
                                // try{
                                //     listWidth = $choice.find('.inlineChoiceList').outerWidth();
                                //     // console.log("combo left", $(this).parent().parent().position().left);
                                //     // console.log("combo listWidth", listWidth);
                                //     var left = $(this).parent().parent().position().left;
                                //     var question = document.getElementsByClassName("ic_page");
                                //     var questionWitdh = question[0].offsetWidth;
                                //     if( !bIsMinusX
                                //         && left - listWidth < 0
                                //         && (left + listWidth) < questionWitdh ){
                                //         $(this).next('.inlineChoiceList').css('left', 0);
                                //     }
                                // }catch(e){

                                // }
                                // maxHeight = -1;
                                //옵션 버튼의 높이값을 일치 시켜준다.
                                try{
                                    var buttons = $thiz.next('div').find('.inlineChoiceList button');
                                    buttons.each(function(){
                                        var height = $(this).context.offsetHeight;

                                        if( height > 0 ) {
                                            maxHeight = Math.max(maxHeight, $(this).context.offsetHeight);
                                        };
                                    });
                                    buttons.each(function(){
                                        // console.log( "buttons height" , maxHeight);

                                        // mathjax인경우 폰트를 디폴트로 변경

                                        var isMathJaxxxxx = $(this).text().indexOf("\\") > -1;
                                        // console.log( "buttons text" , $(this).text(), isMathJaxxxxx);
                                        if( isMathJaxxxxx ){

                                            $(this).css("font-family", "Times New Roman");
                                            $(this).css("font-weight", "normal");
                                            
                                            try{
                                                var selectP = $(this).parent('div').parent().children('p');
                                                selectP.css("font-family", "Times New Roman");
                                                selectP.css("font-weight", "normal");
                                                selectP.css("font-size", "38px");
                                            }catch(e){
                                                console.log( "e", e);
                                            }                                            
                                        }
                                        $(this).height(maxHeight);
                                    });
                                    // console.log( "maxHeight", maxHeight);
                                }catch(e){};

                                //옵션 버튼의 width 최소값을 적용한다
                                try{
                                    var buttons = $thiz.next('div').find('.inlineChoiceList button');
                                    buttons.each(function(){
                                        var width = $(this).context.offsetWidth;
                                        // console.log("Aaa width", width);
                                        if( width < 50 && width != 0 ){
                                            $(this).width(50);
                                        }
                                        // width = Math.max(width, 50);
                                        // console.log("Aaa width", width);
                                        // $(this).width(width);
                                        
                                    });
                                    // console.log( "maxHeight", maxHeight);
                                }catch(e){};

                                // maxHeight = Math.max(rowH, maxHeight);
                                var listHeight = Math.max(rowH, maxHeight);
                                // console.log("rowHeight2", rowH, maxHeight);
                                 // $(this).next('.inlineChoiceList').css({'z-index':'100', 'opacity':1, 'height': maxHeight + 20}).show();

                                // var listHeight = maxHeight;
                                listHeight = Math.max(rowH, maxHeight);
                                // console.log("rowHeight2", listHeight);

                                // $(this).next('.inlineChoiceList').css({'z-index':'100', 'opacity':1, 'height': listHeight + 20}).show();
                                $(this).next('.inlineChoiceList').css({'z-index':'100', 'opacity':1, 'height': listHeight + heightGap}).show();
                            });

                            if( isMathJax ) {
                                maxHeight = 70;
                                // var selectP = $('.selectChoice p');
                                // selectP.css("font-family", "Times New Roman");
                                // selectP.css("font-weight", "normal");
                                // selectP.css("font-size", "38px");
                            }
                            $('.selectChoice').on('mouseleave', function(){
                                $(this).find('.inlineChoiceList').css({'z-index':'-1', 'opacity':0}).hide();
                                $(this).removeClass('hover');
                            });
                        }
                    });


                    $('.inlineChoiceList >button').on('click', function(e){
                        //mathjax
                        var clickBtnID =  e.target.id;
                        var id = Math.random().toString(36).substring(7);
                        $(this).parent().prev('p').attr('id', id);

                        if( clickBtnID.indexOf("MathJax") > -1 || clickBtnID.length == 0 ){
                            // isMathJax = true;
                            // clickBtnID = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
                            clickBtnID = getMathJaxBtnID(e.target);
                            // console.log('clickBtnID 2: ' + clickBtnID);
                            var ep = document.getElementById(id);
                            while (ep.firstChild) {
                                ep.removeChild(ep.firstChild);
                            }
                        }

                        $options = $(this).parent().parent().prev().find('option');
                        $idx = $(this).index() + 1;
                        // $val = $(this).text();
                        $val = mapOverValue[clickBtnID];
                        //console.log('$val : ' + $val);
                        if(isShapeChar($val) === true){
                            //console.log('$getTextCharCssClass($val) : ' + getTextCharCssClass($val));
                            $(this).parent().prev('p').attr('class','').addClass(getTextCharCssClass($val));
                        }
                        $options.eq($idx).prop("selected", true).change();
                        if($('#'+clickBtnID+' img').length >0){
                            $(this).parent().prev('p').append($('#'+clickBtnID+' img').clone());
                        }
                        else {
                            //특수기호 치환
                            if( $val == "&lt;") $(this).parent().prev('p').text("<");
                            else if( $val == "&gt;") $(this).parent().prev('p').text(">");
                            else $(this).parent().prev('p').text($val);
                            // console.log("$val123123", $val);
                        }
                        $(this).parent('.inlineChoiceList').hide();
                        // mathjax
                        var ep =  document.getElementById(id);
                        // console.log("ep", ep);
                        var isMathJax = $("#"+clickBtnID).children('.MathJax_Preview').length > 0;
                        // console.log("isMathJax", isMathJax, $("#"+clickBtnID).children('.MathJax_Preview').length);
                        if( isMathJax ) $(this).parent().prev('p').hide();
                        var thiz = this;
                        setTimeout(function(){
                            MathJax.Hub.Queue(function(){
                                console.log("mathjax rendering complete")
                                $(thiz).parent().prev('p').show();
                            }, ["Typeset", MathJax.Hub, ep]);
                        }, 0);
                    });
                }

                /* 190909 */
                buttonLimitedReset();
                function buttonLimitedReset(){
                    if($(".ic_button_limited_reset").length == 0) {return;}
                    $('.ic_button_limited_reset').on('click', function(){
                        var $this = $(this);
                        $this.removeClass('ic_button_limited_reset-up');
                        setTimeout(function(){
                            $this.attr('class', $this.attr('class').replace('ic_button_limited_reset-up-hovering','ic_button_limited_reset-up'));
                        }, 300);
                    });
                }
                // detailLayerPopup();
                // function detailLayerPopup(){
                //     if($(".singlestate-button-wrapper").length == 0) {return;}
                //     var $wrap = $('.ic_page'),
                //         $layerPopup = $wrap.find('.layerPopup'),
                //         $wrapW = $wrap.outerWidth(),
                //         $wrapH = $wrap.outerHeight();
                //     $('.singlestate-button-element').on('click', function(){
                //         $wrap.append('<div class="layerPopup"><button class="btnClose"><span></span><span></span></button><div class="popCont"></div></div>');
                //         var $popW = $wrap.find('.layerPopup').outerWidth(),
                //             $popH = $wrap.find('.layerPopup').outerHeight(),
                //             position_top =  ($wrapH - $popH) / 2,
                //             position_left = ($wrapW - $popW) / 2;
                //         //console.log( $wrapW +' : '+ $wrapH +' : '+ $popW +' : '+ $popH )
                //         $layerPopup.css({'top':position_top,'left':position_left});
                //         $layerPopup.find('.btnClose').on('click', function(){
                //             $(this).parent().fadeOut();
                //         });
                //         $layerPopup.draggable();
                //     });
                // }
            });
        })();
        var eventBus = player.getPlayerServices().getEventBus(),
            listener = function() {},
            utils = new PlayerUtils(player),
            presentation = utils.getPresentation();

        listener.onEventReceived = function(eventName, eventData) {
            // try {
            //     if (eventData.item != "all" && eventData.item.indexOf("SourceList") < 0) {
            //         objCurrentQuesInfo[eventData.source] = eventData.value;
            //     }
            //     console.log("onEventReceived", eventName, eventData)
            //     // sendMessageToContainer("@saveTempState");
            // }catch(e){
            //     console.log("onEventReceived e: " + e);
            // };

            //영상 재생 허용 여부 체크 이벤트
            try{

                console.log("eventData.value", eventData.value );
                if( eventData.value == "playing_confirm"){
                    moduleID = eventData.source;
                    playVideo(moduleID);
                }
            }catch(e){
    //              console.log("onEventReceived e: " + e);
            };
        }

        eventBus.addEventListener('ItemConsumed', listener);
        eventBus.addEventListener('ItemReturned', listener);
        eventBus.addEventListener('ItemSelected', listener);
        eventBus.addEventListener('ValueChanged', listener);


        quesLoaded = "true";
        //sendMessageToContainer("@open");
        // $("#curPageSize").text($(".ic_page").css("width"));

        // 서버 문항정보 로드
        let isNewQnoteServer = window.document.referrer.indexOf('https://qnote.miraenchoco.com') > -1 || window.document.referrer.indexOf('https://devqnote.miraenchoco.com/') > -1 ? true : false;
        if( isAuthor && isNewQnoteServer ) questionInfoDataSet();
    });

    player.onOutstretchHeight(function () {
        iframeResizeRequest();
    });

    player.onPageScrollTo(function (top) {
        var parent = getOpener();
        if (parent){
            parent.postMessage('SCROLLTOP:' + top, "*");
        }
    });


    window.addEventListener("message", receiveMessage, false);


}

// 비디오 재생
function playVideo(moduleID){
    var ps = player.getPlayerServices();
    var video = ps.getModule(moduleID);
    video.DoPlay();
    // // console.log("video", video);
}


function isMathJaxIncludeInOver(){
    //일단 무조건 false;
    // return false;
    var $select = $('select.ic_inlineChoice');
    var isExists = false;
    $select.each(function() {
        $option = $(this).find('option');
        // $(this).after('<div class="selectChoice"><p></p><div class="inlineChoiceList"></div></div>');
        $option.each(function (idx) {
            $val = $(this).val();
            // console.log("$val", $val, $val.indexOf("\\(\\"));
            // if( $val.indexOf("\\frac") > -1 ){
            if( $val.indexOf("\\(\\") > -1 ){
                isExists = true;
                return;
            }
        });
    });

    return isExists;
}


function getMathJaxBtnID(element){
    // console.log("element.parentNode", element.parentNode);
    var id = "";
    // console.log("element.parentNode.nodeName", element.parentNode.nodeName);
    if( element.nodeName == "BUTTON" ){
        id = element.getAttribute("id");
        // console.log("element.parentNode", element);
        // console.log("element.parentNode.id", id);
        return id;
    }else{
        id = getMathJaxBtnID( element.parentNode );
    }

    return id;
}

function selectCSSChange() {
    $(function() {
        // 기타 css 수정 필요함.
        // 선택에 대한 인터렉션 수정 필요함.
        // arrow 관련 사항 주석 처리
        // close 관련 사항 주석 처리

        // 여기서 기존 select box 에 대한 이벤트를
        // popSelect 으로 넘겨줘야 할 듯?

        $(".ic_inlineChoice").popSelect({
            position: 'top',
            showTitle: false,
            autoIncrease: false,
            title: '',
            debug: true,
            maxAllowed: 0,
            placeholderText: '',
            autofocus: false
        });
    })
}

function isAttemptedByState(obj, module){
    var valueKeys = {"values":true //텍스트, line_numbers
        , "lines":true   //figure drawing
        , "isSelected":true  //doublestate buttons
        , "selectedPoints":true
        , "r":true    //그래프
        , "currentItems":true //fractions
        , "currentLines":true //PointsLines
        , "placeholders":true //multiplegap
        , "initialTime":true //clock
        , "directionPoints":true //Shape_Tracing
        , "options":true //choice
    };
    try{
        var keys = Object.keys(obj);
        // console.log("keys", keys);
        return keys.some(function (iKey) {
            // console.log("iKey", iKey);
            if( valueKeys.hasOwnProperty(iKey) ){
                // console.log("iKey", iKey);
                // console.log("iKey2", iKey, obj[iKey] );
                // console.log("iKey3", iKey, JSON.stringify(obj[iKey]),  JSON.stringify(obj[iKey]).length );
                // console.log("iKey4", iKey, obj[iKey].toString().length );
                if( iKey == "isSelected"){
                    // console.log("isSelected",  obj[iKey]);
                    if( typeof obj[iKey] == "boolean" ){
                        if( obj[iKey] == true ) return true;;
                    }
                } else if( iKey == "values"){
                    // console.log("values",  obj[iKey], typeof obj[iKey]);
                    if( typeof obj[iKey] === 'object' ){
                        for( var k in obj[iKey]){
                            // console.log("iKey1 ", k,  JSON.stringify(obj[iKey][k]), typeof obj[iKey][k] );
                            if( typeof obj[iKey][k] == "string" ){
                                if( JSON.stringify(obj[iKey][k]).length > 2) return true;
                            } else{
                                if( JSON.stringify(obj[iKey][k]).length > 0 ) return true;
                            }
                        }
                    }else if( JSON.stringify(obj[iKey]).length > 2 ) return true;
                } else if( iKey === "r" ){
                    // console.log("r ", k,  JSON.stringify(obj[iKey]), typeof obj[iKey] );
                    if( typeof obj[iKey] == "object" ){
                        for( var k in obj[iKey]){
                            // console.log("iKey1 ", k,  JSON.stringify(obj[iKey][k]), typeof obj[iKey][k] );
                            if( typeof obj[iKey][k] == "number" ){
                                if( parseInt(obj[iKey][k]) > 0 ) return true;
                            }
                        }
                    }
                } else if( iKey == "currentItems" ){
                    // console.log("currentItems ", k,  JSON.stringify(obj[iKey]), typeof obj[iKey] );
                    if( typeof obj[iKey] == "object" ){
                        for( var k in obj[iKey]){
                            // console.log("iKey1 ", k,  JSON.stringify(obj[iKey][k]), typeof obj[iKey][k] );
                            if( typeof obj[iKey][k] == "boolean" ){
                                if( obj[iKey][k] == true ) return true;
                            }
                        }
                    }
                } else if( iKey == "currentLines" ){
                    // console.log("currentLines ", JSON.stringify(obj[iKey]), typeof obj[iKey] );
                    // if( typeof obj[iKey] == "object" ){
                    //     if( JSON.stringify(obj[iKey]).indexOf("1") > -1 ) return true;
                    // }

                    // console.log("isQuestionAttempted module.getProgress()", module.getProgress());
                    //return parseInt(module.getProgress())>0?"true_"+currentNum:"false_"+currentNum;
                    if( module.getProgress() > 0 ) return true;
                } else if( iKey == "placeholders" ){
                    // console.log("placeholders ", JSON.stringify(obj[iKey]), typeof obj[iKey] );
                    if( typeof obj[iKey] == "object" ){
                        if( JSON.stringify(obj[iKey]).length > 2 ) return true;
                    }
                } else if( iKey == "initialTime" ){
                    // console.log("initialTime ", JSON.stringify(obj[iKey]), typeof obj[iKey] );
                    if( obj[iKey] != obj["currentTime"] ) return true;
                } else if( iKey == "directionPoints" ){
                    // console.log("directionPoints ", JSON.stringify(obj[iKey]), typeof obj[iKey] );
                    //if(  JSON.stringify(obj[iKey]).length > 6 ) return true;
                    //시도했으면 무조건 처리
                    if(  JSON.stringify(obj[iKey]).length > 2 ) return true;
                } else if( iKey == "options" ){
                    // console.log("options ", JSON.stringify(obj[iKey]), typeof obj[iKey] );
                    if( JSON.stringify(obj[iKey]).indexOf("1") > -1 ) return true;
                } else if ( JSON.stringify(obj[iKey]).length > 2 ) {
                    // console.log("iKey1 ", iKey,  JSON.stringify(obj[iKey]),  typeof obj[iKey] );
                    // console.log("iKey2 ", iKey, JSON.stringify(obj[iKey]),  JSON.stringify(obj[iKey]).length );
                    return true;
                }
            }
            // console.log("typeof obj[iKey]",  iKey, obj[iKey], typeof obj[iKey] );
            if (typeof obj[iKey] === 'object' && obj[iKey] !== null) {
                return isAttemptedByState(obj[iKey], module);
            }
        });
    }catch(e){
        return false;
    }

    return false;
}


function isQuestionAttempted(){
    try{
        const container = document.querySelector("#_QPlayer");
        var cp = container.querySelectorAll("[class=addon_Completion_Progress]")[0];
        var module = player.getPlayerServices().getModule(cp.id);

        // console.log("parseInt(module.getProgress()): " + parseInt(module.getProgress()));
        // return parseInt(module.getProgress())>0?"true":"false";

        if( module.getProgress() > 0 ) {
            return parseInt(module.getProgress()) > 0 ? true: false;
        }
        else{
            //프로그래스 모듈이 완벽하지 않아 state에서도 다시 한번 체크
            var currentState = getCurrentQuestionState();
            // console.log("currentState", currentState);
            var isAttempted = isAttemptedByState(currentState, module);
            // console.log("isAttempted 1 ", isAttempted);

            // console.log("hasSingleStateBtn()", hasSingleStateBtn());
            //싱글스테이트 버튼으로 이미지 visible하는 문항 유형의 경우
            if( !isAttempted && hasSingleStateBtn() && isChangeCurrentQuesInfo() ){
                // console.log("isAttempted 2 ", true);
                return true;
            }

            return isAttempted ? true : false;
        }
    }catch(e){
        console.log("isQuestionAttempted: " + e);
    };

    // return "false";
    return true;
}

function isChangeCurrentQuesInfo(){
    for( var key in objCurrentQuesInfo){
        if( objCurrentQuesInfo[key] != "" && objCurrentQuesInfo[key] != "0") return true;
    }

    return false;
}

function hasSingleStateBtn(){
    const container = document.querySelector("#_QPlayer");
    var ssb = container.querySelectorAll("[class=addon_Single_State_Button]");
    var dsb = container.querySelectorAll("[class=addon_Double_State_Button]");

    return ssb.length > 0 || dsb.length > 0;
}

function isQuestionLoaded(){
    return quesLoaded;
}


function getQuesTotalCnt(){
    try {
        var ps = player.getPlayerServices();
        var model = ps.getPresentation();

        return model.getPageCount();
    }catch(e){
        return 0;
    }
}



function registerEventListeners () {
    // event pagehide doesn't work properly in Chrome browser when the document is in iframe
    if (window.frameElement !== null && navigator.userAgent.indexOf("Chrome") > -1) {
        window.addEventListener("beforeunload", doUnload, false);
    }
    else if ("onpagehide" in window) {
        window.addEventListener("pagehide", doUnload, false);
    } else {
        window.addEventListener("beforeunload", doUnload, false);
    }


    // window.addEventListener("message", onReceiveMessage, false);

    window.qnoteViewer = {
        onReady: function() {
            onReady();
        },
        onMessage: function(e) {
            onMessage(e);
        }
    }

}

function doStart() {
	// console.log("doStart");

    registerEventListeners();
	// loadQuestion();

}

function doUnload() {
    // This ensures that Player knows to update score before leaving page, event for score type FIRST.
    if (player.hasOwnProperty('forceScoreUpdate')) {
        player.forceScoreUpdate();
    }
}

function countLines(el) {
    // Get total height of the content    
    var divHeight = el.outerHeight();
    // console.log("divHeight", divHeight);

    // object.style.lineHeight, returns 
    // the lineHeight property
    // height of one line 
    var lineHeight = parseInt(el.css('lineHeight'));

    // console.log("lineHeight", lineHeight);
    var lines = parseInt(divHeight / lineHeight);
    return lines;
}


var preAnswerPlayer = null;
var preSolvePlayer = null;
var answerPlayer = null;
var solvePlayer = null;
function loadASPlayer(playerType, url, retFunc){

    // console.log("loadASPlayer", playerType, url);
    if( url == false ||  url.length < 3) return;


    var arrFiles = new Array();
    arrFiles.push("core/css/main.xml");

    var path = "";
    // path = path + url.replace(/%s/gi, jimunUrl[i]);
    if( url.indexOf("http") > -1) {
        path = url.split("/pages/")[0] + "/pages/main.xml";
    }else{
        // console.log("a", url.replace(/%s/gi, jimunUrl[i].split("/pages")[0]));
        path = path + cdnUrl.replace(/%s/gi, url.split("/pages")[0]);
    }

     //검수용일때 캐시 사용하지 않게 설정
    if( isAuthor ){
        path += "?" + new Date().getTime();   
    }

    arrFiles.push(path);
    // console.log("path", path);

    var asUrl = JSON.stringify(arrFiles);

    try{
        if( httpGet(arrFiles[1]) != 200 ){
            return;
        }
    }catch(e){};

    // console.log("asUrl", asUrl);
    
    // if( prejimunPlayer != null ){
    //     try {
    //         var p = document.getElementById("_jiplayer");
    //         var iFrame = p.getElementsByTagName("table")[0];
    //         if (!iFrame) return;
    //         p.removeChild(iFrame);
    //         prejimunPlayer = null;
    //         // console.log("remove prejimunPlayer");
    //     }catch(e){
    //         console.log("e: " + e);
    //     }
    // }

    // try{
    //     playerJimun = icCreatePlayerJimun('_jiplayer');
    //     console.log("playerJimun: " + playerJimun);
    // }catch(e){
    //     playerJimun = icCreatePlayerJimun("_jiplayer");
    // }
    // prejimunPlayer = playerJimun;

    var pplayer = null;
    if( playerType == "answer"){
        if( preAnswerPlayer != null ){
            try {
                var p = document.getElementById("_APlayer");
                var iFrame = p.getElementsByTagName("table")[0];
                if (!iFrame) return;
                p.removeChild(iFrame);
                preAnswerPlayer = null;
                // console.log("remove prejimunPlayer");
            }catch(e){
                console.log("e: " + e);
            }
        }

        try{
            answerPlayer = icCreatePlayerAnswer('_APlayer');
            // console.log("answerPlayer: " + answerPlayer);
        }catch(e){
            answerPlayer = icCreatePlayerAnswer("_APlayer");
        }
        preAnswerPlayer = answerPlayer;


        // player = icCreatePlayerAnswer("_APlayer");  
        pplayer = answerPlayer;
        answerPlayer.loadAnswer(asUrl, 0);  
    }else{
        if( preSolvePlayer != null ){
            try {
                var p = document.getElementById("_SPlayer");
                var iFrame = p.getElementsByTagName("table")[0];
                if (!iFrame) return;
                p.removeChild(iFrame);
                preSolvePlayer = null;
                // console.log("remove prejimunPlayer");
            }catch(e){
                console.log("e: " + e);
            }
        }

        try{
            solvePlayer = icCreatePlayerSolve('_SPlayer');
            // console.log("solvePlayer: " + solvePlayer);
        }catch(e){
            solvePlayer = icCreatePlayerSolve("_SPlayer");
        }
        preSolvePlayer = solvePlayer;


        // player = icCreatePlayerAnswer("_APlayer");  
        pplayer = solvePlayer;
        solvePlayer.loadSolve(asUrl, 0);  


        // player = icCreatePlayerSolve("_SPlayer");    
        // player.loadSolve(asUrl, 0);
    }
    
    
    try{
        if( pplayer == null ) return;
        
        pplayer.onStatusChanged(function(type, source, value){
            // console.log("type:" + type + ", source: " + source, ", value:" + value);
        });


        var ASFirstPageLoaded = false;
        pplayer.onPageLoadedAnswer(function onPageLoadedHandler() {

            // console.log("onPageLoadedAnsweronPageLoadedAnsweronPageLoadedAnswer");
            ASFirstPageLoaded = true;

            //정답의 경우 컨텐츠 하단의 30px 여분 제거 
            try{
                var he = $('#_APlayer .ic_page').height();    
                $('#_APlayer .ic_page').height(he - 30);   
            }catch(e){};
            

            start = start || new Date().getTime();
            retFunc();

        });

        pplayer.onPageLoadedSolve(function onPageLoadedHandler() {

            // console.log("onPageLoadedSolveonPageLoadedSolveonPageLoadedSolveonPageLoadedSolve");
            ASFirstPageLoaded = true;

            start = start || new Date().getTime();
            retFunc();

        });

        // pplayer.onOutstretchHeightAnswer(function () {
        //     // iframeResizeRequest();
        // });

        // pplayer.onPageScrollToJimun(function (top) {
        //     var parent = getOpener();
        //     if (parent) {
        //         parent.postMessage('SCROLLTOP:' + top, "*");
        //     }
        // });
        window.addEventListener("message", receiveMessage, false);

    }catch(e){

    }
    
}

function getAnswerSolveURL(url){

   console.log("cdnUrl", cdnUrl);
   var retURL = "";
   var domain = (new URL(cdnUrl));
   if( domain.hostname == "devchococdn.mirae-n.com" || domain.hostname == "chococdn.mirae-n.com" ){
      retURL = cdnUrl.replace(/%s/gi, url.split('/pages')[0]);
   }else{
       var arr = fileUrl.split("/pages/main.xml");
       arr = arr[0].split("/");
       arr.pop();
       var uuu = url.split("/").pop() + "/pages/main.xml";
       retURL = arr.join("/") + "/" + uuu;
       if( token.length > 0 ){
            retURL += "?token=" +token;
       }
   }


   return retURL;
}


// 정답 해설 보기
var popupTopPadding = parseInt(styles.getPropertyValue('--popup-top-padding'));//$("#viewer_container").width();
function showSolve(isShow) {
  var pop = document.getElementById('popup_solve');
  if (isShow == 'Y') {
    //해설 영상 버튼 visible
    var solveMovie = document.getElementById('solveMovie');
    var answer = document.getElementById('answer');
    var solve = document.getElementById('solve');
    var answerImage = document.getElementById('answerImage');
    var solveImage = document.getElementById('solveImage');
    var APlayer = document.getElementById('_APlayer');
    var SPlayer = document.getElementById('_SPlayer');
    var scrollContents = document.getElementById('scroll_contents');
    var solveLabel = document.getElementById('solveLabel');

    var popupContent = document.getElementById('popup_content');
    var viewerContainer = document.getElementById('viewer_container');

    pop.className = 'popup-on';
    var obj = getAnswerSolve();

    solveMovie.style.display = 'none';

    try {
      if (
        arrQuestion[currentNum].review.commentary != undefined &&
        arrQuestion[currentNum].review.commentary != null &&
        arrQuestion[currentNum].review.commentary.length > 0
      ) {
        solveMovie.style.display = 'block';
        SPlayer.style.marginTop = '7px';
      } else {
        SPlayer.style.marginTop = '-7px';
      }
    } catch (e) {
      console.log();
    }

    //힌트 본 횟수 업데이트
    try {
      if (arrQuestion[currentNum].hintClick == undefined) {
        arrQuestion[currentNum].hintClick = 0;
      }

      ++arrQuestion[currentNum].hintClick;
    } catch (e) {}

    var answerHeight = 0;
    var qUrl = JSON.parse(questionUrl)[currentNum + 1];
    qUrl = qUrl.split('?')[0];

    console.log('obj.answerType', obj.answerType);
    console.log('obj.solveType', obj.solveType);
    console.log('obj.answerQnote', obj.answerQnote);
    console.log('obj.solveQnote', obj.solveQnote);

    //정답이 문항 형태인 경우
    if (obj.answerType != false && obj.answerType == 'question') {
      // if( 1 == 1 ){
      answerImage.style.display = 'none';
      answer.style.display = 'none';
      APlayer.style.display = 'block';

      // loadASPlayer("answer", "questions/contents/sub/2015/e/mat/41/0200/01/ab/emat41020001_ab_01", function(){
      //     console.log("answer load complete");
      // });
      var url = getAnswerSolveURL(obj.answerQnote);
      loadASPlayer('answer', url, function () {
        // console.log("APlayer loaded");
        answerHeight =
          parseInt(APlayer.getBoundingClientRect().height) +
          (150 * 1) / wrapperScale;
        // console.log("APlayer answerHeight : " + answerHeight);
        try {
          // popupContent.style.height = h + "px";
          // scrollContents.style.height = h - parseInt(popupTopPadding) - 20 +  "px";
          // answerHeight = Math.max(80, answerHeight) + 20;
          // solve.style.height = h - answerHeight + "px";
          // console.log("answerHeight", answerHeight);
        } catch (e) {}
      });
    } else if (obj.answerImage != false && obj.answerImage != undefined) {
      answerImage.style.display = 'block';
      answer.style.display = 'none';
      APlayer.style.display = 'none';

      // console.log("obj.answerImage.path", obj.answerImage.path);
      var imageUrl = JSON.parse(obj.answerImage).path;
      // imageUrl = imageUrl.split(".png")[0];

      var url = qUrl + '/../' + imageUrl;

      // console.log("url", url);
      answerImage.src = url;
      answerImage.onload = function () {
        answerHeight =
          parseInt(answerImage.getBoundingClientRect().height) +
          (150 * 1) / wrapperScale;

        try {
          // popupContent.style.height = h + "px";
          // scrollContents.style.height = h - parseInt(popupTopPadding) - 20 +  "px";
          // answerHeight = Math.max(80, answerHeight) + 20;
          // solve.style.height = h - answerHeight + "px";
          console.log('answerHeight', answerHeight);
        } catch (e) {}
      };

      answerHeight =
        parseInt(answerImage.getBoundingClientRect().height) +
        (150 * 1) / wrapperScale;
    } else {
      answerImage.style.display = 'none';
      answer.style.display = 'block';
      APlayer.style.display = 'none';

      if (obj.answer != undefined && obj.answer != false) {
        obj.answer = obj.answer.replace(/ /g, '&nbsp;');
        obj.answer = obj.answer.replace(/\n/g, '</br>');
      }

      obj.answer = decodeURIComponent(obj.answer);
      answer.innerHTML = obj.answer == undefined ? '' : obj.answer;
      answerHeight =
        answer.getBoundingClientRect().height + (150 * 1) / wrapperScale;
    }

    //해설이 문항 형태인 경우
    if (obj.solveType != false && obj.solveType == 'question') {
      // if( 1 == 1) {
      solveImage.style.display = 'none';
      solve.style.display = 'none';
      SPlayer.style.display = 'block';

      // loadASPlayer("solve", "questions/contents/sub/2015/e/mat/41/0200/01/ab/emat41020001_ab_02");
      var url = getAnswerSolveURL(obj.solveQnote);
      loadASPlayer('solve', url, function () {
        // console.log("APlayer solve loaded");
        answerHeight =
          parseInt(APlayer.getBoundingClientRect().height) +
          (150 * 1) / wrapperScale;
        // console.log("APlayer solve answerHeight : " + answerHeight);
        try {
          // popupContent.style.height = h + "px";
          // scrollContents.style.height = h - parseInt(popupTopPadding) - 20 +  "px";
          // answerHeight = Math.max(80, answerHeight) + 20;
          // solve.style.height = h - answerHeight + "px";
          // console.log("answerHeight", answerHeight);
        } catch (e) {}
      });
    } else if (obj.solveImage != false && obj.solveImage != undefined) {
      solveImage.style.display = 'block';
      solve.style.display = 'none';
      SPlayer.style.display = 'none';

      var imageUrl = JSON.parse(obj.solveImage).path;
      // imageUrl = imageUrl.split(".png")[0];

      var url = qUrl + '/../' + imageUrl;

      // console.log("url", url);
      solveImage.src = url;

      // var myImg = document.querySelector("#solveImage");
      // var realHeight = myImg.naturalHeight;
      // console.log("realHeight", solveImage.naturalHeight);
      // solveImage.style.height = solveImage.naturalHeight + "px"
      // solveLabel.style.paddingTop = "15px";
      solveLabel.style.paddingTop = '8px';
    } else {
      solveImage.style.display = 'none';
      solve.style.display = 'block';
      SPlayer.style.display = 'none';

      // console.log(" obj.solve before",  obj.solve);
      if (obj.solve != undefined && obj.solve != false) {
        obj.solve = obj.solve.replace(/\n/g, '</br>');
        obj.solve = obj.solve.replace(/  /g, ' &nbsp;');
      }
      // console.log(" obj.solve after",  obj.solve);
      obj.solve = decodeURIComponent(obj.solve);
      solve.innerHTML = obj.solve == undefined ? '' : obj.solve;
      // solve.innerHTML = (obj.solve == undefined ) ?"":obj.solve;
      solve.style.height = 'auto';

      // var h = parseInt(viewerContainer.style.height);
      // answerHeight = answer.getBoundingClientRect().height + (150 * 1/wrapperScale);
      // solve.style.height = h - answerHeight + "px";

      solveLabel.style.paddingTop = '0px';
    }

    // console.log("showSolve2", obj);
    var solveLineCount = countLines($(solve));
    // console.log("solveLineCount", solveLineCount);

    var h = parseInt(viewerContainer.style.height);
    if (solveLineCount < 5) {
      h = h / 2 + 100;
    } else {
      h = h - 100;
    }

    if (h < 640) h = parseInt(viewerContainer.style.height);

    // console.log("obj.answerImage", obj.answerImage);
    // try{
    //     if( obj.answerImage != false && obj.answerImage != undefined){
    //         answerHeight = parseInt(answerImage.getBoundingClientRect().height) + (150 * 1/wrapperScale);

    //     }else{
    //         answerHeight = answer.getBoundingClientRect().height + (150 * 1/wrapperScale);
    //     }
    // }catch(e){};

    // console.log("showSolve h", h, answerHeight);

    // popupContent.style.height = h + "px";
    // scrollContents.style.height = h - parseInt(popupTopPadding) - 20 +  "px";
    // answerHeight = Math.max(80, answerHeight) + 20;
    // solve.style.height = h - answerHeight + "px";

    scrollContents.scrollTop = 0;
    // console.log("answerHeight", answerHeight);

    //모바읾이면서 세로인 경우 높이 조절
    // var isMobile = detectMobileDevice(userAgent);
    // var isVertical = $(window).width() < $(window).height();

    // console.log("isMobile isVertical", isMobile, isVertical);
    // if( isMobile && isVertical ){
    //     // popupContent.className = "popup_contents_mobile_vertical";

    //     popupContent.className = "popup_contents_mobile_vertical";
    // }else{
    //     popupContent.style.height = "530px";
    // }
  } else {
    pop.className = 'popup';
  }
}


// 정답 해설 버튼 visible 처리
function showSolveBtn(isForce){
    try{
        var btn = document.getElementById("btnSolve");

        if( arrQuestion == null && !isAuthor && !isTeacher) return;

        var isShow = (isAuthor || isTeacher)  ? false : (arrQuestion[currentPage].mode == "review");

        if( isForce ) isShow = true;

        if( isShow ) btn.style.display = "block";
        else btn.style.display = "none";

        // console.log("showSolveBtn", isShow);
    }catch(e){
        console.log("showSolveBtn", e);
    };
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// // 초코 컨테이너 초기화 완료 이벤트
// function onReceiveMessage(e) {
//     console.log("onReceiveMessage from choco", e);
// }

// 초코 컨테이너 초기화 완료 이벤트
function onReady() {
    console.log("onReady");
}


var arrQuestion;
var isReceivedData = false;
var selectedContentId = null;
// 초코 컨테이너 이벤트
function onMessage(receiveData) {
    console.log("onMessage from container", receiveData);
    receiveData = JSON.parse(receiveData);
    console.log("receiveData.action", receiveData.action);
    switch(receiveData.action){
        case "@sendURL":
            arrQuestion = receiveData.data.contentList;
            // console.log("arrQuestion", arrQuestion);
            //var arrUrl = getQuestionUrl(receiveData);
            selectedContentId = receiveData.data.selected;
            preJimunURL = "";
            if( isInited ){
                loadProblem(arrQuestion);
                setJimun(0);    
            }else{
                isReceivedData = true;
            }
            break;
        case "@showAnswer":
            showAnswer('Y');
            break;
        case "@hideAnswer":
            showAnswer('N');
            break;
        case "@showSolution":
            showSolve('Y');
            break;
        case "@hideSolution":
            showSolve('N');
            break;
    }

}

function getQuestionUrl(contentList){
    var questionUrl = [];
    var passageUrl = [];
    for( var i=0; i<contentList.length; ++i ){
        questionUrl.push(contentList[i].url);
        if(contentList[i].text != undefined ) passageUrl.push(contentList[i].text.url);
        else passageUrl.push("");
    }

    return { questionUrl , passageUrl };
}


var bIsContainer;
function isContainer(){
    // return ("parentQnote" in window);

    if( bIsContainer == undefined ){
        bIsContainer = ("parentQnote" in window);
    }
    return bIsContainer;
}

function sendMessageToContainer(action){
    if( !isContainer() ) {
        console.log("컨테이너 아님");
        return
    };

    // console.log("sendMessageToContainer arrQuestion", arrQuestion, currentNum);
    var sContentId = arrQuestion[currentNum].contentId;

    if( arrQuestion[currentNum].hintClick == undefined ){
        arrQuestion[currentNum].hintClick = 0;
    }  

    switch(action){

        case "@open":
            var bHasNext = (arrQuestion.length-1 > currentNum);
            var data = {action:"@open", data:{ contentId:sContentId, hasNext: bHasNext }};
            console.log("sendMessageToContainer", data);
            window.parentQnote.sendMessage( JSON.stringify(data) );
            break;
        case "@saveTempState":
            var userState = getCurrentQuestionState();
            endDateQuestion = getCurrentTime();
            var data = {action:"@saveState",
                    data:{
                        stateList : [
                            {
                                contentId:sContentId
                                , isComplete : isQuestionAttempted()
                                , isCorrect : ''
                                , hintClick : arrQuestion[currentNum].hintClick
                                , input : userState
                                , startDate : startDateQuestion
                                , endDate : endDateQuestion
                            }
                        ]

                    }
                };
            console.log("sendMessageToContainer", data);
            window.parentQnote.sendMessage( JSON.stringify(data) );
            break;
        case "@saveState":
            var userState = getCurrentQuestionState();
            endDateQuestion = getCurrentTime();
            var data = {action:"@saveState",
                    data:{
                        stateList : [
                            {
                                contentId:sContentId
                                , isComplete : isQuestionAttempted()
                                , isCorrect : getEachScore('false')
                                , hintClick : arrQuestion[currentNum].hintClick
                                , input : userState
                                , startDate : startDateQuestion
                                , endDate : endDateQuestion
                            }
                        ]

                    }
                };
            console.log("sendMessageToContainer", data);
            window.parentQnote.sendMessage( JSON.stringify(data) );
            setQuestionEnable("true");
            // sendMessageToContainer("@saveTempState");
            break;
        case "@runVideo":
            console.log("sendMessageToContainer", data);
            try{
                var url = arrQuestion[currentNum].review.commentary;
                // var url = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/dev/mp4/contents/sub/2015/e/mat/31/0100/01/ab/s/emat31010001_ab_s_01/pages/emat31010001_ab_s_01.mp4";

                
                var data = {
                    action:"@runVideo",
                    data: {
                        url: url
                    }
                };
                window.parentQnote.sendMessage( JSON.stringify(data) );

            }catch(e){
                console.log("@runVideo", e);
            }


            break;
    }
}

// 문항만 있는 페이지 경우 스크롤 생성을 위해 높이값 지정
function setSecondHeight(){
    var wrapper = document.getElementById("scaleable-wrapper");
    var viewerContainer = document.getElementById("viewer_container");
    var h = parseInt(wrapper.style.height);
    if( isNaN(h) ) return;

    // h = h * wrapperScale - paddingTopDefault;
    h = h - paddingTopDefault;



    // console.log("setSecondHeight", h);

    // viewerContainer.style.height = h  + "px";
}


// 지문의 유무에 따른 div 처리
function initJimunLayout(flag){
    
    var viewerTop = document.getElementById("viewer-top");
    var viewerContainer = document.getElementById("viewer_container");
    var bottomBar = document.getElementById("bottomBar");

    // try{
    //     questionBottom = (arrQuestion != null && arrQuestion[currentPage].mode == "review") ? 80 : 30;
    // }catch(e){

    // }

    if(flag) {

        bottomBar.style.display = "none";
        $('#viewer_container').split().destroy();
        var h = $('#scaleable-wrapper').height();
        
        $('#viewer_container').height(h).split({position: '45%'});
        $("#first").show();

        
        var wrapper = document.getElementById("scaleable-wrapper")
        wrapper.style.backgroundColor = "#eeebe8";
        // wrapper.style.borderRadius = "0px 0 0 0";
        wrapper.style.borderRadius = "20px 20px 0px 0px";
        // console.log("initJimunLayout", h, h*(1/wrapperScale));
        viewerContainer.classList.add('without-after-element');
        viewerContainer.style.paddingBottom = questionBottom + "px";
        viewerTop.style.height = "0px";

    }else {

        bottomBar.style.display = "block";
        var wrapper = document.getElementById("scaleable-wrapper")
        // var viewerContainer = document.getElementById("viewer_container")
        wrapper.style.backgroundColor = "#ffffff";
        wrapper.style.borderRadius = "32px 0 0 0";
        viewerContainer.className = "viewer_container";
        $('#viewer_container').split().destroy();
        $("#first").hide();

        viewerTop.style.height =  scaleablePaddingTop + "px";
        // $("#second").height = "100px";
    }


    if( (isAuthor || isTeacher) ){
        bottomBar.style.display = "none";
    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////



var originAlert = window.alert;
var isAutoCheckDoing = false;
function autoCheckAndStopWhenWrong(startOrNot){
    if(startOrNot){
        window.alert = function() {}; //alert창 끄기
        isAutoCheckDoing = true;
        autoCheckAndStopWhenWrongLogic();
    }else{
        isAutoCheckDoing = false;
    }
}

function autoCheckAndStopWhenWrongLogic(){
    if(!isAutoCheckDoing){
        window.alert = originAlert;
        return;
    }
    moveQuestion('next');
    setTimeout(function(){
        getEachScore();
        setTimeout(function(){
            if($("#_QPlayer").find("[class*=wrong]").length <= 0 && _serverArrayData.length > currentNum + 1){
                autoCheckAndStopWhenWrongLogic();
            }else{
                window.alert = originAlert;
            }
        }, 500);
    }, 500)
}

function goCapture(){
    html2canvas(document.querySelector("#_QPlayer")).then(canvas => {
        document.body.appendChild(canvas)
    });
}

function setBrowserSize(){
    var vw = 770;
    var hw = 1150;
    if( window.innerWidth == vw ){
        resizeTo(hw, vw)
    }else{
        resizeTo(vw, hw)
    }
}

function showExcelInput(isShow){
    var pop = document.getElementById("popup_excel");
    if( isShow == "Y" ){
         pop.className = "popup-on";
    }else{
        pop.className = "popup";
    }
}

function showJimun(isShow){
    var pop = document.getElementById("popup_jimun");
    if( isShow == "Y" ){
         pop.className = "popup-on";
    }else{
        pop.className = "popup";
    }
}

function getFileFolder(fileName) {

    var originFolderName = fileName;
    var arrFolders = fileName.split("_");
    var prefix = "questions/contents/sub/2015/";
    // console.log("arrFolders.length", arrFolders.length);
    // console.log("arrFolders.length", arrFolders[0].length);
    if(arrFolders[0].length != 12){
        if( arrFolders.length == 1 ) return prefix + fileName + "/";
        strFoldes = prefix + arrFolders.join("/");
        return strFoldes;
    }else{
        arrFolders[0] = arrFolders[0].replace(/(\w{1})(\w{3})(\d{2})(\d{4})(\d{2})/, "$1/$2/$3/$4/$5");
        // if(originFolderName.indexOf('text') != -1 ) arrFolders.pop();
        arrFolders.pop();
        strFoldes = prefix + arrFolders.join("/") + "/" + originFolderName;
        return strFoldes;
    }

}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    // console.log("http", theUrl, xmlHttp.status );
    return xmlHttp.status;
}


var arrExcelList = [];
var domain = "https://miraen-contents.s3.ap-northeast-2.amazonaws.com";
var cdnUrl = domain + "/cp/qnote/%s/pages/main.xml";

//초코
if( window.location.origin.indexOf("miraenchoco.com") > -1 ){
    cdnUrl = window.location.origin + "/%s/pages/main.xml";
}else{
    if( window.location.pathname.split('/')[1] == 'dev'){
        cdnUrl = domain + "/dev/%s/pages/main.xml";
    }
    else if( window.location.pathname.split('/')[1] == 'cp' ){
        cdnUrl = domain + "/cp/qnote/%s/pages/main.xml";
    }
    else if( window.location.pathname.split('/')[1] == 'real' ){
        cdnUrl = domain + "/real/%s/pages/main.xml";
    }
    else if( window.location.host.indexOf("localhost") > -1 ){
        //cdnUrl = "http://localhost:3001/contents/%s/pages/main.xml"
        cdnUrl = domain + "/cp/qnote/%s/pages/main.xml";
    }
}


var gatewayUrl = "https://devapi-cms.mirae-n.com/template_view";
if( window.location.pathname.split('/')[1] == 'dev'){
    gatewayUrl = "https://api-cms.mirae-n.com/template_view";
}
else if( window.location.pathname.split('/')[1] == 'cp' ){
    gatewayUrl = "https://devapi-cms.mirae-n.com/template_view";
}
else if( window.location.pathname.split('/')[1] == 'real' ){
    gatewayUrl = "https://api-cms.mirae-n.com/template_view";
}
else if( window.location.host.indexOf("localhost") > -1 ){
    gatewayUrl = "https://devapi-cms.mirae-n.com/template_view";
}
function loadQuestionList(){

    arrExcelList = [];
    var taList = document.getElementById("taList");
    var arr = taList.value.split("\n");

    var arrError = [];
    for( var i=0; i<arr.length; ++i){
        if( arr[i].length < 4) continue;

        var url = getFileFolder(arr[i].trim());
        var uuu = cdnUrl.replace(/%s/gi, url.split("/pages")[0]);
        if( httpGet(uuu) != 200 ){
            arrError.push(arr[i]);
        }
        arrExcelList.push( url );

    }
    if( arrError.length > 0){
        alert("파일 로딩 애러\n\n" + arrError.join("\n"));
        return;
    }


    loadQuestion(arrExcelList);
    // console.log("asdsad", arrExcelList);
    showExcelInput('N');
}

function loadJimunList(){
    arrExcelList = [];
    var taJimun = document.getElementById("taJimun");
    var jimun = [];
    var arrError = [];
    var arrJimun = taJimun.value.split("\n");
    for( var i=0; i<arrJimun.length; ++i){
        if( arrJimun[i].length < 4) continue;
        jimun.push( getFileFolder(arrJimun[i].trim()) );
    }

    // jimun.push( getFileFolder(taJimun.value.trim()) );

    var taJimunQuestion = document.getElementById("taJimunQuestion");
    var arr = taJimunQuestion.value.split("\n");
    for( var i=0; i<arr.length; ++i){
        if( arr[i].length < 4) continue;

        var url = getFileFolder(arr[i].trim());

        var uuu = cdnUrl.replace(/%s/gi, url.split("/pages")[0]);
        if( httpGet(uuu) != 200 ){
            arrError.push(arr[i]);
        }


        arrExcelList.push( url );
    }
    
    if( arrError.length > 0){
        alert("파일 로딩 애러\n\n" + arrError.join("\n"));
        return;
    }


    console.log("jimun", jimun, arrExcelList );

    // 문항과 지문을 동시에 로드 처리
    loadJimun(jimun,arrExcelList);
    initJimunLayout(true);

    showJimun('N');
}

//풀이 영상 재생
function showSolveMoive(){
     sendMessageToContainer("@runVideo");
}

function questionInfoDataSet(){
    var fileName = $('.ic_page').prop('id');
    var data = {};

    // test 용
    data.question_name = fileName;
    //data.question_name = 'esoc31010101_ab_01';
    //var originPath = window.location.hostname == 'miraen-contents.s3.ap-northeast-2.amazonaws.com'? 'http://ec2-15-164-210-93.ap-northeast-2.compute.amazonaws.com:8080' : 'http://localhost:8080'
    var cmsUrl = window.location.pathname.split('/')[1] == 'dev' ? 'https://cms.miraenchoco.com'  :
        ( window.location.pathname.split('/')[1] == 'cp' ? 'https://devcms.miraenchoco.com' : 'https://devcms.miraenchoco.com');
    var originPath = window.location.pathname.split('/')[1] == 'dev' ? 'https://qnote.miraenchoco.com'  :
        //( window.location.pathname.split('/')[1] == 'cp' ? 'https://devqnote.miraenchoco.com' : 'http://localhost:8080');
        ( window.location.pathname.split('/')[1] == 'cp' ? 'https://devqnote.miraenchoco.com' : 'https://devqnote.miraenchoco.com');
    var options = {
        origin: originPath,
        path: "/authCheck.html"
    };
    console.log("fileName : " + fileName);
    console.log("originPath : "+ originPath);
    Storage = crossDomainStorage(options);
    /*
    $.when(
        Storage.getItem('.loginId')
        , Storage.getItem('.loginToken')
    ).done(function(response_key1, response_key2){
        //response_key1 contains the value for the key1 ('undefined' if not found)
        //response_key2 contains the value for the key2 ('undefined' if not found)
        //etc...
        console.log("response_key1 : "+ response_key1);
        console.log("response_key2 : "+ response_key2);
        if(response_key1 == null || response_key1 == undefined ||response_key2 == null || response_key2 == undefined){
            alert("저작도구 로그인 연결이 끊어 졌습니다.");
            return;
        }
        $.ajax({
            type : "POST",
            headers: {
                'Authorization': `Bearer `+response_key2,
            },
            url : cmsUrl+"/api/getContentsInfo", //요청 할 URL
            data : JSON.stringify(data),
            async: true ,
            contentType : "application/json",
            success : function(data) {
                //통신이 정상적으로 되었을때 실행 할 내용
                console.log(data)
                if(data.ret == '200'){
                    var contentsInfo = data.contentsInfo;
                    $("#question_state").val(contentsInfo.STATUS).prop("selected", true);
                    $("#difficulty").val(contentsInfo.DIFFICULTY).prop("selected", true);
                    $("#question_type").val(contentsInfo.QUESTION_TYPE).prop("selected", true);
                }


            },
            error : function(data) {
                console.log("ajax error."); //에러시 실행 할 내용
            }
        });
    },function (e){
        console.log("error : ",e);
    });*/
    var response_key1 = getParam("loginId")
    var response_key2 = getParam("acToken")
    console.log('response_key1 : ',response_key1);
    console.log('response_key2 : ',response_key2);

    if(response_key1 == null || response_key1 == undefined ||response_key2 == null || response_key2 == undefined){
        alert("저작도구 로그인 연결이 끊어 졌습니다.");
        return;
    }
    $.ajax({
        type : "POST",
        headers: {
            'Authorization': `Bearer `+response_key2,
        },
        url : cmsUrl+"/api/getContentsInfo", //요청 할 URL
        data : JSON.stringify(data),
        async: true ,
        contentType : "application/json",
        success : function(data) {
            //통신이 정상적으로 되었을때 실행 할 내용
            console.log(data)
            if(data.ret == '200'){
                var contentsInfo = data.contentsInfo;
                $("#question_state").val(contentsInfo.STATUS).prop("selected", true);
                $("#difficulty").val(contentsInfo.DIFFICULTY).prop("selected", true);
                $("#question_type").val(contentsInfo.QUESTION_TYPE).prop("selected", true);
            }


        },
        error : function(data) {
            console.log("ajax error."); //에러시 실행 할 내용
        }
    });
}

function getCookie(name) {
    const cookieArray = document.cookie.split('; ');
    for (const cookie of cookieArray) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}
function questionStateChange(action){
    var fileName = $('.ic_page').prop('id');
    var data = {};
    /*
        "question_name":"esoc31010101_ab_01",
        "write_user":"admin",
        "check_user":"admin",

     */
    // test 용
    data.question_name = fileName;
    //data.question_name = 'esoc31010101_ab_01';

    if(action == 'state'){
        if($("#question_state").val() == '') {
            alert("상태값을 선택하세요");
            return;
        }else if(window.location.pathname.split('/')[1] != 'dev' && $("#question_state").val() == '6'){
            alert("검증뷰어에서는 사용 할수 없는 메뉴 입니다.");
            return;
        }
        else data.status =  $("#question_state").val();
    }
    else if(action == 'difficulty'){
        if($("#difficulty").val() == '') {
            alert("난이도를 선택하세요");
            return;
        }
        data.difficulty =  $("#difficulty").val();
    }
    else if(action == 'type'){
        if($("#question_type").val() == '') {
            alert("문항유형을 선택하세요");
            return;
        }
        data.question_type =  $("#question_type").val();
    }

    //var originPath = window.location.hostname == 'miraen-contents.s3.ap-northeast-2.amazonaws.com'? 'http://ec2-15-164-210-93.ap-northeast-2.compute.amazonaws.com:8080' : 'http://localhost:8080'
    var cmsUrl = window.location.pathname.split('/')[1] == 'dev' ? 'https://cms.miraenchoco.com'  :
        ( window.location.pathname.split('/')[1] == 'cp' ? 'https://devcms.miraenchoco.com' : 'https://devcms.miraenchoco.com');
    var originPath = window.location.pathname.split('/')[1] == 'dev' ? 'https://qnote.miraenchoco.com'  :
        ( window.location.pathname.split('/')[1] == 'cp' ? 'https://devqnote.miraenchoco.com' : 'http://localhost:8080');
    var options = {
        origin: originPath,
        path: "/authCheck.html"
    };
    Storage = crossDomainStorage(options);

    var response_key1 = getParam("loginId")
    var response_key2 = getParam("acToken")
    console.log('response_key1 : ',response_key1);
    console.log('response_key2 : ',response_key2);

    if(response_key1 == null || response_key1 == undefined ||response_key2 == null || response_key2 == undefined){
        alert("저작도구 로그인 연결이 끊어 졌습니다.");
        return;
    }
    if(response_key1 == null || response_key1 == undefined ||response_key2 == null || response_key2 == undefined){
        alert("저작도구 로그인 연결이 끊어 졌습니다.");
        return;
    }
    data.write_user = response_key1;
    data.check_user = response_key1;

    if(data.status == '5'){
        $.ajax({
            type: "POST",
            url: originPath + ":3001/capture", //요청 할 URL
            data: JSON.stringify({'file_name' : fileName}),
            async: true,
            contentType: "application/json",
            success: function (result) {
                if(result[0].result == 'success'){
                    data.question_thumbnail_url = result[0].data.question_thumbnail_url;
                    data.answer1_thumbnail_url = result[0].data.answer1_thumbnail_url;
                    data.answer2_thumbnail_url = result[0].data.answer2_thumbnail_url;
                    data.solve1_thumbnail_url = result[0].data.solve1_thumbnail_url;
                    $.ajax({
                        type : "POST",
                        headers: {
                            'Authorization': `Bearer `+response_key2,
                        },
                        url : cmsUrl+"/api/updateContents", //요청 할 URL
                        data : JSON.stringify(data),
                        async: true ,
                        contentType : "application/json",
                        success : function(res) {
                            alert('상태변경이 완료 되었습니다.');
                        },
                        error : function(data) {
                            console.log("ajax error."); //에러시 실행 할 내용
                        }
                    });
                }
            },
            error: function (data) {
                console.log("ajax error."); //에러시 실행 할 내용
            }
        });
    }
    else{
        $.ajax({
            type : "POST",
            headers: {
                'Authorization': `Bearer `+response_key2,
            },
            url : cmsUrl+"/api/updateContents", //요청 할 URL
            data : JSON.stringify(data),
            async: true ,
            contentType : "application/json",
            success : function(res) {
                alert('상태변경이 완료 되었습니다.');
                if(data.status == '6'){
                    if(window.location.pathname.split('/')[1] == 'dev') {
                        $.ajax({
                            type: "POST",
                            url: originPath + ":3001/file_Copy", //요청 할 URL
                            data: JSON.stringify({'file_name' : fileName}),
                            async: true,
                            contentType: "application/json",
                            success: function (data) {
                                alert('배포가 완료 되었습니다.');

                            },
                            error: function (data) {
                                console.log("ajax error."); //에러시 실행 할 내용
                            }
                        });
                    }else {
                        alert('검증 서버 에서는 테스트가 불가 합니다.')
                    }
                }
            },
            error : function(data) {
                console.log("ajax error."); //에러시 실행 할 내용
            }
        });
    }
    /*
    $.when(
        Storage.getItem('.loginId')
        , Storage.getItem('.loginToken')
    ).done(function(response_key1, response_key2){
        //response_key1 contains the value for the key1 ('undefined' if not found)
        //response_key2 contains the value for the key2 ('undefined' if not found)
        //etc...
        console.log("response_key1 : "+ response_key1);
        console.log("response_key2 : "+ response_key2);

        if(response_key1 == null || response_key1 == undefined ||response_key2 == null || response_key2 == undefined){
            alert("저작도구 로그인 연결이 끊어 졌습니다.");
            return;
        }
        data.write_user = response_key1;
        data.check_user = response_key1;

        if(data.status == '5'){
            $.ajax({
                type: "POST",
                url: originPath + ":3001/capture", //요청 할 URL
                data: JSON.stringify({'file_name' : fileName}),
                async: true,
                contentType: "application/json",
                success: function (result) {
                    if(result[0].result == 'success'){
                        data.question_thumbnail_url = result[0].data.question_thumbnail_url;
                        data.answer1_thumbnail_url = result[0].data.answer1_thumbnail_url;
                        data.answer2_thumbnail_url = result[0].data.answer2_thumbnail_url;
                        data.solve1_thumbnail_url = result[0].data.solve1_thumbnail_url;
                        $.ajax({
                            type : "POST",
                            headers: {
                                'Authorization': `Bearer `+response_key2,
                            },
                            url : cmsUrl+"/api/updateContents", //요청 할 URL
                            data : JSON.stringify(data),
                            async: true ,
                            contentType : "application/json",
                            success : function(res) {
                                alert('상태변경이 완료 되었습니다.');
                            },
                            error : function(data) {
                                console.log("ajax error."); //에러시 실행 할 내용
                            }
                        });
                    }
                },
                error: function (data) {
                    console.log("ajax error."); //에러시 실행 할 내용
                }
            });
        }
        else{
            $.ajax({
                type : "POST",
                headers: {
                    'Authorization': `Bearer `+response_key2,
                },
                url : cmsUrl+"/api/updateContents", //요청 할 URL
                data : JSON.stringify(data),
                async: true ,
                contentType : "application/json",
                success : function(res) {
                    alert('상태변경이 완료 되었습니다.');
                    if(data.status == '6'){
                        if(window.location.pathname.split('/')[1] == 'dev') {
                            $.ajax({
                                type: "POST",
                                url: originPath + ":3001/file_Copy", //요청 할 URL
                                data: JSON.stringify({'file_name' : fileName}),
                                async: true,
                                contentType: "application/json",
                                success: function (data) {
                                    alert('배포가 완료 되었습니다.');

                                },
                                error: function (data) {
                                    console.log("ajax error."); //에러시 실행 할 내용
                                }
                            });
                        }else {
                            alert('검증 서버 에서는 테스트가 불가 합니다.')
                        }
                    }
                },
                error : function(data) {
                    console.log("ajax error."); //에러시 실행 할 내용
                }
            });
        }
    },function (e){
        console.log(e);
    });
    */

}

function thumNailCreate(){
    var originPath = window.location.pathname.split('/')[1] == 'dev' ? 'https://qnote.miraenchoco.com'  :
        ( window.location.pathname.split('/')[1] == 'cp' ? 'https://devqnote.miraenchoco.com' : 'http://localhost');
    var fileName = document.getElementById("pFileName").textContent
    if(fileName != undefined){
        $.ajax({
            type: "POST",
            url: originPath + ":3001/directCapture", //요청 할 URL
            data: JSON.stringify({'file_name' : fileName}),
            async: true,
            contentType: "application/json",
            success: function (result) {

            },
            error: function (data) {
                console.log("ajax error."); //에러시 실행 할 내용
            }
        });
    }

}

window.addEventListener("message", (event) => {
    console.log("event : ",event)
    if (event.data.makexToken != null) {
        localStorage.setItem('loginId', event.data.loginId);
        localStorage.setItem('makexToken', event.data.token);
    }
}, { once : true });


