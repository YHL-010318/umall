<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="规格编号"></el-table-column>
      <el-table-column prop="specsname" label="规格名称"></el-table-column>

      <el-table-column label="规格属性">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
        </template>
      </el-table-column>

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

    <!-- 分页 -->
    <div class="fenye">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="size"
        @current-change="changePage"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { reqspecsDel } from '../../../utils/http'
import { successAlert } from '../../../utils/alert'
export default {
  computed: {
    ...mapGetters({
      list: 'specs/list',
      total: 'specs/total',
      size: 'specs/size',
    }),
  },
  methods: {
    ...mapActions({
      reqList: 'specs/reqList',
      reqCount: 'specs/reqCount',
      changePage: 'specs/changePage',
    }),
    //点击删除
    del(id) {
      reqspecsDel(id).then((res) => {
        if (res.data.code == 200) {
          //弹一个成功的弹框
          successAlert('删除成功')
          //重新请求列表
          this.reqList()
          //重新请求总数
          this.reqCount()
        }
      })
    },
     //点击编辑
    edit(id) {
      this.$emit("edit", id);
    }
  },
  mounted() {
     //请求列表
    this.reqList()
    //请求总数
    this.reqCount()
  },
}
</script>
<style scoped>
.fenye {
  text-align: center;
}
</style>