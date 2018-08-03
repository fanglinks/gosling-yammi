// pages/hotel/hoteldetail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelected1: true,
    isSelected2:false,

    xiangqing: false,
    pinglun: true,

    server:[
      {
        img:'/img/hotel/13.gif',
        name: '无线',
      },
      {
        img: '/img/hotel/05.gif',
        name: '空调',
      },
      {
        img: '/img/hotel/07.gif',
        name: '暖气',
      },
      {
        img: '/img/hotel/10.gif',
        name: '电视',
      },
      {
        img: '/img/hotel/19.gif',
        name: '雨伞',
      },
      {
        img: '/img/hotel/20.gif',
        name: '冰箱',
      },
      {
        img: '/img/hotel/21.gif',
        name: '热水器',
      },
    ],
  },

  // 预定

  yuding: function() {
    var that = this;
    if(this.data.enter) {
      wx.navigateTo({
        url: '/pages/hotel/hotelDingdan/dingdan?enter=' + that.data.enter + '&leave=' + that.data.leave,
      })
    }
    else {
      wx.showToast({
        title: '请先选择时间',
        icon:'none'
      })
    }
  },

// 分页之详情
  xiangqing: function() {
    this.setData({
      isSelected1: true,
      isSelected2: false,

      xiangqing: false,
      pinglun: true,
    })
  },
// 分页之评论
  pinglun: function () {
    this.setData({
      isSelected1: false,
      isSelected2: true,

      xiangqing: true,
      pinglun: false,
    })
  },
  // 时间选择器
  time: function() {
    wx.navigateTo({
      url: '/pages/hotel/time/time?page='+ 'detail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.enter) {
      this.setData({
        enter: options.enter,
        leave: options.leave,
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