export type Transaction = {
	id: string;
	name: string;
	amount: number;
	paymentChannel: string;
	type: string;
	pending: boolean;
	category: string;
	date: Date;
	image: string;
	createdAt: Date;
	channel: string;
	senderBankId: string;
	receiverBankId: string;
}
