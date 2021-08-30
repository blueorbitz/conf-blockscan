import ForgeUI, {
  Fragment,
  render,
  MacroConfig,
  TextField,
  Select, Option,
  RadioGroup, Radio,
} from '@forge/ui';

const Config = () => {
  return (
    <Fragment>
      <TextField label='Contract Address' name='contract' />
      <TextField label='Token ID' name='tokenId' />
      <Select label='Size' name='size'>
        {['xsmall', 'small', 'medium', 'large', 'xlarge']
          .map(o => <Option label={o} value={o} />)}
      </Select>
      <RadioGroup name='display' label='Display Mode'>
        <Radio defaultChecked label='Image' value='image' />
        <Radio label='Info' value='info' />
      </RadioGroup>
    </Fragment>
  );
};

export default render(
  <MacroConfig>
    <Config />
  </MacroConfig>
);