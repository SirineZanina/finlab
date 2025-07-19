import { AppError } from '../errors/appError';
import { prisma } from '../prisma';
import { CreateBankAccountProps } from './../../types/account';

export const createBankAccount = async ({
  userId,
  plaidBankId,
  plaidAccountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: CreateBankAccountProps) => {
  try {
    const bankAccount = await prisma.bank.create({
      data: {
        userId,
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
