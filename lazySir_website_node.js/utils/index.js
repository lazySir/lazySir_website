const prisma = require('../db')
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
// utils/index.js
/**
 * 校验人员 ID 列表是否都存在于 adminInfo 表中
 *
 **/
exports.validatePerson = async (ids) => {
  if (!Array.isArray(ids)) throw new Error('参数必须为数组')
  // ✅ 校验执行人是否存在
  const validExecutors = await prisma.adminInfo.findMany({
    where: {
      accountId: {
        in: ids,
      },
    },
    select: { accountId: true },
  })
  return validExecutors
}
