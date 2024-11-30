var queryString = document.location.search.substring(1);
var queryParams = parseQueryString(queryString);
var TEST_DATA = 'test_data' in queryParams ? queryParams.test_data : false;
// if (!TEST_DATA || TEST_DATA == '0' || TEST_DATA == 'false') {
//     TEST_DATA = undefined;
// }

// if (TEST_DATA) {
//     if ('user' in queryParams) {
//         queryParams.user = guid();
// //        queryParams.user = "test123";
//     }
// }

var PROGRESS_HISTORY_TIME = 30 * 1000; // 진도 저장 시간

var CONTENT_X_GAP = 0;
var CONTENT_Y_GAP = 0;
var SCREEN_RATIO_VALUE = 'fill';//'fit', 'fill'
var NO_SMARTPPT_HEADER_HEIGHT = 30;
var NO_SMARTPPT_CONTENT_X_GAP = 0;
var NO_SMARTPPT_CONTENT_Y_GAP = 0;
var SCREEN_ID = '';

var UPDATE_WINDOW_HISTORY = true;
var TEST_LOCALHOST = false;
// if (window.location.hostname == 'localhost') {
//     TEST_LOCALHOST = true;
// }

var MIRRORING_WINDOW = undefined;
var MIRRORING_WINDOW_NAME = "MIRRORING_WINDOW";

var IS_MIRRORING_WINDOW = false;
if (window.name === MIRRORING_WINDOW_NAME) {
    IS_MIRRORING_WINDOW = true;
    UPDATE_WINDOW_HISTORY = false;
}

// 2022.04.08 추가 : popup 뷰어에서 동영상이 youtube일 때 체크
var YOUTUBEVIDEOPLAYERCHECK = false;
var YOUTUBEPLAYERTRIGGERPLAY = 'send';
var YOUTUBEPLAYERTRIGGERPAUSE = 'send';
var YOUTUBEPLAYERTRIGGERSEEKED = 'send';
var YOUTUBEPLAYERTRIGGERSTOP = false;

// 2022.01.05 추가 : curriculum이 GOV면 국정, AUTH면 검정
var CURRICULUM_CODE = undefined;

var SHOW_THUMBNAIL_OF_DATA_LOCKER = false;

var loading_overlay_default =
    {
        background: "rgba(255, 255, 255, 0.1)",
        image: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'><circle r='80' cx='500' cy='90'/><circle r='80' cx='500' cy='910'/><circle r='80' cx='90' cy='500'/><circle r='80' cx='910' cy='500'/><circle r='80' cx='212' cy='212'/><circle r='80' cx='788' cy='212'/><circle r='80' cx='212' cy='788'/><circle r='80' cx='788' cy='788'/></svg>",
        imageAnimation: "2000ms rotate_right",
        // imageAutoResize         : true,
        imageResizeFactor: 0.2,
        imageColor: "#00cbb4"
    };

