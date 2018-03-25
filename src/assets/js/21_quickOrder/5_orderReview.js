/**
 * Created by admin on 2017/6/30.
 */
function mountJQueryEvent() {

//点击搜索按钮
    $(".searchBtn").click(function () {
        $(".orderSearch").show();
    });
    $(".fanHui").click(function () {
        $(".orderSearch").hide();
    });

//切换顶部tab
    $(".fixHead p ").click(function () {
        $(this).addClass('redWord').siblings().removeClass('redWord');
        if ($(this).index() == 2) {
            $(".checkStateWrap").show();
            $(".alterableDiv").css('height', '2.28rem');
        } else {
            $(".checkStateWrap").hide();
            $(".alterableDiv").css('height', '1.68rem');
            $(".checkStateWrap p").eq(0).addClass('redWord').siblings().removeClass('redWord');
        }
    });
    $(".checkStateWrap p").click(function () {
        $(this).addClass('redWord').siblings().removeClass('redWord');
    });

//close 拒绝订单弹窗
    $(".refuseWin .close,.refuseWin .boottomBtn button").click(function () {
        $(".refuseWin").hide();

    });
}