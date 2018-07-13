/**
 * Created by admin on 2017/12/6.
 */
var invoiceSearchVm=new Vue({
    el:"#invoiceSearchVm",
    data:{
        orderId:'',
        orderTimeStart:'',
        orderTimeEnd:'',
        invState:'',
        companyName:'',
        page:1,
        userType:''
    },
    methods:{
        invoiceSearchBtn: function () {
            var orderTimeStart=this.orderTimeStart ? new Date(this.orderTimeStart):'';
            var orderTimeEnd=this.orderTimeEnd ? new Date(this.orderTimeEnd):'';
            if(orderTimeStart > orderTimeEnd){
                popUp_auto_false(2000,"开始时间不能大于结束时间！");
                return;
            }
            //拼接查询条件
            var urlHead=this.userType=="buyer" ? "invoiceManage_buyer.html":"invoiceManage_seller.html";
            var goUrl = urlHead+"?orderId="
                +this.orderId+"&orderTimeStart="+ orderTimeStart
                +"&orderTimeEnd="+ orderTimeEnd
                +"&invState="+this.invState
                +"&companyName="+this.companyName;
            window.location.href = goUrl;
        },
        resetForm: function () {
            $("#searchForm")[0].reset();
            this.orderId="";
            this.orderTimeStart="";
            this.orderTimeEnd="";
            this.invState="";
            this.companyName="";
        }
    },
    beforeMount: function () {
        this.userType=$.getUrlParam("userType");
    }
});