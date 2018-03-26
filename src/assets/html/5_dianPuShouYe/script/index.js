/**
 * Created by linxiaomei on 2017/3/23.
 */
function hideConcat() {
$(".concat").hide();
}
function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 2000);
}
function Load() {
    setTimeout(function () {
        var nextPage = shopIndexVM.$data.pager.nextPage;
        var thisPage = shopIndexVM.$data.pager.page;
        if (nextPage == thisPage) {
            // refresher.info.pullUpLable = "已经到底了";
        } else {
            var data = {
                page: nextPage,
                shopId: shopId,
                sortId: shopIndexVM.$data.sortDivStyle.sortId,
                shopCid: shopIndexVM.$data.shopCid
            }
            $.jsonAjax(getUrl("shopItemListIndexController/toShopItemList"), data, function (data, status, xhr) {
                if (data) {
                    shopIndexVM.$data.pager = data;
                    shopIndexVM.$data.itemList = shopIndexVM.$data.itemList.concat(data.records);
                }
            }, false);
            nextPage = shopIndexVM.$data.pager.nextPage;
            thisPage = shopIndexVM.$data.pager.page;
            if (nextPage == thisPage) {
                refresher.info.pullUpLable = "已经到底了";
            }
            // myScroll.refresh();
            /****remember to refresh when you action was completed！！！****/
        }
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 1000);
}

var shopId = $.getUrlParam("shopId");
var showShopInfoOut = $.getUrlParam("showShopInfo");
var shopCidOut = $.getUrlParam("cid");

var shopInfoOut = {};
var itemListOut = [];
var shopProItemListOut = [];
var pagerOut = '';

var shopIndexVM = new Vue({
    el: "#allWapper",
    data: {
        serverUrl: server_url,
        imgUrl: img_url,
        showShopInfo: true,
        shopInfo: {
            logoUrl: '',
            shopName: '',
            sellerId: '',
            favouriteShop: '',
            favId: ''
        },
        shopCid:'',
        shopProItemList:[],
        itemList: [],
        allPicSrcs: {
            shoucangNo: '../../img/shoucang.png',
            shoucangYes: '../../img/star_red.png',

            sortPicUpDownNo: '../../img/up_down.png',
            sortPicUpRed: '../../img/up_red.png',
            sortPicDownRed: '../../img/down_red.png'
        },
        styleObject: {
            fontColorNo: {
                color: '#c2c2c2'
            },
            fontColorYes: {
                color: '#e60012'
            }
        },
        shoucangSrc: '',
        allGoodsSrc: '',
        pager: '',
        sortDivStyle: {
            // sortId: '2',
            sortId:'listtingTime_desc',
            sortSaleSrc: '',
            sortPriceSrc: '',
            sortTimeSrc: '',
            sortSaleFont: '',
            sortPriceFont: '',
            sortTimeFont: ''
        }
    },
    methods: {

        changeDivHeight: function () {
            $(".changeHeight").css("height","2.3rem");
            this.shopProItemList = [];
        },
        toShopInfo: function () {
            window.location.href = './shangJiaXinXi.html?shopId=' + shopId;
        },
        toGoodsInfo: function () {
            window.location.href = './baoBeiFenLei.html?shopId=' + shopId;
        },
        toPopupInfo: function () {
            window.location.href = './youHuiQuan.html?shopId=' + shopId;
        },
        addShopFavourite: function () {
            var favIdStr = "";
            $.jsonAjax(getUrl("favourite/addFavShop"),
                {shopId: shopId, sellerId: this.shopInfo.sellerId, favoId: this.shopInfo.favId},
                function (data, status, xhr) {
                    if (data.success) {
                        favIdStr = data.result + "";
                    }
                }, false);
            this.shopInfo.favId = favIdStr;
            //改变页面图标颜色
            if ('' != favIdStr) {//添加收藏返回的是id值
                this.shoucangSrc = this.allPicSrcs.shoucangYes;
                popUp_auto(1500, "您已收藏该店铺");
            } else {
                this.shoucangSrc = this.allPicSrcs.shoucangNo;
                popUp_auto(1500, "取消收藏该店铺");
            }
        }
        , clickAllSort: function (type) {
            //清空page
            itemListOut = [];
            pagerOut = '';
            this.pager = '';
            this.itemList = [];
            //控制颜色变化
            //1 时间升序 listtingTime_asc 2时间降序 listtingTime_desc 3评价升序 evaluateScope_asc 4评价降序 evaluateScope_desc
            //5销量升序 sellNum_asc       6销量降序 sellNum_desc      7价格升序 sellPrice_asc     8价格降序 sellPrice_desc
            if ('sale' == type) {
                var srcName = this.sortDivStyle.sortSaleSrc;
                if (srcName == this.allPicSrcs.sortPicUpDownNo
                    || srcName == this.allPicSrcs.sortPicUpRed) {//无->下 上->下
                    this.sortDivStyle.sortSaleSrc = this.allPicSrcs.sortPicDownRed;
                    this.sortDivStyle.sortSaleFont = this.styleObject.fontColorYes;
                    this.sortDivStyle.sortId = 'sellNum_desc';

                } else if (srcName == this.allPicSrcs.sortPicDownRed) {//下->上
                    this.sortDivStyle.sortSaleSrc = this.allPicSrcs.sortPicUpRed;
                    this.sortDivStyle.sortSaleFont = this.styleObject.fontColorYes;
                    this.sortDivStyle.sortId = 'sellNum_asc';
                }
                //其它颜色都取消
                this.sortDivStyle.sortPriceSrc = this.allPicSrcs.sortPicUpDownNo;
                this.sortDivStyle.sortPriceFont = this.styleObject.fontColorNo;
                this.sortDivStyle.sortTimeSrc = this.allPicSrcs.sortPicUpDownNo;
                this.sortDivStyle.sortTimeFont = this.styleObject.fontColorNo;
            } else if ('price' == type) {
                var srcName = this.sortDivStyle.sortPriceSrc;
                if (srcName == this.allPicSrcs.sortPicUpDownNo
                    || srcName == this.allPicSrcs.sortPicUpRed) {//无->下 上->下
                    this.sortDivStyle.sortPriceSrc = this.allPicSrcs.sortPicDownRed;
                    this.sortDivStyle.sortPriceFont = this.styleObject.fontColorYes;
                    this.sortDivStyle.sortId = 'sellPrice_desc';
                } else if (srcName == this.allPicSrcs.sortPicDownRed) {//下->上
                    this.sortDivStyle.sortPriceSrc = this.allPicSrcs.sortPicUpRed;
                    this.sortDivStyle.sortPriceFont = this.styleObject.fontColorYes;
                    this.sortDivStyle.sortId = 'sellPrice_asc';
                }

                //其它颜色都取消
                this.sortDivStyle.sortSaleSrc = this.allPicSrcs.sortPicUpDownNo;
                this.sortDivStyle.sortSaleFont = this.styleObject.fontColorNo;
                this.sortDivStyle.sortTimeSrc = this.allPicSrcs.sortPicUpDownNo;
                this.sortDivStyle.sortTimeFont = this.styleObject.fontColorNo;
            } else if ('time' == type) {
                var srcName = this.sortDivStyle.sortTimeSrc;
                if (srcName == this.allPicSrcs.sortPicUpDownNo
                    || srcName == this.allPicSrcs.sortPicUpRed) {//无->下 上->下
                    this.sortDivStyle.sortTimeSrc = this.allPicSrcs.sortPicDownRed;
                    this.sortDivStyle.sortTimeFont = this.styleObject.fontColorYes;
                    this.sortDivStyle.sortId = 'listtingTime_desc';
                } else if (srcName == this.allPicSrcs.sortPicDownRed) {//下->上
                    this.sortDivStyle.sortTimeSrc = this.allPicSrcs.sortPicUpRed;
                    this.sortDivStyle.sortTimeFont = this.styleObject.fontColorYes;
                    this.sortDivStyle.sortId = 'listtingTime_asc';
                }

                //其它颜色都取消
                this.sortDivStyle.sortSaleSrc = this.allPicSrcs.sortPicUpDownNo;
                this.sortDivStyle.sortSaleFont = this.styleObject.fontColorNo;
                this.sortDivStyle.sortPriceSrc = this.allPicSrcs.sortPicUpDownNo;
                this.sortDivStyle.sortPriceFont = this.styleObject.fontColorNo;
            }

            var dataparam = {
                shopId: shopId,
                page: '',
                sortId: this.sortDivStyle.sortId,
                shopCid:this.shopCid
            };
            $.jsonAjax(getUrl("shopItemListIndexController/toShopItemList"), dataparam, function (data, status, xhr) {
                if (data) {
                    pagerOut = data;
                    itemListOut = data.records;
                }
            }, false);
            this.itemList = itemListOut;
            this.pager = pagerOut;
            myScroll.refresh();
        },
        //去商品详情
        gotoGood: function (item, event) {
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId=" + item.itemId + "&skuId=" + item.skuId;
        },
        toGoodsDetails: function (proItem) {
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId=" + proItem.skuId;
        },
        imgLoad: function () {
            var that=this;
            var oImg = new Image();
            oImg.src = this.imgUrl + this.shopInfo.logoUrl;
            oImg.onload = function () {
                $(".shop_headImg")[0].src=that.imgUrl + that.shopInfo.logoUrl;
            };
        },
        //客服
        gotoClient:function(){
            if(this.product.stationId){
                if(footVm.$data.userInfo){
                // if(this.product.userDTO){
                    window.location="http://im.printhome.com/LR/Chatpre.aspx?id="+this.product.stationId+"&un="+  this.product.userDTO.uid  +"&ud=店铺名称："+this.product.shopInfo.shopName+"<br/>商品名称："+this.product.item.itemName+"";
                }else{
                    printConfirm("您还未登录，<br/>请登录后使用小印客服。",gotoLogin);
                    // popUp_auto_false(1500,"请先登录!");
                }
            }
            else{
                popUp_auto_false(1500,"此店铺没有客服!");
            }
        },
        showAllGoods: function () {
            //点击全部商品先清空推荐的商品
            this.shopProItemList = [];
        }
    },
    beforeMount: function () {
        //查询店铺信息
        $.jsonAjax(getUrl("shopBaseInfoController/shopIndexInfo"), {shopId: shopId}, function (data, status, xhr) {
            if (data) {
                shopInfoOut = data;
            }
        }, false);

        //推荐商品列表
        $.jsonAjax(getUrl("shopItemListIndexController/toShopProItemList"), {shopId: shopId}, function (data, status, xhr) {
            if (data) {
                shopProItemListOut = data;
            }
        }, false);
        //全部商品列表
        $.jsonAjax(getUrl("shopItemListIndexController/toShopItemList"), {shopId: shopId,shopCid:shopCidOut}, function (data, status, xhr) {
            if (data) {
                pagerOut = data;
                itemListOut = data.records;
            }
        }, false);

        this.shopInfo = shopInfoOut;
        this.shopProItemList = shopProItemListOut;
        this.itemList = itemListOut;
        this.pager = pagerOut;
        if ('false' == this.shopInfo.favouriteShop) {
            this.shoucangSrc = this.allPicSrcs.shoucangNo;
        } else {
            this.shoucangSrc = this.allPicSrcs.shoucangYes;
        }
        this.shopCid = shopCidOut;
        this.sortDivStyle.sortSaleSrc = this.allPicSrcs.sortPicUpDownNo;
        this.sortDivStyle.sortPriceSrc = this.allPicSrcs.sortPicUpDownNo;
        this.sortDivStyle.sortTimeSrc = this.allPicSrcs.sortPicDownRed;

        this.sortDivStyle.sortSaleFont = this.styleObject.fontColorNo;
        this.sortDivStyle.sortPriceFont = this.styleObject.fontColorNo;
        this.sortDivStyle.sortTimeFont = this.styleObject.fontColorYes;
        if (showShopInfoOut == 'false') {
            this.showShopInfo = false;
            this.shopProItemList = [];
        }
    },
    mounted: function () {
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: Load
        });
        initJqueryCase();
        if (this.showShopInfo) {
            bodyCase();
        } else {
            bodyCase2();
        }
        this.imgLoad();
    },
    updated: function () {
        myScroll.refresh();
    }
});


