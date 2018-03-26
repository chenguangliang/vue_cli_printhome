/**
 * Created by Administrator on 2017/3/27 0027.
 */


Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}


/**
*@fileName:deliveryAddress.js
*@author:fdc
*@time:2017/3/27 0027
*@disc:收货地址管理
*/
var addressManage = new Vue({
    el:"#addressManage",
    data:{
        //地址列表
        addressList:[],
        //删除弹框
        delDialog :false,
        //删除did
        delAddr:"",

        //订单核对页参数
        submitInfo:{
            //以此判断是从订单核对页跳转而来
            gotoType:"",
            //判断地址是否改变
            changeFlag:true,
            //判断是否是展会商品进入
            tradeMark:""
        },

    },
    methods:{
        //获取用户的收货地址
        getDeliveryAddress:function(){
            var temp = this;
            popUp_open();
            $.jsonAjax(getUrl('buyer/addr'),{},function(data, status, xhr){
                if(data.success){
                    temp.addressList = data.result.addrList.rows;
                }
                popUp_close();
            },false);
        },
        //初始化数据
        initDefaultFlag:function(){
            var temp = this;
            $.each( this.addressList,function(index,address){
                if(address.isdefault == 1){
                    Vue.set(address,'defaultFlag',true);
                }else{
                    Vue.set(address,'defaultFlag',false);
                }
            });

            //获取页面正在使用的地址
            $.each( this.addressList,function(index,address){
                if(temp.submitInfo.address == $(this).attr("id")){
                    Vue.set(address,'isCheckedAddress',true);
                }else{
                    Vue.set(address,'isCheckedAddress',false);
                }
            });
        },
        //去新增地址页面
        gotoAddAddress:function(addressId){
                deleteJSONFiled(this.submitInfo,"addressId")
                window.location.href = "../../../html/12_maiJiaZhongXin/04_deliveryAddress/4_shouHuoDiZhi_shouHuoDiZhi.html?addressId="+addressId + "&" + $.assemblyRequestString(this.submitInfo);
        },
        //删除地址
        delAddress:function(address){
            var temp =this;
            popUp_open();
            $.jsonAjaxPost(getUrl('buyer/deladdr'),{addr:address.id},function(data, status, xhr){
                if(data.success){
                    temp.addressList.removeByValue(address);
                }
                popUp_close();
            },false);
        },
        //设置默认地址
        setDefault:function(address){
            var temp =this;
            popUp_open();
            $.jsonAjaxPost(getUrl('buyer/modifyDefAddr'),{id:address.id,defaultFlag:address.defaultFlag},function(data, status, xhr){
                if(data.success){
                    //获取用户地址信息
                    temp.getDeliveryAddress();
                    //初始化默认是否是默认地址
                    temp.initDefaultFlag();
                }
                popUp_close();
            },false);
        },
        //此页面由订单核对页跳转而来将此返回回去
        orderChecked:function(address){
        	if(this.submitInfo.shopType == 2){
        		this.submitInfo.tradeMark = 1;
        	}else{
        		this.submitInfo.tradeMark = 0;
        	}
            if( this.submitInfo.address == address.id){
                this.submitInfo.changeFlag = false;

                //如果存在修改了 当前地址，那么需要重新请求数据
                if(this.submitInfo.updateAddressId && this.submitInfo.updateAddressId  == address.id){
                    this.submitInfo.changeFlag = true;
                }

            }else{
                this.submitInfo.address = address.id;
            }
            window.location = "../../../html/16_dingDanHeDui/dingDanHeDui.html?"+ $.assemblyRequestString(this.submitInfo);
        },
    },
    computed:{

    },
    beforeMount:function(){
        this.submitInfo = $.getUrlJson();
        Vue.set(this.submitInfo,'changeFlag',true);
        //获取用户地址信息
        this.getDeliveryAddress();
        //初始化默认是否是默认地址
        this.initDefaultFlag();
    },
    mounted:function(){

    },
    beforeUpdate:function(){

    },
    updated:function(){

    },
    watch:{
    }

});