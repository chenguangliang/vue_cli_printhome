
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
        selected:[]
    },
    mixins:[math],
    beforeCreate: function () {
        inquiryNo = getRequest("inquiryNo");
        var flag = getRequest("flag");
        if(inquiryNo){
            $.jsonAjax(getUrl("requestPriceJavaController/getDetaiInfoMap"),{inquiryNo:inquiryNo,flag:flag},function(data,status,xhr){
                if(data.status=="200"){
                    details = data.data.resultDetail.result.rows;
                    orders = data.data.orderMapList;
                    var formatData = Vue.filter('timestampFormat');
                    for(var i=0;i<details.length;i++){
                        var detail = details[i];
                        if(detail.beginDate){
                            detail.beginDate = formatData(detail.beginDate,'YYYY-MM-DD');
                        }
                        if(detail.endDate){
                            detail.endDate = formatData(detail.endDate,'YYYY-MM-DD');
                        }
                    }
                }else{
                    popUp_auto_false(1000,data.msg);
                    setTimeout("window.location = '../2_login_sign/login_common.html'",1500);
                }
            },false);
        }else{
            popUp_auto_false(1000,"参数错误");
            window.setTimeout(function(){
                goback();
            },1000)
            // setTimeout("window.location = '../18_maiJiaZhongXin/2_baoJiaGuanLi_baoJiaGuanLi.html'",1500);
        }
    },
    created: function () {
        this.$data.details = details;
        this.$data.orders = orders;
    },
    mounted:function () {
        $(".zhanKai").click(function(){
            $(this).next('.mingXi').slideToggle();
            if($(this).children('.jianTou').hasClass('zhiFuDown')){
                $(this).children('.jianTou').removeClass('zhiFuDown').addClass('zhiFuUp');
                $(this).siblings('.line').hide()
            }else{
                $(this).children('.jianTou').removeClass('zhiFuUp').addClass('zhiFuDown');
                $(this).siblings('.line').show();
            }
        });
    },
    methods: {
        nowDate: function () {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date();
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();

            return y + '-' + add0(m) + '-' + add0(d);
        },
        time: function (value) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            if(value){
                var time = new Date(value);
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
        submit: function () {
            var id = new Array();
            var nums = new Array();
            var price = new Array();
            var detailstartDate = new Array();
            var detailendDate = new Array();
            for(var i=0;i<this.details.length;i++){
                var det = this.details[i];
                var beginDate = $("#beginDate_"+det.id).val();
                var endDate = $("#endDate_"+det.id).val();
                if(det.matPrice){
                    if(!beginDate){
                        popUp_auto_false(1000, "有效日期(始)必填!");
                        return;
                    }
                    if(this.time(new Date()) > beginDate){
                        popUp_auto_false(1000, "有效日期(始)不能小于今天!");
                        return;
                    }
                    if(!endDate){
                        popUp_auto_false(1000, "有效日期(止)必填!");
                        return;
                    }
                    if(new Date(beginDate) > new Date(endDate)){
                        popUp_auto_false(1000, "有效日期(止)不能小于有效日期(始)!");
                        return;
                    }
                }
                id[i] = det.id;
                nums[i] = det.quantity;
                price[i] = det.matPrice;
                detailstartDate[i] = beginDate;
                detailendDate[i] = endDate;
            }
            var data={
                inquiryNo:inquiryNo,
                "ids":id.join(","),
                "nums":nums.join(","),
                "prices":price.join(","),
                "detailstartDates":detailstartDate.join(","),
                "detailendDates":detailendDate.join(",")
            }
            $.jsonAjax(getUrl("requestPriceJavaController/resopnseModifyInquiry"), data, function (data, status, xhr) {
                if (data.status = "200") {
                    popUp_auto(1000,'保存成功！');
                    // setTimeout("window.location = '2_baoJiaGuanLi_baoJiaGuanLi.html'",1500);
                    window.setTimeout(function(){
                        goback();
                    },1000)

                } else {
                    popUp_auto_false(1000, data.msg);
                }
            }, false);
        },
    }
});

function goback() {
    window.location = '../../html/18_maiJiaZhongXin/2_baoJiaGuanLi_baoJiaGuanLi.html?label=multiple';
}