import { Box, Flex, Heading, Tabs, TabList, TabPanel, TabPanels, Tab } from "@chakra-ui/react";

import AddLiquidityManager from "../components/liquidity/AddLiquidityManager";
import PoolsTable from "../components/liquidity/PoolsTable";
import PositionsTable from "../components/liquidity/PositionsTable";
import { usePool } from "../context";
import { useTranslate } from "context/TranslateProvider";

const PoolScreen = () => {
  const { t } = useTranslate();
  const { pools } = usePool();

  return (
    <Flex mb={8} w="full" h="full" direction="column" align="flex-start" justify="space-between">
      <Tabs w="full" size="sm" variant="solid-rounded" id="pools-tabs-id">
        <Flex w="full" justify="space-between" align="center">
          <Heading as="h2" size="md">
            <Box>{t.pool.pools}</Box>
          </Heading>
          <TabList>
            <Tab>{t.pool.all_pools}</Tab>
            <Tab>{t.pool.add_liquidity}</Tab>
            <Tab>{t.pool.my_liquidity}</Tab>
          </TabList>
        </Flex>
        <TabPanels mt={12}>
          <TabPanel p={0}>
            <PoolsTable pools={pools} />
          </TabPanel>
          <TabPanel p={0}>
            <Flex w="full" h="full" align="flex-start" justify="center">
              <Box w="500px">
                <AddLiquidityManager />
              </Box>
            </Flex>
          </TabPanel>
          <TabPanel p={0}>
            <Flex w="full" h="full" align="flex-start" justify="center">
              <PositionsTable pools={pools} />
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default PoolScreen;
