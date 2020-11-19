<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="活动名称" label-width="120px"  prop="title">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="120px">
          <el-date-picker
            v-model="values"
            type="datetimerange"
            @blur="time"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类" label-width="120px">
          <el-select v-model="user.first_cateid" placeholder="请选择" @change="changeFirst">
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px">
          <el-select v-model="user.second_cateid" placeholder="请选择" @change="changecommodity">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" label-width="120px">
          <el-select v-model="user.goodsid" placeholder="请选择">
            <el-option
              v-for="item in commodityList"
              :key="item.id"
              :value="item.id"
              :label="item.goodsname"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='活动添加'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import {
  reqcateList,
  reqgoodsList,
  reqseckAdd,
  reqseckInfo,
  reqseckEdit,
} from '../../../utils/http'
import { successAlert, errorAlert } from '../../../utils/alert'

export default {
  props: ['info'],
  data() {
    return {
       rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'change' },
        ],},
      user: {
        title: '',
        begintime: '',
        endtime: '',
        first_cateid: '',
        second_cateid: '',
        goodsid: '',
        status: 1,
      },
      //初始时间选择器
      values: [],
      //初始化二级分类列表
      secondCateList: [],
      //初始化商品列表
      commodityList: [],
    }
  },
  computed: {
    ...mapGetters({
      //一级分类list
      cateList: 'cate/list',
      // 商品list
      goodsList: 'goods/list',
    }),
  },
  methods: {
    ...mapActions({
      //请求一级分类list
      reqCateList: 'cate/reqList',
      //请求商品list
      reqgoodsList: 'goods/reqList',
      //秒杀活动列表
      reqseckList: 'seckill/reqList',
    }),
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.title === '') {
          errorAlert('活动名称不能为空')
          return
        }
        if (this.user.begintime === '' || this.user.endtime === '') {
          errorAlert('活动期限不能为空')
          return
        }
        if (this.user.first_cateid === '') {
          errorAlert('一级分类不能为空')
          return
        }
        if (this.user.second_cateid === '') {
          errorAlert('二级分类不能为空')
          return
        }
        if (this.user.goodsid === '') {
          errorAlert('商品不能为空')
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
        title: '',
        begintime: '',
        endtime: '',
        first_cateid: '',
        second_cateid: '',
        goodsid: '',
        status: 1,
      }
      //初始时间选择器
      this.values = []
      //初始化二级分类列表
      this.secondCateList = []
      //初始化商品列表
      this.commodityList = []
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
    //根据二级分类的id，得到商品list
    changecommodity() {
      //商品分类的id重置
      this.user.goodsid = ''
      this.getgoodsList()
    },
    getgoodsList() {
      let obj = this.goodsList.filter((item, index, array) => {
        return item.second_cateid === this.user.second_cateid
      })
      this.commodityList = obj
    },
    //分别取出时间选择器数组里面的开始时间和结束时间
    time() {
      this.user.begintime = this.values[0]
      this.user.endtime = this.values[1]
    },
    add() {
      this.check().then(() => {
        reqseckAdd(this.user).then((res) => {
          successAlert('添加成功')
          this.cancel()
          this.empty()
          //刷新list
          this.reqseckList()
        })
      })
    },
    //点击编辑弹出弹框
    getOne(id) {
      reqseckInfo(id).then((res) => {
        this.user = res.data.list
        this.user.id = id
        //请二级list
        this.getSecondList()
        //请商品list
        this.getgoodsList()
        //时间
        this.values = [
          new Date(Number(res.data.list.begintime)),
          new Date(Number(res.data.list.endtime)),
        ]
        console.log(this.values)
      })
    },
    //确定编辑
    update() {
      this.check().then(() => {
        reqseckEdit(this.user).then((res) => {
          if (res.data.code == 200) {
            successAlert('更新成功')
            this.cancel()
            this.empty()
            this.reqseckList()
          }
        })
      })
    },
    //点击取消弹框消失
    closed() {
      if (this.info.title === '活动修改') {
        this.empty()
      }
    },
  },
  mounted() {
    this.reqCateList()
    this.reqgoodsList(true)
  },
}
</script>
<style scoped>
</style>