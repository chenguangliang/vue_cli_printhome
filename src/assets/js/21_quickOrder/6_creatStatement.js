//全选逻辑
function mountJQueryEvent() {

   /* var totalImgBtn = $(".oneOrderBtn").length;
    console.log(totalImgBtn);
    var flag = 0;
    $(".oneOrderBtn").click(function () {
        if ($(this).attr('src').indexOf('yes') == -1) {
            flag += 1;
            console.log(flag);
            $(this).attr('src', '../../img/yes-select.png');
            if (flag == totalImgBtn) {
                console.log(flag,totalImgBtn);
                $(".selAll").attr('src', '../../img/yes-select.png');
            }
        } else {
            flag -= 1;
            $(this).attr('src', '../../img/no-select.png');
            $(".selAll").attr('src', '../../img/no-select.png');
        }
    });
    $(".selAll").click(function () {
        if ($(this).attr('src').indexOf('yes') == -1) {
            $(this).attr('src', '../../img/yes-select.png');
            $(".oneOrderBtn").attr('src', '../../img/yes-select.png');
            flag = totalImgBtn;
        } else {
            $(this).attr('src', '../../img/no-select.png');
            $(".oneOrderBtn").attr('src', '../../img/no-select.png');
            flag = 0;
        }
    });*/


//显示搜索
    $(".searchBtn").click(function () {
        $(".orderSearch").show();
    });
    $(".orderSearch .fanHui,.orderSearch .searchNow").click(function () {
        $(".orderSearch").hide();

    });

//搜索里的全选逻辑
//全选逻辑
    var totalImgBtn1 = $(".checkBtn").length;
    var flag1 = 0;
    $(".checkBtn").click(function () {
        if ($(this).attr('src').indexOf('selBtn') == -1) {
            flag1 += 1;
            $(this).attr('src', '../../img/quickOrder/fang_selBtn.png');
            if (flag1 == totalImgBtn1) {
                $(".allSel").attr('src', '../../img/quickOrder/fang_selBtn.png');
            }
        } else {
            flag1 -= 1;
            $(this).attr('src', '../../img/quickOrder/fang_defaultBtn.png');
            $(".allSel").attr('src', '../../img/quickOrder/fang_defaultBtn.png');
        }
    });
    $(".allSel").click(function () {
        if ($(this).attr('src').indexOf('fang_selBtn') == -1) {
            $(this).attr('src', '../../img/quickOrder/fang_selBtn.png');
            $(".checkBtn").attr('src', '../../img/quickOrder/fang_selBtn.png');
            flag1 = totalImgBtn1;
        } else {
            $(this).attr('src', '../../img/quickOrder/fang_defaultBtn.png');
            $(".checkBtn").attr('src', '../../img/quickOrder/fang_defaultBtn.png');
            flag1 = 0;
        }
    });

}
































