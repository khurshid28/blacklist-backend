import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    getProfile(req: any): Promise<{
        id: number;
        phone: string;
        fullname: string;
        createdAt: Date;
        image: string;
        workStatus: import(".prisma/client").$Enums.WorkStatus;
        role: import(".prisma/client").$Enums.ClientRole;
    }>;
    updateProfile(req: any, updateDto: UpdateClientDto): Promise<{
        id: number;
        phone: string;
        fullname: string;
        image: string;
        workStatus: import(".prisma/client").$Enums.WorkStatus;
        role: import(".prisma/client").$Enums.ClientRole;
    }>;
}
