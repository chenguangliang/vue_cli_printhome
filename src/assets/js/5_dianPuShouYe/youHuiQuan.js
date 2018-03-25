/*以下优惠券变底色*/
$(".manjianquan,.dazhe,.xianjin").click(function (e) {
    $(this).css({"background": 'url("../../img/yilingqu.png") no-repeat', "background-size": "100% 100%"})
        .children(".lingqu-btn").css({"color": "#b3b3b3 "});
    $(this).children().children(".youxiaoqi").css({"background-color": "#b3b3b3"});
    $(this).children(".zhang").css({"display": "block", "width": "0.7rem"})
});
/*以上优惠券变底色*/
