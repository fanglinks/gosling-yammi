var app = getApp();
Page({
  data: {
    currentDate: "2017年05月03日",
    dayList: '',
  currentDayList: '',
  currentObj: '',
  currentDay: '',

  //日期初始化选中样式
  selectCSS: 'bkcolorday',
    },
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var currentObj = this.getCurrentDayString()
    this.setData({
      currentDate: currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate(),
            currentDay: currentObj.getDate(),
      currentObj: currentObj,
      /*  获取当前的年、月  */
      currentYear: currentObj.getFullYear(),
      currentMonth: (currentObj.getMonth() + 1),
      // 存储到底是哪个页面
      page: options.page
        })
this.setSchedule(currentObj);
    },
doDay: function (e) {
  var that = this;
  console.log(e);

  var currentObj = that.data.currentObj
  var Y = currentObj.getFullYear();
  var m = currentObj.getMonth() + 1;
  var d = currentObj.getDate();
  var str = ''
  if (e.currentTarget.dataset.key == 'left') {
    m -= 1
    if (m <= 0) {
      str = (Y - 1) + '/' + 12 + '/' + d
    } else {
      str = Y + '/' + m + '/' + d
    }
  } else {
    m += 1
    if (m <= 12) {
      str = Y + '/' + m + '/' + d
    } else {
      str = (Y + 1) + '/' + 1 + '/' + d
    }
  }
  currentObj = new Date(str)
  this.setData({
    currentDate: currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate(),
            currentObj: currentObj,
    /*  获取当前的年、月  */
    currentYear: currentObj.getFullYear(),
    currentMonth: (currentObj.getMonth() + 1),
        })
console.log("选择当前年：" + that.data.currentYear);
console.log("选择当前月：" + that.data.currentMonth);
this.setSchedule(currentObj);
    },
getCurrentDayString: function () {
  var objDate = this.data.currentObj
  if (objDate != '') {
    return objDate
  } else {
    var c_obj = new Date()
    var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
    return new Date(a)
  }
},
setSchedule: function (currentObj) {
  console.log(currentObj);
  var that = this
  var m = currentObj.getMonth() + 1
  var Y = currentObj.getFullYear()
  var d = currentObj.getDate();
  var dayString = Y + '/' + m + '/' + currentObj.getDate()
  var currentDayNum = new Date(Y, m, 0).getDate()
  var currentDayWeek = currentObj.getUTCDay() + 1
  var result = currentDayWeek - (d % 7 - 1);
  var firstKey = result <= 0 ? 7 + result : result;
  var currentDayList = [];
  var f = 0
  for (var i = 0; i < 42; i++) {
    let data = []
    if (i < firstKey - 1) {
      currentDayList[i] = ''
    } else {
      if (f < currentDayNum) {
        currentDayList[i] = f + 1;
        f = currentDayList[i]
      } else if (f >= currentDayNum) {
        currentDayList[i] = ''
      }
    }
  }
  that.setData({
    currentDayList: currentDayList
  })
},

//选择具体日期方法--xzz1211
selectDay: function(e) {
  var that = this;
  var a = new Date();
  // a = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate() + " " + a.getHours() + ":" + a.getMinutes();
  console.log(a);
  console.log(that.data.currentYear, a.getFullYear())
  if (that.data.currentYear < a.getFullYear() || that.data.currentYear === a.getFullYear() && that.data.currentMonth < (a.getMonth() + 1) || that.data.currentMonth === (a.getMonth() + 1) && e.target.dataset.day < a.getDate()) {
    console.log('时间选错了')
    wx.showToast({
      title: '您无法穿越时间',
      icon: 'none'
    })
    return;
  }
  
  if (!that.data.entercurrentDate) {
  that.setData({
    currentDay: e.target.dataset.day,//选择的数据，非真实当前日期
    currentDa: e.target.dataset.day, //选择某月具体的一天
    entercurrentYear: that.data.currentYear,
    entercurrentMonth: that.data.currentMonth,
    entercurrentday: e.target.dataset.day,
    entercurrentDate: that.data.currentYear + '/' + that.data.currentMonth + '/' + e.target.dataset.day,// 真实选择数据
      })
    }

else {

    if (that.data.currentYear < that.data.entercurrentYear || (that.data.currentYear === that.data.entercurrentYear) && that.data.currentMonth < that.data.entercurrentMonth || that.data.currentMonth === that.data.entercurrentMonth && e.target.dataset.day < that.data.entercurrentday) {
      wx.showToast({
        title: '离店时间需在入住之后',
        icon: 'none',
      })
      return;
    }
  that.setData({
    currentDay: e.target.dataset.day,//选择的数据，非真实当前日期
    currentDa: e.target.dataset.day,
    leavecurrentDate: that.data.currentYear + '/' + that.data.currentMonth + '/' + e.target.dataset.day,
  })
}
},

// 重选
  reserve: function() {
    this.setData({
      entercurrentDate:'',
      leavecurrentDate: '',
    })
  },

  // 确定
  ensure: function () {
    var that = this;
    if (that.data.entercurrentDate && that.data.leavecurrentDate) {
      if(that.data.page ==='detail') {
        wx.redirectTo({
          url: '/pages/hotel/hoteldetail/detail?enter=' + that.data.entercurrentDate + '&leave=' + that.data.leavecurrentDate,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }

      else {
        wx.redirectTo({
          url: '/pages/hotel/hotel?enter=' + that.data.entercurrentDate + '&leave=' + that.data.leavecurrentDate,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }
    else {
      wx.showToast({
        title: '请正确填写入住和离开时间',
        icon: 'none',
      })
    }
    
  },
})