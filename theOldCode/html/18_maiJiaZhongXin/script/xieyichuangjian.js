var shopIdk = 0;
var mydata;
var js_beginDate;
var js_endDate;
var js_contractNos;
$(function(){
    //sourcePage=seller
    $.jsonAjax(getUrl("contractCreate"),{sourcePage:"seller",page:1},function(data,status,xhr){
        vm.$data.xieyi.contractInfo.supplierId=data.userDTO.uid;
        vm.$data.xieyi.contractInfo.createBy=data.userDTO.uid;
        vm.$data.xieyi.supplier_name=data.userDTO.companyName;
        vm.$data.xieyi.supplier_contacts=data.userDTO.linkMan;
        vm.$data.xieyi.supplier_mail_box=data.userDTO.userEmail;
        vm.$data.xieyi.showApproveList=data.showApproveList;

        shopIdk = data.showApproveList.shopId;
    },false);

    var contractNos = $.getUrlParam("contractNos");
    js_contractNos = contractNos;
    if(contractNos != undefined && contractNos != null && contractNos != ""){
        // $("#lijifubujs").attr("display","none");
        $("#lijifubujs").removeAttr("onclick");


        $.jsonAjax(getUrl("toContractUpdate"),{contractId:contractNos,sourcePage:"seller"},function(data,status,xhr){

            vm.$data.xieyi.contractInfo.contractNo = data.contractInfo.contractNo;
            vm.$data.xieyi.contractInfo.contractOrderNo = data.contractInfo.contractOrderNo;
            vm.$data.xieyi.contractInfo.contractName = data.contractInfo.contractName;
            vm.$data.xieyi.contractInfo.remark = data.contractInfo.remark;
            vm.$data.xieyi.contractInfo.annex = data.contractInfo.annex;
            vm.$data.xieyi.contractInfo.status = data.contractInfo.status;
            vm.$data.xieyi.contractInfo.createBy = data.contractInfo.createBy;
            vm.$data.xieyi.contractInfo.printerId = data.contractInfo.printerId;


            vm.$data.xieyi.contractInfo.beginDate = data.contractInfo.beginDate;
            vm.$data.xieyi.contractInfo.endDate = data.contractInfo.endDate;

            js_beginDate = data.contractInfo.beginDate;
            js_endDate = data.contractInfo.endDate;
            //协议账期
            // vm.$data.xieyi.contractInfo.paymentDays = data.paymentTermDTO.paymentDays;
            vm.$data.xieyi.contractInfo.paymentType = data.paymentTermDTO.paymentType;
            if(data.paymentTermDTO.paymentType == 0){
                $("#zhangqi001").removeAttr("disabled");
                $("#zhangqi001").val(data.paymentTermDTO.paymentDays);
            }else{
                $("#zhangqi002").removeAttr("disabled");
                $("#zhangqi002").val(data.paymentTermDTO.paymentDays);
            }

            vm.$data.xieyi.contractInfo.protocolType = data.contractInfo.protocolType;




            //moment(value).format(format)

            //
            vm.$data.xieyi.contractInfo.approveBy = data.contractInfo.approveBy ;

            if(data.contractInfo.approveBy != null && data.contractInfo.approveBy != undefined && data.contractInfo.approveBy != "" ){
                $('.shenHeRen').show();
                $("#need").attr('checked','true');
            }

            var itemList = data.contractMatPager.records;

            for(k in itemList){
                pushJsonArray(vm.$data.xieyi.contractMatDTOs,[{id:itemList[k].id,matCd:itemList[k].matCd,itemName:itemList[k].itemName,matPrice:itemList[k].matPrice,skuAttributeStr:itemList[k].skuAttributeStr}]);
            }
            //买家
            vm.$data.xieyi.contractInfo.printerId = data.user.uid;
            vm.$data.xieyi.printer_name = data.user.companyName;


            vm.$data.xieyi.printer_name=data.user.companyName;
            vm.$data.xieyi.printer_contacts=data.user.linkMan;
            vm.$data.xieyi.printer_contact_number = data.user.linkPhoneNum;
            vm.$data.xieyi.printer_mail_box=data.user.userEmail;


            //alert(JSON.stringify(data));
        },false);
    }

})
/**
 * 检索卖家列表
 */
function queryshopList(){
    var page,platformIds,company;
    page=1;
    platformIds = $("#pingtaileixing").val();
    company = $("#gongshimingcheng").val();
    vm.$data.xieyi.maijia_list = "";
    setTimeout(function(){
        getshopList(page,platformIds,company)
    },500)
}
/**
 * 获取卖家列表
 */
