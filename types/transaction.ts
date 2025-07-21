import { Decimal } from '@prisma/client/runtime/library';

export type Transaction = {
	id: string;
	name: string;
	amount: Decimal;
	paymentChannel: string;
	type: string;
	pending: boolean;
	category: string;
	date: Date;
	senderBankId: string;
	receiverBankId: string;
	createdAt: Date;
	image?: string;
}

export type getInstitutionProps = {
	institutionId: string;
}

export type getTransactionsByBankIdProps = {
	bankId: string;
}

export type CreateTransactionProps = {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  category: string;
  email: string;
}

export type getTransactionsProps = {
	accessToken: string;
}
