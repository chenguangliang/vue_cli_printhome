/**
 * Created by User on 2017/2/7.
 */
//店铺名字限制字数
intercept('.maxLength_25',25);
//删除类目弹窗
$('.shanChu').click(function(){
    $('.shanChuTanChuang').show();
    clockedBody();
});
//关闭弹窗
$('.shanChuTanChuang a,.shanChuTanChuang .bg').click(function () {
    $('.shanChuTanChuang').hide();
    unClockedBody();
});
//点击确定的效果
$(".shanChuTanChuang p a:last-child").click(function(){
    popUp_auto(1000,'删除成功');
});
// 新增类目
$('.xinZengLeiMu').click(function(){
    $('.xinZengLeiMuTanChuang').show();
    clockedBody();
});
//关闭弹窗
$('.xinZengLeiMuTanChuang .cancel, .xinZengLeiMuTanChuang .close,.xinZengLeiMuTanChuang .bg').click(function () {
    $('.xinZengLeiMuTanChuang').hide();
    unClockedBody();
});
$('.xinZengLeiMuTanChuang .sure').click(function(){
    if($('#first-select').val()=='' || $('#second_select').val()=='' || $('#last-select').val()==''){
        popUp_auto_false(1000,'请选择店铺类目');
    }else{
        popUp_auto(1000,'已新增');
        $('.xinZengLeiMuTanChuang').hide();
    }
});
//下拉框默认颜色
var unSelected = "#999";
var selected = "#333";
$(function () {
    $(".xinZengLeiMuTanChuang select").css("color", unSelected);
    $(".xinZengLeiMuTanChuang option").css("color", selected);
    $(".xinZengLeiMuTanChuang select").change(function () {
        var selItem = $(this).val();
        if (selItem == $(this).find('.xinZengLeiMuTanChuang option:first').val()) {
            $(this).css("color", unSelected);
        } else {
            $(this).css("color", selected);
        }
    });
});