
/**
 * 求购明细
 */
$(function(){

})
var pager = '';
var shoplist = '';
var shoucang_dianpu = new Vue({
    el:"#shoucang_dianpu",
    data:{
        pager:'',
        shoplist:'',
        ids:[],
        bianji:false,
        //用户信息
        userInfo:"",
    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("buyercenter/favouriteShopsMap"), {}, function (data, status, xhr) {
            if (data.status == "200") {
                pager = data.data.pager;
                shoplist = data.data.pager.records;
                // console.log(pager);
            } else {
                printAlert(data.msg);
                window.location = '../2_login_sign/login_common.html';
            }
        }, false);
    },
    created: function () {
        this.$data.pager = pager;
        this.$data.shoplist = shoplist;
    },
    mounted: function () {
        // //点击编辑的效果
        $('.bianJi').click(function(){
            $(this).hide();
            $('.twoButton').show();
            $('.gouXuan').css('display','inline-block');
            shoucang_dianpu.$data.bianji=true;


        });
        //点击保存的效果
        $('.baoCun').click(function(){
            $(this).parent().hide();
            $('.bianJi').show();
            $('.gouXuan').hide();
            shoucang_dianpu.$data.bianji=false;
        });
        //点击删除的效果
        $('.shanChu').click(function(){
            if(shoucang_dianpu.$data.ids.length==0){
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
        if(this.shoplist.length!=0){
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
            if(!this.bianji){
                return text.length<17?text:text.substring(0,16)+'...'
            }else{
                return text.length<14?text:text.substring(0,13)+'...'
            }
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
            $.jsonAjax(getUrl("favourite/delShop"), {"ids[]": this.ids}, function (data, status, xhr) {
                for(var i=0;i<shoucang_dianpu.$data.ids.length;i++){
                    var id = shoucang_dianpu.$data.ids[i];
                    for(var j=0;j<shoucang_dianpu.$data.shoplist.length;j++){
                        var product = shoucang_dianpu.$data.shoplist[j];
                        if(product.id==id){
                            shoucang_dianpu.$data.shoplist.splice(j,1);
                            break;
                        }
                    }
                }
                shoucang_dianpu.$data.ids=[];
            }, false);
            popUp_auto(1000,'删除成功');
            $('.zhezhao2').hide();
        },
        gotoShop:function (shop) {
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?shopId="+shop.shopId;
        },
        gotoGoods:function (item) {
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+item.itemId;
        }
    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
    },
});

//上拉刷新下拉加载
var generatedCount = 0;
function Refresh() {
    myScroll.refresh();
}
function Load() {
    setTimeout(function () {
        var nextPage = shoucang_dianpu.$data.pager.nextPage;
        var thisPage = shoucang_dianpu.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
        }else{
            refresher.info.pullUpLable = "上拉加载...";
            var data = {
                page:nextPage
            }
            $.jsonAjax(getUrl("buyercenter/favouriteShopsMap"),data,function(data,status,xhr){
                if(data.status=="200"){
                    shoucang_dianpu.$data.pager = data.data.pager;
                    shoucang_dianpu.$data.shoplist = shoucang_dianpu.$data.shoplist.concat(data.data.pager.records);
                    // console.log(data.data.records);
                    // console.log(shoucang_dianpu.$data.shoucang_dianpu);
                }else{
                    printAlert(data.msg);
                    window.location = '../2_login_sign/login_common.html';
                }
            },false);
            changeLabel(shoucang_dianpu.$data.pager.nextPage,shoucang_dianpu.$data.pager.page);
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