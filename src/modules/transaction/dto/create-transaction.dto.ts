import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  msisdn: string;

  @IsString()
  trx_id: string;

  @IsDateString()
  trx_date: string;

  @IsString()
  item: string;

  @IsString()
  voucher_code: string;

  @IsNumber()
  status: number;
}
