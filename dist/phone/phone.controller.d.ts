import { PhoneService } from './phone.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
export declare class PhoneController {
    private readonly phoneService;
    constructor(phoneService: PhoneService);
    create(createPhoneDto: CreatePhoneDto): Promise<{
        user: {
            id: number;
            phone: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string | null;
            sudlangan: boolean;
            surname: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
        };
    } & {
        id: number;
        userId: number;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        user: {
            id: number;
            phone: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string | null;
            sudlangan: boolean;
            surname: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
        };
    } & {
        id: number;
        userId: number;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findByUserId(userId: number): Promise<({
        user: {
            id: number;
            phone: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string | null;
            sudlangan: boolean;
            surname: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
        };
    } & {
        id: number;
        userId: number;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            phone: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string | null;
            sudlangan: boolean;
            surname: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
        };
    } & {
        id: number;
        userId: number;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, updatePhoneDto: UpdatePhoneDto): Promise<{
        user: {
            id: number;
            phone: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string | null;
            sudlangan: boolean;
            surname: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
        };
    } & {
        id: number;
        userId: number;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        userId: number;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
