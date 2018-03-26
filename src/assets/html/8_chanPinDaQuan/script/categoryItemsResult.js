/**
 * Created by linxiaomei on 2017/4/1.
 */
var itemIdOut =  $.getUrlParam("itemId");

var itemInfoOut = {};
var pagerOut = {};
var itemShopsOut = [];
var loginstatusOut = '';
var itemAttrNameOut =''
var chanpinjieguoVM = new Vue({
    el:"#chanpinjieguo",
    data:{
        imgUrl:img_url,
        picUrl:'',
        pager:{},
        itemShopsList:[],
        itemInfo:{},
        itemAttrName:'',
        loggingStatus:''
    },
    methods:{
        toShopItemIndex: function (pshopId,pItemId) {
            //window.location = '../../html/5_dianPuShouYe/dianPu_index.html?shopId='+pshopId;
            window.location = '../../html/13_shangPinXiangQing/shangPinYe.html?itemId='+pItemId;
        }
    },
    beforeCreate:function(){

        $.jsonAjax(getUrl("productController/categoryItemDetails"),{itemId:itemIdOut},function (data, status, xhr) {
            if (data) {
                itemInfoOut = data.item;
                pagerOut = data.pager;
                itemShopsOut = data.pager.records;
                itemAttrNameOut = data.itemAttrName;
                loginstatusOut = data.logging_status;
            }
        },false);
    },
    created:function(){
        this.itemInfo = itemInfoOut;
        this.picUrl = this.itemInfo.picUrls[0];
        this.pager = pagerOut;
        this.itemShopsList = itemShopsOut;
        this.itemAttrName = itemAttrNameOut;
        this.loggingStatus = loginstatusOut;
    }
})