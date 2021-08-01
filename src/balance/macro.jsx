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
import BlockAPI, {
  satoshiToBtc,
} from '../utils/blockchain-api';

const BTC = ({ balance = {} }) =>
  <Fragment>
    <Text>
      <Strong>Address </Strong>
      <Link
        href={'https://www.blockchain.com/btc/address/' + balance.address}
        openNewTab={true}
      >
        {balance.address}
      </Link>
    </Text>
    <Text>
      <Strong>Balance </Strong>
      {satoshiToBtc(balance.balance || 0)} BTC
    </Text>
    <Text>
      <Strong>Unconfirmed Balance </Strong>
      {satoshiToBtc(balance.unconfirmed_balance || 0)} BTC
    </Text>
  </Fragment>;

const App = () => {
  const config = useConfig() || {};
  const [balance] = useState(async () => await BlockAPI.GetAddressBalance(config.coin, config.network, config.address));

  // useEffect(async () => {
  //   console.log('useEffect:', balance);
  // }, [balance]);

  return (
    <Fragment>
      {
        balance.error
          ? <Text>{balance.error}</Text>
          : <BTC balance={balance} />
      }
    </Fragment>
  );
};

export default render(<Macro app={<App />} />);