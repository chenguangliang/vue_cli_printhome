/**
 * Created by Administrator on 2017/3/10 0010.
 */
/**
*@fileName:vueFilter.js
*@author:fdc
*@time:2017/3/10 0010
*@disc:vue常用过滤器
*/
/**
*@fileName:vueFilter.js
*@author:fdc
*@time:2017/3/10 0010
*@disc:替换商品详情里的图片
*/
let replaceSrcUrl=(sourceString,imageServerUrl)=>{
  let addr = "src="+imageServerUrl+"";
  return sourceString.replace(/src=\"\//,addr);
};
/**
*@fileName:vueFilter.js
*@author:fdc
*@time:2017/3/13 0013
*@disc:保留2位小数
*/
let toDecimal2=(value)=>{
  let f = parseFloat(value);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(value*100)/100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};
/**
*@fileName:vueFilter.js
*@author:fdc
*@time:2017/3/13 0013
*@disc:转换时间过滤器  前提需要引用comment.js
*/
let timestampFormat=(value,format)=> {
  return moment(value).format(format);
};

/**
*@fileName:vueFilter.js
*@author:fdc
*@time:2017/3/14 0014
*@disc:截取字符串过滤器
*/
let substringFilter=(value,start,end)=>{
  if(value){
    return value.substring(start,end);
  }
}

/**
 *@disc:截取字符串过滤器超过部分用...表示----用于0开始的截取
 */
let subEndFilter=(value,end)=>{
  if(value == "" || typeof(value) == 'undefined'){
    return "";
  }
  if(value.length>=(end)){
    return value.substring(0,end)+"...";
  }else{
    return value;
  }

}
/**
 * long转date
 * 返回格式：yyyy-MM-dd hh:mm:ss
 */
let longToDate=(long)=>{
    var datetime = new Date();
    datetime.setTime(long);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    if(month < 10){
        month = "0" + month;
    }
    var date = datetime.getDate();
    if(date < 10){
        date = "0" + date;
    }
    var hour = datetime.getHours();
    if(hour < 10){
        hour = "0" + hour;
    }
    var minute = datetime.getMinutes();
    if(minute < 10){
        minute = "0" + minute;
    }
    var second = datetime.getSeconds();
    if(second < 10){
        second = "0" + second;
    }
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
};
/**
 * long转date
 * 返回格式：yyyy-MM-dd
 */
let longToDateNoTime=(long)=>{
    var datetime = new Date();
    datetime.setTime(long);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    if(month < 10){
        month = "0" + month;
    }
    var date = datetime.getDate();
    if(date < 10){
        date = "0" + date;
    }
    return year + "-" + month + "-" + date;
};
/**
 * 楼层名称截取前2后2中间加一点
 * 返回格式：yyyy-MM-dd
 */
let floorTitleFilter=(value)=>{
    if(value.length>=2){
        var front = value.substring(0,2);
        var last = '';
        if(value.length == 3){
            last = value.substring(value.length-1,value.length);
        }else{
            last = value.substring(value.length-2,value.length);
        }
        return front+" · "+last;
    }else{
        return value;
    }
};
/**
 * author:cgl
 * 银行卡号每四位加个空格
 * 返回格式：
 */
let formatCard=(valve)=> {
    if(valve){
        return valve.replace(/(.{4})/g, "$1 ");
    }else{
        return "";
    }
};
/**
 * author:cgl
 * 去除空格
 * 返回格式：
 */
let deleteSpace=(valve)=> {
    if(valve){
        return valve.replace(/[ ]|[&nbsp;]/g, "");
    }else{
        return "";
    }
};
/**
 * author:cgl
 * 大于99显示99+
 * 返回格式：
 */
let cutTwo=(valve)=> {
    if(valve >99){
        return '99+';
    }else {
        return valve;
    }
};
/**
 * author:cgl
 * 只能输入两位小数的数字
 * <input type="text" v-model="selectedGoods.itemQuantity" v-two-Num="selectedGoods.itemQuantity" @keyup="computeItemTotal($event,index)" maxlength="10" >
 */
let twoNum=($event)=> {
        $event.value=$event.value.replace(/[^(^\d+\.{0,1}\d*$)]/g,'');
        extractNumber($event,2,false);
    };
/**
 * author:cgl
 * 只能输入数字
 * <input type="text" v-model="selectedGoods.itemQuantity" v-two-Num="selectedGoods.itemQuantity" @keyup="computeItemTotal($event,index)" maxlength="10" >
 */
let tel=($event)=> {
        $event.value=$event.value.replace(/\D/g,'');
    };

/**小數點保留
*@fileName:vueFilter.js
*@author:fdc
*@time:2017/9/12
*@disc:
*/
let toFixed=(valve,num)=> {
    value =Number(value).toFixed(num);
    return value;
};
export {
  replaceSrcUrl,
  toDecimal2,
  timestampFormat,
  substringFilter,
  subEndFilter,
  longToDate,
  longToDateNoTime,
  floorTitleFilter,
  formatCard,
  deleteSpace,
  cutTwo,
  twoNum,
  tel
  }
