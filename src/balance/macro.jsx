import ForgeUI, {
  render,
  Fragment,
  Macro,
  Text,
  Strong,
  Link,
  useConfig,
  useState,
} from '@forge/ui';
import { properties, storage } from '@forge/api';
import BlockAPI, {
  satoshiToBtc,
  gweiToEth,
  toReadableFiat,
} from '../utils/blockchain-api';
import { parseCoinConfig } from '../utils';
import {
  Description, DescriptionLink
} from '../utils/ui';

const RenderBTC = ({ data = {} }) =>
  <Fragment>
    {data.name && <Description title='Name'>{data.name}</Description>}
    <Description title='Address'>
      <DescriptionLink href={'https://www.blockchain.com/btc/address/' + data.address}>
        {data.address}
      </DescriptionLink>
    </Description>
    <Description title='Balance'>
      {satoshiToBtc(data.balance || 0)} BTC
    </Description>
    <Description title='Unconfirmed Balance'>
      {satoshiToBtc(data.unconfirmed_balance || 0)} BTC
    </Description>
    <Description title='Market Value'>
      {`${toReadableFiat(satoshiToBtc(data.balance || 0) * data.marketPrice)} USD`}
    </Description>
  </Fragment>;

const RenderETH = ({ data = {} }) =>
  <Fragment>
    {data.name && <Description title='Name'>{data.name}</Description>}
    <Description title='Address'>
      <DescriptionLink href={'https://etherscan.io/address/' + data.address}>
        {data.address}
      </DescriptionLink>
    </Description>
    <Description title='Balance'>
      {gweiToEth(data.balance || 0)} ETH
    </Description>
    <Description title='Unconfirmed Balance'>
      {gweiToEth(data.unconfirmed_balance || 0)} ETH
    </Description>
    <Description title='Market Value'>
      {`${toReadableFiat(gweiToEth(data.balance || 0) * data.marketPrice)} USD`}
    </Description>
  </Fragment>;

const RenderDoge = ({ data = {} }) =>
  <Fragment>
    {data.name && <Description title='Name'>{data.name}</Description>}
    <Description title='Address'>
      <DescriptionLink href={'https://dogechain.info/address/' + data.address}>
        {data.address}
      </DescriptionLink>
    </Description>
    <Description title='Balance'>
      {satoshiToBtc(data.balance || 0)} DOGE
    </Description>
    <Description title='Unconfirmed Balance'>
      {satoshiToBtc(data.unconfirmed_balance || 0)} DOGE
    </Description>
    <Description title='Market Value'>
      {`${toReadableFiat(satoshiToBtc(data.balance || 0) * data.marketPrice)} USD`}
    </Description>
  </Fragment>;

const RenderCoinBalance = ({ data }) => {
  const config = useConfig() || {};

  const simple = () => {
    let value = ''
    if (config.settings.indexOf('convUsd') !== -1) {
      switch (data.platform) {
        case 'btc': value = satoshiToBtc(data.balance || 0) * data.marketPrice; break;
        case 'eth': value = gweiToEth(data.balance || 0) * data.marketPrice; break;
        case 'doge': value = satoshiToBtc(data.balance || 0) * data.marketPrice; break;
        default: return <Text>Coin type render not supported</Text>;
      }
      return <Text>{toReadableFiat(value)} USD</Text>
    }

    else
      switch (data.platform) {
        case 'btc': return <Text>{satoshiToBtc(data.balance || 0)} BTC</Text>;
        case 'eth': return <Text>{gweiToEth(data.balance || 0)} ETH</Text>;
        case 'doge': return <Text>{satoshiToBtc(data.balance || 0)} Doge</Text>;
        default: return <Text>Coin type render not supported</Text>;
      }
  }

  const content = () => {
    switch (data.platform) {
      case 'btc': return <RenderBTC data={data} />;
      case 'eth': return <RenderETH data={data} />;
      case 'doge': return <RenderDoge data={data} />;
      default: return <Text>Coin type render not supported</Text>;
    }
  };

  return config.settings && config.settings.indexOf('details') === -1
    ? simple()
    : content();
};

