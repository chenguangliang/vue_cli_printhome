/**
*@fileName:10_contractCreate.js
*@author:fdc
*@time:2017/4/24
*@disc:协议创建
*/
//可视窗口的高度------下拉列表下一页
var scrollTop = 0;
var scrollBottom = 0;
$(document).scroll(function(){
    var dch = getClientHeight();
    scrollTop = getScrollTop();
    scrollBottom = document.body.scrollHeight - scrollTop;
    if(scrollBottom >= dch && scrollBottom <= (dch+10)){
        vm.queryItemLoad();
    }
});


//获取窗口可视范围的高度
function getClientHeight(){
    var clientHeight=0;
    if(document.body.clientHeight&&document.documentElement.clientHeight){
        clientHeight=(document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
    }else{
        clientHeight=(document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
    }
    return clientHeight;
}

function getScrollTop(){
    var scrollTop=0;
    scrollTop=(document.body.scrollTop>document.documentElement.scrollTop)?document.body.scrollTop:document.documentElement.scrollTop;
    return scrollTop;
}












function startUpload(fileElementId){

    if(isNotBlank($("#"+fileElementId).val())){
        StorageUtil.setItem("tempFileVal",$("#annex").val());
        popUp_open();
        var temp = vm.$data;
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
                    Vue.set(temp.contract.uploadAnnex,fileElementId+'',data.result.url);
                    var fileName = StorageUtil.getItemBytpe("tempFileVal",valueTypeObject);
                    var  arr = fileName.split(/[\\/]/);
                    Vue.set(temp.contract.uploadAnnex,fileElementId+'Name', arr[arr.length - 1]);
                    Vue.set(temp.contract.uploadAnnex,'updateFlag', false);
                    popUp_auto(1000,"上传成功!");
                }else{
                    popUp_auto_false(1500,data.errorMessages);
                }

            },
            error: function (data, status, e){//服务器响应失败处理函数
                console.log(data)
            }
        });
    }
}



