  export interface IRegisterPayload {
    name: string;
    email: string;
    password: string;
    role:string
    acceptTerms: boolean;
    rememberMe: boolean;
}


 export    interface ILoginUserPayload {
    email: string;
    password: string;
}
export interface IChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}