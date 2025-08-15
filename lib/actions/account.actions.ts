'use server';

import { AppError } from '../errors/appError';
import { prisma } from '../prisma';

export const createBankAccount = async ({
  userId,
  plaidBankId,
  plaidId,
  accessToken,
  fundingSourceUrl,
  shareableId,
  businessId
}: {
  userId: string;
  plaidBankId: string;
  plaidId: string;
  accessToken: string;
  fundingSourceUrl: string;
  shareableId: string;
  businessId: string;
}) => {
  try {
    const bankAccount = await prisma.bank.create({
      data: {
        userId,
        businessId,
        plaidBankId,
        plaidId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      },
    });
    return bankAccount;
  } catch (error) {
    console.error('Error creating bank account:', error);
    throw new AppError('CREATE_BANK_ACCOUNT_FAILED', 'Invalid input for creating bank account', 400);
  }
};

export const getBanks = async ({ userId }: {userId: string}) => {
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
    throw new AppError('GET_BANKS_FAILED', 'Failed to fetch banks', 500);
  }
};

export const getBank = async ({ id }: { id: string}) => {
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
    throw new AppError('GET_BANK_FAILED', 'Failed to fetch banks', 500);
  }
};

export const getBankByAccountId = async ({ accountId }: { accountId: string}) => {
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
    throw new AppError('GET_BANK_BY_ACCOUNT_ID_FAILED', 'Failed to fetch bank by account ID', 500);
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
    throw new AppError('GET_BANK_BY_SHAREABLE_ID_FAILED', 'Failed to fetch bank by shareable ID', 500);
  }
};
