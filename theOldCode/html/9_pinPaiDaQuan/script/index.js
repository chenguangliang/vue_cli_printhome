/**
 * Created by linxiaomei on 2017/4/5.
 */

var brandListOut = [];
//var simpleCodeOut = '';
var shopListOut = [];


var vm = new Vue({
    el:"#lieBiaovm",
    data:{
        userInfo: {},
        imgUrl:img_url,
        defaultlogoUrl:'../../../img/default_shop_logo.png',
        brandListshow:[],
        shopList:[],
        brandFlag:'',
        bodyScroll:0
    },
    methods:{
        /**
         * 加载用户信息
         */
        getUserInfo:function(){
            var temp = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    temp.userInfo = data.result;
                }
            }, false);
        },
        shopInfoIndex: function (pshopId) {
            window.location = '../../html/5_dianPuShouYe/dianPu_index.html?shopId='+pshopId;
        }
        ,showLiebiao: function (pbrandId,event,brandName) {
            this.brandFlag=brandName;
            shopListOut = [];
            this.shopList = [];
            $.jsonAjax(getUrl("brandMarket/brand"),{id:pbrandId},function (data, status, xhr) {
                if (data) {
                    shopListOut = data.page.records;
                }
            },false);

            this.shopList = shopListOut;
            if(this.shopList.length == 0 && !$(event.currentTarget).hasClass("erjiColor2")){
                popUp_auto_false(1000,"暂无数据");
            }
            initJqueryThisCase(event);
            //initJqueryCase();
            $(".sanji1").show();
            this.bodyScroll=$("body").scrollTop();
            clockedBody();
        },
        querybrandList: function (pCode,event) {
            brandListOut = [];
            this.brandListshow =[];
            var tourl = "brandMarket/"+pCode;

            $.jsonAjax(getUrl(tourl),{},function (data, status, xhr) {
                if (data) {
                    brandListOut = data.brands;
                }
            },false);

            this.brandListshow = brandListOut;
            if(this.brandListshow.length == 0 && ! $(event.currentTarget).hasClass("dianjihou")){
                popUp_auto_false(1000,"暂无数据");
            }

        },
        /*回到顶部*/
        goToTop: goToTop,
        closeWin: function () {
            unClockedBody();
            $("body").scrollTop(this.bodyScroll);
            $(".sanji1").hide();
        }
    },
    beforeMount:function(){
        this.getUserInfo();
        var temp = this;
        $.jsonAjax(getUrl("brandMarket/A"),{},function (data, status, xhr) {
            if (data) {
                temp.brandListshow = data.brands;
            }
        },false);
    },
    mounted:function(){
        initJqueryItem();
    }
    ,
    updated:function(){
        //initJqueryCase();
    }
})

function initJqueryThisCase(event){
    if(!$(event.currentTarget).hasClass('erjiColor2')){
        $(event.currentTarget).addClass('erjiColor2').siblings().removeClass("erjiColor2");
        $(event.currentTarget).parent().next(".sanji").css('display','block').siblings('.sanji').css('display','none');
    }else{
        $(event.currentTarget).parent().next(".sanji").css('display','none');
        $(event.currentTarget).removeClass('erjiColor2');
    }
}
function initJqueryItem(){
    //品类弹窗一级、二级、三级列表
    $(".kezi").click(function(){
        if(!$(this).hasClass('dianjihou')){
            $(this).addClass('dianjihou').parent().siblings().children('.kezi').removeClass('dianjihou');
        }else{
            $(this).removeClass('dianjihou');
        }
        if($(this).children().hasClass('yijibg')){
            $(this).children().removeClass('yijibg').addClass('yijibg2').parent().parent().siblings().children().children().removeClass('yijibg2').addClass('yijibg');
        }else{
            $(this).children().removeClass('yijibg2').addClass('yijibg');
        }
        $(this).next().slideToggle().parent().siblings().children('.erji').slideUp();
    });
}