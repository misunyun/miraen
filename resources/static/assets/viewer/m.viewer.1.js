var queryString = document.location.search.substring(1);
var queryParams = parseQueryString(queryString);
// var smart_ppt_page_id = 'id' in queryParams ? queryParams.id : '';

var CONTENT_X_GAP = 0;
var CONTENT_Y_GAP = 0;
var SCREEN_RATIO_VALUE = 'fill';//'fit', 'fill'
var NO_SMARTPPT_HEADER_HEIGHT = 30;
var NO_SMARTPPT_CONTENT_X_GAP = 0;
var NO_SMARTPPT_CONTENT_Y_GAP = 0;

var UPDATE_WINDOW_HISTORY = true;
var TEST_LOCALHOST = false;
if(window.location.hostname == 'localhost') {
    TEST_LOCALHOST = true;
}



var tms = {

    _user: undefined, 
    
    get_user_info: function() {
        // TODO: 사용자 정보 획득
        console.log("tms.get_user_info: TODO: 사용자 정보 획득");
        var self = this;

        // 일단 넣어둠... 나중에 세션 등으로 변경해야 함.
        this._user = 'user' in queryParams ? queryParams.user : undefined;
        if(TEST_LOCALHOST) {
            this._user = 'user' in queryParams ? queryParams.user : 'test1';
        }
        return new Promise(function(resolve, reject) {
            console.log("사용자: "+self._user);
            // 일단 통과
            resolve();
            //reject(new Error("Request is failed"));
        });

    }, 
    
    check_permission: function(mode, playlist_id, start_id) {
        // TODO: 사용자 권한 확인
        console.log("tms.check_permission: TODO: 사용자 권한 확인");
        var self = this;
        
        return new Promise(function(resolve, reject) {
            // 일단 통과
            resolve();
            //reject(new Error("Request is failed"));
        });
    },

    get_playlist: function(mode, playlist_id) {
        // TODO: 수업 목록 가져오기
        console.log("tms.get_playlist: TODO: 수업 목록 가져오기");
        var self = this;
        var url = "./testdata/"+playlist_id+".json";
        
        // url = "http://localhost:8080/tms/viewer/playlist";
        
        return new Promise(function(resolve, reject) {
            if(!playlist_id) {
                reject(new Error("수업 정보가 없습니다. 다시 확인해주세요."));
                return;
            }
            var promise = $.ajax({
                url: url,
                //type: 'post',
                //data: JSON.stringify({"id": "test"}),
                //contentType: 'application/json',
            });    
            promise.then(resolve, reject);
            // 일단 통과
            // resolve();
            //reject(new Error("Request is failed"));
        });
        
    }
};


