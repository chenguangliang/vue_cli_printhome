//author wallace 华dee
//2015 7 3 
//qq447363121陈国华
var refresher = {
    info: {
        "pullDownLable": "下拉刷新...",
        "pullingDownLable": "松开刷新...",
        "pullUpLable": "上拉加载...",
        "pullingUpLable": "松开加载更多...",
        "loadingLable": "加载中..."
    },
    init: function (parameter) {
        var wrapper = document.getElementById(parameter.id);//获取id为wrapper的大div
        //var div = document.createElement("div");
        //div.id = "scroller";
        //wrapper.appendChild(div);//wrapper大div后边添加一个div，id为scroller

        var scroller = document.getElementById("scroller");//直接包含ul的div
        var list = document.querySelector(".wrapScrool");//获取ul，就是滑动的块，里面包着所有li
        //scroller.insertBefore(list, scroller.childNodes[0]);

        var pullDown = document.createElement("div");
        pullDown.id = "pullDown";
        var loader = document.createElement("div");
        loader.className = "loader";
        for (var i = 0; i < 4; i++) {
            var span = document.createElement("span");
            loader.appendChild(span);
        }
        pullDown.appendChild(loader);

        var pullDownLabel = document.createElement("div");//用来显示-下拉刷新/加载中-等字...
        pullDownLabel.className = "pullDownLabel";
        pullDown.appendChild(pullDownLabel);
        var suolueResult = document.getElementsByClassName("wrapScrool");
        //scroller.insertBefore(pullDown,scroller.childNodes[0]);
        suolueResult[0].insertBefore(pullDown, suolueResult[0].childNodes[2]);//给第一个ul的第一个子元素前加下拉标签

        var pullUp = document.createElement("div");
        pullUp.id = "pullUp";
        var loader = document.createElement("div");
        loader.className = "loader";
        for (var i = 0; i < 4; i++) {
            var span = document.createElement("span");
            loader.appendChild(span);
        }
        pullUp.appendChild(loader);

        var pullUpLabel = document.createElement("div");
        pullUpLabel.className = "pullUpLabel";
        var content = document.createTextNode(refresher.info.pullUpLable);
        pullUpLabel.appendChild(content);
        pullUp.appendChild(pullUpLabel);

        scroller.appendChild(pullUp);//在ul的最后边加上拉加载
        //create dom above
        //create dom ,you can wirte it yourself
        var pullDownEl = document.getElementById('pullDown');
        var pullDownOffset = pullDownEl.offsetHeight;
        var pullUpEl = document.getElementById('pullUp');
        var pullUpOffset = pullUpEl.offsetHeight;
        //parameter，这一步调用iScroll,初始化了iScroll对象
        this.scrollIt(parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset);
    },
    //下面这个函数是要初始化iScroll对象
    scrollIt: function (parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset) {
        myScroll = new iScroll(parameter.id, {
            useTransition: true,
            vScrollbar: false, //hide the iscroll v bar
            topOffset: pullDownOffset,
            onRefresh: function () {//这个iScroll默认参数是重新计算的函数
                refresher.onRelease(pullDownEl, pullUpEl);
                //console.log("重新计算");
            },
            onScrollMove: function () {//这个iScroll默认参数是拉动的过程中执行的函数(不管上拉还是下拉)
                refresher.onScrolling(this, pullDownEl, pullUpEl, pullUpOffset);//element
                //console.log("拉动过程中一直触发");
            },
            onScrollEnd: function () {//这个iScroll默认参数是拉动结束后执行的函数(不管上拉还是下拉)
                refresher.onPulling(pullDownEl, parameter.pullDownAction, pullUpEl, parameter.pullUpAction);
                //console.log("拉动结束后触发");
            }
        });
        setTimeout(function () {
            pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable
        }, 300);
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    },

    //滑动时的回调
    onScrolling: function (e, pullDownEl, pullUpEl, pullUpOffset) {
        if (e.y > -(pullUpOffset)) {
            pullDownEl.className = '';
            pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
            e.minScrollY = -pullUpOffset;
        }
        if (e.y > 0) {
            pullDownEl.className = 'flip';
            $("#pullDown").css({"height": "0.5rem"});//改为0.6rem，可以显示出来加载中...
            pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullingDownLable;
            e.minScrollY = 0;
        }
        if (e.scrollerH < e.wrapperH && e.y < (e.minScrollY - pullUpOffset) || e.scrollerH > e.wrapperH && e.y < (e.maxScrollY - pullUpOffset)) {
            document.getElementById("pullUp").style.display = "block";
            pullUpEl.className = 'flip';
            pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullingUpLable;
        }
        if (e.scrollerH < e.wrapperH && e.y > (e.minScrollY - pullUpOffset) && pullUpEl.className.match('flip') || e.scrollerH > e.wrapperH && e.y > (e.maxScrollY - pullUpOffset) && pullUpEl.className.match('flip')) {
            document.getElementById("pullUp").style.display = "none";
            pullUpEl.className = '';
            pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullUpLable;
        }
    },

    //松开手指时，加载器的样式，可自己定义
    onRelease: function (pullDownEl, pullUpEl) {
        if (pullDownEl.className.match('loading')) {
            pullDownEl.className = '';
            pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
            pullDownEl.querySelector('.loader').style.display = "none";
            pullDownEl.style.lineHeight = pullDownEl.offsetHeight + "px";
        }
        if (pullUpEl.className.match('loading')) {
            pullUpEl.className = '';
            pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullUpLable;
            pullUpEl.querySelector('.loader').style.display = "none";
            //pullUpEl.style.lineHeight=pullDownEl.offsetHeight+"px";
        }
    },

    //滑动后松开后的回调
    onPulling: function (pullDownEl, pullDownAction, pullUpEl, pullUpAction) {
        if (pullDownEl.className.match('flip')) {
            pullDownEl.className = 'loading';
            pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.loadingLable;

            pullDownEl.querySelector('.loader').style.display = "block";
            pullDownEl.style.lineHeight = "0.3rem";
            if (pullDownAction)
                pullDownAction();	// Execute custom function (ajax call?)
        }
        if (pullUpEl.className.match('flip')) {
            pullUpEl.className = 'loading';
            pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.loadingLable;
            pullUpEl.querySelector('.loader').style.display = "block";
            pullUpEl.style.lineHeight = "0.3rem";
            if (pullDownAction)
                pullUpAction();	// Execute custom function (ajax call?)
        }
    }
};