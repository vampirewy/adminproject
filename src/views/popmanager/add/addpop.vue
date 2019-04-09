<template>
  <div class="add_pop">
    <el-row>
      <el-col :span="12">
        <el-form class="demo-ruleForm" label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="弹窗名称" class="show"  prop="inputPopName">
            <el-input maxlength="15" placeholder="请填写名称,最多15字" v-model="ruleForm.inputPopName" :disabled="allDisabled"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" required class="show">
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="ruleForm.startTime"
                  :disabled="allDisabled"
                  type="datetime"
                  placeholder="选择开始时间"
                  style="width: 100%;"
                  default-time="16:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="selectStartTime"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间" required class="show">
            <el-col :span="11">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="ruleForm.endTime"
                  :disabled="allDisabled"
                  type="datetime"
                  placeholder="选择结束时间"
                  style="width: 100%;"
                  default-time="16:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="selectEndTime"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="弹窗图片" class="show" required>
            <el-upload
              :disabled="allDisabled"
              class="upload-demo"
              :action="upLoadImgUrl"
              :headers="headers"
              list-type="picture"
              :limit="1"
              name="file"
              :file-list="imgFileList"
              :on-success="successImg"
              :on-remove="removeImg"
              :show-file-list="showSuccessImg"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="跳转类型" class="show" prop="type" required>
            <el-radio-group v-model="ruleForm.type" @change="chooseType">
              <el-radio :disabled="allDisabled" v-for="(item,index) in jumpType" :label="item.name" :key="index" @change="chooseTypeItem(index,item)"></el-radio>
            </el-radio-group>
            <!-- APP框 -->
            <div v-if="switchCollection.typeCurrentIndex===0">
              <el-select :disabled="allDisabled" class="m_r_20" placeholder="请选择" v-model="appSelectItem" @change="selectPage">
                <el-option v-for="item in appSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-autocomplete :disabled="allDisabled" v-if="showTopicSearch" v-model="topicName" :fetch-suggestions="querySearchAsync" placeholder="请输入专题名称" @select="selectTopic"></el-autocomplete>
            </div>
            <!-- H5框 -->
            <div class="flex" v-if="switchCollection.typeCurrentIndex===1">
              <el-checkbox class="m_l_30" v-model="authorization" :disabled="allDisabled">H5授权</el-checkbox>
              <el-input :disabled="allDisabled" placeholder="页面可根据数据变化动态显示" v-model="ruleForm.h5Url"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="投放商圈" class="show" prop="businessName">
            <el-checkbox-group v-model="ruleForm.businessName" @change="chooseBusiness">
              <el-checkbox :disabled="allDisabled" v-for="(item,index) in businessAreaLists" :label="item.traName" :key="index" name="type" @change="selectBusinessArea(item,index)"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="选择用户" required class="show" prop="userType">
            <el-radio-group v-model="ruleForm.userType" @change="chooseUser">
              <el-radio :disabled="allDisabled" v-for="(item,index) in selectUserType" :key="index" :label="item.name" @change="chooseUserItem(index,item)"></el-radio>
            </el-radio-group>
            <!-- 指定用户 -->
            <div class="flex" v-if="switchCollection.currentUserTypeIndex===0">
              <el-button  type="primary" size="small"><a href="弹框指定用户导入模板.xlsx" download>下载模版</a></el-button>
              <el-upload :disabled="allDisabled" class="upload-demo" :action="upExcleAddr" :headers="headers" :on-success="uploadExcel"  :file-list="successFile" :show-file-list="showFileProcess">
                <el-button type="danger" class="m_l_30" size="small">导入Excel</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="m_r_10" @click="submitForm('ruleForm')" v-if="hiddenButton">保存</el-button>
            <router-link to="/popmanager" v-if="hiddenButton"><el-button>取消</el-button></router-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {Message} from "element-ui";
