<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="活动图片" class="show" prop="fileList">
        <el-upload
          ref="ruleForm"
          class="upload-demo"
          :action="upImgUrl"
          :headers="headers"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="successImg"
          :limit="1"
          :file-list="ruleForm.fileList"
          name="file"
          :disabled="allDisabled"
        >
          <el-button type="primary" size="mini">上传图片</el-button>
          <span slot="tip" class="el-upload__tip m_l_10">只能上传1张图片</span>
        </el-upload>
      </el-form-item>
      <el-form-item label="跳转页面" class="show" prop="pathValue">
        <div style="display:flex;">
          <el-autocomplete
            v-model="ruleForm.pathValue"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="selectTopicName"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button
            type="primary"
            size="mini"
            style="margin-left:10px;"
            @click="toSpecialGuide"
          >创建新专题</el-button>
        </div>
      </el-form-item>
      <el-form-item label="是否展示商品" class="show" prop="goods">
        <el-radio-group v-model="ruleForm.goods" @change="showGoods(ruleForm.goods)">
          <el-radio
            :disabled="allDisabled"
            v-for="(item,index) in showLists"
            :label="item.name"
            :key="index"
          ></el-radio>
        </el-radio-group>
        <el-input
          :disabled="allDisabled"
          placeholder="请输入整数"
          v-model="inputGoodsNum"
          v-if="chooseGoods"
          @blur="showGoodsNum()"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="newCreate">保存</el-button>
        <!-- <el-button type="primary" @click="modifyForm('ruleForm')" v-if="modifySave">保存</el-button> -->
        <el-button @click="cancel()" v-if="newCreate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from "element-ui";
