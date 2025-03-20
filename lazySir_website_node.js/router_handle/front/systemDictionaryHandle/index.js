const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { formatDate } = require('../../../utils')
//新增数据库字典接口

//数据库字典查询接口
exports.getDictionary = async (req, res) => {
    try {
        const { value, level, parentId, page = 1, limit = 255 } = req.query;

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
        where.state = true
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
                state: true
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