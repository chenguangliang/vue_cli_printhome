var referer ;

$(function(){
    /**
     * 判断浏览器是否是从其他页面跳过来
     * @type {*|null}
     */
    // referer =  $.getUrlParam("referer");
    var urlParam = location.search;
    if (urlParam.indexOf("?") != -1) {
        var index = urlParam.indexOf("=");
        referer = urlParam.substr(index+1)
    }


    $.jsonAjax(getUrl("user/logoutForum"),{},function(data,status,xhr){
        if(data.success){
            $("#bbsImg").attr("src",data.result);
        }
    });
});
/**
 *@fileName:login.js
 *@author:cgl
 *@time:2017/2/17 0017
 *@disc:手机号校验错误需要呈现的样式
 */
function checkNameWrongStyle() {
    $(".warm").show();
    $('.user').css({'border-color':'#e60012','color':'#e60012'});
    $(".userTip").show();
    return false;
}
/**
 *@fileName:login.js
 *@author:cgl
 *@time:2017/2/17 0017
 *@disc:图片验证码校验错误需要呈现的样式
 */
function checkPWDWrongStyel() {
    $('.key').css({'border-color':'#e60012','color':'#e60012'});
    $(".userTip").show();
    return false;
}

/**
 *@fileName:login.js
 *@author:fdc
 *@time:2017/2/17 0017
 *@disc:登录方法
 */
function userNamePasslogin(){
    var userName = $("#username").val();
    var hidePwd = $("#hidePwd").val();
    if(!userName){
        checkNameWrongStyle();
        popUp_auto_false(1500,"用户名不能为空");
        return false;
    }
    if(!hidePwd){
        checkPWDWrongStyel();
        popUp_auto_false(1500,"密码不能为空");
        return false;
    }
    popUp_open();
   $.jsonAjax(getUrl("user/login"),{userName:userName,password:hidePwd,pic_captcha_id:null},function(data,status,xhr){
       popUp_close();
       if(data.success){
           //获取用户信息
           StorageUtil.setUserInfo();
           //设置用户区域信息
           setLoginSuccessRegion();
           if(referer){
               $.jsonAjax(getUrl("user/loadForum"),{},function(data,status,xhr){
                   if(data.success){
                       $("#logBbsImg").attr("src",data.result);
                       if(referer.indexOf('bbs')>-1){
                           popUp_auto(3000,"正在跳转到论坛...");
                           window.setInterval('window.location= referer',3000);
                       }else{
                           window.location= referer
                       }
                   }
               },false);
           }else{
               window.location = '../../html/2_login_sign/loginSuccess.html';
           }
       }else{
           $('.userTip').show();
           window.setTimeout(function () {
               popUp_auto_false(1500,data.errorMessages);
           },400);
       }
   },true,true);
}

/**
 *@fileName:login.js
 *@author:fdc
 *@time:2017/2/17 0017
 *@disc:是否需要验证码
 */
function checkNeedCaptcha(userName){
    $.jsonAjax(getUrl("user/checkNeedCaptcha"),{userName:userName},function(data,status,xhr){
           if(data.success && data.result > 0){
               return true;
           }else{
               return false;
           }
    });
}


//密码明暗文切换
function showKey(){
    if($('#see').hasClass('img01')){
        $('#see').removeClass('img01').addClass('img02');
        $("#hidePwd").attr('type','text');
    }else{
        $($('#see')).removeClass('img02').addClass('img01');
        $("#hidePwd").attr('type','password');
    }
};


function gotoRegister(){
    if(isWeiXin()){
        window.location = getUrl("person/wechatOauth2Url?origin=微信快速注册");
    }else{
        window.location = "../../html/2_normal_sign/sign.html";
    }

}


function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}