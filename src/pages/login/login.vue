<template>
  <div class="login">
    <div class="con">
      <h3>登录</h3>
      <div class="line">
        <el-input v-model="user.username" placeholder="请输入账号" clearable></el-input>
      </div>
      <div class="line">
        <el-input v-model="user.password" placeholder="密码" clearable show-password></el-input>
      </div>
      <div class="last">
        <el-button type="prim
        ary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { successAlert,errorAlert } from '../../utils/alert'
import { reqUserlogin } from '../../utils/http'
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      changeUser: 'changeUser',
    }),
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.username === '') {
          errorAlert('账号不能为空')
          return
        }
        if (this.user.password === '') {
          errorAlert('密码不能为空')
          return
        }

        resolve()
      })
    },
    //点击登录
    login() {
      this.check().then(() => {
        reqUserlogin(this.user).then((res) => {
          if (res.data.code == 200) {
            successAlert('登录成功')
            //存入vuex
            this.changeUser(res.data.list)
            this.$router.push('/')
          }
        })
      })
    },
  },

  mounted() {},
}
</script>
<style scoped>
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #563443, #443951, #2f3d60);
}
.con {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 300px;
  width: 500px;
  background: #fff;
  border-radius: 10px;
}
h3 {
  text-align: center;
  font: 22px/70px '微软雅黑';
  margin-top: 11px;
}
.line {
  width: 320px;
  height: 40px;
  margin-bottom: 22px;
  margin-left: 80px;
}
.last {
  margin-left: 80px;
  width: 320px;
}
.el-button {
  width: 100%;
}
</style>