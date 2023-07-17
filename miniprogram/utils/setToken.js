export const setToken = (key, token) => {
  wx.setStorageSync(key, token.trim())
};