'use server';

import { getBankByAccountIdProps, getBankProps, getBanksProps } from '@/types/bank';
import { AppError } from '../errors/appError';
import { prisma } from '../prisma';
import { CreateBankAccountProps } from './../../types/account';

export const createBankAccount = async ({
  userId,
  businessId,
  plaidBankId,
  plaidAccountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: CreateBankAccountProps & { businessId: string }) => {
  try {
    const bankAccount = await prisma.bank.create({
      data: {
        userId,
        businessId,
        plaidBankId,
        plaidAccountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      },
    });
    return bankAccount;
  } catch (error) {
    console.error('Error creating bank account:', error);
    throw new AppError('CREATE_ACCOUNT_FAILED', 'Invalid input for creating bank account', 400);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {

    const banks = await prisma.bank.findMany({
	  where: { userId },
	  include: {
        accounts: true,
	  },
    });

    if (!banks || banks.length === 0) {
      throw new AppError('NO_BANKS_FOUND', 'No banks found for the user', 404);
    }

    return banks;
  } catch (error) {
    console.error(error);
  }
};

export const getBank = async ({ id }: getBankProps) => {
  try {

    const bank = await prisma.bank.findUnique({
	  where: { id },
	  include: {
        accounts: true,
	  },
    });
    if (!bank) {
	  throw new AppError('BANK_NOT_FOUND', 'Bank not found', 404);
    }

    return bank;
  } catch (error) {
    console.error(error);
  }
};

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {

    const bank = await prisma.bank.findFirst({
	  where: { id: accountId },
	  include: {
        accounts: true,
	  },
    });
    if (!bank) {
	  throw new AppError('BANK_NOT_FOUND', 'Bank not found for the given account ID', 404);
    }

    return bank;
  } catch (error) {
    console.error(error);
  }
};

export const getBankByShareableId = async ({ shareableId }: { shareableId: string }) => {
  try {
    const bank = await prisma.bank.findUnique({
	  where: { shareableId },
	  include: {
        accounts: true,
	  },
    });

    if (!bank) {
	  throw new AppError('BANK_NOT_FOUND', 'Bank not found for the given shareable ID', 404);
    }

    return bank;
  } catch (error) {
    console.error(error);
    throw new AppError('FETCH_BANK_FAILED', 'Failed to fetch bank by shareable ID', 500);
  }
};
