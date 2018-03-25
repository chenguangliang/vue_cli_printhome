//底部按钮点击变红
$(".foot a,.foot2 a,.foot3 a").click(function(){
    $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
});

//底部按钮点击取消弹出弹窗
$('.cancle').click(function () {
    $('.zhezhao').show();
});
//关闭弹窗
$('.quXiao,.queDing').click(function(){
    $('.zhezhao').hide();
});

//协议创建三个步骤切换方法
function divStyle(idname,isHide){
    if(isHide){
        document.getElementById(idname).style.display="none";
    }else{
        document.getElementById(idname).style.display="";
    }
}

//协议创建第一步点击到第二步
$('#div1 .next').click(function(){
    divStyle('div1',true);
    divStyle('div2',false);
});



//添加卖方
var a
$("#div4 .no-select").click(function(){
    if($(this).attr("src")=="../../img/no-select.png")
    {
        $(this).attr("src","../../img/yes-select.png");
        $(this).parent().parent().siblings().find('.no-select').attr("src","../../img/no-select.png");
        $(this).parent().parent().attr("data-choose","1");
        $(this).parent().parent().siblings().attr("data-choose","0");
        a=1;
    }
    else
    {
        $(this).attr("src","../../img/no-select.png");
        $(this).parent().parent().attr("data-choose","0");
        a=0;
    }
});

$('#div4 .maiFang-footer a:last-child').click(function(){
    if(
        a==1
    ){
        divStyle('div4',true);
        divStyle('div1',false);
        $(".shangPinLieBiao").each(function(){
            if($(this).attr("data-choose") == 1){
                $('.gongSi').children('input').val($(this).find(".maiFang p .right:eq(0)").text());
                $('.lianXiRen').children('input').val($(this).find(".maiFang p .right:eq(1)").text());
                $('.lianXiFangShi').children('input').val($(this).find(".maiFang p .right i:eq(0)").text());
                $('.dianZiYouXiang').children('input').val($(this).find(".maiFang p .right i:eq(1)").text());

            }
        });
    }
});

$('#div4 .maiFang-footer a:first-child').click(function(){
    divStyle('div4',true);
    divStyle('div1',false);
});




//协议创建第二步协议账期二选一
$('.days').click(function(){
    $(this).next().removeAttr("disabled");
    $(this).parent().next().children('.month ').attr("disabled","true");
});
$('.months').click(function(){
    $(this).next().removeAttr("disabled");
    $(this).parent().prev().children('.xieYiYouZhangQi').attr("disabled","true");
});



//获取物品信息
function addThing(name,nature,price,xieyi){
    //if(xieyi == '') return alert('请选择协议');
    var add = '';
    add = add + '<div class="wuPin">';
    add = add + '<p><span>商品名称：</span>';
    add = add + '<i>'+name+'</i>';
    add = add + '</p >';
    add = add + '<p>';
    add = add + '<span>商品属性：</span>';
    add = add + '<i class="shangPinShuXing">'+nature+'</i>';
    add = add + '</p >';

    add = add + '<p>';
    add = add + '<span>单价：</span>';
    add = add + '<input type="text" name="1" class="ccc_border" value="'+price+'"/>';
    add = add + '</p >';

    //数量显示
    if(xieyi == 2){
        add = add + '<p>';
        add = add + '<span>数量：</span>';
        add = add + '<input type="number" name="1" class="ccc_border " maxlength="6"/>';
        add = add + '-';
        add = add + '<input type="number" name="1" class="ccc_border "maxlength="6"/>';
        add = add + '</p >';
    }



    //总价值显示
    if(xieyi == 3){
        add = add + '<p>';
        add = add + '<span>总价值：</span>';
        add = add + '<input type="number" name="1" class="ccc_border "/>';
        add = add + '</p >';
    }

    add = add + '<a href="javascript:;" class="delete "></a>'

    add = add + '</div>';
    //返回消息
    return add;
}




//新增商品
$("#div5 .no-select").click(function(){
    if($(this).attr("src")=="../../img/no-select.png")
    {
        $(this).attr("src","../../img/yes-select.png");
        $(this).parent().parent().attr("data-check","1");
    }
    else
    {
        $(this).attr("src","../../img/no-select.png");
        $(this).parent().parent().attr("data-check","0");
    }
});



