$(function () {
    
})
function gotoUrl(url) {
    // console.log(url);
    window.location = url;
}
var shopDTO = {};
var userDTO = {};
var userInfoDTO = {};
var userContractDTO = {};
var shopCategorySum = {};
var marginSummary = {};
var marginList = {};
var velocityCount = {};
var royaltiesList = {};
var shenhejindu = new Vue({
    el:"#shenhejindu",
    data:{
        shopDTO:{},
        userDTO:{},
        userInfoDTO:{},
        userContractDTO:{},
        shopCategorySum:{},
        marginSummary:{},
        marginList:{},
        velocityCount:{},
        royaltiesList:{},

    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("information/progressSeller/initProgressMap"),{},function(data,status,xhr){
            if(data.status=="200"){
                // console.log(data.result)
                shopDTO = data.data.shopDTO;
                userDTO = data.data.userDTO;
                userInfoDTO = data.data.userInfoDTO;
                userContractDTO = data.data.userContractDTO;
                shopCategorySum = data.data.shopCategorySum;
                marginSummary = data.data.marginSummary;
                marginList = data.data.marginList;
                velocityCount = data.data.velocityCount;
                royaltiesList = data.data.royaltiesList;
            }else{
                popUp_auto_false(1500,data.msg);
                setTimeout("gotoUrl('../../html/1_index/index.html')",1500);
            }
        },false);
    },
    created: function () {

        this.$data.shopDTO = shopDTO;
        this.$data.userDTO = userDTO;
        this.$data.userInfoDTO = userInfoDTO;
        this.$data.userContractDTO = userContractDTO;
        this.$data.shopCategorySum = shopCategorySum;
        this.$data.marginSummary = marginSummary;
        this.$data.marginList = marginList;
        this.$data.velocityCount = velocityCount;
        this.$data.royaltiesList = royaltiesList;
    },
    methods: {
        time: function (value) {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date(parseInt(value));
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();

            return y + '-' + add0(m) + '-' + add0(d);
        },
        showHeTongInfo:function () {
            var url = getImgUrl(this.userContractDTO.contractJssAddr)
            window.open(url,'_blank')
        }
    }
});
//合同信息确认
function queren() {
    operationBtn("3","");
    hideTC();
}
function showTC() {
    $(".zhezhao").show();
}
function hideTC() {
    $(".zhezhao").hide();
}
//合同信息驳回
function bohui() {
    var auditRemark = $("#auditRemarkText").val();
    if(auditRemark=="" || auditRemark==null || auditRemark==undefined){
        messagebox.box("驳回原因不能为空值!");
        return false;
    }
    operationBtn("0", auditRemark);
}
function operationBtn(state, auditRemark){
    var data={
        "state": state,
        "auditRemark": auditRemark
    };
    $.jsonAjax(getUrl("information/progressSeller/updateUserContract"), data, function (data, status, xhr) {
        if (data.status == "200") {
            popUp_auto(1500,data.msg);
            setTimeout("gotoUrl('5_shenJinDuChaKan_shenHeJinDu.html')",1500);
        } else {
            popUp_auto_false(1500,data.msg);
        }
    });
}