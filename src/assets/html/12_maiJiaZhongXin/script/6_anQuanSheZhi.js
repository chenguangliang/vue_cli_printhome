var userInfo = new Vue({
    el:"#userInfo",
    data:{
        userInfo:'',
        isSeller:''
    },
    beforeMount:function() {
        //用户信息
        StorageUtil.setUserInfo();
        this.userInfo = StorageUtil.getUserInfo();
        this.isSeller = $.getUrlParam("isSeller");
        // console.log(this.userInfo)
    }
});
function goBack() {
    if(userInfo.$data.isSeller){
        window.location = '../../html/18_maiJiaZhongXin/14_zhangHuSheZhi_zhangHuSheZhi.html';
    }else{
        window.location = '../../html/12_maiJiaZhongXin/1_geRenXinXi_gengDuoSheZhi.html';
    }
}