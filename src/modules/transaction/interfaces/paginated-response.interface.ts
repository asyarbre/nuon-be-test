export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface TransactionVoucherResponse {
  id: string;
  msisdn: string;
  trx_id: string;
  trx_date: Date;
  item: string;
  voucher_code: string;
  status: number;
}
