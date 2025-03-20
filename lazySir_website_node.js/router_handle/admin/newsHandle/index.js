const prisma = require('../../../db')
const { formatDate } = require('../../../utils'); // 根据需要引入工具函数
const { uploadUrls } = require('../../../config/upload')
//引入dotenv env
require('dotenv').config()
// 新增新闻接口
exports.addNews = async (req, res) => {
    try {
        const { title, content, state, hotSearchWordIds, companyId } = req.body;

        // 创建新的新闻
        const newNews = await prisma.news.create({
            data: {
                title,
                content: content || null,
                state: state !== undefined ? state : true,
                hotSearchWordIds: hotSearchWordIds || null, // 热搜词ID列表 是一个json字符串数组
                accountId: req.user.accountId, // 发布人ID
                updatedId: req.user.accountId, // 更新人ID
                companyId: companyId,
                createDate: new Date(), // 创建时间
                updateDate: new Date(), // 更新时间
            },
        });

        return res.mySuccess(newNews, '新闻创建成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};

// 查询新闻接口
exports.getNews = async (req, res) => {
    try {
        const {
            title,
            content,
            nickName,
            state,
            createDateFrom,
            createDateTo,
            updateDateFrom,
            updateDateTo,
            hotSearchWordIds,
            companyId,
            hitsFrom,
            hitsTo,
            page = 1,
            limit = 10,
            newsId, // 添加新闻ID查询条件
        } = req.query;

        const queryConditions = {};
        if (newsId) queryConditions.newsId = newsId;
        if (title) queryConditions.title = { contains: title };
        if (content) queryConditions.content = { contains: content };
        if (companyId) queryConditions.companyId = companyId;
        if (hotSearchWordIds) queryConditions.hotSearchWordIds = { contains: hotSearchWordIds };
        if (state !== undefined && state !== '') queryConditions.state = state;
        if (createDateFrom) queryConditions.createDate = { gte: new Date(createDateFrom) };
        if (createDateTo) queryConditions.createDate = { ...queryConditions.createDate, lte: new Date(createDateTo) };
        if (updateDateFrom) queryConditions.updateDate = { gte: new Date(updateDateFrom) };
        if (updateDateTo) queryConditions.updateDate = { ...queryConditions.updateDate, lte: new Date(updateDateTo) };
        if (hitsFrom) queryConditions.hits = { gte: parseInt(hitsFrom, 10) };
        if (hitsTo) queryConditions.hits = { ...queryConditions.hits, lte: parseInt(hitsTo, 10) };

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

        const result = await Promise.all(
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
                    } else {
                        console.warn(`Invalid hotSearchWordIds for newsId: ${news.newsId}`);
                    }
                }
                updatedNews.createDate = formatDate(news.createDate);
                updatedNews.updateDate = formatDate(news.updateDate);
                return updatedNews;
            })
        );

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

// 更新新闻接口
exports.updateNews = async (req, res) => {
    try {
        const { newsId, title, content, state, hotSearchWordIds, hits, companyId } = req.body;

        const existingNews = await prisma.news.findUnique({
            where: { newsId },
        });

        if (!existingNews) return res.myError('未找到指定的新闻信息');

        const updatedNews = await prisma.news.update({
            where: { newsId },
            data: {
                title: title,
                content: content,
                state: state,
                hotSearchWordIds: hotSearchWordIds,
                companyId: companyId,
                hits: hits,
                updatedId: req.user.accountId,
                updateDate: new Date(),
            },
        });

        return res.mySuccess(updatedNews, '新闻更新成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};

// 删除新闻接口
exports.deleteNews = async (req, res) => {
    try {
        const { newsIds } = req.body;

        if (!Array.isArray(newsIds) || newsIds.length === 0) {
            return res.myError('请提供有效的新闻ID数组');
        }

        const existingNews = await prisma.news.findMany({
            where: { newsId: { in: newsIds } },
            select: { newsId: true, title: true },
        });

        const existingNewsIds = existingNews.map((item) => item.newsId);
        const notFoundIds = newsIds.filter((id) => !existingNewsIds.includes(id));

        await prisma.news.deleteMany({
            where: { newsId: { in: existingNewsIds } },
        });

        if (notFoundIds.length > 0) {
            return res.mySuccess(
                { notFound: notFoundIds },
                '部分新闻未找到，删除失败'
            );
        }

        return res.mySuccess(null, '新闻删除成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};

//上传新闻图片
exports.uploadNewsImg = async (req, res) => {
    try {
        // 确保文件上传成功
        const file = req.file;
        if (!file) {
            return res.myError('新闻图片上传失败，请重新尝试');
        }

        // 构建图片访问 URL
        const imgUrl = process.env.SERVER_URL + uploadUrls.newsImage.saveUrl + `${file.filename}`;
        // 返回成功响应
        return res.send({
            errno: 0,
            data: { url: imgUrl }
        });
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，上传失败');
    }
};