// pages/chongzhi/chongzhi.js
var app = getApp();
var port = getApp().globalData.port
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮")
      console.log(res.target)
    }
    return {
      title: '梦想生活',
      path: '/pages/home/home?id=' + wx.getStorageSync("openid"),
      success: function (res) {
        // 转发成功
        console.log("转发成功")
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败")
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("获取分享者信息：" + options.id)
    var ss = options.id
    if (ss != null) {
      wx.request({
        url: port + "/MiniLife/user/lockingUser",
        data: {
          openid: options.id,
          lockopenid: wx.getStorageSync("openid"),
        },
        method: 'GET',
        success: function (res) {
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('刷新了')
  this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})