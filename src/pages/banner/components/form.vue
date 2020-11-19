<template>
  <div>
    <div class="add">
      <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
        <el-form :model="user" :rules="rules">
          <el-form-item label="标题" label-width="120px" prop="title">
            <el-input v-model="user.title" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="图片" label-width="120px">
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
          <el-button type="primary" v-if="info.title=='轮播图添加'" @click="add">添 加</el-button>
          <el-button type="primary" v-else @click="update">修 改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import path from 'path'
import {
  reqbannerAdd,
  reqbannerInfo,
  reqbannerUpdate,
} from '../../../utils/http'
import { successAlert, errorAlert } from '../../../utils/alert'

export default {
  props: ['info'],
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'change' },
        ],
      },
      user: {
        title: '',
        img: null,
        status: 1,
      },
      // 初始化图片路径
      imgUrl: '',
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqList: 'banner/reqList',
    }),
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.title === '') {
          errorAlert('标题不能为空')
          return
        }
        if (!this.user.img) {
          errorAlert('请选择图片')
          return
        }

        resolve()
      })
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
    //点击取消
    cancel() {
      this.info.isshow = false
    },
    //数据清空
    empty() {
      this.user = {
        title: '',
        img: null,
        status: 1,
      }
      this.imgUrl = ''
    },
    //点击添加
    add() {
      this.check().then(() => {
        reqbannerAdd(this.user).then((res) => {
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
    //请求详情
    getOne(id) {
      reqbannerInfo(id).then((res) => {
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
        reqbannerUpdate(this.user).then((res) => {
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
      if (this.info.title === '轮播图修改') {
        this.empty()
      }
    },
  },
  mounted() {},
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