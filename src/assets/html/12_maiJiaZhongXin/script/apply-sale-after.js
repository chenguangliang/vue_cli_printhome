/**
 *  买家中心---申请售后
 */
/**********************************************************************************************************************/
var saleAfterVue = new Vue({
    el:"#apply_sale_after",
    data:{
        addressBarParams:{},
        resultData:{},
        img_url:img_url,
        returnResult:"",
        remark:"",
        amountNum:"",
        refundMoney:""
    },
    methods:{
        //返回买家中心订单列表
        goBackOrderList:function() {
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
        },
        //初始化申请售后页
        initApplySaleAfterPage:function() {
            var temp = this;
            var paramData = temp.addressBarParams;
            $.jsonAjax(getUrl("order/refundAgreement"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.resultData = data.resultData;
                }
            }, false);
        },
        //立即申请退款
        applyRefund:function() {
            popUp_close();
            var temp = this;
            var resultData = temp.resultData;
            var picUrl = temp.buildCertificatePicUrl();
            var fundMoney = temp.resultData.fundMoney ? temp.resultData.fundMoney : "";
            var refundFreight = temp.resultData.refundFreight ? temp.resultData.refundFreight : "";
            var totalfundMoneyId = "";
            if(fundMoney != "" && refundFreight != ""){
                totalfundMoneyId = temp.numSub(fundMoney,refundFreight);
            }
            var haveRefundMoney = temp.resultData.totalMoney != null ? temp.resultData.totalMoney : "";
            var refundNum = temp.resultData.num != null ? temp.resultData.num : "";
            var num = temp.amountNum;//退款数量
            if(parseInt(num)+parseInt(resultData.num) > parseInt(resultData.jsonObject.items[0].num)){
            	printAlert("您已退款"+resultData.num+"件商品,退款数量不能大于剩余商品数量！");
                return;
            }
            var paramData = {
                orderId: temp.resultData.tradeOrdersDTO.orderId,
                returnResult: temp.returnResult,
                remark:temp.remark,
                picUrl:picUrl,
                skuId:temp.resultData.jsonObject.items[0].skuId,
                amountNum:temp.amountNum,
                refundMoney:temp.refundMoney,
                haveRefundMoney:haveRefundMoney,
                refundNum:refundNum,
                totalfundMoney:totalfundMoneyId
            };
            $.jsonAjax(getUrl("order/refundAgreementSubmit"), filterJSONNULL(paramData), function (data, status, xhr) {
                popUp_close();
                if(data.success){
                    popUp_auto(1000,'申请提交成功');
                    window.setTimeout(function () {
                        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    printAlert("申请退款失败："+data.errorMessages);
                }
            }, false);
        },
        //凭证图片信息
        buildCertificatePicUrl:function() {
            var pics = "";
            $("#certificate_pic_div input[name='certificate_pic_url']").each(function() {
                pics += $(this).val() + ";";
            });
            return pics;
        },
        numSub:function (num1, num2) {
            var baseNum, baseNum1, baseNum2;
            var precision;// 精度
            try {
                baseNum1 = num1.toString().split(".")[1].length;
            } catch (e) {
                baseNum1 = 0;
            }
            try {
                baseNum2 = num2.toString().split(".")[1].length;
            } catch (e) {
                baseNum2 = 0;
            }
            baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
            precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
            return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
        }
    },
    beforeMount:function(){
        this.addressBarParams = $.getUrlJson();

        this.initApplySaleAfterPage();//初始化申请售后页
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
    },
    watch:{
        remark:function(newValue, oldValue) {
            var temp = this;
            if(newValue != null && newValue.length >= 300){
                temp.remark = newValue.substring(0,299);
                printAlert("退款原因，最多不超过300字!");
            }
        }
    }
});
//图片上传实现类
function startUpload(obj){
    var fileElementId = $(obj).attr("id");
    popUp_open();
    $.uploadFile({
        url:getUrl('/fileUpload/fixedUploadCrossDomain?date='+new Date()), //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: fileElementId, //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        data:{
            size:10240000,
        },
        type:"post",
        success: function (data, status){  //服务器成功响应处理函数
            popUp_close();
            if(data.success){
                popUp_auto(1000,"上传成功!");

                var result = data.result;
                var picUrl = img_url + result;
                var html = "<span class='pic'>";
                html += "<input type='hidden' name='certificate_pic_url' value='" + result + "' />";
                html += "<img src='" + picUrl + "' alt='' /><i onclick='removePic(this)'></i>";
                html += "</span>";
                $("#certificate_pic_div").prepend(html);

                var imgNum = $("#certificate_pic_div span[class='pic'] img").size();
                if (imgNum >= 5) {
                    $("#certificate_pic_div span[class='xiangJi']").hide();
                }

            }else{
                popUp_auto_false(1500,data.errorMessages);
            }
        },
        error: function (data, status, e){//服务器响应失败处理函数
            console.log(data);
            popUp_close();
        }
    });
};

//移除晒单图片
function removePic(obj) {
    $(obj).parent().remove();

    var imgNum = $("#certificate_pic_div span[class='pic'] img").size();
    if(imgNum < 5){
        $("#certificate_pic_div span[class='xiangJi']").show();
    }
};

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