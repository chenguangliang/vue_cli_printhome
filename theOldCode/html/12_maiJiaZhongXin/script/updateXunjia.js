/**
 * Created by Administrator on 2017/4/10.
 */
$(function(){

})
//获得网址上的参数
function getRequest(para) {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest[para];
}
//询价信息
var inquiryNo = '';
var xunjiaInfo = {};
var xunjia_xunjiaInfo = new Vue({
    el:"#xunjia_xunjiaInfo",
    data:{
        xunjiaInfo:{}
    },
    mixins:[math],
    beforeCreate: function () {
        inquiryNo = getRequest("inquiryNo");
        if(inquiryNo){
            $.jsonAjax(getUrl("requestPriceController/requestPriceUpdateMap"), {inquiryNo:inquiryNo}, function (data, status, xhr) {
                // console.log(data)
                if(data.status=="200"){
                    xunjiaInfo = data.data;
                    var formatData = Vue.filter('timestampFormat');
                    xunjiaInfo.endDate = formatData(xunjiaInfo.endDate,'YYYY-MM-DD');
                    xunjiaInfo.deliveryDate = formatData(xunjiaInfo.deliveryDate,'YYYY-MM-DD');
                    for(var i=0;i<xunjiaInfo.details.length;i++){
                        var detail = xunjiaInfo.details[i];
                        if(detail.tempDate){
                            detail.tempDate = formatData(detail.tempDate,'YYYY-MM-DD');
                        }
                    }
                    if(xunjiaInfo.annex=="null"){
                        xunjiaInfo.annex = "";
                    }
                }else{
                    popUp_auto(1000,data.msg);
                    window.setTimeout(function(){
                        window.location = '../2_login_sign/login_common.html';
                    },1000)

                }
            }, false);
        }else{
            popUp_auto_false(1000,"参数错误");
            window.setTimeout(function(){
                // window.location = '../12_maiJiaZhongXin/11_xunJiaGuanLi_xunJiaGuanLi.html';
                goback();
            },1000)
        }
    },
    created: function () {
        this.$data.xunjiaInfo = xunjiaInfo;
    },
    methods:{
        time: function (value) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date(value);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();

            return y + '-' + add0(m) + '-' + add0(d);
        },
        getImgUrl:function (name){
            return getImgUrl(name);
        },
        doNext: function () {
            if (
                $('#inquiryName').val() != 0 &&
                $('#endDate1').val() != 0 &&
                $('#deliveryDate1').val() != 0
            ) {
                $("#xunjia_xunjiaInfo").hide();
                $("#xunjia_xieyiwupin").show();
                if(xunjia_xieyiwupin.$data.wupindata.length==0){
                    xunjia_xieyiwupin.$data.wupindata = xunjiaInfo.details;
                }
            }
            else {
                popUp_auto_false(1000, '请完善信息后继续下一步');
            }
        }
    }
});
//协议物品
var xunjia_xieyiwupin = new Vue({
    el:"#xunjia_xieyiwupin",
    data:{
        wupindata:[],
        detCat:{},
        deleteId:[],
    },
    mixins:[math,common],
    methods:{
        time:function (value) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date(value);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();

            return y + '-' + add0(m) + '-' + add0(d);
        },
        //点击删除的效果
        shanChu:function(index,delIds) {
            this.$data.detCat = {index:index,delIds:delIds};
            $(this).css('background-image','url(../../img/shanchuhong@3x.png)');
            $('.zhezhao2').show();
        },
        doLast:function () {
            $("#xunjia_xunjiaInfo").show();
            $("#xunjia_xieyiwupin").hide();
        },
    }
});
//取消删除
function quxiaoShanchu() {
    $('.zhezhao2').hide();
}
//确定删除
function quedingShanchu() {
    xunjia_xieyiwupin.$data.wupindata.splice(xunjia_xieyiwupin.$data.detCat.index,1);
    xunjia_xieyiwupin.$data.deleteId.push(xunjia_xieyiwupin.$data.detCat.delIds);
    xunjia_xieyiwupin.$data.detCat = {};
    $('.zhezhao2').hide();
    popUp_auto(1000,'商品删除成功')
}

