var app = getApp();
var port = getApp().globalData.port
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

// 全局锁粉js
function lock_user() {
  // 满足条件执行锁粉
  console.log(wx.getStorageSync("openid"), wx.getStorageSync('lock_openid'))
  // var dingshiqi = setInterval(function () {
    
  if (wx.getStorageSync("openid") && wx.getStorageSync('lock_openid') && wx.getStorageSync("openid") != wx.getStorageSync('lock_openid')) {
    // clearInterval(dingshiqi)
  console.log('即将进入锁定代码')
    wx.request({
      url: port + "/MiniLife/user/lockingUser",
      data: {
        openid: wx.getStorageSync('lock_openid'),
        lockopenid: wx.getStorageSync("openid"),
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
      }
    })
    return;
  }
// }, 1000);
}
module.exports = {
  lock_user: lock_user
}
