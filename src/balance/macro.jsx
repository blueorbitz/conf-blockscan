import ForgeUI, {
  render,
  Fragment,
  Macro,
  Text,
  Strong,
  Link,
  useConfig,
  useState,
  TextField,
  Checkbox,
} from '@forge/ui';
import BlockAPI, {
  satoshiToBtc,
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

const RenderBalance = ({ coin, data }) => {
  switch(coin) {
    case 'btc': return <RenderBTC data={data}/>;
    default: return <Text>Coin type render not supported</Text>;
  }
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
      return <Text>Store</Text>;
    default:
      return <Text>Please configure blockscan.</Text>
  }
}

const App = () => {
  return <RenderStrategy />;
};

export default render(<Macro app={<App />} />);