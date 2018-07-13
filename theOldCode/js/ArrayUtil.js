/**
 * Created by Administrator on 2017/3/21 0021.
 */
/**
*@fileName:ArrayUtil.js
*@author:fdc
*@time:2017/3/21 0021
*@disc:数组操作公共js
*/
/**
 * 给予数组有删除元素的功能
 * @param val
 */
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}