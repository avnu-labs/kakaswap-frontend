import type { ButtonProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useEffect, useRef } from "react";

interface WalletConnectProps extends ButtonProps {
  customConnectedButton?: JSX.Element;
  fullWidth?: boolean;
}
const WalletConnect = ({ customConnectedButton, fullWidth }: WalletConnectProps) => {
  const { isConnected } = useWeb3ModalAccount();
  const ref = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const { current } = ref;
      if (fullWidth && current) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const button = current.firstChild.shadowRoot.children[0].shadowRoot.children[0].shadowRoot.children[0];
        if (button) {
          button.style.width = "100%";
        }
      }
    });
  }, [fullWidth, ref, isConnected]);

  return !isConnected || !customConnectedButton ? (
    <Box ref={ref} className={fullWidth ? "web3-full-width" : ""}>
      <w3m-button />
    </Box>
  ) : (
    customConnectedButton
  );
};

export default WalletConnect;
