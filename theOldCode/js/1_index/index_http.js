$(function(){
    popUp_open();//启动加载条
    setTimeout(function () {
        //  banner start
        //getBannerList();//加载banner数据
        //bannerdh();//加载banner动画
        //// banner end
        //
        //// adver start
        //getAdvertisesList();//加载热销广告位
        //// adver end
        //
        //// Week start
        //getWeekAdesList();//加载本周推荐
        //// Week end
        //// theme start
        //getThemeAdesList();
        //// theme end
        //
        //// floors start
        //getFloorsList();//获取楼层商品
        //// floors end
        //
        //// catgory start
        //// getCategoryList();//获取类目集合
        //// catgory end
        popUp_close();
        auto();
    }, 300);

})
/**
 * 获取类目集合
 */
function getCategoryList(){
    var url=re_url+"/getItemListMap";
    var success=function(data){
        if(flag_status(data)){
            $.each(data.data, function(k, v) {
                var banner_imgUrl=img_url+v.bannerUrl;
                var banner_link=v.bannerLink;
                var banner_title=v.title;
                var htmljs='<li style="float: left"><a class="pic" href=\"'+banner_link+'\"><img src=\"'+banner_imgUrl+'\" /></a></li>';
                $.addHtml("#bannerList",htmljs);
            });


        }else{
            msg(data);
        }
    }
    $.syncGetJson(getUrl("getItemListMap"),success);

}

/**
 * 获取banner列表
 */
function getBannerList(){


    var success=function(data){
        if(flag_status(data)){
            $("#bannerList").empty();
            $.each(data.data, function(k, v) {
                var banner_imgUrl=img_url+v.bannerUrl;
                var banner_link=v.bannerLink;
                var banner_title=v.title;
                var htmljs='<li style="float: left"><a class="pic" href=\"'+banner_link+'\"><img src=\"'+banner_imgUrl+'\" /></a></li>';
                $.addHtml("#bannerList",htmljs);
            });

        }else{
            msg(data);
        }
    }
    $.syncGetJson(getUrl("getBannersMap"),success);
}

/**
 * 获取热销广告列表
 **/
function getAdvertisesList(){
    var success=function(data){
        if(flag_status(data)){
            $(".ul01").empty();
            $(".ul02").empty();
            $.each(data.data, function(k, v) {
                var ad_img=img_url+v.adSrc;
                var ad_link=v.adURL;
                var ad_title=v.title;
                var htmljs='<li><a href=\"'+ad_link+'\"><img src=\"'+ad_img+'\" alt=""/></a></li>';
                if(k < 3){
                    $.addHtml(".ul01",htmljs);
                }else{
                    $.addHtml(".ul02",htmljs);
                }
            })
        }else{
            msg(data);
        }
    }
    $.syncGetJson(getUrl("getAdvertisesMap"),success);
}
/**
 * 获取本周推荐
 */
function getWeekAdesList(){
    var success=function(data){
        if(flag_status(data)){
            $("#left .list ul").empty();
            $.each(data.data, function(k, v) {
                var we_img=img_url+v.adSrc;
                var we_link=v.adURL;
                var we_title=v.title;
                var htmljs='<li><a href=\"'+we_link+'\"><img src=\"'+we_img+'\" alt="'+we_title+'"/></a></li>';
                $.addHtml("#left .list ul",htmljs);
            })
        }else{
            msg(data);
        }
    }
    $.syncGetJson(getUrl("getWeekAdesMap"),success);

}

/**
 * 获取主题推荐
 */
function getThemeAdesList(){
    var success=function(data){
        if(flag_status(data)){
            $("#right .list ul").empty();
            $.each(data.data, function(k, v) {
                var we_img=img_url+v.adSrc;
                var we_link=v.adURL;
                var we_title=v.title;
                var htmljs='<li><a href=\"'+we_link+'\"><img src=\"'+we_img+'\" alt="'+we_title+'"/></a></li>';
                $.addHtml("#right .list ul",htmljs);
            })
        }else{
            msg(data);

        }
    }
    $.syncGetJson(getUrl("getThemeAdesMap"),success);
}
/**
 * 获取所有楼层
 */
function getFloorsList() {
    var success=function(data){
        if(flag_status(data)){
            $("#louceng").empty();
            $.each(data.data, function(k, v) {
                var fid=v.idDTO;
                var floorcount=v.floorNumDTO;
                getFloorsItem(fid,floorcount);
                // setInterval(, 1000);
            })
            // getFloorsItem(1,1);
        }else{
            msg(data);
        }
    }
    $.syncGetJson(getUrl("getFloorsMap"),success);
}

/**
 * 获取楼层商品
 * @param fid
 * @param floorcount
 */
