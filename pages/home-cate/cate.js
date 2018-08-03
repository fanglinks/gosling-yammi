// // pages/home-cate/cate.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({
  data: {
    currpage:1,

    // 美食二级分类
    foods: [
      { style: '甜点饮品' },
      { style: '生日蛋糕' },
      { style: '火锅' },
      { style: '自助餐' },
      { style: '小吃快餐' },
      { style: '日韩料理' },
      { style: '西餐' },
      { style: '聚餐宴请' },
      { style: '烧烤烤肉' },
      { style: '大闸蟹' },
      { style: '川湘菜' },
      { style: '江浙菜' },
      { style: '香锅烤鱼' },
      { style: '小龙虾' },
      { style: '粤菜' },
      { style: '中式烧烤/烤串' },
      { style: '西北菜' },
      { style: '咖啡酒吧' },
      { style: '京菜鲁菜' },
      { style: '徽菜' },
      { style: '东北菜' },
      { style: '生鲜蔬果' },
      { style: '云贵菜' },
      { style: '东南亚菜' },
      { style: '海鲜' },
      { style: '素食' },
      { style: '台湾/客家菜' },
      { style: '创意菜' },
      { style: '汤/粥/炖菜' },
      { style: '蒙餐' },
      { style: '新疆菜' },
    ],

    // 丽人二级分类
    beauty: [
      { style: '美甲美睫' },
      { style: '美容美体' },
      { style: '医学美容' },
      { style: '皮肤管理' },
      { style: '韩式定妆' },
      { style: '瑜伽舞蹈' },
      { style: '纤体瘦身' },
      { style: '祛痘' },
      { style: '纹身' },
      { style: '化妆品' },
      { style: '脱毛' },
    ],

    // 健身二级分类
    fitness: [
      { style: '攀岩' },
      { style: '游泳' },
      { style: '健身中心' },
      { style: '羽毛球' },
      { style: '台球' },
      { style: '武术' },
      { style: '保龄球' },
      { style: '高尔夫' },
      { style: '篮球' },
      { style: '滑冰' },
      { style: '射击射箭' },
      { style: '网球' },
      { style: '骑马' },
      { style: '足球' },
      { style: '乒乓球' },
      { style: '壁球' },
      { style: '综合体育场馆' },
      { style: '更多运动' },
    ],

    // 超市二级分类
    supermarket: [
      { style: '生鲜水果' },
      { style: '休闲零食' },
      { style: '奶品水饮' },
      { style: '粮油厨房' },
      { style: '家用电器' },
      { style: '母婴用品' },
      { style: '个人护理' },
      { style: '家清家居' },
      { style: '进口好货' },
      { style: '中外名酒' },
      { style: '收纳日用' },
      { style: '滋补保健' },
      { style: '家纺内衣' },
      { style: '宠物用品' },
      { style: '方便速食' },
      { style: '成人用品' },
      { style: '美容护肤' },
      { style: '3C汽配' },
      { style: '文具体育' },
    ],

    // 美发二级分类
    hairdressing: [
      { style: '美发' },

    ],


    // allnear: [
    //   '附近', '龙华区', '福田区', '南山区'
    // ],
    allnear: [
      '附近(智能范围)', '1km', '5km', '10km', '全城'
    ],


    // allpink: [
    //   '智能排序', '距离优先', '人气优先', '好评优先', '口味最佳'
    // ],


    food: false,
    near: false,
    pink: false,
  },




  //<全部>选项
  food: function () {

    this.setData({
      near: false,
      pink: false,
      food: !this.data.food
    })
    console.log((this.data.food | this.data.near) == true)
  },
