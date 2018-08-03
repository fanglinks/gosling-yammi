// pages/detail/detail.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    shishi: [],
    heji: 0,
    foods:[],
    storeinfo: {
      num: 1,
      storename: '奶茶店',
      price: 79,
      goodsname: ''
    },
    shoucang: '/img/img-detail/no_collection.gif',
    select: true,

    changepage: {
      first: false,
      second: true,
      third: true
    },
    imgUrls: ["/img/img-detail/8.gif", "/img/img-detail/12.gif", "/img/img-detail/15.gif"]
  },
  onShareAppMessage: function (res) {
   this.setData({
     gotohome:false
   })
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮\
    }
    return {
      
      title: that.data.details.foodName,
      path: '/pages/detail/detail?id=' + wx.getStorageSync("openid") + "&foodid=" + that.data.foodids + "&gotohome=" + true,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败")
      }
    }
  },

  entercart: function () {
    var qu = this.data.storeinfo;
    wx.navigateTo({
      url: '/pages/shopping-cart/shopcar',
    })
  },

  //添加删除收藏
  shoucang: function (e) {
    if (this.data.shoucang === '/img/img-detail/no_collection.gif') {//执行添加
      this.setData({
        shoucang: '/img/img-detail/collect.gif'
      })
      wx.showToast({
        title: '收藏中...',
        icon: 'loading',
      })
      wx.request({
        url: port + '/MiniLife/addColl',
        method: 'GET',
        data: {
          'collectOpenid': wx.getStorageSync("openid"),
          'collectFoodsname': e.currentTarget.dataset.foodname,
          'collectFoodsid': e.currentTarget.dataset.foodid,
          'collectImg': e.currentTarget.dataset.img,
          'collectRemarks': e.currentTarget.dataset.foodr,
          'collectPrice': e.currentTarget.dataset.foodprice
        },
        success: function (resData) {
          wx.showToast({
            title: resData.data,
            icon: 'success',
          })
        }
      })
    } else {
      this.setData({
        shoucang: '/img/img-detail/no_collection.gif'//删除收藏
      })
      wx.showToast({
        title: '取消中...',
        icon: 'loading',
      })
      wx.request({
        url: port + '/MiniLife/deleteColl',
        data: {
          'foodId': e.currentTarget.dataset.foodid,
        },
        success: function (resData) {
          wx.showToast({
            title: resData.data,
            icon: 'success',
          })
        }
      })
    }
  },
  // 加数量
  jianum: function () {
    
    if (this.data.details.foodStock === this.data.details.num) {
      wx.showToast({
        title: '库存不够了亲',
        icon: 'none',
      })
    }
    else {
      this.setData({
        'details.num': this.data.details.num + 1,
      })
      console.log(this.data.details.num)
      this.setData({
        heji: (this.data.details.num * this.data.details.foodPrice).toFixed(2)
      })
      
    }
    
    
  },
  // 减数量
  jiannum: function () {
   
    if (this.data.details.num > 1) {
      this.setData({
        'details.num': this.data.details.num - 1,
      })
      console.log(this.data.details.num)
      this.setData({
        heji: (this.data.details.num * this.data.details.foodPrice).toFixed(2)
      })
    }
  },
  // 唤起加入购物车
  openorder: function () {
    var that=this;
    wx.request({
      url: port + '/MiniLife/getDetail',
      data: {
        'foodId': that.data.details.foodId
      },
      success: resData => {
        that.setData({ 'goodsSta': resData.data});
        if (that.data.goodsSta.foodStock === 0) {
          wx.showToast({
            title: '没库存了亲!',
            icon: 'none'
          })
        } else if (that.data.goodsSta.foodStatic == 2) {
          wx.showModal({
            title: '提示',
            content: '该店铺休息了...无法下单哦',
            showCancel: false,
            success: function (resDatahui) {
            }
          })
        } else {
          that.setData({
            select: false,
            heji: that.data.details.foodPrice
          })
        }
      }
    })
      },

      // 真正加入购物车
      enterok: function () {

        wx.showToast({
          title: '添加成功',
        })
        // var that = this;
        var qu = this.data.details;
        var index = this.data.index;
        var shishi = 'shishi' + '[' + index + ']'
        this.setData({
          [shishi]: qu,
          index: this.data.index + 1
        })
        console.log(this.data.shishi)
        if (app.globalData.cart.length === 0) {
          app.globalData.cart = app.globalData.cart.concat(qu)
        }
        else if (app.globalData.cart[app.globalData.cart.length - 1].foodId === qu.foodId) {
          app.globalData.cart[app.globalData.cart.length - 1].num = qu.num;
        }
        else {
          app.globalData.cart = app.globalData.cart.concat(qu)
        }
      },

    // var jiequ = getApp().globalData.cart.slice(0, getApp().globalData.cart.length-1)

