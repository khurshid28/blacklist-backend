import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        client: {
            id: number;
            fullname: string;
            phone: string;
            image: string;
            role: import(".prisma/client").$Enums.ClientRole;
            workStatus: import(".prisma/client").$Enums.WorkStatus;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        client: {
            id: number;
            fullname: string;
            phone: string;
            image: string;
            role: import(".prisma/client").$Enums.ClientRole;
            workStatus: "ACTIVE";
        };
    }>;
    private generateToken;
}
