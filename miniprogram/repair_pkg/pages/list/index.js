import { getToken } from '../../../utils/getToken'

Page({ data: {
  // 报修列表
  repairList: []
},
onLoad() {
  // 发起请求
  this.getRepairList()
},// 获取报修房屋列表
getRepairList() {
  wx.request({
    url: 'https://live-api.itheima.net/repair',
    method: 'GET',
    header: {
      Authorization: 'Bearer ' + getToken()
    },
    data: {
      current: 1,
      pageSize: 10
    },
    success: (res) => {
      console.log('报修房屋列表success', res)
      if (res.data.code !== 10000) {
        return wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
      // 设置页面数据
      this.setData({
        repairList: res.data.data.rows
      })
    }
  })
},
goDetail(e) {
  console.log(e.mark)
  wx.navigateTo({
    url: `/repair_pkg/pages/detail/index?id=${e.mark.id}`,
  })
},
  addRepair() {
    wx.navigateTo({
      url: '/repair_pkg/pages/form/index',
    })
  },
})
