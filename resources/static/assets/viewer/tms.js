const TMS_API_DOMAIN = "http://localhost:8080";//"http://14.52.236.224:18080";
//var TMS_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJwcmVmaXgiOiJib2luaXQiLCJuYW1lIjpudWxsLCJpZCI6InRlc3QiLCJleHAiOjE2OTM2NDc4NDF9.TnbMhpbrr8fCNv3pyi0wqAf3HU4yA8NwR0FCrAw9W31tqU2xkQ1YkE8EzJLK1NbyB8bx69C668h5KM1PHWqNEA";
const TMS_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJwcmVmaXgiOiJib2luaXQiLCJuYW1lIjoidGVzdCIsImlkIjoiaXdlbGxjb21tIiwiZXhwIjoxNzg5Mjg0MjAwfQ.WGoB2K6lfw0ZdjwNbLJWBN5DJfaRPL4HLEfFmFls7s1eld0BcnGWsge0vxPbnyUpLBM6Hlvnzs24gaxtW7T0rQ";


function common_promise(url, params) {
    // console.log(url);
    // console.log(params);
    return $.ajax({
        crossOrigin: true,
        url: url,
        type: "post",
        timeout: 10000,
        headers: {
            // "Authorization": TMS_TOKEN
            "Access-Control-Allow-Origin" : "*"
        },
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(params),
        dataType: "json"
    });

const tms = {

    _user: undefined,

    get_all_course_info: async function () {
        // 전체 수업 정보 (학년/학기/과목)
        // console.log("tms.get_all_course_info: 전체 수업 정보 (학년/학기/과목)");
		// var url = TMS_API_DOMAIN + "/tms/modal/curriculum/element/auth";
        return await common_promise("/viewer/curriculum/element/auth");
    },

    get_detail_course_info: async function (params = {}) {
        // 상세 수업 정보 (단원/차시)
        console.log("tms.get_detail_course_info: 상세 수업 정보 (단원)");
        console.log(params);
        // var url = TMS_API_DOMAIN + "/tms/modal/curriculum/element/unit/period/auth";
        return await common_promise("/viewer/curriculum/element/unit/period/auth", params);
    },

    get_detail_unitcourse_info: async function (params = {}) {
        var self = this;
        // 상세 수업 정보 (단원/차시)
        console.log("tms.get_detail_course_info: 상세 수업 정보 (차시)");
        console.log(params);
        // var url = TMS_API_DOMAIN + "/tms/modal/curriculum/element/unit/period/auth";
        return await common_promise( "/viewer/curriculum/element/unit/auth", params);
    },

    get_user_info: function (not_reject) {
        // TODO: 사용자 정보 획득
        console.log("tms.get_user_info: 사용자 정보 획득");
        var queryString = document.location.search.substring(1);
        var queryParams = parseQueryString(queryString);
        console.log(queryParams);
        // self = this;
       // this._user = $('body').data('userIdx') + '';
        // 내꺼 임시 처리
        // this._user = '2610515';
        // var _user = '2613955';
        var _user = queryParams.user;

        // if (!this._user) {
            self._user = 'user' in queryParams ? queryParams.user : _user;
        console.log(self._user);
        // }
        // console.log("this._user >>>" +this._user + "//" + queryParams.user);
        // var JSESSIONID = getCookie("JSESSIONID");
        // console.log(JSESSIONID);
        // JSESSIONID = "084F9B9B0075BD884316E6B0A7CC75F5";

//        return new Promise(function (resolve, reject) {
//            if (!self._user) {
//                // 나중에 어떻게 할지.. 고민해봐야 함.
//
//                var settings = {
//                    "url": TMS_API_DOMAIN + "/Main/UserInfoJson.mrn",
//                    "method": "POST",
//                    "timeout": 1000,
//                    // "headers": {
//                    //   "Cookie": "JSESSIONID="+JSESSIONID
//                    // },
//                    "processData": false,
//                    "mimeType": "multipart/form-data",
//                    "contentType": false,
//                    "crossOrigin": true,
//                    "xhrFields": {
//                        "withCredentials": true
//                    },
//                    "dataType": "json"
//                };
//
//                $.ajax(settings)
//                    .then(function (res) {
//                        // console.log(res);
//                        if (res && res.result == "OK" && res.userSeq) {
//                            self._user = res.userSeq;
//                        }
//                        // console.log("get_user_info ==> ", self._user);
//                        if (self._user) {
//                            resolve();
//                        } else {
//                            if (not_reject) {
//                                resolve();
//                                return;
//                            }
////                            reject(new Error("로그인되어 있지 않습니다."));
//                            reject();
//                        }
//                    })
//                    .catch(function (err) {
//                        // console.error(err);
//                        // console.log("get_user_info ==> ", self._user);
//                        if (self._user) {
//                            resolve();
//                        } else {
//                            if (not_reject) {
//                                resolve();
//                                return;
//                            }
////                            reject(new Error("로그인되어 있지 않습니다."));
//                            reject();
//                        }
//                    });
//
//                return;
//            }
//            // 일단 통과
//
//            resolve();
//        });

    },

    check_permission:  async function (mode, playlist_id, start_id) {
        // 사용자 권한 확인 TODO: 코드 확인 필요 ****
        // console.log("tms.check_permission: 사용자 권한 확인");
        return new Promise(function (resolve, reject) {
            resolve();
            //reject(new Error("Request is failed"));
        });
    },

    get_playlist: async function (mode, playlist_id, _filerole) {
        // 수업 목록 가져오기
        console.log("tms.get_playlist: 수업 목록 가져오기");
        var self = this;

        // var url = TMS_API_DOMAIN + "/tms/viewer/playlist/auth";
        var url = "/viewer/tmscontent/playindexlist/auth";
        // 기존 playlist에서 검정/국정 구분을 위해 curriculum을 추가
        // var url = TMS_API_DOMAIN + "/tms/viewer/playlist";
        console.log("tms.get_playlist URL : "+ url);
        console.log("self._user : "+ self._user);
        // URL 파라미터 정보 가져오기
        let userSeq = self._user;
        if( userSeq == 'undefined' || userSeq == null || userSeq ==''){
            const searchParams = new URLSearchParams(location.search);
            let paramMap = {};
            for (const param of searchParams) {
                paramMap[param[0]] = param[1];
            }
            userSeq = paramMap['user'] ||'';
            self._user= userSeq;
        }
        return await common_promise(url, {
            userSeq: self._user,
            textbookLessonSeq: playlist_id,
            userSeq: userSeq, 
            filerole: _filerole
        });
    },

    //차시 기본정보 조회
    get_smartppt_info: function(playlist_id) {
        // TODO: 차시 기본정보 조회
        console.log("tms.get_smartppt_info: TODO: 차시 기본정보 조회");
        var url = "/viewer/tmscontent/playindexlist/info";
        var params = { textbookLessonSeq: playlist_id};

        return new Promise(function (resolve, reject) {
            if (!playlist_id) {
                reject(new Error("수업 정보가 없습니다. 다시 확인해주세요."));
                return;
            }
            var promise = null;
            promise = common_promise(url, params);
            promise.then(resolve, reject);
        });
    },



    get_file_info: async function (file_id) {
        // 파일 정보 가져오기
        console.log("tms.get_file_info: 파일 정보 가져오기", file_id);
        // var test_url = "./testdata/file." + file_id + ".json";
        // var url = TMS_API_DOMAIN + "/tms/viewer/preview";
        var url = "/viewer/tmscontent/preview";

//        var url = "/getFileInfo";
        var params = { "fileId": file_id, userSeq: this._user };
        console.log("tms.get_file_info: 파일 정보 가져오기", params);
        return new Promise(function (resolve, reject) {
            if (!file_id) {
                reject(new Error("파일 정보가 없습니다. 다시 확인해주세요."));
                return;
            }
            promise = common_promise(url, params);

            promise.then(resolve, reject);
        });
    },

    //new m-teacher file 정보 가져오기
    get_file_item: function(file_id){
        console.log("tms.get_file_item: 파일 정보 가져오기", file_id);
        var url = "/pages/api/preview/previewItem.ax";
        var params = { "fileId": file_id };
        console.log("tms.get_file_info: 파일 정보 가져오기", params);

        return new Promise(function (resolve, reject) {
            if (!file_id) {
                reject(new Error("파일 정보가 없습니다. 다시 확인해주세요."));
                return;
            }
            promise = common_promise(url, params);

            promise.then(resolve, reject);
        });
    },

    //사용중인지 체크
    get_file_info_seq: function (contentsTextbookPeriodSeq) {
        var url = TMS_API_DOMAIN + "/tms/viewer/preview/video";
        // var url = "/viewer/tmscontent/preview/video";
        var params = { "contentsTextbookPeriodSeq": contentsTextbookPeriodSeq };
        return new Promise(function (resolve, reject) {
            if (!contentsTextbookPeriodSeq) {
                reject(new Error("파일 정보가 없습니다. 다시 확인해주세요."));
                return;
            }
            promise = common_promise(url, params);

            promise.then(resolve, reject);
        });
    },

//사용중인지 체크
    get_hls_info: function (contSeq) {
        // hls 링크 정보 가져오기
        console.log('// hls 링크 정보 가져오기')
        console.log(contSeq)


        var url = "/getHls";
//        var url = TMS_API_DOMAIN + "/getHlsUrl.mrn";
        //var url = TMS_API_DOMAIN + "/tms/extra/hls/item";
        var params = {  userSeq: this._user,
            contentSeq: contSeq.toString()};

        console.log(params)

        /** xxx
         기존 방식은 requestBody, 아래 활성화된 구문에서 받는건 resquestParam 입니다.
         파일 정보는 위 get_file_info 에서 가져오는데, HLS 타입은 파일 정보가 없습니다.
         가져오는 데이터 중 video-src : videoUrl 입니다.
         domain 은 video 객체의 poster에 사용됩니다.
         사용 예시는 /assets/js/biz/ExtraBbs/ExtraBbsDtpt.js 의 438 줄에 있습니다.
         */

        /** ============기존방식=========== xxx*/
        /*        return new Promise(function (resolve, reject) {
                    if (!contSeq) {
                        reject(new Error("파일 정보가 없습니다. 다시 확인해주세요."));
                        return;
                    }

                    () => {
                        console.log(params)
                        return $.ajax({
                            crossOrigin: true,
                            url: url,
                            method: 'POST',
                            timeout: 10000,
                            headers: {
                                "Authorization": TMS_TOKEN
                            },
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify({ jsonParam: params }),
                            dataType: "json",
                            success: function (res){

                                console.log(res)
                                resolve(res);

                            }
                        });
                    };

                    //promise.then(resolve, reject);
                });
        */
        /**=============ExtraBbsDtpt.js에서 콜하는 방식============ xxx*/

        
        
        return new Promise(function (resolve, reject) {
            var temp = null;
            setTimeout(function () {
                if (!contSeq) {
                    reject(new Error("파일 정보가 없습니다. 다시 확인해주세요."));
                    return;
                }
                // hls link 적용
                $.post("/getHlsUrl.mrn",{contentSeq:contSeq},function (res) {
                    if(res.resultCode == "0000") {
                        temp = res.row;
                        temp.download_url = res.row.videoUrl;
                        resolve(temp);
                    }
                },"json");
            }, 200);
        });
    },
// 20240123
//    create_period_contents_scrap: function (contentsTextbookPeriodSeq) {
//        // 차시 컨텐츠 스크랩 등록
//        // console.log("tms.create_period_contents_scrap: 차시 컨텐츠 스크랩 등록: ", contentsTextbookPeriodSeq);
//        // var self = this;
//        var url = TMS_API_DOMAIN + "/tms/viewer/scrap/period/contents/create";
//        var params = {
//            userSeq: this._user,
//            contentsTextbookPeriodSeq: contentsTextbookPeriodSeq
//        };
//
//        return new Promise(function (resolve, reject) {
//            if (!contentsTextbookPeriodSeq) {
//                reject(new Error("컨텐츠 정보가 없습니다. 다시 확인해주세요."));
//                return;
//            }
//            var promise = common_promise(url, params);
//            promise.then(resolve, reject);
//        });
//    },
//    delete_period_contents_scrap: function (contentsTextbookPeriodSeq) {
//        // 차시 컨텐츠 스크랩 삭제
//        // console.log("tms.delete_period_contents_scrap: 차시 컨텐츠 스크랩 삭제: ", contentsTextbookPeriodSeq);
//        // var self = this;
//        var url = TMS_API_DOMAIN + "/tms/viewer/scrap/period/contents/delete";
//        var params = {
//            userSeq: this._user,
//            contentsTextbookPeriodSeq: contentsTextbookPeriodSeq
//        };
//        return new Promise(function (resolve, reject) {
//            if (!contentsTextbookPeriodSeq) {
//                reject(new Error("컨텐츠 정보가 없습니다. 다시 확인해주세요."));
//                return;
//            }
//            var promise = common_promise(url, params);
//            promise.then(resolve, reject);
//        });
//    },


    confirm_period_contents_scrap: function (contentsTextbookPeriodSeq) {
        // 차시 컨텐츠 스크랩 확인
        // console.log("tms.confirm_period_contents_scrap: 차시 컨텐츠 스크랩 확인: ", contentsTextbookPeriodSeq);
        // var self = this;
        if ( !contentsTextbookPeriodSeq ) 
            return Promise.reject(new Error("컨텐츠 정보가 없습니다. 다시 확인해주세요."))

        return await common_promise(TMS_API_DOMAIN + "/tms/viewer/scrap/period/contents/confirm", {
            contentsTextbookPeriodSeq,
            userSeq: tms._user
        });
        // return new Promise(function (resolve, reject) {
        //     if (!contentsTextbookPeriodSeq) {
        //         return;
        //     }
        //     var promise = common_promise(url, params);
        //     promise.then(resolve, reject);
        // });
    },

    // AI 수학 리스트 //사용중인지 체크
    ai_math_list: function (textbookLessonSeq) {
        // var url = TMS_API_DOMAIN + "/tms/viewer/ai/special/list";
        return await common_promise(TMS_API_DOMAIN + "/tms/viewer/ai/special/list", { textbookLessonSeq });
        // var url = "/viewer/tmscontent/ai/special/list";
        // var params = { textbookLessonSeq: textbookLessonSeq };

        // return new Promise(function (resolve, reject) {
        //     var promise = common_promise(url, params);
        //     promise.then(resolve, reject);
        // });
    },

 // ================================
 // 이북 관련 함수
 // ================================
    // 검정 교과서 리스트
    ebook_contents_list: function (textbookLessonSeq, typeGradeCode) {
   	    // var url = TMS_API_DOMAIN + "/tms/ebook/lesson/page/textbook/unit/list";
        console.log(textbookLessonSeq+"//"+typeGradeCode);
        var url = "/viewer/tmscontent/textbook/unit/list";

        // 검정 교과서 리스트 : 과학 3,4
        if(typeGradeCode == 'SC03' || typeGradeCode == 'SC04' || typeGradeCode.indexOf('MA') >0){
   		    // url = TMS_API_DOMAIN + "/tms/ebook/lesson/page/textbook/unit/list2";
            url = "/viewer/tmscontent/textbook/unit/list2";
        }

        // return new Promise(function (resolve, reject) {
        //     var promise = common_promise(url, params);
        //     promise.then(resolve, reject);
        // });
    },
    // 검정 교과서 특화자료 리스트
    auth_special_contents_list: async function (type, periodSeq) {
        // var url = TMS_API_DOMAIN + "/tms/viewer/" + type + "/special/list/auth";
        // // var url = "/viewer/tmscontent/" + type + "/special/list/auth";
        // var params = {};

        // switch (type) {
        //     case 'ko':
        //         params = { periodSeq: periodSeq };
        //         break
        //     case 'mt':
        //         params = { periodSeq: periodSeq };
        //         break;
        //     case 'si':
        //         params = { periodSeq: periodSeq };
        //         break;
        //     case 'so':
        //         params.periodSeq = periodSeq;
        //         params.textbookCurriculumGradeCd = viewer._playlist_data.info.grade;
        //         params.textbookCurriculumTermCd = viewer._playlist_data.info.semester;
        //         break;
        // }

        return await tms.special_contents_list(type, periodSeq, 'auth');
    },

    //사용중인지 체크
    // 국정 특화자료 리스트
    special_contents_list: async function (type, periodSeq, subTarget = '') {
        return await common_promise(
            `${TMS_API_DOMAIN}/tms/viewer/${type}/special/list${subTarget ? '/' + subTarget : ''}`,
            ['ko', 'mt', 'si'].includes(type) ? { periodSeq } : {
                periodSeq,
                textbookCurriculumGradeCd: viewer._playlist_data.info.grade,
                textbookCurriculumTermCd: viewer._playlist_data.info.semester
            }
        );
    },

    //사용중인지 체크
    // 특화자료 - 사회 get params
    get_special_contents_params: async function (params = {}) {
        return await common_promise(TMS_API_DOMAIN + "/tms/viewer/so/special/list", params);
    },
    bookmark: async function (method, params = {}) {
        // 수업 북마크: create, update, delete, list
        // console.log("tms.bookmark: 수업 북마크: ", method, params);
        // var self = this;
        // var url = TMS_API_DOMAIN + "/tms/modal/textbook/lesson/bookmark/item/" + method;
        // if (method == 'list') {
        //     url = TMS_API_DOMAIN + "/tms/modal/textbook/lesson/bookmark/" + method;
        // }

        return await common_promise(`${TMS_API_DOMAIN}/tms/modal/textbook/lesson/bookmark/${
            method == 'list' ? 'item/list' : method
        }`, {
            // * 구조분해 할당문법으로 인하여, userSeq 가 먼저 선언되고, params에 userSeq가 있을 경우 덮어씌워짐. (= 없으면 tms._user가 들어감)
            userSeq: tms._user,
            ...params,
        });
    },
    searchData: function (params) { //사용중인지 체크
        // viewer 자료검색
        var url = TMS_API_DOMAIN + "/tms/search/contents/extra/list";
        if (!params.userSeq) {
            params.userSeq = this._user;
            // params.userSeq = parseInt(this._user);
        }
        return new Promise(function (resolve, reject) {
            var promise = common_promise(url, params);
            promise.then(resolve, reject);
        });
    },

    progress_history: function (params) { // 미사용
        // 수업 진도 정보 저장
        // var self = this;
        var url = TMS_API_DOMAIN + "/tms/modal/textbook/lesson/progress/history/item/create";

        return await common_promise(url, {
            userSeq: tms._user,
            ... params
        });
    },
    progress_history: async function (params = {}) { // 미사용
        // 수업 진도 정보 저장
        return await common_promise(`${TMS_API_DOMAIN}/tms/modal/textbook/lesson/progress/history/item/create`, {
            userSeq: tms._user,
            ...params
        });
    },
    history: async function (params = {}) { // 미사용
        // 수업 기록 정보 저장
        // var url = TMS_API_DOMAIN + "";
        // // let url = "/viewer/textbook/lesson/history/item/create";
        // if (!params.userSeq) {
        //     params.userSeq = this._user;
        // }
        // delete params["modalDiv"];

        return await common_promise(`${TMS_API_DOMAIN}/tms/modal/textbook/lesson/history/item/create`, {
            userSeq: tms._user,
            ...params,
            modalDiv : undefined
        });
    },
    latest_history: async function (params = {}) {
        // 최신 수업 기록
        return await common_promise(`${TMS_API_DOMAIN}/tms/modal/textbook/lesson/history/item/latest`, {
            userSeq: tms._user,
            ...params
        });
    },

    // ## 수업뷰어
    // - 단원별 자료 연동
    get_unit_contents: async function (params = {}) {
        // 단원별 자료
        return await common_promise(`${TMS_API_DOMAIN}/tms/viewer/unit/contents/list`, {
            userSeq: tms._user,
            ...params
        });
    },

    // - 내자료 연동
    // get_my_data: function (params) {
    //     var url = TMS_API_DOMAIN + "/tms/viewer/my-data/contents/list";
    //     if (!params) {
    //         params = {};
    //     }
    //     if (!params.userSeq) {
    //         params.userSeq = this._user;
    //     }
    //     if (!params.dataDiv) {
    //         params.dataDiv = "all";//scrap//my
    //     }
    //     // ,"pagePerCount" : 3
    //     // ,"currentPage" : 1
    //
    //     return new Promise(function (resolve, reject) {
    //         var promise = common_promise(url, params);
    //         promise.then(resolve, reject);
    //     });
    // },

    // - 익힘교과서 연동
    get_pair_contents: async function (_type, params = {}) {
        // var url = "/viewer/tmscontent/" + _type + "/sub/subject/list";
        if (!params) {
            params = {};

        }
        if (!params.userSeq) {
            params.userSeq = this._user;
        }

        params.sortKey = 'TEXTBOOK_LESSON_SEQ';
        params.sortType = 'ASC';
        let exceptList = ['4874','4839','4842','4843','4844','4849','4845'];
        if(exceptList.indexOf(params.periodSeq) > -1 && _type == 'sc'){ // 차시Seq 가 순서대로 되어있지 않은 내용 확인되어, 책 페이지 번호로 일단 순번정렬 진행.
            params.sortKey = 'CAST(PAGE_MAIN_INFO as unsigned )';
        }

        return await common_promise(`${TMS_API_DOMAIN}/tms/viewer/${_type}/sub/subject/list`, {
            userSeq: tms._user,
            sortKey: 'TEXTBOOK_LESSON_SEQ',
            ...params,
            sortType: 'ASC'
        });
    },

    // - 수업기록 연동

    // - 마이크로사이트 연동
    // - 검색 연동
    // ## 범교과 뷰어
    // - API 정의 및 연동
    get_extra_info: async function (params = {}) {
        // 파일 정보 가져오기
        // var self = this;
        // console.log("tms.get_extra_info: 범교과 정보 가져오기", params);

        if ( !params.extraSeq ) return Promise.reject(new Error("잘못된 파라미터 입니다. 다시 확인해주세요."));

        if ( TEST_DATA ) return new Promise(function (resolve, reject) {
            $.ajax({ url: `./testdata/${params.extraSeq}.json` , success: resolve, error: reject }); 
        });

        return await common_promise(`${TMS_API_DOMAIN}/tms/viewer/extraviewer`, {
            userSeq: tms._user,
            ...params
        });
    },

};