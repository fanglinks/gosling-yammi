// pages/home/home.js
var app = getApp();
var port = getApp().globalData.port;
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key: 'CYMBZ-TJ436-GW2S2-E3UHV-MN3RK-Y2FUA' // 必填
});
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */  
  data: {
    loading: true,
    // 每日推荐页数
    daily_specialpage:1,
    // 优质推荐页数
    NEW_page: 1,
    // 普通商品列表
    normal_goodspage:1,
    id: "",
    openid: "",
    imgUrls: ["https://xwq-object-1256294606.cos.ap-guangzhou.myqcloud.com/%E6%A2%A6%E6%83%B3%E7%94%9F%E6%B4%BB%E8%BD%AE%E6%92%AD%E5%9B%BE/7.png", 'https://xwq-object-1256294606.cos.ap-guangzhou.myqcloud.com/%E6%A2%A6%E6%83%B3%E7%94%9F%E6%B4%BB%E8%BD%AE%E6%92%AD%E5%9B%BE/6.jpg', 'https://xwq-object-1256294606.cos.ap-guangzhou.myqcloud.com/%E6%A2%A6%E6%83%B3%E7%94%9F%E6%B4%BB%E8%BD%AE%E6%92%AD%E5%9B%BE/5.jpg','https://xwq-object-1256294606.cos.ap-guangzhou.myqcloud.com/%E6%A2%A6%E6%83%B3%E7%94%9F%E6%B4%BB%E8%BD%AE%E6%92%AD%E5%9B%BE/10.jpg'],
    array: [
      {
        img: "/img/home/meishi.gif",
        text: "美食",
        shijian: 'meishi'
      },
      {
        img: "/img/home/jiudian.gif",
        text: "酒店",
        shijian: 'meishi'
      },


      {
        img: "/img/home/liren.gif",
        text: "丽人",
        shijian: 'meishi'
      },
  
      {
        img: "/img/home/yundong.gif",
        text: "健身",
        shijian: 'meishi'
      },
     
      {
        img: "/img/home/chaoshi.gif",
        text: "超市",
        shijian: 'meishi'
      },
      {
        img: "/img/home/meifa.gif",
        text: "美发",
        shijian: 'meishi'
      },

      {
        img: "/img/home/movie.gif",
        text: "电影",
        shijian: 'meishi'
      },
      {
        img: "/img/home/gengduo.gif",
        text: "服务",
        shijian: 'meishi'
      }
      ],
  },
