/**
*@fileName:orderAuth.js
*@author:fdc
*@time:2017/3/29 0029
*@disc:订单审核信息
*/


var orderAuth = new Vue({
    el:"#orderAuth",
    data:{
        //订单信息
        submitInfo:"",
        //审核列表
        authList:"",
        //用户信息
        userInfo:"",
        //提交类型
        submitType:""
    },
    methods:{
        //获取用户信息
        getUserInfo:function(){
            var temp = this;
            $.jsonAjax(getUrl('user/getUserInfo'),{},function(data, status, xhr){
                console.log(data.result)
                if(data.success){
                    temp.userInfo = data.result;
                }
            });
        },
        //获取审核列表
        getAuthList:function(){
            var temp = this;
            $.jsonAjax(getUrl('shopCart/queryUserAuthList'),{},function(data, status, xhr){
                console.log(data.result)
                if(data.success){
                    temp.authList = data.result.childUserListPosts;
                }
            });

        },
        initSubmitType:function(){
            if(this.submitInfo.authId != null && this.submitInfo.authId != '' && typeof(this.submitInfo.authId) != undefined){
                this.submitType = 2;//需要审核
            }else{
                this.submitType = 1;//不需要审核
            }
        },
        //此页面由订单核对页跳转而来将此返回回去
        orderChecked:function(){
            this.submitInfo.changeFlag = true;//改为true否则动画不消失
            window.location = "../../html/16_dingDanHeDui/dingDanHeDui.html?"+ $.assemblyRequestString(this.submitInfo);
        },
        //跳转到订单核对
        gotoOrderView:function(){
            if(this.submitType == 1){
                this.submitInfo.authId = "";
                this.orderChecked();
            }else{
                if(isNotBlank(this.submitInfo.authId)){
                    this.orderChecked();
                }else{
                    popUp_auto_false(1500,'请选择审核人！');
                }
            }
        },

    },
    computed:{

    },
    beforeMount:function(){
        //获取审核列表
        this.getAuthList();
        //从浏览器获取提交订单信息
        this.submitInfo = $.getUrlJson();
        this.initSubmitType();
        //获取用户信息
        this.getUserInfo();

    },
    mounted:function(){
        changeCard();
    },
    breforeUpdate:function(){

    },
    updated:function(){

    },
    watch:{
    }
});