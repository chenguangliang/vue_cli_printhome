/**
 * Created by Administrator on 2017/4/6 0006.
 */
/**
/**
*@fileName:orderSubmitResult.js
*@author:fdc
*@time:2017/5/16
*@disc:延期支付订单显示订单提交结果
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

var orderSubmitResult = new Vue({
    el:"#orderSubmitResult",
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