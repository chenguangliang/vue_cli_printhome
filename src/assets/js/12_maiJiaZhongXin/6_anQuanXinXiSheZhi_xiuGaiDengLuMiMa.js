//密码明暗文切换
$('.see').click(function(){
    if($(this).hasClass('img01')){
        $(this).removeClass('img01').addClass('img02');
        $(this).prev().attr('type','text');
    }else{
        $(this).removeClass('img02').addClass('img01');
        $(this).prev().attr('type','password');
    }
});
//正常密码
var pwdReg=/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/;
//用快速注册的手机号登录时生成的密码
var phoneNumLoginReg= /^1[3|4|5|7|8]\d{9}$/;
//表单验证
$('.yuanMiMa').blur(function(){
    if((!pwdReg.test($(this).val()))&&(!phoneNumLoginReg.test($(this).val()))){
        $(this).parent().parent().next().removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    }else{
        $(this).parent().parent().next().addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
    //验证密码是否正确
    $.jsonAjax(getUrl("security/checkLoginPwd"),{pwd:$(this).val()},function(data,status,xhr) {
        if(!data.success){
            $(this).parent().parent().next().removeClass("none");
            $(this).removeClass("ccc_border");
            $(this).addClass("red_border");
        }else{
            $(this).parent().parent().next().addClass("none");
            $(this).removeClass("red_border");
            $(this).addClass("ccc_border");
        }
    },false);
});
$('.xinMiMa ').blur(function(){
    if(!/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test($(this).val())){
        $(this).parent().parent().next().removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    }else{
        $(this).parent().parent().next().addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});
$('.queRenMiMa ').blur(function(){
    if($(".queRenMiMa").val() !=$(".xinMiMa").val()){
        $(this).parent().parent().next().removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    }else{
        $(this).parent().parent().next().addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});
$('.yanZhengMa ').blur(function(){
    if(!/^\d{4}$/.test($(this).val())){
        $(this).parent().parent().next().removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    }else{
        $(this).parent().parent().next().addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});
//提交按钮
$(".tiJiao").click(function (e) {
    if(
        $(".warm").hasClass("none") &&
        (/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test($('.yuanMiMa').val())) &&
        (/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test($('.xinMiMa').val()))&&
        $(".queRenMiMa").val() !=$(".xinMiMa").val()&&
        (/^\d{6}$/.test($('.yanZhengMa ').val()))
    ) {

    }else{
        e.preventDefault();
    }
});
var userinfo = "";
//接收验证码倒计时
var count =60;
function test(){
    count--;
    if(count >= 0){
        $('.btn').val(count+'秒');
    } else {
        clearTimeout(jsqs);
        $('.btn').val('接收验证码');
        $(".btn").attr("disabled",false);
        $('.btn').css('background-color','#e60012');
        count=60;
    }
}
function jsq(){
    $(".btn").attr("disabled",true);
    window.jsqs = setInterval(test,1000);
    $('.btn').css('background-color','#ccc');
    popUp_auto(1000,'验证信息已发送','请查收')
}
var phone = '';
function sendCaptcha(type) {
    var oldpwd = $("#oldpwd_id").val();
    //发送验证码过程中不允许切换绑定手机/邮箱
    $("#select_contact_id").attr("disabled","disabled");

    if( oldpwd == "" ){
        popUp_auto_false(1000,'请输入原密码');
        return false;
    }
    //校验输入的原密码是否正确
    var flagOldPwd = true;
    $.jsonAjax(getUrl("security/checkLoginPwd"),{pwd:oldpwd},function(data,status,xhr) {
        if(!data.success){
            flagOldPwd = false;
        }
    },false);
    if(!flagOldPwd){
        popUp_auto_false(1000,'原密码错误');
        return false;
    }

    var newPwd = $("#loginpwd_id").val();
    var repNewPwd = $("#pwd_id").val();
    if(newPwd == ""){
        popUp_auto_false(1000,'请输入新密码');
        return false;
    }
    if( newPwd != repNewPwd ){
        popUp_auto_false(1000,'两次新密码不一致，请重新输入');
        return false;
    }
    var selected = $("#select_contact_id").val();
    var contact = '';
    if(selected == 1){
        contact = userinfo.userEmail;
    }else if(selected == 2){
        contact = userinfo.userMobile;
    }
    var picCaptchaType = '';
    if(type=='login'){
        picCaptchaType = "find_pwd";
    }else if(type=='pay'){
        picCaptchaType = "find_pay_pwd";
    }
    $.jsonAjax(getUrl("captcha/sendPhoneMessage"),{picCaptchaType:picCaptchaType,contact:contact,type:selected,picCaptcha:""},
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
function submit(type) {
    //检查验证码
    // if(checkCaptcha()){
    var selected = $("#select_contact_id").val();
    var contact = '';
    if(selected == 1){
        contact = userinfo.userEmail;
    }else if(selected == 2){
        contact = userinfo.userMobile;
    }
    if(type=='login'){
        var logname = userinfo.loginname;
        var data = {
            logname:logname,
            oldpwd:$("#oldpwd_id").val(),
            loginpwd:$("#loginpwd_id").val(),
            phone:contact,
            phoneCaptcha:$("#captcha_id").val()
        };
        $("#logname_id").val(logname);
        $.jsonAjax(getUrl("security/modifypwdMap"),data,function(data,status,xhr) {
            if(data.status == '200'){
                $.jsonAjax(getUrl('user/logout'),{},function(){
                    window.location = '6_anQuanXinXiSheZhi_miMaXiuGaiChengGong.html';
                });
            }else{
                popUp_auto_false(1000,data.msg);
            }
        },false);
    }else if(type=='pay'){
        var data = {
            level: '1',
            oldpwd:$("#oldpwd_id").val(),
            paypwd: $("#loginpwd_id").val(),
            phone:contact,
            phoneCaptcha:$("#captcha_id").val()
        }
        $.jsonAjax(getUrl("security/setpaypwdMap"), data, function (data, status, xhr) {
            if (data.status == '200') {
                window.location = '6_anQuanXinXiSheZhi_sheZhiZhiFuMiMa2.html';
            } else {
                popUp_auto_false(1000,data.msg);
            }
        }, false);
    }

    // }
}

function checkCaptcha(){
    var captcha = $("#captcha_id").val();
    var captchaFormat = /^[a-zA-Z0-9]{6}$/;
    if(!captchaFormat.test(captcha)){
        popUp_auto_false(1000,"验证码不正确");
        return false;
    }
    var isTrue = false;
    var codeKey = $('#code_key').val();
    var data = {code:captcha,codeKey:codeKey};
    $.jsonAjax(getUrl("captcha/check"),data,function(data,status,xhr) {
        if(!data.message){
            isTrue = false;
            printAlert("验证码不正确");
        } else {
            isTrue = true;
        }
    },false);
    return isTrue;
}


$(function(){
    $.jsonAjax(getUrl("security/verifyUserMap"),{},function(data,status,xhr) {
        if (data.status == "200") {
            userinfo = data.data.userinfo;
            var mobile = userinfo.userMobile;
            if(mobile){
                mobile = mobile.replace(/([0-9]{3})[0-9]{4}([0-9]{0,})/,"$1\*\*\*\*$2");
            }
            var eamil = data.data.userEmail;
            var options;
            if(mobile&&mobile != ''){
                options += "<option value='"+2+"'>"+mobile+"</option>";
            }
            if(eamil&&eamil != ''){
                options += "<option value='"+1+"'>"+eamil+"</option>";
            }
            $("#select_contact_id").html(options);
        }else{
            window.location = '../../html/2_login_sign/login_common.html';
        }
    },false);
});
