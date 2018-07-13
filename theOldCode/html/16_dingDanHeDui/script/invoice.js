/**
 * Created by Administrator on 2017/3/28 0028.
 */
/**
*@fileName:invoice.js
*@author:fdc
*@time:2017/3/28 0028
*@disc:发票信息
*/

function startUpload(fileElementId){
    var temp = invoice.$data;
    popUp_open();
    $.uploadFile({
        url:getUrl('/fileUpload/fixedUpload?date='+new Date()), //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: fileElementId, //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        data:{
            size:10485760,
        },
        type:"post",
        success: function (data, status){  //服务器成功响应处理函数
            popUp_close();
            if(data.success){
                Vue.set(temp.invoiceDTO,fileElementId+'',data.result.url);
                console.log(data);
            }else{
                popUp_auto_false(1500,data.errorMessages);
            }
        },
        error: function (data, status, e){//服务器响应失败处理函数
            console.log(data)
        }
    });
}


var invoice = new Vue({
    el:"#invoice",
    mixins:[address,common],
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //订单信息
        submitInfo:{changeFlag:false},
        //发票信息
        invoiceDTO:{
            invoice:1,
            provinceId:"",
            cityId:"",
            countyId:"",
        },
        //原来地址id用于校验是否发生invoiceId改变
        preInvoiceId:"",
        showPicUrl:""
    },
    methods:{
        //点击放大图片
        showIMG:function(param1,param2){
            this.showPicUrl = param2;
            if('businessLicensePicUrl'==param1){
                $('.zhezhao').css("display", "block");
                $('.zhezhao').children('.con').css({width:'5rem',height:'8.08rem',marginTop: '-4.04rem',marginLeft: '-2.5rem'});
                $('.zhezhao').children().children('img').css({width:'5rem',height:'7.08rem'});
            }
            else{
                $('.zhezhao').css("display", "block");
                $('.zhezhao').children('.con').css({width:'5rem',height:'4.46rem',marginTop: '-2.23rem',marginLeft: '-2.5rem'})
                $('.zhezhao').children().children('img').css({width:'5rem',height:'3.48rem'});
            }
        },
        //点击关闭图片
        closeIMG:function(){
            $('.zhezhao').css("display", "none");
        },
        //获取发票信息
        getInvoice:function(){
            popUp_open();
            var temp = this;
            if(isNotBlank(this.submitInfo.invoiceId)){
                $.jsonAjax(getUrl("shopCart/getInvoiceById"),{id:this.submitInfo.invoiceId},function(data, status, xhr){
                    console.log(data);
                    if(data.success){
                        temp.invoiceDTO = data.result;
                    }
                },false);
            }
        },
        //保存发票信息
        saveInvoice:function(){
            //格式校验
            if($('.tab_box .div2').css('display')=='block'){
                // 纳税人识别码
                var taxpayerCode = $("#taxpayerCode_normal").val();
                if($('#invoice_title').val()==''){
                    popUp_auto(2000,'请输入发票抬头信息');
                    return false;
                }
                // 校验纳税人识别码
                if(taxpayerCode==''){
                    $("#taxpayerCode_errorMsg_normal").text("请填写纳税人识别码");
                    $("#taxpayerCode_normal").focus();
                    return;
                }else{
                    var reg_number = /^([a-zA-Z0-9]){15,20}$/;
                    if (!reg_number.test(taxpayerCode)) {
                        $("#taxpayerCode_errorMsg_normal").text("纳税人识别码错误");
                        $("#taxpayerCode_normal").focus();
                        return;
                    }
                    $("#taxpayerCode_errorMsg_normal").text("");
                }
            }else if($('.tab_box .div3').css('display')=='block'){
                //if(
                //    $('#danWei').val()=='' &&
                //    $('#naShuiMa').val() ==''&&
                //    $('#diZhi').val() ==''&&
                //    $('#DianHua').val() ==''&&
                //    $('#yinHang').val() ==''&&
                //    $('#zhangHu').val() ==''&&
                //    $('#name').val() =='' &&
                //    $('#phone').val() ==''&&
                //    $('#sel_Province').val() ==''&&
                //    $('#sel_City').val() ==''&&
                //    $('#sel_County').val() ==''
                //){
                //    popUp_auto(2000,'请完善以上所有必填项');
                //    return false;
                //}
                // 下一步
                    // 单位名称
                    var companyName = $("#danWei").val();
                    // 纳税人识别码
                    var taxpayerCode = $("#naShuiMa").val();
                    // 注册地址
                    var registeredAddress = $("#diZhi").val();
                    // 注册电话
                    var registeredPhone = $("#DianHua").val();
                    // 开户银行
                    var bankName = $("#yinHang").val();
                    // 银行账户
                    var bankAccount = $("#zhangHu").val();
                    // 营业执照
                    var businessLicensePicUrl = $("#businessLicensePicUrl").val();
                    // 税务登记证
                    var taxRegistrationCertificatePicUrl = $("#taxRegistrationCertificatePicUrl").val();
                    // 一般纳税人证明
                    var generalTaxpayerPicUrl = $("#generalTaxpayerPicUrl").val();
                    // 收票人姓名
                    var consigneeName = $("#name").val();
                    // 收票人手机
                    var consigneeMobile = $("#phone").val();
                    // 省
                    var provinceId = $("#sel_Province").find("option:selected").val();
                    // 市
                    var cityId = $("#sel_City").find("option:selected").val();
                    // 县
                    var countyId = $("#sel_County").find("option:selected").val();
                    // 详细地址
                    var detailAddress = $("#detailAddress_").val();
                    // 校验单位名称
                    if(companyName==''){
                        $("#companyName_errorMsg").text("请填写单位名称");
                        $("#companyName_").focus();
                        return;
                    }else{
                        if(companyName.length<2){
                            $("#companyName_errorMsg").text("请填写完整单位名称");
                            $("#companyName_").focus();
                            return;
                        }
                        if(companyName.length>100){
                            $("#companyName_errorMsg").text("单位名称过长,请重新输入");
                            $("#companyName_").focus();
                            return;
                        }
                        $("#companyName_errorMsg").text("");
                    }

                    // 校验纳税人识别码
                    if(taxpayerCode==''){
                        $("#taxpayerCode_errorMsg").text("请填写纳税人识别码");
                        $("#taxpayerCode_").focus();
                        return;
                    }else{
                        var reg_number = /^([a-zA-Z0-9]){15,20}$/;
                        if (!reg_number.test(taxpayerCode)) {
                            $("#taxpayerCode_errorMsg").text("纳税人识别码错误");
                            $("#taxpayerCode_").focus();
                            return;
                        }
                        $("#taxpayerCode_errorMsg").text("");
                    }
                    // 校验注册地址
                    if(registeredAddress==''){
                        $("#registeredAddress_errorMsg").text("请填写注册地址");
                        $("#registeredAddress_").focus();
                        return;
                    }else{
                        if (registeredAddress.replace(/[^\x00-\xff]/g, "**").length < 2) {
                            $("#registeredAddress_errorMsg").text("注册地址错误");
                            $("#registeredAddress_").focus();
                            return;
                        }
                        if (registeredAddress.length > 250) {
                            $("#registeredAddress_errorMsg").text("注册地址过长，请重新输入");
                            $("#registeredAddress_").focus();
                            return;
                        }
                        $("#registeredAddress_errorMsg").text("");
                    }
                    // 校验注册电话
                    if(registeredPhone==''){
                        $("#registeredPhone_errorMsg").text("请填写注册电话");
                        $("#registeredPhone_").focus();
                        return;
                    }/* else if (registeredPhone.length > 50){
                     $("#registeredPhone_errorMsg").text("注册电话过长，请重新输入");
                     $("#registeredPhone_").focus();
                     return;
                     }else{
                     var reg = /^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/;
                     if(!registeredPhone.match(reg)){
                     $("#registeredPhone_errorMsg").text("请输入有效的手机号码");
                     $("#registeredPhone_").focus();
                     return;
                     } */
                    else{
                        $("#registeredPhone_errorMsg").text("");
                    }
                    // 校验开户银行
                    if(bankName==''){
                        $("#bankName_errorMsg").text("请填写开户银行");
                        $("#bankName_").focus();
                        return;
                    }else{
                        if (bankName.replace(/[^\x00-\xff]/g, "**").length < 2) {
                            $("#bankName_errorMsg").text("开户银行错误");
                            $("#bankName_").focus();
                            return;
                        }
                        if (bankName.length > 100) {
                            $("#bankName_errorMsg").text("开户银行过长，请重新输入");
                            $("#bankName_").focus();
                            return;
                        }
                        $("#bankName_errorMsg").text("");
                    }
                    // 校验银行账户
                    if(bankAccount==''){
                        $("#bankAccount_errorMsg").text("请填写银行账户");
                        $("#bankAccount_").focus();
                        return;
                    }else{
                        var reg = /^\d*$/;
                        if(!bankAccount.match(reg)){
                            $("#bankAccount_errorMsg").text("请输入有效的银行账户");
                            $("#bankAccount_").focus();
                            return;
                        }
                        $("#bankAccount_errorMsg").text("");
                    }
                    // 校验营业执照
                    /*if(businessLicensePicUrl==''){
                     $("#businessLicensePicUrl_errorMsg1").text("请上传营业执照");
                     $("#businessLicensePicUrl_1").focus();
                     return;
                     }else{
                     $("#businessLicensePicUrl_errorMsg1").text("");
                     }*/
                    // 税务登记证
                    /*if(taxRegistrationCertificatePicUrl==''){
                     $("#taxRegistrationCertificatePicUrl_errorMsg1").text("请上传税务登记证");
                     $("#taxRegistrationCertificatePicUrl_1").focus();
                     return;
                     }else{
                     $("#taxRegistrationCertificatePicUrl_errorMsg1").text("");
                     }*/
                    // 一般纳税人证明
                    /*if(generalTaxpayerPicUrl==''){
                     $("#generalTaxpayerPicUrl_errorMsg1").text("请上传一般纳税人证明");
                     $("#generalTaxpayerPicUrl_1").focus();
                     return;
                     }else{
                     $("#generalTaxpayerPicUrl_errorMsg1").text("");
                     }*/
                    //$('#step1').hide();
                    //$('#step2').show();


                    // 校验收票人姓名
                    if(consigneeName==''){
                        $("#consigneeName_errorMsg").text("请填写收票人姓名");
                        $("#consigneeName_").focus();
                        return;
                    }else{
                        $("#consigneeName_errorMsg").text("");
                    }

                    // 校验收票人手机
                    if(consigneeMobile==''){
                        $("#consigneeMobile_errorMsg").text("请填写收票人手机");
                        $("#consigneeMobile_").focus();
                        return;
                    }else{
                        var chrnum = /^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/;
                        if(!chrnum.test(consigneeMobile)){
                            $("#consigneeMobile_errorMsg").text("手机号码格式不正确");
                            $("#consigneeMobile_").focus();
                            return;
                        }
                        $("#consigneeMobile_errorMsg").text("");
                    }

                    // 校验省
                    if(provinceId==''){
                        $("#invoice_province_errorMsg").text("请选择省");
                        $("#invoice_province").focus();
                        return;
                    }else{
                        $("#invoice_province_errorMsg").text("");
                    }

                    // 校验市
                    if(cityId==''){
                        $("#invoice_province_errorMsg").text("请选择市");
                        $("#invoice_city").focus();
                        return;
                    }else{
                        $("#invoice_province_errorMsg").text("");
                    }

                    // 校验县
                    if(countyId==''){
                        $("#invoice_province_errorMsg").text("请选择县");
                        $("#invoice_county").focus();
                        return;
                    }else{
                        $("#invoice_province_errorMsg").text("");
                    }

                    // 校验详细地址
                    if(detailAddress==''){
                        $("#detailAddress_errorMsg").text("请填写详细地址");
                        $("#detailAddress_").focus();
                        return;
                    }else{
                        $("#detailAddress_errorMsg").text("");
                    }
                }
            var temp = this;
            if(this.invoiceDTO.invoice == 1){
                temp.submitInfo.invoiceId = "";
                //不需要发票标志
                temp.submitInfo.noInvoiceFlag = true;
                this.orderChecked(this.invoiceDTO);
            }else if(this.invoiceDTO.invoice == 2){
                deleteJSONFiled(temp.submitInfo,"noInvoiceFlag");
                $.jsonAjaxPost(getUrl('invoice/save'),{invoice:this.invoiceDTO.invoice,invoiceTitle:this.invoiceDTO.invoiceTitle,taxpayerCode:this.invoiceDTO.taxpayerCode},function(data, status, xhr){
                    if(data.isSuccess){
                        temp.submitInfo.invoiceId = data.invoiceId;
                        temp.orderChecked();
                    }
                });
            }else{
                deleteJSONFiled(temp.submitInfo,"noInvoiceFlag");
                deleteJSONFiled(this.invoiceDTO,'invoiceTitle');
                deleteJSONFiled(this.invoiceDTO,'createTime');
                deleteJSONFiled(this.invoiceDTO,'id');
                deleteJSONFiled(this.invoiceDTO,'invoicePicDTOs');
                if( this.invoiceDTO.businessLicensePicUrl instanceof Array && this.invoiceDTO.businessLicensePicUrl.length > 0){
                    this.invoiceDTO.businessLicensePicUrl = this.invoiceDTO.businessLicensePicUrl[0];
                }
                if( this.invoiceDTO.taxRegistrationCertificatePicUrl instanceof Array && this.invoiceDTO.taxRegistrationCertificatePicUrl.length > 0){
                    this.invoiceDTO.taxRegistrationCertificatePicUrl = this.invoiceDTO.taxRegistrationCertificatePicUrl[0];
                }
                if( this.invoiceDTO.generalTaxpayerPicUrl instanceof Array && this.invoiceDTO.generalTaxpayerPicUrl.length > 0){
                    this.invoiceDTO.generalTaxpayerPicUrl = this.invoiceDTO.generalTaxpayerPicUrl[0];
                }
                $.jsonAjaxPost(getUrl('invoice/save'),this.invoiceDTO,function(data, status, xhr){
                    if(data.isSuccess){
                        temp.submitInfo.invoiceId = data.invoiceId;
                        temp.orderChecked();
                    }
                });
            }
        },
        //此页面由订单核对页跳转而来将此返回回去
        orderChecked:function(){
            //值未改变--也得changeFlag为true，否则加载动画不消失
            if(this.submitInfo.invoiceId == this.preInvoiceId){
                this.submitInfo.changeFlag = false;
                window.location = "../../html/16_dingDanHeDui/dingDanHeDui.html?"+ $.assemblyRequestString(this.submitInfo);
            }else{
                this.submitInfo.changeFlag = true;
                window.location = "../../html/16_dingDanHeDui/dingDanHeDui.html?"+ $.assemblyRequestString(this.submitInfo);

            }

        },

    },
    computed:{

    },
    beforeMount:function(){
        //获取一级区域地址
        this.getOneAddress();
        //从浏览器获取提交订单信息
        this.submitInfo = $.getUrlJson();
        //给原来invoiceId赋值
        this.preInvoiceId  = this.submitInfo.invoiceId;
        //获取发票信息
        this.getInvoice();
    },
    mounted:function(){
        popUp_close();
    },
    breforeUpdate:function(){

    },
    updated:function(){

    },
    watch:{
        'invoiceDTO.provinceId':function(newvalue , oldvalue){
            if(newvalue != ''){
                this.twoAddressList = this.getAddresses(newvalue);
                this.threeAddressList = [];
            }
        },
        'invoiceDTO.cityId':function(newvalue , oldvalue){
            this.threeAddressList = this.getAddresses(newvalue);
        }
    }
});