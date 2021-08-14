import ForgeUI, {
  render,
  Macro,
  Text,
  useConfig,
  useState,
  Fragment,
  Table,
  Head,
  Cell,
  Row,
  Link,
} from '@forge/ui';
import BlockAPI, {
  satoshiToBtc,
  gweiToEth,
} from '../utils/blockchain-api';
import {
  Description, DescriptionLink,
} from '../utils/ui';

const TxList = ({ title = 'Tx', list, href }) =>
  <Table rowsPerPage='10'>
    <Head>
      <Cell><Text>{title}</Text></Cell>
    </Head>
    {list.map(o =>
      <Row>
        <Cell>
          <Text>
            <Link href={href + o}>
              {o}
            </Link>
          </Text>
        </Cell>
      </Row>
    )}
  </Table>

const RenderBTC = ({ block }) =>
  <Fragment>
    <Description title='Time'>
      {block.time}
    </Description>
    <Description title='Height'>
      {block.height}
    </Description>
    <Description title='Fees'>
      {satoshiToBtc(block.fees) + ' BTC'}
    </Description>
    <Description title='Previous Block'>
      <DescriptionLink href={block.prev_block_url}>
        {block.prev_block}
      </DescriptionLink>
    </Description>
    <TxList
      list={block.txids}
      href='https://www.blockchain.com/btc/tx/'
    />
  </Fragment>;

const RenderETH = ({ block }) =>
  <Fragment>
    <Description title='Time'>
      {block.time}
    </Description>
    <Description title='Height'>
      {block.height}
    </Description>
    <Description title='Fees'>
      {satoshiToBtc(block.fees) + ' BTC'}
    </Description>
    <Description title='Previous Block'>
      <DescriptionLink href={block.prev_block_url}>
        {block.prev_block}
      </DescriptionLink>
    </Description>
    <TxList
      list={block.txids}
      href='https://etherscan.io/tx/'
    />
    <TxList
      title='Internal Tx'
      list={block.internal_txids}
      href='https://etherscan.io/tx/'
    />
  </Fragment>;

const RenderHash = () => {
  const config = useConfig() || {};
  const [block] = useState(async () => await BlockAPI.GetBlockHash(config.platform, 'main', config.hash));

  if (config.platform && block && block.error)
    return <Text>{block.error}</Text>;

  switch (config.platform) {
    case 'btc':
      return <RenderBTC block={block} />;
    case 'eth':
      return <RenderETH block={block} />;
    default:
      return <Text>Please configure blockscan.</Text>
  }
}

const App = () => {
  return <RenderHash />;
};

export default render(<Macro app={<App />} />);