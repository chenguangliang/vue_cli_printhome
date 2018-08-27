<template>
    <div>
      <img  id="bbsImg" style="display: none" src="" alt=""/>
      <img  id="logBbsImg" style="display: none" src="" alt=""/>
      <section>
        <div class="dingBu">
          <div class="userTip">账号或密码有误，请重新输入</div>
          <a href="../../html/1_index/index.html" class="backToIndex"><img src="../../../assets/img/close.png" alt=""></a>
        </div>
      </section>
      <section>
        <div class="logo">
          <a href="../../html/1_index/index.html"><img src="../../../assets/img/loginLogo.png" alt=""/></a>
        </div>
      </section>
      <section>
        <div class="user">
          <span class="pic"></span>
          <input name="username" type="text" autocomplete="off"  id="username" placeholder="印刷家账号/手机号" maxlength="25"/>
          <span id="usertips"></span>
          <span class="warm"> </span>
        </div>
      </section>
      <section>
        <div class="key">
          <span></span>
          <input type="password" name="password" autocomplete="off"  id="hidePwd" placeholder="点我输入登录密码" maxlength="20"  />
          <i id="see"  class="img01" onclick="showKey()"></i>
        </div>
      </section>
      <section>
        <div class="twoBtn">
          <a href="../../html/2_login_sign/zhaoHuiMiMa.html" class="forget">忘记密码？</a>
          <!--<a href="http://testwx.printhome.com/mall-web/person/wechatOauth2Url?origin='微信快速注册'" class="newUser">新用户注册</a>-->
          <a href='javascript:gotoRegister()' class="newUser">新用户注册</a>
          <!--<a href="../../html/2_login_sign/sign.html" class="newUser">新用户注册</a>-->
        </div>
      </section>
      <section>
        <a class="btn btnSuccess"  href="javascript:userNamePasslogin();">登&nbsp;&nbsp;&nbsp;&nbsp;录</a>
      </section>
      <section>
        <div class="other">
          <div  class="left"></div>
          <div  class="middle">其他登录方式</div>
          <div  class="right"></div>
        </div>
      </section>
      <section>
        <div class="twoLogin">
          <a href="javascript:;" class="weChat" onclick="wxLogin()"><img src="../../../assets/img/wechat.png" alt="" />微信授权登录</a>
          <a href="login_number.html" class="phone"><img src="../../../assets/img/phone.png" alt=""/>短信验证登录</a>
        </div>
      </section>
    </div>
</template>
<script type="text/ecmascript-6">

    export default {
        name: 'loginCommon',
        mixins: [],
        data(){
            return {}
        },
        methods: {},
        components: {},
        beforeMount(){
        },
        mounted(){
        },
        watch: {},
    }
</script>

<style scoped>
    @import "./login_common.css";
</style>
