/**
 * Created by Administrator on 2017/4/1 0001.
 */
/**
*@fileName:pay.js
*@author:fdc
*@time:2017/4/1 0001
*@disc:订单支付
*/


var pay = new Vue({

    el:"#pay",
    mixins:[],
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //用户信息
        userInfo:"",
        params:{
            //订单编号
            orderNo:"",
        },
        //提交支付参数
        payFormParams:{
        },
        //提交支付页面
        toPayForm:"",
        //请求之后upadted更新时进行提交
        payFlag :false,
        //支付密码
        payPass:"",
        //修改新增的邮箱
        newEmail:"",
        //判断协议的弹窗是哪里传过来的
        makeSureType:""
    },
    methods:{
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                    console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        //获取 订单支付信息
        getPayForm:function(){
            var temp = this;
            $.jsonAjax(getUrl("shopCart/payView"),this.params,function(data, status, xhr){
                if(data.success){
                    //temp.payFormParams =  data.result;
                    //进行非空赋值
                    copyJsonFilterInit(temp.payFormParams,data.result);
                    //将对象属性变为vue对象
                    traverseJsonToVue(temp.payFormParams);
                }
                console.log(data);
            },false);
        },
        //初始化初始支付方式
        initPayMethod :function(){
            if(this.payFormParams.jrtFalg){
                Vue.set(this.payFormParams,"payMethod","jrt");
            }else{
                Vue.set(this.payFormParams,"payMethod","wnzx");
            }
        },
        //去支付
        //payOrder:function(){
        //    var temp =  this;
        //    if(this.payFormParams.payMethod == 'wx'){
        //        var url = temp.payFormParams.wxUrl;
        //        var appid = temp.payFormParams.appid;
        //        var redirect_uri = temp.payFormParams.redirecturi;
        //        var state = temp.payFormParams.orderNo;
        //        $("#payform").prop("action",url + "?appid=" + appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base&state="+state+"#wechat_redirect");
        //        $("#payform").submit();
        //    }else if( this.payFormParams.payMethod == 'jrt'){
        //        deleteJSONFiled(temp.payFormParams,"appid");
        //        deleteJSONFiled(temp.payFormParams,"redirecturi");
        //        deleteJSONFiled(temp.payFormParams,"wxUrl");
        //        window.location = "../../html/15_xiaoYinZhiFu/danBiChongZu.html?"+ $.assemblyRequestString(temp.payFormParams);
        //    }else{
        //        window.location = "../../html/16_dingDanHeDui/dingDanZhiFuResult.html?"+ $.assemblyRequestString(temp.payFormParams);
        //    }
        //},
        //跳转全部订单
        gotoOrderCenter:function(){
            window.location="../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
        },
        gotoQuickOrder: function () {
            window.location="../../html/21_quickOrder/1_quickOrderList_buyer.html";
        },
        //打印充值凭证
        printRechargeCertificates:function(orderId) {
            popUp_open();
            var temp = this;
            var paramData = {
                orderId:orderId
            };
            $.jsonAjax(getUrl("citic/printRechargeCertificates"), filterJSONNULL(paramData), function (data, status, xhr) {
                if(data.isSuccess){
                    var url = temp.imgUrl + "pdf" + data.returnUrl;
                    console.log(url);
                    temp.downLoadFile(url);
                    popUp_close();
                }else{
                    popUp_close();
                    popUp_auto_false(2000,"充值凭证失败");
                }
            }, true);
        },
        //下载文件
        downLoadFile:function(url) {
            var a = document.createElement('a');
            a.href = url;
            a.download = 'myFile.pdf';
            a.click();
        },
        //去充值
        gotoCharge:function(){
            deleteJSONFiled(this.payFormParams,"enoughFlag");
            deleteJSONFiled(this.payFormParams,"er");
            deleteJSONFiled(this.payFormParams,"formHtml");
            deleteJSONFiled(this.payFormParams,"orderInfo");
            window.location.href='../../html/15_xiaoYinZhiFu/chongZhi.html?' + $.assemblyRequestString(this.payFormParams);
        },
        //查看详情
        gotoMyOrder:function(){
            var orderNo = this.payFormParams.orderNo;
            if(orderNo.indexOf('K')==-1){
                window.location.href='../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html';
            }else {
                window.location.href='../../html/21_quickOrder/1_quickOrderList_buyer.html';
            }
        },
        //支付
        pay :function (){
            var temp  = this;
            popUp_open();
            $.jsonAjaxPost(getUrl('shopCart/payCitic'),{paypassword:$("#paypassword").val(),
                orderNo:temp.payFormParams.orderNo,orderApId:temp.payFormParams.orderApId,orderApItemId:temp.payFormParams.orderApItemId},function(data,status,xhr){
                popUp_close();
                if(data.success){
                    if(data.result.er.success){
                        popUp_auto(1000,"支付成功");
                        if(temp.payFormParams.orderApId && temp.payFormParams.orderApItemId && data.result.apInfo.payType == 1){ //分期订单加个url参数，为了支付成功页里的订单详情跳到哪里
                            window.setInterval("window.location='../../html/16_dingDanHeDui/dingDanZhiFuResult.html?orderType=periodOrder&payMethod=jrt&orderNo="+temp.payFormParams.orderNo+"'",2000);
                        }
                        else {
                            window.setInterval("window.location='../../html/16_dingDanHeDui/dingDanZhiFuResult.html?payMethod=jrt&orderNo="+temp.payFormParams.orderNo+"'",2000);
                        }

                    }else{
                        popUp_auto_false(3000,data.result.er.errorMessages);
                    }
                }else{
                    popUp_auto_false(3000,data.errorMessages);
                }
            });
        },
        //去支付
        payOrderByPersonal:function(type){
            var temp =  this;
            temp.payFormParams.payMethod = type;

            //更新支付方式为个人支付
            $.jsonAjaxPost(getUrl('shopCart/payPersonal'),{type:type,orderNo:temp.payFormParams.orderNo},function(data,status,xhr){
                if(!data.success){
                    popUp_auto_false(3000,data.errorMessages);
                }
            },false);
            if(temp.payFormParams.payMethod == 'wx'){
                var url = temp.payFormParams.wxUrl;
                var appid = temp.payFormParams.appid;
                var redirect_uri = temp.payFormParams.redirecturi;
                var state = temp.payFormParams.orderNo;
                if(temp.payFormParams.orderApId && temp.payFormParams.orderApItemId){
                    state = state + "|" + temp.payFormParams.orderApId + "|" + temp.payFormParams.orderApItemId;
                }
                $("#payform").prop("action",url + "?appid=" + appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base&state="+state+"#wechat_redirect");
                $("#payform").submit();
            }else{
                window.location = "../../html/16_dingDanHeDui/dingDanZhiFuResult.html?"+ $.assemblyRequestString(temp.payFormParams);
            }

        },
        //点击确认转账支付
        clickTransferOrder: function () {
            //先判断输入的支付密码是否正确
            var temp =  this;
            $.jsonAjaxPost(getUrl('citic/checkPayPass'),{payPass:temp.payPass},function(data,status,xhr){
                if(data.result == "yes"){
                    //判断是否绑定了邮箱
                    var userEmail = temp.payFormParams.userEmail;
                    if(null != userEmail && "" != userEmail && typeof(userEmail) != "undefined"){
                        $(".confirmEmail").show();
                    }else{
                        $(".unboundMailbox").show();
                    }
                }else{
                    popUp_auto_false(1000,"请输入正确的支付密码");
                }
            });
        },
        submitTransOrder: function () {
            var email = "";
            var type = this.makeSureType;
            if(type == "noChange"){//noChange
                email = this.payFormParams.userEmail;
            }else{//change
                email = this.newEmail;
            }
            //正则判断邮箱格式
            if("" == email){
                popUp_auto_false(1000,"请输入邮箱");
                return;
            }
            var mailChrnum = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            if(!mailChrnum.test(email)){
                popUp_auto_false(1000,"您输入的邮箱格式不正确!");
                return;
            }

            //开始保存
            var temp =  this;
            var orderNo = this.payFormParams.orderNo;
            var orderApId = this.payFormParams.orderApId;
            var orderApItemId = this.payFormParams.orderApItemId;
            //正常订单支付地址
            var payTransferOrderUrl = "citic/payTransferOrder";
            //快速订单支付地址
            if(orderNo.indexOf("K")>=0){
            	payTransferOrderUrl = "citic/payQuickTransferOrder";
            }
            $.jsonAjaxPost(getUrl(payTransferOrderUrl),{userEmail:email,orderNo:this.payFormParams.orderNo,orderApId:orderApId,orderApItemId:orderApItemId},function(data,status,xhr){
            	if(data.result == "yes"){
            		if(!orderApId){
            			orderApId = "";
            		}
            		if(!orderApItemId){
            			orderApItemId = "";
            		}
            		window.location = "../../html/16_dingDanHeDui/payLastPage.html?orderNo="+temp.payFormParams.orderNo+"&orderApId="+orderApId+"&orderApItemId="+orderApItemId;
            	}else{
            		popUp_auto_false(1000,"保存失败");
            	}
            });
        },
        makeSure: function (type) {
            //debugger;
            this.makeSureType = type;
            $(".disclaimer").show();
            clockedBody();
        }
    },
    computed:{
        //支付方式
        payMethod:{
            set:function(){


            },
            get:function(){

            }
        }
    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
        //获取订单编号
        this.params = $.getUrlJson();
        //获取订单支付信息
        this.getPayForm();
        //初始化初始支付方式
        this.initPayMethod();
    },
    mounted:function(){
    },
    breforeUpdate:function(){

    },
    updated:function(){
        /*if(this.payFlag){
            if(this.payFormParams.payMethod == 'wx'){
                document.getElementById("form").submit();
            }
        }*/
    },
    watch:{
    }


});