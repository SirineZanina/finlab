'use server';

import { CreateTransactionProps, getTransactionsByBankIdProps } from '@/types/transaction';
import { prisma } from '../prisma';
import { AppError } from '../errors/appError';

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {

    const { categoryId, ...rest } = transaction;

    const newTransaction = await prisma.transaction.create({
      data: {
        ...rest,
        paymentChannel: 'online',
        type: 'Transfer',
        date: new Date(), // add the required date property
        category: {
          connect: {
            id: categoryId, // make sure this exists
          }
        }
      },
      include: {
        category: true, // optional: include category details
      }
    });

    return newTransaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const getTransactionsByBankId = async ({bankId}: getTransactionsByBankIdProps) => {
  try {

    const transactions = await prisma.transaction.findMany({
      where: {
        OR : [
          { senderBankId: bankId },
          { receiverBankId: bankId }
        ]
      },
	  orderBy: {
        createdAt: 'desc', // sort by newest first
	  }
    });

    return {
      total: transactions.length,
      documents: transactions
    };
  } catch (error) {
    console.error('An error occurred while getting transactions by bank ID:', error);
    throw new AppError('GET_TRANSACTIONS_FAILED', 'Failed to retrieve transactions for the specified bank ID', 500);
  }
};
