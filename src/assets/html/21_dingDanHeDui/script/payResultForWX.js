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
        payOrder: function () {
            var temp = this;
            //http://localhost:63342/mallwx_html/html/21_dingDanHeDui/dingDanZhiFuResult.html?orderType=0&orderId=K_2017072602890&paymentMethod=1&totalPrice=9.35&payMethod=CB&type=0
            //判断是主订单手动加01，否则不加。
            if(temp.params.orderType!=1){
                temp.params.orderId=temp.params.orderId+'01';
            }
            var param = {'orderId': temp.params.orderId, paymentMethod: temp.params.payMethod, type: 1};//王冠的参数
            // orderId=K_201707260288301&paymentMethod=AP&type=11&commonPlatformId=3
            console.log(param);
            $.jsonAjax(getUrl('quickor/master/orderBuyerPay'), param, function (data, status, xhr) {//王冠的地址
                if (data.success) {
                    if (data.result.er.result == 1) {//跳转支付页面
                        temp.paying = true;
                        temp.toPayForm = data.result.er.resultMessage;
                    } else {//支付成功
                        temp.payResultSuccess = true;
                    }
                } else {
                    temp.errorMessages = data.resultMessage;
                }
            }, false);
        },
        //去支付 应该后台校验库存
        payOrder:function(){
            var temp = this;
            //判断是主订单手动加01，否则不加。
            if(temp.params.orderType!=1){
                temp.params.orderId=temp.params.orderId+'01';
            }
            var param = {'orderId': temp.params.orderId, paymentMethod: temp.params.payMethod, type: 1};//王冠的参数
            $.jsonAjax(getUrl('quickor/master/orderBuyerPay'), param, function (data, status, xhr) {//王冠的地址
                if (data.success) {
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
            window.location.href = '../../html/21_quickOrder/1_quickOrderList_buyer.html';
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