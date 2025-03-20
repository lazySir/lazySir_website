declare namespace AdminHonorTypes {

    interface addOrUpdateHonor {
        honorId?: String
        name: String // 荣誉名称
        description?: String  // 荣誉描述，允许为空
        state: Boolean  // 状态，表示是否启用
        companyId: String //公司Id
        newsId: String //新闻ID
    }
    interface honor extends addOrUpdateHonor {
        honorId: string // 荣誉ID
        accountId: String // 创建人ID
        updatedId: String // 更新人ID，允许为空
        createDate: Date  // 创建时间
        updateDate: Date  // 更新时间
        nickName: String // 创建人昵称
        companyValue: String //公司名称
        updateNickName: String //更新人名称
        newsTitle: string //新闻名称
    }
    interface getHonor {
        name?: String // 荣誉名称
        state?: Boolean  // 状态，表示是否启用
        companyId?: String //公司Id
        createDateFrom?: Date
        createDateTo?: Date
        updateDateFrom?: Date
        updateDateTo?: Date
        description?: string
        page?: number
        limit?: number
    }
}