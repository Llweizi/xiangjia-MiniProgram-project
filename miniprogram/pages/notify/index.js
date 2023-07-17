Page({
  data: {
    // 定义页面数据
    // 公告详情
    notifyDetail: null,
  },
  onLoad(options) {
    // onLoad 生命周期函数中发起请求（获取传入页面的id）
    this.getNotifyDetail(options.id)
  },

  // 定义获取公告详情的请求函数
  getNotifyDetail(id) {
    console.log('获取公告详情数据开始');
    wx.request({
      url: `https://live-api.itheima.net/announcement/${id}`,
      method: 'GET',
      success: (res) => {
        console.log('获取公告详情数据成功', res);
        if (res.data.code !== 10000) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          return
        }
        // 设置页面数据
        this.setData({
          notifyDetail: res.data.data,
        });
      },
    });
  },
});