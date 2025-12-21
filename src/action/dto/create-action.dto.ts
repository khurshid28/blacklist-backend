import { IsInt, Min, Max, IsString } from 'class-validator';

export class CreateActionDto {
  @IsString()
  startPhone: string;

  @IsInt()
  @Min(0)
  @Max(10)
  maxCount: number;
}
