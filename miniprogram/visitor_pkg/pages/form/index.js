import { getToken } from '../../../utils/getToken'
import { formateDate } from '../../../utils/date'
Page({
  data: {
      // 访问房屋id
      houseId: '',
      // 访问房屋信息
      houseInfo: '',
      // 访客姓名
      name: '',
      // 访客性别
      gender: '2',
      // 访客手机号
      mobile: '',
      // 访问日期
      visitDate: '',
      // 当前时间
      currentDate: Date.now(),
      // 3天后
      maxDate: Date.now() + 24 * 60 * 60 * 1000 * 3,
    	// 房屋信息列表
      houseList: [],
    dateLayerVisible: false,
    houseLayerVisible: false,
    houseList: [
      { name: '北京西三旗花园1号楼 101' },
      { name: '北京东村家园3号楼 302' },
      { name: '北京育新花园3号楼 703' },
      { name: '北京天通苑北苑8号楼 403' },
    ],
  },onLoad() {
    // 发起请求获取房屋列表请求
    this.getHoseList()
  }, 
   // 房屋选择事件处理
   handleHouseSelect(e) {
    console.log('选择房屋', e)
    this.setData({
      houseId: e.detail.id,
      houseInfo: e.detail.name
    })
  },
  // 日期确认事件处理
  handleDateConfirm(e) {
    console.log(e)
    this.setData({
      visitDate: formateDate(e.detail)
    })
    this.setData({ dateLayerVisible: false })
  },
  // 日期取消事件处理
  handleDateCancel(e) {
    console.log(e)
    this.setData({ dateLayerVisible: false })
  },
  
  
  // 获取房屋信息
    // 获取房屋信息
    getHoseList() {
      wx.request({
        url: 'https://live-api.itheima.net/house',
        method: 'GET',
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        success: (res) => {
          console.log('我的房屋列表success', res)
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
  openHouseLayer() {
    this.setData({ houseLayerVisible: true })
  },
  closeHouseLayer() {
    this.setData({ houseLayerVisible: false })
  },
  openDateLayer() {
    this.setData({ dateLayerVisible: true })
  },
  closeDateLayer() {
    this.setData({ dateLayerVisible: false })
  },
  // 访客邀请表单事件处理函数
  goPassport() {
    // 表单提交前校验
    if (this.validateVisitData(this.data)) {
      // 发起请求
      wx.request({
        url: 'https://live-api.itheima.net/visitor',
        method: 'POST',
        data: {
          houseId: this.data.houseId,
          name: this.data.name,
          gender: this.data.gender,
          mobile: this.data.mobile,
          visitDate: this.data.visitDate
        },
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        success: (res) => {
          console.log('新建访客邀请res', res)
          if (res.data.code !== 10000) {
            // 业务异常判断
            return wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
          // 新建成功
          // 跳转到访客详情页面，使用 reLaunch 跳转后用户可以点击左上角“小房子”回到首页
          wx.reLaunch({
            url: `/visitor_pkg/pages/passport/index?id=${res.data.data.id}`,
          })
        }
      })
    }
  },
  validateVisitData(data) {
    console.log('开始校验', data)
    // 房屋信息校验
    if (!data.houseId.trim()) {
      wx.showToast({
        title: '请输入访问房屋',
        icon: 'none'
      })
      return false
    }
    // 访客姓名校验
    if (!data.name.trim()) {
      wx.showToast({
        title: '请输入访客姓名',
        icon: 'none'
      })
      return false
    }
    // 访客手机号校验
    const mobileReg = /^[1][3-8][0-9]{9}$/
    if (!mobileReg.test(data.mobile.trim())) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return false
    }
    // 到访日期校验
    if (!data.visitDate.trim()) {
      wx.showToast({
        title: '请选择到访日期',
        icon: 'none'
      })
      return false
    }
    // 校验通过
    console.log('校验通过')
    return true
  },
})
