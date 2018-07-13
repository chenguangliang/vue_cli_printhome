// $(function(){
//     $('.dxYan').show();
// });



//弹出窗
$('.guan,.sure').click(function(){
    $('.zheZhao').hide();
});
$('.show,.show1').click(function(){
    $('.zheZhao').show();
});
$(".zheZhao").on("touchmove", function (e) {
    e.preventDefault();
});
////点击切换图片
//function changeTP(){
//    var img = document.getElementById("changeTP");
//    //img.src="/mallwx/user/acquire?a=" + new Date().getTime();
//    img.src="/img/loginLogo.png";
//}
//完成按钮验证
$('.btn').click(function(e){
    if(
        $(".phoneNumber .warm").hasClass("none") &&
        $(".tpInput .warm").hasClass("none") &&
        $(".dxInput .warm").hasClass("none") &&
        $('.phoneNumber_input').val()!=0 &&
        $('.numberPic').val()!=0 &&
        $('.dxYz').val()!=0
    ) {
        $('.btn').addClass('btnSuccess');
    }else{
        e.preventDefault();
    }
});
//接收验证码倒计时
var count =10;
function test(){
    count--;
    if(count >= 0) {
        $('#btn').html(count+'秒');
    } else {
        clearTimeout(jsqs);
        $('#btn').html('接收验证码');
        $("#btn").attr("disabled",false);
        $('.btn').css('background-color','#e60012');
        count=10;
    }
}
function jsq(){
    if(
        (/^1[3|4|5|7|8]\d{9}$/.test($('.phoneNumber_input').val())) &&
        (/^\d{4}$/.test($(this).val()))
    ){
        $("#btn").attr("disabled",true);
        $('.btn').css('background-color','#ccc');
        popUp_auto(1000,'验证信息已发送','请查收')
        window.jsqs = setInterval(test,1000);
    }
}

