const prisma = require('../../../db');
const { formatDate } = require('../../../utils');
// 查询企业荣誉接口
exports.getHonor = async (req, res) => {
    try {
        const {
            name,
            companyId,
            description,
            page = 1,
            limit = 10,
        } = req.query;
        const queryConditions = {};
        if (name) queryConditions.name = { contains: name };
        if (companyId) queryConditions.companyId = companyId;
        queryConditions.state = true;
        if (description) queryConditions.description = { contains: description };
        const totalCount = await prisma.enterpriseHonor.count({ where: queryConditions });

        const honorList = await prisma.enterpriseHonor.findMany({
            where: queryConditions,
            skip: (page - 1) * limit,
            take: Number(limit),
        });

        let result = await Promise.all(
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
        // 按创建时间倒序排序
        result = result.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
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

