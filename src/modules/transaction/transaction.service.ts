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
    } = query;

    // Build order by clause
    const orderBy: Prisma.TransactionVoucherOrderByWithRelationInput = {};

    // Validate sort_by field exists in the model
    const validSortFields = [
      'id',
      'msisdn',
      'trx_id',
      'trx_date',
      'item',
      'voucher_code',
      'status',
    ];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'trx_date';
    orderBy[sortField] = sort_order;

    // Execute queries in parallel
    const [transactions, total] = await Promise.all([
      this.prisma.transactionVoucher.findMany({
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.transactionVoucher.count(),
    ]);

    return {
      data: transactions,
      total,
      skip,
      limit,
    };
  }
}
