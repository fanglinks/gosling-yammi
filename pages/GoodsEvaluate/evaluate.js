// pages/GoodsEvaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starlist1:[1,1,1,1,1],
    starlist2:[1,1,1,1,1,],
    starlist3:[1,1,1,1,1,],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

 // 好评
  goodEvaluate: function() {
    this.setData({
      goodEvaluate: true,
      narmalEvaluate: false,
      badEvaluate: false,
    })
  },

  // 中评
  narmalEvaluate: function () {
    this.setData({
      goodEvaluate: false,
      narmalEvaluate: true,
      badEvaluate: false,
    })
  },

  // 差评
  badEvaluate: function () {
    this.setData({
      goodEvaluate: false,
      narmalEvaluate: false,
      badEvaluate: true,
    })
  },


 
})