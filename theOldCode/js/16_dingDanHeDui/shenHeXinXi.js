

function changeCard(){
    //选项卡切换
    $(".xuanXiangKa ul li").click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
        var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
        $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
    });
}

changeCard();
//提醒选择审核人
$('.btn input').click(function () {
    if($('.tab_box .div2 p input').is(':checked')){
        $('.tab_box .div2 .tiXing').hide();
    }else{
        $('.tab_box .div2 .tiXing').show().delay(1000).hide(0);
    }
});