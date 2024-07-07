import type { ContractTransactionResponse } from "ethers";

export interface StoredTransaction {
  hash: string;
  lastChecked: string;
  description: string;
  status: number;
  successCallback?: () => void;
  errorCallback?: () => void;
}

export type StoredTransactionsState = StoredTransaction[];

export interface TransactionsProviderState {
  transactions: StoredTransactionsState;
  isPending: boolean;
  addTransaction: (
    payload: ContractTransactionResponse,
    description: string,
    successCallback: () => void,
    errorCallback: () => void
  ) => void;
}

export const TRANSACTIONS_PROVIDER_INITIAL_STATE: TransactionsProviderState = {
  transactions: [],
  isPending: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addTransaction: (tx) => undefined,
};
