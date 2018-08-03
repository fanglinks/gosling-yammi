// pages/cantuanlist/cantuanlist.js
var app = getApp();
var port = getApp().globalData.port
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
// 参团
  canyu: function (e) {
    var index = e.currentTarget.dataset.id;
    var tuanzhang = this.data.tuanzhangList[index];
    var goodsPintuan = this.data.data.goodsPintuan;
    console.log(goodsPintuan)
    var that = this;
    if ((!this.data.data.canshu1 || this.data.data.isSelectcanshu1) && (!this.data.data.canshu2 || this.data.data.isSelectcanshu2)) {
      if (this.data.data.goodsPintuan.foodStock === 0) {
        wx.showToast({
          title: '没库存了亲!',
          icon: 'none'
        })
      } else {
        wx.request({
          url: port + '/MiniLife/getDetail',
          data: {
            'foodId': that.data.goodsPintuan.foodId
          },
          success: resData => {
            that.setData({ 'goodsStu': resData.data });
            if (that.data.goodsStu.pintuanInventory === 0) {
              wx.showToast({
                title: '没库存了亲!',
                icon: 'none'
              })
            } else {
              wx.request({
                url: port + '/MiniLife/api/getFoodsById',
                data: {
                  id: that.data.goodsStu.id
                },
                method: "GET",
                success: function (res) {
                  that.setData({
                    foods: res.data
                  })
                  that.data.foods["num"] = "1"
                }
              })
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
                  var val = wx.getStorageSync("openid")

                  wx.request({
                    url: port + '/MiniLife/participateWxPay  ',
                    data: {
                      tOpenid: tuanzhang.userOpenid,
                      copenid: val,
                      heji: goodsPintuan.pintuanPrice,
                      pintuanId: that.data.goodsPintuan.pintuanId,
                      userName: that.data.userName,
                      address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                      telNumber: res.telNumber,
                      shopping: "[" + JSON.stringify(that.data.foods) + "]",
                      canshu: goodsPintuan.canshu1 + ',' + goodsPintuan.canshu2,
                    },
                    method: "GET",
                    success: function (res) {
                      if (res.data.err === "活动已经结束") {
                        wx.showToast({
                          title: '活动已结束啦',
                          icon: "none"
                        })
                      } else if (res.data.err === "请勿重复参与") {
                        wx.showToast({
                          title: '请勿重复参与',
                          icon: "none"
                        })
                      }
                      else {
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
                            //成功回调
                            wx.showToast({
                              title: '已提交！',
                            })
                            wx.switchTab({

                              url: '/pages/market/market',
                            })
                          },
                          'fail': function (res) {
                            console.log(res)
                          },
                          'complete': function (res) {
                          }
                        })
                      }
                    }
                  })
                }
              });
            }
          }
        });
      }

    }
    else {
      wx.showToast({
        title: '您漏填了参数',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
      var that = this;
      wx.request({
        url:  port + '/MiniLife/selectTuanZhang',
        data: {
          'pinTuanId': options.pintuanId
        },
        success: function (resData) {
          console.log(resData);
          that.setData({ tuanzhangList: resData.data }),
            that.setData({ tuannumb: options.tnumb})
        }
      })
      console.log(JSON.parse(options.data))
      // this.setData({
      //   data:JSON.parse(options.data)
      // })
      // console.log(this.data.data.goodsPintuan)
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
  onShareAppMessage: function () {
  
  }
})