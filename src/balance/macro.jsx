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
import { storage } from '@forge/api';
import BlockAPI, {
  satoshiToBtc,
  gweiToEth,
} from '../utils/blockchain-api';

const fetchAddress = async (coin, network, address) => {
  const isEmpty = (str) => str === '' || str == null;
  if (isEmpty(coin) || isEmpty(network) || isEmpty(address))
    return { error: 'Incomplete information to query Blockscan!' };

  return await BlockAPI.GetAddressBalance(coin, network, address);
};

const RenderBTC = ({ data = {} }) =>
  <Fragment>
    <Text>
      <Strong>Address </Strong>
      <Link
        href={'https://www.blockchain.com/btc/address/' + data.address}
        openNewTab={true}
      >
        {data.address}
      </Link>
    </Text>
    <Text>
      <Strong>Balance </Strong>
      {satoshiToBtc(data.balance || 0)} BTC
    </Text>
    <Text>
      <Strong>Unconfirmed Balance </Strong>
      {satoshiToBtc(data.unconfirmed_balance || 0)} BTC
    </Text>
  </Fragment>;

const RenderETH = ({ data = {} }) =>
  <Fragment>
    <Text>
      <Strong>Address </Strong>
      <Link
        href={'https://etherscan.io/address/' + data.address}
        openNewTab={true}
      >
        {data.address}
      </Link>
    </Text>
    <Text>
      <Strong>Balance </Strong>
      {gweiToEth(data.balance || 0)} ETH
    </Text>
    <Text>
      <Strong>Unconfirmed Balance </Strong>
      {gweiToEth(data.unconfirmed_balance || 0)} ETH
    </Text>
  </Fragment>;

const RenderDoge = ({ data }) =>
  <Fragment>
    <Text>
      <Strong>Address </Strong>
      <Link
        href={'https://dogechain.info/address/' + data.address}
        openNewTab={true}
      >
        {data.address}
      </Link>
    </Text>
    <Text>
      <Strong>Balance </Strong>
      {satoshiToBtc(data.balance || 0)} DOGE
    </Text>
    <Text>
      <Strong>Unconfirmed Balance </Strong>
      {satoshiToBtc(data.unconfirmed_balance || 0)} DOGE
    </Text>
  </Fragment>;

const RenderBalance = ({ coin, data }) => {
  switch (coin) {
    case 'btc': return <RenderBTC data={data} />;
    case 'eth': return <RenderETH data={data} />;
    case 'doge': return <RenderDoge data={data} />;
    default: return <Text>Coin type render not supported</Text>;
  }
}

const RenderStore = () => {
  const config = useConfig() || {};
  if (config.wallet === '' || config.wallet == null)
    return <Text>Please specify wallet from store.</Text>;

  const [wallet, setWallet] = useState({});
  const [balance] = useState(async () => {
    const result = await storage.get(config.wallet);
    if (result == null)
      return { error: 'Wallet key not found' };

    setWallet(result);
    return await fetchAddress(result.coin, result.network, result.address);
  });

  return balance.error
    ? <Text>{balance.error}</Text>
    : <Fragment>
      <Text>
        <Strong>Wallet </Strong>
        {wallet.name}
      </Text>
      <RenderBalance coin={wallet.coin} data={balance} />
    </Fragment>

}

const RenderAddress = () => {
  const config = useConfig() || {};
  const [balance] = useState(async () => await fetchAddress(config.coin, config.network, config.address));

  return balance.error
    ? <Text>{balance.error}</Text>
    : <RenderBalance coin={config.coin} data={balance} />
};

const RenderStrategy = () => {
  const config = useConfig() || {};

  switch (config.type) {
    case 'address':
      return <RenderAddress />;
    case 'store':
      return <RenderStore />;
    default:
      return <Text>Please configure blockscan.</Text>
  }
}

const App = () => {
  return <RenderStrategy />;
};

export default render(<Macro app={<App />} />);