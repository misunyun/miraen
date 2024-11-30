$(function () {
  let screen = {
    v: {
      mainInfo: JSON.parse($('[name=mainInfo]').val()),
      thumbLogArr: $('[name=thumbLogArr]').val() || '',
    },

    c: {
      doTotalboardScrap: (type, scrapYn, masterSeq, callback)=> {
        let url = '';
        let method = '';

        if(scrapYn === 'Y') {
          method = 'POST';
          url = '/pages/api/totalboard/common/insertTotalboardScrap.ax';
        }else {
          method = 'PUT';
          url = '/pages/api/totalboard/common/deleteTotalboardScrap.ax';
        }

        const options = {
            url: url,
            method: method,
            data: {
              masterSeq: masterSeq,
              scrapType: type === 'scrapBtn' ? 'TOTALBOARD' : 'TOTALBOARD-LIKE',
              scrapUrl: type === 'scrapBtn' ? location.pathname : null
            },
            success: function (res) {
              if(type === 'likeBtn') callback(masterSeq, scrapYn);
              else {
                if(scrapYn === 'Y') $toast.open(`toast-scrap`, 'MG00041');
                else $toast.open(`toast-scrap`, 'MG00042');
              }
          }
        };

        $cmm.ajax(options);
      }
    },

    f: {
      parseHtmlContent: () => {
        const content = $('.editor-area').data('content');
        const modifiedContent = content.replace(/src="\/api\/file\/view\//g, 'src="/pages/api/file/view/');
        $('.editor-area').html(modifiedContent);
      },

      toggleScrap: (e)=> {
        let scrapYn = $(e.currentTarget).attr('class').indexOf('active');

        if(scrapYn > -1) {
          $(e.currentTarget).removeClass('active');
          scrapYn = 'N';
        }else {
          $(e.currentTarget).addClass('active');
          scrapYn = 'Y';
        }

        if(!$isLogin) {
          $alert.open('MG00001');
          $(e.currentTarget).removeClass('active');

          return;
        }

        const type = $(e.currentTarget).attr('name');

        if(type === 'scrapBtn' && $('#boardGrade').val() !== '002') {
          $alert.open('MG00011');
          $(e.currentTarget).removeClass('active');

          return;
        }

        const masterSeq = $(e.currentTarget).closest('div.board-buttons').find('[name=masterSeq]').val();

        screen.c.doTotalboardScrap(type, scrapYn, masterSeq, screen.f.syncLikeCount);
      },

      syncLikeCount: (masterSeq, likeYn)=> {
        const $count = $(`[name=masterSeq][value=${masterSeq}]`).siblings('button[name=likeBtn]').find('span');
        const originCnt = $count.text();

        if(likeYn === 'Y') {
          $count.text(parseInt(originCnt) + 1);
          $toast.open(`toast-like`, 'MG00055');
        }else {
          $count.text(parseInt(originCnt) - 1);
          $toast.open(`toast-like`, 'MG00056');
        }
      },

      // single file 다운로드
      downSingleFile: (e)=> {
        const type = $(e.currentTarget).data('type');
        const fileId = $(e.currentTarget).data('id');
        const linkPath = $(e.currentTarget).data('path');
        const fileDownPath = $(e.currentTarget).data('downpath');

        if(type === "CMS") {
          const options = {
            method: "GET",
            url: "/pages/api/preview/previewDownYn.ax",
            data: { fileId: fileId },
            success: (res) => {
              if (res.row.down_yn === 'Y') {
                let link = document.createElement("a");
                link.target = "_blank";
                link.href = fileDownPath;

                link.click();
                link.remove();
              } else {
                $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요.");
              }
            }
          };
          $cmm.ajax(options);
        } else {
          let link = document.createElement("a");
          link.target = "_blank";
          link.href = fileDownPath;

          link.click();
          link.remove();
        }
      },

      // 파일 미리보기
      previewFile: (e)=> {
        const masterSeq = $(e.currentTarget).data('seq');
        const fileId = $(e.currentTarget).data('id');
        let fileType = $(e.currentTarget).data('type');

        if (fileType === 'LINK') {
          window.open($(e.currentTarget).data('path'), '_blank');
        } else {
          const options = {
            method: "GET",
            url: "/pages/api/preview/previewServiceYn.ax",
            data: { fileId: fileId },
            success: (res) => {
              if (res.row.service_yn === 'Y') {
                let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}&referenceSeq=${masterSeq}&type=TOTALBOARD`;

                if(screen.v.thumbLogArr.indexOf(screen.v.mainId) > -1 ){ // 메뉴 아이디로 판단
                  previewUrl += '&vertical=video-vertical';
                }

                mteacherViewer.get_file_info(fileId).then(res => {
                  screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
                }).catch(err => {
                  console.error(err);
                  alert("서버 에러");
                });
              } else {
                $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요.")
              }
            }
          };
          $cmm.ajax(options);
        }
      },

      //수업하기 뷰어
      playViewer: (e)=> {
        const playId       = $(e.currentTarget).data('id');
        const playName = $text.escapeHtml($(e.currentTarget).text());
        let playUrl = `/pages/api/preview/viewer.mrn?playlist=${playId}&playname=${encodeURIComponent(playName)}`;

        mteacherViewer.get_play_list_info(playId).then(res => {
          screenUI.f.winOpen(playUrl, 1100, 1000, null, 'preview');
        }).catch(err => {
          console.error(err);
          alert("서버 에러");
        });
      },

      moveExternalContentUrl: (e)=> {
        let link = document.createElement('a');

        if($(e.currentTarget).data('method') === 'U0801') link.target = '_blank';

        link.href = $(e.currentTarget).data('url');
        link.click();
        link.remove();
      },

      //목록화면 이동
      moveList: (e)=> {
        let listPath = $cmm.getTotalboardUrlDelKey();
        let tabSeq = $("input[name=tabSeq]").val() || "";

        if(tabSeq != ""){
          listPath += "?tabSeq="+tabSeq;
        }

        location.href = listPath;
      },

      playCmsVideo: ()=> {
        let video = document.getElementById('video');
        if(Hls.isSupported()) {
            let hls = new Hls();
            Module.video_viewer.playlist(data.pages[0].file, 'application/x-mpegURL');

            hls.loadSource(data.pages[0].file);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
        }
      },

      moveToMainPage: () => {
        const currentPath = window.location.pathname;

        if(currentPath.includes("ele")){
          location.replace($('[name=hostEle]').val());
        } else if(currentPath.includes("mid")) {
          location.replace($('[name=hostMid]').val());
        } else if(currentPath.includes("high")) {
          location.replace($('[name=hostHigh]').val());
        }
      },

      getCurrentLocationByName: () => {
        let concatenatedText = "";
        let count = 0;

        $(".breadcrumbs ul").find("li:not(.home)").each(function (index) {
          let $this = $(this);
          let text = $this[0].childNodes.length > 0 ? $this[0].childNodes[0].textContent : $this.text();

          if (index !== 0) {
            concatenatedText += " > ";
          }

          concatenatedText += text;
          count++;

          if (count >= 2) {
            return false; // 두 번째 반복에서 반복 중지
          }
        });

        return concatenatedText;
      },

      // 즐겨찾기 추가
      addFavorite: () => {
        let dataObj = {};

        const currentLocationName = screen.f.getCurrentLocationByName();
        const modifiedUrl = window.location.origin + window.location.pathname;
        let parts = modifiedUrl.split('/');
        parts.pop();

// 나머지 부분을 다시 조합하여 URL 생성
        let currentUrl = parts.join('/');
        const referenceSeq = window.location.pathname.split('/');

        dataObj = {
          favoriteType: 'MTEACHER',
          referenceSeq: referenceSeq[referenceSeq.length - 2],
          favoriteName: currentLocationName, // 게시판명
          favoriteUrl: currentUrl, // 게시판 url
          useYn: 'Y',
        }

        const options = {
          url: '/pages/api/mypage/addFavorite.ax',
          data: dataObj,
          method: 'POST',
          async: false,
          success: function (res) {
            // 40개 미만인 경우만 즐겨찾기 등록 성공
            if (res.resultMsg === "exceed") {
              $alert.open("MG00012");
              $('#reg-favorite[type=checkbox]').prop("checked", false);

            } else {
              $toast.open("toast-favorite", "MG00038");
              $quick.getFavorite();
            }
          },
        };

        $.ajax(options);
      },

      // 즐겨찾기 해제
      updateFavorite: () => {
        let dataObj = {};
        // 즐겨찾기 해제 type을 delete로 사용
        const referenceSeq = window.location.pathname.split('/');

        dataObj = {
          favoriteType: "MTEACHER",
          referenceSeq: referenceSeq[referenceSeq.length - 2],
        }

        const options = {
          url: '/pages/api/mypage/updateFavorite.ax',
          data: dataObj,
          method: 'POST',
          async: false,
          success: function (res) {
            // 해제 성공시 Toast Msg - MG00039
            $toast.open("toast-favorite", "MG00039");
            $quick.getFavorite();
          },
        };

        $.ajax(options);
      },

      setMyFavorite: () => {
        if(!$isLogin) {
          $alert.open('MG00001');
          $('#reg-favorite[type=checkbox]').prop("checked", false)
          return;
        }

        const addFavorite = $('#reg-favorite[type=checkbox]').is(':checked');

        if (addFavorite) {
          // 즐겨찾기 등록하는 경우
          screen.f.addFavorite();
        } else {
          // 즐겨찾기 해제하는 경우
          screen.f.updateFavorite();
        }
      }
    },

    event: function () {
      //스크랩, 좋아요
      $(document).on('click', '[name=likeBtn],[name=scrapBtn]', screen.f.toggleScrap);

      //공유하기
      // $(document).on('click', '[name=shareBtn]', )

      // single file 다운로드
      $(document).on('click', 'button[name=downloadBtn]', screen.f.downSingleFile);

      // 파일 미리보기
      $(document).on('click', 'button[name=previewBtn]', screen.f.previewFile);

      // 수업하기
      $(document).on('click', 'button[name=play1Btn],button[name=play2Btn]', screen.f.playViewer);

      // 외부컨텐츠URL
      $(document).on('click', 'button[name=extContUrlBtn]', screen.f.moveExternalContentUrl);

      // 목록이동
      $(document).on('click', 'button[name=listBtn]', screen.f.moveList);

      $(document).on("click", "#reg-favorite", screen.f.setMyFavorite);
    },

    init: function () {
      console.log('init!');

      const readUseYn = screen.v.mainInfo?.listPageUseYn;
      const readRight = screen.v.mainInfo?.listPageRight;

      if(readUseYn === 'Y' && !!readRight) {
        const arrRight = readRight.split(';');
        let isRight = false;

        for(let i=0; i<arrRight.length; i++) {
          if(arrRight[i] === $('#boardRight').val()) {
            isRight = true;
            break;
          }
        }

        if(!$isLogin) {
          $alert.open('MG00004', ()=> {
            location.href = location.pathname.substring(0,location.pathname.lastIndexOf('/'));
            $alert.open('MG00001');
          });

          return;
        }

        if(!isRight) {
          $alert.open('MG00004', ()=> {
            screen.f.moveToMainPage();
          });

        }
      }

      screen.event();
      screen.f.parseHtmlContent();

      // Fancybox.bind('[data-fancybox=gallery]', {
      //   Toolbar: {
      //     display: {
      //       left: ["infobar"],
      //       middle: [],
      //       right: ["slideshow", "download", "thumbs", "close"],
      //     },
      //   },
      // });
    },
  };
  screen.init();
});