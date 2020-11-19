<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 将list传递给list.vue组件 -->
    <v-list :list="list" @init="init" @edit="edit($event)"></v-list>
    <v-form :info="info" :list="list" @init="init" ref="form"></v-form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import vList from './components/list'
import vForm from './components/form'
import { reqMenuLisr } from '../../utils/http'
export default {
  components: {
    vList,
    vForm,
  },
  data() {
    return {
      info: {
        isshow: false,
        title:"添加菜单"
      },
      //列表数据
      list: [],
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),

    willAdd() {
      this.info.isshow = true
      this.info.title="添加菜单"
    },
    init() {
      reqMenuLisr().then((res) => {
        this.list = res.data.list
      })
    },
    edit(id){
        this.info.isshow = true
         this.info.title="编辑菜单"
         this.$refs.form.getOne(id)
         
    }
  },
  mounted() {
    //请求列表数据
    this.init()
  },
}
</script>
<style scoped>
</style>