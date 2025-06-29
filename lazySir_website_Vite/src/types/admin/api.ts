declare namespace AdminApiTypes {
    interface Api {
        apiId?: string;                // 接口 ID
        apiName?: string;              // 接口名称
        apiPath?: string;              // 接口路径
        methodId?: string;               // 请求方法
        description?: string;         // 接口描述
        groupId?: string;               // 所属分组
        state?: boolean;              // 是否启用（默认 true）
        requireAuth?: boolean;        // 是否需要权限认证（默认 true）
        accountId?: string;            // 创建人 ID（新增必填）
        updateId?: string;            // 更新人 ID（更新时使用）
        createNickname?: string; // 创建人昵称
        updateNickname?: string; // 更新人昵称
        createDate?: Date; // 创建时间
        updateDate?: Date; // 更新时间
        methodKey?: string; // 请求方法的键值（如 GET、POST 等）
        methodValue?: string; // 请求方法的值（如 GET、POST 等）
        groupKey?: string; // 分组的键值
        groupValue?: string; // 分组的值

    }
    interface GetApi extends Api {
        page: number
        limit: number
    }
}
