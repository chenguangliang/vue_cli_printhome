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
                    if(temp.accountInfo.state != 2){
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
        }
    },
    computed:{

    },
    beforeMount:function(){
        this.params = $.getUrlJson();
        /*获取用户信息*/
        this.getUserInfo();
        /*获取用户账户信息*/
        this.getBuyerBalance();

    },
    mounted: function () {

    },
    updated:function(){

    },
    watch:{

    }
});
