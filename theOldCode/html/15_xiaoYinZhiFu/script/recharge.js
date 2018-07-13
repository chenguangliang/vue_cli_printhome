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
            //订单编号
            orderNo:"",
        },
        userInfo:{},
    },
    methods:{
//获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                    console.log(tmep.userInfo);
                }
            }, false);
        }
    },
    computed:{

    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
        //获取订单编号
        this.params = $.getUrlJson();
        console.log(this.params);
    },
    mounted: function () {

    },
    updated:function(){

    },
    watch:{

    }
});
