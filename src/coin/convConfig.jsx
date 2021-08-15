import ForgeUI, {
  Fragment,
  render,
  MacroConfig,
  DatePicker,
  Select,
  Option,
  useState,
  useEffect,
  useConfig,
  TextField,
  CheckboxGroup,
  Checkbox,
} from '@forge/ui';
import BlockAPI, {
  converterList
} from '../utils/blockchain-api';

const Config = () => {
  const [to, setTo] = useState([]);
  useEffect(async () => {
    const config = useConfig() || {};
    if (config.from == null)
      return;

    let date = config.date;
    if (date == null || date === '')
      date = new Date().toISOString().split('T')[0];

    const newdate = date.split('-').reverse().join('-');
    const results = await BlockAPI.GetCoinHistory(config.from, newdate);
    if (results.error)
      return;

    setTo(Object.keys(results.market_data.current_price));
  }, []);

  return (
    <Fragment>
      <Select label='From' name='from'>
        {converterList.map(o => <Option label={o.name} value={o.id} />)}
      </Select>
      <Select label='To' name='to'>
        {to.map(o => <Option label={o} value={o} />)}
      </Select>
      <DatePicker
        name='date'
        label='Conversion Date'
        description='Leave empty to get the latest value'
        // defaultValue={new Date().toISOString().split('T')[0]}
      />
      <TextField label='Value' name='value' />
      <CheckboxGroup label='Others' name='settings'>
        <Checkbox label='Compare against today price' value='compare' />
      </CheckboxGroup>
    </Fragment>
  );
};

export default render(
  <MacroConfig>
    <Config />
  </MacroConfig>
);