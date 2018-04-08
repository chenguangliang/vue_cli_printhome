~function (desW) {
    var winW = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}(640);


/*百度统计代码*/
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?66f31e694760ec9f424809dc7d2d4c36";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();




/**
 *@fileName:printhomeConfirm.js
 *@arguments:提示语，点击确定执行的回调，点击取消执行的回调
 *@author:chenGuangLiang
 *@time:2017/5/16
 *@disc:此js重写了系统自带的confirm
 * depend on jquery.js
 */
/*document.write('<div class="confirmWrap"><div class="confirmCon"><h5>提示</h5><p class="confirmMsg"></p><div class="confirmLine"></div><div class="btnWrap"><span class="confirmBtn cancle">取消</span><span class="confirmBtn sure">确定</span></div></div></div>');

function printConfirm(msg, sureCallback,cancleCallback) {
    $(".confirmMsg").html(msg);
    $(".confirmWrap").show();
    $(".confirmWrap .sure").one("click",function () {
        $(".confirmWrap").hide();
        if (sureCallback && (typeof sureCallback) == "function") {
            sureCallback();
            return;
        }
    });
    $(".confirmWrap .cancle").one("click",function () {
        $(".confirmWrap").hide();
        if (cancleCallback && (typeof cancleCallback) == "function") {
            cancleCallback();
            return;
        }
    });
}*/
//TODO:弹窗写成组件

/**
 *@fileName:printhomeConfirm.js
 *@arguments:提示语，点击确定执行的回调，点击取消执行的回调
 *@author:chenGuangLiang
 *@time:2017/5/16
 *@disc:此js重写了系统自带的alert
 * depend on jquery.js
 */
/*
document.write('<div class="alertWrap"><div class="alertCon"><h5>提示</h5><p class="alertMsg"></p><div class="alertLine"></div><div class="btnWrap"><span class="alertBtn sure">确定</span></div></div></div>');

function printAlert(msg, sureCallback) {
    $(".alertMsg").html(msg);
    $(".alertWrap").show();
    $(".alertWrap .sure").click(function () {
        $(".alertWrap").hide();
        if (sureCallback && (typeof sureCallback) == "function") {
            sureCallback();
            return;
        }
    });
}
*/
//TODO:弹窗写成组件

//滑动结束后，计算距离顶部的值
function scrollerTranY() {
    var translates = $("#scroller").css("transform");
    var tansY = parseFloat(translates.substring(7).split(',')[5]);
    return tansY;
}
//操作距离顶部的数值
function scrollerTo(distance) {
    $("#scroller").css("transform","translate(0px, "+distance+"px)");
}
