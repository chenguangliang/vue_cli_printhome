
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
            $(".suolue_result").removeClass("none");
            $(".list_result").addClass("none")
        } else {
            this.src = "../../img/liebiao@3x.png";
            $(".list_result").removeClass("none");
            $(".suolue_result").addClass("none")
        }
    });

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



    testAuto('.suoluegoods_name', 22);
    testAuto('.listgoods_name', 26);
    testAuto('.result_product_name', 49);
    testAuto('.shop_title', 26);


    $(".goShop").click(function () {
        $(".goShop").css({"background": "#ffffff", "color": "#e60012"});
        $(this).css({"background": "#e60012", "color": "#ffffff"})
    });

    /*一级类目点击效果*/

    $(".one_button").click(function(){
        if($(".onelevel").is(":hidden")){
            $(".onelevel").slideDown("fast");
        }else{
            $(".onelevel").slideUp("fast");
        }
    });

    $(".two_button").click(function(){
        if($(".twolevel").is(":hidden")){
            $(".twolevel").slideDown("fast");
        }else{
            $(".twolevel").slideUp("fast");
        }
    });

    $(".three_button").click(function(){
        if($(".threelevel").is(":hidden")){
            $(".threelevel").slideDown("fast");
        }else{
            $(".threelevel").slideUp("fast");
        }
    });



/*点击全部显示原来效果*/
function showOneLevelButton(){
    $(".one_button + img").html("全部");
    $(".one_button + img").show();
    $(".onelevel").css({"display":"none"});
}

/*点击类目显示类目*/
function showOneCate(obj){
    $(".one_button").html($(obj).html());
    $(".one_button + img").hide();
    $(".onelevel").css({"display":"none"});
}



























