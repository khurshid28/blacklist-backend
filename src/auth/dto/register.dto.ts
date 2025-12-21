import { IsString, Matches, Length, IsEnum, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  fullname: string;

  @IsString()
  @Matches(/^\+998\d{9}$/, {
    message: 'Phone must be in format +998XXXXXXXXX',
  })
  phone: string;

  @IsString()
  @Length(6, 6, { message: 'Password must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Password must be 6 digits only' })
  password: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(['SUPER', 'CLIENT'])
  role?: 'SUPER' | 'CLIENT';
}
