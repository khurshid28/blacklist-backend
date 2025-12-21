import { IsString, IsOptional, Matches, Length } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  @Length(6, 8, { message: 'Password must be 6-8 digits' })
  @Matches(/^\d{6,8}$/, { message: 'Password must be 6-8 digits only' })
  password?: string;
}
