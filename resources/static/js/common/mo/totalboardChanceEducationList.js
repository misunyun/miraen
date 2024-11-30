$(function (){
  let screen = {
    v: {
      mainInfoList: JSON.parse($('[name=mainInfoList]').val()),
      subjectLevelCode: $('[name=subjectLevelCode]').val(),
      categorySeq: window.location.href?.split('/').pop(),
      mainId: '',
      mainInfo: {},
      searchCondition: {},
      resultList: [],
      selectedMonth: '',
      monthInfo: {},
      monthInfoList: [],
      eventList: [],
      subjectClassExistenceYn: ''
    },

    c: {
      /**
       * 목록 조회
       * @param {*} pagingNow
       */
      getTotalboardSearchList: () => {
        const options = {
          url: `/pages/ele/board/creativexp/getChanceEducationTotalboardSearchList.ax`,
          method: 'GET',
          data: {
            mainId: screen.v.mainId,
            month: screen.v.selectedMonth
          },
          success: function (res){
            screen.v.resultList = res.rows;

            //N월 배너 사진 & 주제수업 행사명 바인딩
            screen.f.bindMonthDataList();
            screen.f.bindDataList();

            if(res.rows.length === 0 && screen.v.eventList.length === 0){
              screen.f.noDataList();
            }

            toggleThis('.toggle-this');
          }
        };

        $cmm.ajax(options);
      },

      //계기교육 주제수업 게시글이 있는지 확인
      getSubjectClassExistence: () => {
        const options = {
          url: `/pages/ele/board/creativexp/getSubjectClassExistence.ax`,
          method: 'GET',
          data: {
            mainId: screen.v.mainId,
            month: screen.v.selectedMonth
          },
          success: function (res){
            screen.v.subjectClassExistenceList = res.rows;
            screen.v.subjectClassExistenceYn   = res.row.result;

            screen.c.getTotalboardSearchList();
          }
        };

        $cmm.ajax(options);
      },

      getChanceEducationSearchList: () => {
        const options = {
          url: `/pages/${screen.v.subjectLevelCode}/board/creativexp/getChanceEducationSearchList.ax`,
          method: 'GET',
          data: {
            month: screen.v.selectedMonth
          },
          success: function (res){
            screen.v.monthInfo = res?.row;
            screen.v.monthInfoList = res?.row.monthClassList?.split(';');
            screen.v.eventList = res?.rows;

            screen.c.getSubjectClassExistence();
          }
        };

        $cmm.ajax(options);
      },

      /**
       * 스크랩, 좋아요
       * @param {*} type scrapBtn: 스크랩 / likeBtn: 좋아요
       * @param {*} scrapYn Y: 활성화 / N: 비활성화(취소)
       * @param {*} masterSeq
       * @param {*} callback
       */
      doTotalboardScrap: (type, scrapYn, masterSeq, callback) => {
        let url = '';
        let method = '';

        if(scrapYn === 'Y'){
          method = 'POST';
          url    = '/pages/api/totalboard/common/insertTotalboardScrap.ax';
        }else{
          method = 'PUT';
          url    = '/pages/api/totalboard/common/deleteTotalboardScrap.ax';
        }

        const options = {
          url: url,
          method: method,
          data: {
            masterSeq: masterSeq,
            scrapType: type === 'scrapBtn' ? 'TOTALBOARD' : 'TOTALBOARD-LIKE',
            scrapUrl:  type === 'scrapBtn' ? location.pathname + '/' + masterSeq : null
          },
          success: function (res){
            if(type === 'likeBtn') callback(masterSeq, scrapYn);
          }
        };

        $cmm.ajax(options);
      }
    },

    f: {
      /**
       * 공통코드 콤보박스 바인딩
       */
      setCombo: () => {
        $combo.setCmmCd(['A05', 'ED0001', 'TB0310', 'TB0320', 'TB0330', 'TB0340']);
      },

      /**
       * 월 변경 시
       */
      changeMonth: (e) => {
        const selectedMonth = e.target.getAttribute("data-month");

        screen.v.selectedMonth = selectedMonth;
        screen.c.getChanceEducationSearchList();
      },

      /**
       * 월별 정보, 행사 목록 바인딩
       */
      bindMonthDataList: () => {
        //N월 배너 사진 변경
        $('.banner-inner h3').text(screen.v.monthInfo?.monthInfoTitle  || '');
        $('.banner-inner p').text(screen.v.monthInfo?.monthInfoContent || '');
        $('.banner img').attr('src', '/assets/images/temp/img-month-banner' + screen.v.selectedMonth + '@x2.png');

        /* 주제수업 */
        const monthInfoParentSelector = '#monthInfoList';
        $(monthInfoParentSelector).empty();
        $(monthInfoParentSelector).append(`<p class="title">주제수업</p>`);

        let classItem = $('<div class="buttons type-rounded"></div>');
        let classes   = screen.v.monthInfo.monthClassList?.split(';');

        classes?.map((data, idx) => {
          let htmlItem1 = `<a href="#topic1-${String(idx).padStart(2, '0')}">${data}</a>`
          classItem.append(htmlItem1);
        })

        $(monthInfoParentSelector).append(classItem);

        if(classes.length >= 3){
          $(monthInfoParentSelector).append(`
            <button type="button" onclick="$(this).parents('li').toggleClass('active');">
              <svg>
                <title>화살표 아이콘</title>
                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-down"></use>
              </svg>
            </button>
          `);
        }

        /* 행사 */
        const monthEventParentSelector = '#monthEventList';
        $(monthEventParentSelector).empty();
        $(monthEventParentSelector).append(`<p class="title">행사명</p>`);

        let eventItem = $('<div class="buttons type-rounded"></div>');

        screen.v.eventList.map((data, idx) => {
          let htmlItem1 = `<a href="#topic2-${String(idx).padStart(2, '0')}">${data.eventNameFinal}</a>`
          eventItem.append(htmlItem1);
        });

        $(monthEventParentSelector).append(eventItem);

        if(screen.v.eventList.length >= 2){
          $(monthEventParentSelector).append(`
            <button type="button" onclick="$(this).parents('li').toggleClass('active');">
              <svg>
                <title>화살표 아이콘</title>
                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-down"></use>
              </svg>
            </button>
          `)
        }
      },

      getBoardItem: (data) => {
        const htmlItem2 = `
          <div class="board-items">
            <div class="item">
              <div class="item-inner">
                <div class="image-wrap"
                     name="detailLink" 
                     data-link="/pages/${screen.v.subjectLevelCode}/board/creativexp/chanceEducation.mrn/${screen.v.categorySeq}/${data.masterSeq}">
                  <img src="${!(data?.thumbnailFilePath) ? '/assets/images/common/img-no-img.png' : data.thumbnailFilePath}" alt="" />
                  <div class="info-media">
                    ${data.fileYn === "Y" ? '<img src="/assets/images/common/icon-clip.svg" alt="clip 아이콘">' : null}
                    ${!$text.isEmpty(data?.videoPlayTime) ? '<span class="time">' + screen.f.getVideoTimeForm('min', data.videoPlayTime) + ':' + screen.f.getVideoTimeForm('sec', data.videoPlayTime) + '</span>' : ''}
                  </div>
                </div>
                
                <div class="board-buttons board-list">
                  <input type="hidden" name="masterSeq" value="${data.masterSeq}" />
                  <button type="button" name="scrapBtn" class="icon-button size-sm toggle-this ${data.scrapYn === 'Y' ? 'active' : ''}">
                    <svg>
                      <title>스크랩</title>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                    </svg>
                  </button>
                  <button type="button" name="shareBtn" class="icon-button size-sm" th:data-viewyn="Y" th:data-path="${data.pageLink}">
                    <svg>
                      <title>공유하기</title>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                    </svg>
                  </button>
                  <button type="button" name="likeBtn" class="like size-sm toggle-this ${data.likeYn === 'Y' ? 'active' : ''}">
                     <svg>
                       <title>좋아요</title>
                       <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-like"></use>
                     </svg>
                     <span>${data.likeCount}</span>
                  </button>
                </div>
              </div>
  
              <div class="inner-wrap">
                <div class="text-wrap">
                  <a name="detailLink" 
                     href="javascript:void(0);"
                     data-link="/pages/${screen.v.subjectLevelCode}/board/creativexp/chanceEducation.mrn/${screen.v.categorySeq}/${data.masterSeq}">
                    <p class="title">${data.title}</p>
                    ${!$text.isEmpty(data?.summary) ? '<p class="desc">' + data.summary + '</p>' : ''}
                  </a>
                </div>
                
                ${!$text.isEmpty(data?.playGroupId1)
                  ? `
                    <div class="buttons fluid">
                      <button type="button" class="button size-sm fluid lesson" name="play1Btn" data-id="${data.playGroupId1}">
                        <span>${data.playName1}</span>
                      </button>
                     </div>
                    `
                  : ''
                }
              </div>
            </div>
          </div>
        `;

        return htmlItem2;
      },

      /**
      * 영상길이 form
      * @param {*} type 분/초
      * @returns
      */
      getVideoTimeForm: (type, duration) => {
        let result = '';

        type === 'min' ?
              result = parseInt(!duration ? 0 : duration / 60)
            : result = parseInt(!duration ? 0 : duration % 60);

        return String(result).padStart(2, '0');
      },

      /**
       * 월별 정보, 행사 목록에 작성된 글 목록 바인딩
       */
      bindDataList: () => {
        //데이터 없음 부분 삭제
        $(".box-no-data").removeClass("display-show");
        $(".box-no-data").addClass("display-hide");

        //목록 전체 삭제
        $('.board-list').remove();

        const itemParentSelector = '#tab1-1';
        const boardListGroup = $(`<div class="board-list-group"></div>`);

        /* 주제수업 map */
        if(screen.v.subjectClassExistenceYn === "Y"){
          screen.v.subjectClassExistenceList.map((monthItem, monthInfoIdx) => {
            const monthInfoItem = $(`<div id="topic1-${String(monthInfoIdx).padStart(2, '0')}" class="board-list"></div>`);

            const htmlItem1 = `
              <div class="items-header">
                <span class="badge type-round-box fill-primary">주제수업</span>
                <h5>${monthItem.categoryGroupName3}</h5>
              </div>
            `;

            monthInfoItem.append(htmlItem1);

            screen.v.resultList.map((data, totalboardItemIdx) => {
              if(data['categoryGroupName1'] === 'SUBJECT_CLASS'
              && data['categoryGroupName3'] === monthItem.categoryGroupName3){
                const htmlItem2 = screen.f.getBoardItem(data);
                monthInfoItem.append(htmlItem2);
              }
            })

            $(boardListGroup).append(monthInfoItem);
          })
        }

        /* 행사목록 map */
        screen.v.eventList.map((eventItem, eventItemIdx) => {
          const eventInfoItem = $(`<div id="topic2-${String(eventItemIdx).padStart(2, '0')}" class="board-list"></div>`);

          const htmlItem1 = `
            <div class="items-header">
              <span class="badge type-round-box fill-white"><span class="text-secondary">${eventItem.eventNameFinalForItem}</span></span>
              <h5>${eventItem.title}</h5>
            </div>
            <div class="box-gray roundbox-outlined fill-lightest">${eventItem.content}</div>
          `;

          eventInfoItem.append(htmlItem1);

          screen.v.resultList.map((data, totalboardItemIdx) => {
            if(data['categoryGroupName1'] === 'EVENT'
            && data['categoryGroupName7'] === eventItem.id){
              const htmlItem2 = screen.f.getBoardItem(data);
              eventInfoItem.append(htmlItem2);
            }
          })

          $(boardListGroup).append(eventInfoItem);
        })

        $(itemParentSelector).append(boardListGroup);
      },

      /**
       * 월별 정보, 행사 목록에 작성된 글이 없는 경우
       */
      noDataList: () => {
        //목록 전체 삭제
        $('.board-list').remove();

        $("[data-name='initNoDataBox']").addClass("display-hide");

        $("[data-name='noDataBox']").removeClass("display-hide");
        $("[data-name='noDataBox']").addClass("display-show");

        $('.banner-inner h3').text(screen.v.monthInfo.monthInfoTitle);
        $('.banner-inner p').text(screen.v.monthInfo.monthInfoContent);
        $('.banner img').attr('src', '/assets/images/temp/img-month-banner' + screen.v.selectedMonth + '@x2.png');
      },

      /**
       * 계기교육 권한 체크 (통합게시판과 다름) 정회원 교사만 체크
       * @param {*} e
       * @returns
       */
      checkRight: () => {
        let isRight = false;

        if($('#userGrade').val() === "002"){
          isRight = true;
        }

        return isRight
      },

      /**
       * 스크랩, 좋아요 toggle
       * @param {*} e
       * @returns
       */
      toggleScrap: (e) => {
        let scrapYn = $(e.currentTarget).attr('class').indexOf('active');

        if(scrapYn > -1){
          $(e.currentTarget).addClass('active');
          scrapYn = 'Y';
        }else{
          $(e.currentTarget).removeClass('active');
          scrapYn = 'N';
        }

        const isRight = screen.f.checkRight();

        if(!$isLogin){
          $alert.open('MG00001');
          $(e.currentTarget).removeClass('active');

          return;
        }

        const type = $(e.currentTarget).attr('name');

        if(type === 'scrapBtn'){
          if(isRight){
            const masterSeq = $(e.currentTarget).closest('div.board-buttons').find('[name=masterSeq]').val();
            screen.c.doTotalboardScrap(type, scrapYn, masterSeq, screen.f.syncLikeCount);
          }else{
            $alert.open('MG00003');
            $(e.currentTarget).removeClass('active');

            return;
          }
        }else{
          const masterSeq = $(e.currentTarget).closest('div.board-buttons').find('[name=masterSeq]').val();
          screen.c.doTotalboardScrap(type, scrapYn, masterSeq, screen.f.syncLikeCount);
        }
      },

      /**
       * 공유하기
       * @param {*} e
       * @returns
       */
      shareCheck: (e) => {
        const isRight = screen.f.checkRight();

        if(!$isLogin){
          $alert.open('MG00001');
          $('#popup-share-sns').css('display', 'none');

          return;
        }

        if(isRight){
          $('#popup-share-sns').css('display', 'block');
        }else{
          $alert.open('MG00047');
          $('#popup-share-sns').css('display', 'none');

          return;
        }
      },

      /**
       * 좋아요 count
       * @param {*} masterSeq
       * @param {*} likeYn
       */
      syncLikeCount: (masterSeq, likeYn) => {
        const $count = $(`[name=masterSeq][value=${masterSeq}]`).parents('.board-buttons').not('.display-hide').children('button[name=likeBtn]').find('span');
        const originCnt = $count.text();

        if(likeYn === 'Y'){
          $count.text(parseInt(originCnt) + 1);
        }else {
          $count.text(parseInt(originCnt) - 1);
        }
      },

      //수업하기 뷰어
      playViewer: (e) => {
        const isRight = screen.f.checkRight();

        if(!$isLogin){
          $alert.open('MG00001');
          return;
        }

        if(isRight){
          const playId = $(e.currentTarget).data('id');
          const playName = $(e.currentTarget).text();
          let playUrl = `/pages/api/preview/viewer.mrn?playlist=${playId}&playname=${playName}`;

          mteacherViewer.get_play_list_info(playId).then(res => {
            screenUI.f.winOpen(playUrl, 1100, 1000, null, 'preview');
          }).catch(err => {
            console.error("err : " + err);
            alert("서버 에러");
          });
        }else{
          $alert.open('MG00047');
          return;
        }
      },

      //상세 페이지 이동
      goDetail: (e) => {
        const isRight = screen.f.checkRight();

        if(!$isLogin){
          $alert.open('MG00001');
          return;
        }

        if(isRight){
          window.location.href = $(e.currentTarget).data('link');
        }else{
          $alert.open('MG00047');
          return;
        }
      },

      getCurrentLocationByName: () => {
        let concatenatedText = "";

        $(".breadcrumbs ul").find("li:not(.home)").each(function (index){
          let $this = $(this);
          let text = $this[0].childNodes.length > 0 ? $this[0].childNodes[0].textContent : $this.text();

          if(index !== 0){
            concatenatedText += " > ";
          }

          concatenatedText += text;
        });

        return concatenatedText;
      },

      //즐겨찾기 추가
      addFavorite: () => {
        let dataObj = {};

        const currentLocationName = screen.f.getCurrentLocationByName();
        const currentUrl = window.location.origin + window.location.pathname;
        const referenceSeq = window.location.pathname.split('/');

        dataObj = {
          favoriteType: 'MTEACHER',
          referenceSeq: referenceSeq[referenceSeq.length - 1],
          favoriteName: currentLocationName, //게시판명
          favoriteUrl: currentUrl, //게시판 url
          useYn: 'Y',
        }

        const options = {
          url: '/pages/api/mypage/addFavorite.ax',
          data: dataObj,
          method: 'POST',
          async: false,
          success: function (res){
          },
        };

        $.ajax(options);
      },

      //즐겨찾기 해제
      updateFavorite: () => {
        let dataObj = {};

        //즐겨찾기 해제 type을 delete로 사용
        const referenceSeq = window.location.pathname.split('/');

        dataObj = {
          favoriteType: "MTEACHER",
          referenceSeq: referenceSeq[referenceSeq.length - 1],
        }

        const options = {
          url: '/pages/api/mypage/updateFavorite.ax',
          data: dataObj,
          method: 'POST',
          async: false,
          success: function (res){
            //해제 성공시 Toast Msg - MG00039
          },
        };

        $.ajax(options);
      },

      setMyFavorite: () => {
        if(!$isLogin){
          $alert.open('MG00001');
          $('#reg-favorite[type=checkbox]').prop("checked", false);

          return;
        }

        const addFavorite = $('#reg-favorite[type=checkbox]').is(':checked');

        if(addFavorite){  //즐겨찾기 등록하는 경우
          screen.f.addFavorite();
        } else{  //즐겨찾기 해제하는 경우
          screen.f.updateFavorite();
        }
      }
    },

    event: function (){
      $('.tab li a').on('click', screen.f.changeMonth);

      //스크랩, 좋아요
      $(document).on('click', '[name=likeBtn],[name=scrapBtn]', screen.f.toggleScrap);

      //공유하기
      //$(document).on('click', '[name=shareBtn]', screen.f.shareCheck);

      //수업하기
      $(document).on('click', 'button[name=play1Btn]', screen.f.playViewer);

      //상세페이지 이동 - 접근 시 로그인 체크
      $(document).on('click', 'div[name=detailLink]', screen.f.goDetail);  //썸네일
      $(document).on('click', 'a[name=detailLink]'  , screen.f.goDetail);  //제목 & 내용

      //즐겨찾기 등록
      $(document).on("click", "#reg-favorite", screen.f.setMyFavorite);
    },

    init: function (){
      console.log("mo totalboardChanceEducationList init!");

      screen.f.setCombo();
      screen.event();

      screen.v.mainInfo = screen.v.mainInfoList[0];
      screen.v.mainId = screen.v.mainInfo.mainId;
    },
  };

  screen.init();
});
