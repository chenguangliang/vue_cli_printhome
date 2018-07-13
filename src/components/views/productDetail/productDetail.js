/**
*@fileName:productDetail.js
*@author:fdc
*@time:2017/3/9 0009
*@disc:商品详情页js
*/
import $ from "jquery"
import productAttr from "./productAttr"
import shop_coupon from "./shopCoupon"
import cookieUtil from "../../../lib/cookieUtil"
import jsonUtil from "../../../lib/jsonUtil"
import Vue from "vue"
import {swiper,swiperSlide} from "vue-awesome-swiper";
import {mapActions,mapState} from 'vuex'

function getUrl(name) {
  return "http://wx.printhome.com/mall-web" + "/" + name;
}

// productAttr,shop_coupon,math,itemUnit
//隐藏客服div
function hideConcat() {
    $(".concat").hide();
    $("#productDetail").show();
}
//可视窗口的高度------下拉列表下一页
var scrollTop = 0;
var scrollBottom = 0;
$(document).scroll(function(){
    var dch = getClientHeight();
    scrollTop = getScrollTop();
    scrollBottom = document.body.scrollHeight - scrollTop;
    if(scrollBottom >= dch && scrollBottom <= (dch+102)){
        if($(".pinglun-wrap").css("display")=="block"){
            productDetail.queryEvaluationLoad();
        }
    }
});
//获取窗口可视范围的高度
function getClientHeight(){
    var clientHeight=0;
    if(document.body.clientHeight&&document.documentElement.clientHeight){
        clientHeight=(document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
    }else{
        clientHeight=(document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
    }
    return clientHeight;
}
function getScrollTop(){
    var scrollTop=0;
    scrollTop=(document.body.scrollTop>document.documentElement.scrollTop)?document.body.scrollTop:document.documentElement.scrollTop;
    return scrollTop;
}

var itemId = "";
var skuId = "";
itemId = $.getUrlParam("itemId");
if(itemId ==null) itemId = "";
skuId = $.getUrlParam("skuId");
if(skuId == null)skuId ="";
/**
*@fileName:productDetail.js
*@author:fdc
*@time:2017/3/14 0014
*@disc:
 * 商品的选中状态
 *product.item.attrSale.values.checkedStatus(normal(可以点击),checked(选中),disabled(无法选择))
 *
 *
*/
export default {
    // mixins:[productAttr,shop_coupon,math,itemUnit],
    mixins:[productAttr,shop_coupon],
    data: function () {
            return{
              swiper:'',
              skuId:skuId,
              itemId:itemId,
              serverUrl:"http://wx.printhome.com/mall-web",
              imgUrl:"http://img.printhome.com/imgs/",
              product:{
                  shopInfo:"",//店铺信息
                  item:{hasPrice:"",
                      skuInfos:"",
                      attrSale:[
                          {values:[{checkedStatus:"normal"}]}
                      ]
                  },//商品信息
                  skuItem:"",//sku信息
                  userDTO:"",//用户信息
                  categorylist:"",
                  catCascade:"",
                  shopEvaluationResult:"",//商品评价
                  shopFreightTemplateDTO:"",//运费模板
                  deliveryTypes:"",//计算每种运费方式
                  preferentialWay:{
                      deliveryType:"",
                      strategy:""
                  },//运费优惠方式
                  //卖家发货地址
                  from:"",
              },
              skuInfo:{
                  qty:"",
                  skuPrice:"",
                  //促销价
                  barginPrice :"",
                  //计量单位
                  unit:"",
                  hasPrice:"",
                  skuPictureUrl:"",
                  favouriteSku:""
              },
              //满减直降活动
              promotion:{
                  promotionFullReduction:"",
                  promotionMarkdown:""
              },
              //判断当前页面是否存在sku
              type:skuId == ""? 'spu': 'sku',
              //一级区域代码
              regionCode:"",
              //二级区域代码
              twoRegionCode:"",
              //区域代码名称
              region:"",
              //省份
              provinces:"",
              //城市
              citys:"",
              //询价弹窗
              queryInfo:{
                  email:'',
                  cellphone:'',
                  qty:'',
                  comment:''
              },
              //服务认证信息
              serviceAuthInfo:{},
              //商品评价
              itemEvaluationList:[],
              queryPage:1,
              //购物车
              myCart:"",
              //图片放大显示url
              amplifiedPicUrl:"",
              //选中sku之后显示可以滑动的sku轮播标志
              skuSwiperFlag:false,
              goodsType:1,// attrTempalte '商品销售属性模板：1=普通商品、2=板材类商品、3=橡皮布商品', 注意以前的商品没有这个字段，所以此字段为空时还是普通商品
              priceForBoard:'',//橡皮布和板材没有sku，价格显示要处理
              showSpuPrice:"",//spu价格
              inputWidth:'',//板材橡皮布用户输入的值-用于计算显示价格
              inputHeight:'',//板材橡皮布用户输入的值-用于计算显示价格
              isBuyAluminumClip:false,//是否购买铝夹true或者false
              aluminumClipPrice:0,//铝夹的价钱
              swiperOption: {//轮播config
                autoplay:{
                  delay: 3000,
                  stopOnLastSlide: false,
                  disableOnInteraction: false,
                },
                loop:true,
                effect:"flip",
                pagination: {
                  el: '.swiper-pagination',
                },
              }
     }
    },
    methods:{
        ...mapActions(['loading_open','loading_close']),
        goToTop:function () {
          $("html,body").animate({scrollTop: 0}, 200);  //页面500毫秒返回顶部
        },
        replaceSrcUrl:function(sourceString,imageServerUrl){
            var addr = "src=\""+imageServerUrl;
            return sourceString.replace(/src=\"\//g,addr);
        },
        //分页下拉加载
        queryEvaluationLoad:function(){
            this.queryPage = this.queryPage + 1;
        },
        //图片放大显示
        amplifiedPic:function(e) {
            this.amplifiedPicUrl = $(e.target).attr("src");
            $(".pinglun_img_tanChuang").css("display", "block");
        },
        //spu价格显示处理
        proSpuPriceShow:function(){
            var sellPrices = this.product.item.sellPrices;
            if(sellPrices != null && sellPrices.length > 0){
                var tempArray = new Array();
                for(var i=0;i<sellPrices.length;i++){
                    var sp = sellPrices[i];
                    if(sp != null && sp.areaId == this.regionCode){
                        tempArray.push(sp);
                    }
                }
                if(tempArray != null && tempArray.length > 0){
                    this.showSpuPrice = tempArray[0].sellPrice;
                }
            }
        },
        //商品评价
        loadEvaluation:function () {
            var temp = this;
            var page = temp.queryPage;
            var paramData = {
                "page": page,
                "skuId":temp.skuId,
                "itemId":temp.itemId
            };
            $.jsonAjax(getUrl("productController/getItemEvaluation"), jsonUtil.filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.itemEvaluationList = temp.$data.itemEvaluationList.concat(data.resultData.pager.records);
                }
            }, false);
        },
        //初始化商品评价
        initLoadEvaluation:function () {
            var temp = this;
            var paramData = {
                "page": 0,
                "skuId":temp.skuId,
                "itemId":temp.itemId
            };
            $.jsonAjax(getUrl("productController/getItemEvaluation"), jsonUtil.filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.itemEvaluationList = data.resultData.pager.records;
                }
            }, false);
        },
        //获取活动信息
        getPromotion:function(itemId,type,skuId){
            var temp = this;
            if(itemId!=null && typeof(itemId)!="undefined"){
                if(type == 'sku' && (skuId == null || skuId=='')){
                    return ;
                }
                var sellerId = $("#sellerId").val();//商家id
                var hasPrice = this.product.item.hasPrice;
                $.jsonAjax(getUrl("/productController/getPromotion"),
                    {itemId: itemId,
                    skuId: skuId,},
                    function(data,status, xhr){
                 //   console.log(data);
                         if(hasPrice==1) {
                             if(data.promotionFullReduction !=null && data.promotionFullReduction.length > 0){
                                 temp.promotion.promotionFullReduction = data.promotionFullReduction;
                             }
                             if(data.promotionMarkdown !=null && data.promotionMarkdown.length > 0){
                                 temp.promotion.promotionMarkdown = data.promotionMarkdown;
                             }
                         }
                },false);

            }
        },
        //跳转商品详情
        gotoProductDetail:function(itemId,skuId){
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+itemId+"&skuId="+skuId;
        },
        //服务认证信息
        initServiceAuth:function() {
            var temp = this;
            var shopId = temp.product.item.shopId;
            var paramData = {
                shopId:shopId
            };
            $.jsonAjax(getUrl("sellcenter/service/serviceAuth"), jsonUtil.filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.serviceAuthInfo = data.resultData;
                }
            }, false);
        },
        //获取配送至内容
        getAddresses:function(regionCode){
            var temp = "";
            $.jsonAjax(getUrl("address/query"),
                {id:regionCode},
                function(data,status, xhr){
                   // console.log(data);
                    temp = data;
                },false);
            return temp;
        },
        //获取所有省份
        getProvinces:function(regionCode){
            var temp = this;
            $.jsonAjax(getUrl("address/query"),
                {id:regionCode},
                function(data,status, xhr){
                   // console.log(data);
                    temp.provinces = data;
                },false);
        },
        //获取修改地址后获取运费
        getDeliveryType:function(itemId,skuId,addressId){
            var temp = this;
            $.jsonAjax(getUrl("productController/getDeliveryType"),
                {itemId:itemId,
                 skuId:skuId,regionId:addressId},
                 function(data,status, xhr){
                     //console.log(data);
                     temp.product.deliveryTypes = data;
                     $.each(data,function(index,ele){
                         temp.product.preferentialWay =  ele.deliveryTypePreferentialWayDTO;
                     });
                },false);
        },
        //获取效果class
       // normal(可以点击),checked(选中),disabled(无法选择
        getSkuCheckedClass:function(classType){
            if(classType == 'disabled')
             return 'disabled';
            if(classType == 'checked')
                return 'checked';
            if(classType == 'normal')
                return 'normal';
        },
        //商品收藏
        itemSkuFavorite:function(){
            if(this.product.item.attrTempalte !=2 && this.product.item.attrTempalte !=3){
                if(this.skuId == ''){
                    popUp_auto_false(2500,"请先选择商品属性");
                    return false;
                }
            }
            if(this.skuInfo.favouriteSku != ''){//已经关注 取消关注
                var temp = this;
                $.jsonAjax(getUrl('favourite/delItem'),{
                    ids:[this.skuInfo.favouriteSku.id]
                },function(data,status, xhr){
                    if(data.success){
                        temp.skuInfo.favouriteSku = "";
                        popUp_auto(1500,"取消关注");
                    }else{
                        popUp_auto_false(1500,data);
                    }
                },false);
                return false;
            }

            if(this.skuInfo.favouriteSku == ''){//未关注 关注按钮
                var temp = this;
                var data = {
                    skuId: this.skuId,
                    itemId: this.itemId,
                    shopId: this.product.item.shopId,
                    sellerId: this.product.item.sellerId,
                };

                if(this.skuId == "null"){ //板材、橡皮布的sku不能往后台传“null”，只能传空
                    data.skuId="";
                }
                $.jsonAjax(getUrl('favourite/addItem'),data,function(data,status, xhr){
                    if(data.success){
                       temp.getFavouriteSku(temp.skuId,temp.itemId);
                        popUp_auto(1500,"关注成功");
                    }else{
                        popUp_auto_false(1500,data);
                    }
                },false);
                return false;

            }
        },
        //获取sku收藏信息
        getFavouriteSku:function(skuId,itemId){
            var temp = this;
            $.jsonAjax(getUrl('productController/getFavouriteSku'),{
                skuId:skuId,itemId:itemId
            },function(data,status, xhr){
               // console.log(data)
                if(data.success){
                    Vue.set(temp.skuInfo,"favouriteSku",data.result.favouriteSku);
                }else{
                    Vue.set(temp.skuInfo,"favouriteSku","");
                }
            },false);
        },
        //跳转店铺
        gotoShop:function(){
            window.location = '../../html/5_dianPuShouYe/dianPu_index.html?shopId='+this.product.item.shopId;
        },
        gotoCart:function(){
            window.location = '../../html/14_gouWuChe/gouWuChe.html';
        },
        //加入购物车--正常商品
        addCart:function(itemBuyType,mealId){
            itemBuyType?'':itemBuyType=1;// itemBuyType '商品购买类型：1=普通商品、2=板材类商品、3=橡皮布商品、4=套餐商品'
            var temp = this;
            if(this.itemId == ''){
                printAlert("itemId不能为空");
                return false;
            }
            if(this.product.item.itemStatus != 4){
                printAlert('非在售商品,无法加入购物车!');
                return false;
            }
            if(this.skuId == ''&&this.skuInfo.hasPrice){
                printAlert("请选择商品属性!");
                return false;
            }
            if(!this.skuInfo.hasPrice){
                $(".win_prop").show();
                return false;
            }
            if(this.skuInfo.skuPrice==0){
                printAlert("该地区不支持配送，请更换收货地址");
                return false;
            }
            if(this.skuInfo.qty <= 0){
                printAlert("此商品无货无法加入购物车!");
                return false;
            }

            if(this.product.item.shopId<= 0){
                printAlert("shopId不能为空");
                return false;
            }

            //判断如果此sku下没有分期模板，periodId置空，有的话全款为-1
            /*if(!this.periodInfoList || this.periodInfoList.length==0){
                this.periodId='';
            }*/
            var lastSkuid=this.skuId;
            itemBuyType==4?lastSkuid=mealId:'';
            var shopCart = new ShopCart(this.product.item.shopId,this.itemId,lastSkuid,this.product.item.sellerId,this.regionCode,1,this.periodId,itemBuyType);
            $.jsonStringAjaxPost(getUrl('/shopCart/batchAdd'),shopCart,function(data,status, xhr){
                if(data.success){
                    function nums_Add(){
                        $(".goods_num").css("display","block");
                        var nums=$('.goods_num').html();
                        nums=parseInt(nums)+1;
                        $('.goods_num').html(nums);
                        if(nums>=10&&nums<=99){
                            $(".goods_num").addClass("goods_num_two");
                        }else if(nums>99){
                            $(".goods_num").addClass("goods_num_three");
                            cutOut(".goods_num", 2);
                        }
                    }
                    nums_Add();
                    temp.getMyCart();
                    popUp_auto(1500,"添加购物车成功!");
                }else{
                    popUp_auto_false(1500,data.errorMessages);
                }
            },false);
        },
        //加入购物车--非正常商品（板材、橡皮布、套餐）
        addCart_unNormal: function (itemBuyType) { // itemBuyType '商品购买类型：1=普通商品、2=板材类商品、3=橡皮布商品、4=套餐商品'
            var temp=this;
            if(temp.skuId && temp.skuId !="null" && temp.skuId !="undefined"){ //这是针对有报价的板材商品，有报价也就有skuId就不用走下边的生成skuId的步骤,直接走正常加入购物车
                this.addCart(itemBuyType);
                return;
            }
            if(temp.priceForBoard=="不在配送范围"){
                printAlert("该地区不支持配送，请更换收货地址");
                return false;
            }
            var boardSkuPromise=temp.getBoardSkuPromise();
            if(boardSkuPromise){
                boardSkuPromise.then(function (data) {
                    var shopCart = new ShopCart(temp.product.item.shopId,temp.itemId,data.skuId,temp.product.item.sellerId,temp.regionCode,1,temp.periodId,itemBuyType);
                    shopCart.isBuyAluminumClip=temp.isBuyAluminumClip;//是否购买铝价
                    $.jsonStringAjaxPost(getUrl('/shopCart/batchAdd'),shopCart,function(data,status, xhr){
                        if(data.success){
                            function nums_Add(){
                                $(".goods_num").css("display","block");
                                var nums=$('.goods_num').html();
                                nums=parseInt(nums)+1;
                                $('.goods_num').html(nums);
                                if(nums>=10&&nums<=99){
                                    $(".goods_num").addClass("goods_num_two");
                                }else if(nums>99){
                                    $(".goods_num").addClass("goods_num_three");
                                    cutOut(".goods_num", 2);
                                }
                            }
                            nums_Add();
                            temp.getMyCart();
                            popUp_auto(1500,"添加购物车成功!");
                        }else{
                            popUp_auto_false(1500,data.errorMessages);
                        }
                    },false);
                });
            }


        },
        //欢迎询价
        inquiry:function(){
            var temp = this;
            var emailOut = '';
            var umobileOut = '';
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    if(productDetail.$data.itemId == ''){
                        popUp_auto_false(1500,"itemId不能为空");
                        return false;
                    }
                    if(temp.product.item.attrTempalte==2 || temp.product.item.attrTempalte==3){ //板材、橡皮布走这个校验
                        var width=$("#input_width").val(),
                            length=$("#input_length").val();
                        if(!width || !length){
                            popUp_auto_false(1500,"请填写尺寸");
                            return;
                        }
                    }else {
                        if(productDetail.$data.skuId == ''){//正常商品走这个校验
                            popUp_auto_false(1500,"请选择商品属性!");
                            return false;
                        }
                    }
                    if(data.result.shopId == temp.product.item.shopId){//自己店铺商品不能询价
                        popUp_auto_false(1500,"不能对自己店铺商品询价！");
                        return false;
                    }
                    $(".xunJia_dio_wrap").css("display", "block");
                    emailOut = data.result.userEmail;
                    umobileOut = data.result.umobile;
                }else{
                    var surecallback = function () {
                        $.jsonAjax(getUrl("order/isLogin"), {}, function (data, status, xhr) {}, false);
                    };
                    var canclecallback = function () {};
                    printConfirm("请先登录后再询价！",surecallback,canclecallback);
                }
            }, false);
            temp.queryInfo.email = emailOut;
            temp.queryInfo.cellphone = umobileOut;
        },
        //提交询价——非正常商品（板材、橡皮布）-比正常询价多了生成sku
        /*inquiry_unNormal: function () {
            var temp = this;
            var emailOut = '';
            var umobileOut = '';
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    if(temp.itemId == ''){
                        popUp_auto_false(1500,"itemId不能为空");
                        return false;
                    }

                    if(data.result.shopId == temp.product.item.shopId){//自己店铺商品不能询价
                        popUp_auto_false(1500,"不能对自己店铺商品询价！");
                        return false;
                    }
                    $(".xunJia_dio_wrap").css("display", "block");
                    emailOut = data.result.userEmail;
                    umobileOut = data.result.umobile;
                }else{
                    var surecallback = function () {
                        $.jsonAjax(getUrl("order/isLogin"), {}, function (data, status, xhr) {}, false);
                    };
                    var canclecallback = function () {};
                    printConfirm("请先登录后再询价！",surecallback,canclecallback);
                }
            }, false);
            temp.queryInfo.email = emailOut;
            temp.queryInfo.cellphone = umobileOut;
        },*/
        //用于板材商品生成sku,这个方法生成一个promise，参数里就是你要的skuId
        getBoardSkuPromise: function () {
            var temp=this;
            var width=$("#input_width").val(),
                length=$("#input_length").val();
            if(!width || !length){
                popUp_auto_false(1500,"请填写尺寸");
                return;
            }
            ///先生成宽度和长度id
            var promise=new Promise(function (resolve,reject) {
                var submitData={
                    sellerId: temp.product.shopInfo.sellerId,//卖家id
                    itemId:itemId,//商品id
                    boardThicknessId:temp.selectedThickMsg.id,//厚度id
                    width:width,//宽度值
                    length:length//长度值
                };
                $.jsonAjax(getUrl("productController/addBoardSizeDimension"),submitData,function(data,status,xhr){
                    if(data.success){
                        resolve(data);
                    }else{
                        reject(data.errorMessages);
                        popUp_auto_false(1500,data.errorMessages);
                    }
                },false);
            })
                .then(function (data) {//假如请求成功, 这个data就是上边resolve(data)出来的{success:true;lengthId:344;widthId:343}
                    var attrGroups=[];//选中的属性拼成数组
                    $(".itemAttr").each(function(){
                        var attr = {attrId:"",attrName:"",attrValueId:"",attrValueName:""};
                        attr.attrId = $(this).data("id");
                        attr.attrName = $(this).data("attrname");
                        //属性值
                        var attrValue = $(this).next().find(".checked");//找到选中的属性
                        attr.attrValueId = attrValue.data("id");
                        attr.attrValueName = attrValue.data("attrvaluename");
                        //属性数组
                        attrGroups.push(attr);
                    });
                    var skuInfo={
                        //sku信息
                        "shopId": temp.product.shopInfo.shopId,
                        "itemId": itemId,
                        "skuId": "",
                        "quantity": "1",
                        "sellerId": temp.product.shopInfo.sellerId,
                        "regionId": temp.regionCode,//选择的地区id
                        "thicknessInfo": {
                            "thicknessId": temp.selectedThickMsg.id,
                            "thicknessName": temp.selectedThickMsg.thicknessName,
                            "widthId": data.widthId,
                            "widthName":width,
                            "lengthId":  data.lengthId,
                            "lengthName": length
                        },
                        "attrGroups": attrGroups
                    };

                    var submitDataForSku={
                        sellerId: temp.product.shopInfo.sellerId,
                        itemId:itemId,
                        shopId: temp.product.shopInfo.shopId,//店铺id
                        skuInfo:JSON.stringify(skuInfo)
                    };
                    return new Promise(function (resolve,reject) {
                        $.jsonAjax(getUrl("productController/createBoardItemSku"),submitDataForSku,function(data,status,xhr){
                            if(data.success){
                                resolve(data)
                            }else{
                                reject(data.errorMessages);
                                popUp_auto_false(1500,data.errorMessages);
                            }
                        },false);
                    });

            });
            return promise;
        },
        commitXunjia: function () {
            var temp=this;
            if(this.queryInfo.email=='' && this.queryInfo.cellphone=='' && this.queryInfo.qty==''){
                popUp_auto_false(1500,"请完善询价信息");
                return;
            }
            //正则验证
            var regMobile = /^[1]([3|5|7|8][0-9]{1}|59|58|88|89)[0-9]{8}$/;
            var regEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z\.-]+)\.([a-z]{2,6})$/;

            if (!regEmail.test(this.queryInfo.email)){
                popUp_auto_false(1500,"请输入正确的邮箱地址");
                return;
            }
            if(!regMobile.test(this.queryInfo.cellphone)){
                popUp_auto_false(1500,"请输入正确的手机号");
                return;
            }
            if(this.queryInfo.qty=='' || $.trim(this.queryInfo.qty)==""){
                popUp_auto_false(1500,"请输入有效的采购数量");
                return;
            }else if(this.queryInfo.qty<=0){
                popUp_auto_false(1500,"请输入有效的采购数量");
                return;
            }
            /*板材和橡皮布要先生成sku，因为板材和橡皮布没有sku*/
            if(temp.goodsType==2 || temp.goodsType==3){
                var boardSkuPromise=temp.getBoardSkuPromise();
                boardSkuPromise.then(function (data) {
                    temp.skuId=data.skuId;
                    gotoCommit();
                });
            }else {
                gotoCommit();
            }
            function gotoCommit() {
                //拼接参数
                var submitData = {
                    email:temp.queryInfo.email,
                    cellphone:temp.queryInfo.cellphone,
                    qty:temp.queryInfo.qty,
                    comment:temp.queryInfo.comment,
                    sellerId:temp.product.item.sellerId,
                    shopId:temp.product.item.shopId,
                    itemId:temp.itemId,
                    skuId:temp.skuId
                };
                //调用请求
                $.jsonAjax(getUrl("productController/addInquiry"),submitData,function(data,status,xhr){
                    if(data.success){
                        popUp_auto(1500,"询价提交成功");
                        $(".xunJia_dio_wrap").css("display", "none");
                        $(".outer").css("overflow", "");
                    }else{
                        popUp_auto_false(1500,data.errorMessages);
                    }
                },false);
            };

        },
        //客服
        gotoClient:function(){
            if(this.product.stationId){
                if(this.product.logging_status&&this.product.logging_status=='true'){
                    $(".concat").show();
                    $("#productDetail").hide();
                    $("#kefu")[0].src = "http://im.printhome.com/LR/Chatpre.aspx?id=" + this.product.stationId + "&un=" + this.product.userDTO.uid + "&ud=店铺名称："+this.product.shopInfo.shopName+"<br/>商品名称："+this.product.item.itemName+"";

                    //window.location=    "http://im.printhome.com/LR/Chatpre.aspx?id="+  this.product.stationId+  "&un="+  this.product.userDTO.uid + "&ud=店铺名称："+this.product.shopInfo.shopName+"<br/>商品名称："+this.product.item.itemName+"";
                }else{
                    printConfirm("您还未登录，<br/>请登录后使用小印客服。",gotoLogin);
                    // popUp_auto_false(1500,"请先登录!");
                }
            }
            else{
                popUp_auto_false(1500,"此店铺没有客服!");
            }
        },
        getMyCart:function(){
            var temp = this;
            $.jsonAjax(getUrl("shopCart/cart"),{},function(data,status,xhr){
                if(data){
                    temp.myCart =  data;
                }
            },false);
        },
        //sku轮播图
        goodsDetileScrool:function () {
             this.swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30,
        loop: true
    });
        },
        //板材、橡皮布商品填写检验,询价板材有报价要显示出来
        checkBoardInput: function (e,type) {
            var temp=this;
            var inputWidth=parseFloat($("#input_width").val());
            if(type=="width"){
                var widthPlaceholder=$("#input_width").attr("placeholder");
                var widthPlaceholderArr=widthPlaceholder.split('-');
                if(inputWidth<parseFloat(widthPlaceholderArr[0]) || inputWidth>parseFloat(widthPlaceholderArr[1]) ){
                    /*popUp_auto_false(2000,"宽度范围仅提供"+widthPlaceholder+"mm内，请重新输入");*/
                    $("#input_width").val('');
                    $(".widthErr").show();
                    $(e.target).addClass('redWord border_e60012');
                    temp.inputWidth='';
                    return;
                }else {
                    $(".widthErr").hide();
                    $(e.target).removeClass('redWord border_e60012');
                }
                if(temp.inputWidth){//如果用户输入宽度才可以输入长度
                    $("#input_length").removeAttr('readonly');
                }
            }
            var inputLength=parseFloat($("#input_length").val());
            if(type=="length"){
                var lengthPlaceholder=$("#input_length").attr("placeholder");
                var lengthPlaceholderArr=lengthPlaceholder.split('-');
                if(inputLength<parseFloat(lengthPlaceholderArr[0])|| inputLength>parseFloat(lengthPlaceholderArr[1])){
                    /*popUp_auto_false(2000,"长度范围仅提供"+lengthPlaceholder+"mm内，请重新输入");*/
                    $("#input_length").val('');
                    $(".heightErr").show();
                    $(e.target).addClass('redWord border_e60012');
                    temp.inputHeight='';
                    return;
                }else {
                    $(".heightErr").hide();
                    $(e.target).removeClass('redWord border_e60012');
                }
            }
        },
        forInquiry: function () {//用户输入长度和宽度查询报价列表
            var temp=this;
            if(temp.boardInquiryList){ //对于询价商品长度和宽度都填了就去报价列表里看看有没有报价
                if( temp.inputWidth && temp.inputHeight){
                    var inquiryStr=temp.selectedThickMsg.thicknessName+";"+temp.inputWidth+";"+temp.inputHeight;
                    for(var key in temp.boardInquiryList){
                        if(inquiryStr==key){//说明该尺寸有报价
                            temp.skuId=temp.boardInquiryList[key].skuId;
                            temp.skuInfo.hasPrice=1;
                            temp.skuInfo.skuPrice=temp.boardInquiryList[key].inquiryPrice;
                            temp.skuPriceForInquiry=temp.boardInquiryList[key].inquiryPrice;
                        }else {
                            temp.skuId='';
                            temp.skuInfo.hasPrice='';
                            temp.skuInfo.skuPrice='';
                            temp.skuPriceForInquiry='';
                        }
                    }
                }
            }
            temp.isBuyAluminumClip=false;//重新输入数值就要把铝夹去掉
            temp.aluminumClipPrice=0;//重新输入数值就要把铝夹去掉

        },
        //取消橡皮布商品填写校验的错误
        hideBoardInputErr: function (e,type) {
            if(type == "width"){
                $(".widthErr").hide();
                $(e.target).removeClass('redWord border_e60012');
            }
            if(type == "length"){
                $(".heightErr").hide();
                $(e.target).removeClass('redWord border_e60012');
            }
        },
        //套餐商品轮播
        goodsPackageScrool:function () {
            setTimeout(function () {
                //$(".showGoodsWrap").slide({mainCell:".showGoodsList",autoPage:true,effect:"left",autoPlay:true,vis:3,trigger:"click"});
                $(".showGoodsList span").css('width','0.2rem');
                $(".showGoodsWrap .tempWrap").css('width','5.1rem');
            },0)

        },
        changePrice: function (e) {//地址区域变动影响价格
            var temp=this;
            if(temp.product.item.attrTempalte==2 || temp.product.item.attrTempalte==3){ //板材、橡皮布
                var priceArr=this.selectedThickMsg.boardThicknessPrices;
                if(priceArr.length>1){
                    $.each(priceArr,function (index,item) {
                        if(e.target.value==item.areaId){
                            temp.priceForBoard=item.sellPrice+'/m²';
                            return false;
                        }
                    })
                }
            }else { //普通商品就再请求一下skuPrice就行了
                temp.getSkuPrice(temp.skuId,temp.product.item.shopId,temp.itemId,temp.regionCode,temp.product.item.sellerId);
            }

        },
        buyAluminumClip: function () {//铝夹选项点击 “是”
            var temp=this;
            if(temp.inputWidth && temp.inputHeight && temp.computedPrice || this.skuPriceForInquiry){

                var maxNum;
                maxNum=parseFloat(temp.inputWidth)>parseFloat(temp.inputHeight)?parseFloat(temp.inputWidth):parseFloat(temp.inputHeight);
                var tempArr=temp.selectedThickMsg.aluminumClipPrices.filter(function (obj) {
                    return (maxNum>parseFloat(obj.sizeStart)||maxNum==parseFloat(obj.sizeStart)) && (maxNum<parseFloat(obj.sizeEnd)||maxNum==parseFloat(obj.sizeStart));
                });
                temp.aluminumClipPrice=tempArr[0].sellPrice;
                temp.isBuyAluminumClip=true;
            }else {

                    popUp_auto_false(1500,"请填写正确的长度和宽度");

            }
        },
        noBuyAluminumClip: function () {//铝夹选项点击 “否”
            var temp=this;
            temp.isBuyAluminumClip=false;
            temp.aluminumClipPrice=0;
        }
    },
    computed:{
      ...mapState(['loadingFlag']),
         computedPrice:{
            get:function () { //板材橡皮布用户输入后计算出来的值-显示的价格
                if(this.inputWidth && this.inputHeight && this.priceForBoard){
                    return (this.inputWidth*this.inputHeight*parseInt(this.priceForBoard)/1000000+this.aluminumClipPrice).toFixed(2);
                }else {
                    return '';
                }
            },
            set: function (val) {

            }
        }
    },
    beforeMount:function(){
        this.loading_open();
        //在挂载之前获取商品信息
        this.getDetails(this.$route.query.itemId,this.$route.query.skuId);
        //获取配送至地址 为了请求skuPrice做准备
        /*this.regionCode = cookieUtil.getRegionCookieCode();
        //spu价格显示处理
        this.proSpuPriceShow();
        //如果skuId不为空时
        if(cookieUtil.isNotBlank(this.skuId) && this.skuId !="null"){
            var regionCodeTemp=$("#provinceId").val();
            this.regionCode=this.regionCode?this.regionCode:'11';
            this.getSkuPrice(this.skuId,this.product.item.shopId,this.itemId,this.regionCode,this.product.item.sellerId);
            this.getFavouriteSku(this.skuId,this.itemId);
        }
        if(this.product.item.attrTempalte==2 || this.product.item.attrTempalte==3){
            this.getFavouriteSku("",this.itemId);
        }
        //初始化sku数据选中状态
        this.initSkusChecked();
        //获取商品的活动信息
        if(this.type == "spu"){
            this.getPromotion(itemId,'spu',"");
        }else{
            this.getPromotion(itemId,'sku',skuId);
        }

        //获取省份信息
        this.getProvinces('0');
        //获取二级代码
        this.citys =  this.getAddresses(this.regionCode);
        //获取二级
        this.twoRegionCode = this.citys[0].code;
        //服务认证信息
        this.initServiceAuth();
        //初始化商品评价
        this.initLoadEvaluation();
        //初始化购物车
        this.getMyCart();*/

    },
    mounted:function(){

      if(this.myCart.quantity>99){
            $(".goods_num").addClass("goods_num_three");
            cutOut(".goods_num", 2);
        }else if(this.myCart.quantity>=10&&this.myCart.quantity<=99){
            $(".goods_num").addClass("goods_num_two");
        }
        console.log(this.product.item);
        //sku轮播
        //this.goodsDetileScrool();
        //轮播图"
        //ShufflingFigure();
        //点击事件
        //productClick();
       //将所有的图片自适应
        limitAllImg();
       //套餐商品
        this.goodsPackageScrool();
      //获取用户优惠卷信息
      this.getShopCoupons(this.product.item.shopId);
    },
    updated:function(){
        //this.swiper.destroy();
        //this.goodsDetileScrool();
    },
    watch:{
        queryPage:function(newValue,oldValue){
            this.loadEvaluation();
        },
        regionCode:function(newValue,oldValue){
            this.citys =  this.getAddresses(newValue);
            this.twoRegionCode = this.citys[0].code;
        },
        twoRegionCode:function(newValue,oldValue){
            this.getDeliveryType(itemId,skuId,this.regionCode);
        },
        skuId:function(newValue,oldValue){
            if(newValue != ""){
                this.getPromotion(this.itemId,'sku',this.skuId);
                this.getDeliveryType(this.itemId,this.skuId,this.regionCode)
                this.getSkuPrice(this.skuId,this.product.item.shopId,this.itemId,this.regionCode,this.product.item.sellerId);
                this.getFavouriteSku(this.skuId,this.itemId);
                var temp=this;
                //请求该sku对应的促销广告展示出来   /getItemSaleAd?shopId=&itemId=&skuId=
                temp.getAdData(temp.product.item.shopId,temp.itemId,temp.skuId);

            }else {
             //让分期的 periodId 恢复为-1，不然会存为最后一次点击分期的索引
             //    this.periodId=-1;
                this.periodId='';//写板材商品得到报价后加入购物车改的，因为会影响加入购物车
             //把广告数据清空
                this.adData={};
            }
        }
    },
    components:{
    swiper,
    swiperSlide
  },
    beforeRouteEnter(to, from, next) {//切换进入当前路由之前的钩子函数
    next();
  }

};


