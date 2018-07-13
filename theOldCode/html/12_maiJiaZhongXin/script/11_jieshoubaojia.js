
/**
 * 报价（询价）明细
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
var details = [];
var orders = [];
var inquiryNo = '';
var priceInfo = new Vue({
    el:"#priceInfo",
    data:{
        details:[],
        orders:[],
        selected:[],
    },
    beforeCreate: function () {
        inquiryNo = getRequest("inquiryNo");
        var flag = getRequest("flag");
        if(inquiryNo){
            $.jsonAjax(getUrl("requestPriceJavaController/getDetaiInfoMap"),{inquiryNo:inquiryNo,flag:flag},function(data,status,xhr){
                if(data.status=="200"){
                    details = data.data.resultDetail.result.rows;
                    orders = data.data.orderMapList;
                }else{
                    printAlert(data.msg);
                    window.location = '../2_login_sign/login_common.html';
                }
            },false);
        }else{
            printAlert("参数错误");
            window.location = '../12_maiJiaZhongXin/11_xunJiaGuanLi_xunJiaGuanLi.html';
        }
    },
    created: function () {
        this.$data.details = details;
        this.$data.orders = orders;
    },
    mounted:function () {
        $(".zhanKai").click(function(){
            $(this).parent().next('.mingXi').slideToggle();
            if($(this).children('.jianTou').hasClass('zhiFuDown')){
                $(this).children('.jianTou').removeClass('zhiFuDown').addClass('zhiFuUp');
                $(this).parent().siblings('.line').hide();
            }else{
                $(this).children('.jianTou').removeClass('zhiFuUp').addClass('zhiFuDown');
                $(this).parent().siblings('.line').show();
            }
        });
    },
    methods: {
        time: function (value) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            if(value){
                var time = new Date(parseInt(value));
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();

                return y + '-' + add0(m) + '-' + add0(d);
            }else {
                return ' - ';
            }

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
                    popUp_auto_false(1000, "【" + sel.itemName + "】还未报价，请等卖家报价后再接受!");
                    return;
                } else {
                    detailId += sel.id + ",";
                }
            }
            console.log(detailId);
            if (detailId.length > 1) {
                detailId = detailId.substring(0,detailId.length-1);
                $.jsonAjax(getUrl("requestPriceJavaController/commitInquiryYes"), {ids: inquiryNo,detailIds: detailId}, function (data, status, xhr) {
                    if (data.status = "200") {
                        printAlert('保存成功！');
                        window.location = '11_xunJiaGuanLi_xunJiaGuanLi.html?label=multiple';
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