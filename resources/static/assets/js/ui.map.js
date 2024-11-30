$(function () {
  renderCommonUI();
  renderPlugin();
});

const renderCommonUI = function(){
  tabs('.tab');1
  accordion('.accordion');
  zoomRange();
}

const renderPlugin = function () {
  renderSelect2();

  if ($('.dropdown').length != 0) {
    $('.dropdown').dropdown();
  }
};

const toggleGroup = function (wrapper, target) {
  var $target = $(wrapper).find(target);
    $(wrapper).on('click', target , function () {
      if ($(wrapper).find('active')) {
        $(this).siblings().removeClass('active');
      }
      $(this).addClass('active');
    });
  // });
};
const toggleThis = function (target) {
  $(target).each(function (index, element) {
    $(this).on('click', function () {
      $(this).toggleClass('active');
    });
  });
};

const tabs = function (item) {
  $(item).each(function (index, element) {
    // init
    // $(this).siblings('.pane-wrap').children('.pane').hide();

    if($(this).parent().hasClass("scrollable-container")){
      checkActive(this , 'display-show-flex');
      tabClick('display-show-flex');
    }else{
      checkActive(this , 'display-show');
      tabClick('display-show')
    }

  });

  function checkActive(item, showType) {
    if ($(item).find('li').hasClass('active')) {
      $target = $(item).find('.active > a').attr('href');
      $($target).addClass(showType);
    } else {
      $(item).parents('.tabs').find('.pane:first').addClass(showType);
      $(item).find('li:first').addClass('active');
    }
  }

  function tabClick(showType) {
    $(item).on('click','a', function (e) {
        e.preventDefault();

        $target = $(this).attr('href');
        $(this).parent('li').siblings('li').removeClass('active');
        $(this).parents('.tabs').find($target).siblings('.pane').removeClass(showType);
        $(this).parent('li').addClass('active');
        // $($target).show();
        $($target).addClass(showType);
        renderSelect2();
        selectFunc();
      });
  }
};

var accordion = function (item) {
  $(item).find('.pane').hide();
  // active tab check
  if ($(item).find('li').hasClass('active')) {
    $target = $(item).find('.active');
    $($target).children('.pane').show();
  }

  $(item).on('click', '.action', function(e) {
    e.preventDefault();

    // $this = $(this).parent('li');
    $this = $(this).closest('li');
    if (!$this.hasClass('active')) {
      $this.addClass('active');
      $this.children('.pane').slideDown();
      // jsSwiper(); //swiper4 사용시 필요함.
    } else {
      $this.children('.pane').slideUp();
      $this.removeClass('active');
    }
  });

  //ox click event
  $(item).on('click', `.ox, .button`, function (e) {
    // e.preventDefault();
    e.stopPropagation();
  });

  // 전체 접기/펼치기
  $(item).on('change', '.folding-all', function(e) {

    $(item).find(this).css("border","3px solid blue");
    $(this).css("border","1px solid red");
    if ($(this).is(':checked')) {
      console.log("checked");
      $(this).parents(item).find('.pane').parents('li').siblings().addClass('active');
      $(this).parents(item).find('.pane').slideDown();
      // $(this).siblings('label').html(str.replace('펼쳐보기', '접기'));
    } else {
      console.log("unchecked");
      $(this).parents(item).find('.action, .pane').parents('li').siblings().removeClass('active');
      $(this).parents(item).find('.pane').slideUp();
      // $(this).siblings('label').html(str.replace('접기', '펼쳐보기'));
    }
  });
};

/* select */
const renderSelect2 = function () {
  $('select').select2({
    //placeholder: '값을 선택하세요',
    minimumResultsForSearch: Infinity,
    // dropdownAutoWidth: true,
    // width: 'auto',
    // dropdownParent: $('#myModal'),
  });

  $('select:disabled').select2({
    // placeholder: '값을 선택하세요',
    minimumResultsForSearch: Infinity,
    disabled: true,
    // dropdownAutoWidth: true,
    // width: 'auto',
  });

  for(var i = 0; i < $(".select2").length; i++){
    var select = $(".select2").eq(i);
    // if(select.parent().css("display") !== "flex"){
      select.css({"width": `${parseFloat(select.css("width")) + parseFloat(select.find(".select2-selection__rendered").css("paddingRight")) + parseFloat(select.find(".select2-selection__rendered").css("paddingLeft"))}`});
    // }
  }
};

