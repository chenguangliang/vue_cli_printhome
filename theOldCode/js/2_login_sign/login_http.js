function zh_login(){
    var url=getUrl("user/loginByPW");
    var remember="0";//记住密码 0/1
    var userName=getval("#username")//用户名
    var password=getval("#hidePwd");//密码
    var picCaptchaType="";//验证码

    var data={remember:remember,userName:userName,password:password,picCaptchaType:picCaptchaType};
    var success=function(data){
        if(flag_status(data)){
            msg(data);
        }else{
            msg(data);
        }
    }
    $.syncPost(url,data,success);
}
$(function(){
    var code_img=$("#changeTP");
    if(code_img != undefined){
        code_img.attr("src",getImgCode());
    }
})

/**
 * 获取手机验证码
 **/
function getPhoneCode(){
    var phone=getval("#phoneNumber");
    var url=getUrl("captcha/sendPhoneMessageMap");
    var data={contact:phone,type:2};
    var success=function(data){
        if(flag_status(data)){
            msg(data);
        }
    }
    $.syncPost(url,data,success)
}

/**
 * 手机号登录
 **/
function phoneLogin(){
    var phone=getval("#phoneNumber");
    var mscode=getval("#numberPic");
    var remember=null;
    var data={phone:phone,remember:remember,picCaptchaType:mscode};
    var success=function(data){
        if(flag_status(data)){
            msg(data);
        }else{
            msg(data);
        }
    }
    $.syncPost(getUrl("information/register/registOrLoginWxByPhone"),data,success)
}