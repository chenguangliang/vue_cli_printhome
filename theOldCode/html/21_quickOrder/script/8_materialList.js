/**
 *  快速下单-物资管理-物资列表
 */
/**********************************************************************************************************************/
var quickOrderVue = new Vue({
    el: "#app",
    data: {
        aaa: '',
        paper: {},
        submitInfo: {'page': 1, tabPage: '', itemName: '', itemId: '', brandName: '', cname: '', standard: ''},
        materialList: {},
        beginTranY: '',//pullDown的高度也是初始卷去的高度
        categoryLevOne: {},
        categoryLevTwo: {},
        categoryLevThree: {},
        materialInfo:{},//物资详情
        refuseParam:{},//临时存储驳回的参数
        tempMaterialsrId:'',//存储要删除的物资id
        acceptMaterialsrId:'',//存储要通过的物资id
        personalityDTO:{},//个性化表单数据
        please:'请输入'
    },
    methods: {
        //获取个性化表单
        getPersonalityList: function () {
            var temp = this;
            $.jsonAjax(getUrl("quickor/item/personalityList"), {}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.personalityDTO=data.result.personalityDTO;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //切换面板
        changePanle: function (tabPage) {
            var temp = this;
            temp.submitInfo.tabPage = tabPage;
            temp.submitInfo.page = 1;
            refresher.info.pullUpLable = "上拉加载...";
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("quickor/item/materialsList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.$data.paper = data.result.paper;
                    // temp.$data.materialList = {};
                    temp.$data.materialList = data.result.materials;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
            console.log(this.beginTranY);
        },
        //初始化物资列表
        initMaterials: function () {
            var temp = this;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("quickor/item/materialsList"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.$data.paper = data.result.paper;
                    // temp.$data.materialList = {};
                    temp.$data.materialList = data.result.materials;
                    // temp.$data.jsonArray = data.resultData.jsonArray;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //回到顶部
        goToTop: function () {
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
            $("#top").hide();
        },
        //重置搜索物资条件
        //隐藏物资详情
        hideMaterialDetile: function () {
            $(".listSelWin").hide();
        },
        //搜索物资
        searchMaterial: function () {
            var temp = this;
            temp.submitInfo.page = 1;
            //给特殊的cname赋值
            if ($("#pinlei").val() == 'other') {
                //默认取input的:value
            } else {
                if ($("#pinlei2").val() == '三级类目') {
                    temp.submitInfo.cname = '';
                } else {
                    temp.submitInfo.cname = $("#pinlei2").val();
                }
            }
            refresher.info.pullUpLable = "上拉加载...";
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("quickor/item/materialsList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.$data.paper = data.result.paper;
                    // temp.$data.materialList = {};
                    temp.$data.materialList = data.result.materials;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
        },
        //查看物资详情
        materialDetile: function (materialsrId) {
            $(".listSelWin").show();
            var temp = this;
            var paramData = {'materialsrId': materialsrId};
            $.jsonAjax(getUrl("/quickor/item/materialsrDetails"), paramData, function (data, status, xhr) {
                if (data) {
                    temp.materialInfo=data.materials;
                }else {
                    popUp_auto_false(2500,'网络错误');
                }
            }, false);
        },
        //初始化搜索里的类目
        initCatagory: function () {
            var temp = this;
            var paramData = {'pid': 0};
            $.jsonAjax(getUrl("/quickor/item/queryCategoryList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.categoryLevOne = data.categories;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //搜索页面里一级类目变化
        changeLevOne: function () {
            var temp = this;
            var categoryCid;
            if ($("#pinlei").val() != '一级类目' && $("#pinlei").val() != 'other') {
                categoryCid = $("#pinlei").val();
            } else {
                temp.categoryLevTwo = temp.categoryLevThree = {};
                return;
            }
            var paramData = {'pid': categoryCid};
            $.jsonAjax(getUrl("/quickor/item/queryCategoryList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.categoryLevTwo = data.categories;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //搜索页面里二级类目变化
        changeLevTwo: function () {
            var temp = this;
            if ($("#pinlei1").val() != '二级类目') {
                var categoryCid = $("#pinlei1").val();
            } else {
                temp.categoryLevThree = {};
                return;
            }
            var paramData = {'pid': categoryCid};
            $.jsonAjax(getUrl("/quickor/item/queryCategoryList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.categoryLevThree = data.categories;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //搜索页面里的重置
        resetForm: function () {
            var temp=this;
            $("#searchForm")[0].reset();
           /* this.submitInfo = {
                'page': 1,
                tabPage: '',
                itemName: '',
                itemId: '',
                brandName: '',
                cname: '',
                standard: ''
            };*/
           this.submitInfo.itemName='';
           this.submitInfo.itemId='';
           this.submitInfo.brandName='';
           this.submitInfo.standard='';
            this.categoryLevTwo = {};
            this.categoryLevThree = {};
        },
        //删除物资弹窗
        closeDeleteMaterial: function () {
            $(".delMaterial").hide();
        },
        toDeleteMaterial: function (materialsrId) {
            this.tempMaterialsrId=materialsrId;
            $(".delMaterial").show();
        },
        //删除物资
        deleteMaterial: function () {
            var temp = this;
            var paramData = {'materialsrId': temp.tempMaterialsrId};
            $(".delMaterial").hide();
                $.jsonAjax(getUrl("/quickor/item/materialsrDel"), paramData, function (data, status, xhr) {
                    if (data) {
                        console.log(data);
                        popUp_auto(2500, data.result.msg);
                    } else {
                        popUp_auto_false(2500, '网络错误');
                    }
                }, false);
                window.location.reload();
        },
        //审核物资
        checkMaterial: function (materialsrId, auditType) {
            var temp = this;
            var paramData = {'materialsrId': materialsrId, 'auditType': auditType};
            if (auditType == 1) {
                temp.acceptMaterialsrId=materialsrId;
                $(".acceptMaterial").show();
            }
            else {
                $(".materialRefuseWin").show();
                this.refuseParam = {'materialsrId': materialsrId, 'auditType': auditType,auditRemark:''};
            }
        },
        //审核通过物资
        closeAcceptMaterial: function () {
            $(".acceptMaterial").hide();
        },
        acceptMaterial: function () {
            var temp=this;
            var paramData = {'materialsrId': temp.acceptMaterialsrId, 'auditType': 1};
            $(".acceptMaterial").hide();
                $.jsonAjax(getUrl("/quickor/item/materialsrCheck"), paramData, function (data, status, xhr) {
                    if (data) {
                        console.log(data);
                        popUp_auto(2500, data.result.msg);
                    } else {
                        popUp_auto_false(2500, '网络错误');
                    }
                }, false);
                window.location.reload();
        },
        //驳回物资
        refuseMaterial: function () {
            var temp=this;
            this.refuseParam.auditRemark = $('.refuseWords').val();
            $(".materialRefuseWin").hide();
            $('.refuseWords').val('');
            $.jsonAjax(getUrl("/quickor/item/materialsrCheck"), temp.refuseParam, function (data, status, xhr) {
                    if (data) {
                        console.log(data);
                        popUp_auto(2500, '审核驳回成功');
                    } else {
                        popUp_auto_false(2500, '网络错误');
                    }
                }, false);
                window.location.reload();
        },
        //编辑物资
        editMaterial: function (materialId) {
            window.location='./12_editMaterial.html?materialId='+materialId;
        }
    },
    beforeMount: function () {
        //获取个性化表单
        this.getPersonalityList();
        this.initMaterials();//初始化物资列表
        //初始化搜索里的三级类目联动
        var temp = this;
        this.initCatagory();
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        // this.selectedBar();//根据状态选中不同导航条
        // if (this.materialList && this.materialList.length > 0) {
            initPage();
            this.beginTranY = document.getElementById('pullDown').offsetHeight;//必须有！给初始beginTranY赋值
        // }
    },
    updated: function () {
        myScroll.refresh();
    }

});

function initPage() {
    refresher.init({
        id: "wrapper",
        pullDownAction: Refresh,
        pullUpAction: Load
    });
}
function Refresh() {
    setTimeout(function () {
        myScroll.refresh();
    }, 1000);
}
function Load() {
    setTimeout(function () {
        var nextPage = quickOrderVue.$data.paper.nextPage;
        var thisPage = quickOrderVue.$data.paper.page;
        if (nextPage == thisPage) {
            refresher.info.pullUpLable = "已经到底了";
        } else {
            var paramData = quickOrderVue.$data.submitInfo;
            paramData.page = nextPage;
            $.jsonAjax(getUrl("quickor/item/materialsList"), paramData, function (data, status, xhr) {
                if (data) {
                    quickOrderVue.$data.paper = data.result.paper;
                    quickOrderVue.$data.materialList = quickOrderVue.$data.materialList.concat(data.result.materials);
                }
            }, false);
            nextPage = quickOrderVue.$data.paper.nextPage;
            thisPage = quickOrderVue.$data.paper.page;
            if (nextPage == thisPage) {
                refresher.info.pullUpLable = "已经到底了";
            }
        }
        myScroll.refresh();
    }, 1000);
};
function hideWin() {//这是给弹窗的取消绑定事件
    $(".acceptMaterial .cancle").click(function () {//审核通过点取消
    });
}