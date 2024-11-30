// var SOCKET_URL = "/";
var SOCKET_URL = "https://ele.m-teacher.co.kr/";
var SOCKET_PATH = '/mirroring/socket.io';

var FORCE_SOCKET_HOSTS = [
    'ele.m-teacher.co.kr:8001',
]
// if (FORCE_SOCKET_HOSTS.includes(window.location.host)) {
//     SOCKET_URL = "https://ele.m-teacher.co.kr/";
// }
// // !!
// if(window.location.host == 'localhost') {
//     SOCKET_URL = "https://ele.m-teacher.co.kr/";
// }
console.log("SOCKET:", SOCKET_URL, SOCKET_PATH);


var USE_COOKIE = false;
var MIRRORING_UID_KEY = "mirroring_uid";
var SUCCESS_CODE = 200;

var USE_REMOTE_TRIGGER = true; // 아래 두개 모두 적용
//var REMOTE_TRIGGER_EVENTS = "click"; // 이벤트 트리거 사용
var REMOTE_TRIGGER_EVENTS = undefined;
var USE_REMOTE_MESSAGE = true;  // 스케치북스에서 정의한 message 사용

var IS_REMOTE_TRIGGER = false;  // 현재 받은 이벤트가 받은건지 여부


var mirroring = {

    mirroring_uid: undefined,
    rooms: [],
    socket: undefined,
    os: navigator.platform,
    roomid: null,
    userid: null,
    sessionid: null,
    is_from_mirroring_window: false,

    is_mirroring_window: function () {
        try {
            if (IS_MIRRORING_WINDOW) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },

    init: function () {
         console.log("mirroring.init");
        var self = this;
        return new Promise(function (resolve, reject) {
//            self.init_socket();
            /*
             try {
                 var iever = get_version_of_IE();
                 if(iever != -1 && iever < 10) {
                     reject(new Error('지원하지 않는 브라우저입니다.(IE'+iever+')\nIE 10 이상을 사용해주세요.'));
                 } else {
                     self.init_socket();
                 }
             } catch (error) {
                 reject(new Error('지원하지 않는 브라우저입니다.\n'+error));
             }
             */
            resolve();
        });
    },

    init_socket: function () {
        if (this.is_mirroring_window()) return;
        // console.log("mirroring.init_socket");
        var self = this;
        this.socket = io(SOCKET_URL, {
            transports: ['websocket']
            , path: SOCKET_PATH
        });

        if (USE_COOKIE) {
            this.mirroring_uid = getCookie(MIRRORING_UID_KEY);
        }

        // default events
        this.socket.on('disconnect', function (reason) {
            console.log('mirroring.on.disconnect', reason);
            if (reason == 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                // socket.connect();
            }
            // else the socket will automatically try to reconnect
        });

        this.socket.on("api-disconnect", function (res) {
            console.log("on.api-disconnect", res);
            var err_msg = res.msg + "\n확인 버튼을 누르면 창이 닫힙니다.";
            show_alert(err_msg, function () {
                window.close();
            });
        });

        this.socket.on('reconnect', function (attemptNumber) {
            console.log('mirroring.on.reconnect', attemptNumber);

            // userid = $("#useridForm").val().trim();
            // //sessionid = null;
            // if(userid.length <= 0) {
            //     return;
            // }

            if (!self.userid) {
                return;
            }
            if (!self.mirroring_uid) {
                return;
            }
            self.socket.emit("api-connect", {
                userid: self.userid,
                os: self.os,
                uid: self.mirroring_uid,
                roomid: self.roomid,
            });
            self.socket.on('api-connect', function (res) {
                console.log('mirroring.api-connect res', res)
                if (res.code == SUCCESS_CODE) {
                    self.mirroring_uid = res.data.uid;
                }
            });
        });

        // api events
        // this.socket.on("api-connect", function(res) {
        //     console.log("on.api-connect", res);

        //     // var code = res.code;
        //     // var message = res.message;
        //     // userid = res.data.userid;
        //     // mirroring_uid = res.data.uid;
        //     // roomid = res.data.roomid;
        //     // if(code == 200) {
        //     //     $("#uidForm").val(mirroring_uid);
        //     //     if(USE_COOKIE) {
        //     //         setCookie(MIRRORING_UID_KEY, mirroring_uid, 365);
        //     //     }
        //     // }

        //     // for(var i = 0; i < res.data.connected.length; i++) {
        //     //     var client = res.data.connected[i];
        //     //     //다른놈 끊을때.
        //     //     //socket.emit("api-disconnect", {uid:client.uid});
        //     // }

        // });

        // this.socket.on("api-disconnect", function(res) {
        //     console.log("on.api-disconnect", res);
        // });

        // this.socket.on("api-connected-list", function(res) {
        //     console.log("on.api-connected-list", res);
        // });

        // this.socket.on("api-room-list", function(res) {
        //     console.log("on.api-room-list", res);
        // });
        // this.socket.on("api-create-room", function(res) {
        //     console.log("on.api-create-room", res);
        //     // roomid = res.data.roomid;
        //     // $("#roomidForm").val(roomid);
        // });
        // this.socket.on("api-join-room", function(res) {
        //     console.log("on.api-join-room", res);
        // });
        // this.socket.on("api-reconnect-join-room-user", function(res) {
        //     console.log("on.api-reconnect-join-room-user", res);
        // });
        // this.socket.on("api-leave-room", function(res) {
        //     console.log("on.api-leave-room", res);
        // });
        // this.socket.on("api-sync-init", function(res) {
        //     console.log("on.api-sync-init", res);
        //     //eval(res);
        // });

        this.socket.on("api-sync", function (res) {
            console.log("mirroring.on.api-sync", res);
            if (res && res.code == 200) {
                var sync_data = JSON.parse(res.data);
                self.on_api_sync(sync_data);

                try {
                    if (MIRRORING_WINDOW && !MIRRORING_WINDOW.closed && MIRRORING_WINDOW.viewer.is_mirroring_started) {
                        MIRRORING_WINDOW.mirroring.on_api_sync(sync_data);
                    }
                } catch (error) {

                }
            }
            //eval(res);
        });


        window.addEventListener('message', function (e) {
            if (!e.data) {
                return;
            }

            try {
                if (e.origin && e.origin.startsWith("https://www.youtube.com")) {
                    return;
                }
            } catch (error) {
            }

            try {
                var obj = JSON.parse(e.data);
                // console.log(obj);
                self.is_from_mirroring_window = true;
                self.on_api_sync(obj);
                self.api_sync_obj(obj);
                // console.log(self.is_from_mirroring_window);
            } catch (error) {

            }

        });
    },

    on_api_sync: function (sync_data) {
        if (sync_data) {
            // if(sync_data.target == "app") {
            if (sync_data.script) {
                // console.log(sync_data.script);
                eval(sync_data.script);

            } else if (sync_data.target == "iframe") {

                if (USE_REMOTE_TRIGGER) {
                    var $target_iframe = $(sync_data.target_selector);
                    var event = sync_data.event;
                    // console.log($target_iframe);
                    // console.log(event);

                    if (event == "script") {
                        // console.log(sync_data.message);
                        $target_iframe.get(0).contentWindow.eval(sync_data.message);
                    } else
                        if (event == "message") {
                            // console.log(sync_data.message);
                            var dataJson = JSON.stringify(sync_data.message, null, "\t");
                            IS_REMOTE_TRIGGER = true;
                            $target_iframe.get(0).contentWindow.mirroring_target = 1;
                            $target_iframe.get(0).contentWindow.postMessage(dataJson, "*");
                        } else {
                            var event_target_selector = sync_data.event_target_selector;

                            // console.log(event_target_selector);
                            IS_REMOTE_TRIGGER = true;
                            $target_iframe.contents().find(event_target_selector).first().trigger(event);
                        }

                }

            }

            // }
        }
    },
    api_conntect: function (userid, uid, roomid) {
        if (this.is_mirroring_window()) return;
        console.log("mirroring.api_connect ", userid, uid, roomid);
        var self = this;
        if (!userid) {
            return;
        }
        if (!uid) {
            uid = this.mirroring_uid;
        }
        this.userid = userid;
        this.roomid = roomid;

        return new Promise(function (resolve, reject) {
            self.socket.emit("api-connect", {
                userid: userid,
                os: self.os,
                uid: uid,
                roomid: roomid,
            });
            self.socket.on('api-connect', function (res) {
                console.log('mirroring.api-connect res', res)
                if (res.code !== SUCCESS_CODE) {
                    reject(res);
                }
                self.mirroring_uid = res.data.uid;
                resolve(res);

            });
        })
    },

    api_disconnect: function () {
        if (this.is_mirroring_window()) return;
        console.log('mirroring.api_disconnect')
        var self = this;
        this.roomid = null;

        return new Promise(function (resolve, reject) {
            self.socket.emit('api-disconnect');
            self.socket.on('api-disconnect', function (res) {
                // 네트워크 등에 의한 문제 (ping) 에 의한 disconnect 는 다시 접속한다.
                // api-reconnect-join-room-user
                console.log('res.code', res.code)
                if (res.code !== SUCCESS_CODE) {
                    reject(res);
                }
                resolve(res);
            });
        });
    },

    api_create_room: function () {
        if (this.is_mirroring_window()) return;
        console.log("mirroring.api_create_room");
        var self = this;
        return new Promise(function (resolve, reject) {
            self.socket.emit('api-create-room', { lesson: null });
            self.socket.on('api-create-room', function (res) {
                if (res.code !== SUCCESS_CODE) {
                    reject(res.message)
                }
                self.roomid = res.data.roomid;
                resolve(res)
            })
        })
    },

    api_room_list: function () {
        if (this.is_mirroring_window()) return;
        console.log("mirroring.api_room_list");
        var self = this;
        return new Promise(function (resolve, reject) {
            self.socket.emit('api-room-list');
            self.socket.on('api-room-list', function (res) {
                if (res.code !== SUCCESS_CODE) {
                    reject(res.message)
                }
                resolve(res)
            });
        });
    },

    api_join_room: function (param) {
        if (this.is_mirroring_window()) return;
        console.log("mirroring.api_join_room");
        var self = this;
        return new Promise(function (resolve, reject) {
            self.socket.emit('api-join-room', param);
            self.socket.on('api-join-room', function (res) {

                if (res.code !== SUCCESS_CODE) {
                    reject(res.message)
                }

                self.roomid = param.roomid;

                resolve(res)
            })
        })
    },

    api_sync_obj: function (obj) {

        if (this.is_mirroring_window()) {
            // console.log("mirroring.api_sync", obj);
            var dataJson = JSON.stringify(obj, null, "\t");
            parent.opener.postMessage(dataJson, "*");
            return;
        }

        if (this.is_from_mirroring_window == false) {
            try {
                if (MIRRORING_WINDOW && !MIRRORING_WINDOW.closed && MIRRORING_WINDOW.viewer.is_mirroring_started) {
                    MIRRORING_WINDOW.IS_REMOTE_TRIGGER = true;
                    console.log(obj);
                    MIRRORING_WINDOW.mirroring.on_api_sync(obj);
                    MIRRORING_WINDOW.IS_REMOTE_TRIGGER = false;
                }
            } catch (error) {
                console.error(error);
            }
        }
        this.is_from_mirroring_window = false;

        console.log("mirroring.api_sync", obj);

        this.socket.emit('api-sync', { data: JSON.stringify(obj), includeme: false });
    },

    api_set_lesson: function (obj) {
        if (this.is_mirroring_window()) return;
        console.log("mirroring.api-set-lesson", obj);
        this.socket.emit('api-set-lesson', { lesson: obj });
        // this.socket.emit('api-set-lesson',{lesson:JSON.stringify(obj)});
    }

};
