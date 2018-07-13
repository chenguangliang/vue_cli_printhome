function getValue(id) {
    var sel = document.getElementById(id);
    if (sel && sel.options) {
        printAlert(sel.options[sel.selectedIndex].value);
    }
}
function getText(id) {
    var sel = document.getElementById(id);
    if (sel && sel.options) {
        printAlert(sel.options[sel.selectedIndex].text);
    }
}
function keyPress() {
    var keyCode = event.keyCode;
    if ((keyCode >= 48 && keyCode <= 57)) {
        event.returnValue = true;
    } else {
        event.returnValue = false;
    }
}
//校验必填项
//$('#submitMsg').click(function(){
//    if($('.tab_box .div2').css('display')=='block'){
//        if($('.tab_box .div2 textarea').val()==''){
//            popUp_auto(1000,'请输入发票抬头信息');
//        }
//    }
//    if($('.tab_box .div3').css('display')=='block'){
//        //if(
//        //    $('#danWei').val()=='' &&
//        //    $('#naShuiMa').val() ==''&&
//        //    $('#diZhi').val() ==''&&
//        //    $('#DianHua').val() ==''&&
//        //    $('#yinHang').val() ==''&&
//        //    $('#zhangHu').val() ==''&&
//        //    $('#name').val() =='' &&
//        //    $('#phone').val() ==''&&
//        //    $('#sel_Province').val() ==''&&
//        //    $('#sel_City').val() ==''&&
//        //    $('#sel_County').val() ==''
//        //){
//        //    popUp_auto(1000,'请完善以上所有必填项');
//        //}
//        // 下一步
//        function nextStep(){
//            // 单位名称
//            var companyName = $("#danWei").val();
//            // 纳税人识别码
//            var taxpayerCode = $("#naShuiMa").val();
//            // 注册地址
//            var registeredAddress = $("#diZhi").val();
//            // 注册电话
//            var registeredPhone = $("#DianHua").val();
//            // 开户银行
//            var bankName = $("#yinHang").val();
//            // 银行账户
//            var bankAccount = $("#zhangHu").val();
//            // 营业执照
//            var businessLicensePicUrl = $("#businessLicensePicUrl").val();
//            // 税务登记证
//            var taxRegistrationCertificatePicUrl = $("#taxRegistrationCertificatePicUrl").val();
//            // 一般纳税人证明
//            var generalTaxpayerPicUrl = $("#generalTaxpayerPicUrl").val();
//            // 收票人姓名
//            var consigneeName = $("#name").val();
//            // 收票人手机
//            var consigneeMobile = $("#phone").val();
//            // 省
//            var provinceId = $("#sel_Province").find("option:selected").val();
//            // 市
//            var cityId = $("#sel_City").find("option:selected").val();
//            // 县
//            var countyId = $("#sel_County").find("option:selected").val();
//            // 详细地址
//            var detailAddress = $("#detailAddress_").val();
//            // 校验单位名称
//            if(companyName==''){
//                $("#companyName_errorMsg").text("请填写单位名称");
//                $("#companyName_").focus();
//                return;
//            }else{
//                if(companyName.length<2){
//                    $("#companyName_errorMsg").text("请填写完整单位名称");
//                    $("#companyName_").focus();
//                    return;
//                }
//                if(companyName.length>100){
//                    $("#companyName_errorMsg").text("单位名称过长,请重新输入");
//                    $("#companyName_").focus();
//                    return;
//                }
//                $("#companyName_errorMsg").text("");
//            }
//
//            // 校验纳税人识别码
//            if(taxpayerCode==''){
//                $("#taxpayerCode_errorMsg").text("请填写纳税人识别码");
//                $("#taxpayerCode_").focus();
//                return;
//            }else{
//                var reg_number = /^([a-zA-Z0-9]){15,20}$/;
//                if (!reg_number.test(taxpayerCode)) {
//                    $("#taxpayerCode_errorMsg").text("纳税人识别码错误");
//                    $("#taxpayerCode_").focus();
//                    return;
//                }
//                $("#taxpayerCode_errorMsg").text("");
//            }
//            // 校验注册地址
//            if(registeredAddress==''){
//                $("#registeredAddress_errorMsg").text("请填写注册地址");
//                $("#registeredAddress_").focus();
//                return;
//            }else{
//                if (registeredAddress.replace(/[^\x00-\xff]/g, "**").length < 2) {
//                    $("#registeredAddress_errorMsg").text("注册地址错误");
//                    $("#registeredAddress_").focus();
//                    return;
//                }
//                if (registeredAddress.length > 250) {
//                    $("#registeredAddress_errorMsg").text("注册地址过长，请重新输入");
//                    $("#registeredAddress_").focus();
//                    return;
//                }
//                $("#registeredAddress_errorMsg").text("");
//            }
//            // 校验注册电话
//            if(registeredPhone==''){
//                $("#registeredPhone_errorMsg").text("请填写注册电话");
//                $("#registeredPhone_").focus();
//                return;
//            }/* else if (registeredPhone.length > 50){
//             $("#registeredPhone_errorMsg").text("注册电话过长，请重新输入");
//             $("#registeredPhone_").focus();
//             return;
//             }else{
//             var reg = /^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/;
//             if(!registeredPhone.match(reg)){
//             $("#registeredPhone_errorMsg").text("请输入有效的手机号码");
//             $("#registeredPhone_").focus();
//             return;
//             } */
//            else{
//                $("#registeredPhone_errorMsg").text("");
//            }
//            // 校验开户银行
//            if(bankName==''){
//                $("#bankName_errorMsg").text("请填写开户银行");
//                $("#bankName_").focus();
//                return;
//            }else{
//                if (bankName.replace(/[^\x00-\xff]/g, "**").length < 2) {
//                    $("#bankName_errorMsg").text("开户银行错误");
//                    $("#bankName_").focus();
//                    return;
//                }
//                if (bankName.length > 100) {
//                    $("#bankName_errorMsg").text("开户银行过长，请重新输入");
//                    $("#bankName_").focus();
//                    return;
//                }
//                $("#bankName_errorMsg").text("");
//            }
//            // 校验银行账户
//            if(bankAccount==''){
//                $("#bankAccount_errorMsg").text("请填写银行账户");
//                $("#bankAccount_").focus();
//                return;
//            }else{
//                var reg = /^\d*$/;
//                if(!bankAccount.match(reg)){
//                    $("#bankAccount_errorMsg").text("请输入有效的银行账户");
//                    $("#bankAccount_").focus();
//                    return;
//                }
//                $("#bankAccount_errorMsg").text("");
//            }
//            // 校验营业执照
//            /*if(businessLicensePicUrl==''){
//             $("#businessLicensePicUrl_errorMsg1").text("请上传营业执照");
//             $("#businessLicensePicUrl_1").focus();
//             return;
//             }else{
//             $("#businessLicensePicUrl_errorMsg1").text("");
//             }*/
//            // 税务登记证
//            /*if(taxRegistrationCertificatePicUrl==''){
//             $("#taxRegistrationCertificatePicUrl_errorMsg1").text("请上传税务登记证");
//             $("#taxRegistrationCertificatePicUrl_1").focus();
//             return;
//             }else{
//             $("#taxRegistrationCertificatePicUrl_errorMsg1").text("");
//             }*/
//            // 一般纳税人证明
//            /*if(generalTaxpayerPicUrl==''){
//             $("#generalTaxpayerPicUrl_errorMsg1").text("请上传一般纳税人证明");
//             $("#generalTaxpayerPicUrl_1").focus();
//             return;
//             }else{
//             $("#generalTaxpayerPicUrl_errorMsg1").text("");
//             }*/
//            //$('#step1').hide();
//            //$('#step2').show();
//
//
//            // 校验收票人姓名
//            if(consigneeName==''){
//                $("#consigneeName_errorMsg").text("请填写收票人姓名");
//                $("#consigneeName_").focus();
//                return;
//            }else{
//                $("#consigneeName_errorMsg").text("");
//            }
//
//            // 校验收票人手机
//            if(consigneeMobile==''){
//                $("#consigneeMobile_errorMsg").text("请填写收票人手机");
//                $("#consigneeMobile_").focus();
//                return;
//            }else{
//                var chrnum = /^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/;
//                if(!chrnum.test(consigneeMobile)){
//                    $("#consigneeMobile_errorMsg").text("手机号码格式不正确");
//                    $("#consigneeMobile_").focus();
//                    return;
//                }
//                $("#consigneeMobile_errorMsg").text("");
//            }
//
//            // 校验省
//            if(provinceId==''){
//                $("#invoice_province_errorMsg").text("请选择省");
//                $("#invoice_province").focus();
//                return;
//            }else{
//                $("#invoice_province_errorMsg").text("");
//            }
//
//            // 校验市
//            if(cityId==''){
//                $("#invoice_province_errorMsg").text("请选择市");
//                $("#invoice_city").focus();
//                return;
//            }else{
//                $("#invoice_province_errorMsg").text("");
//            }
//
//            // 校验县
//            if(countyId==''){
//                $("#invoice_province_errorMsg").text("请选择县");
//                $("#invoice_county").focus();
//                return;
//            }else{
//                $("#invoice_province_errorMsg").text("");
//            }
//
//            // 校验详细地址
//            if(detailAddress==''){
//                $("#detailAddress_errorMsg").text("请填写详细地址");
//                $("#detailAddress_").focus();
//                return;
//            }else{
//                $("#detailAddress_errorMsg").text("");
//            }
//        }
//    }
//});

////点击相机
//$('.tab_box .div3 .kaiPiao .xiangJi').click(function(){
//    $(this).hide().prev('img').show();
//});
//点击放大图片
$('.tab_box .div3 .kaiPiao .zhaoPian').click(function(){
    //$('.zhezhao').css("display", "block");
    console.log(1)
});
$('.tab_box .div3 .kaiPiao .zhaoPian2').click(function(){
    $('.zhezhao').css("display", "block");
    $('.zhezhao').children('.con').css({width:'5rem',height:'4.46rem',marginTop: '-2.23rem',marginLeft: '-2.5rem'})
    $('.zhezhao').children().children('img').css({width:'5rem',height:'3.48rem'})
});

//关闭弹窗
$('.zhezhao').click(function () {
    $('.zhezhao').css("display", "none");
});
