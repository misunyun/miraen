// page 
function pageMove(id,delay){
	if(delay===undefined){
		delay = 0;
	}
	setTimeout(function(){
		window.location.href = id+'.xhtml'
	},delay);
}

// url 처리 
// 임시 
var tabId = 0;
if(tabId){
	$('.tab>li:nth-child('+tabId+')>button').click();
}

jQuery(function($){
	'use strict';
	// table
	$('.tb [rowspan]').each(function(){
		var t = $(this),
			p = t.parent(),
			spanCount = Number(p.index())+Number(t.attr('rowspan'))+1;
		// 옆에 있는 애들
		p.nextUntil(':nth-child('+spanCount+')').children(':first-child').addClass('colspan-first');
		// 마지막 애들
		if(!p.nextUntil(':nth-child('+spanCount+')').next().length){
			t.addClass('colspan-last');
		}
	});
	// tab
	$('.tab li:first-child button,.bx-btn-answer li:first-child,.tab-pane:first-child').addClass('active');
	$('.top-bar [data-toggle=tab]').on('shown.bs.tab',function(){
		var t = $(this),
			i = t.parent().index();
		$('.bx-btn-answer').children().eq(i).addClass('active').siblings().removeClass('active');
	});

	// modal
	$('[data-toggle*=modal-show]').click(function(){
		var t = $(this),
			target = t.data('target');
		$(target).modal('show');
	});
	$('[data-toggle*=modal-hide]').click(function(){
		var t = $(this),
			target = t.closest('.modal');
		$(target).modal('hide');
	});

	/* 문제형 */
	// 이미기 보이기
	$('[data-toggle*=img-change]').click(function(){
		var t = $(this),
			target = t.data('target');
		$(target).toggleClass('active');
	});
	// 단답형
	$('[data-toggle*=short-answer]').click(function(){
		var t = $(this),
			group = t.data('group');
		if(group){
			$(group).toggleClass('active').find('[data-toggle*=short-answer]').toggleClass('active').end().find('[data-invisible]').toggleClass('active');
		} else {
			t.toggleClass('active');
		}
	});
	// 선택형
	$('.choice input').click(function(){
		var t = $(this),
			o = t.closest('.choice');
		if(t.attr('type')==='checkbox'){
			if(o.hasClass('active')){
				o.removeClass('active').find('input').prop('checked', false);
			} else if(o.find('[data-answer]').length===o.find('[data-answer]:checked').length){
				o.addClass('active');
			}
		} else {
			if(o.hasClass('active')){
				o.removeClass('active').find('input').prop('checked', false);
			} else {
				o.addClass('active');
			}
		}
	});
	
	/* 수학 */
	// 각도기
	$('[data-toggle=aid-protractor]').click(function(){
		var t = $(this),
			target = t.data('target');
		$(target).toggleClass('active');
	});

	/* 정답 */
	// 전체 정답
	$('[data-toggle=answer-all]').click(function(){
		var t = $(this),
			targetObj = $(t.data('target'));
		if(!t.data('target')){
			targetObj = $('#wrap');
		}
		t.toggleClass('active');
		if(t.hasClass('active')){
			targetObj.find('input[data-answer]').prop('checked',true);
			targetObj.find('.choice,.choice-yn,[data-toggle*=short-answer],.img-change,.protractor,[data-invisible]').addClass('active');
		} else {
			targetObj.find('input').prop('checked',false);
			targetObj.find('.choice,.choice-yn,[data-toggle*=short-answer],.img-change,.protractor,[data-invisible]').removeClass('active');
		}
	});
	// 정답에 다 되었는지 실시간 체크 
	$('.choice,.choice-yn,[data-toggle*=short-answer],[data-toggle*=img-change],[data-toggle=aid-protractor]:not([data-standalone])').click(function(){
		var targetObj = $('#wrap'),
			answerObj = $('.bx-btn-answer>.active');
		if($('.tab').length){
			targetObj = $('#ct>.tab-content>.active');
		}
		if(targetObj.find('.swiper-q').length){
			targetObj = targetObj.find('.swiper-slide-active');
			//answerObj = answerObj.find('.active');
		}
		if(targetObj.find('.content-vertical').length){
			targetObj = targetObj.find('.v-child.active');
			answerObj = answerObj.find('.active');
		}
		if(targetObj.find('.answer-steps-group').length){
			targetObj = targetObj.find('.a-steps-child');  
		}
		// 조건 : 모든 답이 체크되어야 
		var q = targetObj.find('.choice [data-answer],.choice-yn,[data-toggle*=short-answer]:not([data-group]),[data-group-parent],.img-change,.protractor'),
			qNum = q.length,
			aNum = q.filter('input[data-answer]:checked').length+q.find('.choice-yn').length+targetObj.find('[data-toggle*=short-answer].active:not([data-group])').length+targetObj.find('[data-group-parent].active').length+targetObj.find('.img-change.active').length+targetObj.find('.protractor.active').length; 
		if(qNum===aNum){
			answerObj.find('[data-toggle=answer-all]:not(.active)').click();
		} else {
			answerObj.find('[data-toggle=answer-all].active').removeClass('active');
		}
		if(aNum>0){
			targetObj.find('[data-invisible=any-answer]').addClass('active');
		} else {
			targetObj.find('[data-invisible=any-answer]').removeClass('active');
		}
	});

	/* 드래그 액션 */


	/* 스와이프 */
	// 1. 스와이프 문제형 swiper-q
	var swipeQ, swipeBasic, swipeModal = [];
	$('.swiper-q').each(function(i){
		var t = $(this);
		swipeQ[i] = new Swiper(t,{
			observer: true,
			observeParents:true,
			pagination:{
				el:t.find('.swiper-pagination'),
				clickable:true,
			},
			navigation:{
				nextEl:t.find('.swiper-button-next'),
				prevEl:t.find('.swiper-button-prev'),
			},
			// 슬라이드시 정답처리
			on:{
				slideChange:function(){
					$('.bx-btn-answer').children().eq(this.activeIndex).addClass('active').siblings().removeClass('active');
				},
			},
		});
	});
	// 2. 스와이프 슬라이드 형 .slide
	$('.slide .swiper-container').each(function(i){
		var t = $(this);
		swipeBasic[i] = new Swiper(t,{
			observer: true,
			observeParents:true,
			pagination:{
				el:t.find('.swiper-pagination'),
				clickable:true,
			},
			navigation:{
				nextEl:t.parent().find('.swiper-button-next'),
				prevEl:t.parent().find('.swiper-button-prev'),
			},
			on:{
				init:function(){
					setTimeout(function(){
						t.find('.swiper-slide').each(function(i){
							t.find('.swiper-pagination-bullet').eq(i).html('<img src="'+$(this).find('img').attr('src')+'" alt="" />');
						});
					},500);
				},
			},
		});
	});
	// 3. 스와이프 모달 형 .slide-pn-dot
	$('.slide-pn-dot .swiper-container').each(function(i){
		var t = $(this);
		swipeModal[i] = new Swiper(t,{
			observer: true,
			observeParents:true,
			pagination:{
				el:t.find('.swiper-pagination'),
				clickable:true,
			},
			navigation:{
				nextEl:t.parent().find('.swiper-button-next'),
				prevEl:t.parent().find('.swiper-button-prev'),
			},
		});
	});
	// 스와이프 모달 형 버튼 
	$('.btn-modal-swipe').click(function(){
		var $t = $(this),
			$target = $($t.parent().data('target')),
			swipeIndex = $t.parent().data('parent'),
			index = $t.index();
		swipeModal[swipeIndex].slideTo(index);
		$target.modal('show');
	});
});
