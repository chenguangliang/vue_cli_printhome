/**
*@fileName:2_buyerIndex.js
*@author:fdc
*@time:2017/4/11 0011
*@disc:消息中心主页
*/
var newsList = [];
var pager = {};
var newsInfo = new Vue({
    el:"#newsInfo",
    data:{
        //用户信息
        newsList:[],
        theNews:{},
        pager:{},
        beginTranY:''
    },
    mixins:[common],
    beforeCreate: function () {
        $.jsonAjax(getUrl("buyer/newsMap"),{},function(data,status,xhr){
            if(data.status=="200"){
                if("news"== data.data.newsType){
                    newsList = data.data.allMag.rows;
                }else{
                    newsList = data.data.sysMag.rows;
                }
                pager = data.data.page;
            }else{
                printAlert(data.msg);
            }
        },false);
    },
    created: function () {
        this.$data.newsList = newsList;
        this.$data.pager = pager;
    },
    methods:{
        time: function (value) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date(parseInt(value));
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();

            return y + '-' + add0(m) + '-' + add0(d) + '  ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
        },
        showInfo:function (news) {
            if(news.wmRead!='2'){
                $.jsonAjax(getUrl("buyer/ajaxSetread"),{ids:news.id},function(data,status,xhr){
                    news.wmRead = '2';
                },false);
            }
            newsInfo.$data.theNews = news;
            $('.zhezhao').show();
        },
        setRead:function () {
            popUp_open();
            var temp = this;
            $.jsonAjax(getUrl("buyer/setReadAll"),{messageType:1},function(data,status,xhr){
                popUp_close();
                if(data.success){
                    $.each(temp.newsList,function(index,ele){
                        ele.wmRead = '2';
                    });
                     popUp_auto(1500,"操作成功!");
                }else{
                    popUp_auto_false(1500,data.errorMessages);
                }
            });
        },
        goToTop: function () {
            $("#scroller").css("transform","translate(0px, -"+this.beginTranY+"px)");
            $("#top").hide();
        }
    },
    updated:function () {
        myScroll.refresh();
    },
    mounted:function () {
        intercept('.xiaoXiZhongXin .bottom',71);
        $('.quanBuYiDu').click(function(){
            $('.hongDian').hide();
        });
        // $('.xiaoXiZhongXin').click(function(){
        //     $(this).children().children('.hongDian').hide();
        // });
        $('.close').click(function(){
            $('.zhezhao').hide();
        })
        if(this.newsList.length>0){
            refresher.init({
                id: "wrapper",
                pullDownAction: Refresh,
                pullUpAction: Load
            });
            this.beginTranY=document.getElementById('pullDown').offsetHeight;
        }

        changeLabel(this.$data.pager.nextPage,this.$data.pager.page);
    }
});
//上拉刷新下拉加载
var generatedCount = 0;
function Refresh() {
    // setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
    myScroll.refresh();
    //     /****remember to refresh when you action was completed！！！****/
    // }, 2000);
}
function Load() {
    setTimeout(function () {
        var nextPage = newsInfo.$data.pager.nextPage;
        var thisPage = newsInfo.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
        }else{
            refresher.info.pullUpLable = "上拉加载...";
            var data = {
                page:nextPage
            }
            $.jsonAjax(getUrl("buyer/newsMap"),data,function(data,status,xhr){
                if(data.status=="200"){
                    if("news"== data.data.newsType){
                        newsInfo.$data.newsList = newsInfo.$data.newsList.concat(data.data.allMag.rows);
                    }else{
                        newsInfo.$data.newsList = newsInfo.$data.newsList.concat(data.data.sysMag.rows);
                    }
                    newsInfo.$data.pager = data.data.page;
                }else{
                    printAlert(data.msg);
                }
            },false);
            changeLabel(newsInfo.$data.pager.nextPage,newsInfo.$data.pager.page);
            // myScroll.refresh();
            /****remember to refresh when you action was completed！！！****/
        }
        myScroll.refresh();
    }, 100);
}
function changeLabel(nextPage,thisPage) {
    if(nextPage <= thisPage){
        refresher.info.pullUpLable = "已经到底了";
    }else {
        refresher.info.pullUpLable = "上拉加载...";
    }
    document.querySelector('.pullUpLabel').innerHTML =refresher.info.pullUpLable;
}
//上拉刷新下拉加载