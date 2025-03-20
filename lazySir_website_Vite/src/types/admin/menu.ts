declare namespace MenuTypes {

    interface Menu {
        meta: {
            createNickname: string
            level: number
            parentId: string | null
            sortOrder: number
            title?: string
            updateNickname?: string
            menuId?: string;
            state?: boolean;
            createdDate?: Date;
            updatedDate?: Date;
            icon: string;
            description?: string | null;
        }
        name: string;
        path: string;
        children?: Menu[];
    }
    interface mysqlMenu {
        menuId?: string;
        menuName: string;
        menuValue: string;
        path: string;
        parentId?: string | null;
        sortOrder?: number;
        icon?: string;
        description?: string | null;
        state: boolean;
        createdDate?: Date;
        updatedDate?: Date;
        createNickname?: string;
        updateNickname?: string;
        level?: number;
        children?: mysqlMenu[];
    }

}