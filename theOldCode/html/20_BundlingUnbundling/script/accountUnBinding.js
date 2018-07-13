/**
 * Created by fdc on 2017/5/17.
 */
/**
*@fileName:accountBinding.js
*@author:fdc
*@time:2017/5/17
*@disc:账号绑定
 *
*/

var binding = new Vue({
    el:"#unbinding",
    data:{
        param:"",
        //第一步div
        comfirmDialog:true,
        //第二步div
        bindingDialog:false,
        //用户名
        userName:"",
        //密码
        password:"",
    },
    methods:{
        submitUnBinding:function() {
            var temp = this;
            if ((!isNotBlank(this.userName)) || (!isNotBlank(this.password))) {
                popUp_auto_false(1500, "密码不能为空！");
                return false;
            }
            //校验账号登录
            $.jsonAjax(getUrl("person/bingWxLogin"), {
                userName: temp.userName,
                password: temp.password
            }, function (data, status, xhr) {
                if (data.success) {
                    //判断该用户是否登录并且已经授权
                    $.jsonAjax(getUrl("person/checkAccessTokenExist"), {}, function (data, status, xhr) {
                        if (data.success) {
                            //开始绑定
                            window.location = getUrl("person/cancelBindingSec");
                        } else {
                            //开始绑定
                            window.location = getUrl("person/cancelBinding");
                        }
                    })
                } else {
                    popUp_auto_false(1500, "密码输入错误，请重新输入!");
                }
            },false);
        }
    },
    computed:{

    },
    beforeMount:function(){
        //从浏览器获取提交订单信息
        this.param = $.getUrlJson();
        this.userName = this.param.userName;
    },
    mounted:function(){

    },
    watch:{

    }
});