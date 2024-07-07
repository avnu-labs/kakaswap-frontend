import { Flex, Image, Link, Text } from "@chakra-ui/react";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import { useBlock } from "../../context/BlockProvider";
import { useTranslate } from "../../context/TranslateProvider";
import Spinner from "../informational/Spinner";

import MenuButton from "./MenuButton";

const Footer = () => {
  const { locale } = useTranslate();
  const { blockNumber } = useBlock();
  const [animate, setAnimate] = useState<boolean>(false);

  // called each time block has number change
  useEffect(() => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
  }, [blockNumber]);

  return (
    <Flex
      position="relative"
      as="footer"
      width="full"
      justify="center"
      borderTop="1px solid"
      borderColor="whiteAlpha.300"
      pt={2}
      pb={4}
    >
      <Image
        position="absolute"
        zIndex={0}
        src="/carrot-footer.svg"
        alt="KakaSwap"
        bottom={-100}
        width="100%"
        height="auto"
      />
      <Flex
        zIndex={1}
        w={{ md: "100%", lg: "70%" }}
        maxWidth="1120px"
        px={{ md: 4, lg: 0 }}
        minWidth="800px"
        direction="row"
        align="center"
        justify="flex-end"
      >
        <MenuButton
          menus={[
            {
              href: "",
              children: (
                <NextLink href="/" passHref locale="fr">
                  <Link _hover={{ textDecoration: "none" }} href="/" w="full">
                    Français
                  </Link>
                </NextLink>
              ),
            },
            {
              href: "",
              children: (
                <NextLink href="/" passHref locale="en">
                  <Link _hover={{ textDecoration: "none" }} href="/" w="full">
                    English
                  </Link>
                </NextLink>
              ),
            },
          ]}
          icon={faChevronDown}
          text={locale === "en" ? "English" : "Français"}
          mainGroupTitle="Language"
        />
      </Flex>
      <Flex position="fixed" direction="row" align="center" justify="flex-end" right={2} bottom={{ sm: 20, lg: 6 }}>
        <Text mr={2} fontSize={12}>
          {blockNumber}
        </Text>
        <Spinner animate={animate} color="#2ecc71" />
      </Flex>
    </Flex>
  );
};

export default Footer;
