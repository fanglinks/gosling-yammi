// pages/pingtuan/pingtuan.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pingtuanlist:[
      
    ],
  },

  // 进入团购详情页
  todetail: function(e) {
    wx.navigateTo({
      url: '/pages/yulan/detail?pintuanId=' + e.currentTarget.dataset.pintuanid,
    })
  },  

  // 加载更多
  dibu: function () {
    var newlist = this.data.pingtuanlist.concat(this.data.pingtuanlist);
    var that = this;
    console.log('下面加载了')
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
      that.setData({
        pingtuanlist: newlist
      })
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
    }
    var that=this;
    wx.request({
      url: port + '/MiniLife/selectAllSpell',
      success:function(resData){
        that.setData({
          'spellList':resData.data
        })
      }
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