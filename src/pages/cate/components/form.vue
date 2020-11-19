<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="上级分类" label-width="120px"  prop="pid">
          <el-select v-model="user.pid" placeholder="请选择">
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" label-width="120px" prop="catename">
          <el-input v-model="user.catename" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图片" label-width="120px" v-if="user.pid!==0">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeFile"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='分类添加'" @click="cateAdd">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import path from 'path'
import { successAlert, errorAlert } from '../../../utils/alert'
import {
  reqcateAdd,
  reqRoleList,
  reqcateDetail,
  reqcateUpdate,
} from '../../../utils/http'
import { mapActions, mapGetters } from 'vuex'
export default {
  props: ['info'],
  data() {
    return {
      rules: {
        pid: [
          { required: true, message: '请选择上级分类', trigger: 'change' },
        ],
        catename: [
          { required: true, message: '请输入分类名称', trigger: 'change' },
        ]
      },
      user: {
        pid: '',
        catename: '',
        img: null,
        status: 1,
      },
      // 初始化图片路径
      imgUrl: '',
    }
  },
  computed: {
    ...mapGetters({
      cateList: 'cate/list',
    }),
  },
  methods: {
    ...mapActions({
      reqList: 'cate/reqList',
    }),
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.pid === '') {
          errorAlert('上级分类不能为空')
          return
        }
        if (this.user.catename === '') {
          errorAlert('分类名称不能为空')
          return
        }
        if (!this.user.img) {
          errorAlert('请选择图片')
          return
        }
        resolve()
      })
    },
    //点击取消
    cancel() {
      this.info.isshow = false
    },
    //数据清空
    empty() {
      this.user = {
        pid: '',
        catename: '',
        img: null,
        status: 1,
      }
      this.imgUrl = ''
    },
    //上传文件
    changeFile(e) {
      let file = e.raw
      //判断文件大小 file.size B ，1M=1024KB 1KB=1024B
      if (file.size > 2 * 1024 * 1024) {
        errorAlert('文件大小不能超过2M')
        return
      }
      //判断文件类型
      let extname = path.extname(file.name) //'.jpg'
      let arr = ['.jpg', '.jpeg', '.png', '.gif']
      if (!arr.includes(extname)) {
        errorAlert('请上传正确的图片格式！')
        return
      }
      //URL.createObjectURL(file) 将一个文件生成一个URL地址
      this.imgUrl = URL.createObjectURL(file)
      //给user.img赋值
      this.user.img = file
    },
    //点击添加
    cateAdd() {
      this.check().then(() => {
        reqcateAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            //弹成功
            successAlert('修改成功')
            //弹框消失
            this.cancel()
            //数据清空
            this.empty()
            //刷新list
            this.reqList()
          }
        })
      })
    },
    // 获取详情
    getOne(id) {
      reqcateDetail(id).then((res) => {
        //此刻user没有id
        this.user = res.data.list
        this.imgUrl = this.$imgPre + this.user.img
        //补id
        this.user.id = id
      })
    },
    //点击修改
    update() {
      this.check().then(() => {
        reqcateUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            //弹成功
            successAlert('修改成功')
            //弹框消失
            this.cancel()
            //数据清空
            this.empty()
            //刷新list
            this.reqList()
          }
        })
      })
    },
    //处理消失
    closed() {
      if (this.info.title === '编辑分类') {
        this.empty()
      }
    },
  },
  mounted() {
    //   12.一进来，先获取菜单列表数据
    reqRoleList().then((res) => {
      if (res.data.code == 200) {
        this.roleList = res.data.list
      }
    })
  },
}
</script>
<style scoped lang="stylus">
.add >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>