function getshopList(page,platformIds,company){
        if(platformIds == undefined || platformIds == null){
            platformIds=0;
        }
        //getSellerBuyerDetail
        $.jsonAjax(getUrl("getSellerBuyerDetail"),{uType:"2",page:page,platformIds:platformIds,company:company},function(data,status,xhr){
            vm.$data.xieyi.maijia_list = data.pager.records;
            setTimeout(function(){
                xuanzhedonghuan();
            },500)
        },false);
}
function  queryItemList() {
    var keyword = $("#itemName").val();
    var attributes = $("#attributes").val();
    vm.$data.xieyi.items_list = "";
    setTimeout(function () {
        getgoodsList(keyword,attributes,1)
    },500)
}

/**
 page:2
 商品列表
 */
function getgoodsList(keyword,attributes,page){
    $.jsonAjax(getUrl("contract/searchItem"),{shopId:shopIdk,page:page,keyword:keyword,attributes:attributes},function(data,status,xhr){
        vm.$data.xieyi.items_list = data.pager.records;
        setTimeout(function(){
            xuanzhedonghuan();
        },500)
    },false);
}

function deleteItems(item_id) {
    var contractMatDTOs = vm.$data.xieyi.contractMatDTOs;
    for(keyl in contractMatDTOs){
        //contractMatDTOs.remove(keyl);
        printAlert(keyl);
    }
    vm.$data.xieyi.contractMatDTOs = contractMatDTOs;
}

var save_flag=false;
function xieyibaocun() {
    save_flag = true;
    lijifabu();
}

/**
提交协议
 */
function lijifabu(){

    //协议
    if(vm.$data.xieyi.contractInfo.paymentType == 0){
        vm.$data.xieyi.contractInfo.paymentDays = $("#zhangqi001").val();
    }else{
        vm.$data.xieyi.contractInfo.paymentDays = $("#zhangqi002").val();
    }
    //有审批人
    if(vm.$data.xieyi.contractInfo.approveBy != null){
        vm.$data.xieyi.contractInfo.status = 7;
    }

    var contractInfo = JSON.stringify(vm.$data.xieyi.contractInfo);



    var contractMatDTOs = vm.$data.xieyi.contractMatDTOs;
    if(contractMatDTOs.length < 1){
        printAlert("商品不能为空");
        return;
    }



    for(keys in contractMatDTOs){
        try {
            contractMatDTOs[keys].matPrice = contractMatDTOs[keys].matPrice.trim();
        }
        catch(err) {
        }
        delete  contractMatDTOs[keys].skuAttributeStr;
    }
    var contractPaymentTerm = JSON.stringify(vm.$data.xieyi.contractPaymentTerm);
    var sourcePage = vm.$data.xieyi.sourcePage;
    var annexcc = vm.$data.xieyi.annexcc;
    var fileNameAll = vm.$data.xieyi.fileNameAll;
    var removeMatIds = JSON.stringify(vm.$data.xieyi.removeMatIds);


    var js_url;
    if(js_contractNos != undefined && js_contractNos != null && js_contractNos != ""){
        js_url = getUrl("contractUpdate");
    }else{
        if(save_flag){
            js_url =getUrl("contractAdd");
        }else{
            js_url =getUrl("immediatelyup");
        }
    }


    $.jsonAjax(js_url,
        {contractInfo:contractInfo,contractMatDTOs:JSON.stringify(contractMatDTOs),contractPaymentTerm:contractPaymentTerm,sourcePage:sourcePage,annexcc:annexcc,fileNameAll:fileNameAll,removeMat:removeMatIds},
        function(data,status,xhr){
        if(data.success == true){
            printAlert("提交成功");
        }else if(data.result == null){
            printAlert("提交成功");
        }else{
            printAlert("提交失败");
        }
    },false);
    // printAlert(JSON.stringify(vm.$data.xieyi));
}


