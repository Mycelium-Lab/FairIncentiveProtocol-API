import pg from "../config/db";
import { Company, GetCompany, User } from "../entities";

export async function addUser(user: User, getCompany: GetCompany): Promise<boolean> {
    try {
        const company: Company = 
            await pg('companies')
                .select('*')
                .where(getCompany.email ? {email: getCompany.email} : {phone: getCompany.phone})
                .first()
        await pg('users')
            .insert({
                company_id: company.id,
                firstname: user.firstname,
                lastname: user.lastname,
                patronymic: user.patronymic,
                email: user.email,
                wallet: user.wallet
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
