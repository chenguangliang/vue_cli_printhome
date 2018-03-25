//选项卡切换
$(".foot a,.foot2 a,.foot3 a").click(function(){
    $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
});
//点击取消弹出提示
$('.cancle').click(function () {
    $('.zhezhao').show();
});
$('.quXiao,.queDing').click(function(){
    $('.zhezhao').hide();
});
$('.mingcheng,.baoJiaRiQi,.jiaoHuoRiQi,.xunJiaRiQi').blur(function () {
    if($(this).val()==''){
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
})
//点击下一步进行校验
$('.foot .next').click(function (e) {
    if(
        $('.mingcheng').val()!=0 &&
        $('.baoJiaRiQi').val()!=0 &&
        $('.jiaoHuoRiQi').val()!=0 &&
        $('.xunJiaRiQi').val()!=0
    ){

    }
    else{
        e.preventDefault();
        popUp_auto_false(1000, '请完善信息后继续下一步');
    }
});
$('.wuPinMingCheng,.wuPinShuXing,.wuPinShuLiang').blur(function () {
    if($(this).val()==''){
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
})
//点击下一步进行校验
$('.foot2 .baoCun').click(function (e) {
    if(
        $('.wuPinMingCheng').val()!=0 &&
        $('.wuPinShuXing').val()!=0 &&
        $('.wuPinShuLiang').val()!=0
    ){

    }
    else{
        e.preventDefault();
        popUp_auto_false(1000, '请完善信息后继续下一步');
    }
});
//询价物品
intercept('.shangPinShuXing','18');
//点击删除的效果
$('.shanChu').click(function(){
    $(this).css('background-image','url(../../img/shanchuhong@3x.png)');
    $('.zhezhao2').show();
});
//点击确定的效果
$('.zhezhao2 div span.queDing').click(function(){
    $('.zhezhao2').hide();
    popUp_auto(1000,'商品删除成功')
});
//点击取消的效果
$('.zhezhao2 div span.quXiao').click(function(){
    $('.zhezhao2').hide();

});
//卖家中心创建询价
$('.bianhao,.xunJiaFang,.xunJiaMingCheng,.baoJiaRiQi,.jiaoHuoRiQi,.xunJiaRiQi').blur(function () {
    if($(this).val()==''){
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
})
//点击下一步进行校验
$('.foot .next').click(function (e) {
    if(
        $('.bianhao').val()!=0 &&
        $('.xunJiaFang').val()!=0 &&
        $('.xunJiaMingCheng').val()!=0 &&
        $('.baoJiaRiQi').val()!=0 &&
        $('.jiaoHuoRiQi').val()!=0 &&
        $('.xunJiaRiQi').val()!=0
    ){

    }
    else{
        e.preventDefault();
        popUp_auto_false(1000, '请完善信息后继续下一步');
    }
});
//卖家中心报价
$('.wuPinDanJia,.youXiaoShiJian,.youXiaoShiJian2').blur(function () {
    if($(this).val()==''){
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
})
//点击下一步进行校验
$('.footer .sure').click(function (e) {
    if(
        $('.wuPinDanJia').val()!=0 &&
        $('.youXiaoShiJian').val()!=0 &&
        $('.youXiaoShiJian2').val()!=0
    ){

    }
    else{
        e.preventDefault();
        popUp_auto_false(1000, '请完善信息后继续下一步');
    }
});