<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="活动名称">
        <el-input v-model="form.activityName" />
      </el-form-item>
      <el-form-item label="活动地点">
        <el-input v-model="form.activitySite" />
      </el-form-item>

      <el-form-item label="活动时间" prop="activityTime">
        <el-date-picker v-model="form.activityTime" type="datetimerange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>


      <el-form-item label="报名时间" prop="registrationTime">
        <el-date-picker v-model="form.registrationTime" type="datetimerange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动售价">
        <el-col :span="4">
          <el-input v-model="form.cost" />
        </el-col>
        <el-col :span="1" style="text-align: center;">元</el-col>
      </el-form-item>
      <el-form-item label="门票数量">
        <el-col :span="4">
          <el-input v-model="form.ticketAmount" />
        </el-col>
        <el-col :span="1" style="text-align: center;">张</el-col>
      </el-form-item>
      <el-form-item label="年龄限制" prop="ageLimit">
        <el-slider v-model="form.ageLimit" range show-stops :max="100">
        </el-slider>
      </el-form-item>
      <el-form-item label="活动介绍">
        <el-input v-model="form.intro" type="textarea" maxlength="300" show-word-limit :rows="5" resize='none' />
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon el-upload"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过2Mb</div>

        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        activityName: undefined,
        activityTime: undefined,
        activitySite: undefined,
        registrationTime: undefined,
        ageLimit: undefined,
        activityCost: undefined,
        activityIntroduction: undefined,
        picture: undefined
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(1)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传活动图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传活动图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    }

  }
}
</script>

<style scoped>
.line {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.app-container {
  position: relative;
  left: 20%;
  width: 60%
}
</style>
