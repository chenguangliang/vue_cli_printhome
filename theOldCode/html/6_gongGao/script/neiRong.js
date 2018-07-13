/**
 * Created by linxiaomei on 2017/4/25.
 */

var noticeId = $.getUrlParam("noticeId");
var neiRongOut = {};

var neiRongVM = new Vue({
    el:".list2",
    data:{
        imgUrl:img_url,
        neiRong:{}
    },
    methods:{
        replaceSrcUrl:function(sourceString,imageServerUrl){
            var addr = "src=\""+imageServerUrl;
            return sourceString.replace(/src=\"\//g,addr);
        }
    },
    computed:{
        transferHtmlContent: function () {
            return this.neiRong.noticeContent.replace(this.neiRong.noticeContent ? /&(?!#?\w+;)/g : /&/g, '&amp;')
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, "\"")
                .replace(/&#39;/g, "\'");
        }
    },
    beforeMount:function(){
        $.jsonAjax(getUrl("notice/toView/"+noticeId),{},function(data,status,xhr){
            if(data){
                neiRongOut = data;
            }
        },false);
        this.neiRong = neiRongOut;
    }
})