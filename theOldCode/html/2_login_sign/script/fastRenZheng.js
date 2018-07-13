/**
*@fileName:fastRenZheng.js
*@author:fdc
*@time:2017/2/28 0028
*@disc:买家快速认证js
*/


$(function(){
    var companyName = /^[\u4e00-\u9fa5a-zA-Z0-9_\-\—\\(\\)\\（\\）|\w]{4,40}$/;
    var linkMan = /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;
    var youXiang=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    $('.companyName').blur(function(){
        if(
            !companyName.test($(this).val()) &&
            $(this).val() !=0
        ){
            $(this).parent().next('.warm').removeClass("none");
            $(this).removeClass("ccc_border");
            $(this).addClass("red_border");
            $(this).removeClass("gray_word");
            $(this).addClass("red_word");
        }else{
            $(this).parent().next('.warm').addClass("none");
            $(this).removeClass("red_border");
            $(this).addClass("ccc_border");
            $(this).removeClass("red_word");
            $(this).addClass("gray_word");
        }
    });
    $('.companyName').focus(function(){
        $(this).parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    });
    $('.linkMan').blur(function(){
        if(
            !linkMan.test($(this).val()) &&
            $(this).val() !=0
        ){
            $(this).parent().next('.warm').removeClass("none");
            $(this).removeClass("ccc_border");
            $(this).addClass("red_border");
            $(this).removeClass("gray_word");
            $(this).addClass("red_word");
        }else{
            $(this).parent().next('.warm').addClass("none");
            $(this).removeClass("red_border");
            $(this).addClass("ccc_border");
            $(this).removeClass("red_word");
            $(this).addClass("gray_word");
        }
    });
    $('.linkMan').focus(function(){
        $(this).parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    });
    $('.MailInput').blur(function(){
        if(
            !youXiang.test($(this).val()) &&
            $(this).val() !=0
        ){
            $(this).parent().next('.warm').removeClass("none");
            $(this).removeClass("ccc_border");
            $(this).addClass("red_border");
            $(this).removeClass("gray_word");
            $(this).addClass("red_word");
        }else{
            $(this).parent().next('.warm').addClass("none");
            $(this).removeClass("red_border");
            $(this).addClass("ccc_border");
            $(this).removeClass("red_word");
            $(this).addClass("gray_word");
        }
    });
    $('.MailInput').focus(function(){
        $(this).parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    });
    $(".tijiao").click(function (e) {
        if (
            companyName.test($('.companyName').val()) &&
            linkMan.test($('.linkMan').val()) &&
            $('input[type=checkbox]').next("label").hasClass('dianji')
        ) {
            $('.regist_item').next('.warm').hide();
        }
        else{
            e.preventDefault();
        }
        if (
            companyName.test($('.companyName').val()) &&
            linkMan.test($('.linkMan').val()) &&
            ! $('input[type=checkbox]').next("label").hasClass('dianji')
        ) {
            $('.regist_item').next('.warm').show();
        }
    });
//点击经营范围
    $('input[type=checkbox]').click(function(){
        if($(this).next("label").hasClass('chushi')){
            $(this).next("label").removeClass('chushi').addClass('dianji');

        }else{
            $(this).next("label").removeClass('dianji').addClass('chushi');
        }
        $('.regist_item').next('.warm').hide();
    });
    
    $(".rongZi img").click(function (e) {
        this.src="../../img/yes-select.png";
        $(this).siblings()[0].src="../../img/no-select.png";
        $(this).siblings()[1].src="../../img/no-select.png";
    });


    $.jsonAjax(getUrl("information/register/initBuyerAuth"), {}, function (data, status, xhr) {
        if (data.success) {
         //   vm.$data.userInfo = data.result.userInfo;
            vm.$data.keyEnterpriseRegisterDuplicateRedis = data.result.keyEnterpriseRegisterDuplicateRedis;
            // console.log(data.result);
            // console.log(vm.$data.userInfo);
        }
    },false);
    
});

