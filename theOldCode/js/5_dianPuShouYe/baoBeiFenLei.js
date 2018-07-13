function initJqueryCase(){
    $(".list").click(function () {
        $(this).siblings().css("color", "#666666").children(".list_wrapper").css("border-left", "0.1rem solid #ffffff").find("img").attr("src", "../../img/xiala.png");
        $(this).siblings().children(".hidden_con").css("display", "none");
        if ($(this).children(".hidden_con").css("display")=="none") {
            $(this).css("color", "#e60012").children(".list_wrapper").css("border-left", "0.1rem solid #e60012").find("img").attr("src", "../../img/xiangshang.png");
            $(this).children(".hidden_con").css("display", "block");
        } else {
            $(this).css("color", "#666666").children(".list_wrapper").css("border-left", "0.1rem solid #ffffff").find("img").attr("src", "../../img/xiala.png");
            $(this).children(".hidden_con").css("display", "none");
        }

    });
}