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
      msisdn,
      trx_id,
      trx_date_from,
      trx_date_to,
      item,
      voucher_code,
      status,
      search,
      sort_by = 'trx_date',
      sort_order = 'desc',
    } = query;

    // Build where clause for filtering
    const where: Prisma.TransactionVoucherWhereInput = {};

    // Apply individual filters
    if (msisdn) {
      where.msisdn = { contains: msisdn, mode: 'insensitive' };
    }

    if (trx_id) {
      where.trx_id = { contains: trx_id, mode: 'insensitive' };
    }

    if (trx_date_from || trx_date_to) {
      where.trx_date = {};
      if (trx_date_from) {
        where.trx_date.gte = new Date(trx_date_from);
      }
      if (trx_date_to) {
        where.trx_date.lte = new Date(trx_date_to);
      }
    }

    if (item) {
      where.item = { contains: item, mode: 'insensitive' };
    }

    if (voucher_code) {
      where.voucher_code = { contains: voucher_code, mode: 'insensitive' };
    }

    if (status !== undefined) {
      where.status = status;
    }

    // Apply search across multiple fields
    if (search) {
      where.OR = [
        { msisdn: { contains: search, mode: 'insensitive' } },
        { trx_id: { contains: search, mode: 'insensitive' } },
        { item: { contains: search, mode: 'insensitive' } },
        { voucher_code: { contains: search, mode: 'insensitive' } },
      ];
    }

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
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.transactionVoucher.count({ where }),
    ]);

    return {
      data: transactions,
      total,
      skip,
      limit,
    };
  }
}
