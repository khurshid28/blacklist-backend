import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    create(createCardDto: CreateCardDto): Promise<{
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
        number: string;
        bankName: string;
        expired: string;
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
        number: string;
        bankName: string;
        expired: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    })[]>;
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
        number: string;
        bankName: string;
        expired: string;
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
        number: string;
        bankName: string;
        expired: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    }>;
    update(id: number, updateCardDto: UpdateCardDto): Promise<{
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
        number: string;
        bankName: string;
        expired: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    }>;
    remove(id: number): Promise<{
        number: string;
        bankName: string;
        expired: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    }>;
}
