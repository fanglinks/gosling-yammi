// pages/market/market.js
var app = getApp();
var port = getApp().globalData.port
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // red_packet:true,
    myad: ['https://xwq-object-1256294606.cos.ap-guangzhou.myqcloud.com/%E6%A2%A6%E6%83%B3%E7%94%9F%E6%B4%BB%E8%BD%AE%E6%92%AD%E5%9B%BE/5.jpg'],
    // 每日推荐分页
    tuijian_page:1,

    // 正在加载
    loading: true,
    marketPage: 1,
    // 拼团页面值
    pintuanList: [],
    miaoshaList: [],
    PTcurrentPage: 1,
    MScurrPage: 1,
    imgUrls: ["/img/market/2.gif"],
    imgUrls2: ["/img/market/67.gif"],
    erjiye: [
      {
        leibie: ['居家日用', '餐饮用具', '厨房亨饪', '收纳必备', '清洁用具', '节庆用品/礼品']
      },
      {
        leibie: ['休闲零食', '茶酒冲饮', '油粮干货', '保健滋补']
      },
      {
        leibie: ['面部护理', '面膜', '彩妆香氛', '美发护理', '口红唇膏', '爽肤水乳', '护手霜', '身体护理', '美妆工具', '眼部护理', '纤体廋身', '隔离/BB', '男士护理', '洁面']
      },
      {
        leibie: ['童装', '童鞋', '儿童玩具', '婴幼早教', '奶粉用品', '孕妇专区', '萌宝搭潮', '宝贝成长', '宝宝用品', '宝宝饮食', '辣妈必备']
      },
      {
        leibie: ['手机', '3C数码配件', '数码相机', '电脑', '电脑配件', '智能数码设备', '生活电器', '大家电', '厨房电器', '个人护理', '影音电器', '办公设备']
      },
      {
        leibie: ['T恤', '女裤', '薄外套', '衬衫', '裙装', '休闲裤', '套装', '大码女装', '牛仔裤', '针织开衫']
      },
      {
        leibie: ['爆款', 'T恤', 'POLO衫', '套装', '衬衫', '休闲裤', '牛仔裤', '短裤', '夹克']
      },
      {
        leibie: ['女鞋', '男鞋', '靴子女', '运动休闲女鞋', '高跟鞋', '凉鞋拖鞋男', '时尚休闲男鞋', '商务正装男鞋', '女包', '男包', '钱包/卡包', '单/双肩包', '旅行箱包']
      },
      // {
      //   leibie: ['女手提包', '女斜挎包', '女双肩包', '男女配饰', '男公关包', '男斜跨包', '男双肩包', '拉杆箱']
      // },
    ],
    photos: [
      {
        img: "/img/market/baihuo.png",
        text: "日用百货",
        leibie: ['居家日用', '餐饮用具', '厨房亨饪', '收纳必备', '清洁用具', '节庆用品/礼品']
      },
      {
        img: "/img/market/shiping.png",
        text: "食品果蔬",
        leibie: ['休闲零食', '茶酒冲饮', '油粮干货', '保健滋补']
      },
      {
        img: "/img/market/hufu.png",
        text: "护肤彩妆",
        leibie: ['面部护理', '面膜', '彩妆香氛', '美发护理', '口红唇膏', '爽肤水乳', '护手霜', '身体护理', '美妆工具', '眼部护理', '纤体廋身', '隔离/BB', '男士护理', '洁面']
      },
      {
        img: "/img/market/muying.png",
        text: "母婴用品",
        leibie: ['童装', '童鞋', '儿童玩具', '婴幼早教', '奶粉用品', '孕妇专区', '萌宝搭潮', '宝贝成长', '宝宝用品', '宝宝饮食', '辣妈必备']
      },
      {
        img: "/img/market/3c.png",
        text: "数码家电",
        leibie: ['手机', '3C数码配件', '数码相机', '电脑', '电脑配件', '智能数码设备', '生活电器', '大家电', '厨房电器', '个人护理', '影音电器', '办公设备']
      },
      {
        img: "/img/market/nvzhuang.png",
        text: "品牌女装",
        leibie: ['T恤', '女裤', '薄外套', '衬衫', '裙装', '休闲裤', '套装', '大码女装', '牛仔裤', '针织开衫']
      },
      {
        img: "/img/market/nanzhuang.png",
        text: "品牌男装",
        leibie: ['爆款', 'T恤', 'POLO衫', '套装', '衬衫', '休闲裤', '牛仔裤', '短裤', '夹克']
      },
      {
        img: "/img/market/xiebao.png",
        text: "鞋包饰品",
        leibie: ['女鞋', '男鞋', '靴子女', '运动休闲女鞋', '高跟鞋', '凉鞋拖鞋男', '时尚休闲男鞋', '商务正装男鞋', '女包', '男包', '钱包/卡包', '单/双肩包', '旅行箱包']
      },
      // {
      //   img: "/img/market/28.gif",
      //   text: "箱包",
      //   shijian: "menwear"
      // },
      // {
      //   img: "/img/market/27.gif",
      //   text: "拼团",
      //   shijian: "pingtuan"
      // },
    ],

  },

  // 拼团加载更多
  lower: function () {
    wx.showLoading({
      title: '加载中...',
    })
    this.data.PTcurrentPage += 1;
    this.setData({
      PTcurrentPage: this.data.PTcurrentPage
    })
    this.selectAllPintuan()
  },

  // 秒杀加载更多
  miaoshalower: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    this.data.MScurrPage += 1;
    this.setData({
      MScurrPage: this.data.MScurrPage
    })
    // 请求秒杀数据
    wx.request({
      url: port + '/MiniLife/selectSnipAll',
      data: {
        currPage: that.data.MScurrPage
      },
      method: 'GET',
      success: function (res) {

        if (res.data[0] != undefined) {
          that.data.miaoshaList = that.data.miaoshaList.concat(res.data)
          that.setData({
            miaoshaList: that.data.miaoshaList
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

        // that.setData({
        //   miaoshaList:res.data
        // })
        // console.log(that.data.miaoshaList)
      }
    })
  },
  // 进入分类页
  menwear: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    console.log(item.leibie)
    wx.navigateTo({
      // 这里面携带了二级页数据以及类型参数
      url: '/pages/men-wear/menwear?types=' + JSON.stringify(item),
    })
  },

  // 拼团
  pingtuan: function (event) {
    wx.navigateTo({
      url: '/pages/pingtuan/pingtuan',
    })
  },

  // 进入秒杀详情页
  todetailMiaosha: function (e) {

    var index = e.currentTarget.dataset.id;
    var that = this;
    wx.navigateTo({
      url: '/pages/miaosha/detail?detail=' + JSON.stringify(that.data.miaoshaList[index]) + '&goodsid=' + e.currentTarget.dataset.goodsid + '&yuanjia=' + e.currentTarget.dataset.yuanjia,
    })
  },

  // 专场
  zhuanchang: function () {
    wx.navigateTo({
      url: '/pages/zhuanchang/zhuanchang',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      if (options.id) {
        wx.setStorageSync('lock_openid', options.id)
        lock_user.lock_user()
      }
     
    }
    // 判断搜索记录是否存在
    if (wx.getStorageSync('searchRecode')[0]) {
      var keywords = wx.getStorageSync('searchRecode')[wx.getStorageSync('searchRecode').length - 1]
      this.setData({
        keywords: keywords
      })
    }
    else {
      var keywords = ''
      this.setData({
        keywords: keywords
      })
    }
    // 判断是否存在足迹
    if (wx.getStorageSync('history')[0]) {
      var footprint = JSON.stringify(wx.getStorageSync('history')[wx.getStorageSync('history').length - 1])
      this.setData({
        footprint: footprint
      })
    }
    else {
      var footprint = ''
      this.setData({
        footprint: footprint
      })
    }
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    that.selectAllPintuan();
    wx.request({
      url: port + '/MiniLife/getLine',
      data: {
        currPage: 1
      },
      success: function (resData) {
        that.setData({
          goods: resData.data
        })
      }
    })
    var a = 1;

    // 请求秒杀数据
    wx.request({
      url: port + '/MiniLife/selectSnipAll',
      data: {
        currPage: that.data.MScurrPage
      },
      method: 'GET',
      success: function (res) {
        if (res.data[0] != undefined) {
          wx.hideLoading();
        }
        else {
          wx.hideLoading();
          wx.showToast({
            title: '没有更多商品了',
            icon: 'none'
          })
        }
        that.data.miaoshaList = that.data.miaoshaList.concat(res.data)
        that.setData({
          miaoshaList: that.data.miaoshaList
        })
        console.log(that.data.miaoshaList)

      }
    })
    console.log(keywords, footprint)
    // 请求每日推荐数据
    wx.request({
      url: port + '/MiniLife/todayRecommendProducts',
      data: {
        keywords: keywords,
        footprint: footprint,
        currPage: 1
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log(res.data.obj)
        that.setData({
          tuijian_list:res.data.obj
        })
      }
    })

    // 请求弹窗数据
    wx.request({
      url: port + "/MiniLife/text/messageSwer",
      data: {
      },
      method: 'GET',
      success: function (res) {
        res.data
        wx.hideLoading()
        that.setData({
          tanchuang: res.data
        })
      }
    })

    // // 广告位13轮播广告
    // wx.request({
    //   url:  port + '/MiniLife/getGoodsByStatus',
    //   data:{
    //     status:13
    //   },
    //   success:function(res) {
    //     that.setData({
    //       lunboad:res.data
    //     })
    //   }

    // })
    // // 广告位10广告（共两张）
    // wx.request({
    //   url:  port + '/MiniLife/getGoodsByStatus',
    //   data: {
    //     status: 10
    //   },
    //   success: function (res) {
    //     that.setData({
    //       liangzhangad: res.data
    //     })
    //   }

    // })

    // // 广告位11广告（共四张）
    // wx.request({
    //   url: port + '/MiniLife/getGoodsByStatus',
    //   data: {
    //     status: 11
    //   },
    //   success: function (res) {
    //     that.setData({
    //       sizhangad: res.data
    //     })
    //   }

    // })


    // 广告位12轮播广告（共一张）
    wx.request({
      url: port + '/MiniLife/getGoodsByStatus',
      data: {
        status: 12
      },
      success: function (res) {
        that.setData({
          lunbo2ad: res.data
        })
      }

    })

    // 获取一级分类数据
    wx.request({
      url: port + '/MiniLife/getMarketTypeInfo',
      success:function(res) {
        console.log(res.data)
        that.setData({
          photos:res.data.obj,
          loading: false 
        })
      }
    })

  },
  // 进入搜索页面
  search: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // 今日推荐加载更多
  tuijian: function() {
    var that = this;
    that.data.tuijian_page += 1;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: port + '/MiniLife/todayRecommendProducts',
      data: {
        keywords: that.data.keywords,
        footprint: that.data.footprint,
        currPage: that.data.tuijian_page
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        if(!res.data.obj[0]) {
          wx.showToast({
            title: '没有更多商品了',
            image:'/img/collect/warning.png'
          })
          return;
        }
        that.data.tuijian_list = that.data.tuijian_list.concat(res.data.obj)
        
        that.setData({
          tuijian_list: that.data.tuijian_list
        })
        console.log(that.data.tuijian_list)
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
    console.log(wx.getStorageSync('isFirst'))
    if(wx.getStorageSync('isFirst') === true) {
      this.setData({
        red_packet: true
      })
      wx.removeStorageSync('isFirst')
    }
  },

  // 取消红包
  cancle: function() {
    this.setData({
      red_packet: false
    })
  },

  // 领取红包
  receive_redpacket: function() {
    console.log("openid" + wx.getStorageSync("openid"))
    wx.showLoading({
      title: '红包领取中',
      mask:true,
    })
    var that = this;
    var money = [1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 4, 5, 6, 1, 1, 1,3, 3, 3, 3, 3, 3, 3,, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 8, 9, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, , 1, 2, 3, 1]
    console.log('生成了随机金额', parseInt(Math.random() * 100), money[parseInt(Math.random() * 100)])
    var random = money[parseInt(Math.random() * 100)]
    wx.request({
      url: port + '/MiniLife/redPackageForNewUser',
      data:{
        openId:wx.getStorageSync("openid"),
        redSalary: random,
      },
      success: function(res) {
        wx.hideLoading()
        console.log(res.data.success)
        var studus = res.data.success;
        if (studus) {
          that.setData({
            red_packet: false
          })
          wx.showModal({
            title: '领取成功',
            content: '恭喜成功领取' + random + "元红包",
            showCancel:false,
            confirmText:"我知道了"
          })
        }
        else {
          that.setData({
            red_packet: false
          })
          wx.showModal({
            title: '领取失败',
            content: "您已是我们的老用户了！",
            showCancel: false,
            confirmText: "我知道了"
          })
        }
      },
    })
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
    this.setData({
      marketPage: 1,
      // 拼团页面值
      pintuanList: [],
      miaoshaList: [],
      PTcurrentPage: 1,
      MScurrPage: 1,
    })
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    this.data.marketPage += 1;
    this.setData({
      marketPage: this.data.marketPage
    })

    wx.request({
      url: port + '/MiniLife/getLine',
      data: {
        currPage: this.data.marketPage
      },
      success: function (resData) {

        if (resData.data[0] != undefined) {
          that.data.goods = that.data.goods.concat(resData.data)
          that.setData({
            goods: that.data.goods
          })
          setTimeout: (function () {

          }, 1000)
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

        // console.log(resData)
        // that.setData({
        //   goods: that.data.goods
        // })

      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '梦想生活',
      path: '/pages/market/market?id=' + wx.getStorageSync("openid"),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  // 跳转详情页
  doDetail: function (e) {
    wx.navigateTo({
      url: '/pages/menwear-detail/deetail?goodsid=' + e.currentTarget.dataset.goodsid + '&yuanjia=' + e.currentTarget.dataset.yuanjia,
    })
  },

  // 筛选页

  meishi: function (event) {
    wx.navigateTo({
      url: '/pages/home-cate/cate',
    })
  },

  // 拼团数据

  selectAllPintuan: function () {
    var that = this;
    wx.request({
      url: port + '/MiniLife/selectAllSpell',
      data: {
        currPage: that.data.PTcurrentPage
      },
      success: function (resData) {

        if (resData.data[0] != undefined) {
          that.data.pintuanList = that.data.pintuanList.concat(resData.data)
          that.setData({
            pintuanList: that.data.pintuanList
          })
          wx.hideLoading();
          
        }
        else {
          wx.hideLoading();
          wx.showToast({
            title: '没有更多商品了',
            icon: 'none'
          })
        }
      }
    })
  },
  // 进入团购详情页
  todetail: function (e) {
    wx.navigateTo({
      url: '/pages/yulan/detail?pintuanId=' + e.currentTarget.dataset.pintuanid,
    })
  },

})