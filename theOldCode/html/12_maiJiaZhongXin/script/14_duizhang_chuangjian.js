/**
 * Created by linxiaomei on 2017/4/11.
 */
var pagerOut = '';
var orderListOut=[];
var dateType = $.getUrlParam("dateType");

var yearOut='';
var monthOut = '';
var beginTimeOut='';
var endTimeOut ='';
if(dateType =='2'){
    beginTimeOut= $.getUrlParam("beginTime");
    endTimeOut= $.getUrlParam("endTime");
}else{
    var date = new Date();
    yearOut= $.getUrlParam("year");
    if(null== yearOut ||yearOut == ''||typeof(yearOut) == 'undefined'){
        yearOut = date.getFullYear();
    }
    monthOut= $.getUrlParam("month");
    if(null== monthOut ||monthOut == ''||typeof(monthOut) == 'undefined'){
        monthOut = date.getMonth()+1;
    }
}
var clickSouSuoOut = $.getUrlParam("clickSouSuo");

var querydata={
    userType:2,
    year: yearOut,
    month: monthOut,
    beginTime:beginTimeOut,
    endTime:endTimeOut,
    pageNo:1,
    pageSize:10

};


var souSuoTimeVM = new Vue({
    el:"#allPageDiv",
    data:{
        imgUrl:img_url,
        dateTime:{
            year:'',
            month:'',
            beginTime:'',
            endTime:''
        },
        pager:'',
        orderList:[],
        checkedOrdersStr:'',
        showSelect:true,
        clickSouSuo:false,
        quanxuanImg:'../../img/no-select.png',
        quanxuanImgUrl:{
            selectNo:'../../img/no-select.png',
            selectYes:'../../img/yes-select.png'
        }
    },
    methods:{
        //订单详情
        toOrderDetail:function(orderId,passKey) {
            var temp = this;
            var paramData = {
                orderId:orderId,
                passKey:passKey
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanXiangQing2.html?"+ $.assemblyRequestString(paramData);
        }
        ,addAllToCheckedOrders: function () {
            if(this.checkedOrdersStr == ''){
                for(var i=0;i<this.orderList.length;i++){
                    this.checkedOrdersStr = this.checkedOrders + "," + this.orderList[i].orderId;
                }
            }else{
                var splitOrders = this.checkedOrdersStr.substring(1,this.checkedOrdersStr.length-1).split(",");
                if(splitOrders.length == this.orderList.length){//再一次点击的全选
                    this.checkedOrdersStr = '';//先清空
                }else{
                    this.checkedOrders = '';//先清空再添加
                    for(var i=0;i<this.orderList.length;i++){
                        this.checkedOrdersStr = this.checkedOrdersStr + "," + this.orderList[i].orderId;
                    }
                }

            }


        }
        ,addTocheckedOrders: function (porderId) {
            if(this.checkedOrdersStr.indexOf(porderId) == -1){
                this.checkedOrdersStr = this.checkedOrdersStr+","+porderId;//开始的格式就是  ,201705050177301,201705050177302
            }else{
                this.checkedOrdersStr = this.checkedOrdersStr.replace(","+porderId,"");
            }
        }
        ,genarteOrder: function () {
            if(this.checkedOrdersStr == ''){
                popUp_auto_false(1000,"请选择订单");
                return false;
            }
            var qdata = {
                datas:this.checkedOrdersStr.substring(1,this.checkedOrdersStr.length),//因为第一位是,
                userType:2
            };
            var flag = false;
            $.jsonAjax(getUrl("statement/newStatement"), qdata, function (data, status, xhr) {
                if(data){
                    popUp_auto(1000,"添加成功");
                    flag = true;
                }
            },false);
            if(flag){//添加成功跳转
                setTimeout(function () {
                    window.location = "../../html/12_maiJiaZhongXin/14_duiZhangDanGuanLi_duiZhangDanGuanLi.html";
                }, 1000);

                //this.toAjaxStatementOrders(querydata);
                //myScroll.refresh();
            }
        }
        ,searchOrderList: function () {
            this.clickSouSuo = true;
            //由于有多个情况下拉刷新，共用全局的搜索对象
            querydata.year = this.dateTime.year;
            querydata.month = this.dateTime.month;
            querydata.beginTime = this.dateTime.beginTime;
            querydata.endTime = this.dateTime.endTime;
            querydata.pageNo = 1;
            querydata.pageSize='';
            this.toAjaxStatementOrders(querydata);
            //点击搜索后取消已经点击的全选按钮并清空之前选中的订单
            this.checkedOrdersStr = '';
            changeSelect();
        },
        toAjaxStatementOrders: function (pqueryData) {
            $.jsonAjax(getUrl("statement/statementOrders"), pqueryData, function (data, status, xhr) {
                if(data){
                    pagerOut = data.pager;
                    orderListOut = data.orderInfos;
                }
            },false);
            if(orderListOut.length == 0){//如果没有查询结果就直接跳转到无结果页面
                //根据显示框判断传的参数值
                if(this.showSelect){//显示的是下拉框传的是年月
                    window.location.href='./14_duiZhangDanGuanLi_wuJieGuo.html?year='+this.dateTime.year
                        +'&month='+this.dateTime.month+'&dateType=1';
                }else{//传的是起始结束时间
                    window.location.href='./14_duiZhangDanGuanLi_wuJieGuo.html?beginTime='+this.dateTime.beginTime
                        +'&endTime='+this.dateTime.endTime+'&dateType=2';
                }

            }
            this.pager = pagerOut;
            this.orderList = orderListOut;
        }
    },
    beforeMount:function(){
        if(clickSouSuoOut == '1'){
            this.clickSouSuo = true;
            querydata.pageSize='';
        }
        //查询所有的订单
        $.jsonAjax(getUrl("statement/statementOrders"), querydata, function (data, status, xhr) {
            if(data){
                pagerOut = data.pager;
                orderListOut = data.orderInfos;
            }
        },false);
        if(orderListOut.length == 0){//如果没有查询结果就直接跳转到无结果页面--页面加载时默认的是本月的时间
            window.location.href='./14_duiZhangDanGuanLi_wuJieGuo.html?year='+yearOut
                +'&month='+monthOut+'&dateType=1';
        }

        this.pager = pagerOut;
        this.orderList = orderListOut;
        //查询当前日期
        if(dateType == '2'){
            this.dateTime.beginTime = beginTimeOut;
            this.dateTime.endTime = endTimeOut;
            this.showSelect=false;
        }else{
            this.dateTime.year = yearOut;
            this.dateTime.month = monthOut;
        }
    },
    mounted:function(){
        //上拉刷新下拉加载
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: Load
        });
        initJqueryCase();
        initSelectCase();
    },
    updated:function(){
        initSelectCase();
        myScroll.refresh();
    }
})


