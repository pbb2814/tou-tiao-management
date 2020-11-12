<template>
<!-- 素材管理公共组件 -->
  <div class='material-img'>
    <div class="material-top">
      <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
        <!-- 最好不要在这里直接监听点击事件，因为会触发两次，组件也不建议这么做
        <el-radio-button label="全部" @click.native="loadImages(false)"></el-radio-button>
        <el-radio-button label="收藏" @click.native="loadImages(true)"></el-radio-button> -->
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <!-- 组件自己定制时，就在引入的那个子组件中声明props，然后绑给指定的按钮或者div，v-if -->
      <el-button v-if="isShowAdd" type="info" round size="mini" @click="dialogUploadVisible = true">上传素材</el-button>
    </div>
    <div class="material-img">
      <el-row :gutter="10">
        <el-col :xs="12" :md="6" :lg="4" :sm="6" v-for="(item, index) in images" :key="index" @click.native="selectedImg(index)">
          <div class="collectOrDelete" v-if="isShowCollect">
            <!-- 这里动态绑定类名进行判断，收藏就为实心,用数据中返回的is_collected进行判断-->
            <!-- :loading="collectLoading" 会出现全部loading的问题，用forEach手动添加每一项loading，在下面方法中，然后绑定:loading="item.loading"，就是相当于绑定了每一项的单独loading -->
            <el-button
              size="mini"
              type="warning"
              :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              circle @click="onCollect(item)"
              :loading="item.loading"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteItemImage(item)"
              :loading="item.loading"
            ></el-button>
            <!-- <span 
              @click="onCollect(item)"
              :class= "{
                'el-icon-star-off' : !item.is_collected,
                'el-icon-star-on' : item.is_collected
              }"
            ></span>
            <span class="el-icon-delete"></span> -->
          </div>
          <el-image
            style="height: 150px"
            :src="item.url"
            fit="cover"
          >
          </el-image>
          <!-- 让selected等于上面遍历出来的index，上面注册点击事件，点哪一项，就将哪一项的index赋值给selected -->
          <div class="selected" v-show="isShowBackground && selected === index">
            <!-- 双重判断，意思就是在这个公共组件中写死了不显示，只要不去改素材管理那里，只要改这个 -->
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 上传素材弹出层 -->
    <el-dialog title="素材上传" :visible.sync="dialogUploadVisible" :append-to-body = "true">
      <!-- upload组件支持请求提交上传操作 -->
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeader"
        name="image"
        :on-success="uploadSuccess"
        multiple>
        <!--如果想关闭上传列表，那就在<el-upload 中写上v-if=“dialogUploadVisible”，它就会随着对话框隐藏，下次打开就没有；也有组件的属性可查 -->
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="onPageChange"
      :current-page.sync="page"
    >
    </el-pagination>
  </div>
</template>

<script>
import { loadImage, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'MaterialImg',
  props: {
    isShowAdd: {
      //上传素材按钮是否展示
      type: Boolean, //类型
      default: true, //默认值
    },
    isShowCollect: {
      //素材库图片中的收藏全部按钮是否显示
      type: Boolean,
      default: true,
    },
    isShowBackground: {
      //选中阴影是否显示
      type: Boolean,
      default: false, //默认不显示，在素材管理中就不用改了
    }
  },
  data() {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, //默认查询全部
      images: [],
      dialogUploadVisible: false, //弹出层默认为false
      uploadHeader: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, //默认总条数为0
      page: 1, //当前页，在上面current-page.sync="page"，解决点了全部的第2页，跳到收藏也还是第2页（数据其实是第一页的）；高亮的也买你回到第一
      // collectLoading: false 要用一个变量控制，不是直接在上面写成false然后下面写loading：false，不过这样是不行的，因为数据是遍历出来的，只要一个loading，其他的也会跟着loading
      selected: null, //默认全部不被选中，设置一个null
    }
  },
  created() {
    //页面初始化加载第一页，所以传个参数1
    this.loadImages(1, false)
  },
  methods: {
    //有默认值的参数最好在最后
    loadImages(page, collect = false) {
      //重置高亮页码,防止不对应
      this.page = page
      loadImage({
        collect,
        page, //参数第几页
        per_page: 18 //参数每页多少
      }).then(res => {
        // console.log(res);
        const result = res.data.data.results
        //先将返回的数据数组赋值给result，然后用forEach遍历数组，将数组中添加loading，默认设置为false，就是往返回的数据中手动添加loading来解决全部loading的问题
        result.forEach(item => {
          item.loading = false;
        });
        this.images = result
        this.totalCount = res.data.data.total_count
      })
    },
    //单选按钮组利用change事件，返回的value就是那个：label中的值，然后再调一次请求就好了
    onCollectChange(value) {
      // console.log(value);
      this.loadImages(1, value)
    },
    uploadSuccess() {
      // 上传成功以后的函数，完成上传后关闭对话框，然后更新列表
      this.dialogUploadVisible = false
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    //当页码改变触发的事件，要传page参数
    onPageChange(page) {
      // console.log(page);
      this.loadImages(page)
    },
    // onCollect(img) {
      //收藏点击事件，如果收藏就取消，如果取消就收藏,进行判断
      //在点击事件中把图片对象传进来，因为遍历时用的时item，那就把item传进来，不是视频中的img
    //   console.log(img);
    // }
    onCollect(item) {
      // console.log(item);做判断
      //因为这里有传进来的item对象，所以不用在data中声明，直接可以这样设置
      item.loading = true;
      if(item.is_collected) {
        //已收藏的，取消收藏
        collectImage(item.id, !item.is_collected).then(res => {
          item.is_collected = !item.is_collected
          item.loading = false;
        });
      } else {
        collectImage(item.id, !item.is_collected).then(res => {
          //这里只有这样取反以后，按钮的取反效果才会有
          item.is_collected = !item.is_collected
          item.loading = false;
        });
      }
      // item.loading = false;  注意不能写在外面，写在外面因为是单线程，所以直接先true后false，没效果的，踩坑
      // collectImage(item.id, !item.is_collected).then(res => {
        // item.is_collected = !item.is_collected
      //   console.log(res);这里是简便写法，取反操作
      // })
    },
    deleteItemImage(item) {
      item.loading = true;
      // console.log(123); 把item遍历项数据也传进来，以便做什么操作
      deleteImage(item.id).then(res => {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadImages(this.page)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          item.loading = false;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          item.loading = false;
        });
        // console.log(res);
      })
    },
    selectedImg (index) {
      // console.log(index);
      this.selected = index //因为自己在遍历以后加了一层div，无法获取到index并且传到selected，所以就这样获取，控制选中哪个图片就显示遮罩层
    }
  }
}
</script>

<style lang='less' scoped>
.material-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.el-pagination {
  margin-top: 20px;
}
.material-img {
  .el-col {
    position: relative;
    .collectOrDelete {
    font-size: 20px;
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;
    position: absolute;
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    z-index: 99;
    padding-bottom: 5px;
      .el-button {
        cursor: pointer;
        color: #fff;
        opacity: 0;
        &::before {
          transform: translateX(3px);
        }
      }
      &:hover .el-button {
        opacity: 1;
      }
    }
    .selected {
        position: absolute;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
        background-color: rgba(0, 0, 0,0.5);
      }
  }
}

</style>