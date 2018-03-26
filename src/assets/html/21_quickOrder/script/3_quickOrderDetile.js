/**
 *  快速下单-订单列表(买家、卖家)
 */
/**********************************************************************************************************************/

var OrderDetileVue = new Vue({
    el: "#app",
    data: {
        imgUrl: img_url_cgl,
        mixins: [address, common],
        urlObj: {identity: '', orderId: ''},
        checkerNames:{},
        checkerName:[],
        buyerJm: {},
        sellerJm: {},
        itemDetails: {},
        periodDetails: {},
        invoiceDTO: {},
        order: {},
        fullAddress:[],
        personalityDTO:{},//个性化表单数据
    },
    methods: {
        //获取个性化表单
        getPersonalityList: function () {
            var temp = this;
            $.jsonAjax(getUrl("quickor/item/personalityList"), {}, function (data, status, xhr) {
                if (data.isSuccess) {
                         temp.personalityDTO=data.result.personalityDTO;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //初始化信息
        initOrderDetile: function () {
            var temp = this;
            var paramData = {'orderId': this.urlObj.orderId, 'modleType': this.urlObj.identity};
            $.jsonAjax(getUrl("/quickor/master/orderDetile"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    console.log(data);
                    temp.itemDetails = data.result.itemDetails;
                    temp.buyerJm = data.result.buyerJm;
                    temp.sellerJm = data.result.sellerJm;
                    temp.periodDetails = data.result.periodDetails;
                    temp.invoiceDTO = data.result.invoiceDTO;
                    temp.order = data.result.order;
                    //查找审核人
                    if(temp.order.isAudit==1){
                        $.jsonAjax(getUrl("quickor/user/queryUserInfo"), {"uid":temp.order.auditerUserId}, function (data, status, xhr) {
                            if (data.isSuccess) {
                                temp.checkerName=data.result.user.uname;
                            } else {
                                popUp_auto_false(2500, '网络错误');
                            }
                        }, false);
                    }
                    //分割地址
                    if(temp.order.invoiceType==2){
                        temp.fullAddress=temp.invoiceDTO.fullAddress.split(' ');
                    }

                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //通过uid获取名字
        /*getcheckerNames: function () {
                var paramData={"uid":this.order.auditerUserId};
                $.jsonAjax(getUrl("/quickor/item/showApproveList"), paramData, function (data, status, xhr) {
                    if (data.isSuccess) {
                        this.checkerNames=data.result.auditers;
                    } else {
                        popUp_auto_false(2500, '网络错误');
                    }
                }, false);


        }*/


    },
    beforeMount: function () {
        //获取审核人列表
        // this.getcheckerNames();
        this.urlObj = $.getUrlJson();
        //获取个性化表单
        this.getPersonalityList();
        //初始化信息
        this.initOrderDetile();
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
    },
    updated: function () {
    }

});

