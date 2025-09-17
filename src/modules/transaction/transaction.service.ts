import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsQueryDto } from './dto/get-transactions-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginatedResponse,
  TransactionVoucherResponse,
} from './interfaces/paginated-response.interface';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.prisma.transactionVoucher.create({
      data: {
        msisdn: createTransactionDto.msisdn,
        trx_id: createTransactionDto.trx_id,
        trx_date: new Date(createTransactionDto.trx_date),
        item: createTransactionDto.item,
        voucher_code: createTransactionDto.voucher_code,
        status: createTransactionDto.status,
      },
    });
    return {
      message: 'Transaction created successfully',
      data: transaction,
    };
  }

  async findAll(
    query: GetTransactionsQueryDto,
  ): Promise<PaginatedResponse<TransactionVoucherResponse>> {
    const {
      skip = 0,
      limit = 10,
      sort_by = 'trx_date',
      sort_order = 'desc',
      search,
      msisdn,
      status,
    } = query;

    const take = Math.min(limit, 100);

    const normalizedSearch: string | undefined = search?.toString().trim();

    const where: Prisma.TransactionVoucherWhereInput = {
      ...(msisdn ? { msisdn } : {}),
      ...(typeof status === 'number' ? { status } : {}),
      ...(normalizedSearch
        ? {
            OR: [
              { msisdn: { contains: normalizedSearch, mode: 'insensitive' } },
              { trx_id: { contains: normalizedSearch, mode: 'insensitive' } },
              { item: { contains: normalizedSearch, mode: 'insensitive' } },
              {
                voucher_code: {
                  contains: normalizedSearch,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    type AllowedSort =
      | 'id'
      | 'msisdn'
      | 'trx_id'
      | 'trx_date'
      | 'item'
      | 'voucher_code'
      | 'status';
    const allowedSortFields: ReadonlyArray<AllowedSort> = [
      'id',
      'msisdn',
      'trx_id',
      'trx_date',
      'item',
      'voucher_code',
      'status',
    ] as const;

    const safeSortField: AllowedSort = allowedSortFields.includes(
      sort_by as AllowedSort,
    )
      ? (sort_by as AllowedSort)
      : 'trx_date';

    const primaryOrder: Prisma.TransactionVoucherOrderByWithRelationInput =
      (() => {
        const dir = sort_order as Prisma.SortOrder;
        switch (safeSortField) {
          case 'id':
            return { id: dir };
          case 'msisdn':
            return { msisdn: dir };
          case 'trx_id':
            return { trx_id: dir };
          case 'trx_date':
            return { trx_date: dir };
          case 'item':
            return { item: dir };
          case 'voucher_code':
            return { voucher_code: dir };
          case 'status':
            return { status: dir };
        }
      })();

    const orderBy: Prisma.TransactionVoucherOrderByWithRelationInput[] = [
      primaryOrder,
      { id: 'desc' },
    ];

    const [transactions, total] = await Promise.all([
      this.prisma.transactionVoucher.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.transactionVoucher.count({ where }),
    ]);

    return {
      data: transactions,
      total,
      skip,
      limit: take,
    };
  }
}
