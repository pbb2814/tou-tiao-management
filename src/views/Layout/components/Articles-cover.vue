<template>
  <div class='articles-cover'>
    <div class="coverImgBox" @click="showDialogVisible">
      <span class="uploadText" v-show="uploadText">点击上传封面</span>
      <img ref="cover-img" :src="value">
    </div>
    <!-- 弹出层 -->
    <el-dialog
      title="请选择封面图片"
      :visible.sync="dialogVisible"
      width="75%"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <!-- 在那个子组件中写完以后，在这里直接用:XXX=“布尔”，就可以显示或者隐藏 -->
          <!-- 这里用ref的方式访问子组件，然后就可以进行将子组件中选择的图片赋值到父组件，ref如果在标签上就是获取DOM，如果在组件上就是访问子组件 -->
          <material-img :isShowAdd="false" :isShowCollect="false" ref="img-list" :isShowBackground="true"/> <!--这里用了组件要显示阴影就设置:isShowBackground="true"就好了，不设置的话默认为false -->
        </el-tab-pane>
        <el-tab-pane label="手动上传" name="second">
          <!-- input的file就是选择上传，然后再监听它的@change事件，文件发生变化后做操作 -->
          <input type="file" @change="changeImage" ref="file">
          <img width=170 height=150 ref="reviewCoverImage">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- 做完图片预览以后，点击确定然后进行发送请求，loadImage请求 -->
        <el-button type="primary" @click="unloadCoverImage" :loading="unloadLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { loadCoverImage } from '@/api/image'
import MaterialImg from './Material-img'

export default {
  name: 'ArticlesCover',
  components: {
    MaterialImg
  },
  props: ['value'],
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      unloadLoading: false,
      uploadText: true,
    };
  },
  computed: {},
  watch: {},
  methods: {
    showDialogVisible() {
      this.dialogVisible = true;
      this.uploadText = false;
    },
    changeImage() {
      // console.log(123);
      //获取到DOM元素中的文件对象，file中有个files属性就是获取文件对象，第几个索引就相对应
      const file = this.$refs.file.files[0];
      //获取到以后再进行预览，就用这个API，参数就是那个文件对象
      const blob = window.URL.createObjectURL(file);
      //将预览的对象传给图片DOM
      this.$refs['reviewCoverImage'].src = blob
      // 进行清空操作，防止选的同一个文件以后不触发，要放在最下面，不然每次进来都是空的，就会报错
      // this.$refs.file.value = ''; 要取消这个，不然下面获取不到，上传时为空，不需要进行这一步，因为同一张也无所谓
    },
    unloadCoverImage() {
      this.unloadLoading = true;
      //进行判断，在素材库还是上传文件中，双向绑定了v-model="activeName"，所以进行判断就行
      if(this.activeName === 'second') {
        //判断为上传文件中时先获取到文件对象
        const file = this.$refs.file.files[0];
        //并且还要判断有没有文件，没有文件就提示选择文件，有就进行下一步操作
        if(!file) {
          this.$message('请先选择文件');
          return; //直接return就不进行下面的代码跳到外面
        }
        //执行上传文件操作,上传文件的操作都是这样的
        const fd = new FormData();
        fd.append('image', file); //第一个参数是后端要求的字段，看接口文档的要求，第二个参数是要上传的文件对象
        //然后发送请求，将文件对象发送给后端，参数就传那个fd
        loadCoverImage(fd).then(res => {
          this.unloadLoading = false;
          // console.log(res);
          //请求成功以后关闭弹框
          this.dialogVisible = false;
          //获取到要展示图片的那个DOM节点，就是几图下面那个，然后将它的src设置为返回的结果里面的url
          this.$refs['cover-img'].src = res.data.data.url

          //这里是进行了页面的交互，只是选择了文件，然后进行了上传，下一步要做的就是要将选择的图片放入到父组件Articles的cover.image数组里面，因为这里进行图片的这些操作都是在Articles-cover子组件中，然后通过子传父将得到数据中的url传到父组件
          //自定义事件通知父组件，给父组件传递图片的返回的url
          // this.$emit['unloadCoverImages', res.data.data.url] ,这样是错的。这样会直接把对象传过去，应该是括号，因为是自定义方法
          // this.$emit('unloadCoverImages', res.data.data.url) 本来是这个的，改成v-model以后就要写成input了
          this.$emit('input', res.data.data.url)
          // 这样设置完以后，都会生效，可是从编辑进来以后，图片不显示在预览那里，虽然图片的地址在，但是不显示出来，这个问题就要在引用了这个组件的那里使用v-model解决
          // 不对，这个问题是因为自己粗心，在预览的那个img中没有绑定传过来的那个值，漏了:src="value",本来是coverImg的，改成v-model以后就是value！！
        })
      } else if(this.activeName === 'first'){
        //因为有的情况下不只有两个选框，所以用else if，只有两个就可以直接用else
        //然后这里可以直接拿到子组件选择的那个图片，利用父组件访问子组件ref的形式
        const imgList = this.$refs['img-list']
        //访问到子组件以后拿到哪个selected
        const selected = imgList.selected
        if(selected == null) {
          // 不能写!selected,因为索引为0的选不上，所以直接判断为空就行
          //判断一下，如果没有selected就说明没有选择图片，就进行提示,和上面一样
          this.$message('请先选择文件');
          return;
        }
        this.unloadLoading = false;
        // console.log(selected); 然后就和上面一样，关闭弹窗，然后赋值，记住这里没有预览，所以没有this.$refs['cover-img'].src = res.data.data.url
        this.dialogVisible = false;
        this.$emit('input', imgList.images[selected].url)
      }
    }
  },
  created() {
  },
  mounted() {
  },
  activated() {},
}
</script>
<style lang='less' scoped>
.coverImgBox {
  width: 176px;
  height: 176px;
  border: 1px solid rgb(182, 177, 177);
  border-radius: 10px;
  cursor:pointer;
  img {
  width: 176px;
  height: 176.4px;
  border-radius: 10px;
  }
  .uploadText {
    font-size: 10px;
    color: rgb(134, 126, 126);
  }
}
</style>