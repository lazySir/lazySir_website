declare namespace CommonTypes {
    /** 通用响应结构 */
    interface Response<T> {  // ✅ 泛型定义正确
        code?: number;
        data: T;              // ✅ 用泛型约束 data 类型
        message?: string;
    }
    interface page<T> {
        limit: number,
        page: number,
        totalCount: number,
        data: T
    }

}

