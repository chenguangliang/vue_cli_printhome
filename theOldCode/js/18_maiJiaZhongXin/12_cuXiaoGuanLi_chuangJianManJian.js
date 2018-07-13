/**
 * Created by like on 2017/1/20.
 */

$(".manJian img").click(function (e) {
    this.src="../../img/yes-select.png";
    $(this).siblings()[0].src="../../img/no-select.png";
    var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
    $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
});
//选择用户类型
$('.yongHuLeiXing  span.right a').click(function(){
    $(this).addClass('on').siblings().removeClass('on');
});
//选择会员等级
$('.huiYuanDengJi  span.right a').click(function(){
    $(this).addClass('on');
});
//发布提示弹窗
//$('.faBu').click(function () {
//    $('.bg').show();
//
//});
//$('.faBuTanChuang p a').click(function () {
//    $('.bg').hide();
//});
//添加商品弹窗
$(".tianJiaShangPin").click(function () {
    $(".win_Promotion").css("display", "block");
});
$(".pro_chahao,.prop_bg").click(function () {
    $(".win_Promotion").css("display", "none");
});
//选择商品
$(".shangPinLieBiao div span img").click(function (e) {
    if (this.src.indexOf("no-select.png") == -1) {
        this.src = "../../img/no-select.png";
    } else {
        this.src = "../../img/yes-select.png";
    }
});
$('.win_wancheng').click(function(){
    if($('.shangPinLieBiao div span img').attr("src")==("../../img/no-select.png")){
        $(".win_Promotion").css("display", "none");
    }else{
        $(".win_Promotion").css("display", "none");
        $(".cuXiaoShangPin").css("display", "block");
        popUp_auto(1000,'添加成功');
    }
});
//促销详情
/*动态固定商品介绍导航开始*/
$(window).scroll(function () {
    var trikerH = $(".triker").height();
    var deff = trikerH - $(".header").height();
    if ($(window).scrollTop()> deff) {
        $(".cuXiaoShangPin .title").css({
            position: "fixed",
            top: "0.88rem",
            zIndex: "5",
            borderBottom : "1px solid #e8e8e8"
        })

    } else {
        $(".cuXiaoShangPin .title").css({position: "", top: "", paddingTop: "",border:""});
    }
});
$(".quanBu .youHuiXuanZe img").click(function (e) {
    this.src="../../img/yes-select.png";
    $(this).siblings()[0].src="../../img/no-select.png";
    var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
    $(".quanBu .youHuiGuiZe > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
});
$(".buFen .youHuiXuanZe img").click(function (e) {
    this.src="../../img/yes-select.png";
    $(this).siblings()[0].src="../../img/no-select.png";
    var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
    $(".buFen .youHuiGuiZe > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
});