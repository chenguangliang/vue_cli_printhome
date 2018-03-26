/**
*@fileName:findpwd.js
*@author:fdc
*@time:2017/3/2 0002
*@disc:密码找回
*/
var phone="";
var captchaType = "";
var picCaptcha = "";
var areaCode = "";
$(function(){
    phone = $.getUrlParam("phone");
    captchaType = $.getUrlParam("captchaType");
    picCaptcha = $.getUrlParam("picCaptcha");
    areaCode = $.getUrlParam("areaCode");
});


/**
 *@fileName:phonelogin.js
 *@author:fdc
 *@time:2017/2/20 0020
 *@disc:获取图片验证
 */
function getImgcaptcha(){
    var img = document.getElementById("imgCaptcha");
    img.src=getUrl("user/acquire?type=find_pwd&a="+new Date());
}



function twoStepSubmit(){
    if(picCaptcha == ""){
        popUp_auto_false(3000,"验证码不能为空!");
        return false;
    }
    if(phone == ""){
        popUp_auto_false(3000,"手机号不能为空!");
        return false;
    }
    if($("#phoneCaptcha").val() == ""){
        popUp_auto_false(3000,"手机验证码不能为空!");
        return false;
    }
    $.jsonAjax(getUrl("user/findPWDTwo"),{captchaType:"find_pwd",picCaptcha:picCaptcha,phoneCaptcha:$("#phoneCaptcha").val(),phone:phone,areaCode:areaCode},function(data){
        if(data.success){
            window.location = "../../html/2_login_sign/zhaoHuiMiMa3.html?captchaType=find_pwd&picCaptcha="+picCaptcha+"&phone="+phone
            +"&captchaType="+captchaType+"&phoneCaptcha="+$("#phoneCaptcha").val()+"&areaCode="+areaCode;
        }else{
            popUp_auto_false(3000,data.errorMessages);
        }
   });
}


/**
 *@fileName:phonelogin.js
 *@author:fdc
 *@time:2017/2/21 0021
 *@disc:发送手机验证码
 */
function sendPhoneCaptcha(){
    var sendPhone = phone;
    if(areaCode !="86"){
        sendPhone = "00" + areaCode +sendPhone;
    }
    $.jsonAjax(getUrl("captcha/sendPhoneMessage"),{picCaptchaType:"find_pwd",
        contact:sendPhone,type:2,picCaptcha:picCaptcha
    },function(data,status,xhr){
        if(data.success){
            popUp_auto(3000,"短信已发送!");
        }else{
            popUp_auto_false(3000,data.errorMessages);
        }
    })
}

