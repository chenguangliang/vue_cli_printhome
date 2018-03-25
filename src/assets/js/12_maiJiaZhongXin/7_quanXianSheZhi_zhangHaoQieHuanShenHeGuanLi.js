//点击查看
$('.look').click(function () {
    if($(this).prev().html()=='通过'){
        $('.daiShenHe').show();
        $('.con2').show();
        $('.con').hide();
        return false;
    }else if($(this).prev().html()=='待审核'){
        $('.daiShenHe').show();
        $('.con').show();
        $('.con2').hide();
        return false;
    }

});
//关闭弹窗
$('.cancel,.close,.sure').click(function () {
    $('.daiShenHe').hide();
});
//提示切换成功
$('.con .sure').click(function(){
    $('.qieHuanChengGong').show().delay(1000).hide(0);
})