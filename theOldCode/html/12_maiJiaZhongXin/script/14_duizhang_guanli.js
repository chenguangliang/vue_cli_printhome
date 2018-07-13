/**
 * Created by linxiaomei on 2017/4/10.
 */

var pagerOut='';
var duizhangListOut=[];
var queryDataAll = {
    userType:2,
    pageNo:'1',
    statementId: $.getUrlParam("statementId"),
    createDate: $.getUrlParam("createDate"),
    sellerName: $.getUrlParam("sellerName")==null?"":encodeURI($.getUrlParam("sellerName"))
};//用来实现搜索跳页


var duizhangVM = new Vue({
    el:"#duizhangvm",
    data:{
        pager:'',
        duizhangdanList:[],
        beginTranY:''
    },
    methods:{
         goToTop: function () {
            // console.log(this.beginTranY);
             $("#scroller").css("transform","translate(0px, -"+this.beginTranY+"px)");
             $("#top").hide();
        },
        //订单详情
        toOrderDetail:function(orderId,passKey) {
            var temp = this;
            var paramData = {
                orderId:orderId,
                passKey:passKey
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanXiangQing2.html?"+ $.assemblyRequestString(paramData);
        },
    },
    beforeMount:function(){
        $.jsonAjax(getUrl("statement/showStatement"), queryDataAll, function (data, status, xhr) {
            if(data){
                pagerOut = data.pager;
                duizhangListOut = data.rows;
            }
        },false);
        this.pager = pagerOut;
        this.duizhangdanList = duizhangListOut;
    },
    mounted:function(){
        //上拉刷新下拉加载
        if(this.duizhangdanList.length!=0){
            refresher.init({
                id: "wrapper",
                pullDownAction: Refresh,
                pullUpAction: Load
            });
            this.beginTranY=document.getElementById('pullDown').offsetHeight;
        }
        console.log(this.beginTranY);
    },
    updated:function(){
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
    setTimeout(function () {
        var nextPage = duizhangVM.$data.pager.nextPage;
        var thisPage = duizhangVM.$data.pager.page;
        if(nextPage == thisPage){
            // refresher.info.pullUpLable = "已经到底了";
        }else{
            queryDataAll.pageNo = nextPage;
            $.jsonAjax(getUrl("statement/showStatement"), queryDataAll, function (data, status, xhr) {
                if(data){
                    duizhangVM.$data.pager = data.pager;
                    duizhangVM.$data.duizhangdanList = duizhangVM.$data.duizhangdanList.concat(data.rows);
                }
            },false);
            nextPage = duizhangVM.$data.pager.nextPage;
            thisPage = duizhangVM.$data.pager.page;
            if(nextPage == thisPage){
                refresher.info.pullUpLable = "已经到底了";
            }
            // myScroll.refresh();
            /****remember to refresh when you action was completed！！！****/
        }
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 1000);

}
