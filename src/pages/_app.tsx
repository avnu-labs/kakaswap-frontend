import { Box, ChakraProvider, Show, Flex, Hide, Text } from "@chakra-ui/react";
import type { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ToastContainer } from "material-react-toastify";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@fontsource/lexend/latin.css";

import type { FC } from "react";
import { useEffect } from "react";

import defaultSEOConfig from "../../next-seo.config";
import { PoolProvider } from "../context/PoolProvider";
import { TranslateProvider } from "../context/TranslateProvider";
import { WalletBaseProvider } from "../context/WalletBaseProvider";
import { WalletProvider } from "../context/WalletProvider";
import { Layout } from "components/layout";
import { BlockHashProvider, TransactionsProvider, SwapProvider } from "context";

import "material-react-toastify/dist/ReactToastify.css";
import createEmotionCache from "styles/createEmotionCache";
import customTheme from "styles/customTheme";

import "styles/globals.css";

import Web3Modal from "../components/wallet/web3-modal";

const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
  emotionCache?: EmotionCache;
}

const Index: FC<Props> = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => {
  useEffect(() => {
    localStorage.setItem("chakra-ui-color-mode", "light");
  });

  return (
    <TranslateProvider>
      <BlockHashProvider>
        <TransactionsProvider>
          <WalletBaseProvider>
            <WalletProvider>
              <PoolProvider>
                <SwapProvider>
                  <CacheProvider value={emotionCache}>
                    <ChakraProvider theme={customTheme}>
                      <Head>
                        <meta
                          name="viewport"
                          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                        />
                      </Head>
                      <DefaultSeo {...defaultSEOConfig} />
                      <Hide below="md">
                        <ToastContainer newestOnTop />
                        <Web3Modal>
                          <Layout>
                            <Component {...pageProps} />
                          </Layout>
                        </Web3Modal>
                      </Hide>
                      <Show below="md">
                        <Box>
                          <Flex margin="0 auto" h="100vh" w="full" align="center" justify="center">
                            <Text>Please use a desktop web browser</Text>
                          </Flex>
                        </Box>
                      </Show>
                    </ChakraProvider>
                  </CacheProvider>
                </SwapProvider>
              </PoolProvider>
            </WalletProvider>
          </WalletBaseProvider>
        </TransactionsProvider>
      </BlockHashProvider>
    </TranslateProvider>
  );
};

Index.defaultProps = {
  emotionCache: clientSideEmotionCache,
};

export default Index;
