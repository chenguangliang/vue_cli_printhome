/**
 * Created by linxiaomei on 2017/4/11.
 */

var dateType = $.getUrlParam("dateType");
var year= $.getUrlParam("year");
var month= $.getUrlParam("month");
var beginTime= $.getUrlParam("beginTime");
var endTime= $.getUrlParam("endTime");


var souSuoVM = new Vue({
    el:"#souSuoVM",
    data:{
        dateTime:{
            year:'',
            month:'',
            beginTime:'',
            endTime:''
        },
        showSelect:true
    },
    methods:{
        searchOrderList: function () {
            //直接跳入有结果页面进行查询
            if(this.showSelect){
                window.location.href='./14_duiZhangDanGuanLi_chuangJianDuiZhangDan.html?year='+this.dateTime.year
                    +'&month='+this.dateTime.month+'&dateType=1&clickSouSuo=1';
            }else{
                window.location.href='./14_duiZhangDanGuanLi_chuangJianDuiZhangDan.html?beginTime='+this.dateTime.beginTime
                    +'&endTime='+this.dateTime.endTime+'&dateType=2&clickSouSuo=1';
            }

        }
    },
    beforeMount:function(){
        if(dateType == '1'){
            this.showSelect = true;
        }else if(dateType == '2'){
            this.showSelect = false;
        }

        this.dateTime.year = year;
        this.dateTime.month = month;
        //根据传来的参数值进行判断并初始化页面展示
        if(null!=beginTime && ''!=beginTime && null!=endTime && ''!=endTime){
            this.dateTime.beginTime = beginTime;
            this.dateTime.endTime = endTime;
            $('.dateTime select').css('display','block');
            $('.dateTime input').css('display','none');
        }

    },
    mounted:function(){
        initJqueryCase();
    }
})

function initJqueryCase() {
    //日期切换
    $('.dateTime img').click(function(){
        souSuoVM.$data.showSelect = !souSuoVM.$data.showSelect;

        cleanTime();
    });
    /*全选开始*/
    $(".quanxuan").click(function (e) {
        popUp_auto(1500,"对不起，您没有可选择的订单");
    });
    $(".del").click(function () {
        popUp_auto(1500,"对不起，您没有可选择的订单");
    });
}
function cleanTime() {
    //清空字符串时间防止后期方法判断的时候影响
    souSuoVM.$data.dateTime.beginTime='';
    souSuoVM.$data.dateTime.endTime='';
}