// pages/shopdetail/shopdetail.js
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 总金额
    aggregate_amount:0,
    // 购物车商品数量
    shopCar_num: 0,
    // 是否显示蒙版
    mengban:false,
    // 线下购物车
    shopping_cart2:[],
    shopping_cart1: [],
    // 是否显示购物车
    show_shopcar:false,

    // 是否显示选择规格窗口
    select_window: true,
    isCollect:false,
    shishi: {},
    num: [],
    updetails: [],
    heji: 0,
    jishu: 0,
    shangping: [],
    openid: "",
    userAddress: {
      userName: "",
      postalCode: "",
      provinceName: "",
      cityName: "",
      countyName: "",
      detailInfo: "",
      nationalCode: "",
      telNumber: ""
    },
    imgUrls: ["/img/shopdetail/店铺_商家信息_02.gif"],
    pagechange: {
      main: false,
      talk: true,
      info: true
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮")
      console.log(res.target)
    }
    return {
      title: '【店铺】' + this.data.shopinfo.name + (this.data.shopinfo.detail ? '【店铺介绍】' + this.data.shopinfo.detail : ''),
      path: '/pages/shopdetail/shopdetail?id=' + wx.getStorageSync("openid") + '&shopid=' + this.data.shopid,
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

  shijian: function (e) {

    // let that = this
    // let index = parseInt(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '/pages/detail/detail?foodid=' + e.currentTarget.dataset.foodid,
    })
    // console.log(index,this.data.shangping[index])
  },
  zengjia: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.shangping[index]['num'] += 1;
    this.setData({
      shangping:this.data.shangping,
      aggregate_amount: + (this.data.aggregate_amount + this.data.shangping[index].foodPrice).toFixed(2),
      shopCar_num: this.data.shopCar_num + 1,
      shopping_cart1: this.data.shangping
    })
    console.log(this.data.shangping)
    return;
    
  },


  jianshao: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.shangping[index]['num'] -= 1;
    this.setData({
      shangping: this.data.shangping,
      aggregate_amount: + (this.data.aggregate_amount - this.data.shangping[index].foodPrice).toFixed(2),
      shopCar_num: this.data.shopCar_num - 1,
      shopping_cart1: this.data.shangping
    })
    console.log(this.data.shangping)
    // var localnum = 'num' + '[' + index + ']';
    // var updetail = 'updetails' + '[' + index + ']';
    // var shangpingnum = 'shangping' + '[' + index + ']' + '.' + 'num';
    // console.log(this.data.num[index])
    // if (this.data.num[index] > 0) {
    //   this.setData({
    //     [localnum]: this.data.num[index] - 1,
    //     [shangpingnum]: this.data.num[index] - 1,
    //     [updetail]: this.data.shangping[index],
    //     heji: + (this.data.heji - this.data.shangping[index].foodPrice).toFixed(1)
    //   })
    // }
    // else {
    //   this.setData({
    //     [shangpingnum]: this.data.num[index] - 1,
    //     [updetail]: this.data.shangping[index],
    //   })
    // }

  },
  main: function (event) {
    this.setData({
      pagechange: {
        main: false,
        talk: true,
        info: true,
      },
      isChecked: true,
      isChecked2: false,
      isChecked3: false
    })
  },
  talk: function (event) {
    this.setData({
      pagechange: {
        main: true,
        talk: false,
        info: true
      },
      isChecked: false,
      isChecked2: true,
      isChecked3: false
    })
  },
  info: function (event) {
    this.setData({
      pagechange: {
        main: true,
        talk: true,
        info: false
      },
      isChecked: false,
      isChecked2: false,
      isChecked3: true
    })
  },
  jiahao: function (event) {
    console.log('111')
  },

  minipay: function () {
    wx.showModal({
      title: '购买提示',
      content: '暂不支持多商品结算，您可以进入单个商品去购买',
      showCancel: false,
      confirmText: '我知道了'
    })
    // console.log(this.data.updetails)
    // var ss = this;
    // var val = wx.getStorageSync("openid")
    // var youzhi = 0;
    // for (var i = 0; i < ss.data.num.length; i++) {
    //   if (this.data.num[i] > 0) {
    //     youzhi = 1;
    //     break;
    //   }
    // }
    // console.log(youzhi)
    // if (youzhi == 1) {
    //   wx.chooseAddress({
    //     success: function (res) {
    //       ss.setData({
    //         userName: res.userName,
    //         telNumber: res.telNumber,
    //         adcdress: res.provinceName + res.cityName + res.countyName + res.detailInfo
    //       })
    //       //---------------------------------------
    //       wx.request({
    //         url: port + "/MiniLife/api/jiesuanWxPay",
    //         data: {
    //           openid: val,
    //           userName: res.userName,
    //           telNumber: res.telNumber,
    //           address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
    //           shangpinid: JSON.stringify(ss.data.updetails),
    //           heji: ss.data.heji,
    //           detail: "商品购买"
    //         },
    //         method: 'GET',
    //         success: function (res) {
    //           console.log(res)
    //           ss.setData({
    //             appId: res.data.appId,
    //             timeStamp: res.data.timeStamp,
    //             nonceStr: res.data.nonceStr,
    //             packages: res.data.package,
    //             signType: res.data.signType,
    //             paySign: res.data.paySign
    //           })

    //           wx.requestPayment({
    //             "timeStamp": ss.data.timeStamp,
    //             "nonceStr": ss.data.nonceStr,
    //             "package": ss.data.packages,
    //             "signType": 'MD5',
    //             "paySign": ss.data.paySign,
    //             success: function (res) {
    //               console.log("支付成功！")
    //             },
    //             'fail': function (res) {
    //               console.log(res)
    //             },
    //             'complete': function (res) {
    //               console.log("支付发起！" + ss.data)
    //             }
    //           })
    //         }
    //       });
    //     }
    //   })
    // } else {
    //   wx.showToast({
    //     icon: "none",
    //     title: '商品不能为空！',
    //   })
    // }
    // var foods = "";
    // for (var i = 0; i < this.data.shangpinid.length; i++) {
    //   foods = foods + ss.data.shangpinid[i] + "=" + ss.data.jianshu[i] + "M";
    // }
    // console.log("openid=======" + foods)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
      this.setData({
        is_share: options.id
      })
    }
    
    var that = this;
    if (options.shopid) {
      this.setData({
        shopid: options.shopid,

      })
    }
    var scene = decodeURIComponent(options.scene)
    if (scene != 'undefined') {
      this.setData({
        shopid: scene,
        is_share: true
      })
      // 获取商户openid用于锁定
      wx.request({
        url: port + '/MiniLife/business/queryBusinessByShanghuId',
        data: {
          shanghuId: that.data.shopid
        },
        success:function(res) {
          console.log('这里传递了商户的openid', res.data.obj.openid)
          wx.setStorageSync('lock_openid', res.data.obj.openid)
          lock_user.lock_user()
        }
      })
    }

    // 查找商家商品信息
    wx.request({
      url: port + '/MiniLife/api/getGoods',
      data: {
        'Commercial': that.data.shopid
      },
      success: function (resdata) {
        // 这里提供原价
        that.setData({
          original_price: resdata.data
        })
        // 判断是否是会员
        wx.request({
          url: port + '/MiniLife/user/getUserInfo',
          data: {
            openid: val,
          },
          success: function (res) {
            var types = res.data.userType

            if (types == "chuangke") {
              for (var i = 0; i < resdata.data.length; i++) {
                resdata.data[i]['num'] = 0;
                resdata.data[i]['canshu1'] = '无';
                resdata.data[i]['canshu2'] = '无';
                resdata.data[i].foodPrice = resdata.data[i].foodLowprice
              }
              that.setData({
                shangping: resdata.data,
                // shopping_cart: resdata.data
              })
              that.setData({
                userType: true,
                shangping: that.data.shangping,
              })
            } else if (types == "users") {
              for (var i = 0; i < resdata.data.length; i++) {
                resdata.data[i]['num'] = 0;
                resdata.data[i]['canshu1'] = '无';
                resdata.data[i]['canshu2'] = '无';
              }
              that.setData({
                shangping: resdata.data,
                // shopping_cart: resdata.data
              })
              that.setData({
                userType: false,
              })
            }
          }
        })
        

        
        // console.log(that.data.shangping)
      }
    })

    // 查找商家信息

    wx.request({
      url: port + '/MiniLife/business/getBusinessInfoByShagnhuId',
      data: { shanghuId: that.data.shopid },
      success: function (res) {
        that.setData({
          shopinfo: res.data.obj
        })
        console.log(that.data.shopinfo)
        wx.setNavigationBarTitle({
          title: that.data.shopinfo.name
        })
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
        success:function(res) {
          console.log(res.data.obj)
          if(res.data.obj == 1) {
            that.setData({
              isCollect:true
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

  // scroll: function(e) {
  //   console.log('滚动了')
  //   console.log(e)
  // },

  // 拨号
  call: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.shopinfo.phone
    })
  },

//  收藏
  isCollect: function() {
    var that =this
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
        mask:true
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

  shoucang: function () {
    if (this.data.shoucang === '/img/img-detail/normal.gif')
      this.setData({
        shoucang: '/img/img-detail/collect.gif'
      })
    else {
      this.setData({
        shoucang: '/img/img-detail/normal.gif'
      })
    }
  },

  gotohome: function () {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  // 点击导航
  daohang: function (e) {
    // var business = e.currentTarget.dataset.business;
    // // var businessname = e.currentTarget.dataset.businessname
    // // 商户名称
    var business_name = this.data.shopinfo.name
    // // 商户坐标
    var business_latitude = + this.data.shopinfo.gps.slice(0, 9)
    var business_longitude = + this.data.shopinfo.gps.slice(9)
    // console.log(business, business_latitude, business_longitude)
    // return;
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (res) {
        wx.openLocation({
          latitude: business_latitude,
          longitude: business_longitude,
          name: business_name,
          scale: 28
        })
      }
    })
  },

  // 关闭弹窗
  close_window: function() {
    this.setData({
      select_window:true,
      mengban: false,
    })
  },

// 选择规格或参数
  select_add: function(e) {
    var addgoods = e.currentTarget.dataset.item;
    if (addgoods.goodsSkuColor.indexOf(',') != -1) {
      addgoods.goodsSkuColor = addgoods.goodsSkuColor.split(',')
    } else if (addgoods.goodsSkuColor.indexOf('，') != -1) {
      addgoods.goodsSkuColor = addgoods.goodsSkuColor.split('，')
    }
    // 默认给参数为‘无’
    addgoods['canshu1'] = '无';
    addgoods['canshu2'] = '无';
    console.log(addgoods.goodsSkuColor)
    this.setData({
      now_goods: addgoods,
      select_window: false,
      mengban:true,
    })
  },

  // 选好了并添加购物车
  select_ok: function(e) {
    // this.data.now_goods['parameter_one'] = this.data.parameter_one;
    // this.data.now_goods['parameter_two'] = this.data.parameter_two;
    this.data.now_goods['num'] = 1;
    this.setData({
      // shopping_cart: this.data.shangping,
      shopping_cart2: this.data.shopping_cart2.concat(this.data.now_goods),
      select_window: true,
      mengban: false,
      shopCar_num: this.data.shopCar_num +1,
      aggregate_amount: + (this.data.aggregate_amount + this.data.now_goods.foodPrice).toFixed(2),
      num1:'',
      num2:'',
    })
    
  },

// 选择商品参数1（规格等）
canshu1: function(e) {
  console.log(e.currentTarget.dataset.id)
  this.data.now_goods['canshu1'] = e.currentTarget.dataset.item;
  this.setData({
    now_goods: this.data.now_goods,
    num1: e.currentTarget.dataset.id
  }) 
  console.log(this.data.now_goods)
},

// 选择商品参数2（口味等）
canshu2: function (e) {
  console.log(e.currentTarget.dataset.id)
  this.data.now_goods['canshu2'] = e.currentTarget.dataset.item;
  this.setData({
    now_goods: this.data.now_goods,
    num2: e.currentTarget.dataset.id
  })
  console.log(this.data.now_goods)
},

// 打开购物车数据
  show_shopcar: function() {
    // this.data.shopping_cart = this.data.shopping_cart.concat(this.data.shangping)
   
      // this.setData({
      //   shopping_cart: this.data.shopping_cart1.concat(this.data.shopping_cart2)
      // })
   
    
    if (this.data.shopCar_num == 0) {
      return;
    }
    // 出现蒙版
    this.setData({
      show_shopcar: !this.data.show_shopcar
    })
    console.log('购物车的数据', this.data.shopping_cart)
  },

  // 点击蒙版
  close_allwindow: function() {
    if (this.data.show_shopcar) {
      this.setData({
        show_shopcar: !this.data.show_shopcar,
      })
    }
    
  },

  // 清空购物车
  clear_allgoods: function() {
    for (let i = 0; i < this.data.shangping.length; i++) {
      this.data.shangping[i].num = 0;
    }
    this.setData({
      shangping:this.data.shangping,
      shopping_cart: false,
      shopping_cart1:[],
      shopping_cart2:[],
      shopCar_num:0,
      show_shopcar: !this.data.show_shopcar,
      aggregate_amount: 0
    })
  },

  // 增加购物车商品
  addNum: function(e) {
    // 记录这是购物车的第几条数据
    var index = e.currentTarget.dataset.index;
    // 具体内容
    var item = e.currentTarget.dataset.item;
    // 相应购物车数据的num++
    this.data.shopping_cart1[index].num += 1;
    // 相应的商品列表数据num改变
    for (let i = 0; i < this.data.shangping.length; i ++) {
      if (this.data.shopping_cart1[index].foodId == this.data.shangping[i].foodId && this.data.shopping_cart1[index].canshu1 == "无" && this.data.shopping_cart1[index].canshu2=="无") {
        this.data.shangping[i].num = this.data.shopping_cart1[index].num
      }
    }
    this.setData({
      shangping: this.data.shangping,
      // shopping_cart: this.data.shopping_cart,
      shopping_cart1: this.data.shangping,
      aggregate_amount: + (this.data.aggregate_amount + this.data.shopping_cart1[index].foodPrice).toFixed(2),
      
      shopCar_num: this.data.shopCar_num + 1
    })
    // console.log(this.data.shopping_cart, this.data.shopping_cart[index].num)
  },


  // 增加购物车商品
  addNum2: function (e) {
    // 记录这是购物车的第几条数据
    var index = e.currentTarget.dataset.index;
    // 具体内容
    var item = e.currentTarget.dataset.item;
    // 相应购物车数据的num++
    this.data.shopping_cart2[index].num += 1;
    // 相应的商品列表数据num改变
    // for (let i = 0; i < this.data.shangping.length; i++) {
    //   if (this.data.shopping_cart[index].foodId == this.data.shangping[i].foodId && this.data.shopping_cart[index].canshu1 == "无" && this.data.shopping_cart[index].canshu2 == "无") {
    //     this.data.shangping[i].num = this.data.shopping_cart[index].num
    //   }
    // }
    this.setData({
      // shangping: this.data.shangping,
      // shopping_cart: this.data.shopping_cart,
      shopping_cart2: this.data.shopping_cart2,
      aggregate_amount: + (this.data.aggregate_amount + this.data.shopping_cart2[index].foodPrice).toFixed(2),

      shopCar_num: this.data.shopCar_num + 1
    })
    // console.log(this.data.shopping_cart, this.data.shopping_cart[index].num)
  },

  // 减少购物车商品
  reduceNum: function (e) {
    // 具体内容
    var item = e.currentTarget.dataset.item;
    // 记录这是购物车的第几条数据
    var index = e.currentTarget.dataset.index

    
    // 判断等于零时删除该商品
    // if (item.num == 1) {
    //   this.data.shopping_cart.splice(index,1)
    //   this.setData({
    //     shopping_cart: this.data.shopping_cart
    //   })
    
      // return;
    
    // 相应购物车数据的num--
    this.data.shopping_cart1[index].num -= 1;
// 相应商品列表数据减少
    for (var i = 0; i < this.data.shangping.length; i++) {
      if (this.data.shopping_cart1[index].foodId == this.data.shangping[i].foodId) {
        this.data.shangping[i].num = this.data.shopping_cart1[index].num
      }
    }
    this.setData({
      // shopping_cart: this.data.shopping_cart,
      aggregate_amount: + (this.data.aggregate_amount - this.data.shopping_cart1[index].foodPrice).toFixed(2),
      shangping: this.data.shangping,
      shopping_cart1: this.data.shangping,
      shopCar_num: this.data.shopCar_num - 1
    })

    // 如果购物车数据为空，关闭购物车，并将数据重置为0；
    if (this.data.aggregate_amount == 0) {
      this.close_allwindow();
      this.setData({
        shopCar_num: 0,
        aggregate_amount: 0,
        shopping_cart1:[],
        shopping_cart2:[],
        shopping_cart:false
      })
    }
    // console.log(this.data.shopping_cart, this.data.shopping_cart[index].num)
  },


  // 减少购物车商品
  reduceNum2: function (e) {
    // 具体内容
    var item = e.currentTarget.dataset.item;
    // 记录这是购物车的第几条数据
    var index = e.currentTarget.dataset.index;


    // 判断等于零时删除该商品
    // if (item.num == 1) {
    //   this.data.shopping_cart.splice(index,1)
    //   this.setData({
    //     shopping_cart: this.data.shopping_cart
    //   })

    // return;

    // 相应购物车数据的num--
    this.data.shopping_cart2[index].num -= 1;
    // 相应商品列表数据减少
    // for (var i = 0; i < this.data.shangping.length; i++) {
    //   if (this.data.shopping_cart[index].foodId == this.data.shangping[i].foodId) {
    //     this.data.shangping[i].num = this.data.shopping_cart[index].num
    //   }
    // }
    this.setData({
      // shopping_cart: this.data.shopping_cart,
      aggregate_amount: + (this.data.aggregate_amount - this.data.shopping_cart2[index].foodPrice).toFixed(2),
      // shangping: this.data.shangping,
      // shopping_cart1: this.data.shangping,
      shopping_cart2: this.data.shopping_cart2,

      shopCar_num: this.data.shopCar_num - 1
    })

    // 如果购物车数据为空，关闭购物车，并将数据重置为0；
    if (this.data.aggregate_amount == 0) {
      this.close_allwindow();
      this.setData({
        shopCar_num: 0,
        aggregate_amount: 0,
        shopping_cart1: [],
        shopping_cart2: [],
        shopping_cart: false
      })
    }
    // console.log(this.data.shopping_cart, this.data.shopping_cart[index].num)
  },


  // ==================================================================

  // 结算
  jiesuan: function (e) {
    if (this.data.aggregate_amount == 0) {
      return;
    }
    var updetails = [];
    var shopping_cart = this.data.shopping_cart1.concat(this.data.shopping_cart2);
    for (let i = 0; i < shopping_cart.length; i ++) {
      if (shopping_cart[i].num != 0) {
        console.log('进来了数据', shopping_cart[i])
        updetails = updetails.concat(shopping_cart[i])
      }
    }
  
    console.log(updetails)
    // return;
    // wx.showModal({
    //   title: '升级提示',
    //   content: '购物车版本升级中，将在下个版本与您见面，请亲前往详情页面直接购买',
    // })
    // return;
    if (this.data.shopCar_num == 0) {
      return;
    }
    else {
     
      console.log('进入了支付')
      var that = this;
      // wx.chooseAddress({
      //   success: function (res) {
          // that.setData({
          //   userName: res.userName,
          //   postalCode: res.postalCode,
          //   provinceName: res.provinceName,
          //   cityName: res.cityName,
          //   countyName: res.countyName,
          //   detailInfo: res.detailInfo,
          //   nationalCode: res.nationalCode,
          //   telNumber: res.telNumber
          // })
          // console.log()
          var val = wx.getStorageSync("openid")
          if (+that.data.qianbao >= +that.data.aggregate_amount) {
           
            console.log('钱包支付')
            var url = port + '/MiniLife/aggregetPay';
            wx.showModal({
              title: '钱包支付提醒',
              content: '钱包余额' + that.data.qianbao + ',' + ' 直接使用钱包抵扣',
              success: function (res) {
                if (res.confirm) {
                  wx.showLoading({
                    title: '支付中',
                    mask: true
                  })
                  wx.request({
                    url: url,
                    data: {
                      openid: val,
                      heji: that.data.aggregate_amount,
                      // userName: that.data.userName,
                      // address: that.data.provinceName + that.data.cityName + that.data.countyName + that.data.detailInfo,
                      // telNumber: that.data.telNumber,
                      shopping: JSON.stringify(updetails),
                      formId: e.detail.formId
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
                      console.log(that.data.qianbao, that.data.heji)
                      // 钱包支付
                      if (+that.data.qianbao >= +that.data.heji) {
                        console.log('钱包支付')

                        if (res.data === '支付成功') {
                         wx.hideLoading()
                          wx.switchTab({
                            url: '/pages/home/home',
                            success:function() {
                              wx.showToast({
                                title: '支付成功',
                              })
                            }
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

          else {
            wx.showLoading({
              title: '支付中',
            })
            console.log('微信支付')
            var url = port + '/MiniLife/api/goodsWxPay';

            wx.request({
              url: url,
              data: {
                openid: val,
                heji: that.data.aggregate_amount,
                // userName: res.userName,
                // address: that.data.provinceName + that.data.cityName + that.data.countyName + that.data.detailInfo,
                // telNumber: res.telNumber,
                shopping: JSON.stringify(updetails),
                formId: e.detail.formId
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
                // console.log(that.data.qianbao, that.data.heji)
                // 钱包支付
                if (+that.data.qianbao >= +that.data.aggregate_amount) {
                  console.log('钱包支付')

                  if (res.data === '支付成功') {
                    wx.showToast({
                      title: '支付成功',
                    })
                    wx.switchTab({
                      url: '/pages/market/market',
                      success: function (res) {
                        wx.showToast({
                          title: '购买成功',
                        })
                      }
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
                    wx.hideLoading()
                    //成功回调
                    wx.showToast({
                      title: '已提交！',
                    })
                    wx.switchTab({
                      url: '/pages/home/home',
                      success: function (res) {
                        wx.showToast({
                          title: '购买成功',
                        })
                      }
                    })
                  },
                  'fail': function (res) {
                    wx.hideLoading()
                    wx.showToast({
                      title: '取消支付',
                      icon:"none"
                    })
                    console.log(res)
                  },
                  'complete': function (res) {
                    console.log("支付发起！" + that.data)
                  }
                })
              }
            })
          }

          // ===================================
          // wx.request({
          //   url: 'https://www.imxsh.cn/MiniLife/api/goodsWxPay',
          //   data: {
          //     openid: val,
          //     heji:ss.data.heji,
          //     userName: res.userName,
          //     address: res.provinceName + res.cityName + res.countyName+res.detailInfo,
          //     telNumber: res.telNumber,
          //     shopping: JSON.stringify(ss.data.updetails)
          //   },
          //   method: "GET",
          //   success: function (res) {

          //     ss.setData({
          //       appId: res.data.appId,
          //       timeStamp: res.data.timeStamp,
          //       nonceStr: res.data.nonceStr,
          //       packages: res.data.package,
          //       signType: res.data.signType,
          //       paySign: res.data.paySign
          //     })

          //     wx.requestPayment({
          //       "timeStamp": ss.data.timeStamp,
          //       "nonceStr": ss.data.nonceStr,
          //       "package": ss.data.packages,
          //       "signType": 'MD5',
          //       "paySign": ss.data.paySign,
          //       success: function (res) {

          //         //成功回调
          //         wx.showToast({
          //           title: '已提交！',
          //         })
          //         wx.switchTab({
          //           url: '/pages/home/home',
          //         })
          //       },
          //       'fail': function (res) {

          //       },
          //       'complete': function (res) {

          //       }
          //     })
          //   }
          // })
      //   }
      // });
    }
  },
  


})

