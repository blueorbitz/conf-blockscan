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
  normalizeEthAddr,
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
  const config = useConfig() || {};
  const param = await parseCoinConfig(config);

  const { platform, address } = param;
  const result = await BlockAPI.GetTokenTransaction(platform, address);
  return { ...param, ...result };
};

const FormatETHAddress = ({ address, me, name }) =>
  <Text>
    <Link href={'https://etherscan.io/address/' + address}>
      {(address !== me) ? (address.slice(0, 12) + '...') : name || 'Me'}
    </Link>
  </Text>;

const FormatETHTx = ({ tx }) =>
  <Text>
    <Link href={'https://etherscan.io/tx/' + tx}>
      {tx.slice(0, 12) + '...'}
    </Link>
  </Text>

const TransactionBTC = ({ list, me, name }) => {
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

const TransactionETH = ({ list, me, name }) => {
  const _me = normalizeEthAddr(me);

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
          <Cell><FormatETHTx tx={o.hash} /></Cell>
          <Cell>
            <Fragment>
              {o.inputs
                .map(o => o.addresses)
                .flat()
                .map(o => <FormatETHAddress address={o} me={_me} name={name} />)}
            </Fragment>
          </Cell>
          <Cell>
            <Fragment>
              {o.outputs
                .map(o => o.addresses)
                .flat()
                .map(o => <FormatETHAddress address={o} me={_me} name={name} />)}
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

const TransactionToken = ({ list, me, name }) => {
  const _me = normalizeEthAddr(me);

  const formatTotal = (data) => {
    const total = data.value / Math.pow(10, data.tokenDecimal);
    return total + ' ' + data.tokenSymbol;
  }

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
          <Cell><FormatETHTx tx={o.hash} /></Cell>
          <Cell>
            <FormatETHAddress
              address={normalizeEthAddr(o.from)}
              me={_me}
              name={name}
            />
          </Cell>
          <Cell>
            <FormatETHAddress
              address={normalizeEthAddr(o.to)}
              me={_me}
              name={name}
            />
          </Cell>
          <Cell><Text>{o.tokenName}</Text></Cell>
          <Cell><Text>{formatTotal(o)}</Text></Cell>
          <Cell>
            <Text>
              <DateLozenge value={parseInt(o.timeStamp * 1000)} />
            </Text>
          </Cell>
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
      return <TransactionBTC list={data.txrefs} me={data.address} name={data.name} />
    case 'eth':
      return <TransactionETH list={data.txs} me={data.address} name={data.name} />
    default:
      return <Text>Unsupported platform to render</Text>;
  }
};

const RenderToken = () => {
  const config = useConfig() || {};
  const [data] = useState(async () => await fetchTransactionsToken(config));

  return <TransactionToken list={data.result} me={data.address} name={data.name} />
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