<template>
<!-- 为了测试第一次新建分支和已有分支push代码的差别 -->
  <div class="categories">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 知识点：vue-table-with-tree-grid的使用 -->
      <zk-table
        :data="categoriesList"
        :columns="columns"
        :border="true"
        :selection-type="false"
        :expand-type="false"
        :show-row-hover="false"
        :show-index="true"
        index-text="#"
      >
        <template slot="isOk" scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:green"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-else type="info">三级</el-tag>
        </template>
        <template slot="operate">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </zk-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="60%" @close="closeCateDialog">
      <el-form
        :model="cateFormData"
        :rules="cateRules"
        ref="cateRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="name" >
          <el-input v-model="cateFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 知识点：级联选择器的使用，特别是props属性的作用 -->
          <el-cascader
            v-model="parentCateValue"
            :options="categoriesList"
            :props="parentCateProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "categories",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      parentCateValue:[],
      cateFormData: {
        name: "",
        parentCate: ""
      },
      cateRules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
      },
      cateDialogVisible: false,
      categoriesList: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "operate"
        }
      ],
      parentCateProps:{
        expandTrigger: 'hover',
        value:"cat_id",
        label:"cat_name",
        children:"children",
        checkStrictly:true,
      },
      parentCateOptions:[]
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    // 获取分类数据
    async getCategoriesList() {
      const { data: res } = await this.$http.get("/categories", {
        params: this.queryInfo
      });
      if (res.meta.status === 200) {
        this.categoriesList = res.data.result;
        this.total = res.data.total;
        console.log(this.categoriesList);
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategoriesList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCategoriesList();
    },
    addCate() {
      this.cateDialogVisible = true;
    },
    // 监听对话框关闭事件
    closeCateDialog(){
      this.$refs.cateRef.resetFields()
      // 知识点：级联选择器清空是清空的v-model
      this.parentCateValue=[]
    }
  }
};
</script>

<style scoped>
.el-cascader{
  width:100%;
}
</style>