/**
*@fileName:depositBalance.js
*@author:lxm
*@time:2017/12/17
*@disc:提现页面js
*/

var depositBalance = new Vue({
    el:"#depositBalance",
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //浏览器参数
        params:{
        },
        buyerInfo:{},
        depositBalance:"",
    },
    methods:{
        queryBuyerInfo : function () {
            var temp = this;
            $.jsonAjax(getUrl("information/informationBuyer/loadBuyerInfo"), {}, function (data, status, xhr) {
                temp.buyerInfo = data.data.userInfoDTO;
            }, false);
        },
        deposit : function () {
            popUp_open();
            if(this.depositBalance == "" || this.depositBalance <= 0){
                popUp_auto_false(1000,"请输入正确的提现金额！");
                return;
            }
            if(this.depositBalance > this.params.balance){
                popUp_auto_false(1000,"提现金额不能超过"+this.params.balance+"!");
                return;
            }
            /*开始提现*/
            //popUp_open();
            $.jsonAjax(getUrl("buyercenter/withdraw/deposit"), {amount:this.depositBalance}, function (data, status, xhr) {
                if(data.success){
                    popUp_close();
                    //popUp_auto(1500,data.msg);
                    window.location = '../../html/15_xiaoYinZhiFu/queryBalance.html';
                }else{
                    popUp_close();
                    popUp_auto_false(1500,data.msg);
                }
            }, false);


        },
        fullcash : function () {
            this.depositBalance = this.params.balance;
        }
    },
    computed:{

    },
    beforeMount:function(){
        this.params = $.getUrlJson();
        /*获取用户提现账户信息buyerInfo*/
        this.queryBuyerInfo();
    },
    mounted: function () {

    },
    updated:function(){

    },
    watch:{

    }
});
