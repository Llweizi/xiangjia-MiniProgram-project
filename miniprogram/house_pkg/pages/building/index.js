Page({  data: {
  // 社区
  street: '',
  // 数量
  size: 0,
  // 楼/栋
  type: ''
},
  onLoad(options) {
    console.log('选择楼栋接收到的数据', options)
      // 生成最少5条最多10条的假数据
      this.fake(options.street, 5, 10)
  } // 假数据生成函数
  ,fake(street, min, max) {
    // Math.random() * 5 => 0.xxx 到 4.xxx
    // 再加上 10 - 5 就是 5.xxx 到 9.xxx
    // 再四舍五入就是 5 到 10
    let size = Math.round(Math.random() * min + max - min)
    // 添加一些变化，大于6就是楼，否则就是栋
    let type = size > 6 ? '号楼' : '栋'
    this.setData({
      street,
      size,
      type
    })
  },
});