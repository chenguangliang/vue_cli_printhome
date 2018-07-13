
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
var inquiryInfoMap = {};
var flag = "";
var priceInfo = new Vue({
    el:"#priceInfo",
    data:{
        details:[],
        orders:[],
        inquiryInfoMap:{},
    },
    mixins:[common],
    beforeCreate: function () {
        var inquiryNo = getRequest("inquiryNo");
        flag = getRequest("flag");
        if(inquiryNo){
            $.jsonAjax(getUrl("requestPriceJavaController/getDetaiInfoMap"),{inquiryNo:inquiryNo,flag:flag},function(data,status,xhr){
                if(data.status=="200"){
                    details = data.data.resultDetail.result.rows;
                    orders = data.data.orderMapList;
                    inquiryInfoMap = data.data.inquiryInfo;
                    console.log(inquiryInfoMap)
                }else{
                    popUp_auto_false(1000,data.msg);
                    setTimeout("window.location = '../2_login_sign/login_common.html'",1500);
                }
            },false);
        }else{
            popUp_auto_false(1000,"参数错误");
            setTimeout("window.location = '../12_maiJiaZhongXin/11_xunJiaGuanLi_xunJiaGuanLi.html'",1500);
        }
    },
    created: function () {
        this.$data.details = details;
        this.$data.orders = orders;
        this.$data.inquiryInfoMap = inquiryInfoMap;
    },
    mounted:function () {
        //选项卡切换
        $(".xuanXiangKa ul li").click(function(){
            $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
            var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
            $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
            $(".caoZuoAnNiu a").eq(index).show().siblings().hide();//促销管理
        });
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
        intercept('.xianZhi',8);
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
        getImgUrl:function (name){
            return getImgUrl(name);
        },
    }
});
function goback() {
    // ../../html/18_maiJiaZhongXin/2_baoJiaGuanLi_baoJiaGuanLi.html?label=multiple
    if(flag=="response"){
        window.location = '../../html/18_maiJiaZhongXin/2_baoJiaGuanLi_baoJiaGuanLi.html?label=multiple';
    }else if(flag=="request"){
        window.location = '../../html/12_maiJiaZhongXin/11_xunJiaGuanLi_xunJiaGuanLi.html?label=multiple';
    }
}