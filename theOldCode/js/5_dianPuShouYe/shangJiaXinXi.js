function initjQueryClick() {
    //$(".shoucang").click(function () {
    //    if (this.src.indexOf("star_red.png") == -1) {
    //        $(this).attr("src", "../../img/star_red.png");
    //        popUp_auto(1500,"您已收藏该店铺");
    //    } else {
    //        $(this).attr("src", "../../img/shoucang.png");
    //        popUp_auto(1500,"取消收藏该店铺");
    //    }
    //});
/*$(".renzheng").click(function() {
 $(".renzheng_tanChuang").css("display", "block");
 });*/

    $(".zhizhao").click(function() {
        $(".zhizhao_tanChuang").css("display", "block");
    });
    $(".renzheng_tanChuang,.zhizhao_tanChuang").click(function () {
        $(this).css("display", "none")
    });
}

