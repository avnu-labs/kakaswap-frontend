import type { ContractTransactionResponse } from "ethers";

import type { StoredTransaction, StoredTransactionsState } from "./model";

interface AddTransaction {
  type: "ADD_TRANSACTION";
  payload: ContractTransactionResponse;
  description: string;
  successCallback: () => void;
  errorCallback: () => void;
}

interface UpdateTransactions {
  type: "UPDATE_TRANSACTIONS";
  payload: StoredTransaction[];
}

type Action = AddTransaction | UpdateTransactions;

const transactionsReducer = (state: StoredTransactionsState, action: Action): StoredTransactionsState => {
  switch (action.type) {
    case "ADD_TRANSACTION": {
      const storedTx: StoredTransaction = {
        hash: action.payload.hash,
        description: action.description,
        status: -1,
        lastChecked: "",
        successCallback: action.successCallback,
        errorCallback: action.errorCallback,
      };
      return [storedTx, ...state];
    }
    case "UPDATE_TRANSACTIONS": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default transactionsReducer;
