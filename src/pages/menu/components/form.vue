<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="form" :rules="rules">
        <el-form-item label="菜单名称" label-width="120px" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="上级菜单" label-width="120px" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择" @change="changePid">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单类型" label-width="120px">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>

        <el-form-item label="菜单图标" v-if="form.type===1" label-width="120px">
          <el-select v-model="form.icon" placeholder="请选择">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单地址" v-else label-width="120px">
          <el-select v-model="form.url" placeholder="请选择">
            <el-option
              v-for="item in routes"
              :key="item.path"
              :label="item.name+'--/'+item.path"
              :value="'/'+item.path"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title==='添加菜单'">添 加</el-button>
        <el-button type="primary" @click="updata" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { routes } from '../../../router'
import { reqMenuAdd, reqMenuDetail, reqMenuUpdate } from '../../../utils/http'
import axios from 'axios'
import { successAlert, errorAlert } from '../../../utils/alert'
export default {
  props: ['info', 'list'],
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'change' },
        ],
        pid: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
      },
      //icon集合
      icons: [
        'el-icon-s-tools',
        'el-icon-user-solid',
        'el-icon-s-help',
        'el-icon-s-operation',
      ],
      routes: routes,
      form: {
        pid: '',
        title: '',
        icon: '',
        type: '',
        url: '',
        status: 1,
      },
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
        if (this.form.title === '') {
          errorAlert('菜单名称不能为空')
          return
        }
        if (this.form.pid === '') {
          errorAlert('上级菜单不能为空')
          return
        }
        if (this.form.url === '' && this.form.type == 2) {
          errorAlert('菜单地址不能为空')
          return
        }
        if (this.form.icon === '' && this.form.type == 1) {
          errorAlert('菜单图标不能为空')
          return
        }
        resolve()
      })
    },
    //点击取消
    cancle() {
      this.info.isshow = false
    },
    changePid() {
      if (this.form.pid === 0) {
        this.form.type = 1
      } else {
        this.form.type = 2
      }
    },
    //点击添加按钮
    add() {
      this.check().then(() => {
        reqMenuAdd(this.form).then((res) => {
          if (res.data.code === 200) {
            successAlert('添加成功')
            this.cancle()
            this.empty()
            this.$emit('init')
          } else {
            errorAlert(res.data.msg)
          }
        })
      })
    },
    //form置空
    empty() {
      this.form = {
        pid: '',
        title: '',
        icon: '',
        type: '',
        url: '',
        status: 1,
      }
    },
    getOne(id) {
      reqMenuDetail(id).then((res) => {
        this.form = res.data.list
        this.form.id = id
      })
    },
    //更新
    updata() {
      this.check().then(() => {
        reqMenuUpdate(this.form).then((res) => {
          if (res.data.code === 200) {
            successAlert(res.data.msg)
            this.cancle()
            //form重置
            this.empty()
            //列表刷新
            this.$emit('init')
          } else {
            errorAlert(res.data.msg)
          }
        })
      })
    },
    //弹框消失
    closed() {
      if (this.info.title === '编辑菜单') {
        this.empty()
      } else {
      }
    },
  },
  mounted() {},
}
</script>
<style scoped>
</style>