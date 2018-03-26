
var shopDTO = {};
var userDTO = {};
var userInfoDTO = {};
var userContractDTO = {};
var shopCategorySum = {};
var marginSummary = {};
var marginList = {};
var royaltiesSummary = {};
var royaltiesList = {};
var fukuan = new Vue({
    el:"#fukuan",
    mixins:[common],
    data:{
        shopDTO:{},
        userDTO:{},
        userInfoDTO:{},
        userContractDTO:{},
        shopCategorySum:{},
        marginSummary:{},
        marginList:{},
        royaltiesSummary:{},
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
                royaltiesSummary = data.data.royaltiesSummary;
                royaltiesList = data.data.royaltiesList;
            }else{
                printAlert(data.msg);
                window.location = '../../html/1_index/index.html';
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
        this.$data.royaltiesSummary = royaltiesSummary;
        this.$data.royaltiesList = royaltiesList;

    },
    methods: {
    }
});
function showLabel(index) {
    if(index=='1'){
        $("#baoZhengJin").show();
        $("#shiYongFei").hide();
    }else if(index=='2'){
        $("#baoZhengJin").hide();
        $("#shiYongFei").show();
    }
}