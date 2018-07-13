$(function() {
//密码明暗文切换
    function showKey(){
        if($('#see').hasClass('img01')){
            $('#see').removeClass('img01').addClass('img02');
            $("#hidePwd").attr('type','text');
        }else{
            $($('#see')).removeClass('img02').addClass('img01');
            $("#hidePwd").attr('type','password');
        }
    };
    //账号
    var loginName = /^((?=.*?[0-9])(?=.*?[A-Za-z])|(?=.*?[0-9])(?=.*?[_])|(?=.*?[A-Za-z])(?=.*?[_]))[0-9A-Za-z_]{4,20}$/;
    //用快速注册的手机号登录
    var phoneNumLoginReg= /^1[3|4|5|7|8]\d{9}$/;
    //使用邮箱登录
    var emailLoginReg=/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z\.-]+)\.([a-z]{2,6})$/;
    var keyWord=/^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[\W])|(?=.*?[A-Za-z])(?=.*?[\W]))[\dA-Za-z\W]+$$/;
    $('#username').blur(function(){
        if(
            ( !loginName.test($(this).val()) )&&( !phoneNumLoginReg.test($(this).val()) ) &&(!emailLoginReg.test($(this).val()))&& ( $(this).val() !='' )
        ){
            $('#usertips').html('4-20位字符,支持字母、数字、下划线的组合');
            $('.user').css('border-color', '#e60012');
            $(this).css('color', '#e60012');
            $('.user .warm').show();
            //$('.btn').removeClass('btnSuccess');
        }
        else{
            $('#usertips').html('');
            $('.user').css('border-color', '#a0a0a0');
            $(this).css('color', '#333');
            $('.user .warm').hide();
            $('.userTip').hide();
        }
    });
    $('#username').focus(function(){
        $('#usertips').html('');
        $('.user').css('border-color', '#a0a0a0');
        $(this).css('color', '#333');
        $('.user .warm').hide();
        $('.userTip').hide();
    });
//密码
    //密码
    $('#hidePwd').blur(function(){
        if(
            ( !keyWord.test($(this).val()) )&& ( !phoneNumLoginReg.test($(this).val()) ) && ( $(this).val() !='' )
        ){
            $('.key').css('border-color', '#e60012');
            $(this).css('color', '#e60012');
            //$('.user .warm').show();
            //$('.btn').removeClass('btnSuccess');
        }
        else{
            $('.key').css('border-color', '#a0a0a0');
            $(this).css('color', '#333');
            $('.userTip').hide();
        }
    });
    $('#hidePwd').focus(function(){
        $('.key').css('border-color', '#a0a0a0');
        $(this).css('color', '#333');
        $('.userTip').hide();
    });
    $('#hidePwd,#username').blur(function(){
        if(
            ( loginName.test($('#username').val()) ) &&
            ( keyWord.test($('#hidePwd').val()) )
        ){
            //$('.btn').addClass('btnSuccess');
            $('.userTip').hide();
        }
        else{
            //$('.btn').removeClass('btnSuccess');
        }
    });
})
