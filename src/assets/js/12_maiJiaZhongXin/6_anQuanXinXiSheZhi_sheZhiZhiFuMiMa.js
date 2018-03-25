//密码明暗文切换
$('.see').click(function () {
    if ($(this).hasClass('img01')) {
        $(this).removeClass('img01').addClass('img02');
        $(this).prev().attr('type', 'text');
    } else {
        $(this).removeClass('img02').addClass('img01');
        $(this).prev().attr('type', 'password');
    }
});
//表单验证
$('.xinMiMa ').blur(function () {
    if (!/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test($(this).val())) {
        $(this).parent().parent().next().removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    } else {
        $(this).parent().parent().next().addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});
$('.queRenMiMa ').blur(function () {
    if ($(".queRenMiMa").val() != $(".xinMiMa").val()) {
        $(this).parent().parent().next().removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    } else {
        $(this).parent().parent().next().addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});
$('.yanZhengMa ').blur(function () {
    if (!/^\d{4}$/.test($(this).val())) {
        $(this).parent().parent().next().removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    } else {
        $(this).parent().parent().next().addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});
//提交按钮
$(".tiJiao").click(function (e) {
    if (
        $(".warm").hasClass("none") &&
        (/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test($('.xinMiMa').val())) &&
        $(".queRenMiMa").val() != $(".xinMiMa").val() &&
        (/^\d{4}$/.test($('.yanZhengMa ').val()))
    ) {
    } else {
        e.preventDefault();
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
    $(".btn").attr("disabled", true);
    $('.btn').css('background-color','#ccc');
    window.jsqs = setInterval(test, 1000);
    popUp_auto(1000, '验证信息已发送', '请查收')
}


var userinfo = "";
$(function () {
    $.jsonAjax(getUrl("security/verifyUserMap"), {}, function (data, status, xhr) {
        if (data.status == "200") {
            userinfo = data.data.userinfo;
            var mobile = userinfo.userMobile;
            mobile = mobile.replace(/([0-9]{3})[0-9]{4}([0-9]{0,})/,"$1\*\*\*\*$2");
            var eamil = data.data.userEmail;
            $("#phone").html(mobile);
        } else {
            window.location = '../../html/2_login_sign/login_common.html';
        }
    }, false);
});

function sendCaptcha() {
    //发送验证码过程中不允许切换绑定手机/邮箱
    // $("#select_contact_id").attr("disabled","disabled");

    var newPwd = $("#loginpwd_id").val();
    var repNewPwd = $("#pwd_id").val();
    if (newPwd == "") {
        showWrong("#loginpwd_id",".psdTip ");
        popUp_auto_false(1500, "请输入密码");
        // $("#loginpwd_span").html("请输入密码");
        return false;
    }
    if (newPwd != repNewPwd) {
        showWrong("#pwd_id",".psdTwoTip ");
        popUp_auto_false(1500,"两次密码不同，请重新输入");
        // $("#pwd_span").html("两次密码不同，请重新输入");
        return false;
    }
    var contact = $("#phone").html();

    $.jsonAjax(getUrl("captcha/sendPhoneMessage"),{picCaptchaType:"set_pay_pwd",contact:userinfo.userMobile,type:2,picCaptcha:""},
        function(data,status,xhr){
            if(data.success){
                popUp_auto(1000,"短信已发送!");
                jsq();
            }else{
                popUp_auto_false(1000,data.errorMessages);
            }
        });
}

//提交
function submit() {

    var data = {
        level: '1',
        // oldpwd:$("#oldpwd_id").val(),
        paypwd: $("#loginpwd_id").val(),
        phone:userinfo.userMobile,
        phoneCaptcha:$("#captcha_id").val()
    }
    $.jsonAjax(getUrl("security/setpaypwdMap"), data, function (data, status, xhr) {
        // console.log(data);
        if (data.status == '200') {
            window.location = '6_anQuanXinXiSheZhi_sheZhiZhiFuMiMa2.html';
        } else {
            popUp_auto_false(1000,data.msg);
        }
    }, false);
    
    
}

/*cgl 2017/5/2*/
//输入错误信息应出现的样式
function showWrong(idOrClass, msgClassName) {
    $(idOrClass).removeClass("ccc_border").addClass("red_border");
    $(msgClassName).removeClass("none");
}
//输入正确信息应去掉的样式
function delWrong(idOrClass, msgClassName) {
    $(idOrClass).addClass("ccc_border").removeClass("red_border");
    $(msgClassName).addClass("none");
}
//点击input，该input错误提示消失
$("#loginpwd_id").focus(function () {
delWrong("#loginpwd_id",".psdTip")
});
$("#pwd_id").focus(function () {
    delWrong("#pwd_id",".psdTwoTip ")
});
$("#captcha_id").focus(function () {
    delWrong("#captcha_id",".captchaTip ")
});