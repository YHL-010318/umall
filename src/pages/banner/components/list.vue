<template>
  <div>
    <el-table
      :data="bannerList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="分类编号"></el-table-column>
      <el-table-column prop="title" label="分类名称"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgPre+scope.row.img" alt />
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
import { reqbannerDel } from '../../../utils/http'
import{successAlert} from "../../../utils/alert"
export default {
  computed: {
    ...mapGetters({
      bannerList: 'banner/list',
    }),
  },
  methods: {
    ...mapActions({
      reqList: 'banner/reqList',
    }),
    //点击了编辑
    edit(id) {
      this.$emit('edit', id)
    },
    //点击删除
    del(id) {
      reqbannerDel(id).then((res) => {
        if (res.data.code == 200) {
          //弹成功
          successAlert('删除成功')
          //刷新list
          this.reqList()
        }
      })
    },
  },
  mounted() {
    //一进来就请求列表
    this.reqList()
  },
}
</script>
<style scoped>
img {
  width: 80px;
  height: 80px;
}
</style>