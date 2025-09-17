/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  findAll() {
    return `This action returns all transaction`;
  }
}
