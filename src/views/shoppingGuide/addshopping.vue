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
              <el-radio-group v-model="ruleForm.resource">
                <el-radio
                  :ref="rules"
                  :disabled="disTemplate"
                  v-for="(item,index) in resourceLists"
                  :label="item.name"
                  :key="index"
                  @change="demo(ruleForm.resource,index)"
                ></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="名称展示" class="show" prop="showName">
              <el-checkbox :disabled="allDisabled" v-model="ruleForm.showName" @change="isShow(ruleForm.showName)">展示</el-checkbox>
            </el-form-item>
            <el-form-item label="导购名称" class="show" prop="guideName">
              <el-input  :disabled="allDisabled" placeholder="请输入导购名称" v-model="ruleForm.guideName" clearable></el-input>
            </el-form-item>
            <el-form-item label="商圈" class="show" prop="selectedArea">
              <el-checkbox-group v-model="ruleForm.selectedArea">
                <el-checkbox
                  :disabled="allDisabled"
                  v-for="(item,index) in ruleForm.businessAreaLists"
                  :label="item.traName"
                  :key="index"
                  name="selectedArea"
                  @change="selectArea(item)"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="开始时间" required>
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-date-picker
                    :disabled="allDisabled"
                    type="datetime"
                    placeholder="选择时间日期"
                    v-model="ruleForm.startTime"
                    style="width: 100%;"
                    default-time="16:00:00"
                    @change="startTime(ruleForm.startTime)"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="结束时间" required>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker
                    :disabled="modifyTime"
                    type="datetime"
                    placeholder="选择时间日期"
                    v-model="ruleForm.endTime"
                    style="width: 100%;"
                    default-time="16:00:00"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="endTime(ruleForm.endTime)"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
          <demoOne
            @dataCorrection="dataCorrection"
            v-if="selectedTemplate===0"
            :showGoodsCount="showGoodsCount"
            :topicId="topicId"
            :topicName="topicName"
            :picUrl="picUrl"
            :publicPart="[{templateCode:ruleForm.resource,showName:ruleForm.showName,guideName:ruleForm.guideName,businessArea:ruleForm.businessAreaLists,startTime:ruleForm.startTime,endTime:ruleForm.endTime}]"
          ></demoOne>
          <demoTwo v-if="selectedTemplate===1"></demoTwo>
          <demoThree v-if="selectedTemplate===2"></demoThree>
          <demoFour v-if="selectedTemplate===3"></demoFour>
          <demoFive v-if="selectedTemplate===4"></demoFive>
        </div>
      </el-col>
      <el-col :span="12">
        <img src="../../img/demo1.png" alt v-if="selectedTemplate===0">
        <img src="../../img/demo2.png" alt v-if="selectedTemplate===1">
        <img src="../../img/demo3.png" alt v-if="selectedTemplate===2">
        <img src="../../img/demo4.png" alt v-if="selectedTemplate===3">
        <img src="../../img/demo5.png" alt v-if="selectedTemplate===4">
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
import { guideDetails } from "@/api/shoppingGuide";
import { getRequest, postRequest } from "@/utils/ajax";
// import { create } from "@/api/shoppingGuide";
const templateChoose={
  T1:()=>{return `模版1`},
  T2:()=>{return `模版2`},
  T3:()=>{return `模版3`},
  T4:()=>{return `模版4`},
  T5:()=>{return `模版5`}
};
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
      disTemplate:false,
      allDisabled: false,
      modifyTime:false,
      selectedTemplate: 0,
      topicId:'',
      topicName:'',
      picUrl:'',
      showGoodsCount:null,
      ruleForm: {
        resource: "模版1", //默认模版
        showName: false, //是否展示
        guideName: ``, //导购名称
        businessAreaLists: [], 
        selectedArea: [], //选中的商圈,校验规则使用
        startTime: "", //开始时间
        endTime: "" //结束时间
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
        ],
        guideName: [
          { required: true, message: "请输入导购名称", trigger: "blur" },
          { max: 10, message: "最多10个字", trigger: "blur" }
        ],
        selectedArea: [
          {
            required: true,
            type: "array",
            message: "至少选择一个商圈",
            trigger: "change"
          }
        ],
        startTime: [
          {
            type: "string",
            required: true,
            message: "请选择开始日期",
            trigger: "change"
          }
        ],
        endTime: [
          {
            type: "string",
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    //选择模版
    demo(resource, index) {
      console.log(resource);
      console.log(index);
      this.selectedTemplate = index;
      this.$refs.ruleForm.clearValidate();
    },
    businessAreaRequest() {
      getRequest(`/mall/tra/topics/selections`).then(
        res => {
          console.log(res);
          this.ruleForm.businessAreaLists = res.body;
        },
        error => {}
      );
    },
    async fromShoppingRequest(guideId){
      const response = await getRequest(`/mall/shopping/guides/${guideId}`);
      console.log(`响应结果`);
      console.log(response);
      this.ruleForm.showName = response.body.guideNameDisplay ? true : false;
      this.ruleForm.guideName = response.body.guideName;
      this.ruleForm.startTime = response.body.startTime;
      this.ruleForm.endTime = response.body.endTime;
      this.ruleForm.businessAreaLists = response.body.traSelectionList;
      this.showGoodsCount = response.body.showGoodsCount;
      response.body.traSelectionList.forEach(el=>{el.checked && this.ruleForm.selectedArea.push(el.traName);});
      response.body.actionList.forEach(el=>{
        this.topicId = el.actionParam.toString(); //专题ID号
        this.topicName = el.actionParamName; //专题名称
        this.picUrl = el.picUrl;  //上传的图片url
      });
      console.log(`专题号：${this.topicId}`)
    },
    isShow(isShow) {
      console.log(`是否展示:${isShow}`);
    },
    //选择商圈
    selectArea(item) {
      console.log(item);
      item.checked = !item.checked;
    },
    startTime(startTime) {
      console.log(`开始时间${startTime}`);
    },
    endTime(endTime) {
      console.log(`结束时间${endTime}`);
    },
    // 监听子组件方法
    dataCorrection() {
      this.$refs.ruleForm.validate(valid => {});
    },
  },
  created() {
    /**
     * 1.先判断跳转模版几，跳转不可切换(禁用) 
     * 2.模版切换均不可用：查看=》全部禁用； 重新添加、编辑=》全部可编辑； 延长时间=》只可修改结束时间
     * 3.获取公共组件的参数:showName,guideName,businessAreaLists,startTime,endTime
     * 4.导购ID，图片，是否展示传送子组件
     * 5.试试用async解决异步数据问题
     */
    console.log(`参数`);
    console.log(this.$route.params);
    if (this.$route.params.guideId) {
      new Promise((resolve,reject)=>{
        this.disTemplate = true;
        this.ruleForm.resource = templateChoose[this.$route.params.templateCode]();
        this.resourceLists.forEach((el,index)=>{ el.name === this.ruleForm.resource && (this.selectedTemplate = index); });
        return this.fromShoppingRequest(this.$route.params.guideId);
      });
      if(!this.$route.params.text){
        this.allDisabled = true;
        this.modifyTime = true;
        if(this.$route.params.status === `生效中`){
          this.allDisabled = true;
          this.modifyTime = false;
        }else if(this.$route.params.status ===`未生效`){
          this.allDisabled = false;
          this.modifyTime = false;
        };
      };
    }else{
      this.businessAreaRequest();
    };
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