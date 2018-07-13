
/**
 * 求购明细
 */
var productList = [];
var changgou_shangpin = new Vue({
    el:"#changgou_shangpin",
    data:{
        imgUrl:img_url,
        productArray:[],
        ids:[],
        rbidStr:''
    },
    beforeCreate:function(){
        $.jsonAjax(getUrl("buyercenter/regularBuyGoods"), {}, function (data, status, xhr) {
            productList = data.list;
        }, false);
    },
    created: function () {
        this.productArray = productList;
    },
    mounted: function () {

        //点击删除的效果
        /*$('.delete').click(function(){
            if(changgou_shangpin.$data.ids.length==0){
                $('.zhezhao').show();
            }else{
                $('.zhezhao2').show();
            }
        });*/
        //点击取消的效果
        $('.quXiao').click(function(){
            $('.zhezhao2').hide();
        });
        //点击叉号的效果
        $('.close').click(function(){
            $('.zhezhao').hide();
        });

    },
    updated:function () {
        //myScroll.refresh();
    },
    methods: {
        toDetails: function (itemId,skuId) {
            window.location.href="../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+itemId+"&skuId="+skuId;
        },
        clickSelect: function (rbId) {
            var ids = this.ids;
            var index = ids.indexOf(rbId);
            if(index>-1){
                this.ids.splice(index,1);
            }else{
                this.ids.push(rbId);
            }
        },
        batchAddToCart: function () {
            if(this.ids.length == 0){
                popUp_auto_false(1000,"请选择要加入购物车的商品");
                return;
            }
            var str = "";
            for(var i=0; i<this.ids.length;i++){
                str = str + ","+this.ids[i];
            }
            this.rbidStr = str.substring(1);
            //检查
            $.jsonAjax(getUrl("buyercenter/checkRBListToCart"), {rbidStr : this.rbidStr}, function (data, status, xhr) {
                if(data.result=='success'){
                    var arr = data.data;
                    var count = 0;
                    for(var i=0;i<arr.length;i++){
                        var obj = arr[i];
                        var shopCart = new ShopCart(obj.shopId,obj.itemId,obj.skuId,obj.sellerId,obj.areaCode,1,'');
                        $.jsonStringAjaxPost(getUrl('/shopCart/batchAdd'),shopCart,function(result,status, xhr) {
                            if (result.success) {
                                count++;
                            }
                        },false);
                    }
                    //if(count == arr.length){
                    //    popUp_auto(1500, "全部商品添加购物车成功!");
                    //}else if(count > 0){
                    //    popUp_auto(1500, "部分商品添加购物车成功!");
                    //}
                    $("#addCartBomb").show();
                }else{
                    popUp_auto_false(1000,"添加购物车失败"+data.msg);
                }
            }, false);
        },
        gotoCart: function () {
            window.location.href="../../html/14_gouWuChe/gouWuChe.html"
        },
        deleteOper: function () {
            if(this.rbidStr == ""){
                $('#zhezhao').show();
                return;
            }
            $.jsonAjax(getUrl("buyercenter/deleteRBList"), {rbidStr : this.rbidStr}, function (data, status, xhr) {
                if(data.result=='success'){
                    window.location.href="../../html/23_always_order_list/order_list.html";
                }else{
                    popUp_auto_false(1000,"删除失败");
                }
            }, false);

        },
        deleteOne : function (rbId) {
            this.rbidStr = rbId+"";
            $('#deleteAlert').show();
        },
        batchDelete: function () {
            if(this.ids.length == 0){
                $('#zhezhao').show();
                return;
            }
            var str = "";
            for(var i=0; i<this.ids.length;i++){
                str = str + ","+this.ids[i];
            }
            this.rbidStr = str.substring(1);
            $('#deleteAlert').show();
        },
        closediv: function (divId) {
            this.rbidStr = "";
            $("#"+divId).hide();
        }
    },

});

//创建加入购物车对象
function ShopCart(shopId,itemId,skuId,sellerId,areaCode,quantity,apTemplateId){
    this.shopId = shopId;//店铺ID
    this.itemId = itemId;//商品id
    this.skuId = skuId;
    this.sellerId = sellerId;//商家id
    this.regionId = areaCode;//区域
    this.quantity = quantity;//数量
    if (typeof sayName != "function" ){
        ShopCart.prototype.sayName= function(){};
    }
    this.apTemplateId=apTemplateId;
}