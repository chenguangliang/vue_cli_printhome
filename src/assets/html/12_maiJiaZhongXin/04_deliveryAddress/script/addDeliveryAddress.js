/**
 * Created by Administrator on 2017/3/27 0027.
 */


/**
 *@fileName:deliveryAddress.js
 *@author:fdc
 *@time:2017/3/27 0027
 *@disc:新增收货地址
 */
var addressId = "";
addressId = $.getUrlParam("addressId");
$(function () {
    addressManage.$data.addressId = addressId;
})

var addressManage = new Vue({
    el: "#addAddress",
    mixins: [address],
    data: {
        //地址列表
        address: {provicecode: "", citycode: "", countrycode: "", isdefault: 2},
        //订单核对页参数
        submitInfo: {
            //以此判断是从订单核对页跳转而来
            gotoType: "",
            //判断地址是否改变
            changeFlag: true,
            //如果是修改那么修改完成之后返回修改地址的id
            updateAddressId:"",
        },
    },
    methods: {
        //获取用户的收货地址
        getDeliveryAddress: function () {
            var temp = this;
            if (addressId != null && addressId != '' && typeof(addressId) != undefined) {
                $.jsonAjax(getUrl('buyer/getaddr'), {id: addressId}, function (data, status, xhr) {
                    if (data.success) {
                        temp.address = data.result.addr;
                    }
                }, false);
            }
        },
        //去新增地址页面
        gotoAddressList: function () {
            window.location.href = '4_shouHuoDiZhi_shouHuoDiZhi2.html';
        },
        changeValue: function (e) {
            console.dir(e.target.value);
        },
        //提交
        submitForm: function () {
            var temp = this;
            if ($("#xingMing").val() == '') {
                $(".xingMing").removeClass("none");
                return false;
            } else {
                $(".xingMing").addClass("none");
            }
            if ($("#shoujIHao").val() == '') {
                $(".telPhone").removeClass("none");
                return false;
            } else {
                $(".telPhone").addClass("none");
            }
            if (/^1[3|4|5|7|8]\d{9}$/.test($("#shoujIHao").val())) {
                $(".shoujIHao").addClass("none");
            } else {
                $(".shoujIHao").removeClass("none");
                return false;
            }
            if($("#fixedTel").val()){
                if(/0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}/.test($("#fixedTel").val())) {
                    $(".fixedTel").addClass("none");
                } else {
                    $(".fixedTel").removeClass("none");
                    return false;
                }
            }else{
                $(".fixedTel").addClass("none");
            }
            if ($("select[name='sel_Province']").val()) {
                $(".sel_Province").addClass("none");
            } else {
                $(".sel_Province").removeClass("none");
                return false;
            }
            if ($("select[name='sel_City']").val()) {
                $(".sel_City").addClass("none");
            } else {
                $(".sel_City").removeClass("none");
                return false;
            }
            if ($("select[name='sel_County']").val()) {
                $(".sel_County").addClass("none");
            } else {
                $(".sel_County").removeClass("none");
                return false;

            }
            if ($("#address").val() == '') {
                $(".fullAddress").removeClass("none");
                return false;
            } else {
                $(".fullAddress").addClass("none");
            }
            if (this.address.id) {//修改地址
                 this.address = deleteJSONFiled(this.address, 'createtime');
                 this.address = deleteJSONFiled(this.address, 'updatetime');
                 $.jsonAjaxPost(getUrl('buyer/modifyAddr'), filterJSONNULL(this.address), function (data, status, xhr) {
                      temp.submitInfo.changeFlag = true;
                      //修改成功之后返回时修改操作 返回修改id,为了防止订单核对修改了地址，但是地址不变化2018年1月30日14:51:31
                      temp.submitInfo.updateAddressId=temp.address.id;
                       window.location.href = '4_shouHuoDiZhi_shouHuoDiZhi2.html?' + $.assemblyRequestString(temp.submitInfo);
                 });
             } else {//新增地址
                 temp.submitInfo.changeFlag = false;
                 $.jsonAjaxPost(getUrl('buyer/saveaddr'), this.address, function (data, status, xhr) {
                     window.location.href = '4_shouHuoDiZhi_shouHuoDiZhi2.html?' + $.assemblyRequestString(temp.submitInfo);
                 });
             }
        },
    },
    computed: {
        defaultFlag: {
            set: function (newValue) {
                if (newValue) {
                    this.address.isdefault = 1;
                } else {
                    this.address.isdefault = 2;
                }
            },
            get: function () {
                if (this.address.isdefault == 1) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    beforeMount: function () {
        //获取浏览器参数
        this.submitInfo = $.getUrlJson();
        console.log(this.submitInfo);
        //获取一级区域地址
        this.getOneAddress();
        //获取用户地址信息
        this.getDeliveryAddress();
    },
    mounted: function () {

    },
    beforeUpdate: function () {

    },
    updated: function () {

    },
    watch: {
        'address.provicecode': function (newvalue, oldvalue) {
            if (newvalue != '') {
                this.twoAddressList = this.getAddresses(newvalue);
                this.threeAddressList = [];
            }
        },
        'address.citycode': function (newvalue, oldvalue) {
            this.threeAddressList = this.getAddresses(newvalue);
        }
    }

});