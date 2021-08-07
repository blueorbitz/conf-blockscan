import ForgeUI, {
  render,
  Macro,
  Text,
  useConfig,
} from '@forge/ui';

const RenderStore = () => {
  return <Text>Hello Store</Text>;
}

const RenderAddress = () => {
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

const App = () => {
  return <RenderStrategy />;
};

export default render(<Macro app={<App />} />);