//新增商品
var xinZengShangPin = new Vue({
    el:"#xinZengShangPin",
    data:{
        pager:'',
        goodsList:[],
    },
    mounted: function (){
        // 上拉加载
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: Load
        });
        changeLabel(this.$data.pager.nextPage,this.$data.pager.page);
    },
    updated:function () {
        $("#xinZengShangPin .no-select").unbind('click');
        $(".unSelcet").unbind('click');
        $(".allUnSelect").unbind('click');
        $("#xinZengShangPin .no-select").click(function () {
            if ($(this).attr("src") == "../../img/no-select.png") {
                $(this).attr("src", "../../img/yes-select.png");
                $(this).parent().parent().parent().siblings().find('.no-select').attr("src", "../../img/no-select.png");
                $(this).parent().parent().siblings().find(".unSelcet,.allUnSelect").attr("src", "../../img/no-select.png");
                $(this).parent().parent().parent().siblings().find(".unSelcet,.allUnSelect").attr("src", "../../img/no-select.png");
                $(this).parent().parent().parent().siblings().find(".supplier").attr("data-choose", "0");
                $(this).parent().parent().next().slideToggle();
                $(this).parent().parent().parent().siblings().children('.goodsListBottom').slideUp();
            }
            else {
                $(this).attr("src", "../../img/no-select.png");
                $(this).parent().parent().siblings().find(".unSelcet,.allUnSelect").attr("src", "../../img/no-select.png");
                $(this).parent().parent().parent().siblings().find(".unSelcet,.allUnSelect").attr("src", "../../img/no-select.png");
                $(this).parent().parent().siblings().find(".supplier").attr("data-choose", "0");
                $(this).parent().parent().next().slideUp();
            }
        });

        ///*店铺img选中状态*/
        $(".unSelcet").click(function () {
            if (this.src.indexOf("no-select.png") == -1) {
                $(this).attr("src", "../../img/no-select.png");
                $(this).parent().parent(".supplier").attr("data-choose", "0");
                $(this).parent().parent().siblings(".allSelect").children(".allUnSelect").attr("src", "../../img/no-select.png");
            } else {
                $(this).attr("src", "../../img/yes-select.png");
                $(this).parent().parent(".supplier").attr("data-choose", "1");//当前父亲供应商被选中
                var a4 = $(this).parent().parent().parent(".goodsListBottom").find(".unSelcet");
                var count4 = 0;
                for (var i = 0; i < a4.length; i++) {
                    if (a4[i].src.indexOf("no-select.png") == -1) {
                        count4++;
                    }
                }
                if (count4 == a4.length) {
                    $(this).parent().parent().siblings(".allSelect").children(".allUnSelect").attr("src", "../../img/yes-select.png");
                } else {
                    $(this).parent().parent().siblings(".allSelect").children(".allUnSelect").attr("src", "../../img/no-select.png");
                }
            }
        });
        /*全选开始*/
        $(".allUnSelect").click(function () {
            if (this.src.indexOf("no-select.png") == -1) {
                $(this).parent().siblings(".supplier").attr("data-choose", "0");
                this.src = "../../img/no-select.png";
                $(this).parent().siblings(".supplier").find(".unSelcet").each(function (index, item) {
                    item.src = "../../img/no-select.png";
                });
            } else {
                $(this).parent().siblings(".supplier").attr("data-choose", "1");
                this.src = "../../img/yes-select.png";
                $(this).parent().siblings(".supplier").find(".unSelcet").each(function (index, item) {
                    item.src = "../../img/yes-select.png";
                });
            }
        });
        myScroll.refresh();
        changeLabel(this.$data.pager.nextPage,this.$data.pager.page);
    },
    methods: {
        loadGoods:function () {
            var itemName =$("#itemName").val();
            $.jsonAjax(getUrl("requestPriceController/productsListPrice"),{itemName:itemName},function(data,status,xhr){
                xinZengShangPin.$data.goodsList = data.data;
                xinZengShangPin.$data.pager = data.pager;
            },false);
        },
        getShops: function (item) {
            var data = {
                itemId:item.itemId,
                itemName:item.itemName
            }
            $.jsonAjax(getUrl("requestPriceController/getShopListMap"), data, function (data, status, xhr) {
                Vue.set(item,'shopList',data);
            }, false);
        },
        onReturn:function () {
            var itemName = '';
            var itemIds = '';
            var shopIds = '';
            var shopNames = '';
            $(".supplier").each(function() {
                if ($(this).attr("data-choose") == 1) {
                    itemName +=  $(this).parent().siblings().find(".goodsName").text()+",";//商品名称
                    itemIds += $(this).find("p:eq(0) span:eq(3)").text()+",";//供应商 商品 linkMan2 id
                    shopIds += $(this).find("p:eq(0) span:eq(2)").text()+",";//供应商 id
                    shopNames += $(this).find("p:eq(0) span:eq(1)").text()+",";//供应商 名称
                }
            });
            var tempDate = $('#deliveryDate1').val();
            $.jsonAjax(getUrl("requestPriceController/getSkuByItemIds"),{itemIds:itemIds,shopIds:shopIds,shopNames:shopNames,itemName:itemName,tempDate:tempDate},function(data,status,xhr){
                xunjia_xieyiwupin.$data.wupindata = xunjia_xieyiwupin.$data.wupindata.concat(data);
            },false);
            hideShangpin();
        },
        
    }
});
//保存询价
function tijiaobaocun() {

    if( inquiryNo == null ||  inquiryNo == "" ){
        popUp_auto_false(1000, '询价编号必填！');
        return;
    };
    var inquiryName=$("#inquiryName").val();//协议名称
    if( inquiryName == null ||  inquiryName == "" ){
        popUp_auto_false(1000, '询价名称必填！');
        return;
    };
    var nowDate = xunjia_xunjiaInfo.time(new Date());
    var beginDate=$("#beginDate1").text();//询价日期
    if( beginDate == null ||  beginDate == "" ){
        popUp_auto_false(1000, '询价日期必填！');
        return;
    };
    var endDate = $("#endDate1").val();
    if( endDate == null ||  endDate == "" ){
        popUp_auto_false(1000, '截至报价日期必填！');
        return;
    };
    if(endDate<nowDate){
        popUp_auto_false(1000, '截至报价日期不能早于今天！');
        return;
    }
    var deliveryDate = $("#deliveryDate1").val();
    if( deliveryDate == null ||  deliveryDate == "" ){
        popUp_auto_false(1000, '交货日期必填！');
        return;
    };
    if(deliveryDate<nowDate){
        popUp_auto_false(1000, '交货日期不能早于今天！');
        return;
    }
    var printerId = $("#printerId").val();
    if( printerId == null ||  printerId == "" ){
        popUp_auto_false(1000, '询价方必填！');
        return;
    };
    //询价截至时间、交货时间必须大于求购时间
    var start=new Date(beginDate);
    var end1=new Date(endDate);
    var end2=new Date(deliveryDate);
    if(start > end1){
        popUp_auto_false(1000, '询价截止日期必须大于询价日期！');
        return;
    }
    if(start > end2){
        popUp_auto_false(1000, '交货日期必须大于询价日期！');
        return;
    }
    if($("input[name='nums']").length == 0){
        popUp_auto_false(1000, '请至少选择一件物品进行询价！');
        return;
    }
    $("input[name='nums']").each(function(e){
        if($(this).val() == ""){
            popUp_auto_false(1000, '请输入正确数量！');
            $(this).focus();
            throw "请输入正确数量！";
        }
        if($(this).val() == "0"){
            popUp_auto_false(1000, '数量必需大于0！');
            $(this).focus();
            throw "数量必需大于0！";
        }
    });
    $("input[name='tempDate']").each(function(e){
        if($(this).val() == ""){
            popUp_auto_false(1000, '交货日期必填！');
            $(this).focus();
            throw "交货时期必填！";
        }
        if($(this).val()<nowDate){
            popUp_auto_false(1000, '交货日期不能早于今天！');
            $(this).focus();
            throw "交货时期必填！";
        }
    });
    var annex=xunjia_xunjiaInfo.$data.xunjiaInfo.annex;//附件
    if(!annex){
        annex = "";
    }
    var oldFileName=xunjia_xunjiaInfo.$data.xunjiaInfo.oldFileName;//附件名
    var wupindata = JSON.stringify(xunjia_xieyiwupin.$data.wupindata);
    var data = {
        inquiryNo: inquiryNo,
        inquiryName: inquiryName,
        printerId: printerId,
        annex: annex,
        oldFileName: oldFileName,
        beginDate1: beginDate,
        endDate1: endDate,
        deliveryDate1: deliveryDate,
        deleteId:xunjia_xieyiwupin.$data.deleteId.join(','),
        wupindata: wupindata,
        remarks:$("#remarks").val()
    };
    $.jsonAjax(getUrl("requestPriceJavaController/addInquiry"),data,function(data,status,xhr){
        if(data.status = "200"){
            popUp_auto(1000,"保存成功");
            window.setTimeout(function(){
                // window.location = '11_xunJiaGuanLi_xunJiaGuanLi.html';
                goback();
            },1000)
            //console.log(data);
        }else{
            popUp_auto_false(1000,data.msg);
        }
    },false);
}
//发布询价
function tijiaofabu() {
    if( inquiryNo == null ||  inquiryNo == "" ){
        popUp_auto_false(1000, '询价编号必填！');
        return;
    };
    var inquiryName=$("#inquiryName").val();//协议名称
    if( inquiryName == null ||  inquiryName == "" ){
        popUp_auto_false(1000, '询价名称必填！');
        return;
    };
    var nowDate = xunjia_xunjiaInfo.time(new Date());
    var beginDate=$("#beginDate1").text();//询价日期
    if( beginDate == null ||  beginDate == "" ){
        popUp_auto_false(1000, '询价日期必填！');
        return;
    };
    var endDate = $("#endDate1").val();
    if( endDate == null ||  endDate == "" ){
        popUp_auto_false(1000, '截至报价日期必填！');
        return;
    };
    if(endDate<nowDate){
        popUp_auto_false(1000, '截至报价日期不能早于今天！');
        return;
    }
    var deliveryDate = $("#deliveryDate1").val();
    if( deliveryDate == null ||  deliveryDate == "" ){
        popUp_auto_false(1000, '交货日期必填！');
        return;
    };
    if(deliveryDate<nowDate){
        popUp_auto_false(1000, '交货日期不能早于今天！');
        return;
    }
    var printerId = $("#printerId").val();
    if( printerId == null ||  printerId == "" ){
        popUp_auto_false(1000, '询价方必填！');
        return;
    };
    //询价截至时间、交货时间必须大于求购时间
    var start=new Date(beginDate);
    var end1=new Date(endDate);
    var end2=new Date(deliveryDate);
    if(start > end1){
        popUp_auto_false(1000, '询价截止日期必须大于询价日期！');
        return;
    }
    if(start > end2){
        popUp_auto_false(1000, '交货日期必须大于询价日期！');
        return;
    }
    if($("input[name='nums']").length == 0){
        popUp_auto_false(1000, '请至少选择一件物品进行询价！');
        return;
    }
    $("input[name='nums']").each(function(e){
        if($(this).val() == ""){
            popUp_auto_false(1000, '请输入正确数量！');
            $(this).focus();
            throw "请输入正确数量！";
        }
        if($(this).val() == "0"){
            popUp_auto_false(1000, '数量必需大于0！');
            $(this).focus();
            throw "数量必需大于0！";
        }
    });
    $("input[name='tempDate']").each(function(e){
        if($(this).val() == ""){
            popUp_auto_false(1000, '交货时期必填！');
            $(this).focus();
            throw "交货时期必填！";
        }
        if($(this).val()<nowDate){
            popUp_auto_false(1000, '交货日期不能早于今天！');
            $(this).focus();
            throw "交货时期必填！";
        }
    });
    var annex=xunjia_xunjiaInfo.$data.annex;//附件
    var oldFileName=xunjia_xunjiaInfo.$data.oldFileName;//附件名
    var wupindata = JSON.stringify(xunjia_xieyiwupin.$data.wupindata);
    var data = {
        inquiryNo: inquiryNo,
        inquiryName: inquiryName,
        printerId: printerId,
        annex: annex,
        oldFileName: oldFileName,
        beginDate1: beginDate,
        endDate1: endDate,
        deliveryDate1: deliveryDate,
        deleteId:xunjia_xieyiwupin.$data.deleteId.join(','),
        wupindata: wupindata,
        remarks:$("#remarks").val()
    };
    $.jsonAjax(getUrl("requestPriceJavaController/immediately"),data,function(data,status,xhr){
        if(data.msg.indexOf("失败")>-1){
            popUp_auto_false(1000,data.msg);
        }else{
            popUp_auto(1000,"发布成功");
            window.setTimeout(function(){
                // window.location = '11_xunJiaGuanLi_xunJiaGuanLi.html';
                goback();
            },1000)

        }
    },false);
}

