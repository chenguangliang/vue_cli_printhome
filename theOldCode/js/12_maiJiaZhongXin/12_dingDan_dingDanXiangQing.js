function mountJQueryEvent() {
    //密码明暗文切换
    $('.see').click(function(){
        if($(this).hasClass('img01')){
            $(this).removeClass('img01').addClass('img02');
            $(this).prev().attr('type','text');
        }else{
            $(this).removeClass('img02').addClass('img01');
            $(this).prev().attr('type','password');
        }
    });
//顶部按钮操作效果
$('.foot input').click(function () {
    $(this).addClass('on').siblings().removeClass('on');
});
//补开增值税普通发票弹窗
    $('#commonInvoiceAdd').click(function(){
        $('.zheZhaoCommonInvoice').show();
        $('.zengZhiShuiXinXi1').slideDown();
        clockedBody();
    });
//关闭补开增值税普通发票弹窗
    $('.zengZhiShuiXinXi1 .biaoTi span').click(function(){
        $('.zheZhaoCommonInvoice').hide();
        $('.zengZhiShuiXinXi1').slideUp();
        unClockedBody();
    });

    //优惠券弹窗
$('#zengZhiShui').click(function(){
    $('.zheZhao').show();
    $('.zengZhiShuiXinXi').slideDown();
    clockedBody();
});
//关闭优惠券弹窗
$('.zengZhiShuiXinXi .biaoTi span').click(function(){
    $('.zheZhao').hide();
    $('.zengZhiShuiXinXi').slideUp();
    unClockedBody();
});
//改价弹窗
$('.shangPinGaiJia').click(function () {
    $('.zhezhao').show();
    clockedBody();
})
$('.gaiJia a').click(function(){
    $('.zhezhao').hide();
    unClockedBody();
});
intercept('.shangPin',35);
intercept('.leiXing',22);



//收到货款弹出层
$(".no-select").click(function(){
    $('.no-select').attr('src','../../img/no-select.png');
    $(this).attr('src','../../img/yes-select.png').siblings().attr('src','../../img/no-select.png');
    $('.daoZhang').hide();
    $('.shuRu').hide();
});

$('.yinHang').click(function () {
    $('.daoZhang').show();
});

$('.qita').click(function(){
    $('.shuRu').show();
});

//cgl 分期改造加的
//    顶部按钮切换订单详情和分期详情
    $(".stageTopBtn span").click(function () {
        var $index=$(this).index();
        $(this).addClass('red_word').siblings().removeClass("red_word");
        if($index==0){
            $(".orderDet").show();
            $(".stageDet").hide();

        }else {
            $(".orderDet").hide();
            $(".stageDet").show();
        }
    })
    $("#payForPeriod .save_button").click(function () {
        $("#payForPeriod").hide();
    });
//底部button点击变红
    $(".stageFoot button").click(function () {
        $(this).addClass('on').siblings().removeClass('on');
    })
/*//选择要付款的期数
    $(".selStageBtn").click(function () {
        if($(this).attr('src').indexOf('fang_defaultBtn')==-1){
            $(this).attr('src','../../img/quickOrder/fang_defaultBtn.png');
        }else{
            $(".selStageBtn").attr('src','../../img/quickOrder/fang_defaultBtn.png');
            $(this).attr('src','../../img/quickOrder/fang_selBtn.png');
        }
    });
    $(".chahao").click(function () {
        $("#crossPay").hide();
    })
    //显示跨期弹窗
    $(".crossPayBtn").click(function () {
        $("#crossPay").show();
    })*/

};