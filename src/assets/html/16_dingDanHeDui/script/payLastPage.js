/**
 * Created by linxiaomei on 2017/9/1 0001.
 */


var payLastPage = new Vue({
    el:"#payLastPage",
    data:{
        imgUrl:img_url,
        params:{
            //订单编号
            orderNo:"",
        },
        payInfo:{
            indexNumer:'',
            userPhone:'',
            userEmail:'',
            allOrdernfo:[]
        }
    },
    methods:{
        queryInfo: function () {
            var temp = this;
            var orderNo = this.params.orderNo;
            var orderApId = this.params.orderApId;
            var orderApItemId = this.params.orderApItemId;
            //正常订单地址
            var payTransferOrderUrl = "citic/payTransferOrderResult";
            //快速订单地址
            if(orderNo.indexOf("K")>=0){
            	payTransferOrderUrl = "citic/payTransferQuickOrderResult";
            	$("#isSubOrder").html("");
            }
            $.jsonAjaxPost(getUrl(payTransferOrderUrl),{orderNo:this.params.orderNo,orderApId:orderApId,orderApItemId:orderApItemId},function(data,status,xhr){
                //进行非空赋值
                copyJsonFilterInit(temp.payInfo,data);
                //快速订单地址
                if(orderNo.indexOf("K")>=0){
                	$("#isSubOrder").html("");
                }
                if(!data.userPhone){
                	$(".no_phone").hide();
                }
            });
        },
        printDetail: function () {
            var temp = this;
            var orderNo = this.params.orderNo;
            var printUrl = "citic/printTransferPayCertificates";
            if(orderNo.indexOf("K")>=0){
            	printUrl = "citic/printQuickTransferPayCertificates";
            }
            popUp_open();
            //window.location.href = server_url+"/"+printUrl+"?orderId="+orderNo+"&indexNumber="+temp.payInfo.indexNumer+"&userName="+;
            $.jsonAjaxPost(getUrl(printUrl),{orderId:temp.params.orderNo,indexNumber:temp.payInfo.indexNumer},function(data,status,xhr){
                if(data.isSuccess){
                    var url = temp.imgUrl + "pdf" + data.returnUrl;
                    console.log(url);
                    temp.downLoadFile(url);
                    popUp_close();
                }else{
                    popUp_close();
                    popUp_auto_false(2000,"打印凭证失败");
                }
            });
        },
        //下载文件
        downLoadFile:function(url) {
            var a = document.createElement('a');
            a.href = url;
            a.download = 'myFile.pdf';
            a.click();
        },
        //跳转全部订单
        gotoOrderCenter:function(){
            window.location="../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
        },

    },
    computed:{

    },
    beforeMount:function(){
        this.params = $.getUrlJson();
        this.queryInfo();
    },
    mounted:function(){
        // 操作指导
    	$.jsonAjax(getUrl("shopCart/transferGuide"),{guideMark:"second"},
    	        function(data,status,xhr){
    	            if(data.success){
    	            	if(data.guide){
    	            		 $(".lead").show();
    	            	     clockedBody();
    					}
    	            }else{
    	                popUp_auto_false(1000,data.errorMessages);
    	            }
    	     });
    },
    breforeUpdate:function(){

    },
    updated:function(){

    },
    watch:{
    }


});