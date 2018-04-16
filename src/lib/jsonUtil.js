/**
 * Created by Administrator on 2017/3/9 0009.
 */
/**
*@fileName:jsonUtil.js
*@author:fdc
*@time:2017/3/9 0009
*@disc: json字符串处理工具
*/

/**
*@fileName:jsonUtil.js
*@author:fdc
*@time:2017/3/9 0009
*@disc:将json 数组push另一个数组里
*/
function pushJsonArray(source,target){
    for(var i = 0; i < target.length ;i++ ){
        source.push(target[i]);
    }
    return source;
}

/**
*@fileName:jsonUtil.js
*@author:fdc
*@time:2017/3/28 0028
*@disc:json 去空操作，数据修改后一些空值提交报400 错误。
*/
function filterJSONNULL(source){
    for(var key in source){
        if(source[key] == null || typeof(source[key]) == undefined || source[key] == "" || source[key] == "null"){
            delete source[key];
        }
    }
    return source;
}

/**
 *@fileName:jsonUtil.js
 *@author:fdc
 *@time:2017/3/28 0028
 *@disc:json 去除一些提交不想要的字段
 */
function deleteJSONFiled(source,sourceName){
    for(var key in source){
        if(key == sourceName){
            delete source[key];
        }
    }
    return source;
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

/**
*@fileName:jsonUtil.js
*@author:fdc
*@time:2017/3/30 0030
*@disc:取出json中所有数据的value
*/
function getValueForJson(obj){
    var result = [];
    for(key in obj){
        result.push(obj[key]);
    }
    return result;
}

/**
 * date转为long
 * @param date
 * @returns
 */
function dateToLong(date) {
    return new Date(date).getTime();
};

/**
 *初始化json原始json 数据
 * 比如初始化 json中默认值中有数据而结果中没有数据那么不会覆盖原来初始化的值进行复制
 * source:{
 *      id:1,
 *      name:"",
 * }
 * target:{
 *
 *      id:"",
 *      name:"2"
 * }
 *
 * source变为
 * source:{
 *      id:"1",
 *      name:"2",
 *
 * }
 *
*@fileName:jsonUtil.js
*@author:fdc
*@time:2017/4/5 0005
*@disc: 目标属性不能空时进行覆盖
*/
function copyJsonFilterInit(source,target){
    for(key in target){
        //如果目标此元素!=null进行值覆盖
        if(isNotBlank(target[key])){
            //判断source此致初始化
            source[key] = target[key];
        }//如果为空那么看source此值是否为空  如果为空那么变为空，否则继续source原来的值
    }

}

/**
*@fileName:jsonUtil.js
*@author:fdc
*@time:2017/5/5
*@disc:  var srouce= [{id:1,checked:false},{id:2,checked:true}];
 * deleteJsonArrayItem(srouce,'checked');
 * 输出 srouce =  [{id:1,checked:false}];
*/
function deleteJsonArrayItem(source,deleteFlagFiled){
    for(var i=0,flag=true,len=source.length;i<len;flag ? i++ : i){
        if( source[i]&&getJsonFiledValue(source[i],deleteFlagFiled)){
            source.splice(i,1);
            flag = false;
        } else {
            flag = true;
        }
    }
}

/**
 * 获取json数据的属性值
 * @param source
 * @param filedName
 *
 * var filedName = "checked";
 * source = {id:1,checked:false};
 * getJsonFiledValue(source,filedName);
 * 结果:false
 */
function getJsonFiledValue(source,filedName){
    for(key in source){
        if(key == filedName){
            return source[key];
        }
    }
}
export default {
  pushJsonArray,
  filterJSONNULL,
  deleteJSONFiled,
  isNotBlank,
  getValueForJson,
  dateToLong,
  copyJsonFilterInit,
  deleteJsonArrayItem,
  getJsonFiledValue
}
