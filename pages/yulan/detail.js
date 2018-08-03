// pages/menwear-detail/deetail.js
var app = getApp();
var port = getApp().globalData.port
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

    loading:true,
    isCollect: false,
    canshu1Boolean: [],
    canshu2Boolean: [],
    // 选择数量
    num: 1,
    currPage:1,
  },
  // 参与更多拼团
  morepingtuan: function(e) {
    var that = this;
    wx.navigateTo({
      
      url: '/pages/cantuanlist/cantuanlist?pintuanId=' + e.currentTarget.dataset.pintuanid + '&tnumb=' +e.currentTarget.dataset.tnumb + '&data='+ JSON.stringify(that.data),
    })
  },

  // 减数量
  jian: function () {
    var goodsinfo = this.data.details;
    if (this.data.num > 1) {
      this.data.num -= 1
      this.setData({
        num: this.data.num,
      })
    }
    goodsinfo['num'] = this.data.num
  },

  // 加数量
  jia: function () {
    var goodsinfo = this.data.goodsPintuan;
    goodsinfo['num'] = this.data.num
    if (goodsinfo.pintuanInventory === goodsinfo.num || goodsinfo.pintuanInventory < goodsinfo.num) {
      wx.showToast({
        title: '没库存了亲!',
        icon: 'none'
      })
    }
    else {
      if (goodsinfo.pintuanPurchasing > goodsinfo.num ) {
        if (this.data.num < 999) {
          this.data.num += 1
          this.setData({
            num: this.data.num
          })
        }
        goodsinfo['num'] = this.data.num
      }
      else {
        wx.showToast({
          title: '每人限购' + goodsinfo.pintuanPurchasing+"件",
          icon:'none'
        })
      }
    }
  },

  // 参与团
  canyu: function(e) {
    var index = e.currentTarget.dataset.id;
    var tuanzhang = this.data.tuanzhangList[index];
    var goodsPintuan = this.data.goodsPintuan;
    console.log(goodsPintuan)
    var that = this;
    if ((!this.data.canshu1 || this.data.isSelectcanshu1) && (!this.data.canshu2 || this.data.isSelectcanshu2)) {
      if (this.data.goodsPintuan.foodStock === 0) {
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

  // 立即开团
  buy: function () {
    var goodsPintuan = this.data.goodsPintuan;
    console.log(goodsPintuan)
    var that = this;
    if ((!this.data.canshu1 || this.data.isSelectcanshu1) && (!this.data.canshu2 || this.data.isSelectcanshu2)) {
      if (this.data.goodsPintuan.pintuanInventory === 0) {
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
            }  else {
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
                    url: port + '/MiniLife/spellWxPay',
                    data: {
                      openid: val,
                      pintuanId: that.data.goodsPintuan.pintuanId,
                      heji: that.data.goodsPintuan.pintuanPrice,
                      userName: res.userName,
                      address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                      telNumber: res.telNumber,
                      goodsid: that.data.goodsPintuan.foodId,
                      shopping: "[" + JSON.stringify(that.data.foods) + "]",
                      canshu: goodsPintuan.canshu1+',' + goodsPintuan.canshu2,
                    },
                    method: "GET",
                    success: function (res) {
                      if (res.data.err ==="活动已经结束"){
                       wx.showToast({
                         title: '活动已结束啦',
                         icon:"none"
                       })
                      } else if (res.data.err === "请勿重复开团"){
                        wx.showToast({
                          title: '请勿重复开团',
                          icon: "none"
                        })
                      } else if(res.data.err === '无库存') {
                        wx.showToast({
                          title: '没库存了亲',
                          icon: "none"
                        })
                      }
                      else{
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
  // 控制参数1
  canshu1: function (e) {
    var index = e.currentTarget.dataset.id;
    var goodsinfo = this.data.goodsPintuan

    // 存储选择的参数
    this.setData({
      isSelectcanshu1: this.data.canshu1[index],
    })
    // 把参数1存入goodsinfo对象中
    goodsinfo['canshu1'] = this.data.isSelectcanshu1
    console.log('参数1存储了，是' + this.data.isSelectcanshu1)
    for (var i = 0; i < this.data.canshu2.length; i++) {
      var canshu1Boolean = 'canshu1Boolean' + '[' + i + ']';
      if (i === index) {
        this.setData({
          [canshu1Boolean]: true
        })
      }
      else {
        this.setData({
          [canshu1Boolean]: false
        })
      }
    }
  },

  // 控制参数2


  canshu2: function (e) {
    var index = e.currentTarget.dataset.id;
    var goodsinfo = this.data.goodsPintuan
    // 存储选择的参数
    this.setData({
      isSelectcanshu2: this.data.canshu2[index],
    })
    // 把参数2存入goodsinfo对象中
    goodsinfo['canshu2'] = this.data.isSelectcanshu2
    console.log('参数2存储了，是' + this.data.isSelectcanshu2)
    for (var i = 0; i < this.data.canshu2.length; i++) {
      var canshu2Boolean = 'canshu2Boolean' + '[' + i + ']';
      if (i === index) {
        this.setData({
          [canshu2Boolean]: true
        })
      }
      else {
        this.setData({
          [canshu2Boolean]: false
          
        })
      }
    }
  },

// 相关推荐加载更多
  loadmore: function() {
    var that = this;
    this.data.currPage += 1;
    this.setData({
      currPage:this.data.currPage,
    })

    // 查询相关推荐
    wx.request({
      url: port + '/MiniLife/queryGroupBuy',
      data: {
        type: that.data.goodsPintuan.foodType,
        currPage: that.data.currPage
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        if (res.data[0] != undefined) {
          that.data.commTypeS = that.data.commTypeS.concat(res.data)
          that.setData({
            commTypeS: that.data.commTypeS
          })
          wx.hideLoading();

          // wx.showToast({
          //   title: '加载成功',
          // })
        }
        else {
          wx.hideLoading();
          wx.showToast({
            title: '没有更多商品了',
            icon: 'none'
          })
        }
        // console.log(res.data)
        // that.setData({
        //   commTypeS: res.data,
        // })
      }
    })

  },

  // 进入团购详情页
  todetail: function (e) {
    wx.navigateTo({
      url: '/pages/yulan/detail?pintuanId=' + e.currentTarget.dataset.pintuanid,
    })
  }, 


  // 商城商品详情页收藏功能

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      thisId: options.pintuanId
    })
    var that=this;
   
// 根据拼团ID查询拼团详情
    wx.request({
      url: port + '/MiniLife/selectBySpeelId',
      data:{
        'pintuanId': options.pintuanId
      },
      success:function(resData){
        that.seletTuanZhang(options.pintuanId);
        that.setData({
          'goodsPintuan':resData.data,
          loading:false
          })
        wx.hideLoading()
        console.log(that.data.goodsPintuan)

        // 查询商品详细信息
        // wx.request({
        //   url: port + '/MiniLife/getDetail',
        //   data: {
        //     'foodId': that.data.goodsPintuan.foodId
        //   },
        //   success: resData => {
        //     console.log(resData.data.foodType)
        //     that.setData({
        //       tuijiantype: resData.data.foodType
        //     });
        //   }
        // })
        // 查询相关推荐
        wx.request({
          url: port + '/MiniLife/queryGroupBuy',
          data: {
            type: that.data.goodsPintuan.foodType,
            currPage: 1
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function (res) {
           
            console.log(res.data)
            that.setData({
              commTypeS: res.data,
            })
          }
        })

        // 这里已经获取到了结束事件，开始倒计时
        // 拼团时间戳倒计时
        var endTime = Date.parse(resData.data.pintuanTimeEnd)/1000
        console.log(endTime)
        var totalSecond = endTime - Date.parse(new Date()) / 1000;

        var interval = setInterval(function () {
          // 秒数  
          var second = totalSecond;

          // 天数位  
          var day = Math.floor(second / 3600 / 24);
          var dayStr = day.toString();
          if (dayStr.length == 1) dayStr =   dayStr;

          // 小时位  
          var hr = Math.floor((second - day * 3600 * 24) / 3600);
          var hrStr = hr.toString();
          if (hrStr.length == 1) hrStr = '0' + hrStr;

          // 分钟位  
          var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
          var minStr = min.toString();
          if (minStr.length == 1) minStr = '0' + minStr;

          // 秒位  
          var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
          var secStr = sec.toString();
          if (secStr.length == 1) secStr = '0' + secStr;

          that.setData({
            countDownDay: dayStr,
            countDownHour: hrStr,
            countDownMinute: minStr,
            countDownSecond: secStr,
          });
          totalSecond--;
          if (totalSecond < 0) {
            clearInterval(interval);
            wx.showToast({
              title: '活动已结束',
            });
            that.setData({
              countDownDay: '00',
              countDownHour: '00',
              countDownMinute: '00',
              countDownSecond: '00',
            });
          }
        }, 1000);


        wx.request({
          url: port + '/MiniLife/selectGoodsImg',
          data: {
            goodsId: that.data.goodsPintuan.foodId,
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
            goodsId: that.data.goodsPintuan.foodId,
            status: "1",
          },
          method: 'GET',
          success: function (res) {
            that.setData({
              detailImg2: res.data
            })
          }
        })

        if (resData.data.goodsSkuChicun.indexOf(',') > 0) {
          that.setData({
            canshu2: resData.data.goodsSkuChicun.split(','),
          });
        }
        else if (resData.data.goodsSkuChicun.indexOf('，') > 0) {
          that.setData({
            canshu2: resData.data.goodsSkuChicun.split('，'),
          });
        }
        if (resData.data.goodsSkuColor.indexOf('，') > 0) {
          that.setData({
            canshu1: resData.data.goodsSkuColor.split('，'),
          });
        }
        else if (resData.data.goodsSkuColor.indexOf(',') > 0) {
          
          that.setData({
            canshu1: resData.data.goodsSkuColor.split(','),
          });
        }
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title: '【拼团商品】' + that.data.goodsPintuan.pintuanPrice + '元  '+that.data.goodsPintuan.foodName,
      path: '/pages/yulan/detail?id=' + wx.getStorageSync("openid") + "&pintuanId=" + that.data.goodsPintuan.pintuanId + "&gotohome=" + true,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //直接购买
  enterok:function(){
    var goodsPintuan = this.data.goodsPintuan;
    var that = this;
    if ((!this.data.canshu1 || this.data.isSelectcanshu1) && (!this.data.canshu2 || this.data.isSelectcanshu2)) {
      if (this.data.goodsPintuan.foodStock === 0) {
        wx.showToast({
          title: '没库存了亲!',
          icon: 'none',
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
                    url: port + '/MiniLife/api/goodsWxPay',
                    data: {
                      openid: val,
                      heji: that.data.foods.foodPrice,
                      userName: res.userName,
                      address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                      telNumber: res.telNumber,
                      goodsid: that.data.goodsPintuan.foodId,
                      shopping: "[" + JSON.stringify(that.data.foods) + "]",
                      canshu: goodsPintuan.canshu1 + ',' + goodsPintuan.canshu2,
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
                        }
                      })
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
  seletTuanZhang: function (pintuanId){
        var that=this;
        console.log(pintuanId)
        wx.request({
          url: port + '/MiniLife/selectTuanZhang',
          data:{
            'pinTuanId': pintuanId
          },
          success:function(resData){
            console.log(resData);
            that.setData({'tuanzhangList':resData.data})
          }
        })
  },
  gotohome: function () {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  gotoshop: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/market/marketshop/shop?shopid=' + that.data.goodsPintuan.pintuanShanghuid,
    })
  },

})

