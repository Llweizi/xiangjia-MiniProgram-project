import { getToken } from '../../../utils/getToken'
import { formateDate } from '../../../utils/date'
Page({
  data: {  // 报修详情id
    // 如果是修改，则会初始化这个id。否则就是空字符串。
    id: '',
        // 手机号
        mobile: '',
        // 问题描述
        description: '',
    
    // 上传文件列表
		attachment: [{ url: '/repair_pkg/static/uploads/attachment.jpg' }],
        // 当前时间
        currentDate: Date.now(),
        // 维修时间
        appointment: '',
    // 维修房屋id
    repairHouseId: '',
    // 维修房屋名称
    repairHouseName: '',

    // 维修项目id
    repairItemId: '',
    // 维修项目名称
    repairItemName: '',
    currentDate: Date.now(),
    isHouseLayerShow: false,
    isRepairLayerShow: false,
    isDateLayerShow: false,
        // 维修项目列表
        repairItemList: [],
     // 报修房屋列表
     repairHouseList: [],
    repairItemList: [
      { name: '水路卫浴' },
      { name: '电路灯具' },
      { name: '管道疏通' },
      { name: '开锁换锁' },
    ],
    attachment: [

    ],
  }, 
  onLoad(){
      // 发起网络请求
    this.getRepairHouseList()
    this.getRepairItemList()
  }
  , onLoad(options) {

    console.log('报修表单页面接收的数据', options)
    // 判断是编辑还是新增
    if (options.houseId) {
      // 发起获取房屋报修信息请求
      this.getHouseRepairDetail(options.houseId)
    }
  }, 
    // 获取房屋报修详情
    getHouseRepairDetail(houseId) {
      console.log("获取房屋报修详情");
      wx.request({
        url: `https://live-api.itheima.net/repair/${houseId}`,
        method: 'GET',
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        success: (res) => {
          console.log('获取房屋报修详情res', res)
          if (res.data.code === 10000 && res.data.data) {
            // 回填表单数据
            this.setData({
              // 如果是编辑，id就会有值
              id: res.data.data.id,
              repairHouseId: res.data.data.houseId,
              repairHouseName: res.data.data.houseInfo,
              repairItemId: res.data.data.repairItemId,
              repairItemName: res.data.data.repairItemName,
              mobile: res.data.data.mobile,
              description: res.data.data.description,
              appointment: res.data.data.appointment,
              attachment: res.data.data.attachment,
            })
          }
        }
      })
    },
    // 表单提交
  
    handleRepairSubmit() {
      console.log('准备校验的数据提交时')
      // 表单提交校验
    if (this.validateRepairData(this.data)) {
      console.log('进入提交表单')
      wx.request({
        url: 'https://live-api.itheima.net/repair',
        method: 'POST',
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        data: {
               // 后端 API 通过 id 字段是否传递来区分新增还是编辑表单
          id: this.data.id,
          houseId: this.data.repairHouseId,
          repairItemId: this.data.repairItemId,
          mobile: this.data.mobile,
          appointment: this.data.appointment,
          description: this.data.description,
          attachment: this.data.attachment
        },
        success: (res) => {
          console.log('提交报修res', res)
          if (res.data.code !== 10000) {
            return wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
          // 报修成功跳转到报修列表页
          wx.redirectTo({
            url: '/repair_pkg/pages/list/index',
          })
        }
      })
    }
    },
    // 表单校验函数
    validateRepairData(data) {
      console.log('开始校验', data)
      // 报修房屋校验
      if (!data.repairHouseId.trim()) {
        wx.showToast({
          title: '请选择报修房屋',
          icon: 'none'
        })
        return false
      }
      // 保修项目校验
      if (!data.repairItemId.trim()) {
        wx.showToast({
          title: '请选择报修项目',
          icon: 'none'
        })
        return false
      }
      // 预约日期校验
      if (!data.appointment.trim()) {
        wx.showToast({
          title: '请选择预约日期',
          icon: 'none'
        })
        return false
      }
      // 问题描述校验
      if (!data.description.trim()) {
        wx.showToast({
          title: '请填写问题描述',
          icon: 'none'
        })
        return false
      }
      // 手机号码校验
      const mobileReg = /^[1][3-8][0-9]{9}$/
      if (!mobileReg.test(data.mobile.trim())) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'none'
        })
        return false
      }
      // 校验通过
      console.log('校验通过')
      return true
    },
  
  // 图片上传完毕事件处理函数
  handleImageAfterRead(e) {
    console.log('图片上传完毕', e)
    wx.uploadFile({
      // 上传图片本地路径、
      filePath: e.detail.file.url,
      // 图片上传接口参数
      name: 'file',
      // 图片上传接口
      url: 'https://live-api.itheima.net/upload',
      // 请求头
      header: {
        Authorization: 'Bearer ' + getToken()
      },
      // 图片上传成功回调
      success: (res) => {
        console.log('图片上传结果', res)
        // 解析返回数据
        const data = JSON.parse(res.data)
        // 返回结果状态判断
        if (data.code !== 10000) {
          return wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
        // 追加上传成功图片到当前文件列表
        const newList = [...this.data.attachment, data.data]
        // 设置页面数据
        this.setData({
          attachment: newList
        })
      }
    })
  },
    // 图片选择完毕事件处理函数
    handleImageAfterRead(e) {
      this.setData({
        attachment: [
          ...this.data.attachment,
          { url: e.detail.file.url }
        ]
      })
    },
  
  // 日期取消事件处理函数
  handleDateCancel(e) {
    this.setData({ isDateLayerShow: false })
  },
  // 日期确认事件处理函数
  handleDateConfirm(e) {
    console.log(e.detail)
    this.setData({
      isDateLayerShow: false,
      appointment: formateDate(e.detail)
    })
  },
   // 报修项目点击事件处理函数
   handleRepairItemSelect(e) {
    console.log(e.detail)
    // 设置页面数据
    this.setData({
      repairItemId: e.detail.id,
      repairItemName: e.detail.name
    })
  },
  // 报修房屋点击事件处理函数
  handleRepairHouseSelect(e) {
    console.log(e.detail)
    // 设置页面数据
    this.setData({
      repairHouseId: e.detail.id,
      repairHouseName: e.detail.name
    })
  },
    // 获取报修项目列表数据
    getRepairItemList() {
      wx.request({
        url: 'https://live-api.itheima.net/repairItem',
        method: 'GET',
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        success: (res) => {
          console.log('获取报修项目列表res', res)
          if (res.data.code !== 10000) {
            return wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
          // 设置页面数据
          this.setData({
            repairItemList: res.data.data
          })
        }
      })
    },
  
  // 获取报修房屋列表数据
  getRepairHouseList() {
    wx.request({
      url: 'https://live-api.itheima.net/house',
      method: 'GET',
      header: {
        Authorization: 'Bearer ' + getToken()
      },
      success: (res) => {
        console.log('获取报修房屋列表res', res)
        if (res.data.code !== 10000) {
          return wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        // 设置页面数据
        this.setData({
          repairHouseList: res.data.data
        })
      }
    })
  },
  openHouseLayer() {
    this.setData({ isHouseLayerShow: true });
  },
  closeHouseLayer() {
    this.setData({ isHouseLayerShow: false });
  },
  openRepairLayer() {
    this.setData({ isRepairLayerShow: true });
  },
  closeRepairLayer() {
    this.setData({
      isRepairLayerShow: false,
    });
  },

  openDateLayer() {
    this.setData({ isDateLayerShow: true });
  },
  closeDateLayer() {
    this.setData({ isDateLayerShow: false });
  }
});
