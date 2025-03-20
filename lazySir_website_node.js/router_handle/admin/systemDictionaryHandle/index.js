const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { formatDate } = require('../../../utils')
//新增数据库字典接口
exports.addDictionary = async (req, res) => {
    try {
        const { key, value, level, description, parentId, state } = req.body

        // 如果传入了 parentId，检查其与 key 和 level 的组合是否存在
        let existingDictionary;
        if (parentId) {
            existingDictionary = await prisma.sysDictionary.findFirst({
                where: {
                    key: key,
                    level: level,
                    parentId: parentId,  // 如果有 parentId，检查该组合
                }
            })
        } else {
            // 如果没有 parentId，单纯按照 key 和 level 检查
            existingDictionary = await prisma.sysDictionary.findFirst({
                where: {
                    key: key,
                    level: level,
                }
            })
        }

        if (existingDictionary) {
            return res.myError('该字典项在此层级及父级下已存在！')
        }

        // 如果有 parentId，检查父级字典项是否存在
        if (parentId) {
            const parentDictionary = await prisma.sysDictionary.findUnique({
                where: { dictionaryId: parentId }
            })
            if (!parentDictionary) {
                return res.myError('父级字典项不存在')
            }
        }

        // 创建新的字典项
        const newDictionary = await prisma.sysDictionary.create({
            data: {
                key,          // 键名称
                value,        // 值
                level: level || 1, // 默认等级为1
                description: description || null, // 描述
                parentId: parentId || null, // 父级ID
                state: state !== undefined ? state : true, // 默认为启用状态
                accountId: req.user.accountId, // 创建人ID
                updatedId: req.user.accountId, // 更新人ID
            },
        })

        // 返回成功响应
        return res.mySuccess(newDictionary, '字典项创建成功')
    } catch (err) {
        console.error(err)
        return res.myError('服务器错误，请稍后再试')
    }
}

