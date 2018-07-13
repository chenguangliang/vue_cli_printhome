document.write('<section class="popUp_auto"><div id="send_msg"><div><div id="send_msgPic"></div></div><div class="msg_fir"></div><div class="msg_sec"></div></div></section>');
document.write('<section class="popUp_auto_false"><div id="send_msg_false" ><div><div id="send_msg_falsePic"></div></div><div class="msg_fir"></div><div class="msg_sec"></div></div></section>');
document.write('<section class="popUp_open"><div id="spinner_wrapper"><div id="spinnerImg"></div></div></section>');

/*var strFullPath=window.document.location.href;
var strPath=window.document.location.pathname;
var pos=strFullPath.indexOf(strPath);
var prePath=strFullPath.substring(0,pos);
var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
var webPath=prePath+postPath;
console.log(prePath);
document.querySelector("#send_msgPic").src=prePath+"/img/duigou.png";
document.querySelector("#send_msg_falsePic").src=prePath+"/img/chahao_bai.png";*/

function popUp_auto(time,msg1, msg2) {
    if (arguments[0] == undefined) {
        time =1500;
    }
    if (arguments[1] == undefined) {
        msg1 = ' ';
    }
    if (arguments[2] == undefined) {
        msg2 = ' ';
    }
    var targetId = $('#send_msg');
    var outerWrap=$(".popUp_auto");
    targetId.find(".msg_fir")[0].innerHTML = msg1;
    targetId.find(".msg_sec")[0].innerHTML = msg2;
    outerWrap.css({'display': 'block'});
    targetId.animate({'opacity': 1}, 400);
    window.setTimeout(function () {
        targetId.animate({'opacity': 0}, 500);
        window.setTimeout(function () {
            outerWrap.css({'display': 'none'});
        }, 500);
    }, time)
}
function popUp_auto_false(time,msg1, msg2) {
    if (arguments[0] == undefined) {
        time =1500;
    }
    if (arguments[1] == undefined) {
        msg1 = ' ';
    }
    if (arguments[2] == undefined) {
        msg2 = ' ';
    }
    var targetId = $('#send_msg_false');
    var outerWrap=$(".popUp_auto_false");
    targetId.find(".msg_fir")[0].innerHTML = msg1;
    targetId.find(".msg_sec")[0].innerHTML = msg2;
    outerWrap.css({'display': 'block'});
    targetId.animate({'opacity': 1}, 400);
    window.setTimeout(function () {
        targetId.animate({'opacity': 0}, 500);
        window.setTimeout(function () {
            outerWrap.css({'display': 'none'});
        }, 500);
    }, time)
}
function popUp_open() {
    var targetId = $('#spinner_wrapper');
    var outerWrap=$(".popUp_open");
    outerWrap.css({'display': 'block'});
    targetId.animate({'opacity': 1}, 400);
}
function popUp_close() {
    var targetId = $('#spinner_wrapper');
    var outerWrap=$(".popUp_open");
    targetId.animate({'opacity': 0}, 400);
    window.setTimeout(function () {
        outerWrap.css({'display': 'none'});
    }, 400);
}