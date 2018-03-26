function searchList(type){
    var keyword=getval("#key");
    if(!isNotBlank(keyword)){
        return;
    }
    var queryType=getval("#search");
    if(queryType == "shop"){
        window.location.href="search_shop.html?keyword="+keyword+"&queryType="+queryType;
    }else{
        window.location.href="search_result.html?keyword="+keyword+"&queryType="+queryType;
    }
}
$(function(){
    var key = $.getUrlPara("key");
    var type = $.getUrlPara("type");
    if(key != undefined && key != ''){
        $("#key").val(key);
        $("#search").find("option[value='"+type+"']").attr("selected",true);
        if(getval("#typejs") == 2){
            if(type == 'goods'){
                getItemList();
            }else{

            }

        }
    }
})
function getItemList(){
    popUp_open();
    setTimeout(function () {
    var keyword=getval("#key");//查询关键字（必填）
    var page="1";//页数
    var orderSort="1";//排序1 修改时间升序2 修改时间降序(默认) 3 评分升序 4评分降序 5销量升序 6销量降序
    var brandId="";//品牌ID
    var cid="";//商品类目id
    var areaCode="";//区域编码
    var attributes="";//[属性ID:属性值ID;...] 此形式字符串
    var data={keyword:keyword,page:page,orderSort:orderSort,brandId:brandId,cid:cid,areaCode:areaCode,attributes:attributes};
    var success=function(data){
        if(flag_status(data)){
            var itemSkusList = data.data.itemSkus;
            var jsonArrayShop = data.data.jsonArrayShop;
            $(".suolue_result").empty();
            $(".list_result").empty();
            $.each(itemSkusList, function(k, v) {
                var brandName=v.brandName;
                var itemName=v.itemName;
                var shopId=v.shopId;
                var skuId=v.skuId;
                var sellerId=v.sellerId;
                var itemId=v.itemId;
                var hasPrice=v.hasPrice;
                var picUrl=getImgUrl(v.picUrl);
                var shop_name="";
                var allCount="0";
                var allSum="0";
                var shopArrival="0";
                var shopDescription="0"
                var shopReputation="0"
                var shopService="0";

                $.each(jsonArrayShop, function(k, v) {
                    // alert(v.shopId);
                    if(v.shopId == shopId){
                        shop_name=v.shopName;
                    }
                })
                var succ=function(msg){
                    if(flag_status(msg)){
                        allCount=msg.data.allc;
                        allSum=msg.data.allSum;
                        shopArrival=msg.data.shopArrival;
                        shopDescription=msg.data.shopDescription;
                        shopReputation=msg.data.shopReputation;
                        shopService=msg.data.shopService;
                    }else{
                        return;
                    }

                }
                $.syncPost(getUrl("product/getShopEvaluationMap"),{shopId:shopId},succ);
                //拼接正常列表
                var htmljs='  <div class="suolue_goods" style="display: inline-block"> <a href="http://www.baidu.com" style="display: inline-block"><img class="suoluegoods_img" src=\"'+picUrl+'\" alt="'+itemName+'"/>'
                    +'<p class="suoluegoods_name">'+itemName+'</p></a><p class="suoluegoods_price">￥'+hasPrice+' <img style="width: 0.3rem;float: right;margin-top: 0.15rem;" src="../../img/point.png" alt=""/></p>'
                    +'<div class="suoluefloot_ship"><p style="background-color: #f39700;"><span class="suoluecontact">收藏商品</span><span class="suoluegoods_car">收藏店铺</span></p>'
                    +'<div class="suolueship_wrapper">'
                    +'<p class="suolueshop_name">'+shop_name+'</p>'
                    +'<p class="suolue_detile">描述：<span class="red_word mr20">'+shopDescription+'</span>服务：<span class="red_word">'+shopService+'</span></p><p class="suolue_detile">物流：<span class="red_word mr20">'+shopArrival+'</span>态度：<span class="red_word">'+shopReputation+'</span>'
                    +'</p></div></div></div>';
                //<p style="margin-top: 0.1rem;"><span class="suolue_shoucang mr20">收藏商品</span><span class="suolue_shoucang">收藏店铺</span></p>

                //拼接缩略图列表
                var htmljsnone='<div class="list_goods" style="display: inline-block">'
                    +'<a href="http://www.baidu.com" style="display: inline-block"><img class="listgoods_img" src="'+picUrl+'\" alt="'+itemName+'"/></a><div class="title_wrapper">'
                    +'<a href="http://www.baidu.com" class="listgoods_name">'+itemName+'</a>'
                    +'<p class="listgoods_price red_word">￥'+hasPrice+' <img style="width: 0.3rem;float: right;margin-top: 0.15rem;" src="../../img/point.png" alt=""/></p></div>'
                    +'<div class="listfloot_ship"><div class="listship_wrapper">'
                    +'<p class="listshop_name">'+shop_name+'</p>'
                    +'<p class="list_detile">描述：<span class="red_word mr20">'+shopDescription+'</span>服务：<span class="red_word">'+shopService+'</span></p>'
                    +'<p class="list_detile">物流：<span class="red_word mr20">'+shopArrival+'</span>态度：<span class="red_word">'+shopReputation+'</span></p>'
                    // +'<p style="margin-top: 0.1rem;"><span class="list_shoucang mr20">收藏商品</span><span class="list_shoucang">收藏店铺</span></p>'
                    +'</div><span class="add_wrapper" style="background-color: #f39700;"><p class="listcontact">收藏<br/>商品</p><p class="listgoods_car">收藏<br/>店铺</p></span></div></div>';
                $.addHtml(".suolue_result",htmljs);
                $.addHtml(".list_result",htmljsnone);

            });

        }else{
            msg(data);
        }



        /*切换缩略图和列表图*/
        $(".toggle_img").click(function () {
            if (this.src.indexOf("suoluetu-@3x.png")=="-1") {
                this.src="../../img/liebiao@3x.png";
                $(".suolue_result").addClass("none");
                $(".list_result").removeClass("none")
            }else{
                this.src="../../img/suoluetu-@3x.png";
                $(".list_result").addClass("none");
                $(".suolue_result").removeClass("none")
            }
        });
        /*缩略图结果页*/
        /*左划*/
        $(".suolue_goods").on("touchstart", function (e) {

            var touchA = e.originalEvent.changedTouches[0].pageX;

            $(".suolue_goods").on("touchend", function (e) {
                var touchB = e.originalEvent.changedTouches[0].pageX;
                if (touchB < touchA) {
                    $(this).find(".suoluefloot_ship").animate({"left": 0}, 100);
                }
                else {
                    $(this).find(".suoluefloot_ship").stop(true).animate({"left": "3.1rem"}, 100);
                }
            })

        });
        $(".suoluegoods_price").click(function () {
            $(this).siblings(".suoluefloot_ship").animate({"left": 0}, 100);
        });

        /*列表图结果页*/
        /*左划*/
        $(".list_goods").on("touchstart", function (e) {

            var touchA = e.originalEvent.changedTouches[0].pageX;

            $(".list_goods").on("touchend", function (e) {
                var touchB = e.originalEvent.changedTouches[0].pageX;
                if (touchB < touchA) {
                    $(this).find(".listfloot_ship").animate({"left": "1.6rem"}, 100);
                }
                else {
                    $(this).find(".listfloot_ship").stop(true).animate({"left": "6.5rem"}, 100);
                }
            })

        });
        $(".listfloot_ship").click(function (e) {
            e.preventDefault();
        });
        $(".listgoods_price").click(function (e) {
            $(this).parent().siblings(".listfloot_ship").animate({"left": "1.6rem"}, 100);

        });

    }
    $.syncPost(getUrl("4_souSuoJieGuo/searchItemMap"),data,success);
    }, 300);
    popUp_close();


}