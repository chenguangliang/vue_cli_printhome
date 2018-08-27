/**
 * Created by linxiaomei on 2017/4/27.
 */
var dataTabOut=[];//托盘显示数组
var areaCodeListOut=[];//包含列表的字母和字母对应的list
var pageFromType = $.getUrlParam("type");
var update = $.getUrlParam("update");


var vm = new Vue({
    el:".selPhoneHead",
    data:{
        dataTab:[],
        areaCodeList:[]
    },
    methods:{
        selectedCode: function (pareaCode) {
            if(pageFromType == 'sign'){
                window.location = getUrl("person/wechatOauth2Url?areaCode="+pareaCode+"&origin=微信快速注册");
                // window.location = "../../html/2_login_sign/sign.html?areaCode="+pareaCode;
            }else if(pageFromType == 'login'){
                window.location = "../../html/2_login_sign/login_number.html?areaCode="+pareaCode;
            }else if(pageFromType == 'findPwd'){
                window.location = "../../html/2_login_sign/zhaoHuiMiMa.html?areaCode="+pareaCode;
            }else if(pageFromType == 'setPhoneNum'){
                window.location = "../../html/12_maiJiaZhongXin/6_anQuanXinXiSheZhi_bangDingShouJi.html?areaCode="+pareaCode+"&update="+update;
            }

        }
    },
    beforeMount:function(){
        //请求查询国际手机号
        $.jsonAjax(getUrl("information/register/findAreaCode"), {}, function (data, status, xhr) {
            if(data){
                dataTabOut = data.letters;
                areaCodeListOut = data.records;//存的是key-value  key是字母 (letterId,1;letter,A;result,list)对象数组
            }
        },false);
        this.dataTab = dataTabOut;
        this.areaCodeList = areaCodeListOut;
    },
    mounted:function(){
        initJqueryCase();
    }
});

function initJqueryCase(){
    //$(".phoneHead").click(function () {
    //    var areaCodeHiddenDiv = $("#areaCodeHiddenDiv").val();
    //    $("#"+areaCodeHiddenDiv).hide();
    //    if(areaCodeHiddenDiv == "loginDiv2"){
    //        $("#codeDiv").show();
    //    }
    //
    //    $(".selPhoneHead").show();
    //});
    //点击选择区号页里的返回箭头
    //$(".return").click(function() {
    //    var areaCodeHiddenDiv = $("#areaCodeHiddenDiv").val();
    //    $("#"+areaCodeHiddenDiv).show();
    //    if(areaCodeHiddenDiv == "loginDiv2"){
    //        $("#codeDiv").hide();
    //    }
    //    $(".selPhoneHead").hide();
    //});

    //$(".neirong li").click(function() {
    //    var areacode = $(this).children("span").html();
    //    areacode = areacode.replace("+", '');
    //    areacode = areacode.replace(" ", '');
    //    $("#areaCode").val(areacode);
    //    var areaCodeHiddenDiv = $("#areaCodeHiddenDiv").val();
    //    $("#"+areaCodeHiddenDiv).show();
    //    if(areaCodeHiddenDiv == "loginDiv2"){
    //        $("#codeDiv").hide();
    //    }
    //    $(".selPhoneHead").hide();
    //    $(".phoneHead").html($(this).children("span").html());
    //
    //});
    [].slice.call(document.querySelectorAll('.ziMu a')).forEach(function(el){
        el.addEventListener('click', function(){
            var target = document.querySelector('div[data-tab=' + this.getAttribute('data-tab')+ ']' );
            target.scrollIntoView(true);
        })
    });
    //先计算字母托盘距离顶部的距离

    $(".ziMu").on("touchmove",function (e) {
        $("body").on("touchmove",function (e) {
                e.preventDefault();
            }
        ).off("touchmove");//方法1：用off来解除body的touchmove事件
        e.preventDefault();
        var touch = e.originalEvent.targetTouches[0];
        var newTouchPos=touch.pageY;  //手指实时距离

        var disTop=$('.ziMu').offset().top+5;//托盘距顶部距离
        var tarNum=parseInt((newTouchPos-disTop)/52);
        var arr=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
         tarNum=tarNum>25?25:(tarNum<0?0:tarNum);
        var target = document.querySelector('div[data-tab=' +arr[tarNum]+ ']' );
        target.scrollIntoView(true);
    });
}
