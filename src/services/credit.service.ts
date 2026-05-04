import { CreditTransaction } from '../models';
import { CREDIT_TRANSACTIONS, USERS } from '../data/mock-data';

let transactions = [...CREDIT_TRANSACTIONS];

export interface CreditServiceInterface {
  getBalance(studentId: number): Promise<number>;
  getTransactionHistory(studentId: number): Promise<CreditTransaction[]>;
  addCredits(studentId: number, amount: number, reason: string, adminId: number): Promise<CreditTransaction>;
  deductCredit(studentId: number, sessionId: number, sessionTitle: string, adminId: number): Promise<CreditTransaction>;
  getAllStudentBalances(): Promise<{ studentId: number; name: string; balance: number }[]>;
}

export const CreditService: CreditServiceInterface = {
  async getBalance(studentId: number): Promise<number> {
    const user = USERS.find((u) => u.id === studentId);
    return user?.sessionCredits ?? 0;
  },

  async getTransactionHistory(studentId: number): Promise<CreditTransaction[]> {
    return transactions
      .filter((t) => t.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async addCredits(studentId: number, amount: number, reason: string, adminId: number): Promise<CreditTransaction> {
    const user = USERS.find((u) => u.id === studentId);
    if (!user) throw new Error('Student not found');
    user.sessionCredits = (user.sessionCredits ?? 0) + amount;
    const tx: CreditTransaction = {
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
      studentId,
      type: 'credit',
      amount,
      reason,
      date: new Date(),
      adminId,
      balanceAfter: user.sessionCredits,
    };
    transactions = [...transactions, tx];
    return tx;
  },

  async deductCredit(studentId: number, sessionId: number, sessionTitle: string, adminId: number): Promise<CreditTransaction> {
    const user = USERS.find((u) => u.id === studentId);
    if (!user) throw new Error('Student not found');
    if ((user.sessionCredits ?? 0) < 1) throw new Error('Insufficient credits');
    user.sessionCredits = (user.sessionCredits ?? 0) - 1;
    const tx: CreditTransaction = {
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
      studentId,
      type: 'debit',
      amount: 1,
      reason: 'Session attendance',
      sessionId,
      sessionTitle,
      date: new Date(),
      adminId,
      balanceAfter: user.sessionCredits,
    };
    transactions = [...transactions, tx];
    return tx;
  },

  async getAllStudentBalances(): Promise<{ studentId: number; name: string; balance: number }[]> {
    const students = USERS.filter((u) => u.role === 'student');
    return students.map((u) => ({
      studentId: u.id,
      name: `${u.firstName} ${u.lastName}`,
      balance: u.sessionCredits ?? 0,
    }));
  },
};
