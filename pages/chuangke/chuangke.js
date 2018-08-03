// pages/chuangke/chuangke.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agree:false,
  
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
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
    }

    this.setData({
      pages: options.pages,
    })
  },

  select: function() {
    this.setData({
      agree: !this.data.agree
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

  payChuangke:function(){
    if(!this.data.agree) {
      return;
    }
    else {
      this.data.agree=false;
      this.setData({
        paytext:'支付中...'
      })
    }
    console.log('点击了支付')
    wx.showLoading({
      title: '发起支付',
    
    })
    var that=this
    var val = wx.getStorageSync("openid")
    wx.request({
      url: port + "/MiniLife/api/wxPay",
      data: {
        openid: val,
        fee:"99"
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        that.setData({
          appId: res.data.appId,
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          packages: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign
        })
        wx.requestPayment({
          "timeStamp": that.data.timeStamp,
          "nonceStr": that.data.nonceStr,
          "package": that.data.packages,
          "signType": 'MD5',
          "paySign": that.data.paySign,
          success: function (res) {
            console.log("支付成功！")
            if(that.data.pages) {
              wx.navigateBack({
                success: function (e) {
                  wx.showModal({
                    title: '尊敬的创客',
                    content: '恭喜您开通创客成功',
                    showCancel: false,
                    confirmText: '我知道了'
                  })
                }
              })
            }
            else {
              wx.switchTab({
                url: '/pages/wede/wode',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                  wx.showModal({
                    title: '尊敬的创客',
                    content: '恭喜您开通创客成功',
                    showCancel: false,
                    confirmText: '我知道了'
                  })
                }
              })
            }
            
          },
          'fail': function (res) {
            wx.showModal({
              title: '提示',
              content: "支付失败请重试！",
            })
            that.setData({
              agree:true,
              paytext: false
            })
          },
          'complete': function (res) {
            wx.hideLoading()
            console.log("支付发起！" + that.data)
          }
        })
      }
    });
  }
})