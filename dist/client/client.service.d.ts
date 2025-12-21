import { PrismaService } from '../prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(clientId: number): Promise<{
        id: number;
        phone: string;
        fullname: string;
        createdAt: Date;
        image: string;
        workStatus: import(".prisma/client").$Enums.WorkStatus;
        role: import(".prisma/client").$Enums.ClientRole;
    }>;
    updateProfile(clientId: number, updateDto: UpdateClientDto): Promise<{
        id: number;
        phone: string;
        fullname: string;
        image: string;
        workStatus: import(".prisma/client").$Enums.WorkStatus;
        role: import(".prisma/client").$Enums.ClientRole;
    }>;
}
