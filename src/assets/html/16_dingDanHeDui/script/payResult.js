/**
 * Created by Administrator on 2017/4/5 0005.
 */
/**
*@fileName:payResult.js
*@author:fdc
*@time:2017/4/5 0005
*@disc:支付结果js
*/


/**
 * Created by Administrator on 2017/4/1 0001.
 */
/**
 *@fileName:pay.js
 *@author:fdc
 *@time:2017/4/1 0001
 *@disc:订单支付
 */


var payResult = new Vue({

    el:"#payResult",
    mixins:[],
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        params:{
            //订单编号
            orderNo:"",
        },
        //去支付form
        toPayForm:"",
        //支付失败结果
        errorMessages:[],
        //支付结果
        payResultSuccess:false,
        //正在支付
        paying:false,
    },
    methods:{
        //去支付 应该后台校验库存
        payOrder:function(){
            console.log(this.params)
            var temp = this;
            $.jsonAjaxPost(getUrl('shopCart/payOrder'),temp.params,function(data, status, xhr){
                if(data.result.er.success){
                    if(data.result.er.result == 1){//跳转支付页面
                        temp.paying = true;
                        console.log(data)
                        temp.toPayForm = data.result.er.resultMessage;
                    }else{//支付成功
                        temp.payResultSuccess = true;
                    }
                }else{
                    temp.errorMessages = data.result.er.errorMessages;

                }
            },false);
        },
        //查看详情
        gotoMyOrder:function(){
            if($.getUrlJson().orderType){
                window.location.href='../../html/12_maiJiaZhongXin/12_dingDan_fenQiDingDan.html';//分期订单
            }else {
                window.location.href='../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html';//正常订单
            }
        },
        gotoQuickOrder: function () {
            window.location="../../html/21_quickOrder/1_quickOrderList_buyer.html";//分期订单
        }
    },
    computed:{
    },
    beforeMount:function(){
        //获取订单编号
        this.params = $.getUrlJson();
        //提交form
        this.payOrder();
    },
    mounted:function(){
        if(this.paying){
            document.getElementById("form").submit();
        }
    },
    breforeUpdate:function(){

    },
    updated:function(){

    },
    watch:{
    }


});