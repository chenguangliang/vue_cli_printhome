//先获取一下图片验证码
/*$(function () {
    getImgcaptcha();
});*/

//校验手机号和4位短息验证码的正则
var reg = /^1[3|4|5|7|8]\d{9}$/;
var reg2 = /^\d{4}$/;
var reg3 = /^\d{1,11}$/;
/**
 *@fileName:login.js
 *@author:cgl
 *@time:2017/2/17 0017
 *@disc:手机号校验错误需要呈现的样式
 */
function checkPhoneWrongStyle() {
    $('.phoneNumber').css('border-color', '#e60012');
    $('#phoneNumber').css('color', '#e60012');
    $('.phoneNumber .warm').show();
    $('.errorTip').show().html('手机号码输入有误，请输入正确的手机号');
    //$('.errorTip').show().html('手机号码输入有误，请输入正确的11位手机号');
    return false;
}
/**
 *@fileName:login.js
 *@author:cgl
 *@time:2017/2/17 0017
 *@disc:图片验证码校验错误需要呈现的样式
 */
function checkImgWrongStyel() {
    $('.tpInput').css('border-color', '#e60012');
    $('#numberPic').css('color', '#e60012');
    $('.tpInput .warm').show();
    $('.errorTip').show().html('图片验证码输入错误');
    return false;
}
/**
 *@fileName:login.js
 *@author:cgl
 *@time:2017/2/17 0017
 *@disc:短信验证码校验错误需要呈现的样式
 */
function checkMsgWrongStyel() {
    $('#dxYz').css({'color':'#e60012'});
    $('.dxInput').css({'border-color':'#e60012'});
    $('.dxInput .warm').show();
    $('.errorTip').show().html('短信验证码输入错误');
    return false;
}
/**
 *@fileName:login.js
 *@author:fdc
 *@time:2017/2/17 0017
 *@disc:登录方法
 */
function phonelogin() {
    var phoneAreaCode = phoneNumVM.$data.areacode;
    var phone = $("#phoneNumber").val();
    //var picCaptcha = $("#numberPic").val();
    var loginCodeKey = $("#dxYz").val();
    if((phoneAreaCode == '86' && !reg.test(phone))
        ||(phoneAreaCode != '86' && !reg3.test(phone))){
        checkPhoneWrongStyle();
        return false;
    }
   /* if(!reg2.test(picCaptcha)){
        checkImgWrongStyel();
    }*/
    if(!reg2.test(loginCodeKey)){
        checkMsgWrongStyel();
    }
    $.jsonAjax(getUrl("information/register/registOrLogin"), {
        areaCode:phoneAreaCode,
        phone: phone,
        loginCodeKey: loginCodeKey,
        picCaptchaType: "phone_login"
    }, function (data, status, xhr) {
        if (data.success) {
            //获取用户信息
            StorageUtil.setUserInfo();
            //设置用户区域信息
            setLoginSuccessRegion();
            window.location = '../../html/2_login_sign/loginSuccess.html';
        } else {
           /* if(data.errorMessages=="图片验证码错误"){
                checkImgWrongStyel();
            }else*/ if(data.errorMessages=="短信验证码错误"){
                checkMsgWrongStyel();
            }
            popUp_auto_false(3000, data.errorMessages);
        }
    });
}

/**
 *@fileName:login.js
 *@author:fdc
 *@time:2017/2/17 0017
 *@disc:是否需要验证码
 */
function checkNeedCaptcha(userName) {
    $.jsonAjax(getUrl("user/checkNeedCaptcha"), {userName: userName}, function (data, status, xhr) {
        if (data.success && data.result > 0) {
            return true;
        } else {
            return false;
        }
    }, false);
}


//密码明暗文切换
function showKey() {
    if ($('#see').hasClass('img01')) {
        $('#see').removeClass('img01').addClass('img02');
        $("#hidePwd").attr('type', 'text');
    } else {
        $($('#see')).removeClass('img02').addClass('img01');
        $("#hidePwd").attr('type', 'password');
    }
};

/**
 *@fileName:phonelogin.js
 *@author:fdc
 *@time:2017/2/20 0020
 *@disc:获取图片验证
 */
function getImgcaptcha() {
    var img = document.getElementById("imgCaptcha");
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
/*function checkPhoneRepeat(e) {
    console.log($(e.target).val());
    if($(e.target).val().length==11){
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
                    $('.errorTip').show().html('该手机号已经注册，请直接登录!');
                    popUp_auto_false(1500,"该手机号已经注册，请直接登录!")
                }
            });
    }else{
        $(".errorTip").hide();
    }
}*/

/**
 *@fileName:phonelogin.js
 *@author:fdc
 *@time:2017/2/21 0021
 *@disc:发送手机验证码
 */
function sendPhoneCaptcha() {
    var phoneAreaCode = phoneNumVM.$data.areacode;
    var phoneNum=$("#phoneNumber").val();
    //var picCaptcha=$("#numberPic").val();
    if ((phoneAreaCode == '86' && reg.test(phoneNum))
            ||(phoneAreaCode != '86' && reg3.test(phoneNum))) {
        //非大陆的拼接手机号
        if(phoneAreaCode != '86'){
            phoneNum = '00' + phoneAreaCode +phoneNum;
        }
            $.jsonAjax(getUrl("captcha/sendPhoneMessage"), {
                picCaptchaType: "phone_login",
                contact: phoneNum, type: 2
            }, function (data, status, xhr) {
                if (data.success) {
                    popUp_auto(3000, "短信已发送!");
                    countTime();
                } else {
                    //checkImgWrongStyel();
                    popUp_auto_false(3000, data.errorMessages);
                }
            })
    } else {
        checkPhoneWrongStyle();
    }
}

function jqueryCase(){
    //样式效果
    $("#phoneNumber").focus(function () {
        $('.phoneNumber').css('border-color', '#a0a0a0');
        $('#phoneNumber').css('color', '#333');
        $('.phoneNumber .warm').hide();
        $('.errorTip').hide();
    });

};
$('#numberPic').focus(function () {
    $('.tpInput').css('border-color', '#a0a0a0');
    $('#numberPic').css('color', '#333');
    $('.tpInput .warm').hide();
    $('.errorTip').hide();
});
$("#dxYz").focus(function () {
    $('.dxInput').css('border-color','#a0a0a0');
    $('#dxYz').css('color','#333');
    $('.dxInput .warm').hide();
    $('.errorTip').hide();
});

var areaCodeOut = $.getUrlParam("areaCode");
var phoneNumVM = new Vue({
    el:".phoneWrap",
    data:{
        areacode:'86'
    },
    methods:{
        showGuoJiPage: function () {
            window.location = "../../html/2_login_sign/guoJiShouJiHao.html?type=login";
        }
    },
    beforeMount:function(){
        if(null != areaCodeOut && ''!=areaCodeOut){
            this.areacode = areaCodeOut;
        }
    },
    mounted:function(){
        jqueryCase();
    }
});
