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
import { supportedCoins } from '../utils/blockchain-api';
import * as storage from '../utils/storage';

const InputCoinStore = () => {
  const [wallets] = useState(async () => await storage.getWallets());

  return <Select label='Wallet' name='wallet'>
    {wallets.map(wallet =>
      <Option label={wallet.value.name} value={wallet.key} />
    )}
  </Select>;
};

const InputCoinManual = () => {
  return (
    <Fragment>
      <Select label='Platform' name='platform'>
        {supportedCoins.map(coin =>
          <Option label={coin.name} value={coin.value} />
        )}
      </Select>
      <TextField label='Wallet Address' name='address' />
    </Fragment>
  );
};

const InputTokenStore = () => {
  const [wallets] = useState(async () => await storage.getWallets());
  const [contracts] = useState(async () => await storage.getContracts());

  return (
    <Fragment>
      <Select label='Contract' name='contract'>
        {contracts.map(contract =>
          <Option label={contract.value.name} value={contract.key} />
        )}
      </Select>
      <Select label='Wallet' name='wallet'>
        {wallets.map(wallet =>
          <Option label={wallet.value.name} value={wallet.key} />
        )}
      </Select>
    </Fragment>
  );
};

const InputTokenManual = () => {
  return (
    <Fragment>
      <Select label='Platform' name='platform'>
        <Option label='Ethereum' value='eth' />
      </Select>
      <TextField label='Contract Address' name='c_address' />
      <TextField label='Wallet Address' name='address' />
    </Fragment>
  );
};

const InputStrategy = () => {
  const [type, setType] = useState();
  const [source, setSource] = useState();

  useEffect(async () => {
    const config = useConfig() || {};
    setType(config.type);
    setSource(config.source);
  }, []);

  switch (`${type}-${source}`) {
    case 'coin-store':
      return <InputCoinStore />;
    case 'coin-manual':
      return <InputCoinManual />;
    case 'token-store':
      return <InputTokenStore />;
    case 'token-manual':
      return <InputTokenManual />;
    default:
    return null;
  }
};

const Config = () => {
  return (
    <Fragment>
      <Select label='Type' name='type'>
        <Option label='Coin' value='coin' />
        <Option label='Token' value='token' />
      </Select>
      <Select label='Source' name='source'>
        <Option label='Store' value='store' />
        <Option label='Manual' value='manual' />
      </Select>
      <InputStrategy />
    </Fragment>
  );
};

export default render(
  <MacroConfig>
    <Config />
  </MacroConfig>
);