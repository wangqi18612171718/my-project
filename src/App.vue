<script>
  import request from './utils/request'
  export default {
    // async mounted(){
    //    wx.login({
    //     success : async (res) => {
    //       //每次获取的code都不一样，相当于一个临时凭证，code的获取跟是否授权无关（有效时常5分钟）
    //       let code = res.code
    //       console.log(code)
    //       let data = {'code':code}
    //       //获取session_key＋openid
    //       let token = await request('/getOpenId',data)
    //       //将自定义登陆状态缓存到Storage
    //       wx.setStorageSync('token',token)
    //     }
    //   })
    //   auth.code2Session({
    //     success: (res)=>{
    //       console.log('登陆状态',res)
    //     }
    //   })
    //
    //   //测试token
    //   let result = await request("/testToken")
    //   console.log('验证结果',result)
    // }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  page
    width 100%
    height 100%
</style>
