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
    img.src=getUrl("user/acquire?type=find_pay_pwd&a="+new Date());
}

function oneStepSubmit(){
    if($("#picCaptcha").val() == ""){
        popUp_auto_false(1000,"验证码不能为空!");
        return false;
    }
    if(!userInfo.$data.userInfo.umobile){
        popUp_auto_false(1000,"手机号不能为空!");
        return false;
    }
    $.jsonAjax(getUrl("user/findPWDOne"),{captchaType:"find_pay_pwd",captcha:$("#picCaptcha").val(),phone:userInfo.$data.userInfo.umobile},function(data){
        if(data.success){
            var areaCode = userInfo.$data.userInfo.areaCode;
            if(!areaCode){
                areaCode = "86";
            }
            window.location = "../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_zhaoHuiZhiFuMiMa2.html?captchaType=find_pay_pwd&picCaptcha="+data.result.captcha+"&phone="+userInfo.$data.userInfo.umobile+"&areaCode="+areaCode;
        }else{
            popUp_auto_false(1000,data.errorMessages);
        }
   });
}

var userInfo = new Vue({
    el:"#userInfo",
    data:{
        userInfo:'',
    },
    beforeMount:function() {
        //用户信息
        this.userInfo = StorageUtil.getUserInfo();
        // console.log(this.userInfo)
    },
    methods: {
        getPhone: function (phone) {
            return phone.substr(0, 3) + "****" + phone.substr(phone.length - 4, 4);
        }
    }
});