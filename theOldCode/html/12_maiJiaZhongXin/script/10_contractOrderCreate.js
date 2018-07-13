/**
*@fileName:10_contractInfo.js
*@author:fdc
*@time:2017/4/28
*@disc:协议明细
*/

//ws缓存
var wsCache = new WebStorageCache({
    // [可选] 'localStorage', 'sessionStorage', window.localStorage, window.sessionStorage
    //        或者其他实现了 [Storage API] 的storage实例.
    //        默认 'localStorage'.
    storage: 'localStorage',
    // [可选]  类型Number，公共超时事件设置。默认无限大
    exp: Infinity
});


//var wsKey = uid　 + skuId;

var contractInfo = new Vue({
    el:"#contractInfo",
    mixins:[math,itemUnit],
    data:{
        //浏览器参数
        serverUrl: server_url,
        imgUrl: img_url,
        params:"",
        contractId:"",
        contractInfo:{
            contract:"",
            publishedBy:"",
            approveBy:"",
            contractPayment:"",
            contractUrlShowList:"",
            seller:"",
            statusMap:"",
            buyer:"",
            //已经购物的数量或者价值
            countCostList:[],
        },
    },
    methods:{
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
            this.sourcePage = this.params.sourcePage;
            this.contractId = this.params.contractId;
            if(!isNotBlank(this.sourcePage) || !("seller" == this.sourcePage || "buyer" == this.sourcePage) ){
                popUp_auto_false(1500,"sourcePage类型不正确！");
                window.setInterval(function(){
                    window.history.back(-1);
                },1500);
            }
            if(!isNotBlank(this.contractId)){
                popUp_auto_false(1500,"contractId不能为空！");
                window.setInterval(function(){
                    window.history.back(-1);
                },1500);
            }
        },
        //获取协议信息
        getContractInfo:function(){
            var temp  = this;
            $.jsonAjax(getUrl("/contract/contractOrder"),{contractId:this.contractId},function(data,status,xhr){
                console.log(data);
                if(data.success){
                    temp.contractInfo  = data.result;
                }else{
                    popUp_auto_false(3000,data.errorMessages);
                }
            });
        },
        //校验库存
        checkSkuInventory:function(event,contractMat){
            var skuInventory = contractMat.inventory;
            var tmp  = parseFloat($(event.currentTarget).val());
            var skuInventory = parseFloat(skuInventory);
            if(tmp > skuInventory){
                popUp_auto_false(1500,"不能超过最大库存!");
                $(event.currentTarget).val(skuInventory);
                contractMat.quantity = skuInventory;
            }
        },
        //协议为总数量的时候校验总数量
        checkNumber:function(event,contractMat){
            var number = contractMat.number;
            var tmp  = parseInt($(event.currentTarget).val());
            var skuInventory = parseInt(number);
            if(tmp > number){
                popUp_auto_false(1500,"不能超过协议数量!");
                $(event.currentTarget).val(number);
                contractMat.quantity = number;
            }
        },
        //协议为总价值的时候校验总价值的库存
        checkCost:function(event,contractMat){
            var matPrice = contractMat.matPrice;
            var cost = contractMat.cost;
            var tmp  = parseInt($(event.currentTarget).val());
            var matPrice = parseFloat(matPrice);
            var cost = parseFloat(cost);
            var result = parseInt(cost/matPrice);
            if(tmp > result){
                popUp_auto_false(1500,"不能超过协议数量!");
                $(event.currentTarget).val(result);
                contractMat.quantity = result;
            }
        },
        //协议选中条目
        checkedContractMat:function(contractMat){
            Vue.set(contractMat,"checked",!Boolean(contractMat.checked));
        },
        //得到选中的条目
        submitContractMats:function(){
            var temp = this;
            //提交结果
            var result = [];
            var mats =  this.contractInfo.contract.contractMatDTOs;
            var checkeCount = 0;
            var valid  = true;
            var validMessage = "";
            $.each(mats,function(index,ele){
                if(ele.checked){
                    //校验空
                    if(!isNotBlank(ele.quantity)){
                        validMessage = validMessage +　"第"+ (index + 1) + "条合同物品数量不能为空！";
                        valid = false;
                        return false;
                    }
                    //校验已经超过总数量或者总价值
                    if(temp.contractInfo.countCostList && temp.contractInfo.countCostList.length > 0){
                        $.each(temp.contractInfo.countCostList,function(index,itemCost){
                            if(itemCost.skuId == ele.matCd){
                                if(temp.contractInfo.contract.protocolType == 2){
                                    var tempnumber = parseFloat(itemCost.number);
                                    var totalnumber = parseFloat(ele.number);
                                    var tempquantity =  parseFloat(ele.quantity);
                                    if(tempquantity >(totalnumber - tempnumber)){
                                        validMessage = validMessage +　"第"+ (index + 1) + "条合同物品不能超过购买数量！";
                                    }
                                    valid = false;
                                    return false;
                                }

                                if(temp.contractInfo.contract.protocolType == 3){
                                    var temppay = parseFloat(itemCost.pay);
                                    var tempquantity =  parseFloat(ele.quantity);
                                    var tempprice = parseFloat(ele.matPrice);
                                    var totalPrice = parseFloat(ele.cost);
                                    if((tempquantity * tempprice) > (totalPrice - temppay)){
                                        validMessage = validMessage +　"第"+ (index + 1) + "条合同物品不能超过购买总价值！";
                                    }
                                    valid = false;
                                    return false;
                                }
                            }
                        });

                        if(!valid){
                            return false;
                        }
                    }
                    checkeCount++;
                    result.push({matId:ele.id,quantity:ele.quantity});
                }
            })
            if(!valid){
                popUp_auto_false(1500,validMessage );
                return false;
            }
            if(checkeCount == 0){
                popUp_auto_false(1500,"请您先选择一个合同物品!" );
                return false;
            }
            return result;
        },
        //去订单核对页
        gotoOrderView :function(){
            var contracts = this.submitContractMats();
            var temp = this;
            if(contracts){
                $.jsonAjaxPost(getUrl("/contract/orderItem"),{"jsonProducts": JSON.stringify(contracts)},function(data,status,xhr){
                    if(data.success){
                        window.location.href = "../../html/16_dingDanHeDui/dingDanHeDui.html?contractNo=" + temp.contractInfo.contract.contractNo + "&orderType=1";
                    }else{
                        popUp_auto_false(1500,data.errorMessages);
                    }
                });
            }
        }
    },
    computed:{

    },
    beforeMount:function(){
        //获取浏览器参数
        this.params = $.getUrlJson();
        //初始化setSourcePage
        this.setSourcePage();
        //获取协议信息
        this.getContractInfo();
    },
    mounted:function(){

    },
    watch:{

    }
});