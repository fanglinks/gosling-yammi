// pages/market/marketshop/shop.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCollect:false,
    swiperImg: ['/img/marketshop/02.gif'],
    goodslist: [
      {
        img:'/img/marketshop/07.gif',
        goodsname:'新款女装',
        vipprice:99,
        price:100,
      },
      {
        img: '/img/marketshop/09.gif',        
        goodsname: '旧款女装',
        vipprice: 88,
        price: 90,
      },
    ],
    searchlist:[

    ]
  },

  // 搜索
  search: function(e) {
    var value = e.detail.value
    this.setData({
      searchlist:[],
      search: false,
    })
    console.log(this.data.goodslist[0].goodsname.indexOf(value))
    for(var i = 0; i < this.data.goodsInfo.length;i ++) {
      if (this.data.goodsInfo[i].foodName.indexOf(value) != -1) {
        this.data.searchlist.push(this.data.goodsInfo[i])
        this.setData({
          search:true,
          searchlist: this.data.searchlist
        })
      }
      }
      if(!this.data.search) {
        wx.showToast({
          title: '很抱歉，没有您搜索的商品',
          icon:'none'
        })
      }
    
  },
  //  收藏
  isCollect: function () {
    var that = this
    this.setData({
      isCollect: !this.data.isCollect
    })
    if (this.data.isCollect) {
      wx.showToast({
        title: '收藏中...',
        icon: 'loading',
      })
      var operate_type = 1
    }
    else {
      wx.showToast({
        title: '取消中...',
        icon: 'loading',
        mask: true
      })
      var operate_type = 2
    }
    console.log(operate_type)

    wx.request({
      url: port + '/MiniLife/collectionShop',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        collectOpenid: wx.getStorageSync('openid'),
        collectShopId: that.data.shopid,
        collectStatics: operate_type
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.shopid)
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
    }
    var that = this;
    if (options.shopid) {
      this.setData({
        shopid: options.shopid,

      })
    }
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    if (scene != 'undefined') {
      console.log('进来了这里')
      this.setData({
        shopid: scene
      })
      // 获取商户openid用于锁定
      console.log(that.data.shopid)
      wx.request({
        url: port + '/MiniLife/business/queryBusinessByShanghuId',
        data: {
          shanghuId: that.data.shopid
        },
        success: function (res) {
          console.log('这里传递了商户的openid', res.data.obj.openid)
          wx.setStorageSync('lock_openid', res.data.obj.openid)
          lock_user.lock_user()
        }
      })
    }
   
    wx.request({
      url: port + '/MiniLife/selectAllComm',
      success:function(res) {
        for(var i = 0; i < res.data.length; i ++) {
          if (res.data[i].shanghuid === that.data.shopid) {
            that.setData({
              shopinfo: res.data[i]

            }),
            wx.request({
              url: port + '/MiniLife/api/getGoods',
              data:{
                'Commercial': that.data.shopid
              },
              success:function(resdata){
                console.log(resdata.data)
                that.setData({
                  goodsInfo: resdata.data
                })
              }
            })
          }
        }
      }
    })

    if (wx.getStorageSync('openid')) {
      console.log('进入了查询店铺是否收藏', wx.getStorageSync('openid'), that.data.shopid)
      // 查询是否收藏店铺
      wx.request({
        url: port + '/MiniLife/isCollectionShop',
        data: {
          collectOpenid: wx.getStorageSync('openid'),
          collectShopId: that.data.shopid
        },
        success: function (res) {
          console.log(res.data.obj)
          if (res.data.obj == 1) {
            that.setData({
              isCollect: true
            })
          }
        }
      })
    }
  },

  gotohome: function() {
    wx.switchTab({
      url: '/pages/home/home',
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
  // onPullDownRefresh: function () {
  
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮")
      console.log(res.target)
    }
    return {

      title: that.data.shopinfo.name,
      path: '/pages/market/marketshop/shop?id=' + wx.getStorageSync("openid") + "&gotohome=" + true + "&shopid=" + that.data.shopid,
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
  doDetail: function (e) {
    wx.navigateTo({
      url: '/pages/menwear-detail/deetail?goodsid=' + e.currentTarget.dataset.goodsid + '&yuanjia=' + e.currentTarget.dataset.yuanjia ,
    })
  },
})