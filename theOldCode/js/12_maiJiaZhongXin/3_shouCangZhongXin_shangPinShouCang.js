//点击编辑的效果
$('.bianJi').click(function(){
    $(this).hide();
    $('.twoButton').show();
    $('.gouXuan').css('display','inline-block');
});
//点击保存的效果
$('.baoCun').click(function(){
    $(this).parent().hide();
    $('.bianJi').show();
    $('.gouXuan').hide();
});
//点击删除的效果
$('.shanChu').click(function(){
    if($('.no-select').attr("src")=="../../img/no-select.png"){
        $('.zhezhao').show();
    }else{
        $('.zhezhao2').show();
    }
});
//点击确定的效果
$('.queDing').click(function(){
    popUp_auto(1000,'删除成功');
    $('.zhezhao2').hide();
    $('.twoButton').hide();
    $('.wanCheng').show();
});
//点击取消的效果
$('.quXiao').click(function(){
    $('.zhezhao2').hide();
});
//点击完成的效果
$('.wanCheng').click(function(){
    $(this).hide();
    $('.bianJi').show();
    $('.gouXuan').hide();
});
//点击叉号的效果
$('.close').click(function(){
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