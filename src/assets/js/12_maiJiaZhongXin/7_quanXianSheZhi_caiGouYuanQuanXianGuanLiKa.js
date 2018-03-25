//点击删除的效果
$('.delete').click(function(){
    $('.zhezhao').show();
});
//点击确定的效果
$('.queDing').click(function(){
    $('.zhezhao').hide();
    popUp_auto(1000,'删除成功')
});
//点击取消的效果
$('.quXiao').click(function(){
    $('.zhezhao').hide();

});