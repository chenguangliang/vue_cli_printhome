/**
 * Created by linxiaomei on 2017/6/19.
 */


$('#date-range').click(function(evt)
{
    evt.stopPropagation();
    $('#date-range').data('dateRangePicker').close();
});
var dataVM = new Vue({
    el:"#jingYing",
    data:{
        orderDealReport:{},
        dealDateList:[],
        payPriceTotalList:[],
        buyPersonNumList:[],
        payGoodsNumList:[],
        orderNumList:[],
        payConversionList:[],
        echatsDatas:{
            legendData:[],
            seriesName:'',
            seriesData:[]
        },
        startDate:'',
        endDate:''
    },
    methods:{
        queryDatas: function () {
            var temp = this;
            popUp_open();
            $.jsonAjax(getUrl("businessAnalysis/init"), {}, function (data, status, xhr) {
                popUp_close();
                if (data) {
                    temp.orderDealReport = data.orderDealReportOutDTO;
                    temp.dealDateList = data.dealDateList;
                    temp.payPriceTotalList = data.payPriceTotalList;
                    temp.buyPersonNumList = data.buyPersonNumList;
                    temp.payGoodsNumList = data.payGoodsNumList;
                    temp.orderNumList = data.orderNumList;
                    temp.payConversionList = data.payConversionList;

                    //初始化页面数据
                    temp.echatsDatas.seriesData = temp.payPriceTotalList;
                    temp.echatsDatas.legendData = ['成交金额'];
                    temp.echatsDatas.seriesName = '成交金额';
                    temp.buildEchats();
                }
            });

        },
        buildEchats: function () {
            var myChart = echarts.init(document.getElementById('myChart'));
            var option = {
                //title : {
                //    text: '数据图'
                //},
                tooltip : {
                    trigger: 'none'
                },
                legend: {
                    selectedMode:false,
                    show:false,
                    data:this.echatsDatas.legendData
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLabel:{
                            interval:0,
                            rotate:30
                        },
                        axisLine:{//x轴、y轴的轴线颜色
                            show: true,
                            lineStyle:{
                                color:"#8e8b8b",
                            }
                        },
                        //axisTick:{//不显示小下脚
                        //    show: false,
                        //},
                        splitLine:{
                            show:false
                        },
                        boundaryGap : false,
                        data : this.dealDateList
                    }
                ],
                grid: { // 控制图的大小，调整下面这些值就可以，
                    x: 60,
                    x2: 10,
                    y2: 50,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                    borderWidth :'0px'
                },
                yAxis : [
                    {
                        type : 'value',
                        splitLine:{
                            show:false
                        },
                        axisLine:{//x轴、y轴的轴线颜色
                            show: true,
                            lineStyle:{
                                color:"#8e8b8b",
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:this.echatsDatas.seriesName,
                        type:'line',
                        stack: '总量',
                        itemStyle : {
                            normal : {
                                lineStyle:{
                                    color:'#f33b3b'
                                }
                            }
                        },
                        data:this.echatsDatas.seriesData
                    }
                ]
            };
             //为echarts对象加载数据
            myChart.setOption(option);
        },
        changeData: function (param) {
            if(param == 'price'){
                this.echatsDatas.seriesData = this.payPriceTotalList;
                this.echatsDatas.legendData = ['成交金额'];
                this.echatsDatas.seriesName = '成交金额';
            }else if(param == 'personNum'){
                this.echatsDatas.seriesData = this.buyPersonNumList;
                this.echatsDatas.legendData = ['购买人数'];
                this.echatsDatas.seriesName = '购买人数';
            }else if(param == 'goodsNum'){
                this.echatsDatas.seriesData = this.payGoodsNumList;
                this.echatsDatas.legendData = ['成交商品数'];
                this.echatsDatas.seriesName = '成交商品数';
            }else if(param == 'orderNum'){
                this.echatsDatas.seriesData = this.orderNumList;
                this.echatsDatas.legendData = ['下单量'];
                this.echatsDatas.seriesName = '下单量';
            }else if(param == 'conversion'){
                this.echatsDatas.seriesData = this.payConversionList;
                this.echatsDatas.legendData = ['成交转化率'];
                this.echatsDatas.seriesName = '成交转化率';
            }
            this.buildEchats();
        },
        queryDateByDate: function () {
            var temp = this;
            var queryData = {
                startDate:this.startDate,
                endDate:this.endDate,
                dayNum:DateDiff(this.startDate,this.endDate)+1
            }
            popUp_open();
            $.jsonAjax(getUrl("businessAnalysis/analysisByDate"), queryData, function (data, status, xhr) {
                popUp_close();
                temp.orderDealReport = data.orderDealReportOutDTO;
                temp.dealDateList = data.dealDateList;
                temp.payPriceTotalList = data.payPriceTotalList;
                temp.buyPersonNumList = data.buyPersonNumList;
                temp.payGoodsNumList = data.payGoodsNumList;
                temp.orderNumList = data.orderNumList;
                temp.payConversionList = data.payConversionList;

                //初始化页面数据
                temp.echatsDatas.seriesData = temp.payPriceTotalList;
                temp.echatsDatas.legendData = ['成交金额'];
                temp.echatsDatas.seriesName = '成交金额';
                temp.buildEchats();
            });
            /*$.jsonAjaxPost(getUrl("businessAnalysis/analysisByDate"), queryData, function (data, status, xhr) {
                popUp_auto(5000,data);
                if (data) {
                    //dataOut = data;

                }
            });*/

        },
    },
    beforeMount:function(){
        this.queryDatas();
        var temp = this;
        $('#date-range').dateRangePicker(
            {
                singleMonth: true,
                showShortcuts: false,
                showTopbar: false,
                format: 'YYYY-MM-DD',
                //batchMode:'week-range',
                autoClose:true,
                language:'cn',
                startDate:'2014-01-01',
                //endDate:formatToday(),
                //maxDays:7,
                separator : ' to ',
                setValue: function(s,s1,s2)
                {
                    if(DateDiff(s1,s2) > 6){
                        popUp_auto_false(1000,"最多选择7天");
                        return;
                    }
                    temp.startDate = s1;
                    temp.endDate = s2;
                },
                extraClass: 'date-range-picker19'
            });
        this.buildEchats();
    },


    mounted:function(){
        initCase();
        this.buildEchats();
    },
    watch: {
        'startDate': function (newvalue, oldvalue) {
            var endate = new Date(this.endDate);
            if(endate>new Date()){
                popUp_auto_false(1500,"结束日期不能大于当前时间");
                return false;
            }
            //执行查询函数
            this.queryDateByDate();
        },
        'endDate': function (newvalue, oldvalue) {
            var endate = new Date(this.endDate);
            if(endate>new Date()){
                popUp_auto_false(1500,"结束日期不能大于当前时间");
                return false;
            }
            //执行查询函数
            this.queryDateByDate();
        }
    }
})


function initCase(){
    //选项卡切换
    $(".xuanXiangKa ul li").click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
        var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
        $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
    });
    $(".tongJiTu ul li").click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
        var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
        $(".tu > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
    });
};


//计算天数差的函数，通用
function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式
    var time = new Date(sDate2).getTime() - new Date(sDate1).getTime() ;
    return Math.floor(time/(24*60*60*1000))
}

