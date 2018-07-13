/**
 * Created by Administrator on 2017/3/16 0016.
 */
/**
*@fileName:cart.js
*@author:fdc
*@time:2017/3/16 0016
*@disc:用户购物车
*/
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

var cart = new Vue({
    el:"#cart",
    mixins:[math,productAttr,shop_coupon,common,itemUnit,index_advertises],
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        disUrl:'../../img/',
        //用户信息
        userInfo:"",
        myCart:{
            shops:[],
            payTotal:0
        },
        tempQuantity:0,
        editMode:false,
        //临时购物车用于删除购物车商品
        editCart:{
            shops:[]
        },
        //删除弹框
        delDialog:false,
        //删除单个商品提示框
        delSingleDialog:false,
        //删除单个商品临时变量
        singleDelProduct:"",

        oldSkuId:"",
        //错误弹框
        errorDialog:false,
        //验证错误提示list
        errorList:[],
        //记录body的scroll  top值
        bodyScroll:0,
        swiper:'',
        //满减活动弹框
        activityDetailsProp:false,
        //满减活动保存临时满减活动信息,用于弹框显示
        tempPromotions:[],
        //
        index1:0,
        index2:0,
        //点击去结算如果不满足分期信息那么给他一个提示框让他是否进行操作
        apErrorMsgDialog :false,
        apErrorMsg:"",
        userComfirmFlag:"",


    },
    methods:{
        //初始化付款方式按钮(那个是红的)
        initPayType: function (product) {
            if(product.accountPeriodTemplateDTO){
                this.payType=product.accountPeriodTemplateDTO.temType;
                console.log(1);
            }else {
                this.payType=0;
            }
            //处理分期

        },
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                    // console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        //初始化商品信息
        initUpdateProduct:function(product){
            //先把上一次请求来的periodInfoList清空
            this.tempProduct = product;//修改前的商品信息
            this.periodId  = this.tempProduct.apTemplateId;//修改前的商品分期id
            this.oldSkuId =  product.skuId;
            this.getDetails(product.itemId,product.skuId);
            this.initSkusChecked();
            this.initPayType(product);
            this.getSkuPrice(product.skuId,product.shopId,product.itemId,this.regionCode,product.sellerId);
            this.itemDialog = true;

        },
        //获取购物车数据
        getCart:function(){
            var temp = this;
            $.jsonAjax(getUrl("shopCart/toCart"),{},function(data, status, xhr){
                console.log(data);
                if(data.success && data.result.myCart.shops.length > 0){
                    temp.myCart = data.result.myCart;
                }
            },false)
        },
        //进入店铺首页
        gotoShop:function(shop){
            window.location = '../../html/5_dianPuShouYe/dianPu_index.html?shopId='+shop.shopId;
        },
        //获取商品选中图片
        setProductCheckedPic:function(product,shopChecked){
            if(product.status != 4 || product.qty <= 0 || !product.hasPrice){
                Vue.set(product,"disabled",true);
                Vue.set(product,"checkPicSrc",'no-select.png');
            }else if(product.checked){
                Vue.set(product,"disabled",false);
                Vue.set(product,"checkPicSrc",'yes-select.png');
            }else{
                Vue.set(product,"disabled",false);
                Vue.set(product,"checkPicSrc",'no-select.png');
            }
        },
        //点击商品选中图片
        setProductCheckedPic2:function(shop){
            if(shop.checked){
                $.each(shop.products,function(index,product){
                    Vue.set(product,"disabled",false);
                    Vue.set(product,"checked",true);
                    Vue.set(product,"checkPicSrc",'yes-select.png');
                });
            }else{
                $.each(shop.products,function(index,product){
                    Vue.set(product,"disabled",false);
                    Vue.set(product,"checked",false);
                    Vue.set(product,"checkPicSrc",'no-select.png');
                });
            }
        },
        //获取店铺选中图片
        setShopCheckedPic : function(shop){
            var checkCount  = 0;
            var checkDisableCount = 0;
            var temp =this;
            $.each(shop.products,function(index,product){
                temp.setProductCheckedPic(product);
                if(product.checked && !product.disabled){
                    checkCount ++ ;
                }
                if(!product.disabled){
                    checkDisableCount ++ ;
                }
            });
            if(shop.products!=null && shop.products.length > 0 && shop.products.length == checkCount){
                Vue.set(shop,"checkPicSrc",'yes-select.png');
            }else{
                Vue.set(shop,"checkPicSrc",'no-select.png');
            }
            if(shop.products!=null && shop.products.length > 0 && shop.products.length == checkDisableCount){
                Vue.set(shop,"disabled",false);
            }else{
                Vue.set(shop,"disabled",true);
            }

        },
        //初始化数据
        initCheckCart:function(){
            var vm = this;
            var shops = this.myCart.shops;
            if(shops.length > 0){
                $.each(shops,function(index,shop){
                    vm.setShopCheckedPic(shop);
                });
            }
        },
        //进入商品详情页
        gotoProductDetail:function(product){
            if(product.itemBuyType!=2 && product.itemBuyType!=3){
                window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+product.itemId+"&skuId="+product.skuId;
            }else {//橡皮布和板材不能带着skuId过去，因为带着skuId过去就不显示价格了
                window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+product.itemId;
            }
        },
        //选中商品
        checkedProduct:function(shop,product){
            if(product.checked){
                Vue.set(product,"checked",false);
                this.eidtProduct(shop,product);
            }else{
                Vue.set(product,"checked",true);
                this.eidtProduct(shop,product);
            }

        },
        //选中店铺
        checkedShop:function(shop){
            if(shop.checked){
                Vue.set(shop,"checked",false);
                this.eidtShop(shop,false);
            }else{
                Vue.set(shop,"checked",true);
                this.eidtShop(shop,true);
            }
        },
        //编辑模式下 根据店铺 将店铺下的商品选中 或者取消选中
        initEditProductCount:function(shop,editChecked){
            $.each(shop.products,function(index,product){
                product.editChecked = editChecked;
            });
        },
        //编辑模式下，根据商品判断店铺是否被选中
        initEditShopCount:function(shop){
            var productCheckCount = 0;
            $.each(shop.products,function(index,product){
                if(product.editChecked){
                    productCheckCount ++ ;
                }
            });
            if(productCheckCount == shop.products.length){
                shop.editChecked = true;
            }else{
                shop.editChecked = false;
            }
        },
        //编辑模式下，根据店铺判断购物车是否被选中
        initEditCartCount :function(){
            var shopCheckCount = 0;
            $.each(this.myCart.shops,function(index,shop){
                if(shop.editChecked){
                    shopCheckCount ++ ;
                }
            });

            if(shopCheckCount == this.myCart.shops.length){
                this.myCart.editChecked = true;
            }else{
                this.myCart.editChecked = false;
            }
        },
        //选中商品
        checkedEditProduct:function(shop,product){
            if(product.editChecked){
                product.editChecked =false;
            }else{
                product.editChecked =true;
            }
            this.initEditShopCount(shop);
            this.initEditCartCount();
        },
        //选中店铺
        checkedEditShop:function(shop){
            if(shop.editChecked){
                shop.editChecked =false;
                this.initEditProductCount(shop,false);
            }else{
                this.initEditProductCount(shop,true);
                shop.editChecked =true;
            }
            this.initEditCartCount();
        },
        //选中全选
        eidtCheckedAll :function(){
            var temp = this;
            if(this.myCart.editChecked){
                temp.myCart.editChecked = false;
                $.each(this.myCart.shops,function(index,shop){
                    shop.editChecked = false;
                    $.each(shop.products,function(index,product){
                        product.editChecked = false;
                    })
                });
            }else{
                temp.myCart.editChecked = true;
                $.each(this.myCart.shops,function(index,shop){
                    shop.editChecked = true;
                    $.each(shop.products,function(index,product){
                        product.editChecked = true;
                    })
                });
            }
        },
        //商品操作
        eidtProduct:function(shop,product){
            var temp = this;
            popUp_open();
            $.jsonAjaxPost(getUrl("shopCart/edit"),
                {
                    "skuId": product.skuId,
                    "shopId": product.shopId,
                    "quantity": product.quantity,
                    "checked": product.checked,
                    "regionId":product.regionId
                }, function (data, status, xhr) {
                    if(data.success){
                        temp.initUpdatedCart(data.result.myCart);
                    }else{
                        popUp_auto_false(1500,data.errorMessages);
                    }
                });


        },

        //店铺操作
        eidtShop :function(shop,checked){
            var temp = this;
            popUp_open();
            $.jsonAjaxPost(getUrl("shopCart/checkShop"),
                {
                    "shopId": shop.shopId,
                    "checked": checked
                }, function (data, status, xhr) {
                    if(data.success){
                        temp.initUpdatedCart(data.result.myCart);
                    }else{
                        popUp_auto_false(1500,data.errorMessages);
                    }
                });
        },
        //全选操作
        checkAll :function (){
            var temp = this;
            popUp_open();
            $.jsonAjaxPost(getUrl("shopCart/checkAll"),
                {"checked":!this.myCart.checked}, function (data, status, xhr) {
                    if(data.success){
                        temp.initUpdatedCart(data.result.myCart);
                    }else{
                        popUp_auto_false(1500,data.errorMessages);
                    }
                });
        },
        //添加数量
        addProduct:function(shop,product){

            var qty = parseFloat(product.qty);//商品库存
            var quantity = parseFloat(numAdd(product.quantity,1));

            if(quantity > qty){
                popUp_auto_false(1500,'库存不足！');
                return false;
            }
            product.quantity = numAddForCart(product.quantity,1);
            this.eidtProduct(shop,product);
        },
        //数量减1
        subProduct:function(shop,product){
            product.quantity = numSubForCart(product.quantity,1);
            this.eidtProduct(shop,product);
        },
        //修改数量
        updateProduct:function(evnet,shop,product){
            var qty = parseFloat(product.qty);//商品库存
            var quantity = parseFloat(event.currentTarget.value);;
            if(isNaN(quantity)){
                quantity = 0;
            }

            if(quantity > qty){
                popUp_auto_false(1500,'库存不足！');
                product.quantity = qty;
                return false;
            }
            if(quantity <= 0 ){
                this.delSingleDialog = true;
                this.singleDelProduct = product;
                return false;
            }
            product.quantity = quantity;
            this.eidtProduct(shop,product);
        },
        //弹框false
        popUp_auto_false : function(millisecond,message){
            popUp_auto_false(millisecond,message);
        },
        ////弹框true
        popUp_auto : function(millisecond,message){
            popUp_auto(millisecond,message);
        },
        //初始化临时购物车
        initEditCart:function(){
             if(this.myCart !="" && this.myCart.shops.length > 0){
                 var tempMycart = this.myCart;
                 Vue.set(tempMycart,"editChecked",false);
                 $.each(tempMycart.shops,function(index,shop){
                     Vue.set(shop,"editChecked",false);
                     $.each(shop.products,function(index,product){
                         Vue.set(product,"editChecked",false);
                     });
                 });
             }
        },
        //修改购物车之后初始化购物车中编辑模式已经选中的数据
        initEditCheckedCart:function(sourceCart,targetCart){
            //遍历现有的cart商品
            var tempShopCheckedCount = 0;
            $.each(targetCart.shops,function(index,tshop){
                var tempProductCheckedCount = 0;
                $.each(tshop.products,function(index,tproduct){
                    $.each(sourceCart.shops,function(index,sshop){
                        var tempFlag = false;
                        $.each(sshop.products,function(index,sproduct){
                            if(sproduct.skuId == tproduct.skuId){
                                Vue.set(tproduct,"editChecked",sproduct.editChecked);
                                tempFlag = true;
                                if(sproduct.editChecked){
                                    tempProductCheckedCount ++ ;
                                }
                                return false;
                            }
                        });
                        if(tempFlag){
                            return false;
                        }
                    });

                });
                if(tshop.products.length == tempProductCheckedCount && tshop.products.length > 0){
                    Vue.set(tshop,"editChecked",true);
                    tempShopCheckedCount ++ ;
                }
            });
            if(targetCart.shops.length == tempShopCheckedCount && tempShopCheckedCount >0 ){
                Vue.set(targetCart,"editChecked",true);
            }

        },
        //批量收藏商品
        shoucang:function () {
          if(this.checkList.length > 0){
              for(var i=0;i<this.checkList.length;i++){
                  var check = this.checkList[i];
                  console.log(check);
                  var data = {
                      skuId: check.skuId,
                      itemId: check.itemId,
                      shopId: check.shopId,
                      sellerId: check.sellerId,
                  }
                  $.jsonAjax(getUrl('favourite/addItem'),data,function(data,status, xhr){
                      // if(data.success){
                      //     popUp_auto(1500,"关注成功");
                      // }else{
                      //     popUp_auto_false(1500,data);
                      // }
                  },false);
              }
              popUp_auto(1500,"已收藏成功");
          }else{
              popUp_auto_false(1500,'请先选择商品!');
          }  
        },
        //批量删除购物车商品
        batchDel:function(){
            var temp =this;
            popUp_open();
            $.jsonStringAjaxPost(getUrl('shopCart/batchDel'),{products:this.delList},function(data, status, xhr){
               if(data.success){
                   temp.initUpdatedCart(data.result.myCart);
               }
            },false);
        },
        //删除单个商品
        singleItemDel:function(){
            this.delSingleDialog = false;
            var temp =this;
            var tempDelList = [];
            tempDelList.push(this.singleDelProduct.skuId);
            popUp_open();
            $.jsonStringAjaxPost(getUrl('shopCart/batchDel'),{products:tempDelList},function(data, status, xhr){
                if(data.success){
                    popUp_auto(1500,"删除成功!");
                    temp.initUpdatedCart(data.result.myCart);
                }
            },false);
        },
        //改变sku属性
        changeProductAttr:function(){
            var temp = this;

            if(this.oldSkuId == this.skuId && temp.tempProduct.apTemplateId == temp.periodId){
                temp.itemDialog = false;
                return false;
            }

            /*//如果此商品sku没有分期那么分期id置为空
            if(!this.periodInfoList || this.periodInfoList.length == 0){
                this.periodId = "";
            }*/

            if(this.uncheckAttr.length == 0){
                if(isNotBlank(this.oldSkuId) && isNotBlank(this.skuId)){
                    popUp_open();
                    $.jsonAjaxPost(getUrl('shopCart/updateProductAttr'),{oldSkuId:this.oldSkuId,newSkuId:this.skuId,apId:this.periodId},function(data, status, xhr){
                        if(data.success){
                            temp.initUpdatedCart(data.result.myCart);
                            temp.itemDialog = false;
                        }
                    },false);
                }else{
                    popUp_auto_false(1500,"请先选择需要修改的商品！");
                }
            }else{
                var errorMsg = "";
                $.each(this.uncheckAttr,function(index,ele){
                    errorMsg = errorMsg + ele.name+",";
                });
                errorMsg = errorMsg.substring(0,errorMsg.length -1);
                popUp_auto_false(1500,"请先选择"+errorMsg);
            }

        },
        //初始化优惠卷弹框
        initCouponDialog:function(shop){
            this.getShopCoupons(shop.shopId,true);
            this.couponDialog = true;
            //console.log($("body")[0].offsetTop);
            this.bodyScroll=$("body").scrollTop();
            clockedBody();


        },
        closeCouponDialog: function () {
            unClockedBody();
            $("body").scrollTop(this.bodyScroll);
            //this.bodyScroll=$("body").scrollTop();
            this.couponDialog=!this.couponDialog;
        }
        ,
        //去结算
        goOrderview:function(){
            var temp = this;
           if(this.myCart.payTotal && parseFloat(this.myCart.payTotal) &&  parseFloat(this.myCart.payTotal) < 999999999999) {
               $.jsonAjax(getUrl('shopCart/validate'),{orderType : 2},function(data, status, xhr){
                   if( data.success ){
                       if(data.result.myCart.unusualCount == '0' ){
                           temp.apErrorMsg = temp.getApError(data.result.myCart);
                           //用户已经确认且
                           var a=!isNotBlank(temp.apErrorMsg)
                           console.log(a);
                           if(temp.userComfirmFlag || !isNotBlank(temp.apErrorMsg)){
                               window.location = "../../html/16_dingDanHeDui/dingDanHeDui.html?orderType="+2+"&shopType="+data.result.shopType;;
                           }else{
                               temp.apErrorMsgDialog = true;
                               temp.userComfirmFlag = false;
                           }
                       }else{
                           temp.errorList.length  = 0;
                           //循环标志发现错误跳出循环
                           var returnFlag = false;
                           $.each(data.result.myCart.shops,function(index,shop){
                               if(shop.products){
                                   $.each(shop.products,function(index,product){
                                       if(product.unusualMsg && product.unusualMsg.length > 0){
                                           temp.errorList.push(product);
                                           temp.errorDialog = true;
                                           returnFlag = true;
                                           return false;
                                       }
                                   });
                                   if(returnFlag){
                                       return false;
                                   }
                               }
                           });
                       }
                   }else{
                       popUp_auto_false(2500,data.errorMessages);
                   }
               },false);
           }else if(parseFloat(this.myCart.payTotal) <= 0){
               popUp_auto_false(2500,'您的订单金额为0，请选择需结算的商品！');
           }else{
               popUp_auto_false(2500,'您的订单金额过大，请您联系平台客服处理，印刷家服务热线电话：400-6770-878！');
           }
        },
        //编辑选中删减购物车初始化公共操作
        initUpdatedCart:function(targetCart){
            //原来的cart数据
            var sourceCart =JSON.parse(JSON.stringify(this.myCart));
            this.myCart = targetCart;
            //初始化选中数据
            this.initCheckCart();
            this.initEditCheckedCart(sourceCart,this.myCart);
            //分期商品初始化分期数据
            this.initApData();
        },
        //去首页
        gotoIndex :function(){
            window.location = "../../html/1_index/index.html";
        },
        //初始化促销消息滚动
        initSwiper: function () {
            this.swiper = new Swiper('.swiper-container', {
                speed:800,
                autoplay: 3000,
                autoplayDisableOnInteraction: false,
                direction: 'vertical',
                loop : true,
                onlyExternal:true
            });
            //console.log(typeof this.swiper);
        },
        //初始化满减活动弹框
        initactivityDetailsProp:function(promotions){
            this.index1 = 0;
            this.index2 = 0;
            this.tempPromotions = promotions;
            this.activityDetailsProp = true;
            this.bodyScroll=$("body").scrollTop();
            clockedBody();


        },
        //判断是否有满减活动,是平台还是店铺? type  1:平台  2  店铺
        judgePromotionsFrom :function(promotions,type){
            if(!promotions || promotions.length <= 0 ){
                return false;
            }
            var result = false;
            if(type == 1){
                $.each(promotions,function(index,promotion){
                    if(promotion.shopId < 10){
                        result = true;
                        return false;
                    }
                })
            }

            if(type == 2){
                $.each(promotions,function(index,promotion){
                    if(promotion.shopId > 10){
                        result = true;
                        return false;
                    }
                })
            }
            return result;
        },
        getAddOne:function(obj){
            obj = obj+ 1;
            return obj;
        },
        closeactivityDetailsProp: function () {
            unClockedBody();
            $("body").scrollTop(this.bodyScroll);
            this.activityDetailsProp=!this.activityDetailsProp;
        }
        ,
        goToOrder:function(promotion,event){
            $(event.currentTarget).removeClass("goToOrder").addClass("goToOrder2")
            if(promotion.isAllItem == 1 && (promotion.shopId + "").length <= 1){//跳转首页产品大全
                window.setTimeout("window.location='../../html/11_pinDaoLeiMu/pinDaoLeiMu.html'",200);
            }else{//部分商品
                window.setTimeout("window.location='../../html/14_gouWuChe/goToOrder.html?promotionId="+promotion.id+"'",200);
            }
        },
        //初始化分期信息
        initApData : function(){
            var temp = this;
            if(this.myCart !="" && this.myCart.shops.length > 0){
                var tempMycart = this.myCart;
                $.each(tempMycart.shops,function(index,shop){
                    $.each(shop.products,function(index,product){
                        if(product.apTemplateId && product.apTempItemList &&　product.apTempItemList.length > 0 ){//必定存在分期商品
                            var existFlag = false;
                            $.each(product.apTempItemList,function(index,currentItem){
                                if(currentItem.id == product.apTemplateId){
                                    Vue.set(product,"currentItem",currentItem);
                                    existFlag = true;
                                    return false;
                                }
                            })
                            if(!existFlag){
                                Vue.set(product,"currentItem","");
                            }
                        }else{
                            Vue.set(product,"currentItem","");
                        }

                    });
                });
            }
        },
        //获取分期不满足条件信息
        getApError:function(myCart){
            var errorMsg = "";
            var tempCart = myCart;
            //分期 存在可以分期的店铺
                //判断所有分期满足
            if(tempCart.shops.length > 0){
                $.each(tempCart.shops,function(index,shop){
                    //存在分期模板，但是不能分期此时给予提示
                    if(shop.existApInfos && !shop.existAP){
                        errorMsg = "店铺" + "【"+shop.companyName+"】、"
                    }
                });
            }
            if(tempCart.isConsortRule  ==  false){
                var  msgHead  =  "支付类型";
                var  msgBody  =  "不一致，请分开结算。若合并结算，商品将全部按立即支付类型进行结算。您确定要继续结算吗？";
                if(tempCart.promptNum  ==  1){
                    msgHead  =  "分期条件";
                }
                if(tempCart.promptNum  ==  2){
                    msgHead  =  "延期条件";
                }
                if(tempCart.promptNum  ==  3){
                    msgHead  =  "定金条件";
                }
                return msgHead + msgBody;
            }else return '';
            if(isNotBlank(errorMsg) && errorMsg.length > 0){//存在这样的店铺
                errorMsg = errorMsg.substring(0,errorMsg.length - 1);
                // errorMsg = "店铺" + errorMsg+ "，不满足分期条件，该店铺下的商品将不能进行分期，是否继续？"
            }
        },
    },
    computed:{
         delList :function(){
             var delProductList  = [];
             $.each(this.myCart.shops,function(index,shop){
                 $.each(shop.products,function(index,product){
                     if(product.editChecked)
                      delProductList.push(product.skuId);
                 });
             })
             return delProductList;
         },
        checkList:function () {
            var checkProductList  = [];
            $.each(this.myCart.shops,function(index,shop){
                $.each(shop.products,function(index,product){
                    if(product.editChecked){
                        if(product.itemBuyType==4){/*套餐商品要全部加入进去*/
                            $.each(product.itemMealDTO.itemMealDetails, function (index,item) {

                                var data = {
                                    skuId: item.skuInfo.skuId,
                                    itemId: item.skuInfo.itemId,
                                    shopId: item.skuInfo.shopId,
                                    sellerId: item.skuInfo.sellerId
                                };
                                checkProductList.push(data);
                            })
                        }else {/*正常商品商品*/
                            var data = {
                                skuId: product.skuId,
                                itemId: product.itemId,
                                shopId: product.shopId,
                                sellerId: product.sellerId
                            };
                            checkProductList.push(data);
                        }

                    }
                });
            })
            return checkProductList;
        }
    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
        this.regionCode = getRegionCookieCode();
        //获取购物车数据
        this.getCart();
        //分期商品初始化分期数据
        this.initApData();
        //初始化编辑商品模式下的数据
        this.initEditCart();
        //初始化选中数据
        this.initCheckCart();
    },
    mounted:function(){
        if($('.swiper-container')){
            this.initSwiper();
        }
    },
    beforeUpdate:function(){
    },
    updated:function(){
        popUp_close();
        for(var i=0;i<this.swiper.length;i++){
            if(this.swiper[i]){
                this.swiper[i].destroy();
            }
        }
        this.initSwiper();
    },
    watch:{
        skuId:function(newValue,oldValue){
            if(newValue != ""){
                this.getSkuPrice(this.skuId,this.product.item.shopId,this.itemId,this.regionCode,this.product.item.sellerId);
            }
        },
        editMode:function(newValue,oldValue){
            if(newValue){
                //初始化临时购物车
                this.initEditCart();
            }
        },
        'myCart.payTotal':function (newValue,oldValue) {
            if(newValue && newValue<9999999.99){
                $(".heJi label").css("font-size","0.3rem")
            }else if(newValue && newValue>9999999.99){
                $(".heJi label").css("font-size","0.2rem")
            }else if(newValue && newValue>9999999999.99){
                $(".totalTit").hide();
            }
        }

    }


});
