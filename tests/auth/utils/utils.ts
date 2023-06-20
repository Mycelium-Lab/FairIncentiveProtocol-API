import { config } from "../../../src/config/config";
import { SignInCompany, SignUpCompany } from "../../../src/entities";

//TODO: RANDOM DATA
export const company: SignUpCompany = {
    name: '',
    email: "",
    password: "1234s5678",
    repeat_password: "1234s5678",
    country: "US",
    repname: "somename",
    phone: "+12124567890"
}

export const signinCompany: SignInCompany = {
    email: "",
    password: "1234s5678"
}

export async function randomBasicCompany(): Promise<SignUpCompany> {
    const password = generateRandomEmail()
    return {
        name: generateRandomEmail(),
        email: generateRandomEmail(),
        password,
        repeat_password: password,
        country: "US",
        repname: "somename",
        phone: generateRandomUSPhoneNumber()
    }
}

export async function createBasicCompany(_company: SignUpCompany) {
    let headers: Headers = new Headers();
    headers.append("Content-Type", "application/json");
    await fetch(
        `http://localhost:${config.PORT}/auth/signup`,
        {
            method: 'post',
            headers: headers,
            body: JSON.stringify(_company)
        }
    )
}

export function generateRandomEmail() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let email = '';
  
    for (let i = 0; i < 10; i++) {
      email += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    email += '@example.com';
  
    return email;
}

export function generateRandomUSPhoneNumber() {
    const areaCodes = [
      '201', '202', '203', '205', '206', '207', '208', '209', '210', '212',
      '213', '214', '215', '216', '217', '218', '219', '224', '225', '228',
      '229', '231', '234', '239', '240', '248', '251', '252', '253', '254',
      '256', '260', '262', '267', '269', '270', '272', '276', '281', '283',
      '301', '302', '303', '304', '305', '307', '308', '309', '310', '312',
      '313', '314', '315', '316', '317', '318', '319', '320', '321', '323'
      // Add more area codes as needed
    ];
  
    const randomAreaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    const randomPrefix = Math.floor(Math.random() * 899) + 100;
    const randomLineNum = Math.floor(Math.random() * 8999) + 1000;
  
    return `+1 ${randomAreaCode}-${randomPrefix}-${randomLineNum}`;
}

export function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
  }
  