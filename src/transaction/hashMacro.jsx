import ForgeUI, {
  render,
  Fragment,
  Macro,
  Text, Strong, Link,
  Table, Head, Row, Cell,
  useConfig,
  useState,
} from '@forge/ui';
import { fetch } from '@forge/api';
import BlockAPI, {
  satoshiToBtc,
  gweiToEth,
} from '../utils/blockchain-api';
import {
  Description, DescriptionLink
} from '../utils/ui';

const RenderBTC = ({ tx }) => {
  return (
    <Fragment>
      <Description title='Confirmed'>
        {tx.confirmed}
      </Description>
      <Description title='Hash'>
        <DescriptionLink href={'https://www.blockchain.com/btc/tx/' + tx.hash}>
          {tx.hash}
        </DescriptionLink>
      </Description>
      <Description title='Block'>
        <DescriptionLink href={'https://www.blockchain.com/btc/block/' + tx.block_hash}>
          {tx.block_hash}
        </DescriptionLink>
      </Description>
      <Description title='Total'>
        {satoshiToBtc(tx.total) + ' BTC'}
      </Description>
      <Description title='Fees'>
        {satoshiToBtc(tx.fees) + ' BTC'}
      </Description>
      <Description title='Address' />
      <Text>
        {tx.addresses.map(address =>
          <DescriptionLink href={'https://www.blockchain.com/btc/address/' + address}>
            {address + ', '}
          </DescriptionLink>
        )}
      </Text>
    </Fragment>
  );
}

const RenderETH = ({ tx }) => {
  const [info] = useState(async () => {
    const data = await BlockAPI.GetWebTransaction(tx.hash);
    return data;
  }, null);
  const config = useConfig();

  if (config.display === 'list') return <Fragment>
    <Description title='Tx Hash'>
      <DescriptionLink href={'https://etherscan.io/tx/' + info['Transaction Hash']}>
        {tx.hash}
      </DescriptionLink>
    </Description>
    <Description title='Status'>
      {tx.confirmed} <Strong>{info['Status']}</Strong>
    </Description>
    {
      info['From'] &&
      <Description title='From'>
        <DescriptionLink href={'https://etherscan.io/address/' + info['From'][0]}>
          {info['From'].length === 2 ? info['From'][1] : info['From'][0]}
        </DescriptionLink>
      </Description>
    }
    {
      (info['To'] || info['Interacted With (To)']) && (info['To']
        ? <Description title='To'>
          <DescriptionLink href={'https://etherscan.io/address/' + info['To'][0]}>
            {info['To'].length === 2 ? info['To'][1] : info['To'][0]}
          </DescriptionLink>
        </Description>
        : <Fragment>
          <Description title='To'>{info['Interacted With (To)'].title}</Description>
          {info['Interacted With (To)'].transfers.map((o, i) => <Description title={`Tx ${i + 1}`}>{o}</Description>)}
        </Fragment>
      )
    }
    {
      info['Tokens Transferred'] &&
      <Description title='Transfer'>
        <Fragment>
          {info['Tokens Transferred'].map(o => typeof o !== 'string'
            ? <Link href={`https//etherscan.in${o.href}`}>{o.text} </Link>
            : o
          )}
        </Fragment>
      </Description>
    }
    <Description title='Value'>
      {gweiToEth(tx.total).toFixed(5) + ' ETH'}
    </Description>
  </Fragment>;

  else return <Table>
    <Head>
      <Cell><Text>Tx Hash</Text></Cell>
      <Cell><Text>Status</Text></Cell>
      <Cell><Text>From</Text></Cell>
      <Cell><Text>To</Text></Cell>
      <Cell><Text>Value</Text></Cell>
    </Head>
    <Row>
      <Cell><Text>
        {
          info['Transaction Hash'] &&
          <Link href={'https://etherscan.io/tx/' + info['Transaction Hash']}>
            {info['Transaction Hash'].slice(0, 20) + '...'}
          </Link>
        }
      </Text></Cell>
      <Cell><Text>{tx.confirmed}</Text></Cell>
      <Cell><Text>
        {
          info['From'] &&
          <DescriptionLink href={'https://etherscan.io/address/' + info['From'][0]}>
            {info['From'].length === 2 ? info['From'][1] : info['From'][0]}
          </DescriptionLink>
        }
      </Text></Cell>
      <Cell><Text>
        {
          (info['To'] || info['Interacted With (To)']) && (info['To']
            ? <DescriptionLink href={'https://etherscan.io/address/' + info['To'][0]}>
              {info['To'].length === 2 ? info['To'][1] : info['To'][0]}
            </DescriptionLink>
            : info['Interacted With (To)'].title)
        }
      </Text></Cell>
      <Cell><Text>{gweiToEth(tx.total).toFixed(5) + ' ETH'}</Text></Cell>
    </Row>
  </Table>
}

const RenderHash = () => {
  const config = useConfig() || {};
  const [txhash] = useState(async () => await BlockAPI.GetTransactionHash(config.platform, 'main', config.hash));

  if (txhash && txhash.error)
    return <Text>{txhash.error}</Text>;

  switch (config.platform) {
    case 'btc':
      return <RenderBTC tx={txhash} />
    case 'eth':
      return <RenderETH tx={txhash} />
    default:
      return <Text>Select a platform in config</Text>;
  }
}

const App = () => {
  return <RenderHash />;
};

export default render(<Macro app={<App />} />);