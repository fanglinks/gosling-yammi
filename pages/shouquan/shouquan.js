// pages/shouquan/shouquan.js
var app = getApp();
var port = getApp().globalData.port
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.path){
      this.setData({
        path: options.path
      });
    }
  },
// 用户授权回调
  onGotUserInfo: function() {
    var that = this;
    wx.login({
      success: function (r) {
        if (r.code) {
          var code = r.code;//登录凭证 
          if (code) {
            //2、调用获取用户信息接口 
            wx.getUserInfo({
              success: function (res) {
                //发起网络请求 
                wx.request({
                  url: port +  "/MiniLife/shdecodeUser",
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  data: {
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    code: code
                  },
                  //点击允许之后执行
                  success: function (result) {
                    wx.setStorageSync("isFirst", result.data.isFirst)
                    console.log('授权成功', result.data.userInfo.openId)
                    wx.setStorageSync("openid", result.data.userInfo.openId)
                    wx.setStorageSync("unionid", result.data.userInfo.unionId)
                    wx.setStorageSync('shopCar', [])
                    wx.setStorageSync('history', []);
                    lock_user.lock_user()
                    if (that.data.path){
                      wx.switchTab({
                        url: that.data.path,
                        success:function(){
                          var page = getCurrentPages().pop();
                          if (page == undefined || page == null) return;
                          page.onLoad(); 
                        }
                      })
                    }else{
                      wx.navigateBack({
                      })
                    }
                  }
                })
              },
              fail: function () {
                console.log('获取用户信息失败')
               that.setData({
                 fail:'shibai'
               })
               wx.setStorageSync('shopCar', [])
               wx.setStorageSync('history', [])
                // wx.setStorageSync("openid", 'o_i7W5cy8DwOI2x6SuUK8wjt-pHk')
              }
            })
          } else {
            console.log('获取用户登录态失败！' + r.errMsg)
          }
        } else {
        }
      }
    }); 
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
  // onShareAppMessage: function () {
  
  // }
})