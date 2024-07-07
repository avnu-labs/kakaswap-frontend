import { Flex, HStack, Spacer, Text, Img, Tooltip } from "@chakra-ui/react";
import { faCircleNotch } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";

import { useTransactions } from "../../context";
import { WalletConnect } from "components/wallet";
import { useTranslate } from "context/TranslateProvider";

import type { MenuItf } from "./MenuButton";

interface MenuProps {
  menus: MenuItf[];
}
const Menu = ({ menus }: MenuProps) => {
  const router = useRouter();
  return (
    <HStack ml={8} spacing={4} fontSize="15px">
      {menus.map(({ children, href, disabled, disabledTooltip }: MenuItf) => {
        let color;
        if (disabled) {
          color = "blackAlpha.300";
        } else if (router.pathname === href) {
          color = "pineGreen.900";
        } else {
          color = "blackAlpha.600";
        }
        return disabled ? (
          <Tooltip key={`menu-tooltip-${href}`} label={disabledTooltip} closeOnClick={false}>
            <Text cursor="pointer" color={color}>
              {children}
            </Text>
          </Tooltip>
        ) : (
          <NextLink key={`menu-item-${href}`} href={href} passHref>
            <Text
              as="button"
              transition="color .1s ease-in"
              color={color} // Only if current menu
              _hover={{ color: "blackAlpha.900" }}
            >
              {children}
            </Text>
          </NextLink>
        );
      })}
    </HStack>
  );
};

const Header: FC = () => {
  const { t } = useTranslate();
  const { isPending } = useTransactions();
  return (
    <Flex
      as="header"
      width="full"
      align="center"
      justify="center"
      position="fixed"
      zIndex={100}
      borderBottom="1px solid"
      borderColor="whiteAlpha.300"
      py={2}
    >
      <Flex align="center" w={{ md: "100%", lg: "70%" }} maxWidth="1120px" px={{ md: 4, lg: 0 }} minWidth="800px">
        {/* Logo & app name */}
        <HStack gap={2}>
          <Img height="28px" src="/karrot.svg" alt="logo" transform="rotate(30deg)" />
          <Text fontWeight="semibold">KakaSwap</Text>
        </HStack>

        {/* Menu */}
        <Menu
          menus={[
            { children: t.menu.swap, href: "/" },
            { children: t.menu.pool, href: "/pool" },
          ]}
        />

        {/* Actions */}
        <Spacer />
        <HStack>
          {isPending && (
            <HStack>
              <FontAwesomeIcon icon={faCircleNotch} spin />
              <Text fontWeight="semibold">Pending tx</Text>
            </HStack>
          )}
          <WalletConnect mr={4} />
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Header;
