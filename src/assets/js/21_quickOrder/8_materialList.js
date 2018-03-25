/**
 * Created by admin on 2017/7/3.
 */
//显示搜索
function mountJQueryEvent() {
$(".searchBtn").click(function () {
    $(".orderSearch").show();
});
$(".orderSearch .fanHui,.orderSearch .searchNow").click(function () {
    $(".orderSearch").hide();

});
//选择其他品类
$(".oneCategory").change(function() {
    if(this.value=='other'){
        $(".willHide").hide();
        $(".hideCategory").show();
    }else {
        $(".willHide").show();
        $(".hideCategory").hide();
    }
});

//切换tab
$(".fixHead p").click(function () {
    $(this).addClass('redWord').siblings().removeClass('redWord');
});

//拒绝弹窗
$(".refuseBtn").click(function () {
    $(".materialRefuseWin").show();
});
$(".close,.materialRefuseWin .boottomBtn .cancel").click(function () {
    $(".materialRefuseWin").hide();
    $('.refuseWords').val('');
});
}












