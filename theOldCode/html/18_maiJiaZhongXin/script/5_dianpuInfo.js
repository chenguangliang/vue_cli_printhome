var shopInfo = '';
var categoryNameList = '';
var shopBrandList = '';
var dianpu = new Vue({
    el:"#dianpu",
    data:{
        shopInfo:'',
        categoryNameList:'',
        shopBrandList:'',
    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("information/progressSeller/shopInfoMap"),{},function(data,status,xhr){
            if(data.status=="200"){
                shopInfo = data.data.shopInfo;
                categoryNameList = data.data.categoryNameList;
                shopBrandList = data.data.shopBrandList;
                // console.log(shopInfo);
            }else{
                printAlert(data.msg);
                // window.location = '../../html/2_login_sign/login_common.html';
            }
        },false);
    },
    created: function () {
        this.$data.shopInfo = shopInfo;
        this.$data.categoryNameList = categoryNameList;
        this.$data.shopBrandList = shopBrandList;
    },
    methods: {
        getShopType:function (){
            var reStr = "";
            if(this.shopInfo.shopType=='1'){
                reStr = "品牌商";
            }else if(this.shopInfo.shopType=='2'){
                reStr = "经销商";
            }
            return reStr;
        },
        getBrandType:function (){
            var reStr = "";
            var type = this.shopInfo.brandType;
            if(type=='1'){
                reStr = "国内品牌";
            }else if(type=='2'){
                reStr = "国际品牌";
            }else if(type=='3'){
                reStr = "合资品牌";
            }
            return reStr;
        },
        getBusinessType:function (){
            var reStr = "";
            var type = this.shopInfo.businessType;
            if(type=='1'){
                reStr = "自有品牌";
            }else if(type=='2'){
                reStr = "代理品牌";
            }
            return reStr;
        },
        getImgUrl:function (name){
            return getImgUrl(name);
        },

    }
});