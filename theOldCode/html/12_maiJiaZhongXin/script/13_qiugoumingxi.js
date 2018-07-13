
/**
 * 求购明细
 */
$(function(){

})
//获得网址上的参数
function getRequest(para) {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest[para];
}
var translationInfo = '';
var printerName = '';
var details = '';
var qiugouInfo = new Vue({
    el:"#qiugouInfo",
    data:{
        translationInfo:'',
        printerName:'',
        details:'',
        selected:[],
    },
    beforeCreate: function () {
        var translationNo = getRequest("translationNo");
        var flag = getRequest("flag");
        if(translationNo){
            $.jsonAjax(getUrl("askItemInfoController/askItemInfoMap"),{translationNo:translationNo,flag:flag},function(data,status,xhr){
                if(data.status=="200"){
                    translationInfo = data.data.translationInfo;
                    printerName = data.data.printerName;
                    details = data.data.details;
                }else{
                    printAlert(data.msg);
                    window.location = '../2_login_sign/login_common.html';
                }
            },false);
        }else{
            printAlert("参数错误");
            window.location = '../12_maiJiaZhongXin/13_woDeQiuGou_woDeQiuGou.html';
        }
    },
    created: function () {
        this.$data.translationInfo = translationInfo;
        this.$data.printerName = printerName;
        this.$data.details = details;
    },
    methods: {
        time: function (value) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date(parseInt(value));
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();

            return y + '-' + add0(m) + '-' + add0(d);
        },
        getImgUrl:function (name){
            return getImgUrl(name);
        },
        select:function (detail) {
            var index = this.selected.indexOf(detail);
            if(index>-1){
                this.selected.splice(index,1);
            }else{
                this.selected.push(detail);
            }
        },
        accept: function () {
            var detailId = '';
            for (var i=0;i<this.selected.length;i++ ) {
                var sel = this.selected[i];
                if (!sel.matPrice) {
                    popUp_auto_false(1000, "【" + sel.matDesc + "】还未报价，请等卖家报价后再接受!");
                    return;
                } else {
                    detailId += sel.id + ",";
                }
            }
            if (detailId.length > 1) {
                detailId = detailId.substring(0,detailId.length-1);
                $.jsonAjax(getUrl("askItemInfoJavaController/acceptTranslationInfo"), {ids: this.translationInfo.translationNo,detailId: detailId}, function (data, status, xhr) {
                    if (data.status = "200") {
                        printAlert('保存成功！');
                        window.location = '13_woDeQiuGou_woDeQiuGou.html';
                        console.log(data);
                    } else {
                        popUp_auto_false(1000, data.msg);
                    }
                }, false);
            } else {
                popUp_auto_false(1000, "请等待卖家报价后至少选择一条信息接受求购！");
            }
        },
    }
});