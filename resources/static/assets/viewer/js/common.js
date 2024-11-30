// 실서버 체크
var isUrlLive = 0;
if (window.location.href.split('http')[1]) {
	isUrlLive = 1;
}

// 뷰어용 외부 영상링크
function viewerVideo(url, title) {
	if (parent && parent.viewer && parent.viewer.open_video) {
		parent.viewer.open_video('external', url, title);
	} else {
		// 새창으로 띄워서 재생?
		window.open(url, '_blank');
	}
}

// 시작
$('.nav li:first-child>*,.tab-pane:first-of-type').addClass('active');
$('#hd').append('<button type=button class="d-none icon-folding" data-mirror-toggle=title>열기</button>');
var h2Height = 0;
if ($('h2:first').not('.title,.sr-only').length) {
	$('.icon-folding').removeClass('d-none');
	$('.page-num').addClass('is-folding');
}
if ($('h1').text() === '학습 내용 미리보기' || $('h1').text() === '비주얼씽킹으로 핵심 정리') {
	$('.icon-folding').show();
	$('.page-num').addClass('is-folding');
}
// 이미지
$('img').each(function () {
	var t = $(this);
	t.attr('title', t.attr('alt'));
});


/*========= 동작 =========*/
// scroll
function hei(el) {
	try {
		if (el.parent().offset().top) {
			return el.parent().offset().top;
		}
	} catch (error) {
		return 0;
	}

	return hei(el.parent());
}
function mirrorScroll() {
	$(".content,.modal-body:not(.no-scroll)").each(function (i) {
		var t = $(this),
			top = t.offset().top,
			minus = t.data('minus') || 0,
			setHeight = t.data('height');
		//console.log($('.h2-num').height());
		if (top === 0 && !t.hasClass('modal-body')) {
			top = hei(t);
		}
		/*퀴즈,수학익힘 버튼영역*/
		if (minus === 0 && ($('#wrap').hasClass('quiz') || $('#wrap').hasClass('quiz-ready') || $('#wrap').hasClass('step-pairbook'))) {
			minus += 60;
		}

		t.hasClass('content') && t.height(952 - top - minus);
		if (setHeight) {
			if ($('body').hasClass('folding-title') && !t.closest('.modal').length) {
				setHeight = setHeight + h2Height;
			}
			t.height(setHeight);
		}
		t.mCustomScrollbar({
			theme: "rounded-dark",
			scrollInertia: 0,
			scrollEasing: "linear",
			callbacks: {
				onScroll: function () {
					// mirroring 보내기
					if (!data.token || data.token === mirroringId) {
						data.token = mirroringId;
						data.scroll[i] = this.mcs.top;
						dataWrite();
					} else {
						data.token = '';
					}
				},
				onInit: function (e) {
					t.addClass('scroll-initialized')
				}
			},
			advanced: {
				autoScrollOnFocus: false,
			}
		});
		if (!t.find('.icon-top').length) {
			t.find('.mCustomScrollBox').append('<button type="button" class="icon-top">최상단으로 가기</button>');
			t.find('.icon-top').data('target', t);
		}
	});
	// scroll - section
	$(".content-vertical").each(function () {
		var t = $(this),
			top = t.offset().top,
			setHeight = t.data('height');
		if (top === 0) {
			top = hei(t);
		}
		var targetH = parseInt(952 - top),
			$targetChild = t.find('.vertical-section');
		if (setHeight) {
			if ($('body').hasClass('folding-title') && !t.closest('.modal').length) {
				setHeight = setHeight + h2Height;
			}
			targetH = setHeight;
		}
		$targetChild.height(targetH);
		t.height(targetH);
		$(this).mCustomScrollbar({
			setHeight: targetH,
			theme: "rounded-dark",
			scrollInertia: 100,
			snapAmount: targetH,
			mouseWheel: {
				scrollAmount: targetH,
				preventDefault: true,
			},
			advanced: {
				autoScrollOnFocus: false,
			},
			callbacks: {
				onScroll: function () {
					// mirroring 보내기
					if (!data.token || data.token === mirroringId) {
						data.token = mirroringId;
						data.scroll[i] = this.mcs.top;
						dataWrite();
					} else {
						data.token = '';
					}
					/*
					var activeIndex = Math.floor(-this.mcs.top / targetH),
						answerObj = $('.bx-btn-answer>li');
					if($('.tab').length){
						answerObj = answerObj.find('li');
					}
					$targetChild.eq(activeIndex).addClass('active').siblings().removeClass('active');
					answerObj.eq(activeIndex).addClass('active').siblings().removeClass('active');
					*/
				},
				onInit: function (e) {
					t.addClass('scroll-initialized')
				}
			}
		});
		if (!t.find('.icon-top').length) {
			t.find('.mCustomScrollBox').append('<button type="button" class="icon-top">최상단으로 가기</button>');
			t.find('.icon-top').data('target', t);
		}
	});
}
$(".content-vertical>*:first-child").addClass('active');
$(document).on('click', '.icon-top', function () {
	var t = $(this),
		targetObj = t.data('target');
	$(targetObj).mCustomScrollbar("scrollTo", "top");
});
$(window).on('load', function () {
	mirrorScroll();
})

// tab
$('[data-mirror-toggle=tab]').click(function () {
	var t = $(this),
		i = t.parent().index(),
		p = t.data('parent');

	console.log(t);
	t.tab('show');
	if (this.dataset.multi) {
		$('[data-tab-multi="' + this.dataset.target + '"]').addClass('active').siblings().removeClass('active');
	}
	//dataWrite();
});

