import ForgeUI, {
  render,
  Macro,
  Text,
  useConfig,
  useState,
  Fragment,
  Table,
  Head,
  Row,
  Cell,
  Link,
  DateLozenge,
} from '@forge/ui';
import BlockAPI, {
  satoshiToBtc,
  gweiToEth,
} from '../utils/blockchain-api';
import { parseCoinConfig } from '../utils';

const fetchTransactionCoin = async () => {
  const config = useConfig() || {};
  const param = await parseCoinConfig(config);

  const { platform, address } = param;
  const result = await BlockAPI.GetCoinTransaction(platform, 'main', address);
  return { ...param, ...result };
};

const fetchTransactionsToken = async () => {

};

const TransactionBTC = ({ list, me }) => {
  const reduceList = list.reduce((total, current) => {
    const { tx_hash, tx_input_n, tx_output_n, confirmed } = current;
    const isInput = tx_input_n !== -1;
    const isOutput = tx_output_n !== -1;
    let txref = total.find(o => o.tx_hash === tx_hash);

    if (txref == null) {
      txref = { tx_hash, confirmed, input: [], output: [] };
      total.push(txref);
    }

    if (isInput)
      txref.input.push(current);

    if (isOutput)
      txref.output.push(current);

    return total;
  }, []);

  const getValue = (txs = []) => txs
    .map(o => satoshiToBtc(o.value) + ' BTC')
    .join('\n');

  return <Fragment>
    <Table>
      <Head>
        <Cell><Text>Tx Hash</Text></Cell>
        <Cell><Text>Value[In]</Text></Cell>
        <Cell><Text>Value[Out]</Text></Cell>
        <Cell><Text>Confirmed</Text></Cell>
      </Head>
      {reduceList.map(o =>
        <Row>
          <Cell>
            <Text>
              <Link href={'https://www.blockchain.com/btc/tx/' + o.tx_hash}>
                {o.tx_hash.slice(0, 20) + '...'}
              </Link>
            </Text>
          </Cell>
          <Cell><Text>{getValue(o.input)}</Text></Cell>
          <Cell><Text>{getValue(o.output)}</Text></Cell>
          <Cell>
            <Text>
              <DateLozenge value={new Date(o.confirmed).getTime()} />
            </Text>
          </Cell>
        </Row>
      )}
    </Table>
  </Fragment>
};

const TransactionETH = ({ list, me }) => {
  const formettedMe = me.slice(0, 2) === '0x'
    ? me.slice(2).toLowerCase() : me.toLowerCase();

  const FormatAddress = ({ address }) =>
    <Text>
      <Link href={'https://etherscan.io/address/' + address}>
        {(address !== formettedMe) ? (address.slice(0, 12) + '...') : 'Me'}
      </Link>
    </Text>;

  return <Fragment>
    <Table>
      <Head>
        <Cell><Text>Tx Hash</Text></Cell>
        <Cell><Text>From</Text></Cell>
        <Cell><Text>To</Text></Cell>
        <Cell><Text>Total(ETH)</Text></Cell>
        <Cell><Text>Fee(ETH)</Text></Cell>
        <Cell><Text>Confirmed</Text></Cell>
      </Head>
      {list.map((o, i) =>
        <Row>
          <Cell>
            <Text>
              <Link href={'https://etherscan.io/tx/' + o.hash}>
                {o.hash.slice(0, 12) + '...'}
              </Link>
            </Text>
          </Cell>
          <Cell>
            <Fragment>
              {o.inputs
                .map(o => o.addresses)
                .flat()
                .map(o => <FormatAddress address={o} />)}
            </Fragment>
          </Cell>
          <Cell>
            <Fragment>
              {o.outputs
                .map(o => o.addresses)
                .flat()
                .map(o => <FormatAddress address={o} />)}
            </Fragment>
          </Cell>
          <Cell><Text>{gweiToEth(o.total)}</Text></Cell>
          <Cell><Text>{gweiToEth(o.fees)}</Text></Cell>
          <Cell>
            <Text>
              <DateLozenge value={new Date(o.confirmed).getTime()} />
            </Text>
          </Cell>
        </Row>
      )}
    </Table>
  </Fragment>;
};

const TransactionToken = ({ list, me }) => {
  return <Fragment>
    <Table>
      <Head>
        <Cell><Text>Tx Hash</Text></Cell>
        <Cell><Text>From</Text></Cell>
        <Cell><Text>To</Text></Cell>
        <Cell><Text>Token</Text></Cell>
        <Cell><Text>Total</Text></Cell>
        <Cell><Text>Timestamp</Text></Cell>
      </Head>
      {list.map(o =>
        <Row>
          <Cell><Text>{o.hash}</Text></Cell>
          <Cell><Text>{o.from}</Text></Cell>
          <Cell><Text>{o.to}</Text></Cell>
          <Cell><Text>{o.tokenName}</Text></Cell>
          <Cell><Text>{
            o.value / Math.pow(10, o.decimal) + ' ' + o.tokenSymbol
          }</Text></Cell>
          <Cell><Text>{new Date(o.timeStamp)}</Text></Cell>
        </Row>
      )}
    </Table>
  </Fragment>;
};

const RenderCoin = () => {
  const config = useConfig() || {};
  const [data] = useState(async () => await fetchTransactionCoin(config));

  switch (data.platform) {
    case 'btc':
      return <TransactionBTC list={data.txrefs} me={data.address} />
    case 'eth':
      return <TransactionETH list={data.txs} me={data.address} />
    default:
      return <Text>Unsupported platform to render</Text>;
  }
};

const RenderToken = () => {
  const config = useConfig() || {};
  const [data] = useState(async () => await fetchTransactionCoin(config));

  return <TransactionToken list={data.txrefs} me={data.address} />
};

const RenderStrategy = () => {
  const config = useConfig() || {};

  switch (config.type) {
    case 'coin':
      return <RenderCoin />;
    case 'token':
      return <RenderToken />;
    default:
      return <Text>Macro is not configured.</Text>
  }
}

const App = () => {
  return <RenderStrategy />;
};

export default render(<Macro app={<App />} />);