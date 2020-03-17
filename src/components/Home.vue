<template>
  <div class="home">
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/img/heima.png" alt />
          <span class="header-text">电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 知识点：在普通属性中使用三元运算符 -->
        <el-aside :width="isCollapse?'60px':'200px'">
          <div class="aside-text" @click="toggleCollapse">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#F2FFE1"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="$route.path"
          >
          <!-- 知识点：default-active属性的使用（两种方法可以实现（重要）） -->
            <!-- 知识点：讲数值变成字符串的快捷方法 -->
            <el-submenu :index="item.id+''" v-for="item in menusList" :key="item.id">
              <template slot="title">
                <!-- 知识点：动态图标的设置 -->
                <i :class="iconList[item.id]"></i>
                <span class="authName">{{item.authName}}</span>
              </template>
              <el-menu-item
                :index="'/'+subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      menusList: [],
      iconList: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao"
      },
      isCollapse:false,
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    // 知识点：退出当前账号功能实现
    // 知识点：eslint语法的开启与配置问题、git的使用（后续解决）；
    logout() {
      sessionStorage.removeItem("token");
      this.$router.replace("/login");
    },
    async getMenus() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status === 200) {
        // 知识点：数据的赋值
        this.menusList = res.data;
      } else {
        console.log(res.meta.msg);
      }
    },
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    }
  }
};
</script>

<style scoped>
.home,
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}
.el-header div {
  display: flex;
  align-items: center;
}
/* 知识点：行高没有用 vertical-align不是居中,可以用flex加line-height*/
/* .el-header img{
  vertical-align: middle;
  line-height: 60px;
} */
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.header-text {
  color: #fff;
  font-size: 20px;
  margin-left: 20px;
}
.aside-text {
  color: #fff;
  text-align: center;
  background-color: #4a5064;
}
.authName {
  margin-left: 10px;
}
.el-menu {
  border-right: none;
}
</style>