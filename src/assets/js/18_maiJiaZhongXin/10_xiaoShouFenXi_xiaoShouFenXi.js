/**
 * Created by like on 2017/1/12.
 */
$('.shangPinLieBiao .theTop').click(function(){
    $(this).next().slideToggle().parents().siblings().children('.shuXing').hide();
});
$('.shuXing ul li').click(function(){
    $(this).addClass('on').siblings().removeClass('on');
});
$('.xuanXiangKa .qieHuan').click(function(){
    $('.xuanXiangKa,.lieBiao').hide();
    $('.tongJiTu').show();
});
$(".tongJiTu ul li").click(function(){
    $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
    var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
    $(".tu > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
});
$('.tongJiTu .qieHuan').click(function(){
    $('.tongJiTu').hide();
    $('.xuanXiangKa,.lieBiao').show();
});