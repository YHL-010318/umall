<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @opened="opened" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="一级分类" label-width="120px" prop="first_cateid">
          <!-- 当一级分类变化了，计算二级分类list ——change-->
          <el-select v-model="user.first_cateid" placeholder="请选择" @change="changeFirst">
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类" label-width="120px" prop="second_cateid">
          <el-select v-model="user.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称" label-width="120px" prop="goodsname">
          <el-input v-model="user.goodsname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="价格" label-width="120px" prop="price">
          <el-input v-model="user.price" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="市场价格" label-width="120px" prop="market_price">
          <el-input v-model="user.market_price" autocomplete="off"></el-input>
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

        <el-form-item label="商品规格" label-width="120px" prop="specsid">
          <el-select v-model="user.specsid" placeholder="请选择" @change="changeSpecsId">
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="规格属性" label-width="120px" prop="specsattr">
          <el-select v-model="user.specsattr" placeholder="请选择" multiple>
            <el-option v-for="item in attrsList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品" label-width="120px">
          <el-radio v-model="user.isnew" :label="1">是</el-radio>
          <el-radio v-model="user.isnew" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="是否热卖" label-width="120px">
          <el-radio v-model="user.ishot" :label="1">是</el-radio>
          <el-radio v-model="user.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>

        <el-form-item label="描述" label-width="120px">
          <!-- 富文本编辑器 -->
          <div id="edit" v-if="info.isshow"></div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='商品添加'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import E from 'wangeditor'
import { mapActions, mapGetters } from 'vuex'
import { errorAlert } from '../../../utils/alert'
import path from 'path'
import {
  reqcateList,
  reqgoodsAdd,
  reqgoodsDetail,
  reqgoodsUpdate,
  reqspecsDel,
} from '../../../utils/http'
import { successAlert } from '../../../utils/alert'
export default {
  props: ['info'],
  data() {
    return {
      rules: {
        first_cateid: [
          { required: true, message: '请输入一级分类', trigger: 'change' },
        ],
        second_cateid: [
          { required: true, message: '请输入二级分类', trigger: 'change' },
        ],
        goodsname: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        market_price: [
          { required: true, message: '请输入商品市场价格', trigger: 'blur' },
        ],
        specsid: [
          { required: true, message: '请输入商品规格', trigger: 'change' },
        ],
        specsattr: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个规格属性',
            trigger: 'change',
          },
        ],
      },
      //初始化数据
      user: {
        first_cateid: '',
        second_cateid: '',
        goodsname: '',
        price: '',
        market_price: '',
        img: null,
        description: '',
        specsid: '',
        specsattr: [], //此时是数组，后端要的是 "[]"
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      //初始化二级分类的list
      secondCateList: [],
      // 初始化图片路径
      imgUrl: '',
      //初始化规格属性list
      attrsList: [],
    }
  },
  // 从vuex中取出分类列表，展示在一级分类
  computed: {
    ...mapGetters({
      //一级分类list
      cateList: 'cate/list',
      // 规格list
      specsList: 'specs/list',
    }),
  },
  methods: {
    ...mapActions({
      //请求一级分类list
      reqCateList: 'cate/reqList',
      //请求规格list
      reqSpecsList: 'specs/reqList',
      //商品list和总数
      reqGoodsList: 'goods/reqList',
      reqGoodsCount: 'goods/reqCount',
    }),
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.first_cateid === '') {
          errorAlert('一级分类不能为空')
          return
        }
        if (this.user.second_cateid === '') {
          errorAlert('二级分类不能为空')
          return
        }
        if (this.user.goodsname === '') {
          errorAlert('商品名称不能为空')
          return
        }
        if (this.user.price === '') {
          errorAlert('商品价格不能为空')
          return
        }
        if (this.user.market_price === '') {
          errorAlert('商品市场价格不能为空')
          return
        }
        if (!this.user.img) {
          errorAlert('请选择图片')
          return
        }
        if (this.user.specsid === '') {
          errorAlert('请选择商品规格')
          return
        }
        if (this.user.specsattr.length === 0) {
          errorAlert('请选择商品属性')
          return
        }
        if (this.editor.txt.html() === '') {
          errorAlert('请输入商品描述')
          return
        }
        resolve()
      })
    },
    //点击取消弹框消失
    cancel() {
      this.info.isshow = false
    },
    //清空
    empty() {
      this.user = {
        first_cateid: '',
        second_cateid: '',
        goodsname: '',
        price: '',
        market_price: '',
        img: null,
        description: '',
        specsid: '',
        specsattr: [], //此时是数组，后端要的是 "[]"
        isnew: 1,
        ishot: 1,
        status: 1,
      }
      //二级分类的list
      this.secondCateList = []
      //图片临时地址
      this.imgUrl = ''
      //规格属性list
      this.attrsList = []
    },
    //根据一级分类id，得到二级分类list
    changeFirst() {
      //二级分类的id重置
      this.user.second_cateid = ''
      this.getSecondList()
    },
    //获取二级分类list
    getSecondList() {
      reqcateList({ pid: this.user.first_cateid }).then((res) => {
        this.secondCateList = res.data.list
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
    //修改了规格，计算出规格属性的list
    changeSpecsId() {
      //先将specsattr 置空
      this.user.specsattr = []
      this.getAttrs()
    },
    getAttrs() {
      // 取出 specsList ,哪条数据的id和this.user.specsid是一样的
      let obj = this.specsList.find((item) => item.id === this.user.specsid)

      //就将这条数据的attrs取出来，赋值给attrsList

      this.attrsList = obj.attrs
    },
    //弹框打开，并且动画结束了显示富文本编辑器
    opened() {
      this.editor = new E('#edit')
      this.editor.create()
      this.editor.txt.html(this.user.description)
    },
    //新增商品属性
    addAttr() {
      this.attrArr.push({
        value: '',
      })
    },
    //删除商品属性
    delAttr(index) {
      this.attrArr.splice(index, 1)
    },
    //点击添加
    add() {
      this.check().then(() => {
        //将编辑器的内容取出来给user.description
        //this.editor.txt.html() 取值
        this.user.description = this.editor.txt.html()

        let d = { ...this.user }
        d.specsattr = JSON.stringify(d.specsattr)

        reqgoodsAdd(d).then((res) => {
          if (res.data.code === 200) {
            successAlert('添加成功')
            this.cancel()
            this.empty()
            //刷新list
            this.reqGoodsList()
            this.reqGoodsCount()
          }
        })
      })
    },
    //详情
    getOne(id) {
      reqgoodsDetail(id).then((res) => {
        this.user = res.data.list
        this.user.id = id
        //请二级list
        this.getSecondList()
        //图片
        this.imgUrl = this.$imgPre + this.user.img
        //属性
        this.user.specsattr = JSON.parse(this.user.specsattr)
        //计算规格属性的list
        this.getAttrs()
        //给编辑器赋值
        if (this.editor) {
          this.editor.txt.html(this.user.description)
        }
      })
    },
    //更新
    update() {
      this.check().then(() => {
        this.user.description = this.editor.txt.html()
        let d = { ...this.user }
        d.specsattr = JSON.stringify(d.specsattr)
        reqgoodsUpdate(d).then((res) => {
          if (res.data.code == 200) {
            successAlert('更新成功')
            this.cancel()
            this.empty()
            this.reqGoodsList()
          }
        })
      })
    },
    //解决编辑后添加的bug
    closed() {
      if (this.info.title == '编辑商品') {
        this.empty()
      }
    },
  },
  mounted() {
    this.reqCateList()
    this.reqSpecsList(true)
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