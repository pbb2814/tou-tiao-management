import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/index.less'
import { ElementTiptapPlugin } from 'element-tiptap';
import 'element-tiptap/lib/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


Vue.use(ElementTiptapPlugin, {
  lang: "en", // see i18n
  spellcheck: true, // can be overwritten by editor prop
});