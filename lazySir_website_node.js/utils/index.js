exports.formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24小时制
    timeZone: 'Asia/Shanghai', // 设置为北京时间
  }
  return new Intl.DateTimeFormat('zh-CN', options)
    .format(date)
    .replace(/\//g, '-') // 将 "/" 替换为 "-"
}
