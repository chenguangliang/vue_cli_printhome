//表单验证
$('.yanZhengMa ').blur(function(){
    if($(this).val()==''){
        $(this).parent().parent().next().removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
    }else{
        $(this).parent().parent().next().addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
    }
});

//接收验证码倒计时
var count =60;
function test(){
    count--;
    if(count >= 0) {
        $('.btn').val(count+'秒');
    } else {
        clearTimeout(jsqs);
        $('.btn').val('接收验证码');
        $(".btn").attr("disabled",false);
        $('.btn').css('background-color','#e60012');
        count=60;
    }
}
function jsq(){
    $(".btn").attr("disabled",true);
    $('.btn').css('background-color','#ccc');
    popUp_auto(1000,'验证信息已发送','请查收');
    window.jsqs = setInterval(test,1000);
}


//提交按钮
$(".tiJiao").click(function (e) {
    if(
        $(".warm").hasClass("none") &&
        (/^\d{6}$/.test($('.yanZhengMa ').val()))
    ) {
    }else{
        e.preventDefault();
    }
});

var xiuGai = new Vue({
    el:"#xiuGai",
    data:{
        userInfo:'',
    },
    beforeMount:function() {
        //用户信息
        this.userInfo = StorageUtil.getUserInfo();
        // console.log(this.userInfo)
    },
    mounted:function () {
        this.getSelect();
    },
    methods:{
        getPhone:function (phone) {
            return phone.substr(0,3)+"****"+phone.substr(phone.length-4,4);
        },
        getEmail: function (email) {
            if(email != null && email.length > 20){
                email=email.substring(0,3)+"****"+email.substring(email.length-8,email.length);
            }
            return email;
        },
        getSelect:function () {
            var options = "";
            if(this.userInfo.umobile&&this.userInfo.umobile != ''){
                options += "<option value='"+2+"'>"+this.getPhone(this.userInfo.umobile)+"</option>";
            }
            if(this.userInfo.userEmail&&this.userInfo.userEmail != ''){
                options += "<option value='"+1+"'>"+this.getEmail(this.userInfo.userEmail)+"</option>";
            }
            $("#select_contact_id").html(options);
        }
    }
});
function sendCaptcha(type) {
    //发送验证码过程中不允许切换绑定手机/邮箱
    $("#select_contact_id").attr("disabled","disabled");
    //发送验证码
    var selected = $("#select_contact_id").val();
    var contact = '';
    if (selected == 1) {
        contact = xiuGai.$data.userInfo.userEmail;
    } else if (selected == 2) {
        contact = xiuGai.$data.userInfo.umobile;
    }
    var picCaptchaType = '';
    if(type=='phone'){
        picCaptchaType = "change_bang_phone";
    }else if(type=='email'){
        picCaptchaType = "change_bang_email";
    }
    $.jsonAjax(getUrl("captcha/sendPhoneMessage"), {picCaptchaType: picCaptchaType,contact: contact,type: selected,picCaptcha: ""},
        function (data, status, xhr) {
            if (data.success) {
                popUp_auto(1000, "短信已发送!");
                jsq();
            } else {
                popUp_auto_false(1000, data.errorMessages);
            }
        });
}
//验证验证码
function checkCaptcha(type){
    var captcha = $("#captcha_id").val();
    var selected = $("#select_contact_id").val();
    var contact = '';
    if (selected == 1) {
        contact = xiuGai.$data.userInfo.userEmail;
    } else if (selected == 2) {
        contact = xiuGai.$data.userInfo.umobile;
    }
    var data = {captcha:captcha,contact:contact};
    $.jsonAjax(getUrl("captcha/checkCaptcha"),data,function(data,status,xhr) {
        if(data.status == '200'){
            if(data.data){
                if(type=='phone'){
                    window.location = '../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_bangDingShouJi.html?update=true';
                }else if(type='email'){
                    window.location = '../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_bangDingYouXiang.html?update=true';
                }
            }else{
                popUp_auto_false(1000, "验证码不正确");
                return;
            }
        }else{
            popUp_auto_false(1000, "验证码不正确");
            return;
        }
        // if(!data.message){
        //     popUp_auto_false(1000, "验证码不正确");
        //     return;
        // } else {
        //     if(type=='phone'){
        //         window.location = '../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_bangDingShouJi.html?update=true';
        //     }else if(type='email'){
        //         window.location = '../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_bangDingYouXiang.html?update=true';
        //     }
        // }
    },false);
    // var captchaFormat = /^[a-zA-Z0-9]{6}$/;
    // if(!captchaFormat.test(captcha)){
    //     popUp_auto_false(1000, "验证码不正确");
    //     return;
    // }
    // var codeKey = $('#code_key').val();
    // var data = {code:captcha,codeKey:codeKey};
    // $.jsonAjax(getUrl("captcha/check"),data,function(data,status,xhr) {
    //     if(!data.message){
    //         popUp_auto_false(1000, "验证码不正确");
    //         return;
    //     } else {
    //         if(type=='phone'){
    //             window.location = '../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_bangDingShouJi.html?update=true';
    //         }else if(type='email'){
    //             window.location = '../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_bangDingYouXiang.html?update=true';
    //         }
    //     }
    // },false);
}