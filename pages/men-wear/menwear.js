// pages/men-wear/menwear.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand: [
      {
        img: '/img/men-wear/28.gif'
      },
      {
        img: '/img/men-wear/29.gif'
      },
      {
        img: '/img/men-wear/30.gif'
      },
      {
        img: '/img/men-wear/31.gif'
      },
      {
        img: '/img/men-wear/34.gif'
      },
      {
        img: '/img/men-wear/35.gif'
      },
      {
        img: '/img/men-wear/38.gif'
      },
      {
        img: '/img/men-wear/40.gif'
      }
    ],
    imgUrls: ["/img/men-wear/2.gif"],
    specialImg: ['/img/men-wear/18.gif'],
  },
  // 底部加载更多
  dibu: function () {
    console.log('下面加载了')
  },
  detail: function () {
    wx.navigateTo({
      url: '/pages/menwear-detail/deetail',
    })
  },

  // 二级页
  erjiye: function (e) {
    var that = this;
    console.log(that.data.typeOne)
    
    var index = e.currentTarget.dataset.id;
    this.setData({
      num: index
    })
    console.log(this.data.leibie[index])
    // 请求相应类别的数据
    wx.request({
      url: port + '/MiniLife/getGoodsByTypeII',
      data: {
        typesTwo: this.data.leibie[index],
        bigType: that.data.typeOne
      },
      success: function (res) {
        that.setData({
          commTypeS: res.data,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.leibie)
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
    }
    var that = this;
    that.setData({
      types: JSON.parse(options.types),
      // 一级类数据
      typeOne: JSON.parse(options.types).text,
      // 二级页面种类数据
      leibie: JSON.parse(options.types).leibie,
      // allleibie: JSON.parse(options.leibie)
    })
    wx.setNavigationBarTitle({
      title: this.data.typeOne
    })
    wx.request({
      url: port + '/MiniLife/getGoodsByType',
      data: {
        types: that.data.typeOne
      },
      success: function (resData) {
        that.setData({ 'commTypeS': resData.data })
        console.log(that.data.commTypeS[0])
      }
    })
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
    return {
      title: '梦想生活'+ '【' + this.data.typeOne + '】',
      path: '/pages/men-wear/menwear?id=' + wx.getStorageSync("openid") + '&types=' + JSON.stringify(this.data.types),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败

      }
    }
  },
  doDetail: function (e) {
    wx.navigateTo({
      url: '/pages/menwear-detail/deetail?goodsid=' + e.currentTarget.dataset.goodsid + '&yuanjia=' + e.currentTarget.dataset.yuanjia,
    })
  }


})