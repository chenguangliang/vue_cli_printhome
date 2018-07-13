/**
*@fileName:findpwd.js
*@author:fdc
*@time:2017/3/2 0002
*@disc:密码找回
*/
var phone="";
var captchaType = "";
var picCaptcha = "";
var phoneCaptcha = "";
var areaCode = "";
$(function(){
    phone = $.getUrlParam("phone");
    captchaType = $.getUrlParam("captchaType");
    picCaptcha = $.getUrlParam("picCaptcha");
    phoneCaptcha = $.getUrlParam("phoneCaptcha");
    areaCode = $.getUrlParam("areaCode");
});





function threeStepSubmit(){
    if(picCaptcha == ""){
        popUp_auto_false(3000,"验证码不能为空!");
        return false;
    }
    if(phone == ""){
        popUp_auto_false(3000,"手机号不能为空!");
        return false;
    }
    if(phoneCaptcha == ""){
        popUp_auto_false(3000,"手机验证码不能为空!");
        return false;
    }
    if($("#fisrtPwd").val() == ""){
        popUp_auto_false(3000,"第一次输入的密码不能为空!");
        return false;
    }
    if($("#twoPwd").val() == ""){
        popUp_auto_false(3000,"第二次输入的密码不能空!");
        return false;
    }
    if($("#twoPwd").val() != $("#fisrtPwd").val()){
        popUp_auto_false(3000,"两次密码输入字符不同，请核对后提交");
        return false;
    }
    $.jsonAjax(getUrl("user/findPWDThree"),{captchaType:"find_pwd",picCaptcha:picCaptcha,
        phoneCaptcha:phoneCaptcha,phone:phone,areaCode:areaCode
    ,newPwd:$("#twoPwd").val()},function(data){
        if(data.success){
            //获取用户信息
            StorageUtil.setUserInfo();
            window.location = "../../html/2_login_sign/zhaoHuiMiMa4.html";
        }else{
            //console.log(data.errorMessages)
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
    $.jsonAjax(getUrl("captcha/sendPhoneMessage"),{picCaptchaType:"find_pwd",
        contact:phone,type:2,picCaptcha:picCaptcha
    },function(data,status,xhr){
        if(data.success){
            popUp_auto(3000,"短信已发送!");
        }else{
            popUp_auto_false(3000,data.errorMessages);
        }
    })
}

