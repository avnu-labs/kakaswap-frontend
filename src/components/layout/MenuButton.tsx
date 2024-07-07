import { Flex } from "@chakra-ui/layout";
import {
  Button,
  Link,
  Menu as ChakraMenu,
  MenuButton as ChakraMenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Text,
  chakra,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledFontAwesomeIcon = chakra(FontAwesomeIcon);

export interface MenuItf {
  children: any;
  href: string;
  icon?: any;
  disabled?: boolean;
  disabledTooltip?: string;
}
interface MenuButtonProps {
  menus: MenuItf[];
  text?: string;
  mainGroupTitle?: string;
  icon?: any;
}
const MenuButton = ({ menus, text, mainGroupTitle, icon }: MenuButtonProps) => {
  const renderMenus = (menusToRender: MenuItf[]) => {
    return menusToRender.map((menu, index: number) => {
      const { children, icon: menuItemIcon, href } = menu;
      return typeof children === "string" ? (
        <MenuItem
          as={Link}
          isExternal
          href={href}
          key={`link-${href}`}
          fontSize="14px"
          iconSpacing={4}
          icon={menuItemIcon && <StyledFontAwesomeIcon fontSize="16px" icon={menuItemIcon} w="20px" />}
        >
          {children}
        </MenuItem>
      ) : (
        <MenuItem
          // eslint-disable-next-line react/no-array-index-key
          key={`link-${href}-${index}`}
          cursor="pointer"
          href={href}
          as={Flex}
        >
          {children}
        </MenuItem>
      );
    });
  };

  return (
    <ChakraMenu strategy="fixed" autoSelect={false} isLazy id="more-menu-id" matchWidth>
      {text ? (
        <ChakraMenuButton as={Button} rightIcon={<FontAwesomeIcon icon={icon} fontSize={text ? "10px" : "16px"} />}>
          <Text fontSize="14px" as="span">
            {text}
          </Text>
        </ChakraMenuButton>
      ) : (
        <ChakraMenuButton as={Button}>
          <FontAwesomeIcon icon={icon} fontSize={text ? "10px" : "16px"} />
        </ChakraMenuButton>
      )}
      <MenuList>
        <MenuGroup title={mainGroupTitle}>{renderMenus(menus)}</MenuGroup>
      </MenuList>
    </ChakraMenu>
  );
};

export default MenuButton;
