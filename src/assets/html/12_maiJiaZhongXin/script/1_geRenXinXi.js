
var userPersonalInfoDTO = '';
var finalOrigin = '';
var provinceList = "";
var cityList = "";
var areaList = "";
var originProvince = "";
var originCity = "";
var originArea = "";
var userInfo = new Vue({
    el:"#userInfo",
    data:{
        userPersonalInfoDTO:{},
        finalOrigin:'',
        sexData:[{"code":"1","label":"男"},{"code":"2","label":"女"},{"code":"3","label":"保密"}],
        bloodData:[{"code":"0","label":"请选择"},{"code":"1","label":" A型 "},{"code":"2","label":" B型 "},{"code":"3","label":" AB型 "},{"code":"4","label":" O型 "}],
        provinceList:[],
        cityList:[],
        areaList:[],
        originProvince:[],
        originCity:[],
        originArea:[],
    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("userPersonalInfo/getUserPersonInfo"),{},function(data,status,xhr){
            if(data.status=="200"){
                userPersonalInfoDTO = data.data.userPersonalInfoDTO;
                finalOrigin = data.data.finalOrigin;
                provinceList = data.data.provinceList;
                cityList = data.data.cityList;
                areaList = data.data.areaList;
                originProvince = data.data.originProvince;
                originCity = data.data.originCity;
                originArea = data.data.originArea;
                // console.log(categoryes);
            }else{
                printAlert(data.msg);
                window.location = '../../html/2_login_sign/login_common.html';
            }
        },false);
    },
    created: function () {
        this.$data.userPersonalInfoDTO = userPersonalInfoDTO;
        this.$data.finalOrigin = finalOrigin;
        this.$data.provinceList = provinceList;
        this.$data.cityList = cityList;
        this.$data.areaList = areaList;
        this.$data.originProvince = originProvince;
        this.$data.originCity = originCity;
        this.$data.originArea = originArea;
        //手动处理下拉框初始值
        if(!originProvince||originProvince=="null"){
            this.$data.originProvince = "";
        }
        if(!originCity||originCity=="null"){
            this.$data.originCity = "";
        }
        if(!originArea||originArea=="null"){
            this.$data.originArea = "";
        }
        if(!userPersonalInfoDTO.blood){
            this.$data.userPersonalInfoDTO.blood = "0";
        }
    },
    mounted:function(){
        $('.bianJi').click(function(){
            $(this).hide();
            $('.baoCun').show();
            $('.chaKan').hide();
            $('.xiuGai').show();
        });
        initCase();
    },
    methods: {
        getSexText:function (){
            var retStr = '';
            for(var i=0;i<this.sexData.length;i++){
                var theSex = this.sexData[i];
                if(this.userPersonalInfoDTO.sex == theSex.code){
                    retStr = theSex.label;
                    break;
                }      
            }
            return retStr;
        },
        getBloodText:function () {
            var retStr = '';
            for (var i = 1; i < this.bloodData.length; i++) {
                var theBlood = this.bloodData[i];
                if (this.userPersonalInfoDTO.blood == theBlood.code) {
                    retStr = theBlood.label;
                    break;
                }
            }
            return retStr;
        },
        changeProvince:function () {
            var parentCode = this.$data.originProvince;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                userInfo.$data.cityList = data;
                userInfo.$data.areaList = "";
                userInfo.$data.originCity = "0";
                userInfo.$data.originArea = "0";
            });
        },
        changeCity:function () {
            var parentCode = this.$data.originCity;
            $.jsonAjax(getUrl("shopBaseInfoController/queryAddress"),{parentCode:parentCode},function(data,status,xhr){
                userInfo.$data.areaList = data;
                userInfo.$data.originArea = "0";
            });
        },
        baocun:function () {
            var nikeName = $("#niCheng").val();
            if(nikeName==""){
                popUp_auto_false(1000,"请输入昵称");
                return;
            }
            var reg =  /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/;
            if(!reg.test(nikeName)){
                popUp_auto_false(1000,"请输入正确的昵称");
                return;
            }
            var sex = $("input:radio[name='xingBie']:checked").val();
            if(!sex){
                popUp_auto_false(1000,"请输入性别");
                return;
            }
            var data={
                id:this.userPersonalInfoDTO.id,
                userId:this.userPersonalInfoDTO.userId,
                nikeName:nikeName,
                sex:sex,
                birthday:$("#selDate").val(),
                blood:$("#xueXing").val(),
                origin:$("#sel_Province").val()+","+$("#sel_City").val()+","+$("#sel_County").val(),
                address:"",
                homePage:"",
                income:this.userPersonalInfoDTO.income,
                hobby:this.userPersonalInfoDTO.hobby,
                evaluate:this.userPersonalInfoDTO.evaluate
            }
            $.jsonAjax(getUrl("userPersonalInfo/updateUserPersonalInfo"),data,function(data,status,xhr){
               if(data.messages.indexOf("成功")){
                   popUp_auto(1000,data.messages);
                   window.setTimeout(function () {
                       window.location = '../../html/12_maiJiaZhongXin/1_geRenXinXi_geRenXinXi.html';
                   }, 1000);
               }else{
                   popUp_auto_false(1000,data.messages);
               }
            });
        }
        
    }
});
