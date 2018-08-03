// pages/order/order.js
var app = getApp();
var port = getApp().globalData.port
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wuliuinfo:true,
    openid:"",
    changepage: {
      first: false,
      second: true,
      third: true,
      fourth: true,
      fifth: true,
      
    },
    isChecked1: true,
  },
  // 待付款
  payment: function (event) {
    this.setData({
      changepage: {
        first: false,
        second: true,
        third: true,
        fourth: true,
        fifth: true
      },
      isChecked1: true,
      isChecked2: false,
      isChecked3: false,
      isChecked4: false,
      isChecked5: false
    })
    var that=this
    wx.request({
      url: port + '/MiniLife/selectGoodsPinJ',
      data: {
        status:"0",
        openid: wx.getStorageSync("openid"),
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setData({
          daifukuan: res.data
        })
      }
    })

  },
  // 待发货
  fahuo: function (event) {
    var that=this
    this.setData({
      changepage: {
        first: true,
        second: false,
        third: true,
        fourth: true,
        fifth: true
      },
      isChecked1: false,
      isChecked2: true,
      isChecked3: false,
      isChecked4: false,
      isChecked5: false
    })

    wx.request({
      url: port + '/MiniLife/selectGoodsPinJ',
      data: {
        status: "1",
        openid: wx.getStorageSync("openid"),
      },
      method: 'GET',
      success: function (res) {

        that.setData({
          daifahuo: res.data
        })
        console.log(res.data)
      }
    })
  },
  // 待收货
  // shouhuo: function (event) {
  //   this.setData({
  //     changepage: {
  //       first: true,
  //       second: true,
  //       third: false,
  //       fourth: true,
  //       fifth: true
  //     },
  //     isChecked1: false,
  //     isChecked2: false,
  //     isChecked3: true,
  //     isChecked4: false,
  //     isChecked5: false
  //   })
  //   this.getByType();
  // },
  pingjia: function (event) {
    var that=this
    this.setData({
      changepage: {
        first: true,
        second: true,
        third: true,
        fourth: false,
        fifth: true
      },
      isChecked1: false,
      isChecked2: false,
      isChecked3: false,
      isChecked4: true,
      isChecked5: false
    })
    wx.request({
      url: port +'/MiniLife/selectGoodsPinJ',
      data: {
        status:"3",
        openid: wx.getStorageSync("openid"),
      },
      method: 'GET',
      success: function (res) {

        that.setData({
          pingjia: res.data
        })
      }
    })
  },
