
//表单验证
$('#xingMing').blur(function(){
    if($(this).val()){
        $(".xingMing").addClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    } else{
        $(".xingMing").removeClass("none");
        $(this).css('color','#e60012');
        $(this).css('border-color','#e60012');
    }
});
$('#xingMing').focus(function(){
    $(".xingMing").addClass("none");
    $(this).css('color','#333');
    $(this).css('border-color','#ccc');
});
$('#shoujIHao').blur(function(){
    if($(this).val()){
        $(".telPhone").addClass("none");
        if(
            /^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/.test($(this).val())
        ){
            $(".shoujIHao ").addClass("none");
            $(this).css('color','#333');
            $(this).css('border-color','#ccc');
        }else{
            $(".shoujIHao ").removeClass("none");
            $(this).css('color','#e60012');
            $(this).css('border-color','#e60012');
        }
    }else{
        $(".telPhone ").removeClass("none");
    }
});
$('#shoujIHao').focus(function(){
    $(".telPhone").addClass("none");
    $(".shoujIHao ").addClass("none");
    $(this).css('color','#333');
    $(this).css('border-color','#ccc');
});
$('#fixedTel').blur(function(){
    if($(this).val()){
        if(
            /0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}/.test($(this).val())
        ){
            $(".fixedTel").addClass("none");
            $(this).css('color','#333');
            $(this).css('border-color','#ccc');
        }else{
            $(".fixedTel").removeClass("none");
            $(this).css('color','#e60012');
            $(this).css('border-color','#e60012');
        }
    }else{
        return false;
    }
});
$('#fixedTel').focus(function(){
    $(".fixedTel").addClass("none");
    $(this).css('color','#333');
    $(this).css('border-color','#ccc');
});
$('#sel_Province').blur(function(){
    if($(this).val()){
        $(".sel_Province ").addClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }else{
        $(".sel_Province ").removeClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
$('#sel_Province').focus(function(){
    $(".sel_Province ").addClass("none");
    $(this).css('color','#333');
    $(this).css('border-color','#ccc');
});
$('#sel_City').blur(function(){
    if($(this).val()){
        $(".sel_City ").addClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }else{
        $(".sel_City ").removeClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
$('#sel_City').focus(function(){
    $(".sel_Province ").addClass("none");
    $(this).css('color','#333');
    $(this).css('border-color','#ccc');
});
$('#sel_County').blur(function(){
    if($(this).val()){
        $(".sel_Province ").addClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }else{
        $(".sel_Province ").removeClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
$('#sel_County').focus(function(){
    $(".sel_Province ").addClass("none");
    $(this).css('color','#333');
    $(this).css('border-color','#ccc');
});
$('#address').blur(function(){
    if($(this).val()){
        $(".fullAddress").addClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }else{
        $(".fullAddress").removeClass("none");
        $(this).css('color','#333');
        $(this).css('border-color','#ccc');
    }
});
$('#address').focus(function(){
    $(".fullAddress").addClass("none");
    $(this).css('color','#333');
    $(this).css('border-color','#ccc');
});
//$(".saveAddress").click(function (e) {
//    if (
//        $(".warm").hasClass("none") &&
//        /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/.test($('#xingMing').val()) &&
//        $('#sel_Province,#sel_City,#sel_County,#address').val()!=0 &&
//        /^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/.test($('#shoujIHao').val())
//    ) {
//    }else if(
//        $(".warm").hasClass("none") &&
//        /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/.test($('#xingMing').val()) &&
//        $('#sel_Province,#sel_City,#sel_County,#address').val()!=0 &&
//        /^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/.test($('#shoujIHao').val()) &&
//        $('.tianXie div input[type=checkbox]').is(':checked')
//    ){
//        popUp_auto(1000,'默认地址设置成功');
//    }
//    else{
//        e.preventDefault();
//    }
//});


