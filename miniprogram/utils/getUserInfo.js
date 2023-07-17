export const getUserInfo = () => {
  const userInfoStr = wx.getStorageSync('userinfo')
  if (userInfoStr) {
    return JSON.parse(userInfoStr)
  } else {
    return null
  }
};