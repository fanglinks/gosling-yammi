// pages/hotel/hotel.js
var app = getApp();
var port = getApp().globalData.port
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotel:[
      {
        title: '韦斯特国际五星级酒店',
        price: 1800,
        dizhi: '广东省深圳市龙华新区龙华街道123号',
      },
      {
        title: '韦斯特国际五星级酒店',
        price: 1800,
        dizhi: '广东省深圳市龙华新区龙华街道123号',
      },
    ]
  },
// 跳转酒店详情页
  tohotelDetail: function() {
    wx.navigateTo({
      url: '/pages/hotel/hoteldetail/detail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date1 = Date.parse(options.leave);
    var date2 = Date.parse(options.enter);
    if (options.enter) {
      this.setData({
        enter: options.enter,
        leave: options.leave,
        alldays: Math.ceil((date1 - date2) / (24 * 60 * 60 * 1000)) + "天"
      })
    }
  },

  // 选择时间
  selecttime: function() {
    wx.navigateTo({
      url: '/pages/hotel/time/time',
    })
  },

  hotellist:function() {
    wx.navigateTo({
     url: "/pages/hotel/paixu/paixu",
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})