<template>
  <div class="pop_manager">
    <HeaderBar :showArea="showArea" @searchPopName="popRequest"></HeaderBar>
    <el-row>
      <el-col :span="24">
      <el-table :data="popLists" style="width: 100%" border stripe>
        <!-- <el-table-column align="center" type="index"></el-table-column> -->
        <el-table-column align="center" prop="id" label="ID" width="50"></el-table-column>
        <el-table-column align="center" prop="img" label="图片" width="100">
          <template scope="scope">
              <img :src="scope.row.img?scope.row.img:''" style="width:80px;">
            </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="jump" label="跳转到"></el-table-column>
        <el-table-column align="center" prop="pushNum popNum" label="推送量/弹窗量" width="90">
          <template slot-scope="scope">
            <span>{{scope.row.pushNum}}</span>&nbsp;/&nbsp;<span>{{scope.row.popNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="clickNum" label="点击量" width="80"></el-table-column>
        <el-table-column align="center" prop="sortIndex" label="排序">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sortIndex" size="mini" @blur="sort(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="startTime" label="开始时间">
        </el-table-column>
        <el-table-column align="center" prop="endTime" label="结束时间"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="user" label="更新人"></el-table-column>
        <el-table-column align="center" prop="status" label="状态"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.see" type="text" @click="see(scope.row,scope.$index)">{{scope.row.see}}</el-button>
            <el-button v-if="scope.row.del" type="text" @click="del(scope.row,scope.$index)">{{scope.row.del}}</el-button>
            <el-button v-if="scope.row.stop" type="text" @click="stop(scope.row,scope.$index)">{{scope.row.stop}}</el-button>
            <el-button v-if="scope.row.reEdit" type="text" @click="reEdit(scope.row,scope.$index)">{{scope.row.reEdit}}</el-button>
            <el-button v-if="scope.row.export" type="text" @click="exportExcel(scope.row,scope.$index)">{{scope.row.export}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-col>
    </el-row>
    <div class="pagination">
      <el-button size="mini" @click.native="firstPage">首页</el-button>
      <el-pagination
        background
        layout="prev, pager, next,total,jumper"
        prev-text="上一页"
        next-text="下一页"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="pageNum"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <el-button size="mini" @click.native="lastPage">尾页</el-button>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/headerBar.vue";
import img from "../../img/demo1.png";
export default {
  name: "popmanager",
  components: {
    HeaderBar
  },
  data() {
    return {
      showArea: false, //头部商圈隐藏
      pageNum: 1,
      pageSize: 30,
      totalCount: null,
      totalPage: null,
      popLists:[
        {id:'1',img:img,name:'可用红包',jump:'APP页面',pushNum:'100',popNum:'200',clickNum:'300',sortIndex:'',startTime:'2018-08-24 16:00',endTime:'2018-08-24 16:00',updateTime:'2018-08-24 18:00',user:'wangyi',status:'未生效',see:'查看',export:'导出数据',del:'删除',stop:'',reEdit:''},
        {id:'1',img:img,name:'可用红包',jump:'APP页面',pushNum:'100',popNum:'200',clickNum:'300',sortIndex:'',startTime:'2018-08-24 16:00',endTime:'2018-08-24 16:00',updateTime:'2018-08-24 18:00',user:'wangyi',status:'生效中',see:'查看',export:'导出数据',del:'',stop:'停用',reEdit:''},
        {id:'1',img:img,name:'可用红包',jump:'APP页面',pushNum:'100',popNum:'200',clickNum:'300',sortIndex:'',startTime:'2018-08-24 16:00',endTime:'2018-08-24 16:00',updateTime:'2018-08-24 18:00',user:'wangyi',status:'已删除',see:'查看',export:'导出数据',del:'',stop:'',reEdit:'重新添加'},
        {id:'1',img:img,name:'可用红包',jump:'APP页面',pushNum:'100',popNum:'200',clickNum:'300',sortIndex:'',startTime:'2018-08-24 16:00',endTime:'2018-08-24 16:00',updateTime:'2018-08-24 18:00',user:'wangyi',status:'已停用',see:'查看',export:'导出数据',del:'',stop:'',reEdit:'重新添加'},
        {id:'1',img:img,name:'可用红包',jump:'APP页面',pushNum:'100',popNum:'200',clickNum:'300',sortIndex:'',startTime:'2018-08-24 16:00',endTime:'2018-08-24 16:00',updateTime:'2018-08-24 18:00',user:'wangyi',status:'已结束',see:'查看',export:'导出数据',del:'',stop:'',reEdit:'重新添加'}
      ]
    };
  },
  methods: {
    /**
     *  列表请求函数
     *  @statusList 状态选择项
     *  @popName 弹窗名称
    */
    popRequest(statusList, popName) {
      console.log(`弹窗列表`);
      console.log(statusList);
      console.log(popName);
    },
    jumpAddPop(currentRow,currentRowText){
      let [popId, status, text ] = [ currentRow.id, currentRow.status, currentRowText ];
      this.$router.push({ name: `addpop`, params: { popId, status, text} });
    },
    see(currentRow,currentIndex){
      console.log(currentRow);
      console.log('查看下标为:' + currentIndex);
      this.jumpAddPop(currentRow,currentRow.see);
    },
    del(currentRow,currentIndex){
      console.log(currentRow);
      console.log('删除下标为:'+currentIndex);
    },
    stop(currentRow,currentIndex){
      console.log(currentRow);
      console.log('停用下标为:'+currentIndex);
    },
    reEdit(currentRow,currentIndex){
      console.log(currentRow);
      console.log('重新添加下标为:' + currentIndex);
      this.jumpAddPop(currentRow,currentRow.reEdit);
    },
    //导出数据 -- excel
    exportExcel(currentRow,currentIndex){
      console.log(currentRow);
      console.log('导出:'+currentIndex);
    },
    sort(currentRow){
      console.log(`这里是排序`);
      console.log(currentRow);
    },
    handleCurrentChange(page) {
      console.log(`当前第${page}页`);
      this.pageNum = page;
      // this.popRequest();
    },
    firstPage() {
      console.log(`第${this.pageNum}页`);
      this.pageNum = 1;
      // this.popRequest();
    },
    lastPage() {
      console.log(`最后第${this.pageNum}页`);
      this.pageNum = this.totalPage;
      // this.popRequest();
    }
  }
};
</script>

<style scoped lang="less">
.pop_manager {
  margin-top: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
}
</style>