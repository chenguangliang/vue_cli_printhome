/**
*@fileName:search_shop.js
*@author:fdc
*@time:2017/3/9 0009
*@disc: 店铺搜索结果页
*/
var generatedCount = 0;
function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 2000);
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
/**
 * 页面加载后把搜索类型从url里获取到并填到对应位置
 * @param
 */
window.onload= function () {
    var res=$.getUrlJson();
    var searchCon=res.queryType;
    var searchKeyword=res.keyword;
    $(".search_box").val(searchKeyword);
    $("#search").val(searchCon);
};

var keyword = "";
keyword = $.getUrlParam("keyword");
$(function(){
    searchResult.$data.keyword = keyword;
})


var searchResult = new Vue({
    el:"#searchResult",
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        keyword : "",
        queryType :"goods",
        goodsData:{pager:{records:{recommendItems:""}}},
        shopTotalMap:{},
        pageSize:10,
        page:1,
        searchSort:""
    },
    computed:{
        setSort:{
            set:function(event){
                var searchSort = $(event.currentTarget).attr("searchSort");
                var searchSortFlag = $(event.currentTarget).attr("searchSortFlag");
                if(searchSortFlag == 1){
                    $(event.currentTarget).attr("searchSortFlag",2);
                    this.searchSort = searchSort * 2;
                }else{
                    $(event.currentTarget).attr("searchSortFlag",1);
                    this.searchSort = searchSort * 2 - 1;
                }
            },
            get:function(){

            }
        }
    },
    methods:{
        load:function(){
            var temp = this;
            this.page = this.page + 1;
            setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
                $.jsonAjax(getUrl("searchController/searchShop"),{keyword:encodeURI(temp.keyword),page:temp.page,pageSize:temp.pageSize,orderSort:temp.searchSort},function(data, status, xhr){
                    if(data.success){
                        pushJsonArray(temp.$data.goodsData.pager.records,data.result.pager.records);
                    }else{
                        refresher.info.pullUpLable = "已经到底了";
                        myScroll.refresh();
                    }
                },false);
                /****remember to refresh when you action was completed！！！****/
            }, 1000);
        },
        //去商品详情页
        gotoProductDetail:function(product){
            window.location = '../../html/13_shangPinXiangQing/shangPinYe.html?itemId=' + product.itemId + "&skuId=" + product.skuId;
        },
        //去店铺主页
        gotoShop:function(shopId){
            window.location = '../../html/5_dianPuShouYe/dianPu_index.html?shopId=' + shopId;
        },
        /*点击搜索框*/
        goToSearch: function () {
            var queryType = $("#search").val();
            var urlTemp=$.assemblyRequestString({queryType:queryType,keyword:keyword});
            var goToPath='../../html/4_souSuoJieGuo/search.html'+"?"+urlTemp;
            window.location=goToPath;
        },
    },
    beforeMount:function(){
        var temp = this;
        $.jsonAjax(getUrl("searchController/searchShop"),{keyword:encodeURI(keyword),page:this.page,pageSize:this.pageSize},function(data, status, xhr){
            if(data.success){
                temp.$data.goodsData = data.result;
                temp.$data.shopTotalMap = data.result.shopTotalMap;
            }else{
                window.location = "../../html/4_souSuoJieGuo/searchShop_nothing.html?keyword="+$.getUrlParam("keyword")
            }
        },false);

    },
    mounted:function(){
        scrollInit(this);
    },
    updated:function(){
        myScroll.refresh();
    }
});