//接收验证码倒计时
var count =60;
function test(){
    count--;
    if(count >= 0) {
        $('.captchaBtn').val(count+'秒');
    } else {
        clearTimeout(jsqs);
        $('.captchaBtn').val('接收验证码');
        $(".captchaBtn").attr("disabled",false);
        $('.captchaBtn').css('background-color','#e60012');
        count=60;
    }
}
function jsq(){
    $(".captchaBtn").attr("disabled",true);
    $('.captchaBtn').css('background-color','#ccc');
    popUp_auto(1000,'验证信息已发送','请查收');
    window.jsqs = setInterval(test,1000);
}

function sendCaptcha(type) {
    //发送验证码
    var selected = 1;
    var contact = vm.userInfoDTO.userDTO.userEmail;
    if(contact==null || contact == ""){
    	popUp_auto_false(1000, "请填写邮箱");
        return;
    }else{
    	var chrnum = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
    	if(!chrnum.test(contact)){
    		popUp_auto_false(1000, "请输入正确的邮箱");
    		return;
    	}
    }
    var picCaptchaType = "bang_email";
    $.jsonAjax(getUrl("information/informationSeller/sednEmailNotic"), {picCaptchaType: picCaptchaType,contact: contact,type: selected,picCaptcha: ""},
        function (data, status, xhr) {
            if (data.success) {
                popUp_auto(1000, "短信已发送!");
                jsq();
            } else {
                popUp_auto_false(1000, data.errorMessages);
            }
    });
}
//验证验证码
function checkCaptcha(type){
    var captcha = $("#captcha_id").val();
    var contact = vm.userInfoDTO.userDTO.userEmail;
    var data = {captcha:captcha,contact:contact};
    $.jsonAjax(getUrl("captcha/checkCaptcha"),data,function(data,status,xhr) {
        if(data.status == '200'){
            if(data.data){
                vm.submit();
            }else{
                popUp_auto_false(1000, "验证码不正确");
                return;
            }
        }else{
            popUp_auto_false(1000, "验证码不正确");
            return;
        }
    },false);
}

