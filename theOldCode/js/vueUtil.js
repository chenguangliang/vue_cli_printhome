/**
 * Created by Administrator on 2017/4/5 0005.
 */
/**
*@fileName:vueUtil.js
*@author:fdc
*@time:2017/4/5 0005
*@disc:vue操作工具类  depend on vue.js
*/

/**
*@fileName:vueUtil.js
*@author:fdc
*@time:2017/4/5 0005
*@disc:将json 对象变为vue对象
*/
function traverseJsonToVue(jsonObj){
    for(key in jsonObj){
         Vue.set(jsonObj,key,jsonObj[key]);
    }
}