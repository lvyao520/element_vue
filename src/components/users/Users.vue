<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用于列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="cardBox">
      <el-row :gutter="10">
        <el-col :span="11">
          <el-input placeholder="请输入内容" v-model="value" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search(value)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" class="user-button" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 知识点：作用域插槽的使用 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#DCDFE6"
              @change="toggleSwitch(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button size="mini" type="primary" @click="editUser(scope.row)">
                <i class="el-icon-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button size="mini" type="danger" @click="deleteUser(scope.row)">
                <i class="el-icon-delete"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button size="mini" type="warning">
                <i class="el-icon-orange"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userParams.pagenum"
        :page-sizes="[1, 2, 5,10]"
        :page-size="userParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      @close="closeDialog"
    >
      <el-form
        :model="addDialogData"
        :rules="addDialogRules"
        ref="addDialogRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addDialogData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addDialogData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addDialogData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addDialogData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="30%"
      :before-close="handleClose"
      @close="closeDialog"
    >
      <el-form :model="editData" :rules="editRules" ref="editRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="identifyEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userInfo } from "os";
export default {
  name: "users",
  data() {
    var checkEmail = (rule, value, callback) => {
      var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if (emailReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱"));
      }
    };
    // 手机校验规则
    var checkPhonenum = (rule, value, callback) => {
      var phoneReg = /^1[345789]\d{9}$/;
      if (phoneReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机"));
      }
    };
    return {
      userParams: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      tableList: [],
      total: "",
      value: "",
      dialogVisible: false,
      editVisible: false,
      addDialogData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editData: {
        username: "",
        email: "",
        mobile: ""
      },
      editRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhonenum, trigger: "blur" }
        ]
      },
      addDialogRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhonenum, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.userParams
      });
      if (res.meta.status === 200) {
        this.tableList = res.data.users;
        this.total = res.data.total;
      } else {
        console.log(res.meta.msg);
      }
    },
    async toggleSwitch(info) {
      // 知识点：模板字符串的使用
      const { data: res } = await this.$http.put(
        `users/${info.id}/state/${info.mg_state}`
      );
      if (res.meta.status === 200) {
        this.$message({
          message: "修改状态成功",
          type: "success"
        });
      } else {
        this.$message.error("修改状态失败");
      }
    },
    // 监听pagesize的改变
    handleSizeChange(newPagesize) {
      this.userParams.pagesize = newPagesize;
      this.getUserList();
    },
    // 监听currentsize的改变
    handleCurrentChange(newCurrentSize) {
      this.userParams.pagenum = newCurrentSize;
      this.getUserList();
    },
    search(value) {
      if (value !== null && value !== "") {
        var newTableList = [];
        this.tableList.forEach(item => {
          if (item.username === value) {
            newTableList.push(item);
          }
        });
        this.tableList = newTableList;
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 监听关闭对话框事件
    closeDialog() {
      this.$refs.addDialogRef.resetFields();
      this.$refs.editRef.resetFields();
    },
    // 确认添加用户
    addUser() {
      // 知识点：确认发送请求之前的表单预验证,
      this.$refs.addDialogRef.validate(async value => {
        if (value) {
          const dialogResult = await this.$http.post(
            "users",
            this.addDialogData
          );
          if (dialogResult.status === 200) {
            this.dialogVisible = false;
            this.getUserList();
            this.$message({
              message: "添加用户成功",
              type: "success"
            });
          }
        }
      });
    },
    // 编辑用户
    editUser(userinfo) {
      this.editVisible = true;
      this.editData = userinfo;
    },
    // 确认编辑用户
    identifyEdit() {
      this.$refs.editRef.validate(async value => {
        if (value) {
          const { data: res } = await this.$http.put(
            "users/" + this.editData.id,
            {
              id: this.editData.id,
              email: this.editData.email,
              mobile: this.editData.mobile
            }
          );
          if (res.meta.status === 200) {
            this.editVisible = false;
            this.getUserList();
            this.$message({
              message: "编辑用户成功",
              type: "success"
            });
          } else {
            this.$message.error("编辑用户失败");
          }
        }
      });
    },
    // 删除用户
    deleteUser(userinfo) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("users/" + userinfo.id,{id:userinfo.id});
          if (res.meta.status === 200) {
            this.getUserList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }else{
            this.$message.error(res.meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
.cardBox {
  margin-top: 15px;
}
</style>