var searchVM = new Vue({
    el: ".top_wrapper",
    data: {
        queryData: {
            queryType: "shop",
            keyword: ""
        }
    },
    methods: {
        searchList: function () {
            if (this.queryData.queryType == 'shop') {//店铺
                var keySearch = this.$data.queryData.keyword;
                //调用方法查询
                var dataparam = {
                    shopId: shopId,
                    page: '',
                    keyword: encodeURI(keySearch)
                };
                $.jsonAjax(getUrl("shopItemListIndexController/toShopItemList"), dataparam, function (data, status, xhr) {
                    if (data) {
                        pagerOut = data;
                        itemListOut = data.records;
                    }
                }, false);
                //修改列表数组
                shopIndexVM.$data.shopProItemList = [];
                shopIndexVM.$data.itemList = itemListOut;
                shopIndexVM.$data.pager = pagerOut;
                myScroll.refresh();

            } else {//全平台
                window.location = "../../html/4_souSuoJieGuo/search_result.html?queryType=goods" + "&keyword=" + this.$data.queryData.keyword;
            }
        }
    },
    mounted: function () {
        initJqueryCase();
        if (shopIndexVM.$data.showShopInfo) {
            bodyCase();
        } else {
            bodyCase2();
        }
    }
});


var footVm = new Vue({
    el: "#footVm",
    data:{
        userInfo :"",
    },
    methods: {
        /**
         * 加载用户信息
         */
        getUserInfo: function () {
            var temp = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    temp.userInfo = data.result;
                    // console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        //客服
        gotoClient: function () {
            if (shopIndexVM.$data.shopInfo.stationId) {
                if (this.userInfo) {
                    $(".concat").show();
                    $("#kefu")[0].src = "http://im.printhome.com/LR/Chatpre.aspx?id=" + shopIndexVM.$data.shopInfo.stationId + "&un=" + this.userInfo.uid + "&ud=店铺名称：" + shopIndexVM.$data.shopInfo.shopName ;
                } else {
                    printConfirm("您还未登录，<br/>请登录后使用小印客服。",gotoLogin);
                    // popUp_auto_false(1500,"请先登录!");
                }
            }
            else {
                popUp_auto_false(1500, "此店铺没有客服!");
            }
        }
    },
    beforeMount: function () {
        this.getUserInfo();
    },
    mounted: function () {
        //$("#kefu")[0].src = "http://im.printhome.com/LR/Chatpre.aspx?id=" + shopIndexVM.$data.shopInfo.stationId + "&un=" + this.userInfo.uid + "&ud=店铺名称：" + shopIndexVM.$data.shopInfo.shopName ;
    }
});
function bodyCase() {
    $("body").on("touchmove", function () {
        var translates = $("#scroller").css("transform");
        var tansY = parseFloat(translates.substring(7).split(',')[5]);
        var winW = document.documentElement.clientWidth;
        var a=winW/640;
        //console.log(wTop.replace(/[^0-9\-,]/g,'').split(','));
        if (tansY <= -(a*260)) {
            $(".top_wrapper").css('background', 'rgba(255,255,255,1)');
            $(".fixed_btn").css("display", "block");
        }
        else {
            $(".top_wrapper").css('background', 'rgba(255,255,255,0.6)');
            $(".fixed_btn").css("display", "none");
        }
    })
}
function bodyCase2() {//全部商品跳转
    $(".top_wrapper").css('background', 'rgba(255,255,255,1)');
    $(".fixed_btn").css({"display": "block", "position": "fixed", "top": "0.8rem", "width": "100%", "z-index": 100});
    $("body").on("touchmove", function () {
        var translates = $("#scroller").css("transform");
    });
}

function reloadShopIndex(){
    window.location = "../../html/5_dianPuShouYe/dianPu_index.html?shopId="+shopId;
}
function gotoLogin() {
    var referer = location.href;
    if(referer){
        window.location="../../html/2_login_sign/login_common.html?referer="+referer;
    }else{
        window.location="../../html/2_login_sign/login_common.html";
    }
}