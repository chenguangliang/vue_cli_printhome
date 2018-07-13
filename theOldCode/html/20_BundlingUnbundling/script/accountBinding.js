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
    el:"#binding",
    data:{
        //第一步div
        comfirmDialog:true,
        //第二步div
        bindingDialog:false,
        //用户名
        userInfo:"",
        //密码
        password:"",
    },
    methods:{
        //获取用户信息
        getUserInfo:function(){
            var temp = this;
            $.jsonAjax(getUrl("user/getUserByIdForLogin"), {}, function (data, status, xhr) {
                if (data.success) {
                    temp.userInfo = data.result;
                    //console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        submitBinding:function(){
            var temp = this;
            if(!isNotBlank(this.password)){
                popUp_auto_false(1500,"密码不能为空！");
                return false;
            }
            //检查是否已经绑定
            $.jsonAjax(getUrl("person/checkUname"),{userName:temp.userInfo.uname},function(data, status, xhr){
                if(data.success){
                    //校验账号登录
                    $.jsonAjax(getUrl("person/bingWxLogin"),{userName:temp.userInfo.uname,password:temp.password},function(data, status, xhr){
                        if(data.success){
                            //判断该用户是否登录并且已经授权
                            $.jsonAjax(getUrl("person/checkAccessTokenExist"),{},function(data, status, xhr){
                                if(data.success){
                                    //开始绑定
                                    window.location=getUrl("person/oauth2UserInfo");
                                }else{
                                    //开始绑定
                                    window.location=getUrl("person/genOauth2Url");
                                }
                            })

                        }else{
                            popUp_auto_false(1500,"密码输入错误，请重新输入!");
                        }
                    });
                }else{
                    popUp_auto_false(1500,data.errorMessages);
                }
            });
        }
    },
    computed:{

    },
    beforeMount:function(){
        //获取用户信息
        this.getUserInfo();
    },
    mounted:function(){

    },
    watch:{

    }
});