import { checkSpecial } from "@/api/shoppingGuide";
import { guideAllArea } from "@/api/headerBar";
import { addReeditDetail, seeDetail } from "@/api/popManager";
export default {
  name: "addpop",
  data() {
    return {
      popId:'', //弹窗ID  --查看或者重新添加请求需要使用
      allDisabled: false, //查看禁用
      showSuccessImg:false,  //图片上传过程不展示
      showFileProcess:false,
      hiddenButton:true,  //从查看、重新添加过来，对底部保存和取消按钮的控制
      showTopicSearch:false,   //选中专题详情时，显示专题搜索框
      //跳转类型、选择用户切换集合(根据下标切换)
      switchCollection:{
        typeCurrentIndex:null,  //跳转类型切换时显示相对应的框
        currentUserTypeIndex:null, //选择用户切换显示对应的
      },
      headers: { sessionId: localStorage.getItem(`sessionId`) },
      upLoadImgUrl:`${process.env.VUE_APP_BASE_URL}/mall/support/uploadPic`, //图片上传地址
      // upExcleAddr:`${process.env.VUE_APP_BASE_URL}/mall/support/uploadPic`,
      upExcleAddr:`${process.env.VUE_APP_BASE_URL}/mall/shopping/window/upload`, //excel上传地址
      jumpType: [{ name: "APP" }, { name: "H5" }],  //跳转类型 app or h5 
      //APP页面时，下拉框  --返利商品、我的红包、充值、我的钱包... 传值为value
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
      ], 
      imgFileList:[], //图片显示在页面上的 --在successImg中暂未使用 [{name:xxxx,url:xxxx}]
      selectUserType:[{name:"指定用户"},{name:"商圈全部用户"}], //选择用户单选框
      ruleForm:{
        inputPopName:'',  //弹窗名称  --对应后台参数 windowName 判定
        startTime:'',     //开始时间  --对应后台参数 startTime 判定
        endTime:'',       //结束时间  --对应后台参数 endTime 判定
        successImg:'',    //图片上传成功，后台返回地址  --对应后台参数 picUrl
        type: [],         //跳转类型
        h5Url:'',         //单选框  --APP 或者 H5  --对应参数 actionType  -app -h5 需做小写转换  判定
        businessName:[],  //选中的商圈名  判定
        userType:''       //选中的用户类型 --指定用户 or 商圈全部用户  --对应后台参数 assignType  --0指定用户 1商圈用户 传currentUserTypeIndex 就可 判定
      },
      authorization:'',  //h5授权  对应后台参数  authorized -- true or false
      userIds:[],        //选定userType为0时，必须上传文件，装载后台回传回来的信息
      rules:{
        inputPopName:[{message:'请输入弹窗名称',required:true,trigger:"blur"},{max:15,message:'最多15个字',trigger:"blur"}],
        startTime: [{type: "string",required: true,message: "请选择开始日期",trigger: "change"}],
        endTime: [{type: "string",required: true,message: "请选择结束时间",trigger: "change"}],
        // imgFileList:[{type:'array',message:'请上传图片',required:true}],
        type:[{require:true,message:'请选择跳转类型',trigger:'change'}],
        businessName:[{type: "array",required: true,message: "请至少选择一个投放商圈",trigger: "change"}],
        userType:[{type:'string',required:true,message:'请至少选择一种用户类型',trigger:"change"}]
      },
      appSelectItem:'', //下拉框选中的value值
      topicName:'',     //回显使用 
      topicId:'',      //选中的专题ID号
      searchTopicLists:[],  //专题模糊搜索时装载的数据
      businessAreaLists:[], //所有商圈  --对应后台参数 traSelectionList =>装载所有商圈 [{traId:xxx,checked:xxx}]
      selectBusinessName:[],  //页面上显示的选中商圈
      successFile:[]  //上传件后回显值
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
    //从查看，重新添加过来的
    fromPopLists(popId){
      let [windowId] = [popId];
      seeDetail(windowId).then(res=>{
        console.log(res.data);
        if(res.data.statusCode === 2000){
          this.ruleForm.inputPopName = res.data.body.windowName;  //名称
          this.ruleForm.startTime = res.data.body.startTime;  //开始时间
          this.ruleForm.endTime = res.data.body.endTime;      //结束时间
          this.ruleForm.successImg = res.data.body.picUrl;    //上传的图片地址
          this.showSuccessImg = true;
          this.imgFileList.push({name:res.data.body.picUrl,url:res.data.body.picUrl});   //显示在页面上的图片地址
          this.ruleForm.type = res.data.body.actionType.toUpperCase();    //跳转类型 --APP H5
          if(this.ruleForm.type === `APP`){
            this.switchCollection.typeCurrentIndex = 0;  //跳转类型的下标 --0 app
            this.appSelect.forEach(el=>{if(res.data.body.actionContent == el.value) this.appSelectItem = el.value;});
            if(res.data.body.actionContent === '16'){  //专题详情为16
              this.showTopicSearch = true;            //显示专题搜索框    
              this.topicId = res.data.body.actionParam;  //专题ID号
              this.topicName = res.data.body.actionParamName;  //显示在页面上的专题名称
            };
          }else{
            this.switchCollection.typeCurrentIndex = 1; //跳转类型的下标 --1 h5
            this.ruleForm.h5Url = res.data.body.actionContent;  //显示的h5页面地址
          };
          this.businessAreaLists = res.data.body.traSelectionList;   //商圈赋值
          this.businessAreaLists.forEach(el=>{ el.checked && this.ruleForm.businessName.push(el.traName)});  //选中的商圈
          this.ruleForm.userType = res.data.body.assignType ? '商圈全部用户' : '指定用户';  //选中的用户类型
          this.switchCollection.currentUserTypeIndex = res.data.body.assignType; //选中的用户类型下标 --0 指定用户 --1 商圈全部用户
          this.userIds = res.data.body.userIds;
        }else{};
      },error=>{});
    },
    //开始时间
    selectStartTime(){},
    //结束时间
    selectEndTime(){},
    removeImg(file,fileList){
      console.log(`图片删除时`);
      this.ruleForm.successImg = '';
    },
    successImg(res){
      console.log(`图片上传`);
      console.log(res);
      this.showSuccessImg = true;
      this.ruleForm.successImg = res.body;
      // this.imgFileList = [{name:res.body,url:res.body}];
    },
    //app页面时的下拉框选择项
    selectPage(){
      // 当ID为16时，显示专题搜索框
      console.log(`选中的APP页面ID号:${this.appSelectItem}`);
      this.topicName = '';
      this.topicId = '';
      if(this.appSelectItem != 16 ) return this.showTopicSearch = false;
      this.showTopicSearch = true;
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
      console.log(`跳转类型${this.ruleForm.type}`);
    },
    //选中app or h5时的详细
    chooseTypeItem(index, item) {
      console.log(`跳转类型的下标${index}`);
      this.switchCollection.typeCurrentIndex = index;
      // this.typeCurrentIndex ? (this.authorization = false, this.h5Url = '') : (this.appSelectItem = '', this.showTopicSearch = false) ;
    },
    //选择的商圈 --显示在页面上
    chooseBusiness(){
      // console.warn(`选择的商圈`);
      // console.log(this.businessName);
      // console.log(this.businessAreaLists);
      // this.dataAssembly();
    },
    //选中的那个商圈
    selectBusinessArea(item,index){
      this.businessAreaLists.forEach(el=>{
        el.traName === item.traName && (item.checked = !item.checked);
      });
    },
    //用户类型选择 -- 指定用户 or 商圈全部用户
    chooseUser(){
      console.log(`选择用户类型：${this.ruleForm.userType}`);
    },
    //选中的那个类型--切换下方显示的东西
    chooseUserItem(index,item){
      console.log(`选择的用户类型下标:${index}`);
      this.switchCollection.currentUserTypeIndex = index;
    },
    uploadExcel(res){
      console.log(`上传文件成功`);
      console.log(res);
      if(res.statusCode !== 2000){return this.$message({message:res.msg,type:`error`})};
      this.$message({message:`导入成功`,type:`success`});
      this.userIds = res.body;
    },
    //最终数据组装,包括商圈数据
    dataAssembly(){
      let bussinessAreaFinallyLists = [],jumpType = 'h5';
      this.businessAreaLists.forEach(el=>{bussinessAreaFinallyLists.push({checked: el.checked, traId: el.traId});});
      // console.log(`提交的商圈最终数据`);
      // console.log(bussinessAreaFinallyLists);
      let params = {
        windowName:this.ruleForm.inputPopName,  //弹窗名称
        startTime: this.ruleForm.startTime,   
        endTime: this.ruleForm.endTime,
        picUrl: this.ruleForm.successImg,    //上传图片地址
        traSelectionList:bussinessAreaFinallyLists,    //商圈
        actionType:this.ruleForm.type.toLowerCase(),  //跳转类型  --h5 --app
        actionContent:this.ruleForm.type.toLowerCase()=== jumpType ? this.ruleForm.h5Url :this.appSelectItem ,  //app时，传入页面ID号或h5输入框地址
        actionParam:this.ruleForm.type.toLowerCase()=== jumpType ? '' : this.topicId ,  //选中专题详情时，传入专题ID号，反之空串--模糊搜索框的那个
        authorized:this.ruleForm.type.toLowerCase() === jumpType ? this.authorization : '',
        assignType:this.switchCollection.currentUserTypeIndex,
        userIds: this.switchCollection.currentUserTypeIndex === 0 ? this.userIds : []
      };
      console.log(`专题ID号${this.topicId}`);
      // console.log(`最终传参`);
      // console.log(params);
      return params;
    },
    async finallyDataSubmit(){
      const params = await this.dataAssembly();
      console.log(`第310行最终传参所得参数为`);
      console.log(params);
      addReeditDetail(params).then(res=>{
        if(res.data.statusCode ===2000){
          this.$message({message:`添加成功`,type:`success`});
          setTimeout(()=>{this.$router.push('/popmanager')},300);
        }else{
          this.$message({message:res.data.msg,type:`error`});
        };
      },error=>{});
    },
    submitForm(formName){
      console.log(`提交`);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.finallyDataSubmit();
        } else {
          console.log("error submit!!");
          return false;
        };
      });
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
    this.fromPopLists(this.$route.params.popId);
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