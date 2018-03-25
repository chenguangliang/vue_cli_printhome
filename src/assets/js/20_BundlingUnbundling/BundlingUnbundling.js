/**
 * Created by User on 2017/5/16.
 */
$(function(){
    function divStyle(idname,isHide){
        if(isHide){
            document.getElementById(idname).style.display="none";
        }else{
            document.getElementById(idname).style.display="block";
        }
    }
    //点击确认绑定
    $('.button').click(function(){
        divStyle('stepOne',true);
        divStyle('stepTwo',false);
    });
    //点击取消按钮
    $('#cancel_button').click(function(){
        divStyle('stepOne',false);
        divStyle('stepTwo',true);
    });
    //点击确定按钮
   /* $('#sure_button').click(function(){
     if(!$(".password_input").val()){
     popUp_auto_false(1000,"密码输入错误，请重新输入");
     }else{
     popUp_auto(1000,"绑定成功");
     }
     });*/
    //点击确定按钮
   /* $('#sure_button2').click(function(){
        if(!$(".password_input").val()){
            popUp_auto_false(1000,"密码输入错误，请重新输入");
        }else{
            popUp_auto(1000,"解绑成功");
        }
    });*/
});