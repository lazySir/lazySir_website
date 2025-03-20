const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { formatDate } = require('../../../utils'); // 根据需要引入你自己的工具函数



// 查询招聘信息接口
exports.getRecruitments = async (req, res) => {
    try {
        const {
            recruitmentId,
            title,
            content,
            nickName,
            isHot,
            addressId,
            companyId,
            categoryId,
            degreeId,
            experienceId,
            page = 1,
            limit = 8
        } = req.query;

        // 构建查询条件
        const queryConditions = {};
        if (title) queryConditions.title = { contains: title };
        if (recruitmentId) queryConditions.recruitmentId = recruitmentId;
        if (content) queryConditions.content = { contains: content };
        if (isHot != undefined || isHot != '') queryConditions.isHot = isHot;
        queryConditions.state = true;
        if (addressId) queryConditions.addressId = { contains: addressId };
        if (companyId) queryConditions.companyId = { contains: companyId };
        if (categoryId) queryConditions.categoryId = { contains: categoryId };
        if (degreeId) queryConditions.degreeId = { contains: degreeId };
        if (experienceId) queryConditions.experienceId = { contains: experienceId };

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
            // 获取 degreeId 对应的 degreeValue
            if (recruitment.degreeId) {
                const degreeDict = await prisma.sysDictionary.findFirst({
                    where: { dictionaryId: recruitment.degreeId },
                    select: { value: true },
                });
                if (degreeDict) {
                    updatedRecruitment.degreeValue = degreeDict.value;
                }
            }
            // 获取 experienceId 对应的 experienceValue
            if (recruitment.experienceId) {
                const experienceDict = await prisma.sysDictionary.findFirst({
                    where: { dictionaryId: recruitment.experienceId },
                    select: { value: true },
                });
                if (experienceDict) {
                    updatedRecruitment.experienceValue = experienceDict.value;
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
        result = result.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
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

