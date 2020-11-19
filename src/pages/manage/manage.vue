<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <v-list :list="list" @init="newInit" @edit="edit"></v-list>
    <!-- 分页 -->
    <div class="page">
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="changpage"
      :total="total"
      :page-size="size"
    ></el-pagination>
    </div>

    <v-form :info="info" @init="newInit" ref="form"></v-form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import vList from './components/list'
import vForm from './components/form'
import { reqUserlist, reqUsercount } from '../../utils/http'
export default {
  components: {
    vList,
    vForm,
  },
  data() {
    return {
      info: {
        isshow: false,
        title: '管理员添加',
      },
      list: [],
      total: 0,
      size: 2,
      page: 1,
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    willAdd() {
      this.info.isshow = true
      this.info.title = '管理员添加'
    },
    //获取列表数据
    init() {
      reqUserlist({ page: this.page, size: this.size }).then((res) => {
        if (res.data.code == 200) {
          let list = res.data.list ? res.data.list : []
          if (list.length === 0 && this.page > 1) {
            this.page--
            this.init()
            return
          }
          this.list = res.data.list
        }
      })
    },
    newInit() {
      this.init(), this.getCount()
    },
    //获取管理员总数
    getCount() {
      reqUsercount().then((res) => {
        this.total = res.data.list[0].total
      })
    },

    edit(uid) {
      this.info = {
        isshow: true,
        title: '管理员修改',
      }
      this.$refs.form.getOne(uid)
    },
    changpage(page) {
      this.page = page
      this.init()
    },
  },
  mounted() {
    this.init()
    this.getCount()
  },
}
</script>
<style scoped>
.page{
  text-align: center;
}
</style>