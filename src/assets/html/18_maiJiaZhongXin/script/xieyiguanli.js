
/**
 * 协议列表
 */
$(function(){
    getxieyis("seller",1,"contract");
})
var js_page=1;
var qiehuanType="";
function getxieyis(userType,page,urltype) {
    js_page = js_page + 1;
    $.jsonAjax(getUrl(urltype),{sourcePage:userType,page:page},function(data,status,xhr){
        // vm.$data.agreementList=data.pager.records;
        if(qiehuanType == urltype){
            pushJsonArray(vm.$data.agreementList,data.pager.records);
        }else if(page == 1){
            vm.$data.agreementList=data.pager.records;
        }else{
            vm.$data.agreementList=data.pager.records;
        }
        qiehuanType = urltype;
    },false);
}


var vm = new Vue({
    el:'#wrapper',
    data:{
            agreementList:[],
    },
    mounted:function () {
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: Load
        });
    }
    ,
    methods:{
        //删除协议
        deleteXieyi:function (contractNos) {
            $.jsonAjax(getUrl("deleteContractInfo"),{contractNos:contractNos},function(data,status,xhr){
                if(data == "200"){
                    printAlert("删除成功");
                }else{
                    printAlert("删除失败");
                }
            },false);
            vm.$data.agreementList=[];
            setTimeout(function () {
                getxieyis("seller",1,"contract");
            },100)
        },
        //操作协议
        caozuoiXieyi:function (contractNos,operation,reason) {
            $.jsonAjax(getUrl("confirmContractInfo"),{contractNos:contractNos,operation:operation,reason:reason},function(data,status,xhr){
                printAlert(data.result);
            },false);
            vm.$data.agreementList=[];
            setTimeout(function () {
                getxieyis("seller",1,"contract");
            },100)
        },
        //打开弹窗
        jujue :function (id) {
            jujue_id = id;
            $('.zhezhao2').show();
        },
        //修改协议
        updatexieyi:function (contractNos) {
            window.location.href="./10_xieYiGuanLi_xieYiChuangJian.html?contractNos="+contractNos;
            // $.jsonAjax(getUrl("toContractUpdate"),{contractId:contractNos,sourcePage:"seller"},function(data,status,xhr){
            //     printAlert(JSON.stringify(data));
            // },false);
        }
    }
});

var jujue_id = null;











