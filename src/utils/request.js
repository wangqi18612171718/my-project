import config from './config' //配置文件
//携带token的方式1.cookie(不推荐)  2.URL  3.请求头
let token = wx.getStorageSync('token')
export default function (url,data={},method='GET') {
  return new Promise((resolve,reject) => {
    wx.request({
      url:config.host+url,
      data,
      method,
      header:{
        authorization: token
      },
      success:(res) =>{
        resolve(res.data)
      },
      fail:(error) =>{
        reject(error)
      }
    })
  })
}
