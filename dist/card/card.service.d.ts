import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
export declare class CardService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCardDto: CreateCardDto): Promise<{
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
        number: string;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        bankName: string;
        expired: string;
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
        number: string;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        bankName: string;
        expired: string;
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
        number: string;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        bankName: string;
        expired: string;
    }>;
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
        number: string;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        bankName: string;
        expired: string;
    })[]>;
    update(id: number, updateCardDto: UpdateCardDto): Promise<{
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
        number: string;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        bankName: string;
        expired: string;
    }>;
    remove(id: number): Promise<{
        number: string;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        bankName: string;
        expired: string;
    }>;
}
