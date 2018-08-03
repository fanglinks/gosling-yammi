// pages/movie/movie.js
var lock_user = require('../../utils/util.js')
Page({
  data: {
      movies:[
          { img: '/img/food/movie1.jpg', name: '超时空同居' },
          { img: '/img/food/movie2.jpg', name: '超时空同居'},
          { img: '/img/food/movie3.jpg', name: '超时空同居' },
          { img: '/img/food/movie4.jpg', name: '超时空同居' },
          { img: '/img/food/movie1.jpg', name: '超时空同居' },
          { img: '/img/food/movie2.jpg', name: '超时空同居' },
          { img: '/img/food/movie3.jpg', name: '超时空同居' },
      ],
      lists: [
          { store: '港轩茶餐厅' },
          { store: '港轩茶餐厅' },
          { store: '港轩茶餐厅' },
          { store: '港轩茶餐厅' },
          { store: '港轩茶餐厅' }
      ],
      foods: [
          { style: '快餐便当', menu: ['全部', '川香菜', '粤菜', '其他菜系', '火锅烤鱼'] },
          { style: '特色菜系', menu: ['粤菜', '客家菜', '潮菜', '湘菜'] },
          { style: '小吃夜宵', menu: ['春饼', '蚝洛', '菜头粿', '猪脚圈', '肠粉', '春饼', '蚝洛', '菜头粿', '猪脚圈'] },
          { style: '甜品饮品', menu: ['甜汤', '烧仙草', '双皮奶', '圣代'] },
          { style: '日本料理', menu: ['三文鱼', '鱼子酱', '海草', '拉面', '饭团'] },
          { style: '日本料理', menu: ['三文鱼', '鱼子酱', '海草', '拉面', '饭团'] },
          { style: '日本料理', menu: ['三文鱼', '鱼子酱', '海草', '拉面', '饭团'] },
          { style: '日本料理', menu: ['三文鱼', '鱼子酱', '海草', '拉面', '饭团'] },
          { style: '日本料理', menu: ['三文鱼', '鱼子酱', '海草', '拉面', '饭团'] },
          { style: '日本料理', menu: ['三文鱼', '鱼子酱', '海草', '拉面', '饭团'] },
          { style: '日本料理', menu: ['三文鱼', '鱼子酱', '海草', '拉面', '饭团'] },
          { style: '日本料理', menu: ['三文鱼', '鱼子酱', '海草', '拉面', '饭团'] },
      ],

      allnear: [
          '附近', '龙华区', '福田区', '南山区'
      ],
      near_mile: [
          '附近(智能范围)', '500m', '1000m', '2000m'
      ],

      allpink: [
          '智能排序', '距离优先', '人气优先', '好评优先', '口味最佳'
      ],

      food: false,
      near: false,
      pink: false,
      scrollTop:0
  },
  

  //<全部>选项
  food: function () {
      this.setData({
          near: false,
          pink: false,
          food: !this.data.food,
          scrollTop: this.data.scrollTop + 100
      })
  },

  Food: function (event) {
      console.log(event)
      var index = parseInt(event.currentTarget.dataset.index);
      this.setData({ current_id: index })
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
      console.log(event)
      var index = parseInt(event.currentTarget.dataset.index);
      this.setData({ current_id: index })
  },
  fujin: function (event) {
      console.log(event)
      var num = event.currentTarget.dataset.num;
      this.setData({ current_index: num })
  },

  //<智能排序>选项
  pink: function () {
      this.setData({
          food: false,
          near: false,
          pink: !this.data.pink
      })
  },
  Pink: function (event) {
      console.log(event)
      var index = parseInt(event.currentTarget.dataset.index);
      this.setData({ current_id: index })
  },

  // 蒙版事件
//   mengban: function () {
//       this.setData({
//           food: false,
//           near: false,
//           pink: false,
//       })
//   },



  onLoad: function (options) {
    //   var res = wx.getSystemInfoSync()
    //   console.log(res.screenHeight)
    //   var height = res.screenHeight * 2 - 320
    //   this.setData({
    //       height: height
    //   })
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
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
  onShareAppMessage: function () {
  
  },
  
})

