export const setUserInfo = (userInfo) => {
  wx.setStorageSync('userinfo', JSON.stringify(userInfo))
};