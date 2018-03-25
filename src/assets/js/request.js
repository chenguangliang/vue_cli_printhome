//let server_url="http://testwx.printhome.com/mall-web";
var server_url="http://wx.printhome.com/mall-web";
//let server_url="http://192.168.1.211:8095/mall-web";
// let server_url="http://localhost:8080/mall-web";
//let server_url="http://devwx.printhome.com:8080/mall-web";
//let server_url="http://192.168.1.147:8095/mall-web"; //冬藏
var img_url="http://img.printhome.com/imgs/";
var img_url_cgl="http://img.printhome.com/imgs";
var commonPlatformId = 3;
var varants_commonPlatformId = "commonPlatformId";
//本地获取uid字符串
var currentUserUid = "currentUserUid";
//本地获取当前用户信息字符串
var currentUserInfo = "currentUserInfo";
//购物车获取缓存key
var myCartKey = "myCartKey";
/**
 * 获取接口地址
 * @param name 接口名
 * @returns {string}
 */
function getUrl(name){
    return server_url+"/"+name;
}
function log(value) {
    console.log(value);
}
function log_info(value) {
    console.info(value);
}
function log_debug(value) {
    console.debug(value);
}
function log_warn(value) {
    console.warn(value);
}
function log_error(value) {
    console.error(value);
}

/**
 * 获取图片路径
 * @param name 图片链接
 * @returns {string}
 */
function getImgUrl(name){
    return img_url+name;
}
/**
 * 获取val
 * @param name
 * @returns {*|jQuery}
 */
function getval(name){
    return $(""+name+"").val();
}
/**
 * 判断请求状态
 * @param data
 * @returns {boolean}
 */
function flag_status(data){
    if(data.status == "200"){
        return true;
    }else{
        return false;
    }
}
/**
 * 错误返回码
 * @param data
 */
function msg(data){

    popUp_auto(data.msg,null);
}
/**
 * 获取图片验证码
 */
function getImgCode(){
    return getUrl("user/acquire");
}


// 广告点击量统计
function adVisit(id,url,type){
    $.ajax({
        url: getUrl("adVisit"),
        type: "post",
        data: {
            "id": id,
            "type": type
        }
    });
    var url = url.indexOf("http") == 0 ? url : ( "http://" + url );
    window.location = url;
    //window.open(url);
}


function ajaxError(XMLHttpRequest, textStatus, errorThrown){
    console.log(XMLHttpRequest);
    console.log(textStatus);
    console.log(errorThrown);
    if(XMLHttpRequest.status == "999"){
        var referer = XMLHttpRequest.responseJSON.result;
        if(referer){
            window.location="../../html/2_login_sign/login_common.html?referer="+referer;
        }else{
            window.location="../../html/2_login_sign/login_common.html";
        }
    }
}

/**
*@fileName:request.js
*@author:fdc
*@time:2017/3/31 0031
*@disc:设置请求方法的平台id
*/
function setPlatformId(data){
    data.commonPlatformId = commonPlatformId;
};
/**
 * jQuery Eova Common
 */
