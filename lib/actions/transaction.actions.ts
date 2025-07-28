'use server';

import { CreateTransactionProps } from '@/types/transaction';
import { prisma } from '../prisma';
import { AppError } from '../errors/appError';

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {

    const newTransaction = await prisma.transaction.create({
      data: {
        name: transaction.name,
        amount: Number(transaction.amount),
        category: transaction.category,
        paymentChannel: 'online',
        type: transaction.type,
        createdAt: transaction.createdAt,
        accountId: transaction.accountId
      },
    });

    return newTransaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new AppError('CREATE_TRANSACTION_FAILED', 'Invalid input for creating transaction', 400);
  }
};
