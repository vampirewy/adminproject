<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <!-- <el-form-item label="活动1" required>
        <el-form-item label="活动图片" prop="fileOne" class="show">
          <el-upload
            class="upload-demo"
            :action="upImgUrl"
            :headers="headers"
            :on-remove="removeOne"
            :before-remove="beforeRemoveOne"
            :on-success="imgOne"
            :limit="1"
            :file-list="fileOne"
            name="file"
            :disabled="allDisabled"
          >
            <el-button type="primary" size="mini">上传图片</el-button>
            <span slot="tip" class="el-upload__tip m_l_10">只能上传1张图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转页面" class="show">
          <el-radio-group
            v-model="oneChoose.type"
            @change="chooseTypes(oneChoose.type,1)"
            style="margin-right:10px;"
          >
            <el-radio
              :disabled="allDisabled"
              v-for="(item,index) in jumpType"
              :label="item.name"
              :key="index"
            ></el-radio>
          </el-radio-group>
          <el-select
            style="display:block"
            v-model="oneChoose.selectText"
            placeholder="请选择"
            @change="selectPage(oneChoose.selectText,1)"
            v-if="oneChoose.showSelect"
            :disabled="allDisabled"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-autocomplete
            v-if="oneChoose.special"
            v-model="oneChoose.topicName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="select1"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button type="primary" v-if="oneChoose.special" @click="toSpecialGuide">创建新专题</el-button>
          <el-checkbox
            style="margin-left:10px;"
            v-if="oneChoose.param"
            @change="authorization(1)"
            v-model="oneChoose.authorization"
          >H5授权</el-checkbox>
          <el-input
            placeholder="页面可根据数据变化动态显示"
            @blur="h5Path(1)"
            v-model="oneChoose.path"
            v-if="oneChoose.param"
            :disabled="allDisabled"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="活动2" required>
        <el-form-item label="活动图片" class="show">
          <el-upload
            class="upload-demo"
            :action="upImgUrl"
            :headers="headers"
            :on-remove="removeTwo"
            :before-remove="beforeRemoveTwo"
            :on-success="imgTwo"
            :limit="1"
            :file-list="fileTwo"
            name="file"
            :disabled="allDisabled"
          >
            <el-button type="primary" size="mini">上传图片</el-button>
            <span slot="tip" class="el-upload__tip m_l_10">只能上传1张图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转页面" class="show">
          <el-radio-group
            v-model="twoChoose.type"
            @change="chooseTypes(twoChoose.type,2)"
            style="margin-right:10px;"
          >
            <el-radio
              :disabled="allDisabled"
              v-for="(item,index) in jumpType"
              :label="item.name"
              :key="index"
            ></el-radio>
          </el-radio-group>
          <el-select
            style="display:block"
            v-model="twoChoose.selectText"
            placeholder="请选择"
            @change="selectPage(twoChoose.selectText,2)"
            v-if="twoChoose.showSelect"
            :disabled="allDisabled"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-autocomplete
            v-model="twoChoose.topicName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="select2"
            v-if="twoChoose.special"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button type="primary" v-if="twoChoose.special" @click="toSpecialGuide">创建新专题</el-button>
          <el-checkbox
            style="margin-left:10px;"
            v-if="twoChoose.param"
            @change="authorization(2)"
            v-model="twoChoose.authorization"
          >H5授权</el-checkbox>
          <el-input
            placeholder="页面可根据数据变化动态显示"
            @blur="h5Path(2)"
            v-model="twoChoose.path"
            v-if="twoChoose.param"
            :disabled="allDisabled"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="活动3" required>
        <el-form-item label="活动图片" class="show">
          <el-upload
            class="upload-demo"
            :action="upImgUrl"
            :headers="headers"
            :on-remove="removeThree"
            :before-remove="beforeRemoveThree"
            :on-success="imgThree"
            :limit="1"
            :file-list="fileThree"
            name="file"
            :disabled="allDisabled"
          >
            <el-button type="primary" size="mini">上传图片</el-button>
            <span slot="tip" class="el-upload__tip m_l_10">只能上传1张图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转页面" class="show">
          <el-radio-group
            v-model="threeChoose.type"
            @change="chooseTypes(threeChoose.type,3)"
            style="margin-right:10px;"
            :disabled="allDisabled"
          >
            <el-radio v-for="(item,index) in jumpType" :label="item.name" :key="index"></el-radio>
          </el-radio-group>
          <el-select
            style="display:block"
            v-model="threeChoose.selectText"
            placeholder="请选择"
            @change="selectPage(threeChoose.selectText,3)"
            v-if="threeChoose.showSelect"
            :disabled="allDisabled"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-autocomplete
            v-if="threeChoose.special"
            v-model="threeChoose.topicName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="select3"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button type="primary" v-if="threeChoose.special" @click="toSpecialGuide">创建新专题</el-button>
          <el-checkbox
            style="margin-left:10px;"
            v-if="threeChoose.param"
            @change="authorization(3)"
            v-model="threeChoose.authorization"
          >H5授权</el-checkbox>
          <el-input
            placeholder="页面可根据数据变化动态显示"
            @blur="h5Path(3)"
            v-model="threeChoose.path"
            v-if="threeChoose.param"
            :disabled="allDisabled"
          ></el-input>
        </el-form-item>
      </el-form-item>-->
      <el-form-item
        v-for="(item,index) in activitiesSection"
        :key="index"
        :label="item.name"
        required
      >
        <el-form-item label="活动图片" class="show" :prop="index===0?ruleForm.onePicUrl:index===1?ruleForm.twoPicUrl:ruleForm.threePicUrl">
          <el-upload
            class="upload-demo"
            :action="upImgUrl"
            :headers="headers"
            :show-file-list="item.showImgLists"
            :limit="1"
            :file-list="item.filePic"
            name="file"
            :on-remove="(file, fileList)=>{ return removeImg(file, fileList,index)}"
            :on-success="(res,file)=>{return successImg(res,file,index)}"
          >
            <el-button type="primary" size="mini">上传图片</el-button>
            <span slot="tip" class="el-upload__tip m_l_10">只能上传1张图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转页面" class="show">
          <el-radio-group
            v-model="item.type"
            @change="chooseTypes(item.type,index)"
            style="margin-right:10px;"
          >
            <el-radio v-for="(item,index) in jumpType" :label="item.name" :key="index"></el-radio>
          </el-radio-group>
          <el-select
            style="display:block"
            v-model="item.appSelectText"
            placeholder="请选择"
            @change="selectPage(item.appSelectText,index)"
            v-if="item.appSelect"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-autocomplete
            v-if="item.special"
            v-model="item.topicName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="(item)=>{return select(item,index)}"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button type="primary" v-if="item.special" @click="toSpecialGuide">创建新专题</el-button>
          <el-checkbox
            style="margin-left:10px;"
            v-if="item.h5Param"
            @change="authorization(index,item.authorization)"
            v-model="item.authorization"
          >H5授权</el-checkbox>
          <el-input
            placeholder="页面可根据数据变化动态显示"
            @blur="h5Path(index,item.path)"
            v-model="item.path"
            v-if="item.h5Param"
          ></el-input>
        </el-form-item>
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
import { getRequest, postRequest } from "@/utils/ajax";
import { MessageBounced } from "@/utils/message";
import { Message } from "element-ui";
import {
  create,
  guideDetails,
  modifyGuide,
  onlyDelayTime,
  checkSpecial
} from "@/api/shoppingGuide";
import { guideAllArea } from "@/api/headerBar";
export default {
  name: "demoFive",
  props: {
    publicPart: Array
  },
  data() {
    return {
      newCreate: true, //新建保存
      modifyTime: false, //只可修改结束时间
      allDisabled: false, //全部禁用
      // showImgLists: false,
      // areaLists: [],
      ruleForm: {
        onePicUrl:[],
        twoPicUrl:[],
        threePicUrl:[]
      },
      /**
       * picUrl:上传的图片地址
       * filePic:显示在页面上的图片地址
       * type 跳转类型为APP还是H5
       * appSelect 选中APP时，显示下拉框
       * appSelectText 下拉框选中的值
       * special 下拉框的值为专题页面时，显示专题名称
       * h5Param 选中H5时显示的内容框
       * path为输入框里的值
       * authorization h5授权
       */
      activitiesSection: [
        {
          name: "活动1",
          picUrl: "",
          filePic: [],
          showImgLists: false,
          type: "",
          appSelect: false,
          appSelectText: "",
          topicName: "",
          topicId: "",
          special: false,
          h5Param: false,
          path: "",
          authorization: false
        },
        {
          name: "活动2",
          picUrl: "",
          filePic: [],
          showImgLists: false,
          type: "",
          appSelect: false,
          appSelectText: "",
          topicName: "",
          topicId: "",
          special: false,
          h5Param: false,
          path: "",
          authorization: false
        },
        {
          name: "活动3",
          picUrl: "",
          filePic: [],
          showImgLists: false,
          type: "",
          appSelect: false,
          appSelectText: "",
          topicName: "",
          topicId: "",
          special: false,
          h5Param: false,
          path: "",
          authorization: false
        }
      ],
      rules: {
        onePicUrl:[
          {required:true,message:"请上传活动一图片"}
        ]
        // resource: [
        //   { required: true, message: "请选择使用模版", trigger: "change" }
        // ],
        // fileList: [
        //   {
        //     message: "请上传图片",
        //     trigger: "successImg"
        //   }
        // ],
        // goods: [
        //   {
        //     required: true,
        //     message: "请至少选择一项",
        //     trigger: "change"
        //   }
        // ]
      },
      oneChoose: {
        type: "", //app还是h5
        topicName: "", //专题名称
        topicId: "", //专题ID
        showSelect: false, //app下拉框显示
        selectText: "", //下拉框选中的值
        special: false, //专题搜索框和专题跳转按钮显示
        param: false, //h5输入框显示
        path: "", //h5路径
        picUrl: "",
        authorization: ""
      },
      twoChoose: {
        type: "",
        topicName: "",
        topicId: "",
        showSelect: false,
        selectText: "",
        special: false,
        param: false,
        path: "",
        picUrl: "",
        authorization: ""
      },
      threeChoose: {
        type: "",
        topicName: "",
        topicId: "",
        showSelect: false,
        selectText: "",
        special: false,
        param: false,
        path: "",
        picUrl: "",
        authorization: ""
      },
      headers: {
        sessionId: localStorage.getItem(`sessionId`)
      },
      upImgUrl: `${process.env.VUE_APP_BASE_URL}/mall/support/uploadPic`,
      fileOne: [], //装图片
      fileTwo: [],
      fileThree: [],
      searchLists: [], //模糊搜索的数据
      jumpType: [
        {
          name: "APP"
        },
        {
          name: "H5"
        }
      ],
      options: [
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
      ]
    };
  },
  methods: {
    fromShoppingGuide() {
      let params = {
        guideId: this.guideId
      };
      guideDetails(params).then(
        res => {
          if (res.data.statusCode === 2000) {
            console.log(res.data);
            this.areaLists = res.data.body.traSelectionList;
            this.areaLists.forEach(el => {
              if (el.checked) {
                this.ruleForm.type.push(el.traName);
              }
            });
            this.ruleForm.showName = res.data.body.guideNameDisplay
              ? true
              : false; //是否展示名称
            this.ruleForm.name = res.data.body.guideName; //导购名称
            this.ruleForm.startTime = res.data.body.startTime; //开始时间
            this.ruleForm.endTime = res.data.body.endTime; //结束时间
            this.oneChoose.type = res.data.body.actionList[0].actionType.toUpperCase(); //跳转页面 APP H5
            this.twoChoose.type = res.data.body.actionList[1].actionType.toUpperCase();
            this.threeChoose.type = res.data.body.actionList[2].actionType.toUpperCase();
            //活动1
            this.oneChoose.topicId = res.data.body.actionList[0].actionParam;
            if (this.oneChoose.type === `APP`) {
              //选中为APP时，显示下拉框并赋值；
              this.oneChoose.showSelect = true;
              if (res.data.body.actionList[0].actionContent == 16) {
                this.oneChoose.special = true;
                this.oneChoose.topicName =
                  res.data.body.actionList[0].actionParamName;
              }
              this.options.forEach(el => {
                if (res.data.body.actionList[0].actionContent == el.value) {
                  this.oneChoose.selectText = el.value;
                }
              });
            } else {
              //为H5时，显示输入路径框
              this.oneChoose.param = true;
              this.oneChoose.path = res.data.body.actionList[0].actionContent;
              this.oneChoose.authorization =
                res.data.body.actionList[0].authorized;
            }
            this.oneChoose.picUrl = res.data.body.actionList[0].picUrl;
            this.fileOne.push({
              name: this.oneChoose.picUrl,
              value: this.oneChoose.picUrl
            });
            //活动2
            this.twoChoose.topicId = res.data.body.actionList[1].actionParam;
            if (this.twoChoose.type === `APP`) {
              this.twoChoose.showSelect = true;
              if (res.data.body.actionList[1].actionContent == 16) {
                this.twoChoose.special = true;
                this.twoChoose.topicName =
                  res.data.body.actionList[1].actionParamName;
              }
              this.options.forEach(el => {
                if (res.data.body.actionList[1].actionContent == el.value) {
                  this.twoChoose.selectText = el.value;
                }
              });
            } else {
              this.twoChoose.param = true;
              this.twoChoose.path = res.data.body.actionList[1].actionContent;
              this.twoChoose.authorization =
                res.data.body.actionList[1].authorized;
            }
            this.twoChoose.picUrl = res.data.body.actionList[1].picUrl;
            this.fileTwo.push({
              name: this.twoChoose.picUrl,
              value: this.twoChoose.picUrl
            });
            //活动3
            this.threeChoose.topicId = res.data.body.actionList[2].actionParam;
            if (this.threeChoose.type === `APP`) {
              this.threeChoose.showSelect = true;
              if (res.data.body.actionList[2].actionContent == 16) {
                this.threeChoose.special = true;
                this.threeChoose.topicName =
                  res.data.body.actionList[2].actionParamName;
              }
              this.options.forEach(el => {
                if (res.data.body.actionList[2].actionContent == el.value) {
                  this.threeChoose.selectText = el.value;
                }
              });
            } else {
              this.threeChoose.param = true;
              this.threeChoose.path = res.data.body.actionList[2].actionContent;
              this.threeChoose.authorization =
                res.data.body.actionList[2].authorized;
            }
            this.threeChoose.picUrl = res.data.body.actionList[2].picUrl;
            this.fileThree.push({
              name: this.threeChoose.picUrl,
              value: this.threeChoose.picUrl
            });
          } else {
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    toSpecialGuide() {
      this.$router.push("/specialinfor");
    },
    //h5授权
    authorization(currentIndex, currentAuthorization) {
      this.activitiesSection[currentIndex].authorization = currentAuthorization;
    },
    cancel() {
      this.$router.push("/ShoppingGuide");
    },
    assemblyFatherInformation() {
      console.log(`父组件`);
      console.log(this.publicPart);
      let lists = [],
        params = {};
      this.publicPart.forEach(el => {
        if (Object.values(el).includes("") || Object.values(el).includes(null))
          return;
        el.templateCode = `T5`;
        el.businessArea.forEach(el => {
          lists.push({
            checked: el.checked,
            traId: el.traId
          });
        });
        params.templateCode = el.templateCode;
        params.guideNameDisplay = el.showName ? 1 : 0;
        params.guideName = el.guideName;
        params.startTime = el.startTime;
        params.endTime = el.endTime;
        params.traSelectionList = lists;
        params.actionList = [];
      });
      console.log(params);
      if (!Object.keys(params).length) return false;
      return params;
    },
    assemblySonInformation(fatherParams) {
      console.log("父参数");
      console.log(fatherParams);
      if (!fatherParams) {
        return false;
      }
      // console.log(`父组合完成的`);
      // console.log(fatherParams);
      let sonParams = [];
      this.activitiesSection.forEach(el => {
        sonParams.push({
          actionType: el.type,
          actionContent: el.type === "APP" ? el.appSelectText : el.path,
          picUrl: el.picUrl,
          actionParam:
            el.type === "APP" && el.appSelectText === 16 ? el.topicId : "",
          authorized: el.authorization
        });
      });
      fatherParams.actionList = sonParams;
      console.log("子组件");
      console.log(fatherParams);
      return fatherParams;
      // console.log(this.activitiesSection);
    },
    add(subParams) {
      postRequest("/mall/shopping/guides/create", subParams).then(
        res => {
          console.log(res);
          new MessageBounced(`修改成功`, `success`).messageWindow();
          setTimeout(() => {
            this.$router.push("/shoppingGuide");
          }, 300);
        },
        error => {
          new MessageBounced(error.msg, `error`).messageWindow();
        }
      );
    },
    async submitForm(formName) {
      this.$emit("dataCorrection");
      const fatherResponse = await this.assemblyFatherInformation();
      const sonResponse = await this.assemblySonInformation(fatherResponse);
      this.$refs[formName].validate(valid => {
        if (valid) {
          sonResponse && this.add(sonResponse);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    modifyForm() {
      console.log(`修改专题`);
      if (this.status === `生效中`) {
        let params = {
          guideId: this.guideId,
          endTime: this.ruleForm.endTime
        };
        onlyDelayTime(params).then(
          res => {
            if (res.data.statusCode === 2000) {
              this.$message({
                message: `修改成功`,
                type: `success`
              });
              setTimeout(() => {
                this.$router.push("/shoppingGuide");
              }, 500);
            } else {
              this.$message({
                message: res.data.msg,
                type: `error`
              });
            }
          },
          error => {}
        );
      } else {
        let lists = [],
          activity = [],
          fanllyLists = [];
        this.areaLists.forEach(el => {
          lists.push({
            checked: el.checked,
            traId: el.traId
          });
        });
        Promise.all([
          this.checkActivityData1(),
          this.checkActivityData2(),
          this.checkActivityData3()
        ])
          .then(
            res => {
              console.log(res);
              console.log();
              if (this.oneChoose.type === "APP") {
                this.oneChoose.path = "";
              } else {
                this.oneChoose.selectText = "";
                this.oneChoose.topicId = "";
              }
              if (this.twoChoose.type === "APP") {
                this.twoChoose.path = "";
              } else {
                this.twoChoose.selectText = "";
                this.twoChoose.topicId = "";
              }
              if (this.threeChoose.type === "APP") {
                this.threeChoose.path = "";
              } else {
                this.threeChoose.selectText = "";
                this.threeChoose.topicId = "";
              }
              activity = [this.oneChoose, this.twoChoose, this.threeChoose];
              activity.forEach(el => {
                console.log(el);
                fanllyLists.push({
                  actionType: el.type,
                  actionContent: el.type === "APP" ? el.selectText : el.path,
                  picUrl: el.picUrl,
                  actionParam: el.topicId,
                  authorized: el.authorization
                });
              });
              console.log(fanllyLists);
              let params = {
                guideId: this.guideId,
                templateCode: "T5",
                guideNameDisplay: this.ruleForm.showName ? 1 : 0, //是否名称展示
                startTime: this.ruleForm.startTime,
                endTime: this.ruleForm.endTime,
                guideName: this.ruleForm.name, //导购名称
                traSelectionList: lists, //选择的商圈
                actionList: fanllyLists
              };
              console.log(params);
              return modifyGuide(params);
            },
            error => {}
          )
          .then(
            res => {
              if (res.data.statusCode === 2000) {
                console.log(res.data.body);
                this.$message({
                  message: `修改成功`,
                  type: `success`
                });
                setTimeout(() => {
                  this.$router.push("/shoppingGuide");
                }, 500);
              } else {
                this.$message({
                  message: res.data.msg,
                  type: `error`
                });
              }
            },
            error => {}
          );
      }
    },
    //模糊搜索
    searchTopic(topicName, fn) {
      let params = { topicName: topicName };
      getRequest("/mall/shopping/topics/dropdown", params).then(
        res => {
          res.body.length &&
            res.body.forEach(el => {
              el.value = el.topicName;
            });
          this.searchLists = res.body;
          fn(this.searchLists);
        },
        error => {}
      );
    },
    querySearchAsync(queryString, fn) {
      this.searchTopic(queryString, fn);
    },
    select(item, index) {
      this.activitiesSection[index].topicId = item.topicId;
      console.log(
        `目前选中中的专题ID为${this.activitiesSection[index].topicId}`
      );
    },
    //跳转的是app还是h5(单选框)
    // chooseTypes(chooseType, num) {
    //   switch (num) {
    //     case 1:
    //       this.oneChoose.type = chooseType;
    //       console.log(`第1栏跳转方式${this.oneChoose.type}`);
    //       console.log(`第1栏app选中项${this.oneChoose.selectText}`);
    //       if (chooseType === "APP") {
    //         this.oneChoose.showSelect = true;
    //         this.oneChoose.param = false;
    //       } else {
    //         this.oneChoose.showSelect = false;
    //         this.oneChoose.param = true;
    //         this.oneChoose.special = false; //专题搜索框
    //       }
    //       if (
    //         this.oneChoose.type === "APP" &&
    //         this.oneChoose.selectText === 16
    //       ) {
    //         this.oneChoose.special = true;
    //       }
    //       break;
    //     case 2:
    //       this.twoChoose.type = chooseType;
    //       console.log(`第2栏跳转方式${this.twoChoose.type}`);
    //       console.log(`第2栏app选中项${this.twoChoose.selectText}`);
    //       if (chooseType === "APP") {
    //         this.twoChoose.showSelect = true;
    //         this.twoChoose.param = false;
    //       } else {
    //         this.twoChoose.showSelect = false;
    //         this.twoChoose.param = true;
    //         this.twoChoose.special = false; //专题搜索框
    //       }
    //       if (
    //         this.twoChoose.type === "APP" &&
    //         this.twoChoose.selectText === 16
    //       ) {
    //         this.twoChoose.special = true;
    //       }
    //       break;
    //     case 3:
    //       this.threeChoose.type = chooseType;
    //       console.log(`第3栏跳转方式${this.threeChoose.type}`);
    //       console.log(`第3栏app选中项${this.threeChoose.selectText}`);
    //       if (chooseType === "APP") {
    //         this.threeChoose.showSelect = true;
    //         this.threeChoose.param = false;
    //       } else {
    //         this.threeChoose.showSelect = false;
    //         this.threeChoose.param = true;
    //         this.threeChoose.special = false; //专题搜索框
    //       }
    //       if (
    //         this.threeChoose.type === "APP" &&
    //         this.threeChoose.selectText === 16
    //       ) {
    //         this.threeChoose.special = true;
    //       }
    //       break;
    //   }
    // },
    //选择跳转页面选择项(完成)
    chooseTypes(type, index) {
      console.log(`当前跳转的下标${index}`);
      console.log(type);
      // this.activitiesSection[index].type = type;
      // this.activitiesSection[index].appSelect = true;
      if (type === "APP") {
        this.activitiesSection[index].appSelect = true;
        this.activitiesSection[index].type = type;
        this.activitiesSection[index].h5Param = false;
        this.activitiesSection[index].appSelectText === 16 && (this.activitiesSection[index].special = true);
      } else {
        this.activitiesSection[index].h5Param = true;
        this.activitiesSection[index].appSelect = false;
        this.activitiesSection[index].special = false;
      }
    },
    //app这边的下拉选项框(完成)
    selectPage(selectedIndex, index) {
      console.log(selectedIndex);
      selectedIndex === 16
        ? (this.activitiesSection[index].special = true)
        : (this.activitiesSection[index].special = false);
      this.activitiesSection[index].appSelectText = selectedIndex;
      // switch (num) {
      //   case 1:
      //     if (page === 16) {
      //       this.oneChoose.special = true;
      //     } else {
      //       this.oneChoose.special = false;
      //     }
      //     this.oneChoose.selectText = page;
      //     console.log(`第1栏选中code:${this.oneChoose.selectText}`);
      //     break;
      //   case 2:
      //     if (page === 16) {
      //       this.twoChoose.special = true;
      //     } else {
      //       this.twoChoose.special = false;
      //     }
      //     this.twoChoose.selectText = page;
      //     break;
      //   case 3:
      //     if (page === 16) {
      //       this.threeChoose.special = true;
      //     } else {
      //       this.threeChoose.special = false;
      //     }
      //     this.threeChoose.selectText = page;
      //     break;
      // }
    },
    h5Path(currentIndex, currentH5Path) {},
    removeImg(file, fileList, index) {
      console.log(`需要删除的文件下标${index}`);
      console.log(file);
      this.activitiesSection[index].picUrl = "";
      this.activitiesSection[index].filePic = [];
    },
    successImg(res, file, index) {
      if (res.statusCode !== 2000) {
        return new MessageBounced(res.msg, `error`).messageWindow();
      }
      res.statusCode === 2000 &&
        this.activitiesSection[index].filePic.push({
          name: res.body,
          url: res.body
        }) &&
        ((this.activitiesSection[index].picUrl = res.body),
        (this.activitiesSection[index].showImgLists = true));
      console.log(this.activitiesSection);
    }
  },
  created() {
    /**
     * 从导购列表传入如下参数
     * 1.@guideId 导购ID
     * 2.@status 状态 生效中，未生效，已停用，已删除，已结束，只有生效中才能延长时间
     */
    console.log(`demo5`);
    console.log(this.$route.params);
    if (this.$route.params.guideId) {
      this.guideId = this.$route.params.guideId;
      this.status = this.$route.params.status;
      if (this.status === `未生效`) {
        this.newCreate = false; //新创建的保存按钮
        this.modifySave = true; //修改的保存按钮
      } else if (this.status === `生效中`) {
        this.newCreate = false;
        this.modifySave = true;
        this.allDisabled = true;
        this.modifyTime = false;
      } else {
        if (!this.$route.params.text) {
          this.newCreate = false;
          this.modifySave = false;
          this.allDisabled = true;
          this.modifyTime = true;
        }
      }
      this.fromShoppingGuide();
    } else {
      // this.allArea();
    }
    // this.guideId=this.$route.params.guideId;
    // this.dataRequest();
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
