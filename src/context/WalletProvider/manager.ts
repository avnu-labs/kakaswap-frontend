import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import type { Eip1193Provider } from "ethers";
import React, { useEffect, useMemo } from "react";

import { kakarotSepolia } from "../../components/wallet/web3-modal";
import { displayError } from "../../services/toast.service";
import { getDefaultList } from "../../services/token.service";
import { useTransactions } from "../TransactionsProvider";
import { useTranslate } from "../TranslateProvider";
import type { TokenState } from "../WalletBaseProvider";
import { useWalletBase } from "../WalletBaseProvider";

import type { WalletState } from "./model";
import { WALLET_STATE_INITIAL_STATE } from "./model";

interface WalletManagerState {
  tokens: TokenState[];
}

interface SetTokens {
  type: "set_tokens";
  tokens: TokenState[];
}

interface SetBalance {
  type: "set_balance";
  token: TokenState;
  balance: string;
}

interface SetAllowance {
  type: "set_allowance";
  token: TokenState;
  allowance: string;
}

interface ResetBalance {
  type: "reset_balance";
}

type Action = ResetBalance | SetBalance | SetAllowance | SetTokens;

function reducer(state: WalletManagerState, action: Action): WalletManagerState {
  switch (action.type) {
    case "set_tokens": {
      return {
        ...state,
        tokens: action.tokens,
      };
    }
    case "set_balance": {
      const tokenIdx = state.tokens.findIndex((token) => token.address === action.token.address);
      const newTokens = [...state.tokens];
      if (tokenIdx > -1) {
        newTokens[tokenIdx].balance = action.balance;
        return {
          ...state,
          tokens: [...newTokens],
        };
      }
      return state;
    }
    case "set_allowance": {
      const tokenIdx = state.tokens.findIndex((token) => token.address === action.token.address);
      const newTokens = [...state.tokens];
      if (tokenIdx > -1) {
        newTokens[tokenIdx].allowance = action.allowance;
        return {
          ...state,
          tokens: [...newTokens],
        };
      }
      return state;
    }
    case "reset_balance": {
      return {
        ...state,
        tokens: [...state.tokens].map((token) => {
          return {
            ...token,
            balance: "",
          };
        }),
      };
    }
    default: {
      return state;
    }
  }
}

function loadDefaultTokenList(chainId: number, dispatch: React.Dispatch<Action>): void {
  // eslint-disable-next-line sonarjs/no-identical-functions
  const defaultTokenList = getDefaultList(chainId).map((token) => {
    return {
      ...token,
      balance: "",
      allowance: "",
    };
  });

  dispatch({ type: "set_tokens", tokens: defaultTokenList });
}

const useWalletManager = (): WalletState => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...WALLET_STATE_INITIAL_STATE,
  });
  const { t } = useTranslate();
  const { addTransaction } = useTransactions();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { approve, getBalance, getAllowance } = useWalletBase();
  const { tokens } = state;

  useEffect(() => {
    const defaultChainId = chainId || kakarotSepolia.chainId;
    if (defaultChainId && (!tokens || tokens.length === 0)) loadDefaultTokenList(defaultChainId, dispatch);
  }, [chainId, tokens]);

  // Called when account changed
  useEffect(() => {
    if (!isConnected) {
      // reset wallet if account is undefined (disconnected)
      dispatch({
        type: "reset_balance",
      });
    }
  }, [isConnected]);

  const getTokenBalance = React.useCallback(
    async (token: TokenState, callerAccount: Eip1193Provider) => {
      getBalance(token, address, callerAccount).then((balance: number) => {
        dispatch({
          type: "set_balance",
          balance: balance.toString(10),
          token,
        });
      });
    },
    [address, getBalance]
  );

  const getTokenAllowance = React.useCallback(
    async (token: TokenState, callerAccount: Eip1193Provider) => {
      getAllowance(token, address, callerAccount).then((balance: number) => {
        dispatch({
          type: "set_allowance",
          allowance: balance.toString(10),
          token,
        });
      });
    },
    [address, getAllowance]
  );

  // Need to init token list before call
  const getTokenBalanceForAll = React.useCallback(
    async (tokensToGetBalance: TokenState[], callerAccount: Eip1193Provider) => {
      tokensToGetBalance.forEach((token: TokenState) => {
        getTokenBalance(token, callerAccount);
      });
    },
    [getTokenBalance]
  );

  // Need to init token list before call
  const getTokenAllowanceForAll = React.useCallback(
    async (tokensToGetAllowance: TokenState[], callerAccount: Eip1193Provider) => {
      tokensToGetAllowance.forEach((token: TokenState) => {
        getTokenAllowance(token, callerAccount);
      });
    },
    [getTokenAllowance]
  );

  const approveToken = React.useCallback(
    async (token: TokenState, amount: string, callerAccount: Eip1193Provider) => {
      const actionLabel = `Approve to spend ${amount} ${token.symbol}`;
      approve(token, amount, callerAccount)
        .then((result) => {
          addTransaction(
            result,
            actionLabel,
            () => {
              getTokenAllowance(token, callerAccount);
            },
            () => {}
          );
        })
        .catch(() => {
          // Update toast to "error"
          displayError(t.common.transaction_rejected_by_user, actionLabel);
        });
    },
    [addTransaction, approve, getTokenAllowance, t.common.transaction_rejected_by_user]
  );

  return useMemo(
    () => ({
      ...state,
      approveToken,
      getTokenBalance,
      getTokenBalanceForAll,
      getTokenAllowance,
      getTokenAllowanceForAll,
    }),
    [state, approveToken, getTokenBalance, getTokenBalanceForAll, getTokenAllowance, getTokenAllowanceForAll]
  );
};

export default useWalletManager;
