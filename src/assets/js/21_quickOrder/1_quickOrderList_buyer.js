function mountJQueryEvent() {
    var page= 1;
    var i = 5;
    //向右滚动
    $(".arrow-right").click(function(){ //点击事件
        var v_wrap = $(this).parents(".scroll"); // 根据当前点击的元素获取到父元素
        var v_show = v_wrap.find(".scroll_list"); //找到展示的区域
        var v_cont = v_wrap.find(".box"); //找到展示区域的外围区域

        var v_width = v_cont.width();
        var len = v_show.find("li").length; //我的图片个数
        var page_count = Math.ceil(len/i); //只要不是整数，就往大的方向取最小的整数

        if(!v_show.is(":animated")){
            if($(".scroll_list").attr('goleft')){
                v_show.animate({left:'0px'},"slow");
                $(".scroll_list").removeAttr('goleft');
                return;
            }
            if(page == page_count ){
                v_show.animate({left:'0px'},"slow");
                page =1;
                //$(this).css("transform","rotate(0deg)");
            }else{
                v_show.animate({left:'-='+v_width},"slow");
                page++;
                //$(this).css("transform","rotate(180deg)");
            }
        }

    });
    $('.scroll li').click(function () {
        $('.scroll li').removeClass("on");
        $(this).addClass('on');
        // myScroll.refresh();
        // $(".tab_box").css("transform","translate(0px, -38px)");
    });
    //密码明暗文切换
    $('.see').click(function(){
        if($(this).hasClass('img01')){
            $(this).removeClass('img01').addClass('img02');
            $(this).prev().attr('type','text');
        }else{
            $(this).removeClass('img02').addClass('img01');
            $(this).prev().attr('type','password');
        }
    });
    //取消订单的弹窗
    // $('.delOrder .queDing,.delOrder .liuZhe').click(function(){
    //     $('.delOrder').hide();
    // });
//    cgl为快速订单加的
  /*  $(".dianPu").click(function () {
        if($(this).children("img").length){
            if($(this).siblings(".childOrders").css("display")=="none"){
                $(this).children("img").css("transform","rotateX(180deg)");
            }else {
                $(this).children("img").css("transform","rotateX(0deg)");
            }
            $(this).siblings(".childOrders").slideToggle();
        }
    });*/
    $(".searchBtn").click(function () {
        $(".orderSearch").show();
    });
    $(".fanHui").click(function () {
        $(".orderSearch").hide();
    });
    //搜索订单，订单状态里的全选
    //全选逻辑
    var totalImgBtn=$(".checkBtn").length;
    var flag=0;
    $(".checkBtn").click(function () {
        if($(this).attr('src').indexOf('selBtn')==-1){
            flag+=1;
            $(this).attr('src','../../img/quickOrder/fang_selBtn.png');
            if(flag==totalImgBtn){
                $(".allSel").attr('src','../../img/quickOrder/fang_selBtn.png');
            }
        }else {
            flag-=1;
            $(this).attr('src','../../img/quickOrder/fang_defaultBtn.png');
            $(".allSel").attr('src','../../img/quickOrder/fang_defaultBtn.png');
        }
    });
    $(".allSel").click(function () {
        if($(this).attr('src').indexOf('fang_selBtn')==-1){
            $(this).attr('src','../../img/quickOrder/fang_selBtn.png');
            $(".checkBtn").attr('src','../../img/quickOrder/fang_selBtn.png');
            flag=totalImgBtn;
        }else {
            $(this).attr('src','../../img/quickOrder/fang_defaultBtn.png');
            $(".checkBtn").attr('src','../../img/quickOrder/fang_defaultBtn.png');
            flag=0;
        }
    });
    //确认收到货，receiveCanle
    $(".receiveCanle").click(function () {
        $("#confirm_receipt_notice").hide();
    })
}
