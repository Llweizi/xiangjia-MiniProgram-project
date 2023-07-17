Page({
  data: {
    // 小区名称
    street: '',
    // 楼/栋名称
    building: '',
    // 房间号
    rooms: []
  },
  onLoad(options) {
    console.log('选择房间页面接收到的数据', options)
    // 生成房间数据（6层4户）
    this.fake(options, 6, 4)
  },
  // 生成房间数据
  fake(options, floorNum, roomNum) {
    // 生成房间数据
    const rooms = []
    for (let i = 0; i < floorNum; i++) {
      for (let j = 0; j < roomNum; j++) {
        rooms.push((i + 1) + '0' + (j + 1))
      }
    }
    // 设置页面数据
    this.setData({
      street: options.street,
      building: options.building,
      rooms: rooms
    })
  },
})