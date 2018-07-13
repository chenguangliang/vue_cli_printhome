$(function () {
    validateLianxirenForm();
    validateYingyezhizhaoForm();
    validateShuiwudengjiForm();
    validateZuzhijigouForm();
    validateTixianzhanghuForm();
    validateGongsijingyingForm();
})
//联系人信息修改
var userInfoDTO4xiugai ="";
var userDTO4xiugai ="";
var provinceList = "";
var cityList = "";
var areaList = "";
var comCityList = "";
var comAreaList = "";
var bankCityList = "";
var bankAreaList = "";
var busLicProvince = "";
var busLicCity = "";
var busLicArea = "";
var companyProvince = "";
var companyCity = "";
var companyArea = "";
var businessLicenceIndate = "";
var businessLicenceDate = "";

var sellerupdate = new Vue({
    el:"#sellerupdate",
    data:{
        userInfoDTO:{},
        userDTO:{},
        departmentData:[{code:"",label:"请选择"},{code:"XZB",label:"行政部"},{code:"CGB",label:"采购部"},{code:"SBB",label:"设备部"},{code:"JSB",label:"技术部"},{code:"SCB",label:"生产部"},
            {code:"FT",label:"财务部"},{code:"LT",label:"领导层"},{code:"QT",label:"其他"}],
        idCardTypeData:["内地居民身份证","香港身份证","台湾身份证","澳门身份证","军人证件","外籍身份证","护照（中国）","护照（外国）"],
        businessScopeData:["书刊印刷","包装印刷","数字印刷","商业印刷","报业印刷","标签印刷","票据印刷","特种印刷","广告设计","专项印刷","其他"],
        taxpayerTypeData:["一般纳税人","小规模纳税人","非增值税纳税人"],
        taxpayerCodeData:["0%","3%","6%","7%","11%","13%","17%"],
        dealerTypeData:[{code:"PP",label:"品牌商"},{code:"DL",label:"经销商"}],
        erpTypeData:[{code:"ZYERP",label:"自有ERP"},{code:"DSFERP",label:"第三方ERP代运营"},{code:"QT",label:"无"}],
        provinceList:[],
        cityList:[],
        areaList:[],
        comCityList:[],
        comAreaList:[],
        bankCityList:[],
        bankAreaList:[],
        busLicProvince:"",
        busLicCity:"",
        busLicArea:"",
        companyProvince:"",
        companyCity:"",
        companyArea:"",
        bankProvince:"",
        bankCity:"",
        bankArea:"",
        businessLicenceIndate:"",
        businessLicenceDate:"",
        isBusinessLicenceIndate:"",
    },
    mixins:[common,textRegular,math],
    beforeCreate: function () {
        $.jsonAjax(getUrl("information/informationSeller/loadSellerInfo"),{},function(data,status,xhr){
            if(data.status=="200"){
                // console.log(data.result)
                userDTO4xiugai = data.data.userDTO;
                userInfoDTO4xiugai = data.data.userInfoDTO;
                provinceList = data.data.provinceList;
                cityList = data.data.cityList;
                areaList = data.data.areaList;
                comCityList = data.data.comCityList;
                comAreaList = data.data.comAreaList;
                bankCityList = data.data.bankCityList;
                bankAreaList = data.data.bankAreaList;
                busLicProvince = data.data.busLicProvince;
                busLicCity = data.data.busLicCity;
                busLicArea = data.data.busLicArea;
                companyProvince = data.data.companyProvince;
                companyCity = data.data.companyCity;
                companyArea = data.data.companyArea;
                bankProvince = data.data.bankProvince;
                bankCity = data.data.bankCity;
                bankArea = data.data.bankArea;
                businessLicenceIndate = data.data.businessLicenceIndate;
                businessLicenceDate = data.data.businessLicenceDate;
            }else{
                window.location = '../../html/2_login_sign/login_common.html';
            }
        },false);
    },
    created: function () {
        this.$data.userDTO = userDTO4xiugai;
        this.$data.userInfoDTO = userInfoDTO4xiugai;
        this.$data.provinceList = provinceList;
        this.$data.cityList = cityList;
        this.$data.areaList = areaList;
        this.$data.comCityList = comCityList;
        this.$data.comAreaList = comAreaList;
        this.$data.bankCityList = bankCityList;
        this.$data.bankAreaList = bankAreaList;
        this.$data.busLicProvince = busLicProvince;
        this.$data.busLicCity = busLicCity;
        this.$data.busLicArea = busLicArea;
        this.$data.companyProvince = companyProvince;
        this.$data.companyCity = companyCity;
        this.$data.companyArea = companyArea;
        this.$data.bankProvince = bankProvince;
        this.$data.bankCity = bankCity;
        this.$data.bankArea = bankArea;
        this.$data.businessLicenceIndate = businessLicenceIndate;
        this.$data.businessLicenceDate = businessLicenceDate;
        if(businessLicenceIndate){
            this.$data.isBusinessLicenceIndate = '1';
        }else{
            this.$data.isBusinessLicenceIndate = '2';
        }
        
    },
    methods:{
        /*回到顶部*/
        goToTop: goToTop,
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
        changeProvince:function () {
            var parentCode = this.$data.busLicProvince;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                sellerupdate.$data.cityList = data;
                sellerupdate.$data.busLicCity = "";
                sellerupdate.$data.busLicArea = "";
            });
        },
        changeCity:function () {
            var parentCode = this.$data.busLicCity;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                sellerupdate.$data.areaList = data;
                sellerupdate.$data.busLicArea = "";
            });
        },
        changeComProvince:function () {
            var parentCode = this.$data.companyProvince;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                sellerupdate.$data.comCityList = data;
                sellerupdate.$data.companyCity = "";
                sellerupdate.$data.companyArea = "";
            });
        },
        changeComCity:function () {
            var parentCode = this.$data.companyCity;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                sellerupdate.$data.comAreaList = data;
                sellerupdate.$data.companyArea = "";
            });
        },
        changeBankProvince:function () {
            var parentCode = this.$data.bankProvince;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                sellerupdate.$data.bankCityList = data;
                sellerupdate.$data.bankCity = "";
                sellerupdate.$data.bankArea = "";
            });
        },
        changeBankCity:function () {
            var parentCode = this.$data.bankCity;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                sellerupdate.$data.bankAreaList = data;
                sellerupdate.$data.bankArea = "";
            });
        },
        changeIsFinacing:function (flag) {
            sellerupdate.$data.userInfoDTO.userBusinessDTO.isFinancing = flag;
        },
        changeIsSanzheng:function (flag) {
            sellerupdate.$data.userInfoDTO.userBusinessDTO.isSanzheng = flag;
        },
        changeIsCiticBank:function (flag) {
            sellerupdate.$data.userInfoDTO.userAccountDTO.isCiticBank = flag;
        },
        changeIsHaveEbusiness:function (flag) {
            sellerupdate.$data.userInfoDTO.userManageDTO.isHaveEbusiness = flag;
        },
        changeIsBusinessLicenceIndate:function (flag) {
            sellerupdate.$data.isBusinessLicenceIndate = flag;
            if(flag=='2'){
                sellerupdate.$data.businessLicenceIndate = '';
            }
        },
        changeBusinessScope:function (flag,businessScope) {
            var businessScopeStr = sellerupdate.$data.userInfoDTO.userBusinessDTO.businessScope;
            if(flag=='0'){
                businessScopeStr = businessScopeStr.replace(businessScope+",","");
            }else{
                businessScopeStr = businessScopeStr+businessScope+",";
            }
            sellerupdate.$data.userInfoDTO.userBusinessDTO.businessScope=businessScopeStr;
        },
        showImg:function (event) {
            var url = $(event.currentTarget).attr("src");
            $("#imgDiv").attr("src",url);
            $(".showBigImg").show();
        },
        hideImg:function () {
            $("#imgDiv").attr("src",'');
            $(".showBigImg").hide();
        }
    }
});
//联系人
function validateLianxirenForm() {

    $("#lianxiren_form").validate({
        rules: {
            linkPhoneNum: {
                required: true
            },
            department: {
                required: true
            },
            linkMan: {
                required: true
            }
        }
    });
}
//营业执照
function validateYingyezhizhaoForm() {
    $("#yingyezhizhao_form").validate({
        rules: {
            artificialPersonName: {
                required: true
            },
            registeredCapital: {
                required: true
            },
            idCardType: {
                required: true
            },
            idCardNum: {
                required: true
            },
            busLicProvince: {
                required: true
            },
            busLicCity: {
                required: true
            },
            busLicArea: {
                required: true
            },
            businessLicencAddressDetail: {
                required: true
            },
            businessLicenceDate: {
                required: true
            },
            companyPhone: {
                required: true
            },
            linkman: {
                required: true
            },
            linkmanPhone: {
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
            },
            companyDeclinedAddress: {
                required: true
            },
        }
    });
}
//税务登记
function validateShuiwudengjiForm() {

    $("#shuiwudengji_form").validate({
        rules: {
            taxManId: {
                required: true
            },
            taxpayerType: {
                required: true
            },
            taxpayerCode: {
                required: true
            }
        }
    });
}
//组织机构
function validateZuzhijigouForm() {

    $("#zuzhijigou_form").validate({
        rules: {
            organizationId: {
                required: true
            },
            userfulTime: {
                required: true
            }
        }
    });
}
//公司经营
function validateGongsijingyingForm() {

    $("#gongsijingying_form").validate({
        rules: {
            dealerType: {
                required: true
            },
            webOperaPeo: {
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
    var linkPhoneNum = $("#linkPhoneNum").val();
    var department = $("#department").val();
    var linkMan = $("#linkMan").val();
    var data = {
        "userId": userId,
        "userDTO.uid": userId,
        "userDTO.linkPhoneNum": linkPhoneNum,
        "userDTO.linkMan": linkMan,
        "userDTO.department": department,
        editType: 1
    }
    $.jsonAjax(getUrl("information/informationSeller/modifySeller"), data, function (data, status, xhr) {
        if (data.status == "200") {
            printAlert(data.message);
            window.location = '14_zhangHuSheZhi_lianXiRenXinXi.html';
        } else {
            popUp_auto_false(1000,data.message);

        }
    });
}
//修改营业执照
function updateYingyezhizhao() {

    //验证校验
    var isValid = $("#yingyezhizhao_form").valid();
    
    if (!isValid) {
        return;
    }
    //经营范围
    var businessScope = sellerupdate.$data.userInfoDTO.userBusinessDTO.businessScope;
    if(businessScope==""){
        popUp_auto_false(1000,"请选择经营范围!");
        return;
    }
    //是否融资
    var isFinancing = sellerupdate.$data.userInfoDTO.userBusinessDTO.isFinancing;
    if(isFinancing=='1'){
        var financingNum = $("#financingNum").val();
        if(financingNum==''){
            popUp_auto_false(1000,"请填写期望融资额度!");
            return;
        }
    }
    //是否多证合一
    var isSanzheng = sellerupdate.$data.userInfoDTO.userBusinessDTO.isSanzheng;
    if(isSanzheng=='1'){
        var unifiedCreditCode = $("#unifiedCreditCode").val();
        if(unifiedCreditCode==''){
            popUp_auto_false(1000,"请输入社会信用代码证!");
            return;
        }
    }else if(isSanzheng=='0'){
        var businessLicenceId = $("#businessLicenceId").val();
        if(businessLicenceId==''){
            popUp_auto_false(1000,"请输入注册号(营业执照)!");
            return;
        }
    }
    //是否长期有效
    var isBusinessLicenceIndate = sellerupdate.$data.isBusinessLicenceIndate;
    if(isBusinessLicenceIndate=='2'){
        // $("businessLicenceIndate").val("");
    }else{
        var businessLicenceIndate = $("#businessLicenceIndate").val();
        if(businessLicenceIndate==''){
            popUp_auto_false(1000,"请输入营业执照有效期!");
            return;
        }
    }
    var userId = $("#userId").val();
    var artificialPersonName = $("#artificialPersonName").val();
    var registeredCapital = $("#registeredCapital").val();
    var linkMan = $("#linkMan").val();
    var businessLicenceDate =$("#businessLicenceDate").val();
    var businessLicenceIndate =$("#businessLicenceIndate").val();
    if($("#businessLicenceDate").val()){
        businessLicenceDate = new Date($("#businessLicenceDate").val());
    }
    if($("#businessLicenceIndate").val()){
        businessLicenceIndate = new Date($("#businessLicenceIndate").val());
    }
    var data = {
        //数据库表user_extends主键
        "extendId":sellerupdate.$data.userInfoDTO.extendId,
        //用户Id
        "userId": $("#userId").val(),
        //2法定代表人姓名
        "userBusinessDTO.artificialPersonName": $("#artificialPersonName").val(),
        //1注册资本
        "userBusinessDTO.registeredCapital": $("#registeredCapital").val(),
        //新增字段：证件类型
        "userBusinessDTO.idCardType": $("#idCardType").val(),
        //3证件号码（原：身份号码）
        "userBusinessDTO.idCardNum": $("#idCardNum").val(),
        //7经营范围
        "userBusinessDTO.businessScope": businessScope,
        //8营业执照所在地
        "userBusinessDTO.businessLicenceAddress": $("#busLicProvince").val()+","+$("#busLicCity").val()+","+$("#busLicArea").val(),
        //9营业执照详细地址
        "userBusinessDTO.businessLicencAddressDetail":$("#businessLicencAddressDetail").val(),
        //10成立日期
        "userBusinessDTO.businessLicenceDate":businessLicenceDate,
        //11公司电话
        "userBusinessDTO.companyPhone":$("#companyPhone").val(),
        //12紧急联系人
        "userBusinessDTO.linkman":$("#linkman").val(),
        //13紧急联系人手机
        "userBusinessDTO.linkmanPhone":$("#linkmanPhone").val(),
        //14公司所在地
        "userBusinessDTO.companyAddress":$("#company_province").val()+","+$("#company_city").val()+","+$("#company_area").val(),
        //15公司详细地址
        "userBusinessDTO.companyDeclinedAddress":$("#companyDeclinedAddress").val(),
        //16企业是否有融资需求isFinancing
        "userBusinessDTO.isFinancing":isFinancing,
        //17期望融资额度
        "userBusinessDTO.financingNum":$("#financingNum").val(),
        //是否三证合一
        "userBusinessDTO.isSanzheng":isSanzheng,
        //统一社会信用代码
        "userBusinessDTO.unifiedCreditCode":$("#unifiedCreditCode").val(),
        //营业执照
        "userBusinessDTO.businessLicenceId":$("#businessLicenceId").val(),
        //5营业执照有效期
        "userBusinessDTO.businessLicenceIndate":businessLicenceIndate,
        //6营业执照是否长期有效
        "userBusinessDTO.neverExpires":isBusinessLicenceIndate,
        "userBusinessDTO.businessLicencePicSrc":$("#businessLicencePicSrc").val(),
        "userBusinessDTO.artificialPersonPicSrc":$("#artificialPersonPicSrc").val(),
        "userBusinessDTO.artificialPersonPicBackSrc":$("#artificialPersonPicBackSrc").val(),
        //营业执照信息
        editType:2
    }
    console.log(data.businessLicenceAddress)
    $.jsonAjax(getUrl("information/informationSeller/modifySeller"), data, function (data, status, xhr) {
        if (data.status == "200") {
            printAlert(data.message,function () {
                window.location = '14_zhangHuSheZhi_yingYeZhiZhaoXinXi.html';
            });
        } else {
            popUp_auto_false(1000,data.message);
        }
    });
}
//修改税务登记证信息
function updateShuiWuDengJiZheng() {
    //验证校验
    var isValid = $("#shuiwudengji_form").valid();
    if (!isValid) {
        return;
    }
    var data = {
        //数据库表user_extends主键
        "extendId":sellerupdate.$data.userInfoDTO.extendId,
        //用户Id
        "userId": sellerupdate.$data.userInfoDTO.userId,
        "userTaxDTO.taxpayerCode": $("#taxpayerCode").val(),
        "userTaxDTO.taxManId": $("#taxManId").val(),
        "userTaxDTO.taxpayerType": $("#taxpayerType").val(),
        editType: 4,
    };
    $.jsonAjax(getUrl("information/informationSeller/modifySeller"), data, function (data, status, xhr) {
        if (data.status == "200") {
            printAlert(data.message);
            window.location = '14_zhangHuSheZhi_yingYeZhiZhaoXinXi.html';
        } else {
            popUp_auto_false(1000,data.message);
        }
    });
}
//修改组织机构代码信息
function updateZuzhijigou() {
    //验证校验
    var isValid = $("#zuzhijigou_form").valid();
    if (!isValid) {
        return;
    }
    var data = {
        //数据库表user_extends主键
        "extendId":sellerupdate.$data.userInfoDTO.extendId,
        //用户Id
        "userId": sellerupdate.$data.userInfoDTO.userId,
        "userOrganizationDTO.organizationId": $("#organizationId").val(),
        "userOrganizationDTO.userfulTime": $("#userfulTime").val(),
        editType: 3,
    };
    $.jsonAjax(getUrl("information/informationSeller/modifySeller"), data, function (data, status, xhr) {
        if (data.status == "200") {
            printAlert(data.message);
            window.location = '14_zhangHuSheZhi_yingYeZhiZhaoXinXi.html';
        } else {
            popUp_auto_false(1000,data.message);
        }
    });
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
        "extendId":sellerupdate.$data.userInfoDTO.extendId,
        //用户Id
        "userId": sellerupdate.$data.userInfoDTO.userId,
        "userAccountDTO.bankAccountName":$("#bankAccountName").val(),
        "userAccountDTO.bankAccount":$("#bankAccount").val(),
        "userAccountDTO.bankName":$("#bankName").val(),
        "userAccountDTO.bankBranchJointLine":$("#bankBranchJointLine").val(),
        "userAccountDTO.bankBranchIsLocated":$("#bank_province").val()+","+$("#bank_city").val()+","+$("#bank_area").val(),
        "userAccountDTO.isCiticBank":sellerupdate.$data.userInfoDTO.userAccountDTO.isCiticBank,
        "userAccountDTO.bankAccountPermitsPicSrc":$("#bankAccountPermitsPicSrc").val(),
        editType: 6,
    };
    $.jsonAjax(getUrl("information/informationSeller/modifySeller"), data, function (data, status, xhr) {
        if (data.status == "200") {
            printAlert(data.message);
            window.location = '14_zhangHuSheZhi_tiXianZhangHuXinXi.html';
        } else {
            popUp_auto_false(1000,data.message);
        }
    });
}
//公司经营信息
function updateGongsijingying() {
    //验证校验
    var isValid = $("#gongsijingying_form").valid();
    if (!isValid) {
        return;
    }
    var data = {
        //数据库表user_extends主键
        "extendId":sellerupdate.$data.userInfoDTO.extendId,
        //用户Id
        "userId": sellerupdate.$data.userInfoDTO.userId,
        "userManageDTO.dealerType":$("#dealerType").val(),
        "userManageDTO.isHaveEbusiness":sellerupdate.$data.userInfoDTO.userManageDTO.isHaveEbusiness,
        "userManageDTO.webOperaPeo":$("#webOperaPeo").val(),
        "userManageDTO.homePage":$("#homePage").val(),
        "userManageDTO.saleNum":$("#saleNum").val(),
        "userManageDTO.erpType":$("#erpType").val(),
        "editType":5
    };
    $.jsonAjax(getUrl("information/informationSeller/modifySeller"), data, function (data, status, xhr) {
        if (data.status == "200") {
            printAlert(data.message);
            window.location = '14_zhangHuSheZhi_gongSiJingYingXinXi.html';
        } else {
            popUp_auto_false(1000,data.message);
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
    
    // var checkUploadKey = getRandom();
    // popUp_open();
    // $.ajaxFileUpload({
    //     url:getUrl('fileUpload/fixedUploadCrossDomain?date='+new Date().getTime()), //用于文件上传的服务器端请求地址
    //     secureuri: false, //是否需要安全协议，一般设置为false
    //     fileElementId: fileElementId, //文件上传域的ID
    //     dataType: 'json', //返回值类型 一般设置为json
    //     data:{
    //         size:1048576,
    //         checkUploadKey: checkUploadKey,
    //     },
    //     type:"post",
    //     success: function (data, status){  //服务器成功响应处理函数
    //         popUp_close();
    //         if(data.success){
    //             if(!data.url || data.url==null || data.url==""){
    //                 popUp_auto_false(1000,"图片上传失败，请重新上传！");
    //                 $("#"+showImg).attr("src","");
    //                 return;
    //             }
    //             $("#"+showImg).attr("src",getImgUrl(data.result));
    //             $("#"+urlInput).val(data.url);
    //             $("#"+fileElementId).val("");
    //
    //         }else{
    //             popUp_auto_false(1000,data.errorMessages);
    //         }
    //     },
    //     error: function (data, status, e){//服务器响应失败处理函数
    //         $.jsonAjax(getUrl("fileUpload/fixedUploadCrossDomainResult"),{checkUploadKey:checkUploadKey},function(data, status, e){
    //             /**
    //                     errorMessages  错误信息
    //                     result         上传url
    //                     resultMessage  成功信息
    //                     success        成功状态
    //              */
    //             // console.log(data)
    //             popUp_close();
    //             if(data.success){
    //                 if(!data.result || data.result==null || data.result==""){
    //                     popUp_auto_false(1000,"图片上传失败，请重新上传！");
    //                     $("#"+showImg).attr("src","");
    //                     return;
    //                 }
    //                 $("#"+showImg).attr("src",getImgUrl(data.result));
    //                 $("#"+urlInput).val(data.result);
    //                 $("#"+fileElementId).val("");
    //
    //             }else{
    //                 popUp_auto_false(1000,data.errorMessages);
    //             }
    //         });
    //     }
    });
};
//图片上传
function fileChange(fileInputId,showImgId,urlInput){
    startUpload(fileInputId,showImgId,urlInput);
}
function getRandom(){
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for(var i = 0; i < 4 ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return new Date().getTime() + res;
}