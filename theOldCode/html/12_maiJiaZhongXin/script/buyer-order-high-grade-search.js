/**
 *  买家中心---我的订单高级搜索
 */
/**********************************************************************************************************************/
var searchVue = new Vue({
    el:"#order_high_grade_search",
    data:{
        itemName:"",
        shopName:"",
        orderId:"",
        orderState:"",
        orderType:"",
        createStart:"",
        createEnd:"",
        paymentTimeStart:"",
        paymentTimeEnd:""
    },
    methods:{
        //返回买家中心订单列表
        goBackOrderList:function() {
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
        },
        //查询订单
        queryBuyerOrderByHighGrade:function() {
            var temp = this;
            var paramData = {
                itemName:temp.$data.itemName,
                shopName:temp.$data.shopName,
                orderId:temp.$data.orderId,
                state:temp.$data.orderState,
                orderType:temp.$data.orderType,
                createStartStr:isNotBlank(temp.$data.createStart) ? dateToLong(temp.$data.createStart) : "",
                createEndStr:isNotBlank(temp.$data.createStart) ? dateToLong(temp.$data.createEnd) : "",
                paymentTimeStartStr:isNotBlank(temp.$data.createStart) ? dateToLong(temp.$data.paymentTimeStart) : "",
                paymentTimeEndStr:isNotBlank(temp.$data.createStart) ? dateToLong(temp.$data.paymentTimeEnd) : ""
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html?"+ $.assemblyRequestString(paramData);
        }
    },
    mounted: function () {
        //mountJQueryEvent();
    }
});

//function mountJQueryEvent(){
//    var calendardatetime1 = new lCalendar();
//    calendardatetime1.init({
//        'trigger': '#selTime1',
//        'type': 'datetime'
//    });
//    var calendardatetime2 = new lCalendar();
//    calendardatetime2.init({
//        'trigger': '#selTime2',
//        'type': 'datetime'
//    });
//    var calendardatetime3 = new lCalendar();
//    calendardatetime3.init({
//        'trigger': '#selTime3',
//        'type': 'datetime'
//    });
//    var calendardatetime4 = new lCalendar();
//    calendardatetime4.init({
//        'trigger': '#selTime4',
//        'type': 'datetime'
//    });
//};