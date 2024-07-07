interface Environment {
  faucet?: string;
}

const testnet: Environment = {};

const mainnet: Environment = {};

// eslint-disable-next-line import/no-mutable-exports
let environment: Environment;

switch (process.env.NEXT_PUBLIC_NETWORK_ENV) {
  case "mainnet":
    environment = mainnet;
    break;
  case "testnet":
    environment = testnet;
    break;
  default:
    environment = mainnet;
    break;
}

export default environment;
