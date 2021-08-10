import ForgeUI, {
  Fragment,
  render,
  MacroConfig,
  TextField,
  Select,
  Option,
} from '@forge/ui';
import { supportedCoins } from '../utils/blockchain-api';

const Config = () => {
  return (
    <Fragment>
      <Select label='Platform' name='platform'>
        {supportedCoins.map(coin =>
          <Option label={coin.name} value={coin.value} />
        )}
      </Select>
      <TextField label='Hash' name='hash' />
    </Fragment>
  );
};

export default render(
  <MacroConfig>
    <Config />
  </MacroConfig>
);