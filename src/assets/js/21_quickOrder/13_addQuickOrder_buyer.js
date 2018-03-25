function mountJQueryEvent() {
    $(".stepTwoBack").click(function () {
        $(".stepOne").show();
        $(".stepTwo").hide();
    });
    $(".stepThreeBack").click(function () {
        $(".stepThree").hide();
        $(".stepTwo").show();
    });
    //点击列表选取按钮，出来列表弹窗
    $(".listSelArrow,.sure,.cancel").click(function () {
        $(".listSelWin").hide();
        $(".selBtn").attr("src", "../../img/no-select.png")
    })
    $(".listSelBtn").click(function () {
        $(".listSelWin").show()
    });

    //买、卖家列表的返回箭头
    $(".selectPartnerBack").click(function () {
        $(".selectPartner").hide();
    });
    //
    $(".fixFootThree .cancle,.fixFootThree .sure").click(function () {
        $(".selectPartner").hide();
    });

//第二步-----------------------------------------------
//第二部的查看图片详情弹窗
    $(".goodsDet,.gotoDetTit").click(function () {
        $(".goodsDetileWrap").show()
    });
    $(".goodsDetileArrow").click(function () {
        $(".goodsDetileWrap").hide()
    });

//第二部的选择其他出来隐藏input
    $("#pinlei").change(function () {
        if (this.value == "other") {
            $("#pinlei1,#pinlei2").hide();
            $(".otherClass").show();
        } else {
            $("#pinlei1,#pinlei2").show();
            $(".otherClass").hide();
        }
    });
    $("#pinpai").change(function () {
        if (this.value == "other") {
            $(".otherBrand").show();
        } else {
            $(".otherBrand").hide();

        }
    });
    $("#danwei").change(function () {
        if (this.value == "other") {
            $(".otherUnit").show();
        } else {
            $(".otherUnit").hide();
        }
    });
    $("#guige").change(function () {
        if (this.value == "other") {
            $(".otherSpeci").show();
        } else {
            $(".otherSpeci").hide();
        }
    });

//第二步选择审核 加入物资 按钮
//需要审核-图标选中
    $('.redRoundBtn').click(function () {
        $(this).attr("src", "../../img/yes-select.png");
        $(this).siblings('img').attr("src", "../../img/no-select.png")
    });
//新增商品-需要审核
    $(".needCheck").click(function () {
        $(".otherchecker").show();
    });
    $(".noNeedCheck").click(function () {
        $(".otherchecker").hide();
    });

//隐藏新增商品页面
    $(".addGoodsBtn").click(function () {
        $(".addGoodsWin").show();
    });
    /*$(".addGoodsCancle,.addGoodsArrow").click(function () {
        printConfirm('放弃新增商品？', function () {
            $(".addGoodsWin").hide();
        })
    });*/


//第三步----------------------------------------------------------
    //新增订单-需要审核
    $(".orderNeedCheck").click(function () {
        $(".orderOtherChecker").show();
    });
    $(".orderNoNeedCheck").click(function () {
        $(".orderOtherChecker").hide();
    });
    //支付方式
    /*$("#payStyle").change(function () {
        if (this.value == 1) {
            $('#payInfo').val(0).addClass('unable');
            $('.editPayInfo').hide();
        }
        if (this.value == 2) {
            $('#payInfo').removeClass('unable');
        }
    });*/
  //支付信息 ——延期支付
    $("#payInfo").change(function () {
        if (this.value == 1) {
            $(".delayPayWrap").show();
        } else {
            $(".editPayInfo").hide();
        }
    });
    //选择发票
    $("#invoiceSel").change(function () {
        if (this.value == 1) {
            $(".commonInvoice").show()
            $(".editInvoice").css('display', 'inline-block');
        }
        else if (this.value == 2) {
            $('.addInvoiceWrap').show();
            $('.editInvoice').css('display', 'inline-block');
        }
        else {
            $(".editInvoice").hide();
        }
    });
    // 普通发票弹窗隐藏-点击叉号
    $(".commonInvoiceClose").click(function () {
        $(".commonInvoice").hide()
    });
    // 普通发票弹窗隐藏-点击取消-且变为不开发票
    $(".commonInvoice .cancel").click(function () {
         $(".commonInvoice").hide();
        // $("#invoiceSel").val(0);
        // $(".editInvoice").hide();
    });

    //专用发票弹窗-点击上一步
    $('.specialInvoiceBack').click(function () {
        $('.specialInvoiceOne').show();
        $('.specialInvoiceTwo').hide();
    });
    // 专用发票弹窗隐藏-点击取消和回退箭头-且变为不开发票
    $(".specialInvoiceCancle,.addInvoiceArrow").click(function () {
        // $("#invoiceSel").val(0);
        // $(".editInvoice").hide();
        $('.addInvoiceWrap').hide();
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
    $(".close").click(function () {
        $('.zhezhao').hide();
    });

    /*延期支付弹窗*/
/*
//延期支付有分期
    $(".separateBtn").click(function () {
        $(".delayPayCondition").hide();//上边的3.支付前提  隐藏
        $(".selDelayPay,.fixFootTotal").show();//每一期显示出来，合计比例显示出来
        $('.separateInput').show()
    });
    $(".noSeparateBtn").click(function () {
        if ($(".advancePayBtn").attr('src').indexOf('yes') == -1) {
            $(".delayPayCondition").show();//上边的3.支付前提  显示
            $(".selDelayPay,.fixFootTotal").hide();//每一期显示隐藏，合计比例隐藏
        }
        $('.separateInput').hide()
    });
//点积有预付款
    $(".advancePayBtn").click(function () {
        $(".delayPayCondition").hide();//上边的3.支付前提  隐藏
        $(".selDelayPay,.fixFootTotal").show();//每一期显示出来，合计比例显示出来
        $(".advancePay").show();//预付款三个字出现
        $(".firstPay").hide();
        $(".advancePercent").show();
        $(".payPercent").hide();
    });
    $(".noAdvancePayBtn").click(function () {
        if ($(".separateBtn").attr('src').indexOf('yes') == -1) {
            $(".delayPayCondition").show();//上边的3.支付前提  显示
            $(".selDelayPay,.fixFootTotal").hide();//每一期显示隐藏，合计比例隐藏
        }
        $(".advancePay").hide();
        $(".firstPay").show();
        $(".advancePercent").hide();
        $(".payPercent").show();
    });
//点积按金额计算
    $(".percentBtn").click(function () {
        $(".moneyFlag").hide();
        $(".percentFlag").show();
        $(this).addClass('redBtn');
        $(".moneyBtn").removeClass('redBtn').addClass('grayBtn');
        $(".totalPercent").show();
        $(".totalMoney").hide();
    });
    $(".moneyBtn").click(function () {
        $(".moneyFlag").show();
        $(".percentFlag").hide();
        $(this).addClass('redBtn');
        $(".percentBtn").removeClass('redBtn').addClass('grayBtn')
        $(".totalPercent").hide();
        $(".totalMoney").show();
    });
*/

//固定按比例计算的按钮
    var scrollFlag = 1;
    var winW = document.documentElement.clientWidth;
    var per = winW / 640 * 200;
    $(".delayPayWrap").scroll(function () {
        if ($(this)[0].scrollTop > per * 0.6) {
            if (scrollFlag) {
                $(".calculationStyle").addClass('fixIt');
                $(".zhanwei").show();
            }
            scrollFlag = 0;
        }
        if ($(this)[0].scrollTop < per * 0.6) {
            $(".calculationStyle").removeClass('fixIt');
            $(".zhanwei").hide();
            scrollFlag = 1;
        }
    });

//延期支付详情的弹窗显示

    $(".delayPayArrow,.delayPayCancle").click(function () {
        $("#payInfo").val(0);
        $(".delayPayWrap").hide();
        $(".editPayInfo").hide();
    });

//点击修改支付详情图片
    $(".editPayInfo").click(function () {
        $(".delayPayWrap").show()
    });

//点击修改发票图片
    $(".editInvoice").click(function () {
        if ($("#invoiceSel")[0].value == 1) {
            $(".commonInvoice").show();
        } else if ($("#invoiceSel")[0].value == 2) {
            $(".specialInvoiceTwo").hide();
            $(".specialInvoiceOne").show();
            $(".addInvoiceWrap").show();
        }
    });

//点击提交和取消新增订单
    $(".submitAdd").click(function () {
        // window.location = './1_buyerQuickOrderList.html'
    });

    /*点击三步的底部取消按钮*/
    $(".cancleQuickOrder").click(function () {
        printConfirm('确定要取消新增订单么？', function () {
            // window.location.href = history.back(-1);
            window.history.back();
            return false;
        })
    });
    //顶部的返回箭头
    $(".addBackArrow").click(function () {
        if($(".stepOne").css('display')=='block'){
            // window.history.back(-1);
            window.history.back();
            return false;
        }else if($(".stepTwo").css('display')=='block'){
            $(".stepTwo").hide();
            $(".stepOne").show();
        }else {
            $(".stepThree").hide();
            $(".stepTwo").show();
        }
    });
}







