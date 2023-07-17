import { getToken } from '../../../utils/getToken'
Page({
  data: {    // 社区名称
    street: '',
    // 楼/栋
    building: '',
    // 房间号
    room: '',
      // 房主姓名
      name: '',
      // 房主性别
      gender: '1',
      // 房主手机号
      mobile: '',
    idcardFrontUrl: '/static/images/avatar_1.jpg',
    idcardBackUrl: '/static/images/avatar_2.jpg',
  }, // 提交审核事件处理函数
  handleHouseSubmit() {
    console.log('提交房屋审核数据', this.data)
  // 表单数据校验
  if (this.validateHouseData(this.data)) {
    console.log('准备提交表单', this.data)
    // 复制data
    const data = { ...this.data }
    // 添加服务器需要的 point 的字段
    data.point = data.street
    // 删除无用属性
    delete data.street
    delete data.__webviewId__
    console.log('整理后的数据', data)
    wx.request({
      url: 'https://live-api.itheima.net/room',
      method: 'POST',
      header: {
        Authorization: 'Bearer ' + getToken()
      },
      data: data,
      success: (res) => {
        console.log('添加房屋表单提交成功结果', res)
        if (res.data.code !== 10000) {
          return wx.showToast({
            title: res.data.message,
          })
        }
        // 返回到我的房屋页面
        // 导航到之前页面，向前导航4次。
        wx.navigateBack({ delta: 4 })
      }
    })
  }
  },

  // 房屋表单数据校验
  validateHouseData(data) {
    console.log('房屋表单数据校验', data)
    // 姓名校验：空-长度-汉字
    if (!data.name.trim()) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return false
    }
    const nameReg = /^[\u4e00-\u9fa5]{2,5}$/
    if (!nameReg.test(data.name.trim())) {
      wx.showToast({
        title: '姓名格式错误',
        icon: 'none'
      })
      return false
    }
    // 手机号校验：空-长度-数字
    if (!data.mobile.trim()) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false
    }
    const mobileReg = /^[1][3-8][0-9]{9}$/
    if (!mobileReg.test(data.mobile.trim())) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return false
    }
    // 身份证照片校验：空
    if (!data.idcardFrontUrl.trim()) {
      wx.showToast({
        title: '身份证人像面为空',
        icon: 'none'
      })
      return false
    }
    if (!data.idcardBackUrl.trim()) {
      wx.showToast({
        title: '身份证国徽面为空',
        icon: 'none'
      })
      return false
    }
    // 表单数据没有问题
    console.log('表单数据没有问题')
    return true;
  },
  onLoad(options) {
    console.log('添加房屋表单页面接收到的数据', options)
    // 设置页面数据
    this.setData({
      street: options.street,
      building: options.building,
      room: options.room,
    })
  },
   // 上传身份证照片点击事件处理函数
   async handleUploadIdCardTap(e) {
    console.log(e.mark)
    try {
      const result = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['compressed']
      })
      console.log('图片选择结果', result)
        // 上传图片到你们公司服务器
        wx.uploadFile({
          filePath: result.tempFiles[0].tempFilePath,
          name: 'file',
          url: 'https://live-api.itheima.net/upload',
          header: {
            Authorization: 'Bearer ' + getToken()
          },
          success: (res) => {
            console.log('图片上传结果', res)
            // 解析返回数据
            const parseData = JSON.parse(res.data)
            // 判断数据异常
            if (parseData.code !== 10000) {
              return wx.showToast({
                title: parseData.message,
              })
            }
            // 设置页面数据
            this.setData({
              // 更具标签设置的自定义属性判断正反面
              [e.mark.type]: parseData.data.url
            })
          }
        })
    } catch (error) {
      console.log('图片选择发生错误', error)
    }
  },
  removePicture(e) {
    // 移除图片的类型（身份证正面或反面）
    const type = e.mark?.type
    this.setData({
      [type]: ''
    })
  }
});
