<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-list @edit="edit"></v-list>
    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import vList from './components/list'
import vForm from './components/form'
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: '轮播图添加',
      },
    }
  },
  components: {
    vList,
    vForm,
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //点击了添加
    willAdd() {
      this.info.isshow = true
      this.info.title = '轮播图添加'
    },
    // 编辑调用form参数
    edit(id) {
      this.info = {
        isshow: true,
        title: '轮播图修改',
      }
      this.$refs.form.getOne(id)
    },
  },
  mounted() {},
}
</script>
<style scoped>
</style>