//数据库字典查询接口
exports.getDictionary = async (req, res) => {
    try {
        const { value, level, state, parentId, page = 1, limit = 255 } = req.query;

        // 进行分页计算
        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        // 构建查询条件
        const where = {};

        // 根据 value 进行模糊查询
        if (value) {
            where.value = {
                contains: value, // 模糊查询
            };
        }
        // 根据 state进行模糊查询
        if (state != undefined || state != "") {
            where.state = state
        }

        // 根据 parentId 进行精确查询
        if (parentId) {
            where.parentId = parentId;
        }
        if (level) {
            where.level = level;
        }
        // 查询符合条件的字典项总数
        const totalCount = await prisma.sysDictionary.count({ where });

        // 查询符合条件的字典项数据
        const dictionaries = await prisma.sysDictionary.findMany({
            where,
            skip,
            take,
        });

        // 返回成功响应
        return res.mySuccess({
            data: dictionaries,
            totalCount,
            page: parseInt(page),
            limit: take,
        }, '查询字典项成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};

exports.updateDictionary = async (req, res) => {
    try {
        const { dictionaryId, key, value, level, description, state, parentId } = req.body;

        // 校验 dictionaryId 是否存在
        if (!dictionaryId) {
            return res.myError('字典ID不能为空');
        }

        // 检查字典项是否存在
        const dictionaryExists = await prisma.sysDictionary.findUnique({
            where: { dictionaryId: dictionaryId }
        });
        if (!dictionaryExists) {
            return res.myError('字典项不存在');
        }

        // 获取当前字典项的 parentId 和其他信息
        const existingDictionary = dictionaryExists; // 当前字典项信息
        const currentParentId = existingDictionary.parentId;

        // 校验更新后的 `key` 和 `level` 是否与同一层级下其他字典项冲突
        const isConflict = await prisma.sysDictionary.findFirst({
            where: {
                key: key,
                level: level,
                parentId: parentId || currentParentId, // 如果没有提供 parentId，则使用原 parentId
                NOT: {
                    dictionaryId: dictionaryId, // 排除当前字典项
                }
            }
        });

        if (isConflict) {
            return res.myError('该字典项在此层级及父级下已存在相同的 key 和 level');
        }

        // 获取当前用户的 accountId
        const updatedId = req.user.accountId; // 假设 req.user 中有 accountId 字段

        // 构建更新的数据对象
        const updateData = {
            updatedId, // 更新操作人
        };

        if (key) {
            updateData.key = key;
        }
        if (value) {
            updateData.value = value;
        }
        if (level) {
            updateData.level = level;
        }
        if (description !== undefined) {
            updateData.description = description;
        }
        if (state !== undefined) {
            updateData.state = state;
        }

        // 更新字典项
        const updatedDictionary = await prisma.sysDictionary.update({
            where: {
                dictionaryId: dictionaryId, // 根据字典ID查找
            },
            data: updateData, // 更新的数据
        });

        // 返回成功响应
        return res.mySuccess(updatedDictionary, '字典项更新成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};


// 删除数据库字典接口
exports.deleteDictionary = async (req, res) => {
    try {
        const { dictionaryIds } = req.body;

        // 校验传入的 dictionaryIds 是否有效
        if (!Array.isArray(dictionaryIds) || dictionaryIds.length === 0) {
            return res.myError('请提供有效的字典ID列表');
        }

        // 存储无法删除的字典项信息
        const cannotDelete = [];

        // 存储不存在的字典项
        const notFound = [];

        // 遍历每个字典ID进行删除操作
        for (const dictionaryId of dictionaryIds) {
            // 查询当前字典项是否存在
            const dictionaryExists = await prisma.sysDictionary.findUnique({
                where: {
                    dictionaryId: dictionaryId,
                },
            });

            // 如果字典项不存在，记录在 notFound 中
            if (!dictionaryExists) {
                notFound.push(dictionaryId);
                continue;
            }

            // 查询当前字典项是否存在子级字典项
            const hasChildren = await prisma.sysDictionary.count({
                where: {
                    parentId: dictionaryId,
                },
            });

            // 如果存在子级字典项，记录下无法删除的字典项
            if (hasChildren > 0) {
                const dictionary = await prisma.sysDictionary.findUnique({
                    where: {
                        dictionaryId: dictionaryId,
                    },
                    select: {
                        value: true, // 获取字典项的 value
                    },
                });

                if (dictionary) {
                    cannotDelete.push({ dictionaryId, value: dictionary.value });
                }
            } else {
                // 如果没有子级字典项，执行删除操作
                await prisma.sysDictionary.delete({
                    where: {
                        dictionaryId: dictionaryId,
                    },
                });
            }
        }

        // 构建最终返回的消息
        let message = '删除成功！';

        // 如果有无法删除的字典项，添加到消息中
        if (cannotDelete.length > 0) {
            message += '以下字典项因具有子级字典项未能删除：' + cannotDelete.map(item => ` ${item.value}`).join('；');
        }

        // 如果有找不到的字典项，添加到消息中
        if (notFound.length > 0) {
            message += `以下字典项未找到：${notFound.join('，')}`;
        }

        // 返回成功响应
        return res.mySuccess(null, message);
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};
//传入字典项id，获取该字典以及所有父级项信息
// 获取字典项及其所有父级项
exports.getDictionaryAndParents = async (req, res) => {
    try {
        const { dictionaryId } = req.query;

        if (!dictionaryId) {
            return res.myError('字典项ID不能为空');
        }

        // 用来存储字典项及其所有父级字典项
        let dictionaryChain = [];

        // 初始化当前字典项
        let currentDictionary = await prisma.sysDictionary.findUnique({
            where: {
                dictionaryId: dictionaryId,
            },
        });

        if (!currentDictionary) {
            return res.myError('字典项不存在');
        }

        // 将当前字典项加入链条
        dictionaryChain.push(currentDictionary);

        // 遍历父级字典项
        while (currentDictionary.parentId) {
            currentDictionary = await prisma.sysDictionary.findUnique({
                where: {
                    dictionaryId: currentDictionary.parentId,
                },
            });

            // 如果父级字典项不存在，则退出循环
            if (!currentDictionary) {
                break;
            }

            // 将父级字典项加入链条
            dictionaryChain.unshift(currentDictionary);  // 使用 unshift 保证父级字典项按顺序排在前面
        }

        // 返回字典项链条（包括当前字典项及所有父级项）
        return res.mySuccess(dictionaryChain, '查询成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};