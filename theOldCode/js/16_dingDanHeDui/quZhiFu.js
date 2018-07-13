$(function () {
    //折叠订单详情
    $(".orderDetileBtn").click(function () {
        if($(".dingDanHao").css("display")=='none'){
            $(".dingDanHao").slideDown();
            $(".orderDetImg").attr('src','../../img/xiangshang@3x.png')
        }else {
            $(".dingDanHao").slideUp();
            $(".orderDetImg").attr('src','../../img/xiangxia@3x.png');

        }
    })
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
    //查看资质
    $(".lookLicense").click(function () {
        $(".licenceWin").show();
        clockedBody();
    });
    $(".close").click(function () {
        $(".licenceWin").hide();
        unClockedBody();
    });
    // 切换支付类型
    $('#paymentType span').click(function () {
        $(this).addClass('currentBtn').siblings().removeClass("currentBtn");
        var index=$(this).index();
        $("#paymentTypeContent>div").eq(index).show().siblings("div").hide();
    });
    // 邮箱弹窗
    $(".popup_close").click(function () {
        $(".popUp").hide();
        unClockedBody();
    });
    // 修改邮箱
    $(".modify").click(function () {
        $(".modifyMailbox").show();
        clockedBody();
    })
    // 确认邮箱正确
    //$(".makeSure").click(function () {
    //    $(".disclaimer").show();
    //    clockedBody();
    //})
    // 查看付款示例
    $(".openPaymentExample").click(function () {
      $(".paymentExample").show();
      clockedBody();
    });
    // 操作引导
    $("#transferPay").click(function () {
    	$.jsonAjax(getUrl("shopCart/transferGuide"),{guideMark:"first"},
	        function(data,status,xhr){
	            if(data.success){
	            	if(data.guide){
	            		 $(".lead").show();
	            	     clockedBody();
					}
	            }else{
	                popUp_auto_false(1000,data.errorMessages);
	            }
	     });
    });
});
function show_hide(obj,para,guideMark) {
	if(para == ''){
    	$.jsonAjax(getUrl("shopCart/setTransferGuide"),{guideMark:guideMark},
	        function(data,status,xhr){
	            if(data.success){
	                $(obj).hide();
	                $(para).show();
	            }else{
	                popUp_auto_false(1000,data.errorMessages);
	            }
    	});
	}
    $(obj).hide();
    $(para).show();
}