var comAreaList = "";
var provinceList = "";
var comCityList = "";
var companyProvince = "";
var provinceList = "";
var vm = new Vue({
    el:"#auth",
    data:{
        keyEnterpriseRegisterDuplicateRedis:"",
        userInfoDTO:{
            userBusinessDTO :{
                businessScope:"",
                companyName:""
            },
            userDTO:{
                linkMan:"",
                userEmail:""
            }
        },
		comAreaList:[],
		provinceList:[],
		comCityList:[],
		companyProvince:"",
        companyCity:"",
        companyArea:"",
        
    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("information/informationSeller/getAreaInfo"),{},function(data,status,xhr){
            if(status=="success"){
                // console.log(data.result)
                provinceList = data.provinceList;
                comCityList = data.comCityList;
                comAreaList = data.comAreaList;
            }else{
                //window.location = '../../html/2_login_sign/login_common.html';
            }
        },false);
    },
    created: function () {
        this.$data.provinceList = provinceList;
        this.$data.comCityList = comCityList;
        this.$data.comAreaList = comAreaList;
        this.$data.userInfoDTO.userBusinessDTO.tradeType = 0;
    },
    methods:{
    	tradeTypeChange:function (flag) {
    		this.$data.userInfoDTO.userBusinessDTO.tradeType = flag;
        },
        changeComProvince:function () {
        	var temp = this;
            var parentCode = temp.$data.companyProvince;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
            	temp.$data.comCityList = data;
            	temp.$data.companyCity = "";
                temp.$data.companyArea = "";
            });
        },
        changeComCity:function () {
        	var temp = this;
            var parentCode = temp.$data.companyCity;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
            	temp.$data.comAreaList = data;
                temp.$data.companyArea = "";
            });
        },
        submit:function(e){
            var temp = this;
            var companyName = temp.userInfoDTO.userBusinessDTO.companyName;
            if(companyName == null || companyName == ''){
                popUp_auto_false(1000, "公司名称不能为空");
                return;
            }
            var linkMan = temp.userInfoDTO.userDTO.linkMan;
            if(linkMan == null || linkMan == ''){
                popUp_auto_false(1000, "联系人姓名");
                return;
            }
            var isCheck = false;
            $("#business_scope label").each(function() {
                var classVal = $(this).attr("class");
                if(classVal == "dianji"){
                    isCheck = true;
                    return false;
                }
            });
            if(!isCheck){
                //popUp_auto_false(1000, "请选择经营范围");
                //return;
            }
            
            if($("#company_province").val()=="" || $("#company_city").val()=="" || $("#company_area").val()==""){
            	popUp_auto_false(1000, "请选择所在地");
                return;
            }
            
            var companyDeclinedAddress = temp.userInfoDTO.userBusinessDTO.companyDeclinedAddress;
            if(companyDeclinedAddress==null ||companyDeclinedAddress==""){
            	popUp_auto_false(1000, "请填写公司地址");
                return;
            }
            
            var artificialPersonName = temp.userInfoDTO.userBusinessDTO.artificialPersonName;
            if(artificialPersonName==null ||artificialPersonName==""){
            	popUp_auto_false(1000, "请填写法人姓名");
                return;
            }
            
            var businessLicenceId = temp.userInfoDTO.userBusinessDTO.businessLicenceId;
            if(businessLicenceId==null ||businessLicenceId==""){
            	popUp_auto_false(1000, "请填写营业执照");
                return;
            }
            //邮箱校验
            var mallVal=$(".MailInput").val()
            var mailChrnum = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            if(mallVal){
                if(!mailChrnum.test(mallVal)){
                    popUp_auto_false(1500, "邮箱格式不正确！");
                    return;
                }
            }


            var email = temp.userInfoDTO.userDTO.userEmail;
            if(email==null || email == ""){
            	popUp_auto_false(1000, "请填写邮箱");
                return;
            }else{
            	var chrnum = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
            	if(!chrnum.test(email)){
            		popUp_auto_false(1000, "请输入正确的邮箱");
            		return;
            	}
            }
            
            var captcha = $("#captcha_id").val();
            if(captcha==null || captcha == ""){
            	popUp_auto_false(1000, "请填写验证码");
                return;
            }
            
            //公司地址
            temp.$data.userInfoDTO.userBusinessDTO.companyAddress = $("#company_province").val()+","+$("#company_city").val()+","+$("#company_area").val();
            popUp_open();
            $('label[class="dianji"]').each(function(){
                temp.$data.userInfoDTO.userBusinessDTO.businessScope += $(this).attr("data-name") + ",";
            });
            console.dir(temp.$data);
            var param = {captcha:captcha,contact:email};
            //校验公司名称可用于注册（不能重复）
            $.jsonAjax(getUrl("information/register/verifyEnterpriseName"),{"userBusinessDTO.companyName":temp.$data.userInfoDTO.userBusinessDTO.companyName},function(data,status,xhr) {
            	
            	if(data.result){
            		//验证码
                	$.jsonAjax(getUrl("captcha/checkCaptcha"),param,function(data,status,xhr) {
                        if(data.status == '200'){
                            if(data.data){
                            	//popUp_auto_false(1000, "可以提交");
                            	$.jsonStringAjaxPost(getUrl("information/register/submitEnterpriseWx"),temp.$data, function (data, status, xhr) {
        	                        popUp_close();
        	                        if (data.success) {
        	                            //获取用户信息
        	                            StorageUtil.setUserInfo();
        	                            window.location = '../../html/2_login_sign/fastRenZhengSuccess.html';
        	                        }else{
        	                            popUp_auto_false(3000,data.errorMessages);
        	                        }
                            	});
                            }else{
                            	popUp_close();
                                popUp_auto_false(1000, "验证码不正确");
                                return;
                            }
                        }else{
                        	popUp_close();
                            popUp_auto_false(1000, "验证码不正确");
                            return;
                        }
                    },false);
            	}else{
            		popUp_close();
            		$(".zhezhao").show();
            	}
            },false);
        }
    }
});