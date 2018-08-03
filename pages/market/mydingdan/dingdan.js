// pages/market/dingdan/dingdan.js
var app = getApp();
var port = getApp().globalData.port;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
// 唤起支付弹窗
  goumai: function () {
    if (this.data.userName && this.data.telNumber && this.data.address) {
      this.setData({
        move: true
      })
    }
    else {
      wx.showToast({
        title: '收货信息没有填写完整！',
        icon:'none'
      })
    }
    
  },
// 收起支付弹窗
  cha: function () {
    this.setData({
      move: false
    })
  },
// 用户信息
  userinfo: function() {
    console.log('地址')
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          userName: res.userName,
          telNumber: res.telNumber,
          address: res.provinceName + res.cityName + res.countyName + res.detailInfo
        })
        wx.setStorageSync('userName', res.userName)
        wx.setStorageSync('telNumber', res.telNumber)
        wx.setStorageSync('address', res.provinceName + res.cityName + res.countyName + res.detailInfo)
      }
    })
  },

  // 加数量
  jia: function() {
    if(this.data.goodsinfo.num < 999) {
      this.data.goodsinfo.num += 1;
      this.setData({
        goodsinfo: this.data.goodsinfo,
        allprice: (+(this.data.goodsinfo.foodPrice * this.data.goodsinfo.num)).toFixed(2)
      })
    }
    
  },
