var vsl_stage_data = null;
var vsl_plying_id = null;
var vsl_playlist = null;
var vsl_user_id = null;
var vsl_thumbnail = null;
var vsl_info_title = null;
var vsl_playlist_title = null;
var vsl_page = null;
var vsl_mode = null;


var canvas_save_load = {
    // 사용중인 canvas 정보를 받아옵니다.
    get_canvas_data: function (stage) {
        vsl_stage_data = stage;
    },
    // 현재 페이지의 id를 받아옵니다.
    get_page_data:function(playlist, plying_id, user_id, thumbnail, info_title, playlist_title, page, mode) {
        vsl_plying_id = plying_id;
        vsl_playlist = playlist;
        vsl_user_id = user_id;
        vsl_thumbnail = thumbnail;
        vsl_info_title = info_title;
        vsl_playlist_title = playlist_title;
        vsl_page = page;
        vsl_mode = mode;
    },
    // 캔버스를 저장합니다.
    canvas_save: function () {

        try {
            if(viewer.is_mirroring_window()) return;
        } catch (error) {
        }

        var params = {};
        var method = 'create';
        var json = vsl_stage_data.save_data().json;
        var type = vsl_stage_data.save_data().type;

        if (json == undefined) {
            return;
        };

        json = json.slice(1);
        json = json.substr(0, json.length - 1);

        var data_json = {"json":json, "thumbnail":vsl_thumbnail, "infoTitle":vsl_info_title, "playlistTitle":vsl_playlist_title, "page":vsl_page};

        params.userSeq = vsl_user_id;
        params.textbookLessonSeq = vsl_playlist;
        params.textbookLessonSubjectSeq = vsl_plying_id;
        params.modalTextbookLessonBookmarkTarget = "SUBJECT";
        params.modalTextbookLessonBookmarkType = type;
        params.modalDiv = vsl_mode;
        params.modalTextbookLessonBookmarkData = JSON.stringify(data_json);

        // console.log(params)
        tms.bookmark(method, params)
            .then(function (res) {
                if (!res || res.resultCode != 'success') {
                    show_error_message(res);
                    return;
                };
            })
            .catch(function (err) {
                // show_error_message(err);
            });
    },
    // 캔버스를 불러옵니다.
    canvas_load: function (textbookLessonSeq, start_obj, userSeq, type, mode) {
        var params = { 'textbookLessonSeq': textbookLessonSeq, 
        'userSeq': userSeq, 
        'modalTextbookLessonBookmarkType': type, 
        'modalDiv':mode};

        // console.log(params)
        tms.bookmark("list", params)
            .then(function (bookmark_data) {
                // console.log(bookmark_data);
                if (bookmark_data && bookmark_data.resultCode == 'success') {
                    for (var index = 0; index < bookmark_data.resultData.length; index++) {
                        var bookmark_info = bookmark_data.resultData[index];

                        if (start_obj == bookmark_info.textbookLessonSubjectSeq) {
                            var canvas_data = JSON.parse(bookmark_info.modalTextbookLessonBookmarkData);
                            vsl_stage_data.load_canvas(canvas_data.json);
                            // canvas load 후 canvas active 상태 삭제
                            var canvas_parent = $('.konvajs-content').parent();
                            canvas_parent.removeClass('active');
                        }
                    }
                }
            })
            .catch(function (err) {
                console.error(err);
            });
    }, 
    // 그린 정보를 삭제합니다.
    canvas_data_delete: function (type) {
        try {
            if(viewer.is_mirroring_window()) return;
        } catch (error) {
        }
        
        var params = {};
        var type = type;
        var method = 'delete';

        params.userSeq = vsl_user_id;
        params.textbookLessonSeq = vsl_playlist;
        params.modalTextbookLessonBookmarkTarget = "SUBJECT";
        params.modalTextbookLessonBookmarkType = type;
        params.textbookLessonSubjectSeq = vsl_plying_id;
        params.modalDiv = vsl_mode;

        console.log(params)

        tms.bookmark(method, params)
            .then(function (res) {
                if (!res || res.resultCode != 'success') {
                    // show_error_message(res);
                    return;
                };
                
            })
            .catch(function (err) {
                // show_error_message(err);
            });
    }
}    