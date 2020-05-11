import Vue from 'vue'
import App from './App'

//关闭Vue开发中的提示功能
Vue.prototype.productionTip = false;

//声明当前组建为整个应用
App.mpType = 'app'

//生产当前应用的实例
const app = new Vue(App)

//挂载当前实例
app.$mount();
