//回到顶部按钮
$(window).scroll(function () { //scroll--浏览器滚动条滚动式触
    var wHeight = $(window).height(); //获取浏览器可视窗口高
    var wTop = $(window).scrollTop(); //获取滚动条距离顶部高
    if (wTop >= wHeight)  //当滚动条距离顶部高度超过1屏时执行
    {
        $("#top").show();  //返回顶部按钮显示
    }
    else {
        $("#top").hide();  //返回顶部按钮隐藏
    }
});
/*回到顶部，注册在自己的vue的methods里*/
function goToTop() {
    $("html,body").animate({scrollTop: 0}, 200);  //页面500毫秒返回顶部
}
//阻止频道滑动穿透
$('body').on("touchmove", function(e) {
    if ($("#zhezhao").css('display') == 'block') {
        e.preventDefault();
    }else{
    }
});

/*点击input会把固定定位的元素先隐藏起来*/
function input_hide(input_el, hide_el) {
    $(input_el).focus(function () {
        $(hide_el).addClass("none");
    });
    $(input_el).blur(function () {
        $(hide_el).removeClass("none");
    });
}

//截取两位整数
function cutOut(classname, needLeng) {
    var thisClass = $(classname);
    var length = thisClass.length;
    for (var i = 0; i < length; i++) {
        if (thisClass[i].innerHTML.length > needLeng) {
            var nowWord = '99+';
            thisClass[i].innerHTML = nowWord;
        }
    }
}

//去除字符串中空格
function del_space(str) {
    var str1="";
    for (var i = 0; i < str.length; i++) {
        if (str[i]!=" ") {
            str1+=str[i];
        }
    }
    //str1=str1.replace(/[\r\n]/g, "");
    return str1;
}


//截取字数
function testAuto(classname, needLeng) {
    var thisClass = $(classname);
    var length = thisClass.length;
    for (var i = 0; i < length; i++) {
        if (thisClass[i].innerHTML.length > needLeng) {
            var nowWord = thisClass[i].innerHTML.substr(0, needLeng) + '...';
            thisClass[i].innerHTML = nowWord;
        }
    }
}

function intercept(classname, needLeng) {
    var thisClass = $(classname);
    var length = thisClass.length;
    for (var i = 0; i < length; i++) {
        var str=del_space($(thisClass[i]).text());
        if (str.length > needLeng) {
            var nowWord = del_space($(thisClass[i]).text()).substr(0, needLeng) + '...';
            thisClass[i].innerHTML = nowWord;
        }
    }
}

//下拉框默认颜色
var unSelected = "#333";
var selected = "#333";
$(function () {
    $("select").css("color", unSelected);
    $("option").css("color", selected);
    $("select").change(function () {
        var selItem = $(this).val();
        if (selItem == $(this).find('option:first').val()) {
            $(this).css("color", unSelected);
        } else {
            $(this).css("color", selected);
        }
    });
});

/**
 * cgl 2017/5/3
 * For form validation, let the input border turn red, let the red tip display
 * 用于表单验证，让input边框变红，让红色提示语显示
 * @param “#a”或".a"
 * @returns
 */
function showWrong(idOrClass, msgClassName) {
    $(idOrClass).removeClass("ccc_border").addClass("red_border");
    $(msgClassName).removeClass("none");
}
/**
 * cgl 2017/5/3
 * For form validation, let the input border grayed out and let the red tip disappear
 * 用于表单验证，让input边框变灰，让红色提示语消失
 * @param “#a”或".a"
 * @returns
 */
function delWrong(idOrClass, msgClassName) {
    $(idOrClass).addClass("ccc_border").removeClass("red_border");
    $(msgClassName).addClass("none");
}

/**
 * 返回浏览器上一页
 */
function gotoBackPreviousPage(){
    window.history.back(-1);
}

var common = {
    mounted:function(){
        $("#top").click(function(){
            goToTop();
        });
    },
    methods:{
        isEmptyObject:function (obj) {
            var t;
            for (t in obj)
                return false;
            return true;
        },
        getImgUrl:function (name){
            var url = "";
            if(name){
                url = getImgUrl(name);
            }
            return url;
        },
    }
};

//阻止弹窗下边的页面滑动
function clockedBody() {
    $("html,body").addClass("lockedPage")
}
function unClockedBody() {
    $("html,body").removeClass("lockedPage")
}

// 小数位控制 cgl
function extractNumber(obj, decimalPlaces, allowNegative) {
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
    if (reg0.test(temp)) return true;
    // first replace all non numbers
    var reg1Str = '[^0-9' + (decimalPlaces != 0 ? '.' : '') + (allowNegative ? '-' : '') + ']';
    var reg1 = new RegExp(reg1Str, 'g');
    temp = temp.replace(reg1, '');
    if (allowNegative) {
        // replace extra negative
        var hasNegative = temp.length > 0 && temp.charAt(0) == '-';
        var reg2 = /-/g;
        temp = temp.replace(reg2, '');
        if (hasNegative) temp = '-' + temp;
    }
    if (decimalPlaces != 0) {
        var reg3 = /\./g;
        var reg3Array = reg3.exec(temp);
        if (reg3Array != null) {
            var reg3Right = temp.substring(reg3Array.index + reg3Array[0].length);
            reg3Right = reg3Right.replace(reg3, '');
            reg3Right = decimalPlaces > 0 ? reg3Right.substring(0, decimalPlaces) : reg3Right;
            temp = temp.substring(0, reg3Array.index) + '.' + reg3Right;
        }
    }
    obj.value = temp;
}

//把对象复制一份，老对象地址改变
function copyObj(p) {
    var c = {};
    for (var i in p) {
        c[i] = p[i];
    }
    return c;
}
//把一个对象的值复制一份，地址不变
function copyObjValue(oldObj,newObj) {
    for(var i in oldObj){
        oldObj[i]=newObj[i];
    }
};
//清空对象
/*
function clearObj() {
    for(var i in this){
        var temp1=this[i];
        if(temp1 instanceof Function ){
            //这里的检测是避免把继承的方法也干空，如上边的copyObjValue方法和clearObj方法
        }else {
            this[i]="";
        }

    }
};
*/



