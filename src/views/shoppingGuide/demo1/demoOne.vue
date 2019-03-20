<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="名称展示" class="show" prop="showName">
        <el-checkbox :disabled="allDisabled" v-model="ruleForm.showName" @change="isShow()">展示</el-checkbox>
      </el-form-item>

      <el-form-item label="导购名称" prop="name" class="show">
        <el-input :disabled="allDisabled" v-model="ruleForm.name" placeholder="请输入导购名称"></el-input>
      </el-form-item>
      <el-form-item label="商圈" prop="type" class="show">
        <el-checkbox-group v-model="ruleForm.type" @change="chooseArea(ruleForm.type)">
          <el-checkbox
            v-for="(item,index) in areaLists"
            :label="item.traName"
            :key="index"
            name="type"
            @change="chooseArea1(item)"
            :disabled="allDisabled"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="开始时间" required>
        <el-col :span="11">
          <el-form-item prop="startTime">
            <el-date-picker
              type="datetime"
              placeholder="选择时间日期"
              v-model="ruleForm.startTime"
              style="width: 100%;"
              default-time="16:00:00"
              @change="startTime(ruleForm.startTime)"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="allDisabled"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="结束时间" required>
        <el-col :span="11">
          <el-form-item prop="endTime">
            <el-date-picker
              type="datetime"
              placeholder="选择时间日期"
              v-model="ruleForm.endTime"
              style="width: 100%;"
              default-time="16:00:00"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="endTime(ruleForm.endTime)"
              :disabled="modifyTime"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="活动图片" prop="fileList" class="show" required>
        <el-upload
          class="upload-demo"
          :action="upImgUrl"
          :headers="headers"
          :on-preview="handlePreview"
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
      <el-form-item label="跳转页面" class="show">
        <div style="display:flex;">
          <el-autocomplete
            v-model="ruleForm.pathValue"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="selectTopicName"
            :disabled="allDisabled"
          ></el-autocomplete>
          <!-- <el-input v-model="ruleForm.path" placeholder="请输入专题名称"></el-input> -->
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
        <el-button type="primary" @click="modifyForm('ruleForm')" v-if="modifySave">保存</el-button>
        <el-button @click="cancel()" v-if="newCreate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { guideAllArea } from "@/api/headerBar";
