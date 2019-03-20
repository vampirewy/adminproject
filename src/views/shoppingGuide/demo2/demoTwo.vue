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
      <el-form-item label="活动1" required>
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
            <el-radio :disabled="allDisabled" v-for="(item,index) in jumpType" :label="item.name" :key="index"></el-radio>
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
          <!-- <el-input placeholder="搜索专题名称" v-if="showSpecial"></el-input> -->
          <el-autocomplete
            v-if="oneChoose.special"
            v-model="oneChoose.topicName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="select1"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button type="primary" v-if="oneChoose.special" @click="toSpecialGuide">创建新专题</el-button>
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
            <el-radio :disabled="allDisabled" v-for="(item,index) in jumpType" :label="item.name" :key="index"></el-radio>
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
          >
            <el-radio :disabled="allDisabled" v-for="(item,index) in jumpType" :label="item.name" :key="index"></el-radio>
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
          <el-input
            placeholder="页面可根据数据变化动态显示"
            @blur="h5Path(3)"
            v-model="threeChoose.path"
            v-if="threeChoose.param"
            :disabled="allDisabled"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="活动4" required>
        <el-form-item label="活动图片" class="show">
          <el-upload
            class="upload-demo"
            :action="upImgUrl"
            :headers="headers"
            :on-remove="removeFour"
            :before-remove="beforeRemoveFour"
            :on-success="imgFour"
            :limit="1"
            :file-list="fileFour"
            name="file"
            :disabled="allDisabled"
          >
            <el-button type="primary" size="mini">上传图片</el-button>
            <span slot="tip" class="el-upload__tip m_l_10">只能上传1张图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转页面" class="show">
          <el-radio-group
            v-model="fourChoose.type"
            @change="chooseTypes(fourChoose.type,4)"
            style="margin-right:10px;"
          >
            <el-radio :disabled="allDisabled" v-for="(item,index) in jumpType" :label="item.name" :key="index"></el-radio>
          </el-radio-group>
          <el-select
            style="display:block"
            v-model="fourChoose.selectText"
            placeholder="请选择"
            @change="selectPage(fourChoose.selectText,4)"
            v-if="fourChoose.showSelect"
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
            v-if="fourChoose.special"
            v-model="fourChoose.topicName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="select4"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button type="primary" v-if="fourChoose.special" @click="toSpecialGuide">创建新专题</el-button>
          <el-input
            placeholder="页面可根据数据变化动态显示"
            @blur="h5Path(4)"
            v-model="fourChoose.path"
            v-if="fourChoose.param"
            :disabled="allDisabled"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="活动5" required>
        <el-form-item label="活动图片" class="show">
          <el-upload
            class="upload-demo"
            :action="upImgUrl"
            :headers="headers"
            :on-remove="removeFive"
            :before-remove="beforeRemoveFive"
            :on-success="imgFive"
            :limit="1"
            :file-list="fileFive"
            name="file"
            :disabled="allDisabled"
          >
            <el-button type="primary" size="mini">上传图片</el-button>
            <span slot="tip" class="el-upload__tip m_l_10">只能上传1张图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转页面" class="show">
          <el-radio-group
            v-model="fiveChoose.type"
            @change="chooseTypes(fiveChoose.type,5)"
            style="margin-right:10px;"
          >
            <el-radio :disabled="allDisabled" v-for="(item,index) in jumpType" :label="item.name" :key="index"></el-radio>
          </el-radio-group>
          <el-select
            style="display:block"
            v-model="fiveChoose.selectText"
            placeholder="请选择"
            @change="selectPage(fiveChoose.selectText,5)"
            v-if="fiveChoose.showSelect"
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
            v-if="fiveChoose.special"
            v-model="fiveChoose.topicName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="select5"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button type="primary" v-if="fiveChoose.special" @click="toSpecialGuide">创建新专题</el-button>
          <el-input
            placeholder="页面可根据数据变化动态显示"
            @blur="h5Path(5)"
            v-model="fiveChoose.path"
            v-if="fiveChoose.param"
            :disabled="allDisabled"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="活动6" required>
        <el-form-item label="活动图片" class="show">
          <el-upload
            class="upload-demo"
            :action="upImgUrl"
            :headers="headers"
            :on-remove="removeSix"
            :before-remove="beforeRemoveSix"
            :on-success="imgSix"
            :limit="1"
            :file-list="fileSix"
            name="file"
            :disabled="allDisabled"
          >
            <el-button type="primary" size="mini">上传图片</el-button>
            <span slot="tip" class="el-upload__tip m_l_10">只能上传1张图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转页面" class="show">
          <el-radio-group
            v-model="sixChoose.type"
            @change="chooseTypes(sixChoose.type,6)"
            style="margin-right:10px;"
          >
            <el-radio :disabled="allDisabled" v-for="(item,index) in jumpType" :label="item.name" :key="index"></el-radio>
          </el-radio-group>
          <el-select
            style="display:block"
            v-model="sixChoose.selectText"
            placeholder="请选择"
            @change="selectPage(sixChoose.selectText,6)"
            v-if="sixChoose.showSelect"
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
            v-if="sixChoose.special"
            v-model="sixChoose.topicName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="select6"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button type="primary" v-if="sixChoose.special" @click="toSpecialGuide">创建新专题</el-button>
          <el-input
            placeholder="页面可根据数据变化动态显示"
            @blur="h5Path(6)"
            v-model="sixChoose.path"
            v-if="sixChoose.param"
            :disabled="allDisabled"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="活动7" required>
        <el-form-item label="活动图片" class="show">
          <el-upload
            class="upload-demo"
            :action="upImgUrl"
            :headers="headers"
            :on-remove="removeSeven"
            :before-remove="beforeRemoveSeven"
            :on-success="imgSeven"
            :limit="1"
            :file-list="fileSeven"
            name="file"
            :disabled="allDisabled"
          >
            <el-button type="primary" size="mini">上传图片</el-button>
            <span slot="tip" class="el-upload__tip m_l_10">只能上传1张图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转页面" class="show">
          <el-radio-group
            v-model="sevenChoose.type"
            @change="chooseTypes(sevenChoose.type,7)"
            style="margin-right:10px;"
          >
            <el-radio :disabled="allDisabled" v-for="(item,index) in jumpType" :label="item.name" :key="index"></el-radio>
          </el-radio-group>
          <el-select
            style="display:block"
            v-model="sevenChoose.selectText"
            placeholder="请选择"
            @change="selectPage(sevenChoose.selectText,7)"
            v-if="sevenChoose.showSelect"
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
            v-if="sevenChoose.special"
            v-model="sevenChoose.topicName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入专题名称"
            @select="select7"
            :disabled="allDisabled"
          ></el-autocomplete>
          <el-button type="primary" v-if="sevenChoose.special" @click="toSpecialGuide">创建新专题</el-button>
          <el-input
            placeholder="页面可根据数据变化动态显示"
            @blur="h5Path(7)"
            v-model="sevenChoose.path"
            v-if="sevenChoose.param"
            :disabled="allDisabled"
          ></el-input>
        </el-form-item>
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
import {
  create,
  guideDetails,
  modifyGuide,
  onlyDelayTime,
  checkSpecial
} from "@/api/shoppingGuide";
import { guideAllArea } from "@/api/headerBar";
export default {
  name: "demoTwo",
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
      timer: null,
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
        goods: "" //是否展示商品
      },
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
      },
      oneChoose: {
        type: "", //app还是h5
        topicName: "", //专题名称
        topicId: "",
        showSelect: false, //app下拉框显示
        selectText: "", //下拉框选中的值
        special: false, //专题搜索框和专题跳转按钮显示
        param: false, //h5输入框显示
        path: "", //h5路径
        picUrl: ""
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
        picUrl: ""
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
        picUrl: ""
      },
      fourChoose: {
        type: "",
        topicName: "",
        topicId: "",
        showSelect: false,
        selectText: "",
        special: false,
        param: false,
        path: "",
        picUrl: ""
      },
      fiveChoose: {
        type: "",
        topicName: "",
        topicId: "",
        showSelect: false,
        selectText: "",
        special: false,
        param: false,
        path: "",
        picUrl: ""
      },
      sixChoose: {
        type: "",
        topicName: "",
        topicId: "",
        showSelect: false,
        selectText: "",
        special: false,
        param: false,
        path: "",
        picUrl: ""
      },
      sevenChoose: {
        type: "",
        topicName: "",
        topicId: "",
        showSelect: false,
        selectText: "",
        special: false,
        param: false,
        path: "",
        picUrl: ""
      },
      headers: { sessionId: localStorage.getItem(`sessionId`) },
      upImgUrl: `${process.env.VUE_APP_BASE_URL}support/uploadPic`,
      fileOne: [], //装图片
      fileTwo: [],
      fileThree: [],
      fileFour: [],
      fileFive: [],
      fileSix: [],
      fileSeven: [],
      searchLists: [], //模糊搜索的数据
      jumpType: [{ name: "APP" }, { name: "H5" }],
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
      ],
      //最终需要的数据格式
      fanlly: [],
      one: {
        actionType: "", //app还是h5
        actionContent: "", // app的code值,或者h5的路径
        picUrl: "", //图片地址
        actionParam: "" //如果是专题详情时，写入traId值
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
            this.fourChoose.type = res.data.body.actionList[3].actionType.toUpperCase();
            this.fiveChoose.type = res.data.body.actionList[4].actionType.toUpperCase();
            this.sixChoose.type = res.data.body.actionList[5].actionType.toUpperCase();
            this.sevenChoose.type = res.data.body.actionList[6].actionType.toUpperCase();
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
            }
            this.threeChoose.picUrl = res.data.body.actionList[2].picUrl;
            this.fileThree.push({
              name: this.threeChoose.picUrl,
              value: this.threeChoose.picUrl
            });
            //活动4
            this.fourChoose.topicId = res.data.body.actionList[3].actionParam;
            if (this.fourChoose.type === `APP`) {
              this.fourChoose.showSelect = true;
              if (res.data.body.actionList[3].actionContent == 16) {
                this.fourChoose.special = true;
                this.fourChoose.topicName =
                  res.data.body.actionList[3].actionParamName;
              }
              this.options.forEach(el => {
                if (res.data.body.actionList[3].actionContent == el.value) {
                  this.fourChoose.selectText = el.value;
                }
              });
            } else {
              this.fourChoose.param = true;
              this.fourChoose.path = res.data.body.actionList[3].actionContent;
            }
            this.fourChoose.picUrl = res.data.body.actionList[3].picUrl;
            this.fileFour.push({
              name: this.fourChoose.picUrl,
              value: this.fourChoose.picUrl
            });
            //活动5
            this.fiveChoose.topicId = res.data.body.actionList[4].actionParam;
            if (this.fiveChoose.type === `APP`) {
              this.fiveChoose.showSelect = true;
              if (res.data.body.actionList[4].actionContent == 16) {
                this.fiveChoose.special = true;
                this.fiveChoose.topicName =
                  res.data.body.actionList[4].actionParamName;
              }
              this.options.forEach(el => {
                if (res.data.body.actionList[4].actionContent == el.value) {
                  this.fiveChoose.selectText = el.value;
                }
              });
            } else {
              this.fiveChoose.param = true;
              this.fiveChoose.path = res.data.body.actionList[4].actionContent;
            }
            this.fiveChoose.picUrl = res.data.body.actionList[4].picUrl;
            this.fileFive.push({
              name: this.fiveChoose.picUrl,
              value: this.fiveChoose.picUrl
            });
            //活动6
            this.sixChoose.topicId = res.data.body.actionList[5].actionParam;
            if (this.sixChoose.type === `APP`) {
              this.sixChoose.showSelect = true;
              if (res.data.body.actionList[5].actionContent == 16) {
                this.sixChoose.special = true;
                this.sixChoose.topicName =
                  res.data.body.actionList[5].actionParamName;
              }
              this.options.forEach(el => {
                if (res.data.body.actionList[5].actionContent == el.value) {
                  this.sixChoose.selectText = el.value;
                }
              });
            } else {
              this.sixChoose.param = true;
              this.sixChoose.path = res.data.body.actionList[5].actionContent;
            }
            this.sixChoose.picUrl = res.data.body.actionList[5].picUrl;
            this.fileSix.push({
              name: this.sixChoose.picUrl,
              value: this.sixChoose.picUrl
            });
            //活动7
            this.sevenChoose.topicId = res.data.body.actionList[6].actionParam;
            if (this.sevenChoose.type === `APP`) {
              this.sevenChoose.showSelect = true;
              if (res.data.body.actionList[5].actionContent == 16) {
                this.sevenChoose.special = true;
                this.sevenChoose.topicName =
                  res.data.body.actionList[6].actionParamName;
              }
              this.options.forEach(el => {
                if (res.data.body.actionList[5].actionContent == el.value) {
                  this.sevenChoose.selectText = el.value;
                }
              });
            } else {
              this.sevenChoose.param = true;
              this.sevenChoose.path = res.data.body.actionList[6].actionContent;
            }
            this.sevenChoose.picUrl = res.data.body.actionList[6].picUrl;
            this.fileSeven.push({
              name: this.sevenChoose.picUrl,
              value: this.sevenChoose.picUrl
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
    isShow() {
      console.log(`是否展示`);
      console.log(this.ruleForm.showName);
    },
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
    cancel() {
      this.$router.push("/ShoppingGuide");
    },
    submitForm(formName) {
      // this.subData();
      clearTimeout(this.timer);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.timer = setTimeout(() => {
            this.subData();
            // this.subData().then(res => {
            //   console.log(res.data);
            //   if (res.data.statusCode === 2000) {
            //     console.log(res.data.body);
            //   } else {
            //     this.$message({
            //       message: res.data.msg
            //     });
            //   }
            // });
          }, 500);
          // alert("submit!");
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
          error => {}
        );
      } else {
        let lists = [],
          activity = [],
          fanllyLists = [];
        this.areaLists.forEach(el => {
          lists.push({ checked: el.checked, traId: el.traId });
        });
        Promise.all([
          this.checkActivityData1(),
          this.checkActivityData2(),
          this.checkActivityData3(),
          this.checkActivityData4(),
          this.checkActivityData5(),
          this.checkActivityData6(),
          this.checkActivityData7()
        ])
          .then(
            res => {
              console.log(res);
              // this.fanlly=[{
              //   actionContent:path||selectText,
              //   actionType:type,
              //   picUrl:picUrl,
              //   actionParam:topicId
              // }];
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
              if (this.fourChoose.type === "APP") {
                this.fourChoose.path = "";
              } else {
                this.fourChoose.selectText = "";
                this.fourChoose.topicId = "";
              }
              if (this.fiveChoose.type === "APP") {
                this.fiveChoose.path = "";
              } else {
                this.fiveChoose.selectText = "";
                this.fiveChoose.topicId = "";
              }
              if (this.sixChoose.type === "APP") {
                this.sixChoose.path = "";
              } else {
                this.sixChoose.selectText = "";
                this.sixChoose.topicId = "";
              }
              if (this.sevenChoose.type === "APP") {
                this.sevenChoose.path = "";
              } else {
                this.sevenChoose.selectText = "";
                this.sevenChoose.topicId = "";
              }
              activity = [
                this.oneChoose,
                this.twoChoose,
                this.threeChoose,
                this.fourChoose,
                this.fiveChoose,
                this.sixChoose,
                this.sevenChoose
              ];
              activity.forEach(el => {
                // console.log(el);
                fanllyLists.push({
                  actionType: el.type,
                  actionContent: el.type === "APP" ? el.selectText : el.path,
                  picUrl: el.picUrl,
                  actionParam: el.topicId
                });
              });
              console.log(fanllyLists);
              let params = {
                templateCode: "T2",
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
                this.$message({ message: `修改成功`, type: `success` });
                setTimeout(() => {
                  this.$router.push("/shoppingGuide");
                }, 500);
              } else {
                this.$message({ message: res.data.msg, type: `error` });
              };
            },
            error => {}
          );
      }
    },
    //提交信息
    subData() {
      let lists = [],
        activity = [],
        fanllyLists = [];
      this.areaLists.forEach(el => {
        lists.push({ checked: el.checked, traId: el.traId });
      });
      Promise.all([
        this.checkActivityData1(),
        this.checkActivityData2(),
        this.checkActivityData3(),
        this.checkActivityData4(),
        this.checkActivityData5(),
        this.checkActivityData6(),
        this.checkActivityData7()
      ])
        .then(
          res => {
            console.log(res);
            // this.fanlly=[{
            //   actionContent:path||selectText,
            //   actionType:type,
            //   picUrl:picUrl,
            //   actionParam:topicId
            // }];
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
            if (this.fourChoose.type === "APP") {
              this.fourChoose.path = "";
            } else {
              this.fourChoose.selectText = "";
              this.fourChoose.topicId = "";
            }
            if (this.fiveChoose.type === "APP") {
              this.fiveChoose.path = "";
            } else {
              this.fiveChoose.selectText = "";
              this.fiveChoose.topicId = "";
            }
            if (this.sixChoose.type === "APP") {
              this.sixChoose.path = "";
            } else {
              this.sixChoose.selectText = "";
              this.sixChoose.topicId = "";
            }
            if (this.sevenChoose.type === "APP") {
              this.sevenChoose.path = "";
            } else {
              this.sevenChoose.selectText = "";
              this.sevenChoose.topicId = "";
            }
            activity = [
              this.oneChoose,
              this.twoChoose,
              this.threeChoose,
              this.fourChoose,
              this.fiveChoose,
              this.sixChoose,
              this.sevenChoose
            ];
            activity.forEach(el => {
              // console.log(el);
              fanllyLists.push({
                actionType: el.type,
                actionContent: el.type === "APP" ? el.selectText : el.path,
                picUrl: el.picUrl,
                actionParam: el.topicId
              });
            });
            console.log(fanllyLists);
            let params = {
              templateCode: "T2",
              guideNameDisplay: this.ruleForm.showName ? 1 : 0, //是否名称展示
              startTime: this.ruleForm.startTime,
              endTime: this.ruleForm.endTime,
              guideName: this.ruleForm.name, //导购名称
              traSelectionList: lists, //选择的商圈
              actionList: fanllyLists
            };
            console.log(params);
            return create(params);
          },
          error => {}
        )
        .then(
          res => {
            if (res.data.statusCode === 2000) {
              this.$message({
                message: `创建成功`,
                type:`success`
              });
              this.$router.push("/shoppingGuide");
            } else {
              this.$message({
                message: res.data.msg,
                type:`error`
              });
            }
          },
          error => {}
        );
    },
    checkActivityData1() {
      let promise = new Promise((resolve, reject) => {
        if (this.oneChoose.picUrl === "") {
          this.$message({ message: `请上传活动一的图片`,type:`error` });
        } else {
          if (this.oneChoose.type === "APP") {
            if (this.oneChoose.selectText == "") {
              this.$message({ message: `请选择活动一的app页面`,type:`error` });
            } else {
              return resolve(`通过活动一的app页面`);
            }
          } else if (this.oneChoose.type === "H5") {
            if (this.oneChoose.path == "") {
              this.$message({ message: `请填写活动一的h5页面参数`,type:`error` });
            } else {
              return resolve(`通过活动一的h5页面参数`);
            }
          } else {
            this.$message({ message: `请选择活动一的跳转页面`,type:`error` });
          }
        }
      });
      return promise;
    },
    checkActivityData2() {
      let promise = new Promise((resolve, reject) => {
        if (this.twoChoose.picUrl === "") {
          this.$message({ message: `请上传活动二的图片`,type:`error` });
        } else {
          if (this.twoChoose.type === "APP") {
            if (this.twoChoose.selectText == "") {
              this.$message({ message: `请选择活动二的app页面`,type:`error` });
            } else {
              return resolve(`通过活动二的app页面`);
            }
          } else if (this.twoChoose.type === "H5") {
            if (this.twoChoose.path == "") {
              this.$message({ message: `请填写活动二的h5页面参数`,type:`error` });
            } else {
              return resolve(`通过活动二的h5页面参数`);
            }
          } else {
            this.$message({ message: `请选择活动二的跳转页面`,type:`error` });
          }
        }
      });
      return promise;
    },
    checkActivityData3() {
      let promise = new Promise((resolve, reject) => {
        if (this.threeChoose.picUrl === "") {
          this.$message({ message: `请上传活动三的图片`,type:`error` });
        } else {
          if (this.threeChoose.type === "APP") {
            if (this.threeChoose.selectText == "") {
              this.$message({ message: `请选择活动三的app页面`,type:`error` });
            } else {
              return resolve(`通过活动三的app页面`);
            }
          } else if (this.threeChoose.type === "H5") {
            if (this.threeChoose.path == "") {
              this.$message({ message: `请填写活动三的h5页面参数`,type:`error` });
            } else {
              return resolve(`通过活动三的h5页面参数`);
            }
          } else {
            this.$message({ message: `请选择活动三的跳转页面`,type:`error` });
          }
        }
      });
      return promise;
    },
    checkActivityData4() {
      let promise = new Promise((resolve, reject) => {
        if (this.fourChoose.picUrl === "") {
          this.$message({ message: `请上传活动四的图片`,type:`error` });
        } else {
          if (this.fourChoose.type === "APP") {
            if (this.fourChoose.selectText == "") {
              this.$message({ message: `请选择活动四的app页面`,type:`error` });
            } else {
              return resolve(`通过活动四的app页面`);
            }
          } else if (this.fourChoose.type === "H5") {
            if (this.fourChoose.path == "") {
              this.$message({ message: `请填写活动四的h5页面参数`,type:`error` });
            } else {
              return resolve(`通过活动四的h5页面参数`);
            }
          } else {
            this.$message({ message: `请选择活动四的跳转页面`,type:`error` });
          }
        }
      });
      return promise;
    },
    checkActivityData5() {
      let promise = new Promise((resolve, reject) => {
        if (this.fiveChoose.picUrl === "") {
          this.$message({ message: `请上传活动五的图片`,type:`error` });
        } else {
          if (this.fiveChoose.type === "APP") {
            if (this.fiveChoose.selectText == "") {
              this.$message({ message: `请选择活动五的app页面`,type:`error` });
            } else {
              return resolve(`通过活动五的app页面`);
            }
          } else if (this.fiveChoose.type === "H5") {
            if (this.fiveChoose.path == "") {
              this.$message({ message: `请填写活动五的h5页面参数`,type:`error` });
            } else {
              return resolve(`通过活动五的h5页面参数`);
            }
          } else {
            this.$message({ message: `请选择活动五的跳转页面`,type:`error` });
          }
        }
      });
      return promise;
    },
    checkActivityData6() {
      let promise = new Promise((resolve, reject) => {
        if (this.sixChoose.picUrl === "") {
          this.$message({ message: `请上传活动六的图片`,type:`error` });
        } else {
          if (this.sixChoose.type === "APP") {
            if (this.sixChoose.selectText == "") {
              this.$message({ message: `请选择活动六的app页面`,type:`error` });
            } else {
              return resolve(`通过活动六的app页面`);
            }
          } else if (this.sixChoose.type === "H5") {
            if (this.sixChoose.path == "") {
              this.$message({ message: `请填写活动六的h5页面参数`,type:`error` });
            } else {
              return resolve(`通过活动六的h5页面参数`);
            }
          } else {
            this.$message({ message: `请选择活动六的跳转页面`,type:`error` });
          }
        }
      });
      return promise;
    },
    checkActivityData7() {
      let promise = new Promise((resolve, reject) => {
        if (this.sevenChoose.picUrl === "") {
          this.$message({ message: `请上传活动七的图片`,type:`error` });
        } else {
          if (this.sevenChoose.type === "APP") {
            if (this.sevenChoose.selectText == "") {
              this.$message({ message: `请选择活动七的app页面`,type:`error` });
            } else {
              return resolve(`通过活动七的app页面`);
            }
          } else if (this.sevenChoose.type === "H5") {
            if (this.sevenChoose.path == "") {
              this.$message({ message: `请填写活动七的h5页面参数`,type:`error` });
            } else {
              return resolve(`通过活动七的h5页面参数`);
            }
          } else {
            this.$message({ message: `请选择活动七的跳转页面`,type:`error` });
          }
        }
      });
      return promise;
    },
    //模糊搜索
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
    querySearchAsync(queryString, fn) {
      this.searchTopic(queryString, fn);
    },
    select1(item) {
      //只要topicId,当选择app页面中的专题详情时
      console.log(item);
      this.oneChoose.topicName = item.value;
      this.oneChoose.topicId = item.topicId;
      console.info(
        `第1栏搜索名称${this.oneChoose.topicName},id号${this.oneChoose.topicId}`
      );
    },
    select2(item) {
      console.info(`第2栏搜索`);
      console.log(item);
      this.twoChoose.topicName = item.value;
      this.twoChoose.topicId = item.topicId;
      console.info(
        `第2栏搜索名称${this.twoChoose.topicName},id号${this.twoChoose.topicId}`
      );
    },
    select3(item) {
      console.info(`第三栏搜索`);
      console.log(item);
      this.threeChoose.topicName = item.value;
      this.threeChoose.topicId = item.topicId;
      console.info(
        `第3栏搜索名称${this.threeChoose.topicName},id号${
          this.threeChoose.topicId
        }`
      );
    },
    select4(item) {
      console.info(`第四栏搜索`);
      console.log(item);
      this.fourChoose.topicName = item.value;
      this.fourChoose.topicId = item.topicId;
      console.info(
        `第4栏搜索名称${this.fourChoose.topicName},id号${
          this.fourChoose.topicId
        }`
      );
    },
    select5(item) {
      console.info(`第五栏搜索`);
      console.log(item);
      this.fiveChoose.topicName = item.value;
      this.fiveChoose.topicId = item.topicId;
      console.info(
        `第5栏搜索名称${this.fiveChoose.topicName},id号${
          this.fiveChoose.topicId
        }`
      );
    },
    select6(item) {
      console.info(`第六栏搜索`);
      console.log(item);
      this.sixChoose.topicName = item.value;
      this.sixChoose.topicId = item.topicId;
      console.info(
        `第6栏搜索名称${this.sixChoose.topicName},id号${this.sixChoose.topicId}`
      );
    },
    select7(item) {
      console.info(`第七栏搜索`);
      console.log(item);
      this.sevenChoose.topicName = item.value;
      this.sevenChoose.topicId = item.topicId;
      console.info(
        `第7栏搜索名称${this.sevenChoose.topicName},id号${
          this.sevenChoose.topicId
        }`
      );
    },
    //跳转的是app还是h5(单选框)
    chooseTypes(chooseType, num) {
      switch (num) {
        case 1:
          this.oneChoose.type = chooseType;
          console.log(`第1栏跳转方式${this.oneChoose.type}`);
          console.log(`第1栏app选中项${this.oneChoose.selectText}`);
          if (chooseType === "APP") {
            this.oneChoose.showSelect = true;
            this.oneChoose.param = false;
          } else {
            this.oneChoose.showSelect = false;
            this.oneChoose.param = true;
            this.oneChoose.special = false; //专题搜索框
          }
          if (
            this.oneChoose.type === "APP" &&
            this.oneChoose.selectText === 16
          ) {
            this.oneChoose.special = true;
          }
          break;
        case 2:
          this.twoChoose.type = chooseType;
          console.log(`第2栏跳转方式${this.twoChoose.type}`);
          console.log(`第2栏app选中项${this.twoChoose.selectText}`);
          if (chooseType === "APP") {
            this.twoChoose.showSelect = true;
            this.twoChoose.param = false;
          } else {
            this.twoChoose.showSelect = false;
            this.twoChoose.param = true;
            this.twoChoose.special = false; //专题搜索框
          }
          if (
            this.twoChoose.type === "APP" &&
            this.twoChoose.selectText === 16
          ) {
            this.twoChoose.special = true;
          }
          break;
        case 3:
          this.threeChoose.type = chooseType;
          console.log(`第3栏跳转方式${this.threeChoose.type}`);
          console.log(`第3栏app选中项${this.threeChoose.selectText}`);
          if (chooseType === "APP") {
            this.threeChoose.showSelect = true;
            this.threeChoose.param = false;
          } else {
            this.threeChoose.showSelect = false;
            this.threeChoose.param = true;
            this.threeChoose.special = false; //专题搜索框
          }
          if (
            this.threeChoose.type === "APP" &&
            this.threeChoose.selectText === 16
          ) {
            this.threeChoose.special = true;
          }
          break;
        case 4:
          this.fourChoose.type = chooseType;
          console.log(`第4栏跳转方式${this.fourChoose.type}`);
          console.log(`第4栏app选中项${this.fourChoose.selectText}`);
          if (chooseType === "APP") {
            this.fourChoose.showSelect = true;
            this.fourChoose.param = false;
          } else {
            this.fourChoose.showSelect = false;
            this.fourChoose.param = true;
            this.fourChoose.special = false; //专题搜索框
          }
          if (
            this.fourChoose.type === "APP" &&
            this.fourChoose.selectText === 16
          ) {
            this.fourChoose.special = true;
          }
          break;
        case 5:
          this.fiveChoose.type = chooseType;
          console.log(`第5栏跳转方式${this.fiveChoose.type}`);
          console.log(`第5栏app选中项${this.fiveChoose.selectText}`);
          if (chooseType === "APP") {
            this.fiveChoose.showSelect = true;
            this.fiveChoose.param = false;
          } else {
            this.fiveChoose.showSelect = false;
            this.fiveChoose.param = true;
            this.fiveChoose.special = false; //专题搜索框
          }
          if (
            this.fiveChoose.type === "APP" &&
            this.fiveChoose.selectText === 16
          ) {
            this.fiveChoose.special = true;
          }
          break;
        case 6:
          this.sixChoose.type = chooseType;
          console.log(`第6栏跳转方式${this.sixChoose.type}`);
          console.log(`第6栏app选中项${this.sixChoose.selectText}`);
          if (chooseType === "APP") {
            this.sixChoose.showSelect = true;
            this.sixChoose.param = false;
          } else {
            this.sixChoose.showSelect = false;
            this.sixChoose.param = true;
            this.sixChoose.special = false; //专题搜索框
          }
          if (
            this.sixChoose.type === "APP" &&
            this.sixChoose.selectText === 16
          ) {
            this.sixChoose.special = true;
          }
          break;
        case 7:
          this.sevenChoose.type = chooseType;
          console.log(`第7栏跳转方式${this.sevenChoose.type}`);
          console.log(`第7栏app选中项${this.sevenChoose.selectText}`);
          if (chooseType === "APP") {
            this.sevenChoose.showSelect = true;
            this.sevenChoose.param = false;
          } else {
            this.sevenChoose.showSelect = false;
            this.sevenChoose.param = true;
            this.sevenChoose.special = false; //专题搜索框
          }
          if (
            this.sevenChoose.type === "APP" &&
            this.sevenChoose.selectText === 16
          ) {
            this.sevenChoose.special = true;
          }
          break;
      }
    },
    //app这边的下拉选项框
    selectPage(page, num) {
      switch (num) {
        case 1:
          if (page === 16) {
            this.oneChoose.special = true;
          } else {
            this.oneChoose.special = false;
          }
          this.oneChoose.selectText = page;
          console.log(`第1栏选中code:${this.oneChoose.selectText}`);
          break;
        case 2:
          if (page === 16) {
            this.twoChoose.special = true;
          } else {
            this.twoChoose.special = false;
          }
          this.twoChoose.selectText = page;
          break;
        case 3:
          if (page === 16) {
            this.threeChoose.special = true;
          } else {
            this.threeChoose.special = false;
          }
          this.threeChoose.selectText = page;
          break;
        case 4:
          if (page === 16) {
            this.fourChoose.special = true;
          } else {
            this.fourChoose.special = false;
          }
          this.fourChoose.selectText = page;
          break;
        case 5:
          if (page === 16) {
            this.fiveChoose.special = true;
          } else {
            this.fiveChoose.special = false;
          }
          this.fiveChoose.selectText = page;
          break;
        case 6:
          if (page === 16) {
            this.sixChoose.special = true;
          } else {
            this.sixChoose.special = false;
          }
          this.sixChoose.selectText = page;
          break;
        case 7:
          if (page === 16) {
            this.sevenChoose.special = true;
          } else {
            this.sevenChoose.special = false;
          }
          this.sevenChoose.selectText = page;
          break;
      }
    },
    h5Path(num) {
      switch (num) {
        case 1:
          console.log(`第1栏h5路径${this.oneChoose.path}`);
          break;
        case 2:
          console.log(`第2栏h5路径${this.twoChoose.path}`);
          break;
        case 3:
          console.log(`第3栏h5路径${this.threeChoose.path}`);
          break;
        case 4:
          console.log(`第4栏h5路径${this.fourChoose.path}`);
          break;
        case 5:
          console.log(`第5栏h5路径${this.fiveChoose.path}`);
          break;
        case 6:
          console.log(`第6栏h5路径${this.sixChoose.path}`);
          break;
        case 7:
          console.log(`第7栏h5路径${this.sevenChoose.path}`);
          break;
      }
    },
    imgOne(res) {
      console.log(res);
      if (res.statusCode === 2000) {
        this.fileOne.push({ name: res.body, url: res.body });
        this.oneChoose.picUrl = res.body;
      } else {
        this.$message({
          message: res.msg,type:`error`
        });
      }
    },
    // handlePreview(file) {
    //   console.warn(file);
    // },
    removeOne(files, fileList) {
      //确认删除后，数组清空,因为只有一个文件
      this.fileOne = [];
    },
    beforeRemoveOne(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    imgTwo(res) {
      console.log(res);
      if (res.statusCode === 2000) {
        this.fileTwo.push({ name: res.body, url: res.body });
        this.twoChoose.picUrl = res.body;
      } else {
        this.$message({
          message: res.msg,type:`error`
        });
      }
    },
    removeTwo(files, fileList) {
      //确认删除后，数组清空,因为只有一个文件
      this.fileTwo = [];
    },
    beforeRemoveTwo(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    imgThree(res) {
      console.log(res);
      if (res.statusCode === 2000) {
        this.fileThree.push({ name: res.body, url: res.body });
        this.threeChoose.picUrl = res.body;
      } else {
        this.$message({
          message: res.msg,type:`error`
        });
      }
    },
    removeThree(files, fileList) {
      //确认删除后，数组清空,因为只有一个文件
      this.fileThree = [];
    },
    beforeRemoveThree(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    imgFour(res) {
      console.log(res);
      if (res.statusCode === 2000) {
        this.fileFour.push({ name: res.body, url: res.body });
        this.fourChoose.picUrl = res.body;
      } else {
        this.$message({
          message: res.msg,type:`error`
        });
      }
    },
    removeFour(files, fileList) {
      //确认删除后，数组清空,因为只有一个文件
      this.fileFour = [];
    },
    beforeRemoveFour(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    imgFive(res) {
      console.log(res);
      if (res.statusCode === 2000) {
        this.fileFive.push({ name: res.body, url: res.body });
        this.fiveChoose.picUrl = res.body;
      } else {
        this.$message({
          message: res.msg,type:`error`
        });
      }
    },
    removeFive(files, fileList) {
      //确认删除后，数组清空,因为只有一个文件
      this.fileFive = [];
    },
    beforeRemoveFive(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    imgSix(res) {
      console.log(res);
      if (res.statusCode === 2000) {
        this.fileSix.push({ name: res.body, url: res.body });
        this.sixChoose.picUrl = res.body;
      } else {
        this.$message({
          message: res.msg,type:`error`
        });
      }
    },
    removeSix(files, fileList) {
      //确认删除后，数组清空,因为只有一个文件
      this.fileSix = [];
    },
    beforeRemoveSix(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    imgSeven(res) {
      console.log(res);
      if (res.statusCode === 2000) {
        this.fileSeven.push({ name: res.body, url: res.body });
        this.sevenChoose.picUrl = res.body;
      } else {
        this.$message({
          message: res.msg,type:`error`
        });
      }
    },
    removeSeven(files, fileList) {
      //确认删除后，数组清空,因为只有一个文件
      this.fileSeven = [];
    },
    beforeRemoveSeven(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  },
  created() {
    console.log(`demo2`);
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
        };
      };
      this.fromShoppingGuide();
    } else {
      this.allArea();
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
.m_l_10{
  margin-left:10px;
}
</style>