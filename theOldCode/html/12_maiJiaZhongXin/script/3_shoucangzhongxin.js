
/**
 * 求购明细
 */
$(function(){

})
var productlist = '';
var shoplist = '';
var shoucang = new Vue({
    el:"#shoucang",
    data:{
        shoplist:'',
        productlist:'',
    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("buyercenter/favouriteShopsMap"), {}, function (data, status, xhr) {
            if (data.status == "200") {
                shoplist = data.data.pager.records;
                // console.log(pager);
            } else {
                printAlert(data.msg);
                window.location = '../2_login_sign/login_common.html';
            }
        }, false);
        $.jsonAjax(getUrl("buyercenter/favouriteProductsMap"), {}, function (data, status, xhr) {
            if (data.status == "200") {
                productlist = data.data.pager.records;
                // console.log(pager);
            } else {
                printAlert(data.msg);
                window.location = '../2_login_sign/login_common.html';
            }
        }, false);
    },
    created: function () {
        this.$data.productlist = productlist;
        this.$data.shoplist = shoplist;
    },
    methods: {
        getImgUrl: function (name) {
            return getImgUrl(name);
        },
        gotoGoods:function (product) {
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+product.itemId+"&skuId="+product.skuId;
        },
        gotoShop:function (shop) {
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?shopId="+shop.shopId;
        }
    }
});
