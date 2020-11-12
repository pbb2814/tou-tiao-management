<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 筛选card模块 -->
      <el-card class="filter-card" shadow="hover">
        <div slot="header" class="clearfix">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </div>
        <div>
          <el-form ref="form" :model="form" label-width="40px" size="mini">
            <el-form-item label="选项">
              <el-radio-group v-model="status">
                <el-radio :label="null">全部</el-radio>
                <el-radio :label="0">草稿</el-radio>
                <el-radio :label="1">待审核</el-radio>
                <el-radio :label="2">审核通过</el-radio>
                <el-radio :label="3">审核失败</el-radio>
                <el-radio :label="4">已删除</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="频道">
              <!-- <el-select
                v-model="form.region"
                placeholder="请选择频道"
              > -->
              <el-select
                v-model="channelId"
                placeholder="请选择频道"
              >
              <!-- 这里还得单独加一个全部 -->
                <el-option
                  label="全部"
                  :value="null"
                ></el-option>
                <!-- 这里的:value="item.id"会同步到上面的form.region的region中-->
                <el-option
                  :label="item.name"
                  :value="item.id" 
                  v-for="(item, index ) in channelsList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-model="rangeDate"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['12:00:00']"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <!-- 这里直接绑定loadContent，就是点击查询以后重新调用loadContent方法去获取，会报错，因为button按钮的click事件有个默认参数，接不到那个page ,默认给它传个1   在点击查询以后关闭状态，disabled，要加:-->
              <el-button
                type="primary"
                @click="loadContent(1)"
                :disabled="loading"
              >查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <!-- /筛选card模块 -->

      <!-- 列表card模块 -->
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          筛选后的结果为:{{totalCount}}条
        </div>
        <div class="table-card">
          <!-- 表格组件默认遍历的，不用自己v-for遍历，把需要展示的数组绑定给table组件的data属性 -->
          <el-table
            v-loading="loading"
            element-loading-text="客官不要着急~~"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255,0.9)"
            size="mini"
            :data="content"
            style="width: 100%">
            <!--要渲染的数据中的列表项字段，要渲染数据中的哪一列数据，就把prop设置成什么。
                如果需要在表格列中添加一些，操作按钮、图片等东西，就需要用到表格的自定义列模板-->
            <el-table-column
              label="封面">
              <template slot-scope="item">
                <!-- 如果想加上暂无图片的提示图，那就再来一个img标签，然后进行判断，v-if=“item.row.cover.images[0]”，另外一个里v-else src=“” -->
                <el-image
                  style="width: 80px; height: 60px"
                  :src="item.row.cover.images[0]"
                  fit="fit"
                  lazy>
                  <div slot="placeholder" class="table-images">
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
                <!-- <img :src="item.row.cover.images[0]" class="table-images" alt="" lazy> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="标题">
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope="item">
                <el-tag size="mini" v-if="item.row.status === 0" type="">草稿</el-tag>
                <el-tag size="mini" v-else-if="item.row.status === 1" type="info">待审核</el-tag>
                <el-tag size="mini" v-else-if="item.row.status === 2" type="success">审核通过</el-tag>
                <el-tag size="mini" v-else-if="item.row.status === 3" type="warning">审核失败</el-tag>
                <el-tag size="mini" v-else-if="item.row.status === 4" type="danger">已删除</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="pubdate"
              label="发布时间">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <!-- 添加点击事件，路由跳传到文章发布页面，修改和发布公用一个组件，但是处理内容逻辑不通就进行判断 -->
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  circle
                  @click="$router.push('/articles?id=' + scope.row.id)"
                ></el-button>
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-delete"
                  circle
                  @click="onDeleteArticle(scope.row.id)"
                >
                  <!-- 添加slot-scope="scope"遍历每一项，然后再删除按钮的方法onDeleteArticle(scope.row.id)中拿到每一项的id用参数方式传出去 -->
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页器,给分页器添加一个加载禁用状态，:disabled=“loading”,要加冒号，不然默认是写死了，当成字符串了直接设置成loading就是加载禁用了-->
          <el-pagination
            small
            class="pagination"
            background
            :disabled="loading"
            layout="prev, pager, next"
            :total="totalCount"
            current-page.sync="page"
            @current-change="onCurrentChange"
            :page-size="pageSize"
          />
        </div>
      </el-card>
      <!-- /列表card模块 -->
    </el-breadcrumb>
  </div>
</template>

<script>
import { getContent, getContentChannels, deleteArticles} from '@/api/content'

export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        desc: '',
      },
      // tableData: [{
      //     date: '2016-05-02',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   }, {
      //     date: '2016-05-04',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   }, {
      //     date: '2016-05-01',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1519 弄'
      //   }, {
      //     date: '2016-05-03',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1516 弄'
      //   }],
      content: [],
      totalCount: 0, //总数居条数，默认为0
      pageSize: 15, //默认每页总条数为15，然后上面就会根据总条数进行相应的除法
      status: null, //筛选文章，利用status状态是几，就给后端传过去几，然后后端返回响应的数据，默认传一个null就是全部
      channelsList:[], //文章频道列表
      channelId: null, //查询文章的频道，默认传null是全部
      loading: true, //默认设置表格为加载转圈
      rangeDate: null, //默认设置为null
      page: 1, //默认设置为第一页，然后删除完后根据current-page.sync更新当前页
    }
  },
  created() {
    this.loadContent()
    this.loadContentChannels()
  },
  methods: {
    // 这里传入参数page，默认传了个1是第一页
    loadContent(page = 1) {
      //切换页面时也有加载效果
      this.loading = true,
      // 这里在getContent中传参数，对象的形式传递，参数查接口文档
      getContent({
        page, //这里的page是page:page，就是在loadContent(page = 1)中传进来
        per_page: this.pageSize, //这里默认为每页十条，然后是总条数/10，但是改为20条每页还是一样的总分页数，所以要用属性改,一定是this.
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, //开始日期,做一下判断，不然清空时变成null[0]会报错
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null //截止日期，判断如果有日期就筛选，没有日期就为null（全部）
      }).then(res => {
        // console.log(res);
        const { results, total_count } = res.data.data //数据解构
        this.content = results
        this.totalCount = total_count
        this.loading = false //数据加载完以后消失加载
    })
    },
    // 这里在进行获取页码的时候要传入参数page
    onCurrentChange(page) {
      // console.log(page);
      // 这里重新调用一下loadContent（page）
      // 也可以不用这样重新再定义函数，然后再传递参数调用，可以直接去@current-change="onCurrentChange"中调用@current-change="loadContent"
      this.loadContent(page)
    },
    //请求频道列表
    loadContentChannels() {
      getContentChannels().then(res => {
        // console.log(res);
        this.channelsList = res.data.data.channels
      })
    },
    //删除文章
    //上面用onDeleteArticle(scope.row.id)的方式拿到的id在这里声明接收
    onDeleteArticle(articleID) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里还要toString()，因为转换后的为对象
        deleteArticles(articleID.toString()).then(res => {
          //这里有个安全整数问题，太大的超出范围的不行，因为后端返回的json格式字符串会被axios转为js对象形式，所以使用json-bigint包
          // console.log(res);可以删除成功，并会返回204
          //删除以后更新当前页的文章数据列表，重新调用loadContent()，并且参数传递为当前页，用组件中的current-page.sync来更新当前页
          loadContent(this.page); //在第几页删的，就更新哪一页
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  margin-top: 50px;
}
.pagination {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}
</style>