// show
$('[data-show-target]:not(.active-show)').each(function () {
	var t = $(this),
		id = t.attr('id'),
		type = t.data('type'),
		target = t.data('show-target');
	$(target).each(function () {
		if (type) {
			$(this).addClass('invisible')
		} else {
			$(this).hide();
		}
	});
})
$('[data-show-target]').click(function () {
	var t = $(this),
		type = t.data('type'),
		target = t.data('show-target'),
		other = $('[data-show-target="' + target + '"]');
	// 동작
	if (t.hasClass('active-show') && !t.hasClass('is-show-fix')) {
		//other.removeClass('active-show');
		t.removeClass('active-show');
		$(target).each(function () {
			if (type) {
				$(this).addClass('invisible')
			} else {
				$(this).hide();
			}
		});
	} else {
		//other.addClass('active-show');
		t.addClass('active-show');
		$(target).each(function () {
			if (type) {
				$(this).removeClass('invisible')
			} else {
				$(this).show();
			}
		});
	}
	//dataWrite();
});
// hide
$('[data-hide-target]').click(function () {
	var t = $(this),
		type = t.data('type'),
		target = t.data('hide-target'),
		other = $('[data-show-target="' + target + '"]');
	// 동작
	other.removeClass('active-show');
	$(target).each(function () {
		if (type) {
			$(this).addClass('invisible')
		} else {
			$(this).hide();
		}
	});
});

// nav
$('[data-mirror-toggle=nav]').click(function () {
	var t = $(this);
	t.tab('show');
	if (this.dataset.multi) {
		$('[data-tab-multi="' + this.dataset.target + '"]').addClass('active').siblings().removeClass('active');
	}
});
$('div.tab-button>button').on('click', function () {
	var $nav = $(this).parents('.tab-button').children('nav').length ? $(this).parents('.tab-button').children('nav') : $('#nav');
	var o = $nav.find('.active').parent().next().children();
	if ($(this).hasClass('swiper-button-prev')) {
		o = $nav.find('.active').parent().prev().children();
	}
	$(o).tab('show');
	//dataWrite();
});

$('[id^=nav]:not(#nav2) [data-mirror-toggle=nav]').on('shown.bs.tab', function (e) { /* 서브 컨텐츠 이전 다음 비활성화 때문에 #nav2 추가 - 수학*/
	var elContain = $(this).parents('.tab-button').length;
	var $tab = elContain ? $(this).parents('.tab-button') : $('#wrap>.tab-button'); /* 서브 컨텐츠 이전 다음 비활성화 때문에 #wrap> 추가 - 수학*/
	var tablen = elContain ? $tab.find('.nav>li').length : $('#nav>ul>li').length;

	$tab.children('button').removeClass('swiper-button-disabled');
	if ($(e.target).parent().index() === 0) {
		$tab.children('.swiper-button-prev').addClass('swiper-button-disabled');
	} else if ($(e.target).parent().index() + 1 === tablen) {
		$tab.children('.swiper-button-next').addClass('swiper-button-disabled');
	}
});
$('[data-toggle="tab"]').on('hidden.bs.tab', function () {
	audioStop();
});

// img change
$('[data-mirror-toggle*=img-change]').click(function () {
	var t = $(this),
		target = t.data('target');
	$(target).toggleClass('active');
});

// active
$('[data-mirror-toggle*=active-this]').click(function () {
	var t = $(this);
	t.toggleClass('active');
});
$('[data-mirror-toggle*=active-parent]').click(function () {
	var t = $(this);
	t.parent().toggleClass('active');
});
$('[data-mirror-toggle*=active-target]').click(function () {
	var t = $(this),
		o = t.data('active-target'),
		className = t.data('active-name') || 'active';

	if (t.hasClass(className)) {
		t.removeClass(className);
		$(o).removeClass(className);
	} else {
		t.addClass(className);
		$(o).addClass(className);
	}
});

/* modal */
$(document).on('click', '[data-mirror-toggle*=modal]', function () {
	$($(this).data('target')).modal();
});
$('.modal').on('hidden.bs.modal', function (e) {
	var t = $(this);
	if (t.hasClass('modal-slide')) {
		t.find('[data-mirror-toggle=active-target]').removeClass('active');
		$(t.find('[data-mirror-toggle=active-target]').data('active-target')).removeClass('active');
	}
	!t.find('[data-guide-open]').length && audioStop();
	$('.vjs-playing').length && videoStop(true);
});

// h2 타이틀
$('[data-mirror-toggle=title]').click(function () {
	var o = $('body');
	h2Height = $('h2:first').not('.title,.sr-only').height();
	if ($('body').hasClass('folding-title')) {
		o.removeClass('folding-title');
	} else {
		o.addClass('folding-title');
	}
	$('.content', '.content-vertical').mCustomScrollbar('destroy').removeClass('scroll-initialized');
	mirrorScroll();
});

// 단답형 문항
$('[data-mirror-toggle*=short-answer]').click(function () {
	var t = $(this),
		group = t.data('group');
	if (group) {
		$(group).toggleClass('active').find('[data-mirror-toggle*=short-answer]').toggleClass('active').end().find('[data-invisible]').toggleClass('active');
	} else {
		t.toggleClass('active');
	}
});

// 아무거나 클릭해도
$('[data-mirror-toggle=anything]').click(function () {
	var t = $(this),
		id = t.attr('id'),
		target = $(t.data('target'));
	target.toggleClass('active-anything');
});

