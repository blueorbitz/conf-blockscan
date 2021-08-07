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
import * as storage from '../utils/storage';

const Config = () => {
  return (
    <Fragment>
      <TextField label='Hash' name='hash' />
    </Fragment>
  );
};

export default render(
  <MacroConfig>
    <Config />
  </MacroConfig>
);