import { getToken } from '../../../utils/getToken'
Page({
  	// 定义页面数据变量
    data: {
      // 房屋详情
      houseDetail: {},
    },
  
    onLoad(options) {
      console.log('详情页接收到的数据', options)
      // 发起获取房屋详情请求
      this.getHouseDetail(options.id)
    },
  
    // 获取房屋信息
    getHouseDetail(id) {
      wx.request({
        url: `https://live-api.itheima.net/room/${id}`,
        method: 'GET',
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        data: { id },
        success: (res) => {
          console.log('获取房屋信息成功res', res)
          if (res.data.code !== 10000) {
            return wx.showToast({
              title: res.data.message,
            })
          }
          // 设置页面数据
          this.setData({
            houseDetail: res.data.data
          })
        }
      })
    },
  editHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/form/index',
    })
  },
})
