//点击导航显示下拉菜单
$(".selemenu").click(function(){
    $(this).next().slideToggle();
    $(this).parents().siblings().find(".citylist").slideUp();
    if($(this).parent().hasClass('xiala')){
        $(this).parent().removeClass('xiala').addClass('xiangshang');
        $(this).parent().siblings('.selemediv ').removeClass('xiangshang').addClass('xiala');
    }else{
        $(this).parent().removeClass('xiangshang').addClass('xiala');
    }
});
//点击下拉菜单改变导航
$(".citylist li").click(function(){
    var text=$(this).text();
    $(this).parent().prev().html(text);
    if($(this).parent().parent().hasClass('xiala')){
        $(this).parent().parent().removeClass('xiala').addClass('xiangshang');
    }else{
        $(this).parent().parent().removeClass('xiangshang').addClass('xiala');
    }
    $(this).parent().hide();
});
//点击其他地方收回下拉菜单
    $(document).not($(".selemediv")).click(function(){
        $(".citylist").slideUp();
    })
    $(".selemediv").click(function(event){
        event.stopPropagation();
    })
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

//所有弹窗禁止点透
$(".pingtaitanchuang,.dianputanchuang").on("touchmove", function (e) {
    e.preventDefault();
});

//店铺弹窗列表限制字数
testAuto('#dian .liebiao ul li a',19);

//平台弹窗
$('.pingTai .leibie').click(function(){
    $('.pingtaitanchuang').show();
});
$('.pingtaitanchuang .pingtai span').click(function(){
    $('.pingtaitanchuang').hide();
});



//店铺弹窗
$('.dianPu .leibie').click(function(){
    $('#dianputanchuang,#dian').show();
});
$('#dian  .guanbi').click(function(){
    $('#dianputanchuang,#dian').hide();
});


//指定弹窗列表限制字数
testAuto('#zhi .liebiao ul li a',19);

//指定弹窗
$('.zhiDing .leibie').click(function(){
    $('#zhidingtanchuang,#zhi').show();
});
$('#zhi .guanbi').click(function(){
    $('#zhidingtanchuang,#zhi').hide();
});


//品类弹窗列表限制字数
testAuto('#pin .liebiao ul li a',19);

//品类弹窗
$('.pinLei .leibie').click(function(){
    $('#pinleitanchuang,#pin').show();
});
$('#pin .guanbi').click(function(){
    $('#pinleitanchuang,#pin').hide();
});


//品类弹窗一级、二级、三级列表
$(".kezi").click(function(){
    if(!$(this).hasClass('dianjihou')){
        $(this).addClass('dianjihou');
    }else{
        $(this).removeClass('dianjihou');
    }
    if($(this).children().hasClass('yijibg')){
        $(this).children().removeClass('yijibg').addClass('yijibg2');
    }else{
        $(this).children().removeClass('yijibg2').addClass('yijibg');
    }
    $(this).next().children('.erji').slideToggle();
    $(this).next().children('.sanji').hide();
});


//品类弹窗三级列表
$(".erji").click(function(){
    if($(this).hasClass('erjiColor')){
        $(this).removeClass('erjiColor').addClass('erjiColor2');
    }else{
        $(this).removeClass('erjiColor2').addClass('erjiColor');
    }
    $(this).next('.sanji').slideToggle();
});