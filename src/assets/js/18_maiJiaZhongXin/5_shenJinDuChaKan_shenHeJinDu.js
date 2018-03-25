$(document).ready(function(){
    var th=$('.jinDuKa').height();
    var h0 = $(".jinDuKa").offset().top;
    var zt=$('.ziZhi span').html();
    var h = $("#one").offset().top-h0;
    if(zt=='审核中'){
        $('.ziZhi').children('.jinDuKa .maijia  em').show();
        $('.ziZhi').next('.shenHeZhong').show();
        // $('.ziZhi').next('.shenHeZhong').html('您的资质申请正在拼命审核中，审核通过后我们将会用以邮件形式通知您，请耐心等待管理员操作。感谢您的支持和配合！');
    }else if(zt=='审核驳回'){
        $('.ziZhi').children('.jinDuKa .maijia  em').show();
        $('.ziZhi').next('.shenHeZhong').show();
        // $('.ziZhi').next('.shenHeZhong').html('您的资质审核未通过，请在PC端登录平台修改完成后重新提交或联系管理员！<i class="red">4006-770-878转2</i><br>驳回理由：<br>{{userInfoDTO.userDTO.auditRemark}}');
    }else if(zt=='审核通过'){
        h = $("#two").offset().top-h0;
        $('.ziZhi').next('.shenHeZhong').hide();
        $('.heTong span').show();
        $('.heTong').css('color','#333');
        $('.heTong').next('.shenHeZhong').show();
        $('.heTong').children('.jinDuKa .maijia  em').show();
    }
    var zt2=$('.heTong span').html();
    if(zt2=='上传中'){
        // $('.heTong').next('.shenHeZhong').html('您的合同尚未被上传或正在修改，请稍等或联系平台客服：<i class="red">4006-770-878转2</i>');
    }else if(zt2=='待确认'){
        // $('.heTong').next('.shenHeZhong').html('合同编号：123456789456789744564561Sh<br>店铺名称：雷盟企业店铺一号<br>合同日期：2016-01-01 至 2017-01-01<br>商家类型：商家入驻');
        $('.footer').show();
    }else if(zt2=='审核通过'){
        h = $("#three").offset().top-h0;
        $('.heTong').next('.shenHeZhong').hide();
        $('.heTong').children('.jinDuKa .maijia  em').hide();
        $('.dianPu span').show();
        $('.dianPu').css('color','#333');
        $('.dianPu').next('.shenHeZhong').show();
        $('.dianPu').children('.jinDuKa .maijia  em').show();
    }
    var zt3=$('.dianPu span').html();
    if(zt3=='审核中'){
        // $('.dianPu').next('.shenHeZhong').html('您的资质申请正在拼命审核中，请耐心等待管理员操作。<br>感谢您的支持与配合！<br>如有疑问请联系平台客服：<i class="red">4006-770-878转2</i>');
    }else if(zt3=='审核驳回'){
        // $('.dianPu').next('.shenHeZhong').html('您的资质审核未通过，请在PC端登录平台修改完成后重新提交或联系管理员！<i class="red">4006-770-878转2</i><br>驳回理由：<br>这里显示驳回的理由，自动换行，直到显示完整这里显示驳回的理由，自动换行，直到显示完整这里显示驳回的理由，自动换行，直到显示完整');
    }else if(zt3=='审核通过'){
        h = $("#four").offset().top-h0;
        $('.dianPu').next('.shenHeZhong').hide();
        $('.dianPu').children('.jinDuKa .maijia  em').hide();
        $('.fuKuan span').show();
        $('.fuKuan').css('color','#333');
    }
    var zt4=$('.fuKuan span').html();
    if(zt4=='审核通过'){
        h = th;
        $('.kaiTong span').show();
        $('.kaiTong').css('color','#333');
    }

    $('.jinDuTiao,.jinDuTiao .line').height(th);
    // $('.jinDuTiao .line .line-red').height(h/5);
    $('.jinDuTiao .line .line-red').height(h);
});
$('.footer input').click(function () {
    $(this).addClass('on').siblings().removeClass('on');
});
//审核驳回
$('.boHui').click(function () {
    $('.shenHeBoHuiBg').show();
});
//判断文本框内容
$('.shenHeBoHui p button.sure').click(function () {
    if($('.shenHeBoHui textarea').val()==''){
        $('.shenHeBoHui .textNone').show().delay(1000).hide(0);
        $('.shenHeBoHui .textNone').html('请先填写驳回原因！');
    }else{
        // popUp_auto(1000,'已驳回');
        bohui();
        $('.shenHeBoHuiBg').hide();
    }
});
//关闭弹窗
$('.shenHeBoHui p button.cancel,.shenHeBoHui i').click(function () {
    $('.shenHeBoHuiBg').hide();
});
