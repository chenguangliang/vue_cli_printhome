/**
 * Created by Administrator on 2017/3/21 0021.
 */
/**
*@fileName:vueDirective.js
*@author:fdc
*@time:2017/3/21 0021
*@disc:自定义指令标签
 *
*/

Vue.directive('substring',{
    bind:function(el, binding, vnode){
        var start = binding.value[0];
        var end = binding.value[1];
        el.innerHTML = el.innerHTML.replace(/\s+/g, '').replace(/(nbsp;|&amp;)+/g, '').substring(start,end);
    }
});

/**
 * 截取字符串，超过的长度使用 ... 表示
 */
Vue.directive('substring1',{
    bind:function(el, binding, vnode){
        var start = binding.value[0];
        var end = binding.value[1];
        var inHTML = el.innerHTML.replace(/\s+/g, '').replace(/(nbsp;|&amp;)+/g, '').substring(start,end)+"";
        if(el.innerHTML.length > (end-start)){
            inHTML = inHTML+"...";
        }
        el.innerHTML= inHTML;
    }
});


