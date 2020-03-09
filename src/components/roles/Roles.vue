<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色表格 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 知识点：布局的问题和动态操作类 -->
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :class="['bd-bottom',index1==0?'bd-top':'']"
            >
              <el-col :span="6">
                <el-tag closable class="el-tag-roles">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                  :class="[index2==0?'':'bd-top']"
                >
                  <el-col :span="8">
                    <el-tag closable class="el-tag-roles">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col
                    :span="16"
                    v-for="(item3,index3) in item2.children"
                    :key="item3.id"
                    :class="[index3==0?'':'bd-top']"
                  >
                    <el-tag closable class="el-tag-roles">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="assignRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="rightsDialog" width="45%">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        :default-expand-all="true"
        node-key="id"
        :default-checked-keys="treeKeysId"
      ></el-tree>
      <span slot="footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      rolesList: [],
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children"
      },
      rightsDialog: false,
      treeKeysId:[],
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status === 200) {
        this.rolesList = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    // 分配权限
    async assignRights(role) {
      const { data: res } = await this.$http.get("rights/tree", {
        params: { type: "tree" }
      });
      if (res.meta.status === 200) {
        this.rightsList = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
      // 知识点：递归
      this.getRecursive(role,this.treeKeysId)
      this.rightsDialog = true;
    },
    // 知识点：递归
    getRecursive(node,arr){
      // 知识点：这种数组的深层遍历和对象一样（重点）
      node.children.forEach(item=>{
        if(!item.children){
          arr.push(item.id)
        }else{
          this.getRecursive(item,arr)
        }
      })
      // if(!node.children){
      //   arr.push(node.id)
      // }else{
      //   node.children.forEach(item=>{
      //     this.getRecursive(item,arr)
      //   })
      // }
    }
  }
};
</script>

<style scoped>
.el-tag-roles {
  margin: 5px 0;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
</style>