// 정답
function answerReset(target) {
	$(target).removeClass('page-pass');

	// 초기화
	$(target).find('.active-show').trigger('click');
	$(target).find('[data-mirror-toggle*=short-answer]').removeClass('active');
	$(target).find('[data-mirror-toggle*=img-change]').each(function () {
		$(this.dataset.target).removeClass('active');
	});
	$(target).find('[data-mirror-toggle*=active-target]').each(function () {
		$(this).removeClass('active');
		$($(this).data('active-target')).removeClass('active');
	});
	$(target).find('.choice,.choice-character').removeClass('active');
	$(target).find('.draw-line').length && Canvas[$(target).find('.draw-line').attr('id')].clear();
	dragReset(target);
	$(target).find('input').prop({
		'checked': false,
		'disabled': false,
	});
	$('.icon-finish').remove();

	// 다음 단계
	quizTabBtnInActive();
}

function quizTabBtnInActive() {
	$('#tab-btn-next').removeClass('pointer-auto');
	$('.tab-quiz .active').parent().removeClass('pass');
}

function quizTabBtnActive() {
	$('#tab-btn-next').addClass('pointer-auto');
	$('.tab-quiz .active').parent().addClass('pass');
}

$('[data-mirror-toggle=answer]').click(function () {
	var t = $(this),
		id = t.attr('id'),
		target = t.data('target'),
		aTg = $('[data-mirror-toggle=answer]');

	var input = $(target).find('input[data-answer]');
	var inputAnswerNum = input.length;
	var inputAnswerChkNum = input.filter(':checked').length;
	var imgToggleTarget = $(target).find('[data-mirror-toggle*=img-change]:not([data-answer="except"])').data('target');
	var activeToggleTarget = $(target).find('[data-mirror-toggle*=active-target]:not([data-answer="except"])').data('active-target');
	var toggle = $(target).find('[data-mirror-toggle*=short-answer]:not([data-answer="except"]), ' + imgToggleTarget + ',' + activeToggleTarget);
	var toggleNum = toggle.length;
	var checkCount = Number(this.dataset.typeCount) || 1;

	// 유형별 정답 조건
	var inputAnswer = inputAnswerNum && (inputAnswerNum === inputAnswerChkNum) && (inputAnswerChkNum === $(target).find('[type="radio"], [type="checkbox"]').filter(':checked').length);
	var toggleAnswer = toggleNum && (toggleNum === toggle.filter('.active').length);
	var lineAnswer = $($(target).find('canvas')).parent().hasClass('active') && !$($(target).find('canvas')).parent().find('.q-line-btn:not([data-line])').hasClass('line-done')
	var passAnswer = t.data('answer') === 'pass';
	var dropCorrectlength = $(target).find('.drop-correct').length;
	var dropchk = dropCorrectlength === $(target).find('.drop-obj[data-drop]').length;
	if ($(target).data('multi-drop')) {
		dropchk = true;
		var arr = $(target).data('multi-drop').split(',');
		for (var i = 0; i < arr.length; i++) {
			if (!$(target).find('.drop-obj[data-drop="' + arr[i] + '"]').filter('.ui-droppable-disabled').length) {
				dropchk = false;
				break;
			}
		}
	}
	var dragAnswer = $(target).find('.ui-droppable-disabled').length && dropchk && (dropCorrectlength === $(target).find('.ui-droppable-disabled').length);

	if (t.hasClass('active')) {
		answerReset(target);
		t.removeClass('active');
		return false;
	}

	// 오답체크 필요없을시
	if (this.dataset.answer === 'toggle') {
		$(target).addClass('page-pass');
		$(target).find('input').prop({
			'checked': false,
			'disabled': true,
		}).filter('[data-answer]').each(function () {
			$(this).prop('checked', true);
		});

		$(target).find('.draw-line').length && lineDrawAnswer(target);

		$(target).find('.short-answer').each(function () {
			$(this).addClass('active');
		});

		$(target).find('[data-mirror-toggle*=img-change]').each(function () {
			$(this.dataset.target).addClass('active');
		});

		t.addClass('active');
		return false;
	}

	//console.log(inputAnswer, toggleAnswer, lineAnswer, passAnswer, dragAnswer);

	var answerArray = [inputAnswer, toggleAnswer, lineAnswer, passAnswer, Boolean(dragAnswer)];
	var count = answerArray.filter(function (e) {
		return e;
	}).length;

	// 정답확인 안했을 때, 정답이 틀렸을 때
	if (count !== checkCount || !(inputAnswer || toggleAnswer || lineAnswer || passAnswer || dragAnswer)) {
		$('#modal-quiz-x').modal({ backdrop: 'static' });
		return false;
	}

	t.addClass('active');

	var $modalQuiz = $('#modal-quiz');
	var txt = '정답입니다.';
	var btnTxt = '확인 완료';
	if (toggleAnswer || passAnswer) {
		txt = '정답을 확인하였습니다.';
		btnTxt = '확인 완료';
	}
	$modalQuiz.on('show.bs.modal', function (e) {
		$modalQuiz.find('h4').html(txt);
		$modalQuiz.find('.btn-icon').html(btnTxt);
	});
	$modalQuiz.modal({ backdrop: 'static' });

	if ($('.tab-pane.active:not(.sub-tabs)').index() === $('.tab-pane:not(.sub-tabs)').length - 1) {
		//$('#modal-quiz-finish').modal({backdrop:'static'});
		$('.tab-pane.active .icon-answer').before('<button type="button" class="icon-finish" data-mirror-toggle="modal" data-target="#modal-quiz-finish">완료</button>');
	}
});
$('#modal-quiz [data-dismiss],#modal-quiz-finish [data-dismiss]').click(function () {
	var resetTarget = '.tab-pane.active:not(.sub-tabs)';
	$(resetTarget).addClass('page-pass');
	$(resetTarget).find('[data-show-target]').not('.active-show').trigger('click');
	$(resetTarget).find('.draw-line').length && lineDrawAnswer(resetTarget);
	//console.log($(resetTarget));
	quizTabBtnActive();
});
$('#modal-quiz-x [data-dismiss]').click(function () {
	answerReset('.tab-pane.active');
});

