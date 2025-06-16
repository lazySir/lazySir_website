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

}