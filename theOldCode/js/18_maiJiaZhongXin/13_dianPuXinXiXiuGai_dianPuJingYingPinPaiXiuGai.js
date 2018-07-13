/**
 * Created by User on 2017/2/7.
 */
//经营品牌折叠效果
$(".items").click(function(){
    if(
        $(this).next(".brand").css("display")==("block")
    ){
        $(this).next(".brand").css("display","none");
    }
    else{
        $(this).next(".brand").css("display","block");
    }
});
//经营品牌点击图片放大
$('.pinPai p .dianPu .logo').click(function(){
    $('.pinPai_bg').show();
    clockedBody();
});
$('.pinPai_bg .bg,.pinPai_bg .close').click(function () {
    $('.pinPai_bg').hide();
    unClockedBody();
});
//删除类目弹窗
$('.shanChu').click(function(){
    $('.shanChuTanChuang').show();
    clockedBody();
});
$('.shanChuTanChuang a,.shanChuTanChuang .bg').click(function () {
    $('.shanChuTanChuang').hide();
    unClockedBody();
});
$(".shanChuTanChuang p a:last-child").click(function(){
    popUp_auto(1000,'删除成功');
});
//新增品牌
$('.xinZengLeiMu').click(function(){
    $('.xinZengLeiMuTanChuang').show();
    clockedBody();
});
$('.xinZengLeiMuTanChuang .cancel, .xinZengLeiMuTanChuang .close,.xinZengLeiMuTanChuang .bg').click(function () {
    $('.xinZengLeiMuTanChuang').hide()
    unClockedBody();
});
$('.xinZengLeiMuTanChuang .sure').click(function(){
    if($('.xinZengLeiMuTanChuang select').val()==''){
        popUp_auto_false(1000,'请选择店铺类目');
    }else{
        $('.xinZengLeiMuTanChuang').hide();
        $('.new').show();
    }
});
$('.leiMuPinPai p').click(function(){
    if(
        $(this).hasClass('colorf4')
    ){
        $(this).removeClass('colorf4').addClass('colore6').siblings('p').removeClass('colore6').addClass('colorf4');
        $(this).next('div').slideToggle().siblings('div').hide();
    }else{
        $(this).removeClass('colore6').addClass('colorf4');
        $(this).next('div').slideUp()
    }
});
$('.leiMuPinPai div .dianPu').click(function(){
    if($(this).children('.yes_select').css('display')=='block'){
        $(this).children('.yes_select').hide();
    }else{
        $(this).children('.yes_select').show();
    }

})