/**
*@fileName:depositBalance.js
*@author:lxm
*@time:2017/12/17
*@disc:提现页面js
*/
$(function () {
    validateTixianzhanghuForm();
})
//提现账户信息
function validateTixianzhanghuForm() {

    $("#tixianzhanghu_form").validate({
        rules: {
            bankAccountName: {
                required: true
            },
            bankAccount: {
                required: true
            },
            bankName: {
                required: true
            },
            bankBranchJointLine: {
                required: true
            },
            bank_province: {
                required: true
            },
            bank_city: {
                required: true
            },
            bank_area: {
                required: true
            }
        }
    });
}
var bindAccount = new Vue({
    el:"#bindAccount",
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //浏览器参数
        params:{
        },
        userInfoDTO:{},
        bankProvince:"",
        bankCity:"",
        bankArea:"",
        bankCityList:[],
        bankAreaList:[],
        provinceList:[],
    },
    methods:{
        queryBuyerInfo : function () {
            var temp = this;
            $.jsonAjax(getUrl("information/informationBuyer/loadBuyerInfo"), {}, function (data, status, xhr) {
                temp.userInfoDTO = data.data.userInfoDTO;
                temp.provinceList = data.data.provinceList;
                temp.bankCityList = data.data.bankCityList;
                temp.bankAreaList = data.data.bankAreaList;
            }, false);
        },
        changeBankProvince:function () {
            var parentCode = this.$data.bankProvince;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                bindAccount.$data.bankCityList = data;
                bindAccount.$data.bankCity = "";
                bindAccount.$data.bankArea = "";
            });
        },
        changeBankCity:function () {
            var parentCode = this.$data.bankCity;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                bindAccount.$data.bankAreaList = data;
                bindAccount.$data.bankArea = "";
            });
        },
        changeIsCiticBank: function (val) {
            this.userInfoDTO.userAccountDTO.isCiticBank = val;
        }
    },
    computed:{

    },
    beforeMount:function(){
        this.params = $.getUrlJson();
        /*获取用户提现账户信息buyerInfo*/
        this.queryBuyerInfo();
        /*发送验证码*/
    },
    mounted: function () {

    },
    updated:function(){

    },
    watch:{

    }
});

//图片上传实现类
function startUpload(fileElementId, showImg,urlInput){
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
                $("#"+showImg).attr("src",getImgUrl(data.result));
                $("#"+urlInput).val(data.result);
                $("#"+fileElementId).val("");
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
//图片上传
function fileChange(fileInputId,showImgId,urlInput){
    startUpload(fileInputId,showImgId,urlInput);
}

//提现账户信息
function updateTixianzhanghu() {
    //验证校验
    var isValid = $("#tixianzhanghu_form").valid();
    if (!isValid) {
        return;
    }

    var data = {
        //数据库表user_extends主键
        "extendId":bindAccount.$data.userInfoDTO.extendId,
        //用户Id
        "userId": bindAccount.$data.userInfoDTO.userId,
        "userAccountDTO.bankAccountName":$("#bankAccountName").val(),
        "userAccountDTO.bankAccount":$("#bankAccount").val(),
        "userAccountDTO.bankName":$("#bankName").val(),
        "userAccountDTO.bankBranchJointLine":$("#bankBranchJointLine").val(),
        "userAccountDTO.bankBranchIsLocated":$("#bank_province").val()+","+$("#bank_city").val()+","+$("#bank_area").val(),
        "userAccountDTO.isCiticBank":bindAccount.$data.userInfoDTO.userAccountDTO.isCiticBank,
        "userAccountDTO.bankAccountPermitsPicSrc":$("#bankAccountPermitsPicSrc").val(),
        editType: 6,
    };
    $.jsonAjax(getUrl("information/informationSeller/modifySeller"), data, function (data, status, xhr) {
        if (data.status == "200") {
            $("#setAlert").show();
        } else {
            popUp_auto_false(1000,data.message);
        }
    });
}
function toPage(){
    window.location = '../../html/15_xiaoYinZhiFu/queryBalance.html';
}