// 控制详情页展示
  xiangqing: function (event) {

    this.setData({
      changepage: {
        first: false,
        second: true,
        third: true
      },
      isChecked1: true,
      isChecked2: false,
      isChecked3: false
    })
  },
  // 控制评价页展示
  pingjia: function (event) {
    this.setData({
      changepage: {
        first: true,
        second: false,
        third: true
      },
      isChecked1: false,
      isChecked2: true,
      isChecked3: false
    })
  },

  // 控制须知页展示
  xuzhi: function (event) {
    this.setData({
      changepage: {
        first: true,
        second: true,
        third: false
      },
      isChecked1: false,
      isChecked2: false,
      isChecked3: true
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
    var that = this;
    if(options.gotohome)
    this.setData({
      gotohome: options.gotohome
    })
    connet()
    function connet() {
      wx.getNetworkType({
        success: function (res) {
          if (res.networkType != 'none') {
            that.getCollect(options.foodid);
            //商品详情

            that.setData({
              foodids: options.foodid
            })
            wx.request({
              url: port + '/MiniLife/getDetail',
              data: {
                'foodId': options.foodid
              },
              success: resData => {
              
               
                that.setData({ 'details': resData.data, 'details.num': 1, 'details.canshu1': '无', 'details.canshu2': '无', });
                console.log(that.data.details)
              }
            });

            wx.request({
              url: port + '/MiniLife/selectGoodsImg',
              data: {
                goodsId: options.foodid,
                status: "2",
              },
              method: 'GET',
              success: function (res) {
                that.setData({
                  detailImg: res.data
                })
              }
            })

            wx.request({
              url: port + '/MiniLife/selectGoodsImg',
              data: {
                goodsId: options.foodid,
                status: "1",
              },
              method: 'GET',
              success: function (res) {
                that.setData({
                  detailImg2: res.data
                })
              }
            })

          } else {
            wx.showModal({
              title: '当前网络不可用，请检查网络设置',
              confirmText: '重试',
              success: function (res) {
                if (res.confirm) {
                  connet()
                } else if (res.cancel) {
                }
              }
            })
          }
        }

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
    console.log('刷新了')
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  getGoodsById: function (options) {
    var that = this;
    wx.request({
      url: port + '/MiniLife/getGoodsDetail',
      data: {
        'foodId': options.foodid
      },
      success: resData => {
        that.setData({ 'detail': resData.data });

        wx.hideLoading();
      }
    })
  },
  getCollect: function (id) {

    var that = this;
    wx.request({
      url: port + '/MiniLife/getColl',
      data: {
        'openId': wx.getStorageSync("openid"),
        'foodId': id
      },
      success: function (resData) {
        if (resData.data == "") {
          that.setData({
            shoucang: '/img/img-detail/no_collection.gif'
          })
        } else {
          that.setData({
            shoucang: '/img/img-detail/collect.gif'
          })
        }
      }

    })
  },
  //立即购买商品
  bayNow:function(e){
    var that = this
   
     
    var dels = that.data.details.id
    console.log(that.data.details)
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
          if (+that.data.qianbao >= +that.data.details.foodPrice) {
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
                      heji: that.data.details.foodPrice,
                      shopping: "[" + JSON.stringify(that.data.details) + "]"
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
                      console.log(that.data.qianbao, that.data.details.foodPrice)
                      // 钱包支付
                      if (+that.data.qianbao >= +that.data.details.foodPrice) {
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
          // 微信支付
          else {
            console.log('微信支付')
            var url = port + '/MiniLife/api/goodsWxPay';

            wx.request({
              url: url,
              data: {
                openid: val,
                heji: that.data.details.foodPrice,
                shopping: "[" + JSON.stringify(that.data.details) + "]"
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
                console.log(that.data.qianbao, that.data.details.foodPrice)
                // 钱包支付
                if (+that.data.qianbao >= +that.data.details.foodPrice) {
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
          }
          console.log(that.data.foods)


        }
      })
  },
  gotohome: function () {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
})