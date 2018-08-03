// pages/wede/vallet/vallet.js
var app = getApp();
var port = getApp().globalData.port
Page({

  /**
   * 页面的初始数据
   */
  data: {
  money:"0"
  },
  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log("来自页面内转发按钮")
  //     console.log(res.target)
  //   }
  //   return {
  //     title: '梦想生活',
  //     path: '/pages/vallet/vallet?id=' + wx.getStorageSync("openid"),
  //     success: function (res) {
  //       // 转发成功
  //       console.log("转发成功")
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //       console.log("转发失败")
  //     }
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options){
      // wx.request({
      //   url: "https://www.imxsh.cn/MiniLife/user/lockingUser",
      //   data: {
      //     openid: options.id,
      //     lockopenid: wx.getStorageSync("openid"),
      //   },
      //   method: 'GET',
      //   success: function (res) {
      //   }
      // })
    }
  
    var val = wx.getStorageSync("openid")
      wx.request({
        url: port + '/MiniLife/user/userGetMoney',
        data: {
          openid: val,
        },
        method: 'GET',
        success: function (res) {
          that.setData({
            money: +res.data.toFixed(3).substring(0, res.data.toFixed(3).lastIndexOf('.') + 3),
          })
        }
      })
  },

  // 明细
  mingxi: function() {
    wx.navigateTo({
      url: '/pages/detail-account/account',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  upMoney:function(){
    wx.navigateTo({
      url: '/pages/tixian/tixian',
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '等待功能开放！',
    // })
  },

  //用户充值
  inputMoney:function(){
  // wx.navigateTo({
  //   url: '/pages/chongzhi/chongzhi',
  // })
  }
})