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
    $.jsonAjax(getUrl("user/findPWDTwo"),{captchaType:"find_pay_pwd",picCaptcha:picCaptcha,phoneCaptcha:$("#phoneCaptcha").val(),phone:phone,areaCode:areaCode},function(data){
        if(data.success){
            window.location = "../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_zhaoHuiZhiFuMiMa3.html?captchaType="+captchaType+"&picCaptcha="+picCaptcha+"&phone="+phone+"&phoneCaptcha="+$("#phoneCaptcha").val()+"&areaCode="+areaCode;
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
function sendPhoneCaptcha(thiz){
    var sendPhone = phone;
    settime(thiz);
    if(sendPhone){
        $.jsonAjax(getUrl("captcha/sendPhoneMessage"),{picCaptchaType:"find_pay_pwd",contact:sendPhone,type:2,picCaptcha:picCaptcha},
            function(data,status,xhr){
                if(data.success){
                    popUp_auto(3000,"短信已发送!");
                }else{
                    popUp_auto_false(3000,data.errorMessages);
                }
            })
    }else{
        printConfirm("用户未绑定手机号，<br/>是否前往手机绑定？",function () {
            window.location = "../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_bangDingShouJi.html";
        });
    }

}

