import { IsString, IsNotEmpty, IsInt, Matches } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'Expired must be in format MMYY (e.g., 0127)',
  })
  expired: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
