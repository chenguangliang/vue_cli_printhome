/**
 * 所输入内容校验
 * @param value
 * @returns {string}
 */
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
function checkTextRegular(obj,regular,errStr,vueObject,vueObjectAttr) {
    eval("var reg = "+regular)
    if(reg.test(obj.value)){
        obj.value2=obj.value;
        if(vueObject){
            this.setVueAttrVal(vueObject,vueObjectAttr,obj.value);
        }
    }else{
        popUp_auto_false(1500,errStr);
        obj.value=(obj.value2)?obj.value2:'';
        if(vueObject){
            this.setVueAttrVal(vueObject,vueObjectAttr,obj.value);
        }
    }
}

var textRegular = {
    methods: {
        textRegular:function (obj,regular,errStr,vueObject,vueObjectAttr) {
            checkTextRegular(obj.currentTarget,regular,errStr,vueObject,vueObjectAttr);
        },

    }
}