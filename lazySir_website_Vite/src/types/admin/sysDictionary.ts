declare namespace sysDictionaryTypes {
    interface addOrUpdateSysDictionary {
        //     key（必填）：字典项的键名，最大长度100个字符。
        // value（必填）：字典项的值，最大长度100个字符。
        // level（必填）：字典项的等级，取值范围为1至3。
        // description（可选）：字典项的描述，最大长度255个字符，允许为空。
        // parentId（可选）：父级字典项的ID，最大长度255个字符，允许为空。
        // state（必填）：字典项的状态，布尔值，默认启用。
        dictionaryId?: string,
        key: string,
        value: string,
        level: number,
        description?: string,
        parentId?: string,
        state: boolean
    }
    interface sysDictionary {
        dictionaryId: string,
        key: string,
        value: string,
        level: number,
        description: string,
        parentId: string,
        state: boolean,
        accountId: string,
        updatedId: string,
        createdDate: string,
        updatedDate: string
    }
    interface getSysDictionary {

        // 校验规则：
        // page（必填）：当前页数，必须为1及以上的整数，最大255。
        // limit（必填）：每页条数，必须为1及以上的整数，最大255。
        // value（可选）：字典项的值，支持模糊查询，最大长度255个字符。
        // level（可选）：字典项的等级，取值范围为1至3。
        //parentId(可选)：父级字典项的ID，最大长度255个字符，允许为空。
        page?: number,
        limit?: number,
        value?: string,
        level?: number,
        parentId?: string
        state?: boolean
    }
}