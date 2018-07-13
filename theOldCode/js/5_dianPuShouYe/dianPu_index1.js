//上拉刷新下拉加载
refresher.init({
    id: "wrapper",
    pullDownAction: Refresh,
    pullUpAction: Load
});

var generatedCount = 0;
function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        location.reload();//刷新本页面
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    },1500);
}

function Load() {
    setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
        var a1='<li class="suolue_goods"><a href="http://www.baidu.com" style="display: inline-block"> <img class="suoluegoods_img" src="../../img/suolue_goods.png" alt=""/> <p class="suoluegoods_name">纸艺家印象蛋张很好的纸张啊快买吧</p> </a> <p class="suoluegoods_price">￥100000.00</p> </li>';
        for (var i = 0; i < 10; i++) {
            $(".suolue_result").append(a1);
        }
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 1000);
}
//上拉刷新下拉加载

$(".search_box").focus(function () {
    $(".chahao").css({"opacity": 1})
});
$(".search_box").blur(function () {
    $(".chahao").css({"opacity": 0})
});
$(".chahao").click(function () {
    $(this).parents().siblings(".search_box").val(" ");
});
/*$("body").on("touchmove", function () {
    var translates = $("#scroller").css("transform");
    var tansY = parseFloat(translates.substring(7).split(',')[5]);
    //console.log(wTop.replace(/[^0-9\-,]/g,'').split(','));
    if (tansY <= -110) {
        $(".top_wrapper").css('background', 'rgba(255,255,255,1)');
        $(".fixed_btn").css("display", "block");
    }
    else {
        $(".top_wrapper").css('background', 'rgba(255,255,255,0.6)');
        $(".fixed_btn").css("display", "none");

    }
});*/
/*头部选项卡*/
function beginImg() {
    var btnImg = $(".btn_img");
    btnImg.eq(0).find('img').attr("src", "../../img/all_goods.png");
    btnImg.eq(1).find('img').attr("src", "../../img/fenlei.png");
    btnImg.eq(2).find('img').attr("src", "../../img/shangjia.png");
    btnImg.eq(3).find('img').attr("src", "../../img/youhuiquan_btn.png");
}
$(".btn_img,.btn_word p").click(function () {
    $(".footer_wrapper").eq(1).children("img").attr("src", "../../img/shouye.png").siblings("span").css("color", "#666666");
    var Index = $(this).index();
    $(".btn_word p").eq(Index).css({
        "border-bottom": "1px solid #e60012",
        "color": "#e60012"
    }).siblings().css({"border-bottom": "1px solid #ffffff", "color": "#666666"});
    $(".btn_word p").eq(Index + 4).css({
        "border-bottom": "1px solid #e60012",
        "color": "#e60012"
    }).siblings().css({"border-bottom": "1px solid #ffffff", "color": "#666666"});
    beginImg();
    if (Index == 0) {
        $(".btn_img").eq(0).find('img').attr("src", "../../img/all_goods_red.png");
    } else if (Index == 1) {
        $(".btn_img").eq(1).find('img').attr("src", "../../img/fenlei_red.png");
        window.location.href = '../../html/5_dianPuShouYe/baoBeiFenLei.html'
    } else if (Index == 2) {
        $(".btn_img").eq(2).find('img').attr("src", "../../img/shangjia_red.png");
        window.location.href = '../../html/5_dianPuShouYe/shangJiaXinXi.html'
    } else if (Index == 3) {
        $(".btn_img").eq(3).find('img').attr("src", "../../img/youhuiquan_redBtn.png");
        window.location.href = '../../html/5_dianPuShouYe/youHuiQuan.html'
    }
    if (Index == 0) {
        $(".sort_btn").css("display", "block");
    } else {
        $(".sort_btn").css("display", "none");
    }
});
$(".shoucang").click(function () {
    if (this.src.indexOf("star_red.png") == -1) {
        $(this).attr("src", "../../img/star_red.png");
        popUp_auto(1500, "您已收藏该店铺");
    } else {
        $(this).attr("src", "../../img/shoucang.png");
        popUp_auto(1500, "取消收藏该店铺");
    }
});
/*function beginSelectImg() {
 $(".sort").children("img").attr("src","../../img/up_down.png");
 }*/
function sort(target) {
    $(target).click(function () {
        if ($(this).children("img").attr("src").indexOf("up_down.png") != -1) {
            $(target).css("color", "#e60012").children("img").attr("src", "../../img/down_red.png");
        } else if ($(this).children("img").attr("src").indexOf("down_red.png") != -1) {
            $(target).css("color", "#e60012").children("img").attr("src", "../../img/up_red.png");
        } else if ($(this).children("img").attr("src").indexOf("up_red.png") != -1) {
            $(target).css("color", "#c2c2c2").children("img").attr("src", "../../img/up_down.png");
        }
    });
}
sort(".sort_count");
sort(".sort_price");
sort(".sort_new");


/*点击底部店铺首页*/
$(".footer_wrapper").eq(1).click(function () {
    $(this).children("img").attr('src', "../../img/shouye_red.png").siblings("span").css("color", "#e60012");
    $(".btn_word p").css({"border-bottom": "1px solid #ffffff", "color": "#666666"});
    $(".sort").css("color", "#c2c2c2");
    $(".sort_btn").css("display", "none");
    beginImg();
    //beginSelectImg();
});

























































