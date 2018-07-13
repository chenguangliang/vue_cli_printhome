$(function () {
    
})
//店铺信息展示
var passedCategoryList = '';
var rejectedCategoryList = '';
var existCids = '';
var rejectCommentMap = '';
var shopInfoLMEdit = new Vue({
    el:"#shopInfoLMEdit",
    data:{
        passedCategoryList:'',
        newCategoryList:{},
        newCategory:'',
        rejectedCategoryList:'',
        rejectCommentMap:'',
        // existCids:'',
        rejectedCategoryText:'',
        rejectedCategoryComment:'',
        categoryLV1List:[],
        categoryLV2List:[],
        categoryLV3List:[],
    },
    mixins:[common],
    beforeCreate: function () {
        $.jsonAjax(getUrl("shopManageCategoryController/shopLMInfo"),{},function(data,status,xhr){
            if(data.status=="200"){
                passedCategoryList = data.data.passedCategoryList;
                rejectedCategoryList = data.data.rejectedCategoryList;
                rejectCommentMap = data.data.rejectComment;
                // existCids = data.data.existCids;
                console.log(data.data);
            }else{
                popUp_auto(1000,data.msg);
                // window.location = '../../html/2_login_sign/login_common.html';
            }
        },false);
    },
    created: function () {
        this.$data.passedCategoryList = passedCategoryList;
        this.$data.rejectedCategoryList = rejectedCategoryList;
        this.$data.rejectCommentMap = rejectCommentMap;
        // this.$data.existCids = existCids;
    },
    mounted:function () {
        // 新增类目
        $('.xinZengLeiMu').click(function(){
            shopInfoLMEdit.getCategoryLV1();
            $('.xinZengLeiMuTanChuang').show();
            clockedBody();
        });
        //关闭弹窗
        $('.xinZengLeiMuTanChuang .cancel, .xinZengLeiMuTanChuang .close,.xinZengLeiMuTanChuang .bg').click(function () {
            $('.xinZengLeiMuTanChuang').hide();
            unClockedBody();
        });
//         //删除类目弹窗
//         $('.shanChu').click(function(){
//             $('.shanChuTanChuang').show();
//             clockedBody();
//         });
// //关闭弹窗
//         $('.shanChuTanChuang a,.shanChuTanChuang .bg').click(function () {
//             $('.shanChuTanChuang').hide();
//             unClockedBody();
//         });
// //点击确定的效果
//         $(".shanChuTanChuang p a:last-child").click(function(){
//             popUp_auto(1000,'删除成功');
//         });
        // //经营类目查看驳回原因
        // $('.xinZengLeiMu').click(function(){
        //     $('.xinZengLeiMuTanChuang').show();
        // });
        // //关闭弹窗
        // $('.xinZengLeiMuTanChuang .cancel, .xinZengLeiMuTanChuang .close').click(function () {
        //     $('.xinZengLeiMuTanChuang').hide();
        // });
    },
    methods: {
        init:function () {
            $.jsonAjax(getUrl("shopManageCategoryController/shopLMInfo"),{},function(data,status,xhr){
                if(data.status=="200"){
                    passedCategoryList = data.data.passedCategoryList;
                    rejectedCategoryList = data.data.rejectedCategoryList;
                    rejectCommentMap = data.data.rejectComment;
                }else{
                    popUp_auto(1000,data.msg);
                    // window.location = '../../html/2_login_sign/login_common.html';
                }
            },false);
        },
        // 经营类目查看驳回原因
        show_category_reject_prop_lm:function (entity,key) {
            shopInfoLMEdit.$data.rejectedCategoryText = entity;
            shopInfoLMEdit.$data.rejectedCategoryComment = shopInfoLMEdit.$data.rejectCommentMap[key];
            $(".category_reject_prop").show();
            clockedBody();
        },
        hide_category_reject_prop:function () {
            $(".category_reject_prop").hide();
            unClockedBody();
        },
        deleteCategory:function (cid) {
            printConfirm("确定要删除该类目吗？<br/>删除后将不可再使用此类目，后续使用需要重新申请开通!",function () {
                $.jsonAjax(getUrl("shopManageCategoryController/deleteCategory"),{cid:cid},function(data,status,xhr){
                    if(data.result=='success'){
                        popUp_auto(1000,"删除成功！");
                        shopInfoLMEdit.init();
                    }else{
                        popUp_auto_false(1000,data.msg);
                    }
                });
            })
        },
        getCategoryLV1:function () {
            $.jsonAjax(getUrl("shopManageCategoryController/getCategoryByParentId"),{parentCode:0},function(data,status,xhr){
                shopInfoLMEdit.$data.categoryLV1List = data;
            });
        },
        getCategoryLV2:function () {
            var parentCode = $("#categoryLev1").val();
            $.jsonAjax(getUrl("shopManageCategoryController/getCategoryByParentId"),{parentCode:parentCode},function(data,status,xhr){
                shopInfoLMEdit.$data.categoryLV2List = data;
                $("#categoryLev2").val('');
                shopInfoLMEdit.$data.categoryLV3List = [];
            });
        },
        getCategoryLV3:function () {
            var parentCode = $("#categoryLev2").val();
            $.jsonAjax(getUrl("shopManageCategoryController/getCategoryByParentId"),{parentCode:parentCode},function(data,status,xhr){
                shopInfoLMEdit.$data.categoryLV3List = data;
                $("#categoryLev3").val('');
            });
        },
        addNewCategory:function () {

            var key = $("#categoryLev3").val();
            if(key){
                //判断是否已经选择该类目
                if(!shopInfoLMEdit.$data.passedCategoryList[key]&&!shopInfoLMEdit.$data.newCategoryList[key]){
                    //判断该类目下是否有返点信息
                    popUp_open();
                    $.jsonAjax(getUrl("shopManageCategoryController/validExistRebate"),{cid:key},function(data,status,xhr){
                        popUp_close();
                        if(data.result=="success"){
                            var newText = $("#categoryLev1 option:selected").text()+">"+$("#categoryLev2 option:selected").text()+">"+$("#categoryLev3 option:selected").text();
                            Vue.set(shopInfoLMEdit.$data.newCategoryList,key,newText);
                            Vue.set(shopInfoLMEdit.$data,"newCategory",shopInfoLMEdit.$data.newCategory+key+",");
                            popUp_auto(1000,"添加成功！");
                            $('.xinZengLeiMuTanChuang').hide();
                        }else{
                           popUp_auto_false(1000,data.msg);
                        }

                    },false);
                }else{
                    popUp_auto_false(1000,'已经存在该经营类目，请重新选择！');
                }
            }else{
                popUp_auto_false(1000,'请选择一个类目！');
            }
        },
        /**验证id是否存在于一个数组中*/
        containsId: function (idArray, id) {
            var ids = idArray.split(",");
            for (var i = 0; i < ids.length; i++) {
                if (ids[i] == id) {
                    return true;
                }
            }
            return false;
        },
        delNewCategory:function (cid) {
            Vue.delete(shopInfoLMEdit.$data.newCategoryList,cid);
            Vue.set(shopInfoLMEdit.$data,"newCategory",shopInfoLMEdit.$data.newCategory.replace(cid+',',''));
        },
        submit:function () {

            if(shopInfoLMEdit.$data.newCategory){
                popUp_open();
                $.jsonAjax(getUrl("shopManageCategoryController/saveCategory"),{addCategoryCids:shopInfoLMEdit.$data.newCategory},function(data,status,xhr){
                    popUp_close();
                    if(data.result=="success"){
                        popUp_auto(1000,"申请成功！");
                            window.setInterval(function () {
                                window.location = '../../html/18_maiJiaZhongXin/13_dianPuXinXiXiuGai_dianPuXinXiXiuGai.html?label=leiMu';
                            },1500);
                    }else{
                        popUp_auto_false(1000,"申请失败！");
                    }
                },false);
            }else{
                popUp_auto_false(1000,"请选择类目！")
            }

        }
    }
});

