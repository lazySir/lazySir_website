// 定义 HTTP 请求方法的类型
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

// 定义 API 端点类型
interface Endpoint {
    url: string;
    method: HttpMethod;
}

// 定义每个 API 模块的类型接口
interface AccountAPI {
    login: Endpoint;
    register: Endpoint;
}

interface AdminInfoAPI {
    logout: Endpoint;
    getAdmin: Endpoint;
    getAllAdmin: Endpoint;
    updateAdmin: Endpoint;
    resetPassword: Endpoint;
    modifyPwd: Endpoint;
    deleteAdmin: Endpoint;
    uploadAvatar: Endpoint;

}

interface MenuAPI {
    getMenu: Endpoint;
    addMenu: Endpoint;
    updateMenu: Endpoint;
    deleteMenu: Endpoint;
}
interface RoleAPI {
    addRole: Endpoint;
    updateRole: Endpoint;
    deleteRole: Endpoint;
    getRole: Endpoint;
}
interface PermissionAPI {
    updateAdminRole: Endpoint;
    getAdminRole: Endpoint;
    updateRoleMenu: Endpoint;
    getRoleMenu: Endpoint;
}
interface SysDictionaryAPI {
    adminGetDictionary: Endpoint;
    adminAddDictionary: Endpoint;
    adminUpdateDictionary: Endpoint;
    adminDeleteDictionary: Endpoint;
    adminGetAllParentDictionary: Endpoint
}
interface RecruitmentAPI {
    adminGetRecruitment: Endpoint;
    adminAddRecruitment: Endpoint;
    adminUpdateRecruitment: Endpoint;
    adminDeleteRecruitment: Endpoint;
}
interface NewsAPI {
    adminGetNews: Endpoint;
    adminAddNews: Endpoint;
    adminUpdateNews: Endpoint;
    adminDeleteNews: Endpoint;
    adminUploadNewsImage: Endpoint;
}
interface HonorAPI {
    adminGetHonor: Endpoint;
    adminAddHonor: Endpoint;
    adminUpdateHonor: Endpoint;
    adminDeleteHonor: Endpoint;
}
interface AnnouncementAPI {
    adminGetAnnouncement: Endpoint;
    adminAddAnnouncement: Endpoint;
    adminUpdateAnnouncement: Endpoint;
    adminDeleteAnnouncement: Endpoint;
    adminUploadImage: Endpoint
    adminUploadFile: Endpoint
}
// 定义完整的 API 类型接口
interface APItype {
    accountAPI: AccountAPI;
    adminInfoAPI: AdminInfoAPI;
    menuAPI: MenuAPI;
    roleAPI: RoleAPI;
    permissionAPI: PermissionAPI;
    sysDictionaryAPI: SysDictionaryAPI;
    recruitmentAPI: RecruitmentAPI;
    newsAPI: NewsAPI;
    honorAPI: HonorAPI;
    announcementAPI: AnnouncementAPI
}



const ADMIN_PREFIX = '/admin'; // 管理员通用接口前缀
const ADMIN_PASSAGE = '/api'; // 不需要 token 验证接口前缀
const ADMIN_PERMISSION = '/permission';

const BASE_URLS = {
    // 管理员账号表接口
    ACCOUNT: ADMIN_PASSAGE + ADMIN_PREFIX + '/account',
    // 管理员信息接口
    ADMININFO: ADMIN_PREFIX + '/accountInfo',
    // 管理员菜单接口
    MENU: ADMIN_PREFIX + ADMIN_PERMISSION + '/menu',
    // 管理员角色接口
    ROLE: ADMIN_PREFIX + ADMIN_PERMISSION + '/role',
    //权限接口
    PERMISSION: ADMIN_PREFIX + ADMIN_PERMISSION + '/auth',
    //系统字典接口
    SYSDICTIONARY: ADMIN_PREFIX + '/systemDictionary',
    //招聘管理接口
    RECRUITMENT: ADMIN_PREFIX + '/recruitment',
    //新闻咨询管理接口
    NEWS: ADMIN_PREFIX + '/news',
    //荣誉管理接口
    HONOR: ADMIN_PREFIX + '/honor',
    ANNOUNCEMENT: ADMIN_PREFIX + '/announcement'
};


/**
 * @description: 返回一个 API 接口：url 和 method
 * @param {string} baseUrl
 * @param {string} path
 * @param {HttpMethod} method
 * @return {Endpoint}
 */
const createEndpoint = (
    baseUrl: string,
    path: string,
    method: HttpMethod
): Endpoint => ({
    url: `${baseUrl}${path}`,
    method,
});

// 具体 API 实现
const accountAPI: AccountAPI = {
    login: createEndpoint(BASE_URLS.ACCOUNT, "/login", "post"),
    register: createEndpoint(BASE_URLS.ACCOUNT, "/register", "post"),
};

