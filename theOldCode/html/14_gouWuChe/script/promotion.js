/**
 * Created by Administrator on 2017/3/16 0016.
 */
/**满减活动
*@fileName:promotion.js
*@author:fdc
*@time:2017/7/18
*@disc:
*/


function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 2000);
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
function changeShowType(){
    /*缩略和列表切换*/
    $(".toggle_img").click(function () {
        if (this.src.indexOf("suoluetu-@3x.png") == "-1") {
            /* location.reload();*/
            //$("#scroller").css("transform", "translate(0px, 0px) scale(1) translateZ(0px)");
            this.src = "../../img/suoluetu-@3x.png";
            $(".suolue_goods").removeClass("none").addClass("inline_block");
            $(".list_goods").removeClass("inline_block").addClass("none");
            myScroll.refresh();
        } else {
            //$("#scroller").css("transform", "translate(0px, 0px) scale(1) translateZ(0px)");
            this.src = "../../img/liebiao@3x.png";
            $(".list_goods").removeClass("none").addClass("inline_block");
            $(".suolue_goods").removeClass("inline_block").addClass("none");
            myScroll.refresh();
        }

    });
}


/**
 * 上拉刷新下拉加载
 * @param vue
 */
function scrollInit(vue){
    //上拉刷新下拉加载
    refresher.init({
        id: "wrapper",
        pullDownAction: Refresh,
        pullUpAction: vue.load
    });

}

function goodsSiblings(){
    $(".suoluegoods_price").click(function () {
        $(this).next(".suoluefloot_ship").animate({"left": 0}, 100).parent().siblings().find(".suoluefloot_ship").animate({"left": "3.1rem"}, 100);
    });
    $(".listgoods_price").click(function (e) {
        $(this).parent().siblings(".listfloot_ship").animate({"left": "1.6rem"}, 100).parent().siblings().find(".listfloot_ship").animate({"left": "6.5rem"}, 100);
    });
    $(".listfloot_ship").click(function (e) {
        e.preventDefault();
        $(this).animate({"left": "6.5rem"}, 100);
    });
    $(".suoluefloot_ship").click(function (e) {
        e.preventDefault();
        $(this).animate({"left": "3.1rem"}, 100);
    });
    /*商品名截取*/
    testAuto('.suoluegoods_name', 20);
    testAuto('.listgoods_name', 26);
    /*the result of search shop*/
    testAuto('.shop_title', 26);
}

/**
 * 点击文字颜色变色
 */
function changeFontColor(){
    $(".search_btn p").click(function () {
        var Index = $(this).index();
        $(".search_btn p").eq(Index).css({
            "color": "#e60012"
        }).siblings().css({"color": "#666666"});
    });
}


$(".goShop").click(function () {
    $(".goShop").css({"background": "#ffffff", "color": "#e60012"});
    $(this).css({"background": "#e60012", "color": "#ffffff"})
});




var cartFR = new Vue({
    el:"#cartFR",
    mixins:[],
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //用户信息
        userInfo:"",
        params:"",
        promotionId:"",
        //活动基本信息
        promotionInfo:"",
        //满多少
        discountPrice:0,
        //减多少
        meetPrice:0,
        //条目
        items:[],
        //分页
        pager:{
            page:1,
            pageOffset:10,
        },
        //搜索结果页显示模式 1 条形 2  方块
        showMode:true,
    },
    methods:{
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                }
            });
        },
        //获取活动基本信息
        getPromotionInfo:function(){
            var temp = this;
            $.jsonAjax(getUrl("/sellcenter/salePromotion/promotionBasicInfo"), {promotionId:this.promotionId}, function (data, status, xhr) {
                if (data.success) {
                    console.log(data)
                    temp.promotionInfo = data.result.promotionInfo;
                    temp.discountPrice = data.result.discountPrice;
                    temp.meetPrice = data.result.meetPrice;
                }
            });
        },
        //获取活动商品列表
        getPromotionItems:function(){
            var temp =this;
            $.jsonAjax(getUrl("/sellcenter/salePromotion/fullReductionItems"), {promotionId:this.promotionId,page:this.pager.page,pageOffset:this.pager.pageOffset}, function (data, status, xhr) {
                if (data.success) {
                    console.log(data)
                    if(data.success && data.result.pager.records.length > 0){
                        temp.pager.page = data.result.pager.page;
                        pushJsonArray(temp.$data.items,data.result.pager.records);
                        goodsSiblings();
                    }else{
                        temp.pager.page = data.result.pager.page - 1;
                        refresher.info.pullUpLable = "已经到底了";
                        myScroll.refresh();
                    }
                }
            });
        },
        load:function(){
            var temp = this;
            this.pager.page = this.pager.page + 1;
            setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
                temp.getPromotionItems();
                /****remember to refresh when you action was completed！！！****/
            }, 1000);
        },
        toggleShow: function () {
            var src = $("#switchPic").attr("src");
            if(src.indexOf("suoluetu") != -1){
                $("#switchPic").attr("src","../../img/liebiao@3x.png");
            }else{
                $("#switchPic").attr("src","../../img/suoluetu-@3x.png");
            }

            this.showMode = !this.showMode;
            //myScroll.refresh();
        },
        //去商品详情页
        gotoGood:function(item,event){
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+item.itemId;
        },
    },
    computed:{

    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
        this.params = $.getUrlJson();
        this.promotionId = this.params.promotionId;
        this.getPromotionInfo();
        this.getPromotionItems();

    },
    mounted:function(){
        scrollInit(this);
        goodsSiblings();
        changeFontColor();
    },
    updated:function(){
        myScroll.refresh();
        goodsSiblings();
        changeFontColor();
    },
    watch:{


    }


});
