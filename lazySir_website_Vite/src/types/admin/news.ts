declare namespace adminNewsTypes {

    interface addorUpdateNews {
        newsId?: string,
        title: string,
        content?: string,
        state?: boolean,
        hits?: number,
        hotSearchWordIds?: string
        companyId: string
    }
    interface news {
        newsId: string,
        title: string,
        content: string,
        accountId: string,
        updatedId: string,
        state: boolean,
        createDate: Date
        updateDate: Date
        hits: number,
        hotSearchWordIds: string
        companyId: string
        nickName: string,
        updateNickName: string,
        companyValue: string
        hotSearchWordValues: string[]
    }
    interface getNews {
        newsId?: string
        title?: string	//否	新闻标题，最长 255 个字符
        content?: string	//否	新闻内容，最长 10000 个字符
        nickName?: string	//否	发布人昵称
        state?: boolean	//否	状态，必须为布尔值
        hotSearchWordIds?: string	//否	热搜词 JSON 字符串
        companyId?: string	//否	公司 ID
        createDateFrom?: Date	//否	起始创建时间
        createDateTo?: Date	//否	结束创建时间，需大于起始时间
        updateDateFrom?: Date	//否	起始更新时间
        updateDateTo?: Date	//否	结束更新时间，需大于起始时间
        hitsFrom?: number//	否	最小点击量，必须不小于 0
        hitsTo?: number	//否	最大点击量，需大于等于最小点击量
        page?: number	//否	分页页码，默认 1
        limit?: number	//否	每页数量，默认 10
    }

}