<template>
  <div class="add_pop">
    <el-row>
      <el-col :span="12">
        <el-form class="demo-ruleForm" label-width="120px" :model="ruleForm" :rule="rules" ref="ruleForm">
          <el-form-item label="弹窗名称" class="show" required>
            <el-input maxlength="15" placeholder="请填写名称,最多15字" v-model="inputPopName" :disabled="allDisabled"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" required class="show">
            <el-col :span="11">
              <el-form-item prop="startTime">
                <!-- @change=""  v-model=""-->
                <el-date-picker
                  :disabled="allDisabled"
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
                  :disabled="allDisabled"
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
              :disabled="allDisabled"
              class="upload-demo"
              :action="upLoadImgUrl"
              :headers="headers"
              list-type="picture"
              :limit="1"
              :file-list="imgFileList"
              :on-success="successImg"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="跳转类型" required class="show">
            <el-radio-group v-model="type" @change="chooseType">
              <el-radio :disabled="allDisabled" v-for="(item,index) in jumpType" :label="item.name" :key="index" @change="chooseTypeItem(index,item)"></el-radio>
            </el-radio-group>
            <!-- APP框 -->
            <div v-if="typeCurrentIndex===0">
              <el-select :disabled="allDisabled" class="m_r_20" placeholder="请选择" v-model="appSelectItem" @change="selectPage">
                <el-option v-for="item in appSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-autocomplete :disabled="allDisabled" v-if="showTopicSearch" v-model="topicName" :fetch-suggestions="querySearchAsync" placeholder="请输入专题名称" @select="selectTopic"></el-autocomplete>
            </div>
            <!-- H5框 -->
            <div class="flex" v-if="typeCurrentIndex===1">
              <el-checkbox class="m_l_30" v-model="authorization" :disabled="allDisabled">H5授权</el-checkbox>
              <el-input :disabled="allDisabled" placeholder="页面可根据数据变化动态显示" v-model="h5Url"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="投放商圈" required class="show">
            <el-checkbox-group v-model="businessName" @change="chooseBusiness">
              <el-checkbox :disabled="allDisabled" v-for="(item,index) in businessAreaLists" :label="item.traName" :key="index" name="type" @change="selectBusinessArea(item,index)"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="选择用户" required class="show">
            <el-radio-group v-model="userType" @change="chooseUser">
              <el-radio :disabled="allDisabled" v-for="(item,index) in selectUserType" :key="index" :label="item.name" @change="chooseUserItem(index,item)"></el-radio>
            </el-radio-group>
            <!-- 指定用户 -->
            <div class="flex" v-if="currentUserTypeIndex===0">
              <el-button type="primary" size="small"><a href="demo.xlsx" download="demo.xlsx">下载模版</a></el-button>
              <el-upload :disabled="allDisabled" class="upload-demo" :action="upExcleAddr" :headers="headers" :on-success="uploadExcel" :show-file-list="showUploadFile" :file-list="successFile">
                <el-button type="danger" class="m_l_30" size="small">导入Excel</el-button>
              </el-upload>
            </div>
            <!-- 商圈 -->
            <!-- <el-checkbox-group v-model="businessName" @change="chooseBusiness" v-if="currentUserTypeIndex===1">
              <el-checkbox :disabled="allDisabled" v-for="(item,index) in businessAreaLists" :label="item.traName" :key="index" name="type" @change="selectBusinessArea(item.traId,index)"></el-checkbox>
            </el-checkbox-group> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="m_r_10" @click="submitForm()" v-if="hiddenButton">保存</el-button>
            <router-link to="/popmanager" v-if="hiddenButton"><el-button>取消</el-button></router-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { checkSpecial } from "@/api/shoppingGuide";
