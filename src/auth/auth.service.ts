import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingClient = await this.prisma.client.findUnique({
      where: { phone: registerDto.phone },
    });

    if (existingClient) {
      throw new ConflictException('Client with this phone already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const client = await this.prisma.client.create({
      data: {
        fullname: registerDto.fullname,
        phone: registerDto.phone,
        password: hashedPassword,
        image: registerDto.image,
        role: registerDto.role || 'CLIENT',
      },
    });

    const token = this.generateToken(client.id, client.phone, client.role);

    return {
      access_token: token,
      client: {
        id: client.id,
        fullname: client.fullname,
        phone: client.phone,
        image: client.image,
        role: client.role,
        workStatus: client.workStatus,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const client = await this.prisma.client.findUnique({
      where: { phone: loginDto.phone },
    });

    if (!client) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    if (client.workStatus === 'BLOCKED') {
      throw new UnauthorizedException('Your account is blocked');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, client.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const token = this.generateToken(client.id, client.phone, client.role);

    return {
      access_token: token,
      client: {
        id: client.id,
        fullname: client.fullname,
        phone: client.phone,
        image: client.image,
        role: client.role,
        workStatus: client.workStatus,
      },
    };
  }

  private generateToken(id: number, phone: string, role: string): string {
    const payload = { sub: id, phone, role };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
