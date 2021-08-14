import ForgeUI, {
  render,
  Macro,
  Text,
  useConfig,
  useState,
} from '@forge/ui';
import BlockAPI from '../utils/blockchain-api';

const App = () => {
  const config = useConfig() || {};

  let date = config.date;
  if (date === '')
    date = new Date().toISOString().split('T')[0];
  const newdate = date.split('-').reverse().join('-');

  const [data] = useState(async () => await BlockAPI.GetCoinHistory(config.from, newdate));

  const compute = (value, price) => (value * price).toFixed(2);
  const getPrice = () => data.market_data.current_price[config.to]

  if (data == null || config.to == null)
    return <Text>Please configure the macro</Text>;
  
  else if (data.error)
    return <Text>{data.error}</Text>;

  else
    return <Text>{compute(config.value, getPrice()) + ' ' + config.to.toUpperCase()}</Text>
};

export default render(<Macro app={<App />} />);