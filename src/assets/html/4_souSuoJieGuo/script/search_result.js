/**
 * Created by Administrator on 2017/3/8 0008.
 */
/**
*@fileName:search_result.js
*@author:fdc
*@time:2017/3/8 0008
*@disc:搜索结果页
*/



var generatedCount = 0;
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
    // testAuto('.suoluegoods_name', 20);
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



var keyword = "";
keyword = $.getUrlParam("keyword");
$(function(){
    searchResult.$data.keyword = keyword;
});

var cidOut = '';
cidOut = $.getUrlParam("cid");
var filterOut = $.getUrlParam("filter");

var levOut = $.getUrlParam("lev");
var themId = $.getUrlParam("themId");
var pcid = $.getUrlParam("pcid");
var shopEvaluationInfoOut = {};
//cgl获取搜索是店铺还是商品
window.onload= function () {
    var res=$.getUrlJson();
    var searchCon=res.queryType.replace(/#/,"");
    var searchKeyword=res.keyword.replace(/#/,"");
    $(".search_box").val(searchKeyword);
    $("#search").val(searchCon);
};

var searchResult = new Vue({
    el:"#searchResult",
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        keyword : "",
        queryType :"goods",
        goodsData:{result:{docs:""}},
        pageSize:10,
        page:1,
        searchSort:"",
        //搜索结果页显示模式 1 条形 2  方块
        showMode:true,
        clickImgUrl:{
            saleSrc:'../../img/up_down.png',
            priceSrc:'../../img/up_down.png',

            sortPicUpDownNo:'../../img/up_down.png',
            sortPicUpRed:'../../img/up_red.png',
            sortPicDownRed:'../../img/down_red.png'
        },
        shopEvaluationInfo:{},
        itemFavouriteFlag:false,
        shopFavouriteFlag:false,
        relationWords:[]
    },
    computed:{
        setSort:{
            set:function(event){
                if(event){
                    var searchSort = $(event.currentTarget).attr("searchSort");
                    var searchSortFlag = $(event.currentTarget).attr("searchSortFlag");
                    if(searchSortFlag == 1){
                        $(event.currentTarget).attr("searchSortFlag",2);
                        // this.searchSort = searchSort * 2;
                        if(searchSort * 2==2){
                            this.searchSort="listtingTime_desc"
                        }else if(searchSort * 2==4){
                            this.searchSort="evaluateScope_desc"
                        }else if(searchSort * 2==6){
                            this.searchSort="sellNum_desc"
                        }else if(searchSort * 2==8){
                            this.searchSort="sellPrice_desc"
                        }
                    }else{
                        $(event.currentTarget).attr("searchSortFlag",1);
                        // this.searchSort = searchSort * 2 - 1;
                        if(searchSort * 2-1==1){
                            this.searchSort="listtingTime_asc"
                        }else if(searchSort * 2-1==3){
                            this.searchSort="evaluateScope_asc"
                        }else if(searchSort * 2-1==5){
                            this.searchSort="sellNum_asc"
                        }else if(searchSort * 2-1==7){
                            this.searchSort="sellPrice_asc"
                        }
                    }
                }
            },
            get:function(){

            }
        }
    },
    methods:{
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
        searchList:function(event,type){
            $(".listfloot_ship").css('left','6.5rem');
            $(".suoluefloot_ship").css('left','3.1rem');
            //控制样式
            if(type == 'sale'){//销量--先降序
                var srcName = this.clickImgUrl.saleSrc;
                if(srcName == this.clickImgUrl.sortPicUpDownNo
                    || srcName == this.clickImgUrl.sortPicUpRed){//无->下 上->下
                    this.clickImgUrl.saleSrc = this.clickImgUrl.sortPicDownRed;
                }else if(srcName == this.clickImgUrl.sortPicDownRed){//下->上
                    this.clickImgUrl.saleSrc = this.clickImgUrl.sortPicUpRed;
                }
                this.clickImgUrl.priceSrc = this.clickImgUrl.sortPicUpDownNo;//清除其它格式
            }else if(type == 'price'){//价格--先降序
                var srcName = this.clickImgUrl.priceSrc;
                if(srcName == this.clickImgUrl.sortPicUpDownNo
                    || srcName == this.clickImgUrl.sortPicUpRed){//无->下 上->下
                    this.clickImgUrl.priceSrc = this.clickImgUrl.sortPicDownRed;
                }else if(srcName == this.clickImgUrl.sortPicDownRed){//下->上
                    this.clickImgUrl.priceSrc = this.clickImgUrl.sortPicUpRed;
                }
                this.clickImgUrl.saleSrc = this.clickImgUrl.sortPicUpDownNo;//清除其它格式
            }else{
                this.clickImgUrl.saleSrc = this.clickImgUrl.sortPicUpDownNo;//清除其它格式
                this.clickImgUrl.priceSrc = this.clickImgUrl.sortPicUpDownNo;//清除其它格式
            }

            var temp = this;
            this.setSort= event;
            $.jsonAjax(getUrl("searchController/itemSearch"),{keywords:encodeURI(this.keyword),page:this.page,sort:this.searchSort},function(data, status, xhr){
                if(data.isSuccess){
                    // temp.$data.goodsData.result.docs = data.result.result.docs;
                    temp.$data.goodsData = data.resultData.pager.records;
                }else{
                    console.log($.getUrlParam("keyword"));
                    window.location = "../../html/4_souSuoJieGuo/search_nothing.html?keyword="+$.getUrlParam("keyword")
                }
            },false);
        },
        /*点击搜索框*/
        goToSearch: function () {
            var queryType = $("#search").val();
            var keyword=$(".search_box").val();
            var urlTemp=$.assemblyRequestString({queryType:queryType,keyword:keyword});
            //var goToPath='../../html/4_souSuoJieGuo/search.html'+"?"+urlTemp;
            //window.location=goToPath;
        },
        load:function(){
            var temp = this;
                console.log(2);
                this.page = this.page + 1;
                setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
                    $.jsonAjax(getUrl("searchController/itemSearch"),{keywords:encodeURI(temp.keyword),page:temp.page,sort:temp.searchSort},function(data, status, xhr){
                        if(data.isSuccess && data.resultData.pager.records){
                            pushJsonArray(temp.$data.goodsData,data.resultData.pager.records);
                            goodsSiblings();
                        }else{
                            refresher.info.pullUpLable = "已经到底了";
                            myScroll.refresh();
                        }
                    },false);
                    /****remember to refresh when you action was completed！！！****/
                }, 1000);
        },
        gotoGood:function(item,event){
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+item.itemId+"&skuId="+item.skuId;
        },
        //跳转店铺首页
        toShop:function(shopId) {
            var paramData = {
                shopId:shopId
            };
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?"+ $.assemblyRequestString(paramData);
        },
        //商品收藏
        itemSkuFavorite:function(good){
            $.jsonAjax(getUrl('favourite/addItem'),{
                skuId:good.skuId,itemId:good.itemId,shopId:good.shopId,sellerId:good.sellerId,
            },function(data,status, xhr){
                if(data.success){
                    popUp_auto(1500,"收藏成功");
                }else{
                    popUp_auto_false(1500,data);
                }
            },false);
        },
        //店铺收藏
        shopFavorite:function(good){
            $.jsonAjax(getUrl('favourite/addShop'),{
                shopId:good.shopId,
            },function(data,status, xhr){
                if(data.success){
                    popUp_auto(1500,"收藏成功");
                }else{
                    popUp_auto_false(1500,data);
                }
            },false);
        },
        //店铺评分
        getUserItemInfo: function (item) {
            var temp = this;
            shopEvaluationInfoOut = {};
            var pdata = {
                shopId:item.shopId
            };
            $.jsonAjax(getUrl("shopBaseInfoController/shopEvaluationInfo"), pdata, function (data, status, xhr) {
                if (data) {
                    shopEvaluationInfoOut = data;
                }
            },false);

            $.jsonAjax(getUrl("favourite/getItemFavouriteInfo"), {
                skuId:item.skuId,
                itemId:item.itemId,
                shopId:item.shopId,
            }, function (data, status, xhr) {
                if (data.success) {
                    temp.itemFavouriteFlag = data.result.itemFavouriteFlag;
                    temp.shopFavouriteFlag = data.result.shopFavouriteFlag;
                }
            },false);



            this.shopEvaluationInfo = shopEvaluationInfoOut;
        },
        searchItem:function(event,type){
                window.location = "../../html/4_souSuoJieGuo/search_result.html?keyword="+$(event.currentTarget).html() + "&queryType="+ $("#search").val();
        },
        enterSearch: function ($event,type) {
            var that=this;
            if($event.key=="Enter"){
                searchList();
            }else {
                console.log($event);
                $.jsonAjax(getUrl("searchController/autoComplete"),{'keyword':$(".search_box").val()},function(data, status, xhr){
                    if(data.isSuccess){
                        that.relationWords=data.resultData.termList;
                        if(data.resultData.termList.length>0){
                            $(".relationWrap").show();
                        }else {
                            $(".relationWrap").hide();
                        }
                    }else{

                    }
                },false);
            }
        },
        returnPage: function () {
            /*if(levOut == 2){
                window.location.href = "../../html/11_pinDaoLeiMu/pinDaoLeiMu.html?cid="+pcid+"&lev=2&themId="+themId;
            }else{
                window.location = "../../html/1_index/index.html";
            }*/
        //cgl
            window.history.back(-1);
        }
    },
    beforeMount:function(){
        var temp = this;
        $.jsonAjax(getUrl("searchController/itemSearch"),{keywords:encodeURI(keyword),page:this.page,category:cidOut},function(data, status, xhr){
            if(data.isSuccess){
                temp.$data.goodsData = data.resultData.pager.records;
            }else{
                window.location = "../../html/4_souSuoJieGuo/search_nothing.html?keyword="+$.getUrlParam("keyword")
            }
        },false);

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
        'queryData.keyword': function () {
            var that=this;
            $.jsonAjax(getUrl("searchController/autoComplete"),{'keyword':$(".search_box").val()},function(data, status, xhr){
                if(data.isSuccess){
                    that.relationWords=data.resultData.termList;
                    if(data.resultData.termList.length>0){
                        $(".relationWrap").show();
                    }else {
                        $(".relationWrap").hide();
                    }
                }else{

                }
            },false);
        }
    }
});

