
<template>
  <div id="productDetail">
    <header>
      <div class="top">
        <a href="#" class="arrow_wrapper"><img class="arrow" src="../../assets/img/back.png" alt=""/></a>
        <a href="#" class="upCar_wrap"><img class="upCar" src="../../assets/img/goods_upCar.png" alt=""/></a>
      </div>
    </header>
    <!--sku轮播开始-->
    <div class="sku-popup" @click="skuSwiperFlag = !skuSwiperFlag" :style="skuSwiperFlag ? 'opacity: 1;z-index:999' : 'opacity: 0;z-index:-10'">
      <div class="swiper-container">
        <swiper :options="swiperOption" class="swiper-wrapper">
          <swiper-slide v-for="(pic,index) in  skuInfo.skuPics" :key="index">
            <img :src="imgUrl + pic.picUrl" class="slideImg">
          </swiper-slide>

        </swiper>
        <div class="pad_wrap">
          <span class="swiper-pagination"></span>
        </div>

        <!--<div class="swiper-wrapper">
          <template v-if="skuInfo.skuPics && skuInfo.skuPics.length>0">&lt;!&ndash;假如有sku图片&ndash;&gt;
            <template v-for="(pic,index) in  skuInfo.skuPics">
              <div class="swiper-slide">
                <a class="pic" href="#">
                  <img :src="imgUrl + pic.picUrl" alt=""/>
                  <template v-if="adData && adData.bottomAd && adData.bottomAd[0] && index==0">
                    <a :href="adData.bottomAd[0].goUrl" style="height: 1.13rem">
                      <img :src="imgUrl + adData.bottomAd[0].pictureUrl" alt="" class="adBigImg">
                    </a>
                  </template>
                </a>
                <p>
                        <span v-for="skuAttr in skuInfo.priceObject.result.attrSales">
                            {{skuAttr.name}}:{{skuAttr.values[0].name}};
                        </span>
                </p>
              </div>
            </template>
          </template>
          <template v-else>&lt;!&ndash;没有sku图片，显示spu图片 product.item.picUrls[0]&ndash;&gt;
            <template v-for="(picUrl,index) in  product.item.picUrls">
              <div class="swiper-slide">
                <a class="pic" href="#">
                  <img :src="imgUrl + picUrl" alt=""/>
                  <template v-if="adData && adData.bottomAd && adData.bottomAd[0] && index==0">
                    <a :href="adData.bottomAd[0].goUrl" style="height: 1.13rem">
                      <img :src="imgUrl + adData.bottomAd[0].pictureUrl" alt="" class="adBigImg">
                    </a>
                  </template>
                </a>
                <p>
                  &lt;!&ndash;<span v-for="skuAttr in skuInfo.priceObject.result.attrSales">
                      {{skuAttr.name}}:{{skuAttr.values[0].name}};
                  </span>&ndash;&gt;
                </p>
              </div>
            </template>
          </template>

        </div>-->
        <!--<div class="swiper-pagination"></div>-->
      </div>
    </div>
    <div class="outer" style="/*height: 500px;overflow: hidden*/">
      <div class="triker"><!--这个div为了固定定位nav-->
        <!--焦点图开始-->
        <div class="banner">
          <div id="slideBox" class="slideBox">
            <div class="bd">
              <ul id="bannerList">
                <!--<li><a class="pic" href="#"><img src="../../assets/img/1.png"/></a></li>
                <li><a class="pic" href="#"><img src="../../assets/img/2.png"/></a></li>-->
                <template v-for="picUrl in product.item.picUrls">
                  <li><a class="pic" href="#"><img :src="imgUrl +  picUrl"/></a></li>
                </template>
              </ul>
            </div>
            <div class="hd">
              <ul>
              </ul>
            </div>
          </div>
          <div class="bannerImg_wrap">
            <img src="../../assets/img/goods_back.png"  onclick="javascript:history.back(-1);" alt=""/>
            <img src="../../assets/img/goods_car.png" alt="" @click="gotoCart"/>
            <span v-show="myCart.allQuantity && myCart.allQuantity != 0 " style="display: none" class="goods_num"></span>
          </div>
        </div>
        <!-- 广告语 -->
        <template v-if="product.itemAd!=null && product.itemAd.isShow">
          <div class="goods_wrap">
            <div class="ad_prop">
              <div class="ad_title promotion_price">
                {{product.item.ad}}
              </div>
              <img class="goods_select" src="../../assets/img/shangPin_arrow.png" alt=""/>
            </div>
          </div>
        </template>
        <div class="goods_wrap">
          <p class="goods_name" v-cloak>{{product.item.itemName}}</p>
          <!--商品状态异常-->
          <template v-if="product.item.itemStatus != 4">
            <p class="noSale">商品非在售，无法购买！</p>
          </template>
          <template v-else>
            <!--只有商品信息时-->
            <template v-if="!skuId || skuId=='null'">
              <p class="goods_price">
                <template v-if="product.item.hasPrice == 1">
                  <template v-if="product.item.attrTempalte==2 || product.item.attrTempalte==3">  <!--'商品销售属性模板：1=普通商品、2=板材类商品、3=橡皮布商品',-->
                    <span class="market" v-cloak>市场价：￥{{product.item.marketPriceStart}}
                                        <template v-if="product.item.marketPriceEnd">
                                            -￥{{product.item.marketPriceEnd}}
                                        </template>
                                    </span>
                    <!--<span class="promotion_price" v-cloak>售价：￥{{selectedThickMsg.boardThicknessPrices[0].sellPrice}} /m²</span>-->
                    <template v-if="computedPrice"><!--如果用户输入正确的长度和宽度就展示计算后的价格-->
                      <span class="promotion_price" v-cloak>售价：￥{{computedPrice}}</span>
                    </template>
                    <template v-else><!--显示单价 80/m²-->
                      <span class="promotion_price" v-cloak>售价：￥{{priceForBoard}}</span>
                    </template>

                  </template>
                  <template v-else>
                    <span class="market" v-cloak>市场价：￥{{product.item.marketPriceForShow}}</span>
                    <span class="promotion_price" v-cloak>售价：￥{{product.item.guidePriceForShow?product.item.guidePriceForShow:product.item.sellPrices[0].sellPrice}}</span>
                  </template>
                </template>
                <template v-else>
                  <template v-if="product.item.hasPrice != 1 &&　product.logging_status == 'true'">
                    <!--<p class="xunJia" @click="inquiry">欢迎询价</p>-->
                  </template>
                  <template v-if="product.item.hasPrice != 1 &&　product.logging_status != 'true'">
                    <!--<p class="xunjiaNoLogin" onclick='gotoLogin()'>登录后可询价</p>-->
                  </template>
                </template>
              </p>
            </template>
            <!--sku存在时-->
            <template v-else>
              <template v-if="skuInfo.hasPrice">
                <p class="goods_price">
                  <span class="market" v-cloak>市场价：￥{{skuInfo.hasPrice ? product.item.marketPriceForShow :''}}</span>
                  <template v-if="skuInfo.hasPrice && skuInfo.barginPrice != ''">
                    促销价：<span class="promotion_price" v-cloak>￥{{ skuInfo.barginPrice}}</span>
                  </template>
                  <template v-else-if="skuInfo.hasPrice && skuInfo.skuPrice != ''">
                    售价:
                    <template v-if="skuInfo.skuPrice==0"><!--该地区不支持配送，请更换收货地址-->
                      <span class="promotion_price color_e60012" v-cloak>不在配送范围</span>
                    </template>
                    <template v-else>
                      <span class="promotion_price" v-cloak>￥{{aluminumClipPrice? skuInfo.skuPrice+aluminumClipPrice:skuInfo.skuPrice}}</span>
                    </template>
                  </template>
                  <template v-if="lockPriceData && lockPriceData.success">
                    <div class="locked_price_wrap">
                      锁定价：<span class="locked_price" v-cloak>￥{{lockPriceData.result.lockPirce}}</span>
                      <div class="locked_price_tip">
                        卖家已为您锁定当前价格 <br>
                        有效期至：<span class="color_333">{{lockPriceData.result.lockDate}}</span><br>
                        锁定价格和其他的优惠不同享<br>
                        您可在订单核对页决定是否使用该锁定价格<br>
                        <span class="redBtn_hollow mar_t10" @click="hideLockPriceMsg()">知道啦</span>
                      </div>
                    </div>
                  </template>
                </p>
              </template>

              <template v-if="!skuInfo.hasPrice || skuInfo.skuPrice == ''">
                <template v-if="product.item.itemStatus == 4 &&　product.item.hasPrice != 1 &&　product.logging_status == 'true'">
                  <p class="xunJia" @click="inquiry">欢迎询价</p>
                </template>
                <template v-if="product.item.itemStatus == 4 &&　product.item.hasPrice != 1 &&　product.logging_status != 'true'">
                  <p class="xunjiaNoLogin" onclick='gotoLogin()'>登录后可询价</p>
                  <!--<p class="xunjiaNoLogin" onclick='window.location="../2_login_sign/login_common.html"'>登录后可询价</p>-->
                </template>
              </template>
            </template>
            <!--板材、橡皮布类商品宽度和长度可以输入 start-->
            <template v-if="product.item.attrTempalte==2 || product.item.attrTempalte==3">  <!--'商品销售属性模板：1=普通商品、2=板材类商品、3=橡皮布商品',-->
              <div class="mar_b10">
                <p class="col_333 font_24  over_hide"><!-- redWord border_e60012 -->
                  <span class="fl">宽度：<input type="number" id="input_width" v-model="inputWidth" @blur="checkBoardInput($event,'width')"   @focus="hideBoardInputErr($event,'width')" @keyup="forInquiry()"  class="input_Style2 wid_160" :placeholder="selectedThickMsg.boardSizeLimitDTO ? selectedThickMsg.boardSizeLimitDTO.widthMin+'-'+selectedThickMsg.boardSizeLimitDTO.widthMax :''"> mm</span>
                  <span class="fr">长度：<input type="number" id="input_length" v-model="inputHeight" @blur="checkBoardInput($event,'length')" @focus="hideBoardInputErr($event,'length')" @keyup="forInquiry()" class="input_Style2 wid_160" :placeholder="selectedThickMsg.boardSizeLimitDTO ? selectedThickMsg.boardSizeLimitDTO.lengthMin+'-'+selectedThickMsg.boardSizeLimitDTO.lengthMax :''" readonly> mm</span>
                </p>
                <template v-if="selectedThickMsg.boardSizeLimitDTO">
                  <p class="col_e60012 text_right mar_t5 none widthErr">宽度范围仅提供{{selectedThickMsg.boardSizeLimitDTO.widthMin+'-'+selectedThickMsg.boardSizeLimitDTO.widthMax}}mm内，请重新输入</p>
                  <p class="col_e60012 text_right mar_t5 none heightErr">长度范围仅提供{{selectedThickMsg.boardSizeLimitDTO.lengthMin+'-'+selectedThickMsg.boardSizeLimitDTO.lengthMax}}mm内，请重新输入</p>
                </template>
              </div>
            </template>
            <!--板材、橡皮布类商品宽度和长度可以输入 end-->
          </template>
          <div class="goods_prop">
            <div class="goods_con">
              <template v-if="uncheckAttr.length == 0">
                <span class="goods_key">已选择：</span>
                <template v-if="product.item.attrTempalte==2 || product.item.attrTempalte==3"><!-- 2=板材类商品、3=橡皮布商品 -->
                  厚度：{{selectedThickMsg.thicknessName}}mm;&nbsp;
                  <template v-if="product.item.attrTempalte==3 && isBuyAluminumClip">
                    铝夹：<template v-if="isBuyAluminumClip">是</template><template v-else>否</template>
                  </template>
                  <template v-for="oneAttr in boardSaleAttr.boardAttrs">
                    {{oneAttr.attrName}}: <span :id="'attrId'+oneAttr.id">{{oneAttr.values[0].attrValueName}}</span>
                  </template>
                </template>
                <template v-else>
                  <template v-for="attrSale in product.item.attrSale">
                    <template v-for="value in attrSale.values">
                      <template v-if="value.checkedStatus == 'checked'">
                        {{attrSale.name}}：{{value.name}} &nbsp;
                      </template>
                    </template>
                  </template>
                </template>
                <template  v-if="skuId &&　periodInfoList　&&　periodInfoList.length>0">
                  分期：<template v-if="periodId && periodId!=-1">
                  <template v-for="(periodInfo,index) in periodInfoList">
                    <template v-if="periodId==periodInfo.id">
                      {{periodInfo.apNum}}期<template v-if="!periodInfo.needFirstPay">(延)</template>
                    </template>

                  </template>
                </template>
                  <template v-else>全款</template>
                </template>
              </template>
              <template v-else>
                <span class="goods_key">选择：</span>
                <template v-for="attr in uncheckAttr">
                  <span class="win_count">{{attr.name}} &nbsp;</span>
                </template>
              </template>
            </div>
            <img class="goods_select" src="../../assets/img/shangPin_arrow.png" alt=""/>
          </div>
        </div>
        <template v-if="adData && adData.bannerAd && adData.bannerAd.length>0">
          <div class="adWrap">
            <template v-for="(item,index) in adData.bannerAd">
              <template v-if="index < 3">
                <a v-bind:href="item.goUrl">
                  <img :src="imgUrl + item.pictureUrl" alt="">
                </a>
              </template>

            </template>
          </div>
        </template>
        <div class="promotion_wrap" v-show="promotion.promotionFullReduction!='' || promotion.promotionMarkdown!='' || couponsDTOs != ''">
          <p class="promotion">促销活动
            <img class="goods_select" src="../../assets/img/shangPin_arrow.png" alt=""/>
          </p>
        </div>
        <div class="tip">
          <template v-if="serviceAuthInfo.platformServiceRuleDTOList != null && serviceAuthInfo.userPlatformServiceRuleDTOList != null">
            <template v-for="rule in serviceAuthInfo.platformServiceRuleDTOList">
              <template v-for="userRule in serviceAuthInfo.userPlatformServiceRuleDTOList">
                <template v-if="rule.ruleId == userRule.ruleId">
                  <div class="instruction">
                    <img class="check_mark" v-bind:src="imgUrl + rule.iconImageSrc" alt=""/>{{rule.ruleName}}
                  </div>
                </template>
              </template>
            </template>
          </template>
        </div>
        <div class="distribution">
          <p class="promotion">配送</p>

          <div class="select_add" v-cloak>{{product.from}}&nbsp;至&nbsp;
            <select  style="height: 0.4rem; font-family: 黑体" v-model="regionCode" @change="changePrice($event)" id="provinceId">
              <option  v-for="province in  provinces" :value="province.code" v-text="province.name"></option>
            </select>
            <select  name="sel_City" style="height: 0.4rem;font-family: 黑体" v-model="twoRegionCode">
              <option  v-for="city in citys" :value="city.code" v-text="city.name"></option>
            </select>
          </div>
          <p>
            <template v-if="product.deliveryTypes.length == 0">
              包邮
            </template>
            <template v-for="deliveryType in product.deliveryTypes">
              <template v-if="deliveryType.deliveryType == 1">
                快递
              </template>
              <template v-else-if="deliveryType.deliveryType == 2">
                EMS
              </template>
              <template v-else="deliveryType.deliveryType == 3">
                平邮
              </template>
              <template v-if="deliveryType.groupFreight == 0">
                包邮
              </template>
              <template v-else>
                ￥{{deliveryType.groupFreight}}
              </template>

            </template>
          </p>
          <template  v-if="product.preferentialWay">
            <p class="pro_tit1">优惠</p>
            <p class="promotion_option">
              <template v-if="product.preferentialWay.deliveryType == 1">
                满{{product.preferentialWay.full}}件
              </template>
              <template v-if="product.preferentialWay.deliveryType == 2">
                满{{product.preferentialWay.full}}kg
              </template>
              <template v-if="product.preferentialWay.deliveryType == 3">
                满{{product.preferentialWay.full}}m³
              </template>
              <template v-if="product.preferentialWay.deliveryType == 4">
                满{{product.preferentialWay.full}}元
              </template>
              <template v-if="product.preferentialWay.strategy == 1">
                减{{product.preferentialWay.reduce}}元
              </template>
              <template v-if="product.preferentialWay.strategy == 2">
                包邮
              </template>
            </p>
          </template>
        </div>
        <div class="limit">
          <p>购买限制</p>
          <div class="yellow_wrap">
            <span class="yellow_bg">起批</span>
            <p class="yellow_con" v-cloak>金额要求：订单总价大于{{product.shopInfo.initialPrice}}元
              <template v-if="product.shopInfo.initialCondition == 1">
                或
              </template>
              <template v-if="product.shopInfo.initialCondition == 2">
                且
              </template>
              数量要求：货品总数大于{{product.shopInfo.initialMount}}件</p>
          </div>
          <div class="red_wrap" >
            <span class="red_bg">混批</span>
            <p class="red_con" v-cloak>
              <template v-if="product.shopInfo.mutilPrice == 1">
                金额要求：订单总价大于
                {{product.shopInfo.priceMin}}
                元
                <template v-if="product.shopInfo.mutilCondition == 1">或</template>
                <template v-if="product.shopInfo.mutilCondition == 2">且</template>
                数量要求：货品总数大于{{product.shopInfo.mountMin}}件
              </template>
              <template v-else>无</template>
            </p>
          </div>
        </div>
        <div class="promise" v-cloak>
          服务承诺：{{product.shopFreightTemplateDTO.deliveryTime}}
        </div>
        <!--套餐商品展示 start-->
        <template v-if="itemMealDTO && itemMealDTO.length>0">
          <div class="pad_20 bg_fff">
            <p style="line-height: 0.4rem;">
              <template v-for="(itemMeal,index) in itemMealDTO">
                <span class="goods_package_btn" :class="index==itemMealDTO[0].sel?'redWord':''" @click="itemMealDTO[0].sel=index;goodsPackageScrool()">套餐{{index+1}}</span>
              </template>
            </p>
            <template v-for="(itemMeal,index) in itemMealDTO">
              <template v-if="index==itemMealDTO[0].sel">
                <div class="po_re goods_package_main showGoodsWrap mar_t20" style="display: block; width: 100%;overflow: hidden;">
                  <img src="../../assets/img/zuojiantou.png" alt="" class="prev cur_po po_ab" style="left:0;top:0.5rem;z-index: 10">
                  <img src="../../assets/img/youjiantou.png" alt="" class="next cur_po po_ab" style="right:0;top:0.5rem;z-index: 10">
                  <div style="width: 5.1rem;overflow: hidden;margin: 0 auto;overflow-x: scroll;">
                    <ul class="showGoodsList" style="overflow: hidden;">
                      <template v-for="(item,index) in itemMeal.itemMealDetails">
                        <li class="oneGoods fl mar_r10" style="float: left; width: 1.7rem;">
                          <div style="width: 100%">
                            <img :src="imgUrl + item.tradeInventoryOutDTO.skuPicture[0].picUrl" alt="" style="" class="wid_140 hei_140 ver_mid">
                            <!-- <template v-if="itemMeal.itemMealDetails.length < 3 && (index+1)==itemMeal.itemMealDetails.length">
                             </template>-->
                            <template v-if="(index+1)!=itemMeal.itemMealDetails.length">
                              <span class="mar_l5 " style="width: 0.2rem">+</span>
                            </template>
                          </div>
                          <div class="twoLine pad_r20" style="height: 0.7rem">{{item.tradeInventoryOutDTO.itemName}}</div>
                          <p class="text_cen redWord pad_r30">￥{{item.tradeInventoryOutDTO.areaPrices[0].sellPrice |toDecimal2}}</p>
                        </li>
                      </template>
                    </ul>
                  </div>

                  <div class="clear"></div>
                </div>
                <div>
                  <div class="text_cen" style="height: 0.25rem"><span class="dis_inb triangle_up_f4f4f4"></span></div>
                  <div class="bg_f4f4f4 text_cen pad_lr20 pad_b20">
                    <p class="hei_line_60">
                      <span class="font_22 col_999" style="text-decoration: line-through">￥{{itemMeal.goodsTotal |toDecimal2}}</span>
                      <span class="mar_l20 font_28 col_e60012">￥{{itemMeal.packagePrice |toDecimal2}}</span>
                    </p>
                    <p><span class="yellowBtn" @click="addCart(4,itemMeal.mealId)">加入购物车</span></p>
                  </div>
                </div>
              </template>

            </template>

          </div>
        </template>

        <!--套餐商品展示 end-->
        <!--继续拖动开始-->
        <div class="tuijian" id="tuijian">
          <div class="line_mid"></div>
          <span>继续拖动，查看商品详情</span>
        </div>
        <!--继续拖动结束-->
      </div>
      <!--详情开始-->
      <section id="xiangqing">
        <!-- 头部选项卡-->
        <div class="nav_wrap">
          <div class="nav_con">
            <span class="nav" style="color: rgb(227, 37, 41);">商品介绍</span>
            <span class="nav">包装清单</span>
            <span class="nav">买家评论</span>
            <span class="nav last">商家评测</span>
          </div>

        </div>

        <!-- 商品介绍部分开始-->
        <div class="jieshao-wrap" >
          <div style="margin-bottom: 0.2rem;border-bottom: 2px solid #f4f4f4;">
            <span class="goodsDetileInfoLeft" v-cloak><span class="goodsDetileTit">上架日期：</span>{{product.item.listtingTime | longToDateNoTime}}</span>
            <span class="goodsDetileInfo" v-cloak><span class="goodsDetileTit">商品毛重：</span><span v-if="product.item.weight">{{product.item.weight}}{{product.item.weightUnit}}</span></span>
            <span class="goodsDetileInfoLeft" v-cloak><span class="goodsDetileTit">店铺名称：</span>{{product.shopInfo.shopName}}</span>
            <span class="goodsDetileInfo" v-cloak><span class="goodsDetileTit">商品产地：</span>{{product.item.origin}}</span>
            <span class="goodsDetileInfoLeft" v-cloak><span class="goodsDetileTit">商品编号：</span>{{product.item.itemId}}</span>
            <span class="goodsDetileInfo" v-cloak><span class="goodsDetileTit">商品体积：</span><span v-if="product.item.volume">{{product.item.volume +'m³'}}</span> </span>
          </div>

          <div v-html="replaceSrcUrl(product.item.describeUrl,imgUrl)"></div>
        </div>

        <!-- 包装清单部分开始-->
        <div class="qingdan-wrap">
          <div class="qingdan">
            <ul class="qingdan_con">
              <li>{{product.item.packingList}}</li>
            </ul>
            <div style="height: 1rem"></div>
          </div>
        </div>

        <!-- 买家评论部分开始-->
        <div class="pinglun-wrap">
          <template v-for="evaluation in itemEvaluationList">
            <div class="pinglun">
              <div class="star_wrap">
                <span class="star_tit">评价星级</span>
                <template v-if="evaluation.skuScope == 1">
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                </template>
                <template v-else-if="evaluation.skuScope == 2">
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                </template>
                <template v-else-if="evaluation.skuScope == 3">
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                </template>
                <template v-else-if="evaluation.skuScope == 4">
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                </template>
                <template v-else-if="evaluation.skuScope == 5">
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                  <img class="star" src="../../assets/img/xingtianchong@3x.png" alt=""/>
                </template>
                <span class="star_rtit">
                        <template v-if="evaluation.isAnonymity != null && evaluation.isAnonymity == 1">
                            匿名评价
                        </template>
                        <template v-else>
                            {{evaluation.userName}}
                        </template>
                    </span>
              </div>
              <div class="pinglun_con">
                <p class="pinglun_list"><span class="pinglun_tit">购买心得：</span>{{evaluation.content}}</p>

                <p class="pinglun_list"><span class="pinglun_tit">评论日期：</span>{{evaluation.createTime | longToDate(evaluation.createTime)}}</p>

                <template v-if="evaluation.isHavePic">
                  <div>
                    <span class="pinglun_tit">晒单图片：</span>
                    <template v-for="pic in evaluation.picList">
                      <img v-bind:src="imgUrl + pic.imgUrl" alt="" class="pinglun_img" v-on:click="amplifiedPic($event)"/>
                    </template>
                  </div>
                </template>

                <template v-for="replay in evaluation.itemEvaluationReplyList">
                  <p class="pinglun_list">
                    <span class="pinglun_tit">店铺回复：</span>
                    {{replay.createTime | longToDate(replay.createTime)}}
                    {{replay.content}}
                  </p>
                </template>
              </div>
              <p>感谢评价！！</p>
            </div>
          </template>
        </div>

        <!-- 商家评测部分开始-->
        <div class="pingce-wrap">
          <template v-if="product.item.appraisalUrl != null">
            <div class="pingce_con" v-html="replaceSrcUrl(product.item.appraisalUrl,imgUrl)"></div>
          </template>
        </div>

      </section>
      <p class="printhome">printhome.com</p>
      <!--固定底部开始-->
      <footer>
        <div class="footer">
          <a class="lianxi" href="javascript:;">
            <img src="../../assets/img/xiaoxiang.png" alt=""/>

            <p @click="gotoClient()">联系客服</p>
          </a>
          <a class="lianxi" href="javascript:;" @click="gotoShop">
            <img src="../../assets/img/dianpulogo.png" alt=""/>
            <p>店铺</p>
          </a>
          <a class="lianxi guanzhuBtn" href="javascript:;" @click="itemSkuFavorite">
            <template v-if="skuInfo.favouriteSku != ''">
              <img src="../../assets/img/guanzhuhou.png" alt=""/>
              <p style="color:#e32529;">关注</p>
            </template>
            <template v-else>
              <img src="../../assets/img/guanzhu1.png" alt=""/>
              <p style="color:black;">关注</p>
            </template>
          </a>

          <template v-if="product.item.itemStatus != 4">
            <div class="jiaru-wrap">
              <a class="jiaru" style="background: #A5A5A5" href="javascript:;" onclick="printAlert('商品非在售,无法购买!')">商品非在售</a>
            </div>
          </template>
          <template v-else-if="(skuInfo.hasPrice && product.item.itemStatus == 4) || product.item.hasPrice == 1">
            <div class="jiaru-wrap">
              <template v-if="product.item.attrTempalte==2">  <!--板材商品-->
                <a href="javascript:;" class="jiaru" @click="addCart_unNormal(2)">加入购物车</a>
                <!--这里传的数字用来准备加入购物车的参数 itemBuyType '商品购买类型：1=普通商品、2=板材类商品、3=橡皮布商品、4=套餐商品'-->
              </template>
              <template v-else-if="product.item.attrTempalte==3">  <!--橡皮布商品-->
                <a href="javascript:;" class="jiaru" @click="addCart_unNormal(3)">加入购物车</a>
              </template>
              <template v-else>
                <a href="javascript:;" class="jiaru" @click="addCart()">加入购物车</a><!--普通商品-->
              </template>
            </div>
          </template>
          <template v-else-if="!skuInfo.hasPrice">
            <div class="jiaru-wrap">
              <a class="jiaru" href="javascript:;" @click="inquiry">欢迎询价</a>
            </div>
          </template>

        </div>
      </footer>

    </div>
    <!--商品sku弹框-->
    <div class="win_prop">
      <div class="prop_bg"></div>
      <div class="prop_wrap">
        <div class="prop_con">
                <span class="prop_imgWrap">
                    <img class="prop_img" @click="skuSwiperFlag = !skuSwiperFlag"  :src=" imgUrl +  (!skuId ? product.item.picUrls[0]: (skuInfo.skuPictureUrl ? skuInfo.skuPictureUrl : product.item.picUrls[0]) )" alt=""/>
                  <!--<img class="prop_img" @click="skuId ? skuSwiperFlag = !skuSwiperFlag : '' "  :src=" imgUrl +  (!skuId ? product.item.picUrls[0]: (skuInfo.skuPictureUrl ? skuInfo.skuPictureUrl : product.item.picUrls[0]) )" alt=""/>-->
                    <template v-if="adData && adData.bottomAd && adData.bottomAd[0]">
                        <a :href="adData.bottomAd[0].goUrl">
                            <img :src="imgUrl + adData.bottomAd[0].pictureUrl" alt="" class="adLittleImg">
                        </a>
                    </template>
                </span>
          <p class="win_priceWrap">
            <template v-if="skuId || product.item.attrTempalte==2 || product.item.attrTempalte==3"> <!-- 2=板材类商品、3=橡皮布商品 必须用2或者3判断，用1判断不准确-->
              <template v-if="skuInfo.hasPrice || product.item.hasPrice==1"><!--`has_price` 是否有报价：1：有价格；2：暂无报价',-->
                <template v-if="product.item.attrTempalte==2 || product.item.attrTempalte==3"><!--板材和橡皮布-->
                  <!-- <span class="win_price">{{'￥'+ priceForBoard}}</span>-->
                  <template v-if="skuInfo.skuPrice"><!--这里是针对询价商品，假如有报价了，就要显示报价-->
                    <span class="win_price" v-cloak>售价：￥{{aluminumClipPrice? skuInfo.skuPrice+aluminumClipPrice:skuInfo.skuPrice}}</span>
                  </template>
                  <template v-else>
                    <template v-if="computedPrice"><!--如果用户输入正确的长度和宽度就展示计算后的价格-->
                      <span class="win_price" v-cloak>售价：￥{{computedPrice}}</span>
                    </template>
                    <template v-else><!--显示单价 80/m²-->
                      <span class="win_price" v-cloak>售价：￥{{priceForBoard}}</span>
                    </template>
                  </template>

                </template>
                <template v-else><!--正常商品-->
                  <template v-if="skuInfo.barginPrice != ''">
                    <span class="win_price">￥{{ skuInfo.barginPrice}}</span>
                  </template>
                  <template v-else>
                    <template v-if="skuInfo.skuPrice==0"><!--该地区不支持配送，请更换收货地址-->
                      <span class="win_price color_e60012" v-cloak>不在配送范围</span>
                    </template>
                    <template v-else>
                      <span class="win_price">{{'￥'+skuInfo.skuPrice}}</span>
                    </template>
                  </template>
                </template>
                <!--sku 锁定价 start-->
                <!--<template v-if="lockPriceData && lockPriceData.success">
                    <p>锁定价：<span class="locked_price" v-cloak>￥{{lockPriceData.result.lockPirce}}</span></p>
                </template>-->
                <!--sku 锁定价 end-->
                <!--<template v-if="goodsType!=2 && goodsType!=3">
                    <p class="win_count">库存：{{skuInfo.qty == 0 || skuInfo.qty == "" ? '无货' : skuInfo.qty}} {{skuInfo.qty == 0 || skuInfo.qty == "" ? '': skuInfo.unit}}</p>
                </template>-->
              </template>
              <template v-else>
                <span class="win_count">欢迎询价</span>
              </template>
            </template>
            <template v-else>
              <span class="win_price">{{'￥'+ product.item.hasPrice == 1 ? product.item.guidePriceForShow : ''}}</span>
              <br/>&nbsp;
              请选择
              <template v-for="attr in uncheckAttr">
                <span class="win_count">{{attr.name}} &nbsp;</span>
              </template>
            </template>
          </p>

          <div class="prop_chahaoWrap">
            <img class="prop_chahao" src="../../assets/img/win_chahao.png" alt=""/>
          </div>
          <div class="win_select">
            <template v-for="attrSale in product.item.attrSale">
              <div class="wrap_wrapper">
                <span class="wrap_tit">{{attrSale.name}}：</span>
                <span>
                            <p class="wrap_con">
                                <template v-for="value in attrSale.values">
                                    <span :class="'beginSpan ' + value.checkedStatus" @click="value.checkedStatus == 'normal'||value.checkedStatus == 'checked' ?changeCheckStatus(attrSale,value) : ''">{{value.name}}</span>
                                </template>
                            </p>
                        </span>

              </div>
            </template>
            <template v-if="product.item.attrTempalte!=2 && product.item.attrTempalte!=3">
              <div class="wrap_wrapper">
                <span class="wrap_tit">支付类型：</span>
                <span>
                                <p class="wrap_con">
                                    <span class="beginSpan" :class="payType==0 ? 'checked':'' " @click="getTemplate(0)">全款支付</span>
                                    <template v-if="paymentData.periodMark">
                                        <span class="beginSpan" :class="payType==1 ? 'checked':'' " @click="getTemplate(1)">分期支付</span>
                                    </template>
                                    <template v-if="paymentData.delayMark">
                                        <span class="beginSpan" :class="payType==2 ? 'checked':'' " @click="getTemplate(2)">延期支付</span>
                                    </template>
                                    <template v-if="paymentData.depositMark">
                                        <span class="beginSpan" :class="payType==3 ? 'checked':'' " @click="getTemplate(3)">定金支付</span>
                                    </template>
                                </p>
                            </span>
              </div>
            </template>
            <template v-else>
              <div class="wrap_wrapper">
                <span class="wrap_tit">厚度：</span>
                <span>
                                <p class="wrap_con">
                                    <template v-for="oneThick in boardSaleAttr.boardThicknessList">
                                        <span :class="oneThick.id==selectedThickMsg.id ? 'beginSpan checked':'beginSpan normal'" @click="changeThickMsg(oneThick)">{{oneThick.thicknessName}}mm</span>
                                    </template>
                                </p>
                            </span>
              </div>
              <div class="wrap_wrapper" v-if="selectedThickMsg.isAluminumClip ==1 ">
                <span class="wrap_tit">铝夹：</span>
                <span>
                                <p class="wrap_con">
                                    <span class="beginSpan" :class="isBuyAluminumClip ? 'normal':'checked'" @click="noBuyAluminumClip()">否</span>
                                    <span class="beginSpan" :class="isBuyAluminumClip ? 'checked':'normal'" @click="buyAluminumClip()">是</span> <span class="col_999 font_12" v-if="isBuyAluminumClip">价格：￥{{aluminumClipPrice}}/副</span>
                                </p>
                            </span>
              </div>
              <template v-for="(attr,index1) in boardSaleAttr.boardAttrs">
                <div class="wrap_wrapper">
                  <span class="wrap_tit itemAttr" :data-id="attr.id" :data-attrName="attr.attrName">{{attr.attrName}}：</span>
                  <span>
                                <p class="wrap_con">
                                    <template v-for="(value,index) in attr.values">
                                        <span :class="index==0?'beginSpan checked':'beginSpan normal'" :data-id="value.id" :data-attrvaluename="value.attrValueName" @click="changeValue($event,'attrId'+attr.id)">{{value.attrValueName}}</span>
                                    </template>
                                </p>
                            </span>
                </div>
              </template>
            </template>
            <!--分期详情展示start-->
            <template  v-if="payType==1 && skuId &&　paymentData.periodMark　&&　paymentData.periodMarkLisr.length>0">
              <div class="wrap_wrapper">
                <!--<span class="wrap_tit">分期：</span>-->
                <span class="wrap_tit" style="height: 0.2rem"></span>
                <span>
                                <div class="wrap_con"  style="background-color: rgb(246,246,246);padding: 0.1rem 0 0 0.1rem">
                                    <!--<span :class="periodId == ''? 'beginSpan checked' : 'beginSpan normal'" @click="changeStatement($event,-1)">全款</span>-->
                                    <template v-for="(periodInfo,index) in paymentData.periodMarkLisr">
                                           <span :class="periodId == periodInfo.id   ? 'beginSpan checked' : 'beginSpan normal'" @click="changeStatement($event,periodInfo.id)">{{periodInfo.apNum}}期<template v-if="!periodInfo.needFirstPay">(延)</template></span>
                                    </template>
                                    <template v-for="(periodInfo,index) in paymentData.periodMarkLisr">
                                        <template v-if="periodId==periodInfo.id ">
                                                <p style="color: #666;margin-top: 0.1rem;">{{periodInfo.apNum}}期分期说明：</p>
                                                <template v-for="(onePeriod,index) in periodInfo.apTempItemList">
                                                       <p class="stageDet">{{periodInfo.apTempItemList.length==(index+1)?'尾':periodName[index]}}期:￥{{onePeriod.currentAllPay}}<template v-if="onePeriod.apFee!=null">(<template v-if="index==0&&!periodInfo.needFirstPay"><span style="color: #666">延期支付,</span></template>含手续费￥{{onePeriod.apFee}})</template></p>
                                                </template>
                                                <p style="color: #999">
                                                    <template v-if="periodInfo.apOverdueFeeFlag==1">
                                                        <template v-if="periodInfo.apOverdueFeeType==1">
                                                            逾期还款手续费:
                                                            <template v-if="periodInfo.apOverdueFeeUnit==1">
                                                                    {{periodInfo.apOverdueFee}}%/期
                                                            </template>
                                                             <template v-if="periodInfo.apOverdueFeeUnit==2">
                                                                    ￥{{periodInfo.apOverdueFee}}/期
                                                            </template>
                                                        </template>
                                                        <template v-if="periodInfo.apOverdueFeeType==2">
                                                            逾期还款手续费:
                                                            <template v-if="periodInfo.apOverdueFeeUnit==1">
                                                                    {{periodInfo.apOverdueFee}}%/天
                                                            </template>
                                                             <template v-if="periodInfo.apOverdueFeeUnit==2">
                                                                    ￥{{periodInfo.apOverdueFee}}/天
                                                            </template>
                                                        </template>
                                                    </template>
                                                </p>
                                        </template>

                                    </template>
                                    <br>
                                 </div>
                            </span>

              </div>
            </template>
            <!--分期详情展示end-->
            <!--延期详情展示start-->
            <template  v-if="payType==2 && skuId &&　paymentData.delayMark　&&　paymentData.delayMarkLisr.length>0">
              <div class="wrap_wrapper">
                <span class="wrap_tit" style="height: 0.2rem"></span>
                <span>
                                <div class="wrap_con">
                                    <p class="color_666">延期支付说明：</p>
                                    <p class="color_999"><span >账期：</span>提交订单后{{paymentData.delayMarkLisr[0].apTempItemList[0].payInterval}}天</p>
                                  <!--  <p class="color_999">
                                      <span>手续费：</span>
                                      <template v-if="paymentData.delayMarkLisr[0].apFeeFlag==1">
                                          {{paymentData.delayMarkLisr[0].apFee}}
                                          <template v-if="paymentData.delayMarkLisr[0].apFeeUnit==1">%</template>
                                          <template v-else>元</template>
                                      </template>
                                      <template v-else>无</template>
                                  </p>-->
                                  <!--<p class="color_999"><span>逾期还款手续费：</span>
                                        <template v-if="paymentData.delayMarkLisr[0].apOverdueFeeFlag==1">{{paymentData.delayMarkLisr[0].apOverdueFee}}
                                           <template v-if="paymentData.delayMarkLisr[0].apOverdueFeeUnit==1">%</template>
                                           <template v-else>元</template>
                                           <template v-if="paymentData.delayMarkLisr[0].apOverdueFeeType==1">/期</template>
                                           <template v-else>/天</template>
                                       </template>
                                      <template v-else>无</template>
                                  </p>-->
                                 </div>
                            </span>

              </div>
            </template>
            <!--延期详情展示end-->
            <!--定金支付详情展示start-->
            <template  v-if="payType==3 && skuId &&　paymentData.depositMark　&&　paymentData.depositMarkLisr.length>0">
              <div class="wrap_wrapper">
                <span class="wrap_tit" style="height: 0.2rem"></span>
                <span>
                                <div class="wrap_con">
                                        <p>定金金额：<span class="redWord">￥{{paymentData.depositMarkLisr[0].apTempItemList[0].payAmt}}</span></p>
                                        <p><span class="color_999">定金支付时间：</span>提交订单后{{paymentData.depositMarkLisr[0].apTempItemList[0].payInterval}}天之内</p>
                                        <p><span class="color_999">尾款支付时间：</span>定金支付后{{paymentData.depositMarkLisr[0].apTempItemList[1].payInterval}}天之内</p>
                                        <p class="color_e60012">如未按时支付尾款，定金恕不退还</p>
                                 </div>
                            </span>

              </div>
            </template>
            <!--定金支付详情展示end-->
          </div>

        </div>
        <template v-if="(product.item.hasPrice == 1 || skuInfo.hasPrice) && product.item.itemStatus == 4">
          <template v-if="product.item.attrTempalte==2">  <!--板材商品-->
            <input class="win_jiaRu" type="button" value="加入购物车" @click="addCart_unNormal(2)"/>
            <!--这里传的数字用来准备加入购物车的参数 itemBuyType '商品购买类型：1=普通商品、2=板材类商品、3=橡皮布商品、4=套餐商品'-->
          </template>
          <template v-else-if="product.item.attrTempalte==3">  <!--橡皮布商品-->
            <input class="win_jiaRu" type="button" value="加入购物车" @click="addCart_unNormal(3)"/>
          </template>
          <template v-else>
            <input class="win_jiaRu" type="button" value="加入购物车" @click="addCart()"/>
          </template>
        </template>
        <template v-else-if="product.item.itemStatus != 4">
          <input class="win_jiaRu win_nosale" type="button" value="商品非在售" onclick="printAlert('商品非在售,无法购买!')"/>
        </template>
        <template v-else-if="!skuInfo.hasPrice || skuInfo.skuPrice == ''">
          <input class="win_jiaRu win_xunJia" type="button" value="欢迎询价" @click="inquiry"/>
        </template>
      </div>

    </div>
    <!--促销活动弹框-->
    <div class="win_Promotion">
      <div class="prop_bg"></div>
      <div class="promotionCon_wrap">
        <div class="promotion_con">
          <p class="pro_tit">促销活动</p>

          <div class="pro_chahaoWrap">
            <img class="pro_chahao" src="../../assets/img/win_chahao.png" alt=""/>
          </div>


          <template v-if="promotion.promotionFullReduction!='' || promotion.promotionMarkdown!='' ">

            <template v-if="promotion.promotionFullReduction!=''">
              <p class="pro_tit1">满减活动</p>
              <template v-for="promotionFullReduction in promotion.promotionFullReduction">
                <p class="promotion_option">
                  满 <!--{{promotionFullReduction.activityName}}-->￥{{promotionFullReduction.meetPrice}}
                  减 ￥{{promotionFullReduction.discountPrice}} </p>
              </template>

            </template>

            <template v-if="promotion.promotionMarkdown!='' && type == 'spu'" >
              <p class="pro_tit1">直降活动</p>
              <template v-for="promotionMarkdown in promotion.promotionMarkdown">
                <!--{{promotionMarkdown.activityName}}-->
                <p class="promotion_option">
                  <template  v-if="promotionMarkdown.markdown.markdownType == 1">
                    {{promotionMarkdown.markdown.discountPercent*10 | toDecimal2}} 折优惠
                  </template>
                  <template v-else>
                    直降 ￥{{promotionMarkdown.markdown.promotionPrice |toDecimal2}}
                  </template>
                </p>
              </template>

            </template>

          </template>



          <div class="promotion_main">
            <div class="quan_wrap">
              <template v-if="couponsDTOs != ''">
                <p class="lingqu_tit">领取优惠券</p>
                <template v-for="coupon  in couponsDTOs">
                  <div>
                    <!--<div :class="getCouponType(coupon.couponType)">-->
                    <div :class="getCouponType(coupon)">
                      <div class="content" @click="coupon.isGet == 'true'?'' : getCoupons(coupon)">
                        <div :class=" coupon.JJGuoqi == 'true' ? 'zhuangtai':''"></div>
                        <p class="jine">
                          <template v-if="coupon.couponType == '1'">
                            ¥<span>{{coupon.couponAmount}}</span>
                          </template>
                          <template v-if="coupon.couponType == '2'">
                            <span>{{coupon.couponAmount}}</span>折
                          </template>
                          <template v-if="coupon.couponType == '3'">
                            ¥<span>{{coupon.couponAmount}}</span>
                          </template>
                        </p>

                        <p class="mingcheng">{{coupon.couponName}}</p>

                        <p class="riqi">至<span>{{coupon.couponEndTime | timestampFormat('YYYY.MM.DD')}}</span>截止</p>

                        <p class="shuliang">限领<span>{{coupon.allowGetNum}}</span>张</p>


                        <p class="qian">
                          <template v-if="coupon.couponType == '1'">
                            满{{coupon.meetPrice}}元可用
                          </template>
                          <template v-if="coupon.couponType == '2'">
                            最高抵扣{{coupon.couponMax}}元
                          </template>
                          <template v-if="coupon.couponType == '3'">
                            无门槛
                          </template>
                        </p>
                        <!--是否过期、领取、领完-->
                        <template v-if="coupon.state == '2' || coupon.state == '3'">
                          <img src="../../assets/img/yiguoqi@3x.png" alt="" id="yiguoqi"/>
                        </template>
                        <template v-else-if="coupon.isGet=='true'">
                          <img src="../../assets/img/yilingqu@3x.png" alt="" style="display: block;" class="yilingqu"/>
                        </template>
                        <template v-else-if="coupon.state=='7'">
                          <img src="../../assets/img/yilingwan@3x.png" alt="" id="yilingwan"/>
                        </template>
                      </div>
                      <div class="leibie">
                        <div  @click="getCouponDetail(coupon.couponId)">
                          <template v-if="coupon.couponUsingRange == '1'">
                            平台通用类
                          </template>
                          <template v-if="coupon.couponUsingRange == '2'">
                            店铺通用类
                          </template>
                          <template v-if="coupon.couponUsingRange == '3'">
                            品类通用类
                          </template>
                          <template v-if="coupon.couponUsingRange == '4'">
                            指定商品类
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

              </template>
            </div>


            <section v-show="couponDetailDialog">
              <div :class="getCouponDetailClass(couponDetail.couponInfo.couponUsingRange) ">
                <template v-if="couponDetail.couponInfo.couponUsingRange == 1">
                  <div class="pingtai">
                    <h3>平台通用类优惠券</h3>
                    <p>此优惠券全平台所有商品均可使用</p>
                    <span id="close"></span>
                  </div>
                </template>
              </div>
              <template v-if="couponDetail.couponInfo.couponUsingRange != 1">
                <div class="dianpu" id="dianpu">
                  <h3>
                    <template v-if="couponDetail.couponInfo.couponUsingRange == '2'">
                      适用店铺
                    </template>
                    <template v-if="couponDetail.couponInfo.couponUsingRange == '3'">
                      适用分类
                    </template>
                    <template v-if="couponDetail.couponInfo.couponUsingRange == '4'">
                      适用商品
                    </template>
                  </h3>

                  <div class="liebiao">
                    <template v-if="couponDetail.couponInfo.couponUsingRange == '2'">
                      <template v-for="(key,value) in couponDetail.pager.records">
                        <h3 class="title" @click="gotoShopIndex(key)">{{key.itemName}}</h3>
                      </template>
                      <p>printhome.com</p>
                    </template>
                    <template v-if="couponDetail.couponInfo.couponUsingRange == '3'">
                      <div id="dianjiyu">
                        <template v-for="oneLevel in couponDetail.categoryes">
                          <template v-if="oneLevel.canShow">
                            <div class="pinLeiLieBiao">
                              <div class="kezi">
                                <p class="yiji yijibg">{{oneLevel.categoryCName}}</p>
                              </div>
                              <template v-for="twoLevel in oneLevel.children">
                                <template v-if="twoLevel.canShow">
                                  <div class="erji">
                                    <div class="sanji">
                                      <li class="sanji_top sanji_top_color">{{twoLevel.categoryCName}}（{{twoLevel.children.length}}）</li>
                                      <div class="sanji_bottom">
                                        <template v-for="threeLevel in twoLevel.children">
                                          <a href="javascript:;">{{threeLevel.categoryCName}}</a>
                                        </template>
                                      </div>
                                    </div>
                                  </div>
                                </template>
                              </template>
                            </div>
                          </template>
                        </template>
                      </div>
                      <p>printhome.com</p>
                    </template>
                    <template v-if="couponDetail.couponInfo.couponUsingRange == '4'">
                      <h3 class="title">商品列表</h3>
                      <ul>
                        <template v-for="(key,value) in couponDetail.pager.records">
                          <li><a href="javascript:;" @click="gotoProductDetail(key.itemId,key.skuId)">{{key.itemName}}</a></li>
                        </template>

                      </ul>
                      <p>printhome.com</p>
                    </template>
                  </div>
                  <a href="javascript:void(0);"  @click="couponDetailDialog=!couponDetailDialog"  class="guanbi">关闭</a>
                </div>
              </template>
            </section>



          </div>
        </div>
        <input class="win_wancheng" type="button" value="完成"/>
      </div>
    </div>
    <!--广告语弹窗-->
    <div class="win_ad">
      <div class="prop_bg"></div>
      <div class="promotionCon_wrap">
        <div class="promotion_con">
          <p class="pro_tit">详情</p>
          <div class="pro_chahaoWrap"><img src="../../assets/img/win_chahao.png" alt="" class="pro_chahao"></div>
          <div class="promotion_main">
            <div class="quan_wrap" style="padding: 0.2rem;">
              <p style="margin-bottom:0.2rem;">{{product.item.adContent}}</p>
              <template v-if="product.itemAd!=null ">
                <template v-if="product.itemAd.isStart">
                  <div style="color:#FF0000;">距活动结束还剩:
                    <span id="" countdown="true"
                          :servertime='product.itemAd.serverTime'
                          :starttime="product.itemAd.serverTime" nostarttip="未开始"
                          :endtime="product.itemAd.adEndTime" endtip="已结束">
							</span>
                  </div>
                </template>
                <template v-else>
                  <div style="color:#FF0000;">距活动开始还剩:
                    <span id="" countdown="true"
                          :servertime="product.itemAd.serverTime"
                          :starttime="product.itemAd.serverTime" nostarttip="未开始"
                          :endtime="product.itemAd.adStartTime" endtip="已开始">
							</span>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
        <input class="win_jiaRu win_xunJia" type="button" value="完成"/>
      </div>
    </div>
    <!--询价留言框-->
    <div class="xunJia_dio_wrap">
      <div class="prop_bg"></div>
      <div class="xunJia_dio_wrapper">
        <img class="xunJia_cha" src="../../assets/img/cha.png" alt=""/>
        <p class="zixun_tit">咨 询 价 格</p>

        <div class="buhong"></div>
        <div class="con_wrap">
          <p class="zixun_msg">请填写询价信息，以便店家回复</p>

          <div><span class="redWord">*</span>我的邮箱：<input type="text" maxlength="20" v-model="queryInfo.email"/></div>
          <div><span class="redWord">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*</span>手机：<input type="tel" maxlength="11" v-model="queryInfo.cellphone"/></div>
          <div><span class="redWord">*</span>采购数量：<input type="text" v-model="queryInfo.qty" @keyup="numInputForLengthForVue($event,7,getItemUnitByWS(skuId),queryInfo,'qty');"/></div>
          <div><span class="caigou">&nbsp;&nbsp;采购说明：</span><textarea placeholder="不能超过300字" maxlength="300"  name="caigou" id="caigou" cols="30" rows="10" v-model="queryInfo.comment"></textarea></div>
          <div class="btn_wrap">
            <span class="xunJia_quxiao">取 消</span>
            <span class="xunJia_queding" @click="commitXunjia()">提 交</span>
          </div>
        </div>
      </div>
    </div>
    <!--买家评论图片弹窗-->
    <div class="pinglun_img_tanChuang">
      <div style="height: 7rem;width: 5rem;margin: 2rem auto;position: relative">
        <img style="width: 100%" v-bind:src="amplifiedPicUrl" alt=""/>
        <img style="height: 0.4rem;width: 0.4rem;position: absolute;right: -0.2rem;top:  -0.2rem" src="../../assets/img/cha.png" alt=""/>
      </div>
    </div>
    <!--回到顶部-->
    <div id="top" @click="goToTop"></div>
  </div>
</template>



<script type="text/ecmascript-6">
  import productDetail from "./productDetail"

  export default {
    name: 'productDetail',
    mixins:[productDetail],
    data () {
      return{

      }
    },
    methods:{

    },
    mounted: function () {

    },
  }
</script>


<style scoped>
  @import "../../assets/css/13_shangPinXiangQing/shangPinYe.css";
</style>

<style>
  body{
    background: #fff;
    font-size: 0.24rem;
  }
</style>
