/**
*@fileName:10_contractManage.js
*@author:fdc
*@time:2017/4/24
*@disc:协议管理
*/
/**
 * 协议列表
 */
//全局变量
//选项卡 1 全部协议 2 协议确认 3 协议审核
var allContractType = 1;
var comfirmContractType = 2;
var approveContractType = 3;


var vm = new Vue({
    el:'#app',
    data:{
         params:"",
         allContractType : allContractType,
         comfirmContractType : comfirmContractType,
         approveContractType : approveContractType,
         //sourcePage
         sourcePage:"",
         //协议搜索框
         searchDialog:false,
         contractName:"",
         //全部协议page
         allContractList:[],
         allContractPage:1,
        //待确认page
         comfirmContractList:[],
         comfirmContractPage:1,
        //待审核page
         approveContractList:[],
         approveContractPage:1,
         //选项卡 1 全部协议 2 协议确认 3 协议审核
         queryType : 1,
         //用户信息
         userInfo:"",
        //拒绝审核弹框
         approveRejectDialog:false,
         //当前操作的协议信息
         currentContract:"",
         currentOperationType:"",
         currentReason:"",
        //计算scrollTop距离，用于回到顶部
         beginTranY:0,
         //位置
         top:0,
    },
    methods:{
        //点击协议确认，tab切换
        checkContract: function () {
            this.queryType = 2;
            $("#scroller").css("transform","translate(0px, -"+this.beginTranY+"px)");
        },
        examineContract: function () {
            this.queryType = 3;
            $("#scroller").css("transform","translate(0px, -"+this.beginTranY+"px)");
        },
        //点击协议审批，tab切换
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                    console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        //初始化setSourcePage
        setSourcePage:function(){
            this.sourcePage = this.params.sourcePage;
            if(!isNotBlank(this.sourcePage) || !("seller" == this.sourcePage || "buyer" == this.sourcePage) ){
                popUp_auto_false(1500,"sourcePage类型不正确");
                window.setInterval(function(){
                    window.history.back(-1);
                },1500);
            }
        },
        //截取字符串
        getSubText:function (text,needLeng) {
            var retText =text;
            if (text.length > needLeng) {
                retText = text.substr(0, needLeng) + '...';
            }
            return retText;
        },
        //获取全部协议
        getAllContracts:function(async){
            var temp = this;
            popUp_open();
            $.jsonAjax(getUrl("/contract/contract"),{sourcePage:temp.sourcePage,page:this.allContractPage,contractName:this.contractName},function(data,status,xhr){
                if(data.pager.records && data.pager.records.length > 0){
                    console.log(data.pager.records);
                    pushJsonArray(temp.allContractList,data.pager.records);
                }else{
                    refresher.info.pullUpLable = "已经到底了";
                    myScroll.refresh();
                }
                popUp_close();
            });
        },
        //获取待确认
        getSubmitContracts:function(){
            var temp = this;
            popUp_open();
            $.jsonAjax(getUrl("/contract/queryContractByStatus"),{sourcePage:temp.sourcePage,page:this.comfirmContractPage,queryType:3,contractName:this.contractName},function(data,status,xhr){
                if(data.result.pager.records && data.result.pager.records.length > 0){
                    pushJsonArray(temp.comfirmContractList,data.result.pager.records);
                }else{
                    refresher.info.pullUpLable = "已经到底了";
                    myScroll.refresh();
                }
                popUp_close();
            });
        },
        //获取待审核的协议
        getApproveContracts:function(){
            var temp = this;
            popUp_open();
            $.jsonAjax(getUrl("/contract/queryContractByStatus"),{sourcePage:temp.sourcePage,page:this.approveContractPage,queryType:1,contractName:this.contractName},function(data,status,xhr){
                if(data.result.pager.records && data.result.pager.records.length > 0){
                    pushJsonArray(temp.approveContractList,data.result.pager.records);
                }else{
                    refresher.info.pullUpLable = "已经到底了";
                    myScroll.refresh();
                }
                popUp_close();;
            });
        },
        //获取页面初始化列表
        getList:function(async){
            if(this.queryType == this.allContractType){
                this.getAllContracts(async);
            }else if(this.queryType == this.comfirmContractType){
                this.getSubmitContracts(async);
            }else if(this.queryType == this.approveContractType){
                this.getApproveContracts(async);
            }
        },
        //删除协议
        deleteContract:function (contract,remindMessage) {
            var temp = this;
            printConfirm(remindMessage, function () {
                $.jsonAjax(getUrl("/contract/deleteContractInfo"),{contractNo:contract.contractNo},function(data,status,xhr){
                    temp.handleResult(data);
                });
            });
        },
        //修改协议
        updateContract:function (contract) {
            window.location.href="../../html/12_maiJiaZhongXin/10_xieYiGuanLi_xieYiChuangJian.html?contractId="+contract.id+ "&sourcePage=" + this.sourcePage ;
        },
        //协议操作 approveContractInfo operationType 1 提交审批 2  审核拒绝 3 提交确认同意  4 卖家确认拒绝 5 卖家确认同意 6协议发布  10 协议终止
        ContractModify:function(contract,reason,operationType,remindMessage){
            var temp = this;
            printConfirm(remindMessage, function () {
                $.jsonAjaxPost(getUrl("/contract/contractModify"),{
                    contractNos:JSON.stringify([contract.id]),
                    operationType:operationType,
                    reason:reason,
                    sourcePage:this.sourcePage,
                },function(data,status,xhr){
                    temp.handleResult(data);
                });
            });
        },
        //协议审批
        showApproveContract:function(contract,operationType){
            this.approveRejectDialog = true;
            this.currentReason = "";
            this.currentContract = contract;
            this.currentOperationType = operationType;
        },

        //协议审批操作
        approveContract:function(){
            if(null == this.currentReason || "" == this.currentReason || this.currentReason.length == 0){
                popUp_auto_false(1500,"请输入拒绝理由！");
                return false;
            }
            var temp =this;

            $.jsonAjaxPost(getUrl("/contract/contractModify"),{
                contractNos:JSON.stringify([this.currentContract.id]),
                operationType:this.currentOperationType,
                reason:this.currentReason,
                sourcePage:this.sourcePage,
            },function(data,status,xhr){
                this.approveRejectDialog = false;
                temp.handleResult(data);
            });
        },
        //创建协议订单
        createContractOrder:function(contract){
            this.storageBrowseInfo();
            window.location.href="../../html/12_maiJiaZhongXin/10_xieYiGuanLi_CreateOrder.html?sourcePage=" + this.sourcePage + "&contractId="+ contract.id + "&contractNo=" +contract.contractNo ;

        },
        Load:function(){
            if(this.queryType == this.allContractType){
                this.allContractPage = this.allContractPage + 1;
            }else if(this.queryType == this.comfirmContractType){
                this.comfirmContractPage = this.comfirmContractPage + 1;
            }else if(this.queryType == this.approveContractPage){
                this.approveContractPage = this.approveContractPage + 1;
            }
        },
        //初始化搜索页面
        initpage:function(){
            this.allContractPage = 1;
            this.allContractList = [];
            this.comfirmContractPage = 1;
            this.comfirmContractList = [];
            this.approveContractPage = 1;
            this.approveContractList = [];
        },
        //初始化搜索条件
        initSearch:function(){
          this.contractName = "";
        },
        //handle 结果
        handleResult:function(data){
            var temp = this;
            if(data.success){
                popUp_auto(1500,"操作成功!");
                setTimeout(function () {
                    window.location.reload();
                },1500)
            }else{
                popUp_auto_false(1500,data.errorMessages);
            }
        },
        //去协议详情
        gotoContractDetail:function(contract){
            this.storageBrowseInfo();
            window.location.href="../../html/12_maiJiaZhongXin/10_xieYiGuanLi_xieYiMingXi.html?sourcePage=" + this.sourcePage + "&contractId="+ contract.id + "&contractNo=" +contract.contractNo ;
        },
        //去协议创建
        gotoCreateContract:function(){
            window.location.href="../../html/12_maiJiaZhongXin/10_xieYiGuanLi_xieYiChuangJian.html?sourcePage=" + this.sourcePage;
        },
        //保存用户已经浏览页面位置信息
        storageBrowseInfo:function(){
            var browseParam = {};
            if(this.queryType == 1){
                browseParam = {
                    sourcePage:this.sourcePage,
                    queryType:this.queryType,
                    allContractPage:this.allContractPage,
                    top: scrollerTranY(),
                },
                StorageUtil.setItem("allContractList",this.allContractList);
                StorageUtil.setItem("browseParam",browseParam);
            }else if(this.queryType == 2){
                browseParam = {
                    sourcePage:this.sourcePage,
                    queryType:this.queryType,
                    allContractPage:this.comfirmContractPage,
                    top: $(window).scrollTop(),
                },
                StorageUtil.setItem("allContractList",this.comfirmContractList);
                StorageUtil.setItem("browseParam",browseParam);
            }else{
                browseParam = {
                    sourcePage:this.sourcePage,
                    queryType:this.queryType,
                    allContractPage:this.approveContractPage,
                    top: $(window).scrollTop(),
                },
                StorageUtil.setItem("allContractList",this.approveContractList);
                StorageUtil.setItem("browseParam",browseParam);
            }

        },
        //浏览器返回时应该首选从缓存中获取
        getBrowseInfoFromStorage:function(){
           var browseParam = StorageUtil.getItem("browseParam");
           if(isNotBlank(browseParam)) {//说明是通过浏览器返回按钮
               //获取缓存数据
                this.queryType = browseParam.queryType;//tab
                this.sourcePage = browseParam.sourcePage;//sourcePage
               // document.body.scrollTop = browseParam.top;//浏览位置
                this.top= browseParam.top;
                if(this.queryType == 1){
                    this.allContractPage = browseParam.allContractPage;//分页信息
                    this.allContractList = StorageUtil.getItem("allContractList");
                }else if(this.queryType == 2){
                    this.allContractPage = browseParam.allContractPage;//分页信息
                    this.allContractList = StorageUtil.getItem("comfirmContractList");
                }else{
                    this.allContractPage = browseParam.allContractPage;//分页信息
                    this.allContractList = StorageUtil.getItem("approveContractList");
                }
               //清除缓存数据
               StorageUtil.removeItem("browseParam");
               StorageUtil.removeItem("allContractList");
               StorageUtil.removeItem("comfirmContractList");
               StorageUtil.removeItem("approveContractList");

               return true;

           }else{
               return false;
           }

        }

    },
    computed:{

    },
    beforeMount:function(){
        if(this.getBrowseInfoFromStorage()){
            this.getUserInfo();
        }else{
            //获取浏览器参数
            this.params = $.getUrlJson();
            //初始化setSourcePage
            this.setSourcePage();
            this.getUserInfo();
            //获取协议信息
            this.getList();
        }

    },
    mounted:function () {
        //初始化上拉刷新
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: this.Load,
        });
        if(isNotBlank(this.top) && this.top != 0){
            scrollerTo(this.top);
        }
        this.beginTranY=document.getElementById('pullDown').offsetHeight;
    },
    updated:function(){
        myScroll.refresh();
    },
    watch:{
        queryType:function(newValue,oldValue){
            this.initpage();
            this.initSearch();
            this.getList();
        },
        allContractPage:function(newValue,oldValue){
            this.getList();
        },
        comfirmContractPage:function(newValue,oldValue){
            this.getList();
        },
        approveContractPage:function(newValue,oldValue){
            this.getList();
        }
    }
});





function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 2000);
}







