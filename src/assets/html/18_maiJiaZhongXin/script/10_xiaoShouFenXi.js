/**
 * Created by linxiaomei on 2017/6/27.
 */

var salesAnalysisItemListOut = [];
var saleAttrListOut = [];


var saleAnalysisVM = new Vue({
    el:"#salesAnalysis",
    data:{
        imgUrl: img_url,
        salesAnalysisItemList:[],
        saleAttrList:[]
    },
    methods:{
        initSalesAnalysisItem: function () {
            $.jsonAjax(getUrl("salesAnalysis/initItem"), {}, function (data, status, xhr) {
                if(data.itemSize == 0){
                    window.location = "../../html/18_maiJiaZhongXin/10_xiaoShouFenXi_wuXinXi.html";
                }else{
                    salesAnalysisItemListOut = data.itemList;
                }
            }, false);
            this.salesAnalysisItemList = salesAnalysisItemListOut;
        },
        getItemInfo: function (pItemId) {
            var paramData = {
                itemId:pItemId
            };
            $.jsonAjax(getUrl("salesAnalysis/getItemSKUByItemId"), paramData, function (data, status, xhr) {
                saleAttrListOut = data.tradeInventoryOutDTOList;
            }, false);
            this.saleAttrList = saleAttrListOut;
        },
        clickAttr: function (event,skuId,pItemId,pAttrName) {
            $(event.srcElement).parent().css({color:'#fff','background-color':'#e60012'});
            window.location = "../../html/18_maiJiaZhongXin/10_xiaoShouFenXi_xiaoShouZhuangKuang.html?skuId="+skuId
                +"&itemId="+pItemId+"&attrName="+pAttrName;
        }
    },
    beforeMount:function(){
        this.initSalesAnalysisItem();
    },
    mounted:function(){
        initCase();
    }
})

function initCase(){
    $('.shangPinLieBiao .theTop').click(function(){
        $(this).next().slideToggle().parents().siblings().children('.shuXing').hide();
    });
    $('.shuXing ul li').click(function(){
        $(this).addClass('on').siblings().removeClass('on');
    });
    $('.xuanXiangKa .qieHuan').click(function(){
        $('.xuanXiangKa,.lieBiao').hide();
        $('.tongJiTu').show();
    });
    $(".tongJiTu ul li").click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
        var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
        $(".tu > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
    });
    $('.tongJiTu .qieHuan').click(function(){
        $('.tongJiTu').hide();
        $('.xuanXiangKa,.lieBiao').show();
    });
}