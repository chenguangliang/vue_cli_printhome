/**
 * Created by fdc on 2017/5/18.
 */
/**
*@fileName:loginUtil.js
*@author:fdc
*@time:2017/5/18
*@disc:登录相关的js  depend on StorageUtil.js  jquery.js    cookieUtil.js
*/


/**
*@fileName:loginUtil.js
*@author:fdc
*@time:2017/5/18
*@disc:手机登录账号密码登录里边的微信登录
*/
function wxLogin(){
    //先判断缓存中是否有token
    $.jsonAjax(getUrl("person/checkAccessTokenExist"),{},function(data,status,xhr){
        if(data.success){
            $.jsonAjax(getUrl("checkOpenIdExistForWxLogin"),{},function(data,status,xhr){
                if(data.success){
                    //获取用户信息
                    StorageUtil.setUserInfo();
                    //设置用户区域信息
                    setLoginSuccessRegion();
                    popUp_auto(1500,"登录成功！");
                    window.setInterval("window.location='../../html/1_index/index.html'",1500);
                }else{
                    popUp_auto_false(1500,"您的账号暂未绑定登录请您先绑定微信在进行登录!");
                }
            });
        }else{
            window.location = getUrl("person/wxLoginGetToken");
        }
    });

}