const fetchCoinBalanceFromConfig = async () => {
  const config = useConfig() || {};
  const param = await parseCoinConfig(config);

  const { platform, address } = param;
  const result = await BlockAPI.GetCoinBalance(platform, 'main', address);
  const price = await BlockAPI.GetSimplePrice(platform);
  return { ...param, ...result, marketPrice: price.usd || 1 };
};

const RenderCoin = () => {
  const [balance] = useState(async () => await fetchCoinBalanceFromConfig());

  return balance.error
    ? <Text>{balance.error}</Text>
    : <RenderCoinBalance data={balance} />
};

const RenderTokenBalance = ({ data }) => {
  const config = useConfig() || {};

  const simple = () => config.settings.indexOf('convUsd') !== -1
    ? <Text>{toReadableFiat(data.balance * data.marketPrice)} USD</Text>
    : <Text>{`${data.balance} ${data.symbol.toUpperCase()}`}</Text>;

  const content = () => <Fragment>
    <Description title='Contract'>
      <DescriptionLink href={'https://etherscan.io/address/' + data.c_address}>
        {data.contract ? data.contract.name : data.contractName}
      </DescriptionLink>
    </Description>
    <Description title='Wallet'>
      <DescriptionLink href={'https://etherscan.io/token/' + data.c_address + '?a=' + data.address}>
        {data.wallet ? data.wallet.name : data.address}
      </DescriptionLink>
    </Description>
    <Description title='Address'>
      {data.address}
    </Description>
    <Description title='Balance'>
      {`${data.balance} ${data.symbol.toUpperCase()}`}
    </Description>
    <Description title='Market Value'>
      {`${toReadableFiat(data.balance * data.marketPrice)} USD`}
    </Description>
  </Fragment>;

  return config.settings && config.settings.indexOf('details') === -1
    ? simple()
    : content();
}

const fetchTokenBalanceFromConfig = async () => {
  const config = useConfig() || {};

  const isInvalidStoreInput = config.source === 'store' &&
    (config.wallet == null || config.contract == null);

  const inInvalidManualInput = config.source === 'manual' &&
    (config.c_address == null || config.address == null);

  if (isInvalidStoreInput || inInvalidManualInput)
    return { error: 'Incomplete information' };

  let param = { wallet: {}, contract: {} };
  if (config.source === 'store') {
    const wallet = await storage.get(config.wallet);
    const contract = await storage.get(config.contract);

    if (wallet.platform !== contract.platform)
      return { error: 'Contract and wallet platform not match' };

    param = {
      ...config,
      wallet, contract,
      c_address: contract.address,
      address: wallet.address,
      platform: contract.platform,
    };
  }
  else
    param = { ...config }; // Object assign

  const { platform, c_address, address } = param;
  const contractResult = await BlockAPI.GetContractInfo(platform, c_address);
  if (contractResult.error)
    return contractResult;

  const balanceResult = await BlockAPI.GetTokenBalance(platform, c_address, address);
  if (balanceResult.error)
    return balanceResult;

  return {
    ...param,
    balance: balanceResult.result / Math.pow(10, 18),
    symbol: contractResult.symbol,
    contractName: contractResult.name,
    marketPrice: contractResult.market_data.current_price.usd,
  };
};

const RenderToken = () => {
  const [balance] = useState(async () => await fetchTokenBalanceFromConfig());

  return balance.error
    ? <Text>{balance.error}</Text>
    : <RenderTokenBalance data={balance} />
};

const RenderStrategy = () => {
  const config = useConfig() || {};

  switch (`${config.type}-${config.source}`) {
    case 'coin-store':
      return <RenderCoin />;
    case 'coin-manual':
      return <RenderCoin />;
    case 'token-store':
      return <RenderToken />;
    case 'token-manual':
      return <RenderToken />;
    default:
      return <Text>Please configure blockscan.</Text>
  }
};

const App = () => {
  return <RenderStrategy />;
};

export default render(<Macro app={<App />} />);