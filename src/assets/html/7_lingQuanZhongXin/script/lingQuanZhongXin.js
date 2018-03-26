
/**
 * 领券中心
 */
$(function(){

})
var couponsDTOs = {};
var pager = '';
var lingquanzhongxin = new Vue({
    el:"#lingquanzhongxin",
    data:{
        costAllocationVal:'',
        costAllocationData:[{code:"",label:"发布方"},{code:"1",label:"平台发布"},{code:"2",label:"店铺发布"}],
        couponTypeVal:'',
        couponTypeData:[{code:"",label:"券种"},{code:"1",label:"满减券"},{code:"2",label:"折扣券"},{code:"3",label:"现金券"}],
        couponUsingRangeVal:'',
        couponUsingRangeData:[{code:"",label:"可用范围"},{code:"1",label:"平台通用类"},{code:"2",label:"店铺通用类"},{code:"3",label:"品类通用类"},{code:"4",label:"指定商品类"}],
        couponsDTOs:{},
        pager:'',
        shopList:[],
        skuList:[],
        lmList:[],
        //用户信息
        userInfo:"",

    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("coupons/getCouponsCenter"),{},function(data,status,xhr){
            if(data.status=="200"){
                couponsDTOs = data.data.couponsDTOs;
                pager = data.data.pager;
            }
        },false);
    },
    created: function () {
        this.couponsDTOs = couponsDTOs;
        this.pager = pager;
    },
    mounted: function (){
        //点击导航显示下拉菜单
        $(".selemenu").click(function(){
            $(this).next().slideToggle();
            $(this).parents().siblings().find(".citylist").slideUp();
            if($(this).parent().hasClass('xiala')){
                $(this).parent().removeClass('xiala').addClass('xiangshang');
                $(this).parent().siblings('.selemediv ').removeClass('xiangshang').addClass('xiala');
            }else{
                $(this).parent().removeClass('xiangshang').addClass('xiala');
            }
        });
        //点击下拉菜单改变导航
        $(".citylist ul li").click(function(){
            var text=$(this).text();
            $(this).parent().parent().prev().html(text);
            if($(this).parent().parent().parent().hasClass('xiala')){
                $(this).parent().parent().parent().removeClass('xiala').addClass('xiangshang');
            }else{
                $(this).parent().parent().parent().removeClass('xiangshang').addClass('xiala');
            }
            $(this).parent().parent().hide();
        });
        //点击其他地方收回下拉菜单
        $(document).not($(".selemediv")).click(function(){
            $(".citylist").slideUp();
        })
        $(".selemediv").click(function(event){
            event.stopPropagation();
        })

        // 上拉加载
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: Load
        });
        changeLabel(this.$data.pager.nextPage,this.$data.pager.page);
    },
    updated:function () {
        myScroll.refresh();
        changeLabel(this.$data.pager.nextPage,this.$data.pager.page);
    },
    methods: {
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                }
            }, false);
        },
        getImgUrl: function (name) {
            return getImgUrl(name);
        },
        time: function (value) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date(parseInt(value));
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();

            return y + '-' + add0(m) + '-' + add0(d);
        },
        //按条件搜索
        changeVal:function (type,value) {
            if(type=="quanbu"){
                this.costAllocationVal = '';
                this.couponTypeVal = '';
                this.couponUsingRangeVal = '';
                $("#costAllocation").text("发布方");
                $("#couponType").text("券种");
                $("#couponUsingRange").text("可用范围");
            }else if(type=="costAllocation"){
                this.costAllocationVal = value;
            }else if(type=="couponType"){
                this.couponTypeVal = value;
            }else if(type=="couponUsingRange"){
                this.couponUsingRangeVal = value;
            }
            var data={
                costAllocation:this.costAllocationVal,
                couponType:this.couponTypeVal,
                couponUsingRange:this.couponUsingRangeVal
            }
            $.jsonAjax(getUrl("coupons/getCouponsCenter"),data,function(data,status,xhr){
                if(data.status=="200"){

                    lingquanzhongxin.$data.couponsDTOs = data.data.couponsDTOs;
                    lingquanzhongxin.$data.pager = data.data.pager;
                    // changeLabel(lingquanzhongxin.$data.pager.nextPage,lingquanzhongxin.$data.pager.page);
                }
            },false);
        },
        //选择优惠券颜色
        getYanse:function (entity) {
            var retClass = "";
            //优惠券状态 0-未开始 1-已开始 2-已结束 3-已中止 4-待送审 5-待审核 6- 审核驳回 7-已领完
            if(entity.state == '2' ||entity.state == '3'){
                retClass = "yiguoqi";
            }else if(entity.isGet=="true" || entity.state == '7'){
                retClass = "yilingwan";
            }else if(entity.couponType == '1'){
                retClass = "manjian";
            }else if(entity.couponType == '2'){
                retClass = "dazhe";
            }else if(entity.couponType == '3'){
                retClass = "xianjin";
            }
            return retClass;
        },
        //选择适用范围
        getURClass:function (range) {
            var retClass = "";
            if(range=="1"){
                retClass = "pingTai";
            }else if(range=="2"){
                retClass = "dianPu";
            }else if(range=="3"){
                retClass = "pinLei";
            }else if(range=="4"){
                retClass = "zhiDing";
            }
            return retClass;
        },
        //适用范围
        getUsingRange:function (range) {
            var retText = "";
            if(range=="1"){
                retText = "平台通用类";
            }else if(range=="2"){
                retText = "店铺通用类";
            }else if(range=="3"){
                retText = "品类通用类";
            }else if(range=="4"){
                retText = "指定商品类";
            }
            return retText;
        },
        //领取优惠券
        getCoupons:function (entity,e) {

            if(entity.isGet=="true"||entity.state == '2' ||entity.state == '3'||entity.state == '7'){
                return;
            }else{
                $.jsonAjax(getUrl("coupons/getCoupons1"),{couponId: entity.couponId},function(data,status,xhr){
                    if(data.resultMessage){
                        if(data.result){//已经领取最大数量
                            $(e.currentTarget).css({"background": 'url("../../img/lingwan@3x.png") no-repeat', "background-size": "100% 100%"})
                            $(e.currentTarget).children(".yilingqu").css({"display": "block"});
                        }
                        popUp_auto(1000,data.resultMessage);
                    }else{
                        console.log(entity.couponId)
                        console.log(data.errorMessages)
                        popUp_auto_false(1000,data.errorMessages);
                    }
                },false);
            }
        },
        //截取字符串
        getSubText:function (text,needLeng) {
            var retText =text;
            if (text.length > needLeng) {
                retText = text.substr(0, needLeng) + '...';
            }
            return retText;
        },
        //优惠券弹窗
        getCouponInfo:function (entity,e) {
            lingquanzhongxin.$data.shopList =[];
            lingquanzhongxin.$data.lmList =[];
            lingquanzhongxin.$data.skuList =[];
                $.jsonAjax(getUrl("coupons/couponShowListMap"),{couponsId: entity.couponId},function(data,status,xhr){
                var couponInfoList = data.data.dataInfo;
                // console.log(couponInfoList)
                if(couponInfoList!=null){
                    var subInfoList = couponInfoList.slice(1,couponInfoList.length-1);
                    if(couponInfoList[0].couponUsingRange==2){
                        // 店铺弹窗
                        lingquanzhongxin.$data.shopList = subInfoList;
                    }else if(couponInfoList[0].couponUsingRange==3){
                        // 品类弹窗
                        // lingquanzhongxin.$data.lmList = subInfoList;
                        var pinleiList = [];
                        for(var m=0;m<subInfoList.length;m++){
                            var info = subInfoList[m];
                            var newLm = {};
                            newLm.lm1 = info.itemName;
                            newLm.lm2 = info.itemId;
                            newLm.lm3 = info.skuAttr;
                            newLm.lmId1 = info.categoryNme;
                            newLm.lmId2 = info.couponId;
                            newLm.lmId3 = info.price;
                            pinleiList = checkLM(pinleiList,newLm);
                        }
                        lingquanzhongxin.$data.lmList = pinleiList;

                    }else if(couponInfoList[0].couponUsingRange==4){
                        // 指定弹窗
                        lingquanzhongxin.$data.skuList = subInfoList;
                    }
                }
            },false);
            $(e.currentTarget).css({"background": 'url("../../img/dianji@3x.png") no-repeat', "background-size": "100% 100%"});
            if(entity.couponUsingRange==1){
                //平台弹窗
                $('#pingtaitanchuang').show();
            }else if(entity.couponUsingRange==2){
                //店铺弹窗
                $('#dianputanchuang,#dian').show();
            }else if(entity.couponUsingRange==3){
                //品类弹窗
                $('#pinleitanchuang,#pin').show();
            }else if(entity.couponUsingRange==4){
                //指定弹窗
                $('#zhidingtanchuang,#zhi').show();
            }
        },
        //隐藏弹窗
        hideDiv:function (div) {
            $("#"+div).hide();
        },
        //显示弹窗2
        showLM2:function (e) {

            if (!$(e.currentTarget).hasClass('dianjihou')) {
                $(e.currentTarget).addClass('dianjihou').parent().siblings().children('.kezi').removeClass('dianjihou');
            } else {
                $(e.currentTarget).removeClass('dianjihou');
            }
            if($(e.currentTarget).children().hasClass('yijibg')) {
                $(e.currentTarget).children().removeClass('yijibg').addClass('yijibg2').parent().parent().siblings().children().children().removeClass('yijibg2').addClass('yijibg');
            } else {
                $(e.currentTarget).children().removeClass('yijibg2').addClass('yijibg');
            }
            $(e.currentTarget).next().slideToggle().parent().siblings().children('.erji').slideUp();
        },
        //显示弹窗3
        showLM3:function (e) {
            if(!$(e.currentTarget).hasClass('sanji_top_color2')) {
                $(e.currentTarget).removeClass('sanji_top_color').addClass('sanji_top_color2').parent().siblings().children('.sanji_top ').removeClass('sanji_top_color2').addClass('sanji_top_color');
            } else {
                $(e.currentTarget).removeClass('sanji_top_color2');
            }
            $(e.currentTarget).next('.sanji_bottom').slideToggle().parent().siblings().children('.sanji_bottom ').slideUp();
        },
        //优惠券详情 SKU
        gotoGoods:function (item) {
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+item.itemId+"&skuId="+item.skuId;
        },
        //shop
        gotoShop:function (shop) {
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?shopId="+shop.itemId;
        }
    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
    },
});

