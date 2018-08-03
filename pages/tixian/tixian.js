// pages/tixian/tixian.js
var app = getApp();
var port = getApp().globalData.port
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxName: "",
    nickName: "",
    userInfo: {}
  },
  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log("来自页面内转发按钮")
  //   }
  //   return {
  //     title: '梦想生活',
  //     path: '/pages/home/home?id=' + wx.getStorageSync("openid"),
  //     success: function (res) {
  //       // 转发成功
  //       console.log("转发成功")
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //       console.log("转发失败")
  //     }
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
  matchers: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          nickName: res.userInfo.nickName,
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
    wx.showToast({
      title: '验证成功！',
    })
  },
  // allUpMoney: function () {
  //   wx.showToast({
  //     icon: "none",
  //     title: '不支持全部提现！',
  //   })
  // },
  //获取用户输入的用户名
  UPfee: function (e) {
    this.setData({
      money: e.detail.value
    })
  },

  // 提现
  upMoney: function () {
    var ss = this.data.nickName

    if (ss == "") {
      wx.showToast({
        icon: 'loading',
        title: '请先验证!',
      })
      return
    }
    var fee = this.data.money

    if (fee == undefined) {
      wx.showToast({
        icon: 'loading',
        title: '金额不能为空!',
      })
      return
    }
    if (Math.floor(this.data.money / 50) != this.data.money / 50) {
      wx.showToast({
        title: '提现金额为50元的整数或倍数',
        icon: 'none'
      })
      return;
    }
    var val = wx.getStorageSync("openid")
    wx.request({
      url: port + "/MiniLife/user/userUpMoney",
      data: {
        openid: val,
        fee: fee,
      },
      method: 'GET',
      success: function (ress) {
        if (ress.data === "SUCCESS") {
          wx.showModal({
            title: '提示',
            content: '您的提现申请已经提交 请耐心等待工作人员1-2个工作日的审核！',
            showCancel: false,
            success: function (res) {
              wx.switchTab({
                url: '/pages/wede/wode',
              })
            }
          })
        } else {
          wx.showToast({
            icon: "none",
            title: ress.data,
          })
        }






        // wx.showModal({
        //   title: '提示',
        //   content: '您的提现申请已经提交 请耐心等待工作人员1-2个工作日的审核！',
        //   showCancel:false,
        //   success:function(res){
        //     if(res.confirm){
        //       if (ress.data == "SUCCESS") {
        //         wx.navigateTo({
        //           url: '/pages/vallet/vallet',
        //         })
        //       } else {
        //         wx.showToast({
        //           icon: "none",
        //           title: ress.data,
        //         })
        //       }
        //     }
        //   }
        // })
      }
    })
  }
})