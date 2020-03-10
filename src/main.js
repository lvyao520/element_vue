import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false
import "./assets/css/global.css"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

import axios from "axios"
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
    // 知识点：路由拦截器的使用
axios.interceptors.request.use(config => {
    config.headers.Authorization = sessionStorage.getItem("token");
    return config
});
// 知识点3：讲axios添加到Vue的原型上
Vue.prototype.$http = axios


import "./assets/fonts/iconfont.css"

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')