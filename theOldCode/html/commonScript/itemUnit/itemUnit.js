
/**
*@fileName:itemUnit.js
*@author:fdc
*@time:2017/5/23
*@disc:获取商品的标准计量单位
 * @depandon web-storage-cache.min.js
*/
//ws缓存
var wsCache = new WebStorageCache({
    // [可选] 'localStorage', 'sessionStorage', window.localStorage, window.sessionStorage
    //        或者其他实现了 [Storage API] 的storage实例.
    //        默认 'localStorage'.
    storage: 'localStorage',
    // [可选]  类型Number，公共超时事件设置。默认无限大
    exp: Infinity
});


var itemUnit = {
    methods:{
        //获取sku的标准计量单位
        getItemUnitByWS:function(skuId){
            //缓存key  uid + skuId + itemUtil
            var temp = StorageUtil.getUserInfo();
            var wsKey = temp.uid + "_"+ skuId + "_"+ "itemUtil";
            var wsValue = wsCache.get(wsKey)
            if(isNotBlank(wsValue) || wsValue == 0){
                return  wsValue;
            }else{
                var result = 0 ;
                $.jsonAjax(getUrl('/itemAttrUnit/findItemAttrVlListBySkuId'),{skuId:skuId},function(data,status,xhr){
                    if(data.size > 0){
                        var rows_ = data.rows;
                        result = rows_[0].decimalLength;
                    }
                },false);
                //每次缓存两分钟
                wsCache.set(wsKey,result,2*60);
                return result;
            }
        },
    }
};