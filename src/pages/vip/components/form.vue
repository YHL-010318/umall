<template>
  <div>
    <el-dialog title="会员修改" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="user.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="user.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click=" cancel">取 消</el-button>
        <el-button type="primary" @click="update">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { reqmemberInfo, reqmemberEdit } from '../../../utils/http'
import { successAlert, errorAlert } from '../../../utils/alert'
export default {
  props: ['info'],
  data() {
    return {
      user: {
        uid: '',
        nickname: '',
        phone: '',
        password: '',
        status: 1,
      },
      //单独定义一个变量用来存放密码
      passwords: '',
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqList: 'vip/reqList',
    }),
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.phone === '') {
          errorAlert('手机号不能为空')
          return
        }
        if (this.user.nickname === '' || this.user.endtime === '') {
          errorAlert('名称不能为空')
          return
        }
        resolve()
      })
    },
    //清空
    empty() {
      this.user = {
        uid: '',
        nickname: '',
        phone: '',
        password: '',
        status: 1,
      }
    },
    //关闭弹窗
    cancel() {
      this.info.isshow = false
    },
    //获取详情
    getOne(uid) {
      reqmemberInfo(uid).then((res) => {
        this.user = res.data.list
        //把密码存储在变量里
        this.passwords = res.data.list.password
        //不显示密码
        this.user.password = ''
      })
    },
    //点击编辑
    update() {
      this.check().then(() => {
        //进行判断如果提交时密码为空则user.password= this.passwords
        if (this.user.password == '') {
          this.user.password = this.passwords
        }
        reqmemberEdit(this.user).then((res) => {
          if (res.data.code == 200) {
            successAlert('修改成功')
            this.empty()
            this.cancel()
            this.reqList()
          }
        })
      })
    },
  },
  mounted() {},
}
</script>
<style scoped>
</style>