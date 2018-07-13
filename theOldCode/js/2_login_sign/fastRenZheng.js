var companyName = /^[\u4e00-\u9fa5a-zA-Z0-9_\-\—\\(\\)\\（\\）|\w]{4,40}$/;
var linkMan = /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;
$('.companyName').blur(function(){
    if(
        !companyName.test($(this).val()) &&
        $(this).val() !=0
    ){
        $(this).parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('.companyName').focus(function(){
    $(this).parent().next('.warm').addClass("none");
    $(this).removeClass("red_border");
    $(this).addClass("ccc_border");
    $(this).removeClass("red_word");
    $(this).addClass("gray_word");
});
$('.linkMan').blur(function(){
    if(
        !linkMan.test($(this).val()) &&
        $(this).val() !=0
    ){
        $(this).parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('.linkMan').focus(function(){
    $(this).parent().next('.warm').addClass("none");
    $(this).removeClass("red_border");
    $(this).addClass("ccc_border");
    $(this).removeClass("red_word");
    $(this).addClass("gray_word");
});
$(".tijiao").click(function (e) {
    if (
        companyName.test($('.companyName').val()) &&
        linkMan.test($('.linkMan').val()) &&
        $('input[type=checkbox]').next("label").hasClass('dianji')
    ) {
        $('.regist_item').next('.warm').hide();
    }
    else{
        e.preventDefault();
    }
    if (
        companyName.test($('.companyName').val()) &&
        linkMan.test($('.linkMan').val()) &&
        ! $('input[type=checkbox]').next("label").hasClass('dianji')
    ) {
        $('.regist_item').next('.warm').show();
    }
});
//点击经营范围
$('input[type=checkbox]').click(function(){
    if($(this).next("label").hasClass('chushi')){
        $(this).next("label").removeClass('chushi').addClass('dianji');

    }else{
        $(this).next("label").removeClass('dianji').addClass('chushi');
    }
    $('.regist_item').next('.warm').hide();
});