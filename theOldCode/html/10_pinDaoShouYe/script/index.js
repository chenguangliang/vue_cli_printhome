/**
 * Created by linxiaoemi on 2017/6/2.
 */

var cidOut = $.getUrlParam("cid");
var erJiPinDaoListOut = [];

var indexDataOut = {};
var noticeListOut = [];
var guessLoveListOut = [];

var pinDaoShouYeVM = new Vue({
    el:"#pinDaoShouYe",
    data:{
        imgUrl:img_url,
        userInfo: '',
        erJiPinDaoList:[],
        banners:[],//轮播图
        mallThemeDTO:{},
        noticeList:[],
        guessLoveList:[],
        shipStores:[],
        bottomAdvs:[],
        bottomAd:{},
        floors:[],
        floorsData:[
            //{floorTitle:'',floorProducts:[]}
        ],
        searchType:0,
        mallwxIconList:[],
        fenleiImgUrl:'../../img/fenlei@3x.png'
    },
    methods:{
        showSecondCategory: function () {
            window.location = "../../html/11_pinDaoLeiMu/pinDaoLeiMu.html?cid="+cidOut+"&lev=2&themId="+this.mallThemeDTO.id;
        },
        /**
         * 加载用户信息
         */
        getUserInfo:function(){
            var temp = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    temp.userInfo = data.result;
                }
            }, false);
        },
        goToTop: goToTop,
        /**
         * 点击频道
         */
        toggleMenu: function () {
            $("#navigation").toggle();
        },
        /*切换店铺和商品*/
        typeClick: function (para) {
            if (0 == para) {
                $("#typeTitle").html('商品');
                this.searchType = 0;
            } else {
                $("#typeTitle").html('店铺');
                this.searchType = 1;
            }
            this.changeType(1);
        },
        /*切换店铺和商品*/
        changeType: function (res) {
            if (res == 0) {
                $("#typePanel").toggle();
            } else {
                $("#typePanel").hide();
            }
        },
        /*点击搜索框*/
        goToSearch: function () {
            var queryType = $("#typeTitle").html()=="商品"?"goods":"shop";
            var urlTemp=$.assemblyRequestString({queryType:queryType});
            var goToPath='../../html/4_souSuoJieGuo/search.html'+"?"+urlTemp;
            window.location=goToPath;
        },
        /**
         * 查询二级频道列表
         */
        queryErJiPinDao: function () {
            $.jsonAjax(getUrl("erJiChannels"), {}, function (data, status, xhr) {
                erJiPinDaoListOut = data;
            }, false);
            this.erJiPinDaoList = erJiPinDaoListOut;
        },
        /**
         * 跳转到对应的二级频道页
         * @param cId
         */
        toPinDaoIndex: function (cId) {
            window.location = "../../html/10_pinDaoShouYe/pinDaoShouYe.html?cid="+cId;
        },
        /**
         * 查询二级频道的数据信息
         * @param pcid
         * @param plev
         */
        querySonHomeInfo: function (pcid, plev) {
            $.jsonAjax(getUrl("sonHome/index"), {cid:pcid,lev:plev}, function (data, status, xhr) {
                indexDataOut = data;
            }, false);
            this.banners = indexDataOut.banners;

            //公告
            this.mallThemeDTO = indexDataOut.mallThemeDTO;
            this.queryNoticeList(this.mallThemeDTO.id,this.mallThemeDTO.cId);

            //精品推荐
            this.queryGuessLove(this.mallThemeDTO.id);

            //楼层
            this.floors = indexDataOut.floors;
            for(var i=0;i<this.floors.length;i++){
                var floorObject = new Object();
                floorObject.floorTitle = this.floors[i].titleDTO;
                $.jsonAjax(getUrl("sonHome/floor"), {fid:this.floors[i].idDTO,num:i}, function (data, status, xhr) {
                    floorObject.floorProducts = data.floor.goods;
                }, false);
                this.floorsData.push(floorObject);
            }
            //旗舰店
            this.shipStores = indexDataOut.shipStores;

            //小广告位
            this.bottomAdvs = indexDataOut.bottomAdvs;

            //子站底部广告
            this.bottomAd = indexDataOut.bottomAd;
        },
        /**
         * 二级频道公告列表
         * @param themeId
         * @param cid
         */
        queryNoticeList: function (pthemeId,pcid) {
            $.jsonAjax(getUrl("sonHome/noticeFragement"), {cid:pcid,themId:pthemeId}, function (data, status, xhr) {
                noticeListOut = data.notices;
            }, false);
            this.noticeList = noticeListOut;
        },
        showNeiRongPage: function (notice) {
            if(notice.noticeType == 1){
                window.location = "../../html/6_gongGao/gongGaoNeiRong.html?noticeId="+notice.noticeId;
            }else{
                window.location = notice.url;
            }
        },
        toMoreNotice: function () {
            window.location ="../../html/6_gongGao/gongGaoLieBiao.html?type=sonHome&themId="+this.mallThemeDTO.id+"&cid="+cidOut;
        },
        queryGuessLove: function (pthemId) {
            $.jsonAjax(getUrl("sonHome/guessLove"), {themId:pthemId}, function (data, status, xhr) {
                guessLoveListOut = data.records;
            }, false);
            this.guessLoveList = guessLoveListOut;
        },
        adToVisit: function (paramObject,type) {
            if(type == 'guessLove' || type == 'shop'){
                adVisit(paramObject.id,paramObject.adURL,1);
            }else if(type == 'bottem'){
                adVisit(paramObject.id,paramObject.adURL,10);
            }else if(type == 'product'){
                adVisit(paramObject.id,paramObject.url,3);
            }else if(type == 'bottomAd'){
                adVisit(paramObject.id,paramObject.adURL,3);
            }

        },

        //获取首页图标
        getMallwxIndexIcon:function(){
            var temp = this;
            $.jsonAjax(getUrl("mallwxIcon"), {}, function (data, status, xhr) {
                if (data) {
                    //console.log(data)
                    temp.mallwxIconList = data;
                }
            }, false);
        }

    },
    computed:{

    },
    beforeMount:function(){
        //获取首页图标
        this.getMallwxIndexIcon();
        //查询二级频道
        this.getUserInfo();
        this.queryErJiPinDao();
        this.querySonHomeInfo(cidOut,2);
    },
    mounted:function(){
        //文字向上滚动
        $("#scrollDiv").cxScroll({direction:"bottom",speed:600,time:3000,plus:false,minus:false,step:1});
        //轮播
        if($("#slideBox ul li").length!=0){
            TouchSlide({
                slideCell: "#slideBox",
                titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell: ".bd ul",
                effect: "leftLoop",
                autoPage: true,//自动分页
                autoPlay: true //自动播放
            });
        };
        $('#img-scroll').cxScroll({direction:"right",speed:500,time:2000,plus:false,minus:false,step:2});
    },
    updated:function(){

    },
    watch:{

    }
})