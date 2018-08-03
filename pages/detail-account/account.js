// pages/detail-account/account.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:[]
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options) {
      if (options.id) {
        wx.setStorageSync('lock_openid', options.id)
        lock_user.lock_user()
      }
    }
    
    var that=this
    wx.request({
      url: port + "/MiniLife/money/details",
      data: {
        openid: wx.getStorageSync("openid"),
      },
      method: 'GET',
      success: function (res) {
        // that.setData({
        //   details: res.data
        // })
        
        for(var i = 0; i < res.data.length; i ++) {
          res.data[i].dealFee = +res.data[i].dealFee.toFixed(3).substring(0, res.data[i].dealFee.toFixed(3).lastIndexOf('.') + 3)

          res.data[i].dealCreatetime = res.data[i].dealCreatetime.slice(0,-2)
          
        }
        that.setData({
          details: res.data
        })
       
        
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮")
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
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})