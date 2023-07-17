export const formateDate = (timeStamp) => {
  // 创建日期对象
  const dateInstance = new Date(timeStamp)
  // 获取年
  const year = dateInstance.getFullYear()
  // 获取月
  const month = ((dateInstance.getMonth() + 1) + '').padStart(2, '0')
  // 获取日
  const day = dateInstance.getDate()
  // 返回
  return year + '-' + month + '-' + day
}