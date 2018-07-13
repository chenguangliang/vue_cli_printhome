/**
 * Created by admin on 2017/7/3.
 */
function mountJQueryEvent() {


//第二部的选择其他出来隐藏input
    $("#pinlei").change(function () {
        if (this.value == "other") {
            $("#pinlei1,#pinlei2").hide();
            $(".otherClass").show();//其他品类显示
            $("#pinpai").val('other').attr('disabled',true);//品牌锁定为其他
            $(".otherBrand").show();
        } else {
            $("#pinlei1,#pinlei2").show();
            $(".otherClass").hide();
            $("#pinpai").val(0).attr('disabled',false);
            $(".otherBrand").hide();
        }
    });
    $("#pinpai").change(function () {
        if (this.value == "other") {
            $(".otherBrand").show();
        } else {
            $(".otherBrand").hide();

        }
    });
    $("#danwei").change(function () {
        if (this.value == "other") {
            $(".otherUnit").show();
        } else {
            $(".otherUnit").hide();
        }
    });
    $("#guige").change(function () {
        if (this.value == "other") {
            $(".otherSpeci").show();
        } else {
            $(".otherSpeci").hide();
        }
    });

//图标选中
    $('.redRoundBtn').click(function () {
        $(this).attr("src", "../../img/yes-select.png");
        $(this).siblings('img').attr("src", "../../img/no-select.png")

    });
//需要审核
    $(".needCheck").click(function () {
        $(".otherchecker").show();
    });
    $(".noNeedCheck").click(function () {
        $(".otherchecker").hide();
    });
}