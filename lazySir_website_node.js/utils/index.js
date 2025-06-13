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

// 通用校验函数：校验指定 key 下的子项是否存在
exports.validateChildDictionary = async (key, id) => {
  const prisma = require('../db')
  const root = await prisma.sysDictionary.findFirst({ where: { key } })
  if (!root) throw new Error(`未找到字典项（${key}）`)
  const child = await prisma.sysDictionary.findFirst({
    where: {
      dictionaryId: id,
      parentId: root.dictionaryId,
    },
  })
  if (!child) throw new Error(`${key} 的 ID 无效，不属于其子项`)
  return child
}
