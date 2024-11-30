$(function(){
    const aside = {
        c: {
            //기초학력 LNB
            getBasicGnbList: function(categoryCode){
                let pathName = document.location.pathname;

                //상세여부
                let lastParam = pathName.substring(pathName.indexOf('.mrn') + 5);

                if(lastParam.indexOf("/") > -1){ // 상세
                    pathName= pathName.substring(0, pathName.lastIndexOf('/'));
                }

                $cmm.ajax({
                    url: '/pages/api/totalboard/common/getTotalboardGnbList.ax',
                    method: 'GET',
                    data: {
                        pathname: pathName,
                        categoryType: categoryCode
                    },
                    success: function (res){
                        let list = res.rows || [];

                        for(let i=0; i<list.length; i++){
                            let item = list[i];

                            if(item.level == 2){
                                let element = $("#sample_lv01").clone();
                                let lv1_tmp = $("#sampleGnb_04 #sample_lv01").clone();

                                lv1_tmp.find(".title").html(item.name)
                                lv1_tmp.find("a").attr("href", item.pageUrl);
                                lv1_tmp.find("a").prop("target", item.target);

                                if(location.pathname.indexOf(item.pageUrl) > -1){
                                    lv1_tmp.addClass("active");
                                }

                                $("#cmmBasicBoardGnbList").append(lv1_tmp);
                            }
                        }
                    }
                });
            },

            //특화자료실
            getSpecialGnbList: function(categoryCode){
                let mainId      = $("input[name=mainId]").val()     || '';
                let categorySeq = $("input[name=lnbCateSeq]").val() || '';
                let param = {categoryType: categoryCode};
                let key3        = mainId;
                let pathname = document.location.pathname;

                if(Number(categorySeq) + '' == 'NaN'){
                    categorySeq = '';
                }

                if(mainId == null || mainId == ""){
                    if(categorySeq == ''){
                        key3 = pathname;
                        param['pathname'] = pathname;
                    }else{
                        key3 = categorySeq;
                        param['categorySeq'] = categorySeq;
                    }
                }else{
                    categorySeq = '';
                    param['mainId'] = mainId;
                }

                $cmm.ajax({
                    url: '/pages/api/totalboard/common/getTotalboardGnbList.ax',
                    method: 'GET',
                    data: param,
                    success: function (res){
                        let list = res.rows || [];

                        for(let i = 0; i < list.length; i++){
                            let item = list[i];

                            if(item.level == 2){
                                let lv1_tmp = $("#sampleGnb_04 #sample_lv01").clone();

                                lv1_tmp.find(".title").html(item.name);
                                lv1_tmp.find("a").attr("href", item.pageUrl);
                                lv1_tmp.find("a").prop("target", item.target);
                                lv1_tmp.attr("id", item.seq);

                                $("#cmmSpecialBoardGnbList").append(lv1_tmp);
                            }else if(item.level == 3){
                                let lv2_tmp = $("#sampleGnb_04 #sample_lv02").clone();

                                lv2_tmp.attr("href"  , item.pageUrl);
                                lv2_tmp.prop("target", item.target);
                                lv2_tmp.find("span").html(item.name);
                                lv2_tmp.attr("id"   , item.seq);

                                $("#cmmSpecialBoardGnbList #" + item.parentSeq + " button").css("display", "block");
                                $("#cmmSpecialBoardGnbList #" + item.parentSeq + " .level2List" ).append(lv2_tmp);
                            }

                            if(item.key3 == key3 || item.pageUrl == key3){
                                $("#"+item.parentSeq ).addClass("active");
                                $("#"+item.seq).addClass("active");

                                if($("#"  + item.parentSeq + " .pane .level2List").children().length > 0){
                                    $("#" + item.parentSeq + ' .pane').show();
                                }
                            }
                        }

                        let li_list = $("#cmmSpecialBoardGnbList").children("li");

                        li_list.map(function(idx){  //하위 메뉴 없는 경우 하위 영역 삭제
                            let element = li_list[idx];

                            if($(element).find('.pane .level2List').children().length < 1){
                                $(element).find('.pane').remove();
                            }
                        });
                    }
                });
            },

            //중고등 GNB
            getGnbList: function (categoryCode){  //현재 1depth 만 작업됨
                let param = { categoryType: categoryCode};
                let mainId = $("input[name=mainId]").val();
                let categorySeq =  $("input[name=lnbCateSeq]").val() || '';
                let key3 = mainId;
                let pathname = document.location.pathname;

                if(Number(categorySeq) + '' == 'NaN'){
                    categorySeq = '';
                }

                if(mainId == null || mainId == ""){
                    if(categorySeq == ''){
                        key3 = pathname;
                        param['pathname'] = pathname;
                    }else{
                        key3 = categorySeq;
                        param['categorySeq'] = categorySeq;
                    }
                }else{
                    categorySeq = '';
                    param['mainId'] = mainId;
                }

                $cmm.ajax({
                    url: '/pages/api/totalboard/common/getTotalboardGnbList.ax',
                    method: 'GET',
                    data: param,
                    success: function (res){
                        let list = res.rows || [];

                        for(let i = 0; i < list.length; i++){
                            let item = list[i];

                            if(item.level == 2){
                                let lv1_tmp = $("#sampleGnb_04 #sample_lv01").clone();

                                lv1_tmp.find(".title").html(item.name);
                                lv1_tmp.find("a").attr("href", item.pageUrl);
                                lv1_tmp.find("a").prop("target", item.target);
                                lv1_tmp.attr("id", item.seq);

                                $("#cmmBoardGnbList").append(lv1_tmp);
                            }else if(item.level == 3){
                                let lv2_tmp = $("#sampleGnb_04 #sample_lv02").clone();

                                lv2_tmp.attr("href", item.pageUrl);
                                lv2_tmp.prop("target", item.target);
                                lv2_tmp.find("span").html(item.name);
                                lv2_tmp.attr("id", item.seq);

                                $("#cmmBoardGnbList #" + item.parentSeq + " button").css("display", "block");
                                $("#cmmBoardGnbList #" + item.parentSeq + " .level2List" ).append(lv2_tmp);
                            }
                            if(item.key3 == key3 || item.pageUrl == key3){
                                $("#"+item.parentSeq ).addClass("active");
                                $("#"+item.seq).addClass("active");

                                if($("#" + item.parentSeq + " .pane .level2List").children().length > 0){
                                    $("#"+item.parentSeq+' .pane').show();
                                }
                            }
                        }

                        let li_list = $("#cmmBoardGnbList").children("li");

                        li_list.map(function(idx){ // 하위 메뉴 없는 경우 하위 영역 삭제
                            let element = li_list[idx];

                            if($(element).find('.pane .level2List').children().length < 1){
                                $(element).find('.pane').remove();
                                $(element).addClass("single_menu");
                            }
                        });

                        // for(let i=0; i<list.length; i++){
                        //     let item = list[i];
                        //     let element = $("#sampleGnb").clone();
                        //     element.find("a").html(item.name).attr('href', item.pageUrl).attr('target', item.target);
                        //     if(item.key3 == mainId){
                        //         element.addClass('active');
                        //     }
                        //     element.attr("id", item.seq);
                        //     $("#cmmBoardGnbList").append(element);
                        // }
                    }
                });
            },

            //학교자율시간
            getSchflextmGnbList: function(categoryCode){
                let mainId      = $("input[name=mainId]").val()     || '';
                let categorySeq = $("input[name=lnbCateSeq]").val() || '';
                let key3        = mainId;
                let param = {categoryType: categoryCode};
                let pathname = document.location.pathname;

                if(Number(categorySeq) + '' == 'NaN'){
                    categorySeq = '';
                }

                if(mainId == null || mainId == ""){
                    if(categorySeq == ''){
                        key3 = pathname;
                        param['pathname'] = pathname;
                    }else{
                        key3 = categorySeq;
                        param['categorySeq'] = categorySeq;
                    }
                }else{
                    categorySeq = '';
                    param['mainId'] = mainId;
                }

                $cmm.ajax({
                    url: '/pages/api/totalboard/common/getTotalboardGnbList.ax',
                    method: 'GET',
                    data: param,
                    success: function (res){
                        let list = res.rows || [];

                        for(let i=0; i<list.length; i++){
                            let item = list[i];

                            if(item.level == 2){
                                let lv1_tmp = $("#sampleGnb_04 #sample_lv01").clone();

                                lv1_tmp.find(".title").html(item.name);
                                lv1_tmp.find("a").attr("href"  , item.pageUrl);
                                lv1_tmp.find("a").prop("target", item.target);
                                lv1_tmp.attr("id", item.seq);

                                $("#cmmSchflextmBoardGnbList").append(lv1_tmp);
                            }else if(item.level == 3){
                                let lv2_tmp = $("#sampleGnb_04 #sample_lv02").clone();

                                lv2_tmp.attr("href"  , item.pageUrl);
                                lv2_tmp.prop("target", item.target);
                                lv2_tmp.find("span").html(item.name);
                                lv2_tmp.attr("id"    , item.seq);

                                $("#cmmSchflextmBoardGnbList #" + item.parentSeq + " button").css("display", "block");
                                $("#cmmSchflextmBoardGnbList #" + item.parentSeq + " .level2List").append(lv2_tmp);
                            }

                            if(item.key3 == key3 || item.pageUrl == key3){
                                $("#"+item.parentSeq ).addClass("active");
                                $("#"+item.seq).addClass("active");

                                if($("#"  + item.parentSeq + " .pane .level2List").children().length > 0){
                                    $("#" + item.parentSeq + ' .pane').show();
                                }
                            }
                        }

                        let li_list = $("#cmmSchflextmBoardGnbList").children("li");

                        li_list.map(function(idx){  //하위 메뉴 없는 경우 하위 영역 삭제
                            let element = li_list[idx];

                            if($(element).find('.pane .level2List').children().length < 1){
                                $(element).find('.pane').remove();
                            }
                        });
                    }
                });
            },
        },

        init: function(){
            console.log("totalBordGnb init!");

            let categoryCode = $("input[name=gnbCateType]").val() || '';

            //특화자료실
            if(categoryCode != '' && document.getElementById('cmmSpecialBoardGnbList') != null){
                aside.c.getSpecialGnbList(categoryCode);  //초등 특화 자료실 쪽만 자동 불러오기 작업 됨
            }

            //기초학력
            if(categoryCode != '' && document.getElementById('cmmBasicBoardGnbList') != null){
                aside.c.getBasicGnbList(categoryCode);  //초등 기초학력 쪽만 자동 불러오기 작업 됨
            }

            //중고등
            if(categoryCode != '' && document.getElementById('cmmBoardGnbList') != null){
                aside.c.getGnbList(categoryCode);
            }

            //학교자율시간
            if(categoryCode != '' && document.getElementById('cmmSchflextmBoardGnbList') != null){
                aside.c.getSchflextmGnbList(categoryCode);
            }
        }
    }

    aside.init();
});