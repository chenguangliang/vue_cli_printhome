/**
 * Created by fdc on 2017/4/19.
 */
/**
*@fileName:08_sellerIndex.js
*@author:fdc
*@time:2017/4/19
*@disc:卖家中心页面
 *
*/
var sellerIndex = new Vue({
    el:"#accountSet",
    data:{
        //用户信息
        userInfo:"",
    },
    methods:{

        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserByIdForLogin"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                }
            }, false);
        },
    },
    computed:{

    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
    },
    mounted:function(){

    },
    updated:function(){

    },
    watch:{

    }
});