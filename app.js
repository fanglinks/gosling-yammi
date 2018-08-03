//app.js
App({
  onLaunch: function () {
    console.log('进入了appjs')
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })  
    var that = this;  
    if (!wx.getStorageSync('openid')) {
      console.log('未登录状态')
      // wx.navigateTo({
      //   url: '/pages/shouquan/shouquan',
      // })
    }
  },
  globalData: {
    cart: [],
 
    // 服务器接口 
   // port: 'https://www.imxsh.cn',


    // 测试接口
    // port: 'http://47.104.98.196:8082'
    port: 'http://192.168.0.104:8080'

  }
})