const crypto = require('crypto')

// 从 .env 获取密钥和 IV
const rawKey = process.env.ENCRYPT_SECRET_KEY
const ivString = process.env.ENCRYPT_IV

if (ivString.length !== 16) {
  throw new Error('ENCRYPT_IV 必须是16个字符')
}

const SECRET_KEY = crypto.createHash('sha256').update(rawKey).digest() // 32字节密钥
const IV = Buffer.from(ivString, 'utf8') // 16字节 IV

// 加密函数
function encrypt(text) {
  // 创建一个aes-256-cbc加密算法的cipher对象
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, IV)
  // 使用cipher对象对text进行加密，并指定输入编码为utf8，输出编码为base64
  let encrypted = cipher.update(text, 'utf8', 'base64')
  // 将加密后的数据与cipher对象的final方法返回的数据拼接起来
  encrypted += cipher.final('base64')
  // 返回加密后的数据
  return encrypted
}

// 解密函数
function decrypt(encryptedText) {
  // 创建解密器，使用aes-256-cbc算法，SECRET_KEY为密钥，IV为初始化向量
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, IV)
  // 使用解密器对加密文本进行解密，将结果转换为utf8编码
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8')
  // 将解密后的结果与解密器的最终结果拼接
  decrypted += decipher.final('utf8')
  // 返回解密后的结果
  return decrypted
}

module.exports = { encrypt, decrypt }
