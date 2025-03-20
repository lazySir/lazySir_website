const prisma = require('../../../db')
const { formatDate } = require('../../../utils/index'); // 根据需要引入工具函数
// 查询新闻接口
exports.getNews = async (req, res) => {
    try {
        const {
            title,
            content,
            nickName,
            hotSearchWordIds,
            companyId,
            page = 1,
            limit = 8,
            newsId, // 添加新闻ID查询条件
        } = req.query;
        const queryConditions = {};
        if (newsId) queryConditions.newsId = newsId;
        if (title) queryConditions.title = { contains: title };
        if (content) queryConditions.content = { contains: content };
        if (companyId) queryConditions.companyId = companyId;
        if (hotSearchWordIds) queryConditions.hotSearchWordIds = { contains: hotSearchWordIds };
        queryConditions.state = true;

        // 如果传入了 newsId，增加 hits 计数
        if (newsId) {
            await prisma.news.update({
                where: { newsId: newsId },
                data: { hits: { increment: 1 } },
            });
        }

        // 处理 nickName 查询
        if (nickName) {
            const adminInfo = await prisma.adminInfo.findFirst({
                where: { nickname: nickName },
                select: { accountId: true },
            });

            if (!adminInfo) return res.myError('未找到对应的发布人');

            queryConditions.accountId = adminInfo.accountId;
        }

        const totalCount = await prisma.news.count({ where: queryConditions });

        const newsList = await prisma.news.findMany({
            where: queryConditions,
            skip: (page - 1) * limit,
            take: Number(limit),
        });

        let result = await Promise.all(
            newsList.map(async (news) => {
                const updatedNews = { ...news };
                if (news.accountId) {
                    const adminInfo = await prisma.adminInfo.findFirst({
                        where: { accountId: news.accountId },
                        select: { nickname: true },
                    });
                    updatedNews.nickName = adminInfo ? adminInfo.nickname : null;
                }
                if (news.updatedId) {
                    const adminInfo = await prisma.adminInfo.findFirst({
                        where: { accountId: news.updatedId },
                        select: { nickname: true },
                    });
                    updatedNews.updateNickName = adminInfo ? adminInfo.nickname : null;
                }
                if (news.companyId) {
                    const systemDictionary = await prisma.sysDictionary.findFirst({
                        where: { dictionaryId: news.companyId },
                        select: { value: true },
                    });
                    updatedNews.companyValue = systemDictionary ? systemDictionary.value : null;
                }
                if (news.hotSearchWordIds) {
                    updatedNews.hotSearchWordValues = [];
                    let ids;
                    try {
                        ids = JSON.parse(news.hotSearchWordIds); // 尝试解析 JSON
                    } catch (error) {
                        ids = []; // 如果解析失败，则设置为空数组
                    }

                    // 检查 ids 是否为有效的数组
                    if (Array.isArray(ids)) {
                        for (let i = 0; i < ids.length; i++) {
                            const hotSearchWord = await prisma.sysDictionary.findFirst({
                                where: { dictionaryId: ids[i] },
                                select: { key: true, value: true },
                            });
                            if (hotSearchWord) {
                                updatedNews.hotSearchWordValues.push(hotSearchWord.value);
                            }
                        }
                    }
                }
                updatedNews.createDate = formatDate(news.createDate);
                updatedNews.updateDate = formatDate(news.updateDate);
                return updatedNews;
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
            '新闻查询成功'
        );
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};





