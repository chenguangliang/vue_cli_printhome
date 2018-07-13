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
                if(data.result.success == true){
                    if(data.result.er.result == 1){//跳转支付页面
                        temp.paying = true;
                        temp.toPayForm =JSON.parse(data.result.er.resultMessage);
                        if (typeof WeixinJSBridge == "undefined"){
                            if( document.addEventListener ){
                                document.addEventListener('WeixinJSBridgeReady', temp.onBridgeReady, false);
                            }else if (document.attachEvent){
                                document.attachEvent('WeixinJSBridgeReady', temp.onBridgeReady);
                                document.attachEvent('onWeixinJSBridgeReady', temp.onBridgeReady);
                            }
                        }else{
                            temp.onBridgeReady();
                        }
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
            window.location.href='../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html';
        },
        gotoQuickOrder: function () {
            window.location="../../html/21_quickOrder/1_quickOrderList_buyer.html";
        },

        onBridgeReady:function(){
            var temp = this;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', temp.toPayForm,
                function(res){
                    // 使用以上方式判断前端返回,微信团队郑重提示:res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                        temp.payResultSuccess = true;
                        console.log('交易成功!')
                        document.location.reload();
                    }
                }
            );
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
    },
    breforeUpdate:function(){

    },
    updated:function(){

    },
    watch:{
    }


});