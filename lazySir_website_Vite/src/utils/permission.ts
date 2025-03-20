import Menu from "@/layouts/admin/components/aside/components/menu.vue";

type OBNumber = {
    CREATE: number;
    DELETE: number;
    UPDATE: number;
    READ: number;
    DELETES: number
    DOWNLOAD: number;
    UPLOAD: number;
};

const OBPERM: OBNumber = {
    CREATE: 0b0000001, // 增
    DELETE: 0b0000010, // 删
    UPDATE: 0b0000100, // 改
    READ: 0b0001000, // 查
    DELETES: 0b0010000, // 批量删除
    DOWNLOAD: 0b0100000, // 下载
    UPLOAD: 0b1000000, // 下载
};

// Menu 类型接口
interface Menu extends MenuTypes.Menu {
    permBtn?: number; // 按钮权限
}

// 解析并汇总权限到父级菜单
export const summarizePermissions = (menus: Menu[]): Menu[] => {
    menus.forEach((menu: Menu) => {
        if (menu.children) {
            menu.children.forEach((child: Menu) => {
                // 确保每个子菜单都有 permBtn
                if (!('permBtn' in child)) {
                    child.permBtn = 0b0000000;
                }
                child.children?.forEach((grandchild: Menu) => {
                    // 如果是三级菜单并且有描述，则处理权限
                    if (grandchild.meta.level === 3 && grandchild.meta.description) {
                        const perm = OBPERM[grandchild.meta.description as keyof OBNumber];
                        if (perm) {
                            //@ts-ignore
                            child.permBtn |= perm;
                        }
                    }
                });
            });
        }
    });
    return menus;
};

// 判断是否具有某项权限
export const hasPermission = (permBtn: number, perm: keyof OBNumber): boolean => {
    return (permBtn & OBPERM[perm]) !== 0;
};