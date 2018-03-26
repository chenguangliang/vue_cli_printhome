var reg = /^1[3|4|5|7|8]\d{9}$/;
var reg2 = /^\d{4}$/;
var reg3 = /^\d{1,11}$/;
/**
 *@fileName:login.js
 *@author:cgl
 *@time:2017/2/17 0017
 *@disc:手机号校验错误需要呈现的样式
 */
function checkPhoneWrongStyle(errorMessage) {
    $('.phoneNumber').removeClass("ccc_border").addClass("red_border").children(".warm").show();
    $(".numberTip").show().html(errorMessage);
    return false;
}
/**
 *@fileName:login.js
 *@author:cgl
 *@time:2017/2/17 0017
 *@disc:图片验证码校验错误需要呈现的样式
 */
function checkImgWrongStyel() {
    $('.tpInput').removeClass("ccc_border").addClass("red_border").children(".warm").show();
    $('.numberTip').show().html('图片验证码输入错误');
    return false;
}
/**
 *@fileName:login.js
 *@author:cgl
 *@time:2017/2/17 0017
 *@disc:短信验证码校验错误需要呈现的样式
 */
function checkMsgWrongStyel() {
    $('.dxInput').removeClass("ccc_border").addClass("red_border").children(".warm").show();
    $('.numberTip').show().html('短信验证码输入错误');
    return false;
}
/**
 *@fileName:sign.js
 *@author:fdc
 *@time:2017/2/28 0028
 *@disc:小管家快速注册
 */

/*$(function () {
    getImgcaptcha();
});*/


/**
 *@fileName:phonelogin.js
 *@author:fdc
 *@time:2017/2/20 0020
 *@disc:获取图片验证
 */
function getImgcaptcha() {
    var img = document.getElementById("changeTP");
    img.src = getUrl("user/acquire?type=phone_login&a=" + new Date());
}

/**
 *@fileName:phonelogin.js
 *@author:cgl
 *@time:2017/4/20
 *@disc:发送手机验证码倒计时
 */
function countTime() {
    var count = 90;
    window.countInterval = setInterval(function () {
        if (count >= 0) {
            $("#btn").attr("disabled", true).html(count + '秒');
            count--;
        } else {
            $("#btn").attr("disabled", false).html('接收验证码');
            window.clearInterval(countInterval);
        }
    }, 1000);
}
/**
 *@fileName:login.js
 *@author:cgl
 *@time:2017/5/3
 *@disc:当输入手机号后检测是否已经注册
 */
function checkPhoneRepeat() {
    var a;
    if($("#phoneNumber").val().length==11){
        var phoneAreaCode = phoneNumVM.$data.areacode;
        var phone = $("#phoneNumber").val();
        if(phoneAreaCode == '86'){
            if (!reg.test(phone)) {
                checkPhoneWrongStyle('手机号码输入有误，请输入正确的11位手机号');
                return false;
            }
        }else{
            if(!reg3.test(phone)){
                checkPhoneWrongStyle('手机号码输入有误，请输入正确的手机号');
                return false;
            }
        }
        $.jsonAjax(getUrl("information/register/checkPhone"), {mobile: phone},
            function (data, status, xhr) {
                if (data.resultData) {
                    $('.numberTip').show().html('该手机号已经注册，请直接登录!');
                    popUp_auto_false(1500,"该手机号已经注册，请直接登录!");
                    a=0;
                }else{
                    a=1;
                }
            },false);
    }else{
        $(".numberTip").hide();
    }
    return a;
}

/**
 *@fileName:phonelogin.js
 *@author:fdc
 *@time:2017/2/21 0021
 *@disc:发送手机验证码
 */
