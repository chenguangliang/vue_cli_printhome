$(function () {
    shopInfo.getXinxiInfo();
    shopInfo.getAuditDetail();
    // shopInfo.getLeiMu();
    // shopInfo.getPinPai();
    var label = $.getUrlParam("label");
    if(!label){
        label = "xinXi";
    }
    $("#"+label).click();
})
//店铺信息展示
var shopInfo = new Vue({
    el:"#shopInfo",
    data:{
        //以下基本信息内容
        shopInfo:'',
        auditStatus:'',
        shopEvaluationResult:'',
        editUrl:'13_dianPuXinXiXiuGai_dianPuJiBenXinXiXiuGai.html',
        showEdit:true,
        shopAuditInfo:{},
        //以下类目信息内容
        passedCategoryList:{},
        auditCategoryNameList:{},
        rejectedCategoryList:{},
        rejectCommentMap:{},
        rejectedCategoryText:'',
        rejectedCategoryComment:'',
        rejectedType:'',
        //以下品牌信息内容
        shopBrandList:{},
        
    },
    mixins:[common],
    // beforeCreate: function () {
    //     $.jsonAjax(getUrl("shopBaseInfoController/shopInfo"),{},function(data,status,xhr){
    //         if(data.status=="200"){
    //             console.log(data.data);
    //             shopInfo = data.data.shopInfo;
    //             auditStatus = data.data.auditStatus;
    //             shopEvaluationResult = data.data.shopEvaluationResult;
    //             categoryNameList = data.data.categoryNameList;
    //             shopBrandList = data.data.shopBrandList;
    //         }else{
    //             popUp_auto(1000,data.msg);
    //             // window.location = '../../html/2_login_sign/login_common.html';
    //         }
    //     },false);
    // },
    // created: function () {
    //     this.$data.shopInfo = shopInfo;
    //     this.$data.auditStatus = auditStatus;
    //     this.$data.shopEvaluationResult = shopEvaluationResult;
    //     this.$data.categoryNameList = categoryNameList;
    //     this.$data.shopBrandList = shopBrandList;
    // },
    mounted:function () {
        //选项卡切换
        $(".xuanXiangKa ul li").click(function(){
            $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
            var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
            $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
            // $(".caoZuoAnNiu a").eq(index).show().siblings().hide();
        });
        // //经营品牌折叠效果
        // $(".items").click(function(){
        //     if(
        //         $(this).next(".brand").css("display")==("block")
        //     ){
        //         $(this).next(".brand").css("display","none");
        //     }
        //     else{
        //         $(this).next(".brand").css("display","block");
        //     }
        // });
    },
    updated:function(){
        $(".items").unbind("click");
        //经营品牌折叠效果
        $(".items").click(function(){
            if(
                $(this).parent().next(".brand").css("display")==("block")
            ){
                $(this).parent().next(".brand").css("display","none");
            }
            else{
                $(this).parent().next(".brand").css("display","block");
            }
        });
    },
    methods: {
        //获取店铺基本信息
        getXinxiInfo:function () {
            $.jsonAjax(getUrl("shopBaseInfoController/shopInfo"),{},function(data,status,xhr){
                if(data.status=="200"){
                    shopInfo.$data.shopInfo = data.data.shopInfo;
                    shopInfo.$data.auditStatus = data.data.auditStatus;
                    shopInfo.$data.shopEvaluationResult = data.data.shopEvaluationResult;
                    shopInfo.$data.editUrl = "13_dianPuXinXiXiuGai_dianPuJiBenXinXiXiuGai.html";
                    if(shopInfo.$data.auditStatus=='0'){
                        shopInfo.$data.showEdit = false;
                    }else{
                        shopInfo.$data.showEdit = true;
                    }
                }else{
                    popUp_auto(1000,data.msg);
                    // window.location = '../../html/2_login_sign/login_common.html';
                }
            },false);
        },
        //获取店铺修改信息
        getAuditDetail:function () {
            $.jsonAjax(getUrl("shopBaseInfoController/shopAuditDetail"),{},function(data,status,xhr){
                if(data.status=="200"){
                    var shopAuditDetailList = data.data;
                    for(var i=0;i<shopAuditDetailList.length;i++){
                        var shopAudit = shopAuditDetailList[i];
                        shopInfo.$data.shopAuditInfo[shopAudit.propertiesColumn]=shopAudit.afterChange;
                    }
                }else{
                    popUp_auto(1000,data.msg);
                }
            },false);
        },
        //获取经营类目
        getLeiMu:function () {
            $.jsonAjax(getUrl("shopManageCategoryController/shopLMInfo"),{},function(data,status,xhr){
                if(data.status=="200"){
                    shopInfo.$data.passedCategoryList = data.data.passedCategoryList;
                    shopInfo.$data.auditCategoryNameList = data.data.auditCategoryNameList;
                    shopInfo.$data.rejectedCategoryList = data.data.rejectedCategoryList;
                    shopInfo.$data.rejectCommentMap = data.data.rejectComment;
                    shopInfo.$data.editUrl = "13_dianPuXinXiXiuGai_dianPuJingYingLeiMuXiuGai.html";
                    if(!shopInfo.isEmptyObject(shopInfo.$data.auditCategoryNameList)){
                        shopInfo.$data.showEdit = false;
                    }else{
                        shopInfo.$data.showEdit = true;
                    }
                }else{
                    popUp_auto(1000,data.msg);
                }
            },false);
        },
        //获取经营品牌
        getPinPai:function () {
            $.jsonAjax(getUrl("shopManageBrandController/shopPPInfo"),{},function(data,status,xhr){
                if(data.status=="200"){
                    shopInfo.$data.shopBrandList = data.data.dataMap;
                    shopInfo.$data.editUrl = "13_dianPuXinXiXiuGai_dianPuJingYingPinPaiXiuGai.html";
                    if(data.data.applyData){
                        shopInfo.$data.showEdit = false;
                    }else{
                        shopInfo.$data.showEdit = true;
                    }
                }else{
                    popUp_auto(1000,data.msg);
                }
            },false);

        },
        // 基本信息查看驳回原因
        showReason:function () {
            $(".reject_reason_prop").show();
            clockedBody();
        },
        hideReason:function () {
            $(".reject_reason_prop").hide();
            unClockedBody();
        },
        // 经营类目查看驳回原因
        show_category_reject_prop_lm:function (entity,key) {
            shopInfo.$data.rejectedType = '类目';
            shopInfo.$data.rejectedCategoryText = entity;
            shopInfo.$data.rejectedCategoryComment = shopInfo.$data.rejectCommentMap[key];
            $(".category_reject_prop").show();
            clockedBody();
        },
        // 经营品牌查看驳回原因
        show_category_reject_prop_pp:function (entity,key) {
            shopInfo.$data.rejectedType = '品牌';
            shopInfo.$data.rejectedCategoryText = entity;
            shopInfo.$data.rejectedCategoryComment = key;
            $(".category_reject_prop").show();
            clockedBody();
        },
        hide_category_reject_prop:function () {
            $(".category_reject_prop").hide();
            unClockedBody();
        },
        //查看修改明细
        showDetail: function () {
            $(".revise_detail").show();
            $(".main").hide();
        },
        hideDetail:function () {
            $(".revise_detail").hide();
            $(".main").show();
        },
        getImgUrl:function (name){
            var url = "";
            if(name){
                url = getImgUrl(name);
            }
            return url;
        },
        getShopType:function (type){
            var typeStr = "";
            if(type=='1'){
                typeStr='品牌商';
            }else if(type=='2'){
                typeStr='经销商';
            }
            return typeStr;
        },
        getBrandType:function (type){
            var typeStr = "";
            if(type=='1'){
                typeStr='国内品牌';
            }else if(type=='2'){
                typeStr='国际品牌';
            }else if(type=='3'){
                typeStr='合资品牌';
            }
            return typeStr;
        },
        getBusinessType:function (type){
            var typeStr = "";
            if(type=='1'){
                typeStr='自有品牌';
            }else if(type=='2'){
                typeStr='代理品牌';
            }
            return typeStr;
        },
        showImg:function (event) {
            var url = $(event.currentTarget).attr("src");
            $("#imgDiv").attr("src",url);
            $(".showBigImgProp").show();
            clockedBody();
        },
        hideImg:function () {
            $("#imgDiv").attr("src",'');
            $(".showBigImgProp").hide();
            unClockedBody();
        },
        showPinPai:function (event,text) {
            var url = $(event.currentTarget).attr("src");
            $("#pinPaiImg").attr("src",url);
            $("#pinPaiText").html(text);
            $(".pinPai_bg").show();
            clockedBody();
        },
        hidePinPai:function () {
            $("#pinPaiImg").attr("src",'');
            $("#pinPaiText").html('');
            $(".pinPai_bg").hide();
            unClockedBody();
        },
        changeRunStatus:function (status) {
            if(status == '1'){
                printConfirm("确定要开启该店铺吗？",function () {
                    $.jsonAjax(getUrl("shopBaseInfoController/openShop"),{},function(data,status,xhr){
                        if(data.result=='success'){
                            popUp_auto(1000,"恭喜店铺开启成功！");
                            shopInfo.$data.shopInfo.runStatus = 1;
                        }else{
                            popUp_auto(1000,data.message);
                        }
                    });
                })
            }else if(status == '2'){
                printConfirm("确定要关闭店铺？<br/>关闭店铺后，该店铺的所有商品会下架！",function () {
                    $.jsonAjax(getUrl("shopBaseInfoController/closeShop"),{},function(data,status,xhr){
                        if(data.result=='success'){
                            popUp_auto(1000,"店铺关闭成功！");
                            shopInfo.$data.shopInfo.runStatus = 2;
                        }else{
                            popUp_auto(1000,data.message);
                        }
                    });
                })
            }
        },
        gotoEdit:function () {
            if(shopInfo.$data.shopInfo.runStatus=='1'){
                window.location = shopInfo.$data.editUrl;
            }else{
                popUp_auto(1000,"店铺已关闭，无法操作店铺信息！")
            }
        },
        // changeEdit:function () {
        //     if(shopInfo.$data.label=='xinXi'){
        //         shopInfo.$data.editUrl = "13_dianPuXinXiXiuGai_dianPuJiBenXinXiXiuGai.html";
        //         if(auditStatus=='0'){
        //             shopInfo.$data.showEdit = false;
        //         }
        //     }else if(shopInfo.$data.label=='leiMu'){
        //         shopInfo.$data.editUrl = "13_dianPuXinXiXiuGai_dianPuJingYingLeiMuXiuGai.html";
        //         if(auditStatus=='0'){
        //             shopInfo.$data.showEdit = false;
        //         }
        //     }else if(shopInfo.$data.label=='pinPai'){
        //         shopInfo.$data.editUrl = "13_dianPuXinXiXiuGai_dianPuJingYingPinPaiXiuGai.html";
        //         if(auditStatus=='0'){
        //             shopInfo.$data.showEdit = false;
        //         }
        //     }
        // }

    }
});


