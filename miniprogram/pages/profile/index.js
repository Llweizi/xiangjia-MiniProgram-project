// 获取用户信息
import { getUserInfo } from '../../utils/getUserInfo'
import { getToken } from '../../utils/getToken'
import { setUserInfo } from '../../utils/setUserInfo'
Page({
  data: {
    // 用户信息数据变量
    userInfo: null
  },
   // 微信用户昵称blur事件处理函数
   handleNickNameBlur(e) {
    console.log('nickname blur 事件对象: ', e)
    // 更新用户昵称
    wx.request({
      url: 'https://live-api.itheima.net/userInfo',
      method: 'PUT',
      header: {
        Authorization: 'Bearer ' + getToken()
      },
      data: {
        nickName: e.detail.value.trim()
      },
      success: (res) => {
        console.log('更新用户昵称res', res)
        if (res.data.code !== 10000) {
          return wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        // 获取之前保存的用户信息
        const userInfo = getUserInfo()
        // 将新的用户信息保存到本地
        console.log('保存新的用户信息到本地')
        setUserInfo({ ...userInfo, nickName: e.detail.value.trim() })
      }
    })
  },  handleChooseAvatar(e) {
    console.log('chooseAvatar', e)
    wx.uploadFile({
      filePath: e.detail.avatarUrl,
      header: {
        Authorization: 'Bearer ' + getToken()
      },
      name: 'file',
      url: 'https://live-api.itheima.net/upload',
      formData: {
        type: 'avatar'
      },
      success: (res) => {
        console.log('图片上传res', res)
        console.log('解析数据', JSON.parse(res.data))
        const parsedData = JSON.parse(res.data)
        if (parsedData.code !== 10000) {
          return wx.showToast({
            title: parsedData.message,
            icon: 'none'
          })
        }
        // 更新本地和页面数据
        // 1、保存用户信息到本地
        const userInfo = getUserInfo() // 先读取
        setUserInfo({ ...userInfo, avatar: parsedData.data.url }) // 再更新
        // 2、设置页面数据
        this.setData({
          userInfo: getUserInfo()
        })
      }
    })
  },
  onShow() {
    // 设置用户信息
    this.setData({
      userInfo: getUserInfo()
    })
  }
})