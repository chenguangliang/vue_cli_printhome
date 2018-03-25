/**
 * Created by like on 2017/1/20.
 */
//点击相机
//$('.lianxiren p .xiangJi').click(function(){
//    $(this).hide().next('.zhaoPian').show();
//});
//点击放大图片
$('.lianxiren p .zhaoPian').click(function(){
    $('.zhezhao').show();
});
//关闭弹窗
$('.zhezhao .con .close,.zhezhao .con input').click(function () {
    $('.zhezhao').hide();
});
//或 且 按钮
$(".huoQie img").click(function (e) {
    this.src="../../img/yes-select.png";
    $(this).siblings()[0].src="../../img/no-select.png";
});
//地址三级联动
$(function(){
    AreaSelector().init();
    function getValue(id) {
        var sel = document.getElementById(id);
        if (sel && sel.options) {
            alert(sel.options[sel.selectedIndex].value);
        }
    }
    function getText(id) {
        var sel = document.getElementById(id);
        if (sel && sel.options) {
            alert(sel.options[sel.selectedIndex].text);
        }
    }
});
//必填项校验
//$('.dianPuMingCheng,.dianPuLeiXing,.pinPaiLeiXing,.jingYingLeiXing,.jieDaoDiZhi').blur(function(){
//    if($(this).val()==''){
//        $(this).parent().parent().next('.warm').removeClass("none");
//        $(this).removeClass("ccc_border");
//        $(this).addClass("red_border");
//        $(this).removeClass("gray_word");
//        $(this).addClass("red_word");
//    }else{
//        $(this).parent().parent().next('.warm').addClass("none");
//        $(this).removeClass("red_border");
//        $(this).addClass("ccc_border");
//        $(this).removeClass("red_word");
//        $(this).addClass("gray_word");
//    }
//});
//
//$('#sel_Province,#sel_City,#sel_County').blur(function(){
//    if($(this).val()==''){
//        $(this).parent().next('.warm').removeClass("none");
//        $(this).removeClass("ccc_border");
//        $(this).addClass("red_border");
//        $(this).removeClass("gray_word");
//        $(this).addClass("red_word");
//    }else{
//        $(this).parent().next('.warm').addClass("none");
//        $(this).removeClass("red_border");
//        $(this).addClass("ccc_border");
//        $(this).removeClass("red_word");
//        $(this).addClass("gray_word");
//    }
//});
//$(".faBu").click(function (e) {
//    if (
//        $(".warm").hasClass("none") &&
//        $('.dianPuMingCheng').val()!=0 &&
//        $('.dianPuLeiXing').val()!=0 &&
//        $('.pinPaiLeiXing').val()!=0 &&
//        $('.jingYingLeiXing').val()!=0 &&
//        $('.shuLiang').val()!=0 &&
//        $('.jinE').val()!=0 &&
//        $('#sel_Province').val()!=0 &&
//        $('#sel_City').val()!=0 &&
//        $('#sel_County').val()!=0 &&
//        $('.jieDaoDiZhi').val()!=0
//    ) {
//    } else {
//        e.preventDefault();
//    }
//});