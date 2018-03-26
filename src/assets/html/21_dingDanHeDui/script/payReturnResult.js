/**
 * Created by Administrator on 2017/4/6 0006.
 */
/**
*@fileName:payReturnResult.js
*@author:fdc
*@time:2017/4/6 0006
*@disc:支付回调
*/

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


var payReturnResult = new Vue({
    el:"#payReturnResult",
    mixins:[],
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //回调浏览器参数
        returnParams:{
        },
        //处理结果
        execResult:""
    },
    methods:{
        //处理订单支付结果
        execPayResult:function(){
            var temp = this;
            $.jsonAjax(getUrl('shopCart/payCallBack'),this.returnParams,function(data, status, xhr){
                temp.execResult = data;
                if(temp.execResult.success){
                    lod5();
                }
            });
        },
        //查看详情
        gotoMyOrder:function(){
            window.location.href='../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html';
        }
    },
    computed:{
    },
    beforeMount:function(){
        //获取订单编号
        this.returnParams = $.getUrlJson();
        //处理支付结果
        this.execPayResult();
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