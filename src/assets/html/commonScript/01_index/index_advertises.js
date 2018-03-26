/**
*@fileName:advertises.js
*@author:fdc
*@time:2017/6/1
*@disc:主题广告推荐位
 *
*/

var index_advertises ={
    data:{
        index_advertises_list :[],
    },
    methods:{
        //获取主题广告
        getIndexAdvertises:function(){
            var temp = this;
            $.jsonAjax(getUrl("advertises"), {}, function (data, status, xhr) {
                if (data) {
                    temp.index_advertises_list = data;
                }
            });
        }
    },
    beforeMount:function(){
        //获取主题广告
        this.getIndexAdvertises();
    },
}