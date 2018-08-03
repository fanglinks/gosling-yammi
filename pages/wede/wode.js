// pages/wede/wode.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isComm: false,
    money:"",
    openid:"",
    userType:"",
    chuangkeType:false
  },

  // 点击头像
  geren: function (even) {
    wx.navigateTo({
      url: '/pages/set-personal-info/info',
    })
  },

  // 创客
  chuangke: function() {
    if (!this.data.chuangkeType) {
      wx.navigateTo({
        url: '/pages/chuangke/chuangke',
      })
    }
    else {
      wx.showModal({
        title: '尊敬的创客',
        content: '您已经是创客了',
        showCancel:false,
        confirmText: '我知道了'
      })
    }
    
  },

  
  showShareMenu() {
    wx.showShareMenu();
    console.log("显示了当前页面的转发按钮");
  },
  hideShareMenu() {
    wx.hideShareMenu();
    console.log("隐藏了当前页面的转发按钮");
  }, 
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮")
    }
    return {
      title: '梦想生活',
      path: '/pages/wede/wode?id=' + wx.getStorageSync("openid"),
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
  address: function(event) {
    wx.chooseAddress({
      success: function(res) {
      }
    })
  },
  tixian: function(event) {
    wx.navigateTo({
      url: '/pages/tixian/tixian',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  shopcar: function(event) {
    wx.navigateTo({
      url: '/pages/shopping-cart/shopcar',
    })
  },
  pingjia: function (event) {
    wx.navigateTo({
      url: '/pages/eveluate/eveluate',
    })
  },
  shoucang: function (event) {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },
  myvips: function (event) {
    wx.navigateTo({
      url: '/pages/myvips/myvip',
    })
  },
  guanlian: function (event) {
    wx.navigateTo({
      url: '/pages/related-businesses/relevance',
    })
  },
  ruzhu: function (event) {
    wx.request({
      url: port + '/MiniLife/getComms',
      data:{
        'unionid': wx.getStorageSync("unionid")
      },
      success:function(resData){
        if (resData.data == 1 || resData.data == 6){
          wx.navigateToMiniProgram({
            appId: 'wx6a59ae8e8cccd796',
            path: 'pages/home/home',
            extraData: {
              foo: 'bar'
            },
            envVersion: 'develop',
            success(res) {
              // 打开成功
            }
          })
        } else if (resData.data == 0){
          wx.showToast({
            icon:"none",
            title: '等待审核中...',
          })
        }else{
          wx.navigateTo({
            url: '/pages/enter/enter',
          })
        }
      }
    })



    
  },
  jiameng: function (event) {
    wx.navigateTo({
      url: '/pages/join-investment/jiameng',
    })
  },
  set: function (event) {
    wx.navigateTo({
      url: '/pages/set/set',
    })
  },
  
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options){
        wx.setStorageSync('lock_openid', options.id)
        lock_user.lock_user()
    }
    
    var isShouquan = wx.getStorageSync('openid')
    if (isShouquan != '') {
      this.setData({
        isShouquan:true
      })
    }
    else {
      this.setData({
        isShouquan: false
      })
      console.log(this.data.isShouquan)
    }

    var that = this
    var val=wx.getStorageSync("openid")
            wx.request({
              url: port + '/MiniLife/user/getUserInfo',
              data: {
                openid: val,
              },
              success: function (res) {
                var types=res.data.userType
                that.setData({
                  'userInfo':res.data
                })
                if (types=="chuangke"){
                  that.setData({
                    userType: "梦想创客",
                    chuangkeType: true                    
                  })
                } else if (types == "users"){
                  that.setData({
                    userType:"普通用户",
                  })

                } else if (types == "prox") {
                  that.setData({
                    userType: "区域代理",
                  })
                }else{
                  that.setData({
                    userType: "普通用户",
                  })
                }
              }
            }) 
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
    })
    // 检测是否是商家
    wx.request({
      url: port + '/MiniLife/getComms',
      data: {
        'unionid': wx.getStorageSync("unionid")
      },
      success: function (resData) {
        if (resData.data == 1 || resData.data == 6) {
         that.setData({
           isComm:true
         })
        }
      }
    })
    var path = "";
    //返回二维码图片
    wx.request({
      url: port + '/MiniLife/createConsumerCar',
      data: {
        "userOpenid": wx.getStorageSync("openid"),
        "path": "pages/home/home"
      },
      success: function (res) {
        console.log("二维码信息");
        console.log(res.data.obj);
        // var qrcodePath = res.data;
        if (res.data.success) {

          console.log('进入了二维码生成代码')
            wx.hideLoading();
            //存储图片
            that.setData({
              current: res.data.obj
            })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '服务器繁忙，请稍后重试！',
            icon: 'none'
          })
        }
      }
    });
  },
  // 用户二维码
  user_card: function() {
  
   var that = this;
    //弹出图片
    wx.previewImage({
      current: that.data.current, // 当前显示图片的http链接
      urls: [that.data.current] // 需要预览的图片http链接列表
    });

  },

  // 授权事件
  onGotUserInfo: function() {
    var that = this;
    console.log('点击了授权')
    wx.showLoading({
      title: '登录中...',
      mask:true
    })
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
                  url: "https://www.imxsh.cn/MiniLife/shdecodeUser",
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
                    wx.hideLoading()
                    wx.showToast({
                      title: '登录成功',
                    })
                    console.log('授权成功')
                    wx.setStorageSync("openid", result.data.userInfo.openId)
                    wx.setStorageSync("unionid", result.data.userInfo.unionId)
                    wx.setStorageSync('shopCar', [])
                    wx.setStorageSync('history', [])
                    that.setData ({
                      isShouquan: true
                    })
                    lock_user.lock_user()
                    that.onLoad()
                  }
                })
              },
              fail: function () {
                wx.hideLoading()
                wx.showToast({
                  title: '登录失败！',
                  image:"/img/collect/warning.png"
                })
                console.log('获取用户信息失败')
                // wx.navigateTo({
                //   url: '/pages/shouquan/shouquan',
                // })
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

  login: function() {
    wx.showLoading({
      title: '登录中',
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
    wx.switchTab({
      url: '../wede/wode',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  qianbao: function() {
    wx.navigateTo({
      url: '/pages/vallet/vallet',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  mingxi: function() {
    wx.navigateTo({
      url: '/pages/detail-account/account',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  dingdan: function() {
    wx.navigateTo({
      url: '/pages/order/order',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  addCart: function () {
    wx.navigateTo({
      url: '/pages/shopping-cart/shopcar',
    })

  },
  //徐飞的代码升级创客
  upChuangke:function(){
    wx.navigateTo({
      url: "/pages/chuangke/chuangke"
    })
  },

  // 足迹
  zuji: function() {
    wx.navigateTo({
      url: "/pages/history/history"
    })
  }
}) 