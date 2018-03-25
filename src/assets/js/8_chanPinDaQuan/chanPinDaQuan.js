function initJqueryCase() {

    $(".search_box").focus(function () {
        $(".chahao").css({"opacity": 1})
    });
    $(".search_box").blur(function () {
        $(".chahao").css({"opacity": 0})
    });

    $(".chahao").click(function () {
        $(this).parents().siblings(".search_box").val(" ");
    });


    $(".toggle_img").click(function () {
        if (this.src.indexOf("suoluetu-@3x.png") == "-1") {
            this.src = "../../img/suoluetu-@3x.png";
            $(".suolue_result").children(".suolue_goods").show();
            $(".list_result").children(".list_goods").hide();
        } else {
            this.src = "../../img/liebiao@3x.png";
            $(".suolue_result").children(".suolue_goods").hide();
            $(".list_result").children(".list_goods").show();
        }
        myScroll.refresh();
        $(".tab_box").css("transform","translate(0px, -39px)");
    });


    $(".suoluegoods_price").click(function () {
        $(this).siblings(".suoluefloot_ship").animate({"left": 0}, 100);
    });


    $(".listfloot_ship").click(function (e) {
        e.preventDefault();
    });
    $(".listgoods_price").click(function (e) {
        $(this).parent().siblings(".listfloot_ship").animate({"left": "1.6rem"}, 100);

    });



    /*testAuto('.suoluegoods_name', 22);
    testAuto('.listgoods_name', 26);
    testAuto('.result_product_name', 49);
    testAuto('.shop_title', 26);*/


    $(".goShop").click(function () {
        $(".goShop").css({"background": "#ffffff", "color": "#e60012"});
        $(this).css({"background": "#e60012", "color": "#ffffff"})
    });

    /*一级类目点击效果*/

    $(".one_button").click(function(){
        if($(".onefold_nav").is(":hidden")){
            $(".onefold_nav").slideDown("fast");
            $(".twofold_nav,.threefold_nav").slideUp("fast");
        }else{
            $(".onefold_nav").slideUp("fast");
        }
    });

    $(".two_button").click(function(){
        if($(".twofold_nav").is(":hidden")){
            $(".twofold_nav").slideDown("fast");
            $(".onefold_nav,.threefold_nav").slideUp("fast");
        }else{
            $(".twofold_nav").slideUp("fast");
        }
    });

    $(".three_button").click(function(){
        if($(".threefold_nav").is(":hidden")){
            $(".threefold_nav").slideDown("fast");
            $(".twofold_nav,.onefold_nav").slideUp("fast");
        }else{
            $(".threefold_nav").slideUp("fast");
        }
    });


}



