var viewer = {
    _device_type: undefined,

    _queryParams: undefined,
    _mode: undefined,
    _playlist_id: undefined,
    _start_id: undefined,
    _filerole: undefined,
    _textbookSeq: undefined,

    _playlist_length: 0,
    _current_index: -1,
    _current_page: 1,
    _prev_index: -1,
    _playlist_data: undefined,
    _playing: undefined,

    _active_grade_code: undefined,
    _active_term_code: undefined,
    _active_course_code: undefined,
    _active_textbookSeq_code: undefined,

    _all_course_info: undefined,
    _detail_course_info: undefined,
    _bookmark_data: undefined,

    //
    _detail_course_info_high: undefined,
    _detail_course_info_mid: undefined,

    is_mirroring_started: false,
    user_selected_ratio: false,

    ex_lessonseq: undefined,
    ex_page: undefined,

    _priview_list: null,

    is_mirroring_window: function () {
        // try {
        //     if (IS_MIRRORING_WINDOW) {
        //         return true;
        //     }
        //     return false;
        // } catch (error) {
        //     return false;
        // }
        return false;
    },

    is_mirroring_owner_window: function () {
        try {
            if (MIRRORING_WINDOW && !MIRRORING_WINDOW.closed && MIRRORING_WINDOW.viewer.is_mirroring_started) {
                return true;
            }
        } catch (error) {
        }
        return false;
    },

    toggle_mirroring: function (data) {

        let display = 'block';
        if (data.info.grade == '01' || data.info.grade == '02') {
            if (data.info.type == 'KOA' || data.info.type == 'KOB' || data.info.type == 'MA') {
                display = 'none';
            }
        } else if (data.info.grade == '03' || data.info.grade == '04') {
            if (data.info.type == 'MU') {
                display = 'none';
            }
        } else if (data.info.grade == '05' || data.info.grade == '06') {
            if (data.info.type == 'MU' || data.info.type == 'PC') {
                display = 'none';
            }
        }

        $('#mirroring').css('display', display);

    },

    parse_query_params: function () {
        this._queryParams = queryParams;
        this._mode = 'mode' in queryParams ? queryParams.mode : 'default';
        this._playlist_id = 'playlist' in queryParams ? queryParams.playlist : undefined;
        this._start_id = 'start' in queryParams ? queryParams.start : undefined;
        this._filerole = "filerole" in queryParams ? queryParams.filerole : undefined;

        console.log("params start : "+this._mode + "//" +this._playlist_id + "//" +this._start_id + "//" +this._filerole + "//");
    },

    do_popstate: function (params) {
        this.update_viewer_info();
        this.update_viewer_current_info();
    },

    do_apply_playlist: function (data) {
        var self = this;
        // 수업 정보 validation
        if (!data || !data["playlist"]) {
            throw "수업 정보가 잘못되었습니다.";
        }
        console.log("do_apply_playlist");
        console.log(data);
        self._playlist_data = data;
        var modalDiv = data.info.modalDiv;

        // 시작 주제가 있는지 확인
        var start_obj ='';
        // console.log("self._start_id : " + self._start_id);
        if (self._start_id) {
            start_obj = _.find(data.playlist, function (obj) {
                return obj.id == self._start_id;
            });
            // console.log("1. start_obj >> " + JSON.stringify(start_obj));
        } else {
            // start_id 가 없는 경우 1로 이동시킴
            start_obj = data.playlist[0] || null;
        }

        // 수업 노트에서 이동하는 경우  textbookLessonSubjectSeq 로 시작 주제 찾기
        if (!start_obj) {
            start_obj = _.find(data.playlist, function (obj) {
                return obj.textbookLessonSubjectSeq == self._start_id;
            });
        }

        // 미러링 버튼 숨김/표시
        self.toggle_mirroring(data);
        $('#viewer-tool').css('display', 'block');

        function do_load(_start_obj) {
            if (!_start_obj) {
                _start_obj = _.first(data.playlist);
                if (_start_obj) {
                    self._start_id = _start_obj.id;
                }
            }

            self._playlist_length = self._playlist_data.info.total_page;
            self._current_index = _.findIndex(data.playlist, function (obj) {
                return obj.id == self._start_id;
            });

            self.update_viewer_info();
            self.load_smartppt(_start_obj);
            self.play_list_fit_height(true);
        }

        // 2022.03.15 쪽검색 대비 - url 파라미터에 page가 있을 때 fasle
        var pageSearchFlag = Object.keys(queryParams).includes('page');
        //var startSearchFlag = Object.keys(queryParams).includes('start');

//         console.log('쪽검색 통해 뷰어 오픈 : ', pageSearchFlag);

        //var check_history = (!start_obj || !startSearchFlag) && !TEST_DATA && !pageSearchFlag;
        var check_history = !start_obj && !pageSearchFlag;
        // console.log("do_apply_playlist : "+ start_obj +" // " + pageSearchFlag +" // " + check_history);
        if (this.is_mirroring_window()) {
            check_history = false;
        }
        if (check_history) {
            var params = {modalDiv: modalDiv, textbookLessonSeq: self._playlist_id};

            // var jsTimerStart = performance.now();

            // tms.latest_history(params).then(function (res) {
            //     if (res && res.resultCode == 'success' && res.resultData && res.resultData.textbookLessonSubjectSeq) {
            //         // 24.01.30_지예진 - 기존 tms에서 미사용 기능. 추후 주석처리 예정
            //         var con_test = confirm("저장된 수업기록이 있습니다. 수업을 이어서 진행할까요? \n(테스트 후 주석처리 예정)");
            //         if(con_test == true) {
            //             start_obj = _.find(data.playlist, function(obj) {
            //                 return obj.id == res.resultData.textbookLessonSubjectSeq;
            //             });
            //         }
            //         do_load(start_obj);
            //
            //         if (!self.is_mirroring_window() && start_obj) {
            //             mirroring.api_sync_obj({
            //                 target: "app",
            //                 script: "app.move_to_subject_by_id('" + start_obj.id + "', 'smartppt');"
            //             });
            //         }
            //     } else {
            //         console.log("else start_obj ===");
            //         console.log(start_obj);
            //         do_load(start_obj);
            //     }
            // })
            //     .catch(function (err) {
            //         console.log("catch error start_obj ===");
            //         console.log(start_obj);
            //         do_load(start_obj);
            //     });
            // console.log("if do_load ===");
            // console.log(start_obj);
            do_load(start_obj);

            // var jsTimerEnd = performance.now();
            // console.log("@@ [tms.latest_history] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
            return;
        } else {
            // console.log("else do_load ===");
            do_load(start_obj);
        }
    },

    update_all_course_info: function (auto_show) {
        var self = this;

        // var jsTimerStart = performance.now();

        tms.get_all_course_info()
            .then(function (res) {

                console.log('[전체 수업 정보 (학년/학기/과목)] ↓↓↓');
                // console.log(res);

                var params = {};
                    // TODO: 전체 수업정보: res
                    self._all_course_info = res.resultData;
                    console.log("TODO: 전체 수업정보: res");
                    console.log(self._all_course_info);
                    // console.log(self._playlist_data);
                    console.log(self._playlist_data.info);

                    self._active_grade_code = self._playlist_data.info.grade;
                    if (self._active_grade_code && self._active_grade_code.length < 2) {
                        self._active_grade_code = "0" + self._active_grade_code;
                    }

                    self._active_term_code = self._playlist_data.info.semester;
                    if (self._playlist_data.info.semester == '00') {
                        var _month = new Date().getMonth() + 1;
                        if (((2 <= _month) && (_month <= 7))) {
                            self._active_term_code = '01';
                        } else {
                            self._active_term_code = '02';
                        }
                    }

                    if (self._active_term_code && self._active_term_code.length < 2) {
                        self._active_term_code = "0" + self._active_term_code;
                    }
                    self._active_course_code = self._playlist_data.info.type;
                    switch (self._active_course_code) {
                        case "sc":
                            self._active_course_code = "SI";
                            break;
                        case "ma":
                            self._active_course_code = "MT";
                            break;
                    }
                    if (self._active_course_code) {
                        self._active_course_code = self._active_course_code.toUpperCase();
                    }

                    // console.log("316 >> ");
                    // console.log(self._playlist_data.info.textbookSeq);
                    // console.log(self);
                    // console.log(self._playlist_data.info);
					self._active_textbookSeq_code = self._playlist_data.info.textbookSeq;
                    self.update_list_all();

                    // console.log("update_all_course_info >> " + self._active_grade_code + " // " + self._active_term_code + " // " + self._active_course_code);
                    params = {
                        textbookSeq: self._active_textbookSeq_code,
                        textbookCurriculumGradeCd: self._active_grade_code,
                        textbookCurriculumTermCd: self._active_term_code,
                        textbookCurriculumCourseCd: self._active_course_code
                    }
                // console.log("↓↓↓↓↓ params ↓↓↓↓↓↓");
                // console.log(params);
                return tms.get_detail_unitcourse_info(params);
            }).then(function (res) {
                // console.log("↓↓↓↓↓ tms.get_detail_unitcourse_info ↓↓↓↓↓↓");
                console.log(res);

                self._detail_course_info = res.resultData;

                self.update_detail_course_info(self._playlist_id);
                if (auto_show) {
                    self.show_all_course_info();
                }

                // 2022.03.15 - 쪽검색 추가
                if (queryParams.page) {
                    setTimeout(function () {
                        var page = self._playlist_data.info.ebookPages;
                        var this_page = queryParams.page;
                        var this_type = self._playlist_data.info.type;

                        var send_page = {'page': page, 'type': this_type, 'ebook_type': 'ebook', 'this_page': this_page};

                        viewer.showEbook(send_page);
                    }, 500);
                }
            })
            .catch(function (err) {
                show_error_message(err, function () {
                    // window.close();
                });
            });
    },

    ready: function (device_type) {
        var self = this;
        self._device_type = device_type;

        // 목록 창 닫기.
        if ($('body').data('indexClose') == 'Y') {
            $('#viewer-wrap').addClass('aside-close');
        }

        // TODO: 1. 각종 파라미터 확인
        // 수업모드 확인 // 수업모드, 창체모드
        self.parse_query_params();

        // 미러링 초기화
        mirroring.init().then(function () {
            // TODO: 2. 사용자 확인
            return tms.get_user_info();
        }) .then(function () {
            // TODO: 4. 수업 혹은 창체 객체 가져오기
            return tms.get_playlist(self._mode, self._playlist_id, self._filerole);
        }).then(function (data) {
            // console.log(data);
            $.LoadingOverlay("hide");

            viewer._textbookSeq = data.info.textbookSeq;
            self.do_apply_playlist(data);
            self.update_all_course_info();
            self.update_unit_contents();
            // self.get_my_data(); - 내자료 연동 ... 없도도 될거 같아서 뺌 20240614

            // 2022.01.05 CURRICULUM에 추가
            CURRICULUM_CODE = data.info.curriculum;
            ebook.get_unit_data(data);
            // ebook 페이지 이동 버튼 숨김처리
            ebook.move_button_hide();
            viewer.smartpptUseBtnClick();

            window.addEventListener('DrawingCanvasEvent', DrawingCanvasEventHandler);

            function DrawingCanvasEventHandler(e) {
                this.IS_REMOTE_TRIGGER = false;
            }
        }).catch(function (err) {
            $.LoadingOverlay("hide");

            $('body').empty();

            setTimeout(function () {
                show_error_message(err, function () {
//                        window.close();
                    console.log("ready error");
                });
            }, 100);
        });
    },

    update_unit_contents: function () {

        var self = this;
        var params = {periodSeq: self._playlist_id};
//         var params = {periodSeq: 446};
        var ul = $("#viewer-aside-inner .course-file-common ul");
        ul.empty();

        $('.no-toc-area').addClass('folded');
        this.play_list_fit_height(true);

        // var jsTimerStart = performance.now();
        // 내가 저장한 파일 리스트
        tms.get_unit_contents(params)
            .then(function (data) {
                // console.log(data);
                if (data && data.resultCode == 'success' && data.resultData.length > 0) {
                    for (var index = 0; index < data.resultData.length; index++) {
                        var unit_content = data.resultData[index];

                        if (unit_content.fileExtension == 'ZIP') {
                            continue;
                        }

                        var li = $("<li></li>");
                        ul.append(li);

                        var a = $("<a></a>");
                        li.append(a);

                        var title = $("<strong></strong>");
                        a.append(title);

                        li.data(unit_content);
                        title.html(unit_content.contentsTextbookUnitTitle);
                        a.attr("fileId", unit_content.fileId);
                        a.attr("data-toggle", "popover-hover");

                        if (unit_content.thumbnail) {
                            a.attr("data-img", get_url(unit_content.thumbnail));
                            $('#viewer-aside-inner [data-toggle="popover-hover"]').popover({
                                html: true,
                                trigger: 'hover',
                                placement: 'top',
                                boundary: 'window',
                                content: function () {
                                    return '<img src="' + $(this).data('img') + '" />';
                                }
                            });
                        } else {
                            // var jsTimerStart = performance.now();

                            tms.get_file_info(unit_content.fileId).then(function (res) {
                                if (res && res.pages && res.pages.length > 0) {
                                    $('#viewer-aside-inner [data-toggle="popover-hover"][fileId="' + res.id + '"]').attr("data-img", get_url(res.pages[0].thumbnail));
                                    $('#viewer-aside-inner [data-toggle="popover-hover"][fileId="' + res.id + '"]').popover({
                                        html: true,
                                        trigger: 'hover',
                                        placement: 'top',
                                        boundary: 'window',
                                        content: function () {
                                            return '<img src="' + $(this).data('img') + '" />';
                                        }
                                    });
                                }
                            })
                                .catch(function (err) {
                                    console.error(err);
                                });

                            // var jsTimerEnd = performance.now();
                            // console.log("@@ [tms.get_file_info] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
                        }
                    }
                    ul.removeClass("empty");
                } else {
                    ul.addClass("empty");
                }
            })
            .catch(function (err) {
                console.error(err);
            });

        // var jsTimerEnd = performance.now();
        // console.log("@@ [tms.get_unit_contents] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
    },
    _my_data: [],

    get_my_data: function () {
        $("#data-locker ul").LoadingOverlay("show");
        $("#data-locker2 ul").LoadingOverlay("show");

        var select_type = $("#data-locker select").val();

        if (window.matchMedia("(orientation: portrait)").matches && DEVICE_TYPE == 'mobile') { //세로모드
            select_type = $("#data-locker select").val();
        }

        if (window.matchMedia("(orientation: landscape)").matches && DEVICE_TYPE == 'mobile') { // 가로모드
            select_type = $("#data-locker2 select").val();
        }

        var params = {dataDiv: select_type};
        var self = this;

        // var jsTimerStart = performance.now();

        tms.get_my_data(params)
            .then(function (my_data) {
                self._my_data = [];
                if (my_data && my_data.resultCode == 'success') {
                    self._my_data = my_data.resultData;
                }

                var data_locker_ul = $("#data-locker ul");
                var data_locker2_ul = $("#data-locker2 ul");

                data_locker_ul.empty();
                data_locker2_ul.empty();

                for (var index = 0; index < self._my_data.length; index++) {
                    var data = self._my_data[index];

                    var data_div = "스크랩";
                    if (data.dataDiv == "scrap") {
                        data_div = "스크랩";
                    } else if (data.dataDiv == "my") {
                        data_div = "업로드";//직접업로드
                    }

                    var data_title = data.dataTitle;
                    var data_date = data.createDate;
                    data_date = data_date.substring(0, 10).replace(/-/gi, '.');
                    var data_type = data.fileExtension;
                    var data_fileid = data.fileId;

                    var li = $("<li></li>");
                    data_locker_ul.append(li);

                    li.append($('<a class="type"><strong class="ft-purple">' + data_div + '</strong></a>'));
                    var a = $('<a class="txt-line3"></a>');
                    a.attr("title", data_title);
                    a.data(data);
                    a.attr("fileExtension", data_type);
                    a.attr("fileId", data_fileid);
                    a.append($("<strong>" + data_title + "</strong>"));
                    li.append(a);
                    li.data(data);
                    li.append($("<a class='date'>" + data_date + "</a>"));

                    if (data_locker2_ul) {
                        var li = $("<li></li>");
                        data_locker2_ul.append(li);
                        li.append($('<a class="type"><strong class="ft-purple">' + data_div + '</strong></a>'));
                        var a = $('<a class="txt-line3"></a>');
                        a.attr("title", data_title);
                        a.data(data);
                        a.attr("fileExtension", data_type);
                        a.attr("fileId", data_fileid);
                        a.append($("<strong>" + data_title + "</strong>"));
                        li.append(a);
                        li.data(data);
                        li.append($("<a class='date'>" + data_date + "</a>"));
                    }

                    if (SHOW_THUMBNAIL_OF_DATA_LOCKER) {
                        if ('mobile' != this._device_type && 'tablet' != this._device_type) {
                            a.attr("data-toggle", "popover-hover");
                        }

                        if (data.thumbnail) {
                            if ('mobile' == this._device_type || 'tablet' == this._device_type) {
                                return;
                            }
                            a.attr("data-img", get_url(data.thumbnail));
                            $('#data-locker [data-toggle="popover-hover"]').popover({
                                html: true,
                                trigger: 'hover',
                                boundary: 'window',
                                placement: 'top',
                                content: function () {
                                    return '<img src="' + $(this).data('img') + '" />';
                                }
                            });
                        } else {
                            // var jsTimerStart = performance.now();
                            tms.get_file_info(data.fileId)
                                .then(function (res) {

                                    if (res && res.pages && res.pages.length > 0) {
                                        if ('mobile' == this._device_type || 'tablet' == this._device_type) {
                                            return;
                                        }
                                        $('#data-locker [data-toggle="popover-hover"][fileId="' + res.id + '"]').attr("data-img", get_url(res.pages[0].thumbnail));
                                        $('#data-locker [data-toggle="popover-hover"][fileId="' + res.id + '"]').popover({
                                            html: true,
                                            trigger: 'hover',
                                            boundary: 'window',
                                            placement: 'top',
                                            content: function () {
                                                return '<img src="' + $(this).data('img') + '" />';
                                            }
                                        });
                                    }
                                })
                                .catch(function (err) {
                                    console.error(err);
                                });

                            // var jsTimerEnd = performance.now();
//                            console.log("@@ [tms.get_file_info] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
                        }
                    }

                }

                if (self._my_data.length > 0) {
                    $("#data-locker").removeClass("empty");
                    $("#data-locker2").removeClass("empty");
                } else {
                    $("#data-locker").addClass("empty");
                    $("#data-locker2").addClass("empty");
                }

                $("#data-locker ul").LoadingOverlay("hide");
                $("#data-locker2 ul").LoadingOverlay("hide");
            })
            .catch(function (err) {
                $("#data-locker ul").LoadingOverlay("hide");
                $("#data-locker2 ul").LoadingOverlay("hide");
                console.error(err);
            });

        // var jsTimerEnd = performance.now();
        // console.log("@@ [tms.get_my_data] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
    },

    get_bookmark_data: function (textbookLessonSeq, start_obj) {
        // 북마크 정보가져오기
        var self = this;
        var params = {textbookLessonSeq: textbookLessonSeq};

        // var jsTimerStart = performance.now();

        tms.bookmark("list", params)
            .then(function (bookmark_data) {
                self._bookmark_data = bookmark_data;
                if (bookmark_data && bookmark_data.resultCode == 'success') {
                    for (var index = 0; index < bookmark_data.resultData.length; index++) {
                        if (bookmark_data.resultData[index].modalTextbookLessonBookmarkType == "BOOKMARK") {
                            var bookmark_info = bookmark_data.resultData[index];
                            $("#page_list .subject[id=" + bookmark_info.textbookLessonSubjectSeq + "]").addClass("bookmarked");
                            $("#page_list .subject[id=" + bookmark_info.textbookLessonSubjectSeq + "]").attr('modalTextbookLessonBookmarkSeq', bookmark_info.modalTextbookLessonBookmarkSeq);

                            if (start_obj) {
                                if (start_obj.id == bookmark_info.textbookLessonSubjectSeq) {
                                    $(".icon-tool-account3").addClass("bookmarked");
                                }
                            }
                        }
                    }
                }
            })
            .catch(function (err) {
                console.error(err);
            });

        // var jsTimerEnd = performance.now();
        // console.log("@@ [tms.bookmark] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
    },
    update_list_all: function () {
        var active_grade_code = this._active_grade_code;
        var active_term_code = this._active_term_code;
        var active_course_code = this._active_course_code;

        var active_terms = [];
        var active_courses = [];

        var $grade_section_ul = $("#list-all section.list-grade ul");
        $grade_section_ul.empty();

//        console.log('------ this._all_course_info ------');
//        console.log(this._all_course_info);

        // 하단 다른차시 목록
        for (var grade_index in this._all_course_info) {
            var grade = this._all_course_info[grade_index];
//        	console.log(' grade // '+ grade);
//        	var grade = grade_index;

            var $grade_section_li = $("<li></li>");
            $grade_section_ul.append($grade_section_li);
            var $grade_section_a = $("<a></a>");
            $grade_section_li.append($grade_section_a);

//            console.log(grade.code +' // '+ active_grade_code);
            var active = "";
            if (grade.code == active_grade_code) {
                active = "active";
                active_terms = grade.terms;
//                console.log(grade.code +' // '+ active_grade_code);
//                console.log('0. grade.terms >>> '+ grade.terms);
//                console.log('0. active_terms >>> '+ active_terms);
            }
            $grade_section_li.addClass(active);

            $grade_section_a.html('<span>' + grade.title + '</span>');
            $grade_section_li.attr("grade", grade.code);
            $grade_section_li.data(grade);
            $grade_section_a.data(grade);
            $grade_section_a.attr("type", "grade");
        }


//        for (var grade_index = 0; grade_index < this._all_course_info.length; grade_index++) {
//            var grade = this._all_course_info[grade_index];
//
//            var $grade_section_li = $("<li></li>");
//            $grade_section_ul.append($grade_section_li);
//            var $grade_section_a = $("<a></a>");
//            $grade_section_li.append($grade_section_a);
//
//            console.log(grade.code +' // '+ active_grade_code);
//            var active = "";
//            if (grade.code == active_grade_code) {
//                active = "active";
//                active_terms = grade.terms;
//                console.log('grade.terms >>> '+ grade.terms);
//                console.log('active_terms >>> '+ active_terms);
//            }
//            $grade_section_li.addClass(active);
//
//            $grade_section_a.html('<span>' + grade.title + '</span>');
//            $grade_section_li.attr("grade", grade.code);
//            $grade_section_li.data(grade);
//            $grade_section_a.data(grade);
//            $grade_section_a.attr("type", "grade");
//        }

        $term_section_ul = $("#list-all section.list-term ul");
        $term_section_ul.empty();
//        console.log("11.active_terms :" ,active_terms);


       for (var term_index = 0; term_index < active_terms.length; term_index++) {
           var term = active_terms[term_index];

           var $term_section_li = $("<li></li>");
           $term_section_ul.append($term_section_li);
           var $term_section_a = $("<a></a>");
           $term_section_li.append($term_section_a);

           var active = "";
           if (term.code == active_term_code) {
               active = "active";
               active_courses = term.courses;
           }
           $term_section_li.addClass(active);

           $term_section_a.html('<span>' + term.title + '</span>');
           $term_section_li.attr("term", term.code);
           $term_section_li.data(term);
           $term_section_a.data(term);
           $term_section_a.attr("type", "term");
       }

        $course_section_ul = $("#list-all section.list-course ul");
        $course_section_ul.empty();
        for (var course_index = 0; course_index < active_courses.length; course_index++) {
            var course = active_courses[course_index];
            // console.log("course >>" + course);
            // console.log(course);
            var $course_section_li = $("<li></li>");
            $course_section_ul.append($course_section_li);
            var $course_section_a = $("<a></a>");
            $course_section_li.append($course_section_a);
            var active = "";

            if (course.code == active_course_code) {
                active = "active";
            }
            $course_section_li.addClass(active);

            // console.log("!!!!"+course.revCd);
            // if(course.revCd == '2022'){
            //     // console.log("!!!!");
            //     $course_section_a.html('<span>' + course.title + '(' + course.revCd + ')' + '</span>');
            // }else {
                $course_section_a.html('<span>' + course.title + '</span>');
            // }

            $course_section_li.attr("course", course.code);
            $course_section_li.data(course);
			// $course_section_li.attr("textbookCurriculumRevCd", course.textbookCurriculumRevCd);
            $course_section_li.attr("textbookSeq", course.textbookSeq);
            $course_section_a.data(course);
            $course_section_a.attr("type", "course");
			// $course_section_a.attr("textbookCurriculumRevCd", course.textbookCurriculumRevCd);
            $course_section_a.attr("textbookSeq", course.textbookSeq);

        }
    },

    update_detail_course_info: function (active_period_seq) {
        // console.log("> update_detail_course_info >> "+ active_period_seq);
        var $unit_high_ul = $("#list-all section.list-unit.high ul");
        var $unit_mid_ul = $("#list-all section.list-unit.mid ul");
        var $unit_period_ul = $("#list-all section.list-period ul");
        $unit_high_ul.empty();
        $unit_mid_ul.empty();
        $unit_period_ul.empty();
        $unit_period_ul.addClass('empty');
        $("#list-all section.list-unit.mid").addClass("hidden");

        function set_periods(periods, textbookLessonUpper) {
            var ret = false;
            var unit_high_list = _.filter(periods, function (obj) {
                return obj.textbookLessonSeq == active_period_seq;
            });

            if (unit_high_list.length <= 0) {
                return false;
            }
            for (var index = 0; index < periods.length; index++) {
                var obj = periods[index];
                if (obj.textbookLessonUpper != textbookLessonUpper) {
                    break;
                }
                var $period_section_li = $("<li></li>");
                $unit_period_ul.append($period_section_li);
                var $period_section_a = $("<a></a>");
                $period_section_li.append($period_section_a);

                var active = "";
                if (obj.textbookLessonSeq == active_period_seq) {
                    active = "active";
                }
                $period_section_li.addClass(active);
                $period_section_a.html('<span>' + obj.textbookLessonPeriodTitle + '</span>');
                $period_section_li.attr("textbookLessonSeq", obj.textbookLessonSeq);
                $period_section_li.data(obj);
                $period_section_a.data(obj);
                $period_section_a.attr("type", "period");
                ret = true;
            }
            if (periods.length > 0) {
                $unit_period_ul.removeClass('empty');
            }
            return ret;
        }

        function set_unit_mid(units, textbookLessonUpper) {
            var ret = false;
            var unit_mid_list = _.filter(units, function (obj) {
                return obj.textbookLessonUpper == textbookLessonUpper;
            });
            if (unit_mid_list.length <= 0) {
                return false;
            }

            var has_active_peroid = false;
            for (var index = 0; index < unit_mid_list.length; index++) {
                var unit = unit_mid_list[index];

                var unit_periods_list = _.filter(unit.periods, function (obj) {
                    return obj.textbookLessonSeq == active_period_seq;
                });
                if (unit_periods_list.length > 0) {
                    has_active_peroid = true;
                    break;
                }
            }
            if (!has_active_peroid) {
                return false;
            }

            for (var index = 0; index < unit_mid_list.length; index++) {
                var unit = unit_mid_list[index];

                var active = "";
                var ret2 = set_periods(unit.periods, unit.textbookLessonSeq);
                // console.log(unit, ret2);
                if (ret2) {
                    active = "active";
                    ret = true;
                }

                var $unit_section_li = $("<li></li>");
                $unit_mid_ul.append($unit_section_li);
                var $unit_section_a = $("<a></a>");
                $unit_section_li.append($unit_section_a);

                $unit_section_li.addClass(active);

                $unit_section_a.html('<span>' + unit.textbookLessonUnitMidTitle + '</span>');
                $unit_section_li.attr("textbookLessonSeq", unit.textbookLessonSeq);
                $unit_section_li.data(unit);
                $unit_section_a.data(unit);
                $unit_section_a.attr("type", "unit-mid");
            }

            return ret;
        }

        try {
            var unit_high_list = _.filter(this._detail_course_info.units, function (unit) {
                return unit.textbookLessonTypeCd == "UNIT_HIGH";
            });
        } catch (error) {
            return false;
        }

        // console.log("unit_high_list", unit_high_list);
        for (var index = 0; index < unit_high_list.length; index++) {
            var unit = unit_high_list[index];

            var $unit_section_li = $("<li></li>");
            $unit_high_ul.append($unit_section_li);
            var $unit_section_a = $("<a></a>");
            $unit_section_li.append($unit_section_a);

            var active = "";

            var ret = set_unit_mid(this._detail_course_info.units, unit.textbookLessonSeq);
            if (ret) {
                active = "active";
                $("#list-all section.list-unit.mid").removeClass("hidden");
            } else {
                ret = set_periods(unit.periods, unit.textbookLessonSeq);
                if (ret) {
                    active = "active";
                }
            }

            $unit_section_li.addClass(active);
            $unit_section_a.html('<span>' + unit.textbookLessonUnitHighTitle + '</span>');
            $unit_section_li.attr("textbookLessonSeq", unit.textbookLessonSeq);

            $unit_section_li.data(unit);
            $unit_section_a.data(unit);
            $unit_section_a.attr("type", "unit-high");

            // console.log($unit_section_li.html());

        }
    },
    update_browse_grade: function (terms, active_term_code) {
        var data_grade = $("#list-all section.list-grade ul li.active a").data();

        var active_courses = [];
        $term_section_ul = $("#list-all section.list-term ul");
        $term_section_ul.empty();
        for (var term_index = 0; term_index < terms.length; term_index++) {
            var term = terms[term_index];

            var $term_section_li = $("<li></li>");
            $term_section_ul.append($term_section_li);
            var $term_section_a = $("<a></a>");
            $term_section_li.append($term_section_a);

            var active = "";
            // 2021.08.19 추가 : 학기가 2개 이상일 때 2~7월이면 1학기, 8~1월이면 2학기 학기 디폴트
            if (terms.length == 2) {
                var _month = new Date().getMonth() + 1;

                if (((2 <= _month) && (_month <= 7)) && term.code == '01') {
                    active = "active";
                    active_courses = term.courses;
                } else if (((1 == _month) || ((8 <= _month) && (_month <= 12))) && term.code == '02') {
                    active = "active";
                    active_courses = term.courses;
                }
            } else if (terms.length == 1) {
                active = "active";
                active_courses = term.courses;
            }
            $term_section_li.addClass(active);
            // 추가 끝


            $term_section_a.html('<span>' + term.title + '</span>');
            $term_section_li.attr("term", term.code);
            $term_section_li.data(term);
            $term_section_a.data(term);
            $term_section_a.attr("type", "term");
        }

        if (active_courses.length > 0) {
            this.update_browse_term(active_courses);
        }
    },
    update_browse_term: function (courses, active_course_code) {
        var data_grade = $("#list-all section.list-grade ul li.active a").data();
        var data_term = $("#list-all section.list-term ul li.active a").data();

        $course_section_ul = $("#list-all section.list-course ul");
        $course_section_ul.empty();

        for (var index = 0; index < courses.length; index++) {
            var course = courses[index];
            // console.log(">>>"+ index+"//"+course);
            var $course_section_li = $("<li></li>");
            $course_section_ul.append($course_section_li);
            var $course_section_a = $("<a></a>");
            $course_section_li.append($course_section_a);

            // console.log("active_course_code : "+ active_course_code);
            var active = "";
            if (active_course_code) {
                if (course.code == active_course_code) {
                    active = "active";
                }
            } else if (index == 0) {
                active = "active";
            }

            $course_section_li.addClass(active);

            // console.log("!!!!"+course.revCd);
            // if(course.revCd == '2022'){
            //     $course_section_a.html('<span>' + course.title + '(' + course.revCd + ')' + '</span>');
            // }else {
                $course_section_a.html('<span>' + course.title + '</span>');
            // }
            // $course_section_a.html('<span>' + course.title + '</span>');
            $course_section_li.attr("course", course.code);
			// $course_section_li.attr("textbookCurriculumRevCd", course.textbookCurriculumRevCd);
            // $course_section_li.attr("textbookSeq", course.textbookSeq);
            $course_section_li.data(course);
            $course_section_a.data(course);
            $course_section_a.attr("type", "course");
            // $course_section_a.attr("textbookCurriculumRevCd", course.textbookCurriculumRevCd);
            $course_section_a.attr("textbookSeq", course.textbookSeq);

            if (active) {
                this.update_browse_course(data_grade.code, data_term.code, course.code, course.textbookSeq);
            }
        }
    },

    //다른차시 눌럿을때
    update_browse_course: function (grade, term, course, textbookSeq) {
        var self = this;

        tms.get_detail_course_info({
			textbookSeq: textbookSeq,
            textbookCurriculumGradeCd: grade,
            textbookCurriculumTermCd: term,
            textbookCurriculumCourseCd: course,
            // highMidCode: "UNIT_HIGH"

        }).then(function (res) {
            self._detail_course_info = res.resultData;
            // this.update_detail_course_info(undefined);
            console.log("-------- update_browse_course -----------");
            console.log(res.resultData);

            var $unit_high_ul = $("#list-all section.list-unit.high ul");
            var $unit_mid_ul = $("#list-all section.list-unit.mid ul");
            var $unit_period_ul = $("#list-all section.list-period ul");
            $unit_high_ul.empty();
            $unit_mid_ul.empty();
            $unit_period_ul.empty();
            $unit_period_ul.addClass('empty');
            $("#list-all section.list-unit.mid").addClass("hidden");

            var unit_high_list = _.filter(self._detail_course_info.units, function (unit) {
                return unit.textbookLessonTypeCd == "UNIT_HIGH";
            });
            // console.log(unit_high_list.length);
            for (var index = 0; index < unit_high_list.length; index++) {
                var unit = unit_high_list[index];

                var $unit_section_li = $("<li></li>");
                $unit_high_ul.append($unit_section_li);
                var $unit_section_a = $("<a></a>");
                $unit_section_li.append($unit_section_a);

                var active = "";
                if (index == 0) {
                    active = "active";
                    // _detail_course_info_high 여기에 중단원만 넣고
                    var unit_mid_list = _.filter(self._detail_course_info.units, function (obj) {
                        return obj.textbookLessonUpper == unit.textbookLessonSeq;
                    });
                    if (unit_mid_list.length <= 0) {
                        $("#list-all section.list-unit.mid").addClass("hidden");
                        // self.update_browse_periods(unit.periods, undefined);
                        self.update_browse_periods(unit.periods, this._playlist_id);
                    } else {
                        $("#list-all section.list-unit.mid").removeClass("hidden");
                        self.update_browse_unit(unit_mid_list, undefined, "mid");
                    }
                }

                // console.log('textbooklessonseq ; ', textbooklessonseq);
                // console.log('unit ; ', unit);
                $unit_section_li.addClass(active);
                $unit_section_a.html('<span>' + unit.textbookLessonUnitHighTitle + '</span>');
                $unit_section_li.attr("textbookLessonSeq", unit.textbookLessonSeq);
                $unit_section_li.data(unit);
                $unit_section_a.data(unit);
                $unit_section_a.attr("type", "unit-high");
            }
        }).catch(function (err) {
            // alert(err);
            show_error_message(err);
        });
    },

    update_browse_unit: function (units, active_seq, target_unit) {
        var $unit_ul = undefined;
        $unit_ul = $("#list-all section.list-unit." + target_unit + " ul");
        if (!$unit_ul) {
            return;
        }

        $unit_ul.empty();
        for (var index = 0; index < units.length; index++) {
            var unit = units[index];

            var active = "";
            if (active_seq) {
                if (unit.textbookLessonSeq == active_seq) {
                    active = "active";
                }
            } else if (index == 0) {
                active = "active";
            }
            var $unit_section_li = $("<li></li>");
            $unit_ul.append($unit_section_li);
            var $unit_section_a = $("<a></a>");
            $unit_section_li.append($unit_section_a);

            $unit_section_li.addClass(active);

            $unit_section_a.html('<span>' + unit.textbookLessonUnitMidTitle + '</span>');
            $unit_section_li.attr("textbookLessonSeq", unit.textbookLessonSeq);
            $unit_section_li.data(unit);
            $unit_section_a.data(unit);
            $unit_section_a.attr("type", "unit-" + target_unit);

            if (index == 0) {

                var unit_sub_list = _.filter(this._detail_course_info.units, function (obj) {
                    return obj.textbookLessonUpper == unit.textbookLessonSeq;
                });
                var target_sub_unit = "low";
                if (target_unit == "high") {
                    target_sub_unit = "mid";
                } else if (target_unit == "mid") {
                    target_sub_unit = "low";
                } else if (target_unit == "low") {
                    target_sub_unit = "nononono";
                }
                if (unit_sub_list.length <= 0) {
                    $("#list-all section.list-unit." + target_sub_unit).addClass("hidden");
                    this.update_browse_periods(unit.periods, undefined);
                } else {
                    $("#list-all section.list-unit." + target_sub_unit).removeClass("hidden");
                    this.update_browse_unit(unit_sub_list, undefined, target_sub_unit);
                }
            }
        }
    },
    update_browse_periods: function (periods, active_period_seq) {
        var $unit_period_ul = $("#list-all section.list-period ul");
        $unit_period_ul.empty();
        $unit_period_ul.addClass('empty');
        for (var index = 0; index < periods.length; index++) {
            var obj = periods[index];
            var $period_section_li = $("<li></li>");
            $unit_period_ul.append($period_section_li);
            var $period_section_a = $("<a></a>");
            $period_section_li.append($period_section_a);

            var active = "";
            if (active_period_seq) {
                if (obj.textbookLessonSeq == active_period_seq) {
                    active = "active";
                }
            } else if (index == 0) {
                active = "active";
            }

            // console.log("obj ====>");
            // console.log(obj);
            $period_section_li.addClass(active);
            $period_section_a.html('<span>' + obj.textbookLessonPeriodTitle + '</span>');
            $period_section_li.attr("textbookLessonSeq", obj.textbookLessonSeq);
            $period_section_li.attr("originLessonSeq", obj.origin);
            $period_section_li.data(obj);
            $period_section_a.data(obj);
            $period_section_a.attr("type", "period");
        }
        if (periods.length > 0) {
            $unit_period_ul.removeClass('empty');
        }
    },

    show_all_course_info: function () {
        $("#list-all").addClass('active');
        $("#viewer-tool .icon-tool2").parent().addClass('active');
    },
    hide_all_course_info: function () {
        var self = this;
        var is_active = $("#list-all").hasClass('active');
        setTimeout(function () {

            $("#list-all").removeClass('active');
            $("#viewer-tool .icon-tool2").parent().removeClass('active');
            if (is_active) {
                self.update_all_course_info();
            }
        }, 200);
    },
    toggle_all_course_info: function () {
        if ($("#list-all").hasClass("active")) {
            this.hide_all_course_info();
        } else {
            if (!this._all_course_info) {
                this.update_all_course_info(true);
            } else {
                this.show_all_course_info();
                // this.update_all_course_info();
            }

        }
    },
    browse_period: function (period_seq, _start) {

        if (TEST_DATA) {
            return;
        }
        console.log("browse_period:", period_seq, _start);
        // 수업정보 받아오기
        var self = this;
        $.LoadingOverlay("show");

        // var jsTimerStart = performance.now();


        var originLessonSeq = '';
        tms.get_smartppt_info(period_seq)
            .then(function (data) {
                // console.log("get_smartppt_info data:", data);
                if (!data || !data.info || data.info <= 0) {
                    throw "잘못된 수업정보입니다.";
                }
                // console.log(data.info);
                originLessonSeq = data.info.origin;
                // console.log(data.info.origin);

                $.LoadingOverlay("hide");

                if(!originLessonSeq || originLessonSeq == null || originLessonSeq =='' || typeof originLessonSeq === 'undefined'){
                    console.log(originLessonSeq);
                    console.log(typeof originLessonSeq);
                    tms.get_playlist(self._mode, period_seq)
                        .then(function (data) {
                            console.log("browse_period data:", data);
                            if (!data || !data.playlist || data.playlist.length <= 0) {
                                throw "잘못된 수업정보입니다.";
                            }
                            self._start_id = _start;
                            self._playlist_id = period_seq;
                            self.do_apply_playlist(data);
                            self.update_unit_contents();

                            $.LoadingOverlay("hide");

                            self.hide_all_course_info();

                        })
                        .catch(function (err) {
                            $.LoadingOverlay("hide");
                            show_error_message(err);
                        });

                }else {
                    // console.log(originLessonSeq);
                    // console.log(typeof originLessonSeq);

                    //https://ele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=5952&ticket=D9DDE76F5D59AFBC040894C11F920A3F
                    //https://ele.m-teacher.co.kr/Ebook/v.mrn?playlist=5952&start=1&indexclose=Y&filerole=original
                    const classLayerUrl = `https://ele.m-teacher.co.kr/Ebook/v.mrn?start=1&indexclose=Y&filerole=original`;
                    let subjectSeqWithParameters = `&playlist=`+originLessonSeq;
                    let userWithParameters = `&user=`+queryParams.user;
                    const urlWithParameters = `${classLayerUrl}${subjectSeqWithParameters}${userWithParameters}`;
                    // console.log(urlWithParameters);
                    self.winOpen(urlWithParameters, window.screen.width-10, window.screen.height-10, null, 'popCurriculumPage');

                }


            })
            .catch(function (err) {
                $.LoadingOverlay("hide");
                show_error_message(err);
            });


        // var jsTimerEnd = performance.now();
        // console.log("@@ [tms.get_playlist] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");

    },
    curriculum_code_auth_setting: function () {
        /*
            2022.01.05 : 수학 과목인 경우 수학 교구 버튼 show
            국정 교과서에는 노출하지 않고 검정 교과서에서 노출해야 함
            수학 교구 - 계산기는 페이지 이동 시 닫혀야 함
        */

        $('#calculator_wrap').removeClass('active');
        if (viewer._playlist_data.info.type == 'MA' &&
            CURRICULUM_CODE == 'AUTH' &&
            !$('#iframe_content_pairbook').attr('src')) {
            // 수학교구 버튼
            $('#math_tool_btn').css('display', 'block');
        } else {
            $('#math_tool_btn').css('display', 'none');
        }
    },

    browse: function ($ele) {
        var event_source_type = $ele.attr("type");
        var data = $ele.data();
        // var textbook_seq =
        // console.log(">> $ele.data()");
        // console.log($ele.data());
        // console.log(">> textbookSeq : "+$ele.data().terms[0].courses[0].textbookSeq);
        // self._all_course_info[0].terms[0].courses[0].textbookSeq,

        if ($ele.parent().hasClass("active")) {
            //return;
        }

        if (event_source_type == "period") {
            if ($ele.parent().hasClass("active")) {
                // return;
            }

            $("#list-all section.list-period ul li.active").removeClass('active');
            $ele.parent().addClass('active');
            this.browse_period(data.textbookLessonSeq);

            return;
        } else if (event_source_type == "unit-low") {
            $("#list-all section.list-unit.low ul li.active").removeClass('active');
            $ele.parent().addClass('active');
            this.update_browse_periods(data.periods, undefined);
            return;
        } else if (event_source_type == "unit-mid") {
            $("#list-all section.list-unit.mid ul li.active").removeClass('active');
            $ele.parent().addClass('active');
            var unit_sub_list = _.filter(this._detail_course_info.units, function (obj) {
                return obj.textbookLessonUpper == data.textbookLessonSeq;
            });
            if (unit_sub_list.length <= 0) {
                $("#list-all section.list-unit.low").addClass("hidden");
                this.update_browse_periods(data.periods, undefined);
            } else {
                $("#list-all section.list-unit.low").removeClass("hidden");
                this.update_browse_unit(unit_sub_list, undefined, "low");
            }
            return;
        } else if (event_source_type == "unit-high") {
            $("#list-all section.list-unit.high ul li.active").removeClass('active');
            $ele.parent().addClass('active');

            var unit_mid_list = _.filter(this._detail_course_info.units, function (obj) {
                return obj.textbookLessonUpper == data.textbookLessonSeq;
            });
            if (unit_mid_list.length <= 0) {
                $("#list-all section.list-unit.mid").addClass("hidden");
                this.update_browse_periods(data.periods, undefined);
            } else {
                $("#list-all section.list-unit.mid").removeClass("hidden");
                this.update_browse_unit(unit_mid_list, undefined, "mid");
            }
            return;
        } else if (event_source_type == "course") {
            $("#list-all section.list-course ul li.active").removeClass('active');
            $ele.parent().addClass('active');

            var data_grade = $("#list-all section.list-grade ul li.active a").data();
            var data_term = $("#list-all section.list-term ul li.active a").data();
			var data_course = $("#list-all section.list-course ul li.active a").data();

            this.update_browse_course(data_grade.code, data_term.code, data.code, data_course.textbookSeq);
            // alert("과목 브라우징");
            return;
        } else if (event_source_type == "term") {
            // alert("학기 브라우징");
            $("#list-all section.list-term ul li.active").removeClass('active');
            $ele.parent().addClass('active');

            this.update_browse_term(data.courses);
            return;
        } else if (event_source_type == "grade") {
            // alert("학년 브라우징");
            $("#list-all section.list-grade ul li.active").removeClass('active');
            $ele.parent().addClass('active');

            this.update_browse_grade(data.terms);
            return;
        }
    },

    resize: function () {
        // 윈도우 크기 조절 시 뷰어 크기 조절
        var $iframe_parent = $("#viewer-content");
        // console.log($iframe_parent.get(0));
        // console.log($iframe_parent.contents());
        // console.log($iframe_parent.data());
        // console.log($iframe_parent.children('iframe'));
        // console.log($iframe_parent.children('iframe').length);
        // console.log($("#iframe_content").attr('src'));
        // console.log($("#iframe_content_pairbook").attr('src'));
        // console.log($("#iframe_tools").attr('src'));
        // console.log(SCREEN_ID);
        if (SCREEN_ID == 'iframe_content_pairbook') {
            this.fit_smartppt_content_element_to_parent($("#iframe_content_pairbook"), $iframe_parent);

        } else if(SCREEN_ID == 'iframe_tools'){
            this.fit_smartppt_content_element_to_parent($("#iframe_tools"), $iframe_parent);

        } else {
            this.fit_smartppt_content_element_to_parent($("#iframe_content"), $iframe_parent);
        }
        // var frame_name = "";
        // if ($iframe_parent.children('iframe').length > 0){
        //     var count = $iframe_parent.children('iframe').length;
        //     var iframeList = $iframe_parent.children('iframe');
        //     for(var i = 0; i < count ; i++){
        //         var iframe_p = iframeList.get(i);
        //         var iframe_src = iframe_p.src;
        //
        //         console.log("for (", i, ") : ", iframe_src);
        //         if ( iframe_src != null || iframe_src != ''){
        //             frame_name = iframe_p.id;
        //
        //         }
        //         console.log("for (", i, ") : ", frame_name);
        //
        //         // console.log(iframe_p);
        //         // console.log($iframe_parent.children('iframe').get(i).find('src'));
        //         // console.log($iframe_parent.children('iframe').get(i).src);
        //         // var p_src = iframe_p.attr('src');
        //         // if()
        //
        //     }
        // }
        // try {
        //     this.fit_smartppt_content_element_to_parent($("#iframe_content"), $iframe_parent);
        // } catch (error) {
        // }
        // try {
        //     this.fit_smartppt_content_element_to_parent($("#iframe_content_pairbook"), $iframe_parent);
        // } catch (error) {
        // }
        // try {
        //     this.fit_smartppt_content_element_to_parent($("#iframe_tools"), $iframe_parent);
        // } catch (error) {
        // }

        // 이동버튼 방식 선택
        var page_button_setting = getCookie('pageBtnUse');
        if (page_button_setting == 'right') { // 우측하단 버튼만 사용.
            $(".icon-prev-content, .icon-next-content").hide();
        } else {
            $(".icon-prev-content, .icon-next-content").show();
        }

    },

    load_smartppt: function (obj) {
        if (!obj) {
            throw new Error("잘못된 정보입니다.");
        }

        // thumbnail 변환 체크
        if (obj.type != 'smartppt' && obj.conv_yn == 'N' && '#' != obj.url) {
            alert("변환 중입니다.");
            return false;
        }

        $('#module-modal').modal('hide');
        on_hidden_module_modal();

        var self = this;
        var url = obj.url;

        // console.log("url >>" + obj.url);
        // console.log("url >>" + url);

        var $targetiframe = $("#iframe_content");
        var cur_url = $targetiframe.attr("src");

        if (cur_url == url && '#' != url) {
            //return;
        }
        // self._playing = obj;
        self._current_index = _.findIndex(self._playlist_data.playlist, function (item) {
            return item.id == obj.id;
        });

        if ('#' == url) {
            self._current_index = self._current_index + 1;
            obj = self._playlist_data.playlist[self._current_index];
            url = obj.url;
            if ('#' == url) {
                this.load_smartppt(obj);
                return;
            }
        }

        // url = get_url(url);
        // console.log(">>>>>>>>>>>>>>>>>>>");
        // console.log(obj);
        if(obj.uploadMethod == "CMS" && obj.fileType== "video"){
            url = "/Ebook/ViewVideo.mrn?type=hls&src="+obj.url;
        } else if (obj.uploadMethod == "CMS") {
            url = get_cms_url(obj.uploadMethod, url);
        } else {
            url = get_url(url);
        }

        console.log("url >>... " + url);

        self._playing = obj;
        self._current_page = obj.num;

        self.update_viewer_current_info();

        console.log("load_smartppt");
        console.log(JSON.stringify(obj));
        console.log(obj.url);
        console.log('obj.fileType >> '+obj.fileType);
        // pdf 이면
        if (obj.fileType == 'PDF' || obj.fileType == 'document') {
            console.log('obj.fileType if >> '+obj.fileType);
            load_preview('file', obj.fileId, obj.title, '', undefined, 'pdf', obj.url);

            this.content_thumbnail();
            return;
        }
        //요기를 살리면 문서 iframe에서 다운로드가 사라진다... 왜???
        else if (obj.fileType == 'video') {
            console.log('obj.type else >> '+obj.type);
            viewer.open_video(obj.type, obj.url, obj.title, obj.fileId);
        }


        if (obj.type == 'pop') {
            /*
            self._prev_index = _.findIndex(self._playlist_data.playlist, function(obj) {
                return obj.type == 'pop';
            });
            */
            // $targetiframe.attr('src', url);

            // var popup_title = '<strong>'+obj.corner+'</strong>'+obj.title;
            // self.open_popup_url(url, true, popup_title);
            // return;
        } else {
            self._prev_index = self._current_index;
        }

        var $iframe_parent = $("#viewer-content");
        self.load_iframe_by_url(url, $targetiframe, $iframe_parent, null, obj.fileUrl);
        this.content_thumbnail();

//        if (this._bookmark_data) {
//            var bookmark_info = _.find(this._bookmark_data.resultData, function (item) {
//                return item.textbookLessonSubjectSeq == obj.id;
//            });
//
//            if (bookmark_info && bookmark_info.modalTextbookLessonBookmarkType == "BOOKMARK") {
//                $(".icon-tool-account3").addClass("bookmarked");
//            } else {
//                $(".icon-tool-account3").removeClass("bookmarked");
//            }
//        } else {
//            $(".icon-tool-account3").removeClass("bookmarked");
//        }

        if (this.is_mirroring_window()) return;

        var modalDiv = self._playlist_data.info.modalDiv;
        var params = {
            modalDiv: modalDiv,
            textbookLessonSeq: this._playlist_id,
            textbookLessonSubjectSeq: obj.id
        }
        // 뷰어 최근 차시 정보 저장 부분
        // tms.history(params);
        // this.save_progress_history(params);

        // 수정.
        $("#module-modal").modal('hide');

        // CUSTOM 수업일 때 닫기 버튼, 다운로드 버튼 숨기기
        console.log("CUSTOM 수업일 때 닫기 버튼, 다운로드 버튼 숨기기");
        console.log(self._playlist_data.info.modalDiv+'//'+obj.customYn +"//"+get_current_content_type());
        if ((self._playlist_data.info.modalDiv == "CUSTOM") && (obj.customYn == 'Y') && (get_current_content_type() == 'preview')) {
            $("#module-modal .close").hide();
        } else {
            $("#module-modal .close").show();
        }
    },

    hide_iframe_content: function () {
        $("#iframe_content").hide();
        stop_all_media($("#iframe_content"));
    },

    _progress_history_timer: undefined,
    _progress_history_timer_time: PROGRESS_HISTORY_TIME,

    save_progress_history: function (params) {
        var self = this;
        self.cancel_progress_history();
        self._progress_history_timer = setTimeout(function () {
            self._progress_history_timer = undefined;
//            tms.progress_history(params);
        }, self._progress_history_timer_time);
    },
    cancel_progress_history: function () {
        if (this._progress_history_timer) {
            clearTimeout(this._progress_history_timer);
            this._progress_history_timer = undefined;
        }
    },
    load_iframe_by_url: function (url, $targetiframe, $iframe_parent, default_popup_title, file_url) {
        $("#viewer-content").LoadingOverlay("show", loading_overlay_default);

        var old_url = $targetiframe.attr('src');
        var self = this;
        $targetiframe.off('load');

        console.log($targetiframe);
        console.log("$targetiframe.attr('id') : "+$targetiframe.attr('id'));
        console.log("$targetiframe.attr('id') url: "+url);
        if ($targetiframe.attr('id') == 'iframe_content_pairbook') {
            $targetiframe.attr('src', '');
            $targetiframe.show();

            if (self._device_type == 'mobile') {
                $(".course-special").removeClass("active");
                // $("#hd .title").html(this._playlist_data.info.shortTitle);
            }
        } else if ($targetiframe.attr('id') == 'iframe_content') {
            if (DEVICE_TYPE == 'mobile') {
                $("#hd .title").html(self._playlist_data.info.shortTitle);
            }

            // 수학 /사회일 경우 설정 - 콘텐츠 화면 비율을 채우기에서 비율 맞추기로 수정
//            console.log(this._playlist_data.info.type);
            if ((this._playlist_data.info.type == 'SO' || this._playlist_data.info.type == 'MA' || this._playlist_data.info.type == 'SC' || CURRICULUM_CODE == 'AUTH') && this.user_selected_ratio == false) {
                $('#screen-ratio-fill').parent().removeClass('active');
                // $('#screen-ratio-fit').click();
                viewer.settingRatioFit();
            } else if ((this._playlist_data.info.type == 'KOA') && this.user_selected_ratio == false) {
                $('#screen-ratio-fit').parent().removeClass('active');
                // $('#screen-ratio-fill').click();
                viewer.settingRatioFill();
            }
        }

        $targetiframe.on('load', function (e) {
            // $targetiframe.off('load');
            $("#viewer-content").LoadingOverlay("hide", true);

            var $video = $targetiframe.contents().find('video');
            if ($video) {
                $video.attr('playsinline', true);
            }

            if ($targetiframe.attr('id') == 'iframe_tools') {
                if (url && url.length > 0) {
                    $(".drawing-canvas-wrapper").addClass('hidden');
                }

            }
           else {
               $(".drawing-canvas-wrapper").removeClass('hidden');
               // var old_current_content_type = current_content_type;
               // current_content_type = get_current_content_type();
               // if(old_current_content_type != current_content_type) {
               Module.common.iframe_zoom($targetiframe.attr('id'), 3);
               //}


               // var old_current_content_type = current_content_type;
               // current_content_type = get_current_content_type();
               // if (old_current_content_type != current_content_type || old_url != url) {
               if (iframe_canvas) {

                   old_drawing_mode = iframe_canvas.mode;
                   iframe_canvas.destroy();
                   iframe_canvas = undefined;

                   $("#drawing-button").removeClass('active');
                   $("#drawing").removeClass('active');

                   $("#math_tool_btn").removeClass('active');
                   $("#math-tool").removeClass('active');
               }
               // }

               if (!iframe_canvas) {
                   var _container = $("#viewer-content .drawing-canvas").get(0);

                   iframe_canvas = new DrawingCanvas({
                       container: _container,
                   });

                   // iframe attrs iframe_tools에서 변환 필요
                   if ($targetiframe.attr('id') == 'iframe_content') {
                       // if ($targetiframe.attr('id') == 'iframe_content' || $targetiframe.attr('id') == 'iframe_tools') {
                       // page 정보
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
                       var playlist = viewer._playing.TEXTBOOK_LESSON_SUBJECT_SEQ;
                       // var user_id = viewer._queryParams.user;
                       var user_id = $('body').data('userIdx');

                       var thumbnail = viewer._playing.thumbnail;
                       var info_title = viewer._playlist_data.info.title;
                       // var playlist_title = viewer._playing.title;
                       var type = iframe_canvas.type;
                       var mode = '';

                       // 주제명이 없으면 코너명으로 대체
                       var playlist_title;

                       if (viewer._playing.title == '' || viewer._playing.title == null) {
                           playlist_title = viewer._playing.corner;
                       } else {
                           playlist_title = viewer._playing.title;
                       };

                       // 커스텀 모드 확인
                       if (viewer._playlist_data.info.modalDiv == undefined) {
                           mode = "DEFAULT";
                       } else {
                           mode = viewer._playlist_data.info.modalDiv;
                       }

                       // load
                       // viewer에서 사용중인 canvas정보 보내기
                       setTimeout(function () {
//                            canvas_save_load.get_canvas_data(iframe_canvas);
                           // viewer의 canvas 저장을 위해 data 보내기
//                            canvas_save_load.get_page_data(plying_id, playlist, user_id, thumbnail, info_title, playlist_title, page, mode);
                           // 저장된 그림이 있으면 로드 // 20240116 주석처리
//                            canvas_save_load.canvas_load(plying_id, playlist, user_id, type, mode);
                           $(".drawing-canvas-wrapper").show();
                       }, 500);
                   }
               }
               iframe_canvas.fitStage();
           }
            var $iframe = $(this);

           // console.log(" $iframe >> "+old_url);
           // console.log($iframe.get(0));
            SCREEN_ID= $iframe.get(0).id;
            console.log( ' SCREEN_ID ; ' ,SCREEN_ID);
            var temp = $('#iframe_content').attr('src');
           // console.log(temp);
           // console.log(temp.contentDocument);

            // var viewports = $iframe.get(0).contents().find('meta[name=viewport]').attr("content");
            try {
               // $iframe.get(0).contentWindow.open = function (open_url, windowName, windowFeatures) {
               //     // alert("iframe에서 link 이동하려함!\n"+open_url+", target: "+windowName);
               //     // $(".temp_smart_ppt_iframe").animate({ opacity: '0.1' }, 100);
               //
               //     /*
               //         콘텐츠 내부 버튼 클릭 시 미러링이 불가능한 동영상이 뜨는 것을 방지하기 위해 기능 추가
               //     */
               //     var __check_yutube = open_url.startsWith("https://www.youtube.com/embed/");
               //
               //     if (__check_yutube) {
               //         load_preview('video', undefined, '', '', undefined, 'youtube', open_url);
               //         return false;
               //     }
               //     // 추가 끝 - 2022.03.24
               //
               //     if (!open_url.startsWith("http")) {
               //         var urls = self._playing.url.split('/');
               //         urls[urls.length - 1] = open_url;
               //         open_url = urls.join("/");
               //     }
               //     console.log(" open_url >> "+open_url);
               //
               //
               //     open_url = get_url(open_url);
               //     var popup_title = $("#page_list .subject.active a").html();
               //     if ($("#page_list .subject.active a").hasClass("only_corner")) {
               //         popup_title = $("#page_list .subject.active a").text();
               //     }
               //     console.log(" open_url >> "+open_url);
               //     self.open_popup_url(open_url, false, popup_title);
               //
               // };

                if ($iframe.attr('id') == 'iframe_content_pairbook') {
                    var corner = $iframe.contents().find("#hd h1 i").html();
                    var title = $iframe.contents().find("h2").html();
                    if (corner) {
                        corner = '<strong>' + corner + '</strong>';
                    } else {
                        corner = '';
                    }
                    if (!title) title = '';
                    title = '';
                    var popup_title = corner + title;
                    if (!popup_title) {
                        popup_title = default_popup_title;
                    }
                    $(".popup.tools .title").html(popup_title);


                    if (self._device_type == 'mobile' && $iframe.is(":visible")) {
                        $("#hd .title").html(popup_title);
                    }

                } else if ($iframe.attr('id') == 'iframe_tools') {

                    var orgClose = $iframe.get(0).contentWindow.close;
                    $iframe.get(0).contentWindow.close = function () {
                        app.close_study_tools();

                        current_content_type = get_current_content_type();

                        // 수정.
                        setTimeout(function () {
                            $(".drawing-canvas-wrapper").removeClass('hidden');
                            $(".drawing-canvas-wrapper").show();
                        }, 500);

                    };

                    this.contentWindow.addEventListener('close_window', function () {
                        app.close_study_tools();
                        current_content_type = get_current_content_type();

                        // 수정.
                        setTimeout(function () {
                            $(".drawing-canvas-wrapper").removeClass('hidden');
                        }, 500);


                    });

                    // this.contentWindow.addEventListener('send_to_mirror', recv_study_tools_mirroring);

                    function recv_study_tools_mirroring(e) {
                        IS_REMOTE_TRIGGER = false;
                    }

                    this.contentWindow.addEventListener('DrawingCanvasEvent', DrawingCanvasEventHandler);

                    function DrawingCanvasEventHandler(e) {
                        IS_REMOTE_TRIGGER = false;
                    }

                }


//                if (USE_REMOTE_TRIGGER) {
//
//                    if (REMOTE_TRIGGER_EVENTS) {
//                        $iframe.contents().on(REMOTE_TRIGGER_EVENTS, function (event) {
//
//                            var event_target_selector = $(event.target).getSelector();
//                            IS_REMOTE_TRIGGER = false;
//                        });
//
//                    }
                /** !!!!!
                 * 2022.03.29
                 * 국정 미러링 - 스케치북스에서 수정
                 * 검정 미러링 - 보인에서 수정
                 *
                 * 스케치북스에서 기존 소스에 맞춰 수정하여, 변경된 소스에서 정상 동작하지 않는 것을 확인하여
                 * 기존 소스는 국정일 경우, 변경된 소스는 국정일 경우 적용하기로 함.
                 *
                 * 스케치북스에서 수정 후 국정은 단방향 미러링으로 진행되고 있으며
                 * 검정은 보인에서 수정 후 양방향 미러링으로 동작함.
                 *
                 * 2022.04.01
                 * 국정 교과서 단방향 미러링으로 진행되던 것을 보인에서 양방향으로 동작되도록 수정
                 * 국정, 검정 교과서 둘 다 양방향 미러링이므로 소스를 재수정
                 *
                 * 2022.04.19
                 * 모바일 미러링 관련하여 수정된 소스를 주석처리 해달라는 요청 접수
                 * 이에 미러링 관련 뷰어 소스를 기존 소스로 변경함
                 */

                // console.log("USE_REMOTE_MESSAGE ::: ", USE_REMOTE_MESSAGE);
//                    if (USE_REMOTE_MESSAGE) {
//                        var copy_this = this;
//
//                        this.contentWindow.addEventListener('message', function (event) {
//                            var content_mirroringId = copy_this.contentWindow.mirroringId;
//
//                            try {
//                                if (!IS_REMOTE_TRIGGER) {
//
//                                    // 예전 소스
//                                    // if (!IS_REMOTE_TRIGGER) {
//                                    //     mirroring.api_sync_obj({
//                                    //         target: "iframe",
//                                    //         target_selector: "#" + $targetiframe.attr('id'),
//                                    //         event: "message",
//                                    //         message: JSON.parse(event.data)
//                                    //     });
//                                    // }
//
//                                    // if (viewer._playlist_data.info.curriculum == 'GOV') {
//                                    //     // 국정 미러링
//                                    //     console.log('## GOV REMOTE');
//                                    //     if (!IS_REMOTE_TRIGGER) {
//                                    //         mirroring.api_sync_obj({
//                                    //             target: "iframe",
//                                    //             target_selector: "#" + $targetiframe.attr('id'),
//                                    //             event: "message",
//                                    //             message: JSON.parse(event.data)
//                                    //         });
//                                    //     }
//                                    // } else if (viewer._playlist_data.info.curriculum == 'AUTH') {
//                                    //     // 검정 미러링
//                                    //     console.log('## AUTH REMOTE');
//                                    //     var eventData = JSON.parse(event.data);
//                                    //
//                                    //     if (eventData.token == content_mirroringId) {
//                                    //
//                                    //         mirroring.api_sync_obj({
//                                    //             target: "iframe",
//                                    //             target_selector: "#" + $targetiframe.attr('id'),
//                                    //             event: "message",
//                                    //             message: eventData
//                                    //         });
//                                    //     }
//                                    // }
//
//                                    /* 미러링 변경 후 소스 */
////                                    var eventData = JSON.parse(event.data);
////                                    if (eventData.token == content_mirroringId) {
////                                        mirroring.api_sync_obj({
////                                            target: "iframe",
////                                            target_selector: "#" + $targetiframe.attr('id'),
////                                            event: "message",
////                                            message: eventData
////                                        });
////                                    }
//                                }
//                                IS_REMOTE_TRIGGER = false;
//                            } catch (error) {
//                                console.error(error)
//                            }
//                        });
//                    }
//                }

//                $iframe.contents().on("click", ".sp-ft .icon-sp-power", function (e) {
//                    console.error("cccc");
//                    app.close_popup_content();
//                });
            } catch (error) {
                console.error(error);
            }

            self.fit_smartppt_content_element_to_parent($iframe, $iframe_parent);

            // ebook 페이지 이동 버튼 숨김처리
            if ($('#iframe_content_pairbook').attr('src').indexOf('ebookpair.html') == -1) {

                ebook.move_button_hide();
            }

            // 계산기 초기화
            calculator.reset_calculator();

            // 2022.01.05 하단 수학교구 버튼 노출
            self.curriculum_code_auth_setting();

            // 2021.10.08 북마크 체크
            var textbookLessonSeq = viewer._playlist_data.id;
            var textbookLessonSubjectSeq = self._playing.id;
            var modalDiv = viewer._playlist_data.info.modalDiv;
            var subj = $("#page_list .subject.active");

            var params = {'textbookLessonSeq': textbookLessonSeq, 'modalDiv': modalDiv};
            // 20240116 주석처리
//            tms.bookmark("list", params).then(function (bookmark_data) {
//                var _length = bookmark_data.resultData.length;
//                $('#btnBookmark').css('background-image', 'url(/assets/viewer/img/viewer/mobile/i-bookmark@2x.png)');
//                for (var i = 0; i < _length; i++) {
//                    var _type = bookmark_data.resultData[i].modalTextbookLessonBookmarkType;
//                    var _seq = bookmark_data.resultData[i].textbookLessonSubjectSeq;
//
//                    if (textbookLessonSubjectSeq == _seq && _type == 'BOOKMARK') {
//                        //mobile
//                        $('#btnBookmark').css('background-image', 'url(/assets/viewer/img/viewer/mobile/i-bookmark@2x_on.png)');
//                        // pc
//                        $('.icon-tool-account3').addClass('bookmarked');
//                        subj.addClass('bookmarked');
//
//                        return;
//                    }
//                }
//            });

        });

        $targetiframe.attr('src', url);

        setTimeout(function () {
            if ($targetiframe.attr('id') == 'iframe_content') {
                $("#iframe_content").show();
                $(".popup.tools").hide();
                $("#iframe_content_pairbook").hide();
                $("#iframe_content_pairbook").attr('src', '');
                $(".icon-prev-content").show();
                $(".icon-next-content").show();
                app.close_study_tools();
            } else if ($targetiframe.attr('id') == 'iframe_content_pairbook') {
                viewer.hide_iframe_content();
                //$("#iframe_content").hide();
                $(".popup.tools").show();
                $("#iframe_content_pairbook").show();
                app.close_study_tools();
                $('#module-modal').modal('hide');
                on_hidden_module_modal();
                $(".icon-prev-content").hide();
                $(".icon-next-content").hide();
                //stop_all_media($("#iframe_content"));
            } else if ($targetiframe.attr('id') == 'iframe_tools') {
                $("#iframe_tools").show();
                $("#iframe_tools_bg").show();
                $(".icon-prev-content").hide();
                $(".icon-next-content").hide();
                //stop_all_media($("#iframe_content"));
                stop_all_media($("#iframe_content_pairbook"));
            }
        }, 100);

        // setTimeout(function () {
        //     if (file_url != null && file_url != undefined) {
        //         self.make_preview(file_url, $targetiframe);
        //     }
        // }, 3000);

    },

    // make_preview: function (file_url, $targetiframe) {
    //     let _self = this;
    //     const options = {
    //         url: '/Ebook/GetEbookViewFileInfoJson.mrn',
    //         data: {
    //             parentFileId: file_url
    //         },
    //         success: function (res) {
    //             let pageIndex = 1;
    //             let resultData = res['resultData'] || [];
    //             if (resultData.length < 1) {
    //                 return;
    //             }
    //             let list = {};
    //             for (let i = 0; i < resultData.length; i++) {
    //                 list[resultData[i].sortNo] = resultData[i];
    //             }
    //             list['size'] = resultData.length;
    //             _self._priview_list = list;
    //             _self.drow_preview($targetiframe);
    //         },
    //         catch: function (error) {
    //             console.log(error);
    //         }
    //     };
    //     $cmm.ajax(options);
    // },
    drow_preview: function ($targetiframe) { // 앞/뒤로가기 미리보기 이미지 보여주기
        let _self = this;
        let listSize = _self._priview_list.size;
        let sortIdx = 1;
        let sortStr = $targetiframe.contents().find('.block-right #pageText').html();
        let sortArr = sortStr.split(" / ");
        sortIdx = Number(sortArr[0]);

        // pre button
        let _preEle = $targetiframe.contents().find('.control-prev');
        if (sortIdx < 2) {
            $(_preEle).hide();
        } else {
            $(_preEle).show();
            let preitem = _self._priview_list[sortIdx - 1];
            _self.drow_priview_popover($targetiframe, _preEle, 'prev', '/cms/files/view/' + preitem.fileId);
        }
        // next Button
        let _nextEle = $targetiframe.contents().find('.control-next');
        if ((sortIdx + 1) >= listSize) {
            $(_nextEle).hide();
        } else {
            $(_nextEle).show();
            let nextItem = _self._priview_list[sortIdx + 1];
            _self.drow_priview_popover($targetiframe, _nextEle, 'next', '/cms/files/view/' + nextItem.fileId);
        }
    },
    drow_priview_popover: function ($targetiframe, _spanEle, type, file_url) {
        let _self = this;
        let _eleSub = $(_spanEle).find('.' + type + '-icon');
        if ((_eleSub.attr('data-toggle') || '') != '') {
            let $spanToggle = $targetiframe.contents().find('[data-toggle="' + type + '-content2-popover-hover"]');
            $spanToggle.attr('data-img', file_url);
            var popover = $spanToggle.data('bs.popover');
            if (popover) {
                popover.config.content = '<img src="' + file_url + '" />';
                popover.hide();
                popover.update();
            }
        } else {
            $(_eleSub).attr("data-toggle", type + "-content2-popover-hover");
            $(_eleSub).attr("data-img", file_url);
            $(_eleSub).attr("data-offset", "30px 0px");
            $(_eleSub).attr("area-hidden", true);
            $(_spanEle).find('[data-toggle="' + type + '-content2-popover-hover"]').popover({
                html: true,
                trigger: 'hover',
                placement: 'bottom',
                boundary: 'viewport',
                content: function () {
                    return '<img src="' + $(this).data('img') + '" />';
                }
            });

            $targetiframe.contents().find('.control-' + type).on('click', function () {
                _self.drow_preview($targetiframe);
            });
        }
    },

    load_smartppt_by_id: function (obj_id) {

        var obj = _.find(this._playlist_data.playlist, function (item) {
            return item.id == obj_id;
        });

        this.load_smartppt(obj);
    },
    pop_close_prev: function () {
        if (this._prev_index <= 0) {
            return;
        }
        var obj = this._playlist_data.playlist[this._prev_index];
        this.load_smartppt(obj);
    },
    get_prev: function () {
        if (this._current_page <= 1) {
            return null;
        }
        this._current_index = this._current_index - 1;
        var obj = this._playlist_data.playlist[this._current_index];

        if ('#' == obj.url) {
            this._current_index = this._current_index - 1;
            obj = this._playlist_data.playlist[this._current_index];
            if ('#' == obj.url) {
                return this.get_prev();
            }
        }
        return obj;
    },
    get_next: function () {
        if (this._current_page >= this._playlist_length) {
            return null;
        }
        this._current_index = this._current_index + 1;
        return this._playlist_data.playlist[this._current_index];
    },
    move_to_prev: function () {
        if (this._current_page <= 1) {
            return;
        }

        this._current_index = this._current_index - 1;
        var obj = this._playlist_data.playlist[this._current_index];


        if ('#' == obj.url) {
            this._current_index = this._current_index - 1;
            obj = this._playlist_data.playlist[this._current_index];
        }
        this.load_smartppt(obj);

        return obj.type;
    },
    move_to_next: function () {
        if (this._current_page >= this._playlist_length) {
            return;
        }

        this._current_index = this._current_index + 1;
        var obj = this._playlist_data.playlist[this._current_index];
        this.load_smartppt(obj);

        return obj.type;
    },
    load_special_content: function (data, type) {
        var self = this;

        if (!data) {
            return;
        }

        var open_url = get_url(data.url);
        // var popup_title = "[" + data.textbookLessonCornerTitle + "] " + data.title;
        var popup_title;

        if (type == 'ko') {
            popup_title = "작품문학관";
        } else if (type == 'ma') {
            popup_title = "스마트 교구";
        } else if (type == 'sc') {
            popup_title = "디지털 실험실";
        } else if (type == 'so') {
            popup_title = "지역 교과서";

            // url param 추가
            var params = {
                userSeq: $('body').data('userIdx'),
                textbookCurriculumGradeCd: self._playlist_data.info.grade,
                textbookCurriculumTermCd: self._playlist_data.info.semester,
                referer: 'smart'
            };

            var jsTimerStart = performance.now();

            tms.get_special_contents_params(params).then(function (_params) {
                for (var index = 0; index < _params.resultData.item.length; index++) {
                    if (data.title == _params.resultData.item[index].title) {
                        open_url = _params.resultData.item[index].url;
                    }
                }

                self.open_popup_url(open_url, false, popup_title);
            }).catch(function (err) {
                console.error(err);
            });

            var jsTimerEnd = performance.now();
            console.log("@@ [tms.get_special_contents_params] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
        }

        this.open_popup_url(open_url, false, popup_title);
    },

    load_pair_content: function (data) {
        if (!data) {
            return;
        }

        var open_url = get_url(data.smartpptUrl);
        var popup_title = "[" + data.textbookLessonCornerTitle + "] " + data.textbookLessonSubjectTitle;
        this.open_popup_url(open_url, false, popup_title);
    },
    update_pair_contents: function () {
        var type = this._playlist_data.info.type;

        var lower_type = type.toLowerCase();
        var content_type = undefined;
        // SCH, KORA
        if (lower_type.indexOf("sch") >= 0 || lower_type.indexOf("kora") >= 0) {
        	content_type = "";
        }
        else if (lower_type.indexOf("ko") >= 0) {
		            content_type = "ko";
        } else if (lower_type.indexOf("ma") >= 0 || lower_type.indexOf("mt") >= 0) {
            content_type = "mt";
        } else if (lower_type.indexOf("sc") >= 0 || lower_type.indexOf("si") >= 0) {
            content_type = "si";
        } else if (lower_type.indexOf("so") >= 0) {
            content_type = "so";
        } else if (lower_type.indexOf("mu") >= 0) {
            content_type = "mu";
        }

        var params = {periodSeq: this._playlist_id};

        // var jsTimerStart = performance.now();

        tms.get_pair_contents(content_type, params)
            .then(function (res) {
                if (res && res.resultCode == 'success' && res.resultData) {
                    var target_button = undefined;
                    var target_button2 = undefined;
                    var target_div = undefined;
                    var target_div2 = undefined;
                    var target_ul = undefined;
                    var target_ul2 = undefined;

                    if ("ko" == content_type) {
                        target_button = $("#btn-korean-activity");
                        target_div = $("#korean-activity");
                        target_ul = $("#korean-activity ul");

                        target_button2 = $("#btn-korean-activity2");
                        target_div2 = $("#korean-activity2");
                        target_ul2 = $("#korean-activity2 ul");
                    } else if ("mt" == content_type && CURRICULUM_CODE != 'AUTH') {
                        target_button = $("#btn-math-mastery");
                        target_div = $("#math-mastery");
                        target_ul = $("#math-mastery ul");

                        target_button2 = $("#btn-math-mastery2");
                        target_div2 = $("#math-mastery2");
                        target_ul2 = $("#math-mastery2 ul");

                        // 2022.01.05 추가 : 수학이고 검정 교과서인 경우 수학 익힘 버튼 숨기고 내 교과서 버튼 노출
                        // if (CURRICULUM_CODE == 'AUTH') {
                        //     target_button = $("#btn-ebook-page");
                        //     target_div = $("#ebook-page");
                        //     target_ul = $("#ebook-page ul");

                        //     target_button2 = $("#btn-ebook-page2");
                        //     target_div2 = $("#ebook-page2");
                        //     target_ul2 = $("#ebook-page2 ul");
                        // }

                    } else if ("si" == content_type) {
                        target_button = $("#btn-experiment");
                        target_div = $("#experiment");
                        target_ul = $("#experiment ul");

                        target_button2 = $("#btn-experiment2");
                        target_div2 = $("#experiment2");
                        target_ul2 = $("#experiment2 ul");
                    }

                    if (target_button) {

                        var get_ko_grade = viewer._playlist_data.info.grade;

                        if ("ko" == content_type && (get_ko_grade == "05" || get_ko_grade == "06")) {
                            return;
                        } else {
                            target_button.css('display', 'block');
                            target_button2.css('display', 'block');
                        }

                    }
                    if (target_ul) {
                        target_ul.empty();
                        target_ul2.empty();
                        if (res.resultData.length > 0) {
                            target_div.removeClass('empty');
                            target_div2.removeClass('empty');
                        } else {
                            target_div.addClass('empty');
                            target_div2.addClass('empty');
                        }

                        for (var index = 0; index < res.resultData.length; index++) {
                            var info = res.resultData[index];

                            var li_el = $("<li></li>");
                            var li_el2 = $("<li></li>");

                            target_ul.append(li_el);

                            var title_el = $('<a class="txt-line2"></a>');
                            li_el.append(title_el);

                            // var icon_el = $('<a class="icon-smartppt" title="링크 보기">링크 보기</a>');
                            // li_el.append(icon_el);

                            title_el.attr('title', info.textbookLessonSubjectTitle);
                            title_el.attr('data-textbookLessonSeq', info.textbookLessonSeq);
                            title_el.attr('data-smartpptFileRole', info.smartpptFileRole);
                            title_el.attr('data-textbookLessonSubjectSeq', info.textbookLessonSubjectSeq);
                            title_el.attr('data-pageSubInfo', info.pageSubInfo);
                            title_el.attr('data-studybookPages', viewer._playlist_data.info.studybookPages);
                            title_el.html(info.textbookLessonSubjectTitle);
                            li_el.data(info);

                            li_el.attr('textbookLessonSubjectSeq', info.textbookLessonSubjectSeq);
                            li_el.attr('textbookLessonSeq', info.textbookLessonSeq);
//                            li_el.attr('smartpptFileRole', info.smartpptFileRole);
//                            li_el.attr('pageSubInfo', info.pageSubInfo);
                            // li_el.attr('smartpptUrl', info.smartpptUrl);

                            li_el2.append(title_el.clone());
                            // li_el2.append(icon_el.clone());
                            li_el2.data(info);
                            li_el2.attr('textbookLessonSubjectSeq', info.textbookLessonSubjectSeq);
                            li_el2.attr('textbookLessonSeq', info.textbookLessonSeq);
                            target_ul2.append(li_el2);
                        }
                    }

                } else {
                    if (res && res.errorMessage) {
                        throw res.errorMessage;
                    } else {
                        throw "error"
                    }
                }
            })
            .catch(function (err) {
                console.error(err);
            });

        // var jsTimerEnd = performance.now();
        // console.log("@@ [tms.get_pair_contents] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
    },
    update_viewer_info: function () {
        var self = this;

        //TODO: 타이틀
        top.document.title = this._playlist_data.info.title;
        //TODO: 네비게이션
        // $("#course_name").html(this._playlist_data.info.shortTitle);
        // $("#course_name").attr("title", this._playlist_data.info.shortTitle);

        $("#hd .title").html(this._playlist_data.info.shortTitle);

        // 버튼 유형
        var type = this._playlist_data.info.type;
        //app.type_course_btn(type);

        $("#btn-data-locker").css('display', 'block');
        $("#btn-korean-activity").css('display', 'none');
        $("#btn-math-mastery").css('display', 'none');
        $("#btn-experiment").css('display', 'none');
        $("#btn-aside-korean").css('display', 'none');
        $("#btn-area-service").css('display', 'none');
        $("#btn-digital-parish").css('display', 'none');
        $("#btn-v-experiment").css('display', 'none');
        $("#btn-ebook-page").css('display', 'none');
        $("#btn-ai-math").css('display', 'none');

        $("#data-locker").removeClass('active');
        $("#korean-activity").removeClass('active');
        $("#math-mastery").removeClass('active');
        $("#experiment").removeClass('active');
        $("#aside-korean").removeClass('active');
        $("#area-service").removeClass('active');
        $("#digital-parish").removeClass('active');
        $("#v-experiment").removeClass('active');
        $("#ebook-page").removeClass('active');

        // 모바일
        $("#btn-data-locker2").css('display', 'block');
        $("#btn-korean-activity2").css('display', 'none');
        $("#btn-math-mastery2").css('display', 'none');
        $("#btn-experiment2").css('display', 'none');
        $("#btn-aside-korean2").css('display', 'none');
        $("#btn-area-service2").css('display', 'none');
        $("#btn-digital-parish2").css('display', 'none');
        $("#btn-v-experiment2").css('display', 'none');
        $("#btn-ebook-page2").css('display', 'none');
        $("#btn-ai-math2").css('display', 'none');

        $("#data-locker2").removeClass('active');
        $("#korean-activity2").removeClass('active');
        $("#math-mastery2").removeClass('active');
        $("#experiment2").removeClass('active');
        $("#aside-korean2").removeClass('active');
        $("#area-service2").removeClass('active');
        $("#digital-parish2").removeClass('active');
        $("#v-experiment2").removeClass('active');
        $("#ebook-page2").removeClass('active');

        /////////////////////////////////////////////////////////
        var _special_type;
        var _periodSeq = self._playlist_id;

        // 국어(나) - KOB 추가
        if ("ko" == type || "KOA" == type || "KOB" == type) {
            _special_type = "ko";
        } else if ("SO" == type) {
            _special_type = "so";
        } else if ("MT" == type) {
            _special_type = "mt";
        } else if ("SI" == type) {
            _special_type = "si";
        } else if ("MU" == type) {
            _special_type = "mu";
        } else if ("PC" == type) {
            _special_type = "pc";
        }

        if (viewer._playlist_data.info.curriculum == 'AUTH') {
            //  검정 교과서 특화자료 버튼 오픈
            console.log("검정 교과서 특화자료 버튼 오픈");
            console.log("_special_type : " + _special_type);

            ebook.get_unit_data(viewer._playlist_data);
            viewer.smartpptUseBtnClick();

            // var jsTimerStart = performance.now();

            tms.auth_special_contents_list(_special_type, _periodSeq)
                .then(function (res) {
                    // more url
                    var _moreUrl = res.resultData.moreUrlHost + res.resultData.moreUrl;
                    var li_parent = null;
                    var li_parent2 = null;

                    // 특화자료 버튼 노출
                    if ("ko" == _special_type) {
                        // 2021.08.11 - 1,2학년 1,2학기 국어 버튼 막기
                        var get_ko_grade = viewer._playlist_data.info.grade;
                        var get_ko_semester = viewer._playlist_data.info.semester;

                        if (get_ko_grade == "01" || get_ko_grade == "02") {
                            $("#btn-aside-korean").css('display', 'none');
                            $("#btn-aside-korean2").css('display', 'none');
                        } else {
                            // 버튼 open 국어
                            $("#btn-aside-korean").css('display', 'block');
                            $("#btn-aside-korean2").css('display', 'block');
                            // 초기화
                            $('#aside-korean ul').html('');
                            $('#aside-korean2 ul').html('');

                            li_parent = $('#aside-korean ul');
                            li_parent2 = $('#aside-korean2 ul');
                            // 더보기 url
                            $('#aside-korean header h3 a, #aside-korean2 header h3 a').attr('href', _moreUrl);
                            $('#aside-korean header h3 a, #aside-korean2 header h3 a').attr('target', '_blank');
                        }

                    } else if ("so" == _special_type) {
                        // 버튼 css를 위해 class추가 (국정/검정 교과서에서 사용하는 버튼 개수가 달라 사이즈가 상이함.)
                        $('#area-service.course-special').addClass('auth-social');
                        $('#area-service2.course-special').addClass('auth-social');
                        // 모바일 버튼 css를 위한 class 추가
                        $('#btn-ebook-page').addClass('auth-social-padding-right');
                        $('#btn-data-locker').addClass('auth-social-padding-left');
                        $('#btn-area-service .btn').addClass('auth-social-btn-padding');
                        // 버튼 open 사회
                        // 2021.09.01 - 5,6학년 지역 교과서 막기
                        var get_so_grade = viewer._playlist_data.info.grade;

                        if (get_so_grade == "05" || get_so_grade == "06") {
                            $("#btn-area-service").css('display', 'none');
                            $("#btn-area-service2").css('display', 'none');
                        } else {
                            $("#btn-area-service").css('display', 'block');
                            $("#btn-area-service2").css('display', 'block');
                        }
                        // 초기화
                        $('#area-service ul').html('');
                        $('#area-service2 ul').html('');

                        li_parent = $('#area-service ul');
                        li_parent2 = $('#area-service2 ul');

                        // 더보기 url
                        // _moreUrl = "https://ele.m-teacher.co.kr/ExtraBlended/ExtraBlendedInfo.mrn?extraCategoryCd=SO ";
                        // $('#area-service header h3 a').attr('href', _moreUrl);
                        // $('#area-service header h3 a').attr('target', '_blank');

                        // 더보기 url - param 추가
                        // 사회 url param
                        var params = {
                            userSeq: $('body').data('userIdx'),
                            textbookCurriculumGradeCd: self._playlist_data.info.grade,
                            textbookCurriculumTermCd: self._playlist_data.info.semester,
                            referer: 'smart'
                        };

                        tms.get_special_contents_params(params).then(function (_params) {
                            var moreUrlParams = _params.resultData.moreUrlHost + _params.resultData.moreUrl;

                            $('#area-service header h3 a, #area-service2 header h3 a').attr('href', moreUrlParams);
                            $('#area-service header h3 a, #area-service2 header h3 a').attr('target', '_blank');
                        }).catch(function (err) {
                            console.error(err);
                        });

                    } else if ("mt" == _special_type) {
                        // AI 수학 버튼 open - 2022.02.09 검정교과서에 AI 수학 추가
                        $("#btn-ai-math").css('display', 'block');
                        $("#btn-ai-math2").css('display', 'block');

                        tms.ai_math_list(_textbookLessonSeq)
                            .then(function (res) {
                                // AI 수학 LIST

                                // 초기화
                                $('#ai-math ul').html('');
                                $('#ai-math2 ul').html('');
                                li_parent = $('#ai-math ul');
                                li_parent2 = $('#ai-math2 ul');

                                if (res.resultData == null || res.resultData.length == 0) {
                                    return;
                                }

                                for (var index = 0; index < res.resultData.length; index++) {
                                    var li_html = $("<li></li>");
                                    var _info = res.resultData[index];
                                    var _title = res.resultData[index].title;
                                    var _url = res.resultData[index].url;

                                    li_parent && li_parent.append(li_html);

                                    var title_el = $('<a class="txt-line2" href="' + _url + '" target="_blank"></a>');
                                    li_html.append(title_el);

                                    title_el.attr('title', _title);
                                    title_el.html(_title);
                                    li_html.data(_info);

                                    // 가로모드에도 적용
                                    if (li_parent2) {
                                        var li_html = $("<li></li>");
                                        var _title = res.resultData[index].title;
                                        var title_el = $('<a class="txt-line2" href="' + _url + '" target="_blank"></a>');
                                        var _info = res.resultData[index];

                                        li_parent2.append(li_html);
                                        li_html.append(title_el);
                                        title_el.attr('title', _title);
                                        title_el.html(_title);
                                        li_html.data(_info);
                                    }
                                }
                            }).catch(function (err) {
                            console.error(err);
                        });


                        // 버튼 css를 위해 class추가 (국정/검정 교과서에서 사용하는 버튼 개수가 달라 사이즈가 상이함.)
                        $('#ai-math.course-special').addClass('auth-math');
                        $('#ai-math2.course-special').addClass('auth-math');
                        $('#digital-parish.course-special').addClass('auth-math');
                        $('#digital-parish2.course-special').addClass('auth-math');
                        $('#data-locker.course-special').addClass('auth-math');
                        $('#data-locker2.course-special').addClass('auth-math');
                        // 모바일 버튼 css를 위한 class 추가
                        $('#btn-ebook-page').addClass('auth-math-padding-right');
                        $('#btn-ai-math, #btn-digital-parish').addClass('auth-math-padding');
                        $('#btn-data-locker').addClass('auth-math-padding-left');
                        $('#btn-digital-parish .btn').addClass('auth-math-btn-padding');

                        // 2021.08.11 - 1,2학년 1,2학기 수학 버튼 막기
                        var get_mt_grade = viewer._playlist_data.info.grade;
                        var get_mt_semester = viewer._playlist_data.info.semester;
                        if (get_mt_grade == "01" || get_mt_grade == "02") {
                            $("#btn-digital-parish").css('display', 'none');
                            $("#btn-digital-parish2").css('display', 'none');
                        } else {
                            // 버튼 open 수학
                            $("#btn-digital-parish").css('display', 'block');
                            $("#btn-digital-parish2").css('display', 'block');
                            // 초기화
                            $('#digital-parish ul').html('');
                            $('#digital-parish2 ul').html('');

                            li_parent = $('#digital-parish ul');
                            li_parent2 = $('#digital-parish2 ul');

                            // 더보기 url
                            $('#digital-parish header h3 a, #digital-parish2 header h3 a').attr('href', 'https://ele.m-teacher.co.kr/ExtraBlended/ExtraBlendedList.mrn?extraCategoryCd=MT');
                            $('#digital-parish header h3 a, #digital-parish2 header h3 a').attr('target', '_blank');
                        }

                    } else if ("si" == _special_type) {
                        // 버튼 open 과학
                        $("#btn-v-experiment").css('display', 'block');
                        // 초기화
                        $('#v-experiment ul').html('');
                        li_parent = $('#v-experiment ul');
                        // 더보기 url
                        $('#v-experiment header h3 a').attr('href', _moreUrl);
                        $('#v-experiment header h3 a').attr('target', '_blank');
                    }

                    if (res.resultData.item == null || res.resultData.item.length == 0) {
                        return;
                    }
                    // appent html
                    for (var index = 0; index < res.resultData.item.length; index++) {

                        var li_html = $("<li></li>");
                        var _info = res.resultData.item[index];
                        // var _playlist_id = self._playlist_id;
                        var _title = res.resultData.item[index].title;
                        // var _periodSeq = res.resultData.item[index].periodSeq;
                        var _unitSeq = res.resultData.item[index].unitSeq;

                        li_parent && li_parent.append(li_html);


                        var title_el = $('<a class="txt-line2"></a>');
                        li_html.append(title_el);

                        // var icon_el = $('<a class="icon-link-sm" title="링크 보기">링크 보기</a>');
                        // li_html.append(icon_el);

                        title_el.attr('title', _title);
                        title_el.html(_title);
                        li_html.data(_info);

                        // 가로모드에도 적용
                        if (li_parent2) {
                            var li_html = $("<li></li>");
                            var _title = res.resultData.item[index].title;
                            var title_el = $('<a class="txt-line2"></a>');
                            var _info = res.resultData.item[index];

                            li_parent2.append(li_html);
                            li_html.append(title_el);
                            title_el.attr('title', _title);
                            title_el.html(_title);
                            li_html.data(_info);
                        }
                    }
                })
                .catch(function (err) {
                    console.error(err);
                });

            // var jsTimerEnd = performance.now();
            // console.log("@@ [tms.auth_special_contents_list] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");

        } else if (viewer._playlist_data.info.curriculum == 'GOV') {
            // console.log('국정 교과서')
            //  국정 교과서 특화자료 버튼 오픈
            // var jsTimerStart = performance.now();

            tms.special_contents_list(_special_type, _periodSeq)
                .then(function (res) {
                    // console.log(res);

                    // more url
                    var _moreUrl = res.resultData.moreUrlHost + res.resultData.moreUrl;
                    var li_parent;
                    var li_parent2;

                    // 특화자료 버튼 노출
                    if ("ko" == _special_type) {
                        // 2021.08.11 - 1,2학년 1,2학기 국어 버튼 막기
                        var get_ko_grade = viewer._playlist_data.info.grade;
                        var get_ko_semester = viewer._playlist_data.info.semester;

                        if (get_ko_grade == "01" || get_ko_grade == "02") {
                            $("#btn-aside-korean").css('display', 'none');
                            $("#btn-aside-korean2").css('display', 'none');
                        } else {
                            // 버튼 open 국어
                            $("#btn-aside-korean").css('display', 'block');
                            $("#btn-aside-korean2").css('display', 'block');
                            // 초기화
                            $('#aside-korean ul').html('');
                            $('#aside-korean2 ul').html('');

                            li_parent = $('#aside-korean ul');
                            li_parent2 = $('#aside-korean2 ul');
                            // 더보기 url
                            $('#aside-korean header h3 a, #aside-korean2 header h3 a').attr('href', _moreUrl);
                            $('#aside-korean header h3 a, #aside-korean2 header h3 a').attr('target', '_blank');
                        }

                    }

                    // 20240125 : 이전 국정 수/사/과 주석
                    /*

                                        else if ("so" == _special_type) {
                                            // 버튼 css를 위해 class추가 (국정/검정 교과서에서 사용하는 버튼 개수가 달라 사이즈가 상이함.)
                                            $('#area-service.course-special').removeClass('auth-social');
                                            $('#area-service2.course-special').removeClass('auth-social');
                                            // 모바일 버튼 css를 위한 class 추가
                                            $('#btn-ebook-page').removeClass('auth-social-padding-right');
                                            $('#btn-data-locker').removeClass('auth-social-padding-left');
                                            $('#btn-area-service .btn').removeClass('auth-social-btn-padding');
                                            // 버튼 open 사회
                                            // 2021.09.01 - 5,6학년 지역 교과서 막기
                                            var get_so_grade = viewer._playlist_data.info.grade;
                                            if (get_so_grade == "05" || get_so_grade == "06") {
                                                $("#btn-area-service").css('display', 'none');
                                                $("#btn-area-service2").css('display', 'none');
                                            } else {
                                                $("#btn-area-service").css('display', 'block');
                                                $("#btn-area-service2").css('display', 'block');
                                            }
                                            // 초기화
                                            $('#area-service ul').html('');
                                            $('#area-service ul2').html('');

                                            li_parent = $('#area-service ul');
                                            li_parent2 = $('#area-service2 ul');

                                            // 더보기 url
                                            // _moreUrl = "https://ele.m-teacher.co.kr/ExtraBlended/ExtraBlendedInfo.mrn?extraCategoryCd=SO ";
                                            // $('#area-service header h3 a').attr('href', _moreUrl);
                                            // $('#area-service header h3 a').attr('target', '_blank');

                                            // 더보기 url - param 추가
                                            // 사회 url param
                                            var params = {
                                                userSeq: $('body').data('userIdx'),
                                                textbookCurriculumGradeCd: self._playlist_data.info.grade,
                                                textbookCurriculumTermCd: self._playlist_data.info.semester,
                                                referer: 'smart'
                                            };

                                            tms.get_special_contents_params(params).then(function (_params) {
                                                var moreUrlParams = _params.resultData.moreUrlHost + _params.resultData.moreUrl;

                                                $('#area-service header h3 a, #area-service2 header h3 a').attr('href', moreUrlParams);
                                                $('#area-service header h3 a, #area-service2 header h3 a').attr('target', '_blank');
                                            }).catch(function (err) {
                                                console.error(err);
                                            });

                                        }
                                        else if ("mt" == _special_type) {
                                            // 버튼 css를 위해 추가한 class 삭제 (국정/검정 교과서에서 사용하는 버튼 개수가 달라 사이즈가 상이함.)
                                            $('#ai-math.course-special').removeClass('auth-math');
                                            $('#ai-math2.course-special').removeClass('auth-math');
                                            $('#digital-parish.course-special').removeClass('auth-math');
                                            $('#digital-parish2.course-special').removeClass('auth-math');
                                            $('#data-locker.course-special').removeClass('auth-math');
                                            $('#data-locker2.course-special').removeClass('auth-math');
                                            // 모바일 버튼 css를 위해 추가한 class 삭제
                                            $('#btn-ebook-page').removeClass('auth-math-padding-right');
                                            $('#btn-ai-math, #btn-digital-parish').removeClass('auth-math-padding');
                                            $('#btn-data-locker').removeClass('auth-math-padding-left');
                                            $('#btn-digital-parish .btn').removeClass('auth-math-btn-padding');
                                            // 2021.08.11 - 1,2학년 1,2학기 수학 버튼 막기
                                            var get_mt_grade = viewer._playlist_data.info.grade;
                                            var get_mt_semester = viewer._playlist_data.info.semester;
                                            if (get_mt_grade == "01" || get_mt_grade == "02") {
                                                $("#btn-digital-parish").css('display', 'none');
                                                $("#btn-digital-parish2").css('display', 'none');
                                            } else {
                                                // 버튼 open 수학
                                                $("#btn-digital-parish").css('display', 'block');
                                                $("#btn-digital-parish2").css('display', 'block');

                                                // 초기화
                                                $('#digital-parish ul').html('');
                                                $('#digital-parish2 ul').html('');

                                                li_parent = $('#digital-parish ul');
                                                li_parent2 = $('#digital-parish2 ul');

                                                // 더보기 url
                                                $('#digital-parish header h3 a, #digital-parish2 header h3 a').attr('href', _moreUrl);
                                                $('#digital-parish header h3 a, #digital-parish2 header h3 a').attr('target', '_blank');
                                            }

                                        }
                                        else if ("si" == _special_type) {
                                            // 버튼 open 과학
                                            $("#btn-v-experiment").css('display', 'block');
                                            $("#btn-v-experiment2").css('display', 'block');
                                            // 초기화
                                            $('#v-experiment ul').html('');
                                            $('#v-experiment2 ul').html('');

                                            li_parent = $('#v-experiment ul');
                                            li_parent2 = $('#v-experiment2 ul');
                                            // 더보기 url
                                            $('#v-experiment header h3 a, #v-experiment2 header h3 a').attr('href', _moreUrl);
                                            $('#v-experiment header h3 a, #v-experiment2 header h3 a').attr('target', '_blank');
                                        }
                    */


                    // appent html
                    for (var index = 0; index < res.resultData.item.length; index++) {

                        var li_html = $("<li></li>");
                        var _info = res.resultData.item[index];
                        // var _playlist_id = self._playlist_id;
                        var _title = res.resultData.item[index].title;
                        // var _periodSeq = res.resultData.item[index].periodSeq;
                        var _unitSeq = res.resultData.item[index].unitSeq;

                        li_parent.append(li_html);

                        var title_el = $('<a class="txt-line2"></a>');
                        li_html.append(title_el);

                        // var icon_el = $('<a class="icon-link-sm" title="링크 보기">링크 보기</a>');
                        // li_html.append(icon_el);

                        title_el.attr('title', _title);
                        title_el.html(_title);
                        li_html.data(_info);

                        // 가로모드에도 적용
                        if (li_parent2) {
                            var li_html = $("<li></li>");
                            var _title = res.resultData.item[index].title;
                            var title_el = $('<a class="txt-line2"></a>');
                            var _info = res.resultData.item[index];

                            li_parent2.append(li_html);
                            li_html.append(title_el);
                            title_el.attr('title', _title);
                            title_el.html(_title);
                            li_html.data(_info);
                        }
                    }
                })
                .catch(function (err) {
                    console.error(err);
                });

            // var jsTimerEnd = performance.now();
            // console.log("@@ [tms.special_contents_list] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
        }
        ////////////////////////////////////////////////////////////////////////

        //  검정 교과서 리스트
        CURRICULUM_CODE = self._playlist_data.info.curriculum;
        // console.log('CURRICULUM_CODE : ', CURRICULUM_CODE)

        if (CURRICULUM_CODE == 'AUTH') {
            var _textbookLessonSeq = self._playlist_id;
            // var jsTimerStart = performance.now();
            var typeGradeCode = type + self._playlist_data.info.grade;

            tms.ebook_contents_list(_textbookLessonSeq, typeGradeCode)
                .then(function (res) {
                    // console.log('Load ebook List♬ 교과서 버튼에 목록 붓는 중··· 목록은 아래에 ↓↓↓');
                    // console.log(res);

                    var target_button = $("#btn-ebook-page");
                    var target_div = $("#ebook-page");
                    var target_ul = $("#ebook-page ul");

                    var target_button2 = $("#btn-ebook-page2");
                    var target_div2 = $("#ebook-page2");
                    var target_ul2 = $("#ebook-page2 ul");

                    // 음악 내교과서 숨김
                    if (type == 'MU' || type == 'PC') {
                        target_button.css('display', 'none');
                        target_button2.css('display', 'none');
                    } else {
                        target_button.css('display', 'block');
                        target_button2.css('display', 'block');
                    }

                    var ebook_pages = self._playlist_data.info.ebookPages;

                    if (target_ul) {
                        target_ul.empty();
                        target_ul2.empty();
                        if (res.resultData.length > 0) {
                            target_div.removeClass('empty');
                            target_div2.removeClass('empty');
                        } else {
                            target_div.addClass('empty');
                            target_div2.addClass('empty');
                        }

                        for (var index = 0; index < res.resultData.length; index++) {
                            var info = res.resultData[index];

                            var li_el = $("<li></li>");
                            var li_el2 = $("<li></li>");

                            var title_el = $('<a class="txt-line2 ebook_list_txt"></a>');
                            var page_el = $('<span class="_page_num"></span>');

                            li_el.append(title_el);
                            li_el.append(page_el);

                            title_el.attr('title', info.ebookLessonPageSubjectTitle);
                            title_el.html(info.ebookLessonPageSubjectTitle);

                            /**
                             * 2022.01.21 수정요청사항
                             * 수학 교과서 리스트 제일 앞 글자 원문자로 변경하거나 폰트 변경
                             * 적당한 폰트 크기, 폰트패밀리를 찾지 못해 문자 자체를 변경해보려고 함
                             */

                            var title_str = info.ebookLessonPageSubjectTitle.charAt(0);
                            var charList = ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾', '❿', '⓫', '⓬', '⓭', '⓮', '⓯', '⓰', '⓱', '⓲', '⓳', '⓴'];
                            var resultCharList = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];
                            var _result_title = null;

                            if (index == 0 && viewer._playlist_data.info.type == "MT") {
                                charList.forEach(function (item, index) {
                                    if (item == title_str) {
                                        _result_title = info.ebookLessonPageSubjectTitle.replace(charList[index], resultCharList[index]);

                                        title_el.attr('title', _result_title);
                                        title_el.html(_result_title);
                                    }
                                });
                            }

                            page_el.html(info.ebookLessonPageNum + "쪽");
                            li_el.data(info);

                            li_el.attr('data-ebookpage', ebook_pages);
                            li_el.attr('data-thispage', info.ebookLessonPageNum);

                            target_ul.append(li_el);

                            li_el2.append(title_el.clone());
                            li_el2.append(page_el.clone());
                            li_el2.data(info);
                            li_el2.attr('data-ebookpage', ebook_pages);
                            li_el2.attr('data-thispage', info.ebookLessonPageNum);

                            target_ul2.append(li_el2);
                        }
                    }
                }).catch(function (err) {
                console.error(err);
            });

            // var jsTimerEnd = performance.now();
            // console.log("@@ [tms.ebook_contents_list] : " + (jsTimerEnd - jsTimerStart) + " milliseconds.");
        }

        this.update_pair_contents();

        var $navigation = $("#page_list");
        $navigation.html('');
        var old_step = undefined;
        var $old_li = undefined;
        var $old_ul = undefined;

        var mobile_num = 0;
        for (var index = 0; index < this._playlist_data.playlist.length; index++) {
            var data_idx = index;
            var obj = this._playlist_data.playlist[index];
            if (this._device_type == 'mobile') {
                if (obj.url == '#') {
                    continue;
                }
                mobile_num++;
                var $subject = $('<li class="subject col"></li>');
                var $subject_a = $('<a class="thumbnail"></a>');

                $subject_a.html('<img src="' + get_cms_url('CMS', obj.thumbnail) + '" /><span>' + mobile_num + '</span>');
                $subject_a.data(obj);
                $subject.append($subject_a);
                $subject.data(obj);
                $subject.attr('index', index);
                $subject.attr('id', obj.textbookLessonSubjectSeq);

                $navigation.append($subject);
                continue;
            }


            if (old_step != obj.step) {

                var $cur_li = $("<li></li>");
                var $step = $('<h3></h3>');
                $step.html(obj.step);
                $step.attr("title", obj.step);
                if (self._filerole != 'm' && self._filerole != 'k' && self._filerole != 's') {
                    $cur_li.append($step);
                }
                old_step = obj.step;

                var $cur_ul = $("<ul></ul>");
                $cur_li.append($cur_ul);
                $old_li = $cur_li;
                $old_ul = $cur_ul;
                $navigation.append($cur_li);
            }

            var only_corner = true;
            if (obj.step.indexOf("전개") >= 0) {
                only_corner = false;
            }

            // 2021.07.15 - 유창하게 읽기
            if (obj.cornerType == 're') {
                // if (obj.step.indexOf("정리") >= 0 && obj.corner_type == 're') {
                only_corner = false;
            }
            var $subject = $('<li class="subject"></li>');
            if (obj.url == '#') {
                $subject.addClass("no-url");
            }

            // 2021.08.09 - 수학송 curner명 추가
            if (obj.cornerType == 'mu') {
                only_corner = false;
            }

            // console.log(" !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ");
            // console.log(only_corner +" // "+ obj.title);
            var $subject_a = $('<a class="title txt-line"></a>');
            if (only_corner == true && obj.title == '') {
                $subject_a.addClass("only_corner");
            }

            this.update_subject_content($subject, obj, data_idx);

            // console.log(" !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ");
            // console.log(obj);
            if (obj.corner) {
                var corner_str = obj.corner;
                var title_str = obj.title == null ? '' : obj.title;

                // 230228 코너명+자료명 모두 보이도록 수정.  코너명만 보여야 하는 경우 관리자에서 자료명을 지우기로 협의
                // 과학 제외한 다른 과목은 title = '';
//                if (only_corner && corner_str && type != 'SI') {
//                    title_str = '';
//                }
                // if (only_corner && corner_str ) {
                //     title_str = '';
                // }

                if (obj.badgeColor) { //
                    // $subject_a.html('<span><b class="badge bg-' + obj.badgeColor + '">' + corner_str + '</b>' + title_str + '</span>');
                    $subject_a.html('<span><b class="badge" ' +'style="font-size: 15px; font-weight:700; background-color:' + obj.badgeColor
                                 +';color:'+ obj.textRgbCode +'";>' + corner_str + '</b>' + title_str + '</span>');
                    if (!$subject.hasClass("no-url"))
                        // $subject_a.attr("title", corner_str);
                        // 아래가 기존소스, 기존 소스 하단 부분을 추가로 작업함

                        // $subject_a.attr("title", corner_str + ' ' + title_str);

                        // 타이틀이 짧으면 css left가 제대로 인식되지 않음
                        // popover에서 사용하는 'data-original-title' attribute에 문자열을 가져와서 뒤에 공백문자를 붙여주기
                        var _corner_str_length = corner_str.length;
                    var _title_str_length = title_str.length;
                    var _plus_length = _corner_str_length + _title_str_length;

                    // 20230405 과학 실험관찰 썸네일 제목으로 노출하기 위해 수정
                    // 수정 사항 : _plus_length < 10  => _plus_length < 4
                    if (_plus_length < 4) {
                        var prefLineLength = 30;
                        var diff = prefLineLength - _plus_length;
                        // var filler = '&nbsp;';
                        var filler = '';
                        var __title_str = '';

                        for (var i = 0; i < diff; i++) {
                            __title_str = __title_str + filler;
                        }
                        $subject_a.attr("title", ' ' + title_str + __title_str);
                    } else {
                        $subject_a.attr("title", corner_str + ' ' + title_str);
                    }

                } else {
                    if ("Y" == obj.cornerBold) {
                        $subject_a.html('<span><strong>' + corner_str + '</strong>' + ' ' + title_str + '</span>');
                        if (!$subject.hasClass("no-url")) {
                            // $subject_a.attr("title", corner_str);
                            // $subject_a.attr("title", corner_str + ' ' + title_str);
                            // 타이틀이 짧으면 css left가 제대로 인식되지 않음
                            // popover에서 사용하는 'data-original-title' attribute에 문자열을 가져와서 뒤에 공백문자를 붙여주기
                            var _corner_str_length = corner_str.length;
                            var _title_str_length = title_str.length;
                            var _plus_length = _corner_str_length + _title_str_length;


                            if (_plus_length < 10) {
                                var prefLineLength = 30;
                                var diff = prefLineLength - _plus_length;
                                // var filler = '&nbsp;';
                                var filler = '';
                                var __title_str = '';

                                for (var i = 0; i < diff; i++) {
                                    __title_str = __title_str + filler;
                                }

                                $subject_a.attr("title", ' ' + title_str + __title_str);
                            } else {
                                $subject_a.attr("title", corner_str + ' ' + title_str);
                            }

                            if (_title_str_length == 0) {
                                $subject_a.attr("title", corner_str + ' ' + title_str);
                            }
                        }
                    } else {
                        $subject_a.html('<span>' + corner_str + ' ' + title_str + '</span>');
                        if (!$subject.hasClass("no-url")) {
                            // $subject_a.attr("title", corner_str);
                            // $subject_a.attr("title", corner_str + ' ' + title_str);
                            // 타이틀이 짧으면 css left가 제대로 인식되지 않음
                            // popover에서 사용하는 'data-original-title' attribute에 문자열을 가져와서 뒤에 공백문자를 붙여주기
                            var _corner_str_length = corner_str.length;
                            var _title_str_length = title_str.length;
                            var _plus_length = _corner_str_length + _title_str_length;

                            if (_plus_length < 10) {
                                var prefLineLength = 30;
                                var diff = prefLineLength - _plus_length;
                                // var filler = '&nbsp;';
                                var filler = '';
                                var __title_str = '';

                                for (var i = 0; i < diff; i++) {
                                    __title_str = __title_str + filler;
                                }

                                $subject_a.attr("title", ' ' + title_str + __title_str);
                            } else {
                                $subject_a.attr("title", corner_str + ' ' + title_str);
                            }
                        }
                    }
                }
            } else {

                $subject_a.html('<span>' + obj.title + '</span>');
                if (!$subject.hasClass("no-url"))
                    $subject_a.attr("title", obj.title);
            }

            if (obj.thumbnail) {
                $subject_a.attr("data-toggle", "popover-hover");
                $subject_a.attr("data-img", get_url(obj.thumbnail));
            }

            $subject_a.data(obj);
            // $subject.append($subject_a);
            $subject.prepend($subject_a);
            $subject.data(obj);
            $subject.attr('index', index);
            $subject.attr('id', obj.textbookLessonSubjectSeq);

            $subject_a.attr('id', obj.id);
            $old_ul.append($subject);

            if (obj.thumbnail) {
                var obj_id = obj.id;

                // popovers initialization - on hover
                // $('.title[id="'+obj_id+'"][data-toggle="popover-hover"]').popover({
                //     html: true,
                //     trigger: 'hover',
                //     placement: 'top',
                //     // placement: 'left',
                //     // placement: function (context, source) {
                //     //     var offset = $(source).offset();
                //     //     if (offset.top < 220){
                //     //         return "bottom";
                //     //     }
                //     //     return "top";
                //     // },
                //     boundary: 'window',
                //     content: function () { return '<img src="' + $(this).data('img') + '" />'; }
                // });

            }


        }

        // 네비게이션  팝오버 위치
        $('#page_list .title.txt-line[data-toggle="popover-hover"]').popover({
            html: true,
            trigger: 'hover',
            placement: function () {
                if ($(window).height() - $(this.element).offset().top < 195) {
                    this.tip.className += ' subject_list';
                    return 'top';
                }
                return "bottom";
            },
            boundary: 'window',
            content: function () {
                if ($(this).data('uploadMethod') == 'CMS')
                    return '<img src="' + get_cms_url('CMS',$(this).data('img')) + '" />';
                else
                    return '<img src="' + $(this).data('img') + '" />';
            }
        });

        // 보조자료 팝오버 위치 조정으로 인해 다음 페이지 버튼에 나오는 팝오버 위치가 변화됨
        $('.icon-next-content').attr("data-offset", "0 80px");

        // 보조자료  팝오버 위치
        $('#page_list .subject-link[data-toggle="popover-hover"]').popover({
            html: true,
            trigger: 'hover',
            placement: "left",
            boundary: 'window',
            content: function () {
                return '<img src="' + $(this).data('img') + '" />';
            }
        });
    },

    setHighlight: function () {
        var _type = viewer._playlist_data.info.type;
        var listAllLessonSeq = $('#list-all .list-unit.high ul li.active').data().textbookLessonSeq;
        var _playlist_id = viewer._playlist_id;

        // 초기화
        $('#aside-korean ul li a').removeClass('active');
        $('#digital-parish ul li a').removeClass('active');
        $('#v-experiment ul li a').removeClass('active');
        $('#area-service ul li a').removeClass('active');

        if (_type == 'ko' || _type == "KOA" || _type == "KOB") {
            // 국어는 단원 키로 구분하여 하이라이트
            var _li_length = $('#aside-korean ul li').length;

            for (var i = 0; i < _li_length; i++) {
                var _li_data = $('#aside-korean ul li').eq(i).data('unitSeq');

                if (_li_data == listAllLessonSeq) {
                    $('#aside-korean ul li a').eq(i).addClass('active');
                }
            }

        } else if (_type == "MT") {
            // 수학은 단원 키로 구분하여 하이라이트
            var _li_length = $('#digital-parish ul li').length;

            for (var i = 0; i < _li_length; i++) {
                var _li_data = $('#digital-parish ul li').eq(i).data('unitSeq');

                if (_li_data == listAllLessonSeq) {
                    $('#digital-parish ul li a').eq(i).addClass('active');
                }
            }
        } else if (_type == "SI") {
            // 과학은 차시키로 구분하여 하이라이트
            var _li_length = $('#v-experiment ul li').length;

            for (var i = 0; i < _li_length; i++) {
                var _li_data = $('#v-experiment ul li').eq(i).data('periodSeq');

                if (_li_data == _playlist_id) {
                    $('#v-experiment ul li a').eq(i).addClass('active');
                }
            }
        }
    },

    update_subject_content: function (container, obj, data_idx) {
        // mkh 수업보조자료
        if (container && obj) {
            container.empty();
            if (obj.content) {
                var $subject_link = $('<div class="link"></div>');
                var $subject_div = $('<div class="clear"></div>');
                var $subject_link_a = null;
                var className = null;
                $.each(obj.content, function (index, item) {
                    switch (item.type) {
                        case 'audio':
                            className = "icon-link-audio";
                            break;
                        case 'video':
                            className = "icon-link-video";
                            break;
                        case 'jpg':
                            className = "icon-link-pic";
                            break;
                        case 'png':
                            className = "icon-link-png";
                            break;
                        case 'gif':
                            className = "icon-link-gif";
                            break;
                        case 'xls':
                            className = "icon-link-xls";
                            break;
                        case 'doc':
                            className = "icon-link-doc";
                            break;
                        case 'ppt':
                            className = "icon-link-ppt";
                            break;
                        case 'pdf':
                            className = "icon-link-pdf";
                            break;
                        case 'hwp':
                            className = "icon-link-hwp";
                            break;
                        case 'link':
                            className = "icon-link";
                            break;
                        case 'html':
                        case 'special':
                            className = "icon-link-html";
                            break;
                    }

                    if (className) {
                        /*
                        var $subject_link_a = $('<a href="#"></a>');
                        $subject_link_a.attr("class", className);
                        $subject_link_a.attr("title", item.title);
                        $subject_link.append($subject_link_a);
                        */
                        // var $subject_link_btn = $('<button data-toggle="modal" data-target="#module-modal">열기</button>');
                        var $subject_link_btn = $('<button>열기</button>');
                        $subject_link_btn.addClass(className);
                        $subject_link_btn.addClass("subject-link");
                        $subject_link_btn.attr("data-index", data_idx);
                        $subject_link_btn.attr("subject-link-index", index);
                        if (obj.url != '#') {
                            try {
                                // title을 바꿔줘야 함
                                // var _title = '미래엔_수학3-1_보충자료_1_2차시_준비물꾸러미준비물꾸러미준비물꾸러미준비물꾸러미.pdf';
                                var _title = item.title;

                                var input_title = _title.split('_');
                                var title_length = parseInt(input_title.length);

                                input_title = input_title[title_length - 1];
                                var result_title = input_title.split('.');

                                if (result_title[0].length > 10) {
                                    result_title = result_title[0].substr(0, 9);
                                    result_title = result_title.concat('...');
                                    $subject_link_btn.attr("title", result_title);

                                } else {
                                    // 타이틀이 짧으면 css left가 제대로 인식되지 않음
                                    // popover에서 사용하는 'data-original-title' attribute에 문자열을 가져와서 뒤에 공백문자를 붙여주기
                                    var _item_title_length = result_title[0].length;
                                    var prefLineLength = 20;

                                    var diff = prefLineLength - _item_title_length;

                                    // var filler = '&nbsp;';
                                    var filler = '';
                                    var __title_str = '';

                                    for (var i = 0; i < diff; i++) {
                                        __title_str = __title_str + filler;
                                    }

                                    $subject_link_btn.attr("title", result_title[0] + __title_str);
                                    // $subject_link_btn.attr("title", result_title[0]);
                                }

                                // $subject_link_btn.attr("title", item.title);

                            } catch (error) {
                                console.warn('보조자료 타이틀 형식이 맞지 않습니다.');
                                $subject_link_btn.attr("title", item.title);
                            }
                        }
                        $subject_link_btn.attr("data-type", item.type);

                        $subject_link_btn.attr("data-toggle", "popover-hover");
                        $subject_link_btn.attr("data-img", get_url(item.thumbnail));

                        $subject_link.append($subject_link_btn);

                        container.append($subject_link);
                        $subject_div.appendTo(container);
                    }
                });
            }
        }
    },
    update_viewer_current_info: function () {

        //  _playlist_length: 0,
        // _current_index: -1,

        // _playlist_data: undefined,
        // _playing: undefined,

        var totalpage = this._playlist_length;
        var realplaylist = _.filter(this._playlist_data.playlist, function (item) {
            return item.url != '#';
        });
        totalpage = realplaylist.length;

        var curpage = this._current_page;
        var current_id = this._playing.id;
        var currentindex = _.findIndex(realplaylist, function (item) {
            return item.id == current_id;
        });
        if (currentindex >= 0) {
            curpage = currentindex + 1;
        }

        $("#current_page").html(curpage);
        $("#current_page").attr("title", "현재 " + curpage + "페이지");
        $("#total_page").html(totalpage);
        $("#total_page").attr("title", "총" + totalpage + "페이지");

        $("#current_page2").html(curpage);
        $("#current_page2").attr("title", "현재 " + curpage + "페이지");
        $("#total_page2").html(totalpage);
        $("#total_page2").attr("title", "총" + totalpage + "페이지");

        $("#quick .page .current").html(curpage);
        $("#quick .page .current").attr("title", "현재 " + curpage + "페이지");
        $("#quick .page .total").html(totalpage);
        $("#quick .page .total").attr("title", "총" + totalpage + "페이지");

        if (curpage == 1) {
            $(".icon-prev-content").addClass("hidden");
        } else {
            $(".icon-prev-content").removeClass("hidden");
        }
        if (curpage == totalpage) {
            $(".icon-next-content").addClass("hidden");
        } else {
            $(".icon-next-content").removeClass("hidden");
        }


        $("#page_list li.subject").removeClass("active");
        $("#page_list li.subject[index=" + this._current_index + "]").addClass("active");
        // $("#page_list li ul li").removeClass("active");
        // $("#page_list li ul li[index="+this._current_index+"]").addClass("active");

        if (this._device_type == 'mobile' || this._device_type == null) {
            var obj = this._playing;
            this.update_subject_content($('#content-btn'), obj, this._current_index);
            this.update_subject_content($('#content-btn2'), obj, this._current_index);
        }


        //주소창
        if (UPDATE_WINDOW_HISTORY) {
            var str = [];
            this._queryParams["playlist"] = this._playlist_id;
            this._queryParams["start"] = this._playing.id;
            for (var p in this._queryParams) {
                if (this._queryParams.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(this._queryParams[p]));
                }
            }
            var searchParams = "?" + str.join("&");
            var urlPath = window.location.pathname + window.location.hash + searchParams;
            window.history.pushState({
                _queryParams: this._queryParams,
                _mode: this._mode,
                _playlist_id: this._playlist_id,
                _start_id: this._start_id,

                _playlist_length: this._playlist_length,
                _current_index: this._current_index,

                _playlist_data: this._playlist_data,
                _playing: this._playing
            }, null, urlPath);
        } else {
            window.history.replaceState({}, null, window.location.pathname);
        }
    },

    SCREEN_RATIO: SCREEN_RATIO_VALUE, //"fill", "fit"
    ZOOM_FACTOR: 1.0,
    ratio_x: 1,
    ratio_y: 1,

    fit_smartppt_content_element_to_parent: function ($targetEle, $iframe_parent) {
        var self = this;

        var top_container_height = 0;
        var left_container_width = 0;
        var no_smartppt_x_gap = 0;
        var no_smartppt_y_gap = 0;

        if ($targetEle.attr('id') == "iframe_content_pairbook") {
            if (self._device_type != 'mobile') {

                top_container_height = NO_SMARTPPT_HEADER_HEIGHT;

                no_smartppt_x_gap = NO_SMARTPPT_CONTENT_X_GAP;
                no_smartppt_y_gap = NO_SMARTPPT_CONTENT_Y_GAP;
            }
        } else if ($targetEle.attr('id') == "iframe_tools") {
            top_container_height = 0;

            no_smartppt_x_gap = NO_SMARTPPT_CONTENT_X_GAP;
            no_smartppt_y_gap = NO_SMARTPPT_CONTENT_Y_GAP;
        }

        var parent_w = $iframe_parent.width();
        var parent_h = $iframe_parent.height();
        // console.log($iframe_parent);
        // console.log("iframe_parent:",parent_w,parent_h);
        parent_h -= top_container_height;

        parent_w -= 2 * (CONTENT_X_GAP - no_smartppt_x_gap);
        parent_h -= 2 * (CONTENT_Y_GAP - no_smartppt_y_gap);
        // console.log("iframe_parent:",parent_w,parent_h);
        // console.log("iframe_parent xy:",CONTENT_X_GAP,CONTENT_Y_GAP);

        // var this_w = $targetEle.contents().find("body").width();
        // var this_h = $targetEle.contents().find("body").height();

        var ratio_x = 1;
        var ratio_y = 1;
        var this_w = parent_w;
        var this_h = parent_h;

        var top = ((CONTENT_Y_GAP - no_smartppt_y_gap) + top_container_height) + "px";
        var left = ((CONTENT_X_GAP - no_smartppt_x_gap) + (parent_w - this_w) / 2) + "px";
        var screean_ratio = self.SCREEN_RATIO;

        try {
            var frame = $targetEle.get(0);
            // var doc = (frame.contentDocument) ? frame.contentDocument : frame.contentWindow.document;
            //
            // setTimeout(function () {
            //     try {
            //         if (doc) {
            //             this_h = doc.body.scrollHeight;
            //             this_w = doc.body.scrollWidth;
            //         }
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }, 500);

            // this_h = doc.body.clientHeight;
            // this_w = doc.body.clientWidth;
            // console.log(frame);

            var viewports = $targetEle.contents().find('meta[name=viewport]').attr("content");
            console.log("viewports ; ",this_w,this_h);
            if (viewports) {
                var temp1 = viewports.split(',');
                temp1.forEach(function (vp) {
                    var vp2 = vp.replace(' ', '');
                    if (vp2.startsWith('width=')) {
                        this_w = parseFloat(vp2.replace('width=', ''));
                    } else if (vp2.startsWith('height=')) {
                        this_h = parseFloat(vp2.replace('height=', ''));
                    }
                });

                // console.log(this_w,this_h);

                // if(this_w == NaN || this_h == NaN) {

                if (!this_w || !this_h) {

                    if ($targetEle.attr('id') == "iframe_tools") {
                        this_w = 1024;
                        this_h = 768;

                        if ($targetEle.attr('src').indexOf('/tools/board/') >= 0) {

                            // 이전에 사용하던 크기
                            // this_w = 1280;
                            // this_h = 800;
                            // 0205까지 쓰던 크기
                            // this_w = 1920;
                            // this_h = 897;

                            // 작게보기일 때와 크게 보기일 떄 크기 변경
                            var get_title = $('.icon-aside-open-txt').attr('title');

                            if (get_title == '크게보기' || get_title == undefined) {
                                this_w = 1366;
                                this_h = 800;
                                // this_w = 1280;
                                // this_h = 800;
                            } else if (get_title == '작게보기') {
                                this_w = 1920;
                                this_h = 897;
                            }

                            // screean_ratio = 'fit';
                            screean_ratio = 'fill';
                        }

                    } else {
                        this_w = 1363;
                        this_h = 952;


                        // console.log('==============');
                        // console.log('ebookpair.html2');
                        // console.log($('#iframe_content_pairbook').attr('src'));
                        // console.log('==============');

                        // 2022.01.24 추가
                        if ($('#iframe_content_pairbook').attr('src').indexOf('ebookpair.html') > -1) {
                            this_w = 1453.55;
                            this_h = 952;
                        }
                    }
                }
            }

            if ($targetEle.attr('id') == "iframe_content") {
                // if (this_w == 1363) {
                    this_w = 1463;
                    this_h=952;
                // }
            }

            // if ($("body").attr('theme') == 'theme-green') {
            //     top_container_height = top_container_height + 15;
            //     left_container_width = 15;
            //     parent_w = parent_w - 30;
            //     parent_h = parent_h - 30;
            //     // this_w = this_w - (left_container_width + 30);
            //     // this_h = this_h - (top_container_height + 30);
            //     $('.popup.tools').css('margin', '15px');
            //     // $targetEle.contents().find('#wrap').css({
            //     //     'width': this_w + 'px', 'height': this_h + 'px', 'padding': '0 33px'
            //     // });
            //
            //     $('.modal').css({
            //         'top': '15px', 'left': '15px', 'width': 'calc(100% - 30px)', 'height': 'calc(100% - 30px)'
            //     });
            // }
            // else
            // {
                $('.popup.tools').css('margin', '0px');
                $('.modal').css({
                    'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%'
                });
            // }

            self.ratio_x = parent_w / this_w * self.ZOOM_FACTOR;
            self.ratio_y = parent_h / this_h * self.ZOOM_FACTOR;
            // console.log("parent_x :", parent_w,parent_h );
            // console.log("this_x :", this_w ,this_h );
            // console.log("self.ratio_x :",self.ratio_x ,self.ratio_y );

            var scale = self.ratio_x;
            if (self.ratio_x > self.ratio_y) {
                scale = self.ratio_y;
            }

            // console.log("screean_ratio :", screean_ratio );
            if (screean_ratio == "fill") {

            } else {
                self.ratio_x = scale;
                self.ratio_y = scale;
            }

            ratio_x = self.ratio_x;
            ratio_y = self.ratio_y;

            top = ((CONTENT_Y_GAP - no_smartppt_y_gap) + top_container_height) + "px";
            left = ((CONTENT_X_GAP - no_smartppt_x_gap) + left_container_width + (parent_w - this_w * ratio_x) / 2) + "px";
        } catch (error) {
            console.log(error);
        }

        if ($targetEle.attr('id') == "iframe_tools") {
            if ($targetEle.attr('src').indexOf('/tools/board/') >= 0) {
                top = ((CONTENT_Y_GAP - no_smartppt_y_gap) + top_container_height + (parent_h - this_h * ratio_y) / 2);
                if (top > $("#drawing").height() / 2) {
                    top = top - $("#drawing").height() / 2;
                }
                top = top + "px";
            } else if (this_w < parent_w && this_h < parent_h) {
                ratio_x = 1;
                ratio_y = 1;
                this_w = parent_w;
                this_h = parent_h;
            }
        }

        console.log('신규 적용 >> ', $targetEle.attr('id'));
        if ($targetEle.attr('id') == 'iframe_content'
            && ($('#iframe_content').attr('src').indexOf('/Ebook/ViewVideo.mrn') > -1
                || $('#iframe_content').attr('src').indexOf('/Ebook/ViewFile.mrn') > -1
                || $('#iframe_content').attr('src').indexOf('/Ebook/ViewAiClass.mrn') > -1)) {
            $targetEle.css({
                'top': 0, 'left': 0,
                'width': '', 'height': '',
                '-webkit-transform': '',
                '-moz-transform': '',
                '-ms-transform': '',
                '-o-transform': '',
                'transform': '',
                "-webkit-transform-origin": "",
                "transform-origin": ""
            });
        } else {
            $targetEle.css({
                'top': top, 'left': left,
                'width': this_w, 'height': this_h,
                '-webkit-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                '-moz-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                '-ms-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                '-o-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                'transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                "-webkit-transform-origin": "0px 0px",
                "transform-origin": "0px 0px 0px"
            });
        }


        if ($targetEle.attr('id') != "iframe_tools") {
            // if ($targetEle.attr('id') == "iframe_content_pairbook") {
            // } else if($targetEle.attr('id') == "iframe_content") {
            // }
            if ($targetEle.is(":visible")) {
                $("#viewer-content .drawing-canvas-wrapper").css({
                    'top': top, 'left': left,
                    'width': this_w, 'height': this_h,
                    '-webkit-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                    '-moz-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                    '-ms-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                    '-o-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                    'transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
                    "-webkit-transform-origin": "0px 0px",
                    "transform-origin": "0px 0px 0px"
                });

                // 2022.01.18 추가 : ebook - 한쪽보기 - 세로폭일 때 canvas 크기가 줄어들기 때문에 닫고 나서 맞춰야 함
                $("#viewer-content .drawing-canvas").offset($("#viewer-content .drawing-canvas-wrapper").offset());
                $("#viewer-content .drawing-canvas").width($("#viewer-content .drawing-canvas-wrapper").width());
                $("#viewer-content .drawing-canvas").height($("#viewer-content .drawing-canvas-wrapper").height());

                // 2021.12.15 추가 시작
                var user_viewType = $('.popup.tools .content_viewType');
                if (CURRICULUM_CODE == 'AUTH' && user_viewType.hasClass('widthFit')) {
                    var _this_frame = $('#iframe_content_pairbook').contents().find('#ebook_center').contents();
                    var pairbook_width = $('#iframe_content_pairbook').width();
                    var _get_width = $('#iframe_content_pairbook').contents().find('#ebook_center').width();
                    var _get_height = $('#iframe_content_pairbook').contents().find('#ebook_center').height();
                    var pairbook_height = $('#iframe_content_pairbook').height();
                    var contents_height = _this_frame.find('#ebook').height();
                    var scale_y = pairbook_height / contents_height;

                    $('.drawing-canvas').css({
                        'width': _get_width * scale_y,
                        'height': _get_height * scale_y,
                        'left': (pairbook_width - (_get_width * scale_y)) / 2
                    });
                } else {
                    // 이 부분은 기존 소스
                    $("#viewer-content .drawing-canvas").css({
                        'width': this_w, 'height': this_h
                    });

                    // 2021.12.15 추가 시작 - 여기는 추가한 사항
                    if (CURRICULUM_CODE == 'AUTH' && user_viewType.hasClass('heightFit')) {
                        $("#viewer-content .drawing-canvas").css({
                            'top': 0, 'left': 0,
                        });
                    }
                }

                if (iframe_canvas) {
                    iframe_canvas.fitStage();
                }
            }
        }

    }

    // iframe 팝업 틀
    , open_popup_url: function (url, hide_close_button, default_popup_title) {
        if (url == '#') {
            show_alert("잘못된 URL입니다. : " + url);
            return;
        }
        ebook.changePairBookTitlebar();

        var self = this;
        var $targetiframe = $("#iframe_content_pairbook");
        var $iframe_parent = $("#viewer-content");

        self.load_iframe_by_url(url, $targetiframe, $iframe_parent, default_popup_title);

        if (hide_close_button) {
            $(".popup.tools a.close").hide();

            setTimeout(function () {
                $(".icon-prev-content").show();
                $(".icon-next-content").show();
            }, 500)
        } else {
            $(".popup.tools a.close").show();

            setTimeout(function () {
                $(".icon-prev-content").hide();
                $(".icon-next-content").hide();
            }, 500)
        }
    },
    play_list_fit_height: function (resize) {
        var target = $('#viewer-aside-list-inner');
        if (target.offset()) {
            var target_padding = 40;
            if (resize) {
                target_padding = 0;
            }
            if ($("body").attr('theme') == 'default') {
                if (!$('.no-toc-area').hasClass('folded')) {
                    target_padding = target_padding + 20;
                }
            }
            var targetTop = target.offset().top + target_padding;
            var obj = $('.course-btm.row');
            var no_toc_area = $('.no-toc-area').height();
            var targetHeight = obj.offset().top - (targetTop + no_toc_area);
            $('#viewer-aside-list-inner').height(targetHeight + 1);
        }
    },
    popover_hover: function (type, placement, img) {
        if (!placement) {
            placement = 'top';
        }
        $('[data-toggle="' + type + '-popover-hover"]').popover({
            html: true,
            trigger: 'hover',
            placement: placement,
            boundary: 'window',
            //content: function () { return '<img src="' + $(this).data('img') + '" />'; }
            content: function () {
                return '<img src="' + img + '" />';
            }
        });
    },
    popover_hover_update: function (type, img) {
        var popover = $('[data-toggle="' + type + '-popover-hover"]').data('bs.popover');
        if (popover) {
            popover.config.content = '<img src="' + img + '" />';
        }
    },
    paging_thumbnail: function (total_count, cur_page) {
        var per_page = 1;
        var nav_page = 1;
        var total_page = Math.ceil(total_count / per_page);
        var page_group = Math.ceil(cur_page / nav_page);

        var last = (page_group * nav_page);
        if (last > total_page) {
            last = total_page;
        }

        var first = last - (nav_page - 1);

        var prev = first - 1;
        var next = last + 1;
        prev = prev == 0 ? first : prev;
        next = next > total_page ? last : next;

        return {prev: prev, next: next};
    },
    content_thumbnail: function (page) {
        if (!page) {
            page = this.paging_thumbnail(this._playlist_data.playlist.length, this._current_index + 1);
        }

        prev_obj = this._playlist_data.playlist[page.prev - 1];
        next_obj = this._playlist_data.playlist[page.next - 1];

        // console.log("--------------------------------");
        // console.log(prev_obj.thumbnail);
        // console.log(prev_obj.uploadMethod);
        // console.log(get_url(prev_obj.url));
        // console.log("--------------------------------");
        if (prev_obj && prev_obj.thumbnail) {
            var prev_thumbnail = (prev_obj.uploadMethod =='CMS')?get_cms_url('CMS',prev_obj.thumbnail) :get_url(prev_obj.thumbnail);
            this.prev_thumbnail(prev_thumbnail);
            // this.popover_hover('prev-content');
            this.popover_hover('prev-content2', 'right', prev_thumbnail);
        } else {
            if (prev_obj && '#' == prev_obj.url) {
                page.prev--;
                this.content_thumbnail(page);
                return;
            }

            // $('#prev-content').popover('dispose');
            $('.icon-prev-content').popover('dispose');
        }
        if (next_obj && next_obj.thumbnail) {
            var next_thumbnail = (next_obj.uploadMethod =='CMS')?get_cms_url('CMS',next_obj.thumbnail) :get_url(next_obj.thumbnail);
            this.next_thumbnail(next_thumbnail);
            // this.popover_hover('next-content');
            this.popover_hover('next-content2', 'left', next_thumbnail);
        } else {
            if (next_obj && '#' == next_obj.url) {
                page.next++;
                this.content_thumbnail(page);
                return;
            }

            // $('#next-content').popover('dispose');
            $('.icon-next-content').popover('dispose');
        }
    },
    prev_thumbnail: function (img) {
        // var $prev_content = $('#prev-content');
        // $prev_content.attr("data-toggle", "prev-content-popover-hover");
        // $prev_content.attr("data-img", get_url(img));

        var $prev_content2 = $('.icon-prev-content');
        $prev_content2.attr("data-toggle", "prev-content2-popover-hover");
        $prev_content2.attr("data-img", get_url(img));

        // this.popover_hover_update('prev-content', img);
        this.popover_hover_update('prev-content2', img);
    },
    next_thumbnail: function (img) {
        // var $next_content = $('#next-content');
        // $next_content.attr("data-toggle", "next-content-popover-hover");
        // $next_content.attr("data-img", get_url(img));

        var $next_content2 = $('.icon-next-content');
        $next_content2.attr("data-toggle", "next-content2-popover-hover");
        $next_content2.attr("data-img", get_url(img));

        // this.popover_hover_update('next-content', img);
        this.popover_hover_update('next-content2', img);
    },

    open_mirroring_page: function () {
        if (MIRRORING_WINDOW && !MIRRORING_WINDOW.closed) {
            MIRRORING_WINDOW.focus();
        } else {
            var specs = "satus=0,toolbar=0,resizable=1,menubar=0,location=0,width=500,height=400";
            MIRRORING_WINDOW = window.open("/assets/viewer/mirror.html", MIRRORING_WINDOW_NAME, specs);
        }
    },

    close_mirroring_page: function () {
        if (MIRRORING_WINDOW != null) {
            MIRRORING_WINDOW.close();
            MIRRORING_WINDOW = undefined;
        }
    },

    get_element: function (selector) {
        return $(selector);
    },

    sync_with_parent: function () {
        if (!IS_MIRRORING_WINDOW) {
            $.LoadingOverlay("hide");
            return;
        }
        tms._user = parent.opener.tms._user;

        viewer.is_mirroring_started = true;
        viewer._queryParams = parent.opener.viewer._queryParams;
        viewer._playlist_id = parent.opener.viewer._playlist_id;
        viewer._start_id = parent.opener.viewer._start_id;
        viewer._playlist_length = parent.opener.viewer._playlist_length;
        viewer._current_index = parent.opener.viewer._current_index;
        viewer._current_page = parent.opener.viewer._current_page;
        viewer._prev_index = parent.opener.viewer._prev_index;
        viewer._playlist_data = parent.opener.viewer._playlist_data;
        viewer._playing = parent.opener.viewer._playing;
        viewer._active_grade_code = parent.opener.viewer._active_grade_code;
        viewer._active_term_code = parent.opener.viewer._active_term_code;
        viewer._active_course_code = parent.opener.viewer._active_course_code;
        viewer._all_course_info = parent.opener.viewer._all_course_info;
        viewer._detail_course_info = parent.opener.viewer._detail_course_info;
//        viewer._bookmark_data = parent.opener.viewer._bookmark_data;
        viewer._mode = parent.opener.viewer._mode;
        viewer.load_smartppt(parent.opener.viewer._playing);

        setTimeout(function () {
            var current_content_type = parent.opener.get_current_content_type();
            if (current_content_type == 'smartppt') {
                //viewer.load_smartppt(parent.opener.viewer._playing);
            } else if (current_content_type == 'popup') {
                var url = parent.opener.viewer.get_element("#iframe_content_pairbook").attr('src');
                var hide_close_button = !parent.opener.viewer.get_element(".popup.tools a.close").is(":visible");
                var default_popup_title = parent.opener.viewer.get_element(".popup.tools .title").html();
                viewer.open_popup_url(url, hide_close_button, default_popup_title);
            } else if (current_content_type == 'preview') {

            }

            $.LoadingOverlay("hide");
        }, 500);

    },

    get_current_drawing_canvas: function () {
        current_content_type = get_current_content_type();

        //if (current_content_type == 'smartppt') {
        drawing_canvas = iframe_canvas;
        //} else if (current_content_type == 'popup') {
        //    drawing_canvas = iframe_canvas;
        //} else if (current_content_type == 'preview') {

        //    if (preview_viewer.file_type != 'video' && preview_viewer.file_type != 'audio') {
        //        if (IS_USING_PDF_MODULE) {
        //            drawing_canvas = Module.pdf_viewer.drawing();
        //        } else {
        //            drawing_canvas = Module.image_viewer.drawing();
        //        }
        //    } else {
        //        drawing_canvas = Module.video_viewer.drawing();
        //    }
        //}
        return drawing_canvas;
    },

    load_simple_preview: function (file_id, title) {
        var subject_file_type = undefined;
        var subject_file_id = file_id;
        var subject_file_title = title;
        var subject_file_title = undefined;
        var subject_file_thumbnail = undefined;
        var subject_file_div = undefined;
        var subject_external_url = undefined;
        load_preview(subject_file_type, subject_file_id, subject_file_title, subject_file_title, subject_file_thumbnail, subject_file_div, subject_external_url);
    },

    open_video: function (type, url, title, file) {
        if ($("#module-modal").hasClass('show')) {
            $("#module-modal").modal('hide');
        }
        $("#module-modal").modal('show');

        $('#module-title').html(title);

        // app.close_popup_content();

        $('.icon-prev-content').hide();
        $('.icon-next-content').hide();

        $('.carousel-control-prev').show();
        $('.carousel-control-next').show();

        var params = {
            'type': 'video',
            'div': type,
            'url': url,
            'file': file
        }
        $("#module-modal").modal('show');
        preview_viewer.load_preview(params, function (res) {
            console.log("res >> " + res);
            if (res == "close") {
                $("#module-modal").modal('hide');
            }
        });
    },
    settingRatioFill: function () {
        $('#screen-ratio-fit').parent().removeClass('active');
        $('.pop_skin_ratio').removeClass('active');
        $('#screen-ratio-fill').prev().addClass('active');
        viewer.SCREEN_RATIO = 'fill';
        viewer.resize();
        viewer.user_selected_ratio = false;
    },
    settingRatioFit: function () {
        $('#screen-ratio-fill').parent().removeClass('active');
        $('.pop_skin_ratio').removeClass('active');
        $('#screen-ratio-fit').prev().addClass('active');
        viewer.SCREEN_RATIO = 'fit';
        viewer.resize();
        viewer.user_selected_ratio = false;
    },
    showEbook: function (send_page) {

        $("#module-modal").modal('hide');
        app.close_study_tools();

        ebook.show_ebook();

        $('#iframe_content_pairbook').attr('src', '/assets/viewer/ebookpair.html');

        $('#iframe_content_pairbook').unbind('load').bind('load', function () {
            // iframe body fitend_page = { 'page': page, 'type': this_type, 'ebo
            var iframe_body = $('#iframe_content_pairbook').contents().find('body');
            iframe_body.width($('#iframe_content_pairbook').width());
            iframe_body.height($('#iframe_content_pairbook').height());

            console.log('===== showEbook =======')
            console.log(send_page);
            ebook.ebook_page_data(send_page);

            if (iframe_canvas) {
                var _container = $("#viewer-content .drawing-canvas").get(0);
                iframe_canvas.deactivate();
                iframe_canvas = new DrawingCanvas({
                    container: _container,
                });
            }

            drawing_canvas = iframe_canvas;
        });
    },
    mobileEbookTitleSet: function (type) {

        // console.log(type)
        if (type == 'ebook') {
            $(".wrap-inner #hd .title").html("교과서");
        } else if (type == 'studybook') {
            $(".wrap-inner #hd .title").html("수학 익힘");
        }
    },
    mobileShortTitleSet: function () {
        var _cur_title = viewer._playlist_data.info.shortTitle;
        $('.wrap-inner #hd .title').text(_cur_title);
    },
    openCalculator: function () {
        // 계산기 draggable
        $('#calculator_wrap').draggable({containment: '#viewer-content'});
        $('#calculator_wrap').addClass('active');
        $('#math-tool .icon-drawing7').click();
        $('#calculator_wrap').focus();
    },
    mirroringCalcDrag: function (left, top) {
        $('#calculator_wrap').css('left', left)
        $('#calculator_wrap').css('top', top)
    },
    handleCalculatorHistory: function () {
        if ($('.calc_history').hasClass('show_history')) {
            viewer.calc_history_show();
        } else {
            viewer.calc_history_hide();
        }
    },
    calc_history_show: function () {
        $('.calc_history').addClass('hide_history');
        $('.calc_history').removeClass('show_history');

        $('#calculator_wrap').width('500px');
        $('.result_wrap').css('display', 'block');
    },
    calc_history_hide: function () {
        $('.calc_history').addClass('show_history');
        $('.calc_history').removeClass('hide_history');

        $('#calculator_wrap').width('300px');
        $('.result_wrap').css('display', 'none');
    },
    calculatorClose: function () {
        $('#calculator_wrap').removeClass('active');
        $('#calculator_wrap').blur();
    },
    smartpptFullscreen: function () {
        window.onmessage = function (e) {
            if (e.data == 'onFullscreen') {
                viewer.onFullscreen();
            } else if (e.data == 'offFullscreen') {
                viewer.offFullscreen();
            }
        }
    },
    onFullscreen: function () {
        document.requestFullscreen();
    },
    offFullscreen: function () {
        document.exitFullscreen();
    },

    //교과서 바로가기 / 실험관찰 ebook
    smartpptUseBtnClick: function () {
        window.onmessage = function (e) {

            if (e.data == 'tab_click' && iframe_canvas) {
                // console.log('contents tab button click');
                iframe_canvas.mathTool_clear();
                return;
            }

            if (e.data == 'ebook_link_click') {

                // var get_data = $("#page_list .subject.active").data();
                var get_data = viewer._playing;
                /**
                 * page 정보는 조합해야 함.
                 *
                 * 시작 페이지는 playlist에 있는 page정보이고
                 * 종료 페이지는
                 *  - studybook : viewer._playlist_data.info.studybookPages
                 *  - ebook : viewer._playlist_data.info.ebookPages
                 */

                console.log("===get_data===");
                console.log(get_data);
                var page = undefined;
                var _book_type = get_data.ebookType;
                // var _book_type = get_data.ebook_type;
                var this_page = get_data.page;
                var this_type = viewer._playlist_data.info.type;

                if (_book_type == 'ebook') {
                    page = viewer._playlist_data.info.ebookPages;
                } else if (_book_type == 'studybook') {
                    page = viewer._playlist_data.info.studybookPages;
                }


                var send_page = {'page': page, 'type': this_type, 'ebook_type': _book_type, 'this_page': this_page};

                // console.log('send_page');
                // console.log(send_page);

                viewer.showEbook(send_page);

                if ($("#math-tool").hasClass('active')) {
                    $("#math-tool").removeClass('active');
                    $("#math_tool_btn").removeClass('active');
                }

                viewer.mobileEbookTitleSet(_book_type);
            }
        };
    },

    winOpen: function(url, w, h, param, nm) {
        var curX = window.screenLeft;
        var curY = window.screenTop;
        var curWidth = document.body.clientWidth;
        var curHeight = document.body.clientHeight;
        var xPos = curX + (curWidth / 2) - (w / 2);
        var yPos = curY + (curHeight / 2) - (h / 2);
        // url = ($text.isEmpty(param)) ? url : url + '?' + param;
        // nm = ($text.isEmpty(nm)) ? $text.getUUID() : nm;
        let win = window.open(url, "_blank", 'width=' + w + ', height=' + h + ', left=' + xPos + ', top=' + yPos + ', menubar=no, status=no, titlebar=no, resizable=no');
    },
};

