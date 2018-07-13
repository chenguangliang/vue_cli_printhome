/**
 * Created by linxiaomei on 2017/3/27.
 */

var shopId = $.getUrlParam("shopId");

var shopInfoOut = {};

var shopInfoVM = new Vue({
    el:"#shopInfo",
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        shoucangNo:'../../img/shoucang.png',
        shoucangYes:'../../img/star_red.png',
        shopInfo:{
            logoUrl:'',
            shopName:'',
            companyName:'',
            companyAddr:'',
            sellerId:'',
            busLicenImgSrc:'',
            serIconImageSrc:'',
            favouriteShop:'',
            favId:''
        },
        shoucangSrc:''
    },
    methods : {
        addShopFavourite:function(){
            var favIdStr = "";
            $.jsonAjax(getUrl("favourite/addFavShop"),
                {shopId:shopId,sellerId:this.shopInfo.sellerId,favoId:this.shopInfo.favId},
                function (data, status, xhr) {
                    if (data.success) {
                        favIdStr = data.result+"";
                    }
            },false);
            this.shopInfo.favId = favIdStr;
            //改变页面图标颜色
            if('' != favIdStr) {//添加收藏返回的是id值
                this.shoucangSrc = this.shoucangYes;
                popUp_auto(1500,"您已收藏该店铺");
            }else{
                this.shoucangSrc = this.shoucangNo;
                popUp_auto(1500,"取消收藏该店铺");
            }
        },
        imgLoad: function () {
            var that=this;
            var oImg = new Image();
            oImg.src = this.imgUrl + this.shopInfo.logoUrl;
            oImg.onload = function () {
                $(".shop_headImg")[0].src=that.imgUrl + that.shopInfo.logoUrl;
            };
        }

    },
    beforeCreate:function(){
        //查询店铺基本信息
        $.jsonAjax(getUrl("shopBaseInfoController/shopBaseInfo"), {shopId:shopId}, function (data, status, xhr) {
            if (data) {
                shopInfoOut = data;
            }
        },false);
    },
    created:function(){
        this.shopInfo = shopInfoOut;
        if('false' == this.shopInfo.favouriteShop){
            this.shoucangSrc = this.shoucangNo;
        }else{
            this.shoucangSrc = this.shoucangYes;
        }

    },
    mounted: function () {
        this.imgLoad();
        //绑定jquery事件
        initjQueryClick();
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