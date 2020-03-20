<template>
  <div class="goods">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <button @click="goAdd">添加</button>
      <el-table style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "goods",
  data() {
    return {};
  },
  methods: {
    goAdd() {
      this.$router.push("/goods/add")
    }
  }
};
</script>

<style scoped>
</style>