<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <v-list :list="list" @init="init" @edit="edit"></v-list>

    <v-form :info="info" @init="init" ref="form"></v-form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import vList from './components/list'
import vForm from './components/form'
import { reqRoleList } from '../../utils/http'
export default {
  components: {
    vList,
    vForm,
  },
  data() {
    return {
      info: {
        isshow: false,
        title: '角色添加',
      },
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
      this.info.title = '角色添加'
    },
    init() {
      reqRoleList().then((res) => {
        if (res.data.code == 200) {
          this.list = res.data.list
        }
      })
    },
    edit(id) {
      this.info = {
        isshow: true,
        title: '角色编辑',
      }
      this.$refs.form.getOne(id)
    },
  },
  mounted() {
    this.init()
  },
}
</script>
<style scoped>
</style>