var vm = new Vue({
    el:'#shujuyuan',
    data:{
            xieyi:{
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
                    paymentType : null,//账期类型
                    paymentDays: null,//协议账期
                    approveBy : null,//审批人
                    protocolType : null,//协议类型
                    annex : null,//上传附件链接地址
                    annexcc:null,
                    fileNameAll:null,
                    remark : null,//备注
                    status : null // 状态
                },
                //合同物品 number cost
                contractMatDTOs:[],

                removeMatIds :[],

                //合同付款
                contractPaymentTerm:{"paymentType":"0","paymentDays":"212"},
                sourcePage :'seller',
                annexcc : null,
                fileNameAll :null,

                //以上是要提交的


                printer_name : null,//买方名称
                printer_contacts : null,//联系人
                printer_contact_number: null,//联系电话
                printer_fax : null,//传真
                printer_mail_box : null,//电子邮箱


                supplier_name : null,//名称
                supplier_contacts : null,//联系人
                supplier_contact_number: null,//联系电话
                supplier_fax : null,//传真
                supplier_mail_box : null,//电子邮箱

                //协议物品  {"matCd": "1000003064","itemName": "sku不同价格","matPrice": "96.00","cost": "1" }
                contract_mat : [],
                maijia_list:"",
                showApproveList:"",
                items_list:""
            }
    },

    mounted:function () {
        xuanzhedonghuan();

    },
    updated:function () {
            if(js_contractNos != undefined && js_contractNos != null){
                var js_beginDate = moment(js_beginDate).format("YYYY-MM-DD");
                var js_endDate = moment(js_endDate).format("YYYY-MM-DD");
                $("#js_beginDate").val(js_beginDate);
                $("#js_endDate").val(js_endDate);
            }
        }
    ,
    methods:{
        //删除商品数据
        deleteItems:function (item_id) {
            var contractMatDTOs = vm.$data.xieyi.contractMatDTOs;
            for(keyl in contractMatDTOs){
                if(contractMatDTOs[keyl].id == item_id){
                    contractMatDTOs.splice(keyl,1);
                    vm.$data.xieyi.removeMatIds.push(item_id);
                    break;
                }
            }
            vm.$data.xieyi.contractMatDTOs = contractMatDTOs;
        }
    }
});


function xuanzhedonghuan() {
//协议创建第二步协议账期二选一
    $('.days').click(function(){
        $(this).next().removeAttr("disabled");
        $(this).parent().next().children('.month ').attr("disabled","true");
        $("#zhangqi002").val("");
    });
    $('.months').click(function(){
        $(this).next().removeAttr("disabled");
        $(this).parent().prev().children('.xieYiYouZhangQi').attr("disabled","true");
        $("#zhangqi001").val("");
    });

    $('#div4 .maiFang-footer a:first-child').click(function(){
        divStyle('div4',true);
        divStyle('div1',false);
    });



//协议创建第二步回到第一步
    $('#div2 .last').click(function(){
        divStyle('div2',true);
        divStyle('div1',false);
    });

//协议创建第二步到第三步
//     $('#div2 .next').click(function(){
//
//     });




//协议创建第二步是否需要审核
    $('#need').click(function(){
        $('.shenHeRen').show();
    });
    $('#no-need').click(function(){
        $('.shenHeRen').hide();
    });



//协议创建第三步回到第二步
    $('#div3 .last').click(function(){
        divStyle('div3',true);
        divStyle('div2',false);
    });

//协议创建第一步点击到第二步
    $('#div1 .next').click(function(){
       var contractOrderNo =  vm.$data.xieyi.contractInfo.contractOrderNo;
       var contractName =  vm.$data.xieyi.contractInfo.contractName;
       var supplierId =  vm.$data.xieyi.contractInfo.supplierId;
        if(contractOrderNo == null){
            printAlert("协议编号不能为空");
            return;
        }
        if(contractName == null){
            printAlert("协议名称不能为空");
            return;
        }
        if(supplierId == null){
            printAlert("卖家不能为空");
            return;
        }
        divStyle('div1',true);
        divStyle('div2',false);
    });



//添加卖方
    var a
    $("#div4 .no-select").click(function(){
        if($(this).attr("src")=="../../img/no-select.png")
        {
            $(this).attr("src","../../img/yes-select.png");
            $(this).parent().parent().siblings().find('.no-select').attr("src","../../img/no-select.png");
            $(this).parent().parent().attr("data-choose","1");
            $(this).parent().parent().siblings().attr("data-choose","0");
            a=1;
        }
        else
        {
            $(this).attr("src","../../img/no-select.png");
            $(this).parent().parent().attr("data-choose","0");
            a=0;
        }
    });

    $('#div4 .maiFang-footer a:last-child').click(function(){
        if(
            a==1
        ){
            divStyle('div4',true);
            divStyle('div1',false);
            $(".shangPinLieBiao").each(function(){
                if($(this).attr("data-choose") == 1){
                    // shopIdk = $(this).find(".maiFang p .right:eq(0)").text();
                    vm.$data.xieyi.contractInfo.printerId = $(this).find(".maiFang p .right:eq(0)").text();
                    vm.$data.xieyi.printer_name = $(this).find(".maiFang p .right:eq(1)").text();
                    vm.$data.xieyi.printer_contacts = $(this).find(".maiFang p .right:eq(2)").text();
                    vm.$data.xieyi.printer_contact_number = $(this).find(".maiFang p .right:eq(3)").text();
                    vm.$data.xieyi.printer_fax = $(this).find(".maiFang p .right:eq(4)").text();
                    vm.$data.xieyi.printer_mail_box = $(this).find(".maiFang p .right:eq(5)").text();
                }
            });
        }
        vm.$data.xieyi.maijia_list = "";
    });
    //底部按钮点击变红
    $(".foot a,.foot2 a,.foot3 a").click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
    });

