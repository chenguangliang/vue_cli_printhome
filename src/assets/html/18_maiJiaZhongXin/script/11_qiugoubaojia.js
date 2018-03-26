
/**
 * 求购明细
 */
$(function(){

})
//获得网址上的参数
function getRequest(para) {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest[para];
}
var translationInfo = '';
var printerName = '';
var details = '';
var qiugouInfo = new Vue({
    el:"#qiugouInfo",
    data:{
        translationInfo:'',
        printerName:'',
        details:'',
    },
    mixins:[math],
    beforeCreate: function () {
        var translationNo = getRequest("translationNo");
        var flag = getRequest("flag");
        if(translationNo){
            $.jsonAjax(getUrl("askItemInfoController/askItemInfoMap"),{translationNo:translationNo,flag:flag},function(data,status,xhr){
                if(data.status=="200"){
                    translationInfo = data.data.translationInfo;
                    printerName = data.data.printerName;
                    details = data.data.details;
                    var formatData = Vue.filter('timestampFormat');
                    for(var i=0;i<details.length;i++){
                        var detail = details[i];
                        if(detail.detailStartDate){
                            detail.detailStartDate = formatData(detail.detailStartDate,'YYYY-MM-DD');
                        }
                        if(detail.detailEndDate){
                            detail.detailEndDate = formatData(detail.detailEndDate,'YYYY-MM-DD');
                        }
                    }
                }else{
                    popUp_auto_false(1000,data.msg);
                    setTimeout("window.location = '../2_login_sign/login_common.html'",1500);
                }
            },false);
        }else{
            popUp_auto_false(1000,"参数错误");
            setTimeout("window.location = '../18_maiJiaZhongXin/11_qiuGouGuanLi_qiuGouGuanLi.html'",1500);
        }
    },
    created: function () {
        this.$data.translationInfo = translationInfo;
        this.$data.printerName = printerName;
        this.$data.details = details;
    },
    methods: {
        time: function (value) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date(parseInt(value));
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();

            return y + '-' + add0(m) + '-' + add0(d);
        },
        getImgUrl:function (name){
            return getImgUrl(name);
        },
        doSave:function () {
            var yyyy = (new Date()).getFullYear();
            var mm = (new Date()).getMonth()+1;
            var dd = (new Date()).getDate();
            var now = yyyy+"-"+(mm<10 ? "0" + mm : mm) +"-"+ (dd<10 ? "0" + dd : dd);
            $("input[name='price']").each(function(){
                if($(this).val() != ""){
                    var price = $(this).val();
                    if(price <= 0 ){
                        popUp_auto_false(2500, '价格必须大于0!');
                        $(this).focus();
                        throw "价格必须大于0!";
                    }
                    var detailstartDate = $(this).parent().parent().find("input[name='detailStartDate']").val();
                    var detailendDate = $(this).parent().parent().find("input[name='detailEndDate']").val();
                    if( detailstartDate == ""){
                        popUp_auto_false(2500, '有效日期(始)必填!');
                        $(this).parent().parent().find("input[name='detailStartDate']").focus();
                        throw "有效日期(始)必填!";
                    }
                    if(new Date(now) > new Date(detailstartDate)){
                        popUp_auto_false(2500, '有效日期(始)不能小于今天!');
                        $(this).parent().parent().find("input[name='detailStartDate']").focus();
                        throw "有效日期(始)不能小于今天!";
                    }
                    if(detailendDate == ""){
                        popUp_auto_false(2500, '有效日期(止)必填!');
                        $(this).parent().parent().find("input[name='detailEndDate']").focus();
                        throw "有效日期(止)必填!";
                    }
                    if(new Date(detailstartDate) > new Date(detailendDate)){
                        popUp_auto_false(2500, '有效日期(止)不能小于有效日期(始)!');
                        $(this).parent().parent().find("input[name='detailEndDate']").focus();
                        throw "有效日期(止)不能小于有效日期(始)!";
                    }
                }else{
                    popUp_auto_false(2500, '价格必填!');
                    $(this).focus();
                    throw "价格必填!";
                }
            });
            //跑后台创建求购信息
            var category_ids = [];
            var ids =[];
            var addFlag = [];
            var matCd1 = [];
            var matAttributes = [];
            var nums = [];
            var price = [];
            var detailStartDate = [];
            var detailEndDate = [];
            for(var i=0;i<$("input[name='category_ids']").length;i++){
                category_ids[i] = $("input[name='category_ids']")[i].value;
                ids[i] = $("input[name='ids']")[i].value;
                addFlag[i] = $("input[name='addFlag']")[i].value;
                matCd1[i] = $("i[name='matCd1']")[i].innerText;
                matAttributes[i] = $("i[name='matAttributes']")[i].innerText;
                nums[i] = $("i[name='nums']")[i].innerText;
                price[i] = $("input[name='price']")[i].value;
                detailStartDate[i] = $("input[name='detailStartDate']")[i].value;
                detailEndDate[i] = $("input[name='detailEndDate']")[i].value;
            }
            var data={
                translationNo:qiugouInfo.$data.translationInfo.translationNo,
                translationName:qiugouInfo.$data.translationInfo.translationName,
                annex:qiugouInfo.$data.translationInfo.annex,
                oldFileName:qiugouInfo.$data.translationInfo.oldFileName,
                beginDate1:qiugouInfo.$data.translationInfo.beginDate,
                endDate1:qiugouInfo.$data.translationInfo.endDate,
                deliveryDate1:qiugouInfo.$data.translationInfo.deliveryDate,
                remarks:qiugouInfo.$data.translationInfo.remarks,
               
                category_ids:category_ids.join(','),
                ids:ids.join(','),
                addFlag:addFlag.join(','),
                matCd1:matCd1.join(','),
                matAttributes:matAttributes.join(','),
                nums:nums.join(','),
                price:price.join(','),
                detailStartDate:detailStartDate.join(','),
                detailEndDate:detailEndDate.join(',')
            }
            $.jsonAjax(getUrl("askItemInfoJavaController/saveRepTranslationInfo"),data,function(data,status,xhr){
                if(data.status = "200"){
                    popUp_auto(1000,"保存成功");
                    setTimeout("window.location = '11_qiuGouGuanLi_qiuGouGuanLi.html'",1500);
                }else{

                }
            },false);
        }
    }
});