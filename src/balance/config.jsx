import ForgeUI, {
  Fragment,
  render,
  MacroConfig,
  TextField,
  Select,
  Option,
  useConfig,
  useState,
  useEffect,
} from '@forge/ui';
import { defaultConfig } from './constant';
import { coinNetwork } from '../utils/blockchain-api';

const Config = () => {
  const config = useConfig() || {};

  const [coin, setCoin] = useState(config.coin);
  const [network, setNetwork] = useState(config.network);
  const [address, setAddress] = useState(config.address);

  useEffect(async () => {
    // console.log('effect', coinNetwork);
    // console.log('effect', coin, network, address);
  }, [coin, network, address]);

  return (
    <Fragment>
        <Select label='Coin' name='coin' value={config.coin}>
          {
            Object.keys(coinNetwork).map(coin => <Option label={coin} value={coin} />)
          }
        </Select>
        <Select label='Network' name='network' value={config.network}>
          {
            coinNetwork[coin || 'btc'].map(network => <Option label={network} value={network} />)
          }
        </Select>
        <TextField label='Wallet Address' name='address' value={config.address} />
    </Fragment>
  );
};

export default render(
  <MacroConfig>
    <Config />
  </MacroConfig>
);