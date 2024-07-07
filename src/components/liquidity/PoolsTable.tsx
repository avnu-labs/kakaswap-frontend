import { Flex, Text, Table, Tbody, Td, Th, Thead, Tr, Tooltip } from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { faArrowDown, faArrowUp } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from "react";

import { useTranslate } from "../../context/TranslateProvider";
import type { PoolState } from "../../context/WalletBaseProvider";
import { currencyFormatter } from "../../helpers/formatter";
import { formatBigNumberToReadableString } from "../../helpers/math";
import DoubleTokenImage from "../informational/DoubleTokenImage";

interface PoolsTableProps {
  pools: PoolState[];
}

enum SortDirection {
  ASC = 1,
  DESC = -1,
}

enum SortType {
  LIQUIDITY,
  VOLUME,
  FEES,
  APR,
}

const PoolsTable = ({ pools }: PoolsTableProps) => {
  const { t } = useTranslate();
  const [sort, setSort] = useState<SortType>(SortType.LIQUIDITY);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const sortPools = (poolsToSort: PoolState[], sortType: SortType, _sortDirection: SortDirection) => {
    return poolsToSort.sort((pool0, pool1) => {
      let sortResult;
      // eslint-disable-next-line sonarjs/no-small-switch
      switch (sortType) {
        /* case SortType.VOLUME:
          sortResult = parseFloat(pool0.volumeUSD_24) < parseFloat(pool1.volumeUSD_24);
          break;
        case SortType.FEES:
          sortResult = parseFloat(pool0.feesUSD_24) < parseFloat(pool1.feesUSD_24);
          break; */
        case SortType.LIQUIDITY:
        default:
          sortResult = parseFloat(pool0.liquidityUSD || "0") < parseFloat(pool1.liquidityUSD || "0");
          break;
      }
      return sortResult ? _sortDirection * -1 : _sortDirection;
    });
  };

  // Default sorted pools
  const [sortedPools, setSortedPools] = useState<PoolState[]>(sortPools(pools, sort, sortDirection));

  // Each time sort or sortDirection changed
  useEffect(() => {
    setSortedPools(sortPools(pools, sort, sortDirection));
  }, [pools, sort, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC);
  };

  // Sort pools by liquidity
  const sortBy = (newSortType: SortType) => {
    const typeChanged = sort !== newSortType;
    if (typeChanged) {
      setSort(newSortType);
      setSortDirection(SortDirection.DESC);
    } else {
      toggleSortDirection();
    }
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

  const renderSortIcon = () => {
    return (
      <FontAwesomeIcon
        style={{
          position: "absolute",
          right: "-14px",
        }}
        icon={sortDirection === SortDirection.DESC ? faArrowDown : faArrowUp}
      />
    );
  };

  const hoverColor = "whiteAlpha.900";

  return (
    <Table colorScheme="whiteAlpha" size="sm">
      <Thead>
        <Tr>
          <Th>{t.pool.pair}</Th>
          {/* <Th>{t.pool.rank}</Th> */}
          <Th isNumeric onClick={() => sortBy(SortType.LIQUIDITY)} _hover={{ color: hoverColor }} cursor="pointer">
            <Flex direction="row" align="center" justify="flex-end" position="relative">
              <Text>{t.pool.liquidity}</Text>
              {sort === SortType.LIQUIDITY && renderSortIcon()}
            </Flex>
          </Th>
          <Th isNumeric>{t.pool.reserve_token_0}</Th>
          <Th isNumeric>{t.pool.reserve_token_1}</Th>
          <Th
            isNumeric
            // TODO when available - uncomment & remove style
            /*
            onClick={() => sortBy(SortType.VOLUME)}
            _hover={{ color: hoverColor }}
             */
            style={{ opacity: 0.3 }}
            cursor="pointer"
          >
            <Tooltip key="coming-soon-volume" label={t.common.coming_soon} placement="bottom-end" closeOnClick={false}>
              <Flex direction="row" align="center" justify="flex-end" position="relative">
                <Text>{t.pool.volume_24h}</Text>
                {sort === SortType.VOLUME && renderSortIcon()}
              </Flex>
            </Tooltip>
          </Th>
          <Th isNumeric style={{ opacity: 0.3 }} cursor="pointer">
            <Tooltip key="coming-soon-fees" label={t.common.coming_soon} placement="bottom-end" closeOnClick={false}>
              <Flex direction="row" align="center" justify="flex-end" position="relative">
                <Text>{t.pool.fees_24h}</Text>
                {sort === SortType.FEES && renderSortIcon()}
              </Flex>
            </Tooltip>
          </Th>
          <Th cursor="pointer" isNumeric style={{ opacity: 0.3 }}>
            <Tooltip key="coming-soon-apr" label={t.common.coming_soon} placement="bottom-end" closeOnClick={false}>
              <Flex direction="row" align="center" justify="flex-end" position="relative">
                <Text>{t.pool.apr}</Text>
                {sort === SortType.APR && renderSortIcon()}
              </Flex>
            </Tooltip>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedPools &&
          sortedPools.map((pool: PoolState) => (
            <Tr key={`pool-${pool.address}`}>
              <Td>{renderPair(pool)}</Td>
              {/* <Td>x</Td> */}
              <Td isNumeric>${currencyFormatter(parseFloat(pool.liquidityUSD || "0"))}</Td>
              <Td isNumeric>
                {currencyFormatter(
                  parseFloat(formatBigNumberToReadableString(pool.reserveToken0, pool.token0.decimals))
                )}{" "}
                {pool.token0.symbol}
              </Td>
              <Td isNumeric>
                {currencyFormatter(
                  parseFloat(formatBigNumberToReadableString(pool.reserveToken1, pool.token1.decimals))
                )}{" "}
                {pool.token1.symbol}
              </Td>
              <Td isNumeric style={{ opacity: 0.3 }}>
                $0
              </Td>
              <Td isNumeric style={{ opacity: 0.3 }}>
                $0
              </Td>
              <Td isNumeric style={{ opacity: 0.3 }}>
                0%
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};

export default PoolsTable;
