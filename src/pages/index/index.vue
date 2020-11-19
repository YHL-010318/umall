<template>
  <div>
    <el-container class="con">
      <el-aside width="200px">
        <el-menu
          default-active="/"
          class="el-menu-vertical-demo"
          background-color="#20222a"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <div v-for="item in userInfo.menus" :key="item.id">
            <el-submenu :index="item.id+''" v-if="item.children">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="i in item.children" :key="i.id" :index="i.url">{{i.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item :index="item.url" v-else>{{item.title}}</el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header">
            <span>{{userInfo.username}}</span>
            <el-button type="primary" @click="loginOut">退出登录</el-button>
          </div>
        </el-header>

        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="$route.name">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 二级路由出口 -->
          <router-view class="main"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
    }),
  },
  methods: {
    ...mapActions({
      changeUser: 'changeUser',
    }),
    //点击登录后
    loginOut() {
      //清掉vuxe和本地存储
      this.changeUser({})
      this.$router.push('/login')
    },
  },
  mounted() {},
}
</script>
<style scoped>
.con {
  height: 100vh;
}
.el-aside {
  background: #20222a;
}
.el-header {
  height: 58px;
  background: #b3c0d1;
  position: relative;
}
.main {
  padding-top: 20px;
}
.header{
position: absolute;
right: 20px;
top: 10px;
}
.header span{
  margin-right: 20px;
}
</style>