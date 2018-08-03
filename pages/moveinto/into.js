// pages/moveinto/into.js
var address = require('../../libs/city.js')
var app = getApp();
var port = getApp().globalData.port;
var lock_user = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 三级联动增加
    heiping: true,
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: '',
    sahnghuZhizhao: [],

    array1: ['线上', '线下'],
    index: 0,
    time: '00:00',
    timeend: '23:59',
    tishi: true,
    doorImg: '',
    logoImg: '',
    addres: '',
    unionid: '',
    openid: '',
    businessBegin: '',
    businessBegin2: '',
    merchant: {
    },
    array: ['美食', '酒店', '丽人', '健身', '超市', '医药', '家政', '超市', '配送', '男装', '女装', '3C', '快销', '美妆', '男鞋', '女鞋', '特产', '拼团', '箱包'],
  },
  // 商家分类
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮")
      console.log(res.target)
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

  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    console.log('111111111')
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },

  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
      this.setData({
        heiping: false
      })
    } else {
      that.animation.translateY(40 + 'vh').step()
      this.setData({
        heiping: true
      })
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },

  // 时间选择器
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value,
      businessBegin: e.detail.value
    })
    wx.setStorageSync(
      'time',
      e.detail.value,
    )
  },
  bindTimeChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeend: e.detail.value,
      businessBegin2: e.detail.value
    })
    wx.setStorageSync(
      'timeend',
      e.detail.value,
    )
  },


  // 坐标
  local: function (event) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var latitude = res.latitude.toFixed(5);
        var longitude = res.longitude.toFixed(5);
        var coordinate = latitude + " " + longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
          addres: coordinate
        })

        wx.setStorageSync(
          'latitude',
          latitude,
        )

        wx.setStorageSync(
          'longitude',
          longitude,
        )
        wx.setStorageSync(
          'addres',
          coordinate,
        )
      },
    })
  },

  // 图片上传(logo)
  uploadimg: function (event) {
    var COS = require("../../libs/upload.js");
    var config = {
      Bucket: 'mxsh-1256909128',
      Region: 'ap-guangzhou'
    };
    var that = this;
    // 初始化实例
    var cos = new COS({
      getAuthorization: function (params, callback) {
        var authorization = COS.getAuthorization({
          SecretId: 'AKIDrgNxNdJkXHtbDee0yoNn4A5tX0HQxI13',
          SecretKey: '4ygDh5NYihV8pMkxzqWCh2CF7oKfpocF',
          Method: params.Method,
          Key: params.Key
        });
        callback(authorization);
      }
    });

    var img = this;
    // 选择文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var filepath = res.tempFilePaths[0];
        var filename = filepath.substr(filepath.lastIndexOf('/') + 1);
        var ss = "https://mxsh-1256909128.cos.ap-guangzhou.myqcloud.com/";
        var sss = ss + filename;//完整图片路径]
        img.setData({
          logoImg: sss
        })
        that.setData({
          img: res.tempFilePaths,
        })

        wx.setStorageSync(
          'logoImg',
          sss,
        )
        wx.setStorageSync(
          'img',
          res.tempFilePaths,
        )

        console.log(res.tempFilePaths)
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: filename,
          FilePath: filepath,
          onProgress: function (info) {
            console.log(JSON.stringify(info));
          }
        }, function (err, data) {
          console.log(err || data);
        });
      }
    });
  },
  // 图片上传(产品)
  uploadimg2: function (event) {
    var COS = require("../../libs/upload.js");
    var config = {
      Bucket: 'mxsh-1256909128',
      Region: 'ap-guangzhou'
    };
    var that = this;
    // 初始化实例
    var cos = new COS({
      getAuthorization: function (params, callback) {
        var authorization = COS.getAuthorization({
          SecretId: 'AKIDrgNxNdJkXHtbDee0yoNn4A5tX0HQxI13',
          SecretKey: '4ygDh5NYihV8pMkxzqWCh2CF7oKfpocF',
          Method: params.Method,
          Key: params.Key
        });
        callback(authorization);
      }
    });

    // 选择文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var filepath = res.tempFilePaths[0];
        var filename = filepath.substr(filepath.lastIndexOf('/') + 1);
        var ss2 = "https://mxsh-1256909128.cos.ap-guangzhou.myqcloud.com/";
        ss2 = ss2 + filename;

        that.setData({
          img2: res.tempFilePaths,
          doorImg: ss2
        })
        wx.setStorageSync('doorImg',
          ss2,
        )
        wx.setStorageSync('img2',
          res.tempFilePaths,
        )

        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: filename,
          FilePath: filepath,
          onProgress: function (info) {
          }
        }, function (err, data) {
        });
      }
    });
  },
  // 同意协议
  agree: function () {
    console.log('111')
    this.setData({
      bgcolor: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      wx.setStorageSync('lock_openid', options.id)
      lock_user.lock_user()
    }
    var that = this
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
    })
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

    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    console.log(this.data)

    // 存储缓存数据
    this.setData({
      sjmc: wx.getStorageSync("sjmc"),
      sjxm: wx.getStorageSync("sjxm"),
      tel: wx.getStorageSync("tel"),
      mima: wx.getStorageSync("mima"),
      querenmima: wx.getStorageSync("querenmima"),
      sjsfz: wx.getStorageSync("sjsfz"),
      shanghuCardzheng: wx.getStorageSync("shanghuCardzheng"),
      imgzm: wx.getStorageSync("imgzm"),
      shanghuCardfan: wx.getStorageSync("shanghuCardfan"),
      imgbm: wx.getStorageSync("imgbm"),
      sahnghuZhizhao: wx.getStorageSync("sahnghuZhizhao"),
      imgzz: wx.getStorageSync("imgzz"),
      logoImg: wx.getStorageSync("logoImg"),
      img: wx.getStorageSync("img"),
      areaInfo: wx.getStorageSync("areaInfo"),
      latitude: wx.getStorageSync("latitude"),
      longitude: wx.getStorageSync("longitude"),
      addres: wx.getStorageSync('addres'),
      dizhi: wx.getStorageSync("dizhi"),
      time: wx.getStorageSync("time"),
      timeend: wx.getStorageSync("timeend"),
      doorImg: wx.getStorageSync("doorImg"),
      img2: wx.getStorageSync("img2"),
      sjjj: wx.getStorageSync("sjjj"),
      servers: wx.getStorageSync("servers"),
      tuijian: wx.getStorageSync("tuijian"),
      isSelected: wx.getStorageSync("isSelected"),
      index1: wx.getStorageSync("index1")
    })
  },



  // 提交
  addMerchant: function (e) {
    var that = this;
    var value = e.detail.value;
    var val = wx.getStorageSync("openid");
    value['sahnghuZhizhao'] = this.data.sahnghuZhizhao
    console.log(value)
    var formData = e.detail.value;



    // 判断是否填写商户名称
    if (!value.merchantName) {
      wx.showToast({
        title: '请填写商家名称',
        image: '/img/collect/warning.png'
      })
      this.setData({
        merchantName_focus: true,
      })
      return;
    }

    // 判断是否填写商户姓名
    if (!value.shanghuName) {
      wx.showToast({
        title: '请填写姓名',
        image: '/img/collect/warning.png'
      })
      this.setData({
        shanghuName_focus: true,
      })
      return;
    }

    // 判断是否填写商户电话
    if (!value.merchantPhone) {
      wx.showToast({
        title: '请填写手机号',
        image: '/img/collect/warning.png'
      })
      this.setData({
        merchantPhone_focus: true,
      })
      return;
    }

    // 判断是否填写登录密码
    if (!value.shanghuPassword) {
      wx.showToast({
        title: '请填写密码',
        image: '/img/collect/warning.png'
      })
      this.setData({
        shanghuPassword_focus: true,
      })
      return;
    }

    // 判断是否填写二次密码
    if (!value.password2) {
      wx.showToast({
        title: '请确认密码',
        image: '/img/collect/warning.png'
      })
      this.setData({
        password2_focus: true,
      })
      return;
    }

    // 判断是否填写身份证
    if (!value.shanghuIdcard) {
      wx.showToast({
        title: '请填写身份证',
        image: '/img/collect/warning.png'
      })
      this.setData({
        shanghuIdcard_focus: true,
      })
      return;
    }

    // 判断是否上传身份证正面
    if (!this.data.imgzm) {
      wx.showToast({
        title: '请上传身份证',
        image: '/img/collect/warning.png'
      })

      return;
    }

    // 判断是否上传身份证背面
    if (!this.data.imgbm) {
      wx.showToast({
        title: '请上传身份证',
        image: '/img/collect/warning.png'
      })

      return;
    }

    // 判断是否上传营业执照
    if (!this.data.imgzz) {
      wx.showToast({
        title: '请上传营业执照',
        image: '/img/collect/warning.png'
      })

      return;
    }

    // 判断是否选择商家类型
    if (!this.data.array1[this.data.index1]) {
      wx.showToast({
        title: '请选择商家类型',
        image: '/img/collect/warning.png'
      })
      return;
    }

    // 判断是否上传logo图/门店图
    if (!this.data.logoImg) {
      wx.showToast({
        title: '请上传品牌图',
        image: '/img/collect/warning.png'
      })
      return;
    }

    // 判断是否选择区域
    if (!value.merchantQuyu) {
      wx.showToast({
        title: '请选择所在区域',
        image: '/img/collect/warning.png'
      })
      return;
    }

    // 判断是否选择坐标
    if (!value.merchantZuobiao) {
      wx.showToast({
        title: '请选择坐标',
        image: '/img/collect/warning.png'
      })
      return;
    }

    // 判断是否填写详细地址
    if (!value.merchantAddress) {
      wx.showToast({
        title: '请填写详细地址',
        image: '/img/collect/warning.png'
      })
      this.setData({
        merchantAddress_focus: true
      })
      return;
    }



    // 判断是否填写推荐人
    if (!value.tuijianPhone) {
      wx.showToast({
        title: '请填写推荐人',
        image: '/img/collect/warning.png'
      })
      this.setData({
        tuijianPhone_focus: true
      })
      return;
    }

    // 判断是否勾选协议
    if (!this.data.isSelected) {
      wx.showToast({
        title: '请勾选协议',
        image: '/img/collect/warning.png'
      })
      return;
    }

    // 判断两次密码是否一致
    if (value.shanghuPassword != value.password2) {
      wx.showToast({
        title: '密码不一致',
        image: '/img/collect/warning.png'
      })
      this.setData({
        shanghuPassword_focus: true
      })
      return;
    }

    if(this.data.userType != "梦想创客") {
      wx.navigateTo({
        url: '/pages/chuangke/chuangke?pages=' + true,
      })

      return;
    }


    if (value.merchantName && value.shanghuName && value.merchantPhone && value.shanghuPassword && value.password2 && value.shanghuIdcard && that.data.isSelected && that.data.logoImg && value.merchantQuyu && value.merchantAddress && value.tuijianPhone && that.data.imgzm && that.data.imgbm && that.data.imgzz && that.data.array1[that.data.index1] && value.merchantZuobiao) {
      console.log('进入了提交表单')
      that.setData({
        tishi: true
      })
      that.setData({
        tishi: true
      })
      wx.showLoading({
        title: '提交中...',
        mask: true
      })
      // var val = wx.getStorageSync("openid")
      formData['openId'] = val;
      formData['userUnionId'] = wx.getStorageSync("unionid")
      wx.request({
        url: port + '/MiniLife/commercial/input',
        data: formData,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'post',
        success: function (cs) {
          if (cs.data == "SUCCESS") {
            wx.hideLoading();
            wx.showToast({
              title: '已提交申请！',
            })
            wx.switchTab({
              url: '/pages/wede/wode',
            })
          } else {
            wx.hideLoading();
            wx.showModal({

              title: '提示',
              content: cs.data,
            })
          }
        }
      })
    }
    else {
      that.setData({
        tishi: false
      })
    }
    // 支付99元
    // wx.request({
    //   url: port + "/MiniLife/api/wxPay",
    //   data: {
    //     openid: val,
    //     fee: "99"
    //   },
    //   method: 'GET',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       appId: res.data.appId,
    //       timeStamp: res.data.timeStamp,
    //       nonceStr: res.data.nonceStr,
    //       packages: res.data.package,
    //       signType: res.data.signType,
    //       paySign: res.data.paySign
    //     })
    //     wx.requestPayment({
    //       "timeStamp": that.data.timeStamp,
    //       "nonceStr": that.data.nonceStr,
    //       "package": that.data.packages,
    //       "signType": 'MD5',
    //       "paySign": that.data.paySign,
    //       success: function (res) {
    //         console.log("支付成功！")
    //         // wx.switchTab({
    //         //   url: '/pages/wede/wode',
    //         //   success: function (e) {
    //         //     var page = getCurrentPages().pop();
    //         //     if (page == undefined || page == null) return;
    //         //     page.onLoad();
    //         //     wx.showModal({
    //         //       title: '尊敬的创客',
    //         //       content: '恭喜您开通创客成功',
    //         //       showCancel: false,
    //         //       confirmText: '我知道了'
    //         //     })
    //         //   }
    //         // })
            

    //       },
    //       'fail': function (res) {
    //         wx.showModal({
    //           title: '提示',
    //           content: "支付失败请重试！",
    //         })
    //         that.setData({
    //           agree: true,
    //           paytext: false
    //         })
    //       },
    //       'complete': function (res) {
    //         wx.hideLoading()
    //         console.log("支付发起！" + that.data)
    //       }
    //     })
    //   }
    // });


    // ++++++++++++++++++++++++++++++++++++++++++++==


    // 线下判断代码
    // console.log(value.merchantName , value.shanghuName , value.merchantPhone , value.shanghuPassword , value.password2 , value.shanghuIdcard , this.data.isSelected , this.data.logoImg, value.merchantQuyu , value.merchantAddress , value.tuijianPhone ,this.data.imgzm , this.data.imgbm , this.data.imgzz , this.data.array1[this.data.index1])




  },
  // 线上线下选择
  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value,
      leixing: true,
    })
    wx.setStorageSync('index1', +e.detail.value)
    console.log(this.data.index1 === '0')
    if (this.data.index1 === '0') {
      this.setData({
        isOnline: true,
      })
    }
    else {
      this.setData({
        isOnline: false,
      })
    }
  },




  // 身份证
  sjsfz: function (e) {
    var input = e.detail.value;
    this.setData({
      sjsfz: input
    })
  },

  // 商家分类
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      fenlei: true,
    })
    wx.setStorageSync('sjfl',
      e.detail.value,
    )
  },
  // 身份证正面
  uploadimgzm: function (event) {
    var COS = require("../../libs/upload.js");
    var config = {
      Bucket: 'mxsh-1256909128',
      Region: 'ap-guangzhou'
    };
    var that = this;
    // 初始化实例
    var cos = new COS({
      getAuthorization: function (params, callback) {
        var authorization = COS.getAuthorization({
          SecretId: 'AKIDrgNxNdJkXHtbDee0yoNn4A5tX0HQxI13',
          SecretKey: '4ygDh5NYihV8pMkxzqWCh2CF7oKfpocF',
          Method: params.Method,
          Key: params.Key
        });
        callback(authorization);
      }
    });

    // 选择文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var filepath = res.tempFilePaths[0];
        var filename = filepath.substr(filepath.lastIndexOf('/') + 1);
        var ss2 = "https://mxsh-1256909128.cos.ap-guangzhou.myqcloud.com/";
        ss2 = ss2 + filename;
        that.setData({
          imgzm: res.tempFilePaths,
          shanghuCardzheng: ss2
        })
        // 缓存身份证正面照
        wx.setStorageSync('shanghuCardzheng',
          ss2,
        )

        wx.setStorageSync('imgzm',
          res.tempFilePaths,
        )
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: filename,
          FilePath: filepath,
          onProgress: function (info) {
          }
        }, function (err, data) {
        });
      }
    });
  },
  // 身份证背面
  uploadimgbm: function (event) {
    var COS = require("../../libs/upload.js");
    var config = {
      Bucket: 'mxsh-1256909128',
      Region: 'ap-guangzhou'
    };
    var that = this;
    // 初始化实例
    var cos = new COS({
      getAuthorization: function (params, callback) {
        var authorization = COS.getAuthorization({
          SecretId: 'AKIDrgNxNdJkXHtbDee0yoNn4A5tX0HQxI13',
          SecretKey: '4ygDh5NYihV8pMkxzqWCh2CF7oKfpocF',
          Method: params.Method,
          Key: params.Key
        });
        callback(authorization);
      }
    });

    // 选择文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var filepath = res.tempFilePaths[0];
        var filename = filepath.substr(filepath.lastIndexOf('/') + 1);
        var ss2 = "https://mxsh-1256909128.cos.ap-guangzhou.myqcloud.com/";
        ss2 = ss2 + filename;
        that.setData({
          imgbm: res.tempFilePaths,
          shanghuCardfan: ss2
        })
        wx.setStorageSync('shanghuCardfan',
          ss2,
        )
        wx.setStorageSync('imgbm',
          res.tempFilePaths
        )
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: filename,
          FilePath: filepath,
          onProgress: function (info) {
          }
        }, function (err, data) {
        });
      }
    });
  },

  // 资质照片
  uploadimgzz: function (event) {
    var COS = require("../../libs/upload.js");
    var config = {
      Bucket: 'mxsh-1256909128',
      Region: 'ap-guangzhou'
    };
    var that = this;
    // 初始化实例
    var cos = new COS({
      getAuthorization: function (params, callback) {
        var authorization = COS.getAuthorization({
          SecretId: 'AKIDrgNxNdJkXHtbDee0yoNn4A5tX0HQxI13',
          SecretKey: '4ygDh5NYihV8pMkxzqWCh2CF7oKfpocF',
          Method: params.Method,
          Key: params.Key
        });
        callback(authorization);
      }
    });

    // 选择文件
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var count = res.tempFilePaths.length;
        for (var i = 0; i < count; i++) {
          var filepath = res.tempFilePaths[i];
          var filename = filepath.substr(filepath.lastIndexOf('/') + 1);
          var ss2 = "https://mxsh-1256909128.cos.ap-guangzhou.myqcloud.com/";
          var ss3 = ss2 + filename;
          var sahnghuZhizhao = 'sahnghuZhizhao' + '[' + i + ']';
          that.setData({
            imgzz: res.tempFilePaths,
            [sahnghuZhizhao]: ss3,
            // [tuku]: ss2
          })
          wx.setStorageSync('sahnghuZhizhao',
            that.data.sahnghuZhizhao,
          )
          wx.setStorageSync('imgzz',
            res.tempFilePaths
          )
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: filename,
            FilePath: filepath,
            onProgress: function (info) {
            }
          }, function (err, data) {
          });
        }
      }
    });
  },
  // 是否勾选协议
  xieyi: function () {
    if (!this.data.isSelected) {
      this.setData({
        isSelected: true
      })
      wx.setStorageSync('isSelected',
        true,
      )
    }
    else {
      this.setData({
        isSelected: false
      })
      wx.setStorageSync('isSelected',
        false,
      )
    }
  },
  // 点击协议
  read: function () {
    wx.navigateTo({
      url: '/pages/protocol/protocol',
    })
  },
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
    })
    wx.setStorageSync('areaInfo',
      areaInfo,
    )
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
  },


  // 失去焦点时将值缓存
  sjmc: function (e) {
    console.log(e.detail.value)
    wx.setStorageSync('sjmc',
      e.detail.value,
    )
  },

  sjxm: function (e) {
    console.log(e.detail.value)
    wx.setStorageSync('sjxm',
      e.detail.value,
    )
  },

  tel: function (e) {
    console.log(e.detail.value)
    wx.setStorageSync('tel',
      e.detail.value,
    )
  },

  mima: function (e) {
    console.log(e.detail.value)
    wx.setStorageSync('mima',
      e.detail.value,
    )
    this.setData({
      mima: e.detail.value,
    })
  },

  // 确认密码
  querenmima: function (e) {
    var input = e.detail.value;
    this.setData({
      password2: input
    })
    wx.setStorageSync('querenmima',
      e.detail.value,
    )
    if (this.data.password2 != this.data.mima) {
      wx.showToast({
        title: '两次密码输入不一致，请重新输入',
        icon: 'none',
        duration: 2000
      })

    }
  },

  sjsfz: function (e) {
    console.log(e.detail.value)
    wx.setStorageSync('sjsfz',
      e.detail.value,
    )
  },
  // 详细地址
  dizhi: function (e) {
    var dizhi = e.detail.value;
    wx.setStorageSync('dizhi',
      dizhi,
    )
  },
  // 商家简介
  sjjj: function (e) {
    var sjjj = e.detail.value;
    wx.setStorageSync('sjjj',
      sjjj,
    )
  },
  // 提供服务
  servers: function (e) {
    var servers = e.detail.value;
    wx.setStorageSync('servers',
      servers,
    )
  },
  // 推荐人手机号
  tuijian: function (e) {
    var tuijian = e.detail.value;
    wx.setStorageSync('tuijian',
      tuijian,
    )
  },

  onShow: function() {
    var that = this;
    var val = wx.getStorageSync("openid")
    wx.request({
      url: port + '/MiniLife/user/getUserInfo',
      data: {
        openid: val,
      },
      success: function (res) {
        var types = res.data.userType
        that.setData({
          'userInfo': res.data
        })
        if (types == "chuangke") {
          that.setData({
            userType: "梦想创客",
            chuangkeType: true
          })
        } else if (types == "users") {
          that.setData({
            userType: "普通用户",
          })

        } else if (types == "prox") {
          that.setData({
            userType: "区域代理",
          })
        } else {
          that.setData({
            userType: "普通用户",
          })
        }
      }
    }) 
  },
})