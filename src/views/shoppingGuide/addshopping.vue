<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="guide_setting">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="导购模版" prop="resource" class="show">
              <el-radio-group v-model="ruleForm.resource" @change="demo(ruleForm.resource)">
                <el-radio :disabled="allDisabled" v-for="(item,index) in resourceLists" :label="item.name" :key="index"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <demoOne v-if="showResourceOne"></demoOne>
          <demoTwo v-if="showResourceTwo"></demoTwo>
          <demoThree v-if="showResourceThree"></demoThree>
          <demoFour v-if="showResourceFour"></demoFour>
          <demoFive v-if="showResourceFive"></demoFive>
        </div>
      </el-col>
      <el-col :span="12">
        <img src="../../img/demo1.png" alt v-if="showResourceOne">
        <img src="../../img/demo2.png" alt v-if="showResourceTwo">
        <img src="../../img/demo3.png" alt v-if="showResourceThree">
        <img src="../../img/demo4.png" alt v-if="showResourceFour">
        <img src="../../img/demo5.png" alt v-if="showResourceFive">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from "element-ui";
import demoOne from "@/views/shoppingGuide/demo1/demoOne.vue";
import demoTwo from "@/views/shoppingGuide/demo2/demoTwo.vue";
import demoThree from "@/views/shoppingGuide/demo3/demoThree.vue";
import demoFour from "@/views/shoppingGuide/demo4/demoFour.vue";
import demoFive from "@/views/shoppingGuide/demo5/demoFive.vue";
import { guideAllArea } from "@/api/headerBar";
import { guideDetails } from "@/api/shoppingGuide";
// import { create } from "@/api/shoppingGuide";
export default {
  name: "addshopping",
  components: {
    demoOne,
    demoTwo,
    demoThree,
    demoFour,
    demoFive
  },
  data() {
    return {
      allDisabled:false,
      showResourceOne: true, //模版1
      showResourceTwo: false, //模版2
      showResourceThree: false, //模版3
      showResourceFour: false, //模版4
      showResourceFive: false, //模版5
      showResourceSix: false, //模版6
      areaLists: [],
      ruleForm: {
        resource: "模版1" //默认模版
      },
      resourceLists: [
        { name: "模版1" },
        { name: "模版2" },
        { name: "模版3" },
        { name: "模版4" },
        { name: "模版5" }
      ],
      rules: {
        resource: [
          { required: true, message: "请选择使用模版", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //获取所有商圈
    async allAreaName() {
      await guideAllArea().then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            this.areaLists = res.data.body;
          }
          console.log(this.areaLists);
        },
        error => {
          console.log(error);
        }
      );
    },
    //选择模版
    demo(resource) {
      console.log(resource);
      if (resource === "模版1") {
        this.showResourceOne = true;
        this.showResourceTwo = false;
        this.showResourceThree = false;
        this.showResourceFour = false;
        this.showResourceFive = false;
      } else if (resource === "模版2") {
        this.showResourceTwo = true;
        this.showResourceOne = false;
        this.showResourceThree = false;
        this.showResourceFour = false;
        this.showResourceFive = false;
        this.ruleForm.goods = "";
        this.inputGoodsNum = "";
        this.ruleForm.submitImg = "";
      } else if (resource === "模版3") {
        this.showResourceThree = true;
        this.showResourceOne = false;
        this.showResourceTwo = false;
        this.showResourceFour = false;
        this.showResourceFive = false;
        this.ruleForm.goods = "";
        this.inputGoodsNum = "";
        this.ruleForm.submitImg = "";
      } else if (resource === "模版4") {
        this.showResourceFour = true;
        this.showResourceOne = false;
        this.showResourceTwo = false;
        this.showResourceThree = false;
        this.showResourceFive = false;
        this.ruleForm.goods = "";
        this.inputGoodsNum = "";
        this.ruleForm.submitImg = "";
      } else {
        this.showResourceFive = true;
        this.showResourceOne = false;
        this.showResourceTwo = false;
        this.showResourceThree = false;
        this.showResourceFour = false;
        this.ruleForm.goods = "";
        this.inputGoodsNum = "";
        this.ruleForm.submitImg = "";
      }
    },
    modifyAllAreaName() {
      let params = {
        guideId: this.guideId
      };
      guideDetails(params).then(
        res => {
          console.log(res.data);
          if(res.data.statusCode===2000){
            this.areaLists=res.data.body.traSelectionList;
            console.log(this.areaLists);
          }else{};
        },
        error => {}
      );
    }
  },
  created() {
    /**
     * 1.先判断@templateCode 跳哪个对应的模版 T1 T2 T3 T4 T5
     * 2.只有生效中才能延长时间
     * 2.请求查询导购明细接口 
     * 3.商圈赋值
     */
    // console.log(this.$route.params);
    if (this.$route.params.guideId) {
      this.allDisabled=true;
      this.guideId = this.$route.params.guideId;
      this.status = this.$route.params.status; //导购单子的状态 未生效、生效中、已停用、已删除、已结束
      this.ruleForm.resource =
        this.$route.params.templateCode == `T1`
          ? `模版1`
          : this.$route.params.templateCode == `T2`
          ? `模版2`
          : this.$route.params.templateCode == `T3`
          ? `模版3`
          : this.$route.params.templateCode == `T4`
          ? `模版4`
          : this.$route.params.templateCode == `T5`
          ? `模版5`
          : '';
      console.log(`模版为`);
      console.log(this.ruleForm.resource);
      if(this.ruleForm.resource===`模版1`){
        this.showResourceOne=true;
        this.showResourceTwo=false;
        this.showResourceThree=false;
        this.showResourceFour=false;
        this.showResourceFive=false;
      }else if(this.ruleForm.resource===`模版2`){
        this.showResourceTwo=true;
        this.showResourceOne=false;
        this.showResourceThree=false;
        this.showResourceFour=false;
        this.showResourceFive=false;
      }else if(this.ruleForm.resource===`模版3`){
        this.showResourceThree=true;
        this.showResourceOne=false;
        this.showResourceTwo=false;
        this.showResourceFour=false;
        this.showResourceFive=false;
      }else if(this.ruleForm.resource===`模版4`){
        this.showResourceFour=true;
        this.showResourceOne=false;
        this.showResourceTwo=false;
        this.showResourceThree=false;
        this.showResourceFive=false;
      }else{
        this.showResourceFive=true;
        this.showResourceOne=false;
        this.showResourceTwo=false;
        this.showResourceThree=false;
        this.showResourceFour=false;
      };
    };
    // else {
    //   this.allAreaName();
    // };
  }
};
</script>

<style scoped lang="less">
.guide_setting {
  margin-top: 20px;
}
.show {
  text-align: left;
}
.text_align {
  text-align: left;
}
</style>