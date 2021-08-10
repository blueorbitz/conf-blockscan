import ForgeUI, {
  render,
  Macro,
  Text,
  useConfig,
  useState,
  Fragment,
  Head,
  Cell,
} from '@forge/ui';
import BlockAPI, {
  satoshiToBtc,
  gweiToEth,
} from '../utils/blockchain-api';

const fetchTransactions = async ({ type, coin, network, contractAddr, address }) => {
  switch (type) {
    case 'coin':
      return await fetchTransactionsCoin();
    case 'erc20':
      return await fetchTransactionsErc20();
    case 'erc721':
      return await fetchTransactionsERC721();
    default:
      return { error: 'Unsupported type' };
  }
};

const RenderStore = () => {
  return <Text>Hello Store</Text>;
}

const RenderAddress = () => {
  const config = useConfig() || {};
  const [transactions] = useState(async () => await fetchTransactions(config));

  return <Text>Hello Address</Text>;
};

const RenderStrategy = () => {
  const config = useConfig() || {};

  switch (config.type) {
    case 'address':
      return <RenderAddress />;
    case 'store':
      return <RenderStore />;
    default:
      return <Text>Please configure blockscan.</Text>
  }
}

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
    .map(o => satoshiToBtc(o.value) + 'BTC')
    .join(', ');

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
          <Cell><Text>{o.tx_hash}</Text></Cell>
          <Cell><Text>{getValue(o.input) + ' BTC'}</Text></Cell>
          <Cell><Text>{getValue(o.output) + ' BTC'}</Text></Cell>
          <Cell><Text>{o.confirmed}</Text></Cell>
        </Row>
      )}
    </Table>
  </Fragment>
};

const TransactionETH = ({ list, me }) => {
  return <Fragment>
    <Table>
      <Head>
        <Cell><Text>Tx Hash</Text></Cell>
        <Cell><Text>From</Text></Cell>
        <Cell><Text>To</Text></Cell>
        <Cell><Text>Total</Text></Cell>
        <Cell><Text>Fee</Text></Cell>
        <Cell><Text>Confirmed</Text></Cell>
      </Head>
      {list.map(o =>
        <Row>
          <Cell><Text>{o.hash}</Text></Cell>
          <Cell><Text>{
            o.inputs
              .map(o => o.addresses)
              .flat()
              .join(', ')
          }</Text></Cell>
          <Cell><Text>{
            o.outputs
              .map(o => o.addresses)
              .flat()
              .join(', ')
          }</Text></Cell>
          <Cell><Text>{gweiToEth(o.total) + ' ETH'}</Text></Cell>
          <Cell><Text>{gweiToEth(o.fees) + ' ETH'}</Text></Cell>
          <Cell><Text>{o.confirmed}</Text></Cell>
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

const RenderTransactions = () => {
  const config = useConfig() || {};
  const [transactions] = useState(async () => await fetchTransactions(config));

  switch (config.type) {
    case 'storage':
    case 'wallet':
    case 'token':
    default:
      return <Text>Macro is not configured.</Text>
    };
};

const App = () => {
  return <RenderTransactions />;
};

export default render(<Macro app={<App />} />);