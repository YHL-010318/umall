<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="角色名称" label-width="120px" prop="rolename">
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" label-width="120px">
          <!-- 将menuList 绑定到tree,配置props -->
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{children: 'children',label: 'title'}"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title=='角色添加'">添 加</el-button>
        <el-button type="primary" v-else @click="upData">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import {
  reqRoleAdd,
  reqMenuLisr,
  reqRoleInfo,
  roleEdit,
} from '../../../utils/http'
import { successAlert, errorAlert } from '../../../utils/alert'
export default {
  props: ['info', 'list'],
  data() {
    return {
      rules: {
        rolename: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
        ],
      },
      user: {
        rolename: '',
        menus: '',
        status: 1,
      },
      //初始化树形控件
      menuList: [],
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
        if (this.user.rolename === '') {
          errorAlert('角色名称不能为空')
          return
        }
        if (this.user.menus === '') {
          errorAlert('角色权限不能为空')
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
        rolename: '',
        menus: '',
        status: 1,
      }
      //把树清空
      this.$refs.tree.setCheckedKeys([])
    },
    // 点击添加按钮
    add() {
      this.check().then(() => {
        // 将树形控件的数据取出，变成字符串数组，赋值给user.menus
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys())
        reqRoleAdd(this.user).then((res) => {
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
    getOne(id) {
      reqRoleInfo(id).then((res) => {
        //此时没有id
        this.user = res.data.list
        //处理树形控件的数据
        this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus))
        //补一个id
        this.user.id = id
      })
    },
    //确定编辑
    upData() {
      this.check().then(() => {
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys())
        roleEdit(this.user).then((res) => {
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
      if (this.info.title == '角色编辑') {
        this.empty()
      }
    },
  },
  mounted() {
    // 获取菜单列表数据
    reqMenuLisr().then((res) => {
      if (res.data.code == 200) {
        this.menuList = res.data.list
      }
    })
  },
}
</script>
<style scoped>
</style>