jQuery(function($){
	'use strict';

	var $audio = $('audio'),
		sound_o = "../images/sound-o.mp3",
		sound_x = "../images/sound-x.mp3",
		btn = $('.btn-drop-answer');

	$('.drag-item').draggable({
		helper: 'clone',
		revert: 'invalid',
		revertDuration: 100,
		containment: '#tab1',
		appendTo: '.dropzone',
		start: function(){
			$(this).addClass('dragging');
			btn.removeClass('active');
		},
		stop: function(){
			$(this).removeClass('dragging');
		},
	});

	$('.drop-box').droppable({
		drop: function(e, ui){
			var $t = $(this),
				$drag = $(ui.draggable),
				standardLeft = $t.data('drop') === 'drop1' ? $t.width() - $drag.width() : this.offsetLeft,
				pos = {
					top: $drag.data("uiDraggable").position.top < -25 ? -25 : $drag.data("uiDraggable").position.top,
					left: $drag.data("uiDraggable").position.left
				}

			if(($t.data('drop') === 'drop1' && pos.left > standardLeft) || ($t.data('drop') === 'drop2' && pos.left < standardLeft)){
				pos.left = standardLeft;
			}

			if($drag.hasClass('drag-item-clone')){
				$t.append($drag);
				$drag.css(pos);
			}else{
				var newDrag = ui.draggable.clone();
				$t.append(newDrag);
				$drag.addClass('dropped');
				newDrag.removeClass('dragging').addClass('drag-item-clone').css(pos).draggable({
					revert: 'invalid',
					revertDuration: 100,
					containment: '#tab1',
					appendTo: '.dropzone',
					start: function(){
						btn.removeClass('active');
					}
				});
			}
		}
	});

	btn.click(function(){
		var t = $(this),
			$drop1 = $('.drop-box[data-drop="drop1"]').find('[data-drop="drop1"]').length === 3,
			$drop2 = $('.drop-box[data-drop="drop2"]').find('[data-drop="drop2"]').length === 3,
			prop = $drop1 && $drop2,
			sound = prop ? sound_o : sound_x;

		if(t.hasClass('active')){
			$(this).removeClass('active');
			$('.drop-box').find('.drag-item').remove();
			$('.dropped').removeClass('dropped');
		}else{
			checkEffect($audio, sound, '#tab1', prop);
		}
	});

	$(document).on('animationend webkitAnimationEnd', '.drop-true, .drop-false', function(){
		$(this).remove();
		if($('.dropzone').find('.drag-item').length){
			btn.addClass('active');
		}
	});
});
