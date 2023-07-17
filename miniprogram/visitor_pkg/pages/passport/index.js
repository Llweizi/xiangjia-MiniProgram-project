import { getToken } from '../../../utils/getToken'
Page({
  data: {
    // 访客详情数据
    passport: {},
  },
  async saveQRCode() {
    // 获取网络图片信息
    const res = await wx.getImageInfo({
      src: this.data.passport.url,
    })
    console.log('二维码', res)
    // 下载网络图片到本地
    wx.saveImageToPhotosAlbum({
      filePath: res.path
    })
  },
   // 访客（非登录用户）获取访客详情
   getSharePassport(encryptedData) {
    wx.request({
      url: `https://live-api.itheima.net/visitor/share/${encryptedData}`,
      method: 'GET',
      // 访客访问详情不要token
      success: (res) => {
        console.log('访客（非登录用户）res', res)
        if (res.data.code !== 10000) {
          return wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        // 设置页面数据，如果是访客获取到的详情没有 encryptedData
        this.setData({
          passport: res.data.data
        })
      }
    })
  },
  onLoad(options) {
    // 业主访问：访客邀请创建成功时会传递id
    if (options.id) {
      this.getPassport(options.id)
    }

    // 访客访问：访客访问是获取访客详情
    if (options.encryptedData) {
      this.getSharePassport(options.encryptedData)
    }
  },
   // 获取访客详情
   getPassport(id) {
    wx.request({
      url: `https://live-api.itheima.net/visitor/${id}`,
      method: 'GET',
      header: {
        Authorization: 'Bearer ' + getToken()
      },
      success: (res) => {
        console.log('访客详情res', res)
        if (res.data.code !== 10000) {
          return wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        // 设置页面数据
        this.setData({
          passport: res.data.data
        })
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '查看通行证',
      path: `/visitor_pkg/pages/passport/index?encryptedData=${this.data.passport.encryptedData}`,
      imageUrl: 'https://enjoy-plus.oss-cn-beijing.aliyuncs.com/images/share_poster.png',
    }
  },
})
