import MastercardIcon from '@/components/assets/icons/mastercardIcon';
import { PaypassIcon } from '@/components/assets/icons/paypassIcon';
import { formatAmount } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import Copy from '../copy/copy';
import { BankCardProps } from './bankCard.types';

const BankCard = ({ account, username, showBalance } : BankCardProps) => {
  return (
    <div className="flex flex-col">
      <Link href={`/dashboard/transaction-history/?id=${account.id}`} className="bank-card">
        <div className="bank-card_content">
          <div>
            <h1 className="text-base font-semibold text-white">
              {account.name}
            </h1>
            <p className="font-ibm-plex-serif font-black text-white">
              {formatAmount(Number(account.currentBalance))}
            </p>
          </div>

          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-xs font-semibold text-white">
                {username}
              </h1>
              <h2 className="text-xs font-semibold text-white">
              ●● / ●●
              </h2>
            </div>
            <p className="text-sm font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● <span>{account?.mask}</span>
            </p>
          </article>
        </div>

        <div className="bank-card_icon">
          <PaypassIcon />
          <MastercardIcon
            className="ml-5"
          />
        </div>
        <Image
          src="/images/bank-card/lines.png"
          width={316}
          height={190}
          alt="lines"
          className="absolute top-0 left-0"
        />
      </Link>

      {showBalance && <Copy title={account?.shareableId} />}
    </div>
  );
};

export default BankCard;
