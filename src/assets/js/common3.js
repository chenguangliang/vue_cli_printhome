//�ص�������ť
$(window).scroll(function () { //scroll--���������������ʽ����
    var wHeight = $(window).height(); //��ȡ��������Ӵ��ڸ߶�
    var wTop = $(window).scrollTop(); //��ȡ���������붥���߶�
    if (wTop >= wHeight)  //�����������붥���߶ȳ���һ��ʱִ��
    {
        $("#top").show();  //���ض�����ť��ʾ
    }
    else {
        $("#top").hide();  //���ض�����ť����
    }
});
$("#top").click(function () {
    $("html,body").animate({scrollTop: 0}, 200);  //ҳ��500���뷵�ض���
});
//�ײ�����ѡ�б���ͼƬ�л�
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
    //��ʼ��
    $("#shouye").attr("src", "../../img/index.png");
    $("#luntan").attr("src", "../../img/luntan.png");
    $("#maijia").attr("src", "../../img/my.png");
    $("#maiJia").attr("src", "../../img/weixuanzhong@3x.png");
}
//�ײ������������л�
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
/*���input��ѹ̶���λ��Ԫ������������*/
function input_hide(input_el, hide_el) {
    $(input_el).focus(function () {
        $(hide_el).addClass("none");
    });
    $(input_el).blur(function () {
        $(hide_el).removeClass("none");
    });
}
//ȥ���ַ����пո�
function del_space(str) {
    var str1="";
    for (var i = 0; i < str.length; i++) {
        if (str[i]!=" ") {
            str1+=str[i];
        }
    }
    return str1;
}
//��ȡ����

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


