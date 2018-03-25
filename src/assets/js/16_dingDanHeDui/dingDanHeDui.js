$(".corporate_user").click(function(){
    $(this).parent().next(".payment").slideToggle();
    if($(this).hasClass('xiala')){
        $(this).removeClass('xiala').addClass('xiangshang');
    }else{
        $(this).removeClass('xiangshang').addClass('xiala');
    }
});
$(".select div").click(function(){
    $(this).children().attr("src","../../img/yes-select.png").parent().siblings().children().attr("src","../../img/no-select.png");//切换选中的按钮高亮状态
    var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
    $(".select_list div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
});
/*$(".company_pay").click(function () {
    if (this.value == 0) {
        $(".delay_pay").hide();
        $(".payment_method").html("立即支付")
    } else {
        $(".delay_pay").show();
        $(".payment_method").html("延期支付")
    }
});
$(".person_pay").click(function () {
    $(".payment_method").html("立即支付")
});*/
//优惠券弹窗
$('.youHuiQuan').click(function(){
    $('.zheZhao').show();
    $('.lingQuan').slideDown();
});
//关闭优惠券弹窗
$('.lingQuan .biaoTi span').click(function(){
    $('.lingQuan').slideUp();
    $('.zheZhao').hide();
})
//优惠券名称限制字数
intercept('.mingcheng',10);
//优惠券领取提示
var i=3;
$(".quan .content").click(function (e) {
    i--;
    if(i<=0){
        $(this).css({"background": 'url("../../img/lingwan@3x.png") no-repeat', "background-size": "100% 100%"})
        $(this).children(".yilingqu").css({"display": "block"});
    }else{
        popUp_auto(1000,'已领取');
    }
});
//点击优惠券右侧变化背景和文字，以及显示可用数和优惠金额
$('.leibie').click(function(){
    $(this).css({"background": 'url("../../img/dianji@3x.png") no-repeat', "background-size": "100% 100%"});
    $(this).children().html('已选择');
    $('.youHuiQuan .zhuangTai').html('-￥1234567890.12');
    $('.youHuiQuan .xianShi').show();
    $(this).parents().siblings().children('.leibie').css({"background": 'url("../../img/yuanshi@3x.png") no-repeat', "background-size": "100% 100%"});
    $(this).parents().siblings().children('.leibie').children().html('点击使用');
});
//所有弹窗禁止点透
$(".zheZhao").on("touchmove", function (e) {
    e.preventDefault();
});
//商品名称限制字数
intercept('.qingDan .content .xinXi h3',18);
intercept('.qingDan .content .xinXi p.leiXing',15);
///*店铺img选中状态*/
$(".lk2 .select,.lk .select").click(function (e) {
    if (this.src.indexOf("no-select.png") == -1) {
        this.src = "../../img/no-select.png";
        $(".quanxuan")[0].src = "../../img/no-select.png";
    } else {
        this.src = "../../img/yes-select.png";
        var a4 = $(this).parent().parent().siblings().find(" .select");
        var count4 = 0;
        for (var l = 0; l < a4.length; l++) {
            if (a4[l].src.indexOf("no-select.png") == -1) {
                count4++;
            }
        }
        if (count4 == a4.length) {
            $(".quanxuan")[0].src = "../../img/yes-select.png";
        } else {
            $(".quanxuan")[0].src = "../../img/no-select.png";
        }
    }
});
/*全选开始*/
$(".quanxuan").click(function (e) {
    if (this.src.indexOf("no-select.png") == -1) {
        $(".select").each(function (index, item) {
            item.src = "../../img/no-select.png";
        });
    } else {
        $(".select").each(function (index, item) {
            item.src = "../../img/yes-select.png";
        });
    }
});
//日期切换
$('.dateTime img').click(function(){
    if($('.dateTime select').css('display')=='block'){
        $('.dateTime select').css('display','none');
        $('.dateTime input').css('display','block');
    }else{
        $('.dateTime select').css('display','block');
        $('.dateTime input').css('display','none');

    }
});
