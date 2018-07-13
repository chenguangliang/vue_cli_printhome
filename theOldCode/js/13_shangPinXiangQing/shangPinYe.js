//头部焦点图
//设置轮播图




function ShufflingFigure(){
    TouchSlide({
        slideCell: "#slideBox",
        titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
        mainCell: ".bd ul",
        effect: "leftLoop",
        autoPage: true,//自动分页
        autoPlay: true //自动播放
    });
}
//截取字符串
intercept(".goods_con", 28);
function getValue(id) {
    var sel = document.getElementById(id);
    if (sel && sel.options) {
        printAlert(sel.options[sel.selectedIndex].value);
    }
}

function getText(id) {
    var sel = document.getElementById(id);
    if (sel && sel.options) {
        printAlert(sel.options[sel.selectedIndex].text);
    }
}

/*让百度编辑器里的图片、地图自适应*/
function limitAllImg() {
    var limitImg = $(".jieshao-wrap,.pingce-wrap");
    limitImg.find("img,input,table,form,strong,i,iframe").css({"display": "block", "max-width": "100%"});
    limitImg.find("img").each(function (index, item) {
        if (parseInt($(item).attr("height"))) {
            $(item).css({"height": "100%", "margin": "0 auto"});
        }
    });
    limitImg.find("td").removeAttr("width").css({"font-size": "0.12rem"});
    /*设置outer的高度，为了弹出框以后，禁止下边的滑动*/
    $(".outer").css("height", $(window).height() / 80 + "rem");
    $("embed").css('width',"100%")
}


//动态固定头部导航开始*/
$(window).scroll(function () {
    if ($(window).scrollTop() > 50) {
        $(".top").css({"display": "block"});
    } else {
        $(".top").css({"display": "none"});
    }
});
/*动态固定商品介绍导航开始*/
$(window).scroll(function () {
    var trikerH = $(".triker").height();
    var deff = trikerH - $(".header").height();
    if ($(window).scrollTop()  > deff) {
        $(".nav_wrap").css({
            position: "fixed",
            top: "0rem",
            zIndex: "5"
        }).siblings().css({"margin-top": "0.8rem"});

    } else {
        $(".nav_wrap").css({position: "", top: "", paddingTop: ""}).siblings().css({marginTop: ""});
    }
});

/**
*@fileName:shangPinYe.js
*@author:fdc
*@time:2017/3/9 0009
*@disc:详情页的点击事件
*/
function  productClick(){


    /*详情,清单,评论，评测选项卡开始*/
    $(".nav").click(function (e) {
        $(this).css({color: "#e32529"}).siblings().css({color: "#666666"});
        var _index = $(this).index();
        $(this).parent().parent().nextAll("div").each(function (index, item) {
            if (index === _index) {
                $(item).css({display: "block"});

            } else {
                $(item).css({display: "none"});
            }
        });
    });




    /*动态给清单和详情设置高度*/
    $(".qingdan-wrap,.pinglun-wrap,.jieshao-wrap,.pingce-wrap").css("min-height", $(window).height() / 100 + 1.6 + "rem");


    /*初始化右下角的加入购物车*/

    /*0.点击欢迎询价红色按钮*/
    $(".xunJia").click(function () {
        //$(".win_prop").css("display", "block");
    });

    /*一.点击商品属性和加入购物车*/
    $(".goods_prop").click(function (e) {
            $(".win_prop").css("display", "block");
    });
    /*二.关闭商品属性弹窗*/
    $(".prop_chahao,.prop_bg,.xunJia_cha,.xunJia_quxiao").click(function () {
        $(".win_prop").css("display", "none");
        $(".win_prop_xunJia").css("display", "none");
        $(".xunJia_dio_wrap").css("display", "none");
        $(".outer").css("overflow", "");
    });
    /*三.点击促销活动*/
    var bodyScroll=0;
    $(".promotion_wrap").click(function () {
        if ($(".goods_price").css("display") == "block") {
            $(".win_Promotion").css("display", "block");
            //$(".outer").css("overflow", "hidden");
            bodyScroll=$("body").scrollTop();
            clockedBody();

        } else if ($(".noSale").css("display") == "block") {
            return false;
        } else if ($(".xunJia").css("display") == "block") {
            $(".win_Promotion").css("display", "block");
            //$(".outer").css("overflow", "hidden");
            bodyScroll=$("body").scrollTop();
            clockedBody();
        }
    });
    /*四.关闭促销活动弹窗*/
    $(".pro_chahao,.prop_bg,.win_wancheng").click(function () {
        $(".win_Promotion").css("display", "none");
        unClockedBody();
        $("body").scrollTop(bodyScroll);
        //$(".outer").css("overflow", "");
    });
    /* 广告语*/
    $(".ad_prop").click(function(){
    	$(".win_ad").css("display", "block");
        bodyScroll=$("body").scrollTop();
        clockedBody();
    });
    $(".pro_chahaoWrap,.prop_bg,.win_xunJia").click(function () {
        $(".win_ad").css("display", "none");
        unClockedBody();
        $("body").scrollTop(bodyScroll);
    });


    /*五.欢迎询价点击*/
    /*$(".xunJia").click(function () {
        $(".win_prop_xunJia").css("display", "block");
        $(".outer").css("overflow", "hidden");
    });*/

    /*六.欢迎询价对话框*/
    //$(".win_xunJia").click(function () {
    //    $(".win_prop_xunJia").css("display", "none");
    //    $(".xunJia_dio_wrap").css("display", "block");
    //
    //});
    /*七.询价弹窗点提交*/
    //$(".xunJia_queding").click(function () {
    //    var xunJia_input = $(".con_wrap input");
    //    var count = 0;
    //    for (var i = 0; i < xunJia_input.length; i++) {
    //        if (xunJia_input[i].value) {
    //            count++
    //        }
    //    }
    //    if(count==xunJia_input.length){
    //        $(".xunJia_dio_wrap").css("display", "none");
    //        $(".outer").css("overflow", "");
    //    }else{
    //        popUp_auto_false(1500,"请完善询价信息");
    //    }
    //});
    //sku轮播图
    /*$(".prop_img").click(function(){
        $(".sku-popup").css({"opacity": "1","z-index":"999"});
    });
    $(".sku-popup").click(function(){
        $(".sku-popup").css({"opacity": "0","z-index":"-10"});
    });*/
   /* $(".prop_img").click(function(){
        $(".sku-popup").css({"display": "inline-block","z-index":"999"});
    });
    $(".sku-popup").click(function(){
        $(".sku-popup").css({"display": "none","z-index":"0"});
    })*/
    //买家评论
    //$(".pinglun_img").click(function() {
    //    $(".pinglun_img_tanChuang").css("display", "block");
    //});
    $(".pinglun_img_tanChuang").click(function () {
        $(this).css("display", "none")
    });
}










































