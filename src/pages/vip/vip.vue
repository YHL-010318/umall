<template>
  <div>
    <v-list @edit="edit"></v-list>
    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import vForm from './components/form'
import vList from './components/list'

export default {
  components: {
    vForm,
    vList,
  },
 data() {
   return {
     info:{
       isshow:false,
    
     }
   }
 },
  computed: {
    ...mapGetters({ }),
  },
  methods: {
    ...mapActions({}),
    edit(uid){
     this.info.isshow=true
      this.$refs.form.getOne(uid)
    }
  },
  mounted() {},
}
</script>
<style scoped>
</style>