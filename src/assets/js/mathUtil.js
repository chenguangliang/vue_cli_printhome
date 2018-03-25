/**
 * Created by Administrator on 2017/3/20 0020.
 */
/**
*@fileName:mathUtil.js
*@author:fdc
*@time:2017/3/20 0020
*@disc:计算相关的js
 *
*/

// 加法 num1 + num2  precision保留几位小数  解决0.1+0.2 不等于0.3的问题
function numAdd(num1, num2,precision) {
    if(!precision){
        precision=2;
    }
    var baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision);
}
function numAddForCart(num1, num2,precision) {//这个方法为了解决购物车中，整数添加商品后边有.00出现
    var num1Str=num1+'';
    if(!precision){
        precision=2;
    }
    var baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    if(num1Str.indexOf('.')==-1){
        return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(0);
    }else {
        return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision);
    }
}
// 减法 num1 - num2 precision保留几位小数 解决0.3-0.1 不等于0.2的问题
function numSub(num1, num2,precision) {
    if(!precision){
        precision=2;
    }
    var baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};
function numSubForCart(num1, num2,precision) { //这个方法为了解决购物车中，整数添加商品后边有.00出现
    var num1Str=num1+'';
    if(!precision){
        precision=2;
    }
    var baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    if(num1Str.indexOf('.')==-1){
        return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(0);
    }else {
        return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
    }
};
// 小数位decimalPlaceC
function decimalPlaceC(obj, decimalPlaces, allowNegative) {
    var temp = obj.value;
    // avoid changing things if already formatted correctly
    var reg0Str = '[0-9]*';
    if (decimalPlaces > 0) {
        reg0Str += '\\.?[0-9]{0,' + decimalPlaces + '}';
    } else if (decimalPlaces < 0) {
        reg0Str += '\\.?[0-9]*';
    }
    reg0Str = allowNegative ? '^-?' + reg0Str : '^' + reg0Str;
    reg0Str = reg0Str + '$';
    var reg0 = new RegExp(reg0Str);
    if (reg0.test(temp))
        return true;
    // first replace all non numbers
    var reg1Str = '[^0-9' + (decimalPlaces != 0 ? '.' : '')
        + (allowNegative ? '-' : '') + ']';
    var reg1 = new RegExp(reg1Str, 'g');
    temp = temp.replace(reg1, '');
    if (allowNegative) {
        // replace extra negative
        var hasNegative = temp.length > 0 && temp.charAt(0) == '-';
        var reg2 = /-/g;
        temp = temp.replace(reg2, '');
        if (hasNegative)
            temp = '-' + temp;
    }
    if (decimalPlaces != 0) {
        var reg3 = /\./g;
        var reg3Array = reg3.exec(temp);
        if (reg3Array != null) {
            // keep only first occurrence of .
            // and the number of places specified by decimalPlaces or the entire
            // string if decimalPlaces < 0
            var reg3Right = temp.substring(reg3Array.index
                + reg3Array[0].length);
            reg3Right = reg3Right.replace(reg3, '');
            reg3Right = decimalPlaces > 0 ? reg3Right.substring(0,
                decimalPlaces) : reg3Right;
            temp = temp.substring(0, reg3Array.index) + '.' + reg3Right;
        }
    }
    obj.value = temp;
}


//输入字符显示
function numInputForLength(obj,length,pointLength){
    //eval("var re = /^\\d{1,"+length+"}(?:\\.\\d{0,"+pointLength+"})?$/;");
    //校验如果为0开头那么在输入整数是变为这个整数
    eval("var reFirstPoint = /^0\\d+/")
    //校验如果小数点为0 时只能输入整数
    eval("var reInt = /^\\d*$/")
    //校验整数跟小数位置
    eval("var re = /^\\d{1,"+length+"}(?:\\.\\d{0,"+pointLength+"})?$/;");
    if(obj.value==obj.value2)
        return;
    if( obj.value.search(reFirstPoint)!=-1)
        obj.value=obj.value.replace(/(0+)(\d+)/,"$2");
    else if(pointLength == 0 && obj.value.search(reInt)==-1)
        obj.value=(obj.value2)?obj.value2:'';
    else if(obj.value != null && obj.value != "" && obj.value.search(re)==-1)
        obj.value=(obj.value2)?obj.value2:'';
    else obj.value2=obj.value;
}


