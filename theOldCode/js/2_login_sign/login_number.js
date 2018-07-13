//弹出窗
$('.guan,.sure').click(function(){
    $('.zheZhao').hide();
});
$('.show,.show1').click(function(){
    $('.zheZhao').show();
});
/*$(".zheZhao").on("touchmove", function (e) {
    e.preventDefault();
});*/
//点击切换图片
//    function changeTP(){
//        var img = document.getElementById("changeTP");
//        //img.src="/mallwx/user/acquire?a=" + new Date().getTime();
//        img.src="/img/loginLogo.png";
//    }
function check(){
    var reg = /^1[3|4|5|7|8]\d{9}$/;
    var reg2=/^\d{4}$/;
    var reg3=/^\d{4}$/;
    if (!reg.test($("#phoneNumber").val())) {
        $('.phoneNumber').css('border-color','#e60012');
        $('#phoneNumber').css('color','#e60012');
        $('.phoneNumber .warm').show();
        $('.numberTip').show();
    }else if(!reg2.test($("#numberPic").val())){
        $('.phoneNumber').css('border-color','#a0a0a0');
        $('#phoneNumber').css('color','#333');
        $('.warm').hide();
        $('.numberTip').hide();
        $('.tpInput').css('border-color','#e60012');
        $('#numberPic').css('color','#e60012');
        $('.tpInput .warm').show();
        $('.picTip').show();
    }else if(!reg3.test($("#dxYz").val())){
        $('.tpInput').css('border-color','#a0a0a0');
        $('#numberPic').css('color','#333');
        $('.tpInput .warm').hide();
        $('.picTip').hide();
        $('.dxInput').css('border-color','#e60012');
        $('#dxYz').css('color','#e60012');
        $('.dxInput .warm').show();
        $('.dxTip').show();
    }else{
        $('.dxInput').css('border-color','#a0a0a0');
        $('#dxYz').css('color','#333');
        $('.dxInput .warm').hide();
        $('.dxTip').hide();
        loginSuccess();
    }
}
function loginSuccess(){
    $('.btn').attr('href','../../html/2_login_sign/loginSuccess.html');
}
//接收验证码倒计时
var count =60;
function test(){
    count--;
    if(count >= 0){
        $('#btn').html(count+'秒');
    } else {
        clearTimeout(jsqs);
        $('#btn').html('接收验证码');
        $("#btn").attr("disabled",false);
        $('#btn').css('background-color','#e60012');
        count=60;
    }
}
function jsq(){
    var reg = /^1[3|4|5|7|8]\d{9}$/;
    var reg2=/^\d{4}$/;
    if(
        $('#phoneNumber').val() ==  reg &&
        $('#numberPic').val() == reg2
    ){
        $("#btn").attr("disabled",true);
        $('#btn').css('background-color','#ccc');
        window.jsqs = setInterval(test,1000);
        popUp_auto(1000,'验证信息已发送','请查收')
        getPhoneCode();
    }
}
