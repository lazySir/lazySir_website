const joi = require('joi')

// string()值必须是字符串
// alphanum():只能是包含a-z A-Z，0-9的字符串
// min（length）：最小长度
// max（length）：最大长度
// required（）：值是必填项，不能为undefined
// pattern（正则表达式）：必须符合正则表达式的规则

//用户名的验证规则
const phone = joi
  .string()
  .pattern(/^(?:(?:\+|00)86)?1\d{10}$/)
  .allow(null, '')
  .error(new Error('请输入正确的手机号码！'))
//账号的验证规则
const username = joi
  .string()
  .required()
  .min(5)
  .max(20)
  .error(new Error('账号格式有误,最小值5，最大值20，且不能为空！'))
//密码的验证规则
const password = joi
  .string()
  .required()
  .min(5)
  .max(20)
  .error(new Error('密码格式有误,最小值5，最大值20，且不能为空！'))
//邮箱的验证规则
const email = joi
  .string()
  .allow(null, '')
  .email()
  .error(new Error('请输入正确的邮箱！'))

const searchUsername = joi
  .string()
  .min(5)
  .max(20)
  .allow(null, '')
  .error(new Error('账号格式有误,最小值5，最大值20，且不能为空！'))
//内部码验证规则
const register_code = joi.string().required().error(new Error('验证码错误！'))
const accountId = joi
  .string()
  .max(255)
  .required()
  .error(new Error('用户id格式错误！'))
const nickname = joi
  .string()
  .allow(null, '')
  .max(255)
  .error(new Error('昵称格式错误！'))
const age = joi
  .number()
  .min(0)
  .max(150)
  .allow(null, '')
  .error(new Error('年龄格式错误！'))
const gender = joi.boolean().allow(null, '').error(new Error('性别格式错误！'))
const address = joi
  .string()
  .allow(null, '')
  .min(0)
  .max(255)
  .error(new Error('地址格式错误！'))
const avatar = joi
  .string()
  .allow(null, '')
  .min(0)
  .max(255)
  .error(new Error('头像格式错误！'))
const state = joi.boolean().allow(null, '').error(new Error('状态格式错误！'))
const isDelete = joi
  .boolean()
  .allow(null, '')
  .error(new Error('删除状态格式错误！'))
//注册和登录表单的验证规则对象
const account_schema_login = {
  body: {
    username,
    password,
  },
}
//注册表单的验证规则对象
const account_schema_register = {
  body: {
    ...account_schema_login.body,
    register_code,
  },
}
//更新管理员信息的验证规则对象
const account_schema_update = {
  body: {
    accountId,
    nickname,
    phone,
    age,
    gender,
    email,
    address,
    avatar,
    state,
    isDelete,
    username: searchUsername,
  },
}
//分页获取管理员列表的验证规则对象
const account_shcema_get = {
  query: {
    page: joi
      .number()
      .required()
      .min(1)
      .default(1)
      .error(new Error('页码格式有误！')),
    limit: joi
      .number()
      .required()
      .min(1)
      .default(10)
      .error(new Error('每页显示条数格式有误！')),
    username: searchUsername,
  },
}
//修改密码的验证规则对象
const account_schema_password = {
  body: {
    oldPassword: joi
      .string()
      .required()
      .min(5)
      .max(20)
      .error(new Error('旧密码格式有误,最小值5，最大值20，且不能为空！')),
    newPassword: joi
      .string()
      .required()
      .min(5)
      .max(20)
      .error(new Error('新密码格式有误,最小值5，最大值20，且不能为空！')),
  },
}
//删除管理员信息的验证规则对象
const account_schema_delete = {
  body: {
    accountId,
  },
}
module.exports = {
  account_schema_register,
  account_schema_login,
  account_shcema_get,
  account_schema_update,
  account_schema_password,
  account_schema_delete
}

// exports.account_schema_email = {
//   body: {
//     email,
//   },
// }
