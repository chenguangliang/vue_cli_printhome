/**
 *  买家中心---订单评价
 */
/**********************************************************************************************************************/
var orderEvaluate = new Vue({
    el:"#order_evaluate",
    data:{
        addressBarParams:{},
        resultData:{},
        img_url:img_url
    },
    methods:{
        //返回买家中心订单列表
        goBackOrderList:function() {
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
        },
        //初始化订单评价页
        initEvaluaditePage:function() {
            var temp = this;
            var paramData = temp.addressBarParams;
            $.jsonAjax(getUrl("buyerEvaluation/initTrading"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.resultData = data.resultData;
                }
            }, false);
        },
        //发表评论
        publishEvaluate:function() {
            var temp = this;
            var shopEvaluationDTO = temp.buildShopEvaluationDTO();
            var itemEvaluationDTO = temp.buildItemEvaluationDTO();
            var paramData = {
                shopEvaluationDTO:{
                    "byShopId":shopEvaluationDTO.byShopId,
                    "orderId":shopEvaluationDTO.orderId,
                    "resource":shopEvaluationDTO.resource,
                    "shopArrivalScope":shopEvaluationDTO.shopArrivalScope,
                    "shopDescriptionScope":shopEvaluationDTO.shopDescriptionScope,
                    "shopServiceScope":shopEvaluationDTO.shopServiceScope,
                    "userId":shopEvaluationDTO.userId
                },
                itemEvaluationDTO:{
                    "byShopId":itemEvaluationDTO.byShopId,
                    "byUserId":itemEvaluationDTO.byUserId,
                    "orderId":itemEvaluationDTO.orderId,
                    "userId":itemEvaluationDTO.userId
                },
                "itemId":temp.buildItemIdArray(),
                "skuId":temp.buildSkuIdArray(),
                "skuScope":temp.buildSkuScopeArray(),
                "content":temp.buildContentArray(),
                "isAnonymity":temp.isAnonymity(),
                "imgurls":temp.buildImgurls()
            };
            $.jsonStringAjaxPost(getUrl("buyerEvaluation/submitTrading"), paramData, function (data, status, xhr) {
                if(data.errorMessages == "提交成功!"){
                    popUp_auto(1000,data.errorMessages);
                    window.setTimeout(function () {
                        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //构建店铺评价信息
        buildShopEvaluationDTO:function() {
            var temp = this;
            var shopEvaluationDTO = new Object();
            shopEvaluationDTO.byShopId = temp.resultData.tradeOrdersDTO.shopId;
            shopEvaluationDTO.orderId = temp.resultData.tradeOrdersDTO.orderId;
            shopEvaluationDTO.userId = temp.resultData.tradeOrdersDTO.buyerId;
            shopEvaluationDTO.resource = 2;
            var shopArrivalScope = 0;
            $("#shopArrivalScope img").each(function() {
                var src = $(this).attr("src");
                if(src != null && src.indexOf("shoucang_red.png") != -1){
                    shopArrivalScope++;
                }
            });
            shopEvaluationDTO.shopArrivalScope = shopArrivalScope;
            var shopDescriptionScope = 0;
            $("#shopDescriptionScope img").each(function() {
                var src = $(this).attr("src");
                if(src != null && src.indexOf("shoucang_red.png") != -1){
                    shopDescriptionScope++;
                }
            });
            shopEvaluationDTO.shopDescriptionScope = shopDescriptionScope;
            var shopServiceScope = 0;
            $("#shopServiceScope img").each(function() {
                var src = $(this).attr("src");
                if(src != null && src.indexOf("shoucang_red.png") != -1){
                    shopServiceScope++;
                }
            });
            shopEvaluationDTO.shopServiceScope = shopServiceScope;
            return shopEvaluationDTO;
        },
        //构建商品评价信息
        buildItemEvaluationDTO:function() {
            var temp = this;
            var itemEvaluationDTO = new Object();
            itemEvaluationDTO.byShopId = temp.resultData.tradeOrdersDTO.shopId;
            itemEvaluationDTO.byUserId = temp.resultData.tradeOrdersDTO.sellerId;
            itemEvaluationDTO.orderId = temp.resultData.tradeOrdersDTO.orderId;
            itemEvaluationDTO.userId = temp.resultData.tradeOrdersDTO.buyerId;
            return itemEvaluationDTO;
        },
        //构建itemId数组
        buildItemIdArray:function() {
            var itemIds = new Array();
            $("div[id^='item_div_index_']").each(function() {
                var itemId = $(this).attr("itemId");
                itemIds.push(itemId);
            });
            return itemIds;
        },
        //构建skuId数组
        buildSkuIdArray:function() {
            var skuIds = new Array();
            $("div[id^='item_div_index_']").each(function() {
                var skuId = $(this).attr("skuId");
                skuIds.push(skuId);
            });
            return skuIds;
        },
        //构建商品评分数组
        buildSkuScopeArray:function() {
            var skuScopes = new Array();
            $("div[id^='item_div_index_']").each(function(){
                var obj = $(this);
                var skuScope = 0;
                obj.find("p[id^='sku_scope_index_'] img").each(function() {
                    var src = $(this).attr("src");
                    if(src != null && src.indexOf("shoucang_red.png") != -1){
                        skuScope++;
                    }
                });
                skuScopes.push(skuScope);
            });
            return skuScopes;
        },
        //构建评论内容数组
        buildContentArray:function() {
            var contents = new Array();
            $("div[id^='item_div_index_'] textarea[id^='content_index_']").each(function() {
                contents.push($(this).val());
            });
            return contents;
        },
        //是否匿名评价
        isAnonymity:function() {
            var flag = 0;
            var src = $("#isAnonymity").attr("src");
            if(src != null && src.indexOf("yes-select.png") != -1){
                flag = 1;
            }
            return flag;
        },
        //构建晒单图片信息
        buildImgurls:function() {
            var imgurls = "";
            $("div[id^='item_div_index_']").each(function(){
                var obj = $(this);
                var skuId = obj.attr("skuId");
                var sku_url = "";
                obj.find("div[id^='fileupload-div-'] input[name='shuaidan_pic_url']").each(function(){
                    sku_url += skuId + "_" + $(this).val() + ";";
                });
                imgurls += sku_url;
            });
            return imgurls;
        }
    },
    beforeMount:function(){
        this.addressBarParams = $.getUrlJson();

        this.initEvaluaditePage();//初始化订单评价页
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
    }
});

//图片上传实现类
function startUpload(obj) {
    var fileElementId = $(obj).attr("id");
    var checkUploadKey = getRandom();
    popUp_open();
    $.ajaxFileUpload({
        url:getUrl('/fileUpload/fixedUploadCrossDomain?date='+new Date()), //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: fileElementId, //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        data:{
            size:1048576,
            checkUploadKey: checkUploadKey,
        },
        type:"post",
        success: function (data, status){  //服务器成功响应处理函数
            popUp_close();
            if(data.success){
                var result = data.result;
                var picUrl = img_url + result;
                var index = fileElementId.split("-index-")[1];
                var html = "<div>";
                html += "<input type='hidden' name='shuaidan_pic_url' value='"+result+"' />";
                html += "<img src='"+picUrl+"' alt=''/><span onclick='removePic(this)'></span>";
                html += "</div>";
                $("#fileupload-div-"+index).prepend(html);
            }
        },
        error: function (data, status, e){//服务器响应失败处理函数
            $.jsonAjax(getUrl("fileUpload/fixedUploadCrossDomainResult"),{checkUploadKey:checkUploadKey},function(data, status, e){
                popUp_close();
                if(data.success){
                    var result = data.result;
                    var picUrl = img_url + result;
                    var index = fileElementId.split("-index-")[1];
                    var html = "<div>";
                    html += "<input type='hidden' name='shuaidan_pic_url' value='"+result+"' />";
                    html += "<img src='"+picUrl+"' alt=''/><span onclick='removePic(this)'></span>";
                    html += "</div>";
                    $("#fileupload-div-"+index).prepend(html);
                }
            });
        }
    });
};

//移除晒单图片
function removePic(obj) {
    $(obj).parent().remove();
};