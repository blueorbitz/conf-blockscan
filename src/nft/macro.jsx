import ForgeUI, {
  render,
  Macro,
  Text,
  useConfig,
  useState,
  Badge,
} from '@forge/ui';
import BlockAPI, {
  toReadableFiat,
} from '../utils/blockchain-api';

const compute = (value, price) => toReadableFiat((value * price));

const extractPrice = (data) => {
  const config = useConfig() || {};
  return data.market_data.current_price[config.to];
};

const badgeAppearance = (dispVal, todayVal) => dispVal < todayVal ? 'removed' : 'added';
const badgeText = (dispVal, todayVal) => ((dispVal - todayVal) / dispVal * 100).toFixed(1) + ' %';

const App = () => {
  const config = useConfig() || {};

  let date = config.date;
  if (date == null || date === '')
    date = new Date().toISOString().split('T')[0];
  const newdate = date.split('-').reverse().join('-');

  const [query] = useState(async () => await BlockAPI.GetCoinHistory(config.from, newdate));
  const [latest] = useState(async () => {
    if (config.settings == null || config.settings.indexOf('compare') === -1)
      return null;
      
    const today = new Date()
      .toISOString().split('T')[0] // token date only
      .split('-').reverse().join('-'); // flip date and year position;
    return await BlockAPI.GetCoinHistory(config.from, today);
  });

  if (query == null || config.to == null)
    return <Text>Please configure the macro</Text>;
  
  else if (query.error)
    return <Text>{query.error}</Text>;

  else
    return <Text>
      {compute(config.value, extractPrice(query)) + ' ' + config.to.toUpperCase()}
      {latest && <Badge 
        appearance={badgeAppearance(extractPrice(query), extractPrice(latest))}
        text={badgeText(extractPrice(query), extractPrice(latest))}
      />}
    </Text>
};

export default render(<Macro app={<App />} />);