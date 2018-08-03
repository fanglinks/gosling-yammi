// pages/menwear-detail/deetail.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,

    isCollect:false,
    index: 0,
    shishi: [],
    // goodsinfo: {
    //   goodsname:'HLA/海澜之家花纱款舒适短袖T恤',
    //   goodsPrice: 68.80,
    //   num:1
    // },
    isCollect: false,
    canshu1Boolean: [],
    canshu2Boolean: [],
    // 选择数量
    num:1
  },

  // 减数量
  jian: function() {
    var goodsinfo = this.data.details;
    if(this.data.num>1) {
      this.data.num -= 1
      this.setData({
        num:this.data.num,
      })
    }
    goodsinfo['num'] = this.data.num
  },

  // 加数量
  jia: function () {
    var goodsinfo = this.data.details;
    if (this.data.details.foodStock === goodsinfo.num) {
      wx.showToast({
        title: '没库存了亲!',
        icon: 'none'
      })
    } 
    else {
      if (this.data.num < 999) {
        this.data.num += 1
        this.setData({
          num: this.data.num
        })
      }
      goodsinfo['num'] = this.data.num
    }
    
  },

  // 加入购物车

  enterok: function () {
    if (this.data.details.foodStock === 0) {
      wx.showToast({
        title: '没库存了亲!',
        icon: 'none'
      })
    }else{
      if ((!this.data.canshu1 || this.data.isSelectcanshu1) && (!this.data.canshu2 || this.data.isSelectcanshu2)) {
        wx.showToast({
          title: '添加成功',
        })
        // console.log(this.data.details)
        // var that = this;
        var gotoShopcar = this.data.details;
        // if (app.globalData.cart.length === 0) {
        //   app.globalData.cart = app.globalData.cart.concat(qu)
        // }
        // else if (app.globalData.cart[app.globalData.cart.length - 1].foodName === qu.foodName) {
        //   app.globalData.cart[app.globalData.cart.length - 1].num = qu.num;
        // }
        // else {
        //   app.globalData.cart = app.globalData.cart.concat(qu)
        // }
        // 使用缓存
        var shopCar = wx.getStorageSync('shopCar')
        if (shopCar.length === 0) {
        wx.setStorageSync('shopCar', shopCar.concat(gotoShopcar))
      }
        
        else if (shopCar[shopCar.length - 1].foodName === gotoShopcar.foodName) {
          shopCar[shopCar.length - 1].num = gotoShopcar.num;
          // console.log(shopCar)
          wx.setStorageSync('shopCar', shopCar)
        }
        else {
          wx.setStorageSync('shopCar', shopCar.concat(gotoShopcar))
        }
        
        // console.log(wx.getStorageSync('shopCar'))

      }
      else {
        wx.showToast({
          title: '您漏填了参数',
          icon: 'none'
        })
      }
    }
    
  },

  // 立即购买
  buy: function() {
    var that = this;
    if ((!this.data.canshu1 || this.data.isSelectcanshu1) && (!this.data.canshu2 || this.data.isSelectcanshu2)) {
      // console.log(that.data.details)
      // 因为=无法在小程序页面间传递，所以先转换
      var newdetail = JSON.stringify(that.data.details).replace(/=/g,'!LOCK')
      // console.log(newdetail)
      if (this.data.details.foodStock === 0) {
        wx.showToast({
          title: '没库存了亲!',
          icon: 'none'
        })
      }else {
        wx.navigateTo({
          url: '/pages/market/dingdan/dingdan?goodsinfo=' + newdetail,
        })
      }
      
    }
    else {
      wx.showToast({
        title: '您漏填了参数',
        icon: 'none'
      })
    }
  },

  // 商城商品详情页收藏功能

  isCollect: function(e) {
    if (!this.data.isCollect) {
      this.setData({
        isCollect:  true
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

    }
    else {
      this.setData({
        isCollect: false
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

  // 控制参数1
  canshu1: function (e) {
    var index = e.currentTarget.dataset.id;
    var goodsinfo = this.data.details
    
    // 存储选择的参数
    this.setData({
      isSelectcanshu1: this.data.canshu1[index],
    })

    // 把参数1存入goodsinfo对象中
    goodsinfo['canshu1'] = this.data.isSelectcanshu1
    // console.log(this.data.goodsinfo)
    // console.log('参数1存储了，是' +this.data.isSelectcanshu1)
    for (var i = 0; i < this.data.canshu1.length; i++) {
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
  

  canshu2: function(e) {
    var index = e.currentTarget.dataset.id;
    var goodsinfo = this.data.details
    // 存储选择的参数
    this.setData({
      isSelectcanshu2: this.data.canshu2[index],
    })
    // 把参数2存入goodsinfo对象中
    goodsinfo['canshu2'] = this.data.isSelectcanshu2
    // console.log('参数2存储了，是' + this.data.isSelectcanshu2)
    // console.log(JSON.stringify(this.data.details))
    // console.log(JSON.parse(JSON.stringify(this.data.details)))
    for (var i = 0; i < this.data.canshu2.length; i ++) {
      var canshu2Boolean = 'canshu2Boolean' + '[' + i +']';
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

  // 跳转到购物车
  gotocart: function() {
    wx.navigateTo({
      url: '/pages/shopping-cart/shopcar',
    })
  },

  // 推荐商品跳转详情页
  doDetail: function (e) {
    wx.navigateTo({
      url: '/pages/menwear-detail/deetail?goodsid=' + e.currentTarget.dataset.goodsid + '&yuanjia=' + e.currentTarget.dataset.yuanjia,
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
    if (options.gotohome) {
      this.setData({
        gotohome: options.gotohome
      })
    } 
   
    /**
     * 查询商品是否被收藏
     */
    var that=this;
    that.setData({
      foodids: options.goodsid
    })
    wx.showLoading({
      title: '加载中...',
      mask: 'true'
    })
    // 查询商品详细信息
    wx.request({
      url: port + '/MiniLife/getDetail',
      data: {
        'foodId': options.goodsid
      },
      success: resData => {
    
        this.getCollect(options.goodsid);
        wx.hideLoading();
        that.setData({
          loading:false
        })
        that.setData({
           'details': resData.data,
           });
       var history =  wx.getStorageSync('history').concat(that.data.details)
       wx.setStorageSync('history', history)
        // console.log(that.data.details)
        // foodType
        // 查询相关推荐
        wx.request({
          url: port + '/MiniLife/getGoodsByTypeII',
          data: {
            typesTwo: that.data.details.foodType
          },
          success: function (res) {
            // console.log(res.data)
            that.setData({
              commTypeS: res.data,
            })
          }
        })
          /**
          * 查询是否是会员
          */
        this.getIsVip();
        this.data.details['num'] = 1;
        
        if (resData.data.goodsSkuChicun.indexOf(',') > 0 ) {
          that.setData({
            canshu2: resData.data.goodsSkuChicun.split(','),
          });
        }
        else if (resData.data.goodsSkuChicun.indexOf('，') > 0 ) {
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
    });
    
    wx.request({
      url: port + '/MiniLife/selectGoodsImg',
      data: {
        goodsId: options.goodsid,
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
        goodsId: options.goodsid,
        status: "1",
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          detailImg2: res.data
        })
      }
    })

    // 查询原价
    this.setData({
      yuanjia: options.yuanjia
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
    console.log(that.data.details.foodType)
    if (that.data.details.foodType === '99元专场') {
      var shareTitle = '【VIP专区】' + '【购买即可获得会员】' + that.data.details.foodName
    }
    else {
      var shareTitle = that.data.details.foodPrice + '元 ' +  that.data.details.foodName
    }
    
    if (res.from === 'button') {
      // 来自页面内转发按钮
    
    }
    return {
      title: shareTitle,
      path: '/pages/menwear-detail/deetail?id=' + wx.getStorageSync("openid") + "&goodsid=" + that.data.foodids + "&gotohome=" + true + '&yuanjia=' + that.data.yuanjia,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
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
        // console.log(resData.data == "")
        if (resData.data == "") {
          that.setData({
            isCollect :false
          })
        } else {
          that.setData({
            isCollect: true
          })
        }
      }

    })
  },

  getIsVip:function(){
    var that = this
    var val = wx.getStorageSync("openid")
    wx.request({
      url: port + '/MiniLife/user/getUserInfo',
      data: {
        openid: val,
      },
      success: function (res) {
        var types = res.data.userType
      
        if (types == "chuangke") {
          that.data.details.foodPrice = that.data.details.foodLowprice
          that.setData({
            userType: true,
            details: that.data.details,
          })
        } else if (types == "users") {
          that.setData({
            userType: false,
          })
        }
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
      url: '/pages/market/marketshop/shop?shopid=' + that.data.details.commercialid,
    })
  },
})