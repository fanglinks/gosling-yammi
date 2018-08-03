function weixinpay() {
  var that = this;
  wx.request({
    url: 'https://www.imxsh.cn/MiniLife/getDetail',
    data: {
      'foodId': that.data.details.foodId
    },
    success: resData => {
      that.setData({ 'goodsStu': resData.data });
      if (that.data.goodsStu.foodStock === 0) {
        wx.showToast({
          title: '没库存了亲!',
          icon: 'none'
        })
      } else if (that.data.goodsStu.foodStatic == 2) {
        wx.showModal({
          title: '提示',
          content: '该店铺休息了...无法下单哦',
          showCancel: false,
          success: function (resDatahui) {
          }
        })
      } else {
        wx.request({
          url: 'https://www.imxsh.cn/MiniLife/api/getFoodsById',
          data: {
            id: dels
          },
          method: "GET",
          success: function (res) {
            that.setData({
              foods: res.data
            })
            that.data.foods["num"] = "1"
            console.log(that.data.foods)
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
              url: 'https://www.imxsh.cn/MiniLife/api/goodsWxPay',
              data: {
                openid: val,
                heji: that.data.foods.foodPrice,
                userName: res.userName,
                address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                telNumber: res.telNumber,
                goodsid: that.data.details.foodid,
                shopping: "[" + JSON.stringify(that.data.foods) + "]"
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
        });
      }
    }
  });
console.log('这里是引入的')
}
module.exports.weixinpay = weixinpay;