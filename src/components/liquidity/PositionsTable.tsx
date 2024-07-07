import { Box } from "@chakra-ui/layout";
import { Flex, Text, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useEffect, useState } from "react";

import { useTranslate } from "../../context/TranslateProvider";
import type { PoolState } from "../../context/WalletBaseProvider";
import { readableStringNotZeroOrUndefined } from "../../helpers/math";
import Button from "../form/Button";
import DoubleTokenImage from "../informational/DoubleTokenImage";
import Spinner from "../informational/Spinner";
import Collapsible from "../layout/Collapsible";

import RemoveLiquidityManager from "./RemoveLiquidityManager";

interface PositionsTableProps {
  pools: PoolState[];
}

const PositionsTable = ({ pools }: PositionsTableProps) => {
  const { t } = useTranslate();
  const { isConnected } = useWeb3ModalAccount();
  const [userPositions, setUserPositions] = useState<PoolState[]>();
  const [userPositionsLoading, setUserPositionsLoading] = useState<boolean>(false);
  const [currentOpenPoolIndex, setCurrentOpenPoolIndex] = useState<number>(-1);

  useEffect(() => {
    const isLoading: boolean =
      isConnected &&
      pools.length > 0 &&
      pools.findIndex((pool) => {
        return !pool.balance; // No defined balance seems not loaded yet
      }) !== -1;
    const newUserPosition = pools.filter((pool: PoolState) =>
      readableStringNotZeroOrUndefined(pool.balance, pool.decimals)
    );
    setUserPositions(newUserPosition);
    setUserPositionsLoading(isLoading);
  }, [pools, isConnected]);

  const openRemoveLiquidityManager = (newIndex: number) => {
    setCurrentOpenPoolIndex(newIndex === currentOpenPoolIndex ? -1 : newIndex);
  };

  const renderPair = (pool: PoolState) => {
    return (
      <Flex direction="row" align="center" justify="flex-start">
        <DoubleTokenImage token0={pool.token0} token1={pool.token1} />
        <Text ml={4} fontWeight="semibold">
          {pool.token0.symbol} - {pool.token1.symbol}
        </Text>
      </Flex>
    );
  };

  const renderPositionPoolHeader = (pool: PoolState, index: number) => {
    return (
      <Table colorScheme="whiteAlpha" size="sm">
        <Tbody>
          <Tr>
            <Td py={2}>{renderPair(pool)}</Td>
            <Td py={2} isNumeric>
              {pool.balance} LP
            </Td>
            <Td py={2} isNumeric width="20%">
              <Button onClick={() => openRemoveLiquidityManager(index)} size="sm">
                {currentOpenPoolIndex === index ? t.pool.hide : t.pool.show}
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    );
  };

  const renderPositionPool = (pool: PoolState, index: number) => {
    return (
      <Collapsible
        isOpen={currentOpenPoolIndex === index}
        disabledHeaderToggle
        key={`pool-${pool.address}`}
        header={renderPositionPoolHeader(pool, index)}
      >
        <Box pt={4}>
          <RemoveLiquidityManager pool={pool} />
        </Box>
      </Collapsible>
    );
  };

  return (
    <Flex w="full" direction="column" align="center" justify="flex-start">
      {/* User is connect & have some positions */}
      {isConnected && userPositions && userPositions.length > 0 && (
        <>
          {/* Divide each row to individual Table to allow put collapsible inside */}
          <Table colorScheme="whiteAlpha" size="sm">
            <Thead>
              <Tr>
                <Th>{t.pool.pair}</Th>
                <Th isNumeric>{t.pool.amount}</Th>
                <Th isNumeric width="20%">
                  {/* empty head */}
                </Th>
              </Tr>
            </Thead>
          </Table>
          {userPositions.map((pool: PoolState, index: number) => {
            return renderPositionPool(pool, index);
          })}
        </>
      )}
      {/* User is connect & have no positions */}
      {isConnected && (!userPositions || userPositions.length === 0) && t.pool.no_position}
      {/* User is not connect */}
      {!isConnected && t.pool.please_connect}
      {/* Loading indicator */}
      {userPositionsLoading && (
        <Flex align="center" justify="center" mt={8}>
          <Spinner />
          <Text ml={2}>{t.common.loading}...</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default PositionsTable;
