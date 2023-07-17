import { getToken } from '../../../utils/getToken'
import { qqmap } from '../../../utils/qqmap'
Page({
  data: {
    repairDetail: [],  //房屋详情列表数据
    latitude: 40.13009128929987,
    longitude: 116.65594480754851,
    markers: [{
      id: 1,
      latitude: 40.13009128929987,
      longitude: 116.65594480754851,
      width: 40,
      height: 40,
      iconPath: '/static/images/marker.png'
    },
    {
      id: 2,
      latitude: 41.12715041935171,
      longitude: 116.67086325408934,
      width: 40,
      height: 40,
      iconPath: '/static/images/marker.png'
    }],
    // 路线数据
    polyline: [],
  },
  onLoad(options) {
    this.getRepairDetail(options.id)
    this.getPolyline()  //获取路线规划经纬度数据
  },
  // 获取房屋详情列表
  getRepairDetail(id) {
    wx.request({
      url: `https://live-api.itheima.net/repair/${id}`,
      method: 'GET',
      header: {
        Authorization: 'Bearer ' + getToken()
      },
      success: (res) => {
        if (res.data.code !== 10000) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        this.setData({
          repairDetail: res.data.data
        })
      }
    })
  },
  // 获取路线规划经纬度
  getPolyline() {
    qqmap.direction({
      // 路线规划方式
      mode: 'bicycling',
      // 路线规划起点
      from: '40.13009128929987,116.65594480754851',
      // 路线规划终点
      to: '41.12715041935171,116.67086325408934',
      success: (res) => {
        console.log(res)
        const coors = res.result.routes[0].polyline
        const pl = []
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / 1000000;
        }
        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log('coors', coors)
        console.log('pl', pl)
        // 设置页面数据
        this.setData({
          polyline: [{
            points: pl,
            color: '#58c16c',
            width: 4,
            borderColor: '#2f693c',
            borderWidth: 1
          }]
        })
      }
    })
  },
  // 点击修改信息事件处理函数
  handleRepairTap(e) {
    wx.navigateTo({
      url: `/repair_pkg/pages/form/index?houseId=${this.data.repairDetail.id}`,
    })
  },
  // 点击取消修改事件处理函数
  handelCancelTap() {
    wx.request({
      url: `https://live-api.itheima.net/cancel/repaire/${this.data.repairDetail.id}`,
      method: 'PUT',
      header: {
        Authorization: 'Bearer ' + getToken()
      },
      success: (res) => {
        if (res.data.code !== 10000) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        wx.navigateTo({
          url: '/repair_pkg/detail/list/index',
        })
      }
    })
  }
});