// 点击全部下面的二级类
  Food: function (event) {
    console.log('进入了二级类的数据请求', wx.getStorageSync('address_name'))
    var that = this;
    console.log(event.currentTarget.dataset)
    var index = parseInt(event.currentTarget.dataset.index);
    this.setData({
      current_id: index,
      type1: event.currentTarget.dataset.text.style,
      food: !this.data.food
    })
    wx.request({
      url: port + '/MiniLife/queryGoodsByTypeOrKeywords',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        sort: 1,
        zuobiao: wx.getStorageSync('usergps'),
        address_component: JSON.stringify(wx.getStorageSync('address_name')) ,
        keywords: '',
        currPage: 1,
        foodType: that.data.type1,
        foodTypeTwo: that.data.foodTypeTwo
      },
      success:function(res) {
        console.log('这里是二级类数据' + res.data.obj)
        that.setData({
          shoplist: res.data.obj
        })
      }
    })
  },
  Food_cai: function (event) {
    console.log(event)
    var num = event.currentTarget.dataset.num;
    this.setData({ current_index: num })
  },



  // <附近>选项
  near: function () {
    this.setData({
      food: false,
      pink: false,
      near: !this.data.near
    })
  },
  Near: function (event) {
    var that = this;
    var index = parseInt(event.currentTarget.dataset.index);
    this.setData({
      current_id: index,
      type2: event.currentTarget.dataset.text,
      near: !this.data.near
    })

    console.log('进入了附近的数据请求')
    wx.request({
      url: port + '/MiniLife/queryGoodsByTypeOrKeywords',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        sort: 8,
        zuobiao: wx.getStorageSync('usergps'),
        address_component: JSON.stringify(wx.getStorageSync('address_name')),
        keywords: '',
        currPage: 1,
        foodType: '',
        foodTypeTwo: that.data.foodTypeTwo
      },
      success: function (res) {
        console.log('这里是附近数据' + res.data.obj)
        that.setData({
          shoplist: res.data.obj
        })
      }
    })
  },
  fujin: function (event) {
    console.log(event)
    var num = event.currentTarget.dataset.num;
    this.setData({ current_index: num })
  },


  //<智能排序>选项
  pink: function () {
    console.log('进入了智能排序数据')
    var that = this;
    this.setData({
      food: false,
      near: false,
      pink: !this.data.pink
    })
    wx.request({
      url: port + '/MiniLife/queryGoodsByTypeOrKeywords',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        sort: 4,
        zuobiao: wx.getStorageSync('usergps'),
        address_component: JSON.stringify(wx.getStorageSync('address_name')),
        keywords: '',
        currPage: 1,
        foodType: '',
        foodTypeTwo: that.data.foodTypeTwo
      },
      success: function (res) {
        console.log('这里是智能排序数据' + res.data.obj)
        that.setData({
          shoplist: res.data.obj
        })
      }
    })
  },
  Pink: function (event) {
    console.log(event)
    var index = parseInt(event.currentTarget.dataset.index);
    this.setData({ current_id: index })
  },


  // 蒙版事件
  mengban: function () {
    this.setData({
      food: false,
      near: false,
      pink: false,
    })
  },

  // 跳转店铺详情
  shopdetail: function (event) {
    var shopid = event.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '/pages/shopdetail/shopdetail?shopid=' + shopid,
    })
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      foodTypeTwo: options.text
    })
    wx.setNavigationBarTitle({
      title: options.text
    })
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
    }
    var that = this;
    console.log(options.text)
    if (options.text === '美食') {
      this.setData({
        secondType: this.data.foods
      })
    }
    else if (options.text === '丽人') {
      this.setData({
        secondType: this.data.beauty
      })
    }
    else if (options.text === '健身') {
      this.setData({
        secondType: this.data.fitness
      })
    }
    else if (options.text === '超市') {
      this.setData({
        secondType: this.data.supermarket
      })
    }
    else if (options.text === '美发') {
      this.setData({
        secondType: this.data.hairdressing
      })
    }

    // 锁粉
    var dingshiqi = setInterval(function () {
      if (wx.getStorageSync("openid")) {
        clearInterval(dingshiqi)
        wx.request({
          url: port + "/MiniLife/user/lockingUser",
          data: {
            openid: options.id,
            lockopenid: wx.getStorageSync("openid"),
          },
          method: 'GET',
          success: function (res) {
          }
        })
      }
    }, 1000);

    // 请求商家数据
    wx.request({
      url: port + '/MiniLife/queryGoodsByTypeOrKeywords',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        sort: 1,
        zuobiao: wx.getStorageSync('usergps'),
        address_component: JSON.stringify(wx.getStorageSync('address_name')),
        keywords: '',
        currPage: 1,
        foodType: '',
        foodTypeTwo: that.data.foodTypeTwo
      },
      success: function (res) {
        wx.hideLoading()
        console.log('这里是智能排序数据' + res.data.obj)
        that.setData({
          shoplist: res.data.obj
        })
      }
    })

  },

  // 关键字搜索
  search_wordkey: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var value = e.detail.value;
    this.setData({
      food:false,
      near:false,
      pink:false,
      serach_value:value
    })
    wx.request({
      url: port + '/MiniLife/queryGoodsByTypeOrKeywords',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        sort: 8,
        zuobiao: wx.getStorageSync('usergps'),
        address_component: JSON.stringify(wx.getStorageSync('address_name')),
        keywords: value,
        currPage: 1,
        foodType: '',
        foodTypeTwo: ''
      },
      success: function (res) {
        wx.hideLoading()
        console.log('这里是搜索数据')
        console.log(res.data.obj)
        that.setData({
          shoplist: res.data.obj
        })
      }
    })
  },

  // 上拉加载
  onReachBottom: function() {
    // 点击二级类的加载更多
    if (this.data.food) {
      console.log('点击二级类的加载更多')
      var sort = 1;
      var keywords = '';
      var foodType = this.data.type1;
      var foodTypeTwo = this.data.foodTypeTwo;
    }
    // 点击附近任意选项加载更多
    else if (this.data.near) {
      console.log('点击附近任意选项加载更多')
      var sort = 8;
      var keywords = '';
      var foodType = '';
      var foodTypeTwo = this.data.foodTypeTwo;
    }
    // 点击智能排序加载更多
    else if (this.data.pink) {
      console.log('点击智能排序加载更多')
      var sort = 4;
      var keywords = '';
      var foodType = '';
      var foodTypeTwo = this.data.foodTypeTwo;
    }

    // 搜索加载更多
    else if (this.data.serach_value && this.data.food == false && this.data.near == false && this.data.pink == false) {
      console.log('搜索加载更多')
      var sort = 1;
      var keywords = this.data.serach_value;
      var foodType = '';
      var foodTypeTwo = '';
    }
    // 默认加载更多
    else {
      var sort = 1;
      var keywords = '';
      var foodType = '';
      var foodTypeTwo = this.data.foodTypeTwo;
    }
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var value = e.detail.value;
    this.data.currpage += 1;
    wx.request({
      url: port + '/MiniLife/queryGoodsByTypeOrKeywords',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        sort: sort,
        zuobiao: wx.getStorageSync('usergps'),
        address_component: JSON.stringify(wx.getStorageSync('address_name')),
        keywords: keywords,
        currPage: that.data.currpage,
        foodType: foodType,
        foodTypeTwo: foodTypeTwo
      },
      success: function (res) {
        wx.hideLoading()
      if(!res.data.obj[0]) {
        wx.showToast({
          title: '没有更多商家了',
          icon:'none'
        })
      }
      else {
        that.data.shoplist = that.data.shoplist.concat(res.data.obj)
        that.setData({
          shoplist: that.data.shoplist
        })
      }
       
      }
    })
  },


  // 分享
  onShareAppMessage: function() {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮")
      console.log(res.target)
    }
    return {

      title: that.data.shopinfo.name,
      path: '/pages/home-cate/cate?id=' + wx.getStorageSync("openid") + "&gotohome=" + true + "&shopid=" + that.data.shopid,
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

})
