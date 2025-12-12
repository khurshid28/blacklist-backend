import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateImageDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsInt()
  fileSize?: number;
}
