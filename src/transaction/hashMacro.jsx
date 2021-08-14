import ForgeUI, {
  render,
  Fragment,
  Macro,
  Text,
  Strong,
  Link,
  useConfig,
  useState,
} from '@forge/ui';
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
  return (
    <Fragment>
      <Description title='Confirmed'>
        {tx.confirmed}
      </Description>
      <Description title='Hash'>
        <DescriptionLink href={'https://etherscan.io/tx/' + tx.hash}>
          {tx.hash}
        </DescriptionLink>
      </Description>
      <Description title='Block'>
        <DescriptionLink href={'https://etherscan.io/block' + tx.block_height}>
          {tx.block_height}
        </DescriptionLink>
      </Description>
      <Description title='Total'>
        {gweiToEth(tx.total) + ' ETH'}
      </Description>
      <Description title='Fees'>
        {gweiToEth(tx.fees) + ' ETH'}
      </Description>
      <Description title='Address' />
      <Text>
        {tx.addresses.map(address =>
          <DescriptionLink href={'https://etherscan.io/address/' + address}>
            {address + ', '}
          </DescriptionLink>
        )}
      </Text>
    </Fragment>
  );
}

const RenderHash = () => {
  const config = useConfig() || {};
  const [txhash] = useState(async () => await BlockAPI.GetTransactionHash(config.platform, 'main', config.hash));

  if (config.platform && txhash && txhash.error)
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