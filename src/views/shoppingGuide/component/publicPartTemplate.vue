<template>
  <div>
    <!-- 名称展示、导购名称、商圈、开始与结束时间 -->
    <el-form-item label="名称展示" class="show" required>
      <el-checkbox v-model="showName" @change="isShow(showName)">展示</el-checkbox>
    </el-form-item>
    <el-form-item label="导购名称" class="show" required>
      <el-input placeholder="请输入导购名称" v-model="guideName"></el-input>
    </el-form-item>
    <el-form-item label="商圈" class="show" required>
      <el-checkbox-group v-model="selectedArea">
        <el-checkbox
          v-for="(item,index) in businessAreaLists"
          :label="item.traName"
          :key="index"
          name="type"
          @change="selectArea(item)"
        ></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/utils/ajax";
export default {
  name: "publicPart",
  props: {
    // businessAreaLists: Array //商圈列表
  },
  data() {
    return {
      showName: false,
      guideName: ``,
      selectedArea: [],
      businessAreaLists:[]
    };
  },
  methods: {
    businessAreaRequest() {
      getRequest(`/mall/tra/topics/selections`).then(
        res => {
          console.log(res);
          this.businessAreaLists = res.body;
        },
        error => {}
      );
    },
    isShow(isShow){
      console.log(`展示：${isShow}`);
    },
    selectArea(currentArea) {
      console.log(currentArea);
      console.log(`商圈选择`);
    }
  },
  created() {
    this.businessAreaRequest();
  }
};
</script>

<style scoped lang="less">
.show {
  text-align: left;
}
</style>