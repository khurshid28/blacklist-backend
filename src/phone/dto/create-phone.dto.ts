import { IsString, IsNotEmpty, IsInt, Matches } from 'class-validator';

export class CreatePhoneDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, {
    message: 'Phone must be in format +998XXXXXXXXX',
  })
  phone: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
