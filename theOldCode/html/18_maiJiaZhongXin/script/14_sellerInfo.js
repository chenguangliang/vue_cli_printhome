$(function () {
    
})
//联系人信息
var userInfoDTO ="";
var userDTO ="";
var departmentLab ="";
var dealerTypeLab ="";
var erpTypeLab ="";
var busLicAddr ="";
var companyAddress ="";
var businessLicenceIndate ="";
var bankBranchIsLocated ="";
var seller = new Vue({
    el:"#seller",
    data:{
        userInfoDTO:{},
        userDTO:{},
        departmentLab:{},
        dealerTypeLab:{},
        erpTypeLab:{},
        busLicAddr:{},
        companyAddress:{},
        businessLicenceIndate:{},
        bankBranchIsLocated:"",
        remark:""
    },
    mixins:[common],
    beforeCreate: function () {
        $.jsonAjax(getUrl("information/informationSeller/loadSellerInfo"),{},function(data,status,xhr){
            if(data.status=="200"){
                // console.log(data.result)
                userDTO = data.data.userDTO;
                userInfoDTO = data.data.userInfoDTO;
                dealerTypeLab = data.data.dealerTypeLab;
                erpTypeLab = data.data.erpTypeLab;
                departmentLab = data.data.departmentLab;
                busLicAddr = data.data.busLicAddr;
                companyAddress = data.data.companyAddress;
                businessLicenceIndate = data.data.businessLicenceIndate;
                bankBranchIsLocated = data.data.bankBranchIsLocated;
            }else{
                printAlert(data.msg);
                window.location = '../../html/2_login_sign/login_common.html';
            }
        },false);
    },
    created: function () {

        this.$data.userDTO = userDTO;
        this.$data.userInfoDTO = userInfoDTO;
        this.$data.departmentLab = departmentLab;
        this.$data.dealerTypeLab = dealerTypeLab;
        this.$data.erpTypeLab = erpTypeLab;
        this.$data.busLicAddr = busLicAddr;
        this.$data.companyAddress = companyAddress;
        this.$data.businessLicenceIndate = businessLicenceIndate;
        this.$data.bankBranchIsLocated = bankBranchIsLocated;
    },
    methods: {
        /*回到顶部*/
        goToTop: goToTop,
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
        getImgUrl:function (name){
            return getImgUrl(name);
        },
        showRemark:function (remark) {
            this.$data.remark = remark;
        },
        showImg:function (event) {
            var url = $(event.currentTarget).attr("src");
            $("#imgDiv").attr("src",url);
            $(".showBigImg").show();
        },
        hideImg:function () {
            $("#imgDiv").attr("src",'');
            $(".showBigImg").hide();
        }
    }
});

