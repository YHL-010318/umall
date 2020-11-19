<template>
  <el-button type="danger" @click="del">删除</el-button>
</template>
<script>
export default {
  methods: {
    del() {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
            this.$emit("confirm");
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
  mounted() {},
}
</script>
<style scoped>
</style>