import {
  IsOptional,
  IsString,
  Min,
  Max,
  IsIn,
  IsInt,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetTransactionsQueryDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // Sorting
  @IsOptional()
  @IsIn([
    'id',
    'msisdn',
    'trx_id',
    'trx_date',
    'item',
    'voucher_code',
    'status',
  ])
  sort_by?: string = 'trx_date';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @Transform(({ value }) => (value as string)?.toLowerCase())
  sort_order?: 'asc' | 'desc' = 'desc';

  // Filters
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsString()
  msisdn?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number;
}
