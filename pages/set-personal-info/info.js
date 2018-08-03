// pages/set-personal-info/info.js
var app = getApp();
var port = getApp().globalData.port
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'未设置',
    array:['男','女'],
  },
 
// 性别
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      sexChange: true
    })
  },

  // 监听表单

  dangqian: function(e) {
    this.setData({
      name: true
    })
  },
// 跳转验证手机

  phone: function() {
    wx.navigateTo({
      url: '/pages/phone/phone',
    })
  },

// 添加修改地址
  address: function (event) {
    wx.chooseAddress({
      success: function (res) {
        ``
      }
    })
  },
// 时间选择器
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      dataChange: true
    })
  },

  // 上传头像
  touxiang: function (event) {
    this.setData({
      changetouxiang:true
    })
    var COS = require("../../libs/upload.js");
    var config = {
      Bucket: 'minilife-1254115012',
      Region: 'ap-guangzhou'
    };
    var that = this;
    // 初始化实例
    var cos = new COS({
      getAuthorization: function (params, callback) {
        var authorization = COS.getAuthorization({
          SecretId: 'AKIDrWw61hsID2cx2vI2GEvMWP2PO7csEfCU',
          SecretKey: 'AtNdePvDG4dy5xaHkz3waz93i8JJ6ex1',
          Method: params.Method,
          Key: params.Key
        });
        callback(authorization);
      }
    });

    // 选择文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var filepath = res.tempFilePaths[0];
        var filename = filepath.substr(filepath.lastIndexOf('/') + 1);
        var httpsName = "https://minilife-1254115012.cos.ap-guangzhou.myqcloud.com/"
        var httpsImg = httpsName + filename;

        that.setData({
          img: res.tempFilePaths,
          logo: true,
          imgChange: true,
          'httpsimg':httpsImg
        })
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: filename,
          FilePath: filepath,
          onProgress: function (info) {
          }
        }, function (err, data) {
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var dingshiqi = setInterval(function () {
      if (wx.getStorageSync("openid")) {
        clearInterval(dingshiqi)
        wx.request({
          url: port + "/MiniLife/user/lockingUser",
          data: {
            openid: options.id,
            lockopenid: wx.getStorageSync("openid"),
          },
          method: 'GET',
          success: function (res) {
          }
        })
      }
    }, 1000);
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
    var that=this;
    wx.request({
      url: port + '/MiniLife/selectUserByOpenId',
      data:{
        'openid': wx.getStorageSync("openid")
      },
      success:function(resData){
    
        that.setData({
          'user':resData.data
        })
        console.log(resData.data)
        that.setData({
          index:resData.data.userSex
        })
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
   * 保存按钮
   */
formSubmit:function(e){

  var formData = e.detail.value;
  formData['openid'] = wx.getStorageSync("openid")
  var that=this;
  wx.showLoading({
    title: '提交中...',
    mask: true
  })
  wx.request({
    url: port + '/MiniLife/userUpdata',
    data:formData,
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    method: 'post',
    success:function(resData){
      wx.hideLoading();
      
      wx.showToast({
        title: resData.data,
        icon:'none'
      })
    }
  })
}



})