<template>
  <div class="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 知识点：选择商品分类，用到el-row和flex搭配 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="catelistValue"
            :options="catelist"
            :props="cateListProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 知识点：动态操作属性 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="catelistValue.length===0"
            @click="addParams"
          >添加参数</el-button>

          <el-table :data="paramsList" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.attr_vals!==''" closable>{{scope.row.attr_vals}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="catelistValue.length===0"
            @click="addParams"
          >添加属性</el-button>

          <el-table :data="propertyList" style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template >
                <el-button size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 知识点：v-for循环空数组时，元素不显示 -->
      <a v-for="item in []" :key="item" href="">{{item}}</a>
    </el-card>
    <!-- 添加参数对话框 -->
    <!-- 知识点：添加动态参数和静态属性连个对话框的复用 -->
    <el-dialog :title="activeName==='only'?'添加静态属性':'添加动态参数'" :visible.sync="isShowParamsDialog" width="60%">
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="addParamsRef"
        label-width="100px"
      >
        <el-form-item :label="activeName==='only'?'静态属性':'动态参数'" prop="name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowParamsDialog = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "pramas",
  data() {
    return {
      catelist: [],
      cateListProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
        // checkStrictly: true
      },
      catelistValue: [],
      activeName: "many",
      paramsList: [],
      propertyList: [],
      inputVisible: false,
      inputValue: "",
      addParamsForm: {
        attr_name: ""
      },
      isShowParamsDialog: false,
      activeHeader: "",
      addParamsRules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.catelist = res.data;
    },
    // 监听选择商品分类事件
    handleChange(value) {
      if (value.length !== 3) {
        this.catelistValue = [];
      }
      this.getParamsAndProperty();
    },
    // 监听标签页的变化
    handleTabClick() {
      this.activeName = "only";
      this.getParamsAndProperty();
    },
    // 知识点：请求抽离
    async getParamsAndProperty() {
      const { data: res } = await this.$http.get(
        "categories/" + this.cateId + "/attributes",
        { params: { sel: this.activeName } }
      );
      if (res.meta.status === 200) {
        if (this.activeName === "only") {
          this.propertyList = res.data;
        } else {
          this.paramsList = res.data;
          console.log(this.paramsList);
        }
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 添加参数
    addParams() {
      this.isShowParamsDialog = true;
    }
  },
  computed: {
    cateId() {
      if (this.catelistValue.length === 3) {
        return this.catelistValue[2];
      } else {
        return null;
      }
    }
  }
};
</script>

<style  scoped>
.el-col-4 {
  display: flex;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

