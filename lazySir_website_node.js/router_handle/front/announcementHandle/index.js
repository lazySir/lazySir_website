const prisma = require('../../../db')
const { formatDate } = require('../../../utils'); // 根据需要引入工具函数
// 查询公告接口
exports.getAnnouncements = async (req, res) => {
    try {
        const {
            announcementId,
            title,
            content,
            companyId,
            nickName,
            page = 1,
            limit = 8,
        } = req.query;
        const queryConditions = {};
        if (announcementId) queryConditions.announcementId = announcementId;
        if (title) queryConditions.title = { contains: title };
        if (content) queryConditions.content = { contains: content };
        queryConditions.state = true;
        if (companyId) queryConditions.companyId = companyId;
        // 处理 nickName 查询
        if (nickName) {
            const adminInfo = await prisma.adminInfo.findFirst({
                where: { nickname: nickName },
                select: { accountId: true },
            });
            if (!adminInfo) return res.myError('未找到对应的发布人');
            queryConditions.accountId = adminInfo.accountId;
        }
        // 如果传入了 newsId，增加 hits 计数
        if (announcementId) {
            await prisma.announcement.update({
                where: { announcementId: announcementId },
                data: { hits: { increment: 1 } },
            });
        }
        const totalCount = await prisma.announcement.count({ where: queryConditions });

        const announcements = await prisma.announcement.findMany({
            where: queryConditions,
            skip: (page - 1) * limit,
            take: Number(limit),
        });
        let result = await Promise.all(
            announcements.map(async (item) => {
                const announcement = { ...item };
                if (item.accountId) {
                    const adminInfo = await prisma.adminInfo.findFirst({
                        where: { accountId: item.accountId },
                        select: { nickname: true },
                    });
                    announcement.nickName = adminInfo ? adminInfo.nickname : null;
                }

                if (item.companyId) {
                    const systemDictionary = await prisma.sysDictionary.findFirst({
                        where: { dictionaryId: item.companyId },
                        select: { value: true },
                    });
                    announcement.companyValue = systemDictionary ? systemDictionary.value : null;
                }

                announcement.createDate = formatDate(item.createDate);
                announcement.updateDate = formatDate(item.updateDate);
                return announcement;
            })
        );
        // 按创建时间倒序排序
        result = result.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        return res.mySuccess({
            data: result,
            totalCount,
            page: Number(page),
            limit: Number(limit),
        }, '公告查询成功');
    } catch (err) {
        console.error(err);
        return res.myError('服务器错误，请稍后再试');
    }
};