import { getToken } from '../../../utils/getToken'

Page({
  data: {
    // 房屋列表
    houseList: [],
    dialogVisible: false,
        // 删除对话框是否显示
        isDialogShow: false,
        // 删除房屋id
        houseId: '',
  },  handleSwipeClose(e) {
    // 观察事件对象e的属性思考你可以用他来做什么？
    console.log('swiper cell 关闭 事件对象', e)

    // 弹出对话框
    if (e.detail.position === 'right') {
      this.setData({
        isDialogShow: true,
        houseId: e.mark.houseId
      })
    }
    // 隐藏删除按钮
    e.detail.instance.close()
  }, // 是否删除对话框
  handleDialogClose(e) {
    console.log('对话框关闭事件对象', e)
    if (e.detail === 'cancel') {
      console.log('用户点击了取消')
    }
    if (e.detail === 'confirm') {
      console.log('用户点击了确定')
      console.log('发起删除请求')
      wx.request({
        url: `https://live-api.itheima.net/room/${this.data.houseId}`,
        method: 'DELETE',
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        success: (res) => {
          console.log('删除房屋结果', res)
          if (res.data.code !== 10000) {
            return wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
          // 从 houseList 删除指定元素
          const newHouseList = this.data.houseList.filter(item => item.id !== this.data.houseId)
          // 重新设置页面数据
          this.setData({
            houseList: newHouseList,
            houseId: '',
          })
        }
      })
    }
  },
  addHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/locate/index',
    });
  },
  onShow() {
    // 获取房屋列表数据
    this.getHouseList()
  },
  handleHouseItemClick(e) {
    console.log(e.mark.id)
    wx.navigateTo({
      url: `/house_pkg/pages/detail/index?id=${e.mark.id}`,
    })
  },
  // 获取房屋列表数据
  getHouseList() {
    wx.request({
      url: 'https://live-api.itheima.net/room',
      header: {
        Authorization: 'Bearer ' + getToken()
      },
      success: (res) => {
        console.log('房屋列表数据获取成功结果', res)
        if (res.data.code !== 10000) {
          return wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        // 设置页面数据
        this.setData({
          houseList: res.data.data
        })
      }
    })
  },
})