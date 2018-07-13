//author wallace 华dee
//2015 7 3
//qq447363121陈国华
import $ from "jquery"
import {iScroll} from "./iscroll"
let myScroll
let refresher = {
	info:{
	"pullDownLable":"下拉刷新...",
	"pullingDownLable":"松开刷新...",
	"pullUpLable":"",
	"pullingUpLable":"松开加载更多...",
	"loadingLable":"加载中..."
	},
	init:function(parameter){
	var wrapper=document.getElementById(parameter.id);

	var div=document.createElement("div");
		div.id="scroller";
		wrapper.appendChild(div);

	var scroller=document.getElementById("scroller");
	var list=document.querySelector(".wrapScrool");
		scroller.insertBefore(list,scroller.childNodes[0]);

	var pullDown=document.createElement("div");
		pullDown.id="pullDown";
	var loader=document.createElement("div");
		loader.className="loader";
	for(var i=0;i<4;i++){
		var span=document.createElement("span");
		loader.appendChild(span);
		}
		pullDown.appendChild(loader);

	var pullDownLabel=document.createElement("div");
		pullDownLabel.className="pullDownLabel";
		pullDown.appendChild(pullDownLabel);
		var suolueResult=document.getElementsByClassName("wrapScrool");
		//scroller.insertBefore(pullDown,scroller.childNodes[0]);
		suolueResult[0].insertBefore(pullDown,suolueResult[0].childNodes[2]);

		var pullUp=document.createElement("div");
		pullUp.id="pullUp";
		var loader=document.createElement("div");
		loader.className="loader";
	for(var i=0;i<4;i++){
		var span=document.createElement("span");
		loader.appendChild(span);
		}
		pullUp.appendChild(loader);

		var pullUpLabel=document.createElement("div");
		pullUpLabel.className="pullUpLabel";
		var content=document.createTextNode(refresher.info.pullUpLable);
		pullUpLabel.appendChild(content);
		pullUp.appendChild(pullUpLabel);

		scroller.appendChild(pullUp);
		//create dom above
		//create dom ,you can wirte it yourself
	var pullDownEl = document.getElementById('pullDown');
	var pullDownOffset = pullDownEl.offsetHeight||30;
		//console.log(pullDownOffset);
	var pullUpEl = document.getElementById('pullUp');
	var pullUpOffset =pullUpEl.offsetHeight||30;
		//parameter
	let myScroll=this.scrollIt(parameter,pullDownEl,pullDownOffset,pullUpEl,pullUpOffset);
	return myScroll
	},

	scrollIt:function(parameter,pullDownEl,pullDownOffset,pullUpEl, pullUpOffset){
    let myScroll = new iScroll(parameter.id, {
		useTransition: true,
		vScrollbar: false, //hide the iscroll v bar
		topOffset: pullDownOffset,
		onRefresh: function () {
			refresher.onRelease(pullDownEl,pullUpEl);
		},
		onScrollMove: function () {
			refresher.onScrolling(this,pullDownEl,pullUpEl,pullUpOffset);//element
		},
		onScrollEnd: function () {
			refresher.onPulling(pullDownEl,parameter.pullDownAction,pullUpEl,parameter.pullUpAction);
			//这是为店铺首页写的，滑动结束执行
			function shopIndexScroll() {
				var tansY=scrollerTranY();
				var winW = document.documentElement.clientWidth;
				var a=winW/640;
				if (tansY <= -(a*260)) {
					$(".top_wrapper").css('background', 'rgba(255,255,255,1)');
					$(".fixed_btn").css("display", "block");
				}else {
					if(window.location.href.indexOf("showShopInfo=false")!=-1){
						return false
					}
					$(".top_wrapper").css('background', 'rgba(255,255,255,0.6)');
					$(".fixed_btn").css("display", "none");
				}
			}
			if($(".shopFlag").length){
				shopIndexScroll();
			}else{}
		   //回到顶部公共方法
			function orderCheckToTop() {
				var tansY = scrollerTranY();
				var winH = document.documentElement.clientHeight;
				if (tansY <= -winH) {
					  $("#top").show();
				}else {$("#top").hide();}
			}//对账单添加回到顶部
			if(window.location.href.indexOf("duiZhangDanGuanLi.html")>-1){
				orderCheckToTop();
			}//消息中心添加回到顶部
			if(window.location.href.indexOf("xiaoXiZhongXin.html")>-1){
				orderCheckToTop();
			}//快速下单列表添加回到顶部
            if(window.location.href.indexOf("quickOrderList")>-1){
                orderCheckToTop();
            }//物资管理回到顶部
            if(window.location.href.indexOf("8_materialList")>-1){
                orderCheckToTop();
            }//发票管理回到顶部
            if(window.location.href.indexOf("22_invoiceManage")>-1){
                orderCheckToTop();
            }
		}
	});
	 setTimeout(function(){pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable},300);
	 // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    return myScroll;
	},

	//things loader css on scrolling,you can wirte it yourself
	onScrolling:function(e,pullDownEl,pullUpEl,pullUpOffset){
		if (e.y>-(pullUpOffset)) {
		pullDownEl.className = '';
		pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
		e.minScrollY =-pullUpOffset;
			}
		if (e.y > 0) {
				pullDownEl.className = 'flip';
			$("#pullDown").css({"height":"0.6rem"});//改为0.6rem，可以显示出来加载中...
				pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullingDownLable;
				e.minScrollY = 0;
			}
			if ( e.scrollerH < e.wrapperH && e.y < (e.minScrollY-pullUpOffset) || e.scrollerH > e.wrapperH && e.y< (e.maxScrollY - pullUpOffset) ) {
				document.getElementById("pullUp").style.display="block";
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML =refresher.info.pullingUpLable;
			}
			 if (e.scrollerH < e.wrapperH && e.y > (e.minScrollY-pullUpOffset) && pullUpEl.className.match('flip') || e.scrollerH > e.wrapperH && e.y > (e.maxScrollY - pullUpOffset) && pullUpEl.className.match('flip')) {
				document.getElementById("pullUp").style.display="none";
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML =  refresher.info.pullUpLable;
			}
		},

	//things loader css on release,you can wirte it yourself
  onRelease:function (pullDownEl,pullUpEl){
	if (pullDownEl.className.match('loading')) {
		pullDownEl.className = '';
		pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
		pullDownEl.querySelector('.loader').style.display="none";
	    pullDownEl.style.lineHeight=pullDownEl.offsetHeight+"px";
				}
	if (pullUpEl.className.match('loading')) {
		pullUpEl.className = '';
		pullUpEl.querySelector('.pullUpLabel').innerHTML =refresher.info.pullUpLable;
		pullUpEl.querySelector('.loader').style.display="none";
		//pullUpEl.style.lineHeight=pullDownEl.offsetHeight+"px";
			}
},
	//things loader css on pulling,you can wirte it yourself
	onPulling:function (pullDownEl,pullDownAction,pullUpEl,pullUpAction){
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML =refresher.info.loadingLable;

				pullDownEl.querySelector('.loader').style.display="block";
				pullDownEl.style.lineHeight="0.3rem";
				if (pullDownAction)
				pullDownAction();	// Execute custom function (ajax call?)
			}
                 if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.loadingLable;
				pullUpEl.querySelector('.loader').style.display="block";
				pullUpEl.style.lineHeight="0.3rem";
				if (pullDownAction)
				pullUpAction();	// Execute custom function (ajax call?)
			}
			}
	};
export {refresher}