// 进入酒店
  tohotel: function() {
    wx.navigateTo({
      url: '/pages/hotel/hotel',
      success: function(res) {
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 进入房产
  hourse: function() {
    wx.navigateTo({
      url: '/pages/hourse/hourse',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  showShareMenu() {
    wx.showShareMenu();
    console.log("显示了当前页面的转发按钮");
  },
  hideShareMenu() {
    wx.hideShareMenu();
    console.log("隐藏了当前页面的转发按钮");
  }, 
  meishi: function(event) {
    wx.navigateTo({
      url: '/pages/home-cate/cate?text=' + event.currentTarget.dataset.text,
    })
  },

  // 点击导航
  daohang: function (e) {
    var business = e.currentTarget.dataset.business;
    // var businessname = e.currentTarget.dataset.businessname
    // 商户名称
    var business_name = business.name
    // 商户坐标
    var business_latitude = +business.gps.slice(0, 9)
    var business_longitude = +business.gps.slice(9)
    // return;
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: business_latitude,
          longitude: business_longitude,
          name: business_name,
          scale: 28
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options) {
      var scene = decodeURIComponent(options.scene);
      if (options.id) {
        wx.setStorageSync('lock_openid', options.id)
        lock_user.lock_user()
      }
      else if (scene!='undefined') {
        wx.setStorageSync('lock_openid', scene)
        lock_user.lock_user()
      }
    }
    
    var that = this;
    // 获取用户当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.hideLoading()
        that.setData({
         location:false 
        })
        var latitude = res.latitude
        var longitude = res.longitude
        wx.setStorageSync('user_latitude', latitude)
        wx.setStorageSync('user_longitude', longitude)
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
        // return;
        demo.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            // 这里缓存了坐标转换的城市名
            wx.setStorageSync('address_name', res.result.address_component)
            wx.setStorageSync('usergps', latitude + ' ' + longitude)
            // 这里发送请求给后台请求数据

            // 请求每日精选
            wx.request({
              url: port + '/MiniLife/queryNearbyGoods',
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              data: {
                source: 1,
                zuobiao: latitude + ' ' + longitude,
                address_component: JSON.stringify(wx.getStorageSync('address_name')) ,
                currPage: 1
              },
              success:function(res) {
                that.setData({
                  daily_special:res.data.obj
                })
              }
            })
            // 获取优质推荐
            wx.request({
              url: port + '/MiniLife/queryNearbyGoods',
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              data: {
                source: 2,
                zuobiao: latitude + ' ' + longitude,
                address_component: JSON.stringify(wx.getStorageSync('address_name')),
                currPage: 1
              },
              success:function(res) {
                that.setData({
                  NEW_goods: res.data.obj
                })
              }
            })

             that.getGoods();
          },
          fail: function (res) {
         
          },
          complete: function (res) {
            
          }
        });
      },
      fail:function(res) {
        that.setData({
          location:true
        })
      }
    
    })
    this.setData({
      loading:false
    })
    
    // 获取弹窗数据
    wx.request({
      url: port + "/MiniLife/text/messageSwer",
      data: {
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        res.data
        // wx.hideLoading()
        that.setData({
          tanchuang: res.data
        })
      }
    })

    
   
},