var vm = new Vue({
    el:'#createContract',
    mixins:[math,itemUnit],
    data:{
        serverUrl: server_url,
        imgUrl: img_url,
        params:{
            contractNo:"",
        },
        userInfo:"",
        contract:{
            //协议
            contractInfo :{
                contractNo : null,
                contractOrderNo : null,//协议编号
                contractName : null,//协议名称
                printerId : null,//买方id
                createBy : null,//创建人
                supplierId : null,//卖方id
                beginDate : null,//协议开始时间
                endDate : null,//协议结束时间
                approveBy : "",//审批人
                protocolType : 1,//协议类型
                fileNameAll:null,
                remark : null,//备注
                status : null // 状态
            },
            //合同物品 number cost
            contractMatDTOs:[],

            //合同账期
            contractPaymentTerm:{
                paymentType : 0,//账期类型
                paymentDays1: "",//协议账期
                paymentDays2: "",//协议账期
                paymentDays: "",//协议账期
            },
            sourcePage :"",
            //附件
            uploadAnnex : {
                annex:"",
                annexName:"",
                //附件修改标志
                updateFlag:false,
            },
            //修改时删除的mat
            removeMats:[],
        },
        //以上是要提交的
        seller:{
            uid:"",
            uname:"",
            linkMan :"",
            userMobile : "",
            linkPhoneNum : "",
            userEmail:""
        },
        buyer:{
            uid:"",
            uname:"",
            linkMan :"",
            userMobile : "",
            linkPhoneNum : "",
            userEmail:""
        },
        //第一步div
        oneStepDiv:true,
        //第2步div
        twoStepDiv:false,
        //第3步div
        threeStepDiv:false,
        //选择卖家弹框
        companyDialog:false,
        //选择卖家/买家分页page
        queryShopOrUserPage:0,
        //卖家买家公司名字
        queryShopOrUserName:"",
        //查询平台id
        queryCompanyPlatformId:"",
        //店铺买家列表
        queryShopList:[],
        //选中店铺或者用户信息
        checkedShopOrUserInfo:"",

        //需要审核 0 不需要 1 需要
        needApprove:0,
        /*商品弹框*/
        goodsDialog:false,
        queryGoodKeywords:"",
        queryGoodAttrs:"",
        queryGoodPage:0,
        queryShopId:"",
        itemList:[],
        //提交报错信息
        errorMSG:"",
        serverTime:''


    },
    methods:{
    	goToTop:goToTop,
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                    // console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        //初始化setSourcePage
        setSourcePage:function(){
            this.contract.sourcePage = this.params.sourcePage;
            if(!isNotBlank(this.contract.sourcePage) || !("seller" == this.contract.sourcePage || "buyer" == this.contract.sourcePage) ){
                popUp_auto_false(1500,"sourcePage类型不正确");
                window.setInterval(function(){
                    window.history.back(-1);
                },1500);
            }
        },
        //获取创建数据
        getCreateInfo:function(){
            var temp = this;
            $.jsonAjax(getUrl("/contract/contractCreate"),{sourcePage:temp.contract.sourcePage,page:1},function(data,status,xhr){
                console.log(data);
                if(temp.contract.sourcePage == 'buyer'){
                    temp.contract.contractInfo.printerId=data.userDTO.uid;
                    temp.contract.contractInfo.createBy=data.userDTO.uid;
                    temp.contract.showApproveList=data.showApproveList;
                    temp.buyer = data.userDTO;
                }else{
                    temp.queryShopId = data.userDTO.shopId;
                    temp.contract.contractInfo.supplierId=data.userDTO.uid;
                    temp.contract.contractInfo.createBy=data.userDTO.uid;
                    temp.contract.showApproveList=data.showApproveList;
                    temp.seller = data.userDTO;
                }
            },false);
        },
        //获取修改数据
        getUpdateContractData:function(contractId){
            var temp = this;
            $.jsonAjax(getUrl("/contract/toContractUpdate"),{sourcePage:temp.contract.sourcePage,contractId:contractId},function(data,status,xhr){
                 console.log(data);
                if(data.success){
                    //协议基本信息
                    temp.contract.contractInfo = data.result.contractInfo;
                    //协议审批列表
                    temp.contract.showApproveList=data.result.showApproveList;
                    //格式化时间
                    var formatData = Vue.filter('timestampFormat');
                    temp.contract.contractInfo.beginDate = formatData(temp.contract.contractInfo.beginDate,'YYYY-MM-DD');
                    temp.contract.contractInfo.endDate = formatData(temp.contract.contractInfo.endDate,'YYYY-MM-DD');
                    //协议商品查询店铺
                    temp.queryShopId = data.result.seller.shopId;
                    //协议商品
                    temp.putContractMatDTOs(data.result.contractMat.result.rows);
                    temp.contract.removeMats = JSON.parse(JSON.stringify(data.result.contractMat.result.rows));
                    //协议账期
                    temp.contract.contractPaymentTerm = data.result.contractPaymentTerm;
                    if(temp.contract.contractPaymentTerm.paymentType == 0){
                        Vue.set(temp.contract.contractPaymentTerm,"paymentDays1",temp.contract.contractPaymentTerm.paymentDays) ;
                    }else{
                        Vue.set(temp.contract.contractPaymentTerm,"paymentDays2",temp.contract.contractPaymentTerm.paymentDays) ;
                    }
                    //协议审批
                    if(isNotBlank(data.result.contractInfo.approveBy)){
                        temp.needApprove = 1;
                    }else{
                        temp.needApprove = 0;
                    }
                    //协议附件
                    if(data.result.contractUrlShowList && data.result.contractUrlShowList.length > 0){
                        Vue.set(temp.contract.uploadAnnex,"annex",data.result.contractUrlShowList[0].imgUrl);
                        Vue.set(temp.contract.uploadAnnex,"annexName",data.result.contractUrlShowList[0].oldFileName);
                        Vue.set(temp.contract.uploadAnnex,"updateFlag",true);
                    }
                    //买方
                    temp.buyer = data.result.user;
                    temp.seller = data.result.seller;
                }else{
                    popUp_auto_false(3000,data.errorMessages);
                    var result = "window.location.href='../../html/12_maiJiaZhongXin/10_xieYiGuanLi_xieYiGuanLi.html?sourcePage="+this.contract.sourcePage+"'";
                    window.setInterval(result,3000);
                }
            },false);
        },
        //初始化创建数据
        initCreateInfo:function(){
            if(this.params.contractId){
                this.getUpdateContractData(this.params.contractId)
            }else{
                this.getCreateInfo();
            }
        },
        //修改初始化数据
        putContractMatDTOs:function(rows){
            var temp = this;
            if(rows.length > 0){
                $.each(rows,function(matIndex,item){
                    temp.contract.contractMatDTOs.push({
                        itemSkuId:item.skuId,
                        itemCid:item.cid,
                        salerAttr:item.salerAttr,
                        itemPrice:item.skuPrice,
                        itemSkuInventory:item.skuInventory,
                        //商品名称
                        contractOrderNo:temp.contract.contractInfo.contractOrderNo,
                        //商品名称
                        itemName:item.itemName,
                        //skuId
                        matCd:item.matCd,
                        //单价
                        matPrice:item.matPrice,
                        //协议类型
                        protocolType:temp.contract.contractInfo.protocolType,
                        //协议数量
                        number:item.number,
                        //协议cost
                        cost:item.cost,
                    });
                });
            }
        },
        //删除商品数据
        deleteItems:function (contractMat) {
            var contractMatDTOs = this.contract.contractMatDTOs;
            for(key in contractMatDTOs){
                if(contractMatDTOs[key].itemSkuId == contractMat.itemSkuId){
                    contractMatDTOs.splice(key,1);
                    break;
                }
            }
            for(key in this.itemList){
                if(this.itemList[key].skuId == contractMat.itemSkuId){
                    this.itemList[key].checked = false;
                    this.itemList[key].existMatFlag = false;
                    break;
                }
            }
        },
        //查询店铺或者买家列表
        queryshopList:function (page){
            var queryPage = 1;
            var temp =this;
            popUp_open();
            if(isNotBlank(page)){
                queryPage = page;
            }else{
                queryPage = this.queryShopOrUserPage;
            }
            //根绝sourcepage判断查询店铺还是查询买家
            var uType = this.contract.sourcePage == 'buyer' ? "3" : "2";
            $.jsonAjax(getUrl("/contract/getSellerBuyerDetail"),{uType:uType,page:queryPage,platformIds:this.queryCompanyPlatformId,company:this.queryShopOrUserName},function(data,status,xhr){
                if(queryPage == 1){
                    temp.queryShopList = [];
                }
                if(data.pager.records && data.pager.records.length > 0){
                    pushJsonArray(temp.queryShopList,data.pager.records);
                }else{
                    refresher.info.pullUpLable = "已经到底了";
                    myScroll.refresh();
                }
                popUp_close();
            },false);
        },
        //分页下拉加载
        queryShopLoad:function(){
            this.queryShopOrUserPage = this.queryShopOrUserPage + 1;
        },
        //分页下拉加载
        queryItemLoad:function(){
            this.queryGoodPage = this.queryGoodPage + 1;
        },
        //店铺列表单选框
        checkedShop:function(queryCompanyList,shop){
            var temp  = this ;
            $.each(queryCompanyList,function(index,indexCompany){
                if(shop == indexCompany){
                    temp.checkedShopOrUserInfo = indexCompany ;
                    Vue.set(indexCompany,"checked",true);
                }else{
                    Vue.set(indexCompany,"checked",false);
                }
            });
        },
        //选择店铺确定按钮
        addSellerOrBuyerCompany:function(){
           if(isNotBlank(this.checkedShopOrUserInfo)){
               if(this.contract.sourcePage == 'buyer'){
                   if(this.queryShopId != this.checkedShopOrUserInfo.shopId){
                       this.queryShopId = this.checkedShopOrUserInfo.shopId;
                       this.contract.contractInfo.supplierId = this.checkedShopOrUserInfo.uid;
                       this.seller.uid =  this.checkedShopOrUserInfo.uid;
                       this.seller.uname = this.checkedShopOrUserInfo.uname;
                       this.seller.companyName = this.checkedShopOrUserInfo.companyName;
                       this.seller.linkMan = this.checkedShopOrUserInfo.linkMan;
                       this.seller.umobile =this.checkedShopOrUserInfo.umobile;
                       this.seller.linkPhoneNum = this.checkedShopOrUserInfo.linkPhoneNum;
                       this.seller.userEmail = this.checkedShopOrUserInfo.userEmail;
                       //如果是买家那么重新选择卖家之后需要将列表置为空
                       this.clearQueryItemShopInfo();
                   }
               }else{
                   if(this.contract.contractInfo.printerId != this.checkedShopOrUserInfo.uid){
                       this.contract.contractInfo.printerId = this.checkedShopOrUserInfo.uid;
                       this.buyer.uid =  this.checkedShopOrUserInfo.uid;
                       this.buyer.uname = this.checkedShopOrUserInfo.uname;
                       this.buyer.companyName = this.checkedShopOrUserInfo.companyName;
                       this.buyer.linkMan = this.checkedShopOrUserInfo.linkMan;
                       this.buyer.umobile =this.checkedShopOrUserInfo.umobile;
                       this.buyer.linkPhoneNum = this.checkedShopOrUserInfo.linkPhoneNum;
                       this.buyer.userEmail = this.checkedShopOrUserInfo.userEmail;
                   }
               }
               //第一步div
               this.oneStepDiv = true;
               //选择卖家弹框
               this.companyDialog = false;
           }else{
               popUp_auto_false(1500,"请先选择公司!");
           }
        },
        //第一步到第二部
        oneToTwo:function(){
            if(!isNotBlank(this.contract.contractInfo.contractOrderNo)){
                popUp_auto_false(1500,"协议编号不能为空");
                return;
            }

            if(!isNotBlank(this.contract.contractInfo.contractName)){
                popUp_auto_false(1500,"协议名称不能为空");
                return;
            }
            if(!isNotBlank(this.contract.contractInfo.supplierId)){
                popUp_auto_false(1500,"请选择供应商!");
                return;
            }
            this.twoStepDiv = true;
            this.oneStepDiv = false;
        },
        //第二步到第三步
        twoToThree:function(){
            if(!isNotBlank(this.contract.contractInfo.beginDate)){
                popUp_auto_false(1500,"协议开始时间不能为空!");
                return;
            }
            if(!isNotBlank(this.contract.contractInfo.endDate)){
                popUp_auto_false(1500,"协议终止时间不能为空!");
                return;
            }
            if(this.contract.contractPaymentTerm.paymentType == 0){
                if(!isNotBlank(this.contract.contractPaymentTerm.paymentDays1)){
                    popUp_auto_false(1500,"协议账期不能为空");
                    return;
                }
            }else{
                if(!isNotBlank(this.contract.contractPaymentTerm.paymentDays2)){
                    popUp_auto_false(1500,"协议账期不能为空");
                    return;
                }
            }
            if(this.needApprove == 1){
                if(!isNotBlank(this.contract.contractInfo.approveBy)){
                    popUp_auto_false(1500,"需要审核必须选择审批人！");
                    return;
                }
            }
            this.twoStepDiv = false;
            this.threeStepDiv = true;
        },
        //查询商品列表
        queryItemList:function(page){
            popUp_open();
            var queryPage = 1;
            var temp =this;

            if(isNotBlank(page)){
                queryPage = page;
            }else{
                queryPage = this.queryGoodPage;
            }
            $.jsonAjax(getUrl("/contract/searchItem"),{shopId:this.queryShopId,page:queryPage,keyword:this.queryGoodKeywords,attributes:this.queryGoodAttrs},function(data,status,xhr){
                if(queryPage == 1){
                    temp.itemList = [];
                }
                if(data.pager.records && data.pager.records.length > 0){
                    pushJsonArray(temp.itemList,data.pager.records);
                }
                if(temp.itemList.length > 0){
                    $.each(temp.itemList,function(index,ele){
                        if(temp.contract.contractMatDTOs.length > 0){
                            $.each(temp.contract.contractMatDTOs,function(cindex,cele){
                                if(cele.matCd == ele.skuId){
                                    Vue.set(ele,'checked',true);
                                    Vue.set(ele,"existMatFlag",true);
                                    return false;
                                }
                            });
                        }
                    });
                }
                popUp_close();
            },false);
        },
        //新增商品
        addItems :function(){
            this.threeStepDiv =! this.threeStepDiv;
            this.goodsDialog = !this.goodsDialog;
            this.queryGoodPage == 0 ? this.queryGoodPage = 1:'';
        },
        //设置选中状态
        setItemChecked:function(item){
            Vue.set(item,"checked",!item.checked);
        },
        //获取选中的商品
        getCheckedItems:function(){
            var temp = this;
            $.each(this.itemList,function(itemIndex,item){
                if(item.checked && !item.existMatFlag){
                    temp.contract.contractMatDTOs.push({
                        itemSkuId:item.skuId,
                        itemCid:item.cid,
                        salerAttr:item.skuAttributeStr,
                        itemPrice:item.skuPrice,
                        itemSkuInventory:item.skuInventory,
                        //商品名称
                        contractOrderNo:temp.contract.contractInfo.contractOrderNo,
                        //商品名称
                        itemName:item.itemName,
                        //skuId
                        matCd:item.skuId,
                        //单价
                        matPrice:item.skuPrice,
                        //协议类型
                        protocolType:temp.contract.contractInfo.protocolType,
                        //协议数量
                        number:null,
                        //协议cost
                        cost:null,
                    });
                    Vue.set(item,"existMatFlag",true);
                }
            });
        },
        //判断查询itemlist里是否存在mats里边
        judgeExistItem:function(skuId){
            var exist = false;
            $.each(this.contract.contractMatDTOs,function(cindex,cele){
                if(cele.skuId == skuId){
                    exist =  true;
                    return false;
                }
            });
            return exist;
        },
        //校验商品的库存
        checkCount:function(event,contract){
            var skuInventory = contract.itemSkuInventory;
            var cost = contract.cost;
            var matPrice = contract.matPrice;
            var skuInventory  = parseFloat(skuInventory);
            var matPrice = parseFloat(matPrice);
            var cost = parseFloat(cost);
            var result = parseFloat(cost/matPrice);
            if(cost > 0 &&　matPrice > 0 && skuInventory < result){
                console.log('不能超过总库存');
                popUp_auto_false(1000,"不能超过总库存");
                if($(event.currentTarget).attr("name") == "cost"){
                    $(event.currentTarget).val((matPrice * skuInventory).toFixed(2));
                }
                if($(event.currentTarget).attr("name") == "matPrice"){
                    $(event.currentTarget).val((cost / skuInventory).toFixed(2));
                }
            }
        },
        //校验库存
        checkSkuInventory:function(event,contract){
            var skuInventory = contract.itemSkuInventory;
            var tmp  = parseFloat(contract.number);
            var skuInventory = parseFloat(skuInventory);
            if(tmp > skuInventory){
                popUp_auto_false(1000,"不能超过总库存");
                $(event.currentTarget).val(skuInventory);
            }
        },
        //校验协议商品必填 mats  协议商品   protocolType 协议类型
        checkMatRequire:function(mats,protocolType){
            var temp = this;
            //协议错误标志
            var errorFlag = false;
            $.each(mats,function(matindex,matele){
                if(!isNotBlank(matele.matPrice)){
                    temp.errorMSG = "第" + (matindex + 1) + "行，单价不能为空!";
                    errorFlag = true;
                    return false;
                }
                if(protocolType == "2"){
                    if(!isNotBlank(matele.number)){
                        temp.errorMSG = "第" + (matindex + 1) + "行，总数量不能为空!";
                        errorFlag = true;
                        return false;
                    }
                }
                if(protocolType == "3"){
                    if(!isNotBlank(matele.cost)){
                        temp.errorMSG = "第" + (matindex + 1) + "行，单价值不能为空!";
                        errorFlag = true;
                        return false;
                    }
                }
            });
            return errorFlag;

        },
        //cancelContract取消跳转查询页面
        cancelContract:function(){
            var that=this;
            printConfirm("确认要放弃编辑的数据吗？", function () {
                window.location.href='../../html/12_maiJiaZhongXin/10_xieYiGuanLi_xieYiGuanLi.html?sourcePage='+that.contract.sourcePage;
            });
        },
        //发布成功的跳转
        publishContract:function(){
            var that=this;
                window.location.href='../../html/12_maiJiaZhongXin/10_xieYiGuanLi_xieYiGuanLi.html?sourcePage='+that.contract.sourcePage;
        },
        //协议类型改变时清空所有选中
        clearQueryItemShopInfo:function(){
            this.itemList = [];
            this.contract.contractMatDTOs = [];
        },
        //协议提交
        contractSubmit:function(status){
            var temp = this;
            //协议
            if(this.contract.contractPaymentTerm.paymentType == 0){
                this.contract.contractPaymentTerm.paymentDays = this.contract.contractPaymentTerm.paymentDays1;
            }else{
                this.contract.contractPaymentTerm.paymentDays = this.contract.contractPaymentTerm.paymentDays2;
            }
            //协议状态
            //协议修改不修改状态,协议创建需要修改状态
            //修改时
            if(isNotBlank(this.contract.contractInfo.id)){
                if(status == 3){//立即发布
                    //有审批人变为待审批  没有审批人变为待确认
                    if(this.needApprove != 1){
                        this.contract.contractInfo.status = 3;
                        this.contract.contractInfo.approveBy = "";
                    }else{
                        this.contract.contractInfo.status = 7;
                    }
                }else{//保存按钮
                    //有审批人 变为需要审批状态
                    if(isNotBlank(this.contract.contractInfo.approveBy) && this.needApprove == 1){
                        this.contract.contractInfo.status = 7;
                    }else{
                        this.contract.contractInfo.approveBy = "";
                        this.contract.contractInfo.status = 0;
                    }
                }
            }else{//新增时
                if(status == 3){
                    //有审批人 变为需要审批
                    if(isNotBlank(this.contract.contractInfo.approveBy)){
                        this.contract.contractInfo.status = 7;
                    }
                }else{
                    this.contract.contractInfo.status = 0;
                }
            }
            //校验是否选择商品
            if(this.contract.contractMatDTOs.length < 1){
                popUp_auto_false(1000,"请先选择商品!");
                return;
            }
            //校验选中商品后是否填写单价，总数量，总价值
            var checkresult = this.checkMatRequire(this.contract.contractMatDTOs,this.contract.contractInfo.protocolType);
            if(checkresult){
               popUp_auto_false(1500,this.errorMSG);
                return false;
            }
            console.log(this.contract);
            popUp_open();
            $.jsonAjaxPost(getUrl(this.submitUrl),
                {contractInfo:JSON.stringify(this.contract.contractInfo),
                    contractMatDTOs:JSON.stringify(this.contract.contractMatDTOs),
                    contractPaymentTerm:JSON.stringify(this.contract.contractPaymentTerm),
                    annex:JSON.stringify(this.contract.uploadAnnex),
                    sourcePage:this.contract.sourcePage,
                    removeMat:JSON.stringify(this.removeMatIds),
                    needApprove:this.needApprove},
                function(data,status,xhr){
                    popUp_close();
                    if(data.success){
                        temp.publishContract();
                    }else{
                        popUp_auto_false(1500,data.errorMessages);
                    }
                },false);
        },
    },
    computed:{
        //移除的id
        removeMatIds:function(){
            var temp = this;
            var returnArr =  [] ;
            var existArr = [];
            var sourceMat = temp.contract.removeMats;
            var currentMat = temp.contract.contractMatDTOs;
            $.each(sourceMat,function(sourceIndex,sourceEle){
                var existFlag = false;
                $.each(currentMat,function(currentIndex,currentEle){
                    if(currentEle.matCd == sourceEle.matCd){
                        existFlag = true;
                        return false;
                    }
                });
                if(!existFlag){
                    returnArr.push(sourceEle.id);
                }
            });
            return returnArr;
        },
        //获取提交url
        submitUrl:function(){
            if(isNotBlank(this.contract.contractInfo.contractNo)){
                return "/contract/contractUpdate";
            }else{
                return "/contract/immediatelyup";
            }
        },
    },
    beforeMount:function(){
        //获取浏览器参数
        this.params = $.getUrlJson();
        //初始化setSourcePage
        this.setSourcePage();
        //获取用户信息
        this.getUserInfo();
        //初始化创建数据
        this.initCreateInfo();
    },
    mounted:function () {
        //myScroll.refresh();
            refresher.init({
                id: "wrapper",
                pullDownAction: Refresh,
                pullUpAction: this.queryShopLoad
            });


        //格式化时间
        var date = new Date($.ajax({async: false}).getResponseHeader("Date"));
        var bom= date + (3600000 * 8);
        var time = new Date(bom);
        var formatData = Vue.filter('timestampFormat');
        this.serverTime = formatData(time,'YYYY-MM-DD');
    },
    updated:function () {
        myScroll.refresh();
    },
    watch:{
        queryShopOrUserPage:function(newValue,oldValue){
             this.queryshopList();
        },
        queryGoodPage:function(newValue,oldValue){
            this.queryItemList();
        },
        //协议类型改变时清空所有选中 由于修改上来加载会改变值出现数据错误
       /* 'contract.contractInfo.protocolType':function(newValue,oldValue){
            if(! (newValue+"" == oldValue + "")){
                this.itemList = [];
                this.contract.contractMatDTOs = [];
            }
        },*/
        //删除附件删除按钮变空
        'contract.uploadAnnex.annex':function(newValue,oldValue){
            if(!isNotBlank(newValue)){
                $("#annex").val("");
            }
        },
    }
});




function Refresh() {
        setTimeout(function () {
            myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    },1500);
}
