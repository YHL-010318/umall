<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="title" label="活动名称"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <!-- 32.绑定confirm事件 -->
          <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { reqseckDel } from '../../../utils/http'
import { successAlert } from '../../../utils/alert'

export default {
  computed: {
    ...mapGetters({
      list: 'seckill/list',
    }),
  },
  methods: {
    ...mapActions({
      reqseckList: 'seckill/reqList',
    }),
    //点击删除
    del(id) {
      reqseckDel(id).then((res) => {
        if (res.data.code == 200) {
          //弹一个成功的弹框
          successAlert('删除成功')
          //重新请求列表
          this.reqseckList()
        }
      })
    },
    //点击编辑
    edit(id) {
      this.$emit('edit', id)
    },
  },
  mounted() {
    this.reqseckList()
  },
}
</script>
<style scoped>
</style>