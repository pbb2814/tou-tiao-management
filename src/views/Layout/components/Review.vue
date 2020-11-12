<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  <div class="table-content">
    <!-- 表格列表渲染的使用：1、把数据绑给表格的:data；2、设计表格列（有几列就自己复制几列，把宽度去掉）；3、给表格列绑定要渲染的数据字段，prop中对应的就是返回数据的响应字段，title就是title这样，是自动遍历的 -->
    <el-table
      v-loading="loading"
      element-loading-text="客官不要着急~~"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255,0.9)"
      size="mini"
      :data="reviews"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
      >
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数"
      >
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数"
      >
      </el-table-column>
      <el-table-column
        prop="comment_status"
        label="状态"
      >
      <!-- 状态和操作这里没办法进行正确的显示，因为状态为true或false；操作为按钮
      遇到这些就要自定义表格列 <template slot-scope="scope"></template>,然后scope.row就是遍历后的每一项-->
      <template slot-scope="scope">
        {{ scope.row.comment_status ? '可评论' : '已关闭评论' }}
      </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
      >
      <template slot-scope="scope">
        <!-- 这里进行数据双向绑定修改只是进行了视图上的修改，真正修改还是要发送请求来修改后端数据才可以 -->
        <!-- switch有个change事件用来改变状态时的回调函数,把要操作的文章对象传过去，就是scope.row-->
        <!-- 禁用状态时候只有它自己禁用，用forEach :disabled="false"默认为不禁用，是=不是： 踩坑了-->
        <el-switch
          :disabled="scope.row.commentStatus"
          v-model="scope.row.comment_status"
          active-color="#13ce66"
          inactive-color="rgba(0,0,0,0.5)"
          @change="updateSwitch(scope.row)"
        />
      </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页的步骤大致：
      1、绑定页码
      2、绑定每页大小
      3、
      :current-page="1"控制的时高亮页码，设置为几就是几高亮，但是数据不是同步的数据有可能是其他页的，就只有高亮状态而已因为请求的是1页数据，所以默认1
      :page-sizes="[100, 200, 300, 400]"控制可选每页的大小；:page-size="100"是默认大小，改变以后只有总页码发生变化，内部计算，但是要实现切换以后从第一页加载才是正确逻辑
      layout="total, sizes, prev, pager, next, jumper"是布局，从左到右，需要什么配什么，位置也可以根据自己改变
    -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      />
  </div>
</el-card>
</template>

<script>
import { getContent, changeReviewStatus } from '@/api/content'
//因为评论列表和获取文章列表是同一个接口，所以直接引入，文档中说明传的不同返回的字段就不同
export default {
  data() {
    return {
      reviews: [],
      totalCount: 0,
      pageSize: 10,
      page: 1, //因为改变每页大小以后加载第一页数据，但是高亮没回去，所以给current.page加上.sync修饰符，加上后不能指定为1，所以指定这个page
      loading: true //默认加载转圈
    }
  },
  created() {
    this.getReview()
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`); 每页大小发生变化后的方法，要在上面的:page-size="pageSize"中添加.sync才能将改变的数据绑定到每页大小中
      this.getReview(1)
    },
    handleCurrentChange(page) {
      // console.log(`当前页: ${val}`);这里传入当前页码page参数
      // console.log(page);
      this.getReview(page) //页面改变就加载指定的数据
    },
    // 默认传个page = 1
    getReview(page = 1) {
      this.loading = true;
      this.page = page //控制改变大小后返回到高亮第一页
      getContent({
        // 因为接口文档中说明传递response_type: 'comment'参数就返回评论管理的数据
        response_type: 'comment',
        page, //这里接收上面传进来的page:page，然后简写
        per_page: this.pageSize
      }).then(res => {
        // console.log(res);
        // 这里做的操作只是为里面添加单独的控制属性，但是发请求禁用还是得在下面的请求函数中
        const result = res.data.data.results
        result.forEach(article => {
          // 这里为什么名字是article还得看看forEach
          // article是遍历的项的每一个，commentStatus是要为它添加的属性名
          article.commentStatus = false //默认状态都为false，就是不禁用，可点击
        });
        this.reviews = result
        this.totalCount = res.data.data.total_count
        this.loading = false;
      })
    },
    updateSwitch(article) {
      // 发请求时禁用
      article.commentStatus = true
      //上面用scope.row传过来的文章对象用article做接收，不能用scope.row来做接收，因为有标点
      //拿到以后就要发请求来改状态数据了
      //console.log(article);
      //上面把scope.row传过来用article接收了，所以这里就用article.id.toString(), article.comment_status两个参数来接收才对,最保险的就是toString()下
      changeReviewStatus(article.id.toString(), article.comment_status).then(res => {
        // console.log(res);
        // 请求结束后关闭
        article.commentStatus = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启评论' : '关闭评论' //用状态判断提示语
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 40px;
}
</style>