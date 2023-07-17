export const isLogin = () => {
  // 读取 token
  const token = wx.getStorageSync('token');
  if (token.trim()) {
    return true;
  } else {
    return false;
  }
};