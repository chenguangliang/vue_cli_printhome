/**
 * Created by linxiaomei on 2017/4/11.
 */
//搜索页的VM
var vm = new Vue({
    el:"#suoSou",
    data:{
        createDateStr:'',
        statementId:'',
        sellerName:''
    },
    methods:{
        reset:function () {
            $("#createTime").val("");
            $("#number").val("");
            $("#seller").val("");
        },
        searchDuizhangList: function () {
            //拼接查询条件
            var goUrl = "./14_duiZhangDanGuanLi_duiZhangDanGuanLi.html?statementId="
                +this.statementId+"&createDate="+this.createDateStr+"&sellerName="+this.sellerName;
            window.location.href = goUrl;
        }
    }
})