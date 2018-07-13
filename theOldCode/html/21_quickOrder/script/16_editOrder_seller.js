/**
 *  修改订单（买家)
 */
/**********************************************************************************************************************/
var goodsId = [];
var quickOrderVue = new Vue({
    el: "#app",
    mixins: [address, common],
    data: {
        Specifications:[],//自定义规格
        tempIndex:'',//用来存储最后删的是
        //用于新增商品
        categoryLevOne: [],
        categoryLevTwo: [],
        categoryLevThree: [],
        brandList: [],
        auditors: {},
        material: {
            "itemName": "", "cid": '', "cname": "", "isCustomCategory": 0, "brandId": '',
            "brandName": "", "isCustomBrand": 0, "unitPrice": '', "itemUnitName": "",
            "isCustomUnit": 0, "standard": "", "isCustomStandard": 0, "remark": "", "isAudit": 0,
            "auditer": 0, "isMaterials": 0
        },
        initScrollFlag: 0,//让scroll只初始化一次的标志
        beginTranY: 0,
        userInfo: {},//用户信息
        paper: {},
        queryGoodsParamData: {page: 1, itemArray: []},//查询可选商品
        partnerList: [],//卖家列表
        userInput: '',//用户输入的
        selectedSeller: {},//选中的卖家信息
        goodsList: {},//可选商品
        goodsInfo: {},//物资详情
        redTipPercent: 100,//延期支付弹窗，底部红色比例提示
        redTipMoney: 0,//延期支付弹窗，底部红色金额提示
        computeFlag: 0,//0 按比例  1按金额
        prePayFlag: 0,//0 无预付款  1有预付款
        periodFlag: 0,//0 无分期  1有分期
        periodDetail: [{
            periodCounts: 1,
            orderScale: 50.0,
            orderAmount: '',
            periodPremise: 6,
            periodPremiseDays: 0
        }, {periodCounts: 2, orderScale: 50.0, orderAmount: '', periodPremise: 6, periodPremiseDays: 0}],
        selectedGoodsList: [],//已选的商品列表,后边要转为json赋值给submitInfo.itemDetailsBuffer
        submitCommonInvoice:{invoice:2,invoiceTitle:'',taxpayerCode:''},//用来储蓄提交时的参数，用来点击取消回显
        commonInvoicePara:{invoice:2,invoiceTitle:'',taxpayerCode:''},
        submitInvoiceInfo:{},//用来储蓄提交时的参数，用来点击取消回显
        invoiceInfo: {
            invoice: 3,
            invoiceTitle: '',
            taxpayerCode: '',
            registeredAddress: '',
            registeredPhone: '',
            bankName: '',
            bankAccount: '',
            businessLicensePicUrl: '',
            taxRegistrationCertificatePicUrl: '',
            generalTaxpayerPicUrl: '',
            normalContent: '明细',
            consigneeName: '',
            consigneeMobile: '',
            provinceId: 0,
            cityId: 0,
            countyId: 0,
            detailAddress: '',
            buyerId: ''
        },//上传发票信息带回来一个Id即可,
        defaultPeriod: {'period': 2, 'isPrepay': 0, 'preOAmount': 0, 'calcuMethod': 0, 'totalOAmount': 0},
        submitInfo: { //key 加单引号的为已处理  双引号为置空不用管
            'id': '',
            'modelType': 2,
            'buyerPhone': '',
            'buyerName': '',
            'buyerUserId': '',
            'invoiceId': '',
            'invoiceType': 0,
            'isAudit': 0,
            'isPeriod': '',
            'period': 2,
            'isPrepay': '',
            'itemDetailsBuffer': '',
            "orderId": 0,
            "parentOrderId": 0,
            'payDelay': 0,
            'payMethod': 2,
            'payedAmount': 0,
            'periodDetailsBuffer': '',
            'premise': 6,
            'premiseDays': 0,
            'prepayScale': '50',
            'auditerUserId': 0,
            'sellerName': '',
            'sellerPhone': '',
            'sellerUserId': '',
            'sellerEmail': '',
            'totalAmount': 0,
            'totalPrepayAmount': 0,
            'unPayedAmount': 0
            ,periodMethod:0
        },//------------下面是订单修改增加的参数------------------------------
        imgUrl: img_url_cgl,
        urlObj: {orderId: ''},
        checkerNames: {},
        checkerName: '',
        buyerJm: {},
        sellerJm: {},
        itemDetails: {},
        periodDetails: {},
        invoiceDTO: {},
        order: {},
        please:'请输入',
        personalityDTO:{},//个性化表单数据
    },
    methods: {
        /*selectInvoice: function () { //支付前提选择“收到发票后”时，发票选项“不开发票”为不可选
            if(this.submitInfo.premise==4){
                $("#invoiceSel option").eq(0).attr('disabled','disabled');
                this.submitInfo.invoiceType=1;
            }else {
                $("#invoiceSel option").eq(0).removeAttr('disabled');
            }
        },*/
        limitUnitPrice: function () {//限制单价的输入  material.unitPrice
            //限定数量不能输入负数，限制2位小数
            this.material.unitPrice=this.material.unitPrice.replace(/[^(^\d+\.{0,1}\d*$)]/g,'');
            var reg3 = /\./g;
            var reg3Array = reg3.exec(this.material.unitPrice);
            if (reg3Array != null) {
                var reg3Right = this.material.unitPrice.substring(reg3Array.index + reg3Array[0].length);
                reg3Right = reg3Right.replace(reg3, '');
                reg3Right = reg3Right.substring(0, 2);
                this.material.unitPrice = this.material.unitPrice.substring(0, reg3Array.index) + '.' + reg3Right;
            }
        },
        //获取个性化表单
        getPersonalityList: function () {
            var temp = this;
            $.jsonAjax(getUrl("quickor/item/personalityList"), {}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.personalityDTO=data.result.personalityDTO;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        liuZhe: function () {
            $("#delSelGoods").hide();
        },
        limitDay: function ($event){//限制支付前提的天数
            $event.target.value=$event.target.value.replace(/\D/g,'');
            if($event.target.value>365){
                this.submitInfo.premiseDays=365;
                popUp_auto_false(2500,"天数只能输入0-365，且为整数!")
                return;
            }
        },
        getSpecification: function () {//获取自定义规格列表
            var temp=this;
            $.jsonAjax(getUrl("quickor/item/customStandards"), {}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.Specifications=data.data.result;
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);

        },
        //为了解决支付信息不会跟着支付方式联动
        /*changePayMethod: function ($event) {
            var temp = this;
            if ($event.target.value == 1) {
                temp.submitInfo.payDelay = 0;
                $('#payInfo').addClass('unable');
                $('.editPayInfo').hide();
            }
            if ($event.target.value == 2) {
                $('#payInfo').removeClass('unable');
            }
        },*/
        //初始化订单信息
        initOrderDetile: function () {
            var temp = this;
            var paramData = {'orderId': this.urlObj.orderId, 'modleType': 2};
            $.jsonAjax(getUrl("/quickor/master/orderDetile"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.itemDetails = data.result.itemDetails;
                    temp.buyerJm = data.result.buyerJm;
                    temp.sellerJm = data.result.sellerJm;
                    temp.periodDetails = data.result.periodDetails;
                    temp.invoiceDTO = data.result.invoiceDTO;
                    temp.order = data.result.order;
                    //第一步赋值   //此时要选择的是buyer
                    temp.userInput = temp.buyerJm.companyName;
                    /*temp.selectedSeller.uname = temp.buyerJm.uname;
                    temp.selectedSeller.userEmail = temp.buyerJm.userEmail;
                    temp.selectedSeller.umobile = temp.buyerJm.umobile;
                    temp.selectedSeller.uid = temp.buyerJm.uid;*/
                    temp.selectedSeller=temp.buyerJm;//把buyerJm全赋值给selectedSeller，因为liToUserInput函数就是把点击用户的所有信息赋给了selectedSeller
                    //第二步赋值
                    for (var j = 0; j < data.result.itemDetails.length; j++) {//把请求来的商品信息，按照页面需求的格式组装一下
                        var selectedGoods = {
                            itemId: '',
                            itemName: '',
                            unitPrice: '',
                            itemQuantity: 0,
                            itemTotalPrice: 0,
                            itemFreight: 0
                        };
                        temp.selectedGoodsList.push(selectedGoods);
                        temp.selectedGoodsList[j].itemId = data.result.itemDetails[j].itemId;
                        temp.selectedGoodsList[j].itemName = data.result.itemDetails[j].itemInfo.itemName;
                        temp.selectedGoodsList[j].unitPrice = data.result.itemDetails[j].itemInfo.unitPrice;
                        temp.selectedGoodsList[j].itemQuantity = data.result.itemDetails[j].itemQuantity;
                        temp.selectedGoodsList[j].itemTotalPrice = data.result.itemDetails[j].itemTotalPrice;
                        temp.selectedGoodsList[j].itemFreight = data.result.itemDetails[j].itemFreight;
                        goodsId.push(parseInt(temp.selectedGoodsList[j].itemId));//过滤掉已选择的列表选取的商品
                        //待做，这个地方还得把新增加的物资的itemId的
                    }
                    temp.submitInfo.totalAmount = data.result.order.totalAmount;//总价赋值
                    //第三步赋值
                    temp.submitInfo.payMethod = data.result.order.payMethod;
                    temp.submitInfo.payDelay = data.result.order.payDelay;
                    temp.submitInfo.invoiceType = data.result.order.invoiceType;
                    if (data.result.order.payDelay == 1) {//延期支付
                        $(".editPayInfo").css('display', 'inline-block');
                    }
                    //如果是个人支付，给立即支付 添加 unable
                    /*if (data.result.order.payMethod == 1) {
                        $("#payInfo").addClass('unable');
                    }*/
                    if (data.result.order.invoiceType == 1 || data.result.order.invoiceType == 1) {//需要发票
                        $(".editInvoice").css('display', 'inline-block');
                    }
                    if (data.result.order.isAudit == 1) {//需要审核
                        $(".orderOtherChecker").show();
                        temp.showAuditors();
                        temp.submitInfo.auditerUserId = data.result.order.auditerUserId;
                        $(".orderNeedCheck").attr('src', '../../img/yes-select.png');
                        $(".orderNoNeedCheck").attr('src', '../../img/no-select.png');
                    }
                    //查找审核人  checkerName  没用吧？
                    for (var i = 0; i < temp.checkerNames.length; i++) {
                        if (temp.checkerNames[i].userId == order.auditerUserId) {
                            temp.checkerName = temp.checkerNames[i].username;
                        }
                    }
                    //延期弹窗赋值
                    if (data.result.order.isPrepay == 1) {//有预付款
                        $(".advancePayBtn").attr('src', '../../img/yes-select.png');
                        $(".noAdvancePayBtn").attr('src', '../../img/no-select.png');
                        temp.prePayFlag = temp.submitInfo.isPrepay = 1;
                    }
                    if (data.result.order.isPrepay == 1) {//有预付款
                        $(".advancePayBtn").attr('src', '../../img/yes-select.png');
                        $(".noAdvancePayBtn").attr('src', '../../img/no-select.png');
                        temp.prePayFlag = temp.submitInfo.isPrepay = 1;
                    }
                    if (data.result.order.isPeriod == 1) {//有分期
                        $(".separateBtn").attr('src', '../../img/yes-select.png');
                        $(".noSeparateBtn").attr('src', '../../img/no-select.png');
                        temp.periodFlag = temp.submitInfo.isPeriod = 1;
                    }
                    if (data.result.order.isPrepay == 1 || data.result.order.isPeriod == 1) {//有分期或者有预付款  解析分期buffer
                        temp.periodDetail = JSON.parse(data.result.periodDetailsBuffer);
                    }
                    temp.submitInfo.period = data.result.order.period;//分几期
                    if (data.result.order.periodMethod == 1) {//按金额
                        temp.computeFlag = 1;
                        $(".moneyBtn ").addClass('redBtn').removeClass('grayBtn');
                        $(".percentBtn ").addClass('grayBtn').removeClass('redBtn');
                    } else {
                        temp.computeFlag = 0;
                    }
                    temp.submitInfo.premise = data.result.order.premise;//支付前提
                    temp.submitInfo.premiseDays = data.result.order.premiseDays;//支付前提天数
                    if (data.result.order.invoiceType == 1 ) {  //有发票=普通
                        $(".editInvoice").css('display', 'inline-block');
                        temp.commonInvoicePara.id = data.result.order.invoiceDTO.id;
                        temp.commonInvoicePara = copyObj(data.result.invoiceDTO);
                        temp.submitCommonInvoice = copyObj(data.result.invoiceDTO);
                    }
                    if (data.result.order.invoiceType == 2) {  //有发票-专用
                        $(".editInvoice").css('display', 'inline-block');
                        temp.invoiceInfo.id = data.result.order.invoiceDTO.id;
                        temp.invoiceInfo = copyObj(data.result.invoiceDTO);
                        temp.submitInvoiceInfo = copyObj(data.result.invoiceDTO);
                    }
                    if (data.result.order.invoiceType == 2) {//专用发票
                        if (data.result.invoiceDTO) {
                            temp.submitInvoiceInfo=copyObj(data.result.invoiceDTO);
                            if (data.result.invoiceDTO.businessLicensePicUrl) {
                                $(".licenseDefault").hide();
                                $("#yingYe").css('display', 'inline-block');
                                $(".bigLicense")[0].src = $("#yingYe")[0].src = temp.getImgUrl(data.result.invoiceDTO.businessLicensePicUrl);
                            }
                            if (data.result.invoiceDTO.taxRegistrationCertificatePicUrl) {
                                $(".registerDefault").hide();
                                $("#shuiWu").css('display', 'inline-block');
                                $(".bigRegister")[0].src = $("#shuiWu")[0].src = temp.getImgUrl(data.result.invoiceDTO.taxRegistrationCertificatePicUrl);
                            }
                            if (data.result.invoiceDTO.generalTaxpayerPicUrl) {
                                $(".proveDefault").hide();
                                $("#naShui").css('display', 'inline-block');
                                $(".bigProve")[0].src = $("#naShui")[0].src = temp.getImgUrl(data.result.invoiceDTO.generalTaxpayerPicUrl);
                            }
                        }
                    }
                    //提交时加上修改的标识
                    temp.submitInfo.orderId = data.result.order.orderId;
                    temp.submitInfo.id = data.result.order.id;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //点击取消  显示取消修改订单
        calcelEdit: function () {
            printConfirm('确定要取消修改么？', function () {
                // window.location.href ='2_quickOrderList_seller.html';
                // window.location.href =window.history.back(-1); ;
                window.history.back();
                return false;
            })
        },
        //通过uid获取名字
        getcheckerNames: function () {
            var paramData = {"uid": this.order.auditerUserId};
            $.jsonAjax(getUrl("/quickor/item/showApproveList"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    this.checkerNames = data.result.auditers;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);


        },
//上面是修改订单新加的-----------------------------------------------------------------
        //第一步的下一步
        stepOneNext: function () {
            var temp = this;
            if (!isNotBlank(temp.userInput)) {
                popUp_auto_false(1500, '请填写买方公司全称');
                return;
            }
            if (!isNotBlank(temp.selectedSeller.umobile)) {
                popUp_auto_false(1500, '请填写买方电话');
                return;
            }
            $(".stepOne").hide();
            $(".stepTwo").show();
        },
        //第二步的下一步
        stepTwoNext: function () {
            var temp = this;
            if (temp.selectedGoodsList.length < 1) {
                popUp_auto_false(1500, '请添加商品');
                return;
            }
            for (var i = 0; i < temp.selectedGoodsList.length; i++) {
                if (!isNotBlank(temp.selectedGoodsList[i].itemQuantity)) {
                    popUp_auto_false(1500, '商品数量不能为零');
                    return;
                }
            }
            $(".stepTwo").hide();
            $(".stepThree").show();
        },
        //延期支付详情 点确定时 校验   1.最后一期金额、比例不能为负值  2支付金额、比例不能为空值，  3分期金额之和==金额总数  ，比例之和为100
        periodSubmit: function () {
            var temp = this;
            if (temp.periodDetail[temp.periodDetail.length - 1].orderScale < 0 || temp.periodDetail[temp.periodDetail.length - 1].orderAmount < 0) {
                popUp_auto_false(2500, '最后一期的比例和金额不能为负值');
                return;
            }
            if ($(".noAdvancePayBtn")[0].src.indexOf('yes-select.png') == -1 || $(".noSeparateBtn")[0].src.indexOf('yes-select.png') == -1) {  //有预付款和有分期必须选择一个才可以判断

                for (var i = 0; i < temp.periodDetail.length; i++) {
                    if (!isNotBlank(temp.periodDetail[i].orderScale)) {
                        popUp_auto_false(1500, '每一期的比例和金额不能为空');
                        return;
                    }
                    if (!isNotBlank(temp.periodDetail[i].orderAmount)) {
                        popUp_auto_false(1500, '每一期的金额和比例不能为空');
                        return;
                    }
                    if(temp.periodDetail[i].orderScale==0 || temp.periodDetail[i].orderAmount==0){
                        popUp_auto_false(2500, '每一期的金额和比例不能为零');
                        return;
                    }
                }
                var computeMoney = 0, computePercent = 0;
                for (var j = 0; j < temp.periodDetail.length; j++) {
                    computeMoney += (temp.periodDetail[j].orderAmount - 0);
                    computePercent += (temp.periodDetail[j].orderScale - 0);
                }
                console.log(computeMoney, temp.submitInfo.totalAmount);
                if (computeMoney.toFixed(2) != temp.submitInfo.totalAmount) {
                    popUp_auto_false(1500, '合计金额不等于总额');
                    return;
                }
                if (computePercent.toFixed(2) != 100) {
                    popUp_auto_false(1500, '合计比例不等于100%');
                    return;
                }
            }
            $(".editPayInfo").css('display', 'inline-block');
            $(".delayPayWrap").hide();
        },
//上面是校验-----------------------------------------------------------------
        //显示卖家弹窗
        showSellerList: function () {
            $(".selectPartner").show();
        },
        //查询买家列表
        searchPartner: function () {
            var temp = this;
            var paramData = {'modelType': 1, buyerInput: temp.userInput};
            temp.selectedSeller={};
            console.log(paramData);
            if (temp.userInput.length > 3) {
                $.jsonAjax(getUrl("/quickor/suggest/queryUserList"), filterJSONNULL(paramData), function (data, status, xhr) {
                    if (data.isSuccess) {
                        temp.partnerList = data.result.userCompanyDTO;
                    } else {
                        popUp_auto_false(2500, data.msg);
                    }
                }, false);
            } else {
                temp.partnerList = {};
            }

        },
        //点击搜索出来的li，把值给userInput
        liToUserInput: function (e, index) {
            this.userInput = e.target.innerText;
            var uid = this.partnerList[index].uid;
            var temp = this;
            var paramData = {'uid': uid};
            $.jsonAjax(getUrl("/quickor/user/queryUserInfo"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.selectedSeller = data.result.user;
                    console.log(data);
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
        },
        //点击列表选取,查询商品列表
        searchGoodsList: function () {
            var temp = this;
            temp.queryGoodsParamData.page = 1;
            temp.queryGoodsParamData.itemArray = JSON.stringify(goodsId).toString();
            console.log(temp.queryGoodsParamData);
            $.jsonAjax(getUrl("/quickor/item/queryItemSelectList"), filterJSONNULL(temp.queryGoodsParamData), function (data, status, xhr) {
                if (data) {
                    temp.$data.paper = data.result.paper;
                    // temp.$data.goodsList = {};
                    temp.$data.goodsList = data.result.paper.records;
                    setTimeout(function () {
                        if (temp.initScrollFlag == 0) {
                            initPage();
                        }
                        temp.beginTranY = document.getElementById('pullDown').offsetHeight;
                        myScroll.refresh();
                        $("#scroller").css("transform", "translate(0px, -" + temp.beginTranY + "px)");
                        temp.initScrollFlag = 1;
                    }, 0);

                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //商品详情弹窗
        showGoodsDetile: function (itemId) {
            console.log(itemId);
            $(".goodsDetileWin").show();
            var temp = this;
            var paramData = {'itemId': itemId};
            $.jsonAjax(getUrl("/quickor/item/itemDetails"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.goodsInfo = data.itemDetails;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //隐藏商品详情
        hideGoodsDetile: function () {
            $(".goodsDetileWin").hide();
        },
        changeImg: function (e) {
            if ($(e.target).attr("src").indexOf('yes-select') == -1) {
                $(e.target).attr("src", "../../img/yes-select.png")
            } else {
                $(e.target).attr("src", "../../img/no-select.png")
            }
        },
        //选取完商品，点击确定
        selectGoodsSure: function () {
            var temp = this;
            $(".wrapScrool .selBtn").each(function (item, index) {
                if (this.src.indexOf('no-select') == -1) {//将选择的商品有用的信息，push到临时数组里,用来循环
                    var selectedGoods = {
                        itemId: $(this).attr('itemid'),
                        itemName: $(this).attr('itemname'),
                        unitPrice: $(this).attr('unitprice'),
                        itemQuantity: 0,
                        itemTotalPrice: 0,
                        itemFreight: 0
                    };
                    temp.selectedGoodsList.push(selectedGoods);//把选择的商品push到数组里
                    goodsId.push(parseInt($(this).attr('itemid')));
                    // console.log(goodsId);
                    /*if(temp.queryGoodsParamData.itemArray){
                     temp.queryGoodsParamData.itemArray.push(parseInt($(this).attr('itemid')));//选取了的商品，就不能再出现在列表选取中
                     }else {
                     temp.queryGoodsParamData.itemArray=[];
                     }*/
                }
            });

        },
        //检测每一个选取商品的数量和运费变化，用来计算商品总价和订单总价
        computeItemTotal: function (index) {
            if(this.selectedGoodsList[index].itemQuantity!=0&& this.selectedGoodsList[index].itemQuantity!=''){
                //限定数量不能输入负数，限制4位小数
                this.selectedGoodsList[index].itemQuantity=this.selectedGoodsList[index].itemQuantity.replace(/[^(^\d+\.{0,1}\d*$)]/g,'');
                var reg3 = /\./g;
                var reg3Array = reg3.exec(this.selectedGoodsList[index].itemQuantity);
                if (reg3Array != null) {
                    var reg3Right = this.selectedGoodsList[index].itemQuantity.substring(reg3Array.index + reg3Array[0].length);
                    reg3Right = reg3Right.replace(reg3, '');
                    reg3Right = reg3Right.substring(0, 4);
                    this.selectedGoodsList[index].itemQuantity = this.selectedGoodsList[index].itemQuantity.substring(0, reg3Array.index) + '.' + reg3Right;
                }
            }
            if(this.selectedGoodsList[index].itemFreight!=0&& this.selectedGoodsList[index].itemFreight!=''){
                //限定运费不能输入负数
                this.selectedGoodsList[index].itemFreight=this.selectedGoodsList[index].itemFreight.replace(/[^(^\d+\.{0,1}\d*$)]/g,'');
                var reg31 = /\./g;
                var reg3Array1 = reg31.exec(this.selectedGoodsList[index].itemFreight);
                if (reg3Array1 != null) {
                    var reg3Right1 = this.selectedGoodsList[index].itemFreight.substring(reg3Array1.index + reg3Array1[0].length);
                    reg3Right1 = reg3Right1.replace(reg31, '');
                    reg3Right1 = 2 > 0 ? reg3Right1.substring(0, 2) : reg3Right1;
                    this.selectedGoodsList[index].itemFreight = this.selectedGoodsList[index].itemFreight.substring(0, reg3Array1.index) + '.' + reg3Right1;
                }
            }

            this.selectedGoodsList[index].itemTotalPrice = (parseFloat(this.selectedGoodsList[index].unitPrice * this.selectedGoodsList[index].itemQuantity - 0) + (this.selectedGoodsList[index].itemFreight - 0)).toFixed(2);
            this.computeTotal();
        },
        //计算所有订单总价,单独摘出来是为了在删除商品时，从新计算总价
        computeTotal: function () {
            this.submitInfo.totalAmount = 0;
            for (var i = 0; i < this.selectedGoodsList.length; i++) {
                this.submitInfo.totalAmount = ((this.submitInfo.totalAmount - 0) + (this.selectedGoodsList[i].itemTotalPrice - 0)).toFixed(2);
            }
            //处理:填了分期，又返回去修改商品数量或者运费了
            if(this.prePayFlag==1 || this.periodFlag==1){
                this.defaultComputePeriod();
            }
        },
        //删除已选择的商品
        deleteSelWin: function (index) {
            var temp=this;
            temp.tempIndex=index;
            $("#delSelGoods").show();
        },
        deleteSelectedGoods: function () {
            $("#delSelGoods").hide();
            var temp=this;
            temp.selectedGoodsList.splice(temp.tempIndex,1);
            goodsId.splice(temp.tempIndex,1);
            temp.computeTotal();
        },
        //回到顶部
        goToTop: function () {
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
            $("#top").hide();
        },
//用于新增商品--------------------------------------------------------------
        //初始化一级类目
        initCatagory: function () {
            var temp = this;
            var paramData = {'pid': 0};
            $.jsonAjax(getUrl("/quickor/item/queryCategoryList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.categoryLevOne = data.categories;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //一级类目变化
        changeLevOne: function () {
            var temp = this;
            var categoryCid;
            if ($("#pinlei").val() != 0 && $("#pinlei").val() != 'other') {
                categoryCid = $("#pinlei").val();
            } else {
                temp.categoryLevTwo = [];temp.categoryLevThree =[];temp.brandList= [];
                return;
            }
            var paramData = {'pid': categoryCid};
            $.jsonAjax(getUrl("/quickor/item/queryCategoryList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.categoryLevTwo = data.categories;//查出来二级类目
                    $("#pinlei1,#pinlei2").val(0);
                    temp.categoryLevThree=[];
                    temp.brandList=[];
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //二级类目变化
        changeLevTwo: function () {
            $("#pinlei2").val(0);
            this.brandList=[];
            var temp = this;
            if ($("#pinlei1").val() != 0) {
                var categoryCid = $("#pinlei1").val();
            } else {
                temp.categoryLevThree = [];
                return;
            }
            var paramData = {'pid': categoryCid};
            $.jsonAjax(getUrl("/quickor/item/queryCategoryList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.categoryLevThree = data.categories;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //三级类目变化，查询品牌
        queryBrand: function () {
            var temp=this;
            if ($("#pinlei2").val() != 0) {
                var categoryThreeId = $("#pinlei2").val();
            } else {
                temp.brandList = [];
                return;
            }
            var paramData = {'thirdId': categoryThreeId};
            $.jsonAjax(getUrl("/quickor/item/queryItemBrandList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.brandList = data.brands;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //查询审核人列表
        showAuditors: function () {
            var temp = this;
            $.jsonAjax(getUrl("/quickor/item/showApproveList"), {}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.auditors = data.result.auditers;
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
        },
        //新增商品
        addGoods: function () {
            var temp = this;
            var paramData = temp.material;
            //校验商品名
            if (paramData.itemName == '') {
                popUp_auto_false(2500, '请填写'+temp.personalityDTO.itemNameLity);
                return;
            }
            //校验品类  cid
            if ($("#pinlei").val() == 'other') {
                paramData.isCustomCategory = 1;
                if ($(".otherCategory").val() == '') {
                    popUp_auto_false(2500, '请填写'+temp.personalityDTO.itemCnameLity);
                    return;
                } else {
                    paramData.cname = $(".otherCategory").val();
                }
                paramData.cid = 0;
            } else {
                paramData.isCustomCategory = 0;
                if ($("#pinlei2").val() == 0) {
                    popUp_auto_false(2500, '请选择三级类目');
                    return;
                } else {
                    paramData.cid = $("#pinlei2").val();
                    var obj = document.getElementById("pinlei2");
                    var txt = obj.options[obj.selectedIndex].text;
                    paramData.cname = txt;
                }
            }
            //校验品牌
            if ($("#pinpai").val() == 'other') {
                paramData.isCustomBrand = 1;
                if ($(".otherBrandInput").val() == '') {
                    popUp_auto_false(2500, '请填写'+temp.personalityDTO.itemBrandLity);
                    return;
                }
                paramData.brandId = 0;
                paramData.brandName = $(".otherBrandInput").val();
            } else {
                paramData.isCustomBrand = 0;
                if ($("#pinpai").val() == 0) {
                    popUp_auto_false(2500, '请选择'+temp.personalityDTO.itemBrandLity);
                    return;
                }
                var obj1 = document.getElementById("pinpai");
                var txt1 = obj1.options[obj1.selectedIndex].text;
                paramData.brandName = txt1;
                paramData.brandId = $("#pinpai").val();
            }
            //校验单价
            if (paramData.unitPrice == '') {
                popUp_auto_false(2500, '请填写单价');
                return;
            }
            //校验单位  isCustomUnit
            if ($("#danwei").val() == 'other') {
                paramData.isCustomUnit = 1;
                if ($(".otherUnitInput").val() == '') {
                    popUp_auto_false(2500, '请填写其他单位名称');
                    return;
                }
                paramData.itemUnitName = $(".otherUnitInput").val();
            } else {
                paramData.isCustomUnit = 0;
                if ($("#danwei").val() == 0) {
                    popUp_auto_false(2500, '请选择单位');
                    return;
                }
                paramData.itemUnitName = $("#danwei").val();
            }
            //校验规格  isCustomStandard
            if ($("#guige").val() == 'other') {
                paramData.isCustomStandard = 1;
                /*if ($(".otherSpeciInput").val() == '') {
                    popUp_auto_false(2500, '请填写其他规格');
                    return;
                }*/
                paramData.standard = $(".otherSpeciInput").val();
            } else {
                paramData.isCustomStandard = 0;
                /*if ($("#guige").val() == 0) {
                    popUp_auto_false(2500, '请选择规格');
                    return;
                }*/
                paramData.standard = $("#guige").val();
            }
            //校验审核人
            if ($(".needCheck").attr('src').indexOf('no-select') == -1) {
                paramData.isAudit = 1;
                if ($("#checker1").val() == 0) {
                    popUp_auto_false(2500, '请选择审核人');
                    return;
                }
                paramData.auditer = $("#checker1").val();
            } else {
                paramData.isAudit = 0;
                paramData.auditer = '';
            }
            // 给备注参数赋值
            if ($(".remark").val()) {
                paramData.remark = $(".remark").val();
            }
            //是否加入物资
            if ($(".noAddToMaterial").attr('src').indexOf('yes') == -1) {
                temp.material.isMaterials = 1;
            } else {
                temp.material.isMaterials = 0;
            }
            $.jsonAjax(getUrl("/quickor/item/submitCreateItemOrMaterials"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    popUp_auto(2500, data.msg);
                    window.setTimeout(function () {
                        $(".addGoodsWin").hide();
                        var newGoods = {
                            itemId: data.itemId,
                            itemName: temp.material.itemName,
                            unitPrice: temp.material.unitPrice,
                            itemQuantity: 0,
                            itemTotalPrice: 0,
                            itemFreight: 0
                        };
                        temp.selectedGoodsList.push(newGoods);
                        if(temp.material.isMaterials==1){//新增加的物资的itemId，要增加到过滤的数组中，让列表选取里没有
                            goodsId.push(parseInt(data.itemId));
                        }
                        console.log(newGoods);
                    }, 2500);
                } else {
                    popUp_auto_false(2500, "新增失败！");
                }
            }, false);
        },
//提交发票，带回来一个发票Id--------------------------------------------------------------
        //专用发票点击下一步
        specialInvoiceOneStep: function () {
            var temp = this;
            if (!isNotBlank(temp.invoiceInfo.companyName)) {
                popUp_auto_false(1500, '请填写单位名称');
                return;
            }
            if (temp.invoiceInfo.companyName.length < 2) {
                popUp_auto_false(1500, '请填写完整单位名称');
                return;
            }
            if (!isNotBlank(temp.invoiceInfo.taxpayerCode)) {
                popUp_auto_false(1500, '纳税人识别码不能为空');
                return;
            }
            var reg_number = /^([a-zA-Z0-9]){15,20}$/;
            if (!reg_number.test(temp.invoiceInfo.taxpayerCode)) {
                popUp_auto_false(1500, '纳税人识别码格式错误');
                return;
            }
            if (!isNotBlank(temp.invoiceInfo.registeredAddress)) {
                popUp_auto_false(1500, '请填写注册地址');
                return;
            }
            if (!isNotBlank(temp.invoiceInfo.registeredPhone)) {
                popUp_auto_false(1500, '请填写注册电话');
                return;
            }
            if (!isNotBlank(temp.invoiceInfo.bankName)) {
                popUp_auto_false(1500, '请填写开户银行');
                return;
            }
            if (!isNotBlank(temp.invoiceInfo.bankAccount)) {
                popUp_auto_false(1500, '请填写银行账户');
                return;
            }
            $('.specialInvoiceOne').hide();
            $('.specialInvoiceTwo').show();
        },
        getInvoiceId: function (flag) {
            var temp = this;
            if (flag == 1) {//普通发票检验
                if (!isNotBlank(temp.commonInvoicePara.invoiceTitle)) {
                    popUp_auto_false(1500, '发票抬头不能为空');
                    return;
                }
                if (!isNotBlank(temp.commonInvoicePara.taxpayerCode)) {
                    popUp_auto_false(1500, '纳税人识别码不能为空');
                    return;
                }
                var reg_number = /^([a-zA-Z0-9]){15,20}$/;
                if (!reg_number.test(temp.commonInvoicePara.taxpayerCode)) {
                    popUp_auto_false(1500, '纳税人识别码格式错误');
                    return;
                }
                $(".commonInvoice").hide();
                $(".editInvoice").show();
                //复制出来一份，点击修改再点击取消，应该把参数变到提交时的那时参数，用来回显
                temp.submitCommonInvoice=copyObj(temp.commonInvoicePara);
                temp.commonInvoicePara.buyerId=temp.selectedSeller.uid;
                var commonInvoiceNeed = {
                    invoice: temp.commonInvoicePara.invoice,
                    invoiceTitle: temp.commonInvoicePara.invoiceTitle,
                    taxpayerCode: temp.commonInvoicePara.taxpayerCode
                };
                if(temp.commonInvoicePara.id){//有id了就是修改发票
                    commonInvoiceNeed.orderId=temp.order.orderId;
                    $.jsonAjax(getUrl("/invoice/updateQuickOrderInvoice"), commonInvoiceNeed, function (data, status, xhr) {
                        if (data.isSuccess) {
                            popUp_auto(2500, data.msg);
                            temp.submitInfo.invoiceId = data.invoiceId;
                        } else {
                            popUp_auto_false(2500, data.msg);
                        }
                    }, false);
                }else {
                    commonInvoiceNeed.orderId=temp.order.orderId;
                    $.jsonAjax(getUrl("/invoice/save"), commonInvoiceNeed, function (data, status, xhr) {
                        if (data.isSuccess) {
                            popUp_auto(2500, data.msg);
                            temp.submitInfo.invoiceId = data.invoiceId;
                        } else {
                            popUp_auto_false(2500, data.msg);
                        }
                    }, false);
                }
            }
            if (flag == 2) {
                if (!isNotBlank(temp.invoiceInfo.consigneeName)) {
                    popUp_auto_false(1500, '请填写收票人姓名');
                    return;
                }
                if (!isNotBlank(temp.invoiceInfo.consigneeMobile)) {
                    popUp_auto_false(1500, '请填写收票人手机');
                    return;
                }
                if (temp.invoiceInfo.provinceId == 0) {
                    popUp_auto_false(1500, '请选择省');
                    return;
                }
                if (temp.invoiceInfo.cityId == 0) {
                    popUp_auto_false(1500, '请选择市');
                    return;
                }
                if (temp.invoiceInfo.countyId == 0) {
                    popUp_auto_false(1500, '请选择县');
                    return;
                }
                if (temp.invoiceInfo.detailAddress == '') {
                    popUp_auto_false(1500, '请填写详细地址');
                    return;
                }
                $('.addInvoiceWrap').hide();
                $(".editInvoice").show();
                var invoicePara = {
                    id:temp.invoiceInfo.id,
                    companyName:temp.invoiceInfo.companyName,
                    invoice:temp.invoiceInfo.invoice,
                    invoiceTitle:temp.invoiceInfo.invoiceTitle,
                    taxpayerCode:temp.invoiceInfo.taxpayerCode,
                    registeredAddress:temp.invoiceInfo.registeredAddress,
                    registeredPhone:temp.invoiceInfo.registeredPhone,
                    bankName:temp.invoiceInfo.bankName,
                    bankAccount:temp.invoiceInfo.bankAccount,
                    businessLicensePicUrl:temp.invoiceInfo.businessLicensePicUrl,
                    taxRegistrationCertificatePicUrl:temp.invoiceInfo.taxRegistrationCertificatePicUrl,
                    generalTaxpayerPicUrl:temp.invoiceInfo.generalTaxpayerPicUrl,
                    normalContent:temp.invoiceInfo.normalContent,
                    consigneeName:temp.invoiceInfo.consigneeName,
                    consigneeMobile:temp.invoiceInfo.consigneeMobile,
                    provinceId:temp.invoiceInfo.provinceId,
                    cityId:temp.invoiceInfo.cityId,
                    countyId:temp.invoiceInfo.countyId,
                    detailAddress:temp.invoiceInfo.detailAddress};
                //复制出来一份，点击修改再点击取消，应该把参数变到提交时的那时参数，用来回显
                temp.submitInvoiceInfo=copyObj(invoicePara);
                if(temp.invoiceInfo.id){//有id了就是修改发票
                    invoicePara.orderId=temp.order.orderId;
                    $.jsonAjax(getUrl("/invoice/updateQuickOrderInvoice"), filterJSONNULL(invoicePara), function (data, status, xhr) {
                        if (data.isSuccess) {
                            popUp_auto(2500, data.msg);
                            temp.submitInfo.invoiceId = data.invoiceId;
                        } else {
                            popUp_auto_false(2500, data.msg);
                        }
                    }, false);
                }else {
                    invoicePara.orderId=temp.order.orderId;
                    $.jsonAjax(getUrl("/invoice/save"), filterJSONNULL(invoicePara), function (data, status, xhr) {
                        if (data.isSuccess) {
                            popUp_auto(2500, data.msg);
                            temp.submitInfo.invoiceId = data.invoiceId;
                        } else {
                            popUp_auto_false(2500, data.msg);
                        }
                    }, false);
                }
            }
        },
   /*     cancelCommonInvoiceInfo: function () {
            var temp=this;
            temp.commonInvoicePara=copyObj(temp.submitCommonInvoice);
        },
        cancelInvoiceInfo: function () {
            var temp=this;
            temp.invoiceInfo=copyObj(temp.submitInvoiceInfo);
            if (temp.submitInvoiceInfo.businessLicensePicUrl) {
                $(".licenseDefault").hide();
                $("#yingYe").css('display', 'inline-block');
                $(".bigLicense")[0].src = $("#yingYe")[0].src = getImgUrl(temp.submitInvoiceInfo.businessLicensePicUrl);
            }
            if (temp.submitInvoiceInfo.taxRegistrationCertificatePicUrl) {
                $(".registerDefault").hide();
                $("#shuiWu").css('display', 'inline-block');
                $(".bigRegister")[0].src = $("#shuiWu")[0].src = getImgUrl(temp.submitInvoiceInfo.taxRegistrationCertificatePicUrl);
            }
            if (temp.submitInvoiceInfo.generalTaxpayerPicUrl) {
                $(".proveDefault").hide();
                $("#naShui").css('display', 'inline-block');
                $(".bigProve")[0].src = $("#naShui")[0].src = getImgUrl(temp.submitInvoiceInfo.generalTaxpayerPicUrl);
            }
        },*/
        //license input框变化和放大图片里的input变化 --营业执照
        licenseChange: function () {
            var temp = this;
            popUp_open();
            $.uploadFile({
                url: getUrl('/fileUpload/fileUploadCrossSize?date=' + new Date()), //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'licenseInput', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                data: {
                    size: 10240000,
                },
                type: "post",
                success: function (data, status) {  //服务器成功响应处理函数
                    console.log(data);
                    popUp_close();
                    if (data.success) {
                        popUp_auto(1000, "上传成功!");
                        temp.invoiceInfo.businessLicensePicUrl = data.result;
                        $(".licenseDefault").hide();
                        var imgUrl = img_url + data.result;
                        $(".licenseImg").attr('src', imgUrl).css("display", 'inline-block');
                        $(".bigLicense").attr('src', imgUrl);
                    } else {
                        popUp_auto_false(1500, data.errorMessages);
                    }
                },
                error: function (data, status, e) {//服务器响应失败处理函数
                    console.log(data);
                    popUp_close();
                }
            }, false);
        },
        licenseHideChange: function () {
            var temp = this;
            popUp_open();
            $.uploadFile({
                url: getUrl('/fileUpload/fileUploadCrossSize?date=' + new Date()), //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'licenseHideInput', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                data: {
                    size: 10240000,
                },
                type: "post",
                success: function (data, status) {  //服务器成功响应处理函数
                    console.log(data);
                    popUp_close();
                    if (data.success) {
                        popUp_auto(1000, "上传成功!");
                        temp.invoiceInfo.businessLicensePicUrl = data.result;
                        var imgUrl = img_url + data.result;
                        $(".licenseImg").attr('src', imgUrl);
                        $(".bigLicense").attr('src', imgUrl);
                    } else {
                        popUp_auto_false(1500, data.errorMessages);
                    }
                },
                complete: function () {
                    $('#licenseHideInput').change(function () {
                        temp.licenseHideChange();
                    });
                },
                error: function (data, status, e) {//服务器响应失败处理函数
                    console.log(data);
                    popUp_close();
                }
            }, false);
        },
        //register input框变化 --税务登记证
        registerChange: function () {
            var temp = this;
            popUp_open();
            $.uploadFile({
                url: getUrl('/fileUpload/fileUploadCrossSize?date=' + new Date()), //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'registerInput', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                data: {
                    size: 10240000,
                },
                type: "post",
                success: function (data, status) {  //服务器成功响应处理函数
                    console.log(data);
                    popUp_close();
                    if (data.success) {
                        popUp_auto(1000, "上传成功!");
                        temp.invoiceInfo.taxRegistrationCertificatePicUrl = data.result;
                        $(".registerDefault").hide();
                        var imgUrl = img_url + data.result;
                        $(".registerBtn").attr('src', imgUrl).css("display", 'inline-block');
                        $(".bigRegister").attr('src', imgUrl);
                    } else {
                        popUp_auto_false(1500, data.errorMessages);
                    }
                },
                error: function (data, status, e) {//服务器响应失败处理函数
                    console.log(data);
                    popUp_close();
                }
            }, false);
        },
        registerHideChange: function () {
            var temp = this;
            popUp_open();
            $.uploadFile({
                url: getUrl('/fileUpload/fileUploadCrossSize?date=' + new Date()), //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'registerHideInput', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                data: {
                    size: 10240000,
                },
                type: "post",
                success: function (data, status) {  //服务器成功响应处理函数
                    console.log(data);
                    popUp_close();
                    if (data.success) {
                        popUp_auto(1000, "上传成功!");
                        temp.invoiceInfo.taxRegistrationCertificatePicUrl = data.result;
                        var imgUrl = img_url + data.result;
                        $(".registerBtn").attr('src', imgUrl);
                        $(".bigRegister").attr('src', imgUrl);
                    } else {
                        popUp_auto_false(1500, data.errorMessages);
                    }
                },
                complete: function () {
                    $('#registerHideInput').change(function () {
                        temp.registerHideChange();
                    });
                },
                error: function (data, status, e) {//服务器响应失败处理函数
                    console.log(data);
                    popUp_close();
                }
            }, false);
        },
        //register input框变化 --一般人纳税
        proveChange: function () {
            var temp = this;
            popUp_open();
            $.uploadFile({
                url: getUrl('/fileUpload/fileUploadCrossSize?date=' + new Date()), //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'proveInput', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                data: {
                    size: 10240000,
                },
                type: "post",
                success: function (data, status) {  //服务器成功响应处理函数
                    console.log(data);
                    popUp_close();
                    if (data.success) {
                        popUp_auto(1000, "上传成功!");
                        temp.invoiceInfo.generalTaxpayerPicUrl = data.result;
                        $(".proveDefault").hide();
                        var imgUrl = img_url + data.result;
                        $(".proveBtn").attr('src', imgUrl).css("display", 'inline-block');
                        $(".bigProve").attr('src', imgUrl);
                    } else {
                        popUp_auto_false(1500, data.errorMessages);
                    }
                },
                error: function (data, status, e) {//服务器响应失败处理函数
                    console.log(data);
                    popUp_close();
                }
            }, false);
        },
        proveHideChange: function () {
            var temp = this;
            popUp_open();
            $.uploadFile({
                url: getUrl('/fileUpload/fileUploadCrossSize?date=' + new Date()), //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'proveHideInput', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                data: {
                    size: 10240000,
                },
                type: "post",
                success: function (data, status) {  //服务器成功响应处理函数
                    console.log(data);
                    popUp_close();
                    if (data.success) {
                        popUp_auto(1000, "上传成功!");
                        temp.invoiceInfo.generalTaxpayerPicUrl = data.result;
                        var imgUrl = img_url + data.result;
                        $(".proveBtn").attr('src', imgUrl);
                        $(".bigProve").attr('src', imgUrl);
                    } else {
                        popUp_auto_false(1500, data.errorMessages);
                    }
                },
                complete: function () {
                    $('#proveHideInput').change(function () {
                        temp.proveHideChange();
                    });
                },
                error: function (data, status, e) {//服务器响应失败处理函数
                    console.log(data);
                    popUp_close();
                }
            }, false);
        },
//下面是订单提交部分-----------------------------------------------------------------
        //订单提交
        submitOrder: function () {
            var temp = this;
            //把卖家信息赋给参数
            temp.submitInfo.sellerPhone=temp.userInfo.umobile;
            temp.submitInfo.sellerName=temp.userInfo.companyName;
            temp.submitInfo.sellerUserId=temp.userInfo.uid;
            temp.submitInfo.sellerEmail=temp.userInfo.userEmail;
            //支付方式
            if(temp.submitInfo.payDelay==1){
            	temp.submitInfo.payMethod = 2;
            }else{
            	temp.submitInfo.payMethod = 1;
            	temp.periodFlag = 0;
            	temp.prePayFlag = 0;
            }
            //有无预付款赋值
            if (temp.prePayFlag == 1) {
                temp.submitInfo.isPrepay = 1;//有预付款
            } else {
                temp.submitInfo.isPrepay = 0;//无预付款
            }
            //判断分期付款金额
            if(temp.submitInfo.payDelay == 1 && temp.submitInfo.totalAmount < 1){
            	popUp_auto_false(2500, '小于1元的订单不能选择延期支付!');
            	return;
            }
            //有无分期赋值
            if (temp.periodFlag == 1) {
                temp.submitInfo.isPeriod = 1;//有分期
                //periodDetailsBuffer  分期buffer
                temp.submitInfo.periodDetailsBuffer = JSON.stringify(temp.periodDetail).toString();
            } else {
                temp.submitInfo.isPeriod=0;//无分期
                if(temp.submitInfo.isPrepay==1){//无分期 有预付款
                    temp.submitInfo.periodDetailsBuffer=JSON.stringify(temp.periodDetail).toString();
                }else {//无分期 无预付款（不分期的也要装载分一期的defaultPeriod）
                    var defaultPeriod=[{"periodCounts":1,"orderScale":100,"orderAmount":temp.submitInfo.totalAmount}];
                    temp.submitInfo.periodDetailsBuffer=JSON.stringify(defaultPeriod).toString();
                }
                deleteJSONFiled(temp.submitInfo,"period");//把分期期数删掉
            }
            //预付比例prepayScale赋值 和 订单总预付totalPrepayAmount 有预付款的情况下，第一期的比例就是预付比例
            if (temp.prePayFlag == 1) {
                temp.submitInfo.prepayScale = parseInt(temp.periodDetail[0].orderScale);
                temp.submitInfo.totalPrepayAmount = temp.periodDetail[0].orderAmount;
            } else {
                temp.submitInfo.prepayScale = 0;
                temp.submitInfo.totalPrepayAmount = 0;
                deleteJSONFiled(temp.submitInfo,"prepayScale");//把预付款比例删掉
            }
            //periodMethod '0:按比例;1:按金额',
            temp.submitInfo.periodMethod=temp.computeFlag;
            //判断审核人是否选取
            if ($(".orderNeedCheck").attr('src').indexOf('no-select') == -1) {
                temp.submitInfo.isAudit = 1;
                if ($("#checker2").val() == 0) {
                    popUp_auto_false(2500, '请选择审核人');
                    return;
                }
                temp.submitInfo.auditerUserId = $("#checker2").val();
            } else {
                temp.submitInfo.isAudit = 0;
                temp.submitInfo.auditerUserId = '';
            }
            //把买卖信息赋给参数
            temp.submitInfo.buyerPhone=temp.selectedSeller.umobile;
            if(temp.selectedSeller.companyName){
                temp.submitInfo.buyerName=temp.selectedSeller.companyName;
            }else {
                temp.submitInfo.buyerName=temp.userInput;
            }
            temp.submitInfo.buyerUserId=temp.selectedSeller.uid;
            //itemDetailsBuffer  商品buffer赋值
            temp.submitInfo.itemDetailsBuffer = JSON.stringify(temp.selectedGoodsList).toString();

            //订单未付的钱 unPayedAmount
            temp.submitInfo.unPayedAmount = numSub(temp.submitInfo.totalAmount, temp.submitInfo.totalPrepayAmount);
            //校验发票
            if(temp.submitInfo.invoiceType==1){
                if(!isNotBlank(temp.commonInvoicePara.invoiceTitle) || !isNotBlank(temp.commonInvoicePara.taxpayerCode) ){
                    popUp_auto_false(1500,'请完善发票信息!');
                    return;
                }
            }
            if(temp.submitInfo.invoiceType==2){
                if(!isNotBlank(temp.invoiceInfo.companyName) || !isNotBlank(temp.invoiceInfo.taxpayerCode) ||
                    !isNotBlank(temp.invoiceInfo.registeredAddress) || !isNotBlank(temp.invoiceInfo.registeredPhone) ||
                    !isNotBlank(temp.invoiceInfo.bankName) || !isNotBlank(temp.invoiceInfo.bankAccount) ||
                    !isNotBlank(temp.invoiceInfo.consigneeName) || !isNotBlank(temp.invoiceInfo.consigneeMobile) ||
                    !isNotBlank(temp.invoiceInfo.provinceId) || !isNotBlank(temp.invoiceInfo.cityId) ||
                    !isNotBlank(temp.invoiceInfo.countyId) || !isNotBlank(temp.invoiceInfo.detailAddress)
                ){
                    popUp_auto_false(1500,'请完善发票信息!');
                    return;
                }
            }
            //延期支付中，支付前提选了 收到发票后，提交时发票就不能选不开发票！
            if(temp.submitInfo.premise==4 && temp.submitInfo.invoiceType==0){
                popUp_auto_false(2500,'请重新选择发票类型！');
                return;
            }
            var orderPara = temp.submitInfo;
            console.log(orderPara);
            $.jsonAjax(getUrl("/quickor/master/submitOrder"), orderPara, function (data, status, xhr) {
                if (data.isSuccess) {
                    popUp_auto(1500, '订单修改成功！');
                    setTimeout(function () {
                        window.location.href = './2_quickOrderList_seller.html';
                    }, 1500);
                } else {
                    popUp_auto_false(1500, data.msg);
                }
            }, false);
        },
        //切换prePayFlag 有预付款  并计算默认分期
        advancePayBtn: function () {
            this.prePayFlag = 1;
            this.defaultComputePeriod();
        },
        //切换prePayFlag 无预付款
        noAdvancePayBtn: function () {
            this.prePayFlag = 0;
        },
        //切换periodFlag 有分期  并计算默认分期
        separateBtn: function () {
            this.periodFlag = 1;
            this.defaultComputePeriod();
        },
        //切换periodFlag 无分期
        noSeparateBtn: function () {
            var temp = this;
            this.periodFlag = 0;
            //(后加的)计算分期--有分期，有预付款——>无分期，有预付款  在请求一个2期的
            // if(temp.prePayFlag==1){
            temp.submitInfo.period = 2; //把分期重置为2
            temp.periodDetail = temp.periodDetail.slice(0, 2);         //循环的分期列表去取前两条
            temp.defaultComputePeriod();
            // }
        },
        //切换 computeFlag:0  //0 按比例  1按金额
        percentBtn: function () {
            this.computeFlag = 0;
        },
        //切换 computeFlag:1  //0 按比例  1按金额
        moneyBtn: function () {
            this.computeFlag = 1;
        },
        //计算默认分期
        defaultComputePeriod: function () {
            var temp = this;
            //先判断是否填了分期大于2  大于2不请求防止篡改前两条数据
            /*if (temp.submitInfo.period > 2) {
                return;
            }*/
            temp.defaultPeriod.totalOAmount = temp.submitInfo.totalAmount;
            // temp.defaultPeriod.period = temp.submitInfo.period;
            // temp.defaultPeriod.calcuMethod = temp.computeFlag;
            var computePeriodData = temp.defaultPeriod;
            $.jsonAjax(getUrl("/quickor/master/periodMatcher"), computePeriodData, function (data, status, xhr) {
                if (data.isSuccess) {
                    for (var i = 0; i < data.result.length; i++) {
                        temp.periodDetail[i].periodCounts = data.result[i].id;
                        temp.periodDetail[i].orderScale = data.result[i].scale;
                        temp.periodDetail[i].orderAmount = data.result[i].amount;
                    }
                    console.log(temp.periodDetail);
                } else {
                    popUp_auto_false('网络错误', 1500);
                }
            }, false);
        },
        //计算分期
        computePeriod: function ($event) {
            var temp=this;
            $event.target.value=$event.target.value.replace(/\D/g,'');
            /*if($event.keyCode==110){
             popUp_auto_false(1500,'请填入2到12之间的数');
             temp.submitInfo.period='';
             return '';
             }*/
            if($event.target.value==1){//值为1不查
                return;
            }
            if($event.keyCode==8){//返回键不查
                return;
            }
            if($event.target.value && $event.target.value>1&& $event.target.value<13){ //填了数字且大于2才请求
                //先扩大数组用来填请求回来的参数
                temp.periodDetail=[{periodCounts:1,orderScale:50.0,orderAmount:'',periodPremise:6,periodPremiseDays:0},{periodCounts:2,orderScale:50.0,orderAmount:'',periodPremise:1,periodPremiseDays:0}];
                for(var j=0;j<$event.target.value-2;j++){
                    temp.periodDetail.push({periodCounts:'',orderScale:'',orderAmount:'',periodPremise:6,periodPremiseDays:0});
                }
                temp.defaultPeriod.totalOAmount=temp.submitInfo.totalAmount;
                temp.defaultPeriod.period=temp.submitInfo.period;
                temp.defaultPeriod.calcuMethod=temp.computeFlag;
                var computePeriodData=temp.defaultPeriod;
                $.jsonAjax(getUrl("/quickor/master/periodMatcher"), computePeriodData, function (data, status, xhr) {
                    if(data.isSuccess){

                        for(var i=0;i<data.result.length;i++){
                            temp.periodDetail[i].periodCounts=data.result[i].id;
                            temp.periodDetail[i].orderScale=data.result[i].scale;
                            temp.periodDetail[i].orderAmount=data.result[i].amount;
                        }
                    }else {
                        popUp_auto_false('网络错误',1500);
                    }
                }, false);
            }else {
                //prePayFlag:0,//0 无预付款  1有预付款
                /*if(temp.prePayFlag==0){//无预付款 1~12期
                 popUp_auto_false(1500,'请填入1到12之间的数');
                 if($event.target.value<1){
                 $event.target.value=1;
                 }
                 }
                 if(temp.prePayFlag==1){//有预付款 2~12期
                 popUp_auto_false(1500,'请填入2到12之间的数');
                 if($event.target.value<2){
                 $event.target.value=2;
                 }
                 }*/
                popUp_auto_false(1500,'请填入2到12之间的数');
                if($event.target.value<2){
                    $event.target.value=2;
                }
                if($event.target.value>12){
                    $event.target.value=12;
                }
            }
        },
        //补位比例.00
        fixTwoPercent: function ($event,$index) {
            this.periodDetail[$index].orderScale=($event.target.value-0).toFixed(2);
        },
        //补位金额.00
        fixTwoMoney: function ($event,$index) {
            this.periodDetail[$index].orderAmount=($event.target.value-0).toFixed(2);
        },
        //改变比例
        changePercent: function ($event,index) {
            var temp=this;
            var reg3 = /\./g;
            var reg3Array = reg3.exec(temp.periodDetail[index].orderScale);
            if (reg3Array != null) {
                var reg3Right = temp.periodDetail[index].orderScale.substring(reg3Array.index + reg3Array[0].length);
                reg3Right = reg3Right.replace(reg3, '');
                reg3Right =  reg3Right.substring(0, 2);
                temp.periodDetail[index].orderScale = temp.periodDetail[index].orderScale.substring(0, reg3Array.index) + '.' + reg3Right;
            }

            if(($event.target.value-0)<100){
                var frontMoney=0,frontPercent=0;
                temp.periodDetail[index].orderAmount=parseFloat((temp.submitInfo.totalAmount-0)*(temp.periodDetail[index].orderScale)/100).toFixed(2);//让本期金额变化
                for(var i=0;i<temp.periodDetail.length-1;i++){//计算前n-1期的钱 和比例
                    frontMoney+=(temp.periodDetail[i].orderAmount-0);
                    frontPercent+=(temp.periodDetail[i].orderScale-0);
                }
                temp.periodDetail[temp.periodDetail.length-1].orderAmount=parseFloat(numSub((temp.submitInfo.totalAmount-0),frontMoney)).toFixed(2);//让最后一期金额变化
                temp.periodDetail[temp.periodDetail.length-1].orderScale=parseFloat(numSub(100.00,frontPercent)).toFixed(2);//让最后一期比例变化
                /*//下面是计算红色底部提示的数字
                 temp.redTipPercent=frontPercent+(temp.periodDetail[temp.periodDetail.length-1].orderScale-0);
                 temp.redTipMoney=frontMoney+(temp.periodDetail[temp.periodDetail.length-1].orderAmount-0);*/
            }else {
                popUp_auto_false(1500,'请输入0到100之间的数');
                $event.target.value='';
            }
        },
        //改变金额
        changeMoney: function ($event,index) {
            var temp=this;
            var reg3 = /\./g;
            var reg3Array = reg3.exec(temp.periodDetail[index].orderAmount);
            if (reg3Array != null) {
                var reg3Right = temp.periodDetail[index].orderAmount.substring(reg3Array.index + reg3Array[0].length);
                reg3Right = reg3Right.replace(reg3, '');
                reg3Right =  reg3Right.substring(0, 2);
                temp.periodDetail[index].orderAmount = temp.periodDetail[index].orderAmount.substring(0, reg3Array.index) + '.' + reg3Right;
            }

            var frontMoney=0,frontPercent=0;
            if(($event.target.value-0)<(temp.submitInfo.totalAmount-0)) {
                temp.periodDetail[index].orderScale = parseFloat((temp.periodDetail[index].orderAmount) / (temp.submitInfo.totalAmount - 0) * 100).toFixed(2);//让本期金额变化
                for (var i = 0; i < temp.periodDetail.length - 1; i++) {//计算前n-1期的钱 和比例
                    frontMoney += (temp.periodDetail[i].orderAmount - 0);
                    frontPercent += (temp.periodDetail[i].orderScale - 0);
                }
                temp.periodDetail[temp.periodDetail.length - 1].orderAmount = parseFloat(numSub((temp.submitInfo.totalAmount - 0), frontMoney)).toFixed(2);//让最后一期比例变化
                temp.periodDetail[temp.periodDetail.length - 1].orderScale = parseFloat(numSub(100.00, frontPercent)).toFixed(2);//让最后一期金额变化
                /* //下面是计算红色底部提示的数字
                 temp.redTipPercent=frontPercent+(temp.periodDetail[temp.periodDetail.length-1].orderScale-0);
                 temp.redTipMoney=frontMoney+(temp.periodDetail[temp.periodDetail.length-1].orderAmount-0);*/
            }else {
                popUp_auto_false(1500,'请输入0到订单总额之间的数');
                $event.target.value='';
            }
        },
        //点击重置
        resetData: function () {
            var temp = this;
            var periodNum = this.submitInfo.period;
            if (periodNum > 0 && periodNum < 13) {
                //先扩大数组用来填请求回来的参数
                temp.periodDetail = [{
                    periodCounts: 1,
                    orderScale: 50.0,
                    orderAmount: '',
                    periodPremise: 6,
                    periodPremiseDays: 0
                }, {periodCounts: 2, orderScale: 50.0, orderAmount: '', periodPremise: 6, periodPremiseDays: 0}];
                for (var j = 0; j < periodNum - 2; j++) {
                    temp.periodDetail.push({
                        periodCounts: '',
                        orderScale: '',
                        orderAmount: '',
                        periodPremise: 6,
                        periodPremiseDays: 0
                    });
                }
                temp.defaultPeriod.totalOAmount = temp.submitInfo.totalAmount;
                temp.defaultPeriod.period = temp.submitInfo.period;
                temp.defaultPeriod.calcuMethod = temp.computeFlag;
                var computePeriodData = temp.defaultPeriod;
                $.jsonAjax(getUrl("/quickor/master/periodMatcher"), computePeriodData, function (data, status, xhr) {
                    if (data.isSuccess) {
                        for (var i = 0; i < data.result.length; i++) {
                            temp.periodDetail[i].periodCounts = data.result[i].id;
                            temp.periodDetail[i].orderScale = data.result[i].scale;
                            temp.periodDetail[i].orderAmount = data.result[i].amount;
                        }
                    } else {
                        popUp_auto_false(1500, '网络错误');
                    }
                }, false);
            } else {
                popUp_auto_false(1500, '请填写正确分期');
            }
        },


    },
    beforeMount: function () {
        //获取个性化表单
        this.getPersonalityList();
        var temp=this;
        // quickor/user/queryUserInfo
        $.jsonAjax(getUrl("quickor/master/userInfo"), {}, function (data, status, xhr) {
            if(data.isSuccess){
                temp.userInfo=data.userDto;
            }else {
                popUp_auto_false(1500,'网络错误');
            }
        }, false);
        // this.userInfo=StorageUtil.getUserInfo();
        this.getSpecification();
        this.initCatagory();//初始化一级类目
        //获取一级区域地址
        this.getOneAddress();
    },
    mounted: function () {
        this.getcheckerNames();//获取审核人列表
        this.urlObj = $.getUrlJson();//获取订单id
        this.initOrderDetile();//订单详情请求过来
        mountJQueryEvent();//初始化页面原有JQuery事件
    },
    updated: function () {
        setTimeout(function () {
            if ($("#scroller").length != 0) {
                myScroll.refresh();
            }
        }, 0)
    },
    watch: {
        'invoiceInfo.provinceId': function (newvalue, oldvalue) {
            if (newvalue != 0) {
                this.twoAddressList = this.getAddresses(newvalue);
                this.threeAddressList = [];
            } else {
                this.invoiceInfo.cityId = 0;
                this.invoiceInfo.countyId = 0;
                this.twoAddressList = [];
                this.threeAddressList = [];
            }
        },
        'invoiceInfo.cityId': function (newvalue, oldvalue) {
            if (newvalue != 0) {
                this.threeAddressList = this.getAddresses(newvalue);
            } else {
                this.invoiceInfo.countyId = 0;
                this.threeAddressList = [];
            }

        },
        //观测支付信息，小于1元的订单不能延期支付
        'submitInfo.payDelay': function (newvalue , oldvalue) {
            if(newvalue==1){
                if(this.submitInfo.totalAmount<1){
                    printConfirm('小于1元的订单不能选择延期支付！');
                    this.submitInfo.payDelay=0;
                    $(".delayPayWrap").hide();
                }
            }else {  //如果选择了立即支付，就设置为 无预付款 无分期 清空支付前提  默认分期改为2
                this.prePayFlag = 0;
                this.periodFlag = 0;
                this.submitInfo.premise=6;
                this.submitInfo.premiseDays=0;
                this.submitInfo.period=2;
                this.submitInfo.prepayScale=0;

            }
        },
        'submitInfo.payMethod': function (newvalue , oldvalue) {//选择个人支付——支付方式变为立即支付
            if(newvalue==1){
                this.submitInfo.payDelay=0;
            }
        }
    }

});

function initPage() {
    refresher.init({
        id: "wrapper",
        pullDownAction: Refresh,
        pullUpAction: Load
    });
}
function Refresh() {
    setTimeout(function () {
        myScroll.refresh();
    }, 1000);
}
function Load() {
    setTimeout(function () {
        var nextPage = quickOrderVue.$data.paper.nextPage;
        var thisPage = quickOrderVue.$data.paper.page;
        if (nextPage == thisPage) {
            refresher.info.pullUpLable = "已经到底了";
        } else {
            var paramData = quickOrderVue.$data.queryGoodsParamData;
            paramData.page = nextPage;
            $.jsonAjax(getUrl("/quickor/item/queryItemSelectList"), paramData, function (data, status, xhr) {
                if (data) {
                    quickOrderVue.$data.paper = data.result.paper;
                    quickOrderVue.$data.goodsList = quickOrderVue.$data.goodsList.concat(data.result.paper.records);
                }
            }, false);
            nextPage = quickOrderVue.$data.paper.nextPage;
            thisPage = quickOrderVue.$data.paper.page;
            if (nextPage == thisPage) {
                refresher.info.pullUpLable = "已经到底了";
            }
        }
        myScroll.refresh();
    }, 1000);
}
function numSub(num1, num2) {
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(2);
};
