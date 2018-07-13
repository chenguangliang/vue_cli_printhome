//回到顶部按钮
$(window).scroll(function () { //scroll--浏览器滚动条滚动式触发
    var wHeight = $(window).height(); //获取浏览器可视窗口高度
    var wTop = $(window).scrollTop(); //获取滚动条距离顶部高度
    if (wTop >= wHeight)  //当滚动条距离顶部高度超过一屏时执行
    {
        $("#top").show();  //返回顶部按钮显示
    }
    else {
        $("#top").hide();  //返回顶部按钮隐藏
    }
});
$("#top").click(function () {
    $("html,body").animate({scrollTop: 0}, 200);  //页面500毫秒返回顶部
});
//底部导航选中背景图片切换
$("#shouye").click(function () {
    init_png();
    $(this).attr("src", "../../img/index1.png");
});
$("#luntan").click(function () {
    init_png();
    $(this).attr("src", "../../img/luntan1.png");
});
$("#maijia").click(function () {
    init_png();
    $(this).attr("src", "../../img/my1.png");
});
$("#maiJia").click(function () {
    init_png();
    $(this).attr("src", "../../img/xuanzhong@3x.png");
});
function init_png() {
    //初始化
    $("#shouye").attr("src", "../../img/index.png");
    $("#luntan").attr("src", "../../img/luntan.png");
    $("#maijia").attr("src", "../../img/my.png");
    $("#maiJia").attr("src", "../../img/weixuanzhong@3x.png");
}
//底部导航弹出层切换
$(".win_button").on("click", function () {
    if ($("#zhezhao").hasClass("none")) {
        $("#zhezhao").removeClass("none");
        $(".black_div").animate({'opacity': 1.0}, 500);
        $(this).css({'transform': 'rotate(135deg)', 'transition': 'all 400ms'});
        $("#zhezhao dl").removeClass("bounceOutDown");
        $("#zhezhao dl").addClass("animated bounceInUp");
    } else {
        $(this).css({'transform': 'rotate(0deg)', 'transition': 'all 400ms'});
        $("#zhezhao dl").removeClass("bounceInUp");
        $("#zhezhao dl").addClass("bounceOutDown");

        window.setTimeout(function () {

            $(".black_div").animate({'opacity': 0}, 300);
            window.setTimeout(function () {
                $("#zhezhao").addClass("none");
            }, 300);
        }, 600)
    }
});
$("#zhezhao").on("touchmove", function (e) {
    e.preventDefault();
});
/*点击input会把固定定位的元素先隐藏起来*/
function input_hide(input_el, hide_el) {
    $(input_el).focus(function () {
        $(hide_el).addClass("none");
    });
    $(input_el).blur(function () {
        $(hide_el).removeClass("none");
    });
}
//去除字符串中空格
function del_space(str) {
    var str1="";
    for (var i = 0; i < str.length; i++) {
        if (str[i]!=" ") {
            str1+=str[i];
        }
    }
    return str1;
}
//截取字数

function testAuto(classname, needLeng) {
    var thisClass = $(classname);
    var length = thisClass.length;
    for (var i = 0; i < length; i++) {
        if (thisClass[i].innerHTML.length > needLeng) {
            var nowWord = thisClass[i].innerHTML.substr(0, needLeng) + '...';
            thisClass[i].innerHTML = nowWord;
        }
    }
}
function intercept(classname, needLeng) {
    var thisClass = $(classname);
    var length = thisClass.length;
    for (var i = 0; i < length; i++) {
        if (del_space($(thisClass[i]).text()).length > needLeng) {
            var nowWord = del_space($(thisClass[i]).text()).substr(0, needLeng) + '...';
            thisClass[i].innerHTML = nowWord;
        }
    }
}

/*testAuto('#list li a', 8);
testAuto('.tit', 12);
testAuto('.tit2', 9);
testAuto('.tit3', 11);
testAuto('#scrollDiv ul li a', '30');*/


