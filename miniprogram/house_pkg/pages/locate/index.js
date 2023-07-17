import { qqmap } from '../../../utils/qqmap'
Page({  data: {
  // 小区列表数据
  streetList: [],
     // 用户所在地址
     address: '',
},
  onLoad() {
    this.getLocation()
  },
  async handleChooseLocationTap(e) {
    const location = await wx.chooseLocation()
    console.log('重新选择地址', location)
    // 重置小区和所在地信息数据
    this.getStreetList(location)
    this.getUserAddress(location)
  },
  async getLocation() {
    const location = await wx.getLocation()
    console.log(location)
        // 获取周边住宅小区
        this.getStreetList(location);
        
        // 获取用户地址
        this.getUserAddress(location)
  }, 
   // 获取用户所在地址
   getUserAddress(location) {
    qqmap.reverseGeocoder({
      location: [location.latitude, location.longitude].join(','),
      success: (res) => {
        console.log('用户所在地址', res)
        this.setData({
          address: res.result.address
        })
      }
    })
  },
  
  // 获取周边住宅小区列表
  getStreetList(location) {
    qqmap.search({
      keyword: '住宅小区',  //搜索关键词
      location: [location.latitude, location.longitude].join(','),  //设置周边搜索中心点
      page_size: 5,
      success: (res) => {
        console.log('sdk 返回数据', res)
        // 数据格式处理
        const streetList = res.data.map(item => {
          // 获取我们开发中需要的字段
          return { id: item.id, title: item.title, distance: item._distance }
        })
        // 设置页面数据
        this.setData({
          streetList,
        })
      },
    })
  },
 
})