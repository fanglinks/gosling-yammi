// pages/zhuanchang/zhuanchang.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myad: ['https://xwq-object-1256294606.cos.ap-guangzhou.myqcloud.com/%E6%A2%A6%E6%83%B3%E7%94%9F%E6%B4%BB%E8%BD%AE%E6%92%AD%E5%9B%BE/5.jpg']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
    }
    var that =this;
    wx.request({
      url: port + '/MiniLife/getGoodsByTypeII',
      data: {
        typesTwo: '创客专区'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          commTypeS: res.data,
        })
      }
    })
    // 轮播图数据
    // wx.request({
    //   url: port + '/MiniLife/getGoodsByStatus',
    //   data: {
    //     status: 12
    //   },
    //   success: function (res) {
    //     that.setData({
    //       lunbo2ad: res.data
    //     })
    //   }

    // })
  },

  // 跳转详情页
  doDetail: function (e) {
    wx.navigateTo({
      url: '/pages/menwear-detail/deetail?goodsid=' + e.currentTarget.dataset.goodsid + '&yuanjia=' + e.currentTarget.dataset.yuanjia,
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