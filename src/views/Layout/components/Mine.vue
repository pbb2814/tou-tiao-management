<template>
  <div class="mine-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="mine-content">
        <el-row>
          <el-col :span="15">
            <el-form :model="user" :rules="rules" ref="user" label-width="100px" class="demo-user">
              <el-form-item label="编号：" prop="number">
                {{ user.id }}
              </el-form-item>
              <el-form-item label="手机：" prop="phone">
                {{ user.mobile }}
              </el-form-item>
              <el-form-item label="媒体名称：" prop="name">
                <el-input v-model="user.name"></el-input>
              </el-form-item>
              <el-form-item label="媒体介绍：" prop="intro">
                <el-input type="textarea" v-model="user.intro"></el-input>
              </el-form-item>
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="user.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitUserChange" size="small" :loading="submitUserLoading">保存设置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" :offset="2">
            <div class="right-image">
              <!-- input的type="file"就是一个上传文件类型，然后用label将el-avatar和字体包住，在label中写上点击修改头像,input的id就是和label的for是对应起来的 -->
              <label for="file">
                <el-avatar shape="square" :size="150" :src="user.photo"></el-avatar>
                <p>点击修改头像</p>
                <!-- input有个input事件，只要选择的文件修改了就会触发 -->
                <input type="file" hidden id="file" @change="onFileChange" ref="file">
              </label>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-dialog
      class="el-dialog-img"
      append-to-body
      title="提示"
      width="50%"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      @opened="onCropper"
      @closed="onCropperDestroy"
    >
        <div class="proview-image-wrap">
          <img id="image" :src="previewImage" ref="preview-img">
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="croppedImage" :loading="imgData">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { userProfile, cropperImage, userChange} from '@/api/user';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import globalBus from '@/utils/global-bus'

