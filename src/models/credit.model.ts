export type CreditTransactionType = 'credit' | 'debit';

export interface CreditTransaction {
  id: number;
  studentId: number;
  type: CreditTransactionType;
  amount: number;
  reason: string;
  sessionId?: number;
  sessionTitle?: string;
  date: Date;
  adminId: number;
  balanceAfter: number;
}
