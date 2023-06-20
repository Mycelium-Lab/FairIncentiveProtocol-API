export interface SignUpCompany {
    name: string,
    email: string,
    password: string,
    repeat_password: string,
    country?: string,
    phone?: string,
    repname: string
}

export interface SignInCompany {
    email?: string,
    password: string
}
