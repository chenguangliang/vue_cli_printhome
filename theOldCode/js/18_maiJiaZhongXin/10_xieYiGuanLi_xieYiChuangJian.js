

//协议创建三个步骤切换方法
function divStyle(idname,isHide){
    if(isHide){
        document.getElementById(idname).style.display="none";
    }else{
        document.getElementById(idname).style.display="";
    }
}





//新增商品回到第三步
function xinZeng(){
    divStyle('div3',true);
    divStyle('div5',false);
    getgoodsList(null,null,1);
}

// //获取物品信息
// function addThing(name,nature,price,xieyi){
//     if(xieyi == '') return alert('请选择协议');
//     var add = '';
//     add = add + '<div class="wuPin">';
//     add = add + '<p><span>商品名称：</span>';
//     add = add + '<i>'+name+'</i>';
//     add = add + '</p >';
//
//     add = add + '<p>';
//     add = add + '<span>商品属性：</span>';
//     add = add + '<i class="shangPinShuXing">'+nature+'</i>';
//     add = add + '</p >';
//
//     return add;
// }

//新增卖方回到第一步
function maiFang(){
    getshopList(1,0,null);
    divStyle('div1',true);
    divStyle('div4',false);

}


//创建询价
$('#xunJia1 .next').click(function(){
    divStyle('xunJia1',true);
    divStyle('xunJia2',false);
});
$('#xunJia2 .xinZeng').click(function(){
    divStyle('xunJia2',true);
    divStyle('xinZengShangPin',false);
});
$('#xunJia2 .last').click(function(){
    divStyle('xunJia2',true);
    divStyle('xunJia1',false);
});
//点击删除的效果
$('.delete').click(function(){
    $(this).css('background-image','url(../../img/shanchuhong@3x.png)');
    popUp_auto(1000,'商品删除成功');
});
$('#xinZengShangPin .maiFang-footer a').click(function(){
    divStyle('xunJia2',false);
    divStyle('xinZengShangPin',true);
})

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
