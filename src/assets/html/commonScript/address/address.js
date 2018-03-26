/**
 * Created by Administrator on 2017/3/29 0029.
 */


var  address = {
    data:{
        oneAddressList:[],
        twoAddressList:[],
        threeAddressList:[],
    },
    methods:{
        //获取一级地址
        getOneAddress :function(){
            this.oneAddressList =  this.getAddresses('0');
        },
        //获取配送至内容
        getAddresses:function(regionCode){
            var temp = "";
            $.jsonAjax(getUrl("address/query"),
                {id:regionCode},
                function(data,status, xhr){
                    // console.log(data);
                    temp = data;
                },false);
            return temp;
        },
    },
};