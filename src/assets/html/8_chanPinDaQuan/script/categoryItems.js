/**
 * Created by linxiaomei on 2017/3/30.
 */

var categoryesOut = [];
var pagerOut = '';
var itemListOut = {};
var shopEvaluationInfoOut = {};

var chanpindaquanVM = new Vue({
    el:"#chanpindaquanVM",
    data:{
        imgUrl:img_url,
        pager:'',
        itemList:{},
        chanpinSelect:{
            selectCid:'',
            objCateOne:{},
            objCateTwo:{},
            oneCategoryesList:[],
            twoCategoryesList:[],
            threeCategoryesList:[]
        },
        shopEvaluationInfo:{},
        showMode:true

    },
    methods:{
        toggleShow: function () {
            this.showMode = !this.showMode;
        }
        ,toItemResult:function(itemidp){
            window.location.href = './chanPinDaQuanJieGuo.html?itemId='+itemidp;
        }
        ,toItemsAndShopInfo: function (pshopId) {
            shopEvaluationInfoOut = {};
            if(pshopId == '' || pshopId == null){//商品没有店铺id------这里具体的业务逻辑还需确定
                var temshopEvaluationInfoOut = {
                    shopName:'自营',
                    shopDescription:'5.0',
                    shopReputation:'5.0',
                    shopArrival:'5.0',
                    shopService:'5.0'
                };
                shopEvaluationInfoOut = temshopEvaluationInfoOut;
            }else{
                var pdata = {
                    shopId:pshopId
                };
                $.jsonAjax(getUrl("shopBaseInfoController/shopEvaluationInfo"), pdata, function (data, status, xhr) {
                    if (data) {
                        shopEvaluationInfoOut = data;
                    }
                },false);
            }
            this.shopEvaluationInfo = shopEvaluationInfoOut;
        }
        ,adfavItem: function (pitemid,pshopid) {
            if(pshopid != '' && pshopid != null) {//商品没有店铺id
                $.jsonAjax(getUrl("favourite/addFavItem"), {itemId: pitemid,shopId: pshopid}, function (data, status, xhr) {
                    //if (data.success) {
                    console.log("点击收藏商品--" + data);
                    //}
                }, false);
                //此处应是添加收藏成功或失败后的效果
            }
        }
        ,adfavShop: function (pshopid) {
            if(pshopid != '' && pshopid != null) {//商品没有店铺id
                $.jsonAjax(getUrl("favourite/addFavShop"),{shopId:pshopid},function (data, status, xhr) {
                        //if (data.success) {
                            console.log("点击收藏店铺--"+data);
                        //}
                    },false);
                //此处应是添加收藏成功或失败后的效果
                
            }
        }
        ,toCategoryItems:function(cid){
            pagerOut="";
            itemListOut=[];
            $.jsonAjax(getUrl("productController/tocategoryItems"),{cid:cid},function(data,status,xhr){
                if(data){
                    pagerOut = data.pager;
                    itemListOut = data.pager.records;
                }
            },false);
            this.pager = pagerOut;
            this.itemList = itemListOut;
        },
        showLevel: function (paramobj,level) {
            popUp_open();
            var cid = '';
            switch(level){
                case 1:
                    if(paramobj == -1){//-1是点击全部传的值
                        cid = '';
                        $(".one_button").html("全部"+"\<img src='../../img/xiala.png' alt=''/>");
                        $(".one_button").show();
                        $(".onefold_nav").css({"display":"none"});
                        $(".two_button").html("全部"+"\<img src='../../img/xiala.png' alt=''/>");
                        $(".two_button").show();
                        $(".twofold_nav").css({"display":"none"});
                        $(".three_button").html("全部"+"\<img src='../../img/xiala.png' alt=''/>");
                        $(".three_button").show();
                        $(".threefold_nav").css({"display":"none"});
                    }else{
                        this.chanpinSelect.objCateOne = paramobj;
                        this.chanpinSelect.twoCategoryesList = paramobj.children;
                        $(".onefold_nav").slideUp("fast");
                        $(".one_button").html(subName(paramobj.categoryCName,0,4)+"\<img src='../../img/xiala.png' alt=''/>");
                        cid = this.chanpinSelect.objCateOne.categoryCid;
                    }
                    break;
                case 2:
                    if(paramobj == -1){//-1是点击全部传的值
                        cid = typeof(this.chanpinSelect.objCateOne.categoryCid)=='undefined' ? ''
                            :this.chanpinSelect.objCateOne.categoryCid;
                        $(".twofold_nav").slideUp("fast");
                        $(".two_button").html("全部"+"\<img src='../../img/xiala.png' alt=''/>");
                    }else{
                        this.chanpinSelect.objCateTwo = paramobj;
                        this.chanpinSelect.threeCategoryesList = paramobj.children;
                        $(".twofold_nav").slideUp("fast");
                        $(".two_button").html(subName(paramobj.categoryCName,0,4)+"\<img src='../../img/xiala.png' alt=''/>");
                        cid = this.chanpinSelect.objCateOne.categoryCid + ":" + this.chanpinSelect.objCateTwo.categoryCid;
                    }
                    break;
                case 3:
                    if(paramobj == -1){//-1是点击全部传的值
                        if(typeof(this.chanpinSelect.objCateTwo.categoryCid)=='undefined'){
                            if(typeof(this.chanpinSelect.objCateOne.categoryCid)=='undefined') {
                                cid = '';
                            }else{
                                cid = this.chanpinSelect.objCateOne.categoryCid;
                            }
                        }else {
                            cid = this.chanpinSelect.objCateOne.categoryCid + ":" + this.chanpinSelect.objCateTwo.categoryCid;
                        }
                        $(".threefold_nav").slideUp("fast");
                        $(".three_button").html("全部"+"\<img src='../../img/xiala.png' alt=''/>");
                    }else{
                        cid = this.chanpinSelect.objCateOne.categoryCid + ":"
                            +this.chanpinSelect.objCateTwo.categoryCid + ":"
                            + paramobj.categoryCid;
                        flag = true;
                        $(".threefold_nav").slideUp("fast");
                        $(".three_button").html(subName(paramobj.categoryCName,0,4)+"\<img src='../../img/xiala.png' alt=''/>");
                    }
                    break;
                default :break;
            }
            this.chanpinSelect.selectCid = cid;
            this.toCategoryItems(cid);
            popUp_close();
        }

    },
    beforeMount:function(){
        $.jsonAjax(getUrl("productController/tocategoryItems"),{},function(data,status,xhr){
            if(data){
                categoryesOut = data.categoryes;
                pagerOut = data.pager;
                itemListOut = data.pager.records;
            }
        },false);
        this.pager = pagerOut;
        this.itemList = itemListOut;
        this.chanpinSelect.oneCategoryesList = categoryesOut;
    },
    mounted:function(){
        initJqueryCase();
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

function subName(value,start,end) {
    if (value.length<=end) {
        return value;
    }else{
        return value.substring(start, end)+"...";
    }


}

function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 2000);
}
function Load() {
    setTimeout(function () {
        var nextPage = chanpindaquanVM.$data.pager.nextPage;
        var thisPage = chanpindaquanVM.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
            myScroll.refresh();
        }else{
            var data = {
                page:nextPage,
                cid:chanpindaquanVM.$data.chanpinSelect.selectCid
            }
            $.jsonAjax(getUrl("productController/tocategoryItems"), data, function (data, status, xhr) {
                if(data){
                    chanpindaquanVM.$data.pager = data.pager;
                    chanpindaquanVM.$data.itemList = chanpindaquanVM.$data.itemList.concat(data.pager.records);
                }
            },false);
            nextPage = chanpindaquanVM.$data.pager.nextPage;
            thisPage = chanpindaquanVM.$data.pager.page;
            if(nextPage == thisPage){
                refresher.info.pullUpLable = "已经到底了";
            }
             myScroll.refresh();
        }
        //myScroll.refresh();
    }, 1000);
}

