(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0badb11f"],{"8dab":function(a,t,e){},a468:function(a,t,e){"use strict";e.r(t);var n=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"fan-container"},[e("el-card",{staticClass:"box-card"},[e("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[e("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[e("el-breadcrumb-item",{attrs:{to:{path:"/"}}},[a._v("首页")]),e("el-breadcrumb-item",[a._v("粉丝管理")])],1)],1),e("div",{staticClass:"text-item"},[e("el-tabs",{directives:[{name:"loading",rawName:"v-loading",value:a.loading,expression:"loading"}],attrs:{type:"border-card","element-loading-text":"客官不要着急~~","element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(255, 255, 255,0.9)"}},[e("el-tab-pane",{attrs:{label:"粉丝列表"}},[e("div",{staticClass:"el-row-item"},a._l(a.fansList,(function(t,n){return e("div",{key:n,staticClass:"col-image"},[e("el-image",{staticClass:"elImage",attrs:{src:t.photo}}),e("span",{staticClass:"demonstration"},[a._v(a._s(t.name))]),e("div",{staticClass:"tag-group"},[e("el-tag",{attrs:{type:"success"}},[a._v("+关注")])],1)],1)})),0),e("el-pagination",{attrs:{background:"","current-page":a.page,"page-sizes":[20,30,40,50],"page-size":a.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:a.total_count},on:{"size-change":a.handleSizeChange,"current-change":a.handleCurrentChange,"update:currentPage":function(t){a.page=t},"update:current-page":function(t){a.page=t},"update:pageSize":function(t){a.pageSize=t},"update:page-size":function(t){a.pageSize=t}}})],1),e("el-tab-pane",{attrs:{label:"图表统计"}},[a._v("图表统计")])],1)],1)])],1)},s=[],i=e("b6d1"),r=function(a){return Object(i["a"])({method:"GET",url:"/mp/v1_0/followers",params:a})},l={name:"Fans",data:function(){return{fansList:[],total_count:0,page:1,pageSize:20,loading:!1}},created:function(){this.getFansLists()},methods:{handleSizeChange:function(a){this.getFansLists(1)},handleCurrentChange:function(a){this.getFansLists(a)},getFansLists:function(){var a=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.loading=!0,this.page=t,r({page:t,per_page:this.pageSize}).then((function(t){var e=t.data.data;a.fansList=e.results,a.total_count=e.total_count,a.loading=!1}))}}},o=l,c=(e("cc64"),e("2877")),g=Object(c["a"])(o,n,s,!1,null,"36250ae0",null);t["default"]=g.exports},cc64:function(a,t,e){"use strict";var n=e("8dab"),s=e.n(n);s.a}}]);
//# sourceMappingURL=chunk-0badb11f.a7fbdaf8.js.map