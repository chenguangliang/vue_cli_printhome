//登录成功返回首页
var cnt = 2;
function lod(){
    if(cnt < 0){
        window.location.href = "../../html/1_index/index.html?invitation=1";
    }else{
        document.getElementById("showTime").innerHTML = cnt;
        cnt--;
    }
    setTimeout("lod()",1000);
}
//修改登录密码成功返回登录首页
var cnt2 = 2;
function lod2(){
    if(cnt2 < 0){
        window.location.href = "../../html/2_login_sign/login_common.html";
    }else{
        document.getElementById("showTime2").innerHTML = cnt2;
        cnt2--;
    }
    setTimeout("lod2()",1000);
}
//返回买家中心安全设置
var cnt3 = 2;
function lod3(){
    if(cnt3 < 0){
        window.location.href = "../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_anQuanXinXiSheZhi.html";
    }else{
        document.getElementById("showTime3").innerHTML = cnt3;
        cnt3--;
    }
    setTimeout("lod3()",1000);
}
//返回买家中心安全设置
var cnt4 = 2;
function lod4(){
    if(cnt4 < 0){
        window.location.href = "../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_anQuanXinXiSheZhi2.html";
    }else{
        document.getElementById("showTime4").innerHTML = cnt4;
        cnt4--;
    }
    setTimeout("lod4()",1000);
}
//订单支付成功跳转至订单详情
var cnt5 = 3;
function lod5(){
    if(cnt5 < 0){
        window.location.href = "../../html/16_dingDanHeDui/dingDanHeDui.html";
    }else{
        document.getElementById("showTime5").innerHTML = cnt5;
        cnt5--;
    }
    setTimeout("lod5()",1000);
}
//修改绑定手机号成功后跳直买家中心页，要不然死循环
var cnt6 = 2;
function lod6(){
    if(cnt6 < 0){
        window.location.href = "../../html/12_maiJiaZhongXin/2_maiJiaZhongXin_maiJiaZhongXin.html";
    }else{
        document.getElementById("showTime3").innerHTML = cnt6;
        cnt6--;
    }
    setTimeout("lod6()",1000);
}
//绑定微信
var cnt_Wechat = 10;
function lodWechat(){
    if(cnt_Wechat < 0){
        window.location.href = "../../html/2_login_sign/login_common.html";
    }else{
        document.getElementById("showTime_Wechat").innerHTML = cnt_Wechat;
        cnt_Wechat--;
    }
    setTimeout("lodWechat()",1000);
}
// var update =  $.getUrlParam("update");
// $(function(){
//     if(update){
//         $("#label").show();
//     }
// })

//3秒后跳转至订单中心
var cnt7 = 2;
function lod7(){
    if(cnt7 < 0){
        window.location.href = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanShenHe.html";
    }else{
        document.getElementById("showTime").innerHTML = cnt7;
        cnt7--;
    }
    setTimeout("lod7()",1000);
};
//返回
var cnt8 = 2;
function lod8(){
    if(cnt8 < 0){
        window.location.href = "../../html/21_quickOrder/1_quickOrderList_buyer.html";
    }else{
        document.getElementById("showTime3").innerHTML = cnt8;
        cnt8--;
    }
    setTimeout("lod8()",1000);
}