const selectFunc = function(){
  $(".dropdown-select").each(function(idx, el){
    if($(el).find(".options li.selected").length > 0){
      $(el).find(".select-button").html($(el).find(".options li.selected button").html());
    }
    var option_btn = $(el).find(".options li button");

    var total = 0;

    for(var i = 0; i < $(option_btn).length; i++){
      var this_btn = $(option_btn).eq(i);
      var sum = 0;


      for(var j = 0; j < $(this_btn).children().length; j++){
        var child = $(this_btn.children().eq(j));
        sum += Math.ceil(child.outerWidth()) + parseFloat($(el).find(".select-button").css("gap"));
      }

      if(sum > total){
        total = sum;
      }
    }

    $(el).css({"width": `${(total) + parseFloat($(el).find(".select-button").css("paddingLeft")) + parseFloat($(el).find(".select-button").css("paddingRight"))}px`});

    $(el).find(".options").hide();

    $(el).not(".disabled").find(".select-button").on("click", function(){
      let $this = $(this);
      let $options = $this.siblings(".options");

      $(el).addClass("active");
      $options.show().css({"opacity":"1"});

      if($options.find("li").hasClass("selected")){
        $options.find("li button").removeClass("hover");
        $options.find("li.selected button").addClass("hover");
      }

      $options.find("button").not(":disabled").on("mouseover", function(){
        $(this).addClass("hover").parent("li").siblings("li").find("button").removeClass("hover");
      });

      $options.find("button").on("click", function(){
        $(this).parent("li").addClass("selected").siblings("li").removeClass("selected");
        $(el).removeClass("active")
        $this.html($(this).html());
        $(this).parents(".options").hide();
      });

      $(document).on("click", function(e){
        if(!$(el).is(e.target) && $(el).has(e.target).length === 0){
          $(el).removeClass("active");
          $options.hide();
        }
      })
    });
  })
}

/* 지도 Range */
const zoomRange = function(){
  $('.zoom-range input[type=range]').on('input', function(e) {
    var min = e.target.min,
    max = e.target.max,
    val = e.target.value;

    $(e.target).css({
      'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
    });
  }).trigger('input');
}

/* input */
$(document).ready(function () {
  if ($(".f-input").length === 0) return;

  $(".f-input").each(function() {
    const $item = $(this);
    const $btnClear = $item.find(".btn-clear");
    const $input = $item.find("input");

    function activeClass() {
      if ($input.val().length > 0) {
        $item.addClass("active");
      } else {
        $item.removeClass("active");
      }
    }

    $input.on("input focus", function() {
      activeClass();
    });

    $input.on("focusout", function() {
      $item.removeClass("active");
    });

    $btnClear.on("click", function() {
      $input.val("").focus();
      $item.removeClass("active");
    });
  });
});

/* -------- 우측 지도 컨트롤러 -------- */
window.onload = function(){
  //학교 위치 (현재 위치 변경)
  $('.map-toolbox .btn-location').on('click', function(){
    if (!$(this).hasClass("on")) {
      $(this).addClass('on');
    } else {
      $(this).removeClass('on');
    }
  });

  //백지도
  $('.map-toolbox .btn-blankmap').on('click', function(){
    if (!$(this).hasClass("on")) {
      $('.map-toolbox').find('.on').removeClass('on');
      $(this).addClass('on');
    } else {
      $(this).removeClass('on');
    }
  });

  //sns 공유
  $('.map-toolbox .btn-sns-share').on('click', function(){
    if (!$(this).hasClass("on")) {
      $(this).addClass('on');
    } else {
      $(this).removeClass('on');
    }
  });

  //인쇄
  $('.map-toolbox .btn-print').on('click', function(){
    window.print();
  });

  //좌측 메뉴 접기/펼치기
  $(".btn-close-menu").on("click", function(e) {
    if (!$(this).hasClass("on")) {
        $(this).addClass("on");
        $('.menu-left').addClass("on");
        $('.selbox').addClass("on");
        $(this).find('span.blind').text('메뉴 접기');
    } else {
        $(this).removeClass("on");
        $('.menu-left').removeClass("on");
        $(this).find('span.blind').text('메뉴 펼치기');
        $('.selbox').removeClass("on");
    }
  });
}