//底部按钮点击取消弹出弹窗
    $('.cancle').click(function () {
        $('.zhezhao').show();
    });
//关闭弹窗
    $('.quXiao,.queDing').click(function(){
        $('.zhezhao').hide();
    });


//新增商品
    $("#div5 .no-select").click(function(){
        if($(this).attr("src")=="../../img/no-select.png")
        {
            $(this).attr("src","../../img/yes-select.png");
            $(this).parent().parent().attr("data-check","1");
        }
        else
        {
            $(this).attr("src","../../img/no-select.png");
            $(this).parent().parent().attr("data-check","0");
        }
    });


// //点击新增商品-确定
//     $('#div5 .maiFang-footer').delegate('','click',function(){
//         printAlert(1);
//         var addData = '';
//             $('#div5 a').each(function(k,v){
//             //获取是否选中
//             if($(this).attr("data-check") == 1){
//                 var name = $(this).find(".shangPinXiangQing p:eq(1) span:eq(0)").text();
//                 var nature = $(this).find(".shangPinXiangQing p:eq(2) span:eq(0)").text();
//                 var price = $(this).find(".shangPinXiangQing p:eq(3) i:eq(0)").text();
//                 // var xieyi = $('.xieyi ').val();
//                 //addData = addData + addThing(name,nature,price,xieyi);
//                 pushJsonArray(vm.$data.xieyi.contract_mat,[{item_name:name,item_attribute:nature,item_skuId:null,mat_price:null,mat_total_price:null,mat_total_num:null}]);
//             }
//         })
//         //添加数据
//         $("#div3 .wuPin").remove();
//         // $("#div3 .xieYiWuPin").after(addData);
//         //显示页面
//         divStyle('div5',true);
//         divStyle('div3',false);
//     })
    /*$('#div5 .maiFang-footer a').click(function(){
     divStyle('div5',true);
     divStyle('div3',false);
     });*/
    intercept('.shangPinShuXing','21');


}








function getitemk(){
    $('#div5 a').each(function(k,v){
        //获取是否选中
        if($(this).attr("data-check") == 1){
            var id = $(this).find(".shangPinXiangQing p:eq(0) span:eq(0)").text();
            var matCd = $(this).find(".shangPinXiangQing p:eq(1) span:eq(0)").text();
            var name = $(this).find(".shangPinXiangQing p:eq(2) span:eq(0)").text();
            var nature = $(this).find(".shangPinXiangQing p:eq(3) span:eq(0)").text();
            var price = $(this).find(".shangPinXiangQing p:eq(4) i:eq(0)").text();
            pushJsonArray(vm.$data.xieyi.contractMatDTOs,[{id:id,matCd:matCd,itemName:name,matPrice:price,skuAttributeStr:nature}]);
        }
    })
    //添加数据
    // $("#div3 .wuPin").remove();
    //显示页面
    divStyle('div5',true);
    divStyle('div3',false);
    vm.$data.xieyi.items_list = "";
}



function erdaosan(){
    var beginDate =  vm.$data.xieyi.contractInfo.beginDate;
    var endDate =  vm.$data.xieyi.contractInfo.endDate;
    var paymentType =  vm.$data.xieyi.contractInfo.paymentType;
    var protocolType =  vm.$data.xieyi.contractInfo.protocolType;
    if(beginDate == null){
        printAlert("协议开始日期不能为空");
        return;
    }
    if(endDate == null){
        printAlert("协议结束日期不能为空");
        return;
    }
    if(paymentType == null){
        printAlert("协议账期不能为空");
        return;
    }
    if(protocolType == null){
        printAlert("协议类型不能为空");
        return;
    }
    divStyle('div2',true);
    divStyle('div3',false);

    if(js_contractNos != undefined && js_contractNos != null && js_contractNos != ""){
        $("#lijifubujs").html("NO")
    }
}