$('.page-auto.active').length && quizTabBtnActive();

$('.tab-quiz [data-mirror-toggle="nav"]').on('shown.bs.tab', function (e) {
	if ($(e.target.dataset.target).hasClass('page-auto')) {
		quizTabBtnActive();
		return false;
	}
	$(e.target.dataset.target).hasClass('page-pass') ? quizTabBtnActive() : quizTabBtnInActive();
});
$('.icon-reset').click(function () {
	var resetTarget = $(this).parents('.tab-pane').length ? $('.tab-pane.active') : $('.page-pass');
	resetTarget.removeClass('page-pass');
	quizTabBtnInActive();
	$('[data-mirror-toggle="answer"]').removeClass('active');
	$('.icon-finish').remove();
});


/* 스와이프 */
var swipeQ = [],
	swipeBasic = [],
	swipeModal = [];
// 1. 스와이프 슬라이드 이미지 형 .slide-img
$('.slide-img .swiper-container').each(function (i) {
	var t = $(this);
	swipeBasic[i] = new Swiper(t, {
		observer: true,
		observeParents: true,
		pagination: {
			el: t.find('.swiper-pagination'),
			clickable: true,
		},
		navigation: {
			nextEl: t.parent().find('.swiper-button-next'),
			prevEl: t.parent().find('.swiper-button-prev'),
		},
		//initialSlide:data.slide[i].active,
		on: {
			init: function () {

			},
			slideChange: function () {

			}
		},
	});
});
// 2. 스와이프 슬라이드 형 .slide
$('.slide .swiper-container').each(function (i) {
	var t = $(this);
	swipeBasic[i] = new Swiper(t, {
		observer: true,
		observeParents: true,
		pagination: {
			el: t.find('.swiper-pagination'),
			clickable: true,
		},
		navigation: {
			nextEl: t.parent().find('.swiper-button-next'),
			prevEl: t.parent().find('.swiper-button-prev'),
		},
		//initialSlide:data.slide[i].active,
		on: {
			init: function () {
				setTimeout(function () {
					t.find('.swiper-slide').each(function (i) {
						t.find('.swiper-pagination-bullet').eq(i).html('<img src="' + $(this).find('img').attr('src') + '" alt="" />');
					});
				}, 500);
			},
			slideChange: function () {
				//data.slide[i].active=$(this)[i].activeIndex;
				//dataWrite();
			}
		},
	});
});
// 3. 스와이프 모달 형 .slide-pn-dot
$('.slide-pn-dot .swiper-container').each(function (i) {
	var t = $(this);
	var autoHeight = true;
	var effect = t.data('effect') || 'slide';
	swipeModal[i] = new Swiper(t, {
		autoHeight: t.hasClass('auto-height'),
		effect: effect,
		observer: true,
		observeParents: true,
		simulateTouch: false,
		pagination: {
			el: t.parent().find('.swiper-pagination'),
			clickable: true,
		},
		navigation: {
			nextEl: t.parent().find('.swiper-button-next'),
			prevEl: t.parent().find('.swiper-button-prev'),
		},
		//initialSlide:data.slidePnDot[i].active,
		on: {
			init: function () {

			},
			slideChange: function () {
				//data.slidePnDot[i].active=$(this)[i].activeIndex;
				//dataWrite();

				$('.vjs-playing').length && videoStop(true);
			}
		},
	});
});
// 스와이프 모달 형 버튼
$('[data-mirror-toggle=modal-swipe]').click(function () {
	var $t = $(this),
		$target = $($t.data('target')),
		swipeIndex = 0,
		index = $t.data('index');
	$('.slide-pn-dot .swiper-container').each(function (i) {
		if ('#' + $(this).closest('.modal').attr('id') === $t.data('target')) {
			swipeIndex = i;
		}
	});
	swipeModal[swipeIndex].slideTo(index);
	$target.modal('show');
	//dataWrite();
});

// dragdrop
if ($('.dragdrop-card').length) {
	json.dragdropCard.forEach(function (e, i) {
		e.dragItem.forEach(function (e2, i2) {
			var o = $('.dragzone').find('.drag-item').eq(i2);
			if (e2.status === 'dropped') {
				setTimeout(function () {
					//o.simulate("drag", {dx:e2.left,dy:e2.top});
				}, 200)
			} else if (e2.status === 'dragging') {
				if (!o.hasClass('dragging')) {
					//o.data('ui-draggable')._mouseStart() -> 테마의 클릭으로 방식 변경 응용
					//console.log(o.data('ui-draggable').position.top);
				}
				o.css({ top: e2.top, left: e2.left });
			} else {

			}
		});
	});
}
var $dragItem = $('.drag-obj');
var $dropBox = $('.drop-obj');

$dragItem.draggable({
	helper: 'clone',
	containment: '#wrap',
	revert: function () {
		if (!$(this).data('hasBeenDropped')) {
			return true;
		}
		refreshPage();
	},
	revertDuration: 200,
	start: function () {
		$(this).addClass('dragging');
		refreshPage();
	},
	stop: function () {
		$(this).removeClass('dragging');
		refreshPage();
	},
	drag: function () {
		refreshPage();
	}
});

var dropEventByPage;

