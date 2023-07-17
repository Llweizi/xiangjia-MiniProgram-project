export const getToken = () => {
  const token = wx.getStorageSync('token')
  return token;
};