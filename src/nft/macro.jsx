import ForgeUI, {
  render,
  Macro,
  Image,
  Fragment,
  Heading,
  TagGroup, Tag,
  useState,
  useConfig,
} from '@forge/ui';
import BlockAPI from '../utils/blockchain-api';
import { fetch } from '@forge/api';

const App = () => {
  const config = useConfig();
  const [image] = useState(async () => {
    if (config == null || config.contract == null || config.tokenId == null)
      return {};

    const response = await BlockAPI.GetNFTAsset(config.contract, config.tokenId);
    return response;
  }, {});

  const [test] = useState(async () => {
    const response = await fetch('https://etherscan.io/tx/0x4c3ff2ecbd7f5634e88654473aa58afdbc6ba795e5d74c7e5431ae5f49cd3514');
    console.log(await response.text());
  });

  if (config == null || config.contract == null || config.tokenId == null)
    return null;

  if (config.settings == null || config.settings.indexOf('info') === -1)
    return <Image src={image.image_url} alt={image.name} size={config.size} />

  else
    return <Fragment>
      <Heading size="medium">{image.name}</Heading>
      <Image src={image.image_url} alt={image.name} size={config.size} />
      <TagGroup>
        {image.traits.map(o =>
          <Tag text={`${o.trait_type}: ${o.value}`} />
        )}
    </TagGroup>
    </Fragment>
};

export default render(<Macro app={<App />} />);