/**
 * Created by linxiaomei on 2017/4/5.
 */
var cidOut = $.getUrlParam("cid");
var themIdOut = $.getUrlParam("themId");

var categoryesOut = [];
var pagerOut = '';
var itemListOut = [];
var sellerListOut = [];
var bunnersListOut = [];

var leimiVM = new Vue({
    el:"#leimiVM",
    data:{
        imgUrl:img_url,
        pager:'',
        itemList:[],
        sellerList:[],
        selectCid:'',
        categoryesList:[],
        rightCategoryList:[],
        cid:'',
        userInfo:'',
        rightBunners:[],
        queryLeiMuSource:'',
        bunnersList:[],
        cateObj1:{}
    },
    methods:{
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                    // console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        showLevel: function (cateObj) {
            if(this.queryLeiMuSource == 'secLev'){
                this.rightCategoryList = cateObj.children;
                this.cateObj1 = cateObj;
            }else{
                this.rightCategoryList = cateObj.children;
                this.rightBunners = cateObj.bunners;
                this.cid = cateObj.categoryCid;
            }

        },
        toSecdCates: function (event,cate2) {
            $(event.srcElement).css('background', '#c30d23');

            //一期不开放
            var checkUrl = "sonHome/forward/"+cate2.categoryCid+"/"+cate2.categoryLev;

            $.jsonAjax(getUrl(checkUrl),{},function(data,status,xhr){
                if(data == true){
                    window.location ="../../html/10_pinDaoShouYe/pinDaoShouYe.html?cid="+cate2.categoryCid;
                }else{
                    window.location ="../../html/4_souSuoJieGuo/search_result.html?cid=2_"+cate2.categoryCid+"&queryType=goods&keyword=";
                }
            },false);
        },
        toThirdCates: function (event,cate2,cate3) {
            $(event.srcElement).css({'background': '#e60012', 'color': '#fff'});
            window.location ="../../html/4_souSuoJieGuo/search_result.html?cid=3_"+cate3.categoryCid+"&queryType=goods&keyword=";
        },
        querySecdCates: function (event,cate2) {
            $(event.srcElement).css({'background': '#e60012', 'color': '#fff'});
            window.location ="../../html/4_souSuoJieGuo/search_result.html?cid="+cate2.attrCid+"&pcid="+this.cateObj1.categoryParentCid+"&themId="+themIdOut+"&lev=2&queryType=goods&keyword=";
        },
        queryThirdCates: function (event,cate2,cate3) {
            $(event.srcElement).css({'background': '#e60012', 'color': '#fff'});
            window.location ="../../html/4_souSuoJieGuo/search_result.html?cid="+cate2.attrCid+"&pcid="+this.cateObj1.categoryParentCid+"&themId="+themIdOut+"&lev=2&queryType=goods&keyword=&filter="+cate3.attrValueName;
        },
        getColumnList: function () {
            $.jsonAjax(getUrl("productController/tocategoryItems"),{},function(data,status,xhr){
                if(data){
                    categoryesOut = data.categoryes;
                    pagerOut = data.pager;
                    //itemListOut = data.pager.records;
                }
            },false);
            this.pager = pagerOut;
            this.categoryesList = categoryesOut;
        },
        getItemAndGoldSellers: function () {
            $.jsonAjax(getUrl("queryItemAndGoldSellers"),{},function(data,status,xhr){
                if(data){
                    itemListOut = data.itemList;
                    sellerListOut = data.sellerList;
                }
            },false);
            this.itemList = itemListOut;
            this.sellerList = sellerListOut;
        },
        openNewUrl: function (url) {
            var purl = url.indexOf("http") == 0 ? url : ( "http://" + url );
            window.location=purl;
        },
        queryCategoryByCid: function (pcid,pthemId) {
            $.jsonAjax(getUrl("sonHome/allCategory"),{cid:pcid,themId:pthemId},function(data,status,xhr){
                categoryesOut = data.categoryes;
                bunnersListOut = data.bunners;
            },false);
            this.categoryesList = categoryesOut;
            this.bunnersList = bunnersListOut;
        },
        returnPage: function () {
            if(cidOut != null && cidOut !=""){
                window.location.href = "../../html/10_pinDaoShouYe/pinDaoShouYe.html?cid="+cidOut;
            }else{//首页进来的
                window.location = "../../html/1_index/index.html";
            }
        }
    },
    beforeMount:function(){
        this.getUserInfo();

        if(cidOut != null && cidOut !=""){
            this.queryLeiMuSource = 'secLev';
            //查询左侧列表推荐
            this.queryCategoryByCid(cidOut,themIdOut);

        }else{//首页进来的
            //查询左侧列表
            this.getColumnList();

            //查询优选商品和金牌卖家
            this.getItemAndGoldSellers();
        }

    },
    mounted:function(){
        initJqueryCase();
    }
})

//点击左侧类目切换右侧内容
function initJqueryCase() {
    var nav = document.getElementById("main-l-ul");
    var navlist = nav.children;
    var con = document.getElementById("main-r");
    var conlist = con.children;
    for (var i = 0; i < navlist.length; i++) {
        navlist[i].index = i;
        navlist[i].onclick = function () {
            for (var j = 0; j < navlist.length; j++) {
                navlist[j].className = "";
            }
            for (var m = 0; m < conlist.length; m++) {
                //navlist[m].className = "";
                conlist[m].style.display = "none";
            }
            this.className = "active";
            if(this.index == 0){
                conlist[this.index].style.display = "block";
            }else{
                conlist[1].style.display = "block";
            }
        }
    }

}