//创建加入购物车对象
function ShopCart(shopId,itemId,skuId,sellerId,areaCode,quantity,apTemplateId,itemBuyType){
    this.shopId = shopId;//店铺ID
    this.itemId = itemId;//商品id
    this.skuId = skuId;
    this.sellerId = sellerId;//商家id
    this.regionId = areaCode;//区域
    this.quantity = quantity;//数量
    if (typeof sayName != "function" ){
        ShopCart.prototype.sayName= function(){};
    }
    this.apTemplateId=apTemplateId;
    //以下是板材类商品新增 cgl
    this.itemBuyType = itemBuyType;//'商品购买类型：1=普通商品、2=板材类商品、3=橡皮布商品、4=套餐商品',
}

function gotoLogin() {
    var referer = location.href;
    if(referer){
        window.location="../../html/2_login_sign/login_common.html?referer="+referer;
    }else{
        window.location="../../html/2_login_sign/login_common.html";
    }
}
function limitAllImg() {
  var limitImg = $(".jieshao-wrap,.pingce-wrap");
  limitImg.find("img,input,table,form,strong,i,iframe").css({"display": "block", "max-width": "100%"});
  limitImg.find("img").each(function (index, item) {
    if (parseInt($(item).attr("height"))) {
      $(item).css({"height": "100%", "margin": "0 auto"});
    }
  });
  limitImg.find("td").removeAttr("width").css({"font-size": "0.12rem"});
  /*设置outer的高度，为了弹出框以后，禁止下边的滑动*/
  $(".outer").css("height", $(window).height() / 80 + "rem");
  $("embed").css('width',"100%")
}
