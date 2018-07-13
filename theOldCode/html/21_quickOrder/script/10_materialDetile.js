/**
 *  快速下单-物资管理
 */

var quickOrderVue = new Vue({
    el: "#app",
    data: {
        materialInfo:{}
    },
    methods: {

    },
    beforeMount: function () {
        var temp=this;
        var urlObj=$.getUrlJson();
        $.jsonAjax(getUrl("/quickor/item/materialsrDetails"), {"materialsrId":urlObj.materialsrId}, function (data, status, xhr) {
            if (data) {
                console.log(data);
               temp.materialInfo=data.materials;
            }else {
                popUp_auto_false(2500,'网络错误');
            }
        }, false);
    },
    mounted: function () {

    },
    updated:function () {

    }
});
