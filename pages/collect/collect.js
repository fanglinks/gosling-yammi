// pages/collect/collect.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagechange: {
      goods: false,
      stores: true
    },
    isChecked: true,
  },

  // 取消收藏
  cancel_collect: function (e) {
    var that = this;
    var foodid = e.currentTarget.dataset.foodid.collectFoodsid
    console.log(foodid)
    wx.request({
      url: port + '/MiniLife/deleteColl',
      data: {
        'foodId': foodid,
      },
      success: function (resData) {
        wx.showToast({
          title: resData.data,
          icon: 'success',
        })
        that.onLoad()
      }
    })
  },

  // 跳转详情页
  doDetail: function (e) {
    wx.navigateTo({
      url: '/pages/menwear-detail/deetail?goodsid=' + e.currentTarget.dataset.goodsid + '&yuanjia=' + e.currentTarget.dataset.yuanjia,
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
  goodsCollect: function (event) {
    this.setData({
      pagechange: {
        goods: false,
        stores: true
      },
      isChecked: true,
      isChecked2: false
    })

  },
  storesCollect: function (event) {
    this.setData({
      pagechange: {
        goods: true,
        stores: false
      },
      isChecked: false,
      isChecked2: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      if (options.id) {
        wx.setStorageSync('lock_openid', options.id)
        lock_user.lock_user()
      }
    }
    var that = this;
    wx.request({
      url: port + '/MiniLife/getAllColl',
      data: {
        'openId': wx.getStorageSync("openid")
      },
      success: function (resData) {
        that.setData({ 'collect': resData.data });
        console.log(that.data.collect)
      }
    })
    // 查询店铺收藏列表
    wx.request({
      url: port + '/MiniLife/queryCollectionShops',
      data:{
        collectOpenid : wx.getStorageSync('openid'),
        collectStatics:1
      },
      success:function(res) {
        console.log(res.data.obj)
       that.setData({
         collect_shop: res.data.obj
       })
        
      }
    })

  },

  // 进入店铺
  geotoshop: function(e) {
    var shopdetail = e.currentTarget.dataset.shopdetail

    if (shopdetail.shanghuTypeLine == "线下") {
      wx.navigateTo({
        url: '/pages/shopdetail/shopdetail?shopid=' + shopdetail.collectShopId,
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/market/marketshop/shop?shopid=' + shopdetail.collectShopId,
      })
    }
    
  },

  // 取消收藏
  cancle: function(e) {
    var that = this;
    var shopdetail = e.currentTarget.dataset.shopdetail
    wx.request({
      url: port + '/MiniLife/collectionShop',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        collectOpenid: wx.getStorageSync('openid'),
        collectShopId: shopdetail.collectShopId,
        collectStatics: 2
      },
      success: function (res) {
        wx.showToast({
          title: '取消成功',
          icon: 'success',
        })
        that.onLoad()
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

    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})