export default {
  data() {
    return {
      // ruleForm: {
      //   name: '',
      //   desc: '',
      //   email: ''
      // },
      rules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请填写媒体介绍', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' }
        ]
      },
      // url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      user: {
        //因为要绑定到表单中，所以先初始化一下,是根据返回的数据里面的字段进行初始化的
        email: '',
        id: '',
        intro: '',
        mobile: '',
        name: '',
        photo: '',
      },
      dialogVisible: false, //弹出层默认为false，不显示
      previewImage: '', //设置一个数据，图片预览，然后要绑给那个src。不然会有错误
      cropper: null, //cropper定义到这里，默认设置为空，就可以所有方法都访问到了
      imgData: false, //给确定按钮添加loading
      submitUserLoading: false //保存设置按钮的loading
    }
  },
  created() {
    this.loadUser()
  },
  methods: {
    loadUser() {
      userProfile().then(res => {
        // console.log(res);
        this.user = res.data.data
      })
    },
    onFileChange() {
      const file = this.$refs.file; //拿到需要操作的DOM元素
      // console.log(file.files); 打印出来一个伪数组对象，就是那个选择的文件对象
      // console.log(file.files); 打印出来一个伪数组对象，就是那个选择的文件对象
      // console.log(file.files[0]); 打印出来那个具体的图片对象
      const blogData = window.URL.createObjectURL(file.files[0]); //这个直接可以设置给图片的src，就可以预览了，window.URL.createObjectURL是个H5新增的API，以后要预览就这样用
      this.previewImage = blogData


      // console.log('onFileChange'); 但是如果选择的文件是用一个的话就不会触发了，所以要用操作dom的方式清除一下，解决选择同样文件不触发
      this.$refs.file.value = '';
      // console.log('onFileChange');
      this.dialogVisible = true; //在选择完文件以后弹出层显示出来
    },
    // 弹出层取消的事件，（我自己加的）
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$message({
            type: 'warning',
            message: '取消修改'
          })
          done();
        })
        .catch(_ => {});
    },
    onCropper() {
      //判断如果有值就进行替换，如果没有就new Cropper
      if(this.cropper) {
        this.cropper.replace(this.previewImage)
        //也可以不写下面的else，直接在这里写个return，就是相当于阻止执行了
      } else {
      //图片裁切器打开不能写在onFileChange事件里面，会不起作用，应该写在dialog的oppend事件中，文档说明
      const image = this.$refs['preview-img'] //获取DOM元素中的img，ref写给img，不是dialog //这里image就是要改到下面那个第一个参数中的image
      // const cropper = new Cropper(image, { 定义了data中的cropper，所以用下面那样写
      this.cropper = new Cropper(image, {
        autoCropArea: 1,
        dragMode: 'none',
        background: false
        // crop(event) {
        //   console.log(event.detail.x);
        //   console.log(event.detail.y);
        //   console.log(event.detail.width);
        //   console.log(event.detail.height);
        //   console.log(event.detail.rotate);
        //   console.log(event.detail.scaleX);
        //   console.log(event.detail.scaleY);
        // },
      });
      }
      // 不过这里注意，写完这个裁切器以后图片更换以后是不更新预览的，还是原来选的那张图片，解决的办法有两个，随便选择哪个都可以，replace在操作频繁时会有性能好处：1、调用dialog的@closed方法，然后在里面进行销毁cropper，文档中有销毁的方法。2、可以用cropper的replace方法replace(url[, hasSameSize])，写在onCropper中，要进行判断
    },
    onCropperDestroy() {
      // this.cropper.destroy() //注意这里销毁时候是访问不到onCropper()方法中的cropper的，因为作用域关系，所以将cropper定义到data中
    },
    croppedImage() {
      this.imgData = true
      // 裁切结束以后的确定按钮，提交处理用cropper插件里面的方法拿到裁切后的图片对象，找文档
      this.cropper.getCroppedCanvas().toBlob(blob => {
        // console.log(blob);
        const imgData = new FormData();
        imgData.append('photo', blob); //第一个参数是后端要求的字段名，这里接口文档要求是photo；第二个参数是需要传递进去的哪个图片对象
        //发送请求,这里传递的参数是imgData，而不是blog
        cropperImage(imgData).then(res => {
          // console.log(res);
          //接下来关闭弹出层并且发送请求返回了说明后端修改好数据了，接下来修改视图
          this.dialogVisible = false
          //这里修改完以后更新视图是从后端返回的那个，如果网络慢就会出现半天没有更新，所以就将本地裁剪的那个视图直接渲染上去会更好
          // this.user.photo = res.data.data.photo
          // 用这个就能瞬间传上去，参数是上面得到的blob图片对象
          this.user.photo = window.URL.createObjectURL(blob)
          this.$message({
            type: 'success',
            message: '修改头像成功'
          })
          this.imgData = true;
          globalBus.$emit('updataUser', this.user) //写在发送请求的里面
        })
      });
    },
    submitUserChange() {
      this.submitUserLoading = true;
      const { name, intro, email } = this.user
      userChange({
        // 这里也可以直接把this.user传过去（以对象形式传过去，不能直接就一个this.user），不能缺少，但是多余的那些后端可以不要，严谨一点就是像下面一样解构赋值，然后传需要的，
        name,
        intro,
        email
      }).then(res => {
        // console.log(res);
        this.$message({
            type: 'success',
            message: '修改成功'
        })
        this.submitUserLoading = false;
        globalBus.$emit('updataUser', this.user) //要写在发送请求以后的这个函数里面
      })
    }
  }
}
</script>

<style lang="less" scoped>
// .mine-content {
//   display: flex;
//   justify-content: space-around;
// }
// /deep/.mine-container {
//   .el-dialog-img {
//     #img{
//       display: flex;
//       justify-content: center;
//     }
//   }
// }
.proview-image-wrap {
  #image {
      display: block;
      /* This rule is very important, please don't ignore this */
      max-width: 100%;
      height: 200px;
  }
}
.right-image {
  // 加小手的样式不用&+选择器的形式，直接写就好，移入隐藏或者显示这种需要
  label {
    cursor: pointer;
  }
}
</style>