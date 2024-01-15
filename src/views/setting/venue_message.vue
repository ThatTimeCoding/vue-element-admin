<template>
  <div class="app-container">
    <el-header  
      class="header" 
      style="background-color:rgba(234, 237, 241, 1);">
      <span style="color: rgb(116, 112, 112);font-weight: bold;font-size: 15px;">场馆信息设置</span>
    </el-header>
    <el-main>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form-item label="场馆名称" prop="venue_name">
              <el-input v-model="ruleForm.venue_name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form-item label="场馆地点" prop="venue_site">
              <el-input v-model="ruleForm.venue_site"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form-item label="场馆简介" prop="venue_introduction">
              <el-input type="textarea" :rows="3" v-model="ruleForm.venue_introduction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form-item label="入馆须知" prop="admission_introduction">
              <el-input type="textarea" :rows="3" v-model="ruleForm.admission_introduction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form-item label="场馆图片" prop="venue_image">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false">
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12" :offset="9">
            <el-form-item>
              <el-button type="primary"  @click="submitForm('ruleForm')"  >立即创建</el-button>
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
      fileList: [],
      ruleForm: {
        venue_name: '',
        venue_site: '',
        venue_introduction: '',
        admission_introduction: '',
      },
      rules: {
        venue_name: [
          { required: true, message: '请输入场馆名称', trigger: 'blur' },
        ],
        venue_site: [
          { required: true, message: '请选择场馆地点', trigger: 'blur' }
        ],
        venue_introduction: [
          { required: true, message: '请选择场馆简介', trigger: 'blur' }
        ],
        admission_introduction: [
          { required: true, message: '请填写入馆须知', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    handlePreview(file) {
      console.log(file);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit();
          alert('成功提交!');
        } else {
          console.log('提交失败!');
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fileList = [];
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

