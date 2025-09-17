import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetTransactionsQueryDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  // Sorting
  @IsOptional()
  @IsString()
  sort_by?: string = 'trx_date';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase())
  sort_order?: 'asc' | 'desc' = 'desc';
}
