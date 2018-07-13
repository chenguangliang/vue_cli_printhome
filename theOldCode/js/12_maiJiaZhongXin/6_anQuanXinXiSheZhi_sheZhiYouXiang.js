//表单基本验证
$(".newEmail").focus(function () {
    delWrong(".newEmail", ".wrongEmail");
    delWrong(".newEmail", ".repeatEmail");
}).blur(function () {
    if (!/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z\.-]+)\.([a-z]{2,6})$/.test($(this).val())) {
        showWrong(".newEmail", ".wrongEmail");
    } else {
        delWrong(".newEmail", ".wrongEmail");
    }
});

$(".yanZhengMa").focus(function () {
    delWrong(".yanZhengMa", ".wrongCaptcha");
}).blur(function () {
    if ($(this).val() == '') {
        showWrong(".yanZhengMa", ".wrongCaptcha");
    } else {
        delWrong(".yanZhengMa", ".wrongCaptcha");
    }
});
//接收验证码倒计时
var count = 60;
function test() {
    count--;
    if (count >= 0) {
        $('.btn').val(count + '秒');
    } else {
        clearTimeout(jsqs);
        $('.btn').val('接收验证码');
        $(".btn").attr("disabled", false);
        $('.btn').css('background-color','#e60012');
        count = 60;
    }
}
function jsq() {
    if (
        (/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z\.-]+)\.([a-z]{2,6})$/.test($('.newEmail').val()))
    ) {
        $(".btn").attr("disabled", true);
        $('.btn').css('background-color','#ccc');
        popUp_auto(1000, '验证信息已发送', '请查收');
        window.jsqs = setInterval(test, 1000);
    }
}


//提交按钮
$(".tiJiao").click(function (e) {
    if (
        $(".warm").hasClass("none") &&
        (/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z\.-]+)\.([a-z]{2,6})$/.test($('.newEmail').val())) &&
        (/^\d{6}$/.test($('.yanZhengMa ').val()))
    ) {
    } else {
        e.preventDefault();
    }
});

function sendCaptcha() {
    var newAddress = $("#newAddress").val();
    var picCaptchaType = '';
    if(update&&update!='null'){
        picCaptchaType = "change_bang_email";
    }else {
        picCaptchaType = "bang_email";
    }
    $.jsonAjax(getUrl("captcha/sendPhoneMessage"), {picCaptchaType: picCaptchaType,contact: newAddress,type: 1,picCaptcha: ""},
        function (data, status, xhr) {
            if (data.success) {
                popUp_auto(1000, "短信已发送!");
                jsq();
            } else {
                popUp_auto_false(1000, data.errorMessages);
            }
        });

    // //发送验证码
    // if(!checkEmail()){
    //     var data2 = {"contact": newAddress, "type": 3, 'smsType': 'EMAIL_UP_BIND_EMAIL'};
    //     $.jsonAjaxPost(getUrl("captcha/send"), data2, function (data, status, xhr) {
    //         if (data.isOK == 2) {
    //             jsq();
    //             $("#code_key").val(data.codeKey);
    //         } else if (data.isOK == 1) {
    //             showWrong(".yanZhengMa", ".wrongCaptcha");
    //             popUp_auto_false(1500, data.message);
    //         }
    //     }, false);
    // }
}

//提交
function submit() {
    if(!checkEmail()){
        //检查验证码
        if (checkCaptcha()) {
            var data = {
                changeType: 'email',
                address: $("#newAddress").val()
            };
            $.jsonAjax(getUrl("information/informationSeller/newAuthEditMap"), data, function (data, status, xhr) {
                if (data.status == '200' && data.data == true) {
                    window.location = '6_anQuanXinXiSheZhi_bangDingYouXiang2.html?update='+update;
                } else {
                    popUp_auto_false(1500,data.msg);
                }
            }, false);
        }
    }else{
        popUp_auto_false(1000, "验证码不正确");
    }

}
//验证验证码
function checkCaptcha() {
    var captcha = $("#captcha_id").val();
    // var captchaFormat = /^[a-zA-Z0-9]{6}$/;
    // if (!captchaFormat.test(captcha)) {
    //     popUp_auto_false(1500, "验证码不正确");
    //     showWrong(".yanZhengMa", ".wrongCaptcha");
    //     return false;
    // }
    var isTrue = false;
    var newAddress = $("#newAddress").val();
    var data = {captcha:captcha,contact:newAddress};
    $.jsonAjax(getUrl("captcha/checkCaptcha"), data, function (data, status, xhr) {
        if(data.status == '200'){
            if(data.data){
                isTrue = true;
            }
        }
    }, false);
    // var codeKey = $('#code_key').val();
    // var data = {code: captcha, codeKey: codeKey};
    // $.jsonAjax(getUrl("captcha/check"), data, function (data, status, xhr) {
    //     if (!data.message) {
    //         popUp_auto_false(1500, "验证码不正确");
    //         showWrong(".yanZhengMa", ".wrongCaptcha");
    //         isTrue = false;
    //     } else {
    //         isTrue = true;
    //     }
    // }, false);
    return isTrue;
}
//验证邮箱号
function checkEmail() {
    var isRepeat=false;
    var newAddress = $("#newAddress").val();
    if (!/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z\.-]+)\.([a-z]{2,6})$/.test(newAddress)) {
        popUp_auto_false(1500, "请输入正确的电子邮箱");
        showWrong(".newEmail", ".wrongEmail");
        isRepeat=true;
        return isRepeat;
    }

    var data = {personalMailInput_div: newAddress};
    $.jsonAjaxPost(getUrl("information/register/verifyPersonalEmail"), data, function (data, status, xhr) {
        if (data == false) {
            showWrong(".newEmail", ".repeatEmail");
            popUp_auto_false(1500, "邮箱已存在，请重新输入");
            isRepeat=true;
        }
    }, false);
    return isRepeat;
}
var update =  $.getUrlParam("update");
$(function(){
    if(update&&update!='null'){
        $("#label").show();
        $("#topLabel").text("修改绑定邮箱");
    }
})