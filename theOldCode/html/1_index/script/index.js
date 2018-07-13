/**
 *@fileName:index.js
 *@author:fdc
 *@time:2017/2/21 0021
 *@disc:首页js
 */

var userDTO;
var erJiPinDaoListOut = [];

var vm = new Vue({
    el: "#app",
    data: {
        serverUrl: server_url,
        imgUrl: img_url,
        userInfo: {},
        erJiPinDaoList:[],
        noticeFragement: [],
        mallBanner: [],
        advertises: [],
        weekAdvertises:[],
        guessLoveMap: {},
        floors: [],
        queryType: "goods",
        mallwxIconList:[],
        fenleiImgUrl:'../../img/fenlei@3x.png'
    },
    methods: {
        /**
         * 加载用户信息
         */
        getUserInfo:function(){
           var temp = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    temp.userInfo = data.result;
                    // console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        /*回到顶部*/
        goToTop: goToTop,
        /*切换店铺和商品*/
        toggleMenu: function () {
            $("#navigation").toggle();//一期不开放

            //跳转到频道类目页
            //window.location ="../../html/11_pinDaoLeiMu/pinDaoLeiMu.html";
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
        toMoreNotice: function () {
            window.location ="../../html/6_gongGao/gongGaoLieBiao.html";
        },
        /*切换店铺和商品*/
        changeType: function (res) {
            if (res == 0) {
                $("#typePanel").toggle();
            } else {
                $("#typePanel").hide();
            }
        },
        /*切换店铺和商品*/
        typeClick: function (para) {
            if (0 == para) {
                $("#typeTitle").html('商品');
            } else {
                $("#typeTitle").html('店铺');
            }
            this.changeType(1);
        },
        /*点击搜索框*/
        goToSearch: function () {
            var queryType = $("#typeTitle").html()=="商品"?"goods":"shop";
            var urlTemp=$.assemblyRequestString({queryType:queryType});
            var goToPath='../../html/4_souSuoJieGuo/search.html'+"?"+urlTemp;
            window.location=goToPath;
        }
        ,showNeiRongPage: function (notice) {
            if(notice.noticeType == 1){
                window.location = "../../html/6_gongGao/gongGaoNeiRong.html?noticeId="+notice.noticeId;
            }else{
                window.location = notice.url;
            }

        },
        //加载论坛
        loadForum :function(){
            $.jsonAjax(getUrl("user/loadForum"),{},function(data, status, xhr){
                if(data.success){
                    $("#bbsImg").attr("src",data.result);
                    //访问bbs
                   // $.jsonAjaxNop(data.result,{},function(data, status, xhr){
                  //      $("#bbsImg").attr("src",data.result);
                   // });
                }
            });
        },
        //获取首页图标
        getMallwxIndexIcon:function(){
            var temp = this;
            $.jsonAjax(getUrl("mallwxIcon"), {}, function (data, status, xhr) {
                if (data) {
                    console.log(data)
                    temp.mallwxIconList = data;
                }
            }, false);
        },
        closeInvitation: function () {
            $(".quickInvitation").hide();
        },
    },
    beforeMount: function () {
        var temp = this;
        this.getUserInfo();
        this.queryErJiPinDao();
        /**
         * 首页轮播图
         */
        $.jsonAjax(getUrl("mallBanner"), {}, function (data, status, xhr) {
            if (data) {
                temp.mallBanner = data;
            }
        }, false);
        //获取首页图标
        this.getMallwxIndexIcon();
        /**
         * 楼层
         */
        $.jsonAjax(getUrl("floors"), {}, function (data, status, xhr) {
            if (data) {
                temp.floors = data;
                //console.log(data);
            }
        }, false);

        /**
         * 首页公告
         */
        $.jsonAjax(getUrl("noticeFragement"), {}, function (data, status, xhr) {
            if (data) {
                temp.noticeFragement = data;
            }
        },false);




        /**
         * 轮播图下的广告位:本周推荐 + 广告位
         */
        $.jsonAjax(getUrl("weekadvertises"), {}, function (data, status, xhr) {
            if (data) {
                temp.weekAdvertises = data;
            }
        },false);
        $.jsonAjax(getUrl("advertises"), {}, function (data, status, xhr) {
            if (data) {
                temp.advertises = data;
            }
        },false);


        /**
         * 猜你喜欢
         */
        $.jsonAjax(getUrl("guessLoveMap"), {}, function (data, status, xhr) {
            if (data.isSuccess) {
                temp.guessLoveMap = data.resultData;
            }
        },false);



    },
    mounted: function () {
        //头部焦点图
        if($("#slideBox ul li").length!=0){
            TouchSlide({
                slideCell: "#slideBox",
                titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell: ".bd ul",
                effect: "leftLoop",
                autoPage: true,//自动分页
                autoPlay: true //自动播放
            });
        }
        //公告列表向上滚动
        $("#scrollDiv").cxScroll({direction:"bottom",speed:600,time:3000,plus:false,minus:false,step:1});
        //对联图片向上滚动
        $("#left").cxScroll({direction:"bottom",speed:500,time:2000,plus:false,minus:false,step:1});
        $("#right").cxScroll({direction:"bottom",speed:500,time:2000,plus:false,minus:false,step:1});
        var tempdata = this;
        $.each(this.$data.floors, function (index, ele) {
            $("#floor" + index).load(getUrl('floor') + "?userId="+tempdata.$data.userInfo.uid+"&fid=" + ele.idDTO + "&num=" + index + "&"+constants_commonPlatformId + "=" + commonPlatformId, function (data, status, xhr) {
                $('#img-scroll'+index).cxScroll({direction:"right",speed:500,time:2000,plus:false,minus:false,step:2});
            });
        });
        this.loadForum();
        var invitationFlag=$.getUrlJson().invitation;
        if(this.userInfo.userstatus==9 && invitationFlag==1){ //快速卖家未认证
            $(".quickInvitation").show();
        }
    }
});