(function ($) {



    /**
     * 拓展全局静态方法
     */
    $.extend({

        /**追加标签**/
        addHtml:function(k,v){
            $(""+k+"").append(v);
        },
        /** 同步Post **/
        syncPost: function (url, data, success) {
            $.ajax({
                async: false,
                type: 'POST',
                url: url,
                data: data,
                success: success,
                dataType: "json"
            });
        },
        /** 异步Post **/
        asyncPost: function (url, data, success) {
        	$.ajax({
        		async: true,
        		type: 'POST',
        		url: url,
        		data: data,
        		success: success,
        		dataType: "json"
        	});
        },
        /** 同步获取JSON **/
        syncGetJson: function (url, success) {
            $.ajax({
                async: false,
                type: 'GET',
                url: url,
                success: success,
                dataType: "json"
            });
        },
        /** 异步获取JSON **/
        asyncGetJson: function (url, success) {
        	$.ajax({
        		async: true,
        		type: 'GET',
        		url: url,
        		success: success,
        		dataType: "json"
        	});
        },
        /** Html转义 **/
        encodeHtml: function (s) {
            return (typeof s != "string") ? s :
                s.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
                    function ($0) {
                        var c = $0.charCodeAt(0), r = ["&#"];
                        c = (c == 0x20) ? 0xA0 : c;
                        r.push(c);
                        r.push(";");
                        return r.join("");
                    });
        },
        /** 获取URL参数 **/
        getUrlPara: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return;
        },
        /** 获取URL QueryString **/
        getUrlParas: function () {
        	var url = location.href;
        	if(url.indexOf("?") == -1){
        		return;
        	}
        	return url.substring(url.indexOf("?")+1,url.length);
        },
        /** 获取Form参数对象-用于Post请求 **/
        getFormParasObj: function (form) {
        	var o = {};
    		$.each(form.serializeArray(), function(index) {
    			if (o[this['name']]) {
    				o[this['name']] = o[this['name']] + "," + this['value'];
    			} else {
    				o[this['name']] = this['value'];
    			}
    		});
    		return o;
        },
        /** 获取Form参数字符-用于get请求 **/
        getFormParasStr: function (form) {
        	var o = "";
        	$.each(form.serializeArray(), function(index) {
        		var key = this['name'], val = this['value'];
        		if(val && val.length > 0){
        			o = o + key + "=" + val + "&";
        		}
        	});
        	return o.substring(0, o.length-1);
        },
        /** 获取浏览器类型 **/
        getBrowser: function() {
        	var explorer = window.navigator.userAgent;
			if (explorer.indexOf("MSIE") >= 0) {
				return 'ie';
			} else if (explorer.indexOf("Firefox") >= 0) {
				return 'firefox';
			} else if (explorer.indexOf("Chrome") >= 0) {
				return 'chrome';
			} else if (explorer.indexOf("Opera") >= 0) {
				return 'opera';
			} else if (explorer.indexOf("Safari") >= 0) {
				return 'safari';
			}
        },

        /*跨域获取数据*/
       jsonpAjax : function(url,data,success){
           setPlatformId(data);
           $.ajax({
               url:url,
               data:data,
               dataType:"jsonp",
               crossDomain: true,
               success:success,
               jsonpCallback:"jsonpCallback",
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   console.log(XMLHttpRequest);
                   console.log(textStatus);
                   console.log(errorThrown);
               }
           });
        },
        /*跨域获取数据*/
        jsonpAjax : function(url,data,success,async){
            setPlatformId(data);
            $.ajax({
                url:url,
                data:data,
                async:async,
                dataType:"jsonp",
                crossDomain: true,
                success:success,
                jsonpCallback:"jsonpCallback",
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        jsonAjaxNop:function(url,data,success){
            $.ajax({
                url:url,
                data:data,
                dataType:"json",
                success:success,
                beforeSend: function( xhr ) {
                    xhr.setRequestHeader('X-Requested-With', {toString: function(){ return 'XMLHttpRequest'; }});
                },
                xhrFields: {
                    withCredentials: true
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    ajaxError(XMLHttpRequest, textStatus, errorThrown)
                },
            });

        },

        jsonAjax:function(url,data,success){
            setPlatformId(data);
            $.ajax({
                url:url,
                data:data,
                dataType:"json",
                success:success,
                beforeSend: function( xhr ) {
                    xhr.setRequestHeader('X-Requested-With', {toString: function(){ return 'XMLHttpRequest'; }});
                },
                xhrFields: {
                    withCredentials: true
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    ajaxError(XMLHttpRequest, textStatus, errorThrown)
                },
            });

        },
        jsonAjax:function(url,data,success,async){
            setPlatformId(data);
            $.ajax({
                url:url,
                data:data,
                dataType:"json",
                async:async,
                success:success,
                beforeSend: function( xhr ) {
                    xhr.setRequestHeader('X-Requested-With', {toString: function(){ return 'XMLHttpRequest'; }});
                },
                xhrFields: {
                    withCredentials: true
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    ajaxError(XMLHttpRequest, textStatus, errorThrown)
                },
            });

        },
        jsonAjaxPost:function(url,data,success){
            setPlatformId(data);
            $.ajax({
                url:url,
                data:data,
                dataType:"json",
                type:"post",
                success:success,
                beforeSend: function( xhr ) {
                    xhr.setRequestHeader('X-Requested-With', {toString: function(){ return 'XMLHttpRequest'; }});
                },
                xhrFields: {
                    withCredentials: true,
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    ajaxError(XMLHttpRequest, textStatus, errorThrown)
                },
            });

        },
        jsonAjaxPost:function(url,data,success,async){
            setPlatformId(data);
            $.ajax({
                url:url,
                data:data,
                dataType:"json",
                type:"post",
                async:async,
                success:success,
                beforeSend: function( xhr ) {
                    xhr.setRequestHeader('X-Requested-With', {toString: function(){ return 'XMLHttpRequest'; }});
                },
                xhrFields: {
                    withCredentials: true
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    ajaxError(XMLHttpRequest, textStatus, errorThrown)
                },
            });

        },
        jsonStringAjaxPost:function(url,data,success){
            setPlatformId(data);
            $.ajax({
                url:url,
                data:JSON.stringify(data),
                dataType:"json",
                contentType: "application/json; charset=utf-8",
                type:"post",
                success:success,
                beforeSend: function( xhr ) {
                    xhr.setRequestHeader('X-Requested-With', {toString: function(){ return 'XMLHttpRequest'; }});
                },
                xhrFields: {
                    withCredentials: true,
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    ajaxError(XMLHttpRequest, textStatus, errorThrown)
                },
            });

        },

        jsonStringAjaxPost:function(url,data,success,async){
            setPlatformId(data);
            $.ajax({
                url:url,
                data:JSON.stringify(data),
                dataType:"json",
                contentType: "application/json; charset=utf-8",
                type:"post",
                async:async,
                success:success,
                beforeSend: function( xhr ) {
                    xhr.setRequestHeader('X-Requested-With', {toString: function(){ return 'XMLHttpRequest'; }});
                },
                xhrFields: {
                    withCredentials: true,
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    ajaxError(XMLHttpRequest, textStatus, errorThrown)
                },
            });

        },


        /**
         * 获取浏览器参数方法
         * @param name
         * @returns {null}
         */
        getUrlParam : function (key) {
            var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
            var result = window.location.search.substr(1).match(reg);
            return result?decodeURIComponent(result[2]):null;
        },

        /**
         *@fileName:jsonUtil.js
         *@author:fdc
         *@time:2017/3/28 0028
         *@disc:将json对象拼装为浏览器get请求对象字符串
         * {id:1,name:'zhangsan'}
         * id=1&name=zhangsan
         */

        assemblyRequestString : function(sourceJson){
            var  temp = "";
            for(var key in sourceJson){
                temp =temp + key + "=" + encodeURIComponent(sourceJson[key]) + "&";
            }
            return temp.substring(0,temp.length-1);
        },

        /**
         *@fileName:jsonUtil.js
         *@author:fdc
         *@time:2017/3/28 0028
         *@disc:将浏览器所有参数封装成对象
         */
         getUrlJson :function (){
            var result = {};
            var name,value;
            var str=location.href; //取得整个地址栏
            var num=str.indexOf("?");
            str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
            var arr=str.split("&"); //各个参数放到数组里
            for(var i=0;i < arr.length;i++){
                num=arr[i].indexOf("=");
                if(num>0){
                    name=arr[i].substring(0,num);
                    value=arr[i].substr(num+1);
                    result[name]=decodeURIComponent(value);
                }
            }
            return result;
        }
    });
})(jQuery);

import jQuery from "jquery";
export default {
  server_url:server_url,
  img_url:img_url,
  commonPlatformId:commonPlatformId,
  varants_commonPlatformId:varants_commonPlatformId,
  currentUserUid:currentUserUid,
  currentUserInfo:currentUserInfo,
  myCartKey:myCartKey,
  getUrl:getUrl,
  getImgUrl:getImgUrl,
  getval:getval,
  flag_status:flag_status,
  getImgCode:getImgCode,
  adVisit:adVisit,
  ajaxError:ajaxError,
  setPlatformId:setPlatformId
}