function on_hidden_module_modal() {
    // console.warn("on_hidden_module_modal");

    $('#module-modal').modal('hide');
    $("#drawing-button").removeClass('active');
    $("#drawing").removeClass('active');

    if (iframe_canvas) {
        iframe_canvas.deactivate();
    }
    // $(".drawing-canvas-wrapper").addClass('hidden');

    $('.icon-prev-content').show();
    $('.icon-next-content').show();
    if (IS_USING_PDF_MODULE) {
        $("#pdf-iframe").attr('src', '');
        IS_USING_PDF_MODULE = false;
    }
    Module.pdf_viewer.destroy_canvas();
    Module.image_viewer.destroy_canvas();
    Module.video_viewer.destroy_canvas();

    Module.common.destroy();
    $("#content-scale").empty();

    current_content_type = get_current_content_type();

    //if (current_content_type == 'smartppt') {
    $(".drawing-canvas-wrapper").removeClass('hidden');
    Module.common.iframe_zoom('iframe_content', 3);
    //} else if (current_content_type == 'popup') {
    //    $(".drawing-canvas-wrapper").removeClass('hidden');
    //    Module.common.iframe_zoom('iframe_content_pairbook', 3);
    //} else if (current_content_type == 'preview') {
    //    $(".drawing-canvas-wrapper").addClass('hidden');
    //}
    if (preview_viewer) {
        preview_viewer.index = -1;
    }

    YOUTUBEVIDEOPLAYERCHECK = false;
}

