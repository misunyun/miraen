/**
	사이트 공통 js
	made by 채움솔루션
*/
let __w = console.log;
let __a = alert;
let __sleep = function(ms) {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) { }
}

// 중복클릭
let clickTF = false;
// 알림여부
let notifiable = true;

// common js
var cjs = {
	// 기본 변수
	val: {
		lang: 'ko', 					// lanaguage
		imageMaxWidth: 1000,			// 업로드할 이미지 최대 width
		thumbnailWidth: 1920,			// 썸네일 width (full hd)
		thumbnailHeight: 1080,			// 썸네일 height (full hd)
		modalPopup: null,				// 모달 팝업 복사
		loadingCnt: 0,					// 로딩 갯수
		PAGING_PAGE_COUNT: 10,			// 페이지 개수
		PAGING_ROW_COUNT: 5,			// 한페이지 ROW 갯수
	},

	// 숫자 함수
	num: {

		//  숫자 유효성 체크
		isNum: function(n) {
 			if(!isNaN(n)) {
				return Number(n);
			} else {
				n = '' + n.replace(/,/gi, ''); // 콤마 제거
				n = n.replace(/(^\s*)|(\s*$)/g, ''); // trim()공백,문자열 제거
				if(!isNaN(n)) {
					return Number(n);
				} else {
					return 0;
				}
			}
		},

		// 반올림
		round: function(num, cipher) {
			let n = Math.round(num * Math.pow(10, cipher)) / Math.pow(10, cipher);
			return n;
		},

		// 내림
		floor: function(num, cipher) {
			let n = Math.floor(num * Math.pow(10, cipher)) / Math.pow(10, cipher);
			return n;
		},

		// 올림
		ceil: function(num, cipher) {
			let n = Math.ceil(num * Math.pow(10, cipher)) / Math.pow(10, cipher);
			return n;
		},

		// 컴마 제거
		unComma: function(n) {
			try {
				n = '' + n.replace(/,/gi, ''); // 콤마 제거
				n = n.replace(/(^\s*)|(\s*$)/g, ''); // trim()공백,문자열 제거
				return (new Number(str));//문자열을 숫자로 반환
			} catch (e) {
				n
			} finally {
				return n;
			}
		},

		// 컴마 생성
		comma: function(n) {
			n = String(n);
			var regx = new RegExp(/(-?\d+)(\d{3})/);
			var bExists = n.indexOf(".", 0);//0번째부터 .을 찾는다.
			var strArr = n.split('.');
			while (regx.test(strArr[0])) {//문자열에 정규식 특수문자가 포함되어 있는지 체크
				//정수 부분에만 콤마 달기
				strArr[0] = strArr[0].replace(regx, "$1,$2");//콤마추가하기
			}
			if (bExists > -1) {
				//. 소수점 문자열이 발견되지 않을 경우 -1 반환
				n = strArr[0] + "." + strArr[1];
			} else { //정수만 있을경우 //소수점 문자열 존재하면 양수 반환
				n = strArr[0];
			}
			return n;//문자열 반환
		},

		/**
		 * inputmask 숫자형
		 * @memberOf $num.numeric('#num03','0','9999')
		 * @param {String} id 아이디
		 * @param {String} digi 수수점 자리수
		 * @param {String} mx 최대값
		 */
		numeric: function(id, digi, mx) {
			digi = ($text.isEmpty(digi)) ? 0 : digi;
			mx = ($text.isEmpty(mx)) ? 99999999999999999999 : $num.unComma(mx);
			$(id).inputmask("numeric", {
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
		},

		/**
		 * 숫자 한글로
		 * @memberOf $num.toHan(12314532)
		 * @param {Number} num 숫자
		 */
		toHan: function(num) {

			let val = String(num).replace(/[^0-9]/g, '');

			var numKor = new Array('', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십');
			// 숫자 문자
			var danKor = new Array('', '십', '백', '천', '', '십', '백', '천', '', '십', '백', '천', '', '십', '백', '천');

			// 만위 문자열
			var result = '';
			if (!isNaN(val)) {

				// CASE: 금액이 공란/NULL/문자가 포함된 경우가 아닌 경우에만 처리
				for (i = 0; i < val.length; i++) {
					var str = '';
					var num = numKor[val.charAt(val.length - (i + 1))];

					if (num != '') str += num + danKor[i];

					// 숫자가 0인 경우 텍스트를 표현하지 않음
					switch (i) {
						case 4: str += '만'; break; // 4자리인 경우 '만'을 붙여줌 ex) 10000 -> 일만
						case 8: str += '억'; break; // 8자리인 경우 '억'을 붙여줌 ex) 100000000 -> 일억
						case 12: str += '조'; break; // 12자리인 경우 '조'를 붙여줌 ex) 1000000000000 -> 일조
					}
					result = str + result;
				}
				// result = result + '';
			}
			return result;
		}

	},

	// 문자 함수
	text: {

		// UUID v4 generator in JavaScript (RFC4122 compliant)
		getUUID: function() {
			return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
				return v.toString(16);
			});
		},

		/**
		 * 공백 체크
		 * @memberOf $text
		 * @param {String} val 공백체크할 문자열
		 */
		isEmpty: function(val) {
			try {
				if (typeof val === 'undefined' || val === null || val === '' || val === 'undefined')
					return true;
				else
					return false;
			} catch (error) {
					return false;
			}
		},

		/**
		 * 값이 있으면 있는 것으로 없으면 기본값
		 * @memberOf $text
		 * @param {String} val 공백체크할 문자열
		 * @param {String} def 기본값
		 */
		setDefVal: function(val, def) {
			if (typeof val === 'undefined' || val === null || val === '' || val === 'undefined')
				return def;
			else
				return val;
		},

		/**
		 * 문자 오른쪽 으로 자르기
		 *$text.right('김갑수',2)
		 *result ==> "갑수"
		 * @memberOf $text
		 * @param {String} val 문자열
		 * @param {int} length 자를 문자열의 시작 위치
		 */
		right: function(val, length) {
			if (val.length <= length) {
				return val;
			} else {
				return val.substring(val.length - length, val.length);
			}
		},


		/**
		 * 문자 치환
		 * @memberOf $text
		 * @param {String} val 문자열
		 * @param {String} search 기존 문자
		 * @param {String} replace 치환할 문자
		 */
		replace: function(val, search, replace) {
			if (typeof val !== 'string') return '';
			return val.replace(search, replace);
		},

		/**
		 * 문자열에 앞에 특정문자를 붙여 정해진 길이 문자열을 반환한다.
		 * <per>
		 * <br>
		 * String result = $text.lpad("123", 5, "#");
		 * <br>
		 * result == > ##123
		 * </per>
		 * @memberOf $text
		 * @param {String} str 변경할 문자
		 * @param {Number} len 새로 만들 문자열 길
		 * @param {String} padStr 문자열 길이만큼 채울 문자
		 * @return{String} 변환된 문자열
		 */
		lpad: function(str, len, padStr) {
			if (str == null) { return str; };

			str = String(str);

			if (str.length >= len) {
				return str;
			}

			let sb = [];
			for (let i = 0; i < len - str.length; i += padStr.length) {
				sb.push(padStr);
			}
			sb.push(str);
			return sb.join('');
		},

		/**
		 * 문자열에 뒤에 특정문자를 붙여 정해진 길이 문자열을 반환한다.
		 * <per>
		 * <br>
		 * String result =  $text.rpad("123", 5, "#");
		 * <br>
		 * result == > 123##
		 * </per>
		 * @memberOf $text
		 * @param {String} str 변경할 문자
		 * @param {Number} len 새로 만들 문자열 길
		 * @param {String} padStr 문자열 길이만큼 채울 문자
		 * @return{String} 변환된 문자열
		 */
		rpad: function(str, len, padStr) {
			if (str == null) { return str; };

			str = String(str);

			if (str.length >= len) {
				return str;
			}

			let sb = [];
			sb.push(str);
			for (let i = 0; i < len - str.length; i += padStr.length) {
				sb.push(padStr);
			}
			return sb.join('');
		},


		/**
		 * 전화번호 포맷팅
		 * @memberOf $str
		 * @param {String} str 포맷팅 할 문자
		 */
		autoHypenTel: function(str) {
			str = str.replace(/[^0-9]/g, '').substring(0, 11);
			let reg = /[^0-9]/g;
			if (!reg.test(str)) {
				return str.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
			} else {
				return str;
			}
		},

		/**
		 * 날짜 - 자동"-"
		 * @memberOf $str
		 * @param {String} str 변경 할 문자
		 */
		autoHypenDate: function(str) {
			str = str.replace(/[^0-9]/g, '').substring(0, 8);
			let tmp = '';
			if (str.length < 5) {
				return str;
			} else if (str.length < 7) {
				tmp += str.substr(0, 4);
				tmp += '-';
				tmp += str.substr(4, 2);
				return tmp;
			} else {
				tmp += str.substr(0, 4);
				tmp += '-';
				tmp += str.substr(4, 2);
				tmp += '-';
				tmp += str.substr(6, 2);
				return tmp;
			}
			return str;
		},

		/**
		 * 사업자등록 번호
		 * @memberOf $str
		 * @param {String} str 변경 할 문자
		 */
		autoHypenBizNo: function(str) {
			// 999-99-99999
			str = str.replace(/[^0-9]/g, '').substring(0, 10);;
			return str.replace(/([0-9]{3})([0-9]{2})([0-9]{5})/, '$1-$2-$3');
		},

		/**
		 * 주민번호
		 * @memberOf $str
		 * @param {String} str 변경 할 문자
		 */
		autoHypenJumin: function(str) {
			str = str.replace(/[^0-9]/g, '').substring(0, 13);
			return str.replace(/([0-9]{6})([1-4][0-9]{6})/, '$1-$2');
		},

		/**
		 * 전화번호 유효성 체크
		 * @memberOf $str
		 * @param {String} str 변경 할 문자
		 */
		checkTel: function(str) {

	    	let regExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
	    	return regExp.test(str);
		},

		// QR CODE
		qrcode: function($elet, txt,w,h) {

			w = $text.isEmpty(w) ? 100 : w;
			h = $text.isEmpty(h) ? 100 : h;

			var qrcode = new QRCode($elet[0], {
				text: txt,
				width: w,
				height: h,
				colorDark : '#000000',
				colorLight : '#ffffff',
				correctLevel : QRCode.CorrectLevel.Q
			});
		},
        // 이미지 복사
        imgCopy: function(id) {
            let el = $('#'+id);
            el.attr("contenteditable", true);

            $img.selectText(el.get(0));

            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            el.removeAttr("contenteditable");

            $msg.alert("복사되었습니다.");

        },

        // 이미지 다운로드
        imgDownload: function(id, name) {
            $img.downloadURI($('#'+id+' img').attr('src'),name);
        },

		// 성취도 수준
        setSchieveLevel: function(step, v) {

			if ($text.isEmpty(v)) {
				return '-';
			}

			let rtnVal ='';
			if (step == 3 ) {

				if (v >= 71) {
					rtnVal = '매우 잘함';
				} else if (v >= 51 && v <= 70) {
					rtnVal = '잘함';
				} else if (v <= 50) {
					rtnVal = '보통';
				}

			} else if (step == 4 ) {

				if (v >= 80) {
					rtnVal = '매우 잘함';
				} else if (v >= 66 && v <= 79) {
					rtnVal = '잘함';
				} else if (v >= 51 && v <= 65) {
					rtnVal = '보통';
				} else if (v <= 50) {
					rtnVal = '노력 요함';
				}

			} else if (step == 5 ) {

				if (v >= 80) {
					rtnVal = '매우 잘함';
				} else if (v >= 68 && v <= 79) {
					rtnVal = '잘함';
				} else if (v >= 60 && v <= 68) {
					rtnVal = '보통';
				} else if (v >= 51 && v <= 59) {
					rtnVal = '미흡';
				} else if (v <= 50) {
					rtnVal = '노력 요함';
				}
			}

			return rtnVal;
        },

        // 사용자 계정 마스킹 ****
        maskingUserId: function(id) {
            let maskingStr;
            if(id == null || id =='' || id.length < 5 ) return id;
            maskingStr = id.substring(0,4);
            for(var i = 4; i < id.length; i++) { maskingStr += '*'; }
            return maskingStr;
        },

	},

	// 데이타 가공 함수
	objData: {

		// json 행 선택 단일 행
		getRowFilter : function(data, key, value) {
			var returnObject = "";
			$.each(data, function() {
				if (this[key] == value) {
					returnObject = this;
				}
			});

			return returnObject;
		},

		// json 행 idx  단일 행
		getRowIdxFilter : function(data, key, value) {
			var returnObject = "";
			$.each(data, function(i, p) {
				if (this[key] == value) {
					returnObject = i;
				}
			});

			return returnObject;
		},

		// json 행선택 rows
		getListFilter : function(data, key, value) {
			var returnObject = "";
			var array = [];
			$.each(data, function() {
				if (this[key] == value) {
					array.push(this);
					// returnObject = this;
				}
			});

			return array;
		},

		// json 행선택 rows
		getListFilter2 : function(data, key1, value1, key2, value2) {
			var returnObject = "";
			var array = [];
			$.each(data, function() {
				if (this[key1] == value1 || this[key2] == value2) {
					array.push(this);
				}
			});

			return array;
		},

		// json 행선택 Set
		getSetFilter : function(data, key) {
			const set = new Set();
			$.each(data, function() {
			    set.add(this[key]);
			});

			return Array.from(set);
		},

		// json 행선택 Set
		getSetFilter2 : function(data, key1, key2) {
			const set = new Set();
			$.each(data, function() {
			    set.add(this[key1], this[key2]);
			});

			return Array.from(set);
		},

		// json 행선택 rows
		getListArrayFilter : function(data, key, value) {
			var returnObject = "";
			var array = [];
			$.each(data, function(idx1, item1) {
				$.each(value, function(idx2, item2) {
					if (item1[key] == item2) {
						array.push(item1);
						// returnObject = this;
					}
				})
			});
			return array;
		},

	},


	date: {

		/**
		 * 날짜 - DB 서버 날짜
		 */
		getSysDate: function() {

			const options = {
				url: '/getSysDate.ax',
				async: false,
				success: function(res) {
					result = res.row.sysDatetime;
				}
			};
			$cmm.ajax(options)
			return result;
		},

		/**
		 * 날짜 유효성 체크
		 * @memberOf $date
		 * @param {String} value 변경 할 문자
		 */
		isDate: function(value) {
			let result = true;
			try {
				let date = value.split("-");
				let y = parseInt(date[0], 10),
					m = parseInt(date[1], 10),
					d = parseInt(date[2], 10);

				let dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
				result = dateRegex.test(d + '-' + m + '-' + y);
			} catch (err) {
				result = false;
			}
			return result;
		},

		/**
		 * 초 => 시간 분 초 표시
		 */
		getHMS: function(s) {

			let hour = parseInt(s/3600);
			let min = parseInt((s%3600)/60);
			let sec = s%60;

			if (hour > 0) {
				return hour+'시간 '+min+'분 ' + sec + '초';
			} else if (hour == 0 && min > 0 ) {
				return min+'분 ' + sec + '초';
			} else {
				return sec + '초';
			}

		}

	},

	// 폼
	form: {

		reset: function(id) {

			// form reset
			$(id)[0].reset();

			// validate reset
			$(id).validate().resetForm();

			// select2 초기화
			$(id + ' select').trigger('change');

		},

		/**
		 * Form validate
		 *  @memberOf $form.check
		 *  @param {String} id : disabled처리할 요소의 id 선택자
		 */
		check: function(formId, rulesObj, messagesObj) {

			return validate = $(formId).validate({
				focusCleanup: true, //true이면 잘못된 필드에 포커스가 가면 에러를 지움
				// focusInvalid: false, //유효성 검사후 포커스를 무효필드에 둠 꺼놓음
				// onclick: false, //클릭시 발생됨 꺼놓음
				// onfocusout: false, //포커스가 아웃되면 발생됨 꺼놓음
				// onkeyup: false, //키보드 키가 올라가면 발생됨 꺼놓음

				rules: rulesObj,
				messages: messagesObj,

				/*rules: {
					e01: 'required',
					e02: 'required',
					e03: 'required',
					e04: 'required',
					e05: 'required',
					e06: 'required',
					e07: 'required'
				},
				messages: {
					e01: '텍스트 필수입력',
					e02: '구분 콤보 필수 입력',
					e03: '레디오 체크 필수 입력',
					e04: '체크 박스 필수 입력',
					e05: '년도 선택',
					e06: '일자 선택',
					e07: '기간 선택',
				},*/
				errorElement: 'em',
				// errorLabelContainer: '.errorTxt',
				errorPlacement: function(error, element) {

					error.addClass('help-block');
					let inputmode = $text.isEmpty(element.attr('inputmode')) ? '' : element.attr('inputmode');
					if (element.prop('type') === 'radio') {

						if ($(element).parent().hasClass('btn-group')) {
							error.insertAfter($(element).parent());
						} else {
							error.insertAfter($(element).parent().find('.msgValid'));
						}

					} else if (element.prop('type') === 'checkbox') {

						if ($(element).parent().hasClass('btn-group')) {
							error.insertAfter($(element).parent());
						} else {
							error.insertAfter($(element).parent().find('.msgValid'));
						}

					} else if (element.prop('type') === 'select-one') {

						error.insertAfter($(element).parent().next());

					} else if (element.prop('type') === 'text' && inputmode.indexOf('date') > -1) {
						error.insertAfter($(element).parent());

					} else {
						error.insertAfter(element);
					}
				},
			});
		},

	},


	msg: {

		// 로그인 얼랏
		login: function() {
			$msg.confirm('로그인이 필요합니다.<br>로그인 페이지로 이동하시겠습니까?', function() {

				location.href = siteInfo.loginSite + siteInfo.href;
			}, null, null, '로그인', '취소');
		},

		// 회원이 아닙니다.
		isNotMember: function() {
			$msg.confirm('교사 인증을 완료하셔야 서비스 이용이 가능합니다<br>회원정보 수정 페이지로 이동하시겠습니까?', function() {

				location.href = siteInfo.modifySite + siteInfo.href;
			}, null, null, '회원수정', '취소');
		},

		/**
		 * Alert - jquery confirm
		 * $msg.alert([내용], [확인 Handler], [타입])
		 *  @memberOf $msg
		 *  @param {String} text : 표시할 내용
		 *  @param {Function} closeFunc : 확인 후 이벤트(생략가능)
		 *  @param {String} type : type 코드(생략가능)
		   */
		alert: function(content, closeFunc, type, title, icon) {

			// 타입 : info, success, error, warning
			type = ($text.isEmpty(type)) ? 'info' : type;

			if (type == 'info') {
				title = '안내';
				icon = 'bi bi-info-circle';
			}

			$.alert({
				title : title,
				content : content,
				icon : icon,
				boxWidth : '340px',
				useBootstrap : false,
				animateFromElement: false,
				animation : 'scale',
				closeAnimation : 'scale',
				escapeKey: 'okay',
				buttons : {
					okay : {
						text : '닫기',
						btnClass : 'btn-dark',
						action: function(){
			                 if(!!closeFunc) closeFunc();
			            }
					}
				}
			});
		},

		/**
		* https://sweetalert2.github.io
		* $msg.confirm([내용], [확인 Handler], [취소 Handler], [타입], [버튼명])
		* @memberOf $msg
		* @param {String} text : 표시할 내용
		* @param {Function} confirmFunc : 확인 후 이벤트(생략가능)
		* @param {Function} cancelFunc : 취소 후 이벤트(생략가능)
		* @param {String} type : type 코드(생략가능)
		* @param {String} title : title 상단
		* @param {String} btnText : 버튼 텍스트
		* @param {String} cancelText : 취소 버튼 텍스트 (생략가능)
		  */
		confirm: function(text, confirmFunc, cancelFunc, type, title, btnText, cancelText) {

			btnText = !!btnText ? btnText : '확인';
			cancelText = !!cancelText ? cancelText : '닫기';

			// 타입 : info, success, error, warning
			type = ($text.isEmpty(type)) ? 'info' : type;
			if (type == 'info') {
				title = '안내';
				icon = 'bi bi-info-circle';
			}

			$.alert({
				title : title,
				content : text,
				icon : icon,
				boxWidth : '340px',
				useBootstrap : false,
				animateFromElement: false,
				animation : 'scale',
				closeAnimation : 'scale',
				escapeKey: 'okay',
				buttons : {
					confirm : {
						text : btnText,
						btnClass : 'btn-dark',
						action: function(){
			                 if(!!confirmFunc) confirmFunc();
			            }
					},
					cancel : {
						text : cancelText,
						btnClass : 'btn-default',
						action: function(){
			                 if(!!cancelFunc) cancelFunc();
			            }
					},
				}
			});

		},

		/**
		* https://sweetalert2.github.io
		* $msg.confirm([내용], [확인 Handler], [취소 Handler], [타입], [버튼명])
		* @memberOf $msg
		* @param {String} text : 표시할 내용
		* @param {Function} confirmFunc : 확인 후 이벤트(생략가능)
		* @param {Function} cancelFunc : 취소 후 이벤트(생략가능)
		* @param {String} type : type 코드(생략가능)
		* @param {String} title : title 상단
		* @param {String} btnText : 버튼 텍스트
		* @param {String} agreeText : 회원가입 텍스트 (생략가능)
		  */
		confirm2: function(text, confirmFunc, cancelFunc, type, title, btnText, agreeText) {

			agreeText = !!agreeText ? agreeText : '회원가입';
			btnText = !!btnText ? btnText : '확인';

			// 타입 : info, success, error, warning
			type = ($text.isEmpty(type)) ? 'info' : type;
			if (type == 'info') {
				title = 'Class123 로그인 연동 종료 안내';
				icon = 'bi bi-info-circle';
			}

			$.alert({
				title : title,
				content : text,
				icon : icon,
				boxWidth : '420px',
				useBootstrap : false,
				animateFromElement: false,
				animation : 'scale',
				closeAnimation : 'scale',
				escapeKey: 'okay',
				buttons : {
					confirm : {
						text : btnText,
						btnClass : 'btn-dark',
						action: function(){
			                 if(!!confirmFunc) confirmFunc();
			            }
					},
					cancel : {
						text : agreeText,
						btnClass : 'btn-default',
						action: function(){
							if(!!cancelFunc) cancelFunc();
			            }

					},
				}
			});

		},

		/**
		  *  toastr 알림
		* ex) $msg.toastr('TOASTR','')
		*  @memberOf $msg
		*  @param {String} text : toastr에 표시할 내용
		*  @param {String} code : toastr 코드 (생략가능)
		  */
		toastr: function(text, code) {
			top.toastr.options = {
				"closeButton": true,
				"debug": false,
				"newestOnTop": false,
				"progressBar": false,
				"positionClass": "toast-top-right",
				"preventDuplicates": false,
				"onclick": null,
				"showDuration": "300",
				"hideDuration": "1000",
				"timeOut": "5000",
				"extendedTimeOut": "1000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut"
			};

			let rcode = $text.isEmpty(code) ? 'error' : code.replace('t_', '');

			switch (rcode) {
				case "success":
					top.toastr.success(text);
					break;
				case "info":
					top.toastr.info(text);
					break;
				case "error":
					top.toastr.error(text);
					break;

				default:
					top.toastr.warning(text);
					break;
			}

		},

	},

	/**
	 * 공통함수
	 */
	cmm: {

		/**
		 * 초기화
		 *
		 */
		init: function() {

			// 엔터 이벤트
			$('html').on('keyup', '[data-enter-id]', e => {

				if (e.keyCode === 13) {
					$('#' + $(e.currentTarget).data('enterId')).trigger('click');
				}
			});
		},

		/**
		 * 브라우저 주소창 변경
		 * @memberOf $cmm.changeBrowserAddressBarUrl(changeUrl)
		 * @param {String} url get 방식
		 * ex) $cmm.changeBrowserAddressBarUrl('/Search/Search.mrn?searchTxt=마음')
		 */
		changeBrowserAddressBarUrl: function(changeUrl) {

			if (typeof (history.pushState) != "undefined") {
				// 주소 변경
				window.history.pushState(null, null, changeUrl);
			} else {
				__w('지원하지 않는 브라우저');
			}
		},

		// 회원 유무
		isMember: function() {
			if ($('#container').data('isUser') == '002') {
				return true;
			} else {
				return false;
			}
		},

		// 유효한 URL 체크
		isValidUrl: function(urlString) {
            try {
                new URL(urlString);
            } catch (err) {
                return false;
            }
            return true;
		},

		/**
		 * URL의 파라미터를 객체로 변환하여 반환한다.
		 * @memberOf $ui
		 * @param {String} key 파라미터 키
		 */
		getUrlParams: function(key) {

			let params = {}, tempValue;
			window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {

				if (!params[key]) {

					params[key] = value;
				} else {

					if (typeof params[key] === 'string') {

						tempValue = params[key];
						params[key] = [tempValue];
					}

					params[key].push(value);
				}
			});

			return !!key ? params[key] : params;

		},

		ajax: function(options) {

			let _options = {
				method: 'POST',
				loading: true,
				dataType: 'json',
				beforeSend: function() {$cmm.ui.loadingShow()},
				complete: function() {$cmm.ui.loadingHide()},
				error: function(res) {

					$cmm.ui.loadingHide();
					if (res.statusText == 'error') {
						$msg.alert('처리 중 에러가 발생했습니다.', null, 'error');
					} else {
						$msg.alert('처리 중 에러가 발생했습니다.', null, 'error');
						// 에러시 메세지 확인
//						let msg = $text.isEmpty(res.message) ? res.responseJSON.message : res.message;
//
//						if (!!msg) {
//							let sendTf = false;
//							$msg.alert('처리 중 에러가 발생했습니다.', null, 'error');
//						}
					}
				}
			};

			// 기본 객체에 파라미터 객체를 추가.
			for (let val in options) {
				if (!$text.isEmpty(options[val])) {
					_options[val] = options[val];
				}
			}

			_options.url = options.url;
			// 로딩바를 보이고 싶지 않을 때
			if (!_options.loading) {
				_options.beforeSend = null;
				_options.complete = null;
			}

			// form serialize 유무
			if (!!_options.form) {

				let formJson = $cmm.serializeJson(_options.form);
				for (let key in formJson) {
					_options.data[key] = formJson[key];
				}
			}

			_options.data = !!_options.data ? _options.data : {};

			if(!!options.queryId) {
				_options.data.queryId = options.queryId;
			}

			// json 파라미터인 경우
			if (!!_options.isJsonParam) {
				let data = _options.data;
				if (Array.isArray(data)) {
					//STATUS -> flg , flg = I -> flg = C 로 변경
					// todo : 배열인지 체크 하여 작업
					data.forEach(function(value) {
						value.flg = value.STATUS;
						if (value.flg === 'I') {
							value.flg = 'C'
						}
					});
				}

				_options.data = JSON.stringify({ jsonParam: _options.data });
				_options.contentType = "application/json; charset=UTF-8";

			}

			// 성공 함수
			_options.success = function(res) {

				let resultCode = res.resultCode;
				let resultMsg = res.resultMsg;
				let errorMessage = res.errorMessage;

				// 정상 결과
				if (resultCode === "0000" || resultCode === "success") {

					options.success(res);
				// 결과코드(9990) : 세션 만료
				} else if (resultCode === "9990") {

					$msg.alert('다시 로그인 해주세요.', function() {
						location.href = siteInfo.loginSite + siteInfo.href;
					}, 'error');

				// 결과코드(9970) :
				} else if (resultCode === "9970") {

					$msg.alert('다시 로그인 해주세요.', function() {
						window.location.reload();
					}, 'error');

				// 결과코드(9980) :
				} else if (resultCode === "9980") {

					$msg.alert('권한이 없는 서비스입니다.');

					if (!!options.error) {
						_options.error();
					}
				} else {
					if (!!resultMsg) {

						$msg.alert(resultMsg);
					} else if(!!errorMessage){

						$msg.alert(errorMessage);
					} else {
						$msg.alert('처리 중 에러가 발생했습니다.');
					}

					if (!!options.error) {
						_options.error('처리 중 에러가 발생했습니다.');
					}
				}
			};

			// data 초기화
			_options.data = _options.data || {};
			return $.ajax(_options);
		},

		/**
		 * Ajax Upload 통신
		 * @memberOf $cmm
		 * @param {Object} options ajax 옵션
		 */
		ajaxUpload: function(options) {

			let _options = {
				method: 'POST',
				loading: true,
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				cache: false,
				beforeSend: function() {cjs.cmm.ui.loadingShow()},
				complete: function() {cjs.cmm.ui.loadingHide()},
				error: function(res) {
					$msg.alert('처리 중 에러가 발생했습니다.');
					cjs.cmm.ui.loadingHide();
				}
			};

			// 기본 객체에 파라미터 객체를 추가.
			for (let val in options) {
				if (!$text.isEmpty(options[val])) {
					_options[val] = options[val];
				}
			}

			if (!!_options.form) {
				let formData = new FormData(_options.form[0]);
				if (!!_options.data) {
					for (let val in _options.data) {
						if (!$text.isEmpty(_options.data[val])) {
							formData.append(val, _options.data[val]);
						}
					}
				}

				_options.data = formData;
			}

			// 성공 함수
			_options.success = function(res) {

				try {
					if (!(res instanceof Object)) {
						res = JSON.parse(res);
					}
				} catch(e) {
					__w('error no object');
				}

				let resultCode = res.resultCode;
				let resultMsg = res.resultMsg;

				// 정상 결과
				if (resultCode === "0000") {

					if (!!resultMsg) {

						$msg.alert(resultMsg, function() {

							options.success(res);
						});
					} else {

						options.success(res);
					}
					// 결과코드(9990) : 세션 만료
				} else if (resultCode === "9990") {

					$msg.alert('다시 로그인 해주세요.', function() {
						location.href = siteInfo.loginSite + siteInfo.href;
					}, 'error');

					// 결과코드(9980) :
				} else if (resultCode === "9980") {

					$msg.alert('권한이 없는 서비스입니다.');

					if (!!options.error) {
						_options.error();
					}
				} else {
					if (!!resultMsg) {

						$msg.alert(resultMsg);
					} else {

						alert("처리 중 에러가 발생했습니다.");
					}

					if (!!options.error) {
						_options.error('처리 중 에러가 발생했습니다.');
					}
				}
			};
			_options.url =  _options.url;
			return $.ajax(_options);
		},

		/**
		 * FORM 입력 데이터를 JSON으로 반환한다.
		 * @memberOf $cmm
		 * @param {Element} $frm form 객체
		 */
		serializeJson: function($frm) {

			if ($frm[0].tagName.toUpperCase() === "FORM") {
				let list = $frm.serializeArray();
				let jsonData = {}, arryValue;;
				$.each(list, function(idx) {

					if (!!list[idx].value) {

						// 배열일 경우
						if (!!jsonData[list[idx].name]) {

							if (typeof jsonData[list[idx].name] === "string") {

								arryValue = jsonData[list[idx].name];
								jsonData[list[idx].name] = [];
								jsonData[list[idx].name].push(arryValue);
							}

							jsonData[list[idx].name].push(list[idx].value);
						} else {

							jsonData[list[idx].name] = list[idx].value;
						}
					}
				});

				return jsonData;
			}
		},

		/**
		 * 데이터 바인딩
		 * @memberOf $cmm
		 * @param {Element} $el 객체
		 * @param {Object} item 데이터
		 */
		setDataBind: function($el, item) {
			$el.find('[data-bind]').each(function(elIdx, el) {

				let tagName = el.tagName.toUpperCase();
				let type = !!$(el).prop("type") ? $(el).prop("type").toUpperCase() : '';
				let val = $text.isEmpty(item) ? '' : item[$(el).attr('data-bind')];

				// 값 넣기
				if (tagName === 'INPUT' && (type == "CHECKBOX" || type == "RADIO")) {
					if ($(el).val() == val) {
						$(el).prop("checked", true);
					}
				} else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
					$(el).val(val);
				} else if (tagName === 'SELECT') {
					$(el).val(val).trigger('change');
				} else {
					$(el).text(val);
				}

			});
		},

		/**
		 * 페이징 처리를 한다.
		 *
		 * @memberOf $cmm
		 * @param {Object} $page 페이징 객체
		 * @param {Object} data 데이터
		 * @param {function} pagingFunc 페이징 선택 이벤트
		 */
		setPaging : function($paging, data, pagingFunc) {

			if(data.totalCnt === 0) {

				$paging.addClass("d-none");
				return;
			}

			// 초기화.
			$paging.find("a").parent().addClass("d-none");
			$paging.find("a").removeClass("on");

			$paging.removeClass("d-none");

			// 페이징 갯수.
			let pageCnt = (Math.floor((data.page - 1) / cjs.val.PAGING_PAGE_COUNT) + 1) * cjs.val.PAGING_PAGE_COUNT;
			let pageStart = (pageCnt - cjs.val.PAGING_PAGE_COUNT) + 1;
			// 전체 페이징 갯수.
			let totalPageCnt = Math.ceil(data.totalCnt / ($text.isEmpty(data.pagingRowCount) ? cjs.val.PAGING_ROW_COUNT : data.pagingRowCount));

			pageCnt = pageCnt > totalPageCnt ? totalPageCnt : pageCnt;

			let pageIdx = 1;
			// 페이징 갯수 설정.
			for(let i = pageStart; i <= pageCnt; i++) {

				$paging.find("a").eq(pageIdx).parent().removeClass("d-none");
				$paging.find("a").eq(pageIdx).removeClass("on");
				$paging.find("a").eq(pageIdx).html(i);

				// 선택 된 페이지 표시.
				if(i === Number(data.page)) {

					$paging.find("a").eq(pageIdx).addClass("on");
				}

				// 페이지 이동
				$paging.find("a").eq(pageIdx++).off().on("click", function() {

					if(!!pagingFunc) {

						pagingFunc($(this).html());
					}
				});
			}

			// 이전 페이지로 이동
			$paging.find("a").eq(0).parent().removeClass("d-none");
			$paging.find("a").eq(0).off().on("click", function() {

				if(!!pagingFunc && Number(data.page) > 1) {

					pagingFunc(Number(data.page) - 1);
				}
			});

			// 다음 페이지로 이동
			$paging.find("a").eq(cjs.val.PAGING_PAGE_COUNT + 1).parent().removeClass("d-none");
			$paging.find("a").eq(cjs.val.PAGING_PAGE_COUNT + 1).off().on("click", function() {

				if(!!pagingFunc && Number(data.page) < totalPageCnt) {

					pagingFunc(Number(data.page) + 1);
				}
			});
		},

		/**
		 * 화면 공통함수
		 */
		ui: {
			/**
			 * 로딩바 show
			 * @memberOf $ui
			 */
			loadingShow: function() {

				cjs.val.loadingCnt = cjs.val.loadingCnt + 1;

				if ($('body').find('.loadingDiv').length === 0) {
					$('body').append('<div class="loadingDiv"><div class="loadingAni"><div></div><div></div><div></div></div></div>');
				}
			},

			/**
			 * 로딩바 hide
			 * @memberOf $ui
			 */
			loadingHide: function() {

				cjs.val.loadingCnt = cjs.val.loadingCnt - 1;
				if (cjs.val.loadingCnt <= 0) {
					$('body').find('.loadingDiv').remove();
				}
				cjs.val.loadingCnt = cjs.val.loadingCnt < 0 ? 0 : cjs.val.loadingCnt;
			},

			/**
			 * 이벤트 저장
			 * @memberOf $ui
			 */
			eventClick: function(param) {

				const options = {
					url: '/saveEventClick.ax',
					data: {
						clickCdSeq: param.clickCdSeq
						, ccUuid: param.ccUuid
					},success: function(res) {
					},
				};
				$cmm.ajax(options);
			},
		},
	},

	/**
	 * 파일 공통 함수
	 */
	file: {

		/**
		 * 학생 공유 다운로드 URL
		 *
		 * @memberOf screen.c
		 */
		getShareDownloadUrl: function(comSeq, ccUuid, fileUrl) {

			// 이벤트 저장
			$ui.eventClick({clickCdSeq: 141, ccUuid: ccUuid});

			$.fileDownload(fileUrl, {
				httpMethod: "get",
				data: '',
				successCallback: function() {

					// 파일 다운로드 성공
					$cmm.ui.loadingHide();

				},
				failCallback: function() {

					$cmm.ui.loadingHide();
					$msg.alert('파일 다운로드시 에러가 발생 했습니다.', null, 'error');
					return false;
				}
			});

		},

		// 파일 사이즈
		getFileSize: function(data) {

			var size = '';
			if (data < 1024) size = data + 'bytes';
			else if (data < 1024 * 1024) size = (data / 1024).toFixed(1) + 'KB';
			else if (data < 1024 * 1024 * 1024) size = (data / (1024 * 1024)).toFixed(1) + 'MB';
			else size = (data / (1024 * 1024 * 1024)).toFixed(1) + 'GB';
			return size;
		},


	},

	/**
	 * 화면 공통함수
	 */
	img: {

		/**
		 * 이미지 복사 select text
		 * @memberOf $img
		 */
		selectText: function(el) {
			var doc = document;
			if (doc.body.createTextRange) {
				var range = document.body.createTextRange();
				range.moveToElementText(el);
				range.select();
			} else if (window.getSelection) {
				var selection = window.getSelection();
				var range = document.createRange();
				range.selectNodeContents(el);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		},

		/**
		 * 이미지 다운로드 Blob 처리
		 * @memberOf $img
		 */
		dataURLtoBlob: function(dataurl) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], {
				type: mime
			});
		},

		/**
		 * 이미지 복사
		 * @memberOf $img
		 */
		downloadImg: function(imgSrc) {
			var image = new Image();
			image.crossOrigin = "anonymous";
			image.src = imgSrc;
			var fileName = image.src.split("/").pop();
			image.onload = function() {
				var canvas = document.createElement('canvas');
				canvas.width = this.width;
				canvas.height = this.height;
				canvas.getContext('2d').drawImage(this, 0, 0);
				if (typeof window.navigator.msSaveBlob !== 'undefined') {
					window.navigator.msSaveBlob($img.dataURLtoBlob(canvas.toDataURL()), fileName);
				} else {
					var link = document.createElement('a');
					link.href = canvas.toDataURL();
					link.download = fileName;
					link.click();
				}
			};
		},

		/**
		 * [downloadURI]
		 * @param  {[string]} img       [base64encoded image data]
		 * @param  {[string]} fileName  [new file name]
		 * @return [image file]
		 */
		downloadURI: function(uri, fileName) {

			var link = document.createElement("a");
			link.download = fileName;
			link.href = uri;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			delete link;
		},

	},

	init: function() {
		// 공통 초기화 호출
		$cmm.init();

	}
};

var $val = cjs.val;				// 공통변수
var $text = cjs.text;			// 문자함수
var $num = cjs.num;				// 숫자함수
var $objData = cjs.objData;		// 오브젝 데이타
var $date = cjs.date;			// 날짜
var $form = cjs.form;			// 폼
var $msg = cjs.msg;				// 메세지(notify, alert, confirm)
var $cmm = cjs.cmm;				// 공토함수
var $file = cjs.file;			// file
var $img = cjs.img;				// 이미지
var $ui = cjs.cmm.ui;
// 공통 초기화 호출
cjs.init();


function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}