/**
 * Created by linxiaomei on 2017/4/25.
 */
$(function(){
    var label = $.getUrlParam("label");
    if(label=="multiple"){
        getPiLiang();
    }else{
        getDanyi();
    }
})
/**
 * 批量报价
 */
function getPiLiang() {
    $("#danyiLi").attr('class','');
    $("#piliangLi").attr('class','on');
    baojiaVM.$data.label = 'multiple'
    $.jsonAjax(getUrl("requestPriceController/responsePrice"),{},function(data,status,xhr){
        baojiaVM.$data.biaogeListPiLiang = data.pager.records;
        baojiaVM.$data.pager = data.pager;
    },false);
};
/**
 * 单一报价
 */
function getDanyi() {
    $("#danyiLi").attr('class','on');
    $("#piliangLi").attr('class','');
    baojiaVM.$data.label = 'single'
    $.jsonAjax(getUrl("sellercenter/inquiry"),{},function(data,status,xhr){
        if(data){
            baojiaVM.$data.biaogeListDanyi = data.pager.records;
            baojiaVM.$data.pager = data.pager;
        }
    },false);
};

var biaogeListDanyiOut=[];
var biaogeListPiLiangOut=[];
var pagerOut={};

var baojiaVM = new Vue({
    el:"#baojiaAll",
    data:{
        label:'single',
        biaogeListDanyi:[],
        biaogeListPiLiang:[],
        pager:{},
        choosedInquiry:{
            inquiryId:'',
            inquiryPrice:'',
            startTime:'',
            endTime:'',
            inquiryRemark:'',
            operateType:''//add update
        },
        goodsType:'',//记录是不是橡皮布如果是，询价弹窗里的input要有“不含铝夹的价格”
    },
    mixins:[math],
    methods:{
        //TODO:单一报价
        commitModify: function () {
            if(this.checkPrice()){
                var startTime = this.choosedInquiry.startTime;
                if( startTime == null || startTime == "" ){
                    popUp_auto_false(1500,"起始时间不能为空！");
                    return;
                }
                var endTime = this.choosedInquiry.endTime;
                if( endTime == null || endTime == "" ){
                    popUp_auto_false(1500,"结束时间不能为空！");
                    return;
                }
                if(startTime<this.time(new Date())){
                    popUp_auto_false(1500,"起始时间不能小于当前时间！");
                    return;
                }
                if(endTime<startTime){
                    popUp_auto_false(1500,"结束时间不能小于起始时间！");
                    return;
                }

                if(!this.choosedInquiry.inquiryRemark){
                    this.choosedInquiry.inquiryRemark = "";
                }
                $.jsonAjax(getUrl("sellercenter/modifyInquiry"),this.choosedInquiry,function(data,status,xhr){
                    if(data.success){
                        popUp_auto(1500,"报价成功");
                        getDanyi();
                        $('.daiShenHe').hide();
                        myScroll.refresh();
                    }else{
                        popUp_auto_false(1500,data.result);
                    }
                },false);
            }
        },
        checkPrice: function () {
            var inquiryPrice = this.choosedInquiry.inquiryPrice;
            var regPrice = /^(-)?(([1-9]{1}\d{0,8})|([0]{1}))(\.(\d){1,2})?$/;//价格最多：9位整数+小数点+2位整数
            if (!regPrice.exec(inquiryPrice)) {
                popUp_auto_false(1500,"输入金额有误！");
                return false;
            } else {
                if (inquiryPrice >= 0.01 && inquiryPrice <= 999999999) {
                    return true;
                } else {
                    popUp_auto_false(1500,"输入金额有误！");
                    return false;
                }
            }
        },
        seeOrUpdateInquiry: function (pinquiry,pOperateType,event,inquiry) {
            
            this.choosedInquiry.pOperateType = pOperateType;//用来区分是添加还是修改
            this.choosedInquiry.inquiryId = pinquiry.id;
            this.choosedInquiry.inquiryPrice = pinquiry.inquiryPrice;
            this.choosedInquiry.startTime = this.time(pinquiry.startTime);
            this.choosedInquiry.endTime = this.time(pinquiry.endTime);
            // this.choosedInquiry.inquiryRemark = "";
            this.choosedInquiry.inquiryRemark = pinquiry.inquiryRemark;
            if(pOperateType=="update"){
                //$(event.currentTarget).css({'background-image':'url(../../img/xiugaiiconhong@3x.png)','color':'#e60012'});
            }
            $('.daiShenHe').show();
            if(inquiry && inquiry.isAluminumClip){
                this.goodsType=1;
            }else {
                this.goodsType='';
            }
        },
        goToXiangQingYe: function (pitemId,pskuId) {
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+pitemId+"&skuId="+pskuId;
        },
        subTime:function (value) {
            var retTime = '';
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            if(value){
                var time = new Date(parseInt(value));
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();

                retTime =  y + '.' + add0(m) + '.' + add0(d);
            }
          return  retTime.substring(2,time.length);
        },
        time: function (value) {
            var retTime = '';
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            if(value){
                var time = new Date(value);
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();

                retTime =  y + '-' + add0(m) + '-' + add0(d);
            }
            return retTime;
        },
    },
    mounted:function(){
        initJqueryCase();
        // 上拉加载
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: Load
        });
    },
    updated:function(){
        myScroll.refresh();
        changeLabel(baojiaVM.$data.pager.nextPage,baojiaVM.$data.pager.page);
    }
});
//上拉刷新下拉加载
var generatedCount = 0;
function Refresh() {
    // setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
    popUp_open();
    initJqueryCase();
    popUp_close()
    myScroll.refresh();
    //     /****remember to refresh when you action was completed！！！****/
    // }, 2000);
}
function Load() {
    setTimeout(function () {
        var nextPage = baojiaVM.$data.pager.nextPage;
        var thisPage = baojiaVM.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
        }else{
            refresher.info.pullUpLable = "上拉加载...";
            var data = {
                page:nextPage,
                searchName:$("#searchName").val()
            }
            if(baojiaVM.$data.label=="single"){
                $.jsonAjax(getUrl("sellercenter/inquiry"),data,function(data,status,xhr){
                    baojiaVM.$data.biaogeListDanyi = baojiaVM.$data.biaogeListDanyi.concat(data.pager.records);
                    baojiaVM.$data.pager = data.pager;
                },false);
            }else if(baojiaVM.$data.label=="multiple"){
                $.jsonAjax(getUrl("requestPriceController/responsePrice"),data,function(data,status,xhr){
                    baojiaVM.$data.biaogeListPiLiang = baojiaVM.$data.biaogeListPiLiang.concat(data.pager.records);
                    baojiaVM.$data.pager = data.pager;
                },false);

            }
            changeLabel(baojiaVM.$data.pager.nextPage,baojiaVM.$data.pager.page);
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
function initJqueryCase(){
    //选项卡切换
    $(".xuanXiangKa ul li").click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
        var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
        $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
        $(".caoZuoAnNiu a").eq(index).show().siblings().hide();//促销管理
    });

    //询价管理
    $(".xuanXiangKa ul li").click(function(){
        $('.yincang').hide();
    });
    $('.xuanXiangKa ul li:last-child').click(function () {
        $('.yincang').show();
    });

    //点击确定的效果
    $('.queDing').click(function(){
        $('.zhezhao').hide();
        popUp_auto(1000,'执行成功');
    });
    //点击取消的效果
    $('.quXiao').click(function(){
        $('.zhezhao').hide();
    });

    //打开弹窗
    $('.juJue').click(function () {
        $('.zhezhao2').show();
    })
    //关闭弹窗
    $('.cancel,.close').click(function () {
        $('.zhezhao2').hide();
    })
    //判断文本框内容
    $('.sure').click(function () {
        if($('.text').val()==''){
            $('.textNone').show().delay(1000).hide(0);
            $('.textNone').html('请先填写拒绝原因！');
        }else{
            $('.zhezhao2').hide();
        }
    });
    //解决穿透
    $(".zheZhao,.zheZhao2").on("touchmove", function (e) {
        e.preventDefault();
    });

    //关闭弹窗
    $('.cancel,.close').click(function () {
        $('.daiShenHe').hide();
    });
    //选项卡切换
    $(".foot a").click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
    });

    $('.caoZuo input[type=button]').click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
    });
    $('.caoZuo input[type=button]:first-child').click(function(){
        popUp_auto(1000,'订单审核已通过');
    });
}

//以下搜索方法
function showList(){
    $("#xunjia_sousuo").hide();
    $("#baojiaAll").show();
};
function showSouSuo(){
    var label = "名称:";
    if(baojiaVM.$data.label=="single"){
        label = "商品名称:";
    }else if(baojiaVM.$data.label=="multiple"){
        label = "询价名称:";
    }
    $("#souSuoLabel").html(label);
    $("#xunjia_sousuo").show();
    $("#baojiaAll").hide();
}
function reset() {
    $("#searchName").val("");
}
function dosearch () {
    var inData = {
        searchName:$("#searchName").val()
    }
    if(baojiaVM.$data.label=="single"){
        $.jsonAjax(getUrl("sellercenter/inquiry"),inData,function(data,status,xhr){
            if(data){
                baojiaVM.$data.biaogeListDanyi = data.pager.records;
                baojiaVM.$data.pager = data.pager;
                showList();
            }
        },false);
    }else if(baojiaVM.$data.label=="multiple"){
        $.jsonAjax(getUrl("requestPriceController/responsePrice"),inData,function(data,status,xhr){
            baojiaVM.$data.biaogeListPiLiang = data.pager.records;
            baojiaVM.$data.pager = data.pager;
            showList();
        },false);
    }
}