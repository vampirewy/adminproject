<template>
  <div class="pagination">
    <el-button size="mini" @click.native="firstPage">首页</el-button>
    <el-pagination
      background
      layout="prev, pager, next,total,jumper"
      prev-text="上一页"
      next-text="下一页"
      :total="totalCount"
      :page-size="pageSize"
      :current-page="pageNum"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <el-button size="mini" @click.native="lastPage">尾页</el-button>
  </div>
</template>

<script>
export default {
  name: "pageBar",
  props: {
    pageSize: Number,
    pageNum: Number,
    totalPage: Number,
    totalCount: Number,
    traId: String,
    statusLists: String,
    name:String //导购名称或专题名称
  },
  data() {
    return {
      // currentNum: 1
    };
  },
  methods: {
    handleCurrentChange(page) {
      console.log(`第${page}页`);
      this.$emit("pageBar", this.traId, this.statusLists, this.name, page);
    },
    firstPage() {
      console.log(this.pageNum);
      let pageNum = 1;
      this.$emit("pageBar", this.traId, this.statusLists, this.name, pageNum);
    },
    lastPage() {
      this.$emit("pageBar", this.traId, this.statusLists, this.name, this.totalPage);
    }
  }
};
</script>

<style scoped lang="less">
.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
}
</style>