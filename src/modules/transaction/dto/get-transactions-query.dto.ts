import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
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

  // Filtering
  @IsOptional()
  @IsString()
  msisdn?: string;

  @IsOptional()
  @IsString()
  trx_id?: string;

  @IsOptional()
  @IsDateString()
  trx_date_from?: string;

  @IsOptional()
  @IsDateString()
  trx_date_to?: string;

  @IsOptional()
  @IsString()
  item?: string;

  @IsOptional()
  @IsString()
  voucher_code?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;

  // Search functionality
  @IsOptional()
  @IsString()
  search?: string;

  // Sorting
  @IsOptional()
  @IsString()
  sort_by?: string = 'trx_date';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase())
  sort_order?: 'asc' | 'desc' = 'desc';
}
