<template>
  <div class="add">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 知识点：el-steps和el-tabs中的active要求的类型不同，前者是数值(字符串转数值的快捷方法)，后者是字符串 -->
      <el-steps :active="+active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 知识点：el-tabs和el-form的结合使用 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
      <!-- 知识点：el-tabs中before-leave属性的使用，相当于起到一个监听标签页切换的事件-->
        <el-tabs tab-position="left" v-model="active" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="addForm.price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="weight">
              <el-input v-model="addForm.weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="mount">
              <el-input v-model="addForm.mount"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: "0",
      addForm: {
        name: "",
        price: "",
        weight: "",
        mount: ""
      },
      addRules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        mount: [{ required: true, message: "请输入商品数量", trigger: "blur" }]
      }
    };
  },
  methods:{
    // 知识点：函数返回false的话就阻止切换，很多时候不知道函数里面的参数是什么的时候，打印一下就可以了（这个思想要有很重要）
    beforeTabLeave(activeName, oldActiveName){
      console.log("即将离开标签页名称："+oldActiveName)//"0"
      console.log("即将进入标签页名称："+activeName)//"1"
    }
  }
};
</script>

<style scoped>
</style>