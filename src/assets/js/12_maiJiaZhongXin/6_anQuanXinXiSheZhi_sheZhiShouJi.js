//表单验证
$('.phoneNumber_input').blur(function(){
    if(!/^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/.test($(this).val())){
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
    if($(this).val()==''){
        $(this).parent().parent().next().removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    }else{
        $(this).parent().parent().next().addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});

//接收验证码倒计时
var count =90;
function test(){
    count--;
    if(count >= 0) {
        $('.btn').val(count+'秒');
    } else {
        clearTimeout(jsqs);
        $('.btn').val('接收验证码');
        $(".btn").attr("disabled",false);
        $('.btn').css('background-color','#e60012');
        count=90;
    }
}
function jsq(){
    if((/^1[3|4|5|7|8]\d{9}$/.test($('.phoneNumber_input').val()))){
        popUp_auto(1500,'验证信息已发送','请查收');
        $(".btn").attr("disabled",true);
        $('.btn').css('background-color','#ccc');
        window.jsqs = setInterval(test,1000);
    }
}


//提交按钮
$(".tiJiao").click(function (e) {
    if(
        $(".warm").hasClass("none") &&
        (/^1[3|4|5|7|8]\d{9}$/.test($('.phoneNumber_input').val())) &&
        (/^\d{6}$/.test($('.yanZhengMa ').val()))
    ) {
    }else{
        e.preventDefault();
    }
});
var sendPhone = "";
function sendCaptcha() {
    var phoneAreaCode = phoneNumVM.$data.areacode;
    var newAddress = $("#newAddress").val();
    if((phoneAreaCode == '86' && (!/^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/.test(newAddress)))
        ||(phoneAreaCode != '86'&&(!/^[0-9]{1,11}$/.test(newAddress)))){

    //if(!/^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/.test(newAddress)){
        popUp_auto_false(3000,"请输入正确的手机号码");
        return false;
    }
    var newAddress = $("#newAddress").val();
    var data = {personalPhoneInput: newAddress}
    $.jsonAjaxPost(getUrl("information/register/verifyPersonalMobile"),data,function(data,status,xhr) {
        if(data == false){
            popUp_auto_false(3000,"手机已存在，请重新输入");
        }else{
            //发送验证码
            sendPhone = newAddress;
            if(phoneAreaCode != '86'){
                sendPhone = "00" + phoneAreaCode + sendPhone;
            }
            var picCaptchaType = '';
            if(update&&update!='null'){
                picCaptchaType = "change_bang_phone";
            }else {
                picCaptchaType = "bang_phone";
            }
            $.jsonAjax(getUrl("captcha/sendPhoneMessage"), {picCaptchaType: picCaptchaType,contact: sendPhone,type: 2,picCaptcha: ""},
                function (data, status, xhr) {
                    if (data.success) {
                        popUp_auto(1000, "短信已发送!");
                        jsq();
                    } else {
                        popUp_auto_false(1000, data.errorMessages);
                    }
                });
            // var data2 = {"contact":sendPhone, "type":4, 'smsType':'UPBINDPHONE'}
            // $.jsonAjaxPost(getUrl("captcha/send"),data2,function(data,status,xhr) {
            //     // console.log(data);
            //     if(data.isOK == 2){
            //         jsq();
            //         $("#code_key").val(data.codeKey);
            //     }else if(data.isOK == 1){
            //         popUp_auto_false(3000,data.message);
            //     }
            // },false);
        }
    },false);
}
//提交
function submit() {
    //检查验证码
    if(checkCaptcha()){
        var phoneAreaCode = phoneNumVM.$data.areacode;
        var data = {
            changeType:'phone',
            areaCode:phoneAreaCode,
            address:$("#newAddress").val()
        };
        $.jsonAjax(getUrl("information/informationSeller/newAuthEditMap"),data,function(data,status,xhr) {
            if(data.status == '200'&& data.data == true){
                window.location = '6_anQuanXinXiSheZhi_bangDingShouJi2.html?update='+update;
            }else{
                popUp_auto_false(1000, data.msg);
            }
        },false);
    }else{
        popUp_auto_false(1000,"验证码不正确！");
    }
}
//验证验证码
function checkCaptcha(){
    var captcha = $("#captcha_id").val();
    // var captchaFormat = /^[a-zA-Z0-9]{6}$/;
    // if(!captchaFormat.test(captcha)){
    //     popUp_auto_false(1000, "验证码不正确");
    //     return false;
    // }
    var isTrue = false;
    var data = {captcha:captcha,contact:sendPhone};
    $.jsonAjax(getUrl("captcha/checkCaptcha"), data, function (data, status, xhr) {
        if(data.status == '200'){
            if(data.data){
                isTrue = true;
            }
        }
    }, false);
    // var codeKey = $('#code_key').val();
    // var data = {code:captcha,codeKey:codeKey};
    // $.jsonAjax(getUrl("captcha/check"),data,function(data,status,xhr) {
    //     if(!data.message){
    //         isTrue = false;
    //     } else {
    //         isTrue = true;
    //     }
    // },false);
    return isTrue;
}


var areaCodeOut = $.getUrlParam("areaCode");
var phoneNumVM = new Vue({
    el:".xiuGaiContent",
    data:{
        areacode:'86'
    },
    methods:{
        showGuoJiPage: function () {
            window.location = "../../html/2_login_sign/guoJiShouJiHao.html?type=setPhoneNum&update="+update;
        }
    },
    beforeMount:function(){
        if(null != areaCodeOut && ''!=areaCodeOut){
            this.areacode = areaCodeOut;
        }
    }
})
var update =  $.getUrlParam("update");
$(function(){
    if(update&&update!='null'){
        $("#label").show();
        $("#topLabel").text("修改绑定手机");
    }
})