function mountJQueryEvent() {
    //导航栏效果
    //var page= 1;
    //var i = 5;
    ////向右滚动
    //$(".arrow-right").click(function(){ //点击事件
    //    var v_wrap = $(this).parents(".scroll"); // 根据当前点击的元素获取到父元素
    //    var v_show = v_wrap.find(".scroll_list"); //找到展示的区域
    //    var v_cont = v_wrap.find(".box"); //找到展示区域的外围区域
    //
    //    var v_width = v_cont.width();
    //    var len = v_show.find("li").length; //我的图片个数
    //    var page_count = Math.ceil(len/i); //只要不是整数，就往大的方向取最小的整数
    //
    //    if(!v_show.is(":animated")){
    //        if(page == page_count){
    //            v_show.animate({left:'0px'},"slow");
    //            page =1;
    //        }else{
    //            v_show.animate({left:'-='+v_width},"slow");
    //            page++;
    //        }
    //    }
    //
    //});
    //$('.scroll_list ul li').click(function () {
    //    $(this).addClass('on').siblings().removeClass('on');
    //    var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
    //    $(".tab_box .wrapScrool").eq(index).find(".dingDan").show().parent().siblings(".wrapScrool").find(".dingDan").hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
    //    myScroll.refresh();
    //    $(".tab_box").css("transform","translate(0px, -20px)");
    //});
    //导航栏效果
    var page= 1;
    var i = 5;
    //向右滚动
    $(".arrow-right").click(function(){ //点击事件
        var v_wrap = $(this).parents(".scroll"); // 根据当前点击的元素获取到父元素
        var v_show = v_wrap.find(".scroll_list"); //找到展示的区域
        var v_cont = v_wrap.find(".box"); //找到展示区域的外围区域

        var v_width = v_cont.width();
        var len = v_show.find("li").length; //我的图片个数
        var page_count = Math.ceil(len/i); //只要不是整数，就往大的方向取最小的整数

        if(!v_show.is(":animated")){
            if(page == page_count){
                v_show.animate({left:'0px'},"slow");
                page =1;
                //$(this).css("transform","rotate(0deg)");
            }else{
                v_show.animate({left:'-='+v_width},"slow");
                page++;
                //$(this).css("transform","rotate(180deg)");
            }
        }

    });
    $('.scroll>li').click(function () {
        $(this).addClass('on').next().find("li").removeClass("on");
        var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
        $(".tab_box .wrapScrool").eq(index).find(".dingDan").show().parent().siblings(".wrapScrool").find(".dingDan").hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
        myScroll.refresh();
        $(".tab_box").css("transform","translate(0px, -38px)");
    });
    $('.scroll_list li').click(function () {
        $(this).addClass('on').siblings().removeClass('on').parent().parent().prev("li").removeClass("on");
        var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
        $(".tab_box .wrapScrool").eq(index).find(".dingDan").show().parent().siblings(".wrapScrool").find(".dingDan").hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
        myScroll.refresh();
        $(".tab_box").css("transform","translate(0px, -38px)");
    });
//限制字数
//    intercept('.shangPin',18);
    //密码明暗文切换
    $('.see').click(function(){
        if($(this).hasClass('img01')){
            $(this).removeClass('img01').addClass('img02');
            $(this).prev().attr('type','text');
        }else{
            $(this).removeClass('img02').addClass('img01');
            $(this).prev().attr('type','password');
        }
    });
//操作按钮
    $('.caoZuo input[type=button]').click(function () {
        $(this).addClass('on').siblings().removeClass('on');
    });
//取消订单的弹窗
    $('.quXiao').click(function () {
        $('.zhezhao').show();
    });
    //点击确定的效果
    //$('.zhezhao .queDing').click(function(){
    //    $('.zhezhao').hide();
    //    popUp_auto(1000,'订单取消成功');
    //});
    //点击取消的效果
    $('.zhezhao .queDing').click(function(){
        $('.zhezhao').hide();
    });
//延期收货提示
    $('.yanQi').click(function () {
        $('.yanQiTiShi').show().delay(1000).hide(0);
    });
//删除订单的弹窗
    $('.shanChu').click(function () {
        $('.zhezhao2').show();
    });
    //点击确定的效果
    $('.zhezhao .liuZhe').click(function(){
        $('.zhezhao').hide();
        //popUp_auto(1000,'订单删除成功');
    });
//确认收货的弹窗
    $('.queRenShouHuo').click(function () {
        $('.zhezhao3').show();
    });
    //点击确定的效果
    //$('.zhezhao3 .sure').click(function(){
    //    if($('.content .miMa').val()==''){
    //        popUp_auto_false(1000,'密码不能为空');
    //    }else{
    //        $('.zhezhao3').hide();
    //        popUp_auto(1000,'确认收货成功');
    //    }
    //});
    //点击取消的效果
    $('.zhezhao .cancel').click(function(){
        $('.zhezhao').hide();
    });
//收到货款弹窗
$('.shouDao').click(function(){
    $('.zhezhao4').show();
})
    $(".no-select").click(function(){
        $('.no-select').attr('src','../../img/no-select.png');
        $(this).attr('src','../../img/yes-select.png').siblings().attr('src','../../img/no-select.png');
        $('.daoZhang').hide();
        $('.shuRu').hide();
    });
    $('.yinHang').click(function () {
            $('.daoZhang').show();
    });
    $('.qita').click(function(){
        $('.shuRu').show();
    });
    //关闭弹窗
    $('.queding,.quxiao,.neiRong i').click(function(){
        //$('.zhezhao4').hide();
    });
//添加物流弹窗
$('.tianJia').click(function(){
    $('.zhezhao5').show();
});
//关闭弹窗
//$('.queding,.quxiao,.xiangxi i').click(function(){
//    $('.zhezhao5').hide();
//});
//提交退款

//点击导航显示下拉菜单
$(".dingDan .dianJiZhanKai").click(function(){
    $(this).next('.zhaiYao').slideToggle();
    if($(this).children().hasClass('xiaLa')){
        $(this).children().removeClass('xiaLa').addClass('xiangShang');
    }else{
        $(this).children().removeClass('xiangShang').addClass('xiaLa');
    }
});
//订单评价
$(".pingfen img,.pingfen_group img").on("click", function (e) {
    $(this).prop({"src": "../../img/shoucang_red.png"})
        .prevAll().prop({"src": "../../img/shoucang_red.png"});
    $(this).nextAll().prop({"src": "../../img/shoucang.png"});
});
//$('.b div span').click(function(){
//    $(this).parent().hide();
//})
$('.footer input.faBiao').click(function () {
    //$(this).css('background','#c30d23');
    //popUp_auto(1000,'发表成功');
});
$('.footer input.quXiao').click(function () {
    $(this).css('background','#ea5412');
});
//点击选择框的效果
$(".footer a").click(function(){
    if($(this).children().attr("src")=="../../img/no-select.png")
    {
        $(this).children().attr("src","../../img/yes-select.png");
    }
    else
    {
        $(this).children().attr("src","../../img/no-select.png");
    }
});
//提交退款
//点击下一步进行校验
$('.shenQingShuLiang,.tuiKuanXiangQing select,.tuiKuanJinE  ,.tuiKuanXiangQing textarea').blur(function(){
    if($(this).val()==''){
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('.shenQingTuiKuan a').click(function (e) {
    if(
        $('.shenQingShuLiang').val()!=0 &&
        $('.tuiKuanXiangQing select').val()!=0 &&
        $('.tuiKuanJinE').val()!=0 &&
        $('.tuiKuanXiangQing textarea').val()!=0
    ){
    }
    else{
        e.preventDefault();
        popUp_auto_false(1000, '请完善信息后继续下一步');
    }
});

//cgl 分期改造添加
    $(".topBtn").click(function () {
        $(this).addClass('red_word').siblings().removeClass('red_word');
    });

};