function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 2000);
}

function Load() {
    //如果是点击了搜索则不执行下拉加载查询
    if(souSuoTimeVM.$data.clickSouSuo){
        setTimeout(function () {
            refresher.info.pullUpLable = "已经到底了";
            myScroll.refresh();
        }, 1000);
    }else{
        setTimeout(function () {
            var nextPage = souSuoTimeVM.$data.pager.nextPage;
            var thisPage = souSuoTimeVM.$data.pager.page;
            if(nextPage == thisPage){
                // refresher.info.pullUpLable = "已经到底了";
            }else{
                querydata.pageNo = nextPage;
                $.jsonAjax(getUrl("statement/statementOrders"), querydata, function (data, status, xhr) {
                    if(data){
                        souSuoTimeVM.$data.pager = data.pager;
                        souSuoTimeVM.$data.orderList = souSuoTimeVM.$data.orderList.concat(data.orderInfos);
                    }
                },false);
                nextPage = souSuoTimeVM.$data.pager.nextPage;
                thisPage = souSuoTimeVM.$data.pager.page;
                if(nextPage == thisPage){
                    refresher.info.pullUpLable = "已经到底了";
                }
            }
            myScroll.refresh();
            /****remember to refresh when you action was completed！！！****/
        }, 1000);
    }

}
//上拉刷新下拉加载
function initJqueryCase() {
    //日期切换
    $('.dateTime img').click(function () {
        souSuoTimeVM.$data.showSelect = !souSuoTimeVM.$data.showSelect;
        cleanTime();
    });
    /*全选开始*/
    $(".quanxuan").click(function (e) {
        if (this.src.indexOf("no-select.png") == -1) {
            $(".select").each(function (index, item) {
                item.src = "../../img/no-select.png";
            });
        } else {
            $(".select").each(function (index, item) {
                item.src = "../../img/yes-select.png";
            });
        }
    });
}
function initSelectCase(){
    $(".lk2 .select").click(function (e) {
        if (this.src.indexOf("no-select.png") == -1) {
            this.src = "../../img/no-select.png";
            $(".quanxuan")[0].src = "../../img/no-select.png";
        } else {
            this.src = "../../img/yes-select.png";
            var a4 = $(this).parent().siblings().find(" .select");
            var count4 = 0;
            for (var l = 0; l < a4.length; l++) {
                if (a4[l].src.indexOf("no-select.png") == -1) {
                    count4++;
                }
            }
            if (count4 == a4.length) {
                $(".quanxuan")[0].src = "../../img/yes-select.png";
            } else {
                $(".quanxuan")[0].src = "../../img/no-select.png";
            }
        }
    });
}
function cleanTime() {
    querydata.pageNo = 1;//防止更换下一页值
    //清空字符串时间防止后期方法判断的时候影响
    souSuoTimeVM.$data.dateTime.beginTime='';
    souSuoTimeVM.$data.dateTime.endTime='';
}

function changeSelect(){
    //$(".select").src = "../../img/no-select.png";
    $(".select").each(function (index, item) {
        item.src = "../../img/no-select.png";
    });
    myScroll.refresh();
    $("#scroller").css("transform","translate(0px, -36px)");
}