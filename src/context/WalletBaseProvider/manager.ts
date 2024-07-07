import type { Eip1193Provider } from "ethers";
import { parseUnits, formatUnits, BrowserProvider, Contract } from "ethers";
import React, { useMemo } from "react";

import { TokenAbi } from "../../contracts/abis";
import { KAKASWAP_ROUTER } from "../../contracts/addresses";

import type { PoolState, TokenState, WalletBaseState } from "./model";

const USER_DISCONNECTED = "User disconnected";
const useWalletBaseManager = (): WalletBaseState => {
  const [isSigning, setIsSigning] = React.useState(false);

  const approve = React.useCallback(
    async (token: TokenState | PoolState, amount: string, provider: Eip1193Provider | undefined) => {
      if (!provider) throw Error(USER_DISCONNECTED);

      const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      // The Contract object
      const tokenContract = new Contract(token.address, TokenAbi, signer);
      setIsSigning(true);
      return tokenContract
        .approve(KAKASWAP_ROUTER, parseUnits(parseFloat(amount).toFixed(18), token.decimals))
        .then((result) => {
          setIsSigning(false);
          return result;
        })
        .catch((error) => {
          setIsSigning(false);
          throw error;
        });
    },
    []
  );

  const getBalance = React.useCallback(
    async (token: TokenState | PoolState, address: string | undefined, provider: Eip1193Provider | undefined) => {
      if (!provider || !address) throw Error(USER_DISCONNECTED);

      const ethersProvider = new BrowserProvider(provider);
      let balance;

      if (token.isNative) {
        balance = await ethersProvider.getBalance(address);
      } else {
        const signer = await ethersProvider.getSigner();
        // The Contract object
        const tokenContract = new Contract(token.address, TokenAbi, signer);
        balance = await tokenContract.balanceOf(address);
      }

      return parseFloat(formatUnits(balance, token.decimals));
    },
    []
  );

  const getAllowance = React.useCallback(
    async (token: TokenState | PoolState, address: string | undefined, provider: Eip1193Provider | undefined) => {
      if (!provider || !address) throw Error(USER_DISCONNECTED);

      const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      // The Contract object
      const tokenContract = new Contract(token.address, TokenAbi, signer);
      const tokenBalance = await tokenContract.allowance(address, KAKASWAP_ROUTER);

      return parseFloat(formatUnits(tokenBalance, token.decimals));
    },
    []
  );

  return useMemo(
    () => ({ isSigning, approve, getBalance, getAllowance }),
    [isSigning, approve, getBalance, getAllowance]
  );
};

export default useWalletBaseManager;