import {
  create,
  guideDetails,
  modifyGuide,
  onlyDelayTime,
  checkSpecial
} from "@/api/shoppingGuide";
import { setTimeout } from "timers";
export default {
  name: "demoOne",
  // props: {
  //   areaLists: Array
  // },
  data() {
    return {
      newCreate: true, //新建保存
      modifySave: false, //修改保存
      modifyTime: false, //只可修改结束时间
      allDisabled: false, //全部禁用
      areaLists: [], //商圈
      reg: /^[+]?\d*$/,
      timer: null,
      headers: { sessionId: localStorage.getItem(`sessionId`) }, //图片上传的参数
      upImgUrl: `${process.env.VUE_APP_BASE_URL}support/uploadPic`,
      chooseGoods: false, //是否展示商品是选择自定义时，显示input框
      inputGoodsNum: null, //input框输入的数字
      searchLists: [], //模糊搜索的专题数据
      ruleForm: {
        showName: false, //是否名称展示
        name: "", //导购名称
        startTime: "", //开始时间
        endTime: "", //结束时间
        type: [], //选择商圈
        // resource: "模版1", //默认模版
        fileList: [], //显示在页面上图片
        submitImg: "", //初阶上转的图片
        path: "", //页面路径
        pathValue: "",
        goods: "" //是否展示商品
      },
      resourceLists: [
        { name: "模版1" },
        { name: "模版2" },
        { name: "模版3" },
        { name: "模版4" },
        { name: "模版5" }
      ],
      showLists: [
        { name: "不展示" },
        { name: "前3个" },
        { name: "前6个" },
        { name: "前9个" },
        { name: "自定义" }
      ],
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { max: 10, message: "最多10个字", trigger: "blur" }
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
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个投放商圈",
            trigger: "change"
          }
        ],
        showName: [
          {
            type: "boolean",
            required: true,
            message: "请选择是否展示名称",
            trigger: "change"
          }
        ],
        // resource: [
        //   { required: true, message: "请选择使用模版", trigger: "change" }
        // ],
        // fileList: [
        //   {
        //     message: "请上传图片",
        //     trigger: "successImg"
        //   }
        // ],
        goods: [
          { required: true, message: "请至少选择一项", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    allArea() {
      guideAllArea().then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            this.areaLists = res.data.body;
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    fromShoppingGuide() {
      let params = { guideId: this.guideId };
      guideDetails(params).then(
        res => {
          if (res.data.statusCode === 2000) {
            console.log(res.data.body);
            this.areaLists = res.data.body.traSelectionList;
            this.areaLists.forEach(el => {
              if (el.checked) {
                this.ruleForm.type.push(el.traName);
              }
            });
            this.ruleForm.startTime = res.data.body.startTime;
            this.ruleForm.endTime = res.data.body.endTime;
            this.ruleForm.name = res.data.body.guideName;
            this.ruleForm.showName = res.data.body.guideNameDisplay
              ? true
              : false;
            if (res.data.body.showGoodsCount === 0) {
              this.ruleForm.goods = `不展示`;
            } else if (res.data.body.showGoodsCount === 3) {
              this.ruleForm.goods = `前3个`;
            } else if (res.data.body.showGoodsCount === 6) {
              this.ruleForm.goods = `前6个`;
            } else if (res.data.body.showGoodsCount === 9) {
              this.ruleForm.goods = `前9个`;
            } else {
              this.ruleForm.goods = `自定义`;
              this.inputGoodsNum = res.data.body.showGoodsCount;
              this.chooseGoods = true;
            }
            if (res.data.body.actionList.length) {
              this.ruleForm.fileList.push({
                name: res.data.body.actionList[0].picUrl,
                value: res.data.body.actionList[0].picUrl
              });
              this.ruleForm.submitImg = res.data.body.actionList[0].picUrl;
              this.ruleForm.pathValue =
                res.data.body.actionList[0].actionParamName;
              this.ruleForm.path = res.data.body.actionList[0].actionParam;
            }
          } else {
          }
        },
        error => {}
      );
    },
    isShow() {
      console.log(`是否展示`);
      console.log(this.ruleForm.showName);
    },
    /*
     * 此为选择商圈类型(多选)，后台数据格式为数组对象，需所有商圈数据全部返回，不论选中还是未选中;
     * 格式为{traSelectionLists:[{checked:true,traId:1},{...}]}
     * 1. @areaName Array，为选中的商圈
     * 2. areaLists ArrayObj，获取到的所有商圈
     * 3. 在areaLists中加入checked属性，最后提交时进行数组组装
     */
    chooseArea(areaName) {
      // console.log(areaName);
      // areaName.length &&
      //   areaName.forEach(el => {
      //     this.areaLists.length &&
      //       this.areaLists.forEach(el1 => {
      //         if (el === el1.traName) {
      //           el1.checked = true;
      //         }
      //       });
      //   });
      // console.warn(this.areaLists);
    },
    chooseArea1(item) {
      this.areaLists.length &&
        this.areaLists.forEach(el => {
          if (el.traName === item.traName) {
            item.checked = !item.checked;
          }
        });
      console.log(`最新数据`);
      console.log(this.areaLists);
    },
    //开始时间
    startTime(date) {
      console.info(`开始时间为${date}`);
    },
    endTime(date) {
      console.info(`结束时间为${date}`);
    },
    handlePreview(file) {
      console.warn(file);
    },
    handleRemove(files, fileList) {
      //确认删除后，数组清空,因为只有一个文件
      this.ruleForm.fileList = [];
      this.ruleForm.submitImg = "";
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
      }
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
    submitForm(formName) {
      console.log(`现在是模版:${this.ruleForm.resource}`);
      clearTimeout(this.timer);
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("submit!");
          this.timer = setTimeout(() => {
            // this.subData();
            this.subData().then(res => {
              console.log(res.data);
              if (res.data.statusCode === 2000) {
                console.log(res.data.body);
                this.$message({
                  message: `创建成功`,
                  type: `success`
                });
                this.$router.push("/shoppingGuide");
              } else {
                this.$message({
                  message: res.data.msg,
                  type: `error`
                });
              }
            });
          }, 500);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //修改信息
    modifyForm() {
      if (this.status === `生效中`) {
        let [endTime, guideId] = [this.ruleForm.endTime, this.guideId];
        onlyDelayTime({ endTime, guideId }).then(
          res => {
            if (res.data.statusCode === 2000) {
              this.$message({ message: `修改成功`, type: `success` });
              setTimeout(() => {
                this.$router.push("/shoppingGuide");
              }, 500);
            } else {
              this.$message({ message: res.data.msg, type: `error` });
            }
          },
          error => {
            console.log(error);
          }
        );
      } else {
        let lists = [];
        this.areaLists.forEach(el => {
          lists.push({ checked: el.checked, traId: el.traId });
        });
        let params = {
          guideId: this.guideId,
          templateCode: "T1",
          guideNameDisplay: this.ruleForm.showName ? 1 : 0, //是否名称展示
          startTime: this.ruleForm.startTime,
          endTime: this.ruleForm.endTime,
          guideName: this.ruleForm.name, //导购名称
          traSelectionList: lists, //选择的商圈
          actionList: [
            {
              actionType: `app`,
              actionContent: `16`,
              picUrl: this.ruleForm.submitImg,
              actionParam: this.ruleForm.path //跳转页面
            }
          ],
          //只针对模版1
          showGoodsCount:
            this.ruleForm.goods === `不展示`
              ? "0"
              : this.ruleForm.goods === `前3个`
              ? "3"
              : this.ruleForm.goods === `前6个`
              ? "6"
              : this.ruleForm.goods === `前9个`
              ? "9"
              : this.ruleForm.goods === `自定义`
              ? this.inputGoodsNum
              : ""
        };
        modifyGuide(params).then(
          res => {
            if (res.data.statusCode === 2000) {
              this.$message({ message: `修改成功`, type: `success` });
              setTimeout(() => {
                this.$router.push("/shoppingGuide");
              }, 500);
            } else {
              this.$message({ message: res.data.msg, type: `error` });
            }
          },
          error => {}
        );
      }
    },
    //提交信息
    subData() {
      let lists = [];
      this.areaLists.forEach(el => {
        lists.push({ checked: el.checked, traId: el.traId });
      });
      let params = {
        templateCode: "T1",
        guideNameDisplay: this.ruleForm.showName ? 1 : 0, //是否名称展示
        startTime: this.ruleForm.startTime,
        endTime: this.ruleForm.endTime,
        guideName: this.ruleForm.name, //导购名称
        traSelectionList: lists, //选择的商圈
        actionList: [
          {
            actionType: `app`,
            actionContent: `16`,
            picUrl: this.ruleForm.submitImg,
            actionParam: this.ruleForm.path //跳转页面
          }
        ],
        //只针对模版1
        showGoodsCount:
          this.ruleForm.goods === `不展示`
            ? "0"
            : this.ruleForm.goods === `前3个`
            ? "3"
            : this.ruleForm.goods === `前6个`
            ? "6"
            : this.ruleForm.goods === `前9个`
            ? "9"
            : this.ruleForm.goods === `自定义`
            ? this.inputGoodsNum
            : ""
      };
      console.log(params);
      return create(params);
    }
  },
  created() {
    console.log(`demo1`);
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
      this.allArea();
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
.m_l_10{
  margin-left:10px;
}
</style>