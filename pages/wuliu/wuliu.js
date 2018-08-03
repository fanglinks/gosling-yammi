// pages/wuliu/wuliu.js
var app = getApp();
var port = getApp().globalData.port
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wuliuinfo: JSON.parse(options.wuliuinfo),
      dingdan:options.dingdan
    })
    if (options.wuliutype === 'yunda') {
      this.setData({
        wuliutype: '韵达',
        wuliuimg:'/img/wuliu/yd.gif',
        telephone:'95546'
      })
    }
    else if (options.wuliutype === 'zhongtong') {
      this.setData({
        wuliutype: '中通',
        wuliuimg: '/img/wuliu/zt.gif',
        telephone: '95311/4008-270-270'
      })
    }
    else if (options.wuliutype === 'yuantong') {
      this.setData({
        wuliutype: '园通',
        wuliuimg: '/img/wuliu/yt.gif',
        telephone: '95554'
      })
    }
    else if (options.wuliutype === 'shunfeng') {
      this.setData({
        wuliutype: '顺丰',
        wuliuimg: '/img/wuliu/sf.gif',
        telephone: '95338'
      })
    }
    else if (options.wuliutype === 'shentong') {
      this.setData({
        wuliutype: '申通',
        wuliuimg: '/img/wuliu/st.gif',
        telephone: '95543'
      })
    }
    else if (options.wuliutype === 'tiantian') {
      this.setData({
        wuliutype: '天天',
        wuliuimg: '/img/wuliu/tt.gif',
        telephone: '4001-888-888'
      })
    }
    else if (options.wuliutype === 'ems') {
      this.setData({
        wuliutype: 'EMS',
        wuliuimg: '/img/wuliu/ems.gif',
        telephone: '11183'
      })
    }
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
  // onShareAppMessage: function () {
  
  // }
})