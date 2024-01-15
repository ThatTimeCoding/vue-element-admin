<template>
    <div class="app-container">
        <el-header  
            class="header" 
            style="background-color:rgba(234, 237, 241, 1);">
            <span style="color: rgb(116, 112, 112);font-weight: bold;font-size: 15px;">账户设置</span>
        </el-header>

        <el-main>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="用户名" prop="Name">
                            <el-input v-model="ruleForm.Name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="旧密码" prop="old_password">
                            <el-input v-model="ruleForm.old_password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="新密码" prop="new_password">
                            <el-input v-model="ruleForm.new_password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="确认密码" prop="password">
                            <el-input v-model="ruleForm.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" :offset="9">
                        <el-form-item>
                            <el-button type="primary"  @click="submitForm('ruleForm')" >立即提交</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-main>
    </div>
</template>


<script>
export default {
  data() {
    return {
      ruleForm: {
        Name: '',
        old_password: '',
        new_password: '',
        password: '',
      },
      rules: {
        Name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        old_password: [
          { required: true, message: '请选择旧密码', trigger: 'blur' }
        ],
        new_password: [
          { required: true, message: '请选择新密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写确认密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.new_password !== this.ruleForm.password) {
              alert('新密码和确认密码不相同,提交失败!');
            } else {
              alert('成功提交!');
            }
          } else {
            alert('提交失败!');
          }
        });
      },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

.header {
    display: flex;
    align-items: center;
    height: 10px;
}

.demo-ruleForm{
  margin-top: 20px;
}

</style>