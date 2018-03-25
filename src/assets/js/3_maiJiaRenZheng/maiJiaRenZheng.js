//基本信息中联系人信息修改
$('.xiuGaiYongHu').click(function(){
    $(this).css('background','#c30d23');
    $('.lianXiRenXinXi ').hide();
    $('.YongHuxiuGai').show();
});
//基本信息中公司信息修改
$('.xiuGaiGongSi').click(function(){
    $(this).css('background','#c30d23');
    $('.gongSiXinXi ').hide();
    $('.GongSiXiuGai').show();
});
//基本信息中公司信息未审核查看原因
$('.boHui').click(function(){
    $('#reject-reason-popup').show();
    clockedBody();
});
$('.close,.shade').click(function(){
    $('#reject-reason-popup').hide();
    unClockedBody();
});
//基本信息中提现账户修改
$('.xiuGaiTiXian').click(function(){
    $(this).css('background','#c30d23');
    $('.tiXianXinxi ').hide();
    $('.tiXianXiuGai').show();
});