//文件上传
function startUpload(){
    var fileInput = $("#fileInput")[0].files[0].name;
    if(fileInput.length>100){
        popUp_auto_false(1000,"文件的名称过长");
        return false;
    }
    var maxSize = 10240000;
    if ($("#fileInput")[0].files[0].size > maxSize) {
        popUp_auto_false(1000,"上传文件过大！");
        return false;
    }
    // StorageUtil.setItem("tempFileVal",fileInput);
    popUp_open();
    var checkUploadKey = getRandom();
    $.uploadFile({
        url:getUrl('/fileUpload/fileUploadCrossSize?date='+new Date()), //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'fileInput', //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        data:{
            size:10240000,
        },
        type:"post",
        success: function (data, status){  //服务器成功响应处理函数
            popUp_close();
            if(data.success){
                popUp_auto(1000,"上传成功!");

                xunjia_xunjiaInfo.$data.xunjiaInfo.annex = data.result;
                xunjia_xunjiaInfo.$data.xunjiaInfo.oldFileName = fileInput;
            }else{
                popUp_auto_false(1500,data.errorMessages);
            }
        },
        error: function (data, status, e){//服务器响应失败处理函数
            console.log(data);
            popUp_close();
        }
    // $.ajaxFileUpload({
        // url: getUrl('fileUpload/fileUploadCrossSize'), //用于文件上传的服务器端请求地址
        // secureuri: false, //是否需要安全协议，一般设置为false
        // fileElementId: 'fileInput', //文件上传域的ID
        // dataType: 'json', //返回值类型 一般设置为json
        // data:{
        //     size:10240000,
        //     checkUploadKey: checkUploadKey,
        // },
        // type:"post",
        // success: function (data, status){  //服务器成功响应处理函数
        //     $.jsonAjax(getUrl("fileUpload/fixedUploadCrossDomainResult"),{checkUploadKey:checkUploadKey},function(data, status, e){
        //         /**
        //          errorMessages  错误信息
        //          result         上传url
        //          resultMessage  成功信息
        //          success        成功状态
        //          */
        //         if(data.success){
        //             if(!data.result || data.result==null || data.result==""){
        //                 popUp_auto_false(1000,"文件上传失败，请重新上传！");
        //                 return;
        //             }else{
        //                 xunjia_xunjiaInfo.$data.xunjiaInfo.annex = data.result;
        //                 // var fileName = StorageUtil.getItemBytpe("tempFileVal",valueTypeObject);
        //                 // var  arr = fileName.split(/[\\/]/);
        //                 // xunjia_xunjiaInfo.$data.xunjiaInfo.oldFileName = arr[arr.length - 1];
        //                 // Vue.set(xunjia_xunjiaInfo.$data.xunjiaInfo,"oldFileName", arr[arr.length - 1]);
        //                 xunjia_xunjiaInfo.$data.xunjiaInfo.oldFileName = fileInput;
        //             }
        //
        //         }else{
        //             popUp_auto_false(1000,data.errorMessages);
        //         }
        //     },false);
        //     popUp_close();
        // },
        // error: function (data, status, e){//服务器响应失败处理函数
        //     popUp_close();
        // }
    },false);
}
function clearFile() {
    xunjia_xunjiaInfo.$data.xunjiaInfo.annex = '';
    xunjia_xunjiaInfo.$data.xunjiaInfo.oldFileName = '';
}
function getRandom(){
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for(var i = 0; i < 4 ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return new Date().getTime() + res;
}
//取消询价
function quxiaoXunjia() {
    $('.zhezhao').show();
}
//显示新增商品
function showShangpin() {
    $("#xunjia_xieyiwupin").hide();
    $("#xinZengShangPin").show();
    xinZengShangPin.loadGoods();
}
//隐藏新增商品
function hideShangpin() {
    $("#xinZengShangPin").hide();
    $("#xunjia_xieyiwupin").show();
    $(".unSelcet,.allUnSelect,.no-select").attr("src","../../img/no-select.png");
    $(".goodsListBottom").slideUp();
    $('.supplier').attr("data-choose","0");
}
//上拉刷新下拉加载
var generatedCount = 0;
function Refresh() {
    myScroll.refresh();
}
function Load() {
    setTimeout(function () {
        var nextPage = xinZengShangPin.$data.pager.nextPage;
        var thisPage = xinZengShangPin.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
        }else{
            refresher.info.pullUpLable = "上拉加载...";
            var data = {
                itemName:$("#itemName").val(),
                page:nextPage
            }
            $.jsonAjax(getUrl("requestPriceController/productsListPrice"),data,function(data,status,xhr){
                xinZengShangPin.$data.goodsList = xinZengShangPin.$data.goodsList.concat(data.data);
                xinZengShangPin.$data.pager = data.pager;
            },false);
            changeLabel(xinZengShangPin.$data.pager.nextPage,xinZengShangPin.$data.pager.page);
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

function goback() {
        window.location = '../../html/12_maiJiaZhongXin/11_xunJiaGuanLi_xunJiaGuanLi.html?label=multiple';
}