import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import type { ContractTransactionResponse } from "ethers";
import React, { useEffect, useMemo } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import Web3 from "web3";

import { useBlock } from "../BlockProvider";

import { TransactionsContext } from "./context";
import type { StoredTransaction } from "./model";
import transactionsReducer from "./reducer";

interface TransactionsProviderProps {
  children: React.ReactNode;
}

const LOCAL_STORAGE_KEY = "KAKASWAP_TX_";
const TransactionsProvider = ({ children }: TransactionsProviderProps): JSX.Element => {
  const { blockHash } = useBlock();
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const web3 = useMemo(() => new Web3(walletProvider), [walletProvider]);

  const [transactions, dispatch] = React.useReducer(transactionsReducer, []);

  // Dispatch new transactions to store
  const syncStoreTransactions = (localTransactions: StoredTransaction[]) => {
    dispatch({
      type: "UPDATE_TRANSACTIONS",
      payload: localTransactions,
    });
  };

  // Save new transactions to localstorage
  const syncStoreTransactionsToLocalStorage = (newTransactions: StoredTransaction[], accountAddress: string) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY + accountAddress,
      JSON.stringify(
        newTransactions.map((tx: StoredTransaction) => {
          // Remove successCallback & errorCallback before stringify
          const { successCallback, errorCallback, ...rest } = tx;
          return rest;
        })
      )
    );
  };

  // Check if tx is terminated
  // If yes, use callback & return updated tx
  // If not return undefined
  const processTransactionEnd = (tx: StoredTransaction) => {
    if (tx.status === 1) {
      if (tx.successCallback) tx.successCallback();

      return {
        ...tx,
        successCallback: undefined,
        errorCallback: undefined,
      };
    }

    if (tx.status === 0) {
      if (tx.errorCallback) tx.errorCallback();

      return {
        ...tx,
        successCallback: undefined,
        errorCallback: undefined,
      };
    }
    return undefined;
  };

  // Check if tx has changed, & update it
  const checkAndUpdateTransaction = async (tx: StoredTransaction, newBlockHash: string) => {
    // If tx ended, return
    const txEndedResponse = processTransactionEnd(tx);
    if (txEndedResponse) return txEndedResponse;

    // If last hashBlock when check transaction is the same as newBlockHash
    // RECEIVED status can change in the same block
    if (tx.lastChecked === newBlockHash) {
      return tx;
    }

    try {
      const receipt = await web3.eth.getTransactionReceipt(tx.hash);
      // Update & return the transaction
      const newTransaction: StoredTransaction = {
        ...tx,
        status: parseInt(receipt.status.toString(), 10),
        lastChecked: newBlockHash,
      };

      return newTransaction;
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line no-console
      console.error(`failed to check transaction status: ${tx.hash}`);
    }

    return tx;
  };

  // Run once to get local storage
  // Tricks as localStorage only be accessible via browser, not on SSR with next.js
  useEffect(() => {
    if (address) {
      const localJsonTransactions = localStorage.getItem(LOCAL_STORAGE_KEY + address);
      let localTransactions: StoredTransaction[] = [];
      if (localJsonTransactions) {
        localTransactions = JSON.parse(localJsonTransactions);
        syncStoreTransactions(localTransactions);
      }
    } else {
      syncStoreTransactions([]);
    }
  }, [address]);

  // Dispatch transaction to store
  const addTransaction = React.useCallback(
    (
      payload: ContractTransactionResponse,
      description: string,
      successCallback: () => void,
      errorCallback: () => void
    ) => {
      dispatch({
        type: "ADD_TRANSACTION",
        payload,
        description,
        successCallback,
        errorCallback,
      });
    },
    [dispatch]
  );

  // Called at each block or transactions updated
  useDeepCompareEffect(() => {
    const process = async () => {
      // If block hash is undefined, stop process
      if (!blockHash || !address || transactions.length === 0) {
        return;
      }

      // Filter by unique tx hash
      const filteredTxs = transactions.filter(
        (tx: StoredTransaction, index, self) => index === self.findIndex((txTemp) => txTemp.hash === tx.hash)
      );

      const promises: Promise<StoredTransaction>[] = [];
      filteredTxs.forEach((tx) => promises.push(checkAndUpdateTransaction(tx, blockHash)));

      Promise.all(promises).then((newTransactions: StoredTransaction[]) => {
        // Re-sync the store & the localstorage
        syncStoreTransactions(newTransactions);
        syncStoreTransactionsToLocalStorage(newTransactions, address);
      });
    };
    process();
  }, [blockHash, transactions, address]);

  const isPending = useMemo(() => transactions.some((tx) => tx.status === -1), [transactions]);

  const contextValue = useMemo(
    () => ({ transactions, addTransaction, isPending }),
    [transactions, addTransaction, isPending]
  );

  return (
    <TransactionsContext.Provider
      value={contextValue}
      // eslint-disable-next-line react/no-children-prop
      children={children}
    />
  );
};

export default TransactionsProvider;
