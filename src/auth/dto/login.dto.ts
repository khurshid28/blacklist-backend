import { IsString, Matches, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\+998\d{9}$/, {
    message: 'Phone must be in format +998XXXXXXXXX',
  })
  phone: string;

  @IsString()
  @Length(6, 8, { message: 'Parol kamida 6 ta raqamdan iborat bo\'lishi kerak' })
  @Matches(/^\d{6,8}$/, { message: 'Parol faqat raqamlardan iborat bo\'lishi kerak' })
  password: string;
}
