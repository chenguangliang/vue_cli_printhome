/**
 *  快速下单-物资管理-新增物资
 */
/**********************************************************************************************************************/


var addMaterialVue = new Vue({
    el: "#app",
    data: {
        Specifications:[],//自定义规格
        material: {
            "itemName": "",
            "cid": '',
            "cname": "",
            "isCustomCategory": 0,
            "brandId": '',
            "brandName": "",
            "isCustomBrand": 0,
            "unitPrice": '',
            "itemUnitName": "",
            "isCustomUnit": 0,
            "standard": "",
            "isCustomStandard": 0,
            "remark": "",
            "isAudit": 0,
            "auditer": 0,
            "isMaterials": 1
        },
        categoryLevOne: [],
        categoryLevTwo: [],
        categoryLevThree: [],
        brandList:[],
        auditors:{},
        personalityDTO:{},//个性化表单数据
        please:"请输入"
    },
    methods: {
        limitUnitPrice: function () {//限制单价的输入  material.unitPrice
            //限定数量不能输入负数，限制2位小数
            this.material.unitPrice=this.material.unitPrice.replace(/[^(^\d+\.{0,1}\d*$)]/g,'');
            var reg3 = /\./g;
            var reg3Array = reg3.exec(this.material.unitPrice);
            if (reg3Array != null) {
                var reg3Right = this.material.unitPrice.substring(reg3Array.index + reg3Array[0].length);
                reg3Right = reg3Right.replace(reg3, '');
                reg3Right = reg3Right.substring(0, 2);
                this.material.unitPrice = this.material.unitPrice.substring(0, reg3Array.index) + '.' + reg3Right;
            }
        },
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
        getSpecification: function () {//获取自定义规格列表
            var temp=this;
            $.jsonAjax(getUrl("quickor/item/customStandards"), {}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.Specifications=data.data.result;
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);

        },
        //初始化一级类目
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
        //一级类目变化
        changeLevOne: function () {
            var temp = this;
            var categoryCid;
            if ($("#pinlei").val() != 0 && $("#pinlei").val() != 'other') {
                categoryCid = $("#pinlei").val();
            } else {
                temp.categoryLevTwo = [];temp.categoryLevThree =[];temp.brandList= [];
                return;
            }
            var paramData = {'pid': categoryCid};
            $.jsonAjax(getUrl("/quickor/item/queryCategoryList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.categoryLevTwo = data.categories;//查出来二级类目
                    $("#pinlei1,#pinlei2").val(0);
                    temp.categoryLevThree=[];
                    temp.brandList=[];
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //二级类目变化
        changeLevTwo: function () {
            $("#pinlei2").val(0);
            this.brandList=[];
            var temp = this;
            if ($("#pinlei1").val() != 0) {
                var categoryCid = $("#pinlei1").val();
            } else {
                temp.categoryLevThree = [];
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
        //三级类目变化，查询品牌
        queryBrand: function () {
            var temp=this;
            if ($("#pinlei2").val() != 0) {
                var categoryThreeId = $("#pinlei2").val();
            } else {
                temp.brandList = [];
                return;
            }
            var paramData = {'thirdId': categoryThreeId};
            $.jsonAjax(getUrl("/quickor/item/queryItemBrandList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.brandList = data.brands;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //查询审核人列表
        showAuditors: function () {
            var temp=this;
            $.jsonAjax(getUrl("/quickor/item/showApproveList"), {}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.auditors = data.result.auditers;
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
        },
        addMaterial: function () {
            var temp=this;
            var paramData=temp.material;
            //校验商品名
            if(paramData.itemName==''){
                popUp_auto_false(2500, '请填写'+temp.personalityDTO.itemNameLity);
                return;
            }
            //校验品类  cid
            if($("#pinlei").val()=='other'){
                paramData.isCustomCategory=1;
                if($(".otherCategory").val()==''){
                    popUp_auto_false(2500,  '请填写'+temp.personalityDTO.itemCnameLity);
                    return;
                }else {
                    paramData.cname=$(".otherCategory").val();
                }
                paramData.cid=0;
            }else {
                paramData.isCustomCategory=0;
                if($("#pinlei2").val()==0){
                    popUp_auto_false(2500, '请选择三级类目');
                    return;
                }else {
                    paramData.cid=$("#pinlei2").val();
                    var obj = document.getElementById("pinlei2");
                    var txt = obj.options[obj.selectedIndex].text;
                    paramData.cname=txt;
                }
            }
            //校验品牌
            if($("#pinpai").val()=='other'){
                paramData.isCustomBrand=1;
                if($(".otherBrandInput").val()==''){
                    popUp_auto_false(2500, '请填写'+temp.personalityDTO.itemBrandLity);
                    return;
                }
                paramData.brandId=0;
                paramData.brandName=$(".otherBrandInput").val();
            }else{
                paramData.isCustomBrand=0;
                if($("#pinpai").val()==0){
                    popUp_auto_false(2500, '请选择'+temp.personalityDTO.itemBrandLity);
                    return;
                }
                var obj1 = document.getElementById("pinpai");
                var txt1 = obj1.options[obj1.selectedIndex].text;
                paramData.brandName=txt1;
                paramData.brandId=$("#pinpai").val();
            }
            //校验单价
            if(paramData.unitPrice==''){
                popUp_auto_false(2500, '请填写单价');
                return;
            }
            //校验单位  isCustomUnit
            if($("#danwei").val()=='other'){
                paramData.isCustomUnit=1;
                if($(".otherUnitInput").val()==''){
                    popUp_auto_false(2500, '请填写其他单位名称');
                    return;
                }
                paramData.itemUnitName=$(".otherUnitInput").val();
            }else{
                paramData.isCustomUnit=0;
                if($("#danwei").val()==0){
                    popUp_auto_false(2500, '请选择单位');
                    return;
                }
                paramData.itemUnitName=$("#danwei").val();
            }
            //校验规格  isCustomStandard
             if($("#guige").val()=='other'){
                 paramData.isCustomStandard=1;
                 /*if($(".otherSpeciInput").val()==''){
                    popUp_auto_false(2500, '请填写其他规格');
                    return;
                }*/
                 paramData.standard=$(".otherSpeciInput").val();
            }else{
                 paramData.isCustomStandard=0;
                 /*if($("#guige").val()==0){
                     popUp_auto_false(2500, '请选择规格');
                     return;
                 }*/
                 paramData.standard=$("#guige").val();
            }
            //校验审核人
            if($(".needCheck").attr('src').indexOf('no-select')==-1){
                paramData.isAudit=1;
               if($("#checker1").val()==0){
                   popUp_auto_false(2500, '请选择审核人');
                   return;
               }
                paramData.auditer= $("#checker1").val();
            }else {
                paramData.isAudit=0;
            }
            // 给备注参数赋值
            if($(".remark").val()){
                paramData.remark=$(".remark").val();
            }
            $.jsonAjax(getUrl("/quickor/item/submitCreateItemOrMaterials"), paramData, function (data, status, xhr) {
                console.log(paramData);
                console.log(data);
                if (data.isSuccess) {
                    popUp_auto(2500, "新增物资成功");
                    window.setTimeout(function () {
                          window.location='./8_materialList.html';
                    },2500);
                 } else {
                 popUp_auto_false(2500, "新增物资失败");
                 }
            }, false);
        }
    },
    beforeMount: function () {
        //获取个性化表单
        this.getPersonalityList();
        this.initCatagory();
        this.getSpecification();
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
    },
    updated: function () {
    },
    watch: {
        'material.unitPrice':
            function (newValue,oldValue) {
            var aa=newValue+'';
            var temp=this;
                if(aa.length>14){
                    popUp_auto_false(1500,'数字过大,请重新输入');
                    this.material.unitPrice='';
                }
            }
    }

});
