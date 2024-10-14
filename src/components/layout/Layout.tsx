import { Box, Flex } from "@chakra-ui/react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import { useSwap } from "../../context";
import { usePool } from "../../context/PoolProvider";
import { useWalletBase } from "../../context/WalletBaseProvider";
import { useWallet } from "../../context/WalletProvider";
import TransactionSigningModal from "../form/TransactionSigningModal";

import { Footer, Header } from ".";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { walletProvider } = useWeb3ModalProvider();
  const { isConnected } = useWeb3ModalAccount();
  const { tokens, getTokenBalanceForAll, getTokenAllowanceForAll } = useWallet();
  const { isSigning: isSigningApprove } = useWalletBase();
  const { pools, getLPBalanceForAll, getLPAllowanceForAll } = usePool();
  const { getAllPools, isSigning: isLiquiditySigning } = usePool();
  const { isSigning: isSwapSigning } = useSwap();
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (walletProvider && pools.length === 0 && tokens.length > 0) getAllPools(walletProvider);
  }, [getAllPools, walletProvider, pools, tokens]);

  // Once user is connected, fetch is balance
  useEffect(() => {
    // Fetch balance when user connect
    if (!init && tokens.length > 0 && isConnected && walletProvider) {
      getTokenBalanceForAll(tokens, walletProvider);

      getTokenAllowanceForAll(tokens, walletProvider);
    }
    if (!init && pools.length > 0 && isConnected && walletProvider) {
      getLPBalanceForAll(pools, walletProvider);
      getLPAllowanceForAll(pools, walletProvider);
      setInit(true);
    } else if (!walletProvider) {
      setInit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pools, isConnected, walletProvider]);

  return (
    <Box margin="0 auto" h="100%" w="full" transition="0.5s ease-out">
      <Flex h="full" direction="column" align="center" overflow="hidden">
        <Header />
        <Flex
          w={{ md: "100%", lg: "70%" }}
          maxWidth="1120px"
          px={{ md: 4, lg: 0 }}
          minWidth="800px"
          flex="1 1 auto"
          as="main"
          align="flex-start"
          justify="center"
          pb={4}
          zIndex={1}
        >
          <Flex direction="column" w="full" align="center" mt={24} mb={36}>
            {children}
          </Flex>
        </Flex>
        <Footer />
      </Flex>
      <TransactionSigningModal isOpen={isSwapSigning || isLiquiditySigning || isSigningApprove} />
    </Box>
  );
};

export default Layout;
