<template>
  <div class="add_pop">
    <el-row>
      <el-col :span="12">
        <el-form class="demo-ruleForm" label-width="120px">
          <el-form-item label="弹窗名称" class="show" required>
            <el-input placeholder="请填写名称"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" required class="show">
            <el-col :span="11">
              <el-form-item prop="startTime">
                <!-- @change=""  v-model=""-->
                <el-date-picker
                  type="datetime"
                  placeholder="选择开始时间"
                  style="width: 100%;"
                  default-time="16:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间" required class="show">
            <el-col :span="11">
              <el-form-item prop="endTime">
                <!-- @change=""  v-model=""-->
                <el-date-picker
                  type="datetime"
                  placeholder="选择结束时间"
                  style="width: 100%;"
                  default-time="16:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="弹窗图片" required class="show">
            <!-- :file-list="fileList" //显示在页面上的图片 {name:xxx,url:xxx} 
              :on-success="" :on-preview="handlePreview"
            -->
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="跳转页面" required  class="show">
            <!-- 单选h5,app -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "addpop",
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
.add_pop {
  margin-top: 20px;
}
.show {
  text-align: left;
}
</style>