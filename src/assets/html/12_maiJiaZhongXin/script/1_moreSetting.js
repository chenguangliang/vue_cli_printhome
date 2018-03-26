/**
*@fileName:1_moreSetting.js
*@author:fdc
*@time:2017/4/11 0011
*@disc:更多设置
*/
var moreSetting = new Vue({
    el:"#moreSetting",
    data:{},
    methods:{
        logout:function(){
            $.jsonAjax(getUrl('user/logout'),{},function(){
                window.location = '../../html/2_login_sign/login_common.html';
            });
        },
        //跳转微信绑定页面
        gotoWXBing:function(){
            window.location = getUrl("person/bindingAccount");
        },
    },
});
