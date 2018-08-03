// pages/search/search.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 初始综合搜索页数
    comprehensive_page:1,

    // 初始价格价格由低到高排序页数
    pricesort_page:1,

    // 初始价格价格由低到高排序页数
    pricereserve_page: 1,


    // 初始销量排序页数
    sales_page:1,

    // 默认价格由低到高排序
    price_sort:true,

    // 默认处于搜索状态
    isSearch: false,      

    comprehensive: true,
    // 使用模版的样式
    template: true,

    // 热搜数据
    hotSearch: [
      {
        text: ['居家日用', '餐饮用具', '厨房亨饪', '收纳必备', '清洁用具', '节庆用品/礼品']
      },
      {
        text: ['休闲零食', '茶酒冲饮', '油粮干货', '保健滋补']
      },
      {
        text: ['面部护理', '面膜', '彩妆香氛', '美发护理', '口红唇膏', '爽肤水乳', '护手霜', '身体护理', '美妆工具', '眼部护理', '纤体廋身', '隔离/BB', '男士护理', '洁面']
      },
      {
        text: ['童装', '童鞋', '儿童玩具', '婴幼早教', '奶粉用品', '孕妇专区', '萌宝搭潮', '宝贝成长', '宝宝用品', '宝宝饮食', '辣妈必备']
      },
      {
        text: ['手机', '3C数码配件', '数码相机', '电脑', '电脑配件', '智能数码设备', '生活电器', '大家电', '厨房电器', '个人护理', '影音电器', '办公设备']
      },
      {
        text: ['T恤', '女裤', '薄外套', '衬衫', '裙装', '休闲裤', '套装', '大码女装', '牛仔裤', '针织开衫']
      },
      {
        text: ['爆款', 'T恤', 'POLO衫', '套装', '衬衫', '休闲裤', '牛仔裤', '短裤', '夹克']
      },
      {
        text: ['女鞋', '男鞋', '靴子女', '运动休闲女鞋', '高跟鞋', '凉鞋拖鞋男', '时尚休闲男鞋', '商务正装男鞋', '女包', '男包', '钱包/卡包', '单/双肩包', '旅行箱包']
      }
    ]
    ,
    hotdata: ['女鞋', '男鞋', '靴子女', '运动休闲女鞋', '高跟鞋', '凉鞋拖鞋男', '时尚休闲男鞋', '商务正装男鞋', '女包', '男包', '钱包/卡包', '单/双肩包', '旅行箱包'],
    hotdatanum:0
  },

  // 搜索状态
  is_search: function() {
    this.setData({
      isSearch: false      
    })
  },

  // 点击搜索
  searchok: function(e) {
    var that = this;
    var value = e.detail.value
    this.setData({
      value: value
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    // console.log('这里是一个关键词' + e.detail.value)
    // return;
    // 获取商品数据
    wx.request({
      url: port + '/MiniLife/keywordSearch',
      data: {
        type:1,
        Pages: that.data.comprehensive_page,
        keyword: value
      },
      success: function (res) {
        wx.hideLoading()
        if(!res.data.obj[0]) {
          wx.showToast({
            title: '未找到相关宝贝',
            image:'/img/collect/warning.png'
          })
        }
        that.setData({
          haveornot: res.data.success,
          goods: res.data.obj
        })
      }
    })
    this.setData({
      isSearch: true
    })
  },

  // 点击历史/热搜 搜索时去搜索
  openlist: function(e) {
    var that = this;
    console.log(e.currentTarget.dataset.text)
    // var value = e.detail.value
    // this.setData({
    //   value: value
    // })
    this.setData({
      isSearch: true,
      // 获取用户点击的数据
      recodevalue: e.currentTarget.dataset.text,
      // 存进固定的value，方便查找数据
      value: e.currentTarget.dataset.text,
      // 这里显示的是综合排序
      price: false,
      comprehensive: true,
      sales: false
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    // console.log('这里是一个关键词' + e.detail.value)
    // return;
    // 获取商品数据
    wx.request({
      url: port + '/MiniLife/keywordSearch',
      data: {
        type: 1,
        Pages: that.data.comprehensive_page,
        keyword: that.data.value
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        if(!res.data.obj[0]) {
          
          wx.showToast({
            title: '未找到相关宝贝',
            image:'/img/collect/warning.png'
          })
        }
        that.setData({
          haveornot: res.data.success,
          goods: res.data.obj
        })
      }
    })
    
  },

  // 综合排序
  comprehensive: function() {
    var that = this;
    this.setData({
      price: false,
      comprehensive: true,
      sales: false
    })
  wx.showLoading({
    title: '加载中',
    mask:true
  })
    wx.request({
      url: port + '/MiniLife/keywordSearch',
      data: {
        type: 1,
        Pages: that.data.comprehensive_page,
        keyword: that.data.value
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          haveornot: res.data.success,
          goods: res.data.obj
        })
      }
    })
  },

  // 价格排序
  price: function() {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var that = this;
    console.log(this.data.price_sort, this.data.price)
    if (this.data.price_sort && !this.data.price || (!this.data.price_sort && this.data.price)) {
      console.log('进入了价格排序')
      this.setData({
        price_sort: true
      })

      // 获取商品数据
      wx.request({
        url: port + '/MiniLife/keywordSearch',
        data: {
          type:2,
          Pages: 1,
          keyword: that.data.value
        },
        success: function (res) {
          wx.hideLoading()
          that.setData({
            haveornot: res.data.success,
            goods: res.data.obj
          })
        }
      })
    }
    else if (this.data.price_sort && this.data.price){
      console.log('进入了价格倒序')
      this.setData({
        price_sort: false
      })
      // 获取商品数据
      wx.request({
        url: port + '/MiniLife/keywordSearch',
        data: {
          type:3,
          Pages: 1,
          keyword: that.data.value
        },
        success: function (res) {
          wx.hideLoading()
          that.setData({
            haveornot: res.data.success,
            goods: res.data.obj
          })
        }
      })
    }

    this.setData({
      price: true,
      comprehensive: false,
      sales: false
    })
  },

  // 销量排序

  sales: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    // 获取商品数据
    wx.request({
      url: port + '/MiniLife/keywordSearch',
      data: {
        type:4,
        Pages: 1,
        keyword: that.data.value
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          haveornot: res.data.success,
          goods: res.data.obj
        })
      }
    })
    this.setData({
      price: false,
      comprehensive: false,
      sales: true
    })
  },

  // 更换商品列表模版
  change_template: function() {
    if(this.data.template) {
      this.setData({
        template:false
      })
    }
    else {
      this.setData({
        template: true
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
    // 获取历史搜索
    if (wx.getStorageSync('searchRecode')[0])
    this.setData({
      recode: wx.getStorageSync('searchRecode').reverse()
    })
    
    
  },

  // 失去焦点时缓存作为搜索记录
  searchRecode: function(e) {
    var value = e.detail.value
    var searchRecode
    for (var i = 0; i < wx.getStorageSync('searchRecode').length; i ++) {
      if (value === wx.getStorageSync('searchRecode')[i]) {
        return;
      }
    }
    
    if(wx.getStorageSync('searchRecode')[0]&&value!='') {
      var searchRecode = wx.getStorageSync('searchRecode').concat(value)
      wx.setStorageSync('searchRecode', searchRecode)
    }
    else if (value != ''){
      wx.setStorageSync('searchRecode',[])
      searchRecode = wx.getStorageSync('searchRecode').concat(value)
      wx.setStorageSync('searchRecode', searchRecode)
    }
    console.log(wx.getStorageSync('searchRecode'))
  },

  // 返回
  back: function() {
    if(this.data.goods) {
      this.setData({
        isSearch: true
      })
    }
    else {
      wx.navigateBack({
        delta: 1,
      })
    }
   
  } ,

  // 删除记录
  removeRecode: function() {
    wx.setStorageSync('searchRecode',[])
   this.setData({
     recode:[]
   })
    wx.showToast({
      title: '删除成功',
    })
  } ,
  // 换一批热搜数据
  nextdata: function() {
    this.data.hotdatanum += 1;
    console.log(this.data.hotdatanum,this.data.hotSearch.length)
    if (this.data.hotdatanum === this.data.hotSearch.length) {
      this.data.hotdatanum = 0;
    }
    this.setData({
      hotdata: this.data.hotSearch[this.data.hotdatanum].text
    })
  },

  // 跳转详情页
  doDetail: function (e) {
    wx.navigateTo({
      url: '/pages/menwear-detail/deetail?goodsid=' + e.currentTarget.dataset.goodsid + '&yuanjia=' + e.currentTarget.dataset.yuanjia,
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
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    // 获取商品数据
    if (that.data.comprehensive) {
      console.log(that.data.comprehensive_page)
      that.data.comprehensive_page += 1;
      console.log(that.data.comprehensive_page)
      wx.request({
        url: port + '/MiniLife/keywordSearch',
        data: {
          type:1,
          Pages: that.data.comprehensive_page,
          keyword: that.data.value
        },
        success: function (res) {
          console.log(res.data.obj)
          if (!res.data.obj[0]) {
            wx.hideLoading()
            wx.showToast({
              title: '没有更多商品了',
              icon: 'none'
            })
            return;
          }
          wx.hideLoading()
          that.data.goods = that.data.goods.concat(res.data.obj)
          that.setData({
            // haveornot: res.data.success,
            goods: that.data.goods
          })
        }
      })
    }

    else {
      if (that.data.price && that.data.price_sort) {
        var type = 2;
        var pages = that.data.pricesort_page + 1;
      }
      else if (that.data.price && !that.data.price_sort) {
        var type = 3;
        var pages = that.data.pricereserve_page + 1;        
      }
      else if (that.data.sales) {
        var type = 4;
        var pages = that.data.sales_page + 1;        
        
      }
      console.log(type,pages)
      // 请求数据
      wx.request({
        url: port + '/MiniLife/keywordSearch',
        data: {
          type: type,
          Pages: pages,
          keyword: that.data.value
        },
        success: function (res) {
          if (!res.data.obj[0]) {
            wx.showToast({
              title: '没有更多商品了',
              icon: 'none'
            })
            return;
          }
          that.data.goods = that.data.goods.concat(res.data.obj)
          that.setData({
            // haveornot: res.data.success,
            goods: that.data.goods
          })
        }
      })
    }

    // else if(that.data.price) {
    //   wx.request({
    //     url: port + '/MiniLife/keywordSearch',
    //     data: {
    //       Pages: that.data.comprehensive_page,
    //       keyword: value
    //     },
    //     success: function (res) {
    //       if (res.data.obj[0]) {
    //         wx.showToast({
    //           title: '没有更多商品了',
    //           icon: 'none'
    //         })
    //         return;
    //       }
    //       that.setData({
    //         // haveornot: res.data.success,
    //         goods: res.data.obj
    //       })
    //     }
    //   })
    // }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '查找宝贝',
      path: '/pages/search/search'
    }
  }
})