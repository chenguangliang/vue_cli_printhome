/**
 * Created by linxiaomei on 2017/6/28.
 */
$('#date-range').click(function(evt)
{
    evt.stopPropagation();
    $('#date-range').data('dateRangePicker').close();
});
var skuId = $.getUrlParam("skuId");
var itemId = $.getUrlParam("itemId");
var attrName = $.getUrlParam("attrName");


var saleStateVM = new Vue({
    el:"#saleState",
    data:{
        imgUrl: img_url,
        itemInfo:{},
        itemInfoAttr:'',
        dealDateList:[],
        sellPriceTotalList:[],
        sellTotalNumList:[],
        showList:[],
        echatsDatas:{
            legendData:[],
            seriesName:'',
            seriesData:[]
        },
        startDate:'',
        endDate:''
    },
    methods:{
        getSaleInfoByItemId: function (pSkuId,pItemId) {
            var temp = this;
            popUp_open();
            $.jsonAjax(getUrl("salesAnalysis/getSKUSellLineById"), {skuId:pSkuId,itemId:pItemId}, function (data, status, xhr) {
                popUp_close();
                temp.itemInfo = data.itemInfo;
                temp.itemInfoAttr = attrName;
                temp.dealDateList = data.dealDateList;
                temp.sellPriceTotalList = data.sellPriceTotalList;
                temp.sellTotalNumList = data.sellTotalNumList;
            },false);
            this.buildShowList(this.dealDateList,this.sellPriceTotalList,this.sellTotalNumList);
        },
        buildShowList: function (dateList,priceList,numList) {
            for(var i=dateList.length-1;i>=0;i--){
                var showData = {
                    dateTime:dateList[i],
                    price:priceList[i],
                    num:numList[i]
                }
                this.showList.push(showData);
            }
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
        showPageChat: function (type) {
            //初始化页面数据
            if(type == 'price'){
                this.echatsDatas.seriesData = this.sellPriceTotalList;
                this.echatsDatas.legendData = ['销售额'];
                this.echatsDatas.seriesName = '销售额';
            }else if(type == 'num'){
                this.echatsDatas.seriesData = this.sellTotalNumList;
                this.echatsDatas.legendData = ['销售量'];
                this.echatsDatas.seriesName = '销售量';
            }

            this.buildEchats();
        },
        queryDateByDate: function () {
            var temp = this;
            var queryData = {
                skuId: skuId,
                startDate: this.startDate,
                endDate: this.endDate,
                dayNum: DateDiff(this.startDate, this.endDate) + 1
            }
            popUp_open();
            $.jsonAjax(getUrl("salesAnalysis/analysisByDate"), queryData, function (data, status, xhr) {
                popUp_close();
                if (data) {
                    temp.dealDateList = data.dealDateList;
                    temp.sellPriceTotalList = data.sellPriceTotalList;
                    temp.sellTotalNumList = data.sellTotalNumList;

                    temp.showList = [];//清空列表内容重新建立
                    temp.buildShowList(temp.dealDateList, temp.sellPriceTotalList, temp.sellTotalNumList);

                    temp.buildEchats();
                }
            });

        }
    },
    beforeMount:function(){
        this.getSaleInfoByItemId(skuId,itemId);
        this.showPageChat('price');
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
});

function initCase(){
    $('.shangPinLieBiao .theTop').click(function(){
        $(this).next().slideToggle().parents().siblings().children('.shuXing').hide();
    });
    $('.shuXing ul li').click(function(){
        $(this).addClass('on').siblings().removeClass('on');
    });
    $('.xuanXiangKa .qieHuan').click(function(){
        $('.xuanXiangKa,.lieBiao').hide();
        $('.tongJiTu').show();
    });
    $(".tongJiTu ul li").click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
        var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
        $(".tu > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
    });
    $('.tongJiTu .qieHuan').click(function(){
        $('.tongJiTu').hide();
        $('.xuanXiangKa,.lieBiao').show();
    });
}



//计算天数差的函数，通用
function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式
    var time = new Date(sDate2).getTime() - new Date(sDate1).getTime() ;
    return Math.floor(time/(24*60*60*1000))
}