//点击新增商品-确定
$('#div5 .maiFang-footer').delegate('a:eq(1)','click',function(){
    var addData = '';
    $('#div5 .shangPinLieBiao').each(function(){
        //获取是否选中
        if($(this).attr("data-check") == 1){
            var name = $(this).find(".shangPinXiangQing p:eq(1) span:eq(0)").text();
            var nature = $(this).find(".shangPinXiangQing p:eq(2) span:eq(0)").text();
            var price = $(this).find(".shangPinXiangQing p:eq(3) i:eq(0)").text();
            var xieyi = $('.xieyi ').val();
            addData = addData + addThing(name,nature,price,xieyi);
            //显示页面
            divStyle('div5',true);
            divStyle('div3',false);
        }
    })
    //添加数据
    //$("#div3 .wuPin").remove();
    $("#div3 .xieYiWuPin").after(addData);


})
//点击删除的效果
$("#div3").delegate('.delete','click',function(){
    $(this).css('background-image','url(../../img/shanchuhong@3x.png)');
    $(this).parent().remove();
    popUp_auto(1000,'商品删除成功');
});
intercept('.shangPinShuXing','21');


//创建询价第一步点击到第二步
$('#xunJia1 .next').click(function(){
    divStyle('xunJia1',true);
    divStyle('xunJia2',false);
});
//创建询价第二步点击到第一步
$('#xunJia2 .last').click(function(){
    divStyle('xunJia2',true);
    divStyle('xunJia1',false);
});
//创建询价第二步点击到新增商品
$('#xunJia2 .xinZeng').click(function(){
    divStyle('xunJia2',true);
    divStyle('xinZengShangPin',false);
});
//新增商品

$("#xinZengShangPin .no-select").click(function(){
    if($(this).attr("src")=="../../img/no-select.png")
    {
        $(this).attr("src","../../img/yes-select.png");
        $(this).parent().parent().parent().siblings().find('.no-select').attr("src","../../img/no-select.png");
        $(this).parent().parent().siblings().find(".unSelcet,.allUnSelect").attr("src","../../img/no-select.png");
        $(this).parent().parent().parent().siblings().find(".unSelcet,.allUnSelect").attr("src","../../img/no-select.png");
        $(this).parent().parent().parent().siblings().find(".supplier").attr("data-choose","0");
        $(this).parent().parent().next().slideToggle();
        $(this).parent().parent().parent().siblings().children('.goodsListBottom').slideUp();
    }
    else
    {
        $(this).attr("src","../../img/no-select.png");
        $(this).parent().parent().siblings().find(".unSelcet,.allUnSelect").attr("src","../../img/no-select.png");
        $(this).parent().parent().parent().siblings().find(".unSelcet,.allUnSelect").attr("src","../../img/no-select.png");
        $(this).parent().parent().siblings().find(".supplier").attr("data-choose","0");
        $(this).parent().parent().next().slideUp();
    }
});

///*店铺img选中状态*/
$(".unSelcet").click(function () {
    if (this.src.indexOf("no-select.png") == -1) {
        $(this).attr("src","../../img/no-select.png");
        $(this).parent().parent(".supplier").attr("data-choose","0");
        $(this).parent().parent().siblings(".allSelect").children(".allUnSelect").attr("src","../../img/no-select.png");
    } else {
        $(this).attr("src","../../img/yes-select.png");
        $(this).parent().parent(".supplier").attr("data-choose","1");//当前父亲供应商被选中
        var a4 = $(this).parent().parent().parent(".goodsListBottom").find(".unSelcet");
        var count4 = 0;
        for (var i = 0; i < a4.length; i++){
            if (a4[i].src.indexOf("no-select.png") == -1) {
                count4++;
            }
        }
        if (count4 == a4.length) {
            $(this).parent().parent().siblings(".allSelect").children(".allUnSelect").attr("src","../../img/yes-select.png");
        } else {
            $(this).parent().parent().siblings(".allSelect").children(".allUnSelect").attr("src","../../img/no-select.png");
        }
    }
});
/*全选开始*/
$(".allUnSelect").click(function () {
    if (this.src.indexOf("no-select.png") == -1) {
        $(this).parent().siblings(".supplier").attr("data-choose","0");
        this.src = "../../img/no-select.png";
        $(this).parent().siblings(".supplier").find(".unSelcet").each(function (index, item) {
            item.src = "../../img/no-select.png";
        });
    } else {
        $(this).parent().siblings(".supplier").attr("data-choose","1");
        this.src = "../../img/yes-select.png";
        $(this).parent().siblings(".supplier").find(".unSelcet").each(function (index, item) {
            item.src = "../../img/yes-select.png";
        });
    }
});