/* -----------------popup------------------ */
let popupArr = [];

const setOptions = function(data){
  let obj = {};
  obj.id = data.id;
  obj.popup = $(`#${obj.id}`);
  obj.popup.find(".dimd").remove();
  obj.dimd = $("[showed-obj]").find(".dimd").length > 0 ? `<div class="dimd type-transparent"/>` : `<div class="dimd"/>`; /* close-obj 삭제로 변경됨.*/
  obj.is_dimd = obj.popup.is("[no-dimd]") ? false : obj.popup.prepend(obj.dimd);
  if(data.target){
    obj.btn = data.target;
    obj.btnType = obj.btn.is("[method-type]") ? obj.btn.attr("method-type") : "";
  }

  popupArr[popupArr.length] = obj;

  for(var i = 0; i < obj.popup.find("[close-obj]").length; i++){
    obj.popup.find("[close-obj]").eq(i).attr("close-obj", obj.id);
  }

  return obj;
}

const openPopup = function(obj){

  let object = setOptions(obj);


  object.popup.addClass("display-show");
  object.popup.attr("showed-obj", "");

  $('html').addClass('active-overlay');
  renderSelect2();
  selectFunc();
}

const closePopup = function(obj){
  for(var i = 0; i < popupArr.length; i++){
    if(popupArr[i].id === obj.id){
      popupArr[i].popup.removeClass("display-show");
      popupArr[i].popup.removeAttr("showed-obj");
      popupArr[i].popup.find(".dimd").remove();

      if(popupArr[i].btnType === "toggle"){
        popupArr[i].btn.removeClass("active");
      }

      popupArr.splice(i, 1);

    }
  }

  if(popupArr.length <= 0){
    $('html').removeClass('active-overlay');
  }
}

// init-show
$(window).on("load", function(){
  if($("[init-show]").length > 0){
    openPopup({id: $("[init-show]").attr("id")});
  }
})

// 기본 클릭 이벤트
$(document).on("click","[target-obj]:not([method-type])", function(){
  openPopup({id: $(this).attr("target-obj"), target: $(this)});
});

// 토글 클릭 이벤트
$(document).on("click","[target-obj][method-type='toggle']", function(){
  if($(this).hasClass("active")){
    $(this).removeClass("active");
    closePopup({id: $(this).attr("target-obj")});
  } else if(!$(this).hasClass("active")){
    $(this).addClass("active");
    openPopup({id: $(this).attr("target-obj"), target: $(this)});
  }
});

// 닫기 버튼 클릭 이벤트
$(document).on("click", "[close-obj]", function(){
  closePopup({id: $(this).attr("close-obj")});
});

$(document).on("click", ".filters [href]", function(e){
  e.preventDefault();
  let target = $(`${$(this).attr("href")}`);
  let pos = target.offset().top - ($(".header-contents").height() + 15);
  $(window).scrollTop(pos);
});

/*
// .selbox 넓이를 조정하는 함수
function adjustSelboxWidth() {
  var windowWidth = $(window).width();
  var menuWidth = $('.menu-left').outerWidth();

  if ($('.menu-left').hasClass('on')) {
    $('.btn-close-menu').addClass('on');
    $('.selbox').width(windowWidth - menuWidth);
  } else {
    $('.btn-close-menu').removeClass('on');
    $('.selbox').width(windowWidth);
  }
}

$('.btn-close-menu').on('click', function () {
  if ($(this).hasClass('on')) {
    $(this).removeClass('on');
    $('.menu-left').removeClass('on');
    $('.selbox').removeAttr("style");
  } else {
    $(this).addClass('on');
    $('.menu-left').addClass('on');
    $('.selbox').removeAttr("style");
  }
});

// 윈도우 리사이즈 이벤트
$(window).resize(function () {
  adjustSelboxWidth();
});

// 초기 실행
$(document).ready(function () {
  adjustSelboxWidth();
});
*/

