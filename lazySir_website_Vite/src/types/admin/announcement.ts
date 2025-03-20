declare namespace AnnouncementTypes {
    interface addOrUpdateAnnouncement {
        announcementId?: string
        title: string
        content?: string
        state: boolean
        companyId: string
        file: Array<{
            name: string,
            url: string
        }>
        hits: number
    }
    interface announcement extends addOrUpdateAnnouncement {
        accountId: string
        updatedId: string
        createDate: Date
        updateDate: Date
        nickName: string
        updateNickName: string
        companyValue: string
    }
    interface getAnnouncements {
        announcementId?: string
        title?: string
        content?: string
        state?: boolean
        companyId?: string
        createDateFrom?: Date
        createDateTo?: Date
        hitsFrom?: number
        hitsTo?: number
        updateDateFrom?: Date
        updateDateTo?: Date
        nickName?: string
        updateNickName?: string
        page?: number
        limit?: number
    }
}