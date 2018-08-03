// pages/hotel/hotelDingdan/dingdan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  // 提交订单判定
  formSubmit: function(e) {
    var value = e.detail.value;
    if(value.username && value.telephone && value.num) {
     console.log('可以提交') 
    }
    else {
      wx.showToast({
        title: '请完整填写信息',
        icon: 'none',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date1 = Date.parse(options.leave);
    var date2 = Date.parse(options.enter);
    if(options.enter) {
      this.setData({
        enter: options.enter,
        leave: options.leave,
        alldays: Math.ceil((date1 - date2) / (24 * 60 * 60 * 1000)) + "天"
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