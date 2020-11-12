<template>
  <div class='articles-container'>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ this.$route.query.id ? '修改文章' : '发布文章'}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单模块 -->
      <div>
        <el-form ref="publish-form" :model="articles" label-width="80px" class="articles-form" :rules="formRules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="articles.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <!-- 全局引入，不然会报错 -->
            <el-tiptap
              v-model="articles.content"
              :extensions="extensions"
            ></el-tiptap>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <el-radio-group v-model="articles.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <!-- 文章封面组件，因为选择几图就是要有几个，所以直接在组件中遍历就好了,articles.cover.type就是那个绑定的label值，在组件的cover中的type，因为是数，所以直接用它当key，因为这个自动是-1，所以会报错，所以要进行判断再遍历，v-if和v-for不建议直接一起用，所以用<template>包起来，因为它不会创建额外的节点,但是用这个就意味着样式没法改，所以还是用div包一下比较好 -->
            <!-- 这里key换成index，因为要将index传到下面去，用于添加articles.cover.images中的url;因为传递过来的参数本来是子组件中返回的那个url，现在自定义参数了，就将那个参数改变了（改变方法的默认参数了），所以这里需要使用$event才能保证，只能用$event -->
            <!--这里父传子，因为点击编辑以后进入，还要展示相应的图片，别忘了articles.cover.images[index]中的index，要对应起来，不是直接传那个数组-->
            <template>
              <div class="coverImage" v-if="articles.cover.type > 0">
                <!-- <articles-cover v-for="(item, index) in articles.cover.type" :key="index" class="item" 
                @unloadCoverImages="coverImg(index, $event)" :coverImg="articles.cover.images[index]"/> -->
                <!-- 这里解决点击编辑进去，虽然有数据但是不预览的问题，使用v-model 
                v-model默认就是:value="articles.cover.images[index]",@input="articles.cover.images[index]",默认就是value和input
                然后在子组件中用props接收的是value，不是coverImg了
                -->
                <articles-cover v-for="(item, index) in articles.cover.type" :key="index" class="item" 
                v-model="articles.cover.images[index]"/>
              <!-- 子组件中需要传递图片url，组件这里接收 ,子组件自定义的事件在这里接收-->
              </div>
            </template>
          </el-form-item>
          <el-form-item label="频道" prop="channel_id">
            <!-- <el-select v-model="form.region" placeholder="请选择活动区域">articles.channel_id替换 -->
            <el-select v-model="articles.channel_id" placeholder="请选择频道">
              <!-- v-for中(item,index) in channels，item要在index的前面，不然会出现问题 -->
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) in channels"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onPublish(false)">{{ this.$route.query.id ? '修改' : '发布'}}</el-button>
            <el-button @click="onPublish(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getContentChannels, addArticels, getArticles, updateArticles} from '@/api/content'; //把获取频道列表模块加载进来，因为这里也要用
import {
  // necessary extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Image,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Fullscreen,
} from 'element-tiptap';
import ArticlesCover from './Articles-cover'

export default {
  name: 'Articles',
//import引入的组件需要注入到对象中才能使用
  components: {
    'el-tiptap': ElementTiptap,
    ArticlesCover
  },
  props: {},
  data() {
    return {
      channels: [], //文章频道列表
      // 创建一个articles数据用于存放标题等，然后依次绑定到上面，就是article.什么什么
      articles: {
        title: '', //文章标题，默认为空字符串
        content: '', //文章内容
        cover: {
          type: 1, //封面类型,默认写死一个1，就是单图
          images: [] //封面图片的地址，写死无图，默认写一个空数组
        }, //文章封面
        channel_id: null //根据接口文档将频道id绑定到articles中，不然他是绑定到form中的，默认给个null，这里一定要根据接口文档写的
      },
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          // { required: true, message: '请输入文章内容', trigger: 'blur' },
          //这里有个<p></p>，所以需要自定义校验内容，放在对象中，用validator
          {
            validator(rule, value, callback) {
              if(value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                //验证通过
                callback()
              }
            }
          },
          //上面是防止p标签，下面这里是必须填的符号
          { required: true, message: '请输入文章内容'},
        ],
        channel_id: [
          { required: true, message: '请选择频道',},
        ]
      },
      // 一定要放在articles的后面，不然会报错，TypeError: Cannot read property 'lang' of undefined
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Image(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // render command-button in bubble menu.
        new Underline({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Fullscreen(),
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    onPublish(draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if(!valid) {
          //验证失败，停止提交表单
          return
        }
        //验证通过，提交表单
        //判断一下，如果为修改文章则执行修改，否则执行添加
        if(this.$route.query.id) {
          // 执行修改操作
          updateArticles(this.$route.query.id, this.articles, draft).then(res => {
            console.log(res);
            this.$message({
            message: `${draft ? '存入草稿' : '修改'} 成功`,
            type: 'success'
          })
          this.$router.push('/content')
          })
        }else {
          // 这里的参数就是要提交的那个articles表单，一定要填写内容才可以发表，不然会返回400
          addArticels(this.articles, draft).then(res => {
            // console.log(res);
            this.$message({
              //判断一下，如果drft为true就发布
              message: `${draft ? '存入草稿' : '发布'} 成功`,
              type: 'success'
            })
            this.$router.push('/content')
          })
        }
      })
    },
    loadChannels() {
      getContentChannels().then(res => {
        // console.log(res);
        this.channels = res.data.data.channels;
      })
    },
    //修改文章的请求
    loadArticle() {
      getArticles(this.$route.query.id).then(res => {
        // console.log(res);
        this.articles = res.data.data
      })
    },
    coverImg(index, url) {
      // console.log(index, url);
      // 然后将传递过来的url赋值到articles.cover.images数组中
      // 这里将索引写死了，每一次提交都会放到索引为0的，所以不行，所以在上面遍历的时候，把index也和url一起传进来，传进来以后就根据索引添加，不用写死0
      this.articles.cover.images[index] = url; // 这样的话，添加那个就是哪一个，在三图的时候给第三个添加，2就为undefined，对应起来的.
      // 这样以后就可以进行发表了，然后还有问题就是从内容管理点击编辑进入以后显示相应的封面图片，那就是要父组件将数据传递给子组件进行显示，用props，传递过去以后再将这个数据显示到封面下面那里图片节点的src上就可以了
    }
  },
//生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.loadChannels()
    //由于使用的是同一个组件
    //这里进行判断，如果在Content中点击了编辑以后有文章id，那么就请求展示文章内容
    //每个组件中都会有$route.query，所以就这样拿this.$route.query.id
    if(this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted() {},
  activated() {},
}
</script>
<style lang='less' scoped>
.coverImage {
  display: flex;
  justify-content: flex-start;
  .item {
    margin-right: 20px;
  }
}
</style>