$dropBox.droppable({
	drop: function (e, ui) {
		var dropitem = $(e.target);
		var dropData = String(dropitem.data('drop'));
		var dragitem = $(ui.draggable);
		var dragData = String(dragitem.data('drop'));
		var prop = dropData.split(',').indexOf(dragData) != -1;
		var newDrag = ui.draggable.clone().removeClass('ui-draggable ui-draggable-handle dragging');

		function dropped(dropitem) {
			dropitem.droppable({ disabled: true });
			dropitem.addClass('drop-correct');
			dropEventByPage && dropEventByPage(dropitem);
		}

		function oneWay(dropitem) {
			if (dragitem.hasClass('one-off')) {
				dragitem.draggable({ disabled: true });
			}
			dragitem.data('hasBeenDropped', true);
			dropitem.droppable({ disabled: true });
			dropitem.append(newDrag);
			prop && dropped(dropitem);
		}

		switch (dropitem.data('drop-type')) {
			case 'clone':
				dropitem = dropitem.parents('.drop-clone-area').find('.drop-obj').filter('[data-drop="' + dropitem.data('drop') + '"]');
				oneWay(dropitem);
				break;
			case 'fix':
				//dragitem.draggable({ disabled: false });
				dragitem.data('hasBeenDropped', prop);
				if (prop) {
					dropitem.append(newDrag);
					dropitem.data('drop', dropData.replace(dragData, ''));

					var filtered = dropData.split(',').filter(Boolean);
					filtered.length === 1 && dropped(dropitem);

					dragitem.hasClass('hide') && dragitem.addClass('d-none');
					dragitem.hasClass('one-off') && dragitem.draggable({ disabled: true });
				}
				break;
			default:
				oneWay(dropitem);
		}
		refreshPage();
	}
});

function dragReset(el) {
	$(el).find('.drop-obj').each(function (i, ele) {
		$(ele).removeClass('drop-correct').data('drop', $(ele).attr('data-drop'));
		$(ele).droppable({ disabled: false }).children().not('.hidden-drag-answer').remove();
	})
	$(el).find('.drag-obj').draggable({ disabled: false });
}

$('.btn-drag-reset').click(function () {
	dragReset(this.dataset.reset);
	$('input').val('');
});

$('input, textarea').on('drop', function (e) {
	e.preventDefault();
});


// 오디오
$('body').append('<div id=audiobook class=sr-only>');
$('[data-audio]').each(function (i) {
	var t = $(this),
		id = t.attr('id');

	if (!id) {
		t.attr('id', 'audio-btn-' + i);
		id = 'audio-btn-' + i;
	}
	$('#audiobook').append('<audio id=audio-' + id + ' src=' + t.data('audio') + '>');
});
// function audioStop(){
// 	$('audio,video').each(function(){
// 		$(this)[0].pause();
//         $(this)[0].currentTime = 0;
// 	});
// }
$('[data-audio]').click(function () {
	var t = $(this),
		id = t.attr('id');

	if (t.hasClass('modal')) return false;

	audioStop();

	if (t.hasClass('active-audio')) {
		t.removeClass('active-audio');
		audioStop();
	} else {
		t.addClass('active-audio');
		document.getElementById('audio-' + id).play();
	}
});
// bubble
$('[data-bubble-audio]').each(function (i) {
	var t = $(this),
		id = t.data('id') + '-' + t.data('index');
	$('#audiobook').append('<audio id=audio-' + id + ' src=' + t.data('bubble-audio') + '>');
});
$('[data-mirror-toggle=bubble]').click(function () {
	var t = $(this),
		id = t.data('id'),
		i = t.data('index'),
		$target = $('#' + id + '-' + i);
	audioStop();
	t.toggleClass('active');
	/*
	*/
	if (t.attr('data-multiple')) {
		$target = $('.bubble[data-id="' + id + '"]');
	}
	if (t.hasClass('active')) {
		if (isUrlLive === 1) {
			// 파일 체크
			$.ajax({
				url: $('#audio-' + id + '-' + i).attr('src'),
				success: function () {
					document.getElementById('audio-' + id + '-' + i).play();
				}
			});
		} else {
			document.getElementById('audio-' + id + '-' + i).play();
		}
		$target.addClass('active');
	} else {
		$target.removeClass('active');
	}
});

// 플레이어
var $playerWrap = $('#player'),
	player = $('#player-obj'),
	playerO = player[0],
	playSec = 0,
	endTime = 0,
	endSec = 0,
	playerRepeat = 0,
	$playerbar = $('#player-bar'),
	$playerCnt = $('#player-cnt'),
	$playerAllTime = $('#player-all-time'),
	$playerTime = $('#player-time'),
	$playerStop = $('#player-stop'),
	$playerPlay = $('#player-play'),
	playerHeight = $playerCnt.height();

/*
player.on("loadedmetadata",function(e){
	endTime = e.target.duration;
	alert(endTime)
});
*/
player.on('timeupdate', function () {
	var time = this.currentTime;
	// 자막 표시
	$('#player [data-playtime]').each(function () {
		var pt = String($(this).attr('data-playtime'));
		var playtime = pt.split(',')[0];
		var endtime = pt.split(',')[1];
		if (playtime < time && time < endtime) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});
	// 자막 올라가기
	// 로드메타가 안되어서 편법
	var t = $(this)[0];
	playSec = parseInt(t.currentTime % 60);
	endTime = parseInt(t.duration);
	endSec = parseInt(t.duration % 60);
	if (playSec < 10) {
		playSec = '0' + playSec;
	}
	if (endSec < 10) {
		endSec = '0' + endSec % 60;
	}
	/*
	if($playerCnt.find('.active').position().top>350){
		$playerCnt.css({
			'transform':'translate(0,'+(350-$playerCnt.find('.active').position().top)+'px)'
		});
	}
	*/
	if (playerHeight > 700) {
		$playerCnt.css({
			'transform': 'translate(0,' + (700 - $playerCnt.height()) * parseInt(t.currentTime) / endTime + 'px)'
		});
	}
	$playerAllTime.text('0' + parseInt(t.duration / 60) + ':' + endSec);
	$playerTime.text('0' + parseInt(t.currentTime / 60) + ':' + playSec);
	$playerbar.val(parseInt(t.currentTime / t.duration * 100));
	$playerWrap.find('.playbar-page').not('.active').each(function () {
		$(this).addClass('active').css({
			left: (400 - 36) * $(this).data('time') / t.duration
		});
	});
	if (t.paused) {
		$('#player').removeClass('playing');
	} else {
		$('#player').addClass('playing');
	};
})
	/*
	.on('canplay',function(){
		// 작동안함
		playSec = parseInt($(this)[0].duration%60);
		if(playSec<10){
			playSec = '0'+playSec;
		}
		$playerAllTime.text('0'+parseInt($(this)[0].duration/60)+':'+playSec);
	})
	*/
	.on('ended', function () {
		$('#player').removeClass('playing');
		playerO.currentTime = 0;
		if (playerRepeat === 1) {
			playerO.play();
		}
	});
