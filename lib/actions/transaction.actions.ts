'use server';

import { prisma } from '../prisma';
import { AppError } from '../errors/appError';
import { Transaction } from '@/types/client/entities';

export const createTransaction = async (transaction: Transaction) => {
  try {

    const newTransaction = await prisma.transaction.create({
      data: {
        name: transaction.name,
        amount: Number(transaction.amount),
        payee: transaction.payee, // Add required payee field
        date: transaction.date, // Add required date field
        categoryId: transaction.category?.id, // Use categoryId instead of category
        paymentChannel: 'online',
        accountId: transaction.account?.id
      },
    });

    return newTransaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new AppError('CREATE_TRANSACTION_FAILED', 'Invalid input for creating transaction', 400);
  }
};
