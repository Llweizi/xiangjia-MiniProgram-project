import { isLogin } from '../../utils/isLogin';
import { getToken } from '../../utils/getToken';
import { getUserInfo } from '../../utils/getUserInfo';
import { setUserInfo } from '../../utils/setUserInfo';
Page({
  data: {
    // 用户是否登录状态变量
    isLogin: false,
      // 用户信息
      userInfo: null,
      // 个人信息点击事件处理函数
 
  }, handleMyRepairTap() {
    if (isLogin()) {
      wx.navigateTo({
        url: `/repair_pkg/pages/list/index`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/login/index?from=/repair_pkg/pages/list/index`,
      });
    }
  },
  handleProfileTap() {
    if (this.data.isLogin) {
      // 个人信息修改页面
      wx.navigateTo({
        url: '/pages/profile/index',
      })
    } else {
      // 登录页面
      wx.navigateTo({
        // 添加跳转类型：type=switchTab
        url: '/pages/login/index?from=/pages/my/index&type=switchTab',
      })
    }
  },

  onShow() {
    console.log('onShow')
    // 用户登录后才可以获取个人信息
    if (isLogin() && !getUserInfo()) {
      // 获取用户信息
      wx.request({
        url: 'https://live-api.itheima.net/userInfo',
        method: 'GET',
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        success: (res) => {
          console.log('用户信息', res)
          if (res.data.code !== 10000) {
            return wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
          // 设置页面用户信息数据
          this.setData({
            userInfo: res.data.data
          })
                    // 保存用户信息到本地
                    setUserInfo(res.data.data)
        }
      })
    }
    // 设置用户是否登录数据
    this.setData({
      isLogin: isLogin(),
           // 如果已经获取，则读取本地信息初始化
           userInfo: getUserInfo()
    })

  },

}


);
