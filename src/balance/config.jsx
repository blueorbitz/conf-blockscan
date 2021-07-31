import ForgeUI, {
  render,
  MacroConfig,
  TextField,
  Select,
  Option,
  useConfig,
} from '@forge/ui';
import { defaultConfig } from './constant';

const Config = () => {
  const config = useConfig() || defaultConfig;
  console.log('config:', config);

  return (
    <MacroConfig>
      <Select label='Coin' name='coin' value={config.coin}>
        <Option defaultSelected label='Bitcoin' value='btc' />
        <Option label='Ethereum' value='eth' />
      </Select>
      <Select label='Network' name='network' value={config.network}>
        <Option defaultSelected label='Mainnet' value='main' />
        <Option label='Testnet3' value='testnet3' />
      </Select>
      <TextField label='Wallet Address' name='address' value={config.address} />
    </MacroConfig>
  );
};

export default render(<Config />);