<template>
<div>
    <el-button type="primary" @click="willAdd">添加</el-button>
  <v-list @edit="edit"></v-list>
  <v-form :info="info"  ref="form"></v-form>
</div>
</template>
<script>
import vList from "./components/list"
import vForm from "./components/form"
import { mapActions, mapGetters } from 'vuex'
export default {
  components:{
    vList,
    vForm
  },
  data() {
    return {
      info:{
        isshow:false,
        title:"规格添加"
      }
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //点击添加
    willAdd(){
      this.info.isshow=true,
      this.info.title="规格添加"
    },
    edit(id) {
      this.info = {
        isshow: true,
        title: '规格编辑',
      }
      this.$refs.form.getOne(id)
    },
  },
mounted() {}
}
</script>
<style scoped>
</style>