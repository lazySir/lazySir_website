declare namespace NotificationTypes {
    interface notification {
        notificationId?: string;
        title: string;
        content?: string;
        typeId: string;
        levelId: string;
        createDate: string;
        state?: boolean;
    }

    interface getNotificationList {
        title?: string
        content?: string
        typeId?: string
        levelId?: string
        senderNickName?: string
        state?: boolean
        createDateFrom?: string
        createDateTo?: string
        page?: number
        limit?: number
    }
    interface list extends notification {
        sender: {
            nickname: string;
        };
        receiver: string[];
        notificationId: string;
        state: boolean;
        typeValue: string;
        levelValue: string;
    }
    interface addOrupdateNotification extends list {
        content?: string;

        receiverIds?: string[];
    }


    interface receive {
        notificationReceiverId: string,
        notificationId: string,
        receiverId: string,
        isRead: false,
        readAt: null,
        receiveDate: string,
        notification: list,
        receiver: string

    }
    interface receiveUpdate {
        notificationId: string,
        isRead: boolean
    }
    interface receiveGet {
        title?: string,
        isRead?: boolean,
        content?: string
        receiverNickname?: string
        receiveDateFrom?: string,
        receiveDateTo?: string,
        page?: number
        limit?: number
        typeId?: string,
        levelId?: string
        senderNickName?: string,
        state?: boolean
    }
    interface personalNotification {
        notificationReceiverId: string,
        isRead: boolean
        readAt: string
        receiveDate: string
        notification: {
            notificationId: string
            title: string
            content: string
            typeId: string
            levelId: string
            typeValue: string
            levelValue: string
            senderNickname: string
            createDate: string
            senderAvatar: string
        }
    }
    interface personalNotificationGet {
        limit: number,
        page: number
    }

}