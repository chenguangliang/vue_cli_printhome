/**
 * Created by like on 2017/1/20.
 */
//选择优惠券类型
$('.lianxiren p span.right select').click(function () {
    if($(this).val()=='1'){
        $('.manJian').show();
        $('.zheKou,.xianJin').hide();
    }else if($(this).val()=='2'){
        $('.zheKou').show();
        $('.manJian,.xianJin').hide();
    }else{
        $('.xianJin').show();
        $('.zheKou,.manJian').hide();
    }
});
//发放方式
$('.lianxiren p.faFangFangShi span.right a').click(function(){
    $(this).addClass('on').siblings().removeClass('on');
    $('.xuanZeYongHu').hide();
});
$('.lianxiren p.faFangFangShi span.right a:last-child').click(function () {
    $('.xuanZeYongHu').show();
});
//选择用户类型
$('.yongHuLeiXing  span.right a').click(function(){
    $(this).addClass('on').siblings().removeClass('on');
});
//选择会员等级
$('.huiYuanDengJi  span.right a').click(function(){
    $(this).addClass('on');
});

//使用范围
$('.lianxiren p.shiYongFanWei span.right a').click(function(){
    $(this).addClass('on').siblings().removeClass('on');
    $('.xuanZeSku').hide();
});
$('.lianxiren p.shiYongFanWei span.right a:last-child').click(function () {
    $('.xuanZeSku').show();
});

//发布弹窗
//$('.faBu').click(function () {
//    $('.bg').show();
//
//});
//$('.faBuTanChuang p a').click(function () {
//    $('.bg').hide();
//});
/*选择用户*/
$(".xuanZeYongHu").click(function () {
    $(".userTanChaung").css("display", "block");
});
$(".pro_chahao,.prop_bg").click(function () {
    $(".userTanChaung").css("display", "none");
});
//点击勾选框
$(".shangPinLieBiao div span img").click(function(){
    if($(this).attr("src")=="../../img/no-select.png")
    {
        $(this).attr("src","../../img/yes-select.png");
        $(this).addClass('yes-select');
    }
    else
    {
        $(this).attr("src","../../img/no-select.png");
        $(this).removeClass('yes-select');
    }
});
$('.userTanChaung .win_wancheng').click(function(){
    if($('.shangPinLieBiao div span img').hasClass('yes-select')){
        $(".userTanChaung").css("display", "none");
        $(".yongHuLieBiao ").css("display", "block");
        popUp_auto(1000,'添加成功');
    }else{
        $(".userTanChaung").css("display", "none");
    }
});
/*选择sku*/
$(".xuanZeSku").click(function () {
    $(".skuTanChuang").css("display", "block");
});
$(".pro_chahao,.prop_bg").click(function () {
    $(".skuTanChuang").css("display", "none");
});
$(".shangPinShuXing .gouXuan img").click(function(){
    if($(this).attr("src")=="../../img/no-select.png")
    {
        $(this).attr("src","../../img/yes-select.png");
        $(this).addClass('yes-select');
    }
    else
    {
        $(this).attr("src","../../img/no-select.png");
        $(this).removeClass('yes-select');
    }
});
$('.skuTanChuang .win_wancheng').click(function(){
    if($('.shangPinShuXing .gouXuan img').hasClass('yes-select')){
        $(".skuTanChuang").css("display", "none");
        $(".shangPinShuXingLieBiao ").css("display", "block");
        popUp_auto(1000,'添加成功');
    }else{
        $(".skuTanChuang").css("display", "none");
    }
});
//点击删除图标
$(".LieBiao .width4 span.shanChu img").click(function () {
    $(this).attr("src","../../img/shanchuhong@3x.png");
    $(this).parent().parent().remove();
});
//优惠详情滑动效果
$(window).scroll(function () {
    var trikerH = $(".triker").height();
    var deff = trikerH - $(".header").height();
    if ($(window).scrollTop()> deff) {
        $(".goods_shuXing .top").css({
            position: "fixed",
            top: "0.88rem",
            zIndex: "5"
        });

    } else {
        $(".goods_shuXing .top").css({
            zIndex: "",
            position: "",
            top: ""});

    }
});
