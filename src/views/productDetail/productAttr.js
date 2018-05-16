/**
 * Created by Administrator on 2017/3/21 0021.
 */
/**
*@fileName:productAttr.js
*@author:fdc
*@time:2017/3/21 0021
*@disc:商品点击属性js
 *
*/
function getUrl(name) {
  return "http://wx.printhome.com/mall-web" + "/" + name;
}
import $ from "jquery"
import Vue from "vue"
export default {
    data: function () {
        return {
          periodName:['首','二','三','四','五','六','七','八','九','十','十一','尾'],
          //分期信息
          periodInfoList:[],
          //商品信息
          product:{
            shopInfo:"",//店铺信息
            item:{hasPrice:"",
              skuInfos:"",
              attrSale:[
                {values:[{checkedStatus:"normal"}]}
              ],
              picUrls:""
            },//商品信息
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
            //sku图片列表
            skuPics:[],
            favouriteSku:"",
            inquirySuccessPriceFlag:0,
          },
          skuId:"",
          itemId:"",
          //商品修改选择商品属性弹框
          itemDialog:false,
          regionCode:"",
          periodId:"", //存 点击的第几个分期的id
          //tempProduct 编辑模式下点击编辑，那么此时商品信息代入于此，记录商品sku修改前的sku
          tempProduct:"",//用户编辑购物车,
          adData:{},//选择sku后得到的广告数据
          payType:0,//记录支付方式 0:全款支付 1:分期支付 2:延期支付 3:定金支付
          paymentData:{},//获取到该sku支持的付款方式
          lockPriceData:{},//锁价的信息
          boardSaleAttr:{},//针对板材商品存储板材信息
          selectedThickMsg:{},//选中的厚度相关信息 {id: 105, sellerId: 1000001462, itemId: 1000003343, thicknessName: "1", status: 1,…}
          selectedOtherMsg:[],//选中的除了厚度的其他信息 attrName：{id: 149, sellerId: 1000000881, itemId: 1000003366, boardThicknessId: null, attrId: 72,…}
          itemMealDTO:[],//商品套餐信息
          boardInquiryList:{},//板材商品的报价列表
        }
    },
    methods:{
        getTemplate: function (payType) {
            this.payType=payType;
            if(payType==0){
                this.periodId=-1; //全款置为-1
            }else if(payType==1){
                this.periodId=this.paymentData.periodMarkLisr[0].id;
            }else if(payType==2){
                this.periodId=this.paymentData.delayMarkLisr[0].id

            }else if(payType==3){
                this.periodId=this.paymentData.depositMarkLisr[0].id;
            }
        },
        //改变分期
        changeStatement: function ($event,periodId) {
            $($event.target).addClass('checked').siblings().removeClass('checked').addClass('normal');
            this.periodId=periodId;
        },
        //获取商品详情
        getDetails:function(itemId,skuId){
            this.itemId = itemId;
            this.skuId = skuId;
            var temp = this;
            var submitData={};
            submitData.itemId=itemId;
            parseInt(skuId)?submitData.skuId=skuId:"";
            $.jsonAjax(getUrl("productController/details"),submitData,function(data, status, xhr){
                if(data.success){
                    console.log(data.result);
                    temp.product = data.result;
                    temp.goodsType=temp.product.item.attrTempalte;
                    $('title').html(data.result.item.itemName);

                    //请求该sku对应的促销广告展示出来   /getItemSaleAd?shopId=&itemId=&skuId=
                    // temp.getAdData(data.result.item.shopId,temp.itemId,temp.skuId);
                    if(data.result.item.attrTempalte==2 || data.result.item.attrTempalte==3){//板材、橡皮布商品
                        temp.skuInfo.qty=9999999;//板材无库存限制
                        if(data.result.item.attrTempalte==2){//板材
                            temp.boardSaleAttr=data.result.item.boardSaleAttr;//存储板材商品详情
                        }
                        if(data.result.item.attrTempalte==3){//橡皮布
                            temp.boardSaleAttr=data.result.item.rubberClothSaleAttr;//存储橡皮布商品详情
                        }
                        temp.selectedThickMsg=temp.boardSaleAttr.boardThicknessList[0]; //初始化选中的厚度
                        temp.priceForBoard=temp.selectedThickMsg.boardThicknessPrices[0].sellPrice+"/m²";//板材无sku，价格显示阶梯价第一个
                        /*如果是询价商品，请求报价列表过来，并且把temp.priceForBoard重置为空*/
                        if(temp.product.item.itemStatus == 4 &&　temp.product.item.hasPrice != 1 &&　temp.product.logging_status == 'true'){
                            temp.priceForBoard='';
                            var inquiryPara={sellerId:temp.product.item.sellerId, buyerId:temp.product.userId, itemId:itemId};
                            $.jsonAjax(getUrl("productController/queryInquiryList"),inquiryPara,function(data, status, xhr){
                                if(data){
                                    temp.boardInquiryList=data;
                                }
                            },false)
                        }
                    }
                }else{
                    window.location = "../../html/4_souSuoJieGuo/search_nothing.html"
                }
            },false)
        },
        //获取sku对应的广告图片
        getAdData: function (shopId,itemId,skuId) {
            var temp = this;
            $.jsonAjax(getUrl("productController/getItemSaleAd"),{shopId:shopId,itemId:itemId,skuId:skuId},function(data, status, xhr){
                if(data.success){
                    temp.adData=data.result;
                }else{

                }
            },false)
        },
        //获取sku价格
        getSkuPrice:function(skuId,shopId,itemId,areaCode,sellerId){
            var temp = this;
            $.jsonAjax(getUrl('productController/getSkuPrice'),{
                skuId:skuId,
                shopId:shopId,
                itemId:itemId,
                areaCode:areaCode,
                sellerId:sellerId,
            },function(data,status, xhr){
                if(data.priceObject && data.priceObject.success){
                    temp.skuInfo = data;
                    temp.skuInfo.hasPrice = data.priceObject.result.hasPrice;
                    temp.skuInfo.inquirySuccessPriceFlag = data.priceObject.result.inquirySuccessPriceFlag;
                    if(temp.skuInfo.inquirySuccessPriceFlag == 1){
                        temp.skuInfo.hasPrice = true;
                    }
                    temp.skuInfo.qty = data.priceObject.result.qty;
                    if(temp.skuInfo.hasPrice){
                    	//判断有没有促销活动价格
                        if(temp.skuInfo.disPrice!=null && typeof(temp.skuInfo.disPrice)!="undefined"){
                            temp.skuInfo.skuPrice = temp.skuInfo.disPrice.toFixed(2);
                        }else{
                            temp.skuInfo.skuPrice = data.priceObject.result.skuPrice.toFixed(2);
                        }
                        //陈广良 获取该sku对应的分期模板
                        /*$.jsonAjax(getUrl('productController/getApInfo'),{
                            skuId:skuId,
                            itemId:itemId,
                            price:temp.skuInfo.skuPrice
                        },function(data,status, xhr){
                            if(data.success){
                                temp.periodId = "";//初始值为无分期
                                temp.periodInfoList=data.result;
                            }else {
                                temp.periodInfoList=[];
                                popUp_auto_false(1500,'网络错误')
                            }

                        },false);*/
                        //陈广良 获取该sku对应的付款方式有哪些
                        $.jsonAjax(getUrl('productController/getPaymentType'),{
                            skuId:skuId,
                            itemId:itemId,
                            price:temp.skuInfo.skuPrice
                        },function(data,status, xhr){
                            if(data.success){
                                temp.paymentData = data;
                            }else {
                                temp.paymentData={};
                            }
                        },false);
                    }
                    temp.skuInfo.barginPrice =data.disPrice!=null && typeof(data.disPrice)!="undefined" ?  data.disPrice.toFixed(2): "";
                    temp.skuInfo.skuPictureUrl = data.priceObject.result.skuPicUrl;
                    temp.skuInfo.skuPics = data.priceObject.result.skuPics;
                    $.jsonAjax(getUrl('itemAttrUnit/getUnitNameBySkuId'),{
                        skuId:skuId,
                    },function(data,status, xhr){
                        if(data.size > 0)
                            temp.skuInfo.unit = data.rows[0].name;
                    },false);
                    /*锁价*/
                    $.jsonAjax(getUrl('productController/getLockInfo'),{
                        skuId:skuId,
                        shopId:shopId,
                        itemId:itemId
                    },function(data,status, xhr){
                        if(data){
                            temp.lockPriceData=data;
                        }
                    },false);
                    /*根据sku获取套餐信息*/
                    $.jsonAjax(getUrl('productController/getItemMeal'),{skuId:skuId},function(data,status, xhr){
                        if(data.success){
                            temp.itemMealDTO=data.itemMealDTO;
                            Vue.set(temp.itemMealDTO[0],'sel',0);//这里是存储一下点击的是套餐几
                        }
                    },false);

                }
            },false);
        },
        //初始化sku选中数据
        initSkusChecked:function(){
            var temp = this;
            var attrSale =  this.product.item.attrSale;
            var skuInfos =  this.product.item.skuInfos;
            $.each(attrSale,function(index,ele){
                //ele 颜色{黑，白} product.item.attrSale[0].values[0].name 吨
                var execAttrT = ele;
                $.each(execAttrT.values,function(index,ele){
                    var execAttr = ele;
                    Vue.set(execAttr,'checkedStatus','disabled');
                    $.each(skuInfos,function(index,ele){
                        //如果sku存在的话,那么此sku的属性必然是被选中
                        var  attributeValue = ele.attributes.split(";");
                        var  attribute = [];//颜色， 重量
                        var  value = [];//大 ，轻
                        $.each(attributeValue,function(index,ele){
                            var temp = ele.split(":");
                            attribute.push(temp[0]);
                            value.push(temp[1]);
                        })
                        //此时跟skuId相同那么包含它的 被选中
                        if(ele.skuId == temp.skuId){
                            if (value.join(",").indexOf(execAttr.id) != -1){
                                Vue.set(execAttr,'checkedStatus','checked');
                                return false;
                            }
                        }
                        //ele.checkedStatus
                    })

                    if(execAttr.checkedStatus == 'checked'){
                    }else{
                        $.each(skuInfos,function(index,ele){
                            //如果sku存在的话,那么此sku的属性必然是被选中
                            var  attributeValue = ele.attributes.split(";");
                            var  attribute = [];//颜色， 重量
                            var  value = [];//大 ，轻
                            $.each(attributeValue,function(index,ele){
                                var temp = ele.split(":");
                                attribute.push(temp[0]);
                                value.push(temp[1]);
                            })
                            //此时跟skuId相同那么包含它的 被选中
                            if (value.join(",").indexOf(execAttr.id) != -1 && Number(ele.skuInventory) > 0){
                                Vue.set(execAttr,'checkedStatus','normal');
                                return false;
                            }
                        })

                    }

                });

            });


        },
        //点击商品属性 刷新哪个可以点击哪个不能点击
        changeCheckStatus:function(attr,value){
            var vm = this;
            var classType = value.checkedStatus;
            var attrSale =  this.product.item.attrSale;
            var skuInfos =  this.product.item.skuInfos;
            if(classType == 'checked'){
                /**
                 * 将checked变为正常那么就要寻找因为此disabled 变为normal
                 * 如果黑色的由选中到未选中 那么颜色这个属性将不对 其他属性有误造成影响
                 * 如果其他任何包含此属性的有
                 */
                $.each(attrSale,function(index,ele){
                    //ele 颜色{黑，白} product.item.attrSale[0].values[0].name 吨
                    if(ele != attr){
                        var execAttrT = ele;
                        //大小  大 小
                        $.each(execAttrT.values,function(index,ele){
                            var execAttr = ele;
                            var disableFlag=false;
                            /**比如说是大 找出所有黑 大的组合是看否存在一个有库存
                             * 如果有的话那么大不改变，如果没有那么大变为disable
                             */
                            //组装黑，
                            var  checkAttrString = attr.id+":"+value.id + ";";
                            //组装当前变量大
                            var currentAttrString = execAttrT.id + ":" + execAttr.id +";";
                            $.each(skuInfos,function(index,ele){
                                var attribute = ele.attributes;
                                if(attribute.indexOf(currentAttrString) != -1 && Number(ele.skuInventory) > 0){
                                    if(execAttr.checkedStatus == 'disabled'){
                                        execAttr.checkedStatus = 'normal';
                                        return ;
                                    }

                                }
                            })
                        });
                    }
                });
                //将当前选中的变为未选中
                value.checkedStatus = 'normal';
            }
            if(classType == 'normal'){
                /**
                 * 此时变为选中状态
                 * 1 将当前属性分组  a,即将选中的一组 ，b 已经选中的一组 ，c 未被选中的一组
                 * 2 发生影响 a 即将选中 那么说明可以被选择,变为选中
                 *           b 已经选中的一组   可能变为disabled
                 *           c 未被选中的一组   可能变为disabled
                 *
                 * 解决办法:
                 * 找出已经选中的一组
                 * 即将变选中的组
                 * 未被选中的组
                 * 已经选中  + 即将被选中  + 未被选中组中一条进行判断 如果存在 > 0 那么可以被选中
                 * 如果不存在那么变成disabled
                 * 问题2
                 * 已经选中的组也会因选中组改变变为disabled
                 * 已经选中 + 即将被选中 如果存在所有库存都 <= 0 那么这个已经选中的 会变为disable
                 *
                 * 可能出现 已经选中的一组跟即将变选中的一组是同一组
                 * 那么切换选项的时候 先前disable 可能变为正常
                 *
                 */
                var checkedGroup = [];//已经选中的组
                var checkedGroupString = [];//已经选中的组 字符串集合组
                var needCheckedGroup = attr;//即将选中的组
                var unCheckedGroup = [];//未被选中的组
                //找出已经选中的组
                checkedGroup = this.findCheckedGroup(attrSale,attr,value);
                //拼装选中字符串的组属性知道值的集合
                checkedGroupString = this.assemblyCheckedGroupString(checkedGroup);
                var needCheckedGroupString = attr.id+":"+value.id + ";";
                unCheckedGroup = this.findUnCheckedGroup(attrSale,attr,value);
                //已经选中  + 即将被选中  + 未被选中组中一条进行判断 如果存在 > 0 那么可以被选中
                $.each(unCheckedGroup,function(index,execAttrT){
                    $.each(execAttrT.values,function(index,execAttr){
                        var currentAttrString = execAttrT.id + ":" + execAttr.id +";";
                        var disableFlag=false;
                        $.each(skuInfos,function(index,ele){
                            var attribute = ele.attributes;
                            if( vm.judgeCheckedStringIndex(attribute,checkedGroupString) &&  attribute.indexOf(needCheckedGroupString) != -1 && attribute.indexOf(currentAttrString) != -1 && Number(ele.skuInventory) > 0){
                                //说明存在此值
                                disableFlag = true;
                                return false;
                            }

                        });
                        //不存在此值时为disabled
                        if(!disableFlag){
                            execAttr.checkedStatus = 'disabled';
                        }else{
                            execAttr.checkedStatus = 'normal';
                        }

                    });
                })
                //已经选中 + 即将被选中 如果存在所有库存都 <= 0 那么这个已经选中的 会变为disable
                /**
                 * 选中组 中当前校验选中组 跟其他选中组  即将选中组
                 *
                 */

                var  cycleGroup = [];
                $.each(checkedGroup,function(index,execAttrT){
                    //为除此之外的其他选中组
                    cycleGroup = vm.findOthersCheckedGroupString(checkedGroup,execAttrT);
                    $.each(execAttrT.values,function(index,execAttr){
                        var currentAttrString = execAttrT.id + ":" + execAttr.id +";";
                        var disableFlag=false;
                        $.each(skuInfos,function(index,ele){
                            var attribute = ele.attributes;
                            if(vm.judgeCheckedStringIndex(attribute,cycleGroup) && attribute.indexOf(needCheckedGroupString) != -1 && attribute.indexOf(currentAttrString) != -1 && Number(ele.skuInventory) > 0){
                                //说明存在此值
                                disableFlag = true;
                                return false;
                            }

                        });
                        //不存在此值时为disabled
                        if(!disableFlag){
                            execAttr.checkedStatus = 'disabled';
                        }else{
                            if(execAttr.checkedStatus == 'disabled'){
                                execAttr.checkedStatus = 'normal'
                            }
                        }
                    });
                })

                //将已经选中的变为未选中
                $.each(attr.values,function(index ,ele){
                    if(ele.checkedStatus == 'checked')
                        ele.checkedStatus = 'normal';
                })
                //将当前选中的变为选中
                value.checkedStatus = 'checked';

            }
            this.skuChecked = '';
            this.goodsPackageScrool();//把套餐滚动效果初始化
        },
        //找出被选中的组
        findCheckedGroup:function(attrSale,attr,value){
            var checkedGroup = [];//已经选中的组
            $.each(attrSale,function(index,ele){
                if(ele !=attr ){
                    var exists = false;
                    //一个属性中有一个被选中则被选中
                    $.each(ele.values,function(index,value){
                        if(value.checkedStatus == 'checked'){
                            exists = true;
                            return false;
                        }
                    });
                    if(exists){
                        checkedGroup.push(ele);
                    }
                }
            });
            return checkedGroup;
        },
        //拼装选中字符串的组属性值的集合
        assemblyCheckedGroupString:function(checkedGroupString){
            var result = [];
            $.each(checkedGroupString,function(index,ele){
                var temp = ele;
                $.each(temp.values,function(index,ele){
                    if(ele.checkedStatus == 'checked'){
                        var tempString = temp.id + ":" + ele.id + ";";
                        result.push(tempString);
                    }
                });
            });
            return result;
        },
        //找出未被选中的组
        findUnCheckedGroup:function(attrSale,attr,value){
            var unCheckedGroup = [];
            $.each(attrSale,function(index,ele){
                if(ele !=attr ){
                    var exists = false;
                    //一个属性中有一个被选中则被选中
                    $.each(ele.values,function(index,value){
                        if(value.checkedStatus == 'checked'){
                            exists = true;
                            return false;
                        }
                    });
                    if(!exists){
                        unCheckedGroup.push(ele);
                    }
                }
            });
            return unCheckedGroup;
        },
        //判断被选中都在集合中
        judgeCheckedStringIndex:function(attributes,checkedGroupString){
            var result = true;
            $.each(checkedGroupString,function(index,ele){
                if(attributes.indexOf(ele) == -1){
                    result = false;
                    return false;
                }
            });
            return result;
        },
        //获取其他选中组的str array
        findOthersCheckedGroupString:function(checkedGroup,execAttrT){
            var result = [];
            $.each(checkedGroup,function(index,ele){
                if(ele!=execAttrT){
                    $.each(ele.values,function(index,attr){
                        if(attr.checkedStatus == 'checked'){
                            var tempString = ele.id + ":" + attr.id + ";";
                            result.push(tempString);
                            return false;
                        }
                    })
                }
            });
            return result;
        },
        //商品分期信息显示状态 sourceId 原来的sku id循环列表需要选中的分期id
        getApChecked:function(id){
            if(id == ""){//全款
                if(!isNotBlank(this.tempProduct.apTemplateId)){//是空时
                    return "beginSpan checked"
                }else{
                    return "beginSpan normal"
                }
            }
            if(id != ""){//其他分期信息
                if(id == this.tempProduct.apTemplateId){
                    return "beginSpan checked"
                }else{
                    return "beginSpan normal"
                }
            }
        },
        hideLockPriceMsg: function () {
            $(".locked_price_tip").hide();
        },
        changeThickMsg: function (oneThick) {
            var temp=this;
            temp.isBuyAluminumClip=false;//换厚度先把铝夹取消，铝夹的钱置为0
            temp.aluminumClipPrice=0;//换厚度先把铝夹取消，铝夹的钱置为0
            this.selectedThickMsg=oneThick;
            var provinceId=$("#provinceId").val();
            var priceArr=this.selectedThickMsg.boardThicknessPrices;
            if(priceArr.length>1){
                $.each(priceArr,function (index,item) {
                    var itemTemp=item.areaId+''
                    if(provinceId == itemTemp){

                        temp.priceForBoard=item.sellPrice+'/m²';
                        return false;
                    }else {//查不到这个省的价钱就提示
                        temp.priceForBoard="不在配送范围"
                    }
                })
            }
            this.checkBoardInput();
            if(temp.boardInquiryList){
                this.forInquiry();//看看这个厚度下有没有报价
            }
        },//板材商品选厚度
        changeValue: function (e,attrId) {
            console.log(e);
            $(e.target).addClass("checked").removeClass("normal").siblings("span").removeClass("checked").addClass("normal");
            $("#"+attrId).html(e.target.innerText);
        },//板材商品选除了厚度的其他属性

    },
    computed:{
        //当一个sku所有元素都被选中时改变sku的值，触发watch
        skuChecked:{
            set:function(value){
                var temp = this;
                var attrSale = this.product.item.attrSale;
                var checkedAttrStringArray = [];//1100:2003;
                $.each(attrSale,function(index,ele){
                    var tempAttr = ele;
                    $.each(ele.values,function(index,ele){
                        if(ele.checkedStatus == 'checked'){
                            var tempString = tempAttr.id + ":" + ele.id +";";
                            checkedAttrStringArray.push(tempString);
                            return false;
                        }
                    })
                });
                if(checkedAttrStringArray.length > 0 && checkedAttrStringArray.length == attrSale.length ){
                    $.each(temp.product.item.skuInfos,function(index,ele){
                        var attribute = ele.attributes;
                        var trueCount = 0 ;
                        $.each(checkedAttrStringArray,function(index,ele){
                            if( attribute.indexOf(ele) != -1){
                                trueCount ++;
                            }
                        })
                        if(trueCount == checkedAttrStringArray.length){
                            temp.skuId = ele.skuId;
                        }
                    });

                }else{
                    temp.skuId = "";
                }
            },
            get:function(){

            }
        },
        //计算未被选中的属性
        uncheckAttr:function(){
            var result = [];
            var attrSale = this.product.item.attrSale;
            $.each(attrSale ,function(index,ele){
                var execAttrP = ele;
                var checkedFlag = false;
                $.each(ele.values,function(index,ele){
                    if(ele.checkedStatus == 'checked'){
                        checkedFlag = true;
                        return false;
                    }
                });
                if(!checkedFlag){
                    result.push(execAttrP);
                }
            });
            return result;
        },
        // 板材和橡皮布输入数值要改变售价
    }
};