function load_preview(subject_file_type, subject_file_id, subject_file_title,
                        subject_file_thumbnail, subject_file_div, subject_external_url) {
    console.log("==function load_preview == ", subject_external_url);
    console.log("==function load_preview == ", subject_file_title);
    console.log("==function load_preview == ", subject_file_thumbnail);
    if ($("#module-modal").hasClass('show')) {
        $("#module-modal").modal('hide');
    }
    // 모바일 가로모드일 때 모달창 닫기
    if ($("#modal-data-contents").hasClass('show')) {
        $("#modal-data-contents").modal('hide');
    }
    $(".popup.tools").css('z-index', '0');
    ebook.move_button_hide();
    // $("#module-modal").modal('show');
    $('#module-title').html(subject_file_title);

    setTimeout(function () {
        $(".drawing-canvas-wrapper").addClass('hidden');
    }, 500);

    // $('#module-title').html(subject_file_title);

    // app.close_popup_content();

    // [엠티처/474] 요청사항으로 좌우 이동버튼 노출되도록 수정
    // $('.icon-prev-content').hide();
    // $('.icon-next-content').hide();

    $('.carousel-control-prev').show();
    $('.carousel-control-next').show();

    var params = {
        'type': subject_file_type,
        'file': subject_file_id,
        'url': subject_external_url,
        'div': subject_file_div,
        'source': 'PERIOD',
        'user': tms._user,
        'title': subject_file_title
    }
    //$("#module-modal").modal('show');
    console.log("load_preview");
    console.log(params);

    // Iframe 초기화. (다음페이지가 문서인경우 동영상 중지 안되는 이슈로 인해 추가
    $("#iframe_content").prop("src", "about:blank");

    preview_viewer.load_preview(params, function (res) {
        if (res == "close") {
            $("#module-modal").modal('hide');
        }
    });
}


