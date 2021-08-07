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
import { coinNetwork } from '../utils/blockchain-api';
import * as storage from '../utils/storage';

const InputAddress = ({ coinType }) => {
  return (
    <Fragment>
      <Select label='Coin' name='coin'>
        {Object.keys(coinNetwork).map(coin =>
          <Option label={coin.toUpperCase()} value={coin} />
        )}
      </Select>
      <Select label='Network' name='network'>
        {coinNetwork[coinType].map(network =>
          <Option label={network} value={network} />
        )}
      </Select>
      <TextField label='Wallet Address' name='address' />
    </Fragment>
  );
};

const InputStore = ({ wallets }) =>
  <Fragment>
    <Select label='Wallet' name='wallet'>
      {wallets.map(wallet =>
        <Option label={wallet.value.name} value={wallet.key} />
      )}
    </Select>
  </Fragment>;

const Config = () => {
  const [type, setType] = useState('address');

  const [walletList, setWalletList] = useState([]);
  const [coinType, setCoinType] = useState('btc');

  useEffect(async () => {
    const config = useConfig() || {};

    if (!walletList.length) {
      const results = await storage.getWallets();
      setWalletList(results);
    }

    if (config.type)
      setType(config.type);
    
    if (config.coin)
      setCoinType(config.coin);
  }, []);

  return (
    <Fragment>
      <Select label='Type' name='type'>
        <Option label='Address' defaultSelected value='address' />
        <Option label='Store' value='store' />
      </Select>
      {
        type === 'address'
          ? <InputAddress coinType={coinType} />
          : <InputStore wallets={walletList} />
      }
    </Fragment>
  );
};

export default render(
  <MacroConfig>
    <Config />
  </MacroConfig>
);