// 退出查看物流
  tuichu: function() {
    this.setData({
      wuliuinfo:true,
    })
  },
  // 待收货
  shouhuo: function (event) {
    var that=this
    this.setData({
      changepage: {
        first: true,
        second: true,
        third: false,
        fourth: true,
        fifth: true
      },
      isChecked1: false,
      isChecked2: false,
      isChecked3: true,
      isChecked4: false,
      isChecked5: false
    })
    wx.request({
      url: port + '/MiniLife/selectGoodsPinJ',
      data: {
        status: "2",
        openid: wx.getStorageSync("openid"),
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setData({
          shouhuo: res.data
        })
        for(var i = 0; i < res.data.length; i ++) {
          that.data.shouhuo[i].createtime = that.data.shouhuo[i].createtime.slice(0,10)
          that.setData({
            shouhuo: that.data.shouhuo,
          })
        }
        console.log(that.data.shouhuo)
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮")

    }
    return {
      title: '梦想生活',
      path: '/pages/home/home?id=' + wx.getStorageSync("openid"),
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

  // 查看物流
  wuliu: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.id;
    var urltype = 'https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=' + that.data.shouhuo[index].remark
    // 查询物流属于哪家快递公司
    wx.request({
      url: urltype,
      success:function(res) {
        console.log(res.data.auto[0].comCode)
        that.setData({
          wuliutype: res.data.auto[0].comCode
        })
        //  查询快递信息
        var url = 'https://www.kuaidi100.com/query?type=' + that.data.wuliutype + '&postid=' + that.data.shouhuo[index].remark;
        console.log(index, url)
        wx.request({
          url: url,
          success: function (res) {
            if (res.data) {
              that.setData({
                wuliu: res.data.data
              })
              console.log(that.data.wuliu)
              wx.navigateTo({
                url: '/pages/wuliu/wuliu?wuliuinfo=' + JSON.stringify(that.data.wuliu) + '&wuliutype=' + that.data.wuliutype + '&dingdan=' + that.data.shouhuo[index].remark,
              })
            }
            else {
              wx.showToast({
                title: '暂无物流信息，请稍后重试',
              })
            }


          }
        })

      }
    })
    
    
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // wx.showLoading({
    //   title: '加载中',
    //   mask:true,
    // })
    if (options) {
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
            },
            file:function() {
            }
          })
        }
      }, 1000);
    }
    // 请求待付款数据
    wx.request({
      url: port + '/MiniLife/selectGoodsPinJ',
      data: {
        status: "0",
        openid: wx.getStorageSync("openid"),
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          daifukuan: res.data
        })
      },
      file:function() {
        console.log('加载失败')
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

    this.onLoad()
    this.payment();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 点击确认收获
  confirmGoods: function (e) {
    wx.showLoading({
      title: '玩命加载...',
    })
    var val = wx.getStorageSync("openid")
   var ss= e.currentTarget.dataset.ddid
   var s2 = e.currentTarget.dataset.foodid

    wx.request({ 
      url: port + '/MiniLife/user/userSureOrder',
      data: {
        id:s2,
        openid: val,
        orderid:ss
      },
      success: resData => {

        wx.hideLoading();
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    })
  },
  getByType: function () {
    var that = this;
    wx.showLoading();
    var val = wx.getStorageSync("openid")
    wx.request({
      url: port + '/MiniLife/api/getPreListOrder',
      data: {
        // 'status': num,
        'openId': val
      },
      success: resData => {
        that.setData({ 
          detail: resData.data 
          });

        wx.hideLoading();
      }
    })
  },
  kaifa:function(){
    wx.showToast({
      icon:"none",
      title: '正在开发...',
    })
  },
  tixing:function(){
    wx.showToast({
      title: '已提醒！',
    })
  },
  cancalOrder:function(e){
    var id = e.currentTarget.dataset.cancalorder
    var orderid = e.currentTarget.dataset.orderid
    wx.request({
      url: port + '/MiniLife/api/cancalOrder',
      data: {
        'id': id,
        "orderid": orderid
      },
      success: resData => {
        if (resData.data=="1"){
          wx.showToast({
            title: '已取消！'
          })
          this.payment()
        }else{
          wx.showToast({
            title: '取消失败！'
          })
        }
      }
    })
  },
  // 跳转详情页
  doDetail: function (e) {
    // 要把数据调整为详情页进入订单页时的数据
    var that = this;
    var index = e.currentTarget.dataset.id;

    console.log(that.data.daifukuan[index])
    var isTwo = that.data.daifukuan[index].canShu.indexOf(' ')
    if (isTwo != -1) {
      this.data.daifukuan[index].canshu1 = that.data.daifukuan[index].canShu.split(' ')[0]
      this.data.daifukuan[index].canshu2 = that.data.daifukuan[index].canShu.split(' ')[1]
    }
    else if (that.data.daifukuan[index].canShu != '无参数商品') {
      this.data.daifukuan[index].canshu1 = that.data.daifukuan[index].canShu
      this.data.daifukuan[index].canshu2 = '无'
    }
    else {
      this.data.daifukuan[index].canshu1 = '无'
      this.data.daifukuan[index].canshu2 = '无'
    }
    console.log(that.data.daifukuan[index].canShu.indexOf(' '))
    console.log(that.data.daifukuan[index].canShu.split(' '))
    wx.request({
      url: port + '/MiniLife/getDetail',
      data: {
        'foodId': that.data.daifukuan[index].goodsid
      },
      success: resData => {
        that.setData({
          'details': resData.data,
        });
        console.log(that.data.details)
        this.data.details['canshu1'] = that.data.daifukuan[index].canshu1;
        this.data.details['canshu2'] = that.data.daifukuan[index].canshu2;
        this.data.details['num'] = that.data.daifukuan[index].counts;
        this.data.details['foodPrice'] = that.data.daifukuan[index].price;
        var newdetail = JSON.stringify(that.data.details).replace(/=/g, '!LOCK')
        // var newdetail = newdetail.replace(/?/g, '!LOCK')
        console.log(newdetail)
        wx.navigateTo({
        //  url: '/pages/market/dingdan/dingdan?goodsinfo=' + newdetail,
        //START add by tzm 20180531
        //代付款订单---前去付款    
          url: '/pages/market/mydingdan/dingdan?goodsinfo=' + newdetail,
          //END
        })
      }
    })
    
  },

  // 点击号码拨打电话
  call: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.id;
    wx.makePhoneCall({
      phoneNumber: that.data.daifahuo[index].phone
    })
  },
})