function open_subject_link($ele) {
    var data_idx = $ele.attr('data-index');
    var subject_link_idx = $ele.attr('subject-link-index');
    if (typeof (subject_link_idx) == "string") {
        subject_link_idx = parseInt(subject_link_idx);
    }

    Module.common.set_title(data_idx);

    var obj = viewer._playlist_data.playlist[data_idx];
    // console.log(obj);

    var subject_link_info = obj.content[subject_link_idx];
    var subject_file_type = subject_link_info.pic;
    var subject_file_title = subject_link_info.title;
    var subject_file_id = subject_link_info.file_id;
    var subject_file_thumbnail = subject_link_info.thumbnail;

    if (subject_file_title) {
        $('#module-title').html(subject_file_title);
    }

    //app.close_popup_content();
    $(".popup.tools").hide();
    $("#iframe_content_pairbook").hide();
    $("#iframe_content_pairbook").attr('src', '');
    app.close_study_tools();

    $('.icon-prev-content').hide();
    $('.icon-next-content').hide();

    $('.carousel-control-prev').show();
    $('.carousel-control-next').show();

    var params = {
        'type': subject_link_info.type,
        'file': subject_file_id,
        'url': subject_link_info.url,
        'div': subject_link_info.div,
        'source': 'PERIOD',
        'user': tms._user
    }
    preview_viewer.load_preview(params, function (res) {
        if (res == "close") {
            $("#module-modal").modal('hide');
        }
    });
}