// import { guideAllArea } from "@/api/headerBar";
import { getRequest, postRequest } from "@/utils/ajax";
import { MessageBounced } from "@/utils/message";
import {
  // create,
  // guideDetails,
  // modifyGuide,
  // onlyDelayTime,
  checkSpecial
} from "@/api/shoppingGuide";
export default {
  name: "demoOne",
  components: {},
  props: {
    publicPart:Array,
    showGoodsCount:Number,
    topicId:String,
    topicName:String,
    picUrl:String
  },
  data() {
    return {
      guideId: null,
      status: null,
      newCreate: true, //新建保存
      // modifySave: false, //修改保存
      modifyTime: false, //只可修改结束时间
      allDisabled: false, //全部禁用
      reg: /^[+]?\d*$/,
      headers: { sessionId: localStorage.getItem(`sessionId`) }, //图片上传的参数
      upImgUrl: `${process.env.VUE_APP_BASE_URL}/mall/support/uploadPic`,
      chooseGoods: false, //是否展示商品是选择自定义时，显示input框
      inputGoodsNum: null, //input框输入的数字
      searchLists: [], //模糊搜索的专题数据
      ruleForm: {
        fileList:[], //显示在页面上图片
        submitImg:'', //最终上转的图片
        path: "", //页面路径
        pathValue: "",
        goods: "" //是否展示商品
      },
      showLists: [
        { name: "不展示" },
        { name: "前3个" },
        { name: "前6个" },
        { name: "前9个" },
        { name: "自定义" }
      ],
      rules: {
        fileList:[
          {required:true, message:`请上传活动图片`}
        ],
        pathValue:[
          {required:true,message:`请填写专题名称`,validate:this.selectTopicName}
        ],
        goods: [
          { required: true, message: "请至少选择一项", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    handleRemove(files, fileList) {
      //确认删除后，数组清空,因为只有一个文件
      this.ruleForm.fileList = [];
      this.ruleForm.submitImg = "";
      this.$refs.ruleForm.validate(valid=>{});
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    successImg(res) {
      console.log(res);
      if (res.statusCode === 2000) {
        this.ruleForm.fileList.push({ name: res.body, url: res.body });
        this.ruleForm.submitImg = res.body;
      } else {
        this.$message({
          message: res.msg,
          type: `error`
        });
      };
      //校验图片上传验证
      this.$refs.ruleForm.validate(valid=>{});
    },
    toSpecialGuide() {
      // this.$router.push("/specialguide");
      this.$router.push("/specialinfor");
    },
    showGoods(goods) {
      console.log(`是否展示商品`);
      console.log(goods);
      if (goods === "自定义") {
        this.chooseGoods = true;
      } else {
        this.chooseGoods = false;
      }
    },
    showGoodsNum() {
      if (!this.reg.test(this.inputGoodsNum)) {
        this.$message({ message: `请输入正整数`, type: `error` });
        this.inputGoodsNum = "";
      }
    },
    querySearchAsync(queryString, fn) {
      this.searchTopic(queryString, fn);
    },
    searchTopic(topicName, fn) {
      let params = {
        topicName: topicName
      };
      checkSpecial(params).then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            res.data.body.length &&
              res.data.body.forEach(el => {
                el.value = el.topicName;
              });
            this.searchLists = res.data.body;
            fn(this.searchLists);
          } else {
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    selectTopicName(item) {
      console.log(item);
      this.ruleForm.path = item.topicId;
      this.ruleForm.pathValue = item.topicName;
    },
    cancel() {
      this.$router.push("/ShoppingGuide");
    },
    //非添加进入时，数据回显是否展示商品处理
    quantityGoods(num){
      switch (num) {
        case 0:
          this.ruleForm.goods = `不展示`;
          break;
        case 3:
          this.ruleForm.goods = `前3个`;
          break;
        case 6:
          this.ruleForm.goods = `前6个`;
          break;
        case 9:
          this.ruleForm.goods = `前9个`;
          break;
        default:
          this.ruleForm.goods = `自定义`;
          this.chooseGoods = true;
          this.inputGoodsNum = num;
          break;
      }
    },
    //提交前的参数组装
    assemblyInformation(guideId){
      console.log(`父组件传值`);
      console.log(this.publicPart);
      let lists = [], params = {};
      this.publicPart.length && this.publicPart.forEach(el=>{
        if(Object.values(el).includes("")||Object.values(el).includes(null)) return;
        el.templateCode = `T1`;
        el.businessArea.forEach(el=>{lists.push({checked:el.checked,traId:el.traId});});
        params.templateCode = el.templateCode;
        params.guideNameDisplay = el.showName ? 1 : 0 ;
        params.guideName = el.guideName;
        params.startTime = el.startTime;
        params.endTime = el.endTime;
        params.traSelectionList = lists;
        params.actionList = [{actionType:`app`,actionContent:`16`,picUrl:this.ruleForm.submitImg,actionParam:this.ruleForm.path}];
        params.showGoodsCount = this.ruleForm.goods === `不展示`? "0":this.ruleForm.goods ===`前3个`?"3":this.ruleForm.goods===`前6个`?"6":this.ruleForm.goods ===`前9个`?"9":this.inputGoodsNum;
      });
      params.guideId = guideId;
      //判断对象中是否有属性存在，没有就返回，有就直接返回参数
      if(!Object.keys(params).length) return;
      return params;
    },
    submitForm(formName) {
      this.$emit('dataCorrection');
      this.$refs[formName].validate(valid => {
        if (valid) {
          !this.status && this.subData();
          this.status ===`未生效` && this.modifyForm(this.guideId);
          this.status === `生效中` && this.onlyDelayTime(this.guideId);
        };
      });
    },
    //只修改时间的提交
    async onlyDelayTime(guideId){
      const delayTime = await this.assemblyInformation(guideId);
      if(delayTime){await postRequest(`/mall/shopping/guides/${guideId}/extendEndTime`,delayTime).then(res=>{
        console.log(res);
        new MessageBounced(`修改成功`,`success`).messageWindow();
      },error=>{
        new MessageBounced(error.msg,`error`).messageWindow();
      })};
    },
    //修改后的提交
    async modifyForm(guideId){
      const modifyData = await this.assemblyInformation(guideId);
      if(modifyData){await postRequest(`/mall/shopping/guides/${guideId}/modify`,modifyData).then(res=>{
        console.log(res);
        new MessageBounced(`修改成功`,`success`).messageWindow();
        setTimeout(()=>{this.$router.push("/shoppingGuide");},300);
      },error=>{
        new MessageBounced(error.msg,`error`).messageWindow();
      })};
    },
    //新建的提交
    async subData() {
      const submitData = await this.assemblyInformation();
      if(submitData){await postRequest(`/mall/shopping/guides/create`,submitData).then(res=>{new MessageBounced(`创建成功`,`success`).messageWindow();setTimeout(()=>{this.$router.push("/shoppingGuide");},200);},error=>{new MessageBounced(error.msg,`error`).messageWindow();})};
    }
  },
  created() {
    console.log(`子组件`);
    console.log(this.$route.params);
    this.$route.params.guideId && (this.guideId = this.$route.params.guideId);
    this.$route.params.status && (this.status = this.$route.params.status);
    this.$route.params.status ===`生效中` && (this.allDisabled = true,this.modifyTime = true);  
    // if (this.$route.params.guideId) {
    //   this.guideId = this.$route.params.guideId;
    //   this.status = this.$route.params.status;
    //   if (this.status === `未生效`) {
    //     this.newCreate = false; //新创建的保存按钮
    //     this.modifySave = true; //修改的保存按钮
    //   } else if (this.status === `生效中`) {
    //     this.newCreate = false;
    //     this.modifySave = true;
    //     this.allDisabled = true;
    //     this.modifyTime = false;
    //   } else {
    //     if (!this.$route.params.text) {
    //       this.newCreate = false;
    //       this.modifySave = false;
    //       this.allDisabled = true;
    //       this.modifyTime = true;
    //     }
    //   }
    //   this.fromShoppingGuide();
    // } else {
    //   // console.log(this.areaNameLists);
    //   // this.allArea();
    // }
  },
  watch:{
    picUrl:function(picUrl){
      this.ruleForm.submitImg = picUrl;
      this.ruleForm.fileList.push({ name:picUrl,value:picUrl});
    },
    topicId:function(topicId){
      this.ruleForm.path = topicId;
    },
    topicName:function(topicName){
      this.ruleForm.pathValue = topicName;
    },
    showGoodsCount:function(showGoodsCount){
      this.quantityGoods(showGoodsCount);
    }
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
.m_l_10 {
  margin-left: 10px;
}
</style>