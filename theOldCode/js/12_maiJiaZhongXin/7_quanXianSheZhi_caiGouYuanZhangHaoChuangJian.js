//表单验证
$("#zhangHao").blur(function () {
    var reg =  /^((?=.*?[0-9])(?=.*?[A-Za-z])|(?=.*?[0-9])(?=.*?[_])|(?=.*?[A-Za-z])(?=.*?[_]))[0-9A-Za-z_]{4,20}$/;
    if (!reg.test($(this).val())) {
        $(this).parents().parents().next(".warm").removeClass("none");
        $(this).css('color','#e60012');
        $(this).css('border-color','#e60012');
    } else {
        $(this).parents().parents().next(".warm").addClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
$(".btn .sure").click(function (e) {
    if (
        $(".warm").hasClass("none") &&
        /^((?=.*?[0-9])(?=.*?[A-Za-z])|(?=.*?[0-9])(?=.*?[_])|(?=.*?[A-Za-z])(?=.*?[_]))[0-9A-Za-z_]{4,20}$/.test($('#zhangHao').val())
    ) {
    }else{
        e.preventDefault();
    }
});
$("#miMa").blur(function () {
    var reg =  /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[\W])|(?=.*?[A-Za-z])(?=.*?[\W]))[\dA-Za-z\W]+.{6,20}$/;
    if (!reg.test($(this).val())) {
        $(this).parents().parents().next(".warm").removeClass("none");
        $(this).css('color','#e60012');
        $(this).css('border-color','#e60012');
    } else {
        $(this).parents().parents().next(".warm").addClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
$("#miMa2").blur(function () {
    if ($("#miMa2").val()!=$("#miMa").val()) {
        $(this).parents().parents().next(".warm").removeClass("none");
        $(this).css('color','#e60012');
        $(this).css('border-color','#e60012');
    } else {
        $(this).parents().parents().next(".warm").addClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
//重置密码按钮
$(".chongZhi").click(function () {
    popUp_auto(1000,'密码重置成功');

});
//提交按钮
$(".btn .queDing").click(function (e) {
    if (
        $(".warm").hasClass("none") &&
        /^((?=.*?[0-9])(?=.*?[A-Za-z])|(?=.*?[0-9])(?=.*?[_])|(?=.*?[A-Za-z])(?=.*?[_]))[0-9A-Za-z_]{4,20}$/.test($('#zhangHao').val()) &&
        /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[\W])|(?=.*?[A-Za-z])(?=.*?[\W]))[\dA-Za-z\W]+.{6,20}$/.test($('#miMa').val()) &&
        $("#miMa2").val()==$("#miMa").val()
    ) {
    }else{
        e.preventDefault();
    }
});

