declare namespace taskTypes {
    type user = {
        nickname: string,
        accountId: string,
        state: boolean
    }
    interface taskList {
        taskId: string, // 任务id
        title: string, // 任务标题
        taskName: string, // 任务名称
        deadline: string, // 任务截止时间
        content: string, // 任务内容
        canViewContent?: boolean, // 是否可以查看任务内容
        statusId: string, // 任务状态id
        statusValue: string, // 任务状态
        creatorId: string,// 创建者id
        createDate: string, // 创建时间
        updateDate: string,// 更新时间
        creator: user, // 创建者
        executors: user[], // 执行者
        executorIds?: string[], // 执行者id
        viewerIds?: string[], // 查看者id
        viewers: user[]
    }
    interface addOrUpdateTask {
        taskId?: string
        title: string
        taskName: string
        deadline: string
        content: string
        statusId: string
        executorIds: string[]
        viewerIds?: string[]
    }
    interface getTaskList {
        title?: string
        taskName?: string
        statusId?: string
        creatorNickname?: string
        deadlineFrom?: string
        deadlineTo?: string
        page?: number
        limit?: number
    }

    interface getApprovalList {
        taskName?: string
        applicantNickname?: string
        approverNickname?: string
        statusId?: string
        page?: number
        limit?: number
    }

    interface approval {
        requestId: string
        task: {
            taskId: string
            taskName: string
            title: string
            deadline: string
            statusId: string
            statusValue: string
        },
        applicant: user
        approver: user
        reason: string
        statusId: string
        statusValue: string
        approveNote: string
        createDate: string
        updateDate: string
    }
    interface addApproval {
        taskId: string,
        reason: string,
    }
    interface updateApproval {
        requestId: string,
        statusId: string,
        approveNote?: string,
    }
    interface getApplication {
        taskName?: string,
        statusId?: string,
        page?: number,
        limit?: number
    }
    interface application {
        requestId: string
        task: {
            taskId: string
            taskName: string
            title: string
            deadline: string
            statusId: string
            statusValue: string
        },
        approver: user
        reason: string
        statusId: string
        statusValue: string
        approveNote: string
        createDate: string
        updateDate: string
    }
    interface canApplicationTask {

        taskId: string
        title: string
        taskName: string
        creatorNickname: string
        statusId: string
        statusValue: string

    }
}