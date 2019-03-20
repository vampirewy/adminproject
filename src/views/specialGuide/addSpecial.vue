<template>
  <div class="add_special">
    <el-tabs v-model="activeName" :before-leave='leaveTab'>
      <el-tab-pane label="专题信息" name="1">
        <!-- <SpecialInfor :activeName="activeName" @say="parentSay"></SpecialInfor> -->
      </el-tab-pane>
      <el-tab-pane label="专题商品" name="2">
        <!-- <SpecialGood :activeName="activeName" @say="parentSay"></SpecialGood> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import SpecialInfor from "@/views/specialGuide/aboutSpecial/specialInfor.vue";
// import SpecialGood from "@/views/specialGuide/aboutSpecial/specialGood.vue";
// export default {
//   name: "addSpecial",
//   components: {
//     SpecialInfor,
//     SpecialGood
//   },
//   data() {
//     return {
//       activeName: "1",
//       goods:false
//     };
//   },
//   methods: {
//     leaveTab(newName,oldName){
//       console.log(newName,oldName);
//       sessionStorage.clear();
//     },
//     handleClick(item) {},
//     parentSay() {
//       console.log(this.activeName);
//       this.activeName = '2';
//       this.goods=true;
//       sessionStorage.setItem('activeName',this.activeName);
//     },
//     handleClick() {}
//   }
// };
</script>

<style scoped lang="less">
.add_special {
  margin-top: 20px;
}
</style>