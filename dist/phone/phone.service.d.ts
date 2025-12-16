import { PrismaService } from '../prisma/prisma.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
export declare class PhoneService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPhoneDto: CreatePhoneDto): Promise<{
        user: {
            phone: string;
            image: string | null;
            sudlangan: boolean;
            name: string;
            surname: string;
            username: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    }>;
    findAll(): Promise<({
        user: {
            phone: string;
            image: string | null;
            sudlangan: boolean;
            name: string;
            surname: string;
            username: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            phone: string;
            image: string | null;
            sudlangan: boolean;
            name: string;
            surname: string;
            username: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    }>;
    findByUserId(userId: number): Promise<({
        user: {
            phone: string;
            image: string | null;
            sudlangan: boolean;
            name: string;
            surname: string;
            username: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    })[]>;
    update(id: number, updatePhoneDto: UpdatePhoneDto): Promise<{
        user: {
            phone: string;
            image: string | null;
            sudlangan: boolean;
            name: string;
            surname: string;
            username: string;
            birthdate: string;
            pinfl: string;
            gender: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    }>;
    remove(id: number): Promise<{
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    }>;
}