var viewer = {
    _device_type: null,

    _queryParams: undefined,
    _mode: undefined,
    _playlist_id: undefined,
    _start_id: undefined,

    _playlist_length: 0,
    _current_index: -1,
    _current_page: 1,
    _prev_index: -1,
    _playlist_data: undefined,
    _playing: undefined,

    parse_query_params: function() {
        this._queryParams = queryParams;
        this._mode = 'mode' in queryParams ? queryParams.mode : 'default';
        this._playlist_id = 'playlist' in queryParams ? queryParams.playlist : undefined;
        this._start_id = 'start' in queryParams ? queryParams.start : undefined;

        // this._playlist_id = "modal.ko.3.1.1-2";
        // this._start_id = "ko.3.1.001";
    },

    do_popstate: function(params) {
        // this._queryParams = params["_queryParams"];
        // this._mode = params["_mode"];
        // this._playlist_id = params["_playlist_id"];
        // this._start_id = params["_start_id"];
        // this._playlist_length = params["_playlist_length"];
        // this._current_index = params["_current_index"];
        // this._playlist_data = params["_playlist_data"];
        // this._playing = params["_playing"];
        
        this.update_viewer_info();
        this.update_viewer_current_info();
    },
    ready: function(device_type) {
        console.log("viewer.ready");
        var self = this;

        self._device_type = device_type;
        
        // TODO: 1. 각종 파라미터 확인
        // 수업모드 확인 // 수업모드, 창체모드
        self.parse_query_params();

        // 미러링 초기화
        mirroring.init()
        .then(function() {
            // TODO: 2. 사용자 확인
            return tms.get_user_info();
        })
        .then(function() {
            // 미러링 서버 연결
            return mirroring.api_conntect(tms._user);
        })
        // 모바일에서는 방을 만들지 않음
        // .then(function(res) {
        //     // 미러링 서버 방만들기
        //     return mirroring.api_create_room();
        // })
        .then(function(res) {
            // console.log('방이름:', res.data.roomid);
            // TODO: 3. 사용자 권한 확인 해야 하나??? 아래에서 하면 되는것 아닌가?
            return tms.check_permission(self._mode, self._playlist_id, self._start_id);

        }).then(function() {
            // TODO: 4. 수업 혹은 창체 객체 가져오기
            return tms.get_playlist(self._mode, self._playlist_id);

        }).then(function(data) {
            // TODO: 수업모드 및 시작 자료 등에 따라 뷰잉 처리
            console.log("TODO: 수업모드 및 시작 자료 등에 따라 뷰잉 처리");
            // console.log(data);
            
            // 수업 정보 validation
            if(!data || !data["playlist"]) {
                reject(new Error("수업 정보가 잘못되었습니다."));
                return;
            }
            self._playlist_data = data;

            // 시작 주제가 있는지 확인
            var start_obj = undefined;
            if(!self._start_id) {
                start_obj = _.first(data.playlist);
                self._start_id = start_obj.id;
                // TODO: 혹은 이어보기 할것인지 확인해야 함.

            } else {
                start_obj = _.find(data.playlist, function(obj) {
                    return obj.id == self._start_id;
                });
            }
            
            // self._playlist_length = data.playlist.length;
            self._playlist_length = self._playlist_data.info.total_page;
            self._current_index = _.findIndex(data.playlist, function(obj) {
                return obj.id == self._start_id;
            });
            // console.log(start_obj);
            // console.log(self._current_index);

            self.update_viewer_info();
            self.load_smartppt(start_obj);
            
            // TODO: 모드에 따라 UI 변경
            // if(self._mode == 'default') {
            //     // TODO: 4.1 수업 모드
            // } else {
            //     // TODO: 4.2 창체 모드
            // }

        }).catch(function(err) {
            console.log(err);
            show_alert(err, function() {
                window.close();
            });
        });

    }, 
    
    resize: function() {
        // console.log("viewer.resize");
        // 윈도우 크기 조절 시 뷰어 크기 조절
        var $iframe_parent = $("#viewer-content");
        try {
            this.fit_smartppt_content_element_to_parent($("#iframe_content"), $iframe_parent);  
        } catch (error) {            
        }
        try {
            this.fit_smartppt_content_element_to_parent($("#iframe_content_pairbook"), $iframe_parent);
        } catch (error) {            
        }
        try {
            this.fit_smartppt_content_element_to_parent($("#iframe_tools"), $iframe_parent);
        } catch (error) {            
        }

        try {
            this.fit_smartppt_content_element_to_parent($("#iframe_tools_bg"), $iframe_parent);
        } catch (error) {            
        }
        
    },

    load_smartppt: function(obj) {
        if(!obj) {
            throw new Error("잘못된 정보입니다.");
        }
        var self = this;
        var url = obj.url;
        // url = url.replace("http://ele.m-teacher.co.kr:8001/testfiles/mteacher/html/", "/dummy/pages/");
        if(TEST_LOCALHOST) {
            url = url.replace("http://ele.m-teacher.co.kr:8001/testfiles/", "/dummy/testfiles/");
        }
        // 
        var $targetiframe = $("#iframe_content");
        var cur_url = $targetiframe.attr("src");
        if (cur_url == url && '#' != url) {
            //return;
        }
        // self._playing = obj;
        self._current_index = _.findIndex(self._playlist_data.playlist, function(item) {
            return item.id == obj.id;
        });

        if('#' == url) {
            self._current_index = self._current_index + 1;
            obj = self._playlist_data.playlist[self._current_index];
            url = obj.url;
            if('#' == url) {
                this.load_smartppt(obj);
                return;
            }
        }
        self._playing = obj;
        self._current_page = obj.num;
        
        console.log(self._current_index);
        self.update_viewer_current_info();
        
        var $content_btn = $('#content-btn');
        $content_btn.empty();
        console.log(obj.content);
        if(obj.content) {
            var $subject_link = $('<div class="link"></div>');
            var $subject_link_a = null;
            var className = null;
            $.each(obj.content, function(index, item){
                if('video' == item.type) {
                    className = "icon-link-video";
                } else if ('doc' == item.type) {
                    className = "icon-link-doc";
                } else if ('link' == item.type) {
                    className = "icon-link";
                } else if ('pic' == item.type) {
                    className = "icon-link-pic";
                }

                if (className) {
                    var $subject_link_a = $('<a href="#" data-toggle="modal" data-target="#module-modal" ></a>');
                    $subject_link_a.attr("class", className);
                    $subject_link_a.attr("title", item.title);
                    $subject_link_a.attr("data-index", self._current_index);
                    $subject_link_a.attr("data-type", item.type);
                    
                    $subject_link.append($subject_link_a);
                    $content_btn.append($subject_link);
                }
            });
        }

        if(obj.type == 'pop') {
            /*
            self._prev_index = _.findIndex(self._playlist_data.playlist, function(obj) {
                return obj.type == 'pop';
            });
            */
            $targetiframe.attr('src', url);
            self.open_popup_url(url);
            return;
        } else {
            self._prev_index = self._current_index;
        }

        var $iframe_parent = $("#viewer-content");
        self.load_iframe_by_url(url, $targetiframe, $iframe_parent);
    },

    load_iframe_by_url: function(url, $targetiframe, $iframe_parent) {
        var self = this;
        $targetiframe.off('load');
        $targetiframe.on('load', function (e) {
            // $targetiframe.off('load');
            
            var $iframe = $(this);
            var orgOpen = $iframe.get(0).contentWindow.open;
            $iframe.get(0).contentWindow.open = function (open_url, windowName, windowFeatures) {
                // alert("iframe에서 link 이동하려함!\n"+open_url+", target: "+windowName); 
                // $(".temp_smart_ppt_iframe").animate({ opacity: '0.1' }, 100);
                console.log("iframe에서 link 이동하려함!\n" + open_url + ", windowName: " + windowName + ", windowFeatures: " + windowFeatures);
                if(!open_url.startsWith("http")) {
                    var urls = self._playing.url.split('/');
                    urls[urls.length-1] = open_url;
                    open_url = urls.join("/");
                    if(TEST_LOCALHOST) {
                        open_url = open_url.replace("http://ele.m-teacher.co.kr:8001/testfiles/", "/dummy/testfiles/");
                    }
                }
                self.open_popup_url(open_url);
                mirroring.api_sync_obj({
                    target: "viewer",
                    script: "viewer.open_popup_url('"+open_url+"');"
                });
                // return orgOpen(url, windowName, windowFeatures);
            };

            if($iframe.attr('id') == 'iframe_tools') {
                var orgClose = $iframe.get(0).contentWindow.close;
                $iframe.get(0).contentWindow.close = function() {
                    app.close_study_tools();
                    mirroring.api_sync_obj({
                        target: "app",
                        script: "app.close_study_tools();"
                    });
                };
                this.contentWindow.addEventListener('close_window',function() {
                    console.log("window.close");
                    app.close_study_tools();
                    mirroring.api_sync_obj({
                        target: "app",
                        script: "app.close_study_tools();"
                    });
                });
                this.contentWindow.addEventListener('send_to_mirror',recv_study_tools_mirroring);
                function recv_study_tools_mirroring(e) {
                    console.log(e);
                    if(!IS_REMOTE_TRIGGER) {
                        mirroring.api_sync_obj({
                            target: "iframe",
                            target_selector: "#"+$targetiframe.attr('id'),
                            event: "script",
                            message: e.detail
                        });
                    }
                    IS_REMOTE_TRIGGER = false;
                }
            }
            
            
            if(USE_REMOTE_TRIGGER) {

                if(REMOTE_TRIGGER_EVENTS) {
                    $iframe.contents().on(REMOTE_TRIGGER_EVENTS, function(event){
                    
                        // event.preventDefault();
                        var event_target_selector = $(event.target).getSelector();
                        console.log(event_target_selector);
                        if(!IS_REMOTE_TRIGGER) {
                            mirroring.api_sync_obj({
                                target: "iframe",
                                target_selector: "#"+$targetiframe.attr('id'),
                                event: event.type,
                                event_target_selector: event_target_selector
                            });
                        }
                        IS_REMOTE_TRIGGER = false;
                    });
    
                }
                
                if(USE_REMOTE_MESSAGE) {
                    this.contentWindow.addEventListener('message',recv_mirroring);
                    function recv_mirroring(e) {
                        console.log(e);
                        if(!IS_REMOTE_TRIGGER) {
                            mirroring.api_sync_obj({
                                target: "iframe",
                                target_selector: "#"+$targetiframe.attr('id'),
                                event: "message",
                                message: JSON.parse(e.data)
                            });
                        }
                        IS_REMOTE_TRIGGER = false;
                    }
                }
            }
            
            $iframe.contents().on("click", ".sp-ft .icon-sp-power", function(e) {
                app.close_popup_content();
                mirroring.api_sync_obj({
                    target: "app",
                    script: "app.close_popup_content();"
                });
            });

			Module.common.iframe_zoom('iframe_content', 3);
            self.fit_smartppt_content_element_to_parent($iframe, $iframe_parent);
        });
    
        $targetiframe.attr('src', url);

        if($targetiframe.attr('id') == 'iframe_content') {
            $("#iframe_content").show();
            $(".popup.tools").hide();
            $("#iframe_content_pairbook").hide();
            $("#iframe_content_pairbook").attr('src', '');
            app.close_study_tools();
        } else
        if($targetiframe.attr('id') == 'iframe_content_pairbook') {
            $("#iframe_content").hide();
            $(".popup.tools").show();
            $("#iframe_content_pairbook").show();
            app.close_study_tools();
        } else
        if($targetiframe.attr('id') == 'iframe_tools') {
            $("#iframe_tools").show();
        }
        
    },

    load_smartppt_by_id: function(obj_id) {
        var obj = _.find(this._playlist_data.playlist, function(item) {
            return item.id == obj_id;
        });
        this.load_smartppt(obj);
    },
    pop_close_prev: function() {
        if(this._prev_index <= 0) {
            return;
        } 
        var obj = this._playlist_data.playlist[this._prev_index ];
        this.load_smartppt(obj);
    },
    get_prev: function() {
        if(this._current_page <= 1) {
            return null;
        }
        this._current_index=this._current_index-1;
        var obj = this._playlist_data.playlist[this._current_index];
       
        if('#' == obj.url) {
            this._current_index=this._current_index-1;
            obj = this._playlist_data.playlist[this._current_index];
            if('#' == obj.url) {
                return this.get_prev();
            }
        }
        return obj;
    },
    get_next: function() {
        if(this._current_page >= this._playlist_length) {
            return null;
        }
        this._current_index=this._current_index+1;
        return this._playlist_data.playlist[this._current_index];
    },
    move_to_prev: function() {
        if(this._current_page <= 1) {
            return;
        }

        this._current_index=this._current_index-1;
        var obj = this._playlist_data.playlist[this._current_index];
       
        if('#' == obj.url) {
            this._current_index=this._current_index-1;
            obj = this._playlist_data.playlist[this._current_index];
        }

        this.load_smartppt(obj);

        return obj.type;
    },
    move_to_next: function() {
        if(this._current_page >= this._playlist_length) {
            return;
        }

        this._current_index=this._current_index+1;
        var obj = this._playlist_data.playlist[this._current_index];
        this.load_smartppt(obj);

        return obj.type;
    },
    
    update_viewer_info: function() {
        //TODO: 타이틀
        top.document.title=this._playlist_data.info.title;
        //TODO: 네비게이션
        $("#course_name").html(this._playlist_data.info.short_title);
        $("#course_name").attr("title", this._playlist_data.info.short_title);

        // $("#modal-contents .modal-title").html(this._playlist_data.info.short_title);
        $("#hd .title").html(this._playlist_data.info.short_title);

        // 버튼 유형
        var type = this._playlist_data.info.type;
        //app.type_course_btn(type);
        if("ko" == type) {
			$("#btn-korean-activity").css('display', 'block');
			$("#btn-aside-korean").css('display', 'block');
			$("#btn-data-locker").css('display', 'block');
		} else if("so" == type) {
			$("#btn-area-service").css('display', 'block');
			$("#btn-data-locker").css('display', 'block');
		} else if("ma" == type) {
			$("#btn-math-mastery").css('display', 'block');
			$("#btn-digital-parish").css('display', 'block');
			$("#btn-data-locker").css('display', 'block');
		} else if("sc" == type) {
			$("#btn-experiment").css('display', 'block');
			$("#btn-v-experiment").css('display', 'block');
			$("#btn-data-locker").css('display', 'block');
		}

        var $navigation = $("#page_list");
        $navigation.html('');
        
        var test_thumb_url = "http://ele.m-teacher.co.kr:8001/testfiles/mteacher/img/thumbnail/ko.3.1.002.PNG";

        for (var index = 0; index < this._playlist_data.playlist.length; index++) {
            var obj = this._playlist_data.playlist[index];
            console.log(obj);
            
            var $subject = $('<li class="subject col"></li>');
            var $subject_a = $('<a class="thumbnail"></a>');

            /*
            // mkh 수업보조자료
            if(obj.content) {
                var $subject_link = $('<div class="link"></div>');
                var $subject_link_a = null;
                var className = null;
                $.each(obj.content, function(index, item){
                    if('video' == item.type) {
                        className = "icon-link-video";
                    } else if ('doc' == item.type) {
                        className = "icon-link-doc";
                    } else if ('link' == item.type) {
                        className = "icon-link";
                    } else if ('pic' == item.type) {
                        className = "icon-link-pic";
                    }

                    if (className) {
                        var $subject_link_a = $('<a href="#"></a>');
                        $subject_link_a.attr("class", className);
                        $subject_link_a.attr("title", item.title);
                        $subject_link.append($subject_link_a);
                        $subject.append($subject_link);
                    }
                });
            }

            if(obj.corner) {
                if(obj.badge_color) {
                    $subject_a.html('<span><b class="badge bg-' + obj.badge_color + '">' + obj.corner + '</b>' + obj.title);
                    $subject_a.attr("title", obj.corner + ' ' + obj.title);
                } else {
                    if("Y" == obj.corner_bold) {
                        $subject_a.html('<strong>' + obj.corner + '</strong>' + ' ' + obj.title);
                        $subject_a.attr("title", obj.corner + ' ' + obj.title);
                    }  else {
                        $subject_a.html(obj.corner + ' ' + obj.title);
                        $subject_a.attr("title", obj.corner + ' ' + obj.title);
                    }
                }
            } else {
                $subject_a.html(obj.title);
                $subject_a.attr("title", obj.title);
            }
           */

            var thumb = test_thumb_url;
            if(obj.thumbnail) {
                thumb = obj.thumbnail;
            }
            
            var num = index+1;
            $subject_a.html('<img src="'+thumb+'" /><span>'+num+'</span>');
            $subject_a.data(obj);
            $subject.append($subject_a);
            $subject.data(obj);
            $subject.attr('index', index);
            $subject.attr('id', obj.TEXTBOOK_LESSON_SUBJECT_SEQ);
            
            $navigation.append($subject);
        }
    },

    update_viewer_current_info: function() {
        //  _playlist_length: 0,
        // _current_index: -1,

        // _playlist_data: undefined,
        // _playing: undefined,
        
        //TODO: 페이지 번호
        // var curpage = this._current_index+1;
        var curpage = this._current_page;
        // $("#current_page").html(curpage);
        // $("#current_page").attr("title", "현재 "+curpage+"페이지");
        // $("#total_page").html(this._playlist_length);
        // $("#total_page").attr("title", "총"+this._playlist_length+"페이지");

        $(".current").html(curpage);
        $(".current").attr("title", "현재 "+curpage+"페이지");
        $(".total").html(this._playlist_length);
        $(".total").attr("title", "총"+this._playlist_length+"페이지");
        
        //TODO: navigation 현재 부분
        $("#page_list li").removeClass("active");
        $("#page_list li[index="+this._current_index+"]").addClass("active");

        //주소창
        if(UPDATE_WINDOW_HISTORY) {
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

    fit_smartppt_content_element_to_parent: function($targetEle, $iframe_parent) {
        var self = this;

        var top_container_height = 0;
        var no_smartppt_x_gap = 0;
        var no_smartppt_y_gap = 0;
        if ($targetEle.attr('id') == "iframe_content_pairbook") {
            top_container_height = NO_SMARTPPT_HEADER_HEIGHT;

            no_smartppt_x_gap = NO_SMARTPPT_CONTENT_X_GAP;
            no_smartppt_y_gap = NO_SMARTPPT_CONTENT_Y_GAP;
        } 
        else if($targetEle.attr('id') == "iframe_tools") {
            top_container_height = 0;

            no_smartppt_x_gap = NO_SMARTPPT_CONTENT_X_GAP;
            no_smartppt_y_gap = NO_SMARTPPT_CONTENT_Y_GAP;
        }

        var parent_w = $iframe_parent.width();
        var parent_h = $iframe_parent.height();
       
        parent_h -= top_container_height;
        
        parent_w -= 2*(CONTENT_X_GAP - no_smartppt_x_gap) ;
        parent_h -= 2*(CONTENT_Y_GAP - no_smartppt_y_gap);
        
        // var this_w = $targetEle.contents().find("body").width();
        // var this_h = $targetEle.contents().find("body").height();

        var frame = $targetEle.get(0);
        var doc = (frame.contentDocument) ? frame.contentDocument : frame.contentWindow.document;
        var this_h = doc.body.scrollHeight;
        var this_w = doc.body.scrollWidth;
        // this_h = doc.body.clientHeight;
        // this_w = doc.body.clientWidth;
        // console.log(this_w, this_h);

        
        
        var viewports = $targetEle.contents().find('meta[name=viewport]').attr("content");
        if(viewports) {
            var temp1 = viewports.split(',');
            temp1.forEach(function(vp) {
                var vp2 = vp.replace(' ', '');
                if(vp2.startsWith('width=')) {
                    this_w = parseFloat(vp2.replace('width=', ''));
                } else if(vp2.startsWith('height=')) {
                    this_h = parseFloat(vp2.replace('height=', ''));
                }
            });
            // if(this_w == NaN || this_h == NaN) {
            if(!this_w || !this_h) {
                this_w = 1364;
                this_h = 952;
            }
        }
        
        self.ratio_x = parent_w / this_w * self.ZOOM_FACTOR;
        self.ratio_y = parent_h / this_h * self.ZOOM_FACTOR;
        var scale = self.ratio_x;
        if (self.ratio_x > self.ratio_y) {
            scale = self.ratio_y;
        }

        if (self.SCREEN_RATIO == "fill") {

        } else {
            self.ratio_x = scale;
            self.ratio_y = scale;
        }
        var ratio_x = self.ratio_x;
        var ratio_y = self.ratio_y;

        var top = ((CONTENT_Y_GAP - no_smartppt_y_gap) + top_container_height) + "px";
        var left = ((CONTENT_X_GAP - no_smartppt_x_gap)+(parent_w - this_w * ratio_x) / 2) + "px";

        
        $targetEle.css({
            // 'top': top, 'left': left,
            // 'width': this_w, 'height': this_h - top_container_height,
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
		// #wrap 으로 변경 테스트중
		/*
		$targetEle.contents().find('#wrap').css({
			'left':'50%',
			'margin':0,
            'transform': 'scale(' + ratio_y + ') translate(-50%,0)',
            "transform-origin":'0 0'
        });
        */

    //    if($targetEle.attr('id') != "iframe_tools") {
            
    //         // var padding_x = 85 / ratio_x;
    //         // console.log(padding_x);
    //         // $targetEle.contents().find('#wrap').css({
    //         //     'padding': '0 '+padding_x+'px'
    //         // });

    //         $targetEle.contents().find('#wrap').css({
    //             'left':'5%',
    //             'margin':0,
    //             'transform': 'scale(0.9, 1)',
    //             "transform-origin":'0 0'
    //         });
    //     }
        
    }

    ,open_popup_url:function(url) {
        console.log("open_popup_url",url);        
        var self = this;
        var $targetiframe = $("#iframe_content_pairbook");
        var $iframe_parent = $("#viewer-content");

        self.load_iframe_by_url(url, $targetiframe, $iframe_parent);
    },
    play_list_fit_height: function(resize) {
        if ($("body").attr('theme') == 'theme-green') {
            var target = $('#viewer-aside-list-inner');
            if (target.offset()) {
                var target_padding = 40;
                if(resize) {
                    target_padding = 0;
                }
                var targetTop = target.offset().top + target_padding;
                var obj = $('.course-btm.row');
                var no_toc_area = $('.no-toc-area').height();
                var targetHeight = obj.offset().top - (targetTop + no_toc_area );
                $('#viewer-aside-list-inner').height(targetHeight);
            }
        } else if ($("body").attr('theme') == 'theme-dark-2') {
            var target = $('#viewer-aside-inner');
            if (target.offset()) {
                var targetTop = target.offset().top;
                var obj = $('.course-btm.row');
                var targetHeight = obj.offset().top - (targetTop + 52);
                $('#viewer-aside-list-inner').height(targetHeight);
            }
        }
    },
    popover_hover: function(type, placement) {
        if(!placement) {
            placement = 'top';
        }
		$('[data-toggle="' + type + '-popover-hover"]').popover({
			html: true,
			trigger: 'hover',
			placement: placement,
			content: function () { return '<img src="' + $(this).data('img') + '" />'; }
		});
	},
	popover_hover_update: function(type, img) {
		var popover = $('[data-toggle="' + type + '-popover-hover"]').data('bs.popover');
		if (popover) {
			popover.config.content = '<img src="' + img + '" />';
		}
    },
    paging_thumbnail: function(total_count, cur_page) {
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
		prev = prev == 0? first: prev;
		next = next > total_page? last: next;

		return {prev: prev, next: next};
    },
    content_thumbnail: function(page) {
        if(!page) {
            page = this.paging_thumbnail(this._playlist_data.playlist.length, this._current_index + 1);
        }
		prev_obj = this._playlist_data.playlist[page.prev - 1];
        next_obj = this._playlist_data.playlist[page.next - 1];
        if (prev_obj.thumbnail) {
            this.prev_thumbnail(prev_obj.thumbnail);
            this.popover_hover('prev-content');
            this.popover_hover('prev-content2', 'right');
        } else {
            if('#' == prev_obj.url) {
                page.prev--;
                this.content_thumbnail(page);
                return;
            }

            $('#prev-content').popover('dispose');
            $('.icon-prev-content').popover('dispose');
        }
        if (next_obj.thumbnail) {
            this.next_thumbnail(next_obj.thumbnail);
            this.popover_hover('next-content');
            this.popover_hover('next-content2', 'left');
        } else {
            if('#' == next_obj.url) {
                page.next++;
               this.content_thumbnail(page);
               return;
           }

            $('#next-content').popover('dispose');
            $('.icon-next-content').popover('dispose');
        }
    },
    prev_thumbnail: function(img) {
		var $prev_content = $('#prev-content');
		$prev_content.attr("data-toggle", "prev-content-popover-hover");
		$prev_content.attr("data-img", img);
        
        var $prev_content2 = $('.icon-prev-content');
        $prev_content2.attr("data-toggle", "prev-content2-popover-hover");
        $prev_content2.attr("data-img", img);

        this.popover_hover_update('prev-content', img);
        this.popover_hover_update('prev-content2', img);
	},
	next_thumbnail: function(img) {
		var $next_content = $('#next-content');
		$next_content.attr("data-toggle", "next-content-popover-hover");
		$next_content.attr("data-img", img);
        
        var $next_content2 = $('.icon-next-content');
        $next_content2.attr("data-toggle", "next-content2-popover-hover");
        $next_content2.attr("data-img", img);

        this.popover_hover_update('next-content', img);
        this.popover_hover_update('next-content2', img);
	}
};
