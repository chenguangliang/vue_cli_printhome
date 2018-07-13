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
            var skuScope=temp.buildSkuScopeArray();
            if(!skuScope){
                popUp_auto_false(1500,"商品评分不能为空值!");
                return;
            }
            var content=temp.buildContentArray();
            var shopEvaluationDTO = temp.buildShopEvaluationDTO();
            var itemEvaluationDTO = temp.buildItemEvaluationDTO();
            if(!shopEvaluationDTO || !itemEvaluationDTO){
                return;
            }
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
                "content":content,
                "itemId":temp.buildItemIdArray(),
                "skuId":temp.buildSkuIdArray(),
                "skuScope":skuScope,
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
            var shopDescriptionScope = 0;
            $("#shopDescriptionScope img").each(function() {
                var src = $(this).attr("src");
                if(src != null && src.indexOf("shoucang_red.png") != -1){
                    shopDescriptionScope++;
                }
            });
            if(shopDescriptionScope==0){
                popUp_auto_false(1500,"描述相符不能为空值!");
                return;
            }
            shopEvaluationDTO.shopDescriptionScope = shopDescriptionScope;
            var shopServiceScope = 0;
            $("#shopServiceScope img").each(function() {
                var src = $(this).attr("src");
                if(src != null && src.indexOf("shoucang_red.png") != -1){
                    shopServiceScope++;
                }
            });
            if(shopServiceScope==0){
                popUp_auto_false(1500,"服务态度不能为空值!");
                return;
            }
            shopEvaluationDTO.shopServiceScope = shopServiceScope;
            var shopArrivalScope = 0;
            $("#shopArrivalScope img").each(function() {
                var src = $(this).attr("src");
                if(src != null && src.indexOf("shoucang_red.png") != -1){
                    shopArrivalScope++;
                }
            });
            if(shopArrivalScope==0){
                popUp_auto_false(1500,"到货速度不能为空值!");
                return;
            }
            shopEvaluationDTO.shopArrivalScope = shopArrivalScope;
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
                if(skuScope){
                    skuScopes.push(skuScope);
                }else {
                    skuScopes=false;
                    return skuScopes;
                }
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
    popUp_open();
    var fileElementId = $(obj).attr("id");
    $.uploadFile({
        url:getUrl('/fileUpload/fixedUploadCrossDomain?date='+new Date()), //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: fileElementId, //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        data:{
            size:10485760
        },
        type:"post",
        success: function (data, status){  //服务器成功响应处理函数
            popUp_close();
            if(data.success){
                popUp_auto(1000,"上传成功!");
                var result = data.result;
                var picUrl = img_url + result;
                var index = fileElementId.split("-index-")[1];
                var html = "<div>";
                html += "<input type='hidden' name='shuaidan_pic_url' value='"+result+"' />";
                html += "<img src='"+picUrl+"' alt=''/><span onclick='removePic(this)'></span>";
                html += "</div>";
                $("#fileupload-div-"+index).prepend(html);

                var picNum = $("#fileupload-div-"+index+" div img").size();
                if(picNum >= 3){
                    $("#fileupload-div-"+index+" a").hide();
                }
            }else{
                popUp_auto_false(1500,data.errorMessages);
            }
        },
        error: function (data, status, e){//服务器响应失败处理函数
            popUp_close();
        }
    });
};

//移除晒单图片
function removePic(obj) {
    var fileupLoadDiv = $(obj).parent().parent();
    $(obj).parent().remove();

    var picNum = fileupLoadDiv.find("div img").size();
    if(picNum < 3){
        fileupLoadDiv.find("a").show();
    }
};
/*照着李金勇svn 版本18207修改 上传一张图片出现两个的bug --start*/
jQuery.extend({
    createUploadForm: function(id, fileElementId,data){
        //create form
        var formId = 'jUploadForm' + id;
        var form = jQuery("<form  action='' method='POST' name='" + formId + "' id='" + formId + "' enctype='multipart/form-data'></form>");
        if(data){
            for(var i in data){
                jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
            }
        }
        //single
        if(typeof(fileElementId) == 'string'){
            fileElementId = [fileElementId];
        }
        for(var i=0;i<fileElementId.length;i++){
            var oldElement = jQuery('#' + fileElementId[i]);
            var newElement = jQuery(oldElement).clone();
            jQuery(oldElement).before(newElement);
            jQuery(oldElement).appendTo(form);
        }

        //set attributes
        jQuery(form).css('position', 'absolute');
        jQuery(form).css('top', '-1200px');
        jQuery(form).css('left', '-1200px');
        jQuery(form).appendTo('body');
        return form;
    },
    uploadFile:function(s){
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime();
        var form = jQuery.createUploadForm(id, s.fileElementId, (typeof(s.data)=='undefined'?false:s.data));
        var formId = 'jUploadForm' + id;
        jQuery(form).ajaxForm(s
        ).submit();
        jQuery(form).remove();
    },
})
/*照着李金勇svn 版本18207修改 上传一张图片出现两个的bug --end*/
