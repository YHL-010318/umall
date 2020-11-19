<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="商品编号" width="110px"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="110px"></el-table-column>
      <el-table-column prop="price" label="商品价格" width="110px"></el-table-column>
      <el-table-column prop="market_price" label="市场价格" width="110px"></el-table-column>
      <el-table-column label="图片" >
        <template slot-scope="scope">
          <img :src="$imgPre+scope.row.img" alt />
        </template>
      </el-table-column>
  <el-table-column label="是否新品" width="110px">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.isnew===1">是</el-button>
            <el-button type="danger" v-else>否</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否热卖" width="110px">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.ishot===1">是</el-button>
            <el-button type="danger" v-else>否</el-button>
          </template>
        </el-table-column>

      <el-table-column label="状态" width="110px">
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
import { reqgoodsDel } from '../../../utils/http'
import { successAlert } from '../../../utils/alert'
export default {
  computed: {
    ...mapGetters({
      list: 'goods/list',
      total: 'goods/total',
      size: 'goods/size',
    }),
  },
  methods: {
    ...mapActions({
     reqList: "goods/reqList",
      reqCount:"goods/reqCount",
      changePage:"goods/changePage"
    }),
    //点击删除
    del(id) {
      reqgoodsDel(id).then((res) => {
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
      this.$emit('edit', id)
    },
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
img{
  width: 80px;
  height: 80px;
}
</style>