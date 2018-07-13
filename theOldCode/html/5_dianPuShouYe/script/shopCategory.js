/**
 * Created by linxiaomei on 2017/3/29.
 */
var shopId = $.getUrlParam("shopId");
var shopCategoryOut=[];

var shopCategoryVM = new Vue({
    el:"#shopCategoryVUE",
    data:{
        shopCategoryList:[]
    },
    methods:{
        goToSearchItem: function (categoryCid) {
            //Ìø×ªµ½µêÆÌÊ×Ò³
            window.location ="../../html/5_dianPuShouYe/dianPu_index.html?cid="+categoryCid+"&shopId="+shopId+"&showShopInfo=false";
            //window.location ="../../html/4_souSuoJieGuo/search_result.html?cid="+categoryCid;
        },

    },
    beforeCreate:function(){
        $.jsonAjax(getUrl("shopItemListIndexController/toShopCategory"), {shopId:shopId}, function (data, status, xhr) {
            if (data) {
                shopCategoryOut = data;
            }
        },false);
    },
    created:function(){
        this.shopCategoryList = shopCategoryOut;
    },
    mounted:function(){
        initJqueryCase();
        //testAuto(".test",4);
    }
});
var allGoodsVM = new Vue({
    el:".all_goods",
    methods:{
        showAllGoods: function () {
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?shopId="+shopId+"&showShopInfo=false"
        }
    }
});

var footerFixedVM = new Vue({
    el:".footer_fixed",
    methods:{
        gotoShopIndex: function () {
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?shopId="+shopId;
        }

    }
})


function goshopIndex(){
    window.location ="../../html/5_dianPuShouYe/dianPu_index.html?shopId="+shopId;
}