// import wx from 'wx';
import api from '@/utils/api';
import QQMapWX from '@/libs/qqmap-wx-jssdk.js'
var qqmapsdk = new QQMapWX({
  //腾讯位置服务：   https://lbs.qq.com/console/mykey.html
  //这里自己的key秘钥进行填充，该key是腾讯位置服务中申请的
  key: 'NARBZ-742EI-ZFYGN-5374A-HQECO-NIFSX'
});

function formatTime (date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber (n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
/**
 * 封封微信的的request
 */
function request (url, data = {}, method = 'GET') {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Xbyjshop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.errno === 401) {
            // 需要登录后才可以操作
            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              // 登录远程服务器
              request(api.AuthLoginByWeixin, {
                code: code,
                userInfo: userInfo
              }, 'POST').then(res => {
                if (res.errno === 0) {
                  // 存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);
                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession () {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}
/**
 * 调用微信登录
 */
function login () {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          // 登录远程服务器
          // console.log('微信登陆成功', res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}
/**
 * 调用微信获取用户信息接口，需要button授权
 */
function getUserInfo () {
  return new Promise(function (resolve, reject) {
    // 查看button是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              // console.log('获取用户信息成功', res);
              resolve(res);
            },
            fail: function (err) {
              // console.log('获取用户信息失败', err);
              reject(err);
            }
          })
        } else { // 没有授权
          // console.log('但获取用户信息失败，未同意button授权');
        }
      }
    })
  });
}

/**
 * 调用微信获取位置信息接口，需要button授权
 */
function getUserLocation () {
  return new Promise(function (resolve, reject) {
    // 查看button是否授权
    wx.getSetting({
      success: function (res) {
        //如果微信没有开启位置权限，跳转到开启位置权限页面开启位置权限
        if (res.authSetting['scope.userLocation'] != undefined
          && res.authSetting['scope.userLocation'] != true) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          // console.log('但获取用户位置成功，已同意button授权');
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if(res.cancel){
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              }else if(res.confirm){
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      return getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          // 如果微信开启了位置权限，直接调用获取位置方法
          return getLocation();
        }
      }
    })
  });
}
//获取经纬度
function getLocation(){
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      console.log("success "+JSON.stringify(res))
      var latitude = res.latitude  //纬度，范围为 -90~90，负数表示南纬
      var longitude = res.longitude  //经度，范围为 -180~180，负数表示西经
      return getLocal(latitude, longitude) //把经纬度传给getLocal方法
    },
    fail: function (res) {
      console.log('fail ' + JSON.stringify(res))
    }
  })
}
//获取具体位置
function getLocal(latitude, longitude){
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude
    },
    success:function(res){
      return res;
    },
    fail:function (res) {
      return res;
      console.log("获取城市名称失败",res)
    }
  })
}

function redirect (url) {
  // 判断页面是否需要登录
  // if (false) {
  //   wx.redirectTo({
  //     url: '/pages/auth/login/login'
  //   });
  //   return false;
  // } else {
  wx.redirectTo({
    url: url
  });
  // }
}

function showErrorToast (msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

const util = {
  formatTime,
  request,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
  getUserLocation
}

export default util
