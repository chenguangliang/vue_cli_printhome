/**
 * Created by admin on 2017/6/28.
 */
function mountJQueryEvent() {
// 切换三个tab
    $(".fixHead p").click(function () {
        $(this).addClass('redWord').siblings().removeClass('redWord');
        $(".mainCon").hide().eq($(this).index()).show();
    });

//延期支付详情的弹窗显示
    $(".delayPayBtn").click(function () {
        $(".delayPayWrap").show()
    });
    $(".delayPayArrow").click(function () {
        $(".delayPayWrap").hide()

    });

//点击营业执照显示弹窗
    $(".licenseImg").click(function () {
        $(".licenceWin").show();
    });
    $(".proveBtn").click(function () {
        $(".proveWin").show();
    });
    $(".registerBtn").click(function () {
        $(".registerWin").show();
    });
    $(".zhezhao").click(function () {
        $(this).hide();
    });


//增值税发票详情
    $(".invoiceBtn").click(function () {
        $(".addInvoiceWrap").show()
    });
    $(".addInvoiceArrow").click(function () {
        $(".addInvoiceWrap").hide()
    });

//普通发票详情
    $(".invoiceBtn").click(function () {
        $(".commonInvoice").show()
    });
    $(".commonInvoiceClose,.sure,.cancel").click(function () {
        $(".commonInvoice").hide()
    });

//商品详情弹窗
    $(".goodsDetBtn ").click(function () {
        $(this).parents().next('.goodsDetileWrap').show();
    });
    $(".goodsDetileArrow").click(function () {
        $(".goodsDetileWrap").hide()
    });
}


