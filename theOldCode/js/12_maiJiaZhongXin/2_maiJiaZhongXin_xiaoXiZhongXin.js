intercept('.xiaoXiZhongXin .bottom',71);
$('.quanBuYiDu').click(function(){
    $('.hongDian').hide();
});
$('.xiaoXiZhongXin').click(function(){
    $(this).children().children('.hongDian').hide();
    var xinxi=$(this).children('.bottom').html();
    $('.zhezhao').show();
});
$('.close').click(function(){
    $('.zhezhao').hide();
})