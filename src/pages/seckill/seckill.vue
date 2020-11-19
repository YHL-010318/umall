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
  components: {
    vList,
    vForm,
  },
  data() {
    return {
      info: {
        isshow: false,
        title: '活动添加',
      },
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //点击添加时弹框出现
    willAdd() {
      this.info.isshow = true
      this.info.title = '活动添加'
    },
    //编辑详情
    edit(id) {
      this.info = {
        isshow: true,
        title: '活动修改',
      }
      this.$refs.form.getOne(id)
    },
  },
  mounted() {},
}
</script>
<style scoped>
</style>