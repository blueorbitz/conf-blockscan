import ForgeUI, {
  Fragment,
  render,
  MacroConfig,
  TextField,
  Select, Option,
  RadioGroup, Radio,
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
      <RadioGroup name='display' label='Display Mode'>
        <Radio defaultChecked label='List' value='list' />
        <Radio label='Table' value='table' />
      </RadioGroup>
    </Fragment>
  );
};

export default render(
  <MacroConfig>
    <Config />
  </MacroConfig>
);