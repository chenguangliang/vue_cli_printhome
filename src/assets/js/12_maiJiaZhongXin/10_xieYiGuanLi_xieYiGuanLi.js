/**
 * Created by like on 2016/12/12.
 */
//选项卡切换
$(".xuanXiangKa ul li").click(function(){
    $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
    var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
    $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
    $(".caoZuoAnNiu a").eq(index).show().siblings().hide();//促销管理
});
//协议明细
$(".xuanXiangKa ul li").click(function(){
    $('.yinCang').show();
});
$('.xuanXiangKa ul li:last-child').click(function () {
    $('.yinCang').hide();
});
//询价管理
$(".xuanXiangKa ul li").click(function(){
    $('.yincang').hide();
});
$('.xuanXiangKa ul li:last-child').click(function () {
    $('.yincang').show();
});
//协议操作按钮
$(".biaoGe .bottom a").click(function(){
    $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
});
$(".biaoGe .bottom a:not(.xiuGai,.juJue,.chaKan,.baojia,.bao,.zengJia,.baoJia)").click(function(){
    $(".zhezhao").show();
    $('.con h5').html($(this).html());
});
//协议名称限制字数
intercept('.biaoGe .middle a',8);
//点击确定的效果
$('.queDing').click(function(){
    $('.zhezhao').hide();
    popUp_auto(1000,'执行成功');
});
//点击取消的效果
$('.quXiao').click(function(){
    $('.zhezhao').hide();
});


//打开弹窗
$('.juJue').click(function () {
    $('.zhezhao2').show();
})
//关闭弹窗
$('.cancel,.close').click(function () {
    $('.zhezhao2').hide();
})
//判断文本框内容
$('.sure').click(function () {
    if($('.text').val()==''){
        $('.textNone').show().delay(1000).hide(0);
        $('.textNone').html('请先填写拒绝原因！');
    }else{
        $('.zhezhao2').hide();
    }
});
//解决穿透
$(".zheZhao,.zheZhao2").on("touchmove", function (e) {
    e.preventDefault();
});
//新增商品
$(".no-select").click(function(){
    if($(this).attr("src")=="../../img/no-select.png")
    {
        $(this).attr("src","../../img/yes-select.png");
    }
    else
    {
        $(this).attr("src","../../img/no-select.png");
    }
});
//询价管理
intercept('.shangPin',8);
intercept('.shuXing',10);
//点击修改报价
$('.baoJia i').click(function () {
    $(this).css({'background-image':'url(../../img/xiugaiiconhong@3x.png)','color':'#e60012'});
        $('.con2 h3').html('修改报价');
        $('.daiShenHe').show();
});
//关闭弹窗
$('.cancel,.close,.sure').click(function () {
    $('.daiShenHe').hide();
});
$('.biaoGe .baoJia a').click(function(){
    $('.con2 h3').html('报价');
    $('.daiShenHe').show();
});
//选项卡切换
$(".foot a").click(function(){
    $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
});
//询价明细
//点击导航显示下拉菜单
$(".zhanKai").click(function(){
    $(this).next('.mingXi').slideToggle();
    if($(this).children('.jianTou').hasClass('zhiFuDown')){
        $(this).children('.jianTou').removeClass('zhiFuDown').addClass('zhiFuUp');
        $('.line').hide();
    }else{
        $(this).children('.jianTou').removeClass('zhiFuUp').addClass('zhiFuDown');
        $('.line').show();
    }
});
intercept('.xianZhi',8);
$('.caoZuo input[type=button]').click(function(){
    $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
});
$('.caoZuo input[type=button]:first-child').click(function(){
    popUp_auto(1000,'订单审核已通过');
});
intercept('.shangPinMingCheng',35);
intercept('.leiXing',22);
//查看驳回原因
$('.chakanyuanyin').click(function () {
    $('.boHuiBg').show();
});
//关闭弹窗
$('.boHuiYuanYin .sure,.boHuiYuanYin i').click(function () {
    $('.boHuiBg').hide();
});
//审核驳回
$('.shenHe').click(function () {
    $('.shenHeBoHuiBg').show();
});
//判断文本框内容
$('.shenHeBoHui p button.sure').click(function () {
    if($('.shenHeBoHui textarea').val()==''){
        $('.shenHeBoHui .textNone').show().delay(1000).hide(0);
        $('.shenHeBoHui .textNone').html('请先填写驳回原因！');
    }else{
        popUp_auto(1000,'已驳回');
        $('.shenHeBoHuiBg').hide();
    }
});
//关闭弹窗
$('.shenHeBoHui p button.cancel,.shenHeBoHui i').click(function () {
    $('.shenHeBoHuiBg').hide();
});
//增加优惠券数量弹窗
$('.biaoGe .bottom a.zengJia').click(function(){
    $('.zengJiaShuLiang').show();
});
$('.neiRong i,.neiRong div.anNiu span').click(function(){
    $('.zengJiaShuLiang').hide();
});
function compareUserCount(value){
    //正整数
    var zzs = /^[1-9]*[1-9][0-9]*$/;
    if(!zzs.test(value)){
        $("#couponNum").val("1");
        printAlert("增加优惠券数量请输入大于0的整数");
        return false;
    }else{
        var c = parseInt(value) + parseInt($(".modify_oldNum").html());
        if(c > 999999){
            printAlert("优惠券数量最大为 99,9999");
            return false;
        }
    }
    return true;
}

