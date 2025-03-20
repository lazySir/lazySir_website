declare namespace RoleTypes {
    interface Role {
        roleId?: string; // 角色ID（主键）
        roleName: string; // 角色名称
        state?: boolean; // 启用状态
        createDate?: Date;
        updateDate?: Date;
        accountId?: number; // 创建人ID
        updateId?: number; // 更新人ID
        description?: string; // 角色描述
        menuPath?: []//用于树形Id展开
    }
    interface mysqlGetRole extends Role {
        createUsername?: string; // 创建人名称
        updateUsername?: string; // 更新人名称
    }
}