import { guideAllArea } from "@/api/headerBar";
export default {
  name: "addpop",
  data() {
    return {
      allDisabled: false, //查看禁用
      showUploadFile:false,  //图片上传过程不展示
      hiddenButton:true,
      headers: { sessionId: localStorage.getItem(`sessionId`) },
      upLoadImgUrl:`${process.env.VUE_APP_BASE_URL}/mall/support/uploadPic`,
      upExcleAddr:`${process.env.VUE_APP_BASE_URL}/mall/shopping/topics/${this.$route.params.topicId}/goods/upload`,
      imgFileList:[],
      popId:'',
      jumpType: [{ name: "APP" }, { name: "H5" }],
      appSelect: [
        {
          value: 2,
          label: "返利商品"
        },
        {
          value: 3,
          label: "我的红包"
        },
        {
          value: 4,
          label: "充值"
        },
        {
          value: 5,
          label: "我的钱包"
        },
        {
          value: 6,
          label: "我的订单"
        },
        {
          value: 11,
          label: "店铺信息"
        },
        {
          value: 12,
          label: "设置页面"
        },
        {
          value: 16,
          label: "专题详情"
        }
      ], //APP页面时，下拉框
      selectUserType:[{name:"指定用户"},{name:"商圈全部用户"}], //选择用户单选框
      inputPopName:'', //输入的弹窗名称
      appSelectItem:'', //下拉框选中的值
      type: [], //单选框  --APP 或者 H5
      typeCurrentIndex:null,  //类型切换时显示相对应的框
      showTopicSearch:null,
      topicName:'',
      topicId:'',
      searchTopicLists:[],
      authorization:'',
      h5Url:'',
      currentUserTypeIndex:null, //选择用户切换显示对应的
      userType:'',
      businessAreaLists:[], //所有商圈
      businessName:[], //选中的商圈名
      selectBusinessName:[],
      successFile:[]
    };
  },
  methods: {
    //所有商圈
    businessCircle(){
      guideAllArea().then(res=>{
        if(res.data.statusCode === 2000){
          this.businessAreaLists = res.data.body;
        }else{};
      },error=>{});
    },
    successImg(){},
    //app页面时的下拉框选择项
    selectPage(){
      // 当ID为16时，显示专题搜索框
      console.log(`选中的APP页面ID号:${this.appSelectItem}`);
      if(this.appSelectItem !=16 ) return this.showTopicSearch = false; this.topicName = ''; this.topicId = '';
      this.showTopicSearch = true;
      this.topicName = '';
      this.topicId = '';
    },
    //专题模糊搜索
    querySearchAsync(queryString, fn){
      this.searchTopic(queryString,fn);
    },
    //专题模糊搜索
    searchTopic(topicName,fn){
      let params={topicName:topicName};
      checkSpecial(params).then(res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            res.data.body.length &&
              res.data.body.forEach(el => {
                el.value = el.topicName;
              });
            this.searchLists = res.data.body;
            fn(this.searchLists);
          } else {};
        },
        error => {
          console.log(error);
        })
    },
    //选中的专题名
    selectTopic(item){
      console.log(`选中的专题名`);
      console.log(item);
      this.topicName = item.value;
      this.topicId = item.topicId;
    },
    //跳转类型 --app or h5
    chooseType() {
      console.log(`跳转类型${this.type}`);
    },
    //选中app or h5时的详细
    chooseTypeItem(index, item) {
      console.log(`跳转类型的下标${index}`);
      this.typeCurrentIndex = index;
      // this.typeCurrentIndex ? (this.authorization = false, this.h5Url = '') : (this.appSelectItem = '', this.showTopicSearch = false) ;
    },
    //用户类型选择 -- 指定用户 or 商圈
    chooseUser(){
      console.log(`选择用户类型：${this.userType}`);
    },
    //选择的商圈 --显示在页面上
    chooseBusiness(){
      console.warn(`选择的商圈`);
      // console.log(this.businessName);
      // console.log(this.businessAreaLists);
      this.dataAssembly();
    },
    //选中的那个商圈
    selectBusinessArea(item,index){
      console.warn(`商圈:`);
      console.log(item);
      this.businessAreaLists.forEach(el=>{
        el.traName === item.traName && (item.checked = !item.checked);
      });
    },
    //选中的那个类型--切换下方显示的东西
    chooseUserItem(index,item){
      console.log(`选择的用户类型下标:${index}`);
      this.currentUserTypeIndex = index;
    },
    uploadExcel(){
      console.log(`上传文件成功`);
    },
    //商圈最终数据组装
    dataAssembly(){
      let bussinessAreaFinallyLists = [];
      this.businessAreaLists.forEach(el=>{bussinessAreaFinallyLists.push({checked: el.checked, traId: el.traId});});
      console.log(`提交的商圈最终数据`);
      console.log(bussinessAreaFinallyLists);
    },
    submitForm(){
      console.log(`提交`);
    }
  },
  created(){
    console.log(this.$route.params);
    if(!this.$route.params.text) return this.businessCircle();
    if(this.$route.params.text === `查看`){
      this.allDisabled = true;  //禁用所有
      this.hiddenButton = false; //隐藏保存，取消按钮
    };
    this.popId = this.$route.params.popId;
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
.m_l_30 {
  margin-left: 30px;
}
.m_r_20{
  margin-right:20px;
}
.m_r_10{
  margin-right:10px;
}
.flex {
  display: flex;
  align-items:center;
}
/deep/ .el-checkbox {
  margin-left: 0;
}
</style>