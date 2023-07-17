import { setToken } from '../../utils/setToken';
Page({
  data: {
    // 倒计时
    countDown: 0,
      // 手机号
      mobile: '',
       // 验证码
    code: '',
      // 重定向页面
      from: '',
          // 重定向类型
    type: '',
  },
  // 登录事件处理函数
  handleLoginTap() {
    console.log('login start')
    // 表单验证：手机号
    if (!this.isMobileValid()) {
      return wx.showToast({
        title: '手机号码格式错误',
        icon: 'none'
      })
    }
    // 表单验证：和验证码
    if (!this.isCodeValid()){
      return wx.showToast({
        title: '验证码格式错误',
        icon: 'none'
      })
    }
    // 发起登录/注册请求
    this.login()
  },
  // 验证码校验
  isCodeValid() {
    // 验证码为6位数字
    const reg = /^\d{6}$/
    // 验证验证码
    const valid = reg.test(this.data.code.trim())
    // 返回验证结果
    return valid
  },
  // 登录
  login() {
    // 发起登录请求
    wx.request({
      url: 'https://live-api.itheima.net/login',
      method: 'POST',
      data: {
        mobile: this.data.mobile,
        code: this.data.code
      },
      success: (res) => {
        console.log('注册/登录结果', res)
        if (res.data.code !== 10000) {
          return wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
              // 保存 token 到本地
              setToken('token', res.data.data.token)
              if (this.data.from) {
                console.log('登录成功进行重定向=====')
                // 判断是否从 tabBar 页面跳转而来
                if (this.data.type === 'switchTab') {
                  wx.switchTab({
                    url: this.data.from,
                  })
                } else {
                  wx.redirectTo({
                    url: this.data.from,
                  })
                }
              }
      },
    })
  },
  // 获取验证码事件处理函数
  handleGetCodeTap() {
     // 表单验证
    if (!this.isMobileValid()) {
      return wx.showToast({
        title: '手机号码格式错误',
        icon: 'none'
      })
    }
    // 获取验证码
    this.getCode()
    // 开启倒计时
    this.startCountDown()
  },
    // 手机号表单验证
    isMobileValid() {
      // 验证手机号
      const reg = /^[1][3-8][0-9]{9}$/
      const valid = reg.test(this.data.mobile.trim())
      return valid
    },

  // 倒计时处理函数
  startCountDown() {
    // 设置倒计时时间
    this.setData({
      countDown: 10
    })
    // 清除计时器id
    clearInterval(this.timerId)
    // 开启计时器，并保存计时器timerId
    this.timerId = setInterval(() => {
      // 计时结束，清除计时器
      if (this.data.countDown === 0) {
        clearInterval(this.timerId)
        return
      }
      // 每隔一秒计时(修改data数据刷新页面)
      this.setData({
        countDown: this.data.countDown - 1
      })
    }, 1000)
  },
    // 获取验证码
    getCode() {
      // 发起请求
      wx.request({
        url: 'https://live-api.itheima.net/code',
        method: 'GET',
        data: {
          mobile: this.data.mobile
        },
        success: (res) => {
          // 业务异常判断
          if (res.data.code !== 10000) {
            return wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
          wx.showToast({
            title: '发送成功，请查收短信',
            icon: 'none'
          })
          console.log('获取验证码res', res.data)
        }
      })
    },
    onLoad(options) {
      console.log('传入页面参数', options)
      this.setData({
        from: options.from,
        type: options.type
      })
    },
})