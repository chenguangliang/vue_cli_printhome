/**
*@fileName:findpwd.js
*@author:fdc
*@time:2017/3/2 0002
*@disc:密码找回
*/

$(function(){
    getImgcaptcha();
});


/**
 *@fileName:phonelogin.js
 *@author:fdc
 *@time:2017/2/20 0020
 *@disc:获取图片验证
 */
function getImgcaptcha(){
    var img = document.getElementById("imgCaptcha");
    img.src=getUrl("user/acquire?type=find_pwd&a="+new Date());
}



function oneStepSubmit(){
    if($("#picCaptcha").val() == ""){
        popUp_auto_false(3000,"验证码不能为空!");
        return false;
    }
    if($("#phone").val() == ""){
        popUp_auto_false(3000,"手机号不能为空!");
        return false;
    }
    $.jsonAjax(getUrl("user/findPWDOne"),{captchaType:"find_pwd",captcha:$("#picCaptcha").val(),phone:$("#phone").val()},function(data){
        if(data.success){
            window.location = "../../html/2_login_sign/zhaoHuiMiMa2.html?captchaType=find_pwd&picCaptcha="+data.result.captcha+"&phone="+$("#phone").val()
                +"&areaCode="+phoneNumVM.$data.areacode;
        }else{
            popUp_auto_false(3000,data.errorMessages);
        }
   });
}


var areaCodeOut = $.getUrlParam("areaCode");
var phoneNumVM = new Vue({
    el:"#phoneNum",
    data:{
        areacode:'86'
    },
    methods:{
        // limitPhone: function ($event) {
        //    if(this.areacode==86){
        //        $event.target.value=$event.target.value.slice(0,10);
        //    }
        // },
        showGuoJiPage: function () {
            window.location = "../../html/2_login_sign/guoJiShouJiHao.html?type=findPwd";
        }
    },
    beforeMount:function(){
        if(null != areaCodeOut && ''!=areaCodeOut){
            this.areacode = areaCodeOut;
        }
    }
})