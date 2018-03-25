//表单验证
$('.newEmail').blur(function(){
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
var count =60;
function test(){
    count--;
    if(count >= 0) {
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
    if(
        (/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test($('.newEmail').val()))
    ){
        $(".btn").attr("disabled",true);
        $('.btn').css('background-color','#ccc');
        popUp_auto(1000,'验证信息已发送','请查收');
        window.jsqs = setInterval(test,1000);
    }
}


//提交按钮
$(".tiJiao").click(function (e) {
    if(
        $(".warm").hasClass("none") &&
        (/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test($('.newEmail').val())) &&
        (/^\d{6}$/.test($('.yanZhengMa ').val()))
    ) {
    }else{
        e.preventDefault();
    }
});
