declare namespace AdminTypes {
    interface account {
        accountId: string,
        username: string,
        state: boolean,
        isDelete: boolean,
        createDate: string,
        updateDate: string,
    }
    interface adminInfo {
        accountInfoId: string,
        phone?: string,
        age?: number,
        gender?: number,// 0:女 1:男
        email?: string,
        nickname?: string,
        address?: string,
        state: boolean,
        accountId?: string,
        isDelete?: boolean,
        avatar?: string,
        createDate?: Date,
        updateDate?: Date,
        username: string,
        roles?: RoleTypes.Role[]
    }

    //登陆需要的数据
    interface accountLogin {
        username: string,
        password: string
    }
    //注册需要的数据
    interface accountRegister {
        username: string,
        password: string,
        password2: string,
        register_code: string
    }
    //切换登陆和注册界面的状态
    interface accountPageState {
        signUpMode: boolean;//true为注册，false为登陆
        //chang是切换状态的方法，返回值为空，参数为空
        changeState: () => void
    }
}