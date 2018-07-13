$(function () {
    validateLianxirenForm();
    validateBusinessForm();
    validateTixianzhanghuForm();
})
//联系人信息
var userInfoDTO ="";
var userDTO ="";
var companyAddress ="";
var departmentLabel ="";
var companyQualtLabel ="";
var businessScaleLabel ="";
var companyPeoNumLabel ="";
var provinceList = "";
var comCityList = "";
var comAreaList = "";
var companyProvince = "";
var companyCity = "";
var companyArea = "";
var bankBranchIsLocated = "";
var bankProvince = "";
var bankCity = "";
var bankArea = "";
var bankCityList = "";
var bankAreaList = "";

var buyer = new Vue({
    el:"#buyer",
    data:{
        remark:"",
        userInfoDTO:{
        	userAccountDTO:{
        		
        	},
        },
        bankBranchIsLocated:"",
        userDTO:{},
        companyAddress:{},
        departmentLabel:{},
        companyQualtLabel:{},
        businessScaleLabel:{},
        companyPeoNumLabel:{},
        provinceList:[],
        comCityList:[],
        comAreaList:[],
        companyProvince:"",
        companyCity:"",
        companyArea:"",
        departmentData:[{code:null,label:"请选择"},{code:"XZB",label:"行政部"},{code:"CGB",label:"采购部"},{code:"SBB",label:"设备部"},{code:"JSB",label:"技术部"},{code:"SCB",label:"生产部"},{code:"FT",label:"财务部"},{code:"LT",label:"领导层"},{code:"QT",label:"其他"}],
        companyQualtData:[{code:null,label:"请选择"},{code:"ZF",label:"政府机关/事业单位"},{code:"GY",label:"国营"},{code:"SY",label:"私营"},{code:"ZWHZ",label:"中外合资"},{code:"WZ",label:"外资"},{code:"QT",label:"其他"}],
        businessScaleData:[{code:null,label:"请选择"},{code:"LESS1000",label:"1000万以下"},{code:"TO3000",label:"1000-3000万"},{code:"TO5000",label:"3000-5000万"},{code:"TO1E",label:"5000万到1亿"},{code:"THEN1E",label:"1亿以上"}],
        companyPeoNumData:[{code:null,label:"请选择"},{code:"TO49",label:"1-49"},{code:"TO99",label:"50-99"},{code:"TO499",label:"100-499"},{code:"TO999",label:"500-999"},{code:"THAN1000",label:"1000以上"}],
        businessScopeData:["书刊印刷","包装印刷","数字印刷","商业印刷","报业印刷","标签印刷","票据印刷","特种印刷","广告设计","专项印刷","其他"],
        bankProvince:"",
        bankCity:"",
        bankArea:"",
        bankCityList:[],
        bankAreaList:[],
        capthaCode:'',
        codeKey:''
    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("information/informationBuyer/loadBuyerInfo"),{},function(data,status,xhr){
            if(data.status=="200"){
                 //console.log(data.data)
                userDTO = data.data.userDTO;
                userInfoDTO = data.data.userInfoDTO;
                companyAddress = data.data.companyAddress;
                departmentLabel = data.data.departmentLabel;
                companyQualtLabel = data.data.companyQualtLabel;
                businessScaleLabel = data.data.businessScaleLabel;
                companyPeoNumLabel = data.data.companyPeoNumLabel;
                provinceList = data.data.provinceList;
                comCityList = data.data.comCityList;
                comAreaList = data.data.comAreaList;
                companyProvince = data.data.companyProvince;
                companyCity = data.data.companyCity;
                companyArea = data.data.companyArea;
                bankBranchIsLocated = data.data.bankBranchIsLocated;
                bankProvince = data.data.bankProvince;
                bankCity = data.data.bankCity;
                bankArea = data.data.bankArea;
                bankCityList = data.data.bankCityList;
                bankAreaList = data.data.bankAreaList;
            }else{
                if(data.msg.indexOf("未进行买家认证")>-1){
                    printConfirm("未进行买家认证，请先进行快速买家认证！", function () {
                        window.location = '../../html/2_login_sign/fastRenZheng.html';
                    },function () {
                        window.location = '../../html/12_maiJiaZhongXin/1_geRenXinXi_gengDuoSheZhi.html';
                    })
                }else{
                    popUp_auto_false(1000,data.msg);
                    setTimeout("window.location = '../../html/2_login_sign/login_common.html'",1500);
                }
            }
        },false);
    },
    created: function () {
        this.$data.userDTO = userDTO;
        this.$data.userInfoDTO = userInfoDTO;
        if(!this.$data.userInfoDTO.userAccountDTO){
        	this.$data.userInfoDTO.userAccountDTO = "";
        }
        this.$data.companyAddress = companyAddress;
        this.$data.departmentLabel = departmentLabel;
        this.$data.companyQualtLabel = companyQualtLabel;
        this.$data.businessScaleLabel = businessScaleLabel;
        this.$data.companyPeoNumLabel = companyPeoNumLabel;
        this.$data.provinceList = provinceList;
        this.$data.comCityList = comCityList;
        this.$data.comAreaList = comAreaList;
        this.$data.companyProvince = companyProvince;
        this.$data.companyCity = companyCity;
        this.$data.companyArea = companyArea;
        this.$data.bankBranchIsLocated = bankBranchIsLocated;
        this.$data.bankProvince = bankProvince;
        this.$data.bankCity = bankCity;
        this.$data.bankArea = bankArea;
        this.$data.bankCityList = bankCityList;
        this.$data.bankAreaList = bankAreaList;
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
        showRemark:function (remark) {
            this.$data.remark = remark;
        },
        changeComProvince:function () {
            var parentCode = this.$data.companyProvince;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                buyer.$data.comCityList = data;
                buyer.$data.companyCity = "";
                buyer.$data.companyArea = "";
            });
        },
        changeComCity:function () {
            var parentCode = this.$data.companyCity;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                buyer.$data.comAreaList = data;
                buyer.$data.companyArea = "";
            });
        },
        changeBusinessScope:function (flag,businessScope) {
            var businessScopeStr = buyer.$data.userInfoDTO.userBusinessDTO.businessScope;
            if(flag=='0'){
                businessScopeStr = businessScopeStr.replace(businessScope+",","");
            }else{
                businessScopeStr = businessScopeStr+businessScope+",";
            }
            buyer.$data.userInfoDTO.userBusinessDTO.businessScope=businessScopeStr;
        },
        changeIsFinacing:function (flag) {
            buyer.$data.userInfoDTO.userBusinessDTO.isFinancing = flag;
        },
        showImg:function (event) {
            var url = $(event.currentTarget).attr("src");
            $("#imgDiv").attr("src",url);
            $(".showBigImg").show();
        },
        hideImg:function () {
            $("#imgDiv").attr("src",'');
            $(".showBigImg").hide();
        },
        changeBankProvince:function () {
            var parentCode = this.$data.bankProvince;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                buyer.$data.bankCityList = data;
                buyer.$data.bankCity = "";
                buyer.$data.bankArea = "";
            });
        },
        changeBankCity:function () {
            var parentCode = this.$data.bankCity;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                buyer.$data.bankAreaList = data;
                buyer.$data.bankArea = "";
            });
        },
        changeIsCiticBank:function (flag) {
            buyer.$data.userInfoDTO.userAccountDTO.isCiticBank = flag;
        },
    }
});
//联系人
function validateLianxirenForm() {
    $("#lianxiren_form").validate({
        rules: {
            userId: {
                required: true
            },
            uname: {
                required: true
            },
            linkPhoneNum: {
                required: true
            },
            department: {
                required: true
            }
        }
    });
}
//公司
function validateBusinessForm() {
    $("#business_form").validate({
        rules: {
            companyDeclinedAddress: {
                required: true
            },
            company_province: {
                required: true
            },
            company_city: {
                required: true
            },
            company_area: {
                required: true
            }
        }
    });
}
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
            },
            capthaCode:{
                required: true
            }
        }
    });
}
//修改联系人
function updateLianxiren() {
    //验证校验
    var isValid = $("#lianxiren_form").valid();
    if (!isValid) {
        return;
    }
    var userId = $("#userId").val();
    var nickname = $("#nickname").val();
    var linkPhoneNum = $("#linkPhoneNum").val();
    var department = $("#department").val();
    var linkMan = $("#linkMan").val();
    var data = {
        "userId": userId,
        "userDTO.uid": userId,
        "userDTO.nickname": nickname,
        "userDTO.linkPhoneNum": linkPhoneNum,
        "userDTO.linkMan": linkMan,
        "userDTO.department": department,
        editType: 1
    }
    $.jsonAjax(getUrl("information/informationSeller/modifySeller"), data, function (data, status, xhr) {
        if (data.status == "200") {
            popUp_auto(1000,data.message);
            window.setTimeout(function () {
                window.location = 'maiJiaRenZhengJiBenXinXi.html';
            }, 2000);
        } else {
            popUp_auto_false(1000, data.message);
        }
    });
}
//修改公司
function updateBusiness() {
    //验证校验
    var isValid = $("#business_form").valid();
    if (!isValid) {
        return;
    }
    //经营范围
    var businessScope = buyer.$data.userInfoDTO.userBusinessDTO.businessScope;
    if(businessScope==""){
        popUp_auto_false(1000,"请选择经营范围!");
        return;
    }
    //是否融资
    var isFinancing = buyer.$data.userInfoDTO.userBusinessDTO.isFinancing;
    if(isFinancing=='1'){
        var financingNum = $("#financingNum").val();
        if(financingNum==''){
            popUp_auto_false(1000,"请填写期望融资额度!");
            return;
        }
    }
    var userId = $("#userId").val();
    var nickname = $("#nickname").val();
    var linkPhoneNum = $("#linkPhoneNum").val();
    var department = $("#department").val();
    var linkMan = $("#linkMan").val();
    var data = {
        "userId": buyer.$data.userInfoDTO.userId,
        //数据库表user_extends主键
        "extendId":buyer.$data.userInfoDTO.extendId,
        "userDTO.auditStatus":buyer.$data.userInfoDTO.userDTO.auditStatus,
        "userBusinessDTO.companyQualt":$("#companyQualt").val(),
        "userBusinessDTO.companyAddress":$("#company_province").val()+","+$("#company_city").val()+","+$("#company_area").val(),
        "userBusinessDTO.companyDeclinedAddress":$("#companyDeclinedAddress").val(),
        "userBusinessDTO.companyPeoNum":$("#companyPeoNum").val(),
        "userBusinessDTO.businessScale":$("#businessScale").val(),
        "userBusinessDTO.isFinancing":isFinancing,
        "userBusinessDTO.financingNum":$("#financingNum").val(),
        "userBusinessDTO.businessScope":businessScope
    }
    $.jsonAjax(getUrl("information/informationBuyer/modifyBuyer"), data, function (data, status, xhr) {
        if (data.status == "200") {
            popUp_auto(1000,data.msg);
            setTimeout("window.location = 'maiJiaRenZhengJiBenXinXi.html'",1500);
        } else {
            popUp_auto_false(1000,data.msg);
        }
    });
}
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
    //验证码校验
    $.jsonAjax(getUrl("captcha/checkCode"), {codeKey:buyer.$data.codeKey,
        code:buyer.$data.capthaCode}, function (data, status, xhr) {

        if(data){
            submitUpdate();
        }else{
            popUp_auto_false(1500,"短信验证码错误请重新输入");
        }
    });

}
function submitUpdate(){
    var data = {
        //数据库表user_extends主键
        "extendId":buyer.$data.userInfoDTO.extendId,
        //用户Id
        "userId": buyer.$data.userInfoDTO.userId,
        "userAccountDTO.bankAccountName":$("#bankAccountName").val(),
        "userAccountDTO.bankAccount":$("#bankAccount").val(),
        "userAccountDTO.bankName":$("#bankName").val(),
        "userAccountDTO.bankBranchJointLine":$("#bankBranchJointLine").val(),
        "userAccountDTO.bankBranchIsLocated":$("#bank_province").val()+","+$("#bank_city").val()+","+$("#bank_area").val(),
        "userAccountDTO.isCiticBank":buyer.$data.userInfoDTO.userAccountDTO.isCiticBank,
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
    window.location = '../../html/3_maiJiaRenZheng/maiJiaRenZhengJiBenXinXi.html';
}
function sendPhoneCaptcha(){
    $.jsonAjax(getUrl("captcha/send"),{address:buyer.$data.userDTO.umobile,
        type:2,
        smsType:'UPGOLDACCOUNT'
    },function(data,status,xhr){
        if(data.isOK == "1"){
            popUp_auto_false(3000,data.errorMessages);
        }else{
            countTime();
            buyer.$data.codeKey = data.codeKey;
            popUp_auto(3000,"短信已发送!");
        }
    })
}
// 获取验证码效果
function countTime() {
    var count = 90;
    window.countInterval = setInterval(function () {
        if (count >= 0) {
            $("#code_btn").attr("disabled", true).html(count + '秒');
            count--;
        } else {
            $("#code_btn").attr("disabled", false).html('获取验证码');
            window.clearInterval(countInterval);
        }
    }, 1000);
}