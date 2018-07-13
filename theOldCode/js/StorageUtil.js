/**
 * Created by Administrator on 2017/3/30 0030.
 */

/**
*@fileName:StorageUtil.js
*@author:fdc
*@time:2017/3/30 0030
*@disc:此js为了页面传输大量数据时使用
 * depend on jquery.js , request.js
 *
 *
*/


/**
 *
 *readonly int sessionStorage.length ：返回一个整数，表示存储在 sessionStorage 对象中的数据项(键值对)数量。
 *
 * string sessionStorage.key(int index) ：返回当前 sessionStorage 对象的第index序号的key名称。若没有返回null。

 方法 string sessionStorage.getItem(string key) ：返回键名(key)对应的值(value)。若没有返回null。

 方法 void sessionStorage.setItem(string key, string value) ：该方法接受一个键名(key)和值(value)作为参数，将键值对添加到存储中；如果键名存在，则更新其对应的值。

 方法 void sessionStorage.removeItem(string key) ：将指定的键名(key)从 sessionStorage 对象中移除。

 方法 void sessionStorage.clear() ：清除 sessionStorage 对象所有的项。
 *
 *
 *
 */
//获取用户信息key
//var currentUserInfo = 'currentUserInfo'+ uid + commonPlatformId;


var StorageUtil  = new Object();
var valueTypeJSON  = "JSON";
var valueTypeObject = "OBJECT";
StorageUtil.setItem = function(key,value){
    if( typeof value == 'object'){
        sessionStorage.setItem(key,JSON.stringify(value));
    }else{
        sessionStorage.setItem(key,value);
    }
};

StorageUtil.getItem = function(key){
    return JSON.parse(sessionStorage.getItem(key));
}

StorageUtil.getItemBytpe = function(key,type){
    if(type == valueTypeJSON){
        return JSON.parse(sessionStorage.getItem(key));
    }else if(type == valueTypeObject){
        return sessionStorage.getItem(key)
    }
}

StorageUtil.clear =function (){
    sessionStorage.clear();
}


StorageUtil.removeItem =function (key){
    sessionStorage.removeItem(key);
}

/**
 *
 *
*@fileName:StorageUtil.js
*@author:fdc
*@time:2017/4/1 0001
*@disc: 本地获取用户信息
 *1 首先通过  commomPlatformId_uid 获取是否存在用户uid  如果存在.
 *
 *
 *2 commomPlatformId_uid_currentUserInfo 获取用户信息.
 *
*/
StorageUtil.getUserInfo =function (){
    var commomPlatformId_currentUserUid = commonPlatformId + "_" + currentUserUid;
    var uid = StorageUtil.getItem(commomPlatformId_currentUserUid);
    var userInfo = "";
    if(isNotBlank(uid)){
        userInfo = StorageUtil.getItem(commomPlatformId_currentUserUid + "_"+  currentUserInfo);
        if(isNotBlank(userInfo)){
            return userInfo;
        }else{
            StorageUtil.setUserInfo();
            return StorageUtil.getItem(commomPlatformId_currentUserUid + "_"+  currentUserInfo);
        }
    }else{
        StorageUtil.setUserInfo();
        return StorageUtil.getItem(commomPlatformId_currentUserUid + "_"+  currentUserInfo);
    }
}

/**
*@fileName:StorageUtil.js
*@author:fdc
*@time:2017/4/1 0001
*@disc:设置用户信息
*/
StorageUtil.setUserInfo = function(){
    //获取用户信息
    $.jsonAjax(getUrl('user/getUserByIdForLogin'),{},function(data, status, xhr){
        if(data.success){
            StorageUtil.setItem(commonPlatformId + "_" + currentUserUid,data.result.uid);
            StorageUtil.setItem(commonPlatformId + "_" + currentUserUid  + "_" + currentUserInfo,data.result);
        }
    },false);

}


StorageUtil.getRandom = function(){
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for(var i = 0; i < 4 ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return new Date().getTime() + res;
}

/**
 *@fileName:jsonUtil.js
 *@author:fdc
 *@time:2017/3/29 0029
 *@disc:校验空值
 */
function isNotBlank(source){
    if(source == null || typeof(source) == "undefined" || source == "" || source == "NaN"){
        return false
    }else{
        return true;
    }
}




