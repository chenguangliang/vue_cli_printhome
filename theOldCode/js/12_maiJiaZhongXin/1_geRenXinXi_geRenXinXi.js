//下拉框默认颜色
var unSelected = "#999";
var selected = "#333";
//$(function () {
//    $("select").css("color", unSelected);
//    $("option").css("color", selected);
//    $("select").change(function () {
//        var selItem = $(this).val();
//        if (selItem == $(this).find('option:first').val()) {
//            $(this).css("color", unSelected);
//        } else {
//            $(this).css("color", selected);
//        }
//    });
//});
////地图三级联动
//$(function(){
//    AreaSelector().init();
//    function getValue(id) {
//        var sel = document.getElementById(id);
//        if (sel && sel.options) {
//            printAlert(sel.options[sel.selectedIndex].value);
//        }
//    }
//    function getText(id) {
//        var sel = document.getElementById(id);
//        if (sel && sel.options) {
//            printAlert(sel.options[sel.selectedIndex].text);
//        }
//    }
//});

//失去焦点判断金额
function checkMoney(){
    var reg = /^[1-9][0-9]{0,8}$/;
    if (!reg.test($("#money").val())) {
        $('#money').css('color','#e60012');
        $('#money').css('border-color','#e60012');
        $("#money").parents().parents().next('.warm').removeClass('none');
    }else{
        $('#money').css('color','#333');
        $('#money').css('border-color','#ccc');
        $("#money").parents().parents().next('.warm').addClass('none');
    }

};
//限制兴趣爱好字数
function checkZishu(){
    if($('#erBai').val().length>200){
        $("#erBai").parents().parents().next('.warm').removeClass('none');
    }else{
        $("#erBai").parents().parents().next('.warm').addClass('none');
    }
}
//限制自我评价字数
function checkZishu2(){
    if($('#yiBai').val().length>100){
        $("#yiBai").parents().parents().next('.warm').removeClass('none');
    }else{
        $("#yiBai").parents().parents().next('.warm').addClass('none');
    }
}

function initCase(){
    //点击编辑的效果
    $('.bianJi').click(function(){
        $(this).hide();
        $('.baoCun').show();
        $('.chaKan').hide();
        $('.xiuGai').show();
    });
    //失去焦点判断昵称
    $('#niCheng').blur(function(){
        //var reg =  /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;
        var reg =  /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/;
        if(!reg.test($(this).val())){
            $(this).parents().parents().next('.warm').removeClass('none');
            $(this).css('color','#e60012');
            $(this).css('border-color','#e60012');
        }else{
            $(this).parents().parents().next('.warm').addClass('none');
            $(this).css('color','#333');
            $(this).css('border-color','#ccc');
        }
    });
    //点击保存的效果
    //$(".baoCun").click(function () {
    //    if (
    //        /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/.test($('#niCheng').val()) &&
    //        $('input[type=radio]').is(':checked')
    //    ) {
    //        $("#niCheng").parents().parents().next('.warm').addClass('none');
    //        $("input[type='radio']").parents().parents().next('.warm').addClass('none');
    //        $('.xiuGai,.baoCun').hide();
    //        $('.chaKan,.bianJi').show();
    //    }else{
    //        $("input[type='radio']").parents().parents().next('.warm').removeClass('none');
    //        $("#niCheng").parents().parents().next('.warm').removeClass('none');
    //    }
    //});
}