function getFloorsItem(fid,floorcount){
    var data={fid:fid,floorcount:floorcount};
    var success=function(data){
        if(flag_status(data)){
            var re_data=data.data.floor;//json对象
            if(re_data.goods.length > 0){


                var re_name=re_data.titleDTO;//楼层名称
                var htmljs='<section>';
                // //头部列表
                // $.each(re_data.topBunner, function(k, v) {
                //     var f_img=img_url+v.picSrc;
                //     var f_name=v.recName;
                //     var f_title=v.title;
                //     var f_url=v.url;
                //     htmljs+=htmljs+'<div class="louding"><a href="javascript:;"><img src="img/louding.png" alt=""/></a></div>';
                // });
                htmljs=htmljs+'<div class="name">'+re_name+'</div><div class="louceng">';
                //商品列表
                $.each(re_data.goods, function(k, v) {
                    var f_img=img_url+v.picSrc;
                    var f_name=v.recName;
                    var f_title=v.title;
                    var f_url=v.url;
                    var f_price=v.guidePriceForShow;
                    if(k <3){
                        //左上
                        if(k == 0){
                            htmljs=htmljs+'<div class="l">';
                            htmljs=htmljs+'<div class="first"><a href=\"'+f_url+'\"><img src=\"'+f_img+'\" alt="'+f_title+'"/></a></div>';
                        }else{
                            htmljs=htmljs+'<div class="sec"><a href=\"'+f_url+'\" class="pic"><img src=\"'+f_img+'\" alt="'+f_title+'"/></a><a href=\"'+f_url+'\" class="tit">'+f_name+'</a><strong> ¥'+f_price+'</strong></div>';
                        }
                        if(k==2){
                            htmljs=htmljs+'</div>';
                        }
                    }else if(k >2 && k<7){
                        //右上
                        if(k == 3){
                            htmljs=htmljs+'<div class="r">';
                            htmljs=htmljs+'<div class="thr"><div class="l"><a href=\"'+f_url+'\" class="tit tit2">'+f_name+'</a><strong>¥'+f_price+'</strong></div><div class="r"><a href=\"'+f_url+'\" class="pic"><img src=\"'+f_img+'\" alt="'+f_title+'"/></a></div></div>';
                        }else if(k == 4){
                            htmljs=htmljs+'<div class="thr"><div class="l"><a href=\"'+f_url+'\" class="pic"><img src=\"'+f_img+'\" alt="'+f_title+'"/></a></div><div class="r"><a href=\"'+f_url+'\" class="tit tit2">'+f_name+'</a><strong>￥'+f_price+'</strong></div></div>';
                        }else if(k == 5){
                            htmljs=htmljs+'<div class="thr"><div class="l"><a href=\"'+f_url+'\" class="tit tit2">'+f_name+'</a><strong>¥'+f_price+'</strong></div><div class="r"><a href=\"'+f_url+'\" class="pic"><img src=\"'+f_img+'\" alt="'+f_title+'"/></a></div></div>';
                        }else if(k == 6){
                            htmljs=htmljs+'<div class="thr"><div class="l"><a href=\"'+f_url+'\" class="pic"><img src=\"'+f_img+'\" alt="'+f_title+'"/></a></div><div class="r"><a href=\"'+f_url+'\" class="tit tit2">'+f_name+'</a><strong>￥'+f_price+'</strong></div></div>';
                            htmljs=htmljs+'</div>';
                        }
                    }else{
                        //下
                        if(k == 7){
                            htmljs=htmljs+'<div class="down">';
                        }
                        htmljs=htmljs+'<div class="left"><div class="l"><a href=\"'+f_url+'\" class="tit tit3">'+f_name+'</a><strong>¥'+f_price+'</strong></div><div class="r"><a href=\"'+f_url+'\" class="pic"><img src=\"'+f_img+'\" alt="'+f_title+'"/></a></div></div>';
                        if(k+1 == re_data.goods.length){
                            htmljs=htmljs+'</div>';
                        }
                    }

                });
                //底部列表
                $.each(re_data.btmBunner, function(k, v) {
                    var f_img=img_url+v.picSrc;
                    var f_name=v.recName;
                    var f_title=v.title;
                    var f_url=v.url;
                    if(k == 0){
                        htmljs=htmljs+'<div class="img-list img-scroll"><div class="img_list1"><ul>';
                    }
                    htmljs=htmljs+'<li><a href=\"'+f_url+'\"><img src=\"'+f_img+'\" alt="'+f_title+'"/></a></li>';
                    if(k+1 == re_data.btmBunner.length){
                        htmljs=htmljs+'</ul></div><span class=" prev"></span><span class=" next"></span></div>';
                    }
                });
                htmljs=htmljs+"</div></section>";
                $.addHtml("#louceng",htmljs);
            }
        }else{
            msg(data);
        }
    }
    $.syncPost(getUrl("home/eachFloorMap"),data,success);
}

