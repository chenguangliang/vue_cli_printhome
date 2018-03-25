/**
 * Created by like on 2016/11/24.
 */
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
//点击导航显示下拉菜单
$(".dingDan").click(function(){
    $(this).next('.content').slideToggle();
    if($(this).children('.jianTou').hasClass('zhiFuDown')){
        $(this).children('.jianTou').removeClass('zhiFuDown').addClass('zhiFuUp');
        $(this).css('border','none');
    }else{
        $(this).children('.jianTou').removeClass('zhiFuUp').addClass('zhiFuDown');
        $(this).css('border-bottom','1px dashed #c9c9c9');
    }
});
//支付密码错误
$('.sheZhi').click(function () {
    if($('.zhiFu2 .middle input').val()==''){
        $('.zhezhao').show();
    }
});
//关闭弹窗
$('.con button').click(function () {
    $('.zhezhao').hide();
})
//设置支付密码
$('.sheZhi').click(function () {
    $('.sheZhiMiMa').show();

});
//表单验证
$('#xinMiMa').blur(function(){
    var reg=/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/;
    if(!reg.test($(this).val())){
        $(this).parents().next('.warm').removeClass('none');
        $(this).css('color','#e60012');
        $(this).css('border-color','#e60012');
    }else{
        $(this).parents().next('.warm').addClass('none');
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
$('#queRenMiMa').blur(function(){
    if($(this).val() !=$("#xinMiMa").val()){
        $(this).parents().next('.warm').removeClass('none');
        $(this).css('color','#e60012');
        $(this).css('border-color','#e60012');
    }else{
        $(this).parents().next('.warm').addClass('none');
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
$('#yanZhengMa').blur(function(){
    if($(this).val()==''){
        $(this).parents().next('.warm').removeClass('none');
        $(this).css('color','#e60012');
        $(this).css('border-color','#e60012');
    }else{
        $(this).parents().next('.warm').addClass('none');
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
//提交按钮
$(".neiRong .sure").click(function () {
    if (
        $(".warm").hasClass("none") &&
        /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test($("#xinMiMa").val()) &&
        $("#queRenMiMa").val() ==$("#xinMiMa").val() &&
        $('#queRenMiMa').val()!=0 &&
        $('#yanZhengMa').val()!='') {
        $('.sheZhiMiMa').hide();
    }
});
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
        count=10;
    }
}
function jsq(){
    $("#btn").attr("disabled",true);
    $('#btn').css('background-color','#ccc');
    window.jsqs = setInterval(test,1000);
    popUp_auto(1000,'验证信息已发送','请查收')
}
//关闭设置密码
$('.neiRong i').click(function () {
    $('.sheZhiMiMa').hide();
});
//解决穿透
$(".zheZhao").on("touchmove", function (e) {
    e.preventDefault();
});
$(function() {
    var phone = $('#telphone').text();
    var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
    $('#telphone').text(mphone)
});