$playerWrap.find('.playbar-page').click(function () {
	playerO.currentTime = $(this).data('time');
});
$playerPlay.click(function () {
	var o = $('#player');
	if (playerO.paused) {
		playerO.play();
	} else {
		playerO.pause();
	}
});
$playerStop.click(function () {
	playerO.pause();
	playerO.currentTime = 0;
	$('#player').removeClass('playing');
	// 미러링 추가
	data.video = [];
});
$playerbar.mousedown(function () {
	playerO.pause();
}).mouseup(function () {
	playerO.currentTime = playerO.duration * $(this).val() / 100;
	playerO.play();
	// 미러링 추가
	if (!data.token || data.token === mirroringId) {
		data.token = mirroringId;
		data.video[0] = playerO.duration * $(this).val() / 100
		dataWrite();
	} else {
		data.token = '';
	}
});
$('#player-repeat').click(function () {
	var t = $(this);
	if (playerRepeat === 0) {
		t.addClass('active');
		playerRepeat = 1;
	} else {
		t.removeClass('active');
		playerRepeat = 0;
	}
});
$('#player-speed-layer button').click(function () {
	var t = $(this);
	t.addClass('active').parent().siblings().find('button').removeClass('active');
	playerO.playbackRate = t.data('val');
});
$('[id^=player-ctr-]').click(function () {
	var t = $(this),
		v = t.data('val');
	t.addClass('active').siblings('[id^=player-ctr-]').removeClass('active');
	$('#player').removeClass('player-mode3 player-mode4').addClass('player-mode' + v);
	if (v === 4) {
		playerO.muted = true;
	} else {
		playerO.muted = false;
	}
});
function audioStop() {
	$('audio,video:not([autoplay])').each(function () {
		$(this)[0].pause();
		if (!isNaN($(this)[0].duration)) {
			$(this)[0].currentTime = 0;
		}
	});
}
// 미러링 음소거
$('audio,video').each(function () {
	var t = $(this);
	t.on("play", function () {
		// mirroring 보내기
		if (!data.token || data.token === mirroringId) {
			try {
				if (parent && parent.viewer && parent.viewer.is_mirroring_owner_window()) {
					t[0].muted = true;
				} else {
					t[0].muted = false;
				}
			} catch (error) {
				// unmute ?
			}
		} else {
			data.token = '';
		}
	});
});

// video
$('.video-js').each(function (i) {
	var t = $(this);
	if (!t.attr('id')) {
		t.attr('id', 'mteacher-video' + i);
	}
});
if ($('.video-js').length) {
	// 비디오 임시
	var Button = videojs.getComponent('Button');
	// 정지버튼
	var stopButton = videojs.extend(Button, {
		constructor: function () {
			Button.apply(this, arguments);
			this.controlText('정지');
			this.addClass('vjs-stop-control');
		},
		handleClick: function () {
			this.player_.pause();
			this.player_.currentTime(0);
			//this.player_.posterImage.show();
			this.player_.hasStarted(false);
		}
	});
	videojs.registerComponent('stopButton', stopButton);
	// 자막버튼
	var CaptionToggle = videojs.extend(Button, {
		constructor: function () {
			Button.apply(this, arguments);
			this.controlText('자막 보기');
			this.addClass('vjs-caption-control');
			this.showing = false;
		},
		handleClick: function () {
			this.player_.toggleClass('vjs-caption-active');
			(!this.showing) ? this.controlText('자막 닫기') : this.controlText('자막 보기');
			this.showing = !this.showing;
		}
	});
	videojs.registerComponent('captionToggle', CaptionToggle);

	$('.video-js').each(function (i) {
		videojs(document.querySelector('#' + this.id), {
			controls: true,
			fluid: true,
			controlBar: {
				volumePanel: { inline: false },
				children: [
					'playToggle',
					'stopButton',
					'progressControl',
					'volumeMenuButton',
					'currentTimeDisplay',
					'durationDisplay',
					'volumePanel',
					//'captionToggle',
					'fullscreenToggle',
					'remainingTimeDisplay'
				]
			}
		}, function onPlayerReady() {

			var player = this;
			var $video = $(this);

			$video.next('.video-caption').length && $video.append($video.next('.video-caption'));

			player.on('timeupdate', function () {
				var time = player.currentTime();
				$('[data-toggle=video-caption]').each(function () {
					var t = $(this);
					var pt = String($(this).attr('data-playtime'));
					var playtime = pt.split(',')[0];
					var endtime = pt.split(',')[1];
					if (playtime < time && time < endtime) {
						t.addClass('playing-video-script');
						return;
					} else {
						t.removeClass('playing-video-script');
					}
				});
			});
			// 미러링 추가
			player.on('seeked', function () {
				// mirroring 보내기
				if (!data.token || data.token === mirroringId) {
					data.token = mirroringId;
					data.video[i] = player.currentTime();
					dataWrite();
					data.token = '';
				} else {
					data.token = '';
				}
			});
		});
	});

	$('[data-mirror-toggle]').click(function (e) {
		$('.vjs-playing').length && videoStop(e);
	});

}

