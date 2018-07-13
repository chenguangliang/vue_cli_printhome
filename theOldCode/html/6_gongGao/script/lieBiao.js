/**
 * Created by linxiaomei on 2017/4/24.
 */

var type = $.getUrlParam("type");
var themIdOut = $.getUrlParam("themId");
var cidOut = $.getUrlParam("cid");

var lieBiaoListOut = [];
var pagerOut='';
var queryData={
    page:1,
    noticeTitle:''
};

/**
 * 搜索VM
 */
var sousuoVM = new Vue({
    el:".header",
    data:{
        noticeTitle:''
    },
    methods:{
        searchNoticeTitle: function () {
            queryData.page = 1;
            queryData.noticeTitle = this.noticeTitle;
            $.jsonAjax(getUrl("notice/list"), queryData, function (data, status, xhr) {
                if(data){
                    lieBiaoListOut = data.pager.records;
                    pagerOut = data.pager;
                }
            },false);
            gongGaoListVM.$data.lieBiaoList = lieBiaoListOut;
            gongGaoListVM.$data.pager = pagerOut;
        }
    }
});

/**
 * 列表展示VM
 */
var gongGaoListVM = new Vue({
    el:"#wrapper",
    data:{
        lieBiaoList:[],
        pager:{}
    },
    methods:{
        showNeiRong: function (pnoticeId) {
            window.location = "../../html/6_gongGao/gongGaoNeiRong.html?noticeId="+pnoticeId;
        },
        goToUrl: function (newUrl) {
            window.location = newUrl;
        }
    },
    beforeMount:function(){
        if(type == 'sonHome'){
            $.jsonAjax(getUrl("notice/sonhomeList"),{themId:themIdOut,cid:cidOut},function(data,status,xhr){
                if(data){
                    lieBiaoListOut = data.pager.records;
                    pagerOut = data.pager;
                }
            },false);
        }else{
            $.jsonAjax(getUrl("notice/list"),queryData,function(data,status,xhr){
                if(data){
                    lieBiaoListOut = data.pager.records;
                    pagerOut = data.pager;
                }
            },false);
        }

        this.lieBiaoList = lieBiaoListOut;
        this.pager = pagerOut;
    },
    mounted:function(){
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: Load
        });
    },
    updated:function(){
        myScroll.refresh();
    }
});

function Refresh() {
    setTimeout(function () {
        location.reload();
        myScroll.refresh();
        /****remember to refresh when you action was completed������****/
    },1500);
}

function Load() {
    setTimeout(function () {
        var nextPage = gongGaoListVM.$data.pager.nextPage;
        var thisPage = gongGaoListVM.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
            myScroll.refresh();
        }else{
            queryData.page = nextPage;
            queryData.noticeTitle = sousuoVM.$data.noticeTitle;
            if(type == 'sonHome'){
                var querySonData = queryData;
                querySonData.themId=themIdOut;
                querySonData.cid=cidOut;
                $.jsonAjax(getUrl("notice/sonhomeList"), querySonData, function (data, status, xhr) {
                    if(data){
                        gongGaoListVM.$data.pager = data.pager;
                        gongGaoListVM.$data.lieBiaoList = gongGaoListVM.$data.lieBiaoList.concat(data.pager.records);
                    }
                },false);
            }else{
                $.jsonAjax(getUrl("notice/list"), queryData, function (data, status, xhr) {
                    if(data){
                        gongGaoListVM.$data.pager = data.pager;
                        gongGaoListVM.$data.lieBiaoList = gongGaoListVM.$data.lieBiaoList.concat(data.pager.records);
                    }
                },false);
            }
            nextPage = gongGaoListVM.$data.pager.nextPage;
            thisPage = gongGaoListVM.$data.pager.page;
            if(nextPage == thisPage){
                refresher.info.pullUpLable = "已经到底了";
            }
            myScroll.refresh();
        }
    }, 1000);
}