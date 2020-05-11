<template>
    <div id="persionContainer">
      <div class="header">
        <img :src="userInfo.avatar?userInfo.avatar:'/static/imgs/personal/personal.png'" alt="">
        <button open-type="getUserInfo" @getuserinfo="handlerGetUserInfo">{{userInfo.nickname?userInfo.nickname:'登陆'}}</button>
        <button open-type="getPhoneNumber" @getphonenumber="handlerGetPhoneNumber">获取手机号权限</button>
      </div>
      <div class="cardList">
        <div class="card">
          <span @click="scanBook">扫码看书</span>
          <span class="more">》</span>
        </div>
      </div>
      <div class="logoutItem">
        <div v-if="userInfo.avatar" class="logout" @click="exitLogin">
          退出登录
        </div>
      </div>
    </div>

</template>

<script>
  var app = getApp();
  import getCurrentPages from '../../utils/wxFunction';
  import user from '../../service/user';
  export default {
    data(){
      return{
        userInfo:{}
      }
    },onShow(){
      let userInfo = wx.getStorageSync('userInfo');
      let token = wx.getStorageSync('token');
      if (userInfo && token) {
        app.globalData.userInfo = userInfo;
        app.globalData.token = token;
      } else {
        app.globalData.userInfo = null;
        app.globalData.token = null;
      }
      if (app.globalData.userInfo) {
        this.userInfo = app.globalData.userInfo;
      } else {
        this.userInfo = {};
      }
    },
    methods:{
      handlerGetUserInfo(res){
        user.loginByWeixin().then(res => {
          this.userInfo = res.data.userInfo;
          app.globalData.userInfo = res.data.userInfo;
          app.globalData.token = res.data.token;
        }).catch((err) => {
          console.log('登陆失败', err)
        });
      },// 退出登陆
      exitLogin () {
        wx.showModal({
          title: '',
          confirmColor: '#b4282d',
          content: '退出登录？',
          success: function (res) {
            if (res.confirm) {
              //清除缓存信息
              wx.removeStorageSync('token');
              wx.removeStorageSync('userInfo');
              wx.switchTab({
                url: '/pages/personal/main',
                success: function (e) {
                  console.log('getCurrentPages的1页面栈', getCurrentPages());
                  var page = getCurrentPages().pop();
                  // console.log('当前page', page);
                  if (page === undefined || page === null) return;
                  page.onShow();
                }
              });
            }
          }
        })
      },
      scanBook(res){
        wx.scanCode({
          onlyFromCamera: true,
          success:(res) =>{
            console.log(res)
          },
          fail:(res) =>{
            console.log(res)
          }
        })
      },
      handlerGetPhoneNumber(res){
        //获取用户手机号不对个人开发，需要审核通过的项目
        console.log("获取到的手机号",res)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #persionContainer
    .header
      padding 40rpx
      background #02a774
      img
        width 100rpx
        height 100rpx
        vertical-align middle
      button
        display inline-block
        height 60rpx
        line-height 60rpx
        background rgba(255,255,255,0.5)
        vertical-align middle
        margin-left 40rpx
        max-width 200rpx


    .cardList
      .card
        width 94%
        height 60rpx
        line-height 60rpx
        margin 10rpx auto
        border 1rpx solid #eee
        padding 10rpx
        .more
          float right
    .logoutItem
      padding-top 100rpx
      .logout
        width 94%
        height 60rpx
        line-height 60rpx
        margin 10rpx auto
        border 1rpx solid #eee
        padding 10rpx
        text-align: center
        background: #fff
        color: #ea3732
        font-size: 30rpx
        border 1rpx solid #eee
</style>