$('#xinZengShangPin .maiFang-footer a:last-child').click(function(){
    var addData = '';
        $(".supplier").each(function(){
            if($(this).attr("data-choose") == 1){
                var name = $(this).parent().siblings().find(".goodsName").text();
                var supplier = $(this).find("p:eq(0) span:eq(1)").text();
                addData = addData + addGoods(name,supplier);

                $(".unSelcet,.allUnSelect,.no-select").attr("src","../../img/no-select.png");
                $(".goodsListBottom").slideUp();
                divStyle('xunJia2',false);
                divStyle('xinZengShangPin',true);

            }
        });
    $('.supplier').attr("data-choose","0");
    $("#xunJia2 .xieYiWuPin").after(addData);
});

$('#xinZengShangPin .maiFang-footer a:first-child').click(function(){
    divStyle('xunJia2',false);
    divStyle('xinZengShangPin',true);
});

//点击删除的效果
$("#xunJia2").delegate('.delete','click',function(){
    $(this).css('background-image','url(../../img/shanchuhong@3x.png)');
    $(this).parent().remove();
    popUp_auto(1000,'商品删除成功');
});





//创建求购
$('#qiuGou1 .next').click(function(){
    divStyle('qiuGou1',true);
    divStyle('qiuGou2',false);
});
$('#qiuGou2 .xinZeng').click(function(){
    divStyle('qiuGou2',true);
    divStyle('qiuGou3',false);
});
$('#qiuGou2 .last').click(function(){
    divStyle('qiuGou2',true);
    divStyle('qiuGou1',false);
});
$('.leimu ul li .neiRong a').click(function(){
    divStyle('qiuGou3',true);
    divStyle('qiuGou2',false);
    var txt = $(this).html();
    $('.mingCheng').html(txt);
})
//点击删除的效果
$(".lianXi").delegate('.delete','click',function(){
    $(this).css('background-image','url(../../img/shanchuhong@3x.png)');
    $(this).parent().remove();
    popUp_auto(1000,'商品删除成功');
});


//协议创建必填项校验
//$('.bianhao,.mingcheng,.xieYiYouXiaoQi ,.xieYiYouXiaoQi2,.xieYiZhangQi,.month,.xieyi').blur(function(){
//    if($(this).val()==''){
//        $(this).removeClass("ccc_border");
//        $(this).addClass("red_border");
//        $(this).addClass("red_word");
//    }else{
//        $(this).removeClass("red_border");
//        $(this).addClass("ccc_border");
//        $(this).removeClass("red_word");
//    }
//});
//协议创建第一步
//$('.foot .next').click(function (e) {
//    if(
//        $('.bianhao').val()!=0 &&
//        $('.mingcheng').val()!=0
//    ){
//
//    }
//    else{
//        e.preventDefault();
//        popUp_auto_false(1000, '请完善信息后继续下一步');
//    }
//});
//协议创建第二步
//$('.foot2 .next').click(function (e) {
//    if(
//        $('.xieYiYouXiaoQi').val()!=0 &&
//        $('.xieYiYouXiaoQi2').val()!=0 &&
//        ($('.xieYiZhangQi').val()!=0 ||$('.month').val()!=0 )&&
//        $('.xieyi').val()!=0
//    ){
//
//    }
//    else{
//        e.preventDefault();
//        popUp_auto_false(1000, '请完善信息后继续下一步');
//    }
//});



//初始化时间控件
var now = new Date() ;

var nowYear = now.getFullYear() ; //年
var nowMonth = now.getMonth()+1<10 ? "0"+(now.getMonth()+1) : now.getMonth() ; //月
var nowDay = now.getDate()<10 ?  "0"+now.getDate() : now.getDate() ; //日期

//var nowHour = now.getHours()<10?"0"+now.getHours():now.getHours() ; //时
//var nowMinute = now.getMinutes()<10?"0"+now.getMinutes():now.getMinutes() ; //分

var nowDate = nowYear+"-"+nowMonth+"-"+nowDay ;
//var nowTime = nowHour+":"+nowMinute;

$("#nowDate").val(nowDate) ;

