import $ from "jquery"
$(function() {
//截取字数
//     testAuto('#list li a', 8);
//搜索框改变背景
    $(window).scroll(function () { //scroll--浏览器滚动条滚动式触发
        var wHeight = $('.nav').height(); //获取浏览器可视窗口高度
        var wTop = $(window).scrollTop(); //获取滚动条距离顶部高度
        if (wTop >= wHeight)  //当滚动条距离顶部高度超过一屏时执行
        {
            $(".header ").css('background', 'rgba(230,0,18,1)');  //返回顶部按钮显示
            $(".souSuo ").css('background', 'rgba(255,255,255,1)');
            $('.pinDao').css('color','#fff');
            $('.pinDao span').css({'background':'url("../../img/pindao.png") no-repeat','background-size': '100% 100%'});
        }
        else {
            $(".header ").css('background', 'rgba(230,0,18,0.1)');  //返回顶部按钮隐藏
            $(".souSuo ").css('background', 'rgba(255,255,255,0.8)');
            $('.pinDao').css('color','#666');
            $('.pinDao span').css({'background':'url("../../img/pindaohui.png") no-repeat','background-size': '100% 100%'});
        }
        if(
            $("#navigation").css("display")=="block"
        ){
            $("#navigation").hide();
        }
    });
});



