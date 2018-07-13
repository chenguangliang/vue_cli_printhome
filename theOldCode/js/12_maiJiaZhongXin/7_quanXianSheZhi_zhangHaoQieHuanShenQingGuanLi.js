//打开弹窗
$('.shenQing').click(function () {
    $('.zhezhao').show();
})
//关闭弹窗
$('.cancel,.close,.tiShi button').click(function () {
    $('.zhezhao').hide();
})
//判断文本框内容
$('.sure').click(function () {
    if($('.text').val()==''){
        $('.textNone').show().delay(1000).hide(0);
        $('.textNone').html('请先填写申请原因！');
    }else if($('.text').val()=='您已经申请'){
        $('.textNone').show().delay(1000).hide(0);
        $('.textNone').html('您已经申请过，无需重复申请！');
    }else if($('.text').val()=='2'){
        $('.con').hide();
        $('.tiShi').show();
        $('.tiShi p').html('非子账号<br/>无法进行子主账号切换');
    }else{
        $('.con').hide();
        $('.tiShi').show();
        $('.tiShi p').html('申请成功<br/>正在等待主账号用户确认申请');
    }
});
$('.tiShi button').click(function(){
    $(this).parent().hide();
})