function sendPhoneCaptcha() {
    if(!checkPhoneRepeat()){
        return false;
    }
    var phoneAreaCode = phoneNumVM.$data.areacode;
    var phone = $("#phoneNumber").val();
    //var picCaptcha = $("#numberPic").val();
    if(phoneAreaCode == '86'){
        if (!reg.test(phone)) {
            checkPhoneWrongStyle('手机号码输入有误，请输入正确的11位手机号');
            return false;
        }
    }else{
        if(!reg3.test(phone)){
            checkPhoneWrongStyle('手机号码输入有误，请输入正确的手机号');
            return false;
        }
    }
    //非大陆手机号拼接手机号格式：00+区号+手机号
    if(phoneAreaCode != '86'){
        phone = "00" + phoneAreaCode + phone;
    }
    /*if (!reg2.test(picCaptcha)) {
        checkImgWrongStyel();
        return false;
    }*/

    $.jsonAjax(getUrl("captcha/sendPhoneMessage"), {
        contact: phone, type: 2,picCaptchaType: "phone_sign"
    }, function (data, status, xhr) {
        if (data.success) {
            popUp_auto(3000, "短信已发送!");
            countTime();
        } else {
            /*checkImgWrongStyel();*/
            popUp_auto_false(3000, data.errorMessages);
        }
    })
}


/**
 *@fileName:login.js
 *@author:fdc
 *@time:2017/2/17 0017
 *@disc:登录方法
 */
function register() {
    if(!checkPhoneRepeat()){
        return false;
    }
    var phoneAreaCode = phoneNumVM.$data.areacode;
    var phone = $("#phoneNumber").val();
    //var picCaptcha = $("#numberPic").val();
    var loginCodeKey = $("#dxYz").val();
    if(phoneAreaCode == '86'){
        if (!reg.test(phone)) {
            checkPhoneWrongStyle('手机号码输入有误，请输入正确的11位手机号');
            return false;
        }
    }else{
        if(!reg3.test(phone)){
            checkPhoneWrongStyle('手机号码输入有误，请输入正确的手机号');
            return false;
        }
    }
    /*if (!reg2.test(picCaptcha)) {
        checkImgWrongStyel();
        return false;
    }*/
    if(!reg2.test(loginCodeKey)){
        checkMsgWrongStyel();
        return false;
    }
    $.jsonAjax(getUrl("information/register/register"), {
        areaCode:phoneAreaCode,
        phone: phone,
        loginCodeKey: loginCodeKey
    }, function (data, status, xhr) {
        if (data.success) {
            //获取用户信息
            StorageUtil.setUserInfo();
            window.location = '../../html/2_login_sign/signSuccess.html';
        } else {
            /*if(data.errorMessages=="图片验证码错误"){
                checkImgWrongStyel();
            }else */if(data.errorMessages=="短信验证码错误"){
                checkMsgWrongStyel();
            }
            popUp_auto_false(3000, data.errorMessages);
            if(data.errorMessages[0].indexOf("已经注册")!=-1){
                $('.numberTip').show().html('该手机号已经注册，请直接登录!');
            }
        }
    });
}
function jqueryCase(){
    //输入框聚焦，隐藏对应的错误样式
    $("#phoneNumber").focus(function () {
        $(this).siblings(".warm").hide();
        $(".numberTip").hide();
        $(".phoneNumber ").removeClass("red_border").addClass("ccc_border");
    });

}

$("#numberPic").focus(function () {
    $(this).siblings(".warm").hide();
    $(".numberTip").hide();
    $(".tpInput ").removeClass("red_border").addClass("ccc_border");
});
$("#dxYz").focus(function () {
    $(this).siblings(".warm").hide();
    $(".numberTip").hide();
    $(".dxInput").removeClass("red_border").addClass("ccc_border");
});

var areaCodeOut = $.getUrlParam("areaCode");
var phoneNumVM = new Vue({
    el:"#phoneNum",
    data:{
        areacode:'86'
    },
    methods:{
        showGuoJiPage: function () {
            window.location = "../../html/2_login_sign/guoJiShouJiHao.html?type=sign";
        },
        checkPhoneRepeat:checkPhoneRepeat,
        sendPhoneCaptcha:sendPhoneCaptcha
    },
    beforeMount:function(){
        if(null != areaCodeOut && ''!=areaCodeOut){
            this.areacode = areaCodeOut;
        }
    },
    mounted:function(){
        jqueryCase();
    }
})