// pages/myvips/myvip.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fanstype1: true,
    fanstype2: false,
    usertype: 'chuangke'
  },

  fanstype1: function () {
    this.setData({
      fanstype1: true,
      fanstype2: false,
      usertype: 'chuangke'
    })
  },

  fanstype2: function () {
    this.setData({
      fanstype1: false,
      fanstype2: true,
      usertype: 'users'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    if (options) {
      if (options.id) {
        wx.setStorageSync('lock_openid', options.id)
        lock_user.lock_user()
      }
    }
    var val = wx.getStorageSync("openid")
    wx.request({
      url: port + '/MiniLife/getIsVip',
      data: {
        openId: val,
      },
      success: function (resData) {
        wx.hideLoading()
        console.log(resData.data);
        if (!val) {
          //跳转授权页面
          wx.navigateTo({
            url: '/pages/shouquan/shouquan?path=' + '/pages/wede/wode',
          });
        } else {
          that.setData({
            isVip: resData.data.obj,
            length: resData.data.attributes.total,
            usersTotal: resData.data.attributes.usersTotal,
            chuangkeTotal: resData.data.attributes.chuangkeTotal
          })
          console.log(that.data.isVip)
        }
      }
    }),
      wx.request({
        url: port + '/MiniLife/user/getUserInfo',
        data: {
          openid: val,
        },
        success: function (res) {
          var types = res.data.userType
          if (types == "chuangke") {
            that.setData({
              userType: "梦想创客",
              chuangkeType: true
            })
          } else if (types == "users") {
            that.setData({
              userType: "普通用户",
            })

          } else if (types == "prox") {
            that.setData({
              userType: "区域代理",
            })
          } else {
            that.setData({
              userType: "普通用户",
            })
          }
        }
      })
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
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
  // onReachBottom: function () {
  //   this.data.currpage += 1;
  //   var that = this;
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   wx.request({
  //     url: port + '/MiniLife/getIsVip',
  //     data: {
  //       openId: val,
  //       currPage: that.data.currpage
  //     },
  //     success: function (resData) {
  //       console.log(resData.data);
  //       wx.hideLoading()
  //       if (!resData.data[0]) {
  //         wx.showToast({
  //           title: '没有更多粉丝了',
  //         })
  //       } else {
  //         that.data.isVip = that.data.isVip.concat(resData.data)
  //         that.setData({
  //           isVip: that.data.obj.isVip,
  //         })
  //       }

  //     }
  //   })

  // },


  getVip: function () {
    var val = wx.getStorageSync("openid");
    var that = this;
    wx.request({
      url: port + '/MiniLife/getIsVip',
      data: {
        openId: val,
        currPage: 1
      },
      success: function (resData) {

        that.setData({
          'isVip': resData.data
        })
      }
    })



  }
})