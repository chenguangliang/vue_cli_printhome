//TODO:把常用的组件也挂到原型上，https://blog.csdn.net/sinat_17775997/article/details/78390993
import router from "../router"
import popup from "../components/popup.vue"


function install(Vue,options) { //这个就是写vue插件的方法，Vue.use()
  Vue.prototype.goBack = function (){//把返回上一步写在Vue的原型上，这样全局可用，不用重复import
    window.history.length>1?router.go(-1):router.push('/');
  };
  Vue.component(popup.name,popup);//挂载全局组件，多个就用 const components = [b,c]; components.map(component => {Vue.component(component.name, component);});
}
export default {
  install
}
