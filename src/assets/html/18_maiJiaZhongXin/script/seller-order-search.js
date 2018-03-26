/**
 *  卖家中心---我的订单普通搜索
 */
/**********************************************************************************************************************/
var searchVue = new Vue({
    el:"#order_search",
    data:{
        itemName:""
    },
    methods:{
        //返回卖家中心订单列表
        goBackOrderList:function() {
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
        },
        //跳转至订单高级搜索
        toHighGradeSearch:function() {
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_gaoJiSouSuo.html";
        },
        //查询订单
        queryBuyerOrder:function() {
            var temp = this;
            var paramData = {
                itemName:temp.$data.itemName
            };
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html?"+ $.assemblyRequestString(paramData);
        }
    }
});