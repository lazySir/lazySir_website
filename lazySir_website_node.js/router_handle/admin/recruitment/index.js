const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { formatDate } = require('../../../utils'); // 根据需要引入你自己的工具函数

// 招聘信息新增接口
exports.addRecruitment = async (req, res) => {
    try {
        const { title, content, isHot, state, addressId, companyId, categoryId, degreeId, experienceId } = req.body;

        // 创建新的招聘信息
        const newRecruitment = await prisma.recruitment.create({
            data: {
                title,           // 标题
                content,         // 内容
                isHot,           // 是否热招
                state,           // 状态
                addressId,       // 地址ID
                companyId,       // 公司ID
                categoryId,        // 分类
                degreeId,
                experienceId,
                accountId: req.user.accountId, // 发布人ID
                updatedId: req.user.accountId, // 更新人ID
                createDate: new Date(), // 创建时间
                updateDate: new Date(), // 更新时间
            },
        });

        // 返回成功响应
        return res.mySuccess(newRecruitment, '招聘信息创建成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};

// 查询招聘信息接口
// 查询招聘信息接口
exports.getRecruitments = async (req, res) => {
    try {
        const {
            title,
            content,
            nickName,
            isHot,
            state,
            addressId,
            companyId,
            categoryId,
            degreeId,
            experienceId,
            page = 1,
            limit = 255
        } = req.query;

        // 构建查询条件
        const queryConditions = {};
        if (title) queryConditions.title = { contains: title };
        if (content) queryConditions.content = { contains: content };
        if (isHot != undefined || isHot != '') queryConditions.isHot = isHot;
        if (state != undefined || state != '') queryConditions.state = state;
        if (addressId) queryConditions.addressId = { contains: addressId };
        if (companyId) queryConditions.companyId = { contains: companyId };
        if (categoryId) queryConditions.category = { contains: categoryId };
        if (degreeId) queryConditions.degreeId = { contains: degreeId };
        if (experienceId) queryConditions.experienceId = {
            contains: experienceId
        };


        // 处理 nickName 查询
        let adminInfo = null;
        if (nickName) {
            // 先从 adminInfo 中找到对应的 accountId
            adminInfo = await prisma.adminInfo.findFirst({
                where: { nickname: nickName },
                select: { accountId: true },
            });

            // 如果没有找到对应的账号信息，返回错误
            if (!adminInfo) {
                return res.myError('没有找到对应的账号信息');
            }

            queryConditions.accountId = adminInfo.accountId; // 将 accountId 添加到查询条件中
        }

        // 先查询符合条件的招聘信息的总数
        const totalCount = await prisma.recruitment.count({
            where: queryConditions,
        });

        // 执行分页查询
        const recruitments = await prisma.recruitment.findMany({
            where: queryConditions,
            skip: (page - 1) * limit,
            take: Number(limit),
        });

        // 遍历每一条招聘信息，查找对应的字典值和 nickName
        let result = await Promise.all(recruitments.map(async (recruitment) => {
            const updatedRecruitment = { ...recruitment };

            // 获取 companyId 对应的 companyValue
            if (recruitment.companyId) {
                const companyDict = await prisma.sysDictionary.findFirst({
                    where: { dictionaryId: recruitment.companyId },
                    select: { value: true },
                });
                if (companyDict) {
                    updatedRecruitment.companyValue = companyDict.value;
                }
            }

            // 获取 addressId 对应的 addressValue
            if (recruitment.addressId) {
                const addressDict = await prisma.sysDictionary.findFirst({
                    where: { dictionaryId: recruitment.addressId },
                    select: { value: true },
                });
                if (addressDict) {
                    updatedRecruitment.addressValue = addressDict.value;
                }
            }

            // 获取 category 对应的 categoryValue
            if (recruitment.categoryId) {
                const categoryDict = await prisma.sysDictionary.findFirst({
                    where: { dictionaryId: recruitment.categoryId },
                    select: { value: true },
                });
                if (categoryDict) {
                    updatedRecruitment.categoryValue = categoryDict.value;
                }
            }
            if (recruitment.degreeId) {
                const categoryDict = await prisma.sysDictionary.findFirst({
                    where: { dictionaryId: recruitment.degreeId },
                    select: { value: true },
                });
                if (categoryDict) {
                    updatedRecruitment.degreeValue = categoryDict.value;
                }
            }
            if (recruitment.experienceId) {
                const categoryDict = await prisma.sysDictionary.findFirst({
                    where: { dictionaryId: recruitment.experienceId },
                    select: { value: true },
                });
                if (categoryDict) {
                    updatedRecruitment.experienceValue = categoryDict.value;
                }
            }

            // 获取 accountId 对应的 nickName
            if (recruitment.accountId) {
                const adminInfo = await prisma.adminInfo.findFirst({
                    where: { accountId: recruitment.accountId },
                    select: { nickname: true },
                });
                if (adminInfo) {
                    updatedRecruitment.nickName = adminInfo.nickname;
                }
            }
            // 获取 accountId 对应的 nickName
            if (recruitment.updatedId) {
                const adminInfo = await prisma.adminInfo.findFirst({
                    where: { accountId: recruitment.updatedId },
                    select: { nickname: true },
                });
                if (adminInfo) {
                    updatedRecruitment.updatedNickName = adminInfo.nickname;
                }
            }

            return updatedRecruitment;
        }));

        result = result.map(item => {
            item.updateDate = formatDate(item.updateDate);
            item.createDate = formatDate(item.createDate);
            return item;
        });

        // 返回成功响应
        return res.mySuccess({
            data: result,
            totalCount: totalCount,  // 返回符合查询条件的总数
            page: Number(page),
            limit: Number(limit)
        }, '查询招聘信息成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};
// 更新招聘信息接口
exports.updateRecruitment = async (req, res) => {
    try {
        const { recruitmentId, title, content, isHot, state, addressId, companyId, categoryId, degreeId, experienceId } = req.body;

        // 校验招聘信息是否存在
        const existingRecruitment = await prisma.recruitment.findUnique({
            where: { recruitmentId },
        });

        if (!existingRecruitment) {
            return res.myError('未找到指定的招聘信息');
        }

        // 更新招聘信息
        const updatedRecruitment = await prisma.recruitment.update({
            where: { recruitmentId },
            data: {
                title: title || existingRecruitment.title,      // 如果没有传递新值，保持原值
                content: content || existingRecruitment.content,  // 如果没有传递新值，保持原值
                isHot: isHot !== undefined ? isHot : existingRecruitment.isHot, // 如果传递了 isHot，则更新
                state: state !== undefined ? state : existingRecruitment.state, // 如果传递了 state，则更新
                addressId: addressId || existingRecruitment.addressId,  // 如果没有传递新值，保持原值
                companyId: companyId || existingRecruitment.companyId,  // 如果没有传递新值，保持原值
                categoryId: categoryId || existingRecruitment.categoryId,      // 如果没有传递新值，保持原值
                degreeId: degreeId || existingRecruitment.degreeId,      // 如果没有传递新值，保持原值
                experienceId: experienceId || existingRecruitment.experienceId,      // 如果没有传递新值，保持原值
                updatedId: req.user.accountId, // 更新人ID
            },
        });

        // 返回成功响应
        return res.mySuccess(updatedRecruitment, '招聘信息更新成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};

//删除接口
// 删除多个招聘信息接口
exports.deleteRecruitments = async (req, res) => {
    try {
        const { recruitmentIds } = req.body;

        // 校验 recruitmentIds 是否为数组且不能为空
        if (!Array.isArray(recruitmentIds) || recruitmentIds.length === 0) {
            return res.myError('请提供有效的招聘ID数组');
        }

        // 查询这些招聘信息是否存在
        const existingRecruitments = await prisma.recruitment.findMany({
            where: {
                recruitmentId: { in: recruitmentIds },
            },
            select: {
                recruitmentId: true,
                title: true,
            },
        });

        // 获取存在的招聘信息ID和标题
        const existingRecruitmentIds = existingRecruitments.map(item => item.recruitmentId);
        const notFoundTitles = existingRecruitments.length !== recruitmentIds.length
            ? recruitmentIds.filter(id => !existingRecruitmentIds.includes(id))
            : [];

        // 批量删除招聘信息
        await prisma.recruitment.deleteMany({
            where: {
                recruitmentId: { in: existingRecruitmentIds },
            },
        });

        // 返回成功响应，并提供未找到的招聘标题
        if (notFoundTitles.length > 0) {
            return res.mySuccess(
                {
                    notFound: notFoundTitles, // 返回未找到的招聘标题
                },
                '部分招聘信息未找到，删除失败'
            );
        }

        // 返回成功响应
        return res.mySuccess(null, '招聘信息删除成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};