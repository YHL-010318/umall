<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="所属角色" label-width="120px"  prop="roleid">
          <el-select v-model="user.roleid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" label-width="120px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title=='管理员添加'">添 加</el-button>
        <el-button type="primary" v-else @click="upData">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import {
  reqUseradd,
  reqUserinfo,
  reqUseredit,
  reqUserlist,
  reqRoleList,
} from '../../../utils/http'
import { successAlert, errorAlert } from '../../../utils/alert'
export default {
  props: ['info', 'list'],
  data() {
    return {
       rules: {
        roleid: [
          { required: true, message: '请选择所属角色', trigger: 'change' },
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
        ],
      },
      user: {
        username: '',
        roleid: '',
        password: '',
        status: 1,
      },
      //角色列表
      roleList: [],
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.roleid === '') {
          errorAlert('所属角色不能为空')
          return
        }
        if (this.user.username === '') {
          errorAlert('用户名不能为空')
          return
        }
        if (this.user.password === '') {
          errorAlert('密码不能为空')
          return
        }
        resolve()
      })
    },
    // 点击取消关闭弹框
    cancel() {
      this.info.isshow = false
    },
    //清空user
    empty() {
      this.user = {
        username: '',
        roleid: '',
        password: '',
        status: 1,
      }
    },
    // 点击添加按钮
    add() {
      this.check().then(() => {
        reqUseradd(this.user).then((res) => {
          if (res.data.code == 200) {
            //弹成功
            successAlert('添加成功')
            //弹框消失
            this.cancel()
            //数据清空
            this.empty()
            // 刷新list
            this.$emit('init')
          }
        })
      })
    },
    //点击编辑
    getOne(uid) {
      reqUserinfo(uid).then((res) => {
        //此时没有id有uid
        this.user = res.data.list
        //处理密码
        this.user.password = ''
      })
    },
    //确定编辑
    upData() {
      this.check().then(() => {
        reqUseredit(this.user).then((res) => {
          if (res.data.code == 200) {
            //弹成功
            successAlert('修改成功')
            //弹框消失
            this.cancel()
            //数据清空
            this.empty()
            // 刷新list
            this.$emit('init')
          }
        })
      })
    },
    // 处理点击编辑取消后的bug
    closed() {
      if (this.info.title == '管理员编辑') {
        this.empty()
      }
    },
  },
  mounted() {
    // 获取菜单列表数据
    reqRoleList().then((res) => {
      if (res.data.code == 200) {
        this.roleList = res.data.list
      }
    })
  },
}
</script>
<style scoped>
</style>