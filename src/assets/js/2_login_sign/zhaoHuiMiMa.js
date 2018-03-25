/**
 * Created by 陈广良 on 2016/10/19.
 */
function keyPress() {
    var keyCode = event.keyCode;
    if ((keyCode >= 48 && keyCode <= 57)) {
        event.returnValue = true;
    } else {
        event.returnValue = false;
    }
}
var countdown = 90;
function settime(val) {
    $(val).removeClass("red_bg");
    $(val).addClass("ccc_bg");
    if (countdown == 0) {
        val.removeAttribute("disabled");
        val.value = "获取验证码";
        $(val).removeClass("ccc_bg");
        $(val).addClass("red_bg");
        countdown = 90;
        return;
    } else {
        val.setAttribute("disabled", true);
        val.value = countdown + "S";
        countdown--;

    }
    setTimeout(function () {
        settime(val)
    }, 1000)
}
/*找回密码第一步的js*/
$(".code_input").focus(function () {
    $(this).addClass("gray_word");
    $(this).addClass("ccc_border");
    $(this).removeClass("red_border");
    $(this).removeClass("red_word");
    $(".code_error").addClass("none");
});
$(".code_input").blur(function () {
    if (this.value.length == 4) {
        $(this).addClass("gray_word");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_border");
        $(this).removeClass("red_word");
        $(".code_error").addClass("none");

    } else {
        $(this).removeClass("gray_word");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).addClass("red_word");
        $(".code_error").removeClass("none");
    }
});


/*控制键盘托起固定定位*/
/*input_hide(".user_name", ".btn");
 input_hide(".code_input", ".btn");
 input_hide(".tel_msg", ".btn_second");*/
/*找回密码第二步的js*/
var a = 0;
$(".get_msg").click(function () {
    a++;
    // popUp_auto("验证信息已发送", "请查收");
});
//$(".tel_msg").focus(function () {
//    $(this).addClass("gray_word");
//    $(this).addClass("ccc_border");
//    $(this).removeClass("red_border");
//    $(this).removeClass("red_word");
//    $(".msg_error").addClass("none");
//});
//$(".tel_msg").blur(function () {
//    if (this.value.length == 6) {
//        $(".btn_second input").removeClass("ccc_bg");
//        $(".btn_second input").addClass("red_bg");
//        $(this).addClass("gray_word");
//        $(this).addClass("ccc_border");
//        $(this).removeClass("red_border");
//        $(this).removeClass("red_word");
//        $(".msg_error").addClass("none");
//        if (a != 0) {
//            if ($(".get_msg")[0].value == "获取验证码") {
//                $(".code_expire").removeClass("none");
//            } else {
//                $(".code_expire").addClass("none");
//            }
//        }
//
//    } else {
//        $(".btn_second input").removeClass("red_bg");
//        $(".btn_second input").addClass("ccc_bg");
//        $(this).removeClass("gray_word");
//        $(this).removeClass("ccc_border");
//        $(this).addClass("red_border");
//        $(this).addClass("red_word");
//        $(".msg_error").removeClass("none");
//    }
//});
$(".tel_msg").focus(function () {
    $(this).addClass("gray_word");
    $(this).addClass("ccc_border");
    $(this).removeClass("red_border");
    $(this).removeClass("red_word");
    $(".msg_error").addClass("none");
    $(".btn_second input").removeClass("ccc_bg");
    $(".btn_second input").addClass("red_bg");
});
$(".tel_msg").blur(function(){
    if (this.value.length !=0 &&this.value.length != 4){
        $(".btn_second input").removeClass("red_bg");
        $(".btn_second input").addClass("ccc_bg");
        $(this).removeClass("gray_word");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).addClass("red_word");
        $(".msg_error").removeClass("none");
    }
    if (this.value.length == 4) {
        $(".btn_second input").removeClass("ccc_bg");
        $(".btn_second input").addClass("red_bg");
        $(this).addClass("gray_word");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_border");
        $(this).removeClass("red_word");
        $(".msg_error").addClass("none");
        if (a != 0) {
            if ($(".get_msg")[0].value == "获取验证码") {
                $(".code_expire").removeClass("none");
            } else {
                $(".code_expire").addClass("none");
            }
        }
    }
});

/*找回密码第三页*/
$(".password").blur(function () {
    if (!(/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test(this.value))) {
        $(".msg_error ").removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    } else {
        $(".msg_error ").addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});
$(".check_password").blur(function () {
    if (this.value != $(".password")[0].value) {
        $(".msg_diff ").removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    } else {
        $(".msg_diff ").addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});
//$(".btn_third a").click(function (e) {
//    if ($(".msg_error").hasClass("none") && $(".msg_diff").hasClass("none") && $(".password")[0].value.length != 0) {
//    } else {
//        e.preventDefault();
//    }
//});
//找回密码第三步切换密码显示与隐藏
$('.showKeyWord').click(function(){
    if($(this).hasClass('closedEyes')){
        $(this).removeClass('closedEyes').addClass('opendEyes');
        $(this).prev("input").attr('type','text');
    }else{
        $(this).removeClass('opendEyes').addClass('closedEyes');
        $(this).prev("input").attr('type','password');
    }
});

