// 去定位
  get_location: function() {
    // wx.getLocation({
    //   success: function(res) {
    //     console.log(res)
    //   },
    // })
    console.log('打开授权页')
    wx.showLoading({
      title: '加载中',
    })
    this.onLoad()
  },

  onShareAppMessage: function (res) {
    return {
      title: '梦想生活',
      path: '/pages/home/home?id=' + wx.getStorageSync("openid"),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
   wx.switchTab({
     url: '../home/home',
     success: function (e) {
       var page = getCurrentPages().pop();
       if (page == undefined || page == null) return;
       page.onLoad();
     }
   }) 
   wx.stopPullDownRefresh()
  },

  

 

  //商品详情
  toDetail: function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  locaking:function(){
    var val = wx.getStorageSync("openid")
    var that = this;
    wx.request({
      url:  port + "/MiniLife/user/lockingUser",
    data: {
      openid:that.data.id,
      lockopenid: val,//拿到金额
    },
    method: 'GET',
    success: function (res) {

    }
     })
  },

  // 获取普通商品数据
  getGoods: function () {
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: 'true'
    // })
    var that = this;
    // 请求普通商品数据
    wx.request({
      url: port + '/MiniLife/queryNearbyGoods',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        source: 3,
        zuobiao: that.data.latitude + ' ' + that.data.longitude,
        address_component: JSON.stringify (wx.getStorageSync('address_name')),
        currPage: 1
      },
      success: function (res) {
        console.log(res.data)
        // if (!res.data.obj[0]) {
          wx.hideLoading()
          that.setData({
            normal_goods: res.data.obj
          })
        //   return;
        // }
        // else {
        //   that.data.normal_goods = that.data.normal_goods.concat(res.data.obj)
        //   this.setData({
        //     normal_goods: that.data.normal_goods
        //   })
        // }
      }

    })
    // wx.request({
    //   url: port + '/MiniLife/getLinex',
    //   success: resData => {
    //     wx.hideLoading()
    //     that.setData({ 'day_productions': resData.data });
    //     console.log(resData.data)
    //     // 计算距离方法
    //     function getDistance(lat1, lng1, lat2, lng2) {
    //       console.log('计算距离了')
    //       lat1 = lat1 || 0;
    //       lng1 = lng1 || 0;
    //       lat2 = lat2 || 0;
    //       lng2 = lng2 || 0;
    //       var rad1 = lat1 * Math.PI / 180.0;
    //       var rad2 = lat2 * Math.PI / 180.0;
    //       var a = rad1 - rad2;
    //       var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    //       var r = 6378137;
    //       return r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))
    //     }
    //     // 根据坐标循环计算距离
    //     for (var i = 0; i < that.data.day_productions.length; i++) {
    //       console.log(that.data.day_productions[i].gps)
    //       var shanghuLat = that.data.day_productions[i].gps.slice(0, 8)
    //       var shanghuLon = that.data.day_productions[i].gps.slice(-9)
    //       that.setData({
    //         shanghuLat: +shanghuLat,
    //         shanghuLon: +shanghuLon,
    //       })
    //       var day_productions = 'day_productions' + '[' + i + ']';
    //       var juli = +getDistance(that.data.latitude, that.data.longitude, +shanghuLat, +shanghuLon);
    //       if (juli > 1000) {
    //         that.data.day_productions[i]['juli'] = (juli / 1000).toFixed(1) + 'km';
    //         that.setData({
    //           [day_productions]: that.data.day_productions[i]
    //         })
    //       }
    //       else {
    //         that.data.day_productions[i]['juli'] = juli.toFixed(0) + 'm';
    //         that.setData({
    //           [day_productions]: that.data.day_productions[i]
    //         })
    //       }
    //     }
    //   }
    // })
  },
  // 跳转到店铺
  toDetail: function (e) {
    wx.navigateTo({
      url: '/pages/shopdetail/shopdetail?shopid=' + e.currentTarget.dataset.commercialid,
    })
  },

  // 每日精选加载更多
  day_loadmore: function() {
    console.log('每日精选加载更多了')
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    this.data.daily_specialpage += 1
    wx.request({
      url: port + '/MiniLife/queryNearbyGoods',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        source: 1 ,
        zuobiao: that.data.latitude + ' ' + that.data.longitude,
        address_component: JSON.stringify (wx.getStorageSync('address_name')),
        currPage: that.data.daily_specialpage
      },
      success: function(res) {
        wx.hideLoading()
        if(!res.data.obj[0]) {
          
          wx.showToast({
            title: '没有更多宝贝了',
            image: '/img/collect/warning.png'
          })
        }
        else {
          that.data.daily_special = that.data.daily_special.concat(res.data.obj)
          that.setData({
            daily_special: that.data.daily_special 
          })
        }
      }

    })
  },

  // 优质推荐加载更多
  NEW_event:function() {
    console.log('优质推荐加载更多了')
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    this.data.NEW_page += 1;
    wx.request({
    url: port + '/MiniLife/queryNearbyGoods',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    data: {
      source:2,
      zuobiao: that.data.latitude + ' ' + that.data.longitude,
      address_component: JSON.stringify(wx.getStorageSync('address_name')),
      currPage: that.data.NEW_page
    },
    success: function (res) {
      wx.hideLoading()
      if (!res.data.obj[0]) {
        
        wx.showToast({
          title: '没有更多宝贝了',
          image: '/img/collect/warning.png'
        })
        return;
      }
      else {
        that.data.NEW_goods = that.data.NEW_goods.concat(res.data.obj)
        that.setData({
          NEW_goods: that.data.NEW_goods
        })
      }
    }

  })
},

// 普通商品加载更多
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    console.log('上拉加载更多了')
    var that = this;
    that.data.normal_goodspage += 1;
    wx.request({
      url: port + '/MiniLife/queryNearbyGoods',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        source: 3,
        zuobiao: that.data.latitude + ' ' + that.data.longitude,
        address_component: JSON.stringify(wx.getStorageSync('address_name')),
        currPage: that.data.normal_goodspage
      },
      success: function (res) {
        wx.hideLoading()
        if (!res.data.obj[0]) {
          
          wx.showToast({
            title: '没有更多宝贝了',
            image: '/img/collect/warning.png'
          })
          return;
        }
        else {
          that.data.normal_goods = that.data.normal_goods.concat(res.data.obj)
          that.setData({
            normal_goods: that.data.normal_goods
          })
        }
      }

    })
  }
})