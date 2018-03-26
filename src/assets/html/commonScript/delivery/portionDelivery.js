/**
 * 2018年1月23日09:24:49 fdc
 * 部分发货弹框使用vue.js拼接数据
 * 
 */



var portionDelivery = {
    mixins:[math],
    data: {
    	//默认是第一次发货，默认是剩余全部商品
        deliveryType:"1",
    	//第一次配送弹框
    	fisrtDeliveryDialogShow:false,
    	//第一次配送按钮默认为true
    	allChecked:true,
    	//第一次部分配送按钮默认为false
    	portionChecked:false,
    	//商品div
    	itemsDiv:false,
    	//剩余全部商品div 默认是true
    	remainAllDiv:true,
    	
    	orderJson:{items:[{itemUnit:""}],
    		orderId:"",
    		shopId:"",
    		shopName:"",
    		existPortionDelivery:false,},
    	//物流公司	
    	deliveryCompanys:[],
    	//非第一次配送dialog
    	otherDeliveryDialog:false,
    	//非第一次配送code
    	deliveryCompanyCode:"",
    	//快递号
    	deliveryNumber:"",
    	//备注
    	deliveryRemark:"",
    	//查看物流信息
    	portionDeliveryDialogShow:false,
    	//查看物流
    	itemInfo:{deliveryDTOs:[{deliveryContexts:[]}]},
    	//修改物流弹框
    	portionDeliveryDialogUpdateShow:false,
    },
    methods: {
    	//根据id查询具体物流信息
    	queryDeliveryById:function(deliveryDTO){
    		var reqData = {
                id:deliveryDTO.id,
                orderItemId: deliveryDTO.orderItemId,
            };
    		//加载数据
            $.jsonAjax(getUrl("/delivery/getDeliveryInfoById"), reqData, function (data, status, xhr) {
                if (data.success) {
                    //页面数据填写
                    Vue.set(deliveryDTO,"deliveryContexts",data.result.pushDelibery.lastResult.data);
                }else{
                    popUp_auto_false(1500,data.errorMessages);
				}
            }, false);
    	},
		//获取所有物流公司
		getCompanyAll:function(){
            var temp = this;
            //加载数据
            $.jsonAjax(getUrl("/delivery/getDeliveryCompanyForJson"), {}, function (data, status, xhr) {
                if (data.success) {
                	console.log(data.result)
                    //页面数据填写
                    temp.deliveryCompanys = data.result;
                }else{
                    popUp_auto_false(1500,data.errorMessages);
                }
            }, false);
		},
    	//获取物流公司名称
    	getCompanyDeliveryName:function(code){
    		var tempCompanyName = "";
    		$.each(this.deliveryCompanys,function(index,item){
    			if(item.code == code){
    				tempCompanyName = item.name;
    				return false;
    			}
    		});
    		return tempCompanyName;
    	},
    	//判断是否已经超过最大数量，如果超过最大数量，那么赋值为最大值
    	checkMax:function(obj,item,attrStr){
    		var maxValue = item.maxValue;
    		var value = obj.currentTarget.value;
    		maxValue = parseFloat(maxValue);
    		value = parseFloat(value);
    		if(value>maxValue){
    			setVueAttrVal(item,attrStr,maxValue);
    		}
    	},
    	//获取商品计量单位，如果存在那么取商品的计量单位，如果不存在那么取0
    	getItemUnitLength:function(itemUnit){
    		if(itemUnit)
    			return itemUnit.decimalLength;
    		return 0;
    	}
    },
    computed:{
    	
   	},

    beforeMount: function () {
    	//获取所有公司数据
    	this.getCompanyAll();
    },
    mounted: function () {
       
    },
    updated:function(){
    	//$('.js-example-basic-single').select2();
    },
    watch:{
    	/* orderJson:function(newValue,oldValue){
    		initClick();
        } */
    }
};