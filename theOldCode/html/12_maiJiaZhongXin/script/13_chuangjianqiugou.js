
/**
 * 创建求购
 */
$(function(){
})
//新增商品
var categoryes = {};
var qiugou_shangpin = new Vue({
    el:"#qiugou_shangpin",
    data:{
        categoryes:{},
        cid:"",

    },
    beforeCreate: function () {
        $.jsonAjax(getUrl("askItemInfoController/categoryList"),{},function(data,status,xhr){
            if(data.status=="200"){
                categoryes = data.data;
                // console.log(categoryes);
            }else{
                popUp_auto_false(1000, data.msg);
                // window.location = '../html/2_login_sign/login_common.html';
            }
        },false);
    },
    created: function () {
        this.$data.categoryes = categoryes;
    },
    methods: {
        choseCategory:function (cid){
            $("#li_"+this.$data.cid).removeClass('active');
            $("#li_"+cid).addClass('active');
            $("#ul_"+this.$data.cid).hide();
            $("#ul_"+cid).show();
            this.$data.cid = cid;
        },
        onReturn:function (categoryCid,categoryCname) {
            //选中的商品信息添加到求购明细中
            qiugou_xieyiwupin.$data.categoryList.push({categoryCid:categoryCid,categoryCname:categoryCname});

           hideShangpin();
        }
    }
});
//协议物品
var qiugou_xieyiwupin = new Vue({
    el:"#qiugou_xieyiwupin",
    data:{
        categoryList:[],
        detCat:{}
    },
    mixins:[math],
    methods:{
        goToTop:goToTop,
        //点击删除的效果
        shanChu:function(index,categoryCid,categoryCname) {
            this.$data.detCat = {index:index,categoryCid:categoryCid,categoryCname:categoryCname};
            $(this).css('background-image','url(../../img/shanchuhong@3x.png)');
            $('.zhezhao2').show();
        },
        doLast:function () {
            $("#qiugou_xieyiInfo").show();
            $("#qiugou_xieyiwupin").hide();
        },
        doSave:function () {

            if( translationNo == null ||  translationNo == "" ){
                popUp_auto_false(1000, '求购编码必填！');
                return;
            };
            var translationName = $("#translationName").val();
            if( translationName == null ||  translationName == "" ){
                popUp_auto_false(1000, '求购名称必填！');
                return;
            };
            var beginDate = $("#beginDate1").text();
            if( beginDate == null ||  beginDate == "" ){
                popUp_auto_false(1000, '求购日期必填！');
                return;
            };
            var endDate = $("#endDate1").val();
            if( endDate == null ||  endDate == "" ){
                popUp_auto_false(1000, '截至报价日期必填！');
                return;
            };
            var deliveryDate = $("#deliveryDate1").val();
            if( deliveryDate == null ||  deliveryDate == "" ){
                popUp_auto_false(1000, '交货日期必填！');
                return;
            };
            var printerId = $("#printerId").val();
            if( printerId == null ||  printerId == "" ){
                popUp_auto_false(1000, '印刷厂必填！');
                return;
            };
            //求购截至时间、交货时间必须大于求购时间
            var start=new Date(beginDate);
            var end1=new Date(endDate);
            var end2=new Date(deliveryDate);
            if(start > end1){
                popUp_auto_false(1000, '求购截止时间必须大于求购时间！');
                return;
            }
            if(start > end2){
                popUp_auto_false(1000, '交货时间必须大于求购时间！');
                return;
            }
            if($("input[name='nums']").length == 0){
                popUp_auto_false(1000, '请至少选择一件物品进行求购！');
                return;
            }
            $("input[name='nums']").each(function(e){
                if($(this).val() == ""){
                    popUp_auto_false(1000, '请填入正确数量！');
                    throw "请填入正确数量！";
                    $(this).focus();
                }
                if($(this).val() == "0"){
                    popUp_auto_false(1000, '数量必需大于0！');
                    throw "数量必需大于0！";
                    $(this).focus();
                }
            });
            $("input[name='itemNames']").each(function(e){
                if($(this).val() == ""){
                    popUp_auto_false(1000, '物品名称必填！');
                    throw "物品名称必填！";
                    $(this).focus();
                }
            });
            $("input[name='matAttributes']").each(function(e){
                if($(this).val() == ""){
                    popUp_auto_false(1000, '物品属性必填！');
                    throw "物品属性必填！";
                    $(this).focus();
                }
            });
            var category_ids = [];
            var itemNames = [];
            var matAttributes = [];
            var nums = [];
            var flag = [];
            for(var i=0;i<$("input[name='category_ids']").length;i++){
                category_ids[i] = $("input[name='category_ids']")[i].value;
                itemNames[i] = $("input[name='itemNames']")[i].value;
                matAttributes[i] = $("input[name='matAttributes']")[i].value;
                nums[i] = $("input[name='nums']")[i].value;
                flag[i] = $("input[name='flag']")[i].value;
            }
            //跑后台创建求购信息
            var data={
                translationNo:translationNo,
                printerId:printerId,
                translationName:translationName,
                annex:qiugou_xieyiInfo.$data.annex,
                oldFileName:qiugou_xieyiInfo.$data.oldFileName,
                beginDate1:beginDate,
                endDate1:endDate,
                deliveryDate1:deliveryDate,
                remarks:$("#remarks").val(),
                category_ids:category_ids.join(','),
                itemNames:itemNames.join(','),
                matAttributes:matAttributes.join(','),
                nums:nums.join(','),
                flag:flag.join(','),
                deleteId:'',
                ids:''
            }
            $.jsonAjax(getUrl("askItemInfoJavaController/addTranslationInfo"),data,function(data,status,xhr){
                if(data.status = "200"){
                    printAlert("保存成功！",function(){
                        window.location = '13_woDeQiuGou_woDeQiuGou.html'
                    });
                }else{
                    popUp_auto_false(1000, data.msg);
                }
            },false);
        }
    }
});
//协议信息
var uName = '';
var uid = '';
var translationNo = {};
var qiugou_xieyiInfo = new Vue({
    el:"#qiugou_xieyiInfo",
    data:{
        uName:'',
        uid:'',
        translationNo:{},
        annex:'',
        oldFileName:'',
    },
    mixins:[math],
    beforeCreate: function () {
        $.jsonAjax(getUrl("askItemInfoController/askItemInfoCreate"),{},function(data,status,xhr){
            if(data.status=="200"){
                uName = data.data.uName;
                uid = data.data.uid;
                translationNo = data.data.translationNo;
                // console.log(categoryes);
            }else{
                popUp_auto_false(1000, data.msg);
                // window.location = '../2_login_sign/login_common.html';
            }
        },false);
    },
    created: function () {
        this.$data.uName = uName;
        this.$data.uid = uid;
        this.$data.translationNo = translationNo;
    },
    methods:{
        nowDate: function () {
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date();
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();

            return y + '-' + add0(m) + '-' + add0(d);
        },
        getImgUrl:function (name){
            return getImgUrl(name);
        },
        doNext:function(){
            if(
                $('#translationName').val()!=0 &&
                $('#endDate1').val()!=0 &&
                $('#deliveryDate1').val()!=0
            ){
                //求购截至时间、交货时间必须大于求购时间
                var beginDate = $("#beginDate1").text();
                var endDate = $("#endDate1").val();
                var deliveryDate = $("#deliveryDate1").val();
                var start=new Date(beginDate);
                var end1=new Date(endDate);
                var end2=new Date(deliveryDate);
                if(start > end1){
                    popUp_auto_false(1000, "求购截止时间必须大于求购时间！");
                    return;
                }
                if(start > end2){
                    popUp_auto_false(1000, "交货时间必须大于求购时间！");
                    return;
                }
                $("#qiugou_xieyiInfo").hide();
                $("#qiugou_xieyiwupin").show();
            }
            else{
                popUp_auto_false(1000, '请完善信息后继续下一步');
            }
        }
    }
});

