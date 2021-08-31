import ForgeUI, {
  render,
  Macro,
  Image,
  Fragment,
  DateLozenge,
  TagGroup, Tag,
  useState,
  useConfig,
} from '@forge/ui';
import BlockAPI, { gweiToEth, toReadableFiat } from '../utils/blockchain-api';
import {
  Description, DescriptionLink
} from '../utils/ui';

const App = () => {
  const config = useConfig();
  const [image] = useState(async () => {
    if (config == null || config.contract == null || config.tokenId == null)
      return {};

    const response = await BlockAPI.GetNFTAsset(config.contract, config.tokenId);
    if (response.error)
      console.log('response', response);
    return response;
  }, null);

  if (config == null || config.contract == null || config.tokenId == null)
    return null;

  if (image == null)
    return;

  if (config.display === 'image')
    return <Image src={image.image_url} alt={image.name} size={config.size} />

  else
    return <Fragment>
      <Description title='Name'>
        <DescriptionLink href={image.permalink}>
          {image.name}
        </DescriptionLink>
      </Description>
      <TagGroup>
        <Tag text='Traits' color='blue' />
        {image.traits.map(o =>
          <Tag text={`${o.trait_type}: ${o.value}`} />
        )}
      </TagGroup>
      <Description title='Owner'>
        {(image.owner.user && image.owner.user.username) || image.owner.address}
      </Description>
      <Description title='Creator'>
        {(image.creator.user && image.creator.user.username) || image.creator.address}
      </Description>
      <Description title='Last Tx'>
        <DescriptionLink href={'https://etherscan.io/tx/' + image.last_sale.transaction.transaction_hash}>
          {image.last_sale.transaction.transaction_hash}
        </DescriptionLink>
      </Description>
      <Description title='Last Sale'>
        <DateLozenge value={new Date(image.last_sale.event_timestamp).getTime()} />
        {`${gweiToEth(image.last_sale.total_price).toFixed(6)} ${image.last_sale.payment_token.symbol} ($${toReadableFiat(gweiToEth(image.last_sale.total_price) * image.last_sale.payment_token.usd_price)})`}
      </Description>
    </Fragment>
};

export default render(<Macro app={<App />} />);