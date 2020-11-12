<template>
  <div class="fan-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="text-item">
        <el-tabs
          type="border-card"
          v-loading="loading"
          element-loading-text="客官不要着急~~"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255,0.9)"
        >
          <el-tab-pane label="粉丝列表">
            <div class="el-row-item">
              <div
                class="col-image"
                v-for="(fan, index) in fansList" :key="index"
              >
                <el-image class="elImage" :src="fan.photo"></el-image>
                <span class="demonstration">{{ fan.name }}</span>
                <div class="tag-group">
                  <el-tag type="success">+关注</el-tag>
                </div>
              </div>
            </div>
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-sizes="[20, 30, 40, 50]"
              :page-size.sync="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total_count">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="图表统计">图表统计</el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getFans } from '@/api/fans'
export default {
  name: 'Fans',
  data() {
    return {
      fansList: [],
      total_count: 0,
      page: 1,
      pageSize: 20,
      loading: false
    }
  },
  created() {
    this.getFansLists()
  },
  methods: {
    handleSizeChange(val) {
      // console.log(val);
      this.getFansLists(1)
    },
    handleCurrentChange(page) {
      // console.log(`当前页: ${page}`);
      this.getFansLists(page)
    },
    getFansLists(page = 1) {
      this.loading = true;
      this.page = page //控制改变大小后返回到高亮第一页
      getFans({
      page,
      per_page: this.pageSize
    }).then(res => {
      const fansLists = res.data.data
      // console.log(res);
      this.fansList = fansLists.results
      this.total_count = fansLists.total_count
      this.loading = false;
    })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row-item {
  display: flex;
  // justify-content: space-evenly;
  flex-wrap: wrap;
  .col-image {
  border:0.1px solid rgb(180, 170, 170);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 10px;
  margin: 15px 0 15px 15px;
  width: 100px;
  border-radius: 10px;
  .elImage{
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
  .demonstration {
    margin: 25px 0;
  }
}
}

</style>
