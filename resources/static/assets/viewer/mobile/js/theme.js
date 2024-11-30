jQuery(function($){
	'use strict';
	//tab prev-next
	var tablen = $('ul.tab>li').length;
	if(tablen){
		$('#ct').append('<div class="tab-button"><button type="button" class="swiper-button-prev swiper-button-disabled"></button><button type="button" id="tab-btn-next" class="swiper-button-next"></button></div>');
	}
	$('div.tab-button>button').on('click',function(){
		var o = $('ul.tab .active').parent().next().children();
		if($(this).hasClass('swiper-button-prev')){
			o = $('ul.tab .active').parent().prev().children();
		}
		$(o).tab('show');
	});
	$('.top-bar [data-toggle=tab]').on('shown.bs.tab',function(e){
		$('div.tab-button>button').removeClass('swiper-button-disabled');
		if($(e.target).parent().index()===0){
			$('div.tab-button>.swiper-button-prev').addClass('swiper-button-disabled');
		} else if($(e.target).parent().index()+1===tablen){
			$('div.tab-button>.swiper-button-next').addClass('swiper-button-disabled');
		}
	});

	// scroll
	$(".content").each(function(){
		var t = $(this);
		t.prepend('<button type="button" class="icon-on-top">최상단으로 가기</button>')
		.mCustomScrollbar({
			theme:"rounded-dark",
			scrollInertia:100,
			scrollEasing:"linear",
		});
	});
	$(".icon-on-top").on('click',function(){
		var t = $(this),
			targetObj =  t.data('target') ;
		$(targetObj).mCustomScrollbar("scrollTo","top");
	});


	// dragdrop
	var dragdrop = {
		init: function (){
			this.audio = $('audio');
			this.sound_o = "../images/sound-o.mp3";
			this.sound_x = "../images/sound-x.mp3";
			this.droptype = $('[data-drop-type]').data('drop-type');
			this.bindEvents();
		},
		bindEvents: function (){
			$('.drag-item').draggable({
				helper: $('[data-helper]').data('helper'),
				revert: function(){
					if(!$(this).data('hasBeenDropped')){
						return true;
					}
				},
				revertDuration: 100,
				containment: $('[data-containment]').data('containment') || '#wrap',
				start: function(){
					$(this).addClass('dragging');
				},
				stop: function(){
					$(this).removeClass('dragging');
				},
				create: function(){
					var $t = $(this);
					$t.data('originalPosition',{
						top: $t.css('top'),
						left: $t.css('left')
					});
				},
			});

			$('.drop-box').droppable({
				drop: function(e, ui){
					var $t = dragdrop.drop = $(this),
						dragitem = dragdrop.drag = $(ui.draggable),
						prop = $t.data('drop') === dragitem.data('drop'),
						sound = prop ? dragdrop.sound_o : dragdrop.sound_x,
						item = $t.data('item');

					!item && (item = 0);

					dragitem.data({
						'hasBeenDropped': prop,
						'originalPosition': dragitem.data("uiDraggable").originalPosition
					});

					checkEffect(dragdrop.audio, sound, $t, prop);

					if(prop){
						dragitem.addClass('dropped');
						$t.data('item', ++item);
						dragdrop[dragdrop.droptype]();
					}
				}
			});

			$(document).on('animationend webkitAnimationEnd', '.drop-true, .drop-false', function(){
				$(this).remove();
			});

			$('[data-answer-type="dragdrop"]').click(function(){
				var $t = $(this),
					$target = $($t.data('target'));

				if(!$t.hasClass('active')){
					$target.removeClass('disabled');
					$target.find('.drop-box').droppable('option', 'disabled', false).removeClass('animated').data('target', '');
					$target.find('.drag-item').removeClass('dropped').each(function(){
						var $item = $(this);
						$item.data('hasBeenDropped', '').css({
							top: $item.data('originalPosition').top,
							left: $item.data('originalPosition').left,
						});
					});
					dragdrop.initNum = 0;
					$target.find('.dropbox').empty();
				}else{
					$target.addClass('disabled');
				}
			});
		},
		basket: function(e, ui){
			dragdrop.drop.data('item') === dragdrop.drop.data('full') && dragdrop.drop.addClass('animated').data('target', dragdrop.drop);
		},
		onetoone: function(e, ui){
			var parent = dragdrop.drop.parent(),
				remain = parent.data('remain');

			if(!remain){
				remain = parent.children().length;
			}

			dragdrop.drop.find('.dropbox').append(dragdrop.drag.children().clone());
			dragdrop.drop.droppable('option', 'disabled', true);
			parent.data('remain', remain-1);
			!(remain-1) && $('[data-target="'+parent.data("reset-target")+'"]').addClass('active');
		}
	}

	$('[data-drop-type]').length && dragdrop.init();
});

var checkEffect = function(audio, sound, target, prop){
	$(target).append('<i class="drop-'+prop+'"></i>');
	audio.find('source').attr('src', sound);
	audio[0].pause();
	audio[0].load();
	audio[0].oncanplaythrough = audio[0].play();
}
