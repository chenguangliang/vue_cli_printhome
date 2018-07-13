/**
 * Created by Administrator on 2017/4/11 0011.
 */
/**
*@fileName:citicPay.js
*@author:fdc
*@time:2017/4/11 0011
*@disc:小印支付
*/

var citicPay = new Vue({
    el:"#citicPay",
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //用户信息
        userInfo:"",
        //浏览器参数
        params:{
            //订单编号
            orderNo:"",
        },
        //支付结果
        payResultSuccess:false,
        //正在支付
        paying:false,
        //accountInfo 账户信息
        orderInfo:{orderInfo:{},allOrderInfo:""},
        //多个订单弹框显示
        multipleOrderShow:false,
        //设置密码弹出框
        setPwdDialog:false,
        //设置密码dto
        setPwdDTO:{
            paypwd:"",
            phone:"",
            phoneCaptcha:"",
        },
        //密码能否被看见标志i
        pwdCanSee:false,
        //支付密码
        paypassword:"",
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
        //去支付 应该后台校验库存
        payOrder:function(){
            console.log(this.params)
            var temp = this;
            $.jsonAjaxPost(getUrl('shopCart/payOrder'),temp.params,function(data, status, xhr){
                if(data.result.er.success){
                    if(data.result.er.result == 1){//跳转支付页面
                        temp.paying = true;
                        temp.toPayForm = data.result.er.resultMessage;
                        temp.orderInfo = data.result;

                    }else if(data.result.er.result == 2){//支付成功
                        temp.payResultSuccess = true;
                        window.location='../../html/16_dingDanHeDui/dingDanZhiFuResult.html?payMethod=jrt&orderNo='+temp.params.orderNo;
                    }
                }else{
                    temp.errorMessages = data.result.er.errorMessages;

                }
            },false);
        },
        //初始化支付订单数据
        initPayOrder :function(){
           if(this.orderInfo.allOrderInfo.length == 1){
            this.multipleOrderShow = true;
           }

        },
        //发送手机验证码
        sendPhoneCaptcha:function(){
            var temp = this;
            $.jsonAjax(getUrl("captcha/sendPhonecaptcha"),{ contact:temp.userInfo.umobile,type:2
            },function(data,status,xhr){
                if(data.success){
                    $("#btn").attr("disabled",true);
                    window.jsqs = setInterval(test,1000);
                    popUp_auto(3000,"短信已发送!");
                }else{
                    popUp_auto_false(3000,data.errorMessages);
                }
            })
        },
        //设置支付密码
        setPwd :function (){
            var temp = this;
            this.setPwdDTO.phone = this.userInfo.umobile;
            $.jsonAjaxPost(getUrl("user/setpaypwd"),this.setPwdDTO,function(data,status,xhr){
                if(data.success){
                    temp.setPwdDialog = !temp.setPwdDialog;
                    popUp_auto(1000,"密码设置成功!");
                    window.setInterval("window.location.reload()",1500);
                }else{
                    popUp_auto_false(3000,data.errorMessages);
                }
            })
        },
        //查看详情
        gotoMyOrder:function(){
            if(this.orderInfo.orderNo.indexOf('K')==-1){
                window.location.href='../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html';
            }else {
                window.location.href='../../html/21_quickOrder/1_quickOrderList_buyer.html';
            }
        },
        //支付
        pay :function (){
            $(".sheZhi").attr("disabled",true);
            $(".sheZhi").attr("style","background-color:#C8C8C8;");
            var temp  = this;
            //outTradeNo
            popUp_open();
            $.jsonAjaxPost(getUrl('shopCart/payCitic'),{paypassword:$("#paypassword").val(),
                outOrderNo:$("input[name='outTradeNo']").val()},function(data,status,xhr){
                popUp_close();
                if(data.success){
                     if(data.result.er.success){
                        popUp_auto(1000,"支付成功")
                       window.setInterval("window.location='../../html/16_dingDanHeDui/dingDanZhiFuResult.html?payMethod=jrt&orderNo="+temp.orderInfo.orderNo+"'",2000);
                         $(".sheZhi").attr("disabled",false);
                         $(".sheZhi").attr("style","background-color:#f39700;");
                     }else{
                         popUp_auto_false(3000,data.result.er.errorMessages);
                         $(".sheZhi").attr("disabled",false);
                         $(".sheZhi").attr("style","background-color:#f39700;");
                     }
                }else{
                    popUp_auto_false(3000,data.errorMessages);
                    $(".sheZhi").attr("disabled",false);
                    $(".sheZhi").attr("style","background-color:#f39700;");
                }
            });
        },
        //去充值
        gotoCharge:function(){
            deleteJSONFiled(this.orderInfo,"enoughFlag");
            deleteJSONFiled(this.orderInfo,"er");
            deleteJSONFiled(this.orderInfo,"formHtml");
            deleteJSONFiled(this.orderInfo,"orderInfo");
            window.location.href='../../html/15_xiaoYinZhiFu/chongZhi.html?' + $.assemblyRequestString(this.orderInfo);
        },
        //返回页
        gotoGoPay:function(){
            window.location.href='../../html/16_dingDanHeDui/quZhiFu.html?orderNo='+this.params.orderNo;
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
        }
    },
    computed:{
    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
        //获取订单编号
        this.params = $.getUrlJson();
        //获取支付参数
        this.payOrder();
        //初始化数据
        this.initPayOrder();
    },
    mounted:function(){

    },
    breforeUpdate:function(){

    },
    updated:function(){

    },
    watch:{
    }

});
