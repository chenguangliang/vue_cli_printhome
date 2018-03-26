
/**
 * 报价（询价）明细
 */
$(function(){

})
var detail = [];
var orders = [];
var inquiryId = '';
var danyiInfo = new Vue({
    el:"#danyiInfo",
    data:{
        detail:[],
        orders:[],
        selected:[]
    },
    mixins:[math],
    beforeCreate: function () {
        inquiryId = $.getUrlParam("inquiryId");
        if(inquiryId){
            $.jsonAjax(getUrl("sellercenter/inquiryInfo"),{id:inquiryId},function(data,status,xhr){
                detail = data.result;
                console.log(detail)
            },false);
        }else{
            console.log(inquiryId)
            popUp_auto_false(1000,"参数错误");
            // setTimeout("window.location = '../18_maiJiaZhongXin/2_baoJiaGuanLi_baoJiaGuanLi.html'",1500);
        }
    },
    created: function () {
        this.$data.detail = detail;
        // this.$data.orders = orders;
    },
    mounted:function () {
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
        getImgUrl:function (name){
            return getImgUrl(name);
        },
    }
});