let screen;

$(function() {

	screen = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screen
		 */
		v: {
			data: null
			, beforeWidth: null
			, isMobile: $(window).width()>=750? false:true
			, subjectItem: null
			, scGrade: $('body').data('scGrade')	// 사용자 seq
			, myTextBookSeq: null					// 내교과서
			, myScrapList: []					// 내교과서
			, selectedTab: null
			, queryData: {
				  query: ''							// 검색어
				, requery: ''						// 결과 내 검색어
				, rt: ''							// 결과 내 검색 여부(1)
				, collection: ''					// 검색 대상 SP 명
				, startCount: ''					// 검색 결과 시작위치
				, listCount: ''						// 검색 결과 출력 건수
				, sort: ''							// 정렬 기준(000 정확도순 | 001 최근 등록일 순 | 002 코드번호 순)
			}
			, queryResult: null						// 검색결과값
			, autocomplete: null					// 자동완성 텍스트 리스트
			, resultType1: null						// 결과 아이템 폼 1
			, resultType2: null						// 결과 아이템 폼 2
			, resultType3: null						// 결과 아이템 폼 3
			, listCntResult: 20						// 탭검색시 표기할 결과 수
		},


		/**
		 * 통신 객체- call
		 *
		 * @memberOf screen
		 */
		c: {

			// 통합검색
			search: function() {

				let searchTxt = $('#search-txt').val();

				// 통합 검색어가 비어있을 시 처리
				if($text.isEmpty(searchTxt)) {
					$msg.alert('검색어를 입력해 주세요.');
					return;
				}

				screen.v.queryData.query = searchTxt;			// 통합검색 검색어
				screen.v.queryData.requery = '';				// 결과 내 재검색 초기화
				$('.search-section .search-menu .research input').val('');

				// 하단 상세 조건 리셋
				let detailChecks = $('.search-detail-block li');
				$.each(detailChecks, function(i,v) {
					let checkboxes = v;
					$(checkboxes).find('div:eq(1) input').prop('checked', false); 		// 모든 세부 조건 checked 해제
					$(checkboxes).find('div:eq(1) input:first').prop('checked', true); 	// 조건 라인별 첫번째(전체)만 선택
				})

				// 전체 탭 click(검색 api 호출)
				$('.result-tab li a[data-tabno="0"]').click();

			},

			// 결과 내 재검색
			research: function() {

				// 통합 검색어가 비어있을 시 재검색 텍스트를 통합검색 텍스트로 이동
				if($text.isEmpty(screen.v.queryData.query)) {
					$('.search-section .sForm1 .search-form input').val($('.search-section .search-menu .research input').val());
					screen.c.search();
					return;
				} else {$('.search-section .sForm1 .search-form input').val(screen.v.queryData.query);}

				// 재검색 검색어 추가 처리
				if($text.isEmpty(screen.v.queryData.requery)) {

					screen.v.queryData.requery += $('.search-section .search-menu .research input').val();
					screen.v.queryData.rt = '';

				}
				else if(!$text.isEmpty($('.search-section .search-menu .research input').val())){

					screen.v.queryData.requery += '|, '+$('.search-section .search-menu .research input').val();
					screen.v.queryData.rt = 1;

				}
				$('.search-section .search-menu .research input').val('');

				// 전체 탭 click(검색 api 호출)
				$('.result-tab li a[data-tabno="0"]').click();

			},

			// 검색 api 호출
			callSearchApi: function() {

				// 검색어 리스트 변경
				screen.f.changeQueryText();

				let query = screen.v.queryData.query;
				if(!$text.isEmpty(screen.v.queryData.requery)) {
					$.each(screen.v.queryData.requery.split('|,'), function(i,v){query += '|,'+v;})
				}

				const options = {
					url: '/Search/SearchNewEle.mrn',  // apiUrl
					loading: false,
					data: {
							query: query												// 검색어
							, requery: screen.v.queryData.requery						// 결과 내 검색어
							, rt: $text.isEmpty(screen.v.queryData.requery)? 0:1		// 결과 내 검색 여부(1)
							, collection: 'ALL'											// 검색 대상 범위 리스트(ex: creative, textbook)
							, startCount: '0'											// 검색 결과 시작위치
							, listCount:  '5'											// 검색 결과 출력 건수
							, myTextBookSeq: $text.isEmpty(screen.v.myTextBookSeq)? '' : screen.v.myTextBookSeq.replaceAll(',','|')
							//, sort: param.sort										// 정렬 기준(000 정확도순 | 001 최근 등록일 순 | 002 코드번호 순)
							, my: $('.search-menu .my-data .btn-datagroup .on').data('my-tf') == 1 ? 'y' : ''
					},
					success: function(res) {

						screen.v.queryResult = res.resultSet;
						let result = res.resultSet;

						//브라우저 URL 변경
						let txt = '';
						txt += 'searchTxt='+screen.v.queryData.query;
						if(!$text.isEmpty(screen.v.queryData.requery)) {
							$.each(screen.v.queryData.requery.split('|,'), function(i,v){txt += ','+v;})
						}


						$cmm.changeBrowserAddressBarUrl('/Search/Search.mrn?'+txt);

						// 탭별 결과 카운트 처리
						let totalCnt = 0;
						$.each(result, function(i,v) {

							//if(v.collectionType == 'spGetSearchEngineTotal') {return true;} // 엠카이브 비활성화

							totalCnt += v.totalCount;

							// 검색 탭 카운트
							let resultTab = $('.result-tab li a[data-sp='+v.collectionType+']');
							resultTab.find('span').text(resultTab.data('title')+'('+$num.comma(v.totalCount)+')');

							// 결과 탭별 카운트
							let resultBlock = $('.result-block[data-tabno='+resultTab.data('tabno')+']');
							resultBlock.find('.result-header .tit').text(resultTab.data('title')+'('+$num.comma(v.totalCount)+')');
						})
						$('.result-tab li a[data-tabno=0] span').text('전체'+'('+$num.comma(totalCnt)+')');

						// 결과값 없으면 no-data
						screen.f.resultYn(totalCnt > 0 ? true : false);

						// 결과값 세팅
						screen.f.setContents(res, 'all');

						// 숏컷(shortcut) 조회/세팅
						screen.c.setShortCut();

					}
				};
				$cmm.ajax(options);
			},


			setShortCut: function(){

				let query = screen.v.queryData.query;
				if(!$text.isEmpty(screen.v.queryData.requery)) {
					$.each(screen.v.queryData.requery.split('|,'), function(i,v){query += '|,'+v;})
				}

				const options = {
					url: '/Search/SearchNewEleShortCut.mrn',  // apiUrl
					loading: false,
					data: {
							query: query												// 검색어
							, schoolGrade: 'ele'
					},
					success: function(res) {

						// 결과값이 없으면 hidden
						if(res.totalCount == 0) {
							$('.shortcut').addClass('hidden');
						} else {

							$('.shortcut div').remove();
							$('.search-nodata').addClass('hidden')

							$.each(res.result, function(i,v){

								let item = screen.v.resultType5.clone();
								$(item).find('a').attr('href', v.url);
								$(item).find('a').attr('target', '_blank');
								let txt = '';
								txt += ($text.isEmpty(v.depth1)||v.depth1=='-') ? '' : v.depth1;
								txt += ($text.isEmpty(v.depth2)||v.depth2=='-') ? '' : ' | ' + v.depth2;
								txt += ($text.isEmpty(v.depth3)||v.depth3=='-') ? '' : ' | ' + v.depth3;
								$(item).find('a').html('<span><em>' + v.menuName + '</em> 바로가기</span>' + txt);

								$('.shortcut').append(item);

							})

							$('.shortcut').removeClass('hidden');
						}

					}
				};
				$cmm.ajax(options);

			},


			// 필터 포함 검색 api 호출(탭별 검색)
			callSearchApiWithFilter: function(tabno, startCount) {
				if($text.isEmpty(tabno)) tabno = 0;

				$('.paging-search').addClass('hidden');

				// 검색어 리스트 변경
				screen.f.changeQueryText();

				// 검색 data
				let param = {...screen.v.queryData}; // deep copy

				// 검색조건 세팅
				let filterList = $('.search-detail-block li:not(.hidden)');
				$.each(filterList, function(i,v) {
					let filterCol = $(v).data('col');
					let items = '';
					let filterItems = $(v).find('input[type=checkbox]:checked');
					$.each(filterItems, function(i,v){
						if(i==0) items += $(v).data('val');
						else	 items += ','+$(v).data('val');
					})

					param[filterCol] = items;
				})

				let query = screen.v.queryData.query;
				if(!$text.isEmpty(screen.v.queryData.requery)) {
					$.each(screen.v.queryData.requery.split(','), function(i,v){query += ','+v;})
				}
				param.query = query;

				// my 항목 추가
				let my = $('.search-menu .my-data .btn-datagroup .on').data('my-tf');
				if(my == '1') {
					param.my = 'y';
				}

				param.collection = $('.result-tab a[data-tabno='+tabno+']').data('sp');
				param.startCount = $text.isEmpty(startCount)? 0 : startCount;
				param.listCount = screen.v.listCntResult;
				if(!$text.isEmpty(screen.v.queryData.requery)) param.rt = 1;
				if(!$text.isEmpty(screen.v.myTextBookSeq)) param.myTextBookSeq = screen.v.myTextBookSeq.replaceAll(',','|');

				const options = {
					url: '/Search/SearchNewEle.mrn',  // apiUrl
					loading: false,
					data: param,
					success: function(res) {

						screen.v.queryResult = res.resultSet;
						res.resultSet[0].startCount = param.startCount;

						// 결과값 없으면 no-data
						screen.f.resultYn(res.resultSet[0].totalCount > 0 ? true : false);

						// 결과값 세팅
						screen.f.setContents(res);
					}
				};
				$cmm.ajax(options);


			},

			// 검색 자동완성 api 호출
			callSearchAutocompleteApi: function() {

				$('.sForm1 .search-form .search-txt').autocomplete({
					source: function(request, response) {
						$.ajax({
							type: 'post',
							url: '/Search/Autocomplete.mrn',
							dataType: 'json',
							loading: false,
							data: {
								query: $('.sForm1 .search-form .search-txt').val(),					// 입력중인 검색어
							},
							success: function(res) {
								screen.v.autocomplete = $objData.getSetFilter2(res.result, 'keyword', 'hkeyword');
								response(										// 서버에서 json 데이터 response 후 목록 추가
									$.map(res.result, function(item) {
										return {
											label: item.hkeyword,
											value: item.keyword
										}
									})
								);
							}
						});
					},

					select: function(event, ui) { 				// item 선택 시 이벤트
						console.log(ui.item);
						$('.search-txt').val(ui.item.value);
						screen.c.search();
					},
					focus: function(event, ui) { 				// 포커스 시 이벤트
						return false;
					},
					minLength: 1, 								// 최소 글자 수
					delay: 0, 									// 입력창에 글자가 써지고 나서 autocomplete 이벤트 발생될 떄 까지 지연 시간(ms)
					autoFocus: false, 							// true로 설정 시 메뉴가 표시 될 때, 첫 번째 항목에 자동으로 초점이 맞춰짐
					classes: { 									// 위젯 요소에 추가 할 클래스를 지정
						'ui-autocomplete': 'highlight'
					},
					disable: false, 							// 해당 값 true 시, 자동완성 기능 꺼짐
				}).autocomplete('instance')._renderItem = function(ul, item) { // UI 변경 부분

					return $('<li>') //기본 tag가 li
						.append('<div>' + item.label + '</div>') // 원하는 모양의 HTML 만들면 됨
						.appendTo(ul);
				};
			},

			// 내 교과서 가져오기
			myTextbook: function() {

				// 로그인 체크(내 교과서 가져올 때)
				if($text.isEmpty(screen.v.scGrade)) {

					// my 버튼 처리
					$('.my-data .btn-datagroup .data').removeClass('on');
					$('.my-data .btn-datagroup .data:last').addClass('on');
					$('.my-data').attr('disabled', true);
					return;
				}
				$('.my-data').attr('disabled', false);

				const options = {
					url: '/Search/MyTextbookList.mrn',
					data: {},
					success: function(res) {
						if (res.resultData.length > 0) {
							screen.v.myTextBookSeq = '';
							$.each(res.resultData, function(i,v) {
								if(i != 0) screen.v.myTextBookSeq += ',';
								screen.v.myTextBookSeq += this.textbookSeq;
							})
						}
					}
				};
				$cmm.ajax(options);

			},

			// 내 스크랩 가져오기
			myScrap: function() {

				screen.v.myScrapList = [];
				// 로그인 체크
				if($text.isEmpty(screen.v.scGrade)) return;

				const options = {
					url: '/Search/MyScrapList.mrn',
					data: {},
					success: function(res) {
						$.each(res.resultData, function(i,v) {
							screen.v.myScrapList.push(v.contentsSeq.toString());
						})
					}
				};
				$cmm.ajax(options);

			},

			// 엠카이브 세팅
			mchive: function(grade) {
				// grade 사이트에 맞춰 default ele [all, ele, mid]
				if($text.isEmpty(grade)) grade = 'ele';

				const options = {
					url: '/Search/SearchNewEleMchiveHead.mrn',
					data: {
					    schoolGrade: grade,
					    listCount: 100
					},
					success: function(res) {

						let subject = null;
						let theme = null;
						if(res.resultSet[0].collectionType == 'spGetSearchEngineSubject') {
							subject = res.resultSet[0];
							theme = res.resultSet[1];
						} else {
							subject = res.resultSet[1];
							theme = res.resultSet[0];
						}

						let cloneInput = null;
						let cloneLabel = null;

						// 과목 세팅
						$('.mchive .mchive-subject-theme').find('input').prop('checked',false);
						$('.mchive .mchive-subject-theme').find('input:ep(1)').prop('checked',true);
						$('.mchive .msubject').find('input:not(:first)').remove();
						$('.mchive .msubject').find('label:not(:first)').remove();

						if(subject.totalCount > 0) {
							$.each(subject.result, function(i,v){

								cloneInput = screen.v.mchiveHead1.clone();
								cloneLabel = screen.v.mchiveHead2.clone();

								cloneInput.attr('id', 'mchiveSubject'+(i+1));
								cloneInput.data('val', v.csSubjectCd);
								cloneInput.prop('checked', false);

								$('.mchive .msubject').append(cloneInput);

								cloneLabel.attr('for', 'mchiveSubject'+(i+1));
								cloneLabel.text(v.csSubjectNm);

								$('.mchive .msubject').append(cloneLabel);


							})
						}

						// 테마 세팅
						$('.mchive .mtheme').find('input:not(:first)').remove();
						$('.mchive .mtheme').find('label:not(:first)').remove();

						if(theme.totalCount > 0) {
							$.each(theme.result, function(i,v){

								cloneInput = screen.v.mchiveHead1.clone();
								cloneLabel = screen.v.mchiveHead2.clone();

								cloneInput.attr('id', 'mchiveTheme'+(i+1));
								cloneInput.data('val', v.csCategorySeq);
								cloneInput.prop('checked', false);

								$('.mchive .mtheme').append(cloneInput);

								cloneLabel.attr('for', 'mchiveTheme'+(i+1));
								cloneLabel.text(v.csCategoryName);

								$('.mchive .mtheme').append(cloneLabel);


							})
						}

					}
				};
				$cmm.ajax(options);

			},

			// tab All
			bindTasbAllList: function() {
				const tabNo = $('.result-tab li.on a').data('tabno');
				screen.c.callSearchApi(tabNo);
			},

			// tab One
			bindTasbOneList: function() {
				const tabNo = $('.result-tab li.on a').data('tabno');
				screen.c.callSearchApiWithFilter(tabNo);
			},

			// 검색 상세 조건 조회, 반영
			searchDetailItemAdd: function() {

				// 전체버튼 / 그외 버튼 눌렀을때 처리
				let clicked = $(this);
				let clickedId = clicked.attr('id');
				let clickedLi = $(clicked.parents('li'));
				let clickedLiFirstId = clickedLi.find('input[type=checkbox]:first').attr('id');
				let optionChecked = clickedLi.find('input[type=checkbox]:not(:first):checked');
				let optionList	  = clickedLi.find('input[type=checkbox]:not(:first)');

				// 전체버튼 클릭시
				if(clickedId == clickedLiFirstId) {
					// 항목들 불을 끄고 전체버튼만 온
					$('#'+clickedLiFirstId).prop('checked', true);
					clickedLi.find('input[type=checkbox]:not(:first)').prop('checked',false);

				// 전체 외 버튼 클릭시
				} else if (clickedId != clickedLiFirstId ){

					// 전체 항목이 모두 선택될 시
					if(optionChecked.length === optionList.length) {
						$('#'+clickedLiFirstId).click();
					} else if(optionChecked.length === 0){

						clickedLi.find('input[type=checkbox]:first').prop('checked', true);
						clickedLi.find('input[type=checkbox]:first').addClass('on');

					} else {

						// 전체버튼을 끄고 선택된 항목들만 온
						clickedLi.find('input[type=checkbox]:first').prop('checked', false);
						//clickedLi.find('input[type=checkbox]:not(:first)').prop('checked', false);
					}
				}

				const tabNo = $('.result-tab li.on a').data('tabno');
				screen.c.callSearchApiWithFilter(tabNo);
			},

		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screen
		 */
		f: {

			// 게시판 변경 나오게 처리
			changeSearchGroupTab: function(e) {

				if($text.isEmpty(screen.v.queryData.query)){
					$msg.alert('검색어를 입력해 주세요.');
					return;
				}

				const tabNo = $(this).data('tabno');

				e.preventDefault();
				$(this).parent().addClass('on').siblings('li').removeClass('on');

				// 전체 선택
				if (tabNo == '0') {

					// 전체 목록 블럭 표시
					if(!$text.isEmpty(screen.v.queryResult)) {	$('.result-block').removeClass('hidden');  }

					$('.result-block .more').removeClass('hidden');									// 더보기 표시
					$('.paging-search').addClass('hidden');											// 페이지 숨김
					$('.search-detail-block').addClass('hidden');									// 상세검색 숨김
					$('.search-detail').addClass('hidden');											// 상세검색 숨김
					//$('.shortcut').removeClass('hidden');											// 숏컷 on/off

					// 전체 정보 조회
					screen.c.bindTasbAllList();

				}
				// 상세 탭 선택
				else {

					$('.result-block').addClass('hidden');											// 전체 목록 블럭 숨김
					$('.result-block .more').addClass('hidden');									// 더보기 숨김

					$('.result-block[data-tabno='+tabNo+']').removeClass('hidden');					// 해당 탭 블럭 표시
					$('.paging-search').removeClass('hidden');										// 해당 탭 페이지 표시
					$('.search-detail-block').removeClass('hidden');								// 상세검색 표시
					$('.search-detail').removeClass('hidden');										// 상세검색 표시
					$('.shortcut').addClass('hidden');												// 숏컷 on/off

					// 탭 상세검색 내부 처리 호출
					screen.f.searchDetailItemSet($(this).data('type'));

					// tab 하나 조회
					screen.c.bindTasbOneList();
				}

				$('.result-tab').slick('goTo', tabNo);

				/*정렬 샘플*/
				/*const ol = $('.slick-slide.slick-active').offset().left + $('.slick-slide.slick-active').width()/2;
				$('.slick-list').scrollLeft(ol);*/

			},

			// 탭 상세검색 내부 처리
			searchDetailItemSet: function(e) {

				$('.search-detail-block .check-list li').addClass('hidden');
				$('.search-detail-block .check-list li.'+e).removeClass('hidden');
				screen.v.selectedTab = e;

				// 탭 선택시 내부 상세 초기화 부분(지워둠)
				//$('.search-detail-block .check-list li.'+e+' input[type=checkbox]').prop('checked', false);
				//$('.search-detail-block .check-list li.'+e+' input[type=checkbox]:first').click(); // 맨 앞 전체 항목 선택

			},

			// 더보기 클릭시
			moreGoTab: function() {

				const tabNo = $(this).parents('.result-block').data('tabno');
				$('.result-tab li').find('[data-tabno='+tabNo+']').click();

			},

			// 검색어 리스트 변경시 현재 검색어들 표기 부분
			changeQueryText: function() {

				$('.search-txtdata').children().remove();
				$('.search-txtdata').text('');
				$('.search-txtdata').removeClass('hidden');
				$('.search-txtdata').append('<span>'+screen.v.queryData.query+'</span>');
				if(!$text.isEmpty(screen.v.queryData.requery)) {

					let researchList = screen.v.queryData.requery.split('|,');
					$.each(researchList, function() {
						$('.search-txtdata').append(', <span>'+this.trim()+'</span>');
					})
				}
				const searchKeywordTxt = $('.search-txtdata').html()+' 의 검색결과 입니다.';
				$('.search-txtdata').html(searchKeywordTxt);

			},

			// 검색결과 유무에 따른 처리
			resultYn: function(flg) {

				if(flg) {
					$('.search-nodata').addClass('hidden');
					$('.result-block').removeClass('hidden');
					$('.paging-search').removeClass('hidden');
				} else {
					screen.f.nodataText();
					$('.search-nodata').removeClass('hidden');
					$('.result-block').addClass('hidden');
					$('.paging-search').addClass('hidden');
				}

			},

			// 검색결과로 컨텐츠 세팅
			setContents: function(res, flg) {

				let resultMenu = $('.result-menu li');
				 $('.result-block').addClass('hidden');
				 $("#ui-id-1").hide();

				$.each(res.resultSet, function(i,v){

					// 페이징 (전체 아닐때만)
					if(res.resultSet.length == 1) screen.f.setPages(res.resultSet[0].totalCount, res.resultSet[0].pageCount, res.resultSet[0].startCount);
					else $('.paging-search').addClass('hidden');

					let tabno = $(resultMenu).find('a[data-sp='+v.collectionType+']').data('tabno');
					let resultBlock = $('.result-block[data-tabno='+tabno+']');
					let resultType = $(resultBlock).data('restype');
					if(v.totalCount != 0) $(resultBlock).removeClass('hidden');
					$(resultBlock).find('ul li').remove();

					// 결과 탭별 카운트
					let resultTab = $('.result-tab li a[data-sp='+v.collectionType+']');
					resultBlock.find('.result-header .tit').text(resultTab.data('title')+'('+v.totalCount+')');

					// 결과값 내 루프로 데이터 append
					let item;

					$.each(v.result, function(j,c){

						item = null;

						switch(resultType) {

							case 'type1':

								item = screen.v.resultType1.clone();
								item.find('img').attr('src', c.textbookThumbnailUrl);
								item.find('.txt dl dt').html(`${c.textbookTitle}`);
								if($text.isEmpty(c.textbookLessonSubjectTitle))	item.find('.txt dl dd').html(c.textbookLessonPeriodName);
								else											item.find('.txt dl dd').html(c.textbookLessonSubjectTitle);
								let text = '';
								if(!$text.isEmpty(c.textbookLessonUnitHighName)) text += `대단원 ${c.textbookLessonUnitHighNum}. ${c.textbookLessonUnitHighName}`;
								if(!$text.isEmpty(c.textbookLessonUnitMidName))  text += ` | 중단원 ${c.textbookLessonUnitMidNum}. ${c.textbookLessonUnitMidName}`;
								if(!$text.isEmpty(c.textbookLessonUnitLowName))  text += ` | 소단원 ${c.textbookLessonUnitLowNum}. ${c.textbookLessonUnitLowName}`;
								item.find('.txt dl .dd01').html(text);

								if (!$text.isEmpty(c.ebookUrl)) {
									item.find('.btn-group').find('.ebook').data('url', c.ebookUrl);
									item.find('.btn-group').find('.ebook').attr('target', '_blank');
								}
								else item.find('.btn-group').find('.ebook').remove();

								if(c.smartpptOtherUrlYn == 'Y') {				item.find('.btn-group').find('.smart').addClass('url');
																				item.find('.btn-group').find('.smart').data('url', c.smartpptOtherUrl);

								} else if(!$text.isEmpty(c.textbookLessonSeq))	item.find('.btn-group').find('.smart').data('textbookLessonSeq', c.textbookLessonSeq);

								else											item.find('.btn-group').find('.smart').remove();

								break;

							case 'type2':

								item = screen.v.resultType2.clone();

								item.find('.text-box .file').addClass(c.extension.toLowerCase());
								item.find('.text-box .file').text(c.extension.toLowerCase());

								item.find('.txt dl dt').html(`${c.dataTypeNm} | ${c.contentsTextbookTitle}`);
								let txt = '';
								txt += c.textbookTitle;
								if(!$text.isEmpty(c.textbookMainAuth)) txt += `(${c.textbookMainAuth})`;
								item.find('.txt dl dd').html(txt);

								let contentSeq = '';
								let contentsTextbookCategoryDiv = '';
								if (!$text.isEmpty(c.contentsTextbookPeriodSeq)) {
									contentSeq = c.contentsTextbookPeriodSeq;
									contentsTextbookCategoryDiv = 'PERIOD';
								} else if (!$text.isEmpty(c.contentsTextbookUnitSeq)) {
									contentSeq = c.contentsTextbookUnitSeq;
									contentsTextbookCategoryDiv = 'UNIT';

								} else if (!$text.isEmpty(c.contentsTextbookSeq)) {
									contentSeq = c.contentsTextbookSeq;
									contentsTextbookCategoryDiv = 'TEXTBOOK';
								}

								if(!$text.isEmpty(contentSeq)){
									item.find('.btn-group').find('.preview').data('contentSeq', contentSeq);
									item.find('.btn-group').find('.scrap').data('contentSeq', contentSeq);
								}

								// fileid 있을 때
								if(c.dataType == 'FILE' && !$text.isEmpty(c.fileId)) {

									item.find('.btn-group').find('.preview').data('fileid', c.fileId);

									screenUI.f.setHistoryData(
										item.find('.btn-group').find('.preview')				// el 객체

										, $text.isEmpty($('body').data('scGrade'))? true : false		// userTf 로그인여부 (1:스킵 0:저장)
										, 'TEXTBOOK'													// 대메뉴 구분(TEXTBOOK / MAIN / EXTRA)
										, contentsTextbookCategoryDiv									// 중메뉴 구분
										, 'PREVIEW'														// action 설정
										, contentSeq													// seq
										, ''
										, ''
										, 'SEARCH'														// target_content2 : from Search Page
									)

								}

								// dataType LINK 일 때
								else if(c.dataType == 'LINK') {

									// LINK 항목의 경우 Extra 항목들의 Link 결과처럼 나오도록 수정 (23.1.20)
									item.find('.btn-group').find('.preview').remove();
									item.find('.btn-group').find('.down').remove();
									item.find('.btn-group').find('.scrap').remove();
									item.find('.btn-group').append(`<a href="javascript:;" class="urlgo"></a>`);
									item.find('.btn-group').find('.urlgo').data('url', c.contentsTextbookUrl);
									item.addClass('urlgo');

									screenUI.f.setHistoryData(
										item.find('.btn-group').find('.urlgo')							// el 객체

										, $text.isEmpty($('body').data('scGrade'))? true : false		// userTf 로그인여부 (1:스킵 0:저장)
										, 'TEXTBOOK'													// 대메뉴 구분(TEXTBOOK / MAIN / EXTRA)
										, contentsTextbookCategoryDiv									// 중메뉴 구분
										, 'CLICK'														// action 설정
										, contentSeq													// seq
										, ''
										, ''
										, 'SEARCH'														// target_content2 : from Search Page
									)

									item.find('.file').remove();

								}
								else {
									item.find('.btn-group').find('.preview').remove();
									item.find('.file').remove();
								}

								if(!$text.isEmpty(c.downloadYn) && c.downloadYn == 'Y')	{

									item.find('.btn-group').find('.down').data('fileid', c.fileId);
									screenUI.f.setHistoryData(
										item.find('.btn-group').find('.down')					// el 객체

										, $text.isEmpty($('body').data('scGrade'))? true : false		// userTf 로그인여부 (1:스킵 0:저장)
										, 'TEXTBOOK'											// 대메뉴 구분(TEXTBOOK / MAIN / EXTRA)
										, c.contentsTextbookDiv									// 중메뉴 구분
										, 'DOWNLOAD'											// action 설정
										, contentSeq											// seq
										, ''
										, ''
										, 'SEARCH'												// target_content2 : from Search Page
									)


								}
								else														item.find('.btn-group').find('.down').addClass('disable');


								// myScrapList 비교하여 스크랩 on
								if(screen.v.myScrapList.includes(contentSeq)) item.find('.btn-group').find('.scrap').addClass('on');

								if(!$text.isEmpty(c.textbookSeq))			item.find('.btn-group').find('.scrap').data('textbookSeq', c.textbookSeq);
								else										item.find('.btn-group').find('.scrap').remove();

								if(!$text.isEmpty(contentSeq))				item.find('.btn-group').find('.scrap').data('contentSeq', contentSeq);
								//if(!$text.isEmpty(c.contentsTextbookDiv))	item.find('.btn-group').find('.scrap').data('contentsTextbookPeriodDiv', c.contentsTextbookDiv);
								item.find('.btn-group').find('.scrap').data('contentsTextbookCategoryCd', c.dataTypeCd);
								item.find('.btn-group').find('.scrap').data('contentsTextbookCategoryDiv', contentsTextbookCategoryDiv);

								//if(c.resultType === '단원 자료') item.find('.btn-group').find('.scrap').remove();
								//if(c.resultType === '단원 자료') item.find('.btn-group').find('.scrap').addClass('disable');

								break;

							case 'type3':

								item = screen.v.resultType3.clone();

								let ext = ['hwp', 'pdf', 'mp4', 'jpg', 'zip', 'mp3', 'ppt', 'pptx', 'xls', 'xlsx'];
								if(!ext.includes(c.fileExtension.toLowerCase()) && c.dataType == 'FILE') {c.fileExtension = 'etc';}

								item.find('.text-box .file').addClass(c.fileExtension.toLowerCase());
								item.find('.text-box .file').text(c.fileExtension.toUpperCase());

								item.find('.txt dl dd').html(`${c.categoryNm}`);

								if(c.dataType == 'FILE') {

									if(!$text.isEmpty(c.fileId)) {
										item.find('.txt dl dt').html(`${c.originFileName}`);
										item.find('.btn-group').find('.contgo').data('fileid', c.fileId);

										screenUI.f.setHistoryData(
											item.find('.btn-group').find('.contgo')					// el 객체

											, $text.isEmpty($('body').data('scGrade'))? true : false		// userTf 로그인여부 (1:스킵 0:저장)
											, 'EXTRA'												// logDiv (TEXTBOOK / MAIN / EXTRA)
											, !!c.emcSeq? 'cmm_bbs' : 'EXTRA'						// targetModule
											, 'CLICK'												// action 설정(링크클릭)
											, c.extraSeq											// targetKey1
											,  $text.isEmpty(c.emcSeq)? null : c.emcSeq				// targetKey2
											, ''                                                    // targetcontent1
											, 'SEARCH'												// targetcontent2 : from Search Page
										)
										item.find('.btn-group').find('.down').data('fileid', c.fileId);

										item.find('.btn-group').find('.urlgo').remove();

									}
/*
									if(!$text.isEmpty(c.fileId)) {
										item.find('.txt dl dt').html(`${c.originFileName}`);
										item.find('.btn-group').find('.contgo').data('fileid', c.fileId);
										item.find('.btn-group').find('.down').data('fileid', c.fileId);

										item.find('.btn-group').find('.urlgo').remove();

									} else if(!$text.isEmpty(c.fileUrl)) {
										item.find('.txt dl dt').html(`${c.extraTitle}`);
										item.addClass('urlgo');
										item.find('.btn-group').find('.urlgo').data('url', c.fileUrl);

										item.find('.btn-group').find('.contgo').remove();
										item.find('.btn-group').find('.down').remove();
									}

*/
								} else if(c.dataType == 'LINK') {

									item.find('.txt dl dt').html(`${c.extraTitle}`);

									if(!$text.isEmpty(c.url)) {
										item.find('.btn-group').find('.urlgo').data('url', c.url);
										item.addClass('urlgo');
										//item.data('url', c.url);
										screenUI.f.setHistoryData(
											item.find('.btn-group').find('.urlgo')					// el 객체

											, $text.isEmpty($('body').data('scGrade'))? true : false		// userTf 로그인여부 (1:스킵 0:저장)
											, 'EXTRA'												// logDiv (TEXTBOOK / MAIN / EXTRA)
											, !!c.emcSeq? 'cmm_bbs' : 'EXTRA'						// targetModule
											, 'CLICK'												// action 설정(링크클릭)
											, c.extraSeq											// targetKey1
											,  $text.isEmpty(c.emcSeq)? null : c.emcSeq				// targetKey2
											, ''                                                    // targetcontent1
											, 'SEARCH'												// targetcontent2 : from Search Page
										)
									}
									else item.find('.btn-group').find('.urlgo').remove();

									item.find('.btn-group').find('.contgo').remove();
									item.find('.btn-group').find('.down').remove();
									item.find('.file').remove();
								}

								break;

							case 'type4':

								item = screen.v.resultType4.clone();

								item.find('.thumb img').attr('src',c.thumbnailFullUrl);
								item.find('a').attr('href', c.contentFullUrl);
								item.find('a').attr('target', '_blank');
								item.find('p.tit').html(c.title);

								break;

						}

						/*
						if(!$text.isEmpty(c.textbookSeq) && !$text.isEmpty(screen.v.myTextBookSeq)){
							let list = screen.v.myTextBookSeq.split(',');
							$.each(list, function(i, v) {
								if(v.toString() == c.textbookSeq) {
									item.find('.my').addClass('on') ;
								}
							})
						}
						*/

						if(c.isMyTextBook === 0) {
							item.find('.ismy').removeClass('on');
						} else {
							item.find('.ismy').addClass('on');
						}

						// 부모 리스트에 버튼 갯수 추출
						const btnCnt = item.find('.btn-group a').length;
						item.addClass('btnCnt'+ btnCnt);

						// append
						$(resultBlock).find('.result-list').append(item);
					})
				})
			},

			// 페이징 세팅
			setPages: function(total, rowCnt, page) {
				page ++;

				$('.paging-search a.no').removeClass('active');

				let target = '.paging-search';

				if (total > 0) {
					$(target).removeClass('hidden');
				} else {
					$(target).addClass('hidden');
				}

				$(target).data('cnt', total);
				var startPage = Math.floor((page-1) / 10) * 10 + 1;
				var endPage = startPage + 9;
				var totalPage = total == 0 ? 0 : Math.ceil(total / screen.v.listCntResult);

				endPage = endPage > totalPage ? totalPage : endPage;

				$(target + ' .next').data('page', endPage + 1);
				$(target + ' .pre').data('page', startPage - 1);

				// 이전 상태 처리
				if (page > 10) {
					$(target + ' .pre').removeClass('disabled');
				} else {
					$(target + ' .pre').addClass('disabled');
				}

				// 다음 상태 처리
				if (totalPage > endPage) {
					$(target + ' .next').removeClass('disabled');
				} else {
					$(target + ' .next').addClass('disabled');
				}

				var p = startPage;
				$(target + ' a.no').each(function() {
					if (p > totalPage) { $(this).addClass('disabled', 'hidden'); }
					else { $(this).removeClass('disabled', 'hidden'); }

					if (p == page) { $(this).addClass('active'); }
					else { $(this).removeClass('active, hidden'); }

					$(this).text(p++);
				});

			},

			// 페이지 클릭
			pageClick: function(e) {

				if($(e).hasClass('disabled')) return;

				$('.paging-search a.no').removeClass('active');
				$(e).addClass('active');

				let tabNo = $('.result-tab li.on a').data('tabno');
				let p = $(e).text();

				screen.c.callSearchApiWithFilter(tabNo, p-1);

			},

			// 페이지 이동 클릭
			pageMoveClick: function(e) {

				let pagecnt = screen.v.listCntResult;
				let tabNo = $('.result-tab li.on a').data('tabno');
				let p = $(e).data('page');
				let test = $(e).attr('class');
				let max = Math.ceil(screen.v.queryResult[0].totalCount / pagecnt);
				let t = $(e);

				let m = p;
				// 버튼별 처리
				if(t.hasClass('pre-end')) {
					p = 1;
				} else if(t.hasClass('next-end')) {
					p = max;
				} else if(t.hasClass('pre')) {
					p = p > 10 ? m : 1;
				} else if(t.hasClass('next')) {
					p = p+10 < max ? m : max;
				}

				screen.c.callSearchApiWithFilter(tabNo, p-1);

			},


			// 결과값 없을 때 처리
			nodataText: function() {

				let text = '';
				let query = screen.v.queryData.query;
				let requery = screen.v.queryData.requery.split(',');

				if(!$text.isEmpty(query)) text += `<span>${query}</span>`;
				$.each(requery, function(i, v){
					if(!$text.isEmpty(v)) text += `,<span>${v}</span>`;
				})
				text += '의 검색결과가 없습니다.'

				$('.search-nodata p').html(text);
				$('.paging-search').addClass('hidden');
			},

		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screen
		 */
		event: function() {

			// 페이지 클릭시
			$('.paging-search a.no').click(function(e) {
				screen.f.pageClick(e.target)
			})

			// 페이지 옆 이동 클릭시
			$('.paging-search .pre, .paging-search .pre-end, .paging-search .next, .paging-search .next-end').click(function(e) {
				screen.f.pageMoveClick(e.target)
			})

			// My On Off 클릭
			$('.btn-datagroup .data').on('click', function(e) {
				if($text.isEmpty(screen.v.scGrade)) {
					screenUI.f.loginConfirm();
					return;
				}

				$(e.target).addClass('on').siblings('button').removeClass('on');
				let tabno = $('.result-menu .result-tab li.on a').data('tabno');

				// 전체 탭 click(검색 api 호출)
				$('.result-tab li a[data-tabno='+tabno+']').click();
			});

			// 슬라이드 클릭
		    $('.result-tab li a').click(screen.f.changeSearchGroupTab);

			// 더보기 클릭
		    $('.result-block .result-header a.more').click(screen.f.moreGoTab);

			// slick 설정
			var $resultSlider = $('.result-tab');
			$resultSlider.on('init',function(event, slick){
				 //$(this).find('li a:first').click();
			});

			$resultSlider.slick({
				dots: false
				, arrows: false
				, infinite: false
				, slidesToShow: 5
				, slidesToScroll: 2
				, responsive: [
					  { breakpoint: 900, settings: { slidesToShow: 4 } }
					, { breakpoint: 767, settings: { slidesToShow: 3 } }
				]
				, variableWidth: false
				, centerMode: false
			});

			$('.result-menu .btn-prev').click(function() {
				$resultSlider.slick('slickPrev');
			});
			$('.result-menu .btn-next').click(function() {
				$resultSlider.slick('slickNext');
			});

			// 검색 상세 확장
			$('.search-detail .btn-detail').click(function(e) {
				e.preventDefault();
				if (!$(this).hasClass('on')) {
					$(this).parent().prev(".search-detail-block").animate({ height: "toggle" }, 100);
					$(this).addClass('on');
				} else {
					$(this).parent().prev(".search-detail-block").animate({ height: "toggle" }, 100);
					$(this).removeClass('on');
				}
				return false;
			});

			// search-detail checkbox click
			//$('.search-detail-block .check-list input[type=checkbox]').change(screen.c.searchDetailItemAdd);
			$(document).on('change', '.search-detail-block .check-list input[type=checkbox]', screen.c.searchDetailItemAdd)

			// 검색 버튼(통합)
			$('.search-section .sForm1 .btn-search').click(screen.c.search);

			// 검색창 X 버튼 클릭시
			$('.search-section .sForm1 .btn-reset').click( () => {
				$('.search-section .sForm1 .search-txt').val('');

				$('.search-section .sForm1 .btn-reset').addClass('d-none');
				$("#ui-id-1").hide();
			});

			// 검색 버튼(결과 내 재검색)
			$('.search-section .research .btn-research').click(screen.c.research);

			// 검색 키 누를때
			$(document).on('keyup', 'input[type=text].search-txt', function(e) {

				// 엔터
				if (e.keyCode == 13) {
					$("#ui-id-1").hide();
					if($(e.target).attr('id')=='search-txt') screen.c.search();
					else screen.c.research();
				}

				// 취소 버튼 표시
				$('.search-section .sForm1 .btn-reset').removeClass('d-none');
			});

			// 검색창 타이핑시 자동완성 api 호출
			$('.sForm1 .search-form .search-txt').keyup(function(e) {
				if (e.keyCode != 13) {
					screen.c.callSearchAutocompleteApi();
				}
			});

			// 자동완성 검색어 클릭
			//$('#ui-id-1 .ui-menu-item div').click(screen.c.search);

			// 로그인 시 검색어 유지
			$('#btnLogin').click(function() {

				// 검색결과값 localStorage 저장
				window.localStorage.setItem('query', screen.v.queryData.query);
				window.localStorage.setItem('requery', screen.v.queryData.requery);

			})

			// 엠카이브 과목테마 동적바인딩
			$('.mchive-subject-theme .sel-check input').click(function(e) {
				screen.c.mchive($(e.target).data('val'));
			})



			/* ============== 이하 기존 페이지 펑션 ============== */

		    // smart ppt 클릭
		    $(document).on('click', '.btn-group .smart', function(e){
				if (ckLogin() == false)return ;
				if (ckMember('002', '교사인증이 필요합니다.') == false)return ;

				if($(e.target).hasClass('url')) {
					//window.open($('body').data('viewerHost')+"/cms/smartppt/mpreview/mpreview.html?source="+'PERIOD'+"&file=" + $(e.target).data('url')
					window.open($(e.target).data('url'), 'smartppt'
										, 'height=' + screen.height	+ ',width=' + screen.width + ' titlebar=yes, scrollbars=no, resizable=yes');
				}
				else {
					var popup = window.open($('body').data('viewerHost')+"/Ebook/v.mrn?playlist=" + $(e.target).data('textbookLessonSeq')
//					var popup = window.open($('body').data('viewerHost')+"/viewer/v.html?playlist=" + $(e.target).data('textbookLessonSeq') // 20230915 | 엠티처-운영/779
										+ "&user="+$('body').data('userIdx')
										, 'smartppt'
										, 'height=' + screen.height	+ ',width=' + screen.width + ' titlebar=yes, scrollbars=no, resizable=yes');
					popup.moveTo(0,0);
					popup.resizeTo(window.screen.availWidth, window.screen.availHeight);
				}

			})

		    // ebook 클릭
		    $(document).on('click', '.btn-group .ebook', function(e){
				if (ckLogin() == false) return ;
				if (ckMember('002', '교사인증을 하시면 다운로드가 가능합니다.') == false)return ;
				window.open($(e.target).data('url'),'','_blank');
			})

		    // down 클릭
		    $(document).on('click', '.btn-group .down:not(.disable)', function(e){
				if (ckLogin() == false)	return ;
				if (ckMember('002', '교사인증을 하시면 다운로드가 가능합니다.') == false)return ;
				downloadMessage();
				//$msg.alert("엠티처 제공 자료는 '학교 수업' 목적을 위해서 사용할 수 있도록 저작권법의 보호를 받고 있습니다.\n수업 외 목적으로 사용되지 않도록 주의 부탁드립니다.");
				var paramBuf = "<input type='hidden' name='fileId' value='"+$(e.target).data('fileid')+"' >";
				$("#idDownload").html(paramBuf);
				document.downloadForm.action = "/File/FileDown.mrn";
				document.downloadForm.submit();
			})

		    // 미리보기 클릭
		    $(document).on('click', '.btn-group .preview, .btn-group .contgo', function(e){
				if (ckLogin() == false)	return ;
				if (ckMember('001', '교사인증을 하시면 미리보기가 가능합니다.') == false) return ;

				// HISTORY ADD
				if(!$(e.target).hasClass('cmmClickHistory')) screenUI.f.clickHistoryEl($(e.target));

				let fg = $(e.target).data('datatype');
				let linkUrl = '';
				if(fg == 'LINK') {

					linkUrl += $('body').data('viewerHost')+"/cms/smartppt/mpreview/mpreview.html?source="+'PERIOD'+"&file=" + $(e.target).data('url')
							+ "&user="+$('body').data('userIdx')+"&contentsTextbookPeriodScrapYn=" + 'Y';

					if(!!$(e.target).data('contentSeq'))  linkUrl += "&contentsTextbookPeriodSeq=" + $(e.target).data('contentSeq');

					window.open(linkUrl, 'preview', 'height=1024,width=768');
				} else {

					linkUrl += "/Ebook/preview.mrn?source=TEXTBOOK&file=" + $(e.target).data('fileid')
							+  "&contentsTextbookPeriodScrapYn=" + 'Y'

					if(!!$(e.target).data('contentSeq'))  linkUrl += "&contentsTextbookPeriodSeq=" + $(e.target).data('contentSeq');

					window.open(linkUrl, 'preview', 'height=1024,width=768');
				}

			})

		    // 스크랩 클릭
		    $(document).on('click', '.btn-group .scrap', function(e){
				if (ckLogin() == false)
					return;
				if (ckMember('002', '교사인증을 하시면 스크랩이 가능합니다.') == false)
					return;

				let data = {
					url : "/Textbook/TextbookScrapJson.mrn",
					type : "get",
					cache : false,
					data : {
						"textbookSeq" : $(e.target).data('textbookSeq'),
						"contentsSeq" : $(e.target).data('contentSeq'),
						"contentsTextbookCategoryCd" :$(e.target).data('contentsTextbookCategoryCd'),
						//"contentsTextbookPeriodDiv" : $(e.target).data('contentsTextbookPeriodDiv'),
						"contentsTextbookCategoryDiv" : $(e.target).data('contentsTextbookCategoryDiv'),
						"createUser" : $('body').data('userIdx'),
					},
					dataType : "json",
					success : function(jsonObj) {
						if (jsonObj.dispMessage) {
							alert(jsonObj.dispMessage);
							return;
						}
						if (jsonObj.result == 'OK') {
							if (jsonObj.isOn != null && jsonObj.isOn == 'create') {
								$(e.target).addClass("on");
							} else {
								$(e.target).removeClass("on");
							}
						}
						screen.c.myScrap();
					},
					error : function() {
						alert("실패하였습니다.");
					}
				}
				$.ajax(data);
				return;
			})

		    // link li click
		    $(document).on('click', 'li.urlgo', function(e){
				if (ckLogin() == false)return ;
				if (ckMember('002', '교사인증을 하시면 다운로드가 가능합니다.') == false) return ;
				let aTag = $(e.target).parents('li.urlgo').find('a');
				let url = $(e.target).parents('li.urlgo').find('a').data('url');

				if($(e.target).hasClass('urlgo')) {
					aTag = $(e.target).find('a');
					url = $(e.target).find('a').data('url');

				} else if($(e.target).hasClass('cmmClickHistory')) {
					aTag = $(e.target);
					url = $(e.target).data('url');
				}

				if($text.isEmpty(url)) url = $(e.target).find('a').data('url');

				screenUI.f.clickHistoryEl(aTag);
				if(url.indexOf('?') > 0) url += '&from=SEARCH';
				else 				     url += '?from=SEARCH';
				window.open(url);
			})
		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screen
		 */
		init: function() {

			screen.v.subjectItem = $('.search-detail-block .check-list .subject').clone();

			screen.v.resultType1 = $('.result-list.type1 li:first').clone();
			screen.v.resultType2 = $('.result-list.type2 li:first').clone();
			screen.v.resultType3 = $('.result-list.type3 li:first').clone();
			screen.v.resultType4 = $('.result-list.type4 li:first').clone();

			screen.v.resultType5 = $('.shortcut div:first').clone();

			screen.v.mchiveHead1 = $('li.mchive .sel-check input:eq(1)').clone();
			screen.v.mchiveHead2 = $('li.mchive .sel-check label:eq(1)').clone();

			$('.result-list.type1 li').remove();
			$('.result-list.type2 li').remove();
			$('.result-list.type3 li').remove();
			$('.result-list.type4 li').remove();

			$('.shortcut div').remove();


			// Event 정의 실행
			screen.event();

			screen.c.myTextbook();
			screen.c.myScrap();
			screen.c.mchive();
			//$('#scGrade1').click();	// 에러 사유

			$('.result-block').addClass('hidden');
			$('.result-block .result-header .tit span').text('');

			$('.search-txt:first').focus().select();

			// 검색결과 남아 있을 시 재검색
			if(!$text.isEmpty(window.localStorage.getItem('query'))) {
				screen.v.queryData.query = window.localStorage.getItem('query');
				$('.search-section .search-form .search-txt').val(window.localStorage.getItem('query'));

				screen.c.research();
			}

			window.localStorage.removeItem('query');
			window.localStorage.removeItem('requery');

			$('.sForm1 .search-form .search-txt').autocomplete();

			// 기본 검색 값이 존재하면
			if (!$text.isEmpty($('.sForm1 .search-form .search-txt').val())) {

				// url로 인한 재검색
				var query = decodeURIComponent(window.location.search).substring(1).split('&');
				$.each(query, function(i,v){

					let vars = v.split('=')[0];
					let vals = v.split('=')[1];

					// searchTxt 처리
					if(vars == 'searchTxt') {

						screen.v.queryData.query = '';
						screen.v.queryData.requery = '';

						// 재검색 검색어 있으면
						if(vals.indexOf(',')>0) {
							//$('#research-txt').val(vals.substring(vals.indexOf(',')+1));
							screen.v.queryData.requery = vals.substring(vals.indexOf(',')+1).replaceAll(',','|,');
							screen.v.queryData.query = vals.split(',')[0];
							$('#search-txt').val(vals.split(',')[0]);

						} else {
							// 검색어 하나만 있으면
							screen.v.queryData.query = vals.replaceAll('+',' ');;
							$('.sForm1 .search-form .search-txt').val(vals);
						}
					}
				})

				screen.c.research();
				$('.search-section .sForm1 .btn-reset').removeClass('d-none');
			}




		}
	};

	screen.init();
});