function checkLM(pinleiList,newLm) {
    // {'lm1':'1','lm2':'2','lm3':'3'}
    //{'lm1':'1',child:[{'lm2':'2',child:[{'lm3':'3'},{'lm3':'32'}]}]}
    var has1 = false;
    for(var a=0;a<pinleiList.length;a++){
        var pinlei1 = pinleiList[a];
        if(pinlei1.id==newLm.lmId1){
            has1 = true;
            var has2 = false;
            for(var b=0;b<pinlei1.child.length;b++){
                var pinlei2 = pinlei1.child[b];
                if(pinlei2.id==newLm.lmId2){
                    has2 = true;
                    var has3 = false;
                    for(var c=0;c<pinlei2.child.length;c++){
                        var peilei3 = pinlei2.child[c];
                        if(peilei3.id==newLm.lmId3){
                            has3 = true;
                            break;
                        }
                    }
                    if(!has3){
                        var newpeilei3 = {};
                        newpeilei3.id = newLm.lmId3;
                        newpeilei3.name = newLm.lm3;
                        pinlei2.child.push(newpeilei3);
                    }
                    break;
                }
            }
            if(!has2){
                var newpeilei3 = {};
                newpeilei3.id = newLm.lmId3;
                newpeilei3.name = newLm.lm3;
                var newpeilei2 = {'id':'','name':'','child':[]};
                newpeilei2.id = newLm.lmId2;
                newpeilei2.name = newLm.lm2;
                newpeilei2.child.push(newpeilei3);
                pinlei1.child.push(newpeilei2);
            }
            break;
        }
    }
    if(!has1){
        var newpeilei3 = {};
        newpeilei3.id = newLm.lmId3;
        newpeilei3.name = newLm.lm3;
        var newpeilei2 = {'id':'','name':'','child':[]};
        newpeilei2.id = newLm.lmId2;
        newpeilei2.name = newLm.lm2;
        newpeilei2.child.push(newpeilei3);
        var newpeilei1 = {'id':'','name':'','child':[]};
        newpeilei1.id = newLm.lmId1;
        newpeilei1.name = newLm.lm1;
        newpeilei1.child.push(newpeilei2);
        pinleiList.push(newpeilei1);
    }
    return pinleiList;
}

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
        var nextPage = lingquanzhongxin.$data.pager.nextPage;
        var thisPage = lingquanzhongxin.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
        }else{
            refresher.info.pullUpLable = "上拉加载...";
            var data = {
                costAllocation:lingquanzhongxin.$data.costAllocationVal,
                couponType:lingquanzhongxin.$data.couponTypeVal,
                couponUsingRange:lingquanzhongxin.$data.couponUsingRangeVal,
                page:nextPage
            }
            $.jsonAjax(getUrl("coupons/getCouponsCenter"),data,function(data,status,xhr){
                if(data.status=="200"){
                    lingquanzhongxin.$data.pager = data.data.pager;
                    lingquanzhongxin.$data.couponsDTOs = lingquanzhongxin.$data.couponsDTOs.concat(data.data.couponsDTOs);
                }else{
                    printAlert(data.msg);
                    window.location = '../2_login_sign/login_common.html';
                }
            },false);
            changeLabel(lingquanzhongxin.$data.pager.nextPage,lingquanzhongxin.$data.pager.page);
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