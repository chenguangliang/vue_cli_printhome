//������Ĭ����ɫ
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
////��ͼ��������
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

//ʧȥ�����жϽ��
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
//������Ȥ��������
function checkZishu(){
    if($('#erBai').val().length>200){
        $("#erBai").parents().parents().next('.warm').removeClass('none');
    }else{
        $("#erBai").parents().parents().next('.warm').addClass('none');
    }
}
//����������������
function checkZishu2(){
    if($('#yiBai').val().length>100){
        $("#yiBai").parents().parents().next('.warm').removeClass('none');
    }else{
        $("#yiBai").parents().parents().next('.warm').addClass('none');
    }
}

function initCase(){
    //����༭��Ч��
    $('.bianJi').click(function(){
        $(this).hide();
        $('.baoCun').show();
        $('.chaKan').hide();
        $('.xiuGai').show();
    });
    //ʧȥ�����ж��ǳ�
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
    //��������Ч��
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