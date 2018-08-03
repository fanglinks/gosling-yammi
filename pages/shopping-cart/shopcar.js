// pages/shopping-cart/shopcar.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updetails:[],
    clear: true,
    isempty: false,
    heji: 0,
    select: [],
    allchecked: false,
    checked: false,
    isSelected: false,
    background: false

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
  // 清空购物车
  clearall: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定清空购物车吗',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('shopCar', [])
          that.setData({
            haha: [],
            isempty: false,
            clear: true,
            background: true,
            heji: 0,
            isSelected: false
          })
          wx.navigateTo({
            url: '/pages/home/home'
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  // 全选
  allselect: function () {
    if (this.data.isSelected === false) {
      this.setData({
        isSelected: true,
        heji: 0,
      })
      for (var index in this.data.haha) {

        var localselect = 'select' + '[' + index + ']'
        this.setData({
          [localselect]: true,
          heji: +(this.data.heji + this.data.haha[index].foodPrice * this.data.haha[index].num).toFixed(2),
          updetails:this.data.haha,
        })
       
      }
    }
    else {
      this.setData({
        isSelected: false
      })
      for (var index in this.data.haha) {
       
        var localselect = 'select' + '[' + index + ']'
        this.setData({
          [localselect]: false,
          heji: 0
        })
       
      }
    }
    if (this.data.select.indexOf(true) != -1) {
     
      this.setData({
        background: false
      })
    }
    else {
      
      this.setData({
        background: true
      })
    }
  },
  // 勾选商品
  select: function (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    var localselect = 'select' + '[' + index + ']';
    var updetail = 'updetails' + '[' + index + ']';
    if (this.data.select[index] != true) {
      this.setData({
        [updetail]: this.data.haha[index],
        [localselect]: true,
        heji: +(this.data.heji + this.data.haha[index].foodPrice * this.data.haha[index].num).toFixed(2)
      })
    }
    else {
      this.setData({
        [updetail]: 0,
        [localselect]: false,
        heji: +(this.data.heji - this.data.haha[index].foodPrice * this.data.haha[index].num).toFixed(2)
      })
    }
  
    if (this.data.select.indexOf(true) != -1) {
     
      this.setData({
        background: false
      })
    }
    else {
   
      this.setData({
        background: true
      })
    }
    if (this.data.select.indexOf(false) === -1 && this.data.select.length === this.data.haha.length) {
     
      this.setData({
        isSelected: true
      })

    }
    else {
      this.setData({
        isSelected: false
      })
    }
  },
  checkboxChange: function (e) {
    
    this.setData({
      checked: this.data.checked ? false : 'ture'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
    }
    var shuju = getApp().globalData.cart
    for (var i = 0; i < shuju.length; i ++) {
      if (!shuju[i].canshu1) {
        shuju[i]['canshu1'] = '无'
      }
      if (!shuju[i].canshu2) {
        shuju[i]['canshu2'] = '无'
      }
      
    }
    var that = this;
    that.setData({
      // haha: getApp().globalData.cart,
      haha: wx.getStorageSync('shopCar')
    })
   
    if (this.data.haha[0] != undefined) {
      this.setData({
        isempty: true,
        clear: false,
        background: true
      })

    }
    else {
      this.setData({
        clear: true,
        background: true
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
// 结算
  jiesuan: function (e) {
    console.log(this.data.updetails)
    // wx.showModal({
    //   title: '升级提示',
    //   content: '购物车版本升级中，将在下个版本与您见面，请亲前往详情页面直接购买',
    // })
    // return;
    if (this.data.background) {
      return;
    }
    else {
      var that = this;
      wx.chooseAddress({
        success: function (res) {
          that.setData({
            userName: res.userName,
            postalCode: res.postalCode,
            provinceName: res.provinceName,
            cityName: res.cityName,
            countyName: res.countyName,
            detailInfo: res.detailInfo,
            nationalCode: res.nationalCode,
            telNumber: res.telNumber
          })
          console.log()
          var val = wx.getStorageSync("openid")
          if (+that.data.qianbao >= +that.data.heji) {
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
                      heji: that.data.heji,
                      userName: that.data.userName,
                      address: that.data.provinceName + that.data.cityName + that.data.countyName + that.data.detailInfo,
                      telNumber: that.data.telNumber,
                      shopping: JSON.stringify(that.data.updetails),
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
                      console.log(that.data.qianbao, that.data.heji)
                      // 钱包支付
                      if (+that.data.qianbao >= +that.data.heji) {
                        console.log('钱包支付')

                        if (res.data === '支付成功') {
                          wx.showToast({
                            title: '支付成功',
                          })
                          wx.switchTab({
                            url: '/pages/market/market',
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
                          console.log("支付成功！")
                          //成功回调
                          wx.showToast({
                            title: '已提交！',
                          })
                          wx.switchTab({
                            url: '/pages/home/home',
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
                    icon: 'none'
                  })
                }
              }
            })
          }

          else {
            console.log('微信支付')
            var url = port + '/MiniLife/api/goodsWxPay';

            wx.request({
              url: url,
              data: {
              openid: val,
              heji:that.data.heji,
              userName: res.userName,
              address: that.data.provinceName + that.data.cityName + that.data.countyName + that.data.detailInfo,
              telNumber: res.telNumber,
              shopping: JSON.stringify(that.data.updetails),
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
                console.log(that.data.qianbao, that.data.heji)
                // 钱包支付
                if (+that.data.qianbao >= +that.data.heji) {
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
                      }
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
                    console.log("支付成功！")
                    //成功回调
                    wx.showToast({
                      title: '已提交！',
                    })
                    wx.switchTab({
                      url: '/pages/market/market',
                      success:function(res) {
                          wx.showToast({
                            title: '购买成功',
                          })
                      }
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

          // ===================================
          // wx.request({
          //   url: 'https://www.imxsh.cn/MiniLife/api/goodsWxPay',
          //   data: {
          //     openid: val,
          //     heji:ss.data.heji,
          //     userName: res.userName,
          //     address: res.provinceName + res.cityName + res.countyName+res.detailInfo,
          //     telNumber: res.telNumber,
          //     shopping: JSON.stringify(ss.data.updetails)
          //   },
          //   method: "GET",
          //   success: function (res) {
             
          //     ss.setData({
          //       appId: res.data.appId,
          //       timeStamp: res.data.timeStamp,
          //       nonceStr: res.data.nonceStr,
          //       packages: res.data.package,
          //       signType: res.data.signType,
          //       paySign: res.data.paySign
          //     })

          //     wx.requestPayment({
          //       "timeStamp": ss.data.timeStamp,
          //       "nonceStr": ss.data.nonceStr,
          //       "package": ss.data.packages,
          //       "signType": 'MD5',
          //       "paySign": ss.data.paySign,
          //       success: function (res) {
                 
          //         //成功回调
          //         wx.showToast({
          //           title: '已提交！',
          //         })
          //         wx.switchTab({
          //           url: '/pages/home/home',
          //         })
          //       },
          //       'fail': function (res) {
                 
          //       },
          //       'complete': function (res) {
                 
          //       }
          //     })
          //   }
          // })
        }
      });
    }
  },

})