const adminInfoAPI: AdminInfoAPI = {
    logout: createEndpoint(BASE_URLS.ADMININFO, "/logout", "post"),
    getAdmin: createEndpoint(BASE_URLS.ADMININFO, '', "get"),
    getAllAdmin: createEndpoint(BASE_URLS.ADMININFO, '/all', 'get'),
    updateAdmin: createEndpoint(BASE_URLS.ADMININFO, '/', 'put'),
    resetPassword: createEndpoint(BASE_URLS.ADMININFO, '/resetPwd', 'put'),
    modifyPwd: createEndpoint(BASE_URLS.ADMININFO, '/modifyPwd', 'put'),
    deleteAdmin: createEndpoint(BASE_URLS.ADMININFO, '/', 'delete'),
    uploadAvatar: createEndpoint(BASE_URLS.ADMININFO, '/uploadAvatar', 'post'),

};

const menuAPI: MenuAPI = {
    getMenu: createEndpoint(BASE_URLS.MENU, '', "get"),
    addMenu: createEndpoint(BASE_URLS.MENU, '', "post"),
    updateMenu: createEndpoint(BASE_URLS.MENU, '', "put"),
    deleteMenu: createEndpoint(BASE_URLS.MENU, '', "delete"),
};
const roleAPI: RoleAPI = {
    addRole: createEndpoint(BASE_URLS.ROLE, '', "post"),
    updateRole: createEndpoint(BASE_URLS.ROLE, '', "put"),
    deleteRole: createEndpoint(BASE_URLS.ROLE, '', "delete"),
    getRole: createEndpoint(BASE_URLS.ROLE, '', "get"),
}
const permissionAPI: PermissionAPI = {
    updateAdminRole: createEndpoint(BASE_URLS.PERMISSION, '/role', "put"),
    getAdminRole: createEndpoint(BASE_URLS.PERMISSION, '/role', "get"),
    updateRoleMenu: createEndpoint(BASE_URLS.PERMISSION, '/menu', "put"),
    getRoleMenu: createEndpoint(BASE_URLS.PERMISSION, '/menu', "post"),
}
const sysDictionaryAPI: SysDictionaryAPI = {
    adminGetDictionary: createEndpoint(BASE_URLS.SYSDICTIONARY, '', "get"),
    adminGetAllParentDictionary: createEndpoint(BASE_URLS.SYSDICTIONARY, '/getAllParent', "get"),
    adminAddDictionary: createEndpoint(BASE_URLS.SYSDICTIONARY, '', "post"),
    adminUpdateDictionary: createEndpoint(BASE_URLS.SYSDICTIONARY, '', "put"),
    adminDeleteDictionary: createEndpoint(BASE_URLS.SYSDICTIONARY, '', "delete"),
}
const recruitmentAPI: RecruitmentAPI = {
    adminAddRecruitment: createEndpoint(BASE_URLS.RECRUITMENT, '', "post"),
    adminUpdateRecruitment: createEndpoint(BASE_URLS.RECRUITMENT, '', "put"),
    adminDeleteRecruitment: createEndpoint(BASE_URLS.RECRUITMENT, '', "delete"),
    adminGetRecruitment: createEndpoint(BASE_URLS.RECRUITMENT, '', "get"),
}
const newsAPI: NewsAPI = {
    adminAddNews: createEndpoint(BASE_URLS.NEWS, '', "post"),
    adminUpdateNews: createEndpoint(BASE_URLS.NEWS, '', "put"),
    adminDeleteNews: createEndpoint(BASE_URLS.NEWS, '', "delete"),
    adminGetNews: createEndpoint(BASE_URLS.NEWS, '', "get"),
    adminUploadNewsImage: createEndpoint(BASE_URLS.NEWS, '/upload', "post"),

}
const honorAPI = {
    adminAddHonor: createEndpoint(BASE_URLS.HONOR, '', "post"),
    adminUpdateHonor: createEndpoint(BASE_URLS.HONOR, '', "put"),
    adminDeleteHonor: createEndpoint(BASE_URLS.HONOR, '', "delete"),
    adminGetHonor: createEndpoint(BASE_URLS.HONOR, '', "get"),
}
const announcementAPI = {
    adminGetAnnouncement: createEndpoint(BASE_URLS.ANNOUNCEMENT, '', "get"),
    adminAddAnnouncement: createEndpoint(BASE_URLS.ANNOUNCEMENT, '', "post"),
    adminUpdateAnnouncement: createEndpoint(BASE_URLS.ANNOUNCEMENT, '', "put"),
    adminDeleteAnnouncement: createEndpoint(BASE_URLS.ANNOUNCEMENT, '', "delete"),
    adminUploadImage: createEndpoint(BASE_URLS.ANNOUNCEMENT, '/uploadImage', "post"),
    adminUploadFile: createEndpoint(BASE_URLS.ANNOUNCEMENT, '/uploadFile', "post"),
}
// 定义整个 API 对象
const API: APItype = {
    accountAPI,
    adminInfoAPI,
    menuAPI,
    roleAPI,
    permissionAPI,
    sysDictionaryAPI,
    recruitmentAPI,
    newsAPI,
    honorAPI,
    announcementAPI
};

export default API;