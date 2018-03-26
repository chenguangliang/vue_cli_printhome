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
        params:{
            //订单编号
            orderNo:"",
        },
        //提交支付参数
        payFormParams:{
        },
        //微信支付需要的参数
        wcPayNeed:{},
        //提交支付页面
        toPayForm:"",
        //请求之后upadted更新时进行提交
        payFlag :false,

    },
    methods:{
        //获取 订单支付信息
        getPayForm:function(){
            var temp = this;
            $.jsonAjax(getUrl("/quickor/master/orderCashierDesk"),this.params,function(data, status, xhr){
                if(data.isSuccess){
                    console.log(data);
                    //temp.payFormParams =  data.result;
                    //进行非空赋值
                    copyJsonFilterInit(temp.payFormParams,data.result);//这里是后台返回的订单的信息，和微信支付地址是平行的
                    copyJsonFilterInit(temp.wcPayNeed,data);//这里是后台返回的订单的信息，和微信支付地址是平行的
                    //将对象属性变为vue对象
                    traverseJsonToVue(temp.payFormParams);
                }
                console.log(data);
            },false);
        },
        //初始化初始支付方式
        initPayMethod :function(){
            if(this.payFormParams.paymentMethod==2){
                Vue.set(this.payFormParams,"payMethod","CITIC");
            }else{
                Vue.set(this.payFormParams,"payMethod","CB");
            }
            if(this.payFormParams.orderType==0){
                Vue.set(this.payFormParams,"type",0);
            }else {
                Vue.set(this.payFormParams,"type",1);
            }
        },
        //去支付
        payOrder:function(){
            console.log(this.payFormParams);
            var temp =  this;
            if(this.payFormParams.payMethod == 'WXPC'){//微信走这里
                var url = temp.wcPayNeed.wxUrl;
                var appid = temp.wcPayNeed.appid;
                var redirect_uri = temp.wcPayNeed.redirecturi;
                var state = temp.wcPayNeed.result.orderId;
                if(temp.payFormParams.orderType!=1){//判断是主订单，后边加 ‘01’
                    state=state+'01';
                }
                $("#payform").prop("action",url + "?appid=" + appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base&state="+state+"#wechat_redirect");
                $("#payform").submit();
            }else if( this.payFormParams.payMethod == 'CITIC'){//小印支付走这里
                deleteJSONFiled(temp.payFormParams,"appid");
                deleteJSONFiled(temp.payFormParams,"redirecturi");
                deleteJSONFiled(temp.payFormParams,"wxUrl");
                window.location = "../../html/21_xiaoYinZhiFu/danBiChongZu.html?"+ $.assemblyRequestString(temp.payFormParams);
            }else{
                window.location = "dingDanZhiFuResult.html?"+ $.assemblyRequestString(temp.payFormParams);//支付宝、京东走这里，调到这个页后，后台返回一个form，然后我提交
            }
        },
        //跳转全部订单
        gotoOrderCenter:function(){
            window.location="../../html/21_quickOrder/1_quickOrderList_buyer.html";
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