/**
*@fileName:recharge.js
*@author:fdc
*@time:2017/4/12 0012
*@disc:充值页面js
*/

var recharge = new Vue({
    el:"#recharge",
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //浏览器参数
        params:{
        },
        userInfo:{},
        accountInfo:{},
        timeRange:false,
        buyerInfo:{},
        bankAccoutState:0,//账户状态 0无提现账户  1有提现账户且已审核通过   2提现账户正在审核中  3提现账户被驳回
    },
    methods:{
        getUserInfo:function(){
            var temp = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    temp.userInfo = data.result;
                }
            }, false);
        },
        //获取账户数据
        getBuyerBalance:function(){

            if(this.userInfo.userstatus < 3){
                printConfirm("您还未认证，暂未开通小印支付账户，认证后方可使用小印支付服务？",function(){
                    window.location= "../../html/2_login_sign/fastRenZheng.html";
                },function(){
                    gotoBackPreviousPage();
                });
            }
            var temp = this;
            popUp_open();
            $.jsonAjax(getUrl("security/queryBuyerBalance"), {}, function (data, status, xhr) {
                popUp_close();
                if (data.success) {
                    temp.accountInfo = data.result;

                    if(temp.accountInfo.state != 2 && temp.accountInfo.state != 3){
                        printConfirm("此账号还未审核通过，请稍后再试",function(){
                            gotoBackPreviousPage();
                        },function(){
                            gotoBackPreviousPage();
                        });
                    }

                }else{
                    printConfirm(data.errorMessages,function(){
                        gotoBackPreviousPage();
                    },function(){
                        gotoBackPreviousPage();
                    });
                }
            });
        },
        time_range : function (beginTime, endTime){
            var strb = beginTime.split (":");
            if (strb.length != 2) {
                return false;
            }

            var stre = endTime.split (":");
            if (stre.length != 2) {
                return false;
            }

            var b = new Date ();
            var e = new Date ();
            var n = new Date ();

            b.setHours (strb[0]);
            b.setMinutes (strb[1]);
            e.setHours (stre[0]);
            e.setMinutes (stre[1]);

            if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
                return true;
            } else {
                //alert ("当前时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在该时间范围内！");
                return false;
            }
        },
        queryBuyerInfo : function () {
            var temp = this;
            $.jsonAjax(getUrl("information/informationBuyer/loadBuyerInfo"), {}, function (data, status, xhr) {

                temp.buyerInfo = data.data.userInfoDTO;
                if(temp.buyerInfo.userAccountDTO.bankAccountStatus == 0){
                    temp.bankAccoutState = 3;
                }else if(temp.buyerInfo.userAccountDTO.bankAccountStatus == 1){
                    temp.bankAccoutState = 2;
                }else{
                    /*有银行账户审核中*/
                    if(null != temp.buyerInfo.userAccountDTO.bankAccount && "" != temp.buyerInfo.userAccountDTO.bankAccount){
                        temp.bankAccoutState = 1;
                    }else{
                        temp.bankAccoutState = 0;
                    }
                }
            }, false);

        },
        withdraw : function () {
            //无提现账户
            if(this.bankAccoutState == 0){
                window.location = 'sendCaptcha.html';
            }else if(this.bankAccoutState == 1){
                window.location = 'balanceCash.html?balance='+this.accountInfo.usableMoney;
            }
        }
    },
    computed:{

    },
    beforeMount:function(){
        this.params = $.getUrlJson();
        /*获取用户信息--这里获取的是userInfo*/
        this.getUserInfo();
        /*获取用户账户信息*/
        this.getBuyerBalance();

        /*获取用户提现账户信息buyerInfo*/
        this.queryBuyerInfo();

        /* 判断当前时间是否在9:00-16:00时间段内在是红色，否则置为灰色 */
        if(this.time_range("09:00","16:00")){
            this.timeRange = true;
        }else{
            this.timeRange = false;
        }
    },
    mounted: function () {

    },
    updated:function(){

    },
    watch:{

    }
});
