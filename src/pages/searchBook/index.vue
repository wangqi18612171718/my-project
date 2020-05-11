<template>
    <div id="searchContainer">
      <div class="searchHeader">
        <input @confirm="handlderSearch" v-model="searchContent" confirm-type="搜索" type="text" placeholder="输入查询信息" placeholder-class="placeholder">
        <span @click="handlerClear" class="clear" v-show="searchContent">X</span>
      </div>
      <div v-if="booksArr.length">
        <BooksList :booksArr="booksArr"/>
      </div>
    </div>
</template>

<script>
  import BooksList from '../booksList/index'
  import util from '../../utils/util'
  import api from '../../utils/api'
  export default {
    components:{BooksList},//组件
    data(){
      return {
        searchContent: '',
        booksArr:[]
      }
    },
    methods:{
      handlerClear(){
        this.searchContent = ''
        this.booksArr = []
      },
      async handlderSearch(){
        //搜索功能函数

        //获取用户输入内容
        let data = {req: this.searchContent}
        //使用自己封装的ajax请求
        let result = await util.request(api.GetBookList,data)
        console.log("返回信息",result)
        this.booksArr = result.data;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #searchContainer
    .searchHeader
      position relative
      width 80%
      height 80rpx
      margin 10rpx auto
      border-bottom  1rpx solid #02a774
      input
        height 100%
        width 100%
      .placeholder
        color #02a774
        text-align center
        font-size 28rpx

    .clear
      position absolute
      right 20rpx
      top 20rpx
      z-index: 100;
</style>
