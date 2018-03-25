/**
*@fileName:gouWuChe.js
*@author:fdc
*@time:2017/3/17 0017
*@disc:满减滚动
*/
function fullReduceScroll(){
    //文字向上滚动
    //$(".scrollDiv").each(function(index,ele){
    //    if($(ele).find("li").length > 1){
    //        $(ele).Scroll({line: 1, speed: 500, timer: 2000});
    //    }
    //});
    //文字向上滚动
    //$(".scrollDiv").cxScroll({direction:"bottom",speed:600,time:3000,plus:false,minus:false,step:1});
    /*var swiper = new Swiper('.swiper-container', {
        speed:800,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
        direction: 'vertical',
        loop : true
    });*/
}
fullReduceScroll();
function limitWordLength(){
    //限制字数
    intercept('.dianPuMing',18);
    intercept('.dianming',11);
    intercept('.leixing',11);
}
limitWordLength();
/*编辑*/
$(".bianJi").click(function (e) {
    if (this.innerHTML == "编辑") {
        this.innerHTML = "完成";
        $(".bianjizhong").css({"display": "block"});
        $(".weibianji").css({"display": "none"});
        $('.shangpinming,.jiajian,.ling,.manjian').hide();
        $('.gaiBian').css('display','inline-block');
        $('.xiaLa').show();
    } else {
        this.innerHTML = "编辑";
        $(".bianjizhong").css({"display": "none"});
        $(".weibianji").css({"display": "block"});
        $('.shangpinming,.jiajian,.ling,.manjian').show();
        $('.gaiBian,.xiaLa').hide();
    }
});
/*店铺img选中状态*/
$(".qijianshangpin .select,.ziyingshangpin .select").click(function (e) {
    if (this.src.indexOf("no-select.png") == -1) {
        this.src = "../../img/no-select.png";
        $(this).parent().parent().siblings(".qijiantitle,.ziyingtitle").children(".select")[0].src = "../../img/no-select.png";
        $(".quanxuan")[0].src = "../../img/no-select.png";
    } else {
        this.src = "../../img/yes-select.png";
        if ($(this).parent().parent().siblings(".qijianshangpin,.ziyingshangpin").length == 0) {
            $(this).parent().parent().siblings(".qijiantitle,.ziyingtitle").children(".select")[0].src = "../../img/yes-select.png";
            var a1 = $(this).parent().parent().parent().siblings().find(".qijiantitle .select,.ziyingtitle .select");
            var count1 = 0;
            for (var i = 0; i < a1.length; i++) {
                if (a1[i].src.indexOf("no-select.png") == -1) {
                    count1++;
                }
            }
            if (count1 == a1.length) {
                $(".quanxuan")[0].src = "../../img/yes-select.png";
            } else {
                $(".quanxuan")[0].src = "../../img/no-select.png";
            }
        } else {
            var a2 = $(this).parent().parent().siblings().find(".select.dange");
            var count2 = 0;
            for (var j = 0; j < a2.length; j++) {
                if (a2[j].src.indexOf("no-select.png") == -1) {
                    count2++;
                }
            }
            if (count2 == a2.length) {
                $(this).parent().parent().siblings(".qijiantitle,.ziyingtitle").find(".select")[0].src = "../../img/yes-select.png";
                var a3 = $(this).parent().parent().parent().siblings().find(".qijiantitle .select,.ziyingtitle .select");
                var count3 = 0;
                for (var k = 0; k < a3.length; k++) {
                    if (a3[k].src.indexOf("no-select.png") == -1) {
                        count3++;
                    }
                }
                if (count3 == a3.length) {
                    $(".quanxuan")[0].src = "../../img/yes-select.png";
                } else {
                    $(".quanxuan")[0].src = "../../img/no-select.png";
                }
            }
        }

    }
});
//店铺名选中
$(".ziyingtitle .select,.qijiantitle .select").click(function (e) {
    if (this.src.indexOf("no-select.png") == -1) {
        this.src = "../../img/no-select.png";
        $(this).parent().siblings().find(".select").each(function (index, item) {
            item.src = "../../img/no-select.png";
        });
        $(".quanxuan")[0].src = "../../img/no-select.png";
    } else {
        this.src = "../../img/yes-select.png";
        $(this).parent().siblings().find(".select").each(function (index, item) {
            item.src = "../../img/yes-select.png";
        });
        var a4 = $(this).parent().parent().siblings().find(".qijiantitle .select,.ziyingtitle .select");
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
/*加减商品数量*/
$(".jia").click(function (e) {
    var a = $(this).siblings(".num").val();
    a++;
    $(this).siblings(".num").val(a);
});
$(".jian").click(function (e) {
    var a = $(this).siblings(".num").val();
    a--;
    $(this).siblings(".num").val(a);
    if (a <=0) {
        $(this).siblings(".num").val(0)
        $('.zhezhao2').show();
    }
});
$(".plus").click(function (e) {
    var a = $(this).siblings(".shuRu").val();
    a++;
    $(this).siblings(".shuRu").val(a);
});
$(".minus ").click(function (e) {
    var a = $(this).siblings(".shuRu").val();
    a--;
    $(this).siblings(".shuRu").val(a);
    if (a <=0) {
        $(this).siblings(".shuRu").val(0)
        $('.zhezhao2').show();
    }
});
//点击确定的效果
$('.zhezhao2 .queDing').click(function(){
    $('.zhezhao2').hide();
    popUp_auto(1000,'删除成功')
});
//点击取消的效果
$('.zhezhao2 .quXiao').click(function(){
    $('.zhezhao2').hide();
});

/*一.点击商品属性*/
$(".gaiBian p,i.xiaLa").click(function (e) {
        $(".win_prop").show();
});
/*二.关闭商品属性弹窗*/
$(".prop_chahao,.prop_bg,.win_jiaRu").click(function () {
    $(".win_prop").hide();
});
/*选择sku*/
$(".wrap_con span, .color_con span").click(function () {
    $(this).siblings().removeClass("red");
    $(this).toggleClass("red");
});
//优惠券弹窗
$('.ling').click(function(){
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
    intercept('#dian .liebiao ul li a',19);
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
intercept('#zhi .liebiao ul li a',19);

//指定弹窗
$('.zhiDing .leibie').click(function(){
    $('#zhidingtanchuang,#zhi').show();
});
$('#zhi .guanbi').click(function(){
    $('#zhidingtanchuang,#zhi').hide();
});

//品类弹窗列表限制字数
intercept('#pin .liebiao ul li a',19);

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
//商品属性限制字数
intercept('.gaiBian p',16);
//点击去结算
function kuCun(){
    $('.zhezhao3').show();
}

function xiaJia(){
    $('.zhezhao4').show();
}
//点击确定和取消的效果
$('.zhezhao3 .queDing,.zhezhao3 .quXiao').click(function(){
    $('.zhezhao3').hide();
});
//点击删除
$('.shanChu').click(function(){
    $('.zhezhao2').show();
});
//点击收藏
$('.shoucang').click(function(){
    popUp_auto(1000,'收藏成功');
});
