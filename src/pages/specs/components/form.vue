<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="规格名称" label-width="120px">
          <el-input v-model="user.specsname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="规格属性" label-width="120px" v-for="(item,index) in attrArr" :key="index">
          <div class="line">
            <el-input v-model="item.value" autocomplete="off"></el-input>
            <el-button type="primary" v-if="index===0" @click="addAttr">添加规格属性</el-button>
            <el-button type="danger" v-else @click="delAttr(index)">删除</el-button>
          </div>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='规格添加'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import {
  reqspecsAdd,
  reqspecsDetail,
  reqspecsUpdate,
} from '../../../utils/http'
import { successAlert,errorAlert } from '../../../utils/alert'
export default {
  props: ['info'],
  data() {
    return {
      user: {
        specsname: '',
        attrs: '',
        status: 1,
      },
      //属性值
      attrArr: [{ value: '' }],
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqList: 'specs/reqList',
      reqCount: 'specs/reqCount',
    }),
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.specsname === '') {
          errorAlert('规格名称不能为空')
          return
        }
        if (this.user.attrs === '' || this.user.endtime === '') {
          errorAlert('规格属性不能为空')
          return
        }
        resolve()
      })
    },
    //点击取消
    cancel() {
      this.info.isshow = false
    },
    //点击添加规格属性
    addAttr() {
      this.attrArr.push({
        value: '',
      })
    },
    //点击删除
    delAttr(index) {
      this.attrArr.splice(index, 1)
    },
    //清空
    empty() {
      this.user = {
        specsname: '',
        attrs: '',
        status: 1,
      }
      //属性值
      this.attrArr = [{ value: '' }]
    },
    //点击添加
    add() {
      this.check().then(() => {
        //先给user/attrs赋值 获取attrArr数组里面的每一项值返回一个新数组再给这个数组变成字符串数组
        this.user.attrs = JSON.stringify(this.attrArr.map((item) => item.value))
        //商品添加请求
        reqspecsAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            //弹一个成功的弹框
            successAlert('添加成功')
            //清空数据
            this.empty()
            //关闭添加页面
            this.cancel()
            //刷新列表
            this.reqList()
            this.reqCount()
          }
        })
      })
    },

    //详情
    getOne(id) {
      reqspecsDetail(id).then((res) => {
        this.user = res.data.list[0]
        //  '["s","M"]'-->[{value:"s"},{value:"M"}]
        this.attrArr = JSON.parse(this.user.attrs).map((item) => ({
          value: item,
        }))
      })
    },

    //点击编辑更新
    update() {
      this.check().then(() => {
        this.user.attrs = JSON.stringify(this.attrArr.map((item) => item.value))
        reqspecsUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            successAlert('更新成功')
            this.cancel()
            this.empty()
            this.reqList()
          }
        })
      })
    },
    // 处理点击编辑取消后的bug
    closed() {
      if (this.info.title == '规格编辑') {
        this.empty()
      }
    },
  },
  mounted() {},
}
</script>
<style scoped>
.line {
  display: flex;
}
.line .el-input {
  flex: 1;
}
.line .el-button {
  width: auto;
}
</style>