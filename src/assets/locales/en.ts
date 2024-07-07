import type { TranslateState } from "../../context/TranslateProvider/model";

const enTranslate: TranslateState = {
  menu: {
    title: "Kakaswap",
    swap: "Swap",
    pool: "Pools",
    strategies: "Strategies",
    collections: "Collections",
  },

  whitelist: {
    title: "Welcome on Kakaswap",
    introduction: "We’re excited to introduce our first vertical: a one-click revisited AMM",
    explanation:
      "This whitelist queue is here to consider and give credit to every feedback for the first days of born of Kakaswap.",
    register_beta: "Access to Bêta",
    registration_inprogress: "Registration in progress",
    loading: "Loading",
    unavailable_slot: "All slots has been taken for the moment.",
    dont_worry: "Don’t worry we iterate fast.",
    stay_tuned: "Stay tuned on our",
    stay_tuned_2: "and you’ll find new available slots in coming days.",
    congrats: "Congrats ",
    access_sentence: "You can now register as a Bêta user",
    available_slots: "Available slots:",
    once_registered: "Once registered you'll be able to access Kakaswap with the same address.",
    beta_registration: "Registration to Bêta",
    mint_tokens: "Mint arfBTC",
    mint_eth: "Mint ETH",
  },

  common: {
    title: "Welcome to ",
    wallet: "Wallet",
    add_to_watchlist: "Add to wallet",
    approve: "Approve",
    approving: "Approving",
    direct: "direct",
    per: "per",
    for: "for",
    no_account: "No account",
    pending: "pending",
    connect_wallet: "Connect Wallet",
    disconnect_wallet: "Disconnect",
    wallet_warning_title: "⚠️ Wallet",
    wallet_argent_x_extension_missing: "Argent-X wallet extension missing",
    connected_with_argent_x: "Connected with ArgentX",
    copied: "Copied",
    copy_address: "Copy address",
    view_on_explorer: "View on explorer",
    your_transactions: "Your transactions",
    your_transactions_will_appear_here: "Your transactions will appear here",

    approving_token: "Approving token",
    not_enough: "Not enough",
    balance: "balance",

    // Transactions infos
    transaction_rejected_by_user: "Transaction rejected by user",
    transaction_transmitted: "Transaction transmitted",
    transaction_received: "Transaction received",
    transaction_confirmed: "Transaction confirmed",
    transaction_rejected: "Transaction rejected",

    // Testnet warning and info
    testnet_warning_main:
      "<li>" +
      "  Kakaswap currently runs beta version on Kakarot " +
      "  <b>" +
      "    <u>testnet</u>," +
      "  </b>" +
      " so transactions could take up to " +
      "  <b>" +
      "    <u>10 minutes.</u>\n" +
      "  </b>" +
      "</li>",
    testnet_warning_contracts: "Be aware that contracts can be updated at any moment.",
    testnet_warning_have_fun: "Thanks & have fun!",

    select_a_coin: "select a coin",
    choose_coin: "Choose coin",
    token_name_or_address_placeholder: "Token name or address",
    no_result: "No result",
    manage_token_lists: "Manage token lists",
    from: "From",
    to: "To",
    coming_soon: "Coming soon ✨",
    all_rights: "All rights reserved",
    loading: "Loading",
    links: "Links",
    warning_price_updated: "⚠️ Confirm new price",
    add: "Add",
    confirm: "Confirm",
    migrate_assets: "Migrate all assets",
    migrate_assets_infos: "Move your assets and synchronize your on-chain activity in a single transaction",
    recipient: "Recipient",
    recipient_address: "Recipient address",
    error_address: "Please provide a valid address",
    sync_addr_text:
      "This action will also synchronize on-chain your current address with your recipient address to keep trace of your activity",
    more: "More infos...",
  },

  swap: {
    swap: "Swap",
    confirm_swap: "Confirm swap",

    // Quote infos
    waiting_quote: "Waiting for quote",
    quote_updated: "Quote updated",

    // Swap infos
    rate: "Rate",
    min_received: "Minimum received",
    price_impact: "Price impact",
    lp_fees: "Liquidity provider fee",
    route: "Route",
  },

  pool: {
    price_disclaimer:
      "Please note that all tokens have a fixed price of 0.419$ for testing purpose, they doesn't value on testnet",
    pools: "Pools",
    all_pools: "All pools",
    add_liquidity: "Add liquidity",
    confirm_add_liquidity: "Confirm add liquidity",
    my_liquidity: "My liquidity",
    liquidity: "Liquidity",
    create_and: "Create & ",
    pool_creation: "Pool creation",
    no_pool: "No pool",
    warning_no_pool:
      "<b>No pool</b> exists currently for those tokens, you will trigger\n" +
      "the creation and so you have to provide <b>equivalent</b>\n" +
      "proportion of each token. If not, you can be <b>arbitraged</b> by\n" +
      "market",
    no_position: "No positions",
    please_connect: "Please connect to see your positions",
    pair: "Pair",
    amount: "Amount",
    action: "Action",
    remove: "Remove",
    show: "Show",
    hide: "Hide",
    rank: "Rank",
    reserve_token_0: "Reserve token 0",
    reserve_token_1: "Reserve token 1",
    volume_24h: "Volume (24h)",
    fees_24h: "Fees (24h)",
    apr: "APR",
    pool_share: "Pool share",
    lp_received: "LP received",
    lp_send: "LP send",
    slippage: "Slippage",

    // remove liquidity labels
    will_receive: "You will receive at least",
    your_positions: "Your position",
    pooled: "pooled",
    remove_liquidity: "Remove liquidity",
    confirm_remove_liquidity: "Confirm remove liquidity",
    amount_remove: "Amount to remove",
    add_more: "Add more",
  },
};

export default enTranslate;
