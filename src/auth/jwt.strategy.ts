import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'blacklist-secret-key-2024',
    });
  }

  async validate(payload: any) {
    const client = await this.prisma.client.findUnique({
      where: { id: payload.sub },
    });

    if (!client || client.workStatus === 'BLOCKED') {
      throw new UnauthorizedException('Access denied');
    }

    return { 
      id: client.id, 
      phone: client.phone, 
      role: client.role,
      workStatus: client.workStatus
    };
  }
}
