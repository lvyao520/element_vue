<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <!-- 知识点：一定要搞清楚返回的属性值是数值还是字符串 -->
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "rights",
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list", {
        params: { type: "list" }
      });
      if (res.meta.status === 200) {
        this.rightsList = res.data;
        console.log(this.rightsList)
      } else {
        this.$message.error(res.meta.msg);
      }
    }
  }
};
</script>

<style>
</style>