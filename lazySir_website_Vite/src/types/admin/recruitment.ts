declare namespace RecruitmentTypes {
    interface Recruitment {
        recruitmentId: string,
        title: string
        content: string
        isHot: boolean
        accountId: Date
        updatedId: Date
        state: boolean
        nickName: string
        updatedNickName: string
        createDate: Date
        updateDate: Date
        addressId: string
        companyId: string
        categoryId: string
        degreeId: string
        experienceId: string
        addressValue: string,
        companyValue: string,
        categoryValue: string,
        degreeValue: string,
        experienceValue: string
    }
    interface AddRecruitment {
        recruitmentId?: string;
        title: string;           // 标题，最大长度255
        content?: string | null; // 内容，最大长度2000，允许为空
        isHot?: boolean;         // 是否热门，默认值false
        state?: boolean;         // 状态，默认值true
        addressId: string;       // 地址ID，最大长度255
        companyId: string;       // 公司ID，最大长度255
        categoryId: string;        // 分类，最大长度255
        degreeId: string;        // 学历，最大长度255
        experienceId: string;        // 经验，最大长度255
    }

    interface UpdateRecruitment {
        recruitmentId: string;   // 招聘ID，最大长度255
        title: string;           // 标题，最大长度255
        content?: string | null; // 内容，最大长度2000，允许为空
        isHot?: boolean;         // 是否热门，默认值false
        state?: boolean;         // 状态，默认值true
        addressId: string;       // 地址ID，最大长度255
        companyId: string;       // 公司ID，最大长度255
        categoryId: string;        // 分类，最大长度255
        degreeId: string;        // 学历，最大长度255
        experienceId: string;        // 经验，最大长度255
    }

    interface DeleteRecruitment {
        recruitmentIds: string[]; // 招聘ID数组，不能为空
    }

    interface GetRecruitment {
        nickName?: string | null;  // 发布人昵称，最大255，允许为空
        addressId?: string | null; // 地址ID，最大255，允许为空
        companyId?: string | null; // 公司ID，最大255，允许为空
        categoryId?: string | null;  // 分类，最大255，允许为空
        degreeId?: string | null; // 学历，最大255，允许为空
        experienceId?: string | null;  // 经验，最大255，允许为空
        state?: boolean | null;    // 状态，布尔值，允许为空
        title?: string | null;     // 标题，最大255，允许为空
        content?: string | null;   // 内容，最大2000，允许为空
        isHot?: boolean | null;    // 是否热门，布尔值，允许为空
        page?: number | null;      // 当前页数，整数，1-255
        limit?: number | null;     // 每页条数，整数，1-255
    }




}
