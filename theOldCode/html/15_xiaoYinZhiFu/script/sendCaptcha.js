/**
*@fileName:depositBalance.js
*@author:lxm
*@time:2017/12/17
*@disc:提现页面js
*/

var sendCaptcha = new Vue({
    el:"#sendCaptcha",
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //浏览器参数
        params:{
        },
        buyerInfo:{},
        mobileShow:"",
        captcha:""
    },
    methods:{
        queryBuyerInfo : function () {
            var temp = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    temp.userInfo = data.result;
                    var mobile = temp.userInfo.umobile;
                    temp.mobileShow = mobile.substr(0,3)+"****"+mobile.substr(7);
                }
            }, false);
        },
        sendCaptcha : function () {

            $.jsonAjax(getUrl("captcha/sendPhonecaptcha"), {type:2,contact:this.userInfo.umobile}, function (data, status, xhr) {
                if(data.errorMessage == null || data.errorMessage == ""){
                    countTime();
                }else{
                    popUp_auto_false(1500,data.errorMessage);
                }

            }, false);
        },
        nextStep : function () {
            if(this.captcha == ""){
                popUp_auto_false(1000,"请输入验证码");
                return;
            }
            /*检验验证码的正确性*/
            $.jsonAjax(getUrl("captcha/checkCaptcha"), {captcha:this.captcha,contact:this.userInfo.umobile}, function (data, status, xhr) {
                if(data.data){
                    window.location = 'bindAccount.html';
                }else{
                    popUp_auto_false(1000,"您输入的验证码不正确");
                    return;
                }
            }, false);
        }

    },
    computed:{

    },
    beforeMount:function(){
        this.params = $.getUrlJson();
        /*获取用户提现账户信息buyerInfo*/
        this.queryBuyerInfo();
        /*发送验证码*/
        this.sendCaptcha();
    },
    mounted: function () {

    },
    updated:function(){

    },
    watch:{

    }
});
// 验证码
function countTime() {
    var count = 60;
    window.countInterval = setInterval(function () {
        if (count >= 0) {
            $(".send_captcha").attr("disabled", true).val(count + '秒后重新发送');
            count--;
        } else {
            $(".send_captcha").attr("disabled", false).val('获取验证码');
            window.clearInterval(countInterval);
        }
    }, 1000);
}