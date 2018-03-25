
function initJqueryItem(){
    //品类弹窗一级、二级、三级列表
    $(".kezi").click(function(){
        if(!$(this).hasClass('dianjihou')){
            $(this).addClass('dianjihou').parent().siblings().children('.kezi').removeClass('dianjihou');
        }else{
            $(this).removeClass('dianjihou');
        }
        if($(this).children().hasClass('yijibg')){
            $(this).children().removeClass('yijibg').addClass('yijibg2').parent().parent().siblings().children().children().removeClass('yijibg2').addClass('yijibg');
        }else{
            $(this).children().removeClass('yijibg2').addClass('yijibg');
        }
        $(this).next().slideToggle().parent().siblings().children('.erji').slideUp();
    });
}

function initJqueryCase() {
    var $div_li =$(".erji ol li");
    $div_li.click(function(){
        if(!$(this).hasClass('erjiColor2')){
            $(this).addClass('erjiColor2').siblings().removeClass("erjiColor2").parent().siblings().children('li').removeClass("erjiColor2");
        }else{
            $(this).removeClass('erjiColor2');
        }
        var index =  $div_li.index(this);
        if($(".sanji").eq(index).css('display')=='block'){

            $(".sanji").eq(index).css('display','none');

        }else{
            $(".sanji").eq(index).show().siblings('.sanji').hide();
        }

    });
}
