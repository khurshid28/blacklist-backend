declare class PhoneDto {
    phone: string;
}
declare class CardDto {
    bankName: string;
    number: string;
    expired: string;
}
export declare class CreateUserDto {
    image?: string;
    sudlangan?: boolean;
    name: string;
    surname: string;
    username: string;
    birthdate: string;
    phone: string;
    pinfl: string;
    gender: boolean;
    telegramUserId?: number;
    phones?: PhoneDto[];
    cards?: CardDto[];
}
export {};
