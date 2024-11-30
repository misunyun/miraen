
let ui = {

	/**
	 * 내부 전역변수
	 *
	 * @memberOf screen
	 */
	val: {
	},

	// 시간으로 로그아웃 처리
	sessionTimeout: function() {
		$.sessionTimeout({
			title: '세션 시간 초과 알림',
			message: '장시간 사용안해 로그아웃 합니다.',
			keepAliveUrl: contextPath + '/login_keep',
			redirUrl: contextPath + '/logout.do?p=' + encodeURIComponent($(location).attr('href')),
			logoutUrl: contextPath + '/logout',
			warnAfter: 1000 * 60 * 120, 			// 120분
			redirAfter: 1000 * 60 * 120 + 30000, // 30초 후에 로그아웃,
			ignoreUserActivity: true,
			countdownMessage: '남은시간 {timer}.',
			countdownBar: true
		});
	},

	// 달력
	datePicker: {

		/**
		 * $datePicker.date
		 * 날짜(단일)
		 *
		 * @param {String} id			업로드 id 	'#id'
		 * @param {String} d			날짜value	'2021-01-01'
		 * @param {Bool} autoUpdate 	자동완성	true, false
		 * @param {Function} callback 	콜백 함수	function
		 */
		date: function(id, d, autoUpdate, callback) {

			$(id).val(d).attr('maxlength', 10);

			// 클릭시 자동완성
			$(id).keyup(function(key) {
				let str = $(id).val().trim();
				$(id).val($text.autoDate(str));
				if ($(id).val().length > 7) {
					var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
					if (!regex.test($(id).val())) {
						$(id).val($date.getToday());
						$msg.toastr(lng.date.InvalidDateFormat, 'warning');
					}
				}
			});

			// 자동업데이트 기본 true
			autoUpdate = (autoUpdate == false) ? false : true;
			$(id).val(d);
			$(id).datepicker({
				autoclose: autoUpdate,
				language: 'ko',
				orientation: 'auto',
				format: "yyyy-mm-dd",
			}).on('changeDate', function(e) {
				if (callback != undefined) {
					return callback(moment(e.date).format('YYYY-MM-DD'));
				}
			});

		},

		/**
		 * $datePicker.time
		 * 시간 / 분(단일)
		 *
		 * @param {String} id			업로드 id 	'#id'
		 * @param {String} d			날짜value	'2021-01-01'
		 * @param {Bool} autoUpdate 	자동완성	true, false
		 * @param {Function} callback 	콜백 함수	function
		 */
		time: function(id, d) {

			$(id).val(d).attr('maxlength', 5);
			$(id).timepicker({
			    timeFormat: 'HH:mm',
			    interval: 10,
			    // minTime: '08:00',
			    // maxTime: '20:00',
			    // defaultTime: new Date(0,0,0,0,0,0),
			    startTime: new Date(0,0,0,0,0,0),
			    dynamic: true,
			    dropdown: true,
			    // scrollbar: true
			});
		},

		/**
		 * $datePicker.setDate
		 * 날짜 값 넣기
		 *
		 * @param {String} id			업로드 id 	'#id'
		 * @param {String} d			날짜value		'2021-01-01'
		 */
		setDate: function(id, d) {
			$(id).datepicker('update', d);
		},

		/**
		 * $datePicker.month
		 * 월력
		 *
		 * @param {String} id			업로드 id 		'#id'
		 * @param {String} d			날짜value		'2021-01'
		 * @param {String} callback		콜백 함수
		 */
		month: function(id, d, callback) {

			$(id).val(d).attr('maxlength', 7);

			// 클릭시 자동완성
			$(id).keyup(function(key) {
				let str = $(id).val().trim();
				$(id).val($text.autoMonth(str));
				if ($(id).val().length > 5) {
					var regex = RegExp(/^\d{4}-(0[1-9]|1[012])$/);
					if (!regex.test($(id).val())) {
						$(id).val(moment().format('YYYY-MM'));
						$msg.toastr(lng.date.InvalidDateFormat, 'warning');
					}
				}
			});

			$(id).val(d);
			$(id).datepicker({
				startView: 1,
				minViewMode: 1,
				maxViewMode: 2,
				autoclose: true,
				language: lng.system,
				format: "yyyy-mm",
			}).on('changeDate', function(e) {
				if (callback != undefined) {
					return callback(moment(e.date).format('YYYY-MM'));
				}
			});
		},

		/**
		 * $datePicker.month
		 * 년력
		 *
		 * @param {String} id			업로드 id 		'#id'
		 * @param {String} d			날짜value		'2021-01'
		 * @param {String} callback		콜백 함수
		 */
		year: function(id, d, callback) {
			$(id).val(d);
			$(id).datepicker({
				startView: 2,
				minViewMode: 2,
				maxViewMode: 2,
				autoclose: true,
				language: lng.system,
				format: "yyyy",
			}).on('changeDate', function(e) {
				if (callback != undefined) {
					return callback(moment(e.date).format('YYYY'));
				}
			});
		},

	},

	// 콤보
	combo: {
		/**
		 * 콤보 바인드
		 * $combo.bind
		 *
		 * @param {object} data			콤보 데이타
		 * @param {String} id			아이디('#id')
		 * @param {String} addRowText	추가 생성(전체, 선택)
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
			 * @param {String} modalID		모달아이디
		 */
		bind: function(data, id, addRowText, val, nmColumn, valColumn) {
			addRowText = addRowText == undefined ? '' : addRowText;
			val = val == undefined ? null : val.toString();
			nmColumn = nmColumn == undefined ? '' : nmColumn;
			valColumn = valColumn == undefined ? '' : valColumn;

			let modalID = $($(id).parents('.modal')[0]).attr('id');
			modalID = modalID == undefined ? '' : '#' + modalID;

			// 기존 데이타 삭제
			$combo.optionRemove(id);

			// 콤보 값 CSeq, Nm, Val, Txt1, Txt2, Num1, Num2
			if (nmColumn == '') nmColumn = 'comCdNm';
			if (valColumn == '') valColumn = 'comCd';

			if (addRowText.length > 0) {
				$(id).append("<option value=''>" + addRowText + "</option>");
			}

			// 데이타 바인드
			$(id).data('data', data);
			$(id).data('valcolumn', valColumn);

			// 콤보에 값 넣기
			$.each(data, function(idx, item) {
				$(id).append("<option value='" + ($text.isEmpty(item[valColumn]) ? '' : item[valColumn]) + "'>" + item[nmColumn] + "</option>");
			});
			if (val != '') {
				$(id).val(val);
			} else {
				if (addRowText == '') {
					$(id).val($(id + " option:first").val());
				}
			}

            $(id).change();

			return { done: true, name: $(id + ' option:selected').text(), val: $(id).val() };
		},


		/**
		 * 콤보 공통코드 생성
		 * $combo.common
		 *
		 * @param {String} id			아이디('#id')
		 * @param {String} masterCode	코드 마스터 코드
		 * @param {String} addRowText	추가 생성(전체, 선택)
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
		 * @param {String} searchTF		select2 상단 검색 유무(true, false)
			 * @param {String} callback		콜백 함수
		 */
		common: function(id, masterCode, addRowText, val, nmColumn, valColumn, searchTF, callback) {

			$cmm.getCmmCd(masterCode).then(function(values) {
				// result 값
				let rows = eval('values.' + masterCode);
				if (!$text.isEmpty(rows) && rows.length > 0) {
					if (callback == undefined) {
						$combo.bind(rows, id, addRowText, val, nmColumn, valColumn, searchTF);
					} else {
						return callback($combo.bind(rows, id, addRowText, val, nmColumn, valColumn, searchTF));
					}
				} else {
					$msg.alert(lng.date.noResults);
				}
			});
		},

		// 콤보 내용 삭제
		optionRemove: function(id, addRowText, val) {

			// 콤보 내용 삭제
			$(id).find('option').remove();

			// 추가할 항목 있으면 추가
			if (!$text.isEmpty(addRowText)) {

				val = $text.isEmpty(val) ? '' : val;
				$(id).append('<option value="' + val + '">' + addRowText + '</option>');
			}
		},

		/**
		 * 콤보에서 선택된 option의 값을 가져온다.
		 * $combo.common
		 *
		 * @param {String} el
		 */
		getSelectedOptionVal: function(el) {
			let data = el.data('data');						// 전체 data
			let valColumn = el.data('valcolumn');			// value 컴럼
			let selected = el.find(':selected');
			let result = null;

			// value 가 없으면 return null
			if ($text.isEmpty(selected.val())) {
				return result;
			}

			if (el[0].multiple) {
				// 멀티 select 이면
				$.each(selected, function(key, val) {

					/*let tempVal = val.dataset.val
					result.push(JSON.parse(tempVal));*/
				})
			} else {
				// single select 이면
				$.each(data, function(idx, row) {
					if (eval('row.' + valColumn) == selected.val()) result = row;
				})
			}
			return result;
		},

	},


	// Radio
	radio: {
		/**
		 * radio 바인드
		 * $radio.bind
		 *
		 * @param {object} data			콤보 데이타
		 * @param {String} id			아이디('#id')
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
			 * @param {String} modalID		모달아이디
		 */
		bind: function(data, id, val, nmColumn, valColumn) {
			val = val == undefined ? null : val.toString();
			nmColumn = nmColumn == undefined ? '' : nmColumn;
			valColumn = valColumn == undefined ? '' : valColumn;

			let modalID = $($(id).parents('.modal')[0]).attr('id');
			modalID = modalID == undefined ? '' : '#' + modalID;

			// 기존 데이타 삭제
			// $combo.optionRemove(id);

			// 콤보 값 CSeq, Nm, Val, Txt1, Txt2, Num1, Num2
			if (nmColumn == '') nmColumn = 'comCdNm';
			if (valColumn == '') valColumn = 'comCd';

			// 데이타 바인드
			$(id).data('data', data);
			$(id).data('valcolumn', valColumn);
			$.each(data, function(idx, item) {
				$(id).append('<input type="radio" class="btn-check" name="'+id.replace('#', '')+'" id="'+id.replace('#', '') + '_' + idx+'" value="'+item[valColumn]+'" autocomplete="off">' +
								'<label class="btn mtype line-blue" for="'+id.replace('#', '') + '_' + idx+'">'+
									'<i class="bi bi-check2"></i>'+ item[nmColumn] +
								'</label>');
			});

			// 값 선택
			if ($text.isEmpty(val)) {
				$(id + ' input:first').attr("checked", true);
			} else {
				$(id + ' input[value="' + val + '"]').attr("checked", true);
			}

			return { done: true, name: $(id + ' option:selected').text(), val: $(id).val() };
		},


		/**
		 * 콤보 공통코드 생성
		 * $combo.common
		 *
		 * @param {String} id			아이디('#id')
		 * @param {String} masterCode	코드 마스터 코드
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
		 * @param {String} callback		콜백 함수
		 */
		common: function(id, masterCode, val, nmColumn, valColumn, callback) {

			$cmm.getCmmCd(masterCode).then(function(values) {

				// result 값
				let rows = eval('values.' + masterCode);
				if (!$text.isEmpty(rows) && rows.length > 0) {
					if (callback == undefined) {
						$radio.bind(rows, id, val, nmColumn, valColumn);
					} else {
						return callback($radio.bind(rows, id, val, nmColumn, valColumn));
					}
				} else {
					$msg.alert(lng.date.noResults);
				}
			});
		},
	},

	// checkbox
	checkbox: {
		/**
		 * checkbox 바인드
		 * $checkbox.bind
		 *
		 * @param {object} data			콤보 데이타
		 * @param {String} id			아이디('#id')
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
			 * @param {String} modalID		모달아이디
		 */
		bind: function(data, id, val, nmColumn, valColumn) {
			val = val == undefined ? null : val.toString();
			nmColumn = nmColumn == undefined ? '' : nmColumn;
			valColumn = valColumn == undefined ? '' : valColumn;

			let modalID = $($(id).parents('.modal')[0]).attr('id');
			modalID = modalID == undefined ? '' : '#' + modalID;

			// 기존 데이타 삭제
			// $combo.optionRemove(id);

			// 콤보 값 CSeq, Nm, Val, Txt1, Txt2, Num1, Num2
			if (nmColumn == '') nmColumn = 'comCdNm';
			if (valColumn == '') valColumn = 'comCd';

			// 데이타 바인드
			$(id).data('data', data);
			$(id).data('valcolumn', valColumn);
			$.each(data, function(idx, item) {
				$(id).append('<input type="checkbox" class="btn-check" name="'+id.replace('#', '')+'" id="'+id.replace('#', '') + '_' + idx+'" value="'+item[valColumn]+'" autocomplete="off">'+
								'<label class="btn mtype line-blue" for="'+id.replace('#', '') + '_' + idx+'">'+
									'<i class="bi bi-check2"></i>' + item[nmColumn] +
								'</label>');
			});

			// 값 선택
			if ($text.isEmpty(val)) {
				$(id + ' input:first').attr("checked", true);
			} else {
				$(id + ' input[value="' + val + '"]').attr("checked", true);
			}

			return { done: true, name: $(id + ' option:selected').text(), val: $(id).val() };
		},


		/**
		 * 콤보 공통코드 생성
		 * $combo.common
		 *
		 * @param {String} id			아이디('#id')
		 * @param {String} masterCode	코드 마스터 코드
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
		 * @param {String} callback		콜백 함수
		 */
		common: function(id, masterCode, val, nmColumn, valColumn, callback) {

			$cmm.getCmmCd(masterCode).then(function(values) {

				// result 값
				let rows = eval('values.' + masterCode);
				if (!$text.isEmpty(rows) && rows.length > 0) {
					if (callback == undefined) {
						$radio.bind(rows, id, val, nmColumn, valColumn);
					} else {
						return callback($radio.bind(rows, id, val, nmColumn, valColumn));
					}
				} else {
					$msg.alert(lng.date.noResults);
				}
			});
		},
	},

	init: function() {

		// 다국어 lang.js 연동(제목 지정으로 사용)
		$('[data-lang]').each(function() {
			let $this = $(this);
			$this.html($.lang[$val.lang][$this.data('lang')]);
		});

		// select2 기본 설정
		$('select.select2').each(function() {
			$('select.select2').select2({ minimumResultsForSearch: Infinity });
		});

		//switch
		$('.switch button').click(function() {
			$(this).addClass('on').siblings().removeClass('on');
		});

		// 숫자
		$('input[inputmode=numeric]').each(function() {

			let digi = ($text.isEmpty($(this).data('digits'))) ? 0 : $(this).data('digits');
			let mx = ($text.isEmpty($(this).data('max'))) ? 99999999999999999999 : $num.unComma($(this).data('max'));

			// '-'삭제 버그 처리
			$(this).keydown(function(event) {
				// backspace '-' 삭제 처리
				(event.keyCode == 8 && $(this).val() == '-') ? $(this).val('') : $(this).val();

				// del '-' 삭제 처리
				(event.keyCode == 46 && $(this).val() == '-') ? $(this).val('') : $(this).val();
			});

			$(this).inputmask("numeric", {
				placeholder: '',
				// integerDigits: 2,       //자리수 설정
				digits: digi,				//소수점 자리수
				digitsOptional: true,
				groupSeparator: ",",    //separator 설정
				autoGroup: true,		//천단위 그룹
				allowPlus: true,		// 양수 허용
				allowMinus: true,		// 음수 허용
				// min: -1000,			// 최소값
				max: mx,				// 최대값
				// numericInput: true	// 소수점 미리 나옴
			});
		});

		// 날짜
		$('input[inputmode=date]').each(function() {
			let autoUpdate = $(this).data('autoupdate');
			autoUpdate = (autoUpdate == false) ? false : true;
			let id = '#' + $(this).attr('id');
			ui.datePicker.date(id, $(this).val(), autoUpdate);
		});

		// 시간
		$('input[inputmode=time]').each(function() {
			let id = '#' + $(this).attr('id');
			ui.datePicker.time(id, $(this).val());
		});

		// 날짜 월력
		$('input[inputmode=month]').each(function() {
			let id = '#' + $(this).attr('id');
			let d = $(id).val();
			ui.datePicker.month(id, d);
		});

		// 날짜 년력
		$('input[inputmode=year]').each(function() {
			let id = '#' + $(this).attr('id');
			let d = $(id).val();
			ui.datePicker.year(id, d);
		});


		// 콤보년도 기본 셋팅
		$('[data-comboYear]').each(function() {
			let comboyear = eval('(' + $(this).data('comboyear') + ')');
			let addRowText = comboyear.addrowtext;
			let toYear = new Date().getFullYear();
			let syear = comboyear.syear;
			let fyear = comboyear.fyear || toYear;
			let val = comboyear.val || 'now';

			if (comboyear.fyear === 'now') fyear = toYear;
			if (comboyear.fyear === 'last') fyear = toYear - 1;
			if (comboyear.fyear === 'next') fyear = toYear + 1;

			if (val === 'now') val = toYear;
			if (val === 'last') val = toYear - 1;
			if (val === 'next') val = toYear + 1;

			addRowText = addRowText === undefined ? '' : addRowText;
			val = val === undefined ? null : val;
			// 추가 문구 넣기
			if (addRowText.length > 0) {
				$(this).append("<option value=''>" + addRowText + "</option>");
			}
			// 콤보생성 (년도 동안 년도 생성)
			for (let i = fyear; i >= syear; i--) {
				$(this).append("<option value='" + i + "'>" + i + "년</option>");
			}
			$(this).val(val);
			$(this).select2({ minimumResultsForSearch: Infinity });
		});

		// 콤보년도 기본 셋팅
		$('[data-combo-num]').each(function() {
			let id = '#' + $(this).attr('id');
			let combo = eval('(' + $(this).data('combo-num') + ')');

			let sNum = combo.snum;
			let fNum = combo.fnum;
			let val = combo.val;
			let addtext = combo.addtext;
			let addRowText = combo.addrowtext;
			val = val === undefined ? null : val;
			addtext = addtext === undefined ? null : addtext;
			addRowText = addRowText === undefined ? '' : addRowText;
			// 추가 문구 넣기
			if (addRowText.length > 0) {
				$(id).append("<option value=''>" + addRowText + "</option>");
			}
			// 콤보생성 (년도 동안 년도 생성)
			for (let i = fNum; i >= sNum; i--) {
				$(id).append("<option value='" + i + "'>" + i + addtext + "</option>");
			}

			$(id).val(val || $date.getMM());
			$(id).select2({ minimumResultsForSearch: Infinity });
		});

		// 모달 2중 기능 버그 처리 디바운싱
		$(document).on({
			'show.bs.modal': function() {
				let zIndex = 40 + (10 * $('.modal:visible').length);
				$(this).css('z-index', zIndex);
				setTimeout(function() {
					$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
				}, 0);
			},
			'hidden.bs.modal': function() {

				if ($('.modal:visible').length > 0) {
					setTimeout(function() {
						$(document.body).addClass('modal-open');
					}, 0);
				}
			}
		}, '.modal');
		// 로딩
		$('.main-contents').css('opacity', 0);
		$('.main-contents').removeClass('hidden');
		$('.main-contents').animate({ opacity: 1 }, {
			duration: 400, complete: function() {
				$('.cloading').hide();
			}
		});
	}
}

$(function() {
	ui.init();					// 공통 적용
});

let $datePicker = ui.datePicker;
let $combo = ui.combo;
let $radio = ui.radio;
let $checkbox = ui.checkbox;
