<template>
  <transition name="fade">
        <section class="popUp_auto" v-if="showIndex==1">
          <div id="send_msg">
            <div><div id="send_msgPic"></div></div>
            <div class="msg_fir">{{msg1}}</div>
            <div class="msg_sec">{{msg2}}</div>
          </div>
        </section>
        <section class="popUp_auto_false" v-else-if="showIndex==2">
          <div id="send_msg_false" >
            <div><div id="send_msg_falsePic"></div></div>
            <div class="msg_fir">{{msg1}}</div>
            <div class="msg_sec">{{msg2}}</div>
          </div>
        </section>
        <section class="popUp_open" v-else-if="showIndex==3">
          <div id="spinner_wrapper"><div id="spinnerImg"></div></div>
        </section>
  </transition>
</template>
<script type="text/ecmascript-6">
  /*  使用方法一：组件不全局注册，内部使用
   *  1.父组件import引入组件 配置components:{popup}
   *  2.父组件引用 <popup ref="popup">
   *  3.this.$refs.popup.popUp_auto(1500,111,666);
   *  -------已经挂在到全局了 看install.js----------
   *  使用方法二：组件全局注册
   *  直接在父组件中写<popup ref="popup"> 然后就可以用 this.$refs.popup.popUp_auto(1500,111,666);
   *  注意：不能在export default中配置components:{popup}！ 因为已经全局注册过了！
   */
  import store from '../../store/store'
  import {mapState,mapMutations} from "vuex"
export default {
  name: 'popup',
  data () {
    return {
      msg1:'',
      msg2:'',
      showIndex:0
    }
  },
  methods:{
    popUp_auto(time,msg1, msg2) {
      let temp=this;
      !arguments[0] ? time =1500:'';
       arguments[1] ? temp.msg1 = arguments[1]:temp.msg1 = '';
       arguments[2] ? temp.msg2 = arguments[2]:temp.msg2 = '';
      temp.showIndex=1;
      window.setTimeout(function () {
        temp.showIndex=0;
      }, time)
    },
    popUp_auto_false(time,msg1, msg2) {
      let temp=this;
      !arguments[0] ? time =1500:'';
      arguments[1] ? temp.msg1 = arguments[1]:temp.msg1 = '';
      arguments[2] ? temp.msg2 = arguments[2]:temp.msg2 = '';
      temp.showIndex=2;
      window.setTimeout(function () {
        temp.showIndex=0;
      }, time)
    },
    popUp_open() {
      this.showIndex=3;
    },
    popUp_close() {
      this.showIndex=0;
    },
    ...mapMutations(["openLoading","closeLoading"])
  },
  computed:mapState(["loadingFlag"]),

}
</script>

<style>
.fade-enter-active,.fade-leave-active{
  transition: opacity 0.5s;
}
.fade-enter,.fade-leave-to{
  opacity: 0;
}
</style>