function videoStop(e) {
	var $video = $('.video-js.vjs-playing')[0].player;
	$video.pause();

	if ($(e.target).parents('.nav').length || !$('.video-js.vjs-playing').is(':visible') || e) {
		$video.currentTime(0);
		$video.hasStarted(false);
	}
}

// 선긋기
if ($('.draw-line').length) {

	$('.draw-line').each(function () {
		var t = $(this);
		t.prepend('<canvas id="canvas-' + t.attr('id') + '" class="canvas"></canvas>').find('.q-line-btn').each(function (i) {
			$(this).append('<button type="button" class="text-hide" data-first>선택</button>');
		});

		if (t.find('.line-cross').length) {
			$('.line-cross .q-line-btn').each(function (i) {
				var t = $(this);
				t.prepend('<button type="button" class="text-hide" data-last>선택</button>');
			});
		}
	});

	var Canvas = {};

	function CANVAS() {
		this.line = '.line-from, .line-to, .line-cross',
			this.moveLine = function (startBtn, endBtn, color) {
				var sx = offsetValue(startBtn.offset().left - this.parent.offset().left) + 6;
				var sy = offsetValue(startBtn.offset().top - this.parent.offset().top) + 6;
				var ex = offsetValue(endBtn.offset().left - this.parent.offset().left) + 6;
				var ey = offsetValue(endBtn.offset().top - this.parent.offset().top) + 6;

				this.ctx.lineWidth = 4;
				this.ctx.strokeStyle = color || '#e08737';
				this.ctx.beginPath();
				this.ctx.moveTo(sx, sy);
				this.ctx.lineTo(ex, ey);
				this.ctx.stroke();
				this.ctx.closePath();
			},
			this.clear = function () {
				var parent = this.parent;
				this.lineReset();
				parent.find('.line-done, .done').removeClass('line-done done');
				this.ctx.clearRect(0, 0, this.parent.width(), this.parent.height());
				this.chkAnswer = this.isMulti ? this.isMulti : this.parent.find('.line-from .q-line-btn[data-line]').length;
				parent.removeClass('active');
				parent.find('.q-line-btn[data-line]').each(function () {
					$(this).data({
						'done': '',
						'refuse': '',
					});
					if ($(this).parents('.line-from').length) {
						$(this).data('remain', parent.find('[data-line="' + this.dataset.line + '"]').length - 1);
					}
				});
				sizeSet(this.parent, document.getElementById(this.parent.find('canvas').attr('id')));
			},
			this.lineReset = function () {
				this.parent.removeClass('drawing');
				$('.line-start').removeClass('line-start');
				$(this.line).removeClass('disabled');
			}
	}

	function appZoom() {
		if (parent.ZOOMVALUE == undefined) {
			parent.ZOOMVALUE = 1;
		}
		return parent.ZOOMVALUE;
	}

	function offsetValue(value) {
		return value / appZoom();
	}

	function sizeSet(o, canvas) {
		canvas.width = o.width();
		canvas.height = o.height();
	}

	function lineAnswerLoop(el, endParent, id) {
		el.each(function () {
			var startBtn = $(this);
			var startParent = startBtn.parent();
			var endBtn = endParent.find('[data-line="' + startParent.data('line') + '"]').children('button[data-first]');
			if (endBtn.length) {
				Canvas[id].moveLine(startBtn, endBtn, '#003cff');
			}
		});
	}

	function lineDrawAnswer(el) {
		var id = $(el).find('.draw-line').attr('id');
		var start = $(el).find('.line-from .q-line-btn[data-line] button[data-first]');
		var end = $(el).find('.line-to');
		Canvas[id].clear();

		if (Canvas[id].isCross) {
			lineAnswerLoop(start, $(el).find('.line-cross'), id);
			lineAnswerLoop($(el).find('.line-cross .q-line-btn[data-line] button[data-last]'), end, id);
		} else if (Canvas[id].isMulti) {
			lineAnswerLoop(start, end, id);
			$(el).find('[data-multi]').each(function () {
				var multiArr = $(this).data('line').split(',');
				for (var i = 0; i < multiArr.length; i++) {
					var endTarget = $(el).find('[data-line="' + multiArr[i] + '"]');
					endBtn = endTarget.children('button');
					Canvas[id].moveLine($(this).children('button'), endBtn, '#003cff');
				}
			});
		} else {
			lineAnswerLoop(start, end, id);
		}


		$(el).find('.q-line-btn').addClass('line-done');
	}

	function lineDraw(id) {
		var o = $('#' + id);
		var btn = o.find('.q-line-btn');
		var canvas = document.getElementById(o.find('canvas').attr('id'));
		var startBtn, endBtn, multiAnswer;

		sizeSet(o, canvas);
		Canvas[id] = new CANVAS();
		Canvas[id].ctx = canvas.getContext("2d");
		Canvas[id].parent = o;
		Canvas[id].isCross = o.find('.line-cross').length;
		Canvas[id].isMulti = o.data('multi-line');
		Canvas[id].chkAnswer = Canvas[id].isMulti ? Canvas[id].isMulti : o.find('.line-from .q-line-btn[data-line]').length;

		!o.is(':visible') && o.addClass('hidden');

		if (Canvas[id].isCross) {
			o.find('.line-from .q-line-btn[data-line]').each(function () {
				this.dataset.remain = o.find('[data-line="' + this.dataset.line + '"]').length - 1;
			});
		}

		btn.on('click', function (e) {
			var t = $(this);
			var parent = t.closest(Canvas[id].line);
			o = t.parents('.draw-line');

			if (t.hasClass('line-done')) return false;

			parent.hasClass('disabled') && Canvas[id].lineReset();

			function btnLineDraw(startBtn, endBtn) {
				Canvas[id].moveLine(startBtn, endBtn);
				Canvas[id].lineReset();
				endBtn = startBtn = '';
			}

			if (!o.hasClass('drawing')) {
				startBtn = t.children('button');
				o.addClass('drawing');
				t.addClass('line-start');
				parent.addClass('disabled');
			} else if (Canvas[id].isCross) {
				var startParent = startBtn.parents('[data-refuse]');
				var endParent = t.parents('[data-refuse]');
				var endData = t.data('line');

				endBtn = startParent.hasClass('line-to') ? t.children('button[data-last]') : t.children('button[data-first]');

				if (startParent.hasClass('line-cross')) {
					startBtn = endParent.hasClass('line-from') ? startBtn.filter('[data-first]') : startBtn.filter('[data-last]');
				}

				if (startParent.attr('class').indexOf(endParent.data('refuse')) !== -1 ||
					startBtn.hasClass('done') || endBtn.hasClass('done')) {
					Canvas[id].lineReset();
					return false;
				}

				btnLineDraw(startBtn, endBtn);
				startBtn.addClass('done');
				endBtn.addClass('done');

				btn.each(function (i, el) {
					if ($(el).find('button').length === $(el).find('.done').length) $(el).addClass('line-done');
				});

				if (endData && $(startBtn).parent().data('line') === endData) {
					var lineData = o.find('.line-from [data-line="' + endData + '"]').data('remain');
					o.find('.line-from [data-line="' + endData + '"]').data('remain', --lineData);
					!lineData && Canvas[id].chkAnswer--;
				}
			} else if (Canvas[id].isMulti) {
				var limit = o.data('multi-limit');
				var prop;
				endBtn = t.children('button');
				btnLineDraw(startBtn, endBtn);

				function multiChk(el, el2) {
					var refuse = el.data('refuse') || [];
					if (refuse.indexOf(el2.attr('id')) === -1) {
						refuse.push(el2.attr('id'));
						var done = el.data('done') || 0;
						el.data('refuse', refuse);
						el.data('done', ++done);
						done === limit && el.addClass('line-done');
						return prop = true;
					} else {
						Canvas[id].lineReset();
						return prop = false;
					}
				}

				multiChk(t, $(startBtn).parent());
				multiChk($(startBtn).parent(), t);

				if (prop) {
					var startLine = $(startBtn).parent().data('line') + '';
					var endLine = t.data('line') + '';

					(endLine.indexOf(startLine) !== -1 || startLine.indexOf(endLine) !== -1) && Canvas[id].chkAnswer--;
				}
			} else {
				endBtn = t.children('button');
				btnLineDraw(startBtn, endBtn);

				t.addClass('line-done');
				$(startBtn).parent().addClass('line-done');

				$(startBtn).parent().data('line') === t.data('line') && Canvas[id].chkAnswer--;
			}

			!Canvas[id].chkAnswer && o.addClass('active');
		});
	}

	setTimeout(function () {
		$('.draw-line').each(function () {
			lineDraw($(this).attr('id'));
		});
	}, 300);

	var tabpage = $('.tab-pane');
	if (tabpage.length) {
		$('[data-mirror-toggle="nav"]').on('shown.bs.tab', function (e) {
			var target = $(e.target.dataset.target).find('.hidden');
			if (target.length) {
				target.removeClass('hidden');
				setTimeout(function () {
					sizeSet(target, document.getElementById(target.find('canvas').attr('id')));
				}, 300);
			}
		});
	}

	$('.icon-reset[data-canvas]').on('click', function () { //리셋
		Canvas[this.dataset.canvas].clear();
	});

	$('[data-mirror-toggle=title]').click(function () {
		var target = tabpage.length ? $('.tab-pane.active').find('.draw-line') : $('.draw-line');
		var canvas = document.getElementById(target.find('canvas').attr('id'));
		var oldWidth = canvas.width;
		var oldHeight = canvas.height;
		var ratio1 = oldWidth / target.width();
		var ratio2 = oldHeight / target.height();
		var ctx = canvas.getContext('2d');

		if (ratio1 === 1 && ratio2 === 1) {
			ctx.scale(1, 1);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		} else {
			ctx.scale(ratio1, ratio2);
		}
	});
}

// 특화컨텐츠 임시
$('.last-guide-motion').on('animationend webkitAnimationEnd', function () {
	$('#sp').addClass('active');
});

$('.btn-point-group>li').click(function () {
	var num = $(this).index();
	$('.bubble-group>div').removeClass('active');
	$('.bubble-group>div .icon-act').removeClass('active');
	$('.bubble-group>div .bubble').removeClass('active');
	$('.bubble-group>div').eq(num).addClass('active');
});

/* 수학분수 */
$('.fraction-auto').each(function () {
	var ftext = $(this).text();
	var f_arr = ftext.split('/');
	var write_text = "<span>" + f_arr[0] + "</span><br/><span>" + f_arr[1] + "</span>"
	$(this).html(write_text);
});

// 국어
$('.assessment [data-mirror-toggle=choice]').change(function () {
	var t = $(this);
	if (t.prop('checked')) {
		t.parent('label').addClass('active').siblings().removeClass('active');
	}
});
