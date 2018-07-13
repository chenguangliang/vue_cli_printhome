//上拉刷新下拉加载
refresher.init({
    id: "wrapper",
    pullDownAction: Refresh,
    pullUpAction: Load
});

var generatedCount = 0;
function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 2000);
}

function Load() {
    if($(".toggle_img")[0].src.indexOf("suoluetu-@3x.png") == "-1"){
        console.log(2);
        setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
            var a1 = '<li class="list_goods"> <a href="http://www.baidu.com" style="display: inline-block"> <img class="listgoods_img" src="../../img/list_goods.png" alt=""/></a> <div class="title_wrapper"> <a href="http://www.baidu.com" class="listgoods_name">硬刷价印刷家硬刷价印刷家硬刷价印刷家</a> <p class="listgoods_price red_word">￥1500.00 <img style="width: 0.3rem;float: right;margin-top: 0.15rem;" src="../../img/point.png"alt=""/> </p> </div> <div class="listfloot_ship"> <div class="listship_wrapper"> <p class="listshop_name">硬刷价印刷家硬刷价印刷家硬刷价印刷家</p> <p class="list_detile">描述：<span class="red_word mr20">5.0</span>服务：<span class="red_word">5.0</span> </p> <p class="list_detile">物流：<span class="red_word mr20">5.0</span>态度：<span class="red_word">5.0</span> </p> <p style="margin-top: 0.1rem;"> <span class="list_shoucang mr20">收藏商品</span> <span class="list_shoucang">收藏店铺</span> </p> </div> <span class="add_wrapper" style="background-color: #f39700;"> <p class="listcontact">收藏<br/>商品</p> <p class="listgoods_car">收藏<br/>店铺</p> </span> </div> </li>';
            for (var i = 0; i < 2; i++) {
                $(".list_result").append(a1);
            }
            myScroll.refresh();
            /****remember to refresh when you action was completed！！！****/
        }, 1000);
    }else if($(".toggle_img")[0].src.indexOf("liebiao@3x.png") == "-1"){
        console.log(1);
        setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
            var a1 = '<li class="suolue_goods"><a href="http://www.baidu.com" style="display: inline-block"> <img class="suoluegoods_img" src="../../img/suolue_goods.png" alt=""/> <p class="suoluegoods_name">纸艺家印象蛋张很好的纸张啊快买吧</p> </a> <p class="suoluegoods_price">￥100000.00</p> </li>';
            for (var i = 0; i < 2; i++) {
                $(".suolue_result").append(a1);
            }
            myScroll.refresh();
            /****remember to refresh when you action was completed！！！****/
        }, 1000);
    }
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

/*缩略和列表切换*/
$(".toggle_img").click(function () {
    if (this.src.indexOf("suoluetu-@3x.png") == "-1") {
        /* location.reload();*/
        //$("#scroller").css("transform", "translate(0px, 0px) scale(1) translateZ(0px)");
        this.src = "../../img/suoluetu-@3x.png";
        $(".suolue_goods").removeClass("none");
        $(".suolue_goods").addClass("inline_block");
        $(".list_goods").removeClass("inline_block");
        $(".list_goods").addClass("none");
        myScroll.refresh();
    } else {
        //$("#scroller").css("transform", "translate(0px, 0px) scale(1) translateZ(0px)");
        this.src = "../../img/liebiao@3x.png";
        $(".list_goods").removeClass("none");
        $(".list_goods").addClass("inline_block");
        $(".suolue_goods").removeClass("inline_block");
        $(".suolue_goods").addClass("none");
        myScroll.refresh();
    }
});

/*/!*缩略左划*!/
 $(".suolue_goods").on("touchstart", function (e) {

 var touchA = e.originalEvent.changedTouches[0].pageX;

 $(".suolue_goods").on("touchend", function (e) {
 var touchB = e.originalEvent.changedTouches[0].pageX;
 if (touchB < touchA) {
 $(this).find(".suoluefloot_ship").animate({"left": 0}, 100);
 }
 else {
 $(this).find(".suoluefloot_ship").stop(true).animate({"left": "3.1rem"}, 100);
 }
 })

 });
 /!*列表左滑*!/
 $(".list_goods").on("touchstart", function (e) {
 var touchA = e.originalEvent.changedTouches[0].pageX;
 $(".list_goods").on("touchend", function (e) {
 var touchB = e.originalEvent.changedTouches[0].pageX;
 if (touchB < touchA) {
 $(this).find(".listfloot_ship").animate({"left": "1.6rem"}, 100);
 }
 else {
 $(this).find(".listfloot_ship").stop(true).animate({"left": "6.5rem"}, 100);
 }
 })

 });*/
$(function(){
    $(".suoluegoods_price").click(function () {
        console.log(1);
        $(this).siblings(".suoluefloot_ship").animate({"left": 0}, 100);
    });
    $(".listgoods_price").click(function (e) {
        $(this).parent().siblings(".listfloot_ship").animate({"left": "1.6rem"}, 100);
    });
    $(".listfloot_ship").click(function (e) {
        e.preventDefault();
        $(this).animate({"left": "6.5rem"}, 100);
    });
    $(".suoluefloot_ship").click(function (e) {
        e.preventDefault();
        $(this).animate({"left": "3.1rem"}, 100);
    });
})


/*商品名截取*/
testAuto('.suoluegoods_name', 22);
testAuto('.listgoods_name', 26);


/*the result of search shop*/
testAuto('.shop_title', 26);
$(".goShop").click(function () {
    $(".goShop").css({"background": "#ffffff", "color": "#e60012"});
    $(this).css({"background": "#e60012", "color": "#ffffff"})
});























