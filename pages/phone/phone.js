// pages/phone/phone.js
var app = getApp();
var port = getApp().globalData.port;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    matcher:"",
    nums:"",
    Yanzheng:"",
    disabled: false,
    status:'获取验证码',
    time:59,
  },
  // 获取验证码
  yanzheng: function() {
    var that = this;
    wx.request({
      url: port + "/MiniLife/user/matcherPhone",
      data: {
        phone: that.data.nums
      },
      method: 'GET',
      success: function (res) {
      that.setData({
        matcher:res.data
      })
      }
    })

    if(!this.data.disabled) {
      this.setData({
        disabled: true,   
      })
      var time = setInterval(function () {
        that.setData({
          time: that.data.time - 1,
          status: that.data.time + '秒'
        })
        if (that.data.time == -1) {
          clearInterval(time)
          that.setData({
            status: '获取验证码',
            disabled: false,
            time: 59,
          })
        }
       }, 1000);
       
    }
    
    
  },

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
    wx.request({
      url: port + '/MiniLife/selectUserByOpenId',
      data:{
        'openid': wx.getStorageSync("openid")
      },
      success:function(resData){
        if (resData.data.userPhone!=null){
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '您已经绑定了手机号码',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/set-personal-info/info',
                })
              }
            }
          })
        }else{
        
        }
      }
      
    })
  
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
    console.log('刷新了')
    this.onLoad()
    wx.stopPullDownRefresh()
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
  
  // },
  searchBox:function(){

  },

  // 监听输入
  watchPassWord: function (event) {
    var that=this
    console.log(event.detail.value);
    var ss = event.detail.value
    that.setData({
      nums:ss
     })
  },

 // 监听输入
  watchYanzheng: function (event) {
    var that = this
    console.log(event.detail.value);
    var ss = event.detail.value
    that.setData({
      Yanzheng: ss
    })
  },
  submitMatch:function(){
    var that=this
    var s1 = that.data.matcher
    var s2 = that.data.Yanzheng

    if(s1==s2){
      wx.request({
        url: port + "/MiniLife/user/updatePhone",
        data: {
          openid: wx.getStorageSync("openid"),
          phone: that.data.nums
        },
        method: 'GET',
        success: function (res) {
          if(res.data=="SUCCESS"){
            wx.showToast({
              title: '验证成功！'
            }),
              wx.redirectTo({
                url: '/pages/set-personal-info/info',
              })
          }else{
            wx.showToast({
              title: '信息更新失败！'
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '验证失败！'
      })
    }
  }
  
})