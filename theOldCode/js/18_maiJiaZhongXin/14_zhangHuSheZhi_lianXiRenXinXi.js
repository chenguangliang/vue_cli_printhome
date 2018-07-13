//点击导航显示下拉菜单
$(".header span").click(function(){
    $(this).next('.list').slideToggle();
    if($(this).hasClass('xiala')){
        $(this).removeClass('xiala').addClass('xiangshang');
    }else{
        $(this).removeClass('xiangshang').addClass('xiala');
    }
});
//点击其他地方收回下拉菜单
$(document).not($(".header span,.list")).click(function(){
    $(".list").slideUp();
    $('.header span').removeClass('xiangshang').addClass('xiala');
})
$(".header span,.list").click(function(event){
    event.stopPropagation();
});
//联系人信息修改
$("#tel").blur(function () {
    var reg = /^\d{3,4}\-\d{7,8}$/;
    if (!reg.test($(this).val())) {
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    } else {
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$("#buMen").blur(function () {
    if ($(this).val()=='') {
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    } else {
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$("#name").blur(function () {
    var reg =  /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;
    if (!reg.test($(this).val())) {
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    } else {
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$(".baocun").click(function (e) {
    if (
        $(".warm").hasClass("none") &&
        $('#tel').val()!=0 &&
        $('#buMen').val()!=0 &&
        $('#name').val()!=0
    )
    {
    } else {
        e.preventDefault();
    }
});

//是否融资
$(".rongZi img").click(function (e) {
    this.src="../../img/yes-select.png";
    $(this).siblings()[0].src="../../img/no-select.png";
});
$('.yes').click(function(){
    $('.eDu').show();
});
$('.no').click(function(){
    $('.eDu').hide();
    $('.warm13').hide();
});
$('.eDu input').blur(function(){
    if($(this).val().length>9){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
//营业执照信息修改
$('.xingMing,.lianXiRen').blur(function(){
    var reg =  /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;
    if(!reg.test($(this).val())){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('.ziBen,#Id,.zhengJian,.chengLiRiQi,.gongSiDiZhi,.gongSiXiangXiDiZhi').blur(function(){
    if($(this).val()==''){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('#sel_Province,#sel_City,#sel_County,.zhiZhaoDiZhi').blur(function(){
    if($(this).val()==''){
        $(this).parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('.gongYongDianHua').blur(function(){
    if($(this).val()==''){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('.zhengJian').blur(function(){
    if($(this).val()==''){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('.lianXiRen').blur(function(){
    var reg =  /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;
    if(!reg.test($(this).val())){
        $(".warm9").removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(".warm9").addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('.shouJi').blur(function(){
    var reg = /^1[3|4|5|7|8]\d{9}$/;
    if(!reg.test($(this).val())){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$('.daiMaZheng').blur(function(){
    if($(this).val()==''){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$(".save").click(function (e) {
    if (
        $(".warm").hasClass("none") &&
        $('.xingMing').val()!=0 &&
        $('.ziBen').val()!=0 &&
        $('#Id').val()!=0 &&
        $('.zhengJian').val()!=0 &&
        $('.jingYingFanWei input[type=checkbox]').is(':checked') &&
        $('#sel_Province').val()!=0 &&
        $('#sel_City').val()!=0 &&
        $('#sel_County').val()!=0 &&
        $('.zhiZhaoDiZhi').val()!=0 &&
        $('.chengLiRiQi').val()!='' &&
        $('.gongYongDianHua').val()!=0 &&
        $('.lianXiRen').val()!=0 &&
        $('.shouJi').val()!=0 &&
        $('.gongSiDiZhi').val()!=0 &&
        $('.gongSiXiangXiDiZhi').val()!=0 &&
        $('.daiMaZheng').val()!=0
    ) {
    } else {
        e.preventDefault();
    }
});
//组织机构代码信息修改
$('.zuZhiJiGouDaiMa,.youXiaoQi,.shiBieHao,.leiXing,.shuiMa').blur(function(){
    if($(this).val()==''){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$(".baocun").click(function (e) {
    if (
        $(".warm").hasClass("none") &&
        $('.zuZhiJiGouDaiMa').val()!=0 &&
        $('.youXiaoQi').val()!=0 &&
        $('.shiBieHao').val()!=0 &&
        $('.leiXing').val()!=0 &&
        $('.shuiMa').val()!=0
    ) {
    } else {
        e.preventDefault();
    }
});
//查看驳回原因弹窗
//打开弹窗
$('.boHui').click(function () {
    $('.zhezhao').show();
})
//关闭弹窗
$('.zhezhao .con .cancel,.zhezhao .con .sure,.zhezhao .con .close').click(function () {
    $('.zhezhao').hide();
});


//提现账户信息修改
$('.zhangHuMingCheng,.yinHangZhangHao,.yinHangQuanCheng,.lianHangHao').blur(function(){
    if($(this).val()==''){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$(".bc").click(function (e) {
    if (
        $(".warm").hasClass("none") &&
        $('.zhangHuMingCheng').val()!=0 &&
        $('.yinHangZhangHao').val()!=0 &&
        $('.yinHangQuanCheng').val()!=0 &&
        $('.yinHangQuanCheng').val()!=0 &&
        $('.lianHangHao').val()!=0 &&
        $('#sel_Province').val()!=0 &&
        $('#sel_City').val()!=0 &&
        $('#sel_County').val()!=0 &&
        $('.rongZi img')[0].attr("src")!=("../../img/no-select.png")
    ) {
    } else {
        e.preventDefault();
    }
});


//公司经营信息修改
$('.gongSiLeiXing,.yunYingRenShu').blur(function(){
    if($(this).val()==''){
        $(this).parent().parent().next('.warm').removeClass("none");
        $(this).removeClass("ccc_border");
        $(this).addClass("red_border");
        $(this).removeClass("gray_word");
        $(this).addClass("red_word");
    }else{
        $(this).parent().parent().next('.warm').addClass("none");
        $(this).removeClass("red_border");
        $(this).addClass("ccc_border");
        $(this).removeClass("red_word");
        $(this).addClass("gray_word");
    }
});
$(".bao").click(function (e) {
    if (
        $(".warm").hasClass("none") &&
        $('.gongSiLeiXing').val()!=0 &&
        $('.yunYingRenShu').val()!=0 &&
        $('.rongZi img')[0].attr("src")!=("../../img/no-select.png")
    ) {
    } else {
        e.preventDefault();
    }
});