// 减数量
  jian: function () {
    if (this.data.goodsinfo.num > 1) {
      this.data.goodsinfo.num -= 1;
      this.setData({
        goodsinfo: this.data.goodsinfo,
        allprice: (+(this.data.goodsinfo.foodPrice * this.data.goodsinfo.num)).toFixed(2)
    })
    
  }
  },

  // 立即支付
  jiesuan: function(e) {
    console.log(e.detail.formId)
    if (this.data.userName && this.data.telNumber && this.data.address) {
      var that = this
      var dels = that.data.goodsinfo.id
      console.log(that.data.goodsinfo)
      console.log(dels)
      wx.request({
        url: port + '/MiniLife/api/getFoodsById',
        data: {
          id: dels
        },
        method: "GET",
        success: function (res) {
          console.log(res.data)
          that.setData({
            foods: res.data
          })
          // that.data.foods["num"] = "1"
          console.log(that.data.foods)

          // -----------------
          var val = wx.getStorageSync("openid")
          // 钱包支付
          if (+that.data.qianbao >= +that.data.allprice) {
            console.log('钱包支付')
            var url = port + '/MiniLife/aggregetPay';
            wx.showModal({
              title: '钱包支付提醒',
              content: '钱包余额' + that.data.qianbao + ',' + ' 直接使用钱包抵扣',
              success: function (res) {
                if (res.confirm) {
                  wx.request({
                    url: url,
                    data: {
                      openid: val,
                      heji: that.data.allprice,
                      userName: that.data.userName,
                      address: that.data.address,
                      telNumber: that.data.telNumber,
                      shopping: "[" + JSON.stringify(that.data.goodsinfo) + "]",
                      formId: e.detail.formId
                    },
                    method: "GET",
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
                      console.log(that.data.qianbao, that.data.allprice)
                      // 钱包支付
                      if (+that.data.qianbao >= +that.data.allprice) {
                        console.log('钱包支付')

                        if (res.data === '支付成功') {
                          wx.showToast({
                            title: '支付成功',
                          })
                          wx.switchTab({
                            url: '/pages/market/market',
                            success: function (res) {
                              wx.showToast({
                                title: '购买成功',
                              })
                            },
                          })
                        }
                        else {
                          wx.showToast({
                            title: '支付失败，请稍后重试！',
                            icon: 'none'
                          })
                        }
                        return;
                      }
                      // 微信支付
                      wx.requestPayment({
                        "timeStamp": that.data.timeStamp,
                        "nonceStr": that.data.nonceStr,
                        "package": that.data.packages,
                        "signType": 'MD5',
                        "paySign": that.data.paySign,
                        success: function (res) {
                          console.log("支付成功！",res)
                          //成功回调
                          wx.showToast({
                            title: '已提交！',
                          })
                          wx.switchTab({
                            url: '/pages/home/home',
                            success: function (res) {
                              wx.showToast({
                                title: '购买成功',
                              })
                            },
                          })
                        },
                        'fail': function (res) {
                          console.log(res)
                        },
                        'complete': function (res) {
                          console.log("支付发起！" + that.data)
                        }
                      })
                    }
                  })
                  
                } else if (res.cancel) {
                  wx.showToast({
                    title: '取消支付！',
                    icon:'none'
                  })
                }
              }
            })
          }
          // 微信支付
          else {
            console.log('微信支付')
            var url = port + '/MiniLife/api/goodsWxPay';

            wx.request({
              url: url,
              data: {
                openid: val,
                heji: that.data.allprice,
                userName: that.data.userName,
                address: that.data.address,
                telNumber: that.data.telNumber,
                shopping: "[" + JSON.stringify(that.data.goodsinfo) + "]",
                formId: e.detail.formId,
                source: 2
              },
              method: "GET",
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
                console.log(that.data.qianbao, that.data.allprice)
                // 钱包支付
                if (+that.data.qianbao >= +that.data.allprice) {
                  console.log('钱包支付')

                  if (res.data === '支付成功') {
                    // wx.showToast({
                    //   title: '支付成功',
                    // })
                    wx.switchTab({
                      url: '/pages/market/market',
                      success: function (res) {
                        wx.showToast({
                          title: '购买成功',
                        })
                      },
                    })
                  }
                  else {
                    wx.showToast({
                      title: '支付失败，请稍后重试！',
                      icon: 'none'
                    })
                  }
                  return;
                }
                // 微信支付
                wx.requestPayment({
                  "timeStamp": that.data.timeStamp,
                  "nonceStr": that.data.nonceStr,
                  "package": that.data.packages,
                  "signType": 'MD5',
                  "paySign": that.data.paySign,
                  success: function (res) {
                    console.log("支付成功！",res)
                    //成功回调
                    wx.showToast({
                      title: '已提交！',
                    })
                    wx.switchTab({
                      url: '/pages/market/market',
                      success: function (res) {
                        wx.showToast({
                          title: '购买成功',
                        })
                      },
                    })
                  },
                  'fail': function (res) {
                    console.log(res)
                  },
                  'complete': function (res) {
                    console.log("支付发起！" + that.data)
                  }
                })
              }
            })
          }
          console.log(that.data.foods)
        }
      })
    }
    else {
      wx.showToast({
        title: '收货信息没有填写完整',
        icon:'none'
      })
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
    var that = this;
    if(options) {
      console.log(options.goodsinfo)
      // 将转换的!LOCK再次转为=
      var goodsinfo = JSON.parse(options.goodsinfo.replace(/!LOCK/g, '='))
      goodsinfo.foodPrice = goodsinfo.foodPrice /goodsinfo.num;
      // goodsinfo['foodName'] = goodsinfo.foodname ? goodsinfo.foodname : goodsinfo.foodName;
      // goodsinfo['foodImg'] = goodsinfo.image ? goodsinfo.image : goodsinfo.foodImg;
      // goodsinfo['foodPrice'] = goodsinfo.price ? goodsinfo.price : goodsinfo.foodPrice;
      // goodsinfo['num'] = goodsinfo.counts ? goodsinfo.counts : goodsinfo.num;
      // goodsinfo['foodId'] = goodsinfo.goodsid ? goodsinfo.goodsid : goodsinfo.foodId;
      // console.log(goodsinfo)
      console.log(goodsinfo)
      if(!goodsinfo.canshu1) {
        goodsinfo['canshu1'] = '无';
      }
      if (!goodsinfo.canshu2) {
        goodsinfo['canshu2'] = '无';
      }
     
    
     var allprice = (goodsinfo.foodPrice*goodsinfo.num).toFixed(2)
     this.setData({
       goodsinfo: goodsinfo,
       allprice: allprice
     })
    }

    // 获取钱包余额
    var val = wx.getStorageSync("openid")
    wx.request({
      url: port + '/MiniLife/user/userGetMoney',
      data: {
        openid: val,
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          qianbao: res.data,
        })
        console.log(+that.data.qianbao)
      }
    })

    // 从缓存中拿取用户收货信息
    this.setData({
      userName: wx.getStorageSync('userName'),
      telNumber: wx.getStorageSync('telNumber'),
      address: wx.getStorageSync('address'),
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