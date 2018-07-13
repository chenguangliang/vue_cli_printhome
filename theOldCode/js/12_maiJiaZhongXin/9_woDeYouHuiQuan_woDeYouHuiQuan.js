//点击编辑的效果
$('.bianJi').click(function(){
    $(this).hide();
    $('.wanCheng').show();
    $('.gouXuan').css('left','0');
    $('.manjian,.xianjin,.dazhe,.yiguoqi,.yilingwan').css('left','0.4rem');
    $('.delete').show();
});
//点击完成的效果
$('.wanCheng').click(function(){
    $(this).hide();
    $('.bianJi').show();
    $('.gouXuan').css('left','-0.5rem');
    $('.manjian,.xianjin,.dazhe,.yiguoqi,.yilingwan').css('left','0');
    $('.delete').hide();
});
//点击删除的效果
$('.delete').click(function(){
    if($('.yiDong .gouXuan .no-select').attr("src")=="../../img/no-select.png"){
        $('.zhezhao2').show();
    }else{
        $('.zhezhao').show();
    }
});
//点击确定的效果
$('.queDing').click(function(){
    $('.zhezhao').hide();
    popUp_auto(1000,'删除成功');
    //$('.wanCheng').show();
});
//点击取消的效果
$('.quXiao').click(function(){
    $('.zhezhao').hide();
});
//点击选择框的效果
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
//优惠券名称限制字数
testAuto('.mingcheng',10);
//优惠券点击效果
var i=3;
$(".content").click(function (e) {
    i--;
    if(i<=0){
        $(this).css({"background": 'url("../../img/lingwan@3x.png") no-repeat', "background-size": "100% 100%"})
        $(this).children(".yilingqu").css({"display": "block"});
    }else{
        popUp_auto(1000,'已领取');
    }


});
//右侧类别点击变背景色
$('.leibie').click(function(){
    $(this).css({"background": 'url("../../img/dianji@3x.png") no-repeat', "background-size": "100% 100%"});
});
