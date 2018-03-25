/**
 * Created by Administrator on 2017/3/14 0014.
 */
/**
*@fileName:cookieUtil.js
*@author:fdc
*@time:2017/3/14 0014
*@disc:设置cookie.js  depend on jquery.cookie.js
*/

/**
*@fileName:cookieUtil.js
*@author:fdc
*@time:2017/3/14 0014
*@disc:设置区域cookie
*/
function setRegionCookie(code,name){
    $.cookie('region',name,{expires: 7, path:"/"});
    $.cookie('regionCode',code,{expires: 7, path:"/"});
}

/**
 * 获取当前用户获取的区域
 * @param code
 * @returns {*}
 */
function getRegionCookieCode(){
    var regionCode = $.cookie('regionCode');
    if(!isNotBlank(regionCode)){
        return '11';
    }else{
        return regionCode;
    }
}

/**
 * 获取当前用户name
 * @param code
 * @returns {*}
 */
function getRegionCookieName(){
    var region = $.cookie('region');
    if(!isNotBlank(region)){
        return '北京';
    }else{
        return region;
    }
}


function setLoginSuccessRegion(){
    if(isNotBlank(getRegionCookieCode())){
        setRegionCookie(getRegionCookieCode(),getRegionCookieName());
    }else{
        setRegionCookie("11","北京");
    }
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