//文件上传
function startUpload(){
    var fileInput = $("#fileInput")[0].files[0].name;
    if(fileInput.length>100){
        popUp_auto_false(1000, '文件的名称过长！');
        return false;
    }
    var maxSize = 10240000;
    if ($("#fileInput")[0].files[0].size > maxSize) {
        popUp_auto_false(1000, '上传文件过大！');
        return false;
    }
    var checkUploadKey = getRandom();
    popUp_open();
    $.uploadFile({
        url:getUrl('/fileUpload/fileUploadCrossSize?date='+new Date()), //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'fileInput', //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        data:{
            size:10240000,
        },
        type:"post",
        success: function (data, status){  //服务器成功响应处理函数
            popUp_close();
            if(data.success){
                popUp_auto(1000,"上传成功!");
                qiugou_xieyiInfo.$data.annex = data.result;
                qiugou_xieyiInfo.$data.oldFileName = fileInput;
            }else{
                popUp_auto_false(1500,data.errorMessages);
            }
        },
        error: function (data, status, e){//服务器响应失败处理函数
            console.log(data);
            popUp_close();
        }
    // $.ajaxFileUpload({
    //     url: getUrl('fileUpload/fileUploadCrossSize'), //用于文件上传的服务器端请求地址
    //     secureuri: false, //是否需要安全协议，一般设置为false
    //     fileElementId: 'fileInput', //文件上传域的ID
    //     dataType: 'json', //返回值类型 一般设置为json
    //     data:{
    //         size:10240000,
    //         checkUploadKey: checkUploadKey,
    //     },
    //     type:"post",
    //     success: function (data, status){  //服务器成功响应处理函数
    //         popUp_close();
    //     },
    //     error: function (data, status, e){//服务器响应失败处理函数
    //         $.jsonAjax(getUrl("fileUpload/fixedUploadCrossDomainResult"),{checkUploadKey:checkUploadKey},function(data, status, e){
    //             /**
    //              errorMessages  错误信息
    //              result         上传url
    //              resultMessage  成功信息
    //              success        成功状态
    //              */
    //             popUp_close();
    //             console.log(data)
    //             if(data.success){
    //                 if(!data.result || data.result==null || data.result==""){
    //                     popUp_auto_false(1000, '文件上传失败，请重新上传！');
    //                     return;
    //                 }else{
    //                     qiugou_xieyiInfo.$data.annex = data.result;
    //                     qiugou_xieyiInfo.$data.oldFileName = fileInput;
    //                 }
    //
    //             }else{
    //                 popUp_auto_false(1000, data.errorMessages);
    //             }
    //         });
    //     }
    });
}
function clearFile() {
    qiugou_xieyiInfo.$data.annex = '';
    qiugou_xieyiInfo.$data.oldFileName = '';
}
//显示新增商品
function showShangpin() {
    $("#qiugou_xieyiwupin").hide();
    $("#qiugou_shangpin").show();
}
//隐藏新增商品
function hideShangpin() {
    $("#qiugou_shangpin").hide();
    $("#qiugou_xieyiwupin").show();
}
//取消删除
function quxiaoShanchu() {
    $('.zhezhao2').hide();
}
//确定删除
function quedingShanchu() {
    qiugou_xieyiwupin.$data.categoryList.splice(qiugou_xieyiwupin.$data.detCat.index,1);
    qiugou_xieyiwupin.$data.detCat = {};
    $('.zhezhao2').hide();
    popUp_auto(1000,'商品删除成功')
}
//取消求购
function quxiaoQiugou() {
    $('.zhezhao').show();
}
function getRandom(){
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for(var i = 0; i < 4 ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return new Date().getTime() + res;
}