import { IsString, IsBoolean, IsOptional, IsNotEmpty, Matches, Length, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class PhoneDto {
  @IsString()
  phone: string;
}

class CardDto {
  @IsString()
  bankName: string;

  @IsString()
  number: string;

  @IsString()
  expired: string;
}

export class CreateUserDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  sudlangan?: boolean;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, {
    message: 'Birthdate must be in format DD.MM.YYYY (e.g., 08.10.2000)',
  })
  birthdate: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, {
    message: 'Phone must be in format +998XXXXXXXXX',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(14, 14, { message: 'PINFL must be exactly 14 characters' })
  pinfl: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  gender: boolean;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  telegramUserId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneDto)
  phones?: PhoneDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards?: CardDto[];
}
