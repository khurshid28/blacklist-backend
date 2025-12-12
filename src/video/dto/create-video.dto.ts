import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateVideoDto {
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
  duration?: number;

  @IsOptional()
  @IsInt()
  fileSize?: number;
}
