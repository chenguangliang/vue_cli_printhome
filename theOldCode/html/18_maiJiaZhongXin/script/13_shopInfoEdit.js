$(function () {
})
//店铺信息展示
var shopInfo = {};
var provinceList = "";
var cityList = "";
var areaList = "";
var shopAuditInfo = {};
var shopInfoEdit = new Vue({
    el:"#shopInfoEdit",
    data:{
        shopTypeList:[{'code':'','label':'-请选择-'},{'code':'1','label':'品牌商'},{'code':'2','label':'经销商'}],
        brandTypeList:[{'code':'','label':'-请选择-'},{'code':'1','label':'国内品牌'},{'code':'2','label':'国际品牌'},{'code':'3','label':'合资品牌'}],
        businessTypeList:[{'code':'','label':'-请选择-'},{'code':'1','label':'自有品牌'},{'code':'2','label':'代理品牌'}],
        provinceList:[],
        cityList:[],
        areaList:[],
        shopInfo:{},
        shopAuditInfo:{},
    },
    mixins:[common,fileUtil,math],
    beforeCreate: function () {
        //店铺有效信息
        $.jsonAjax(getUrl("shopBaseInfoController/shopInfoEdit"),{},function(data,status,xhr){
            if(data.status=="200"){
                shopInfo = data.data.shopInfo;
                provinceList = data.data.provinceList;
                cityList = data.data.cityList;
                areaList = data.data.areaList;
            }else{
                popUp_auto(1000,data.msg);
            }
        },false);
        //获取店铺修改信息
        $.jsonAjax(getUrl("shopBaseInfoController/shopAuditDetail"),{},function(data,status,xhr){
            if(data.status=="200"){
                var shopAuditDetailList = data.data;
                for(var i=0;i<shopAuditDetailList.length;i++){
                    var shopAudit = shopAuditDetailList[i];
                    shopAuditInfo[shopAudit.propertiesColumn]=shopAudit.afterChange;
                }
                //对审批驳回的信息进行赋值
                if(shopAuditInfo['shop_name']){
                    shopInfo['shopName'] = shopAuditInfo['shop_name'];
                }
                if(shopAuditInfo['logo_url']){
                    shopInfo['logoUrl'] = shopAuditInfo['logo_url'];
                }
                if(shopAuditInfo['introduce']){
                    shopInfo['introduce'] = shopAuditInfo['introduce'];
                }
                if(shopAuditInfo['main_sell']){
                    shopInfo['mainSell'] = shopAuditInfo['main_sell'];
                }
                if(shopAuditInfo['shop_type']){
                    shopInfo['shopType'] = shopAuditInfo['shop_type'];
                }
                if(shopAuditInfo['brand_type']){
                    shopInfo['brandType'] = shopAuditInfo['brand_type'];
                }
                if(shopAuditInfo['business_type']){
                    shopInfo['businessType'] = shopAuditInfo['business_type'];
                }
                if(shopAuditInfo['disclaimer']){
                    shopInfo['disclaimer'] = shopAuditInfo['disclaimer'];
                }
                if(shopAuditInfo['trademark_regist_cert']){
                    shopInfo['trademarkRegistCert'] = shopAuditInfo['trademark_regist_cert'];
                }
                if(shopAuditInfo['inspection_report']){
                    shopInfo['inspectionReport'] = shopAuditInfo['inspection_report'];
                }
                if(shopAuditInfo['production_license']){
                    shopInfo['productionLicense'] = shopAuditInfo['production_license'];
                }
                if(shopAuditInfo['initial_mount']){
                    shopInfo['initialMount'] = shopAuditInfo['initial_mount'];
                }
                if(shopAuditInfo['initial_condition']){
                    shopInfo['initialCondition'] = shopAuditInfo['initial_condition'];
                }
                if(shopAuditInfo['initial_price']){
                    shopInfo['initialPrice'] = shopAuditInfo['initial_price'];
                }
                if(shopAuditInfo['mutilPrice']){
                    shopInfo['mutilPrice'] = shopAuditInfo['mutilPrice'];
                }
                if(shopAuditInfo['mount_min']){
                    shopInfo['mountMin'] = shopAuditInfo['mount_min'];
                }
                if(shopAuditInfo['mutil_condition']){
                    shopInfo['mutilCondition'] = shopAuditInfo['mutil_condition'];
                }
                if(shopAuditInfo['price_min']){
                    shopInfo['priceMin'] = shopAuditInfo['price_min'];
                }
                if(shopAuditInfo['province_code']){
                    shopInfo['provinceCode'] = shopAuditInfo['province_code'];
                }
                if(shopAuditInfo['city_code']){
                    shopInfo['cityCode'] = shopAuditInfo['city_code'];
                }
                if(shopAuditInfo['district_code']){
                    shopInfo['districtCode'] = shopAuditInfo['district_code'];
                }
                if(shopAuditInfo['zcode']){
                    shopInfo['zcode'] = shopAuditInfo['zcode'];
                }
                if(shopAuditInfo['street_name']){
                    shopInfo['streetName'] = shopAuditInfo['street_name'];
                }
                shopInfo['initialPrice'] = shopInfo['initialPrice'].toFixed(2);
                shopInfo['mutilPrice'] = shopInfo['mutilPrice'].toFixed(2);

            }else{
                popUp_auto(1000,data.msg);
            }
        },false);
    },
    created: function () {
        this.$data.shopInfo = shopInfo;
        this.$data.provinceList = provinceList;
        this.$data.cityList = cityList;
        this.$data.areaList = areaList;
        this.$data.shopAuditInfo = shopAuditInfo;
    },
    mounted:function () {

    },
    methods: {
        getImgUrl:function (name){
            return getImgUrl(name);
        },
        showImg:function (event) {
            var url = $(event.currentTarget).attr("src");
            if(url){
                $("#imgDiv").attr("src",url);
                $(".showBigImgProp").show();
                clockedBody();
            }
        },
        hideImg:function () {
            $("#imgDiv").attr("src",'');
            $(".showBigImgProp").hide();
            unClockedBody();
        },
        changeProvince:function () {
            var parentCode = this.$data.shopInfo.provinceCode;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                shopInfoEdit.$data.cityList = data;
                shopInfoEdit.$data.areaList = "";
                shopInfoEdit.$data.shopInfo.cityCode = "";
                shopInfoEdit.$data.shopInfo.districtCode = "";
            });
        },
        changeCity:function () {
            var parentCode = this.$data.shopInfo.cityCode;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                shopInfoEdit.$data.areaList = data;
                shopInfoEdit.$data.shopInfo.districtCode = "";
            });
        },
        goBack:function () {
            printConfirm("确定要取消编辑吗？",function () {
                window.location = '13_dianPuXinXiXiuGai_dianPuXinXiXiuGai.html';
            })
        },
        submit:function () {
            //字段校验
            if(!this.shopInfo.shopName||this.shopInfo.shopName==''){
                popUp_auto_false(1000,'请填写店铺名称！');
                return;
            }
            if(!this.shopInfo.shopType||this.shopInfo.shopType==''){
                popUp_auto_false(1000,'请填写店铺类型！');
                return;
            }
            if(!this.shopInfo.brandType||this.shopInfo.brandType==''){
                popUp_auto_false(1000,'请填写品牌类型！');
                return;
            }
            if(!this.shopInfo.businessType||this.shopInfo.businessType==''){
                popUp_auto_false(1000,'请填写经营类型！');
                return;
            }
            if(!$("#disclaimer").val()||$("#disclaimer").val()==''){
                popUp_auto_false(1000,'请上传免责声明扫描件！');
                return;
            }
            if(!this.shopInfo.initialMount||this.shopInfo.initialMount==''){
                popUp_auto_false(1000,'请填写起批数量！');
                return;
            }
            if(!this.shopInfo.initialPrice||this.shopInfo.initialPrice==''){
                popUp_auto_false(1000,'请填写起批金额！');
                return;
            }
            if(!this.shopInfo.provinceCode||this.shopInfo.provinceCode==''){
                popUp_auto_false(1000,'请填写发货（退货）地址！');
                return;
            }
            if(!this.shopInfo.cityCode||this.shopInfo.cityCode==''){
                popUp_auto_false(1000,'请填写发货（退货）地址！');
                return;
            }
            if(!this.shopInfo.districtCode||this.shopInfo.districtCode==''){
                popUp_auto_false(1000,'请填写发货（退货）地址！');
                return;
            }
            if(!this.shopInfo.streetName||this.shopInfo.streetName==''){
                popUp_auto_false(1000,'请填写街道地址！');
                return;
            }
            //组合字段
            var data = {
                shopId:this.shopInfo.shopId,
                shopName:this.shopInfo.shopName,
                logoUrl:$("#logoUrl").val(),
                keyword:this.shopInfo.keyword,
                introduce:this.shopInfo.introduce,
                mainSell:this.shopInfo.mainSell,
                shopType:this.shopInfo.shopType,
                brandType:this.shopInfo.brandType,
                businessType:this.shopInfo.businessType,
                disclaimer:$("#disclaimer").val(),
                trademarkRegistCert:$("#trademarkRegistCert").val(),
                inspectionReport:$("#inspectionReport").val(),
                productionLicense:$("#productionLicense").val(),
                initialMount:this.shopInfo.initialMount,
                initialCondition:this.shopInfo.initialCondition,
                initialPrice:this.shopInfo.initialPrice,
                mutilPrice:this.shopInfo.mutilPrice==1?'1':null,
                mountMin:this.shopInfo.mountMin,
                mutilCondition:this.shopInfo.mutilCondition,
                priceMin:this.shopInfo.priceMin,
                provinceCode:this.shopInfo.provinceCode,
                provinceName:$("#sel_Province option:selected").text(),
                cityCode:this.shopInfo.cityCode,
                cityName:$("#sel_City option:selected").text(),
                districtCode:this.shopInfo.districtCode,
                districtName:$("#sel_County option:selected").text(),
                zcode:this.shopInfo.zcode,
                streetName:this.shopInfo.streetName,
                mobile:this.shopInfo.mobile,
                areaCode:this.shopInfo.areaCode,
                landline:this.shopInfo.landline,
                extensionNumber:this.shopInfo.extensionNumber,
                linkMan1:this.shopInfo.linkMan1,
                linkPhoneNum1:this.shopInfo.linkPhoneNum1,
                linkMan2:this.shopInfo.linkMan2,
                linkPhoneNum2:this.shopInfo.linkPhoneNum2,
                remark:this.shopInfo.remark,
            }

            $.jsonAjax(getUrl("shopBaseInfoController/modifyShopInfo"),data,function(data,status,xhr){
                if(data.result=="success"){
                    popUp_auto(1000,"申请成功！");
                    window.setInterval(function(){window.location = '13_dianPuXinXiXiuGai_dianPuXinXiXiuGai.html'},1500);
                }else{
                    popUp_auto(1000,"申请失败！");
                }
            });
        }
    }
});

