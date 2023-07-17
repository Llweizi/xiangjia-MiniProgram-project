import { isLogin } from '../../utils/isLogin';
Page({
data:{
  notifyList:[],

},
// 访客邀请事件处理函数
handleVisitorTap() {
  if (isLogin()) {
    wx.navigateTo({
      url: `/visitor_pkg/pages/form/index`,
    });
  } else {
    wx.navigateTo({
      url: `/pages/login/index?from=/visitor_pkg/pages/form/index`,
    });
  }
},

// 在线报修tap事件处理函数
handleRepairTap() {
  if (isLogin()) {
    wx.navigateTo({
      url: `/repair_pkg/pages/form/index`,
    });
  } else {
    wx.navigateTo({
      url: `/pages/login/index?from=/repair_pkg/pages/form/index`,
    });
  }
},
onLoad(){
  this.getNotifyList()

}
,  // 我的房屋事件处理函数
handleMyHouseTap() {
  if (isLogin()) {
    wx.navigateTo({
      url: `/house_pkg/pages/list/index`,
    });
  } else {
    wx.navigateTo({
      // 注意这里传递的“?from=/house_pkg/pages/list/index”的作用
      url: `/pages/login/index?from=/house_pkg/pages/list/index`,
    });
  }
},
getNotifyList(){
  wx.showLoading({
    title: '加载中...',
  });
  wx.request({
    url: 'https://live-api.itheima.net/announcement',success:(res)=>{
   // 判断数据异常，提示用户
   if (res.data.code !== 10000) {
    wx.showToast({
      title: '数据请求错误',
      icon: 'none',
    });
    return;
  }
      this.setData({
        notifyList:res.data.data
      })  
      console.log("res.data数据",res.data.data);
      console.log("公告列表获取成功",this.data.notifyList);
    },fail: (err) => {
      wx.showToast({
        title: '网络错误',
        icon: 'none',
      });
      console.log('fail', err);
    },
    // 请求完毕关闭加载提示框
    complete: (res) => {
      console.log('complete', res);
      wx.hideLoading();
    }
  })
}


})
