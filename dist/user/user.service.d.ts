import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        telegramUser: {
            id: number;
            telegramId: bigint;
            userId: number | null;
            phone: string;
            firstName: string;
            lastName: string;
            fullname: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
        };
        phones: {
            id: number;
            userId: number;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        cards: {
            number: string;
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            bankName: string;
            expired: string;
        }[];
    } & {
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
    }>;
    findAll(): Promise<({
        telegramUser: {
            id: number;
            telegramId: bigint;
            userId: number | null;
            phone: string;
            firstName: string;
            lastName: string;
            fullname: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
        };
        phones: {
            id: number;
            userId: number;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        cards: {
            number: string;
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            bankName: string;
            expired: string;
        }[];
        comments: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            content: string;
        }[];
        videos: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            description: string | null;
            url: string;
            duration: number | null;
            fileSize: number | null;
        }[];
        images: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            description: string | null;
            url: string;
            fileSize: number | null;
        }[];
        partners: {
            id: number;
            userId: number;
            createdAt: Date;
            partnerId: number;
        }[];
    } & {
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
    })[]>;
    search(query: string): Promise<({
        telegramUser: {
            id: number;
            telegramId: bigint;
            userId: number | null;
            phone: string;
            firstName: string;
            lastName: string;
            fullname: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
        };
        phones: {
            id: number;
            userId: number;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        cards: {
            number: string;
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            bankName: string;
            expired: string;
        }[];
    } & {
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
    })[]>;
    findOne(id: number): Promise<{
        telegramUser: {
            id: number;
            telegramId: bigint;
            userId: number | null;
            phone: string;
            firstName: string;
            lastName: string;
            fullname: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
        };
        phones: {
            id: number;
            userId: number;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        cards: {
            number: string;
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            bankName: string;
            expired: string;
        }[];
        comments: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            content: string;
        }[];
        videos: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            description: string | null;
            url: string;
            duration: number | null;
            fileSize: number | null;
        }[];
        images: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            description: string | null;
            url: string;
            fileSize: number | null;
        }[];
        partners: ({
            partner: {
                telegramUser: {
                    id: number;
                    telegramId: bigint;
                    userId: number | null;
                    phone: string;
                    firstName: string;
                    lastName: string;
                    fullname: string;
                    username: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
                phones: {
                    id: number;
                    userId: number;
                    phone: string;
                    createdAt: Date;
                    updatedAt: Date;
                }[];
                cards: {
                    number: string;
                    id: number;
                    userId: number;
                    createdAt: Date;
                    updatedAt: Date;
                    bankName: string;
                    expired: string;
                }[];
            } & {
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
            createdAt: Date;
            partnerId: number;
        })[];
    } & {
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
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        phones: {
            id: number;
            userId: number;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        cards: {
            number: string;
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            bankName: string;
            expired: string;
        }[];
    } & {
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
    }>;
    remove(id: number): Promise<{
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
    }>;
    addPartners(userId: number, partnerIds: number[]): Promise<{
        id: number;
        partnerId: number;
        createdAt: Date;
        partner: {
            telegramUser: {
                id: number;
                telegramId: bigint;
                userId: number | null;
                phone: string;
                firstName: string;
                lastName: string;
                fullname: string;
                username: string;
                createdAt: Date;
                updatedAt: Date;
            };
            phones: {
                id: number;
                userId: number;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
            cards: {
                number: string;
                id: number;
                userId: number;
                createdAt: Date;
                updatedAt: Date;
                bankName: string;
                expired: string;
            }[];
        } & {
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
    }[]>;
    getPartners(userId: number): Promise<{
        id: number;
        partnerId: number;
        createdAt: Date;
        partner: {
            telegramUser: {
                id: number;
                telegramId: bigint;
                userId: number | null;
                phone: string;
                firstName: string;
                lastName: string;
                fullname: string;
                username: string;
                createdAt: Date;
                updatedAt: Date;
            };
            phones: {
                id: number;
                userId: number;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
            cards: {
                number: string;
                id: number;
                userId: number;
                createdAt: Date;
                updatedAt: Date;
                bankName: string;
                expired: string;
            }[];
        } & {
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
    }[]>;
    removePartner(userId: number, partnerId: number): Promise<{
        message: string;
        details: {
            userToPartner: number;
            partnerToUser: number;
        };
    }>;
}
