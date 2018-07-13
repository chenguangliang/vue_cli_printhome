/**
 * Created by Administrator on 2017/3/8 0008.
 */
/**
*@fileName:search.js
*@author:fdc
*@time:2017/3/8 0008
*@disc:商品搜索
*/
$(function () {
popUp_open();
    $.jsonAjax(getUrl("mallWord"),{},function(data, status, xhr){
        popUp_close();
        search.$data.mallWords = data;
    });
});
//cgl获取搜索是店铺还是商品
window.onload= function () {
    $(".search_box").focus();
    var res=$.getUrlJson();
    var searchCon=res.queryType;
    var keyword=res.keyword;
    $("#search").val(searchCon);
    $(".search_box").val(keyword);
    search.queryData.keyword=keyword;
};

var search = new Vue({
    el:"#searchApp",
    data:{
        mallWords:[],
        queryData:{
            queryType:"goods",
            keyword:""
        },
        relationWords:[]
    },
    methods:{
        //搜索商品
        searchList:function(){
            if(typeof(this.$data.queryData.keyword) == 'undefined'){
                this.$data.queryData.keyword='';
            }
            if(!isNotBlank(this.$data.queryData.keyword)){
                return;
            }
             var queryType=$("#search").val();
             if(queryType=='goods'){
                window.location = "../../html/4_souSuoJieGuo/search_result.html?queryType="+queryType+"&keyword="+this.$data.queryData.keyword;
             }else{
                    window.location = "../../html/4_souSuoJieGuo/search_shop.html?queryType="+queryType+"&keyword="+this.$data.queryData.keyword;
             }
         },
        searchItem:function(event,type){
            if(type==1){
                window.location = "../../html/4_souSuoJieGuo/search_result.html?keyword="+$(event.currentTarget).html() + "&queryType=goods";
            }else {
                window.location = "../../html/4_souSuoJieGuo/search_result.html?keyword="+$(event.currentTarget).html() + "&queryType="+ $("#search").val();
            }
        },
        enterSearch: function ($event) {
            if($event.key=="Enter"){
                this.searchList();
            }
        }

    },
    watch:{
        'queryData.keyword': function () {
            var that=this;
            $.jsonAjax(getUrl("searchController/autoComplete"),{'keyword':$(".search_box").val()},function(data, status, xhr){
                if(data.isSuccess){
                    that.relationWords=data.resultData.termList;
                    if(data.resultData.termList.length>0){
                        $(".relationWrap").show();
                    }else {
                        $(".relationWrap").hide();
                    }
                }else{

                }
            },false);
        }
    }

});


