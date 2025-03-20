const prisma = require('../../../db');
const { formatDate } = require('../../../utils');

// 检查 companyId 是否存在
const validateCompanyId = async (companyId) => {
    const company = await prisma.sysDictionary.findUnique({
        where: { dictionaryId: companyId },
    });
    return !!company; // 如果存在返回 true，否则返回 false
};

// 检查 newsId 是否存在
const validateNewsId = async (newsId) => {
    const news = await prisma.news.findUnique({
        where: { newsId },
    });
    return !!news; // 如果存在返回 true，否则返回 false
};

// 新增企业荣誉接口
exports.addHonor = async (req, res) => {
    try {
        const { name, description, companyId, newsId, state, createDate } = req.body;

        // 校验 companyId
        if (!(await validateCompanyId(companyId))) {
            return res.myError('公司ID无效或不存在');
        }
        if (newsId) {
            // 校验 newsId
            if (!(await validateNewsId(newsId))) {
                return res.myError('新闻ID无效或不存在');
            }
        }


        const newHonor = await prisma.enterpriseHonor.create({
            data: {
                name,
                description: description || null,
                companyId,
                newsId,
                state: (state !== undefined || state !== '') ? state : true,
                accountId: req.user.accountId, // 创建人ID
                updatedId: req.user.accountId, // 更新人ID
                createDate: createDate || new Date(),
                updateDate: new Date(),
            },
        });

        return res.mySuccess(newHonor, '企业荣誉新增成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};

// 查询企业荣誉接口
exports.getHonor = async (req, res) => {
    try {
        const {
            name,
            companyId,
            state,
            createDateFrom,
            createDateTo,
            updateDateFrom,
            updateDateTo,
            description,
            page = 1,
            limit = 10,
        } = req.query;

        const queryConditions = {};
        if (name) queryConditions.name = { contains: name };
        if (companyId) queryConditions.companyId = companyId;
        if (state !== undefined && state !== '') queryConditions.state = state;
        if (description) queryConditions.description = { contains: description };
        if (createDateFrom) queryConditions.createDate = { gte: new Date(createDateFrom) };
        if (createDateTo) queryConditions.createDate = { ...queryConditions.createDate, lte: new Date(createDateTo) };
        if (updateDateFrom) queryConditions.updateDate = { gte: new Date(updateDateFrom) };
        if (updateDateTo) queryConditions.updateDate = { ...queryConditions.updateDate, lte: new Date(updateDateTo) };

        const totalCount = await prisma.enterpriseHonor.count({ where: queryConditions });

        const honorList = await prisma.enterpriseHonor.findMany({
            where: queryConditions,
            skip: (page - 1) * limit,
            take: Number(limit),
        });

        const result = await Promise.all(
            honorList.map(async (honor) => {
                const updateHonorList = { ...honor };

                // 获取发布人的昵称
                if (honor.accountId) {
                    const adminInfo = await prisma.adminInfo.findFirst({
                        where: { accountId: honor.accountId },
                        select: { nickname: true },
                    });
                    updateHonorList.nickName = adminInfo ? adminInfo.nickname : null;
                }

                // 获取更新人的昵称
                if (honor.updatedId) {
                    const adminInfo = await prisma.adminInfo.findFirst({
                        where: { accountId: honor.updatedId },
                        select: { nickname: true },
                    });
                    updateHonorList.updateNickName = adminInfo ? adminInfo.nickname : null;
                }

                // 获取公司信息
                if (honor.companyId) {
                    const company = await prisma.sysDictionary.findFirst({
                        where: { dictionaryId: honor.companyId },  // 确保查询的字段正确
                        select: { value: true },
                    });
                    updateHonorList.companyValue = company ? company.value : null;
                }

                // 获取新闻名称
                if (honor.newsId) {
                    const news = await prisma.news.findFirst({
                        where: { newsId: honor.newsId },
                        select: { title: true }, // 使用 `title` 字段而不是 `name`
                    });
                    updateHonorList.newsTitle = news ? news.title : null;  // 注意：应该使用 `news.title` 而不是 `company.name`
                }

                // 格式化创建和更新时间
                updateHonorList.createDate = formatDate(honor.createDate);
                updateHonorList.updateDate = formatDate(honor.updateDate);

                return updateHonorList;
            })
        );

        return res.mySuccess(
            {
                data: result,
                totalCount,
                page: Number(page),
                limit: Number(limit),
            },
            '企业荣誉查询成功'
        );
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};

// 更新企业荣誉接口
exports.updateHonor = async (req, res) => {
    try {
        const { honorId, name, description, companyId, newsId, state, createDate } = req.body;

        const existingHonor = await prisma.enterpriseHonor.findUnique({
            where: { honorId },
        });

        if (!existingHonor) return res.myError('未找到指定的企业荣誉信息');
        // 校验 companyId
        if (!(await validateCompanyId(companyId))) {
            return res.myError('公司ID无效或不存在');
        }
        if (newsId) {
            // 校验 newsId
            if (!(await validateNewsId(newsId))) {
                return res.myError('新闻ID无效或不存在');
            }
        }
        const updatedHonor = await prisma.enterpriseHonor.update({
            where: { honorId },
            data: {
                name,
                description: description || null,
                companyId,
                createDate,
                newsId: newsId ? newsId : "",
                state,
                updatedId: req.user.accountId,
                updateDate: new Date(),
            },
        });

        return res.mySuccess(updatedHonor, '企业荣誉更新成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};

// 删除企业荣誉接口
exports.deleteHonor = async (req, res) => {
    try {
        const { honorIds } = req.body;

        if (!Array.isArray(honorIds) || honorIds.length === 0) {
            return res.myError('请提供有效的荣誉ID数组');
        }

        const existingHonors = await prisma.enterpriseHonor.findMany({
            where: { honorId: { in: honorIds } },
            select: { honorId: true, name: true },
        });

        const existingHonorIds = existingHonors.map((item) => item.honorId);
        const notFoundIds = honorIds.filter((id) => !existingHonorIds.includes(id));

        await prisma.enterpriseHonor.deleteMany({
            where: { honorId: { in: existingHonorIds } },
        });

        if (notFoundIds.length > 0) {
            return res.mySuccess(
                { notFound: notFoundIds },
                '部分荣誉未找到，删除失败'
            );
        }

        return res.mySuccess(null, '企业荣誉删除成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};
