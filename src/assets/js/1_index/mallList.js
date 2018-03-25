//点击左侧类目切换右侧内容
var nav =document.getElementById("main-l-ul");
var navlist = nav.children;
var con = document.getElementById("main-r");
var conlist = con.children;
for (var i= 0;i<navlist.length;i++){
    navlist[i].index = i;
    navlist[i].onclick = function (){
        for (var m = 0;m< conlist.length;m++){
            navlist[m].className = "";
            conlist[m].style.display ="none";
        }
        this.className = "active";
        conlist[this.index].style.display = "block";
    }
}
$('.title').click(function(){
    $(this).css('background','#c30d23');
});
$('.neiRong a').click(function(){
    $(this).css({'background':'#e60012','color':'#fff'});
});
