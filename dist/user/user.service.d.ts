import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        telegramUser: {
            phone: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            telegramId: bigint;
            firstName: string;
            lastName: string;
            fullname: string;
        };
        phones: {
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
        cards: {
            number: string;
            bankName: string;
            expired: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
    } & {
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
    }>;
    findAll(): Promise<({
        telegramUser: {
            phone: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            telegramId: bigint;
            firstName: string;
            lastName: string;
            fullname: string;
        };
        phones: {
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
        cards: {
            number: string;
            bankName: string;
            expired: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
        comments: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            content: string;
        }[];
        videos: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            title: string | null;
            description: string | null;
            url: string;
            duration: number | null;
            fileSize: number | null;
        }[];
        images: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            title: string | null;
            description: string | null;
            url: string;
            fileSize: number | null;
        }[];
        partners: {
            createdAt: Date;
            id: number;
            userId: number;
            partnerId: number;
        }[];
    } & {
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
    })[]>;
    search(query: string): Promise<({
        telegramUser: {
            phone: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            telegramId: bigint;
            firstName: string;
            lastName: string;
            fullname: string;
        };
        phones: {
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
        cards: {
            number: string;
            bankName: string;
            expired: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
    } & {
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
    })[]>;
    findOne(id: number): Promise<{
        telegramUser: {
            phone: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            telegramId: bigint;
            firstName: string;
            lastName: string;
            fullname: string;
        };
        phones: {
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
        cards: {
            number: string;
            bankName: string;
            expired: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
        comments: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            content: string;
        }[];
        videos: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            title: string | null;
            description: string | null;
            url: string;
            duration: number | null;
            fileSize: number | null;
        }[];
        images: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            title: string | null;
            description: string | null;
            url: string;
            fileSize: number | null;
        }[];
        partners: ({
            partner: {
                telegramUser: {
                    phone: string;
                    username: string;
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    userId: number | null;
                    telegramId: bigint;
                    firstName: string;
                    lastName: string;
                    fullname: string;
                };
                phones: {
                    phone: string;
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    userId: number;
                }[];
                cards: {
                    number: string;
                    bankName: string;
                    expired: string;
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    userId: number;
                }[];
            } & {
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
            createdAt: Date;
            id: number;
            userId: number;
            partnerId: number;
        })[];
    } & {
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
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        phones: {
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
        cards: {
            number: string;
            bankName: string;
            expired: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
        }[];
    } & {
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
    }>;
    remove(id: number): Promise<{
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
    }>;
    addPartners(userId: number, partnerIds: number[]): Promise<{
        id: number;
        partnerId: number;
        createdAt: Date;
        partner: {
            telegramUser: {
                phone: string;
                username: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number | null;
                telegramId: bigint;
                firstName: string;
                lastName: string;
                fullname: string;
            };
            phones: {
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number;
            }[];
            cards: {
                number: string;
                bankName: string;
                expired: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number;
            }[];
        } & {
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
    }[]>;
    getPartners(userId: number): Promise<{
        id: number;
        partnerId: number;
        createdAt: Date;
        partner: {
            telegramUser: {
                phone: string;
                username: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number | null;
                telegramId: bigint;
                firstName: string;
                lastName: string;
                fullname: string;
            };
            phones: {
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number;
            }[];
            cards: {
                number: string;
                bankName: string;
                expired: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number;
            }[];
        } & {
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
    }[]>;
    removePartner(userId: number, partnerId: number): Promise<{
        message: string;
        details: {
            userToPartner: number;
            partnerToUser: number;
        };
    }>;
}
