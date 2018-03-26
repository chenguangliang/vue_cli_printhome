$(function () {
})
//店铺信息展示
var shopBrandList = [];
var categoryList = [];
var shopInfoPPEdit = new Vue({
    el:"#shopInfoPPEdit",
    data:{
        shopBrandList:[],
        categoryList:[],
        showPinPaiList:[],
        newPinPaiMap:{},
        newPinPai:'',
        midPinPaiMap:{},
        midPinPai:'',
    },
    mixins:[common],
    beforeCreate: function () {
        $.jsonAjax(getUrl("shopManageBrandController/shopPPInfo"),{isEdit:'edit'},function(data,status,xhr){
            if(data.status=="200"){
                shopBrandList = data.data.dataMap;
                categoryList = data.data.categoryList;
            }else{
                popUp_auto(1000,data.msg);
                // window.location = '../../html/2_login_sign/login_common.html';
            }
        },false);
    },
    created: function () {
        this.$data.shopBrandList = shopBrandList;
        this.$data.categoryList = categoryList;
    },
    mounted:function () {
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
        //新增品牌
        $('.xinZengLeiMu').click(function(){
            $('.xinZengLeiMuTanChuang').show();
            shopInfoPPEdit.initSelect();
            clockedBody();
        });
        $('.xinZengLeiMuTanChuang .cancel, .xinZengLeiMuTanChuang .close,.xinZengLeiMuTanChuang .bg').click(function () {
            shopInfoPPEdit.centerSel();
            $('.xinZengLeiMuTanChuang').hide();
            unClockedBody();
        });


        $('.leiMuPinPai p').click(function(){
            if(
                $(this).hasClass('colorf4')
            ){
                $(this).removeClass('colorf4').addClass('colore6').siblings('p').removeClass('colore6').addClass('colorf4');
            }
        });
    },
    updated:function () {
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
        init:function () {
            $.jsonAjax(getUrl("shopManageBrandController/shopPPInfo"),{isEdit:'edit'},function(data,status,xhr){
                if(data.status=="200"){
                    shopInfoPPEdit.$data.shopBrandList = data.data.dataMap;
                    shopInfoPPEdit.$data.categoryList = data.data.categoryList;
                }else{
                    popUp_auto(1000,data.msg);
                    // window.location = '../../html/2_login_sign/login_common.html';
                }
            },false);
        },
        //显示商品大图
        showPinPai:function (event,text) {
            var url = $(event.currentTarget).attr("src");
            $("#pinPaiImg").attr("src",url);
            $("#pinPaiText").html(text);
            $(".pinPai_bg").show();
            clockedBody();
        },
        //隐藏商品大图
        hidePinPai:function () {
            $("#pinPaiImg").attr("src",'');
            $("#pinPaiText").html('');
            $(".pinPai_bg").hide();
            unClockedBody();
        },
        // 新建显示类目下品牌
        getPinPai:function (cid) {
            $.jsonAjax(getUrl("shopManageBrandController/queryBrandByCid"),{cid:cid},function(data,status,xhr){
                Vue.set(shopInfoPPEdit.$data,"showPinPaiList",data);
                $("div[id^='newPPDiv_']").hide();
                $("#newPPDiv_"+cid).show();
            },false);
        },
        //初始化已选择的品牌
        initSelect:function () {
            shopInfoPPEdit.$data.midPinPai = shopInfoPPEdit.$data.newPinPai;
            shopInfoPPEdit.$data.midPinPaiMap = shopInfoPPEdit.copyMap(shopInfoPPEdit.$data.newPinPaiMap);
        },
        //工具方法，深拷贝
        copyMap:function (map) {
            var midMap = {};
            for(var key in map) {
                var midList = [];
                if(map[key]){
                    midList = map[key].slice(0);
                }
                midMap[key]=midList;
            }
            return midMap;
        },
        //新建品牌是否已经选择
        isSelected:function (pinPai) {
            var ret = false;
            if(shopInfoPPEdit.$data.midPinPai.indexOf(pinPai.thirdLevCid+':'+pinPai.brandId+',')>-1){
                ret = true;
            }
            return ret;
        },
        //新增品牌类目是否已存在
        newLabelNotInPass:function (label) {
            var ret = true;
            if(shopInfoPPEdit.$data.shopBrandList[label]){
                ret = false;
            }
            return ret;
        },
        //选择或取消选择
        select:function (label,pinPai) {
            console.log(pinPai)
            if(shopInfoPPEdit.isSelected(pinPai)){
                Vue.set(shopInfoPPEdit.$data,"midPinPai",shopInfoPPEdit.$data.midPinPai.replace(pinPai.thirdLevCid+':'+pinPai.brandId+',',''));
                var ppList = shopInfoPPEdit.$data.midPinPaiMap[label].slice(0);
                var index = ppList.indexOf(pinPai);
                ppList.splice(index,1);
                Vue.set(shopInfoPPEdit.$data.midPinPaiMap,label,ppList);
            }else{
                Vue.set(shopInfoPPEdit.$data,"midPinPai",shopInfoPPEdit.$data.midPinPai+pinPai.thirdLevCid+':'+pinPai.brandId+',');

                var ppList = [];
                if(!shopInfoPPEdit.$data.midPinPaiMap[label]){
                    ppList = [pinPai];
                }else{
                    ppList = shopInfoPPEdit.$data.midPinPaiMap[label].slice(0);
                    ppList.push(pinPai);
                }
                Vue.set(shopInfoPPEdit.$data.midPinPaiMap,label,ppList);
            }
        },
        //取消选择操作
        centerSel:function () {
            Vue.set(shopInfoPPEdit.$data,"midPinPai",'');
            Vue.set(shopInfoPPEdit.$data,'midPinPaiMap',{});
        },
        //确认选择操作
        submitSel:function () {
            if(!shopInfoPPEdit.$data.midPinPai||shopInfoPPEdit.$data.midPinPai==""){
                popUp_auto_false(1000,"请选择店铺类目！");
            }else{
                Vue.set(shopInfoPPEdit.$data,"newPinPai",shopInfoPPEdit.$data.midPinPai);
                Vue.set(shopInfoPPEdit.$data,'newPinPaiMap',shopInfoPPEdit.copyMap(shopInfoPPEdit.$data.midPinPaiMap));
                Vue.set(shopInfoPPEdit.$data,"midPinPai",'');
                Vue.set(shopInfoPPEdit.$data,'midPinPaiMap',{});
                $('.xinZengLeiMuTanChuang').hide();
                unClockedBody();
            }
        },
        //删除已有品牌
        shanchu:function (brandId) {
            printConfirm("确定要删除该品牌吗？",function () {
                popUp_open();
                $.jsonAjax(getUrl("shopManageBrandController/deleteBrand"),{brandId:brandId},function(data,status,xhr){
                    popUp_close();
                    if(data.result=='success'){
                        popUp_auto(1000,"删除成功！");
                        shopInfoPPEdit.init();
                    }else{
                        popUp_auto_false(1000,data.msg)
                    }
                },false);
            })
        },
        //删除新增品牌
        shanchuNew:function (label,pinPai) {
            printConfirm("确定要删除该品牌吗？",function () {
                Vue.set(shopInfoPPEdit.$data,"newPinPai",shopInfoPPEdit.$data.newPinPai.replace(pinPai.thirdLevCid+':'+pinPai.brandId+',',''));
                var ppList = shopInfoPPEdit.$data.newPinPaiMap[label].slice(0);
                var index = ppList.indexOf(pinPai);
                ppList.splice(index,1);
                Vue.set(shopInfoPPEdit.$data.newPinPaiMap,label,ppList);
            });
        },
        //提交新申请品牌
        submit:function () {
            if(shopInfoPPEdit.$data.newPinPai&&shopInfoPPEdit.$data.newPinPai!=''){
                popUp_open();
                $.jsonAjax(getUrl("shopManageBrandController/saveBrand"),{addBrandIds:shopInfoPPEdit.$data.newPinPai},function(data,status,xhr) {
                    popUp_close();
                    if(data.result=='success'){
                        popUp_auto(1000,"申请成功！");
                        window.setInterval(function () {
                            window.location = '../../html/18_maiJiaZhongXin/13_dianPuXinXiXiuGai_dianPuXinXiXiuGai.html?label=pinPai';
                        },1500);
                    }else{
                        popUp_auto_false(1000,"申请失败！");
                    }
                },false);
            }else{
                popUp_auto_false(1000,'请选择品牌！')
            }
        }
    }
});

