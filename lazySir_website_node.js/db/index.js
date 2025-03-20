const { PrismaClient } = require('@prisma/client')

class PrismaSingleton {
  constructor() {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient()
    }
  }

  getInstance() {
    return PrismaSingleton.instance
  }
}

// 导出单例实例
const prisma = new PrismaSingleton().getInstance()
module.exports = prisma
