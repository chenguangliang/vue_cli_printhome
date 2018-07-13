
/**
 * 求购明细
 */
$(function(){

})
var pager = '';
var productlist = '';
var shoucang_shangpin = new Vue({
    el:"#shoucang_shangpin",
    data:{
        pager:'',
        productlist:'',
        ids:[],
        bianji:false,
        //用户信息
        userInfo:"",
    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("buyercenter/favouriteProductsMap"), {}, function (data, status, xhr) {
            if (data.status == "200") {
                pager = data.data.pager;
                productlist = data.data.pager.records;
                // console.log(pager);
            } else {
                printAlert(data.msg);
                // window.location = '../2_login_sign/login_common.html';
            }
        }, false);
    },
    created: function () {
        this.$data.pager = pager;
        this.$data.productlist = productlist;
    },
    mounted: function () {
        // 常购列表点击删除
        $('.delete').click(function(){
            $('.zhezhao2').show();
        });
        // //点击编辑的效果
        $('.bianJi').click(function(){
            $(this).hide();
            $('.twoButton').show();
            $('.gouXuan').css('display','inline-block');
            shoucang_shangpin.$data.bianji=true;
        });
        //点击保存的效果
        $('.baoCun').click(function(){
            $(this).parent().hide();
            $('.bianJi').show();
            $('.gouXuan').hide();
            shoucang_shangpin.$data.bianji=false;
        });
        //点击删除的效果
        $('.shanChu').click(function(){
            if(shoucang_shangpin.$data.ids.length==0){
                $('.zhezhao').show();
            }else{
                $('.zhezhao2').show();
            }
        });
        //点击取消的效果
        $('.quXiao').click(function(){
            $('.zhezhao2').hide();
        });
        //点击叉号的效果
        $('.close').click(function(){
            $('.zhezhao').hide();
        });
        if(this.productlist.length!=0){
            refresher.init({
                id: "wrapper",
                pullDownAction: Refresh,
                pullUpAction: Load
            });
        }
    },
    updated:function () {
        myScroll.refresh();
    },
    methods: {
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserByIdForLogin"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                }
            }, false);
        },
        getImgUrl:function (name){
            return getImgUrl(name);
        },
        subText:function (text) {
            return text.length<30?text:text.substring(0,29)+'...'
        },
        select:function (id) {
            var ids = this.ids;
            var index = ids.indexOf(id);
            if(index>-1){
                this.ids.splice(index,1);
            }else{
                this.ids.push(id);
            }
        },
        quedingShanchu:function () {
            $.jsonAjax(getUrl("favourite/delItem"), {"ids[]": this.ids}, function (data, status, xhr) {
                for(var i=0;i<shoucang_shangpin.$data.ids.length;i++){
                    var id = shoucang_shangpin.$data.ids[i];
                    for(var j=0;j<shoucang_shangpin.$data.productlist.length;j++){
                        var product = shoucang_shangpin.$data.productlist[j];
                        if(product.id==id){
                            shoucang_shangpin.$data.productlist.splice(j,1);
                            break;
                        }
                    }
                }
                shoucang_shangpin.$data.ids=[];
            }, false);
            popUp_auto(1000,'删除成功');
            $('.zhezhao2').hide();
        },
        gotoGoods:function (item) {
            if($(".twoButton").css("display")=='none'){
                window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+item.itemId+"&skuId="+item.skuId;
            }else{
                this.select(item.id)
            }
        },
    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
    },
});

//上拉刷新下拉加载
var generatedCount = 0;
function Refresh() {
     setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
    myScroll.refresh();
    //     /****remember to refresh when you action was completed！！！****/
     }, 2000);
}
function Load() {
    setTimeout(function () {
        var nextPage = shoucang_shangpin.$data.pager.nextPage;
        var thisPage = shoucang_shangpin.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
        }else{
            refresher.info.pullUpLable = "上拉加载...";
            var data = {
                page:nextPage
            }
            $.jsonAjax(getUrl("buyercenter/favouriteProductsMap"),data,function(data,status,xhr){
                if(data.status=="200"){
                    shoucang_shangpin.$data.pager = data.data.pager;
                    shoucang_shangpin.$data.productlist = shoucang_shangpin.$data.productlist.concat(data.data.pager.records);
                    // console.log(data.data.records);
                    // console.log(shoucang_shangpin.$data.shoucang_shangpin);
                }else{
                    printAlert(data.msg);
                    window.location = '../2_login_sign/login_common.html';
                }
            },false);
            changeLabel(shoucang_shangpin.$data.pager.nextPage,shoucang_shangpin.$data.pager.page);
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