/**
 * 校验小数点
 * @param obj
 * @param length
 * @param pointLength
 * @param vueObject
 * @param vueObjectAttr
 */
function numInputForLengthForVue(obj,length,pointLength,vueObject,vueObjectAttr){
    //eval("var re = /^\\d{1,"+length+"}(?:\\.\\d{0,"+pointLength+"})?$/;");
    //校验如果为0开头那么在输入整数是变为这个整数
    eval("var reFirstPoint = /^0\\d+/")
    //校验如果小数点为0 时只能输入整数
    eval("var reInt = /^\\d*$/")
    //校验整数跟小数位置
    eval("var re = /^\\d{1,"+length+"}(?:\\.\\d{0,"+pointLength+"})?$/;");
    if(obj.value==obj.value2)
        return;
    if( obj.value.search(reFirstPoint)!=-1){
        obj.value=obj.value.replace(/(0+)(\d+)/,"$2");
        this.setVueAttrVal(vueObject,vueObjectAttr,obj.value);
    }
    else if(pointLength == 0 && obj.value.search(reInt)==-1){
        obj.value=(obj.value2)?obj.value2:'';
        this.setVueAttrVal(vueObject,vueObjectAttr,obj.value);
    }
    else if(obj.value != null && obj.value != "" && obj.value.search(re)==-1){
        obj.value=(obj.value2)?obj.value2:'';
        this.setVueAttrVal(vueObject,vueObjectAttr,obj.value);
    }
    else{
        obj.value2=obj.value;
        this.setVueAttrVal(vueObject,vueObjectAttr,obj.value);
    }
}

/**
 * 动态根据属性名字设置属性值
 * @param vueObject
 * @param vueObjectAttr
 * @param value
 */
function setVueAttrVal(vueObject,vueObjectAttr,value){
    for(item in vueObject){
        if(item == vueObjectAttr){
            vueObject[item] = value;
            break;
        }
    }
}
function time(value) {
    function add0(m) {
        return m < 10 ? '0' + m : m
    }
    var time = new Date(value);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();

    return y + '-' + add0(m) + '-' + add0(d);
}
function setDateRange(obj,min,minErrText,max,maxErrText,vueObject,vueObjectAttr){
    var inRange = true;
    var theDate = time(obj.value);
    var errStr = "";
    if(min) {
        if (theDate < min) {
            if (minErrText && minErrText != "") {
                errStr = minErrText;
            } else {
                errStr += "所选时间不能早于" + min;
            }
            inRange = false;
        }
    }
    if(inRange&&max) {
        if(theDate>max){
            if(maxErrText&&maxErrText!=""){
                errStr = maxErrText;
            }else{
                errStr += "所选时间不能晚于"+min;
            }
            inRange = false;
        }
    }
    if(inRange){
        if(vueObject){
            this.setVueAttrVal(vueObject,vueObjectAttr,obj.value);
        }else{
            return;
        }
    }else{
        popUp_auto_false(1500,errStr);
        if(vueObject){
            this.setVueAttrVal(vueObject,vueObjectAttr,"");
            obj.value="";
        }else{
            obj.value="";
        }
        
    }

}

var math = {
    methods: {
        numInputForLength: function (obj,length,pointLength) {
            numInputForLength(obj.currentTarget,length,pointLength);
        },
        numInputForLengthForVue: function (obj,length,pointLength,vueObject,vueObjectAttr) {
            numInputForLengthForVue(obj.currentTarget,length,pointLength,vueObject,vueObjectAttr);
        },
        dateInputForRange:function (obj,min,minErrText,max,maxErrText,vueObject,vueObjectAttr) {
            var minDate = min?time(min):null;
            var maxDate = max?time(max):null;
            setDateRange(obj.currentTarget,minDate,minErrText,maxDate,maxErrText,vueObject,vueObjectAttr);
        },
        numAdd:numAdd,
        numSub:numSub
    }
}