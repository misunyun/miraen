
var app = {
	is_mirroring_mode: function () {
		// TODO: 나중에 변경 필요
		return true;
	},
	close_study_tools: function () {
		$("#iframe_tools").attr('src', '');
		$("#iframe_tools").hide();
		$("#iframe_tools_bg").hide();
		$(".icon-prev-content").show();
		$(".icon-next-content").show();

		current_content_type = get_current_content_type();
		console.log("1: current_content_type >> ", current_content_type);

		if (current_content_type == 'smartppt' || current_content_type == 'popup') {
			setTimeout(function () {
				console.log("2: viewer._playlist_data.info.type >> ", viewer._playlist_data.info.type);
				// 수학 /사회일 경우 설정 - 콘텐츠 화면 비율을 채우기에서 비율 맞추기로 수정
				if ((viewer._playlist_data.info.type == 'SO' || viewer._playlist_data.info.type == 'MA' || viewer._playlist_data.info.type == 'SC') && viewer.user_selected_ratio == false) {
					$('#screen-ratio-fill').parent().removeClass('active');
					viewer.settingRatioFit();
				} else if ((viewer._playlist_data.info.type == 'KOA') && viewer.user_selected_ratio == false) {
					$('#screen-ratio-fit').parent().removeClass('active');
					viewer.settingRatioFill();
				}

				$(".drawing-canvas-wrapper").removeClass('hidden');
				$(".drawing-canvas-wrapper").show();
				viewer.resize();
			}, 500);
		}

		// 특화자료 열려있는 상태에서 수업도구 닫았을 때 좌우 페이지 이동 버튼 숨김
		if ($('#iframe_content_pairbook').attr('src') || $('#module-modal').hasClass('show')) {
			$(".icon-prev-content").hide();
			$(".icon-next-content").hide();
		}

		// eBook이 열려있는 상태에서 수업도구 닫으면 버튼 및 타이틀 바 보여주고 세팅 변경하기
		if (CURRICULUM_CODE == 'AUTH' && $('#iframe_content_pairbook').attr('src').indexOf('ebookpair.html')>-1) {
			ebook.move_button_show();
			$(".popup.tools").css('z-index', '21');
		};
	},
	show_study_tool: function (tool_id) {
		var url = undefined;

		switch (tool_id) {
			case "tool-study-1":
				url = "/assets/viewer/tools/board/index.html";
				break;
			case "tool-study-2":
				url = "/assets/viewer/tools/stopwatch/index.html";
				break;
			case "tool-study-3":
				url = "/assets/viewer/tools/blackmode/index.html";
				break;
			case "tool-study-4":
				url = "/assets/viewer/tools/attention/index.html";
				break;
			case "tool-study-5":
				url = "/assets/viewer/tools/activity/index.html";
				break;
			case "tool-study-6":
				url = "/assets/viewer/tools/collectivemake/index.html";
				break;
			default:
				show_alert("준비중입니다.");
				return false;
		};

		// 수업도구 선택 후 active 제거
		$('.icon-tool6').parent('button').removeClass('active');
		$('#tool-study').removeClass('active');

		// ebook용 페이지 이동 버튼 숨김
		ebook.move_button_hide();
		$(".popup.tools").css('z-index', '0');

		// 수업도구 선택 후 설정 - 콘텐츠 화면 비율 채우기로 변경
		viewer.settingRatioFill();

		// mirroring_mode
		if (this.is_mirroring_mode()) {
			viewer.load_iframe_by_url(url, $("#iframe_tools"), $("#viewer-content"));
		} else {
			window.open(url, tool_id, 'height=' + screen.height + ',width=' + screen.width + ',fullscreen=yes');
		}
		return true;
	},

	move_to_prev: function () {
		var type = viewer.move_to_prev();
		if (type == 'pop') {
			//$("#iframe_content").hide();
			viewer.hide_iframe_content();
			$(".popup.tools").show();
			$("#iframe_content_pairbook").show();
		} else {
			$("#iframe_content").show();
			$(".popup.tools").hide();
			$("#iframe_content_pairbook").hide();
			$("#iframe_content_pairbook").attr('src', '');
			$(".icon-prev-content").show();
			$(".icon-next-content").show();
		}
		app.close_study_tools();
	},
	move_to_next: function () {
		var type = viewer.move_to_next();
		if (type == 'pop') {
			// $("#iframe_content").hide();
			viewer.hide_iframe_content();
			$(".popup.tools").show();
			$("#iframe_content_pairbook").show();
		} else {
			$("#iframe_content").show();
			$(".popup.tools").hide();
			$("#iframe_content_pairbook").hide();
			$("#iframe_content_pairbook").attr('src', '');
		}
		app.close_study_tools();
	},
	move_to_subject: function (obj) {
		viewer.load_smartppt(obj);
		$("#iframe_content").show();
		$(".popup.tools").hide();
		$("#iframe_content_pairbook").hide();
		$("#iframe_content_pairbook").attr('src', '');
		$(".icon-prev-content").show();
		$(".icon-next-content").show();
	},
	move_to_subject_by_id: function (obj_id, type) {

		viewer.load_smartppt_by_id(obj_id);
		if (type == 'pop') {
			//$("#iframe_content").hide();
			viewer.hide_iframe_content();
			$(".popup.tools").show();
			$("#iframe_content_pairbook").show();
		} else {
			$("#iframe_content").show();
			$(".popup.tools").hide();
			$("#iframe_content_pairbook").hide();
			$("#iframe_content_pairbook").attr('src', '');
			$(".icon-prev-content").show();
			$(".icon-next-content").show();
			// bookmark
//			var _id = { 'id': obj_id };
//			viewer.get_bookmark_data(viewer._playlist_id, _id);
		}
		app.close_study_tools();
	},
	close_popup_content: function () {
		$("#iframe_content").show();
		$(".popup.tools").hide();
		$("#iframe_content_pairbook").hide();
		$("#iframe_content_pairbook").attr('src', '');

		app.close_study_tools();
		viewer.pop_close_prev();

		// ebook 닫기일 경우 처리해주어야 하는 것들...
		var titlebar_check = $('.popup.tools').children().hasClass('ebook_change_btn');
		console.log('titlebar_check :', titlebar_check);

		if (titlebar_check) {
			ebook.move_button_hide();

			if ($("#math-tool").hasClass('active')) {
				$("#math-tool").removeClass('active');
				$("#math_tool_btn").removeClass('active');
			};
			// 교과서 볼 때는 안 보이도록 한 것을 다시 보이도록 변경
			$('.icon-aside-open-txt').css('display', 'block');
			$('#module-modal').css('display', 'none');
			$('#iframe_content_pairbook').css('display', 'none');

			// $('#math-tool #math-tool-4').parent().show();
			$('#math_tool_btn').show();

			// mirroring.api_sync_obj({
			// 	target: "ebook",
			// 	script: "ebook.move_button_hide();"
			// });
		}

		current_content_type = get_current_content_type();
		console.log('close_popup_content ', current_content_type);

		if (current_content_type == 'smartppt') {

			if (iframe_canvas) {
				iframe_canvas.destroy();
				iframe_canvas = undefined;

				var _container = $("#viewer-content .drawing-canvas").get(0);

				iframe_canvas = new DrawingCanvas({
					container: _container,
				});
			}

			var realplaylist = _.filter(viewer._playlist_data.playlist, function (item) {
				return item.url != '#';
			});

			var curpage = viewer._current_page;
			var current_id = viewer._playing.id;
			var currentindex = _.findIndex(realplaylist, function (item) {
				return item.id == current_id;
			});
			if (currentindex >= 0) {
				curpage = currentindex + 1;
			}

			var page = curpage;
			var plying_id = viewer._playlist_id;
			var playlist = viewer._playing.id;
			var user_id = viewer._queryParams.user;
			var type = 'DRAW';
			var thumbnail = viewer._playing.thumbnail;
			var info_title = viewer._playlist_data.info.title;

			// var playlist_title = viewer._playing.title;

			// 주제명이 없으면 코너명으로 대체
			var playlist_title;

			if (viewer._playing.title == '' || viewer._playing.title == null) {
				playlist_title = viewer._playing.corner;
			} else {
				playlist_title = viewer._playing.title;
			};

			var mode = '';

			if (viewer._playlist_data.info.modalDiv == undefined) {
				mode = "DEFAULT";
			} else {
				mode = viewer._playlist_data.info.modalDiv;
			};

			setTimeout(function () {
				canvas_save_load.get_canvas_data(iframe_canvas);
				// viewer의 canvas 저장을 위해 data 보내기
				canvas_save_load.get_page_data(plying_id, playlist, user_id, thumbnail, info_title, playlist_title, page, mode);
				// 저장된 그림이 있으면 로드
				canvas_save_load.canvas_load(plying_id, playlist, user_id, type, mode);
				viewer.resize();
			}, 500);
			iframe_canvas.fitStage();
		}
		// if (DEVICE_TYPE == 'mobile') {
		// 	viewer.update_viewer_current_info();
		// }

		viewer.resize();
	},
	show_room_list: function () {

		// mirroring.api_room_list()
		// 	.then(function (res) {
		// 		$("#controllList").html("");
		// 		console.log('res', res);
		// 		res.data.forEach(function (item) {
		// 			var roomid = item.roomid;
		// 			var $li_el = $("<li></li>");
		// 			var $a_el = $("<a class='room'></a>");
		// 			$a_el.html(roomid);
		// 			if (item.lesson) {
		// 				$a_el.html("<span class='icon'></span><span class='title'>" + item.lesson.title + "</span>");
		// 			}
		// 			$a_el.data(item);
		// 			$li_el.append($a_el);
		// 			$("#controllList").append($li_el);
		// 		});
		// 	});
	},

	join_room: function (item) {
		// mirroring.api_join_room(item)
		// 	.then(function (res) {
		// 		console.log(res);
		// 		$("#btnCloseControll").click();
		//
		// 		if (item.lesson) {
		// 			viewer.browse_period(item.lesson.playlist, item.lesson.start);
		// 		}
		//
		// 	})
		// 	.catch(function (err) {
		// 		console.error(err);
		// 		show_error_message(err);
		// 	})
	},
	first_make_textarea: function () {
		drawing_canvas.first_make_textarea = false;
	},
	select_stroke_color: function (target) {
		$('#palette').children('.palette').removeClass('active');
		$('#palette button[data-color="' + target + '"]').addClass('active');

		drawing_canvas.drawLineStroke_change(target);
	},
	select_stroke_width: function (target) {
		$('.stroke_width_wrap').children('.drawing_stroke_width').children('i').removeClass('active');
		$('.stroke_width_wrap button[data-strokewidth="' + target + '"] i').addClass('active');

		drawing_canvas.strokeWidth = target;
	},
	// 그리기 모드, 지우개 모드 변경
	drawing_mode_change: function (mode) {
		if (drawing_canvas.drawingLayer.attrs.visible == false) {
			$('.icon-drawing6').addClass('active');
		} else if (drawing_canvas.drawingLayer.attrs.visible == true || drawing_canvas.drawingLayer.attrs.visible == undefined) {
			$('.icon-drawing6').removeClass('active');
		};

		if (drawing_canvas.drawingLayer.attrs.visible != undefined)
			drawing_canvas.transformer_destroy();

		if (mode == 'brush') {
			drawing_canvas.activateBrush();
			drawing_canvas.transformer_destroy();
		} else if (mode == 'eraser') {
			drawing_canvas.activateEraser();
		}

		// drawing_canvas.mode = mode;
	},
	delete_drawing: function (target_layer) {
		if (target_layer == 'drawing') {
			drawing_canvas.clear();
		} else if (target_layer == 'text') {
			drawing_canvas.text_clear();
		} else if (target_layer == 'image') {
			drawing_canvas.image_clear();
		}
	},
	hide_drawing: function (targer_layer) {
		drawing_canvas.hide(targer_layer);
	},
	show_drawing: function (targer_layer) {
		drawing_canvas.show(targer_layer);
	},
	mode_change: function (target) {
		drawing_canvas.transformer_destroy();
		drawing_canvas.setMode(target);

		// text node가 없을 경우 생성
		if (target == 'text') {
			drawing_canvas.board_start();
		}
	},
	text_write: function () {
		drawing_canvas.textwrite();
		drawing_canvas.last_textNode_dblclick();
	},
	text_fontFamily_change: function (fontFamily) {
		drawing_canvas.text_fontFamily_change(fontFamily);
	},
	text_font_size_change: function (size) {
		drawing_canvas.text_fontSize_change(size);
	},
	text_font_size_lg: function (fontSizeChange) {
		$('#font_size').val(fontSizeChange).attr("selected", "selected");
		drawing_canvas.text_font_size_lg(fontSizeChange);
	},
	text_font_size_sm: function (fontSizeChange) {
		$('#font_size').val(fontSizeChange).attr("selected", "selected");
		drawing_canvas.text_font_size_sm(fontSizeChange);
	},
	text_font_fill: function (color) {
		$('.font_color_wrap').children('.font_palette').children('i').removeClass('active');
		$('.font_color_wrap button[data-fontcolor="' + color + '"] i').addClass('active');
		// 하단 색상 변경하기
		$('.fc_change').css('background-color', color);
		if (color == '#ffffff') {
			$('.fc_change').css('border', '1px solid #666');
		} else {
			$('.fc_change').css('border', 'none');
		};

		drawing_canvas.text_font_fill(color);
	},
	select_arrow_color: function (color) {
		$('.arrow_color_wrap').children('.arrow_palette').removeClass('active');
		$('.arrow_color_wrap button[data-arrowcolor="' + color + '"]').addClass('active');
		// 아이콘 색상 변경하기
		$('.icon-arrow-color').css('background-color', color);
		if (color == '#ffffff') {
			$('.icon-arrow-color').css('border', '2px solid #d5d5d5');
		} else {
			$('.icon-arrow-color').css('border', 'none');
		};

		drawing_canvas.arrow_color_change(color);
	},
	select_arrow_width: function (width) {
		drawing_canvas.arrow_width_change(width);
	},
	select_arrow_dash: function (dash) {
		drawing_canvas.arrow_dash_change(dash);
	},
	select_arrow_direction: function (direction) {
		drawing_canvas.arrow_direction_change(direction);
	},
	select_line_color: function (color) {
		$('.line_color_wrap').children('.line_palette').removeClass('active');
		$('.line_color_wrap button[data-linecolor="' + color + '"]').addClass('active');
		// 아이콘 색상 변경하기
		$('.icon-line-color').css('background-color', color);

		if (color == '#ffffff') {
			$('.icon-line-color').css('border', '2px solid #d5d5d5');
		} else {
			$('.icon-line-color').css('border', 'none');
		};
		drawing_canvas.line_color_change(color);
	},
	select_line_width: function (width) {
		drawing_canvas.line_width_change(width);
	},
	select_line_dash: function (dash) {
		drawing_canvas.line_dash_change(dash);
	},
	// 형광펜 그리기 모드, 형광펜 지우개 모드 변경
	drawing_hlighter_mode_change: function (mode) {
		drawing_canvas.transformer_destroy();
		drawing_canvas.setMode(mode);
	},
	select_hlighter_color: function (target) {
		$('#image_select').children('.hlighter_wrap').children('.select_hlighter_color_wrap').children('button').removeClass('active');
		$('#image_select button[data-hlightercolor="' + target + '"]').addClass('active');
		$('.icon-hlighter-color').css('background-color', target);

		if (target == '#ffffff') {
			$('.icon-hlighter-color').css('border', '2px solid #d5d5d5');
		} else {
			$('.icon-hlighter-color').css('border', 'none');
		};

		drawing_canvas.select_change_hlighter_color(target);
	},
	select_hlighter_width: function (width) {
		drawing_canvas.select_change_hlighter_width(width);
	},
	stop_drawHlighter: function () {
		drawing_canvas.setMode('image');
		drawing_canvas.stop_drawHlighter();
	},
	make_sticker: function (url) {
		drawing_canvas.setMode('image');
		drawing_canvas.stop_drawHlighter();
		// drawing_canvas.make_sticker(url);
		drawing_canvas.drawImage(url);
	},
	set_listening: function (target) {
		drawing_canvas.set_listening(target)
	},
	create_set_square: function () {
		drawing_canvas.create_set_square()
	},
	create_protractor: function () {
		drawing_canvas.create_protractor();
	},
	create_ruler: function () {
		drawing_canvas.create_ruler();
	}
};